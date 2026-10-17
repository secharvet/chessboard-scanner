/**
 * Comptes et sessions (16 octobre 2026). Mots de passe : scrypt natif de Node (pas de dépendance). Sessions en base,
 * cookie HttpOnly/Secure/SameSite=Lax, 30 jours. Invitations : jeton à usage unique, 7 jours.
 */
import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { pool } from './db.mjs';

export const ROLES = ['apprenant', 'enseignant', 'validateur', 'admin'];
export const NIVEAU = { apprenant: 0, enseignant: 1, validateur: 2, admin: 3 };
const COOKIE = 'chess_session'; const DUREE_SESSION_J = 30; const DUREE_INVIT_J = 7;

export function hacher(motDePasse) {
  const sel = randomBytes(16); const h = scryptSync(motDePasse, sel, 64, { N: 16384, r: 8, p: 1 });
  return `scrypt$${sel.toString('base64')}$${h.toString('base64')}`;
}
export function verifierMotDePasse(motDePasse, stocke) {
  if (!stocke || !stocke.startsWith('scrypt$')) return false;
  const [, sel, h] = stocke.split('$'); const calc = scryptSync(motDePasse, Buffer.from(sel, 'base64'), 64, { N: 16384, r: 8, p: 1 });
  const ref = Buffer.from(h, 'base64'); return ref.length === calc.length && timingSafeEqual(ref, calc);
}
export function lireCookies(req) {
  const out = {}; for (const part of (req.headers.cookie ?? '').split(';')) { const i = part.indexOf('='); if (i > 0) out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim()); } return out;
}
export function cookieSession(id, maxAgeS = DUREE_SESSION_J * 86400) {
  return `${COOKIE}=${id}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAgeS}`;
}
export const cookieEffacement = () => `${COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;

/** Utilisateur de la requête (ou null). Prolonge la session si elle a plus d'un jour. */
export async function utilisateurCourant(req) {
  const sid = lireCookies(req)[COOKIE]; if (!sid) return null;
  const { rows } = await pool.query(`select u.id, u.email, u.display_name, u.role, u.club, s.id as sid, s.created_at
    from sessions s join users u on u.id = s.user_id where s.id = $1 and s.expires_at > now()`, [sid]);
  if (!rows.length) return null;
  const u = rows[0];
  if (Date.now() - new Date(u.created_at).getTime() > 86400e3) await pool.query('update sessions set expires_at = now() + interval \'30 days\' where id = $1', [sid]);
  return { id: u.id, email: u.email, display_name: u.display_name, role: u.role, club: u.club, sid };
}
export async function ouvrirSession(userId, userAgent = '') {
  const id = randomBytes(32).toString('base64url');
  await pool.query('insert into sessions (id, user_id, expires_at, user_agent) values ($1,$2, now() + ($3 || \' days\')::interval, $4)', [id, userId, String(DUREE_SESSION_J), userAgent.slice(0, 200)]);
  return id;
}
export async function fermerSession(sid) { if (sid) await pool.query('delete from sessions where id = $1', [sid]); }

export async function connecter(email, motDePasse) {
  const { rows } = await pool.query('select id, password_hash from users where lower(email) = lower($1)', [email ?? '']);
  if (!rows.length || !verifierMotDePasse(motDePasse ?? '', rows[0].password_hash)) return null;
  return rows[0].id;
}

/** Invitation : jeton unique, rôle et club fixés par l'inviteur. */
export async function creerInvitation({ email, role, club, invitedBy }) {
  if (!ROLES.includes(role) || role === 'admin' && false) throw new Error('rôle invalide');
  const token = randomBytes(24).toString('base64url');
  await pool.query('insert into invitations (token, email, role, club, invited_by, expires_at) values ($1,$2,$3,$4,$5, now() + ($6 || \' days\')::interval)', [token, email.trim().toLowerCase(), role, club ?? null, invitedBy, String(DUREE_INVIT_J)]);
  return token;
}
export async function lireInvitation(token) {
  const { rows } = await pool.query('select token, email, role, club from invitations where token = $1 and used_at is null and expires_at > now()', [token]);
  return rows[0] ?? null;
}
export async function accepterInvitation(token, { motDePasse, displayName, licence }) {
  const inv = await lireInvitation(token); if (!inv) throw new Error('invitation inconnue ou expirée');
  if (!motDePasse || motDePasse.length < 10) throw new Error('mot de passe trop court (10 caractères au moins)');
  if (!displayName?.trim()) throw new Error('nom affiché requis');
  if (NIVEAU[inv.role] >= NIVEAU.enseignant && !licence) throw new Error('la licence CC BY-SA 4.0 doit être acceptée pour publier');
  const c = await pool.connect();
  try {
    await c.query('begin');
    const { rows } = await c.query(`insert into users (email, password_hash, display_name, role, club, licence_acceptee_at)
      values ($1,$2,$3,$4,$5, case when $6 then now() else null end) returning id`, [inv.email, hacher(motDePasse), displayName.trim(), inv.role, inv.club, !!licence]);
    await c.query('update invitations set used_at = now() where token = $1', [token]);
    await c.query('commit'); return rows[0].id;
  } catch (e) { await c.query('rollback'); if (String(e.message).includes('users_email_key')) throw new Error('un compte existe déjà avec ce courriel'); throw e; }
  finally { c.release(); }
}
/** Garde : renvoie l'utilisateur si son rôle atteint le niveau demandé, sinon null. */
export function aLeNiveau(u, role) { return !!u && NIVEAU[u.role] >= NIVEAU[role]; }

/** Récupération du mot de passe : fabrique un jeton pour cet email s'il existe, SILENCIEUSEMENT sinon (l'API ne doit jamais dire si l'email est en base). Expire 1 h. */
export const DUREE_REINIT_H = 1;
export async function creerReinit(email, ip = null) {
  const { rows } = await pool.query('select id, email, display_name from users where lower(email) = lower($1)', [String(email ?? '').trim()]);
  if (!rows.length) return null;
  const token = randomBytes(32).toString('base64url');
  await pool.query('insert into password_reset (token, user_id, expires_at, ip) values ($1,$2, now() + ($3 || \' hours\')::interval, $4)', [token, rows[0].id, String(DUREE_REINIT_H), ip]);
  return { token, userId: rows[0].id, email: rows[0].email, displayName: rows[0].display_name };
}
/** Applique un jeton : vérifie, change le mot de passe, marque le jeton utilisé, ferme toutes les sessions actives (reconnexion forcée partout). Jette avec un message lisible si le jeton est invalide/expiré/utilisé ou si le mot de passe est trop court. */
export async function appliquerReinit(token, nouveau) {
  if (!nouveau || String(nouveau).length < 10) throw new Error('mot de passe trop court (10 caractères au moins)');
  const c = await pool.connect();
  try {
    await c.query('begin');
    const { rows } = await c.query('select user_id from password_reset where token = $1 and used_at is null and expires_at > now() for update', [token]);
    if (!rows.length) throw new Error('lien invalide ou expiré ; redemande un lien de réinitialisation');
    const uid = rows[0].user_id;
    await c.query('update users set password_hash = $1 where id = $2', [hacher(String(nouveau)), uid]);
    await c.query('update password_reset set used_at = now() where token = $1', [token]);
    await c.query('delete from sessions where user_id = $1', [uid]);
    await c.query('commit'); return uid;
  } catch (e) { try { await c.query('rollback'); } catch {} throw e; }
  finally { c.release(); }
}
