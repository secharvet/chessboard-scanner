/**
 * Fiche du coach : le CODE décide du contenu, le LLM ne sera plus que la voix.
 *
 * À partir de l'analyse (Stockfish + moteur de règles), on choisit UNE raison principale selon la
 * hiérarchie d'un entraîneur, puis on produit une fiche typée (pièces, propriétaires, cases, coups)
 * et un texte français écrit par des modèles de phrases — juste par construction :
 *   1. mat à parer   2. pièce en prise à sauver   3. menace à parer   4. gain de matériel
 *   5. ouverture : roque, développement, centre   6. ce que la meilleure ligne fait apparaître
 *
 * Propriétaires toujours relatifs à l'élève (« ton », « son ») : calculés depuis la couleur réelle.
 */

import { Chess } from 'chess.js';
import { buildAttackMap } from '../positional/attack-map.js';
import { buildAllFacts } from '../positional/index.js';
import { planSentence } from './plans.mjs';
import { topIntention } from './intentions.mjs';
import { renderToken } from '../positional/interpreter.js';
import { buildTacticalFacts } from '../positional/piece-attacks.js';
import { enToFr } from './notation.mjs';

const VALUE = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };
const NAME = { p: 'pion', n: 'cavalier', b: 'fou', r: 'tour', q: 'dame', k: 'roi' };
const FEM = { q: true, r: true };

/** « ton cavalier en e5 », « sa dame en d8 », « le pion adverse en d6 »… */
export function pieceRef(type, owner, square, { article = 'poss' } = {}) {
  const fem = FEM[type];
  if (article === 'poss') return `${owner === 'me' ? (fem ? 'ta' : 'ton') : (fem ? 'sa' : 'son')} ${NAME[type]} en ${square}`;
  return `${fem ? 'la' : 'le'} ${NAME[type]} ${owner === 'me' ? '' : 'adverse '}en ${square}`.replace('  ', ' ');
}
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const lowerFirst = (s) => (/^[A-ZÉ][a-zé]/.test(s) ? s.charAt(0).toLowerCase() + s.slice(1) : s);

/** Joue des coups UCI depuis `fen` ; renvoie les positions successives et les coups verbeux. */
function play(fen, uci) {
  const c = new Chess(fen);
  const steps = [];
  for (const u of uci) {
    try {
      const m = c.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] });
      steps.push({ move: m, fen: c.fen() });
    } catch { break; }
  }
  return steps;
}

function materialOf(fen, color) {
  let s = 0;
  for (const ch of fen.split(' ')[0]) {
    const t = ch.toLowerCase();
    if (VALUE[t] == null) continue;
    s += (ch === t ? -1 : 1) * VALUE[t];
  }
  return color === 'w' ? s : -s;
}

function evalSentence(e) {
  if (e.type === 'mate') return e.value > 0 ? `Tu as un mat en ${e.value} coup(s).` : `Attention : l'adversaire a un mat en ${-e.value} coup(s).`;
  const p = e.value / 100;
  const v = `${p > 0 ? '+' : ''}${p.toFixed(1).replace('.', ',')}`;
  const a = Math.abs(p);
  if (a < 0.4) return `La position est équilibrée (${v}).`;
  const tier = a < 1.2 ? 'un léger avantage' : a < 2.5 ? 'un net avantage' : 'un avantage décisif';
  return p > 0 ? `Tu as ${tier} (${v}).` : `L'adversaire a ${tier} (${v}).`;
}

/**
 * @param {any} data  `context.data` de buildCoachContext
 * @returns {{ items: any[], text: string, allowed: { squares: Set<string>, moves: Set<string>, pieces: Set<string> } }}
 */
