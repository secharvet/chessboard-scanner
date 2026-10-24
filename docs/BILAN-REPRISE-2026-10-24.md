# Bilan de la reprise, du 8 au 24 octobre 2026

Écrit le 24 octobre 2026 à la demande de Sébastien, pour lui et pour le GE. Le projet s'arrête une seconde fois. La
première clôture date du 8 octobre 2026 à 5 h 30 (« mauvais joueur, mauvais coach, j'arrête les frais »). Ce bilan couvre
tout ce qui a été ajouté et exploré depuis, sans rien omettre de ce qui est écrit dans le dépôt. Les chiffres viennent
des documents de `docs/plans/`, du journal, de la base de données et des dossiers de résultats ; là où un chiffre n'existe
pas, je le dis.

Trois mots pour lire la suite : **le livre** est le texte d'une ouverture (positions, coups, fautes, explications) ;
**le coach** est le programme qui choisit un plan et le dicte à Stockfish dans les parties de mesure ; **le GE** est le
relecteur extérieur, qui ne voit pas l'échiquier.

---

## 1. Les deux projets de la reprise

Le 8 octobre au matin, après la clôture du coach IA, le projet a été réorienté en **plateforme éducative ouverte pour les
clubs** : des enseignants signent l'explication de chaque coup d'une ouverture, l'apprenant choisit son professeur,
l'IA ne fait que des brouillons vérifiés au moteur. C'est le projet A.

Le 18 octobre, sur une question posée par l'Expert, la recherche sur les plans a été **rouverte de façon bornée** : non plus
un coach qui parle, mais un **arbitre** qui donne un prix à un plan. Chaque étape devait demander son propre go. C'est le
projet B. Il a occupé l'essentiel des sept derniers jours.

Volume depuis le 8 octobre : **196 commits**, 24 documents de recherche et 29 annexes dans `docs/plans/`, plus de
**3 000 parties complètes** jouées par le moteur sur les deux machines (VPS et Orion), environ 200 parties Maia, et une
dizaine de nuits de calcul.

---

## 2. Projet A : la plateforme. Ce qui existe et marche

Tout ce qui suit est en ligne (branche `coach-grounded`), sauf mention contraire.

### 2.1 Les livres d'ouvertures

| Livre | Positions | Comment il a été fait |
|---|---|---|
| Défense française | 568 | noyau à la main, prolongé par brouillons IA vérifiés au moteur (toutes lignes au 10e coup, principale au 15e), 35 lignes nommées ECO ajoutées par l'Expert |
| Partie italienne | 184 | noyau de 29 positions à la main, vérifié 54/60 plans et 45/49 fautes, prolongé puis recentré (305 → 179) |
| Espagnole | 495 | noyau de 38 puis 48 positions à la main, relu par l'Expert, 730 punitions |

Au total **1 247 positions, 4 682 coups**, dont 1 217 coups principaux, 1 741 variantes, **1 707 fautes typiques avec leur
punition calculée au moteur** (3 à 4 coups puis rembobinage), et 17 « portes » vers d'autres ouvertures. Noms officiels
des variantes par le référentiel ECO, hérités du plus proche ancêtre nommé.

Chaîne de production : `scripts/ouvertures/{etendre,construire,punitions}.mjs` (moteur + brouillon IA + vérification).
Un livre de base écrit à la main reste nécessaire pour chaque nouvelle ouverture.

### 2.2 L'assistant d'ouverture (`ouverture.html`)

Échiquier, récit coup par coup, survol d'un coup = aperçu de l'enchaînement, clic = le coup et sa phrase, déplacement des
pièces, fautes typiques jouées avec leur punition, plusieurs livres avec bascule automatique vers celui qui connaît la
position, choix du professeur et **comparaison de deux professeurs côte à côte**, cases et coups cités survolables dans
le texte, message clair hors du livre, fonctionnement dégradé si le serveur ne répond pas.

**Entraînement contre Stockfish** sur la même page : l'adversaire suit le livre tant que la position y est (ligne principale
le plus souvent, parfois une variante), puis joue librement ; trois niveaux ; « Voir dans le livre ».

