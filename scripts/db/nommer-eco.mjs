/**
 * Donne à chaque position de la base son code ECO et le nom officiel de sa variante (17 octobre 2026), à partir du
 * référentiel public db/eco/*.tsv (lichess-org/chess-openings, CC0). Correspondance par position (clé FEN : les
 * transpositions comptent). Les noms sont traduits en français ; nos propres noms et textes ne sont pas touchés :
 * l'assistant affiche le nom officiel en tête, puis notre nom et nos mots.
 *   podman exec chess-api node scripts/db/nommer-eco.mjs            → met à jour positions.eco / positions.nom_eco
 *   node scripts/db/nommer-eco.mjs --essai C1                        → affiche les traductions des codes commençant par C1 (sans base)
 */
import { readFileSync, readdirSync } from 'node:fs';
import { Chess } from 'chess.js';

// ---- traduction des noms (segments entiers d'abord, puis mot à mot)
const SEGMENTS = {
  'French Defense': 'Française', 'Italian Game': 'Italienne', 'Ruy Lopez': 'Espagnole', 'Scotch Game': 'Écossaise',
  "Petrov's Defense": 'Petrov', 'Philidor Defense': 'Philidor', 'Vienna Game': 'Viennoise', "King's Gambit": 'Gambit du roi',
  'Sicilian Defense': 'Sicilienne', 'Caro-Kann Defense': 'Caro-Kann', 'London System': 'Système Londres', "Queen's Gambit": 'Gambit dame',
  "King's Pawn Game": 'Partie du pion roi', "Bishop's Opening": 'Partie du fou', 'Four Knights Game': 'Quatre Cavaliers',
  'Main Line': 'ligne principale', 'Advance Variation': 'Avance', 'Exchange Variation': 'Échange', 'Classical Variation': 'Classique',
  'Closed': 'fermée', 'Open': 'ouverte', 'Open Variations': 'Ouverte', 'Closed Variations': 'Fermée',
  'Poisoned Pawn Variation': 'Pion empoisonné', 'Poisoned Pawn Variation Declined': 'Pion empoisonné refusé',
  'Two Knights Defense': 'Deux Cavaliers', 'Two Knights Variation': 'Deux Cavaliers', 'Four Knights Variation': 'Quatre Cavaliers',
  'Berlin Defense': 'Berlinoise', 'Morphy Defense': 'défense Morphy', 'Giuoco Piano': 'Giuoco Piano', 'Giuoco Pianissimo': 'Giuoco Pianissimo',
  'Evans Gambit': 'gambit Evans', 'Evans Gambit Accepted': 'gambit Evans accepté', 'Evans Gambit Declined': 'gambit Evans refusé',
  'Marshall Attack': 'attaque Marshall', 'Anti-Marshall': 'anti-Marshall', 'Open System': 'système ouvert', 'Closed System': 'système fermé',
  'Modern System': 'système moderne', 'Fort Knox Variation': 'Fort Knox', 'Extended Bishop Swap': 'échange de fou élargi',
  'Pawn Center Variation': 'centre de pions', "King's Indian Attack": 'Attaque est-indienne', 'Knight Variation': '2.Cf3',
  "Queen's Knight": '2.Cc3', 'Normal Variation': 'variante normale', 'Positional Variation': 'variante positionnelle',
  'Retreat Variation': 'retraite du fou', 'Winawer Variation': 'Winawer', 'Tarrasch Variation': 'Tarrasch', 'Rubinstein Variation': 'Rubinstein',
  'Steinitz Variation': 'Steinitz', 'McCutcheon Variation': 'MacCutcheon', 'Alekhine-Chatard Attack': 'attaque Alekhine-Chatard',
  'Milner-Barry Gambit': 'gambit Milner-Barry', 'Guimard Defense': 'défense Guimard', 'Chigorin Defense': 'Tchigorine',
  'Chigorin Variation': 'Tchigorine', 'Breyer Defense': 'Breyer', 'Zaitsev System': 'Zaitsev', 'Smyslov Defense': 'Smyslov',
  'Exchange Variation Doubly Deferred': 'échange doublement différé', 'Delayed Exchange Variation': 'échange différé',
  'Arkhangelsk Variation': 'Arkhangelsk', 'Møller Defense': 'défense Møller', 'Classical Defense': 'défense classique',
  'Schliemann Defense': 'Schliemann', 'Bird Variation': 'Bird', 'Cozio Defense': 'Cozio', 'Steinitz Defense': 'défense Steinitz',
  'Steinitz Defense Deferred': 'Steinitz différée', 'Old Steinitz Defense': 'ancienne Steinitz', "Noah's Ark Trap": "piège de l'Arche de Noé",
  'Worrall Attack': 'attaque Worrall', 'Exchange Variation, Alekhine Variation': 'Échange, Alekhine', 'Hungarian Defense': 'Hongroise',
  'Burn Variation': 'Burn', 'Richter Attack': 'attaque Richter', 'Swiss Variation': 'variante suisse', 'Henneberger Variation': 'Henneberger',
  'Franco-Sicilian Defense': 'Franco-sicilienne', 'Mediterranean Defense': 'défense méditerranéenne', 'St. George Defense': 'défense Saint-Georges',
  'Paulsen Attack': 'attaque Paulsen', 'Nimzowitsch System': 'système Nimzowitsch', 'Nimzowitsch Attack': 'attaque Nimzowitsch',
  'Monte Carlo Variation': 'Monte-Carlo', 'Euwe Variation': 'Euwe', 'Wade Variation': 'Wade', 'Lputian Variation': 'Lputian',
  'Kupreichik Variation': 'Kupreichik', 'Frenkel Gambit': 'gambit Frenkel', 'Bogoljubow Variation': 'Bogoljubov', 'Svenonius Variation': 'Svenonius',
  'Haberditz Variation': 'Haberditz', 'Morozevich Variation': 'Morozevich', 'Botvinnik Variation': 'Botvinnik', 'Leningrad Variation': 'Leningrad',
  'Eliskases Variation': 'Eliskases', 'Chistyakov Defense': 'défense Tchistiakov', 'Euwe-Keres Line': 'ligne Euwe-Keres',
  'Lasker Variation': 'Lasker', 'Bernstein Variation': 'Bernstein', 'Tartakower Variation': 'Tartakower', 'Janowski Variation': 'Janowski',
  'Dr. Olland Variation': 'Olland', 'Portisch-Hook Variation': 'Portisch-Hook', 'Warsaw Variation': 'Varsovie', 'Eingorn Variation': 'Eingorn',
  'Armenian Line': 'ligne arménienne', 'Fingerslip Variation': 'Fingerslip', 'Alekhine-Maróczy Gambit': 'gambit Alekhine-Maróczy',
  'Petrosian Variation': 'Petrossian', 'Moscow Variation': 'Moscou', 'Boleslavsky Variation': 'Boleslavski', 'Gledhill Attack': 'attaque Gledhill',
  'Shirov-Anand Variation': 'Shirov-Anand', 'Pollock Variation': 'Pollock', 'Capablanca Line': 'ligne Capablanca', 'Kasparov Attack': 'attaque Kasparov',
  'Maric Variation': 'Maric', 'Center Attack': 'attaque du centre', 'Center Game': 'Partie du centre', 'Scotch Gambit': 'gambit écossais',
  'Fried Liver Attack': 'attaque Fegatello', 'Traxler Counterattack': 'contre-attaque Traxler', 'Max Lange Attack': 'attaque Max Lange',
  'Canal Variation': 'Canal', 'Greco Gambit': 'gambit Greco', 'Rousseau Gambit': 'gambit Rousseau', 'Jerome Gambit': 'gambit Jerome',
  'Columbus Variation': 'Columbus', 'Cordel Defense': 'Cordel', 'Caro Variation': 'Caro', 'Brentano Gambit': 'gambit Brentano',
  'Exchange Variation, Gligoric Variation': 'Échange, Gligoric', 'Keres Defense': 'défense Keres', 'Averbakh Variation': 'Averbakh',
  'Neo-Arkhangelsk Variation': 'néo-Arkhangelsk', 'Graz Variation': 'Graz', 'Rio Gambit Accepted': 'gambit de Rio accepté',
  "l'Hermet Variation": "l'Hermet", 'Howell Attack': 'attaque Howell', 'Schliemann Defense Deferred': 'Schliemann différée',
  'Caro Variation': 'Caro', 'Mackenzie Variation': 'Mackenzie', 'Taimanov Variation': 'Taïmanov', 'Anderssen Variation': 'Anderssen',
};
const MOTS = {
  Variation: '', Variations: '', Defense: 'défense', Defence: 'défense', Attack: 'attaque', Gambit: 'gambit', System: 'système', Line: 'ligne',
  Main: 'principale', Accepted: 'accepté', Declined: 'refusé', Advance: 'avance', Exchange: 'échange', Classical: 'classique', Modern: 'moderne',
  Open: 'ouverte', Closed: 'fermée', Knight: 'cavalier', Knights: 'cavaliers', Bishop: 'fou', Pawn: 'pion', Two: 'deux', Three: 'trois', Four: 'quatre',
  Center: 'centre', Counter: 'contre', with: 'avec', without: 'sans', Old: 'ancienne', New: 'nouvelle', Deferred: 'différée', Delayed: 'différée',
  Early: 'précoce', Reversed: 'inversée', Accelerated: 'accélérée', Traditional: 'traditionnelle', Normal: 'normale', Positional: 'positionnelle',
  Fianchetto: 'fianchetto', Trap: 'piège', Formation: 'formation', Invitation: 'invitation', Double: 'double', "Queen's": 'de la dame', "King's": 'du roi',
  Counterattack: 'contre-attaque', Counterthrust: 'contre-poussée', Retreat: 'retraite', Center: 'centre',
  Spanish: 'espagnole', Italian: 'italienne', French: 'française', English: 'anglaise', Russian: 'russe', Hungarian: 'hongroise',
  Scandinavian: 'scandinave', Norwegian: 'norvégienne', Swedish: 'suédoise', Vienna: 'viennoise', Scotch: 'écossaise',
};
const SUFFIXES = { Attack: 'attaque', Gambit: 'gambit', Defense: 'défense', Defence: 'défense', System: 'système', Line: 'ligne', Counterattack: 'contre-attaque' };
export function traduireSegment(s) {
  s = s.trim();
  if (SEGMENTS[s]) return SEGMENTS[s];
  const m = s.match(/^(.+) (Attack|Gambit|Defense|Defence|System|Line|Counterattack)( Accepted| Declined)?$/);
  if (m) { // « X Attack » → « attaque X » (les noms propres restent tels quels)
    const tete = m[1].split(' ').map((w) => (w in MOTS ? MOTS[w] : w)).filter(Boolean).join(' ');
    return `${SUFFIXES[m[2]]} ${tete}${m[3] ? (m[3].trim() === 'Accepted' ? ' accepté' : ' refusé') : ''}`.trim();
  }
  return s.split(' ').map((w) => (w in MOTS ? MOTS[w] : w)).filter(Boolean).join(' ').trim() || s;
}
/** « French Defense: Winawer Variation, Poisoned Pawn Variation » → { famille: 'Française', nom: 'Winawer › Pion empoisonné' } */
export function traduire(name) {
  // Quelques entrées du référentiel ne suivent pas le format « Famille: Segment, Segment » (ex. « French Defense, Classical, 4. Bg5 »).
  if (!name.includes(': ')) {
    const bouts = name.split(',').map((s) => s.trim());
    const fam = traduireSegment(bouts[0]);
    const suite = bouts.slice(1).filter((b) => !/^\d/.test(b)).map(traduireSegment).filter(Boolean);
    return { famille: fam, nom: suite.length ? [fam, ...suite].join(' › ') : fam };
  }
  const [famille, reste] = name.split(': ');
  const fam = traduireSegment(famille);
  const segments = reste ? reste.split(', ').map(traduireSegment).filter(Boolean) : [];
  return { famille: fam, nom: segments.length ? [fam, ...segments].join(' › ') : fam };
}

