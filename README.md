# Hi_planering

Statiska planeringssidor som hämtar veckoplanering live från Google Sheets
(en flik per kurs) och visar den som en enkel meny + tabell.

## Struktur

- `index.html` – neutral sida på repots rot. Den länkar **inte** till
  någon klass, så ingen kan bläddra sig fram till andra klassers
  planering därifrån.
- `<ämne>/<klass>/index.html` – varje ämne får en egen toppmapp, och varje
  klass/kurskod inom ämnet en egen undermapp med en egen, självständig
  kopia av sidan. Ingen kod eller konfiguration delas mellan klasssidorna
  vid körning.
- Just nu: `hi1b/naa24`, `hi1b/nab24`, `hi1b/ek26`, `sva1/nab26`,
  `sva2/ekna25-1`, `sve3/eka24` – sex klasser, varsitt Google Sheet.

## Länkar till klassernas sidor

Varken rotsidan eller kurssidorna länkar till andra klasser (se
"Om integritet mellan kurser" nedan), så här är en samlad lista för eget
bruk:

| Kurs | Klass | URL |
|---|---|---|
| Historia 1b | NAA24 | https://erengisle.github.io/Hi_planering/hi1b/naa24/ |
| Historia 1b | NAB24 | https://erengisle.github.io/Hi_planering/hi1b/nab24/ |
| Historia 1b | EK26 | https://erengisle.github.io/Hi_planering/hi1b/ek26/ |
| Svenska som andraspråk 1 | NAB26 | https://erengisle.github.io/Hi_planering/sva1/nab26/ |
| Svenska som andraspråk 2 | EKNA25:1 | https://erengisle.github.io/Hi_planering/sva2/ekna25-1/ |
| Svenska 3 | EKA24 | https://erengisle.github.io/Hi_planering/sve3/eka24/ |

## Lägga till en ny kurs/klass

1. Skapa en flik i Google Sheet (eller ett eget kalkylark) med kolumnerna
   `Moment, Vecka, <dag 1>, Läxa <dag 1>, <dag 2>, Läxa <dag 2>` – de
   två dagkolumnerna behöver inte heta Onsdag/Torsdag, det är bara de
   faktiska mötesdagarna för just den klassen. Kolumnerna läses efter
   **position**, inte namn, så ordningen måste stämma exakt. Sidan
   visar respektive läxkolumns text under etiketten **"Läxa"** direkt
   i den dagens ruta i veckokortet, bara om cellen har innehåll.
2. Dela fliken/arket som **"Alla med länken kan visa"** – sidan hämtar
   data anonymt via Google Sheets gviz-API, vilket kräver att arket är
   öppet för läsning för den som har länken.
3. Kopiera en befintlig `index.html` till `<ämne>/<klass>/index.html`,
   t.ex. `samhallskunskap/naa24/index.html` för ett nytt ämne, eller
   `hi1b/nya-klassen/index.html` för en ny klass i ett befintligt ämne.
4. Ändra i den nya filen:
   - `<title>` och rubriken i `<h1>` i headern
   - `SHEET_ID` och `GID` längst ner i `<script>`-blocket
   - Texten i `<h2>` i sidomenyn (t.ex. "Moment" eller "Vecka") – rent
     kosmetiskt, styr bara rubriken ovanför menyn, ingen kodlogik bryr
     sig om vad den säger
   - De två dagkolumnernas rubriker, `DAY1_LABEL` och `DAY2_LABEL`
     längst ner i `<script>`-blocket – sätt dem till klassens faktiska
     mötesdagar och tider, t.ex. `'Måndag 12.15 - 13.20 (60 min)'`
5. Skriv välkomsttexten direkt i arket (se "Ändra välkomsttexten" nedan) –
   du behöver alltså inte röra HTML-filen för det.
6. Committa och dela **bara** länken till den nya mappen med rätt klass,
   t.ex. `https://<ditt-github-pages-namn>/hi1b/nya-klassen/`.

## Ändra välkomsttexten

Texten under "Välkommen!" hämtas från samma flik som planeringen. Lägg
till en rad i arket med:
- kolumnen **Moment** = `Info`
- **sista kolumnen** (Läxa dag 2) = välkomsttexten

Vill du ha flera stycken, gör en radbrytning i cellen (Alt+Enter i Google
Sheets) mellan varje stycke. Raden visas aldrig i menyn eller planeringen
(precis som en rad med `Omprov` i Moment-kolumnen filtreras bort), utan
blir bara till välkomsttexten. Saknas en `Info`-rad visas texten som
redan står i `index.html`-filen (under `<div class="intro-text">`) som
standard.

Har en klass inga riktiga "moment"? Skriv bara veckonumret i
Moment-kolumnen också – då blir veckonumret rubrik för varje sida i
menyn istället för ett temanamn. (`UNIT_LABEL` i `<script>`-blocket
styr detta – sätt den till `'Vecka'` istället för `'Moment'` för en
sådan klass. Just nu använder alla sex klasser `'Moment'`.)