**L'éventail du livre** (24 octobre, commit `8f286b9`, **pas en ligne**) : l'arbre du livre en cercles concentriques, le
chemin joué allumé, la position courante cerclée, clic pour aller à une position, vue d'ensemble. Nouvelle route
`GET /api/livres/:id/arbre`. Caché sur téléphone pour l'instant.

### 2.3 La plateforme enseignants

Spécification `docs/SPEC-EDITEUR-ENSEIGNANT.md`, étapes 1 à 6 livrées en première version la nuit du 16 au 17 octobre
(« carte blanche 4 h »), étape 7 partielle :

- **Base Postgres** en Podman Quadlet, API Node conteneurisée avec le code monté en volume (zéro rebuild), migrations,
  import des livres en base, export vers les fichiers statiques (secours), **sauvegarde quotidienne** (14 jours).
- **Comptes** par invitation, courriel + mot de passe (scrypt), sessions, rôles apprenant / enseignant / validateur / admin,
  changement et **récupération du mot de passe par courriel**, plafond de tentatives, formulaires en POST, licence
  CC BY-SA 4.0 à l'inscription.
- **API** : positions, coups, explications, versions, remarques, réordonnancement des coups, limite d'écritures.
- **Éditeur** (`editeur.html`) : écrire l'explication d'une position, modes de l'échiquier (cases, flèches), coups proposés,
  aperçu, brouillon et publication, historique des versions, comparaison de deux versions, remarques, vérification moteur,
  réordonnancement par glisser.
- **Administration** (`admin.html`) : pleine page, auteur de référence par livre, matrice de sécurité rôles × pages, vue
  apprenant.
- Pages : accueil, connexion, guide de l'enseignant, paramètres, 404 réelle.
- **Refonte visuelle** Bootstrap 5 en local, thème clair / sombre, deux dispositions (barre latérale / barre haute),
  téléphone (onglets en haut, un échiquier), 6 jeux de pièces, taille de l'échiquier réglable, son des coups (enregistrements
  Lichess), animation des pièces.
- **Vérification** : 321 tests automatiques (0 échec), 9 pages passées dans Chromium sans tête, scénario enseignant complet
  joué automatiquement, test de l'API dans le conteneur.

### 2.4 Ce que la plateforme n'a pas

- **Aucun utilisateur réel.** 4 comptes : le compte IA (auteur des 1 217 explications publiées), un professeur de
  démonstration (1 texte), un admin de démonstration, et Sébastien. **Aucun enseignant n'a été invité**, aucun apprenant
  n'a jamais ouvert le site. L'étape 7 (« premier enseignant réel invité ») n'a pas eu lieu. Le professeur partenaire
  pressenti (Marc) n'a pas été contacté.
- Pas de courriels automatiques (pas de SMTP), pas de mode épreuve / récitation (l'élève joue l'ouverture de mémoire),
  pas de parcours d'apprenant (progression, diplôme), pas de vidéo du professeur, pas de catalogue au-delà de trois livres
  (Londres et Caro-Kann étaient les suivants).
- L'éventail n'est pas déployé.

**Jugement honnête :** c'est la seule partie du projet qui a une forme finie, une direction et un public possible. Elle n'a
jamais été mise devant ce public.

---

## 3. Projet B : la recherche sur les plans, du 18 au 24 octobre

