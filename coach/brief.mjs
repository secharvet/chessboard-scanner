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
import { compatibleWithLines, concreteIntention, topIntention } from './intentions.mjs';
import { renderToken } from '../positional/interpreter.js';
import { buildTacticalFacts } from '../positional/piece-attacks.js';
import { enToFr } from './notation.mjs';
import { moveEffects } from './move-class.mjs';

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
const lowerFirst = (s) => (/^[A-ZÉ]['’a-zé]/.test(s) ? s.charAt(0).toLowerCase() + s.slice(1) : s);

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

/** Suit une pièce le long d'une ligne : sa case à la fin, ou null si elle est prise en route. */
function trackPiece(steps, square, maxPlies = 10) {
  let sq = square;
  for (const s of steps.slice(0, maxPlies)) {
    const m = s.move;
    if (m.to === sq && m.from !== sq) return null;
    if (m.from === sq) sq = m.to;
  }
  return sq;
}

/** Échange statique : ce que le camp au trait gagne au mieux en prenant sur `square` (0 = mieux vaut ne pas prendre). */
function staticExchange(fen, square, depth = 0) {
  if (depth > 10) return 0;
  const c = new Chess(fen);
  const target = c.get(square);
  if (!target) return 0;
  const caps = c.moves({ verbose: true }).filter((m) => m.to === square).sort((a, b) => VALUE[a.piece] - VALUE[b.piece]);
  if (!caps.length) return 0;
  c.move(caps[0].san);
  return Math.max(0, VALUE[target.type] - staticExchange(c.fen(), square, depth + 1));
}

/** Ce que le camp au trait gagne (ou perd, valeur négative) s'il PREND sur `square` avec sa pièce la moins chère ; null s'il ne peut pas. */
function exchangeIfTaken(fen, square) {
  const c = new Chess(fen);
  const target = c.get(square);
  if (!target) return null;
  const caps = c.moves({ verbose: true }).filter((m) => m.to === square).sort((a, b) => VALUE[a.piece] - VALUE[b.piece]);
  if (!caps.length) return null;
  c.move(caps[0].san);
  return VALUE[target.type] - staticExchange(c.fen(), square);
}

/**
 * La menace est-elle exécutée quand même dans la ligne ? On regarde ses PRISES (…Te8 puis Txe4+ : la menace, c'est
 * Txe4+, pas Te8) : si l'adversaire joue l'une d'elles dans la meilleure ligne, le coup conseillé ne l'a pas parée.
 */
function threatExecuted(threat, steps, fen, maxPlies = 8) {
  const pv = threat?.pvUci ?? [];
  if (!pv.length) return false;
  const parts = fen.split(' ');
  parts[1] = parts[1] === 'w' ? 'b' : 'w';
  parts[3] = '-';
  // Seule LA menace compte (son premier coup), pas les autres prises de sa ligne : banc du 4 octobre, fiche 42,
  // « Fxh6 ne l'empêche pas » alors que Fxh6 prend le fou qui menaçait Fxc1 ; c'est dxc3, plus loin, qui s'exécutait.
  const captures = new Set(play(parts.join(' '), pv.slice(0, 1)).filter((s) => s.move.captured).map((s) => s.move.from + s.move.to));
  if (!captures.size) return false;
  return steps.slice(0, maxPlies).some((s, i) => i % 2 === 1 && captures.has(s.move.from + s.move.to));
}

/** Un texte de structure (« f4-f5 », « c4-c5, b4 ») n'est gardé que si un de mes coups de la ligne va sur une de ses cases. */
function structureProven(idea, steps) {
  const squares = [...String(idea).matchAll(/\b([a-h][1-8])\b/g)].map((m) => m[1]);
  if (!squares.length) return false;
  return steps.some((s, i) => i % 2 === 0 && squares.includes(s.move.to));
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
  // Deux textes : la fiche complète (avec le coup) et l'IDÉE (sans le coup), montrée par défaut ; le coup est derrière
  // des indices par paliers (décision du 30 septembre : donner le coup revient à faire rejouer Stockfish).
  // say(complet, idée) : idée === undefined → même phrase ; idée === null → rien dans l'idée.
  const idea = [sentences[0]];
  const say = (full, hidden) => { sentences.push(full); if (hidden !== null) idea.push(hidden === undefined ? full : hidden); };

  // Au trait de l'adversaire : on dit seulement ce qu'il va probablement jouer et la réponse.
  if (!myTurn) {
    const reply = steps[1]?.move;
    items.push({ kind: 'their_move', move: bestSan, reply: reply && enToFr(reply.san) });
    say(`C'est à l'adversaire de jouer ; son meilleur coup est ${bestSan}${reply ? `, et tu répondrais alors ${enToFr(reply.san)}` : ''}.`);
    return finish(items, sentences, pieces, data, idea, []);
  }

  // En échec : on le dit d'abord (cas réel du 30 septembre, …Dh4+ : « Rf1 prépare un gain » sans dire qu'il est forcé).
  const board0 = new Chess(data.fen);
  if (board0.inCheck()) {
    const k = board0.board().flat().find((q) => q && q.type === 'k' && q.color === me);
    const by = k ? board0.attackers(k.square, opp).map((sq) => ({ square: sq, type: board0.get(sq).type })) : [];
    for (const b of by) pieces.add(`${b.type}|opp|${b.square}`);
    say(`Tu es en échec${by[0] ? ` : ${pieceRef(by[0].type, 'opp', by[0].square, { article: 'def' })} attaque ton roi` : ''}. Commence par parer l'échec.`);
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
    say(`${bestSan} prend ${pieceRef(first.captured, 'opp', first.to)} : une fois les échanges terminés, tu as ${gain} point(s) de plus.${how}${also}`,
      `Tu peux gagner du matériel : ${pieceRef(first.captured, 'opp', first.to)} est prenable. Une fois les échanges terminés, tu aurais ${gain} point(s) de plus.`);
  }
  if (!reason && data.threat?.mates) {
    // Tous mes coups de la ligne sont des échecs et l'évaluation est nulle : c'est un échec perpétuel, pas une parade
    // (banc #22 : « Dh5+ pare ce mat » alors que la partie est nulle par répétition).
    const perpetual = steps.length >= 2 && steps.every((s, i) => i % 2 === 1 || s.move.san.includes('+'))
      && c0.evalPlayer.type === 'cp' && Math.abs(c0.evalPlayer.value) <= 30;
    reason = { kind: 'parry_mate', threat: data.threat.move, move: bestSan, perpetual };
    say(perpetual
      ? `Attention : si tu ne fais rien, l'adversaire joue ${data.threat.move} et te met échec et mat. ${bestSan} pare ce mat en donnant des échecs sans fin : la partie sera nulle par échec perpétuel.`
      : `Attention : si tu ne fais rien, l'adversaire joue ${data.threat.move} et te met échec et mat. Priorité absolue : ${bestSan} pare ce mat.`,
    `Attention : si tu ne fais rien, l'adversaire joue ${data.threat.move} et te met échec et mat. Priorité absolue : trouve le coup qui pare ce mat.`);
  }
  if (!reason && hanging.length) {
    const h = hanging[0];
    const newSquare = first && first.from === h.square ? first.to : h.square;
    // « À l'abri » seulement si la pièce SURVIT dans la meilleure ligne et que la suite ne coûte rien : un sacrifice
    // (« mets ta tour à l'abri : joue Dxe3 », banc #25) ou un pion poussé sous la prise (#12) n'en sont pas.
    const saved = !hangingAfter.includes(newSquare) && trackPiece(steps, h.square) !== null && gain >= 0;
    if (saved) {
      const attackers = map.attackersOf(h.square, opp).sort((a, b) => VALUE[a.type] - VALUE[b.type]);
      const by = attackers[0] ? ` par ${pieceRef(attackers[0].type, 'opp', attackers[0].square, { article: 'def' })}` : '';
      if (attackers[0]) pieces.add(`${attackers[0].type}|opp|${attackers[0].square}`);
      reason = { kind: 'save', piece: { type: h.type, square: h.square }, attacker: attackers[0] && { type: attackers[0].type, square: attackers[0].square }, move: bestSan };
      const fem = FEM[h.type];
      const attackedTxt = `${cap(note(h.type, 'me', h.square))} est attaqué${fem ? 'e' : ''}${by}${h.defended ? '' : ` et n'est pas défendu${fem ? 'e' : ''}`}.`;
      say(`${attackedTxt} Mets-${fem ? 'la' : 'le'} à l'abri : joue ${bestSan}.`, `${attackedTxt} Mets-${fem ? 'la' : 'le'} à l'abri.`);
    }
  }
  if (!reason && data.threat && (me === 'w' ? -data.threat.material : data.threat.material) >= 2) {
    const loss = Math.abs(data.threat.material);
    if (!threatExecuted(data.threat, steps, data.fen)) {
      reason = { kind: 'parry', threat: data.threat.move, loss, move: bestSan };
      // Une parade qui est un sacrifice (banc #25 : Dxe3 « pare » Fxh4 en donnant la dame) : on le dit, avec la suite.
      // Sacrifice = le coup lui-même donne du matériel (motif détecté, ou échange immédiat perdant), pas une perte
      // plus loin dans une position déjà mauvaise (#15, #28).
      const isSac = (c0.motifs ?? []).some((m) => /sacrifice/.test(m)) || (c0.immMaterial != null && (me === 'w' ? c0.immMaterial : -c0.immMaterial) < 0);
      const sac = isSac && gain < 0 ? ` Attention, ${bestSan} est un sacrifice : dans la suite ${c0.horizonSan}, tu perds ${-gain} point(s), que le moteur juge compensés (${lowerFirst(evalSentence(c0.evalPlayer).replace(/\.$/, ''))}).` : '';
      say(`L'adversaire menace ${data.threat.move}, qui te coûterait ${loss} point(s) de matériel. ${bestSan} pare cette menace.${sac}`,
        `L'adversaire menace ${data.threat.move}, qui te coûterait ${loss} point(s) de matériel. Trouve comment parer cette menace.`);
    } else {
      // La menace s'exécute quand même dans la ligne (banc #32 : « Fxb5+ pare cette menace » puis fxe5) : on le dit,
      // avec ce que la ligne donne réellement.
      const mat = gain > 0 ? `tu gagnes ${gain} point(s)` : gain === 0 ? 'le matériel revient à l\'égalité' : `tu ne perds que ${-gain} point(s)`;
      reason = { kind: 'limit', threat: data.threat.move, loss, move: bestSan, after: gain };
      say(`L'adversaire menace ${data.threat.move}, qui te coûterait ${loss} point(s) de matériel. ${bestSan} ne l'empêche pas, mais c'est le meilleur coup : dans la suite ${c0.horizonSan}, ${mat}, et ${lowerFirst(evalSentence(c0.evalPlayer).replace(/\.$/, ''))}.`,
        `L'adversaire menace ${data.threat.move}, qui te coûterait ${loss} point(s) de matériel. Tu ne pourras pas tout empêcher : cherche le coup qui limite les dégâts.`);
    }
  }
  if (!reason && gain >= 2 && first) {
    const cap1 = steps.find((s, i) => i % 2 === 0 && s.move.captured);
    const victim = cap1 ? ` : tu prends ${pieceRef(cap1.move.captured, 'opp', cap1.move.to, { article: 'poss' })}` : '';
    if (cap1) pieces.add(`${cap1.move.captured}|opp|${cap1.move.to}`);
    reason = { kind: 'win', points: gain, move: bestSan };
    if (cap1 && cap1 !== steps[0]) {
      // Le coup conseillé ne prend RIEN : il prépare la prise, faite plus tard par une autre pièce (partie réelle du
      // 30 septembre : « Te1 gagne du matériel : tu prends son pion en e4 » lu comme Txe4, qui perd la tour ; la
      // prise est Fxe4, deux coups plus tard). On nomme le coup qui prend, et on met en garde si la pièce jouée
      // n'est pas celle qui prend.
      const capSan = enToFr(cap1.move.san);
      const moved = first.piece !== cap1.move.piece || first.to !== cap1.move.from
        ? ` Ce n'est pas ${first.piece === 'r' || first.piece === 'q' ? 'ta' : 'ton'} ${NAME[first.piece]} qui prend : c'est ${capSan}.` : '';
      say(`${bestSan} ne prend rien tout de suite, il prépare un gain : dans la suite ${c0.horizonSan}, ${capSan} prend ${pieceRef(cap1.move.captured, 'opp', cap1.move.to, { article: 'poss' })}.${moved} Une fois les échanges terminés, tu as ${gain} point(s) de plus.`,
        `Il y a du matériel à gagner : ${pieceRef(cap1.move.captured, 'opp', cap1.move.to, { article: 'poss' })} est une cible, mais pas tout de suite. Cherche le coup qui prépare la prise.`);
    } else {
      say(`${bestSan} gagne du matériel${victim}. Une fois les échanges terminés, tu as ${gain} point(s) de plus.`,
        cap1 ? `Tu peux gagner du matériel : ${pieceRef(cap1.move.captured, 'opp', cap1.move.to, { article: 'poss' })} est une cible.` : 'Tu peux gagner du matériel.');
    }
  }
  // Le roque a sa raison à toute phase (banc du 2 octobre : en milieu de partie, « Le meilleur coup du moteur est O-O »
  // sans un mot, depuis que « O-O soutient ton pion en g2 » est exclu des effets).
  if (!reason && first && first.san.startsWith('O-O')) {
    reason = { kind: 'castle', move: bestSan };
    say(`Mets ton roi à l'abri : roque avec ${bestSan}.`, 'Pense à la sécurité de ton roi.');
  }
  if (!reason && first && data.phase === 'ouverture') {
    if ((first.piece === 'n' || first.piece === 'b') && (first.from[1] === '1' || first.from[1] === '8')) {
      reason = { kind: 'develop', piece: first.piece, move: bestSan };
      say(`Sors tes pièces : ${bestSan} développe ${note(first.piece, 'me', first.from)}, qui n'avait pas encore joué.`, 'Sors tes pièces : certaines n\'ont pas encore joué.');
    } else if (first.piece === 'p' && ['d4', 'e4', 'd5', 'e5'].includes(first.to)) {
      reason = { kind: 'center', square: first.to, move: bestSan };
      say(`Prends le centre : ${bestSan} installe un pion sur la case centrale ${first.to}.`, 'Prends le centre avec un pion.');
    }
  }
  if (!reason) {
    // Niveau 6 — le « pourquoi » d'un coup calme, entièrement calculé :
    //   (a) ce que fait le coup lui-même (cases centrales, pièce libérée) : faits du code ;
    //   (b) ce que sa suite fait apparaître de bon pour toi (typé, rendu par le moteur de règles).
    const why = [];
    const whyIdea = []; // même liste, sans ce qui désignerait le coup
    // Les trois mots de l'inventaire du 1er octobre (menace, pression, soutien) : l'effet immédiat du coup sur les
    // pièces, lu sur l'échiquier. C'est ce que fait presque tout coup calme, et la fiche ne le disait pas.
    const eff = first ? moveEffects(data.fen, first)[0] : null;
    if (eff) {
      for (const [t, o, sq] of eff.pieces) pieces.add(`${t}|${o}|${sq}`);
      why.push(eff.text);
      whyIdea.push({ menace: 'une pièce adverse peut être mise en prise', pression: 'une pièce adverse défendue mérite qu\'on mette la pression dessus', soutien: 'une de tes pièces mérite d\'être soutenue' }[eff.kind]);
    }
    for (const b of (c0.basics ?? []).slice(0, 2)) { why.push(b); whyIdea.push(b); }
    if (steps.length >= 2) {
      const end = steps[Math.min(steps.length, 4) - 1].fen;
      // Un pion qui avance reste le même pion : on l'identifie par sa colonne, pas par sa case.
      const key = (t) => (t.id.startsWith('PION_') && typeof t.params.square === 'string'
        ? `${t.id}|${t.params.color}|${t.params.square[0]}`
        // La tour sur colonne porte des drapeaux volatils (colonne disputée par une tour adverse qui bouge) : la preuve
        // « apparaît tôt et tient » se fait sur la tour et sa case, pas sur ces drapeaux (banc du 2 octobre).
        : t.id === 'TOUR_COLONNE_OUVERTE' ? `${t.id}|${t.params.color}|${t.params.square}` : `${t.id}|${JSON.stringify(t.params)}`);
      const before = new Set(buildAllFacts(data.fen).map(key));
      // Par ordre d'importance pour expliquer un plan ; pas de « case faible » isolée (trop vague).
      // Pas de mobilité chiffrée (volatile, et les nombres changent d'un demi-coup à l'autre : banc de milieux, 30 sept.).
      const RANK = [
        ['TOUR_COLONNE_OUVERTE', me], ['CONTROLE_COLONNE', me], ['CAVALIER_AVANT_POSTE', me], ['PION_PASSE_PROTEGE', me],
        ['PION_PASSE', me], ['ROI_AU_CENTRE', opp], ['PIONS_ROI_AFFAIBLI', opp], ['PION_FAIBLE', opp], ['PION_ISOLE', opp],
        ['PION_ARRIERE', opp], ['DOUBLON', opp], ['AVANT_POSTE', me], ['CONTROLE_CENTRE', me], ['AVANTAGE_ESPACE', me],
        ['PAIRE_FOUS', me],
      ];
      const rank = (t) => RANK.findIndex(([id, c]) => id === t.id && t.params.color === c);
      // Un fait « dans la suite » doit apparaître tôt ET tenir jusqu'au bout de l'horizon : sinon c'est un état
      // passager d'un échange en cours, pas une raison.
      const atHorizon = new Set(buildAllFacts(steps.at(-1).fen).map(key));
      const fresh = buildAllFacts(end).filter((t) => !before.has(key(t)) && atHorizon.has(key(t)) && rank(t) >= 0)
        .sort((x, y) => rank(x) - rank(y)).slice(0, 2);
      if (fresh.length) reason = { kind: 'plan', tokens: fresh, move: bestSan };
      for (const t of fresh) { const txt = `dans la suite, ${lowerFirst(renderToken(t).replace(/\.$/, ''))}`; why.push(txt); whyIdea.push(txt); }
    }
    if (why.length) {
      reason ??= { kind: 'basics', move: bestSan };
      // L'idée ne doit pas dire « calme » quand le coup est une prise ou un échec (banc : Fxb5+, Fxa4, axb5).
      const kindOf = first?.captured ? 'Regarde les prises : un échange est à ton avantage.' : first?.san.includes('+') ? 'Regarde les échecs : il y en a un d\'utile.' : 'Pas de tactique ici : cherche un coup calme.';
      say(`Le meilleur coup est ${bestSan} : ${why.join(' ; ')}.`, `${kindOf} Ce qu'il apporte : ${whyIdea.join(' ; ')}.`);
    } else {
      reason = { kind: 'best', move: bestSan };
      say(`Le meilleur coup du moteur est ${bestSan}.`, first?.captured ? 'Regarde les prises : un échange est à ton avantage.' : first?.san.includes('+') ? 'Regarde les échecs : il y en a un d\'utile.' : 'Pas de tactique ici : cherche un coup qui améliore ta position.');
      // Pas de raison concrète : le plan général de la structure reconnue (théorie écrite par nous).
      const st = data.structures?.[0];
      // Le plan de l'ÉLÈVE : celui marqué « (toi) » (le camp qui a la structure ou l'autre camp).
      const mine = st?.plans?.find((x) => /\((?:toi|you)\)/.test(String(x))) ?? (st?.label?.startsWith('roques opposés') ? st.plans[0] : null);
      if (mine && structureProven(mine, steps)) {
        const plan = String(mine).replace(/^[^:]*:\s*/, '').split(/(?<=\.)\s/)[0];
        items.push({ kind: 'structure', label: st.label, plan });
        say(`Idée générale (${st.label}) : ${plan}`);
      }
    }
  }
  items.push({ ...reason, kind: 'reason', type: reason.kind });

  // Le coup conseillé va sur une case attaquée : dire qui l'attaque et qui la défend, avec le bilan de l'échange
  // (partie réelle du 30 septembre, 1.e4 Cc6 2.d4 : « d4 est attaqué et non défendu ? » — la dame le défend).
  if (first && steps[0] && !first.captured && ['develop', 'center', 'castle', 'plan', 'basics', 'best', 'save'].includes(reason.kind)) {
    const after = new Chess(steps[0].fen);
    const who = (sqs) => sqs.map((sq) => ({ square: sq, type: after.get(sq).type })).sort((a, b) => VALUE[a.type] - VALUE[b.type]);
    // Attaquants RÉELS : les pièces adverses qui peuvent légalement prendre sur la case (une pièce clouée sur son roi
    // n'en est pas un : banc du 4 octobre, fiche 33, « le pion e6 attaque f5 » alors que la tour e1 le cloue).
    const legalCaptures = after.turn() === opp ? [...new Set(after.moves({ verbose: true }).filter((x) => x.to === first.to && x.captured).map((x) => x.from))] : after.attackers(first.to, opp);
    const attackers = who(legalCaptures);
    if (attackers.length) {
      const defenders = who(after.attackers(first.to, me));
      const theirs = exchangeIfTaken(steps[0].fen, first.to); // ce que l'adversaire gagne (ou perd) s'il prend
      const a = attackers[0];
      if (theirs != null && theirs <= 0 && defenders.length) {
        const d = defenders[0];
        pieces.add(`${a.type}|opp|${a.square}`);
        pieces.add(`${d.type}|me|${d.square}`);
        items.push({ kind: 'square_defended', square: first.to, attacker: a, defender: d, net: -theirs });
        say(`${cap(pieceRef(a.type, 'opp', a.square, { article: 'def' }))} attaque la case ${first.to}, mais ${pieceRef(d.type, 'me', d.square)} la défend : s'il prend, tu reprends${-theirs > 0 ? ` et gagnes ${-theirs} point(s)` : ''}.`, null);
      } else if (theirs != null && theirs > 0) {
        pieces.add(`${a.type}|opp|${a.square}`);
        const mat = gain > 0 ? `tu gagnes ${gain} point(s)` : gain === 0 ? 'le matériel revient à l\'égalité' : `tu ne perds que ${-gain} point(s)`;
        items.push({ kind: 'square_attacked', square: first.to, attacker: a, loss: theirs });
        say(`Attention : ${pieceRef(a.type, 'opp', a.square, { article: 'def' })} attaque la case ${first.to} et peut y prendre. Le moteur l'accepte, parce que dans la suite ${c0.horizonSan}, ${mat}, et ${lowerFirst(evalSentence(c0.evalPlayer).replace(/\.$/, ''))}.`, null);
      }
    }
  }

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
    const steps3 = [first, ...planSteps(data, me, opp, pieces, items, { skipRook: verified?.concept === 'tour_colonne' || verified?.concept === 'tour_colonne_semi_ouverte', verifiedTo: verified?.to ?? null })].filter(Boolean).slice(0, 3);
    if (steps3.length) {
      items.push({ kind: 'plan_steps', steps: steps3 });
      const [s1, s2, s3] = steps3;
      const planTxt = `Ton plan${verified ? ' (vérifié dans la meilleure suite du moteur)' : ''} : ${s1}${s2 ? `, ensuite ${s2}` : ''}${s3 ? `, et ${s3}` : ''}.`;
      // Dans l'IDÉE, une manœuvre qui commence par le coup conseillé ne donne pas son trajet (sinon le plan dit le coup) :
      // « amène ta tour de d1 vers e1, par d1-e1 » devient « amène une pièce vers e1 ».
      const mv0 = steps[0]?.move; // (« first » est ici la phrase du plan vérifié, pas le coup)
      const planIdea = mv0 ? planTxt.replace(/amène (?:ton|ta) \S+ de ([a-h][1-8]) vers ([a-h][1-8]) (\([^)]*\)), par ([a-h1-8-]+)/g,
        (all, from, to, why, route) => (route.startsWith(`${mv0.from}-${mv0.to}`) ? `amène une pièce vers ${to} ${why}` : all)) : planTxt;
      say(planTxt, planIdea);
    }
    // Intention (modèles sur les plans humains) : ce que les joueurs de ce niveau entreprennent ici. Une tendance,
    // dite comme telle, jamais comme un conseil vérifié ; tue si c'est déjà le plan vérifié.
    const mine = topIntention(data.intentions?.[me], { exclude: verified ? [verified.concept] : [], facts: allFactsForIntent(data), fen: data.fen, side: me });
    if (mine) {
      // Concret ou rien : la case et le pion viennent des disponibilités (banc du 30 septembre : la phrase vague
      // n'apportait pas de profondeur).
      const c = concreteIntention(mine.concept, allFactsForIntent(data), me, 'me', data.fen);
      // Et le moteur doit être d'accord : le coup concret figure dans une de ses lignes (passe 5 du banc).
      if (c && compatibleWithLines(c, data.candidates, data.fen, me)) {
        items.push({ kind: 'intention', concept: mine.concept, p: mine.p, text: c.text });
        say(`À ton niveau, dans ce genre de position, les joueurs entreprennent souvent ceci : ${c.text}.`);
      }
    }
  }

  // Coups qui se valent (écart ≤ 0,3).
  const close = data.candidates.slice(1).filter((c) => c.evalPlayer.type === 'cp' && c0.evalPlayer.type === 'cp'
    && c0.evalPlayer.value - c.evalPlayer.value <= 30).map((c) => c.move);
  if (close.length) {
    items.push({ kind: 'alternatives', moves: close });
    say(`${close.join(' ou ')} ${close.length > 1 ? 'se valent' : 'se vaut'} presque.`, null);
  }

  // Comparaison : un candidat nettement moins bon qui coûte du matériel (lu dans SA ligne).
  // « Tu perds du matériel » seulement si la ligne le confirme par l'évaluation (au moins 1,5 pion de moins que le
  // meilleur coup) : un bilan de pièces à l'horizon d'une ligne équilibrée n'est pas une perte forcée (banc du
  // 4 octobre, fiche 67 : « Évite Te1+ : tu perds 1 point » pour un coup 0,8 pion moins bon, encore largement gagnant).
  const worse = data.candidates.slice(1).find((c) => c.evalPlayer.type === 'cp' && c0.evalPlayer.type === 'cp'
    && c0.evalPlayer.value - c.evalPlayer.value >= 150 && (me === 'w' ? c.material : -c.material) <= -1);
  if (worse) {
    const lost = Math.abs(worse.material);
    items.push({ kind: 'avoid', move: worse.move, loss: lost });
    say(`Évite ${worse.move} : dans sa suite, tu perds ${lost} point(s) de matériel.`);
  }

  // À surveiller : la première idée adverse (déjà nommée par le détecteur), sans chiffre Stockfish.
  const p0 = data.prepared?.[0];
  const his = data.plans?.[opp]?.[0] ?? null;
  if (reason.kind !== 'parry' && reason.kind !== 'parry_mate' && (p0 || his)) {
    const parts = [];
    if (p0) parts.push(p0.text.replace(/\s*\(Stockfish[^)]*\)\)?/, '').replace(/ \((?:pion|cavalier|fou|tour|dame|roi|roque)\)/g, ''));
    // Ce qu'il prépare probablement, d'après les plans humains (proposition, pas vérification).
    const hisIntent = his ? null : topIntention(data.intentions?.[opp], { min: 0.55, margin: 0.15, facts: allFactsForIntent(data), fen: data.fen, side: opp });
    if (hisIntent) {
      const c = concreteIntention(hisIntent.concept, allFactsForIntent(data), opp, 'opp', data.fen);
      if (c && compatibleWithLines(c, data.candidates, data.fen, opp)) {
        items.push({ kind: 'opp_intention', concept: hisIntent.concept, p: hisIntent.p, text: c.text });
        parts.push(`à son niveau, il prépare souvent ${c.text}`);
      }
    }
    // Le plan de l'adversaire, vérifié dans SA meilleure suite : la base de la prophylaxie.
    if (his) {
      items.push({ kind: 'opp_plan', ...his });
      for (const [t, o, sq] of his.pieceRefs) pieces.add(`${t}|${o === me ? 'me' : 'opp'}|${sq}`);
      const s = planSentence(his, 'opp');
      parts.push(`son plan est ${/^[aeiouyéèêh]/i.test(s) ? "d'" : 'de '}${s}`);
    }
    items.push({ kind: 'watch', text: parts.join(' ; ') });
    say(`À surveiller : ${parts.join(' ; ')}.`);
  }
  // Indices par paliers : la pièce, puis la case, puis le coup (et la fiche complète).
  const hints = [];
  if (first) {
    const castle = first.san.startsWith('O-O');
    hints.push(castle ? 'Indice : c\'est ton roi qui joue (pense au roque).' : `Indice : c'est ${pieceRef(first.piece, 'me', first.from)} qui joue.`);
    hints.push(`Indice : ${castle ? 'le roi' : `ce${FEM[first.piece] ? 'tte' : ''} ${NAME[first.piece]}`} va en ${first.to}${first.captured ? ', en prenant' : ''}.`);
  }
  return finish(items, sentences, pieces, data, idea, hints);
}

