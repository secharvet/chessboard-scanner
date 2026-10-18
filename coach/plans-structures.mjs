/**
 * Plans canoniques par structure — transcription de la table de l'Expert échecs (18 octobre 2026,
 * livrables/plans-canoniques-structures.md sur sa branche) pour la bascule du faisceau.
 * owner = le camp qui possède la structure au sens de positional/structures.js ; les cases sont écrites dans
 * l'orientation owner = Blancs, et mises en miroir quand le propriétaire est noir. Les transferts sont donnés par type
 * de pièce et case cible : `instancier` choisit la pièce de ce type la plus proche de la cible (par la distance du plan).
 * ROQUES_OPPOSES est un modificateur (la course des pions prime, l'instance se lie au roque adverse) : non transcrit ici,
 * à brancher par position.
 */
import { buildAttackMap } from '../positional/attack-map.js';
import { distance } from './plan-distance.mjs';

/** @type {Record<string, { owner: object[], opponent: object[] }>}  instances abstraites, cases côté Blancs-propriétaire */
export const PLANS_PAR_STRUCTURE = {
  PDI: {
    owner: [
      { famille: 'transfert', piece: 'q', vers: 'd3', pourquoi: 'la batterie vers h7 : les pièces vers le roi tant qu\'elles sont là' },
      { famille: 'rupture', pion: 'd', cible: 'd5', pourquoi: 'la poussée libératrice, au moment de force maximale' },
    ],
    opponent: [
      { famille: 'transfert', piece: 'n', vers: 'd5', pourquoi: 'le blocus : un cavalier devant le pion, il ne craint rien' },
      { famille: 'colonne', colonne: 'd', pourquoi: 'la pression sur le pion faible ; en finale il tombe' },
    ],
  },
  PIONS_PENDANTS: {
    owner: [
      { famille: 'rupture', pion: 'd', cible: 'd5', pourquoi: 'la poussée qui transforme les pendants en force, au pic d\'activité' },
      { famille: 'transfert', piece: 'n', vers: 'e5', pourquoi: 'l\'avant-poste que les pendants garantissent ; prépare l\'attaque roi' },
    ],
    opponent: [
      { famille: 'rupture', pion: 'b', cible: 'b5', pourquoi: 'le levier contre c4 : forcer une poussée, puis bloquer l\'autre pion' },
      { famille: 'colonne', colonne: 'c', pourquoi: 'les tours contre la paire : elle ne peut pas avancer sous pression' },
    ],
  },
  CARLSBAD: {
    owner: [
      { famille: 'rupture', pion: 'b', cible: 'b5', pourquoi: 'l\'attaque de minorité : échanger en c6 et léguer un pion c faible' },
      { famille: 'rupture', pion: 'e', cible: 'e4', pourquoi: 'l\'alternative centrale (Botvinnik) : jouer au centre au lieu de l\'aile' },
    ],
    opponent: [
      { famille: 'transfert', piece: 'n', vers: 'e4', pourquoi: 'le cavalier de contre-attaque sur la case que d5 garantit' },
      { famille: 'poussee', pion: 'f', cible: 'f5', pourquoi: 'l\'assaut roi (f5 n\'attaque rien : la rupture est f4, au coup d\'après)' },
    ],
  },
  CHAINE_E5: {
    owner: [{ famille: 'rupture', pion: 'f', cible: 'f5', pourquoi: 'l\'attaque de la base e6 (f4 d\'abord) : la chaîne pointe vers le roi' }],
    opponent: [
      { famille: 'rupture', pion: 'c', cible: 'c5', pourquoi: 'la base d4 d\'abord (Nimzowitsch) : le levier fondamental du camp e6/d5' },
      { famille: 'rupture', pion: 'f', cible: 'f6', pourquoi: 'la pointe e5 ensuite, quand d4 est sous pression' },
    ],
  },
  CHAINE_D5: {
    owner: [
      { famille: 'rupture', pion: 'c', cible: 'c5', pourquoi: 'contre d6 : la chaîne pointe vers l\'aile dame, on ouvre là' },
      { famille: 'colonne', colonne: 'c', pourquoi: 'la colonne que c5 ouvrira : le plan de service attitré' },
    ],
    opponent: [{ famille: 'rupture', pion: 'f', cible: 'f5', pourquoi: 'contre e4 : l\'assaut roi, le plan du camp d6/e5' }],
  },
  MAROCZY: {
    owner: [{ famille: 'transfert', piece: 'n', vers: 'd5', pourquoi: 'la case que l\'étau garantit : une pièce y vaut la paire' }],
    opponent: [
      { famille: 'rupture', pion: 'b', cible: 'b5', pourquoi: 'contre c4 : la libération côté dame' },
      { famille: 'rupture', pion: 'f', cible: 'f5', pourquoi: 'contre e4 : la libération côté roi' },
    ],
  },
  PETIT_CENTRE_SICILIEN: {
    owner: [
      { famille: 'rupture', pion: 'd', cible: 'd5', pourquoi: 'la poussée libératrice : tout le contre-jeu sicilien la prépare' },
      { famille: 'colonne', colonne: 'c', pourquoi: 'la colonne semi-ouverte : les tours y travaillent en attendant …d5' },
    ],
    opponent: [{ famille: 'et', plans: [{ famille: 'poussee', pion: 'f', cible: 'f4' }, { famille: 'rupture', pion: 'e', cible: 'e5' }], pourquoi: 'la conjonction contre d6 : f4 soutient, e5 ouvre' }],
  },
};