// ---- référentiel : clé FEN → { eco, name }
export function chargerReferentiel(dossier = 'db/eco') {
  const cle = (c) => c.fen().split(' ').slice(0, 4).join(' ');
  const parFen = new Map(); let n = 0;
  for (const f of readdirSync(dossier).filter((x) => x.endsWith('.tsv')).sort()) {
    for (const ligne of readFileSync(`${dossier}/${f}`, 'utf8').trim().split('\n').slice(1)) {
      const [eco, name, pgn] = ligne.split('\t'); if (!pgn) continue;
      const c = new Chess(); let ok = true;
      for (const s of pgn.replace(/\d+\.\s*/g, '').trim().split(/\s+/)) { try { c.move(s); } catch { ok = false; break; } }
      if (!ok) continue; n++;
      const k = cle(c); if (!parFen.has(k)) parFen.set(k, { eco, name, ...traduire(name) }); // première occurrence = la plus courte
    }
  }
  return { parFen, n };
}

const args = process.argv.slice(2);
if (args[0] === '--essai') {
  const prefixe = args[1] ?? 'C1'; const { parFen, n } = chargerReferentiel();
  console.log(`${n} lignes dans le référentiel ; aperçu des traductions pour ${prefixe}* :`);
  for (const r of [...parFen.values()].filter((r) => r.eco.startsWith(prefixe)).slice(0, 80)) console.log(` ${r.eco} | ${r.name}  →  ${r.famille} › ${r.nom}`);
} else {
  const { pool } = await import('../../coach/db.mjs');
  const { parFen, n } = chargerReferentiel();
  await pool.query('update positions set eco = null, nom_eco = null'); // rejouable : on repart de zéro
  const { rows } = await pool.query('select id, opening_id, fen_key from positions');
  let directs = 0;
  for (const p of rows) {
    const r = parFen.get(p.fen_key); if (!r) continue; directs++;
    await pool.query('update positions set eco = $1, nom_eco = $2 where id = $3', [r.eco, r.nom, p.id]);
  }
  // Héritage : une position que le référentiel ne nomme pas prend le nom de son plus proche ancêtre nommé (on est
  // toujours « dans » cette variante), un niveau de profondeur par passage.
  let herites = 0;
  for (;;) { const r = await pool.query('update positions p set eco = q.eco, nom_eco = q.nom_eco from positions q where p.parent_id = q.id and p.eco is null and q.eco is not null'); if (!r.rowCount) break; herites += r.rowCount; }
  const { rows: stats } = await pool.query('select opening_id, count(*) filter (where eco is not null) as nommees, count(*) as total from positions group by 1 order by 1');
  for (const s of stats) console.log(`${s.opening_id} : ${s.nommees}/${s.total} positions avec un nom ECO`);
  console.log(`TERMINÉ ${directs} positions nommées par le référentiel (${n} lignes), ${herites} par héritage`); await pool.end();
}
