# SDD ledger — plan: docs/superpowers/plans/2025-07-17-tfis-site-optimization.md

## Pre-flight conflict scan
- Task 1 (fonts+favicon) → produces font files consumed by Task 2 (CSS) and Task 3 (HTML links). No conflict: path `fonts/` consistent across all three.
- Task 2 (CSS changes) → new selectors consumed by Task 3 (HTML markup) and Task 5 (JS). Consistent selector names: `.skip-link`, `.section-tracker`, `.assess-greeting`, `.phil-search`, `nav [aria-current="page"]`.
- Task 3 (HTML edits) → `data-page` attributes consumed by Task 5 (JS nav state). Consistent values: `home`, `functional-life`, `meaning-of-life`.
- Task 4 (philosophers.html) → uses `shared.css` from Task 2, `shared.js` from Task 5. Isolated — no interface conflicts.
- Task 5 (shared.js edits) → removes `initPhilToggle` used by old `meaning-of-life.html`; Task 3 replaces that call with a link. No conflict: the old call is deleted in both.
- Task 6 (CTA links in JS) → operates inside `initAssessment` which is also modified by Task 5. Both touch `showResultForLevel` — **potential conflict**. Task 5 adds localStorage writes inside `showResultForLevel`; Task 6 adds link updates also inside `showResultForLevel`. Consistent: both append to the same function.
- Task 7 (final review) — reads all files, no interface concerns.

**Ruling:** Task 5 and Task 6 both modify `showResultForLevel` — merge them into a single task to avoid diff conflict. The plan already sequences them consecutively with the same BASE, so sequential dispatch with no overlap is also fine.
