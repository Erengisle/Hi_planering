# Hi_planering

Statiska planeringssidor som hämtar veckoplanering live från Google Sheets
(en flik per kurs) och visar den som en enkel meny + tabell.

## Struktur

- `index.html` – landningssida på repots rot med en lista med länkar till
  alla klassers planeringssidor.
- `<ämne>/<klass>/index.html` – varje ämne får en egen toppmapp, och varje
  klass/kurskod inom ämnet en egen undermapp med en egen, självständig
  kopia av sidan. Ingen kod eller konfiguration delas mellan klasssidorna
  vid körning – bara landningssidan på roten länkar samlat till dem.
- Just nu: `hi1b/naa24`, `hi1b/nab24`, `hi1b/ek26`, `sva1/nab26`,
  `sva2/ekna25-1`, `sve3/eka24` – sex klasser, varsitt Google Sheet.

## Lägga till en ny kurs/klass

1. Skapa en flik i Google Sheet (eller ett eget kalkylark) med kolumnerna
   `Moment, Vecka, <dag 1>, <dag 2>, Kommentar` – de två mittersta
   kolumnerna behöver inte heta Onsdag/Torsdag, det är bara de faktiska
   mötesdagarna för just den klassen. Kolumnerna läses efter
   **position**, inte namn, så ordningen måste stämma exakt.
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
   - De två dagkolumnernas rubriker i `buildSections()`-funktionen
     (`['Vecka', '<dag 1>', '<dag 2>', 'Kommentar']`) – sätt dem till
     klassens faktiska mötesdagar och tider, t.ex.
     `'Måndag 12.15 - 13.20 (60 min)'`
5. Skriv välkomsttexten direkt i arket (se "Ändra välkomsttexten" nedan) –
   du behöver alltså inte röra HTML-filen för det.
6. Committa och dela **bara** länken till den nya mappen med rätt klass,
   t.ex. `https://<ditt-github-pages-namn>/hi1b/nya-klassen/`.

## Ändra välkomsttexten

Texten under "Välkommen!" hämtas från samma flik som planeringen. Lägg
till en rad i arket med:
- kolumnen **Moment** = `Info`
- kolumnen **Kommentar** = välkomsttexten

Vill du ha flera stycken, gör en radbrytning i cellen (Alt+Enter i Google
Sheets) mellan varje stycke. Raden visas aldrig i menyn eller planeringen
(precis som en rad med `Omprov` i Moment-kolumnen filtreras bort), utan
blir bara till välkomsttexten. Saknas en `Info`-rad visas texten som
redan står i `index.html`-filen (under `<div class="intro-text">`) som
standard.

Har din klass inga riktiga "moment" (t.ex. SVA/SVE-klasserna)? Skriv
bara veckonumret i Moment-kolumnen också – då blir veckonumret rubrik
för varje sida i menyn istället för ett temanamn.

## Veckor som delas mellan två moment

Sidan grupperar rader strikt efter texten i kolumnen **Moment**, inte
efter vecka. Har du en vecka där ett moment avslutas och nästa moment
börjar, skriv **två rader** med samma veckonummer men olika Moment –
t.ex.:

| Moment | Vecka | Onsdag | Torsdag | Kommentar |
|---|---|---|---|---|
| 1. Första världskriget | 41 | | | |
| 2. Mellankrigstiden | 41 | Introduktion... | | |

Första raden hamnar sist i "Första världskrigets" tabell, andra raden
först i "Mellankrigstidens" tabell.

En rad tas alltid med så länge kolumnen **Moment** är ifylld – även om
Onsdag, Torsdag och Kommentar är helt tomma visas veckonumret ändå i
tabellen. Du behöver alltså inte skriva någon anteckning bara för att
få med en vecka.

En rad med `Omprov` i Moment-kolumnen filtreras alltid bort, precis som
`Info`-raden.

## Om integritet mellan kurser

Rotsidan listar medvetet länkar till alla klasser (bedömt okej eftersom
det bara rör schema/planering, inga betyg eller personuppgifter). Varje
klasssida i sig är dock fristående och avslöjar inte andra klassers
Sheet-ID i sin källkod. Observera att steg 2 ovan (delning av arket)
gör kalkylarket läsbart för vem som helst med den direkta Sheet-länken,
oavsett vilken sida som länkar dit – lägg därför inte in känsliga
uppgifter om enskilda elever i arken.
