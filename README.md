# Hi_planering

Statiska planeringssidor som hämtar veckoplanering live från Google Sheets
(en flik per kurs) och visar den som en enkel meny + tabell.

## Struktur

- `index.html` – Historia vårterminen 2026 (kursens sida ligger på repots rot).
- `<kursmapp>/index.html` – varje ny kurs får en egen mapp med en egen,
  självständig kopia av sidan. Ingen kod eller konfiguration delas mellan
  kurser vid körning, så en elev som har länken till en kurs kan inte se
  eller navigera till en annan kurs via sajten.

## Lägga till en ny kurs

1. Skapa en flik i Google Sheet (eller ett eget kalkylark) med kolumnerna
   `Moment, Vecka, Onsdag, Torsdag, Kommentar`.
2. Dela fliken/arket som **"Alla med länken kan visa"** – sidan hämtar
   data anonymt via Google Sheets gviz-API, vilket kräver att arket är
   öppet för läsning för den som har länken.
3. Kopiera `index.html` till en ny mapp, t.ex. `samhallskunskap/index.html`.
4. Ändra i den nya filen:
   - `<title>` och rubriken i `<h1>` i headern
   - introtexten under "Välkommen!"
   - `SHEET_ID` och `GID` längst ner i `<script>`-blocket
5. Committa och dela **bara** länken till den nya mappen med rätt klass,
   t.ex. `https://<ditt-github-pages-namn>/samhallskunskap/`.

## Om integritet mellan kurser

Sajten själv avslöjar aldrig andra kursers länkar eller Sheet-ID:n – varje
kurssida är fristående. Observera dock att steg 2 ovan (delning av arket)
gör kalkylarket läsbart för vem som helst med den direkta Sheet-länken,
oavsett vilken sida som länkar dit. Det är en rimlig nivå för schema och
planering, men lägg inte in känsliga uppgifter om enskilda elever i
arken.
