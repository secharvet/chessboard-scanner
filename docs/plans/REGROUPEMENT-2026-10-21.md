# Attaque de roi : le veto de défense (21 octobre 2026)

Go de Sébastien le 21 octobre (« attaque sur le roi »), proposition du GE (rapport du lot 1 bis § 7.2 ; protocole Maia
§ 9). Définition : l'Expert, le 21 oct., vérifiée sur pièces (chess.js, aucun moteur) dans les six positions où Cd5 a été
décidé. Relecture mécanique : Dev chef, avant tout code de jeu.

## 1. Pourquoi pas la proximité

L'atome regroupement actuel compte les pièces adverses à distance roi ≤ 3 de mon roi. Dans les fautes de la Panov
(coach Noirs, roi g8), il ne voit que Fh6 : il manque la dame d3, la moitié de l'attaque (batterie à longue portée).

## 2. Le prédicat « attaque arrivée »

- **Zone du roi** : le roi, ses cases voisines, et deux rangées devant lui (9 cases pour un roi en g8).
- **Attaquant** : une pièce adverse, ni pion ni roi, qui attaque au moins une case de la zone. Dame comprise. Les pions
  d'assaut (h4-h5) ne comptent pas : ils sont un levier sur le bouclier, notés au journal.
- **Au contact** : un attaquant qui attaque une case voisine du roi.
- **Attaque arrivée** = au moins **2 attaquants**, dont au moins **1 au contact**.
- Défenseurs : toutes mes pièces, dame comprise, sans préférence codée.

Sur pièces : les quatre positions de faute (SF 19 n° 1, 2, 7 au ply 7 ; SF 17.1 n° 2, 5, 9) ont Fh6 au contact (f8, g7)
et Dd3 sur g6, contre Cf6 (g8, h7), Fe7 (f6, f8) et une tour. Le Cd5 bon (SF 19 n° 9) et le n° 3 ont deux attaquants
mais aucun au contact. Une distance de l'attaque (coups adverses jusqu'au contact) est notée au journal, pas au
déclenchement : déclencher à un coup du contact aurait interdit le seul bon Cd5.

## 3. Le remède : un veto, pas un plan

Quand l'attaque est arrivée, **un pas de n'importe quel plan qui fait baisser le nombre de défenses des cases au contact
est non admissible**. C'est une fenêtre suspendue : le plan n'est pas faux, il attend ; neutre pour le compteur ; la
dernière chance est soumise au même veto (c'est elle qui a forcé Cd5 dans six parties sur neuf).

Le veto se lève quand l'attaque retombe : plus de contact, ou des défenses au moins égales aux attaques au contact,
constaté après la réponse adverse. Le plan du livre reprend (le blocage d5 reste le plan stratégique).

Pourquoi pas un plan de défense adopté : la défense que préfère le moteur n'est pas un regroupement (prof. 30, ply 7 :
Cg4 −0,86 en tête, Ff8 « regroupement » à −1,75, pire que Cd5). Le veto retire Cd5 ; le coup libre joué à la place est
celui du moteur. La distance de défense (combler le manque de défense au contact) reste écrite pour une phase 2.

## 4. Avant de jouer : la mesure hors échantillon

Le critère a été trouvé sur les six positions qu'il doit trier : il est ajusté. Avant les 50 parties, le prédicat tourne
**en observateur, sans jouer**, sur toutes les parties du lot 1 bis (20 départs-camps, deux moteurs). On publie combien
de fois il s'allume, et combien de fois il aurait vetoé un pas réellement joué, dans les parties gagnées comme perdues.
S'il s'allume partout, c'est un épouvantail, et on le dit avant de jouer.

## 5. Le test

Panov, coach Noirs, SF 19, règles A + veto contre A, **50 parties (n° 1-50)** aux mêmes graines (les 10 premières en A
existent dans le lot 1 bis, les 40 autres se jouent dans les deux bras). Veto **sans les coups forcés**. Critère, écrit
avant la première partie :

1. **Les perdues (< −2) baissent, comptées en paires** (mêmes graines) : parties perdues en A et sauvées avec le veto,
   contre l'inverse ; publié en nombres. Une simple différence de comptes à 50 parties est du bruit.
2. **Coût moyen apparié** : pas plus de +0,10 au-dessus de A.
3. **Chaque nouvelle défaite où le veto a agi est relue une par une** (Expert).
4. Le prédicat « dame » (§ 6.4) tourne en observateur sur ces 50 parties neuves.

Versé dans le coach qui guidera Maia seulement si 1 et 2 passent ; même alors, **le veto n'est pas généralisé** aux autres
départs sur ces preuves (§ 6).

## 6. Observateur sur le lot 1 bis et jugement de l'Expert (21 oct.)

Sortie : `reports/plans/epreuve-1bis/OBSERVATEUR-VETO.txt` (`scripts/plans/observer-veto.mjs`, lecture seule).

1. **Le prédicat seul est un épouvantail** : attaque « arrivée » dans 91,5 % des parties non perdues (24,5 % des coups du
   coach) et 100 % des perdues. La définition a échoué au test hors échantillon qu'elle s'était fixé ; c'est écrit tel
   quel.
2. Deux écarts de code validés par l'Expert : défenses comptées sur tout le bouclier (case du roi et voisines) ; levée du
   veto quand le prédicat ne tient plus.
3. **Retouches venues après les données**, à garder notées comme telles :
   - *un coup qui coupe l'attaque n'est pas vetoé* (le prédicat ne tient plus après lui) : de doctrine (l'interposition,
     Cf6-e4 qui bouche la diagonale du Fd3), mais trouvée sur la Carlsbad Noirs (54 parties vetoées sur 60 sans elle) ;
   - *une parade ou une reprise ne se vetoe jamais* : conformité à la règle du GE (le forcé d'abord), pas un ajustement ;
     12 …Tfd8 forcés de la Panov et 2 …Txc3 de la Carlsbad étaient vetoés à tort.
   Après les deux : pas vetoés dans 4,7 % des parties non perdues (61 pas sur 2 170) et 20,5 % des perdues (8 sur 39).
   **Ce sont des contrôles de cohérence, plus une preuve.** Panov Noirs : 7 parties touchées, dont 6 perdues — les vrais
   coupables, Cd5 au contact du Fh6.
4. **Collatéral : Tarrasch ouvert Noirs, 19 parties** (2 perdues), dont 18 vetos de …Dd6 (la batterie Dd6 + Fc7 contre h2,
   parmi les quatre candidats du moteur) contre une « attaque » de deux fous sans dame ni levier : c'est l'épouvantail qui
   parle. Pas de troisième condition trouvée sur ces 1 200 parties (l'erreur des repoussoirs). Une seule idée, écrite
   avant d'être mesurée, à tester seulement sur des parties neuves : **pas d'attaque de roi sans la dame adverse parmi
   les attaquants**.