export function buildBrief(data) {
  const me = data.player;
  const opp = me === 'w' ? 'b' : 'w';
  const c0 = data.candidates[0];
  const items = [];
  const pieces = new Set(); // « type|owner|case » cités par la fiche
  const note = (type, owner, square) => { pieces.add(`${type}|${owner}|${square}`); return pieceRef(type, owner, square); };
  const myTurn = data.toMove === me;
  const steps = play(data.fen, c0?.pvUci ?? []);
  const first = steps[0]?.move;
  const bestSan = c0?.move;

  items.push({ kind: 'eval', eval: c0?.evalPlayer });
  const sentences = [evalSentence(c0.evalPlayer)];

  // Au trait de l'adversaire : on dit seulement ce qu'il va probablement jouer et la réponse.
  if (!myTurn) {
    const reply = steps[1]?.move;
    items.push({ kind: 'their_move', move: bestSan, reply: reply && enToFr(reply.san) });
    sentences.push(`C'est à l'adversaire de jouer ; son meilleur coup est ${bestSan}${reply ? `, et tu répondrais alors ${enToFr(reply.san)}` : ''}.`);
    return finish(items, sentences, pieces, data);
  }

  const map = buildAttackMap(data.fen);
  const hanging = buildTacticalFacts(data.fen)
    .filter((t) => t.id === 'PIECE_MENACEE' && t.params.color === me)
    .map((t) => t.params)
    .sort((a, b) => VALUE[b.type] - VALUE[a.type]);
  const hangingAfter = steps[0]
    ? buildTacticalFacts(steps[0].fen).filter((t) => t.id === 'PIECE_MENACEE' && t.params.color === me).map((t) => t.params.square)
    : [];
  const gain = c0 ? (me === 'w' ? c0.material : -c0.material) : 0;

  let reason = null;
  // Un coup qui PREND et gagne gros (la dame aventurée en h5) : c'est la raison principale, même s'il
  // pare aussi un mat ou une menace — on le dit en second.
  if (first?.captured && gain >= 3) {
    pieces.add(`${first.captured}|opp|${first.to}`);
    const also = data.threat?.mates ? ` Et du même coup, il pare la menace de mat ${data.threat.move}.`
      : data.threat && (me === 'w' ? -data.threat.material : data.threat.material) >= 2 ? ` Et du même coup, il pare la menace ${data.threat.move}.` : '';
    reason = { kind: 'win', points: gain, move: bestSan, alsoParries: also ? data.threat.move : null };
    // Un gain qui ne tient que par une suite tactique (coup intermédiaire, clouage…) : on donne la suite.
    const tactical = (c0.motifs ?? []).some((m) => /intermédiaire|découverte|fourchette|clouage|enfilade|échec double|sacrifice|dévie/.test(m));
    const how = tactical ? ` Attention, le gain passe par une suite précise : ${c0.horizonSan}.` : '';
    sentences.push(`${bestSan} prend ${pieceRef(first.captured, 'opp', first.to)} : une fois les échanges terminés, tu as ${gain} point(s) de plus.${how}${also}`);
  }
  if (!reason && data.threat?.mates) {
    reason = { kind: 'parry_mate', threat: data.threat.move, move: bestSan };
    sentences.push(`Attention : si tu ne fais rien, l'adversaire joue ${data.threat.move} et te met échec et mat. Priorité absolue : ${bestSan} pare ce mat.`);
  }
  if (!reason && hanging.length) {
    const h = hanging[0];
    const newSquare = first && first.from === h.square ? first.to : h.square;
    const saved = !hangingAfter.includes(newSquare);
    if (saved) {
      const attackers = map.attackersOf(h.square, opp).sort((a, b) => VALUE[a.type] - VALUE[b.type]);
      const by = attackers[0] ? ` par ${pieceRef(attackers[0].type, 'opp', attackers[0].square, { article: 'def' })}` : '';
      if (attackers[0]) pieces.add(`${attackers[0].type}|opp|${attackers[0].square}`);
      reason = { kind: 'save', piece: { type: h.type, square: h.square }, attacker: attackers[0] && { type: attackers[0].type, square: attackers[0].square }, move: bestSan };
      const fem = FEM[h.type];
      sentences.push(`${cap(note(h.type, 'me', h.square))} est attaqué${fem ? 'e' : ''}${by}${h.defended ? '' : ` et n'est pas défendu${fem ? 'e' : ''}`}. Mets-${fem ? 'la' : 'le'} à l'abri : joue ${bestSan}.`);
    }
  }
  if (!reason && data.threat && (me === 'w' ? -data.threat.material : data.threat.material) >= 2) {
    const loss = Math.abs(data.threat.material);
    reason = { kind: 'parry', threat: data.threat.move, loss, move: bestSan };
    sentences.push(`L'adversaire menace ${data.threat.move}, qui te coûterait ${loss} point(s) de matériel. ${bestSan} pare cette menace.`);
  }
  if (!reason && gain >= 2 && first) {
    const cap1 = steps.find((s, i) => i % 2 === 0 && s.move.captured);
    const victim = cap1 ? ` : tu prends ${pieceRef(cap1.move.captured, 'opp', cap1.move.to, { article: 'poss' })}` : '';
    if (cap1) pieces.add(`${cap1.move.captured}|opp|${cap1.move.to}`);
    reason = { kind: 'win', points: gain, move: bestSan };
    sentences.push(`${bestSan} gagne du matériel${victim}. Une fois les échanges terminés, tu as ${gain} point(s) de plus.`);
  }
  if (!reason && first && data.phase === 'ouverture') {
    if (first.san.startsWith('O-O')) {
      reason = { kind: 'castle', move: bestSan };
      sentences.push(`Mets ton roi à l'abri : roque avec ${bestSan}.`);
    } else if ((first.piece === 'n' || first.piece === 'b') && (first.from[1] === '1' || first.from[1] === '8')) {
      reason = { kind: 'develop', piece: first.piece, move: bestSan };
      sentences.push(`Sors tes pièces : ${bestSan} développe ${note(first.piece, 'me', first.from)}, qui n'avait pas encore joué.`);
    } else if (first.piece === 'p' && ['d4', 'e4', 'd5', 'e5'].includes(first.to)) {
      reason = { kind: 'center', square: first.to, move: bestSan };
      sentences.push(`Prends le centre : ${bestSan} installe un pion sur la case centrale ${first.to}.`);
    }
  }
  if (!reason) {
    // Niveau 6 — le « pourquoi » d'un coup calme, entièrement calculé :
    //   (a) ce que fait le coup lui-même (cases centrales, pièce libérée) : faits du code ;
    //   (b) ce que sa suite fait apparaître de bon pour toi (typé, rendu par le moteur de règles).
    const why = [];
    for (const b of (c0.basics ?? []).slice(0, 2)) why.push(b);
    if (steps.length >= 2) {
      const end = steps[Math.min(steps.length, 4) - 1].fen;
      // Un pion qui avance reste le même pion : on l'identifie par sa colonne, pas par sa case.
      const key = (t) => (t.id.startsWith('PION_') && typeof t.params.square === 'string'
        ? `${t.id}|${t.params.color}|${t.params.square[0]}` : `${t.id}|${JSON.stringify(t.params)}`);
      const before = new Set(buildAllFacts(data.fen).map(key));
      // Par ordre d'importance pour expliquer un plan ; pas de « case faible » isolée (trop vague).
      const RANK = [
        ['TOUR_COLONNE_OUVERTE', me], ['CONTROLE_COLONNE', me], ['CAVALIER_AVANT_POSTE', me], ['PION_PASSE_PROTEGE', me],
        ['PION_PASSE', me], ['ROI_AU_CENTRE', opp], ['PIONS_ROI_AFFAIBLI', opp], ['PION_FAIBLE', opp], ['PION_ISOLE', opp],
        ['PION_ARRIERE', opp], ['DOUBLON', opp], ['AVANT_POSTE', me], ['CONTROLE_CENTRE', me], ['AVANTAGE_ESPACE', me],
        ['ACTIVITE', me], ['PAIRE_FOUS', me],
      ];
      const rank = (t) => RANK.findIndex(([id, c]) => id === t.id && t.params.color === c);
      const fresh = buildAllFacts(end).filter((t) => !before.has(key(t)) && rank(t) >= 0)
        .sort((x, y) => rank(x) - rank(y)).slice(0, 2);
      if (fresh.length) reason = { kind: 'plan', tokens: fresh, move: bestSan };
      for (const t of fresh) why.push(`dans la suite, ${lowerFirst(renderToken(t).replace(/\.$/, ''))}`);
    }
    if (why.length) {
      reason ??= { kind: 'basics', move: bestSan };
      sentences.push(`Le meilleur coup est ${bestSan} : ${why.join(' ; ')}.`);
    } else {
      reason = { kind: 'best', move: bestSan };
      sentences.push(`Le meilleur coup du moteur est ${bestSan}.`);
      // Pas de raison concrète : le plan général de la structure reconnue (théorie écrite par nous).
      const st = data.structures?.[0];
      // Le plan de l'ÉLÈVE : celui marqué « (toi) » (le camp qui a la structure ou l'autre camp).
      const mine = st?.plans?.find((x) => /\((?:toi|you)\)/.test(String(x))) ?? (st?.label?.startsWith('roques opposés') ? st.plans[0] : null);
      if (mine) {
        const plan = String(mine).replace(/^[^:]*:\s*/, '').split(/(?<=\.)\s/)[0];
        items.push({ kind: 'structure', label: st.label, plan });
        sentences.push(`Idée générale (${st.label}) : ${plan}`);
      }
    }
  }
  items.push({ ...reason, kind: 'reason', type: reason.kind });

  // Position calme : un PLAN en 2-3 étapes. D'abord le plan VÉRIFIÉ par le moteur (coach/plans.mjs : le concept
  // apparaît dans sa meilleure suite et pas dans les autres), puis les étapes construites par le code.
  const verified = data.plans?.[me]?.[0] ?? null;
  if (['develop', 'center', 'castle', 'plan', 'basics', 'best'].includes(reason.kind)) {
    let first = null;
    if (verified) {
      items.push({ kind: 'plan_verified', ...verified });
      for (const [t, o, sq] of verified.pieceRefs) pieces.add(`${t}|${o === me ? 'me' : 'opp'}|${sq}`);
      first = planSentence(verified, 'me');
    }
    const steps3 = [first, ...planSteps(data, me, opp, pieces, items, { skipRook: verified?.concept === 'tour_colonne', verifiedTo: verified?.to ?? null })].filter(Boolean).slice(0, 3);
    if (steps3.length) {
      items.push({ kind: 'plan_steps', steps: steps3 });
      const [s1, s2, s3] = steps3;
      sentences.push(`Ton plan${verified ? ' (vérifié dans la meilleure suite du moteur)' : ''} : ${s1}${s2 ? `, ensuite ${s2}` : ''}${s3 ? `, et ${s3}` : ''}.`);
    }
    // Intention (modèles sur les plans humains) : ce que les joueurs de ce niveau entreprennent ici. Une tendance,
    // dite comme telle, jamais comme un conseil vérifié ; tue si c'est déjà le plan vérifié.
    const mine = topIntention(data.intentions?.[me], { exclude: verified ? [verified.concept] : [] });
    if (mine) {
      items.push({ kind: 'intention', concept: mine.concept, p: mine.p });
      sentences.push(`À ton niveau, dans ce genre de position, les joueurs entreprennent souvent : ${INTENT[mine.concept] ?? mine.concept}.`);
    }
  }

  // Coups qui se valent (écart ≤ 0,3).
  const close = data.candidates.slice(1).filter((c) => c.evalPlayer.type === 'cp' && c0.evalPlayer.type === 'cp'
    && c0.evalPlayer.value - c.evalPlayer.value <= 30).map((c) => c.move);
  if (close.length) {
    items.push({ kind: 'alternatives', moves: close });
    sentences.push(`${close.join(' ou ')} ${close.length > 1 ? 'se valent' : 'se vaut'} presque.`);
  }

  // Comparaison : un candidat nettement moins bon qui coûte du matériel (lu dans SA ligne).
  const worse = data.candidates.slice(1).find((c) => c.evalPlayer.type === 'cp' && c0.evalPlayer.type === 'cp'
    && c0.evalPlayer.value - c.evalPlayer.value >= 60 && (me === 'w' ? c.material : -c.material) <= -1);
  if (worse) {
    const lost = Math.abs(worse.material);
    items.push({ kind: 'avoid', move: worse.move, loss: lost });
    sentences.push(`Évite ${worse.move} : dans sa suite, tu perds ${lost} point(s) de matériel.`);
  }

  // À surveiller : la première idée adverse (déjà nommée par le détecteur), sans chiffre Stockfish.
  const p0 = data.prepared?.[0];
  const his = data.plans?.[opp]?.[0] ?? null;
  if (reason.kind !== 'parry' && reason.kind !== 'parry_mate' && (p0 || his)) {
    const parts = [];
    if (p0) parts.push(p0.text.replace(/\s*\(Stockfish[^)]*\)\)?/, '').replace(/ \((?:pion|cavalier|fou|tour|dame|roi|roque)\)/g, ''));
    // Ce qu'il prépare probablement, d'après les plans humains (proposition, pas vérification).
    const hisIntent = his ? null : topIntention(data.intentions?.[opp], { min: 0.55, margin: 0.15 });
    if (hisIntent) {
      items.push({ kind: 'opp_intention', concept: hisIntent.concept, p: hisIntent.p });
      parts.push(`à son niveau, il prépare souvent ${INTENT_OPP[hisIntent.concept] ?? hisIntent.concept}`);
    }
    // Le plan de l'adversaire, vérifié dans SA meilleure suite : la base de la prophylaxie.
    if (his) {
      items.push({ kind: 'opp_plan', ...his });
      for (const [t, o, sq] of his.pieceRefs) pieces.add(`${t}|${o === me ? 'me' : 'opp'}|${sq}`);
      const s = planSentence(his, 'opp');
      parts.push(`son plan est ${/^[aeiouyéèêh]/i.test(s) ? "d'" : 'de '}${s}`);
    }
    items.push({ kind: 'watch', text: parts.join(' ; ') });
    sentences.push(`À surveiller : ${parts.join(' ; ')}.`);
  }
  return finish(items, sentences, pieces, data);
}