Chronologie, avec pour chaque étape la question, le résultat chiffré et le verdict. Toutes les mesures sont à un fil, en
mode déterministe, avec deux passes fraîches identiques avant publication (règle acquise le 18 octobre : à plusieurs fils,
le bruit des fils, 17 cp, est du même ordre que l'effet de la profondeur, 25 cp).

### 3.1 Le filtre de compatibilité (18 octobre)

**Question :** peut-on dire « ce coup est un pas vers ce plan » sans règle d'échecs codée en dur ?
**Méthode :** une distance par famille de plan (rupture, transfert, échange, colonne), tous les coups légaux de 10 positions
notés par Stockfish 19 à profondeur 18, 35 plans ; puis un test à deux demi-coups (préparatoire ou préférence).
**Résultat :** la distance reconnaît bien les coups préparatoires (a3 et Tab1 avant b4-b5, Dd3 avant Ce5). Mais la
distribution des écarts est continue : **aucun seuil ne sépare « préparation » de « préférence »**. Plafond du test :
60 % de lignes annonçables (accord des deux moteurs 21/35). Une seule phrase de coach en est sortie : « Fg5 se joue avant
…h6, après c'est fermé ».
**Mesures de bruit** (nuit de stabilité) : plancher **25 cp** ; un pli de profondeur change le statut de 9 lignes sur 12
quand la réponse adverse change ; changer de moteur change 11 signes sur 35 ; VPS et Orion identiques au centième.
**Verdict :** mécanique saine, pas de critère chiffré. On arrête de polir le test.

### 3.2 Le faisceau : le prix d'un plan sur 15 coups (18–19 octobre)

**Question :** un plan imposé au moteur pendant 15 coups a-t-il un prix mesurable, et le plan du livre est-il le moins cher ?
**Critère écrit avant le code :** dans au moins 70 % des positions, aucun plan hors livre ne bat le plan du livre de plus
de 25 cp (ou la profondeur 30 donne raison au livre).
**Résultat :** à profondeur 18, 6 positions sur 10 ; avec les arbitrages de l'Expert à profondeur 30, **9 sur 10** (18 oct.,
23 h 55 : « le critère passe »). Le lendemain, la table de hachage du moteur s'avère compter : 17 phrases sur 35 changent
selon son état. Sous 6 tirages (profondeur 17/18/19 × table vidée ou gardée, 2 h sur Orion), le critère passe dans
**2 tirages sur 6** (3 sur 6 après correction de trois désignations fausses du panel).
**Verdict du GE (19 oct., 18 h) :** « le verdict d'hier est un tirage », « reproductible n'est pas robuste », **« ce n'est
pas un verdict, et la piste est fermée »**. Le 9/10 est retiré. Ce qui a tenu : « le plan est plus stable que le coup,
l'ordre plus stable que le prix, le prix plus stable que la phrase ».

### 3.3 L'épreuve du jeu, lot 1 (19–20 octobre)

