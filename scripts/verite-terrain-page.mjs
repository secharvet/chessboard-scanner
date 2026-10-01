/**
 * Page de vérité de terrain (étape 2, 1er octobre 2026) : à partir de reports/verite-terrain.json et de la clé
 * reports/verite-terrain-cle.json (ordre et identifiants figés : les réponses enregistrées y sont attachées), produit
 * une page HTML autonome : pour chaque planche, UN échiquier et la suite jouée ; survoler un coup montre la position
 * après ce coup (cases de départ et d'arrivée surlignées), cliquer la fixe ; la page s'ouvre sur le coup clé.
 * Toutes les positions sont calculées ici (aucune bibliothèque chargée par la page).
 *
 *   node scripts/verite-terrain-page.mjs [--out <fichier.html>]
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { Chess } from 'chess.js';
import { fromFrenchSan } from '../coach/notation.mjs';

const args = process.argv.slice(2);
const OUT = args.includes('--out') ? args[args.indexOf('--out') + 1] : 'reports/verite-terrain.html';
const data = JSON.parse(readFileSync('reports/verite-terrain.json', 'utf8'));
const key = JSON.parse(readFileSync('reports/verite-terrain-cle.json', 'utf8'));

const DEF = {
  tour_colonne: ['Tour sur colonne ouverte', 'Une tour vient se placer, par un coup calme, sur une colonne ouverte (sans aucun pion) ou semi-ouverte pour ce camp (sans pion à lui), et elle y reste.'],
  cavalier_avant_poste: ['Cavalier sur avant-poste', 'Un cavalier s\'installe dans le camp adverse sur une case soutenue par un pion à lui, qu\'aucun pion adverse ne peut plus venir attaquer, et il y reste.'],
  blocage: ['Blocage d\'un pion faible', 'Un cavalier ou un fou vient se placer juste devant un pion adverse faible (isolé, arriéré ou passé) pour l\'immobiliser, et il y reste.'],
  rupture: ['Rupture de pions', 'Une poussée de pion qui attaque un pion adverse, suivie de l\'ouverture d\'une colonne nouvelle pour ce camp, qu\'il utilise avec une tour ou qui laisse à l\'adversaire une faiblesse durable.'],
  affaiblir: ['Affaiblir la structure adverse', 'Par un échange que l\'adversaire doit reprendre avec un pion, ou par une poussée de pion, ce camp lui crée une faiblesse durable : pions doublés, pion isolé ou arriéré, bouclier du roi abîmé.'],
  dominer: ['Dominer une couleur de cases', 'Ce camp échange le fou adverse d\'une couleur sur laquelle l\'adversaire a déjà des cases faibles, en gardant son propre fou de cette couleur.'],
};

// Reconstituer les planches dans l'ordre des identifiants (concept-01 … concept-10), avec les positions après chaque coup.
const all = Object.entries(data.concepts).flatMap(([c, v]) => [...v.positifs, ...v.pieges].map((b) => ({ ...b, concept: c })));
const items = Object.entries(key).sort(([a], [b]) => a.localeCompare(b)).map(([id, k]) => {
  const concept = id.replace(/-\d+$/, '');
  const b = all.find((x) => x.concept === concept && x.fen === k.fen && x.ply === k.ply && x.kind === k.kind && x.game === k.game && x.position === k.position);
  if (!b) throw new Error(`planche introuvable : ${id}`);
  const c = new Chess(b.fen);
  const steps = [];
  for (const san of b.moves) {
    const m = c.move(fromFrenchSan(san));
    steps.push({ san, from: m.from, to: m.to, fen: c.fen() });
  }
  return { id, concept, fen: b.fen, side: b.side, ply: b.ply, elo: b.elo, steps, start: Number(b.fen.split(' ')[5]) || 1, blackFirst: b.fen.split(' ')[1] === 'b' };
});

const page = `<title>Vérité de terrain des plans</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,400;8..60,600&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap">
<style>
/* Une fiche par planche : un échiquier, la suite jouée (survol = position après ce coup), le formulaire. */
:root{--bg:#f6f4ee;--paper:#fff;--fg:#22211d;--muted:#6b675c;--rule:#dcd8cc;--light:#e9e3d2;--dark:#8f9a72;--accent:#8a2f1d;--accent-bg:#f7e5df;--ok:#2f6b3a;--ok-bg:#e3efe3;--key:#f0c04a;--from:#f7e38a;--to:#f0c04a;
--serif:"Source Serif 4",Georgia,serif;--sans:"IBM Plex Sans",system-ui,sans-serif;--mono:"IBM Plex Mono",ui-monospace,monospace}
@media (prefers-color-scheme: dark){:root:not([data-theme="light"]){--bg:#1c1c19;--paper:#26261f;--fg:#ece8dd;--muted:#a39e90;--rule:#3a392f;--light:#c9c0a8;--dark:#6b7553;--accent:#e58a72;--accent-bg:#3d2620;--ok:#8fd19b;--ok-bg:#243325;--key:#b8902e;--from:#9c8a3a;--to:#b8902e;color-scheme:dark}}
:root[data-theme="dark"]{--bg:#1c1c19;--paper:#26261f;--fg:#ece8dd;--muted:#a39e90;--rule:#3a392f;--light:#c9c0a8;--dark:#6b7553;--accent:#e58a72;--accent-bg:#3d2620;--ok:#8fd19b;--ok-bg:#243325;--key:#b8902e;--from:#9c8a3a;--to:#b8902e;color-scheme:dark}
body{background:var(--bg);color:var(--fg);font-family:var(--sans);font-size:16px;line-height:1.5;padding-inline:16px;padding-block:28px 80px}
.wrap{max-width:1060px;margin:0 auto;display:grid;gap:26px}
h1{font-family:var(--serif);font-weight:600;font-size:2rem;line-height:1.15;margin:0;text-wrap:balance}
h2{font-family:var(--serif);font-weight:600;font-size:1.45rem;margin:26px 0 4px;text-wrap:balance}
.intro{max-width:70ch;color:var(--muted);margin:8px 0 0}
.intro b{color:var(--fg)}
.def{max-width:72ch;margin:0 0 10px;font-family:var(--serif);font-size:1.05rem}
.progress{position:sticky;top:env(safe-area-inset-top,0px);z-index:2;background:var(--paper);border:1px solid var(--rule);border-radius:6px;padding:10px 14px;display:flex;gap:16px;align-items:center;font-variant-numeric:tabular-nums}
.bar{flex:1;height:8px;background:var(--rule);border-radius:4px;overflow:hidden}.bar i{display:block;height:100%;background:var(--ok);width:0}
.card{background:var(--paper);border:1px solid var(--rule);border-radius:6px;padding:18px;display:grid;grid-template-columns:minmax(260px,380px) minmax(0,1fr) minmax(220px,.8fr);gap:18px}
@media (max-width:900px){.card{grid-template-columns:minmax(0,1fr) minmax(0,1fr)}.form{grid-column:1/-1}}
@media (max-width:560px){.card{grid-template-columns:1fr}}
.card header{grid-column:1/-1;display:flex;flex-wrap:wrap;gap:6px 14px;align-items:baseline;border-bottom:1px solid var(--rule);padding-bottom:8px}
.num{font-family:var(--serif);font-size:1.3rem;font-weight:600;color:var(--accent)}
.meta{color:var(--muted);font-size:.9rem}
.board{width:100%;max-width:380px;aspect-ratio:1;display:block}
.cap{font-size:.9rem;color:var(--muted);margin-top:6px;min-height:1.4em}
.nav{display:flex;gap:6px;margin-top:8px;flex-wrap:wrap}
.nav button{font:inherit;font-size:.85rem;padding:4px 10px;border:1px solid var(--rule);border-radius:4px;background:var(--bg);color:var(--fg);cursor:pointer}
.nav button:hover{border-color:var(--accent)}
.moves{font-family:var(--mono);font-size:.92rem;line-height:1.9;min-width:0}
.moves .hint{font-family:var(--sans);font-size:.85rem;color:var(--muted);margin-bottom:6px}
.mv{display:inline-block;padding:0 5px;border-radius:3px;cursor:pointer;border:1px solid transparent}
.mv:hover{border-color:var(--accent)}
.mv.key{background:var(--key);color:#1a1a1a;font-weight:600}
.mv.cur{outline:2px solid var(--accent)}
.mv.start{color:var(--muted)}
.form{display:grid;gap:8px;align-content:start}
.form .q{font-weight:600}
.form label{display:flex;gap:8px;align-items:center;padding:6px 8px;border:1px solid var(--rule);border-radius:4px;cursor:pointer}
.form label:has(input:checked){border-color:var(--ok);background:var(--ok-bg)}
textarea{width:100%;min-height:56px;border:1px solid var(--rule);border-radius:4px;padding:6px 8px;font:inherit;font-size:.92rem;background:var(--bg);color:var(--fg);resize:vertical}
.saved{font-size:.8rem;color:var(--muted);min-height:1.2em}
.done{outline:2px solid var(--ok)}
input:focus-visible,textarea:focus-visible,button:focus-visible{outline:2px solid var(--accent)}
.foot{color:var(--muted);font-size:.9rem;max-width:66ch}
</style>
<div class="wrap">
  <div>
    <h1>Vérité de terrain des plans</h1>
    <p class="intro">Soixante positions tirées de vraies parties, dix par concept. Pour chacune, le programme affirme : <b>« dans les douze demi-coups qui suivent, le camp indiqué réalise ce concept »</b>, et il désigne le coup clé, surligné en jaune dans la liste. L'échiquier s'ouvre sur la position <b>après ce coup clé</b>. Survolez n'importe quel coup pour voir la position après lui, cliquez pour la fixer, « Départ » revient au début. La question est toujours la même : le programme a-t-il raison ? Répondez d'après votre jugement d'échecs. Les réponses s'enregistrent toutes seules ; vous pouvez revenir plus tard.</p>
  </div>
  <div class="progress"><span id="count">0 / ${items.length} jugées</span><span class="bar"><i id="barfill"></i></span><span class="meta" id="status">connexion…</span></div>
  <div id="sections"></div>
  <p class="foot">Notation française (R roi, D dame, T tour, F fou, C cavalier). Échiquier toujours vu côté Blancs. Les cases jaunes sont le départ et l'arrivée du coup affiché.</p>
</div>
<script>
const ITEMS = ${JSON.stringify(items)};
const DEF = ${JSON.stringify(DEF)};
const glyph={K:'\\u2654',Q:'\\u2655',R:'\\u2656',B:'\\u2657',N:'\\u2658',P:'\\u2659',k:'\\u265A',q:'\\u265B',r:'\\u265C',b:'\\u265D',n:'\\u265E',p:'\\u265F'};
const NS='http://www.w3.org/2000/svg';
function drawBoard(svg,fen,from,to){
  while(svg.firstChild) svg.removeChild(svg.firstChild);
  const rows=fen.split(' ')[0].split('/');
  svg.setAttribute('viewBox','0 0 8.6 8.6');
  const css=getComputedStyle(document.documentElement);
  const light=css.getPropertyValue('--light').trim(),dark=css.getPropertyValue('--dark').trim(),fg=css.getPropertyValue('--muted').trim(),cFrom=css.getPropertyValue('--from').trim(),cTo=css.getPropertyValue('--to').trim();
  for(let r=0;r<8;r++){let f=0;
    for(let c=0;c<8;c++){const q=document.createElementNS(NS,'rect');q.setAttribute('x',c+0.3);q.setAttribute('y',r);q.setAttribute('width',1);q.setAttribute('height',1);
      const sq=String.fromCharCode(97+c)+(8-r);q.setAttribute('fill',sq===to?cTo:sq===from?cFrom:((r+c)%2===0?light:dark));svg.appendChild(q);}
    for(const ch of rows[r]){if(/\\d/.test(ch)){f+=+ch;continue;}const t=document.createElementNS(NS,'text');t.setAttribute('x',f+0.8);t.setAttribute('y',r+0.82);t.setAttribute('text-anchor','middle');t.setAttribute('font-size','0.88');
      const w=ch===ch.toUpperCase();t.setAttribute('fill',w?'#fff':'#111');t.setAttribute('stroke',w?'#222':'#000');t.setAttribute('stroke-width','0.03');t.setAttribute('font-family','"Segoe UI Symbol","DejaVu Sans","Noto Sans Symbols2",serif');t.textContent=glyph[ch];svg.appendChild(t);f++;}
    const rk=document.createElementNS(NS,'text');rk.setAttribute('x',0.12);rk.setAttribute('y',r+0.62);rk.setAttribute('font-size','0.3');rk.setAttribute('fill',fg);rk.textContent=String(8-r);svg.appendChild(rk);}
  'abcdefgh'.split('').forEach((l,c)=>{const t=document.createElementNS(NS,'text');t.setAttribute('x',c+0.8);t.setAttribute('y',8.42);t.setAttribute('text-anchor','middle');t.setAttribute('font-size','0.3');t.setAttribute('fill',fg);t.textContent=l;svg.appendChild(t);});
}
function label(it,i){ const idx=i+(it.blackFirst?1:0); const mv=it.start+Math.floor(idx/2); return (idx%2===0)?mv+'. '+it.steps[i].san:((i===0)?mv+'… ':'')+it.steps[i].san; }
const verdicts={}; let db=null;
const $sections=document.getElementById('sections');
for(const c of Object.keys(DEF)){
  const sec=document.createElement('section'); sec.id='c-'+c;
  sec.innerHTML='<h2>'+DEF[c][0]+'</h2><p class="def">'+DEF[c][1]+'</p>';
  ITEMS.filter(it=>it.concept===c).forEach((it,k)=>{
    const card=document.createElement('article'); card.className='card'; card.id=it.id;
    const side=it.side==='w'?'les Blancs':'les Noirs';
    const key=it.steps[it.ply];
    card.innerHTML='<header><span class="num">'+(k+1)+'</span><span><b>Le camp qui agit : '+side+'</b></span><span class="meta">joueur Elo '+(it.elo??'?')+'</span><span class="meta">coup clé selon le programme : <b>'+label(it,it.ply)+'</b></span></header>'
      +'<div><svg class="board"></svg><div class="cap"></div><div class="nav"><button type="button" data-go="-1">Départ</button><button type="button" data-go="prev">◀</button><button type="button" data-go="next">▶</button><button type="button" data-go="key">Coup clé</button></div></div>'
      +'<div class="moves"><div class="hint">Survolez un coup : la position après ce coup s\\'affiche. Cliquez pour la fixer.</div><span class="mv start" data-i="-1">départ</span> '+it.steps.map((s,i)=>'<span class="mv'+(i===it.ply?' key':'')+'" data-i="'+i+'">'+label(it,i)+'</span>').join(' ')+'</div>'
      +'<div class="form" data-id="'+it.id+'"><div class="q">'+DEF[c][0]+' : réalisé par '+side+' dans cette suite ?</div>'
      +'<label><input type="radio" name="v-'+it.id+'" value="oui"> Oui, c\\'est bien ça</label>'
      +'<label><input type="radio" name="v-'+it.id+'" value="non"> Non</label>'
      +'<label><input type="radio" name="v-'+it.id+'" value="pas_sur"> Pas sûr</label>'
      +'<textarea id="c-'+it.id+'" placeholder="Remarque (facultatif) : pourquoi, ce qui manque, le vrai nom…"></textarea><div class="saved" id="s-'+it.id+'"></div></div>';
    sec.appendChild(card);
    const svg=card.querySelector('.board'), cap=card.querySelector('.cap');
    let pinned=it.ply;
    const show=(i)=>{ if(i<0){drawBoard(svg,it.fen,null,null);cap.textContent='Position de départ';} else {const s=it.steps[i];drawBoard(svg,s.fen,s.from,s.to);cap.textContent='Après '+label(it,i)+(i===it.ply?' (coup clé)':'');} card.querySelectorAll('.mv').forEach(m=>m.classList.toggle('cur',Number(m.dataset.i)===i)); };
    show(pinned);
    card.querySelectorAll('.mv').forEach(m=>{ m.addEventListener('mouseenter',()=>show(Number(m.dataset.i))); m.addEventListener('mouseleave',()=>show(pinned)); m.addEventListener('click',()=>{pinned=Number(m.dataset.i);show(pinned);}); });
    card.querySelectorAll('.nav button').forEach(b=>b.addEventListener('click',()=>{ const g=b.dataset.go; if(g==='-1') pinned=-1; else if(g==='key') pinned=it.ply; else if(g==='prev') pinned=Math.max(-1,pinned-1); else pinned=Math.min(it.steps.length-1,pinned+1); show(pinned); }));
  });
  $sections.appendChild(sec);
}
function updateCount(){const n=Object.values(verdicts).filter(v=>v&&v.verdict).length;document.getElementById('count').textContent=n+' / '+ITEMS.length+' jugées';document.getElementById('barfill').style.width=(100*n/ITEMS.length)+'%';}
async function save(id,patch){ const v=Object.assign(verdicts[id]||{},patch,{at:new Date().toISOString()}); verdicts[id]=v; updateCount(); const $s=document.getElementById('s-'+id); if(!db){$s.textContent='non enregistré (hors connexion)';return;} try{ await db.doc('verdicts/'+id).set(v); $s.textContent='enregistré'; document.getElementById(id).classList.toggle('done',Boolean(v.verdict)); }catch(e){ $s.textContent='échec de l\\'enregistrement : '+(e.code||e.message||e); } }
document.addEventListener('change',e=>{ if(e.target.matches('input[type=radio]')){ save(e.target.name.slice(2),{verdict:e.target.value}); } });
const tmr={}; document.addEventListener('input',e=>{ if(e.target.matches('textarea')){ const id=e.target.id.slice(2); clearTimeout(tmr[id]); tmr[id]=setTimeout(()=>save(id,{comment:e.target.value}),800); } });
function applyVerdict(id,v){ verdicts[id]=v; const r=document.querySelector('input[name="v-'+id+'"][value="'+v.verdict+'"]'); if(r) r.checked=true; const t=document.getElementById('c-'+id); if(t&&v.comment!=null&&t.value!==v.comment) t.value=v.comment; const card=document.getElementById(id); if(card) card.classList.toggle('done',Boolean(v.verdict)); }
(async()=>{
  const $st=document.getElementById('status');
  if(!window.claude?.use){ $st.textContent='lecture seule'; return; }
  db=await window.claude.use('db');
  if(!db){ $st.textContent='réponses non enregistrées (connectez-vous)'; return; }
  $st.textContent='réponses enregistrées automatiquement';
  try{ const snap=await db.collection('verdicts').get(); snap.docs.forEach(d=>{ const v=d.data(); if(v) applyVerdict(d.id,v); }); updateCount(); }catch(e){ $st.textContent='lecture des réponses impossible : '+(e.code||e.message); }
})();
</script>
`;
writeFileSync(OUT, page);
console.log(`${items.length} planches → ${OUT} (${page.length} octets)`);