/**
 * Étapes d'un plan, du plus concret au plus général. Tout est typé ou écrit par nous :
 *   manœuvre sûre (de préférence amorcée par une ligne du moteur) → colonne pour une tour →
 *   cible (faiblesse adverse) → idée de la structure de pions.
 */
/** Faits complets de la position (calculés une fois par fiche) pour vérifier la matière des intentions. */
const FACTS_CACHE = new WeakMap();
function allFactsForIntent(data) {
  if (!FACTS_CACHE.has(data)) FACTS_CACHE.set(data, buildAllFacts(data.fen));
  return FACTS_CACHE.get(data);
}

/** Noms des plans pour les phrases d'intention (tutoiement pour l'élève, tournure neutre pour l'adversaire). */
const INTENT = {
  tour_colonne: 'mettre une tour sur la colonne ouverte', tour_colonne_semi_ouverte: 'mettre une tour sur la colonne semi-ouverte', cavalier_avant_poste: 'installer un cavalier sur un avant-poste',
  blocage: 'bloquer un pion faible adverse', rupture: 'préparer une rupture de pions', affaiblir: 'affaiblir la structure adverse',
  dominer: 'échanger le fou adverse pour dominer une couleur de cases', attaque_minorite: 'lancer une attaque de minorité',
  baionnette: 'pousser h4-h5 contre le fianchetto',
};
const INTENT_OPP = {
  tour_colonne: 'une tour sur la colonne ouverte', tour_colonne_semi_ouverte: 'une tour sur la colonne semi-ouverte', cavalier_avant_poste: 'un cavalier sur un avant-poste',
  blocage: 'le blocage d\'un de tes pions faibles', rupture: 'une rupture de pions', affaiblir: 'un affaiblissement de ta structure',
  dominer: 'l\'échange de ton fou pour dominer une couleur', attaque_minorite: 'une attaque de minorité', baionnette: 'la poussée h4-h5 contre ton fianchetto',
};