/**
 * Étapes d'un plan, du plus concret au plus général. Tout est typé ou écrit par nous :
 *   manœuvre sûre (de préférence amorcée par une ligne du moteur) → colonne pour une tour →
 *   cible (faiblesse adverse) → idée de la structure de pions.
 */
/** Noms des plans pour les phrases d'intention (tutoiement pour l'élève, tournure neutre pour l'adversaire). */
const INTENT = {
  tour_colonne: 'mettre une tour sur la colonne ouverte', cavalier_avant_poste: 'installer un cavalier sur un avant-poste',
  blocage: 'bloquer un pion faible adverse', rupture: 'préparer une rupture de pions', affaiblir: 'affaiblir la structure adverse',
  dominer: 'échanger le fou adverse pour dominer une couleur de cases', attaque_minorite: 'lancer une attaque de minorité',
  baionnette: 'pousser h4-h5 contre le fianchetto',
};
const INTENT_OPP = {
  tour_colonne: 'une tour sur la colonne ouverte', cavalier_avant_poste: 'un cavalier sur un avant-poste',
  blocage: 'le blocage d\'un de tes pions faibles', rupture: 'une rupture de pions', affaiblir: 'un affaiblissement de ta structure',
  dominer: 'l\'échange de ton fou pour dominer une couleur', attaque_minorite: 'une attaque de minorité', baionnette: 'la poussée h4-h5 contre ton fianchetto',
};

