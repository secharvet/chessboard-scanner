# Rapport de l'épreuve du jeu — lot 1, deux moteurs (20 octobre 2026)

Protocole : `PROTOCOLE-EPREUVE-DU-JEU-2026-10-19.md` (critère § 5, écrit avant la première partie). Chiffres à publier :
`RELECTURE-MODULE-2026-10-19.md` § 9. Page sans jargon : `LIRE-EN-PREMIER-2026-10-20.md`.

## 1. Ce qui a tourné

- **Lot 1** : vingt départs-camps (dix structures × deux camps), dix parties par départ-camp et par bras, trois bras
  (coach-livre, coach-prix, témoin libre des deux côtés), parties entières plafonnées à 80 demi-coups, profondeur 18, un fil,
  table vidée (`COACH_DETERMINISTIC=1`). Mêmes graines aux deux moteurs : les parties s'apparient.
- **SF 19** : VPS, 600 parties, fini le 20 octobre à 2 h 59 (Paris), zéro échec.
- **SF 17.1** : 19 dossiers sur Orion (contrôle « deux parties fraîches identiques » réussi), 41 sur le VPS après Deneb
  éteint (contrôle d'identité VPS / Orion réussi : la même partie fraîche, identique hors secondes, sur les deux machines).
  Fini le 20 octobre à 17 h 13, 600 parties, zéro journal en erreur.
- Code : `dev-lead` 4e84a5f pour les deux moteurs. Dépouillement en lecture seule des `parties.json`, sans rejouer.

**Convention de lecture.** Le coût d'une partie = la somme des prix de ses plans (centièmes de pion rendus au faisceau libre
du segment, au point calme). Une partie où le coach n'a jamais adopté de plan n'a **pas de coût** (37 parties sur 200 par
bras à SF 19, 38 à SF 17.1 : Espagnole sans dames et KID côté Noirs surtout) ; elle est **hors de la médiane et de la
moyenne**, et comptée à part. La compter pour zéro ferait descendre la médiane à 0,00 aux deux moteurs : on ne l'a pas fait.

## 2. Le critère

| | SF 19 médiane / moyenne | SF 17.1 médiane / moyenne | barre | verdict |
|---|---|---|---|---|
| coach-prix | +0,10 / +0,28 | +0,10 / +0,27 | ≤ 0,25 / ≤ 0,50 | **passe** |
| coach-livre | +0,09 / +0,26 | +0,14 / +0,26 | ≤ 0,25 / ≤ 0,50 | **passe** |

**Le coach-prix passe l'épreuve à la règle écrite, avec les deux moteurs** (163 et 162 parties chiffrées). La moyenne est à
la moitié de la barre aux deux moteurs ; la médiane à 0,10–0,15 de la barre.

Quartiles du coût, coach-livre : SF 19 −0,14 / +0,09 / +0,50 ; SF 17.1 −0,12 / +0,14 / +0,62. 90e centile : +0,94 et +1,12.

Le chiffre provisoire d'hier soir à treize départs-camps (SF 17.1 médiane +0,27, juste au-dessus de la barre) ne tient pas
sur le lot entier : les sept derniers départs-camps (échange français, Tarrasch fermée et ouverte) sont bon marché.

## 3. Prix contre livre : la valeur ajoutée du professeur machine

| apparié, partie par partie | n | même coût | prix moins cher | prix plus cher | médiane | moyenne |
|---|---|---|---|---|---|---|
| SF 19 | 163 | 129 | 12 | 22 | 0,00 | +0,03 |
| SF 17.1 | 162 | 151 | 4 | 7 | 0,00 | +0,01 |

**Le coach-prix ne fait pas mieux que le livre.** Il joue la même partie dans quatre cas sur cinq (SF 19) à neuf sur dix (SF
17.1), et quand il s'en écarte il coûte un peu plus souvent plus cher. Le critère passe donc pour le livre exécuté par la
machine, pas grâce au choix au prix : **la valeur ajoutée du professeur machine sur ce lot est nulle**.

## 4. Où ça coûte

**Fin de partie** (évaluation au dernier demi-coup, côté coach ; mieux > +0,50, moins bien < −0,50, perdu < −2,00) :

| | coach-livre mieux / moins bien / perdu | coach-prix | témoin libre |
|---|---|---|---|
| SF 19 | 28 % / 7 % / 5 % | 27 % / 9 % / 6 % | 41 % / 1 % / 1 % |
| SF 17.1 | 32 % / 9 % / 7 % | 31 % / 9 % / 7 % | 44 % / 2 % / 1 % |

Le coût médian est bas, mais **la queue est réelle** : une partie sur quinze à vingt finit perdue sous coach, une sur cent
sans. Elle est concentrée, et au même endroit aux deux moteurs :

| départ-camp (livre) | SF 19 médiane, perdues | SF 17.1 médiane, perdues |
|---|---|---|
| fr-avance-noirs, coach Noirs | +1,35, 4/10 | +0,55, 3/10 |
| iqp-panov, coach Noirs | +0,28, 5/10 | +0,01, 4/10 |
| herisson, coach Noirs | +0,26, 0/10 | +0,14, 2/10 |
| fr-avance-blancs, coach Noirs | +0,07, 0/10 | +0,57, 2/10 |