**Question :** « la théorie du coach, exécutée par quelqu'un qui calcule, coûte-t-elle quelque chose ? » Le coach dicte le
plan, Stockfish l'exécute, un autre Stockfish joue librement en face.
**Taille :** 20 départs-camps × 10 parties × 3 bras (coach-livre, coach-prix, témoin libre) × 2 moteurs = **1 200 parties**,
0 échec.
**Critère écrit avant :** coût médian ≤ 0,25 pion et moyen ≤ 0,50, aux deux moteurs.
**Résultat :** médiane **+0,10**, moyenne **+0,27** à SF 19 et SF 17.1 (identiques au centième). **Le critère passe.**
Mais : une partie sur 15 tourne mal sous coach (5 à 7 %) contre une sur 100 sans ; le coach-prix joue la même partie que le
coach-livre 4 fois sur 5 ; le coach ne parle qu'un coup sur cinq (19 à 20 % des coups sous plan) ; les deux moteurs ne
sont d'accord sur le prix d'une partie qu'une fois sur deux.
**Lecture des 16 parties perdues (Expert) :** « le livre n'a tort nulle part ; le coach s'accroche dans treize parties »
(il paie plusieurs fois le même plan, personne ne tient l'addition).
**Phrase du GE :** « le livre a raison partout, le coach perd parce qu'il ne sait pas s'arrêter, et savoir s'arrêter est une
règle qu'on peut écrire. »

### 3.4 Lot 1 bis : savoir s'arrêter (20–21 octobre)

**Règles ajoutées :** A = cumul des retards d'un plan lu avant le coup, plan abandonné à 1,00 pion, dernière chance relue à
profondeur 18 ; B = A + « attente utile » (un coup qui sert un plan du catalogue à ≤ 0,25).
**Critère ajouté par le GE :** au plus **3 parties perdues sur 100** sous coach.
**Taille :** **1 200 parties**, 0 échec.
**Résultat :** coût moyen en baisse d'environ 40 % (+0,27 → +0,16 à +0,19). Perdues : **7/200 (3,5 %) à SF 19, ne passe
pas ; 4 à 5/200 (2 à 2,5 %) à SF 17.1, passe**. Les règles B n'apportent rien (à SF 17.1, 20 parties mieux, 14 pire). Le
coach-prix n'ajoute rien au livre (écart apparié −0,01). Le verrou restant : la **Panov avec les Noirs**, 4 parties perdues
sur 10 dans chaque bras.
**Synthèse du GE :** le coach « coûte un sixième de pion par partie et perd 3 à 4 fois sur 100 au lieu d'une ». Règles A
gardées, bras B et prix retirés. La question qui reste : « ce coach rend-il un joueur de 1500 meilleur ? »

### 3.5 Les pilotes Maia : un élève de 1500 (21–22 octobre)

**Question :** le coach-livre rend-il meilleur un joueur imparfait ? Maia-1500 tient lieu d'élève ; l'élève guidé joue ses
coups probables filtrés par le plan ; Stockfish ne joue jamais.
**Protocole complet** (relu par les trois) : 1 500 parties, barre unique score guidé ≥ 55 %. **Jamais joué** : seuls deux
pilotes ont tourné.
**Pilote 1** (Panov, 25 + 25 parties) : aucune partie ne va au bout, 15 arrêts sur mat vu dont 8 mats en 1 ; le coach n'a
changé que 23 coups sur 348. Il se tait parce que les plans sont trop petits, pas parce que leurs pas sont hors de portée
d'un 1500 (3 plans sur 48 seulement « faute de coup probable »).
**Pilote 2** (Carlsbad et Panov, 3 bras × 25 parties) :
- **établi** : dans la Carlsbad, un pas du plan figure parmi les coups probables d'un 1500 dans **27 % des coups**
  seulement, et le meilleur pas a une probabilité médiane de **2,8 %**. Les plans du livre ne sont pas des coups qu'un 1500
  trouve seul ;
- **pas établi** : que souffler ces coups aide. Carlsbad : élève libre 7,5/25, guidé strict 8,5/25, soufflé 11/25 (dans le
  bruit, ± 3 à 4). Panov : libre 14/25, strict 12/25, **soufflé 7/25** (en limite). « Aucun des deux n'est un résultat » :
  Maia à 1 nœud se fait mater, la loterie tactique domine.

### 3.6 L'attaque de roi : du veto à l'alarme (21–24 octobre)

**Question :** faire voir au coach l'attaque de roi qui perd la Panov (Dd3 + h4 + Fh6 pendant que le Cf6 part en d5).
**Étapes :**
1. Prédicat « attaque arrivée » de l'Expert (2 attaquants dont 1 au contact) : allumé dans **91,5 % des parties non
   perdues**, « un épouvantail ». Après deux retouches : 4,7 % des non-perdues, 20,5 % des perdues, mais 19 parties du
   Tarrasch ouvert touchées à tort.
2. Nuit d'observation hors échantillon (200 parties neuves, seuils écrits avant) : candidat 1 (veto + **dame adverse parmi
   les attaquants**) passe **« de justesse et sur peu »** (4/195, 2/5, une partie de moins et il échouait) ; candidat 2
   (pression graduée du GE) muet, fermé.
