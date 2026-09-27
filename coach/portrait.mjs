/**
 * Portrait d'un joueur à partir de ses parties (Lichess ou PGN) :
 * style (axe tranchant ↔ sûr validé), précision par phase, erreurs récurrentes (cause et motif
 * qui les a punies), gestion du temps (%clk), répertoire. Chaque chiffre devient un fait numéroté
 * que le LLM doit citer, vérifié comme les réponses du coach.
 */

import { Chess } from 'chess.js';
import { aggregate, profileGame, splitPgn } from './profile.mjs';
import { diagnoseMistake } from './diagnose.mjs';
import { punishmentTags } from './memory.mjs';
import { detectPhase } from '../positional/index.js';
import { toFrenchSan } from './notation.mjs';
import { identifyOpening } from './openings.mjs';

const UA = 'chessboard-scanner/1.0 (coach d\'échecs ; contact via GitHub secharvet)';
/** Traits validés sur l'axe tranchant ↔ sûr (cf. docs/ARCHITECTURE.md §8 bis), avec leur sens. */
export const AXIS = { menaces: 1, echecs: 1, sacrifices: 1, sacrifices_sains: 1, reactions: 1, options_adverses: 1 };

/**
 * Parties récentes d'un joueur Lichess (PGN), en respectant la limite de débit (429 → 60 s).
 * @param {string} user
 */
export async function fetchLichessGames(user, { max = 20, perf = 'blitz,rapid,classical' } = {}) {
  const url = `https://lichess.org/api/games/user/${encodeURIComponent(user)}?max=${max}&rated=true&perfType=${perf}&clocks=true&opening=true`;
  for (let attempt = 0; attempt < 3; attempt++) {
    const res = await fetch(url, { headers: { Accept: 'application/x-chess-pgn', 'User-Agent': UA } });
    if (res.status === 429) {
      console.error('[lichess] limite de débit : attente de 60 s (règle de Lichess)');
      await new Promise((r) => setTimeout(r, 61_000));
      continue;
    }
    if (!res.ok) throw new Error(`Lichess HTTP ${res.status} pour ${user}`);
    return res.text();
  }
  throw new Error('Lichess : limite de débit persistante');
}

/** Pendule restante (secondes) après chaque demi-coup, lue dans les commentaires %clk. */
function clocks(pgnChunk) {
  return [...pgnChunk.matchAll(/\[%clk (\d+):(\d+):(\d+(?:\.\d+)?)\]/g)].map((m) => Number(m[1]) * 3600 + Number(m[2]) * 60 + Number(m[3]));
}

const toCp = (s) => (s.type === 'mate' ? (s.value > 0 ? 10000 - s.value : -10000 - s.value) : s.value);

/**
 * Analyse complète.
 * @param {string} pgnText  parties (PGN multi-parties)
 * @param {string} user     nom du joueur (tel qu'il apparaît dans White/Black)
 * @param {{ analyze: Function }} engine
 * @param {{ depth?: number, onGame?: (i: number, n: number) => void }} [opts]
 */
