# Sergey Shamov · interactive resume

A bilingual, responsive Java Team Lead resume for **https://binocla.github.io/**.
Vanilla HTML / CSS / JavaScript. No dependencies or build step.

- Russian: `https://binocla.github.io/?lang=ru`
- English: `https://binocla.github.io/?lang=en`
- Language and light/dark theme are remembered locally.
- Result rows open case details; career entries expand; the stack filters by focus area.
- “Save as PDF” opens the browser print dialog. Print CSS includes every career entry and technology category, even when collapsed or filtered on screen.
- “Copy profile link” copies a public URL in the selected language.

## Preview locally

```sh
python3 -m http.server 4173 --bind 127.0.0.1
```

Open http://127.0.0.1:4173/. Stop the server with Ctrl+C.

## Publish to GitHub Pages

The existing repository is already configured to publish **master / (root)**.
The root `index.html` and `.nojekyll` work with that setup, so no hosting setting change is required.
After pushing to `master`, check **Actions → pages build and deployment** for success.

Configuration reference: [GitHub Pages publishing sources](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

## Edit the content

- `resume.js`: career, achievements, technology categories, education, and RU/EN copy.
- `index.html`: layout, contact URLs, static social metadata.
- `style.css`: responsive layout, both themes, reduced-motion and print styles.
- `app.js`: interactions and language switching.
- `assets/social.png`: preview image for shared links.

Career facts are based on the supplied CV, updated **8 October 2026**.
The current Sber role has a short description until more public detail is provided.
Metrics refer to their named projects; performance and memory figures are combined into one Sophia Technologies migration entry.
Education is accurately marked as incomplete; no completed degree is implied.
The source PDF, phone number, birth date and precise residential location are not included.

The previous website, game and transcription utility were removed from the working tree.
Git history is preserved. A local copy of the old website was made at `/tmp/binocla-pages-backup-20261010/` before replacement.
