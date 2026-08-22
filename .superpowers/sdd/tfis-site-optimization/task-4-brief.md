# Task 4: Create philosophers.html

**Goal:** Create a standalone searchable philosopher listing page.

**File to create:** `philosophers.html` (repo root)

**Design confirmed:** 2-column grid on desktop, 1-column on mobile. Consistent footer with all pages.

## Template

Use the same nav, overlay, and footer pattern as `functional-life.html`. The page must include:

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="50 philosophers, 2,500 years of answers on the meaning of life — the full appendix to the TFIS essay.">
<title>The Philosophers · TFIS</title>
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="stylesheet" href="shared.css">
</head>
<body data-page="philosophers">

<a href="#main-content" class="skip-link">Skip to main content</a>

<!-- Nav: same as functional-life.html - Home, Functional Life, Meaning of Life, Whitepaper (with UTM) -->
<!-- Overlay: same pattern -->
<!-- Footer: same as functional-life.html - consistent footer with all CTAs (UTM links) -->
```

**Philosopher list:** Extract all 50 philosophers from the old `meaning-of-life.html` phil-all block. Each one as:
```html
<div class="phil-item"><span class="name">Socrates</span><span class="summary">The unexamined life is not worth living.</span></div>
```

**List container:** Use `id="philList"` and class `phil-all show` on the container div. Do NOT use CSS `display:grid` inline — the grid comes from the phil-all class in shared.css (which already uses grid-template-columns: 1fr 1fr).

**Search:** Include a search input before the list:
```html
<div class="phil-search">
  <input type="text" id="philFilter" placeholder="Search philosophers..." autocomplete="off">
</div>
```

**Back link:** Add a "← Back to the essay" link below the list pointing to `meaning-of-life.html`.

## All 50 philosophers (in this exact order):

Top 10 (already visible on meaning-of-life.html):
Socrates, Aristotle, Epicurus, Marcus Aurelius, Nietzsche, Kierkegaard, Sartre, Camus, Frankl, Wittgenstein

Remaining 40 (from the old philAll block):
Plato, Zeno of Citium, Confucius, Lao Tzu, Buddha, Seneca, Augustine of Hippo, Thomas Aquinas, René Descartes, Baruch Spinoza, David Hume, Immanuel Kant, Arthur Schopenhauer, John Stuart Mill, Jeremy Bentham, Karl Marx, Ralph Waldo Emerson, Henry David Thoreau, William James, John Dewey, Carl Jung, Simone de Beauvoir, Hannah Arendt, Bertrand Russell, Martin Heidegger, Daniel Dennett, Thomas Nagel, Alan Watts, Thich Nhat Hanh, Jiddu Krishnamurti, Ayn Rand, Noam Chomsky, Martha Nussbaum, Slavoj Žižek, Peter Singer, Cornel West, Judith Butler, Sam Harris, Jordan Peterson, Yuval Noah Harari

Use the exact summary text from the current `meaning-of-life.html` file for each philosopher.

## Nav/footer UTM links
All Thinkific links use the same UTM pattern:
- Whitepaper: `?utm_source=tfis&utm_medium=site&utm_campaign=ssa-assessment&utm_content=whitepaper`
- Course: `?utm_source=tfis&utm_medium=site&utm_campaign=ssa-assessment&utm_content=course`

## Verification
- Open in browser — no JS errors
- Search input filters philosophers by name as you type
- 2-column grid on desktop, 1-column on mobile (test by resizing)
- Nav links work
- Footer is consistent with other pages
- favicon loads

## Report
Write to `.superpowers/sdd/tfis-site-optimization/task-4-report.md` with:
- File size and line count of philosophers.html
- Confirmation all 50 philosophers present
- Search input works
- Nav and footer match other pages
- Git status
- Commit message: "feat: create philosophers.html with searchable 50-philosopher appendix"
