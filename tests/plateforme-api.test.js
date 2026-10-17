// Tests de bout en bout de l'API de la plateforme contre le serveur local (127.0.0.1:8000, conteneur chess-api).
// Sautés si le serveur ou la base ne répondent pas (par exemple sur DENEB). Ils créent un compte de test jetable.
import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';

const BASE = process.env.PLATEFORME_URL ?? 'http://127.0.0.1:8000';
let dispo = false;
try { const r = await fetch(`${BASE}/db-health`); dispo = r.ok; } catch { dispo = false; }
// le test écrit aussi directement en base : il faut que Postgres soit joignable d'ici (vrai dans le conteneur chess-api,
// faux sur l'hôte où Postgres n'est pas publié) ; sinon on saute plutôt que d'échouer.
if (dispo) { try { const pg = (await import('pg')).default; const c = new pg.Client({ connectionTimeoutMillis: 1500 }); await c.connect(); await c.end(); } catch { dispo = false; } }

// client minimal avec cookie de session
function client() {
  let cookie = '';
  return async (method, path, body) => {
    const res = await fetch(BASE + path, { method, headers: { 'Content-Type': 'application/json', ...(cookie ? { Cookie: cookie } : {}) }, body: body ? JSON.stringify(body) : undefined });
    const sc = res.headers.get('set-cookie'); if (sc) cookie = sc.split(';')[0];
    return { status: res.status, json: await res.json().catch(() => ({})) };
  };
}