function planSteps(data, me, opp, pieces, items, { skipRook = false, verifiedTo = null } = {}) {
  const out = [];
  const board = new Chess(data.fen);
  // Fin de la meilleure ligne du moteur : toute étape générique doit y être encore vraie (banc de milieux de
  // partie, 30 septembre : « vise son roi resté au centre » alors qu'il roque dans toutes les lignes, étapes vers
  // une case que la ligne occupe déjà, cible que la ligne fait disparaître). Sinon l'étape se tait.
  const bestSteps = play(data.fen, data.candidates[0]?.pvUci ?? []);
  const endBoard = new Chess(bestSteps.at(-1)?.fen ?? data.fen);
  const endFacts = buildAllFacts(endBoard.fen());
  const stillAtEnd = (id, color, square) => endFacts.some((t) => t.id === id && t.params.color === color
    && (square === undefined || t.params.square === square || (typeof t.params.square === 'string' && typeof square === 'string' && id.startsWith('PION_') && t.params.square[0] === square[0])));
  // Dans la ligne du coup conseillé seulement : une manœuvre de la ligne 2 contredit le coup de la ligne 1 (banc #20 :
  // « joue Cxe6, puis amène ton cavalier de c5 en a6 »).
  // …et la pièce doit ARRIVER à destination dans cette ligne (passe 8, #10 : « g5-f3-e5-c6 » alors que la ligne joue
  // Cf3 puis Cxd4 : le premier pas ne prouve pas la manœuvre).
  const inLines = (m) => {
    let sq = m.from;
    for (const s of bestSteps) {
      if (s.move.color !== me) continue;
      if (s.move.from === sq) sq = s.move.to;
      if (sq === m.to) return true;
    }
    return false;
  };
  // Seulement une manœuvre dont le premier pas figure dans une ligne du moteur (sinon ce n'est pas un plan sûr),
  // pas celle que le plan vérifié vient déjà de dire (même case d'arrivée), et pas vers une case qu'une autre de
  // mes pièces occupe à la fin de la ligne (« le cavalier en d5, puis le fou vers d5 »).
  const man = (data.maneuvers ?? []).find((m) => inLines(m) && m.to !== verifiedTo
    && !(endBoard.get(m.to) && endBoard.get(m.to).color === me && endBoard.get(m.to).type !== board.get(m.from)?.type));
  let rookPlanned = skipRook;
  if (man) {
    const type = board.get(man.from)?.type;
    if (type) {
      pieces.add(`${type}|me|${man.from}`);
      rookPlanned = type === 'r';
      // Le trajet dit est celui que la pièce fait DANS la ligne (coup précédent de la même partie : « amène ta tour de
      // f1 vers e1, par f1-e1 » alors que le coup conseillé était Td1, puis Te1).
      const route = [man.from];
      let arrival = null;
      for (const st of bestSteps) {
        if (st.move.color === me && st.move.from === route.at(-1)) route.push(st.move.to);
        if (route.at(-1) === man.to) { arrival = st; break; }
      }
      // Une manœuvre pendant laquelle la ligne me coûte du matériel n'est pas « ton plan » : le moteur la joue parce
      // que tout est mauvais (banc du 4 octobre, fiche 65 : « amène ton cavalier de f3 vers b5 » alors que Cd4 lâche e5).
      const costs = arrival ? materialOf(data.fen, me) - materialOf(arrival.fen, me) : 0;
      if (costs < 1) out.push(`amène ${FEM[type] ? 'ta' : 'ton'} ${NAME[type]} de ${man.from} vers ${man.to} (${man.why}), par ${route.join('-')}`);
    }
  }
  const facts = buildAllFacts(data.fen);
  if (!rookPlanned && board.board().flat().some((p) => p && p.type === 'r' && p.color === me)) {
    // La colonne doit être encore ouverte (ou semi-ouverte pour moi) à la fin de la ligne, ET une de mes tours doit
    // s'y trouver à ce moment-là : l'étape est alors réalisée par le moteur, pas décrétée par nous (banc, positions
    // 17 et 20 : « la colonne c » quand la ligne met la tour en e1).
    const rookAtEndOn = (f) => endBoard.board().flat().some((p) => p && p.type === 'r' && p.color === me && p.square[0] === String(f));
    const file = facts.find((t) => (t.id === 'COLONNE_OUVERTE' || (t.id === 'COLONNE_SEMI_OUVERTE' && t.params.color === me))
      && !board.board().flat().some((p) => p && p.type === 'r' && p.color === me && p.square[0] === String(t.params.file))
      && rookAtEndOn(t.params.file)
      && endFacts.some((u) => (u.id === 'COLONNE_OUVERTE' || (u.id === 'COLONNE_SEMI_OUVERTE' && u.params.color === me)) && String(u.params.file) === String(t.params.file)));
    if (file) out.push(`place une tour sur la colonne ${file.params.file} ${file.id === 'COLONNE_OUVERTE' ? 'ouverte' : 'semi-ouverte'}`);
  }
  const TARGET = { PION_FAIBLE: 'faible', PION_ISOLE: 'isolé', PION_ARRIERE: 'arriéré' };
  // La cible doit exister encore à la fin de la ligne, et une de mes pièces doit l'attaquer (au départ ou à la fin) :
  // sinon « vise le pion a7 » après « ta tour en e1 » n'a pas de sens.
  const attacked = (sq) => { try { return board.attackers(sq, me).length > 0 || endBoard.attackers(sq, me).length > 0; } catch { return true; } };
  const target = facts.find((t) => TARGET[t.id] && t.params.color === opp && stillAtEnd(t.id, opp, t.params.square) && attacked(t.params.square));
  if (target) {
    pieces.add(`p|opp|${target.params.square}`);
    out.push(`vise le pion ${TARGET[target.id]} adverse en ${target.params.square}`);
  } else if (facts.some((t) => t.id === 'ROI_AU_CENTRE' && t.params.color === opp) && stillAtEnd('ROI_AU_CENTRE', opp)
    && !new RegExp(opp === 'w' ? '[KQ]' : '[kq]').test(endBoard.fen().split(' ')[2])) {
    // « Resté au centre » n'est une cible que s'il ne peut plus roquer à la fin de la ligne : sinon il roque au
    // coup suivant et le plan est faux (banc de milieux, positions 7, 9, 21, 27).
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
  // Texte de structure seulement si la ligne du moteur joue une de ses cases (banc #35 « f4-f5 » avec le pion f2 bloqué
  // par le cavalier f3 ; #36 « ouvrir c4-c5, b4 » devant son propre roi).
  if (out.length < 3 && mine && !items.some((x) => x.kind === 'structure') && structureProven(mine, bestSteps)) {
    const idea = String(mine).replace(/^[^:]*:\s*/, '').split(/(?<=\.)\s/)[0].replace(/\.$/, '');
    out.push(`garde en tête l'idée de la structure (${st.label.replace(/ — .*/, '')}) : ${lowerFirst(idea)}`);
  }
  return out.slice(0, 3);
}

function finish(items, sentences, pieces, data, idea = sentences, hints = []) {
  const text = sentences.join(' ');
  const squares = new Set(text.match(/(?<![a-zA-Z])[a-h][1-8](?![0-9])/g) ?? []);
  const moves = new Set(text.match(/(?<![\w-])(?:O-O(?:-O)?|[RDTFC]?[a-h]?[1-8]?x?[a-h][1-8](?:=[DTFC])?[+#]?)(?![\w])/g) ?? []);
  return { items, text, idea: idea.join(' '), hints, allowed: { squares, moves, pieces }, player: data.player, fen: data.fen };
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