function planSteps(data, me, opp, pieces, items, { skipRook = false, verifiedTo = null } = {}) {
  const out = [];
  const board = new Chess(data.fen);
  const inLines = (m) => data.candidates.some((c) => (c.pvUci ?? []).some((u) => u.slice(0, 4) === m.path[0] + m.path[1]));
  // Seulement une manœuvre dont le premier pas figure dans une ligne du moteur (sinon ce n'est pas un plan sûr),
  // et pas celle que le plan vérifié vient déjà de dire (même case d'arrivée).
  const man = (data.maneuvers ?? []).find((m) => inLines(m) && m.to !== verifiedTo);
  let rookPlanned = skipRook;
  if (man) {
    const type = board.get(man.from)?.type;
    if (type) {
      pieces.add(`${type}|me|${man.from}`);
      rookPlanned = type === 'r';
      out.push(`amène ${FEM[type] ? 'ta' : 'ton'} ${NAME[type]} de ${man.from} vers ${man.to} (${man.why}), par ${man.path.join('-')}`);
    }
  }
  const facts = buildAllFacts(data.fen);
  if (!rookPlanned && board.board().flat().some((p) => p && p.type === 'r' && p.color === me)) {
    const file = facts.find((t) => (t.id === 'COLONNE_OUVERTE' || (t.id === 'COLONNE_SEMI_OUVERTE' && t.params.color === me))
      && !board.board().flat().some((p) => p && p.type === 'r' && p.color === me && p.square[0] === String(t.params.file)));
    if (file) out.push(`place une tour sur la colonne ${file.params.file} ${file.id === 'COLONNE_OUVERTE' ? 'ouverte' : 'semi-ouverte'}`);
  }
  const TARGET = { PION_FAIBLE: 'faible', PION_ISOLE: 'isolé', PION_ARRIERE: 'arriéré' };
  const target = facts.find((t) => TARGET[t.id] && t.params.color === opp);
  if (target) {
    pieces.add(`p|opp|${target.params.square}`);
    out.push(`vise le pion ${TARGET[target.id]} adverse en ${target.params.square}`);
  } else if (facts.some((t) => t.id === 'ROI_AU_CENTRE' && t.params.color === opp)) {
    out.push('vise son roi resté au centre en ouvrant le jeu');
  }
  // Finale : le roi devient une pièce d'attaque, et une majorité de pions crée un pion passé.
  if (data.phase === 'finale') {
    const king = board.board().flat().find((p) => p && p.type === 'k' && p.color === me);
    const central = king && 'cdef'.includes(king.square[0]) && '3456'.includes(king.square[1]);
    if (king && !central) { pieces.add(`k|me|${king.square}`); out.push(`active ton roi (en ${king.square}) vers le centre`); }
    // Une vraie majorité (au moins deux pions contre un) et pas déjà de pion passé : sinon, rien à « créer ».
    const hasPassed = facts.some((t) => (t.id === 'PION_PASSE' || t.id === 'PION_PASSE_PROTEGE') && t.params.color === me);
    const count = (color, files) => board.board().flat().filter((p) => p && p.type === 'p' && p.color === color && files.includes(p.square[0])).length;
    const maj = hasPassed ? null : facts.find((t) => {
      if (!((t.id === 'MAJORITE_AILE_DAME' || t.id === 'MAJORITE_AILE_ROI') && t.params.color === me)) return false;
      const files = t.id === 'MAJORITE_AILE_DAME' ? 'abcd' : 'efgh';
      return count(me, files) >= 2 && count(me, files) > count(opp, files);
    });
    if (maj) out.push(`avance ta majorité de pions à l'aile ${maj.id === 'MAJORITE_AILE_DAME' ? 'dame' : 'roi'} pour créer un pion passé`);
  }
  const st = data.structures?.[0];
  const mine = st?.plans?.find((x) => /\((?:toi|you)\)/.test(String(x)));
  if (out.length < 3 && mine && !items.some((x) => x.kind === 'structure')) {
    const idea = String(mine).replace(/^[^:]*:\s*/, '').split(/(?<=\.)\s/)[0].replace(/\.$/, '');
    out.push(`garde en tête l'idée de la structure (${st.label.replace(/ — .*/, '')}) : ${lowerFirst(idea)}`);
  }
  return out.slice(0, 3);
}

