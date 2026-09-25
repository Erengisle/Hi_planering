# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Static GitHub Pages site showing live weekly course planning for a teacher's
classes. Each class page fetches its schedule from a Google Sheet (via the
gviz JSONP endpoint) and renders it client-side. No backend, no build step,
no package.json — every page is a single self-contained `index.html` with
inline `<style>` and `<script>`.

## Commands

There is no build, lint, or test tooling in this repo. It's plain HTML/CSS/JS
served as-is by GitHub Pages. To check a change locally:

```bash
python3 -m http.server 8811   # serve the repo root
```

Then open `http://localhost:8811/<ämne>/<klass>/` in a browser. The real
Google Sheets fetch will fail in a sandboxed/offline environment (expected —
it hits `docs.google.com`); to verify rendering logic without live data,
inject a mock response instead of the real network call, e.g. via a
Playwright script that blocks `**/gviz/tq**` and calls
`page.evaluate("(data) => { window.handleData(data); }", mockTable)` with a
gviz-shaped `{table: {cols, rows}}` object. This is how every parsing change
in this repo has been verified during development — there's no automated
test suite to run instead.

## Architecture

### Independent per-class pages (deliberate, not an oversight)

- `index.html` (repo root) — a directory listing all classes, grouped by
  subject. It is **not linked to from any course page** — that's an explicit
  design decision (students should only navigate within their own class, not
  browse into others' schedules).
- `<ämne>/<klass>/index.html` — one folder per subject, one subfolder per
  class/course code, each holding a fully independent copy of the page.
  **No code or config is shared between class pages at runtime.** When
  changing shared logic (parsing, rendering, CSS), the same edit has to be
  applied to all six files by hand — there is no template/build system.
  Current classes: `hi1b/naa24`, `hi1b/nab24`, `hi1b/ek26`, `sva1/nab26`,
  `sva2/ekna25-1`, `sve3/eka24`.
- `planering.csv` at the repo root is a legacy artifact from before the
  Google Sheets integration existed. It is not read by any page — ignore it
  unless asked about it directly.

### Data flow inside a class page

1. A `<script>` tag is injected pointing at the gviz JSONP URL
   (`.../gviz/tq?tqx=responseHandler:handleData&gid=...&headers=1&_=<timestamp>`).
   The trailing `_=` timestamp is cache-busting — without it browsers can
   silently serve a stale response after the sheet is edited.
2. Google's response calls the global `handleData(response)`, which parses
   `response.table.rows` into `data` (the array of real week entries) plus
   three side maps populated from special rows: `introText`,
   `momentSummaries`, `momentExamDates`.
3. `buildMenu()` and `buildSections()` render the sidebar and the per-moment
   views from `data` + those maps.

### Column layout (read by position, never by header text)

Each sheet has exactly 6 columns: `Moment, Vecka, <dag1>, Läxa <dag1>,
<dag2>, Läxa <dag2>`. `cells[0..5]` are read positionally — the actual
header row text is cosmetic only. Getting the column count wrong (e.g. a
sheet still has the old 5-column layout) silently shifts every field over by
one and is a recurring source of bug reports; when a course's data looks
wrong, ask for the raw gviz response first (see below) before touching code.

Special row conventions, all implemented in the parsing loop inside
`handleData()`:

- **Info row**: `Moment == 'info'` (case-insensitive) → last column becomes
  the welcome text (`introText`), row is not a week.
- **Omprov row**: `Moment == 'omprov'` → dropped entirely.
- **Moment summary / exam countdown row**: `Moment` filled in, `Vecka`
  empty → not a week. `Läxa <dag2>` (last column) becomes that moment's
  summary box text (`momentSummaries[moment]`); `Läxa <dag1>` becomes an
  exam date (`YYYY-MM-DD`, also accepts Google's `Date(y,m,d)` gviz
  serialization) used to render a "N dagar till provet" chip
  (`momentExamDates[moment]`, parsed by `parseSheetDate`/`countdownText`).
- **Boundary marker for a week split between two moments**: when a moment
  ends and the next begins mid-week, the sheet has *two rows* with the same
  `Vecka` but different `Moment` (never two moment names in one cell — that
  produces a bogus third "moment"). The half of that pair with zero content
  in all four content columns is detected in `buildSections()` (matching
  `Vecka` value present under a different `Moment` elsewhere in `data`) and
  suppressed from rendering as its own card, while still counting toward
  that moment's `v.X–Y` chip range.
- **Themeless week**: `Moment` empty but `Vecka` filled (e.g. a holiday) →
  `moment` falls back to the vecka number itself and displays as "Vecka N";
  `isPureNumber()` drives this both for `UNIT_LABEL === 'Vecka'` courses and
  for this fallback case. The sidebar hides the (meaningless) sequential
  index number for these via `visibility: hidden` rather than removing it,
  to keep list alignment.
- A row is otherwise always kept even if every content cell is blank — an
  empty week still needs to show up as "nothing planned this week".

`UNIT_LABEL` (`'Moment'` or `'Vecka'`, currently `'Moment'` on all six pages)
toggles between thematic grouping and pure per-week grouping; see README.md
for the full behavioral difference.

### When debugging a data-rendering report

The fastest path that has worked repeatedly: ask the user to open the raw
gviz URL directly (`https://docs.google.com/spreadsheets/d/<SHEET_ID>/gviz/tq?gid=<GID>&headers=1`)
and paste back the `google.visualization.Query.setResponse({...})` body, or
copy the equivalent from their browser's Network tab (look for the row after
the `302` redirect). Reasoning from a screenshot of the rendered page alone
has repeatedly led to wrong diagnoses in this codebase; the raw response
settles column-shift and stale-cache questions immediately.

See README.md for end-user-facing instructions (how to add a new
class/course, sheet-sharing requirements, the full column-pattern reference)
— keep it in sync with any change to the parsing/rendering conventions above.