3. Test Panov, veto contre A, 50 paires : 14 perdues → 8, **6 sauvées, 0 nouvelle défaite**, coût apparié −0,61.
4. **Alarme** (24 oct.) : le candidat 1 ne devient pas un interdit mais déclenche une vérification à profondeur 24 ; le pas
   est gardé s'il coûte ≤ 50 cp, sinon le moteur joue son meilleur coup. Résultats : Panov, **37 paires sur 50** (lot arrêté
   par Sébastien après 1 h 15) : perdues 11 → 6, **5 sauvées, 0 nouvelle défaite**. Panel hors Panov, 100 paires (taille
   réduite à la demande de Sébastien) : **5 perdues de chaque côté, les mêmes ; 99 parties identiques, une allégée ;
   l'alarme a sonné 2 fois en 100 parties**.
**Verdict de l'Expert :** hors de la Panov, l'alarme est inoffensive, ce qui ne prouve pas qu'elle y soit utile. « Outil
étroit », aucune prétention générale sur la sécurité du roi.

### 3.7 Ce que les sept jours de recherche ont établi

Ce qui est **mesuré et tient** :
- Le livre a raison : dans 16 parties perdues lues coup par coup, le plan du livre n'était jamais la cause.
- Un plan du livre, exécuté par un moteur, ne coûte presque rien : un dixième de pion en médiane, un sixième en moyenne
  avec les règles A, aux deux moteurs.
- La règle « savoir s'arrêter » (cumul à 1,00) réduit le coût de 40 %, et la queue de 5–7 % à 2–3,5 %.
- Les pas d'un plan positionnel (a3, Tb1 avant b5) ne sont pas dans le répertoire naturel d'un 1500 (27 %, 2,8 %).
- Le bruit de mesure est connu : 25 cp ; à plusieurs fils, on mesure les fils.

Ce qui est **mesuré et ne tient pas** :
- Un critère par position sur un panel de dix : fermé par le GE (2 tirages sur 6).
- Le coach-prix (l'arbitre) n'ajoute rien au livre.
- L'attente utile (règles B) n'ajoute rien.
- Le détecteur d'attaque de roi général : un épouvantail ; seule la version « avec la dame » survit, de justesse.

Ce qui **n'a pas été mesuré** :
- Si le coach rend un élève meilleur. Le protocole Maia (1 500 parties) n'a jamais été joué. Les deux pilotes (200 parties)
  ne concluent rien.
- Le lot de perturbation de l'épreuve du jeu (robustesse) : jamais joué.
- Le coach en face d'un humain : jamais. Depuis la clôture du 8 octobre, **aucune ligne de la recherche n'a produit une
  phrase lue par un joueur**.

---

## 4. Mise au point sur « plus mauvais qu'un 1500 »

Aucune mesure de la reprise ne dit cela. Ce que les chiffres disent :
- Le 8 octobre, **le modèle appris** (le réseau entraîné sur les parties, avant la reprise) faisait 1/20 contre un 1500
  comme joueur : **sous 1 200 Elo**. C'est ce qui a motivé la première clôture. Ce modèle n'est plus utilisé.
- Depuis, le coach des parties de mesure est **Stockfish contraint par un plan**. Il perd 2 à 3,5 parties sur 100 contre
  Stockfish libre, au lieu d'une. Ce n'est pas un niveau de 1500 : c'est un moteur qu'on handicape d'un sixième de pion.
- Les pilotes Maia mesurent l'effet du guidage sur un 1500, pas le niveau du coach. Le seul chiffre défavorable (Panov
  soufflé 7/25 contre 14/25 libre) est déclaré non concluant dans le document même.

Le vrai constat est autre, et il est pire pour le projet : **le coach n'est utile nulle part où on l'a mesuré.** Il ne vaut
pas plus que le livre ; là où il parle, il coûte un peu ; là où il se tait (quatre coups sur cinq), il ne sert à rien ; et
on ne sait pas s'il aide un élève, parce que la mesure n'a pas été faite.

---

## 5. Pourquoi on ne progresse plus : mon diagnostic