test('plateforme : invitation, connexion, écriture, publication, historique, remarque, vérification', { skip: !dispo && 'serveur local indisponible' }, async () => {
  // une invitation créée directement en base (l'API exige un validateur ; ici on part de zéro)
  const { pool } = await import('../coach/db.mjs');
  const { creerInvitation, hacher } = await import('../coach/auth.mjs');
  const suffixe = randomUUID().slice(0, 8);
  const emailProf = `prof-${suffixe}@test.local`; const emailVal = `val-${suffixe}@test.local`;
  const nomProf = `Prof Test ${suffixe}`;
  // restes d'exécutions précédentes interrompues : on nettoie avant de commencer
  const anciens = (await pool.query(`select id from users where email like '%@test.local'`)).rows.map((x) => x.id);
  if (anciens.length) { await pool.query('delete from remarks where author_id = any($1)', [anciens]); await pool.query('delete from explanations where author_id = any($1)', [anciens]); await pool.query('delete from moves where created_by = any($1)', [anciens]); await pool.query('delete from users where id = any($1)', [anciens]); }
  await pool.query(`delete from invitations where email like '%@test.local'`);
  const tokenProf = await creerInvitation({ email: emailProf, role: 'enseignant', club: 'Club test', invitedBy: null });
  const tokenVal = await creerInvitation({ email: emailVal, role: 'validateur', club: 'Club test', invitedBy: null });

  const prof = client(); const val = client(); const anonyme = client();
  // invitation : lecture puis acceptation (licence obligatoire pour un enseignant)
  let r = await prof('GET', `/api/auth/invitation/${tokenProf}`); assert.equal(r.json.email, emailProf);
  r = await prof('POST', `/api/auth/invitation/${tokenProf}`, { mot_de_passe: 'motdepasse-solide', display_name: nomProf, licence: false });
  assert.equal(r.status, 400, 'sans licence : refus');
  r = await prof('POST', `/api/auth/invitation/${tokenProf}`, { mot_de_passe: 'motdepasse-solide', display_name: nomProf, licence: true });
  assert.equal(r.status, 200); assert.equal(r.json.utilisateur.role, 'enseignant');
  r = await prof('GET', `/api/auth/invitation/${tokenProf}`); assert.equal(r.status, 404, 'jeton à usage unique');
  r = await val('POST', `/api/auth/invitation/${tokenVal}`, { mot_de_passe: 'motdepasse-solide', display_name: 'Validateur Test', licence: true }); assert.equal(r.status, 200);

  // garde : l'anonyme ne voit pas les brouillons et ne peut pas écrire
  r = await anonyme('GET', '/api/auth/verifier'); assert.equal(r.status, 401);
  r = await prof('GET', '/api/auth/verifier'); assert.equal(r.status, 200);
  r = await prof('GET', '/api/auth/verifier?role=validateur'); assert.equal(r.status, 401);

  // lecture d'une position
  r = await prof('GET', '/api/positions?livre=francaise&coups=e4%20e6%20d4%20d5'); assert.equal(r.status, 200);
  const pos = r.json.position; const coups = r.json.coups; assert.ok(coups.length >= 4); const ia = r.json.explications.find((e) => e.author.display_name === 'IA (brouillon)'); assert.ok(ia);
  r = await anonyme('PUT', `/api/positions/${pos.id}/explication`, { content: { sens: 'x' } }); assert.equal(r.status, 401);

  // ajout d'un coup : variante libre, principal refusé au prof, accepté au validateur
  r = await prof('POST', `/api/positions/${pos.id}/coups`, { san: 'Nf3', kind: 'variante' }); assert.equal(r.status, 200); assert.equal(r.json.coup.san, 'Nf3');
  r = await prof('POST', `/api/positions/${pos.id}/coups`, { san: 'Nf3', kind: 'principal' }); assert.equal(r.status, 403);
  r = await prof('POST', `/api/positions/${pos.id}/coups`, { san: 'O-O', kind: 'faute' }); assert.equal(r.status, 400, 'coup illégal refusé');

  // réordonner les coups : l'ordre renvoyé suit la liste envoyée ; liste invalide refusée ; anonyme refusé
  r = await prof('GET', `/api/positions?livre=francaise&coups=e4%20e6%20d4%20d5`); const ordreInitial = r.json.coups.map((c) => c.id);
  const inverse = [...ordreInitial].reverse();
  r = await prof('PATCH', `/api/positions/${pos.id}/coups/ordre`, { ids: inverse }); assert.equal(r.status, 200); assert.deepEqual(r.json.coups.map((c) => c.id), inverse);
  r = await prof('PATCH', `/api/positions/${pos.id}/coups/ordre`, { ids: [999999] }); assert.equal(r.status, 400);
  r = await anonyme('PATCH', `/api/positions/${pos.id}/coups/ordre`, { ids: ordreInitial }); assert.equal(r.status, 401);
  r = await prof('PATCH', `/api/positions/${pos.id}/coups/ordre`, { ids: ordreInitial }); assert.equal(r.status, 200, 'ordre rétabli');

  // brouillon : contenu normalisé (coup inconnu ignoré, séquence vérifiée)
  const principal = coups.find((c) => c.kind === 'principal');
  const content = { nom: 'Essai', sens: 'un texte de test', menace: null, annotations: [{ type: 'case', case: 'e5', couleur: 'vert' }, { type: 'fleche', de: 'e4', a: 'e5', couleur: 'vert' }, { type: 'case', case: 'z9', couleur: 'vert' }],
    coups: [{ move_id: principal.id, pourquoi: 'pourquoi de test', annotations: [], sequence: { pas: [{ san: 'c5', phrase: 'levier' }, { san: 'c3', phrase: '' }] } }, { move_id: 999999, pourquoi: 'inconnu' }] };
  r = await prof('PUT', `/api/positions/${pos.id}/explication`, { content, video_url: 'https://exemple.test/v' }); assert.equal(r.status, 200);
  const brouillon = r.json.explication; assert.equal(brouillon.status, 'brouillon'); assert.equal(brouillon.content.annotations.length, 2, 'case invalide retirée'); assert.equal(brouillon.content.coups.length, 1, 'coup inconnu retiré'); assert.equal(brouillon.content.coups[0].sequence.pas.length, 2);
  r = await prof('PUT', `/api/positions/${pos.id}/explication`, { content: { ...content, coups: [{ move_id: principal.id, pourquoi: 'x', sequence: { pas: [{ san: 'Ke8' }] } }] } }); assert.equal(r.status, 400, 'séquence illégale refusée');

  // la lecture publique ne montre pas le brouillon ; l'auteur le voit
  r = await anonyme('GET', `/api/positions?livre=francaise&coups=e4%20e6%20d4%20d5`); assert.ok(!r.json.explications.some((e) => e.author.display_name === nomProf));
  r = await prof('GET', `/api/positions?livre=francaise&coups=e4%20e6%20d4%20d5`); assert.ok(r.json.explications.some((e) => e.author.display_name === nomProf && e.status === 'brouillon'));

  // publication, puis nouvelle version qui remplace la publiée
  r = await val('POST', `/api/explications/${brouillon.id}/publier`); assert.equal(r.status, 403, 'on ne publie que ses textes');
  r = await prof('POST', `/api/explications/${brouillon.id}/publier`); assert.equal(r.status, 200);
  r = await anonyme('GET', `/api/positions?livre=francaise&coups=e4%20e6%20d4%20d5`); assert.ok(r.json.explications.some((e) => e.author.display_name === nomProf && e.status === 'publie'));
  r = await prof('PUT', `/api/positions/${pos.id}/explication`, { content: { ...content, sens: 'version 2' } }); const v2 = r.json.explication; assert.equal(v2.version, 2);
  r = await prof('POST', `/api/explications/${v2.id}/publier`); assert.equal(r.status, 200);
  r = await prof('GET', `/api/positions/${pos.id}/historique`); const miennes = r.json.versions.filter((v) => v.author.display_name === nomProf); assert.equal(miennes.filter((v) => v.status === 'publie').length, 1, 'une seule version publiée'); assert.equal(miennes.length, 2);

  // reprendre le texte de l'IA, remarque du validateur, vérification au moteur
  r = await val('POST', `/api/explications/${ia.id}/reprendre`); assert.equal(r.status, 200); assert.equal(r.json.explication.based_on_id, ia.id); assert.equal(r.json.explication.content.sens, ia.content.sens);
  r = await val('POST', `/api/explications/${v2.id}/remarques`, { texte: 'D\'accord, mais j\'ajouterais …' }); assert.equal(r.status, 200);
  r = await prof('GET', `/api/positions/${pos.id}/historique`); assert.ok(r.json.remarques.some((x) => x.explanation_id === v2.id));
  r = await prof('POST', '/api/verifier', { position_id: pos.id, content: ia.content }); assert.equal(r.status, 200); assert.ok(Array.isArray(r.json.avertissements)); assert.ok(r.json.coups.length > 0);

  // déconnexion
  r = await prof('POST', '/api/auth/deconnexion'); r = await prof('GET', '/api/auth/moi'); assert.equal(r.json.utilisateur, null);

  // nettoyage des comptes de test (cascade sur sessions ; explications/remarques/coups du test retirés)
  const ids = (await pool.query('select id from users where email = any($1)', [[emailProf, emailVal]])).rows.map((x) => x.id);
  await pool.query('delete from remarks where author_id = any($1)', [ids]);
  await pool.query('delete from explanations where author_id = any($1)', [ids]);
  await pool.query('delete from moves where created_by = any($1)', [ids]);
  await pool.query('delete from users where id = any($1)', [ids]);
  await pool.query('delete from invitations where email = any($1)', [[emailProf, emailVal]]);
  await pool.end();
});
