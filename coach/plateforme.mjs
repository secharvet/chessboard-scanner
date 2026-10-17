/**
 * API de la plateforme d'apprentissage (16 octobre 2026) : comptes, livres, positions, coups proposés, explications
 * versionnées par auteur, remarques, vérification au moteur. Contrat : docs/SPEC-EDITEUR-ENSEIGNANT.md § 5.
 * Toutes les règles d'accès sont ici (côté serveur) ; les pages ne font que les refléter.
 */
import { Chess } from 'chess.js';
import { pool } from './db.mjs';
import * as auth from './auth.mjs';

const cle = (c) => c.fen().split(' ').slice(0, 4).join(' ');
const CASE = /^[a-h][1-8]$/; const COULEURS = new Set(['vert', 'bleu', 'rouge', 'orange']);
const tentatives = new Map(); // anti-force-brute connexion : ip -> [timestamps]
const ecritures = new Map(); // écritures par utilisateur : id -> [timestamps] (120 par 10 min)
function tropDEcritures(uid) { const now = Date.now(); const l = (ecritures.get(uid) ?? []).filter((t) => now - t < 10 * 60e3); l.push(now); ecritures.set(uid, l); return l.length > 120; }

function rejouer(coups) { const c = new Chess(); for (const s of (coups ? coups.split(' ') : [])) c.move(s); return c; }
function nettoyerAnnotations(a) {
  if (!Array.isArray(a)) return [];
  return a.filter((x) => x && COULEURS.has(x.couleur) && ((x.type === 'case' && CASE.test(x.case)) || (x.type === 'fleche' && CASE.test(x.de) && CASE.test(x.a))))
    .map((x) => x.type === 'case' ? { type: 'case', case: x.case, couleur: x.couleur } : { type: 'fleche', de: x.de, a: x.a, couleur: x.couleur }).slice(0, 40);
}
const texte = (v, max = 2000) => (typeof v === 'string' ? v.trim().slice(0, max) : '') || null;

// Accès des pages par rôle : matrice éditable par l'admin (onglet Sécurité), source de vérité du menu.
const ROLES_ORDRE = ['apprenant', 'enseignant', 'validateur', 'admin'];
const PAGES_SITE = [
  { id: 'accueil', label: 'Accueil', path: '/accueil.html', section: 'Public' },
  { id: 'ouverture', label: "Assistant d'ouverture", path: '/ouverture.html', section: 'Public' },
  { id: 'index', label: "Lecteur d'ouvertures", path: '/index.html', section: 'Public' },
  { id: 'play', label: 'Jouer contre Stockfish', path: '/play.html', section: 'Public' },
  { id: 'parametres', label: 'Paramètres', path: '/parametres.html', section: 'Public' },
  { id: 'connexion', label: 'Connexion', path: '/connexion.html', section: 'Public' },
  { id: 'editeur', label: 'Éditeur', path: '/editeur.html', section: 'Enseignants' },
  { id: 'guide', label: "Guide de l'enseignant", path: '/guide-enseignant.html', section: 'Enseignants' },
  { id: 'admin', label: 'Administration', path: '/admin.html', section: 'Administration' },
];
const TOUS = ['apprenant', 'enseignant', 'validateur', 'admin'];
const ACCES_DEFAUT = {
  accueil: TOUS, ouverture: TOUS, index: TOUS, play: TOUS, parametres: TOUS, connexion: TOUS,
  editeur: ['enseignant', 'validateur', 'admin'], guide: ['enseignant', 'validateur', 'admin'], admin: ['validateur', 'admin'],
};
let tableAccesPrete = false;
async function assurerTableAcces() { if (tableAccesPrete) return; await pool.query('create table if not exists page_access (page_id text not null, role text not null, allowed boolean not null, primary key (page_id, role))'); tableAccesPrete = true; }
async function lireMatriceAcces() {
  await assurerTableAcces();
  const { rows } = await pool.query('select page_id, role, allowed from page_access');
  const over = {}; for (const r of rows) (over[r.page_id] ??= {})[r.role] = r.allowed;
  const matrice = {};
  for (const p of PAGES_SITE) {
    matrice[p.id] = {};
    for (const role of ROLES_ORDRE) {
      const def = (ACCES_DEFAUT[p.id] ?? []).includes(role);
      matrice[p.id][role] = role === 'admin' ? true : (over[p.id]?.[role] ?? def); // l'admin garde toujours accès (anti-verrouillage)
    }
  }
  return matrice;
}

