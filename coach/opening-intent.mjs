/**
 * Coach d'ouverture (POC du 6 octobre 2026) : lit les coups JOUÉS, retrouve la position dans le livre des intentions,
 * et parle d'intention : ce que cherche le dernier coup adverse, ce que tu prépares, la menace type, le plan des deux
 * camps, et ce qu'un coup hors théorie manque. Le moteur ne sert qu'à VÉRIFIER le coup conseillé.
 *
 * openingIntent({ moves, player, candidates }) →
 *   null si rien à dire (pas dans une ouverture connue, ou trop loin du livre)
 *   sinon { nom, enLivre, dernier, plan, ecart, schema, conseil, texte, idee, items }
 */
import { Chess } from 'chess.js';
import { LIVRE, OUVERTURE, positionsDuLivre } from './openings/francaise.mjs';
import { toFrenchSan } from './notation.mjs';

const INDEX = positionsDuLivre(Chess);
const key = (fen) => fen.split(' ').slice(0, 4).join(' ');
const fr = (san) => toFrenchSan(san);
const MAX_HORS_LIVRE = 18; // au-delà, le coach d'ouverture se tait (la fiche limite déjà à la phase d'ouverture)

/** Rejoue la partie et note, à chaque demi-coup, l'entrée du livre atteinte (ou null). */
function parcours(moves) {
  const c = new Chess();
  const etapes = [{ ply: 0, san: null, entree: INDEX.get(key(c.fen())) ?? null, color: null }];
  for (const [i, san] of moves.entries()) {
    let m;
    try { m = c.move(san); } catch { break; }
    etapes.push({ ply: i + 1, san: m.san, color: m.color, entree: INDEX.get(key(c.fen())) ?? null, fen: c.fen() });
  }
  return etapes;
}

const dernierAvec = (etapes, champ) => [...etapes].reverse().find((e) => e.entree?.[champ])?.entree?.[champ] ?? null;

