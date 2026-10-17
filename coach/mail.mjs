/**
 * Envoi d'un courriel simple, texte brut (17 oct. 2026). Un seul expéditeur, un seul destinataire par envoi.
 *   - Sans SMTP_HOST : écrit l'« .eml » dans logs/mails/<horodatage>-<destinataire>.eml et retourne le chemin
 *     (pour tester toute la plomberie avant d'avoir un compte Brevo/Mailjet/Resend).
 *   - Avec SMTP_HOST : parle au serveur en clair ou STARTTLS, 25/465/587, auth LOGIN. Pas de dépendance externe.
 * Variables : SMTP_HOST, SMTP_PORT (587), SMTP_USER, SMTP_PASS, MAIL_FROM, MAIL_FROM_NOM, SITE_URL.
 */
import { createConnection } from 'node:net';
import { TLSSocket, connect as tlsConnect } from 'node:tls';
import { mkdir, writeFile } from 'node:fs/promises';
import { randomBytes } from 'node:crypto';
import { Buffer } from 'node:buffer';

const CONF = () => ({
  host: process.env.SMTP_HOST ?? '', port: Number(process.env.SMTP_PORT ?? 587),
  user: process.env.SMTP_USER ?? '', pass: process.env.SMTP_PASS ?? '',
  from: process.env.MAIL_FROM ?? 'noreply@localhost', nom: process.env.MAIL_FROM_NOM ?? 'École ouverte d\'échecs',
});
export const siteUrl = () => process.env.SITE_URL ?? 'https://guru-chess.duckdns.org';

function enTetes({ from, fromNom, to, sujet }) {
  const d = new Date().toUTCString(); const id = `<${randomBytes(8).toString('hex')}@${(from.split('@')[1] ?? 'localhost')}>`;
  return `Date: ${d}\r\nFrom: "${fromNom.replace(/"/g, '')}" <${from}>\r\nTo: <${to}>\r\nSubject: =?UTF-8?B?${Buffer.from(sujet).toString('base64')}?=\r\nMessage-ID: ${id}\r\nMIME-Version: 1.0\r\nContent-Type: text/plain; charset=UTF-8\r\nContent-Transfer-Encoding: 8bit\r\n`;
}
async function enregistrer(brut, destinataire) {
  const nom = `${new Date().toISOString().replace(/[:.]/g, '-')}-${destinataire.replace(/[^A-Za-z0-9._-]/g, '_')}.eml`;
  const dossier = 'logs/mails'; await mkdir(dossier, { recursive: true });
  const chemin = `${dossier}/${nom}`; await writeFile(chemin, brut, 'utf8'); return chemin;
}

/** Petit client SMTP (sans dépendance) : connexion → EHLO → STARTTLS si demandé → AUTH LOGIN → MAIL/RCPT/DATA → QUIT. */
async function envoyerSmtp({ host, port, user, pass, from, to, brut }) {
  const starttls = port === 587 || port === 25; const direct = port === 465;
  const sock = direct ? tlsConnect({ host, port, servername: host }) : createConnection({ host, port });
  const q = []; let buf = '';
  const attendre = (code) => new Promise((ok, ko) => { q.push({ code, ok, ko }); });
  const envoyer = (ligne) => sock.write(ligne + '\r\n');
  const basculerTls = () => new Promise((ok, ko) => { const t = new TLSSocket(sock, { servername: host, isServer: false }); t.once('secure', () => ok(t)); t.once('error', ko); });
  sock.setEncoding('utf8');
  sock.on('data', (d) => { buf += d; const lignes = buf.split(/\r?\n/); buf = lignes.pop() ?? ''; for (const l of lignes) { const m = l.match(/^(\d\d\d)([ -])(.*)$/); if (!m) continue; const code = Number(m[1]); if (m[2] === ' ') { const a = q.shift(); if (!a) continue; if (String(code).startsWith(String(a.code))) a.ok(code); else a.ko(new Error('SMTP ' + code + ' : ' + m[3])); } } });
  sock.on('error', (e) => { while (q.length) q.shift().ko(e); });
  await attendre(2); envoyer('EHLO ' + host); await attendre(2);
  let s = sock;
  if (starttls) { envoyer('STARTTLS'); await attendre(2); const t = await basculerTls(); t.setEncoding('utf8'); t.on('data', sock.listeners('data')[0]); s = t; const envoyer2 = (l) => t.write(l + '\r\n'); envoyer2('EHLO ' + host); await attendre(2); if (user) { envoyer2('AUTH LOGIN'); await attendre(3); envoyer2(Buffer.from(user).toString('base64')); await attendre(3); envoyer2(Buffer.from(pass).toString('base64')); await attendre(2); } envoyer2('MAIL FROM:<' + from + '>'); await attendre(2); envoyer2('RCPT TO:<' + to + '>'); await attendre(2); envoyer2('DATA'); await attendre(3); envoyer2(brut.replace(/\r?\n\./g, '\r\n..') + '\r\n.'); await attendre(2); envoyer2('QUIT'); await attendre(2); t.end(); return; }
  if (user) { envoyer('AUTH LOGIN'); await attendre(3); envoyer(Buffer.from(user).toString('base64')); await attendre(3); envoyer(Buffer.from(pass).toString('base64')); await attendre(2); }
  envoyer('MAIL FROM:<' + from + '>'); await attendre(2); envoyer('RCPT TO:<' + to + '>'); await attendre(2);
  envoyer('DATA'); await attendre(3); envoyer(brut.replace(/\r?\n\./g, '\r\n..') + '\r\n.'); await attendre(2);
  envoyer('QUIT'); await attendre(2); s.end();
}

/** Envoie un courriel. Retourne { via: 'smtp'|'fichier', chemin? }. Les erreurs SMTP tombent sur le repli fichier. */
export async function envoyer({ a, sujet, texte }) {
  const c = CONF(); const brut = enTetes({ from: c.from, fromNom: c.nom, to: a, sujet }) + '\r\n' + texte + (texte.endsWith('\n') ? '' : '\n');
  if (!c.host) { const chemin = await enregistrer(brut, a); console.error('[mail] pas de SMTP configuré ; écrit dans', chemin); return { via: 'fichier', chemin }; }
  try { await envoyerSmtp({ host: c.host, port: c.port, user: c.user, pass: c.pass, from: c.from, to: a, brut }); console.error('[mail] envoyé à', a, 'via', c.host); return { via: 'smtp' }; }
  catch (e) { const chemin = await enregistrer(brut, a); console.error('[mail] SMTP a échoué (' + e.message + ') ; replié dans', chemin); return { via: 'fichier', chemin, erreur: e.message }; }
}