/** Valide et normalise un `content` d'explication pour une position donnée ; lève une erreur lisible sinon. */
async function normaliserContent(c, position, content) {
  if (!content || typeof content !== 'object') throw new Error('contenu manquant');
  const { rows: moves } = await c.query('select id, san from moves where position_id = $1', [position.id]);
  const sanParId = new Map(moves.map((m) => [m.id, m.san]));
  const coups = [];
  for (const x of Array.isArray(content.coups) ? content.coups : []) {
    const san = sanParId.get(Number(x?.move_id)); if (!san) continue;
    const coup = { move_id: Number(x.move_id), pourquoi: texte(x.pourquoi) ?? '', annotations: nettoyerAnnotations(x.annotations) };
    if (x.sequence && Array.isArray(x.sequence.pas)) {
      const t = rejouer(position.coups); t.move(san); const pas = [];
      for (const p of x.sequence.pas.slice(0, 24)) { try { t.move(p.san); } catch { throw new Error(`séquence après ${san} : coup illégal « ${p.san} »`); } pas.push({ san: p.san, phrase: texte(p.phrase, 400) ?? '', annotations: nettoyerAnnotations(p.annotations) }); }
      coup.sequence = { pas, eval: x.sequence.eval ?? null, origine: texte(x.sequence.origine, 40) ?? 'enseignant' };
    }
    coups.push(coup);
  }
  return { nom: texte(content.nom, 120), sens: texte(content.sens, 2000) ?? '', menace: texte(content.menace, 400), schema: content.schema && typeof content.schema === 'object' ? { blancs: texte(content.schema.blancs, 600), noirs: texte(content.schema.noirs, 600) } : null, annotations: nettoyerAnnotations(content.annotations), coups };
}

async function positionParCoups(opening, coups) {
  let c; try { c = rejouer(coups); } catch { return null; }
  const { rows } = await pool.query('select * from positions where opening_id = $1 and fen_key = $2', [opening, cle(c)]);
  return rows[0] ?? null;
}
async function chargerPosition(id) { const { rows } = await pool.query('select * from positions where id = $1', [id]); return rows[0] ?? null; }

async function reponsePosition(p, u) {
  const { rows: coups } = await pool.query('select id, san, kind, ord, to_position_id, porte_opening_id from moves where position_id = $1 order by ord, id', [p.id]);
  const params = [p.id]; let filtre = `e.status = 'publie'`;
  if (u) { params.push(u.id); filtre = `(e.status = 'publie' or (e.author_id = $2 and e.status = 'brouillon'))`; }
  const { rows: expl } = await pool.query(`select e.id, e.author_id, u.display_name, e.status, e.version, e.content, e.video_url, e.published_at, e.created_at, e.based_on_id
    from explanations e join users u on u.id = e.author_id where e.position_id = $1 and ${filtre} order by e.status = 'publie' desc, e.created_at desc`, params);
  const { rows: ref } = await pool.query('select author_id from reference where opening_id = $1 and (position_id = $2 or position_id is null) order by position_id nulls last limit 1', [p.opening_id, p.id]);
  return { ok: true, position: { id: p.id, livre: p.opening_id, coups: p.coups, fen: rejouer(p.coups).fen(), ply: p.ply },
    coups: coups.map((m) => ({ id: m.id, san: m.san, kind: m.kind, ord: m.ord, to_position: !!m.to_position_id, porte_opening_id: m.porte_opening_id })),
    explications: expl.map((e) => ({ id: e.id, author: { id: e.author_id, display_name: e.display_name }, status: e.status, version: e.version, content: e.content, video_url: e.video_url, published_at: e.published_at, created_at: e.created_at, based_on_id: e.based_on_id })),
    reference_author_id: ref[0]?.author_id ?? null, utilisateur: u ? { id: u.id, role: u.role } : null };
}

