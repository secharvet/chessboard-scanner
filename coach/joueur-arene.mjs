/**
 * L'arène « faire jouer le coach » côté serveur (coach/plateforme.mjs → routes `/api/joueur/...`). UNE partie à la fois pour
 * tout le site. Un enfant `scripts/joueur/partie.mjs --flux` joue ; chaque ligne JSON de son stdout (debut / coup / examen /
 * fin) est mémorisée et diffusée en Server-Sent Events à tous les spectateurs. Un nouvel arrivant reçoit d'abord le
 * rattrapage (toutes les lignes déjà émises), puis le direct. Le lancement est réservé à l'appelant (la route exige le rôle
 * enseignant) ; assister est public.
 */
import { spawn } from 'node:child_process';
import { createInterface } from 'node:readline';
import { fileURLToPath } from 'node:url';

const RACINE = fileURLToPath(new URL('..', import.meta.url)); // racine du dépôt (parent de coach/)

/** Le choix de la page → les options de l'arène. `maia` | `bride` (élo) | `pleine` (profondeur bornée). */
export function argsAdversaire({ adversaire, elo }) {
  if (adversaire === 'maia') return ['--adversaire', 'maia'];
  if (adversaire === 'bride') { const e = [1200, 1500, 1800, 2000].includes(Number(elo)) ? Number(elo) : 1500; return ['--adversaire', 'sf1500', '--elo', String(e)]; }
  if (adversaire === 'pleine') return ['--adversaire', 'sf', '--depth', '10']; // pleine force, profondeur bornée (GE/Sébastien)
  throw new Error('adversaire inconnu (maia | bride | pleine)');
}

let courante = null; // { id, meta, camp, debut, lignes[], coups[], examen, spectateurs:Set, fini, resultat, enfant }

/** L'état de la partie en cours (ou son absence), pour `GET /api/joueur/en-cours` et le rattrapage d'un nouvel arrivant. */
export function etat() {
  if (!courante) return { enCours: false };
  return { enCours: !courante.fini, fini: courante.fini, id: courante.id, adversaire: courante.meta, camp: courante.camp,
    debut: courante.debut, coups: courante.coups, examen: courante.examen ?? null, resultat: courante.resultat ?? null };
}

/** Lance une partie (refuse si une est déjà en cours). `spawnFn`/`cwd`/`graine` injectables pour les tests. */
export function lancer(params, { spawnFn = spawn, cwd = RACINE, graine } = {}) {
  if (courante && !courante.fini) { const e = new Error('une partie est déjà en cours'); e.occupe = true; throw e; }
  const camp = params.camp === 'b' ? 'b' : 'w';
  const budget = Math.min(Math.max(Number(params.budget) || 200000, 1000), 400000); // défaut 200000 (démo ~3 s/coup), plafond 400000
  const g = graine ?? ((Math.random() * 1e9) >>> 0);
  const args = ['scripts/joueur/partie.mjs', '--flux', '--camp', camp, '--budget', String(budget), '--graine', String(g), '--sortie', 'parties', ...argsAdversaire(params)];
  // le joueur « arbre » (joueur-arbre.mjs) au lieu du coach par défaut, et la mesure du trou en direct, sur demande du lancement
  if (params.joueur === 'arbre') args.push('--joueur', 'coach/joueur/joueur-arbre.mjs');
  if (params.trou) args.push('--trou');
  const enfant = spawnFn('node', args, { cwd });
  courante = { id: null, meta: null, camp, debut: Date.now(), lignes: [], coups: [], examen: null, spectateurs: new Set(), fini: false, resultat: null, enfant };
  const rl = createInterface({ input: enfant.stdout });
  rl.on('line', (l) => traiterLigne(l));
  enfant.stderr?.on('data', () => {}); // la progression (stderr) est ignorée
  enfant.on('exit', (code) => { if (courante && !courante.fini) { const o = { ev: 'fin', erreur: `arrêt inattendu (code ${code})`, resultat: null }; appliquer(o, JSON.stringify(o)); cloturer(); } });
  return { id: courante.id, camp, budget };
}

function traiterLigne(l) {
  let o; try { o = JSON.parse(l); } catch { return; }
  appliquer(o, l);
  if (o.ev === 'fin') cloturer();
}

function appliquer(o, l) {
  courante.lignes.push(l);
  if (o.ev === 'debut') { courante.id = o.id; courante.meta = o.adversaire; }
  else if (o.ev === 'coup') courante.coups.push(o.coup);
  else if (o.ev === 'examen') courante.examen = o.examen;
  else if (o.ev === 'fin') courante.resultat = o.resultat ?? null;
  diffuser(l);
}

function diffuser(l) { for (const res of courante.spectateurs) { try { res.write(`data: ${l}\n\n`); } catch { /* spectateur parti */ } } }

function cloturer() { courante.fini = true; for (const res of courante.spectateurs) { try { res.end(); } catch { /* déjà fermé */ } } courante.spectateurs.clear(); }

/** Branche un spectateur (SSE) : en-têtes, rattrapage des lignes déjà émises, puis direct jusqu'à la fin. */
export function brancher(res) {
  res.writeHead(200, { 'Content-Type': 'text/event-stream; charset=utf-8', 'Cache-Control': 'no-cache', Connection: 'keep-alive', 'X-Accel-Buffering': 'no' });
  if (!courante) { res.write(`data: ${JSON.stringify({ ev: 'vide' })}\n\n`); res.end(); return; }
  for (const l of courante.lignes) res.write(`data: ${l}\n\n`); // rattrapage
  if (courante.fini) { res.end(); return; }
  courante.spectateurs.add(res);
  res.on?.('close', () => courante?.spectateurs.delete(res));
}

/** Pour les tests : remet l'arène à zéro. */
export function _reinit() { courante = null; }