export function openingIntent({ moves = [], player = 'w', candidates = [] } = {}) {
  if (!moves.length) return null;
  const etapes = parcours(moves);
  const courante = etapes.at(-1);
  // Dernière étape encore dans le livre ; le premier coup APRÈS elle est la sortie. Les trous du livre à l'intérieur
  // d'une ligne (position intermédiaire non décrite) ne sont pas des sorties.
  const derniereEnLivre = [...etapes].reverse().find((e) => e.entree) ?? null;
  if (!derniereEnLivre || derniereEnLivre.ply < 2) return null; // pas une Française
  const sortie = etapes[derniereEnLivre.ply + 1] ?? null;
  const horsLivre = courante.ply - derniereEnLivre.ply;
  if (horsLivre > MAX_HORS_LIVRE) return null;
  const nom = dernierAvec(etapes, 'nom') ?? OUVERTURE;
  const schema = dernierAvec(etapes, 'schema');
  const moi = player; const lui = player === 'w' ? 'b' : 'w';
  const camp = (c) => (c === 'w' ? 'des Blancs' : 'des Noirs');
  const top = candidates.map((c) => c.move); // SAN français, du meilleur au moins bon
  // Même coup à la désambiguïsation près : « Cbd7 » du moteur vaut « Cd7 » du livre (pièce + prise + case d'arrivée).
  const norm = (san) => { const t = String(san).replace(/[+#!?]/g, ''); if (/^O-O/.test(t)) return t; const m = t.match(/^([CFTDRNBQK]?)[a-h]?[1-8]?(x?)([a-h][1-8])(=?[DQTRFBCN]?)$/); return m ? `${m[1].replace(/[NBRQK]/, (x) => ({ N: 'C', B: 'F', R: 'T', Q: 'D', K: 'R' })[x])}${m[2]}${m[3]}${m[4]}` : t; };
  const cp = (c) => (c?.evalPlayer?.type === 'cp' ? c.evalPlayer.value : c?.evalPlayer?.type === 'mate' ? (c.evalPlayer.value > 0 ? 10000 : -10000) : null);
  const rang = (san) => {
    const i = top.findIndex((t) => norm(t) === norm(fr(san)));
    if (i <= 0) return i;
    const e0 = cp(candidates[0]); const ei = cp(candidates[i]);
    return e0 != null && ei != null && e0 - ei > 30 ? -1 : i; // à plus de 0,3 du meilleur : pas conseillé
  };

  const items = []; const phrases = []; const idee = [];
  const say = (t, i) => { phrases.push(t); if (i !== null) idee.push(i ?? t); };

  // 1. Le nom, une fois.
  say(`Ouverture : ${nom}.`);

  // 2. Le dernier coup adverse : son intention, sa menace.
  let dernier = null;
  if (courante.entree && courante.color === lui) {
    dernier = { san: fr(courante.san), sens: courante.entree.sens, menace: courante.entree.menace ?? null };
    say(`Son ${dernier.san} ${dernier.sens}.${dernier.menace ? ` Menace type : ${dernier.menace}.` : ''}`);
    items.push({ kind: 'opening_last', ...dernier });
  }

  // 3. Hors du livre : qui est sorti, par quel coup, et ce que ce coup manque. Dit UNE fois (dans les deux demi-coups
  //    qui suivent la sortie) ; ensuite seulement le plan.
  let ecart = null;
  const finDuLivre = sortie && (derniereEnLivre.entree.plan ?? []).some((p) => p.san === sortie.san); // suite non décrite, pas un écart
  if (sortie && !finDuLivre) {
    const noeud = derniereEnLivre.entree;
    const attendu = (noeud.plan ?? []).map((p) => ({ san: fr(p.san), pourquoi: p.pourquoi }));
    const erreur = (noeud.erreurs ?? []).find((e) => e.san === sortie.san);
    ecart = { san: fr(sortie.san), par: sortie.color, attendu, pourquoi: erreur?.pourquoi ?? null, depuis: horsLivre };
    if (horsLivre <= 2) {
      items.push({ kind: 'opening_deviation', ...ecart });
      const qui = sortie.color === moi ? 'Tu as quitté' : 'Il a quitté';
      const alt = attendu[0] ? ` La théorie joue ${attendu.map((a) => a.san).join(' ou ')} : ${attendu[0].pourquoi}.` : '';
      if (erreur) say(`${qui} la théorie avec ${ecart.san} : ${erreur.pourquoi}.${alt}`, `${qui} la théorie : regarde ce que ce coup laisse passer.`);
      else say(`${qui} la théorie avec ${ecart.san}.${alt}`, `${qui} la théorie.`);
    }
  }

  // 4. Le plan maintenant : coups du livre pour le camp au trait (toi), vérifiés au moteur.
  let plan = []; let conseil = null;
  const noeudPlan = courante.entree ?? null;
  if (noeudPlan?.plan?.length && courante.color !== moi) {
    plan = noeudPlan.plan.map((p) => ({ san: top[rang(p.san)] ?? fr(p.san), pourquoi: p.pourquoi, rang: rang(p.san) }));
    const ok = plan.filter((p) => p.rang >= 0 && p.rang < 3);
    if (ok.length) {
      conseil = ok[0];
      const autres = ok.slice(1).map((p) => `${p.san} (${p.pourquoi})`);
      say(`Ton plan : ${conseil.san} ${conseil.pourquoi}.${autres.length ? ` Aussi possible : ${autres.join(' ; ')}.` : ''}`,
        `Ton plan : ${conseil.pourquoi.replace(/^[a-zéè]/, (x) => x)}. Cherche le coup qui le réalise.`);
      if (top.length && conseil.rang > 0) say(`Le moteur met ${top[0]} devant, mais ${conseil.san} est dans ses premiers choix et suit le plan.`, null);
    } else if (top.length) {
      say(`La théorie joue ${plan.map((p) => p.san).join(' ou ')} (${plan[0].pourquoi}), mais ici le moteur préfère nettement ${top[0]} : il y a une raison concrète dans la position, regarde-la avant de suivre le livre.`,
        `La théorie a un plan ici, mais la position demande autre chose : cherche la raison concrète.`);
    }
    items.push({ kind: 'opening_plan', plan, conseil });
  } else if (schema && courante.color !== moi) {
    const mien = schema[moi === 'w' ? 'blancs' : 'noirs'];
    const sien = schema[lui === 'w' ? 'blancs' : 'noirs'];
    // Le plan guide le choix : parmi les trois premiers coups du moteur (à moins de 0,3 du meilleur), le premier qui est
    // un coup type du plan devient le conseil, avec son pourquoi. Sinon le moteur a une raison concrète : la fiche la dira.
    const types = schema[moi === 'w' ? 'coupsBlancs' : 'coupsNoirs'] ?? [];
    const dejaJoues = new Set(etapes.filter((e) => e.color === moi).map((e) => e.san));
    const choix = types.map((t) => ({ san: top[rang(t.san)] ?? fr(t.san), pourquoi: t.pourquoi, rang: rang(t.san), deja: [...dejaJoues].some((d) => norm(fr(d)) === norm(fr(t.san))) }))
      .filter((t) => !t.deja && t.rang >= 0 && t.rang < 3); // ordre du plan : le premier coup type encore à jouer
    if (choix.length) {
      conseil = choix[0];
      plan = choix;
      say(`Le plan ${camp(moi)} ici : ${mien[0]}. Maintenant : ${conseil.san} ${conseil.pourquoi}.${choix[1] ? ` Aussi dans le plan : ${choix[1].san} (${choix[1].pourquoi}).` : ''}`,
        `Le plan ${camp(moi)} ici : ${mien[0]}. Cherche le coup du plan.`);
      if (top.length && conseil.rang > 0) say(`Le moteur met ${top[0]} devant, mais ${conseil.san} est dans ses premiers choix et suit le plan.`, null);
    } else {
      say(`Le plan ${camp(moi)} dans cette structure : ${mien.join(' ; ')}. Lui va chercher à : ${sien[0]}.`,
        `Le plan ${camp(moi)} dans cette structure : ${mien[0]}.`);
    }
    items.push({ kind: 'opening_schema', moi: mien, lui: sien, conseil });
  }

  // 5. Les erreurs à éviter, si le moteur confirme qu'elles sont mauvaises (hors de ses trois premiers coups).
  const pieges = (noeudPlan?.erreurs ?? []).filter((e) => rang(e.san) < 0 || rang(e.san) >= 3).map((e) => ({ san: fr(e.san), pourquoi: e.pourquoi }));
  if (pieges.length && courante.color !== moi) {
    say(`Évite ${pieges.map((p) => `${p.san} (${p.pourquoi})`).join(' ; ')}.`, null);
    items.push({ kind: 'opening_avoid', pieges });
  }

  if (!items.length) return null; // le nom seul n'est pas un conseil
  return { nom, enLivre: Boolean(courante.entree), dernier, plan, ecart, schema, conseil, items, texte: phrases.join(' '), idee: idee.join(' ') };
}