// Plafond réglable pour les scénarios de test (AUTH_MAX_TENTATIVES) ; 20 par défaut en production.
const MAX_TENTATIVES = Math.max(1, Number(process.env.AUTH_MAX_TENTATIVES) || 20);
function limiterConnexion(ip) {
  const now = Date.now(); const l = (tentatives.get(ip) ?? []).filter((t) => now - t < 15 * 60e3); l.push(now); tentatives.set(ip, l); return l.length > MAX_TENTATIVES;
}

/** Point d'entrée : renvoie true si la route a été traitée. */
export async function routerPlateforme({ req, res, url, readJson, send, engine, ip }) {
  const path = url.pathname; const m = req.method;
  const u = await auth.utilisateurCourant(req);
  const refuser = (code, msg) => { send(res, code, { ok: false, error: msg }); return true; };
  const exiger = (role) => { if (!u) { refuser(401, 'connexion requise'); return false; } if (!auth.aLeNiveau(u, role)) { refuser(403, `rôle ${role} requis`); return false; }
    if (m !== 'GET' && tropDEcritures(u.id)) { refuser(429, 'trop d\'écritures en peu de temps, attends quelques minutes'); return false; } return true; };

  // ---- comptes
  if (path === '/api/auth/moi' && m === 'GET') { send(res, 200, { ok: true, utilisateur: u ? { id: u.id, email: u.email, display_name: u.display_name, role: u.role, club: u.club } : null }); return true; }
  if (path === '/api/auth/verifier' && m === 'GET') { const role = url.searchParams.get('role') ?? 'enseignant'; if (u && auth.aLeNiveau(u, role)) { send(res, 200, { ok: true }); } else { send(res, 401, { ok: false }); } return true; }
  if (path === '/api/auth/connexion' && m === 'POST') {
    if (limiterConnexion(ip)) return refuser(429, 'trop de tentatives, réessaie dans un quart d\'heure');
    const b = await readJson(req); const uid = await auth.connecter(b.email, b.mot_de_passe);
    if (!uid) return refuser(401, 'courriel ou mot de passe incorrect');
    const sid = await auth.ouvrirSession(uid, req.headers['user-agent'] ?? ''); res.setHeader('Set-Cookie', auth.cookieSession(sid));
    const { rows } = await pool.query('select id, email, display_name, role, club from users where id = $1', [uid]);
    send(res, 200, { ok: true, utilisateur: rows[0] }); return true;
  }
  if (path === '/api/auth/mot-de-passe' && m === 'POST') {
    if (!u) return refuser(401, 'connexion requise'); const b = await readJson(req);
    if (!b.nouveau || String(b.nouveau).length < 10) return refuser(400, 'nouveau mot de passe trop court (10 caractères au moins)');
    const { rows } = await pool.query('select password_hash from users where id = $1', [u.id]);
    if (!auth.verifierMotDePasse(String(b.actuel ?? ''), rows[0]?.password_hash)) return refuser(401, 'mot de passe actuel incorrect');
    await pool.query('update users set password_hash = $1 where id = $2', [auth.hacher(String(b.nouveau)), u.id]);
    await pool.query('delete from sessions where user_id = $1 and id <> $2', [u.id, u.sid]);  // les autres appareils sont déconnectés
    send(res, 200, { ok: true }); return true;
  }
  if (path === '/api/auth/deconnexion' && m === 'POST') { await auth.fermerSession(u?.sid); res.setHeader('Set-Cookie', auth.cookieEffacement()); send(res, 200, { ok: true }); return true; }
  let mm = path.match(/^\/api\/auth\/invitation\/([A-Za-z0-9_-]+)$/);
  if (mm && m === 'GET') { const inv = await auth.lireInvitation(mm[1]); if (!inv) return refuser(404, 'invitation inconnue ou expirée'); send(res, 200, { ok: true, email: inv.email, role: inv.role, club: inv.club }); return true; }
  if (mm && m === 'POST') {
    const b = await readJson(req);
    try { const uid = await auth.accepterInvitation(mm[1], { motDePasse: b.mot_de_passe, displayName: b.display_name, licence: !!b.licence });
      const sid = await auth.ouvrirSession(uid, req.headers['user-agent'] ?? ''); res.setHeader('Set-Cookie', auth.cookieSession(sid));
      const { rows } = await pool.query('select id, email, display_name, role, club from users where id = $1', [uid]); send(res, 200, { ok: true, utilisateur: rows[0] }); }
    catch (e) { return refuser(400, e.message); }
    return true;
  }
  // ---- administration
  if (path === '/api/admin/invitations' && m === 'POST') {
    if (!exiger('validateur')) return true;
    const b = await readJson(req); const role = b.role ?? 'enseignant';
    if (!auth.ROLES.includes(role)) return refuser(400, 'rôle invalide');
    if (auth.NIVEAU[role] >= auth.NIVEAU.validateur && !auth.aLeNiveau(u, 'admin')) return refuser(403, 'seul un administrateur invite un validateur ou un administrateur');
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(b.email ?? '')) return refuser(400, 'courriel invalide');
    const token = await auth.creerInvitation({ email: b.email, role, club: b.club ?? u.club, invitedBy: u.id });
    send(res, 200, { ok: true, token, lien: `/connexion.html?invitation=${token}` }); return true;
  }
  if (path === '/api/admin/utilisateurs' && m === 'GET') {
    if (!exiger('validateur')) return true;
    const { rows } = await pool.query(`select u.id, u.email, u.display_name, u.role, u.club, u.created_at,
      (select count(*) from explanations e where e.author_id = u.id and e.status = 'publie') as publiees from users u order by u.created_at`);
    send(res, 200, { ok: true, utilisateurs: rows }); return true;
  }
  if (path === '/api/admin/reference' && m === 'POST') {
    if (!exiger('admin')) return true; const b = await readJson(req);
    await pool.query('delete from reference where opening_id = $1 and coalesce(position_id, 0) = coalesce($2, 0)', [b.livre, b.position_id ?? null]);
    await pool.query('insert into reference (opening_id, position_id, author_id) values ($1,$2,$3)', [b.livre, b.position_id ?? null, b.author_id]); send(res, 200, { ok: true }); return true;
  }
  // ---- accès des pages par rôle (matrice de sécurité, onglet Sécurité de l'administration)
  if (path === '/api/acces' && m === 'GET') { send(res, 200, { ok: true, pages: PAGES_SITE, roles: ROLES_ORDRE, matrice: await lireMatriceAcces() }); return true; }
  if (path === '/api/admin/acces' && m === 'PUT') {
    if (!exiger('admin')) return true; const b = await readJson(req);
    const chs = Array.isArray(b.changements) ? b.changements : [];
    const cx = await pool.connect();
    try {
      await assurerTableAcces(); await cx.query('begin');
      for (const ch of chs) {
        if (!PAGES_SITE.some((p) => p.id === ch.page_id) || !ROLES_ORDRE.includes(ch.role) || ch.role === 'admin') continue;
        await cx.query('insert into page_access (page_id, role, allowed) values ($1,$2,$3) on conflict (page_id, role) do update set allowed = excluded.allowed', [ch.page_id, ch.role, !!ch.allowed]);
      }
      await cx.query('commit');
    } catch (e) { await cx.query('rollback'); return refuser(500, e.message); } finally { cx.release(); }
    send(res, 200, { ok: true, matrice: await lireMatriceAcces() }); return true;
  }

  // ---- lecture
  if (path === '/api/livres' && m === 'GET') {
    const { rows } = await pool.query(`select o.id, o.nom, o.signature, o.ordre,
      (select count(*) from positions p where p.opening_id = o.id) as positions,
      (select json_agg(json_build_object('id', a.id, 'display_name', a.display_name, 'positions', a.n) order by a.n desc) from
         (select e.author_id as id, u.display_name, count(*) as n from explanations e join users u on u.id = e.author_id join positions p on p.id = e.position_id
          where p.opening_id = o.id and e.status = 'publie' group by e.author_id, u.display_name) a) as auteurs
      from openings o order by o.ordre`);
    send(res, 200, { ok: true, livres: rows.map((r) => ({ ...r, positions: Number(r.positions), auteurs: r.auteurs ?? [] })) }); return true;
  }
  if (path === '/api/positions' && m === 'GET') {
    const livre = url.searchParams.get('livre'); const coups = (url.searchParams.get('coups') ?? '').trim();
    if (!livre) return refuser(400, 'paramètre livre requis');
    let p = await positionParCoups(livre, coups);
    if (!p && u && auth.aLeNiveau(u, 'enseignant') && coups) {
      // un enseignant prolonge une ligne : si la position parente est connue et le coup légal, on crée la position
      const list = coups.split(' '); const parent = await positionParCoups(livre, list.slice(0, -1).join(' '));
      if (parent) {
        const c = rejouer(parent.coups); let mv = null; try { mv = c.move(list.at(-1)); } catch { mv = null; }
        if (mv) {
          const r = await pool.query(`insert into positions (opening_id, fen_key, coups, ply, parent_id) values ($1,$2,$3,$4,$5) on conflict (opening_id, fen_key) do update set coups = positions.coups returning *`, [livre, cle(c), `${parent.coups} ${mv.san}`.trim(), parent.ply + 1, parent.id]);
          p = r.rows[0];
          await pool.query(`update moves set to_position_id = $1 where position_id = $2 and san = $3 and to_position_id is null`, [p.id, parent.id, mv.san]);
        }
      }
    }
    if (!p) { // la plus longue ligne connue, pour renvoyer l'apprenant au bon endroit
      const list = coups ? coups.split(' ') : []; let connu = '';
      for (let n = list.length - 1; n >= 0; n--) { if (await positionParCoups(livre, list.slice(0, n).join(' '))) { connu = list.slice(0, n).join(' '); break; } }
      return refuser(404, `position hors du livre${connu !== null ? ` (connue jusqu'à : ${connu || 'position de départ'})` : ''}`);
    }
    send(res, 200, await reponsePosition(p, u)); return true;
  }
  mm = path.match(/^\/api\/positions\/(\d+)\/coups\/ordre$/);
  if (mm && m === 'PATCH') {
    if (!exiger('enseignant')) return true; const p = await chargerPosition(Number(mm[1])); if (!p) return refuser(404, 'position inconnue');
    const b = await readJson(req); const ids = Array.isArray(b.ids) ? b.ids.map(Number).filter(Number.isFinite) : [];
    const { rows: moves } = await pool.query('select id, kind from moves where position_id = $1', [p.id]); const connus = new Set(moves.map((x) => Number(x.id)));
    if (!ids.length || !ids.every((id) => connus.has(id))) return refuser(400, 'liste de coups invalide');
    const cx = await pool.connect();
    try { await cx.query('begin'); for (const [i, id] of ids.entries()) await cx.query('update moves set ord = $1 where id = $2 and position_id = $3', [i, id, p.id]); await cx.query('commit'); }
    catch (e) { await cx.query('rollback'); return refuser(500, e.message); } finally { cx.release(); }
    const { rows } = await pool.query('select id, san, kind, ord from moves where position_id = $1 order by ord, id', [p.id]); send(res, 200, { ok: true, coups: rows }); return true;
  }
  mm = path.match(/^\/api\/positions\/(\d+)\/(coups|explication|historique)$/);
  if (mm) {
    const p = await chargerPosition(Number(mm[1])); if (!p) return refuser(404, 'position inconnue');
    if (mm[2] === 'coups' && m === 'POST') {
      if (!exiger('enseignant')) return true; const b = await readJson(req);
      const kind = ['principal', 'variante', 'faute'].includes(b.kind) ? b.kind : 'variante';
      if (kind === 'principal' && !auth.aLeNiveau(u, 'validateur')) return refuser(403, 'changer le coup principal demande le rôle validateur ; propose-le en variante');
      const c = rejouer(p.coups); let mv; try { mv = c.move(b.san); } catch { return refuser(400, `coup illégal : ${b.san}`); }
      const cx = await pool.connect();
      try {
        await cx.query('begin');
        // la position d'arrivée est créée si besoin, pour pouvoir y écrire ensuite
        const to = await cx.query(`insert into positions (opening_id, fen_key, coups, ply, parent_id) values ($1,$2,$3,$4,$5) on conflict (opening_id, fen_key) do update set coups = positions.coups returning id`, [p.opening_id, cle(c), `${p.coups} ${mv.san}`.trim(), p.ply + 1, p.id]);
        if (kind === 'principal') await cx.query(`update moves set kind = 'variante' where position_id = $1 and kind = 'principal'`, [p.id]);
        const { rows: ordre } = await cx.query('select coalesce(max(ord), -1) + 1 as o from moves where position_id = $1', [p.id]);
        const r = await cx.query(`insert into moves (position_id, san, kind, ord, to_position_id, created_by) values ($1,$2,$3,$4,$5,$6)
          on conflict (position_id, san) do update set kind = excluded.kind returning id, san, kind, ord, to_position_id`, [p.id, mv.san, kind, kind === 'principal' ? 0 : ordre[0].o, to.rows[0].id, u.id]);
        await cx.query('commit'); send(res, 200, { ok: true, coup: { ...r.rows[0], to_position: true } });
      } catch (e) { await cx.query('rollback'); return refuser(500, e.message); } finally { cx.release(); }
      return true;
    }
    if (mm[2] === 'explication' && m === 'PUT') {
      if (!exiger('enseignant')) return true; const b = await readJson(req);
      let content; try { content = await normaliserContent(pool, p, b.content); } catch (e) { return refuser(400, e.message); }
      const cx = await pool.connect();
      try {
        await cx.query('begin');
        await cx.query(`update explanations set status = 'archive' where position_id = $1 and author_id = $2 and status = 'brouillon'`, [p.id, u.id]);
        const { rows: v } = await cx.query('select coalesce(max(version), 0) + 1 as v from explanations where position_id = $1 and author_id = $2', [p.id, u.id]);
        const r = await cx.query(`insert into explanations (position_id, author_id, version, status, based_on_id, content, video_url) values ($1,$2,$3,'brouillon',$4,$5,$6) returning id, version, status, content, video_url, created_at`, [p.id, u.id, v[0].v, b.based_on_id ?? null, JSON.stringify(content), texte(b.video_url, 300)]);
        await cx.query('commit'); send(res, 200, { ok: true, explication: { ...r.rows[0], author: { id: u.id, display_name: u.display_name } } });
      } catch (e) { await cx.query('rollback'); return refuser(500, e.message); } finally { cx.release(); }
      return true;
    }
    if (mm[2] === 'historique' && m === 'GET') {
      if (!exiger('enseignant')) return true;
      const { rows: versions } = await pool.query(`select e.id, e.author_id, us.display_name, e.version, e.status, e.created_at, e.published_at, e.based_on_id
        from explanations e join users us on us.id = e.author_id where e.position_id = $1 and (e.author_id = $2 or e.status = 'publie') order by e.created_at desc`, [p.id, u.id]);
      const ids = versions.map((v) => v.id);
      const { rows: remarques } = ids.length ? await pool.query(`select r.id, r.explanation_id, r.author_id, us.display_name, r.texte, r.created_at from remarks r join users us on us.id = r.author_id where r.explanation_id = any($1) order by r.created_at`, [ids]) : { rows: [] };
      send(res, 200, { ok: true, versions: versions.map((v) => ({ id: v.id, author: { id: v.author_id, display_name: v.display_name }, version: v.version, status: v.status, created_at: v.created_at, published_at: v.published_at, based_on_id: v.based_on_id })), remarques: remarques.map((r) => ({ id: r.id, explanation_id: r.explanation_id, author: { id: r.author_id, display_name: r.display_name }, texte: r.texte, created_at: r.created_at })) }); return true;
    }
  }
  mm = path.match(/^\/api\/explications\/(\d+)\/(publier|reprendre|remarques|contenu)$/);
  if (mm) {
    const { rows } = await pool.query('select * from explanations where id = $1', [Number(mm[1])]); const e = rows[0]; if (!e) return refuser(404, 'explication inconnue');
    if (mm[2] === 'contenu' && m === 'GET') { if (e.status !== 'publie' && e.author_id !== u?.id) return refuser(403, 'non visible'); send(res, 200, { ok: true, explication: e }); return true; }
    if (!exiger('enseignant')) return true;
    if (mm[2] === 'publier' && m === 'POST') {
      if (e.author_id !== u.id) return refuser(403, 'on ne publie que ses propres textes');
      const cx = await pool.connect();
      try { await cx.query('begin'); await cx.query(`update explanations set status = 'archive' where position_id = $1 and author_id = $2 and status = 'publie'`, [e.position_id, u.id]);
        const r = await cx.query(`update explanations set status = 'publie', published_at = now() where id = $1 returning id, version, status, published_at`, [e.id]); await cx.query('commit'); send(res, 200, { ok: true, explication: r.rows[0] }); }
      catch (err) { await cx.query('rollback'); return refuser(500, err.message); } finally { cx.release(); }
      return true;
    }
    if (mm[2] === 'reprendre' && m === 'POST') {
      if (e.status !== 'publie' && e.author_id !== u.id) return refuser(403, 'ce texte n\'est pas visible');
      const cx = await pool.connect();
      try { await cx.query('begin'); await cx.query(`update explanations set status = 'archive' where position_id = $1 and author_id = $2 and status = 'brouillon'`, [e.position_id, u.id]);
        const { rows: v } = await cx.query('select coalesce(max(version), 0) + 1 as v from explanations where position_id = $1 and author_id = $2', [e.position_id, u.id]);
        const r = await cx.query(`insert into explanations (position_id, author_id, version, status, based_on_id, content, video_url) values ($1,$2,$3,'brouillon',$4,$5,$6) returning id, version, status, content, video_url, created_at, based_on_id`, [e.position_id, u.id, v[0].v, e.id, e.content, e.video_url]);
        await cx.query('commit'); send(res, 200, { ok: true, explication: { ...r.rows[0], author: { id: u.id, display_name: u.display_name } } }); }
      catch (err) { await cx.query('rollback'); return refuser(500, err.message); } finally { cx.release(); }
      return true;
    }
    if (mm[2] === 'remarques' && m === 'POST') {
      const b = await readJson(req); const t = texte(b.texte, 2000); if (!t) return refuser(400, 'remarque vide');
      if (e.status !== 'publie') return refuser(400, 'on ne commente qu\'une version publiée');
      await pool.query('insert into remarks (explanation_id, author_id, texte) values ($1,$2,$3)', [e.id, u.id, t]); send(res, 200, { ok: true }); return true;
    }
  }
  // ---- vérification au moteur (non bloquante côté éditeur)
  if (path === '/api/verifier' && m === 'POST') {
    if (!exiger('enseignant')) return true; const b = await readJson(req);
    const p = await chargerPosition(Number(b.position_id)); if (!p) return refuser(404, 'position inconnue');
    let content; try { content = await normaliserContent(pool, p, b.content ?? {}); } catch (e) { send(res, 200, { ok: true, avertissements: [e.message], coups: [] }); return true; }
    const avert = []; const c = rejouer(p.coups); const lignes = engine ? await engine.analyze(c.fen(), { depth: 14, multipv: 8 }) : [];
    const cp = (s) => (s.type === 'mate' ? (s.value > 0 ? 10000 : -10000) : s.value);
    const top = lignes.map((l, i) => { const t = new Chess(c.fen()); const mv = t.move({ from: l.pv[0].slice(0, 2), to: l.pv[0].slice(2, 4), promotion: l.pv[0][4] }); return { san: mv.san, cp: cp(l.score), rang: i + 1 }; });
    const best = top[0]?.cp ?? 0; const { rows: moves } = await pool.query('select id, san, kind from moves where position_id = $1', [p.id]);
    const detail = content.coups.map((x) => { const mv = moves.find((y) => Number(y.id) === Number(x.move_id)); const t = top.find((y) => y.san === mv?.san); const ecart = t ? (best - t.cp) / 100 : null;
      if (mv?.kind === 'faute' && t && ecart < 0.3) avert.push(`${mv.san} est marqué faute, mais le moteur le classe ${t.rang}e à ${ecart.toFixed(2)} pion du meilleur : pas une faute nette`);
      if (mv?.kind === 'principal' && (!t || ecart > 0.4)) avert.push(`${mv.san} est le coup principal, mais le moteur ${t ? `le met à ${ecart.toFixed(2)} pion du meilleur` : 'ne le met pas dans ses huit premiers'}`);
      return { move_id: x.move_id, san: mv?.san, rang: t?.rang ?? null, ecart }; });
    send(res, 200, { ok: true, avertissements: avert, coups: detail, meilleur: top[0]?.san ?? null }); return true;
  }
  return false;
}
