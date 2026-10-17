/* Son de déplacement des pièces : un « toc » sec (son 1), synthétisé, réglable dans Paramètres.
   Réglages lus dans localStorage : son-actif (0/1), son-volume, son-hauteur, son-sec.
   Niveau relevé le 17/10 (mesuré : crête ~0,8 au lieu de 0,14, ~85 ms au lieu de 23) : le premier réglage était inaudible
   sur des haut-parleurs d'ordinateur ou de téléphone. */

let AC = null, master = null;

function nombre(cle, defaut) { try { const v = parseFloat(localStorage.getItem(cle)); return Number.isFinite(v) ? v : defaut; } catch (e) { return defaut; } }
function actif() { try { return localStorage.getItem('son-actif') !== '0'; } catch (e) { return true; } } // activé par défaut

function ctx() {
  if (!AC) {
    AC = new (window.AudioContext || window.webkitAudioContext)();
    master = AC.createGain();
    // Simple limiteur de sécurité (pas un compresseur qui rabote) : n'agit qu'au-dessus de −6 dB.
    const comp = AC.createDynamicsCompressor(); comp.threshold.value = -6; comp.knee.value = 3; comp.ratio.value = 8; comp.attack.value = 0.001; comp.release.value = 0.06;
    const lp = AC.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 3200; lp.Q.value = 0.5;
    master.connect(lp).connect(comp).connect(AC.destination);
  }
  if (AC.state === 'suspended') AC.resume();
  return AC;
}
/* Enveloppe : attaque 3 ms, puis décroissance naturelle (constante de temps = durée/4), au lieu d'une chute
   exponentielle vers zéro qui vidait le son de son énergie en quelques millisecondes. */
function env(g, t, peak, dur) { g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(peak, t + 0.003); g.gain.setTargetAtTime(0, t + 0.003, dur / 4); }
function noise(dur) { const a = ctx(); const b = a.createBuffer(1, Math.ceil(a.sampleRate * dur), a.sampleRate); const d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; const s = a.createBufferSource(); s.buffer = b; return s; }
function tone(type, f0, f1, t, peak, dur) { const a = ctx(); const o = a.createOscillator(); o.type = type; o.frequency.setValueAtTime(f0, t); if (f1) o.frequency.exponentialRampToValueAtTime(f1, t + dur); const g = a.createGain(); env(g, t, peak, dur); o.connect(g).connect(master); o.start(t); o.stop(t + dur * 1.5 + 0.05); }
function click(freq, t, peak, dur) { const a = ctx(); const s = noise(dur * 1.5 + 0.05); const f = a.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = freq; f.Q.value = 0.7; const g = a.createGain(); env(g, t, peak, dur); s.connect(f).connect(g).connect(master); s.start(t); s.stop(t + dur * 1.5 + 0.05); }

/** Joue le « toc » du coup, selon les réglages de Paramètres. À appeler quand une pièce bouge. */
export function jouerSonCoup() {
  if (!actif()) return;
  try {
    const a = ctx();
    master.gain.value = nombre('son-volume', 90) / 100;
    const transpose = nombre('son-hauteur', 100) / 100;
    const longueur = nombre('son-sec', 100) / 100;
    const t = a.currentTime + 0.005, p = 190 * transpose, d = 0.085 * longueur;
    tone('sine', p, p * 0.6, t, 0.85, d);                                  // corps du « toc »
    tone('triangle', p * 2, p * 1.2, t, 0.35, d * 0.7);                     // harmonique : audible sur petits haut-parleurs
    click(Math.min(3000, p * 6), t, 0.5, Math.max(0.025, d * 0.4));         // transitoire « clac »
  } catch (e) { /* audio indisponible : silencieux */ }
}