## Veckor som delas mellan två moment

Sidan grupperar rader strikt efter texten i kolumnen **Moment**, inte
efter vecka. Har du en vecka där ett moment avslutas och nästa moment
börjar, skriv **två rader** med samma veckonummer men olika Moment –
t.ex.:

| Moment | Vecka | Onsdag | Läxa (Onsdag) | Torsdag | Läxa (Torsdag) |
|---|---|---|---|---|---|
| 1. Första världskriget | 41 | | | | |
| 2. Mellankrigstiden | 41 | Introduktion... | | | |

Första raden hamnar sist i "Första världskrigets" tabell, andra raden
först i "Mellankrigstidens" tabell.

En rad tas alltid med så länge kolumnen **Moment** är ifylld – även om
alla övriga kolumner är helt tomma visas veckonumret ändå i tabellen.
Du behöver alltså inte skriva någon anteckning bara för att få med en
vecka. **Undantag:** är raden helt tom (varken dag- eller läxtext) och
veckonumret även förekommer på en rad under ett *annat* moment (som i
exemplet ovan), tolkas den som en ren gränsmarkering och visas inte
som ett eget kort – den bidrar ändå till momentets veckospann i
chipsen ("v.X–Y").

En rad med `Omprov` i Moment-kolumnen filtreras alltid bort, precis som
`Info`-raden.

## Sammanfattning per moment

Vill du skriva en sammanfattning för ett helt moment (t.ex. vilka
sidor eller områden som gäller inför ett prov), lägg till en rad med
**Moment** ifyllt men **Vecka lämnad tom**:

| Moment | Vecka | Onsdag | Läxa (Onsdag) | Torsdag | Läxa (Torsdag) |
|---|---|---|---|---|---|
| 1. Första världskriget | | | | | Läs sid 26–31. Kunna: orsaker till kriget, viktiga årtal. |

Sista kolumnens text visas då i en egen ruta överst i momentets vy,
ovanför veckokorten, istället för att bli en egen (tom) vecka.

## Prov och nedräkning

Ett prov hittas automatiskt när en cell innehåller något av orden
**prov** eller **litteratursamtal** (stora/små bokstäver spelar ingen
roll). Du behöver inte skriva något datum – det räknas ut från
veckonumret och veckodagen:

- **I en dagkolumn** (t.ex. "Prov på kap 5–6"): provet ligger den dagen,
  enligt veckodagen i kolumnrubriken (`DAY1_LABEL`/`DAY2_LABEL`).
- **Som kommentar i sista kolumnen** (Läxa dag 2, kolumn F), när provet
  ligger en annan dag än lektionsdagarna: provet räknas då alltid som
  **tisdagen** den veckan (`COMMENT_EXAM_DAY` i koden). Står provet redan
  i en dagkolumn på samma rad räknas kommentaren inte en gång till.

Obs: allt som innehåller orden räknas, även t.ex. "Plugga inför provet".
Använd därför "prov"/"litteratursamtal" bara när det faktiskt är ett
prov. Fler ord kan läggas till i `EXAM_WORDS` i koden.

Vill du ange datumet själv (t.ex. om provet ligger en annan dag än
lektionsdagarna) skriver du det på momentets sammanfattningsrad
(Moment ifyllt, Vecka tom) i **Läxa-kolumnen för dag 1**, i formatet
`ÅÅÅÅ-MM-DD`. Ett sådant datum går före det uträknade:

| Moment | Vecka | Onsdag | Läxa (Onsdag) | Torsdag | Läxa (Torsdag) |
|---|---|---|---|---|---|
| 1. Första världskriget | | | 2026-10-13 | | Läs sid 26–31. |

Proven visas på två ställen:

- **Momentets vy:** en markerad provrad direkt under rubriken med
  datum, vecka och nedräkning ("X dagar till provet", "Prov idag!"
  eller "Genomfört" när datumet passerat).
- **Startsidan:** listan "Prov i planeringen" med alla prov i
  terminens planering – vecka, moment, datum och nedräkning. Klick på
  ett prov öppnar momentet. Genomförda prov visas nedtonade.

## Om integritet mellan kurser

Varje klass nås bara via sin egen adress – rotsidan visar ingen lista
över klasserna och kurssidorna länkar inte till varandra. Varje
klasssida är fristående och avslöjar inte andra klassers Sheet-ID i sin
källkod. Obs: om repot är publikt på GitHub kan den som letar i koden
ändå hitta mapparna – det här skyddar mot att man råkar bläddra dit,
inte mot den som aktivt söker. Observera att steg 2 ovan (delning av arket)
gör kalkylarket läsbart för vem som helst med den direkta Sheet-länken,
oavsett vilken sida som länkar dit – lägg därför inte in känsliga
uppgifter om enskilda elever i arken.
