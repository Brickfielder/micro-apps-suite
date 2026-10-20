# Micro Apps Suite

Micro Apps Suite is a consolidated collection of English-language practice apps. It merges selected work from `Brickfielder/micro-apps` and `Brickfielder/micro-apps-repository` into one build-free repository with a shared calm clinical interface baseline. The optional emergency-call voice service runs separately from static hosting.

## Retained apps

- Inbox Simulator
- Metro Nav
- Cafe Rush: Bar Mode
- Fresh Market
- Left-Anchor Reader
- Emotion Chats
- Brightwave Mobile Banking Simulator
- Park Scavenger Hunt
- [Emergency Call Simulator — 999 Practice](apps/emergency-call-simulator/README.md) (development; online voice service and clinician review required)

## Run locally

```bash
node scripts/emergency-dev-server.mjs
```

Open `http://localhost:8080/`. The local server blocks secret files and also provides the optional voice endpoint. See the emergency simulator README for API key and hosted backend setup.

## Structure

- `index.html` renders the app directory from `apps/apps.json`.
- `apps/<slug>/` contains each app as `index.html`, `app.css`, and `app.js`.
- `shared/theme.css` provides shared typography, colors, focus states, buttons, and common surface tokens.
- `offline/` and `sw.js` provide optional static caching.
- `docs/REMOVED_APPS.md` records source apps intentionally removed during consolidation.

## Provenance

Archive tags preserve the imported source snapshots:

- `source/micro-apps-main-750a78c`
- `source/micro-apps-repository-main-af649e1`

The final suite remains licensed under Apache-2.0.