function finish(items, sentences, pieces, data) {
  const text = sentences.join(' ');
  const squares = new Set(text.match(/(?<![a-zA-Z])[a-h][1-8](?![0-9])/g) ?? []);
  const moves = new Set(text.match(/(?<![\w-])(?:O-O(?:-O)?|[RDTFC]?[a-h]?[1-8]?x?[a-h][1-8](?:=[DTFC])?[+#]?)(?![\w])/g) ?? []);
  return { items, text, allowed: { squares, moves, pieces }, player: data.player, fen: data.fen };
}

// ── Reformulation par le LLM : la voix seulement, contrôlée exactement ──

export const REPHRASE_SYSTEM = `Tu es la voix d'un coach d'échecs pour débutants. On te donne un texte déjà juste, écrit par un programme.
Réécris-le pour qu'il sonne naturel et pédagogique (tutoiement, phrases simples, 110 mots maximum).
Interdictions absolues :
- n'ajoute AUCUNE information : aucun coup, aucune case, aucune pièce, aucune idée qui ne soit dans le texte ;
- ne change aucun coup ni aucune case (recopie-les exactement, en notation française) ;
- ne change jamais à qui appartient une pièce (« ton », « ta », « son », « sa », « adverse ») ;
- n'explique rien de plus que le texte : tu peux seulement reformuler, réordonner et expliquer un mot technique en termes simples.
Garde ce format : **Évaluation** — … **L'idée** — … **Coup conseillé** — … et **Attention** — … seulement si le texte contient « À surveiller » ou « Attention ».`;

const PIECE_RE = /\b(ton|ta|tes|son|sa|ses|leur|leurs)\s+(pions?|cavaliers?|fous?|tours?|dames?|rois?)\b(?:\s+(blanc|blanche|blancs|blanches|noir|noire|noirs|noires))?(?:\s+(?:en|sur|de|du|à))?\s+([a-h][1-8])/gi;
const TYPE = { pion: 'p', cavalier: 'n', fou: 'b', tour: 'r', dame: 'q', roi: 'k' };

/**
 * Contrôle exact d'une reformulation : cases et coups inclus dans ceux de la fiche ; chaque pièce
 * désignée avec un propriétaire (« ton cavalier en e5 ») doit l'être correctement sur l'échiquier
 * (position actuelle ou le long de la meilleure ligne).
 * @returns {string[]} problèmes
 */
export function checkRephrase(text, brief, data) {
  const problems = [];
  for (const sq of new Set(text.match(/(?<![a-zA-Z])[a-h][1-8](?![0-9])/g) ?? [])) {
    if (!brief.allowed.squares.has(sq)) problems.push(`case ${sq} absente de la fiche`);
  }
  for (const mv of new Set(text.match(/(?<![\w-])(?:O-O(?:-O)?|[RDTFC][a-h]?[1-8]?x?[a-h][1-8](?:=[DTFC])?[+#]?|[a-h]x[a-h][1-8][+#]?)(?![\w])/g) ?? [])) {
    if (!brief.allowed.moves.has(mv) && !brief.allowed.moves.has(mv.replace(/[+#]$/, ''))) problems.push(`coup ${mv} absent de la fiche`);
  }
  // La section « Coup conseillé » doit commencer par LE coup de la fiche, pas par une alternative.
  const best = brief.items.find((x) => x.kind === 'reason')?.move;
  const section = text.match(/\*\*Coup conseillé\*\*\s*[—:-]\s*([^\n]*)/)?.[1];
  if (best && section) {
    const firstMove = section.match(/(?<![\w-])(?:O-O(?:-O)?|[RDTFC]?[a-h]?[1-8]?x?[a-h][1-8](?:=[DTFC])?)(?![\w])/)?.[0];
    if (firstMove && firstMove !== best.replace(/[+#]$/, '')) problems.push(`« Coup conseillé » doit commencer par ${best}, pas par ${firstMove}`);
  }
  // Positions où une pièce peut légitimement se trouver : maintenant et le long de la meilleure ligne.
  const boards = [new Chess(data.fen)];
  for (const s of play(data.fen, data.candidates[0]?.pvUci ?? [])) boards.push(new Chess(s.fen));
  const me = data.player;
  for (const m of text.matchAll(PIECE_RE)) {
    const poss = m[1].toLowerCase();
    const owner = /^t/.test(poss) ? me : (me === 'w' ? 'b' : 'w');
    const type = TYPE[m[2].toLowerCase().replace(/s$/, '')];
    const colorWord = m[3]?.toLowerCase();
    const sq = m[4];
    if (colorWord && (colorWord.startsWith('blanc') ? 'w' : 'b') !== owner) {
      problems.push(`« ${m[0]} » : possessif et couleur se contredisent`);
      continue;
    }
    const seen = boards.map((b) => b.get(sq)).filter((p) => p && p.type === type);
    if (seen.length && !seen.some((p) => p.color === owner)) problems.push(`« ${m[0]} » : cette pièce n'appartient pas à ${owner === me ? "l'élève" : "l'adversaire"}`);
  }
  return problems;
}
