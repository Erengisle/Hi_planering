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
- Just nu: `hi1b/naa24`, `hi1b/nab24`, `hi1b/ek26` – tre klasser i Historia 1b
  (momentmallen), samt `sva1/nab26`, `sva2/ekna25-1`, `sve3/eka24` – tre
  SVA/SVE-klasser (veckomallen), varsitt Google Sheet.

## Två mallar: moment- eller veckobaserad

Det finns två varianter av `index.html`, beroende på hur kalkylarket är
uppbyggt. Kolumnerna läses efter **position**, inte namn, så det är
avgörande att kopiera rätt mall och fylla arket i rätt ordning.

**Momentmallen** (används av Hi1B-klasserna) grupperar veckorna under
rubriker per moment/tema:

| Moment | Vecka | Onsdag | Torsdag | Kommentar |
|---|---|---|---|---|

**Veckomallen** (används av SVA/SVE-klasserna) har ingen momentkolumn –
varje vecka blir sin egen sida med veckonumret som stor rubrik:

| Vecka | Måndag 12.15 - 13.20 (60 min) | Fredag 08.20 - 09.20 (60 min) | Kommentar |
|---|---|---|---|

Blanda inte ihop dem: fyller du i en veckomalls-sida enligt momentmallens
kolumnordning (eller tvärtom) tolkas fel kolumn som fel sak – t.ex. läses
Torsdag-kolumnen som välkomsttext, eller så tolkas ett veckonummer som ett
momentnamn.

## Lägga till en ny kurs/klass

1. Skapa en flik i Google Sheet (eller ett eget kalkylark) med kolumnerna
   för den mall du ska använda (se ovan).
2. Dela fliken/arket som **"Alla med länken kan visa"** – sidan hämtar
   data anonymt via Google Sheets gviz-API, vilket kräver att arket är
   öppet för läsning för den som har länken.
3. Kopiera en befintlig `index.html` som använder **samma mall** du valde
   i steg 1, till `<ämne>/<klass>/index.html`, t.ex. `hi1b/nya-klassen/`
   (momentmallen) eller `sva1/ny-klass/` (veckomallen).
4. Ändra i den nya filen:
   - `<title>` och rubriken i `<h1>` i headern
   - `SHEET_ID` och `GID` längst ner i `<script>`-blocket
5. Skriv välkomsttexten direkt i arket (se "Ändra välkomsttexten" nedan) –
   du behöver alltså inte röra HTML-filen för det.
6. Committa och dela **bara** länken till den nya mappen med rätt klass,
   t.ex. `https://<ditt-github-pages-namn>/hi1b/nya-klassen/`.

## Ändra välkomsttexten

Texten under "Välkommen!" hämtas från samma flik som planeringen. Lägg
till en rad i arket med:
- **Momentmallen:** kolumnen **Moment** = `Info`, kolumnen **Kommentar** = välkomsttexten
- **Veckomallen:** kolumnen **Vecka** = `Info`, kolumnen **Kommentar** = välkomsttexten

Vill du ha flera stycken, gör en radbrytning i cellen (Alt+Enter i Google
Sheets) mellan varje stycke. Raden visas aldrig i menyn eller planeringen,
utan blir bara till välkomsttexten. Saknas en `Info`-rad visas texten som
redan står i `index.html`-filen (under `<div class="intro-text">`) som
standard.

## Veckor som delas mellan två moment (endast momentmallen)

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