Dans les deux premiers, **le coach joue le camp qui subit la structure** (les Noirs contre la chaîne e5, les Noirs contre le
pion isolé blanc). Par plan, ce qui coûte le plus au cumul des deux moteurs : les ruptures de la chaîne e5 (…f6 : 33 segments,
médiane 0,16 / 0,20, Σ 17 pions ; …f5 : 42 segments, 0,29 / 0,26, Σ 13 pions) — des ruptures que le livre recommande et que
le moteur paie un quart de pion chacune, ce qui n'est pas cher, mais qui se répètent. À lire coup par coup par l'Expert
avant de dire si le livre a tort ou si le coach s'y accroche trop longtemps.

**Désaccord de moteurs** : KID, coach Blancs : SF 19 médiane −0,03, SF 17.1 +1,12 ; le plan en cause est la colonne c
(CHAINE_D5 · colonne c : médiane 0,01 à SF 19, 1,01 à SF 17.1, vingt segments). Un plan qu'un moteur dit gratuit et l'autre
un pion : la règle « un prix ne s'annonce qu'à deux voix » s'applique.

## 5. Les autres chiffres (§ 9 de la relecture)

| | SF 19 livre / prix | SF 17.1 livre / prix |
|---|---|---|
| part des coups sous plan (médiane par partie) | 19 % / 19 % | 20 % / 20 % |
| demi-coups « sans plan, table épuisée » (médiane par partie) | 26 / 26 | 26 / 26 |
| nulles par répétition | 26 / 23 | 25 / 25 |
| bascules de structure | 26 / 25 | 22 / 22 |
| segments gratuits (dont lisant 0) | 36 (35) / 29 (27) | 34 (34) / 33 (33) |
| fins de segment, livre : réalisé / hors de prix / sans objet / bascule / fin de partie | 181 / 55 / 91 / 26 / 13 | 206 / 67 / 79 / 22 / 6 |

- **Le coach parle un coup sur cinq.** Sur quarante coups du coach par partie, environ huit sont sous plan ; **vingt-six
  coups du coach par partie** se jouent avec une structure reconnue mais la table de plans épuisée. C'est la mesure de ce que
  rapporterait le plan de service après abandon (règle 1 du § 9, différée) : beaucoup de place, donc une règle qui
  changerait le lot. Le critère passe sur ce que le coach dit, pas sur ce qu'il tait.
- **Σ retards contre prix ligne** (contrôle proposé par le GE) : écart médian +0,20 (SF 19) et +0,24 (SF 17.1), à 25 cp près
  dans une partie sur deux. La coïncidence de la partie fraîche (+1,10 / +1,22) **ne tient pas** sur le lot : la mesure
  rejetée ne devient pas un contrôle gratuit de la mesure retenue.
- **Nulles par répétition** : une partie sur huit côté contraint, sans concentration nette (au plus 4 sur 10 : fr-avance-noirs
  Blancs, fr-echange Noirs et KID Blancs à SF 17.1).

## 6. L'accord des moteurs

**Sur le lot, les deux moteurs disent la même chose** : moyennes identiques à un centième près (+0,26 / +0,26 livre), médianes
à cinq centièmes, mêmes positions à problème. **Partie par partie, ils ne s'accordent pas** : sur les 151 parties chiffrées
aux deux moteurs, l'écart de coût est de 0,55 pion en médiane et le signe n'est le même qu'une fois sur deux (46 %). C'est
la leçon du faisceau, en plus net : **le prix d'une partie n'est pas une information, le prix de deux cents parties en est
une**. Le coach ne peut pas dire « ce plan t'a coûté 0,4 dans cette partie » ; il peut dire « ce plan coûte en moyenne un
quart de pion dans cette structure ».

## 7. Ce que le rapport ne dit pas

- Pas de robustesse : le lot de perturbation (graines 11–20, profondeurs 17 et 19, ordre ex æquo ; relecture § 11) n'est pas
  joué et attend l'accord du GE. Le faisceau a passé un critère sur un tirage et ne l'a plus passé sous secousse ; le même
  risque existe ici, moindre (deux cents parties, pas dix positions), mais non mesuré.
- Pas de valeur pédagogique : on mesure ce que coûte la théorie à un exécutant parfait, pas ce qu'elle apporte à un joueur
  de 1500. C'est l'épreuve Maia.
- Le coût des dix coups qui suivent une bascule (protocole § 4.3) n'est pas encore calculé.

## 8. Suite proposée (rien ne démarre sans le go de Sébastien)

1. L'Expert lit coup par coup fr-avance-noirs (Noirs) et iqp-panov (Noirs) aux deux moteurs : le livre a-t-il tort, ou le
   coach s'accroche-t-il ?
2. Le lot de perturbation, après accord du GE sur la spécification.
3. Puis seulement : retouches de l'instrument, service après abandon, épreuve Maia.