const miroirCase = (s) => `${s[0]}${9 - Number(s[1])}`;
/** Les cases d'une instance, vues par le camp qui doit la jouer. La table est écrite owner = Blancs : on met en miroir
 *  quand le propriétaire de la structure est noir (pour les deux camps). */
function orienter(p, proprietaireNoir) {
  if (!proprietaireNoir) return p;
  if (p.famille === 'et') return { ...p, plans: p.plans.map((q) => orienter(q, true)) };
  const out = { ...p };
  if (out.cible) out.cible = miroirCase(out.cible);
  if (out.vers) out.vers = miroirCase(out.vers);
  return out;
}

/**
 * Les plans canoniques, concrets, du camp `side` dans la position `fen` pour la structure `name` possédée par `owner`.
 * Les transferts par type de pièce sont instanciés sur la pièce de ce type la plus proche de la cible ; une instance
 * sans pièce disponible est omise.
 * @returns {{ plan: object, pourquoi: string, role: 'owner'|'opponent' }[]}
 */
export function instancier(fen, side, name, owner) {
  const table = PLANS_PAR_STRUCTURE[name]; if (!table) return [];
  const role = owner === side ? 'owner' : 'opponent';
  const at = buildAttackMap(fen).at;
  const out = [];
  for (const abstrait of table[role]) {
    const p = orienter(abstrait, owner === 'b');
    const concret = (q) => {
      if (q.famille !== 'transfert') return q;
      const candidates = Object.values(at).filter((x) => x.color === side && x.type === q.piece).map((x) => x.square);
      let best = null, bd = Infinity;
      for (const de of candidates) { const d = distance(fen, side, { famille: 'transfert', de, vers: q.vers }).d; if (d < bd) { bd = d; best = de; } }
      return best ? { famille: 'transfert', de: best, vers: q.vers } : null;
    };
    let plan;
    if (p.famille === 'et') { const sous = p.plans.map(concret); if (sous.some((x) => !x)) continue; plan = { famille: 'et', plans: sous }; }
    else { plan = concret(p); if (!plan) continue; }
    const { pourquoi, piece, ...reste } = plan.famille === 'et' ? { ...plan, pourquoi: p.pourquoi } : { ...plan, pourquoi: p.pourquoi };
    out.push({ plan: reste, pourquoi: pourquoi ?? p.pourquoi, role });
  }
  return out;
}