1. **La recherche a répondu à des questions de plus en plus étroites.** Le 18 octobre, la question était « un plan a-t-il
   un prix ? ». Le 24, c'est « une alarme qui sonne deux fois sur cent parties fait-elle du mal ? ». Chaque étape était
   méthodiquement propre (critère écrit avant, deux moteurs, un fil, relecture par trois), et chaque étape rétrécissait le
   sujet. Personne, moi le premier, n'a arrêté la descente.
2. **Aucune étape n'a été reliée à un utilisateur.** La plateforme attend un professeur depuis le 17 octobre. La recherche
   n'a jamais produit une phrase affichée sur une page. Les deux projets n'ont pas communiqué.
3. **Le coût de coordination est tombé sur Sébastien.** Trois sessions d'agents, un relecteur extérieur, des messages à
   relayer dans les deux sens, des comptes rendus chiffrés sans direction. Il a dit ne rien comprendre aux rapports : c'est
   un fait, pas une humeur.
4. **Le sujet de fond n'est pas résolu.** La première clôture disait : « non obtenu : la formulation du but, le plan au-delà
   du coup ». Sept jours plus tard, on sait chiffrer un plan, pas le choisir ni l'expliquer. La question d'origine (un coach
   qui dit pourquoi) n'a pas avancé.

---

## 6. Si quelque chose doit être sauvé

Trois voies, du plus sûr au plus incertain. Aucune n'est lancée.

**A. La plateforme seule, devant un vrai professeur.** Tout existe : trois livres, l'éditeur, les comptes, la comparaison de
professeurs. Il manque une invitation. Un professeur qui écrit dix explications de la Française dans l'éditeur dit en une
heure si l'outil vaut quelque chose. Coût : une invitation et une semaine d'écoute. Risque : qu'il n'écrive pas.

**B. Geler la recherche, documentée.** Elle l'est déjà : 24 documents, critères et verdicts datés. Ce qu'on en garde si on
revient : les règles A (savoir s'arrêter), l'alarme comme déclencheur étroit, le protocole Maia prêt. Ce qui reste à faire
pour une vraie réponse : jouer le protocole Maia (1 500 parties, deux soirées). C'est la seule mesure qui répond à « le coach
sert-il à un élève ? ». Si la réponse est non, le projet B est clos proprement.

**C. Reprendre la question d'origine par un autre bout.** Le coach qui explique a été fermé parce qu'il inventait. Depuis,
on sait produire une matière vérifiée (le prix d'un plan, le moment où il se ferme, la faute et sa punition). Un coach qui
ne dit **que** cela (« ce plan coûte, celui-là est gratuit, après …h6 c'est fermé ») n'invente rien. Il n'a jamais été
essayé devant un humain. C'est la voie la plus incertaine, et c'est au GE de dire si elle vaut une tentative.

---

## 7. État laissé le 24 octobre 2026

- **En ligne** (`coach-grounded`, VPS) : plateforme complète, trois livres, règles A dans le coach de mesure (non visible
  des utilisateurs). Le site n'a aucun utilisateur.
- **Non déployé** : l'éventail (`8f286b9`) et ce bilan, sur `dev-lead`. Branche `division` (code des lots) non fusionnée.
- **Orion** : clone gelé `~/dev/chessboard/cs-alarme`, résultats copiés sur le VPS dans `reports/plans/epreuve-attaque/`.
  Aucun processus en cours.
- **Base** : 4 comptes, 1 218 explications publiées (1 217 par l'IA), sauvegarde quotidienne active.
- **Dépenses machine** : VPS et Orion seulement ; aucune location GPU depuis le 8 octobre.
- **Dette** : `livres/*.js` modifiés et non commités dans le dossier du site ; `maquettes/` non versionné ; le journal
  `docs/JOURNAL-PLANS.md` s'arrête au 21 octobre, les décisions des 22–24 ne sont que dans les documents de `docs/plans/`.
