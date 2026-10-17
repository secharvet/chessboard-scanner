/* Son de déplacement des pièces : enregistrements (le « clac » de bois de Lichess, sons « standard », open source
   lichess-org/lila public/sound/standard), un son pour un coup, un autre pour une prise.
   Réglages lus dans localStorage : son-actif (0/1), son-volume (0–100), son-hauteur (55–175 → vitesse de lecture). */

const SRC = { move: './assets/sons/move', capture: './assets/sons/capture' };
let AC = null, master = null, chargement = null;
const buffers = {};

function nombre(cle, defaut) { try { const v = parseFloat(localStorage.getItem(cle)); return Number.isFinite(v) ? v : defaut; } catch (e) { return defaut; } }
function actif() { try { return localStorage.getItem('son-actif') !== '0'; } catch (e) { return true; } } // activé par défaut

function ctx() {
  if (!AC) { AC = new (window.AudioContext || window.webkitAudioContext)(); master = AC.createGain(); master.connect(AC.destination); }
  if (AC.state === 'suspended') AC.resume();
  return AC;
}

/** Charge et décode les deux sons une fois (OGG si le navigateur sait le lire, sinon MP3). */
function charger() {
  if (chargement) return chargement;
  chargement = (async () => {
    const a = ctx();
    const ext = document.createElement('audio').canPlayType('audio/ogg; codecs=vorbis') ? 'ogg' : 'mp3';
    for (const k of Object.keys(SRC)) {
      try { const r = await fetch(`${SRC[k]}.${ext}`); buffers[k] = await a.decodeAudioData(await r.arrayBuffer()); } catch (e) { /* son indisponible : silencieux */ }
    }
  })();
  return chargement;
}

/** Joue le son du coup (ou de la prise), selon les réglages de Paramètres. À appeler quand une pièce bouge. */
export function jouerSonCoup({ capture = false } = {}) {
  if (!actif()) return;
  try {
    const a = ctx();
    master.gain.value = nombre('son-volume', 90) / 100;
    const vitesse = Math.min(1.5, Math.max(0.6, nombre('son-hauteur', 100) / 100));
    const lancer = () => {
      const b = buffers[capture ? 'capture' : 'move'] || buffers.move; if (!b) return;
      const s = a.createBufferSource(); s.buffer = b; s.playbackRate.value = vitesse; s.connect(master); s.start();
    };
    if (buffers.move) lancer(); else charger().then(lancer);
  } catch (e) { /* audio indisponible : silencieux */ }
}

// Préchargement discret au chargement de la page (le contexte reste suspendu jusqu'au premier geste de l'utilisateur).
try { charger(); } catch (e) {}
