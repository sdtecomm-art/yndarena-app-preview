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

Registry: `src/data/media.js`. Every asset declares its role (`cover`, `layout-top`, `step`, `cutout`, `video`), provenance and status, and the UI labels it accordingly. Images live in `src/media/`, optimized to WebP (alpha preserved for cutouts), loaded lazily and with `srcset`.

| Resource | Role | Status |
|---|---|---|
| `llr-two-halves-top` | Overhead photo of the Two Halves layout (also used as card image while there is no editorial cover) | Integrated, provisional: AI reference, generic board, portions not verified |
| `cheddar-fan` | Designer cutout for aged cheddar, triangles | Integrated, provisional: AI sample; one fan assumed to be about 2 oz |
| Cover photo for Love, Like Rosemary | Editorial cover | Pending |
| Photos for The Sprig and Gathered layouts | Layout top views | Pending (illustrations shown, labelled) |
| Build step photos | Steps | Pending |
| Other Designer cutouts | Cutouts | Pending (illustrations remain) |
| Prosciutto Rose video, poster, segments, captions | Technique video | Pending (player ready, state shown as pending) |

- A layout photo is linked to one composition (`compositions[].media.topView`) with the lists of what matches and what differs, shown on the presentation page. The editable positions remain the reference for Designer and the build guide.
- Photo pieces repeat groups for more quantity instead of stretching (`PHOTO_PIECES` in `media.js`).
- Technique videos: fill `video` in `techniques.js` with `status: 'ready'`, `src`, `poster`, optional `captions` (WebVTT) and `segments` (`{ step, start, end }` in seconds). The player supports play/pause, replay, loop, 0.5× speed and step navigation, and only loads the clip when play is pressed.
- To test the player in development only: `localStorage.setItem('ynd-video-fixture', '<url of a test clip>')`. This code path is removed from production builds.

## Not real yet

Authentication and the Home counter, emails and push notifications, the care plan backend, store links (oil, care kit, gifts), Yndarena's review queue for From home to home, real photos and technique videos, analytics.
