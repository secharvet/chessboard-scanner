/* Son de déplacement des pièces : un « toc » sec (son 1), synthétisé, réglable dans Paramètres.
   Réglages lus dans localStorage : son-actif (0/1), son-volume, son-hauteur, son-sec. */

let AC = null, master = null;

function nombre(cle, defaut) { try { const v = parseFloat(localStorage.getItem(cle)); return Number.isFinite(v) ? v : defaut; } catch (e) { return defaut; } }
function actif() { try { return localStorage.getItem('son-actif') !== '0'; } catch (e) { return true; } } // activé par défaut

function ctx() {
  if (!AC) {
    AC = new (window.AudioContext || window.webkitAudioContext)();
    master = AC.createGain();
    const lp = AC.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1100; lp.Q.value = 0.4;
    master.connect(lp).connect(AC.destination);
  }
  if (AC.state === 'suspended') AC.resume();
  return AC;
}
function env(g, t, peak, dur) { g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + 0.004); g.gain.exponentialRampToValueAtTime(0.0001, t + dur); }
function noise(dur) { const a = ctx(); const b = a.createBuffer(1, Math.ceil(a.sampleRate * dur), a.sampleRate); const d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; const s = a.createBufferSource(); s.buffer = b; return s; }
function tone(type, f0, f1, t, peak, dur) { const a = ctx(); const o = a.createOscillator(); o.type = type; o.frequency.setValueAtTime(f0, t); if (f1) o.frequency.exponentialRampToValueAtTime(f1, t + dur); const g = a.createGain(); env(g, t, peak, dur); o.connect(g).connect(master); o.start(t); o.stop(t + dur + 0.02); }
function click(freq, t, peak, dur) { const a = ctx(); const s = noise(dur); const f = a.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = freq; f.Q.value = 0.7; const g = a.createGain(); env(g, t, peak, dur); s.connect(f).connect(g).connect(master); s.start(t); s.stop(t + dur + 0.02); }

/** Joue le « toc » du coup, selon les réglages de Paramètres. À appeler quand une pièce bouge. */
export function jouerSonCoup() {
  if (!actif()) return;
  try {
    const a = ctx();
    master.gain.value = (nombre('son-volume', 70) / 100) * 0.9;
    const transpose = nombre('son-hauteur', 100) / 100;
    const longueur = nombre('son-sec', 70) / 100;
    const t = a.currentTime, p = 165 * transpose, d = 0.05 * longueur;
    tone('sine', p, p * 0.5, t, 0.3, d);
    click(Math.min(1600, p * 3), t, 0.18, Math.max(0.018, d * 0.5));
  } catch (e) { /* audio indisponible : silencieux */ }
}
