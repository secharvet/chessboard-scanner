#!/usr/bin/env node
/**
 * Le récit d'une partie du coach joueur, en Markdown lisible par un humain (ou par le GE) : tous les coups, et pour
 * chaque coup du coach sa phrase, sa sorte, et le « pourquoi » (la ligne calculée, le coup battu, la menace vue, le plan,
 * le verdict de l'examinateur). Aucun calcul : c'est le fichier de la partie (contrat, docs/coach-joueur/CHANTIERS
 * page 3) mis en page.
 *
 *   node scripts/joueur/recit.mjs parties/<id>.json [--humain] [> recit.md]
 *
 * La mise en page vit dans recit.js (partagée avec le site) ; --humain donne le ton du site (sans trace de recherche).
 */
import { readFileSync } from 'node:fs';
import { recitTexte } from '../../recit.js';

const chemin = process.argv[2];
if (!chemin) { console.error('usage : node scripts/joueur/recit.mjs parties/<id>.json [--humain]'); process.exit(2); }
const p = JSON.parse(readFileSync(chemin, 'utf8'));
process.stdout.write(recitTexte(p, { technique: !process.argv.includes('--humain') }));
