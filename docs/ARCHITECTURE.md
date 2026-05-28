# Micro Apps Suite Architecture

This repository hosts eight small static apps under one shared interface baseline. Everything is built with vanilla HTML, CSS, and JavaScript so each app can run from static hosting or a simple static server.

## Repository layout

- `index.html` — homepage that reads `apps/apps.json` and renders cards for each app.
- `apps/apps.json` — single manifest describing the retained apps. Fields: `slug`, `title`, `description`, `tags`, `entryPath`, `version`, `offlineCapable`, `lastUpdated`, `status`, `thumbnail`.
- `apps/<app-slug>/` — each app lives in its own folder with `index.html`, `app.js`, `app.css`, and `README.md`.
- `shared/` — shared theme, shell, UI, icons, and utilities.
- `assets/` — local images, favicons, and app icons (no external CDNs).
- `offline/` — offline shell page and service worker source.
- `sw.js` — root-loaded service worker that imports `offline/sw.js` to cover the full site scope.
- `docs/` — repository documentation.
- `scripts/` — optional Node scripts for scaffolding/validation.

## Adding a new app

1. Create a folder under `apps/<slug>/` with `index.html`, `app.js`, `app.css`, and `README.md`.
2. In `index.html`, import the shared shell:
   ```html
   <link rel="stylesheet" href="../../shared/theme.css" />
   <link rel="stylesheet" href="./app.css" />
   <script type="module" src="./app.js"></script>
   ```
   Apps may either use the shared shell module or provide their own static DOM, but they should consume the shared theme tokens for typography, focus states, surfaces, buttons, and status colors.
3. Add the app to `apps/apps.json` with `entryPath` relative to the repo root (e.g., `./apps/<slug>/index.html`).
4. Use shared assets where possible (`shared/ui/components.js`, icons under `shared/ui/icons/`, utilities under `shared/utils/`). Keep app-specific styles in `app.css` only.
5. Prefer semantic HTML, ensure focus styles remain visible, and respect `prefers-reduced-motion` when adding animations.

## Running locally

From the repository root:

```bash
python3 -m http.server
```

Then open `http://localhost:8000/` (or `http://localhost:8000/apps/<slug>/` for a specific app). All paths are relative, so the site also works when served under a GitHub Pages subpath (e.g., `/repo-name/`).

## Offline behavior

- The service worker (`sw.js`, delegating to `offline/sw.js`) precaches:
  - The homepage and manifest
  - Shared shell CSS/JS and utilities
  - Each app's `index.html`, `app.js`, and `app.css`
  - `offline/offline.html` for uncached navigations
- On first online visit, assets are cached. Subsequent visits work offline as long as the files were precached.
- Cache versioning is controlled by `CACHE_VERSION` in `offline/sw.js`. Increment it when assets change to force a refresh.
- If a route is requested offline and not cached, the user sees `offline/offline.html`.
- An update message can be sent to the service worker via `postMessage({ type: 'SKIP_WAITING' })` if you add a manual “refresh cache” button.

## GitHub Pages considerations

- All links and asset references use relative paths (e.g., `./shared/...`).
- Avoid absolute paths starting with `/` so the site works under `/repo-name/` on GitHub Pages.
- Keep runtime dependencies minimal and local (no external CDNs, no heavyweight frameworks).

## Optional tooling

- `scripts/new-app.js` scaffolds a new app folder and appends an entry to `apps/apps.json`.
- `scripts/validate-manifest.js` checks for manifest shape consistency and missing files.

Tooling is optional; the site runs without any build step.
