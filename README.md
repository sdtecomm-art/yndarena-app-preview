# Yndarena App Preview

Navigable web preview of the Yndarena app (iOS and Android). Built to explore and validate the experience before building the native app.

- On desktop it renders inside a phone frame, with a side panel of journeys to try.
- On a real phone it fills the screen like an app (safe areas included).
- Everything is simulated and stored in the browser (`localStorage`). No production data, accounts, emails or purchases.

## Run and deploy

```bash
npm install
npm run dev       # local development
npm run build     # static build in dist/
```

Vercel: import the folder (or a Git repo containing it). `vercel.json` already sets the Vite framework, `npm run build` and `dist/`. No environment variables are needed.

## Demo access

- Sign-in code: `246810`. Code `000000` shows the expired state; any other code shows the wrong-code state.
- `home@example.com` is a returning Home (No. 0045) with demo data: saved boards, a modified version, things made, care plan history and gift dates.
- Any other email creates a new Home. The number comes from a local demo counter (starts at 0128), not from production.
- Reset: Profile (tap the "Home No." chip) > Reset demo, or the "Reset demo" link on desktop.
- Profile > Preview tools moves the preview date forward (+3 or +12 weeks) to see care checks and gift reminders come due.

## Structure

```
src/
  data/            Content. Edit these to change the catalog.
    catalog.js       Boards, item groups (footprints, units, serving styles, swaps, tools), layer order
    presentations.js Yndarena presentations and their layouts (same groups, different placement)
    recipes.js       Recipes (ingredients use shared keys so shopping lists merge)
    techniques.js    Technique library (every serving style links to one)
    community.js     From home to home DEMO creations
  board/           SVG board renderer and top-down item illustrations
  lib.js           Quantities, shopping lists, layers, care schedule, gift date rules
  store.jsx        Local simulated state, demo accounts, auth simulation
  nav.jsx          Stack navigation per tab
  actions.js       Create designs, copies, lists, made entries, reviews
  screens/         One file per area
```

### Content model

- An item type is a ready-to-place group (a cluster of grapes, a cracker fan), never a single piece. Each has an approximate footprint in a 600 x 400 board space; size scales gently with quantity.
- A presentation defines its groups and total quantities once. Each layout (`compositions`) only sets positions, rotation and serving style, so ingredients and quantities are always the same across layouts.
- Layers for "Build your board" follow `LAYER_ORDER`. Layouts can add tips per layer.

### Care plan and gift rules

Ported from the existing care plan spec (`lib.js`): first check at week 3 from the day the boards came home, then every 12 weeks, 6 checks max, no catch-up bursts. Gift reminders at 21 and 10 days, yearly unless a year is set, Feb 29 falls back to Mar 1 in non-leap years, a date added inside a window only gets that window's reminder. Up to 3 dates, as in the current system.

## Visual resources (pilot: Love, Like Rosemary)

Registry: `src/data/media.js`. Every asset declares its role, provenance and status. Source files, their manifest and generation prompts are kept in `media-source/` (not bundled); the app uses optimized WebP copies in `src/media/`, cropped to their visible area with alpha preserved.

- `llr-two-halves-top`: AI reference photo of the Two Halves layout, used as the cover of the original presentation.
- 12 AI ingredient cutouts (`media-source/love-like-rosemary/ingredients/`) mapped to item type and serving style in `PHOTO_PIECES`. Modes: `group` (one image inside the item's approximate footprint), `cluster` (visual count only) and `units` (one image per cracker, fig or sprig, so the picture matches the count).
- The same renderer (`BoardView`) draws Designer, layout thumbnails, build-by-layers, saved versions and shared links. Quantities and lists never depend on images.
- Reviewer notes (sources, hashes, coverage by layout, photo vs. layout differences, checks and pending items) live in the in-app **Review panel** (Profile → Preview tools, or the desktop side panel), outside the customer journey. Text in `src/data/review.js`.
- Pending: real photos on the product board with weighed portions, editorial cover, step photos, the Prosciutto Rose video, cutouts for the rest of the library.
- Technique videos: fill `video` in `techniques.js` with `status: 'ready'`, `src`, `poster`, optional `captions` (WebVTT) and `segments` (`{ step, start, end }` in seconds). In development only, `localStorage.setItem('ynd-video-fixture', '<url>')` loads a test clip; production builds drop that path.

## Not real yet

Authentication and the Home counter, emails and push notifications, the care plan backend, store links (oil, care kit, gifts), Yndarena's review queue for From home to home, real photos and technique videos, analytics.