export async function analyzePlayer(pgnText, user, engine, opts = {}) {
  const depth = opts.depth ?? 12;
  const chunks = pgnText.split(/\n(?=\[Event )/).filter((c) => c.trim());
  const games = splitPgn(pgnText).map((g, i) => ({ ...g, chunk: chunks[i] ?? '' }));
  const lower = user.toLowerCase();

  const phases = { ouverture: { loss: 0, n: 0 }, milieu: { loss: 0, n: 0 }, finale: { loss: 0, n: 0 } };
  const mistakes = [];
  const openings = {};
  const styleGames = [];
  let zeitnotMistakes = 0;
  let zeitnotMoves = 0;
  let scored = 0;

  for (const [gi, g] of games.entries()) {
    opts.onGame?.(gi + 1, games.length);
    // Pseudo Lichess exact, ou nom contenu (fichiers PGN : « Karpov, Anatoly »).
    const is = (name) => { const x = (name ?? '').toLowerCase(); return x === lower || x.includes(lower); };
    const color = is(g.tags.White) ? 'w' : is(g.tags.Black) ? 'b' : null;
    if (!color || g.sans.length < 20) continue;
    scored++;

    // Répertoire : résultat par ouverture (famille avant « : »).
    // Nom d'ouverture : reconnu à partir des coups (liste lichess-org/chess-openings), sinon étiquette PGN.
    const known = identifyOpening(g.sans);
    const family = (known?.name ?? g.tags.Opening ?? (g.tags.ECO ? `ECO ${g.tags.ECO}` : 'Inconnue')).split(':')[0].trim();
    const res = g.tags.Result === '1/2-1/2' ? 0.5 : (g.tags.Result === '1-0') === (color === 'w') ? 1 : 0;
    openings[family] ??= { games: 0, points: 0, color: { w: 0, b: 0 } };
    openings[family].games++;
    openings[family].points += res;
    openings[family].color[color]++;

    styleGames.push(await profileGame(g.sans, color));

    // Précision coup par coup (une évaluation par position, réutilisée avant/après).
    const clk = clocks(g.chunk);
    const initial = clk[0] ?? null;
    const c = new Chess();
    let prevEval = null;
    const evalAt = async (fen) => {
      const b = new Chess(fen);
      if (b.isCheckmate()) return -10000; // point de vue du camp au trait
      if (b.isDraw()) return 0;
      const [l] = await engine.analyze(fen, { depth, multipv: 1 });
      return l ? toCp(l.score) : 0;
    };
    for (let i = 0; i < g.sans.length; i++) {
      const before = c.fen();
      const mover = c.turn();
      const e0 = prevEval ?? (await evalAt(before));
      const m = c.move(g.sans[i]);
      const after = c.fen();
      const e1 = await evalAt(after);
      prevEval = e1;
      if (mover !== color) continue;
      const loss = Math.max(0, Math.min(1000, e0 + e1)); // e1 est du point de vue adverse
      const phase = detectPhase(before);
      phases[phase].loss += loss;
      phases[phase].n++;
      const remaining = clk[i] ?? null;
      const zeitnot = remaining != null && initial != null && (remaining < 60 || remaining < initial * 0.1);
      if (zeitnot) zeitnotMoves++;
      if (loss >= 150 && e0 > -500) { // erreurs réelles, hors positions déjà perdues
        if (zeitnot) zeitnotMistakes++;
        const d = await diagnoseMistake(engine, before, after, { san: m.san, alerted: false });
        mistakes.push({
          game: gi + 1, move: Math.ceil((i + 1) / 2), san: toFrenchSan(m.san), loss, phase, zeitnot,
          cause: d.cause, punishment: punishmentTags(after, d.refutationUci ?? []), refutation: d.text.split('réfutation Stockfish : ')[1] ?? '',
          url: g.tags.Site ?? '',
        });
      }
    }
  }

  // Motifs et causes récurrents.
  const count = (arr) => arr.reduce((acc, k) => ({ ...acc, [k]: (acc[k] ?? 0) + 1 }), {});
  const style = aggregate(styleGames);
  return {
    user, games: scored,
    phases: Object.fromEntries(Object.entries(phases).map(([k, v]) => [k, { acpl: v.n ? Math.round(v.loss / v.n) : null, moves: v.n }])),
    mistakes,
    byCause: count(mistakes.map((m) => m.cause)),
    byPunishment: count(mistakes.flatMap((m) => (m.punishment.length ? m.punishment : ['positionnel']))),
    byPhase: count(mistakes.map((m) => m.phase)),
    zeitnot: { moves: zeitnotMoves, mistakes: zeitnotMistakes },
    openings,
    style,
  };
}

/**
 * Indice sur l'axe tranchant ↔ sûr, relatif à une référence (moyenne et écart des profils fournis).
 * @param {object} style  sortie de aggregate()
 * @param {object[]} references  sorties de aggregate() (ex. les 8 grands maîtres de la validation)
 */
export function axisIndex(style, references) {
  let sum = 0;
  let n = 0;
  for (const k of Object.keys(AXIS)) {
    const vals = references.map((r) => r.traits[k]?.mean).filter(Number.isFinite);
    const x = style.traits[k]?.mean;
    if (vals.length < 2 || !Number.isFinite(x)) continue;
    const m = vals.reduce((a, b) => a + b, 0) / vals.length;
    const sd = Math.sqrt(vals.reduce((a, b) => a + (b - m) ** 2, 0) / (vals.length - 1)) || 1;
    sum += ((x - m) / sd) * AXIS[k];
    n++;
  }
  return n ? sum / n : null;
}

const CAUSE_LABEL = {
  AVERTI: 'averti mais a joué quand même',
  LISTÉE: 'menace visible mais ignorée',
  'PAS VU (coup calme)': 'coup calme adverse non vu',
  'PAS VU (coup calme puis tactique)': 'combinaison à coup d\'attente non vue',
  'PAS VU (tactique profonde)': 'tactique trop profonde',
  INCONNU: 'indéterminée',
};

/**
 * Faits numérotés (à citer) à partir de l'analyse.
 * @returns {Record<string, string>}
 */
export function portraitFacts(a, index) {
  const f = {};
  let n = 0;
  const add = (text) => { f[`F${++n}`] = text; };
  add(`Parties analysées : ${a.games} (${a.style.moves} coups hors ouverture pour le style).`);
  if (index != null) {
    add(`Indice « jeu tranchant ↔ jeu sûr » : ${index >= 0 ? '+' : ''}${index.toFixed(2)} (0 = moyenne de 8 grands maîtres de référence ; positif = plus tranchant, comme Tal ou Shirov ; négatif = plus sûr, comme Karpov ou Andersson).`);
  }
  const t = a.style.traits;
  add(`Menaces créées : ${t.menaces.mean.toFixed(1)} coups sur 100 ; sacrifices : ${t.sacrifices.mean.toFixed(1)} pour 100 coups ; options tactiques laissées à l'adversaire : ${t.options_adverses.mean.toFixed(2)} par coup.`);
  for (const [ph, v] of Object.entries(a.phases)) {
    if (v.acpl != null) add(`Précision en ${ph} : perte moyenne ${v.acpl} centipions par coup (${v.moves} coups).`);
  }
  add(`Erreurs (perte ≥ 1,5 pion, hors positions déjà perdues) : ${a.mistakes.length} au total ; par phase : ${Object.entries(a.byPhase).map(([k, v]) => `${k} ${v}`).join(', ') || 'aucune'}.`);
  for (const [cause, k] of Object.entries(a.byCause).sort((x, y) => y[1] - x[1])) {
    add(`Cause d'erreur « ${CAUSE_LABEL[cause] ?? cause} » : ${k} fois.`);
  }
  for (const [motif, k] of Object.entries(a.byPunishment).sort((x, y) => y[1] - x[1]).slice(0, 5)) {
    add(`Erreurs punies par le motif « ${motif} » : ${k} fois.`);
  }
  if (a.zeitnot.moves) add(`Zeitnot (moins de 60 s ou de 10 % du temps) : ${a.zeitnot.moves} coups joués, dont ${a.zeitnot.mistakes} erreurs.`);
  for (const [name, o] of Object.entries(a.openings).sort((x, y) => y[1].games - x[1].games).slice(0, 5)) {
    add(`Ouverture « ${name} » : ${o.games} parties, score ${Math.round((100 * o.points) / o.games)} % (Blancs ${o.color.w}, Noirs ${o.color.b}).`);
  }
  for (const m of [...a.mistakes].sort((x, y) => y.loss - x.loss).slice(0, 3)) {
    add(`Exemple d'erreur : partie ${m.game}, coup ${m.move}. ${m.san} (−${(m.loss / 100).toFixed(1)} pion, ${m.phase}${m.zeitnot ? ', en zeitnot' : ''}) — cause : ${CAUSE_LABEL[m.cause] ?? m.cause} ; réfutation : ${m.refutation}${m.url ? ` (${m.url})` : ''}.`);
  }
  return f;
}

export const PORTRAIT_SYSTEM = `Tu es un entraîneur d'échecs francophone. Tu écris le PORTRAIT d'un joueur de club à partir de faits mesurés sur ses parties (fournis et numérotés).
Règles : tu ne calcules rien ; chaque phrase qui contient un chiffre, un motif, une ouverture ou un trait de style se termine par ses sources, par ex. [F3] ou [F2][F5] ; n'invente rien qui ne figure pas dans les faits ; si un point manque de données, dis-le.
Sois bienveillant mais franc, concret, sans jargon inutile.
Format (Markdown, 300 mots maximum) :
**Ton style** — 2 à 3 phrases (axe tranchant ↔ sûr, avec nuance).
**Tes points forts** — 2 puces.
**Ce qui te coûte des points** — 3 puces au plus, les plus fréquentes d'abord (phase, cause, motif, temps).
**Ton répertoire** — 1 à 2 phrases.
**Trois axes d'entraînement** — 3 puces concrètes et actionnables, chacune reliée à un fait.`;
