// Physical model of the board and of what goes on it. Every length is in millimetres.
// Each measure says where it comes from and whether it is confirmed or an estimate to test on a real board.
// Images never set a size or an amount: the renderer fits the visible part of a cutout to these footprints.
import { VISIBLE } from './visibleBounds.js';

const confirmed = (source) => ({ status: 'confirmed', source });
const estimate = (source) => ({ status: 'estimate', source });

// ---------- Board ----------
// 33 × 24 × 1.8 cm, provided by Yndarena on 2026-10-28. Thickness is product information; it does not change the top view.
export const BOARD = {
  w: 330, h: 240, thickness: 18,
  ...confirmed('Measurement provided by Yndarena, 2026-10-28'),
  appliesTo: estimate('Applied to all three board models until each one is measured'),
  cornerRadius: { mm: 8, ...estimate('Read from board-reference-cropped.png, not measured') },
};

// Juice groove. The reference photo is cropped, so the groove cannot be measured yet.
// inset: distance from the outer edge to the edge of the serving zone. Change it here; everything follows.
export const GROOVE = {
  inset: 20, // working hypothesis from the review: zone ≈ 290 × 200 mm before the corner curves
  width: 5,
  corner: 16, // radius of the concave corner curve seen in the photo
  ...estimate('Working hypothesis from board-reference-cropped.png; not a product measurement'),
};

// Serving zone: inside the groove. Items should sit fully inside it, corner curves included.
export function serviceZone(g = GROOVE) {
  return { x: g.inset, y: g.inset, w: BOARD.w - 2 * g.inset, h: BOARD.h - 2 * g.inset, corner: g.corner };
}

// Space kept between neighbouring dishes so each piece can be lifted. Garnish and small fills may tuck in closer.
export const LIFT_GAP = { mm: 6, ...estimate('Editorial choice; check with hands on a real board') };

// Older layouts were authored on a 600 × 400 canvas. They are converted on read, never rewritten.
export const LEGACY = { w: 600, h: 400 };
export const fromLegacy = (p) => ({ ...p, x: (p.x / LEGACY.w) * BOARD.w, y: (p.y / LEGACY.h) * BOARD.h });

// ---------- Containers ----------
// Diameter is the outer rim seen from above. Capacity is in the unit of the item served in it.
// Diameters of the original bowls come from the serveware named in the app (e.g. "Small ramekin (3 in)").
const inch = 25.4;
export const CONTAINERS = {
  'ramekin-2in': { label: 'Mini bowl (2 in)', d: 2 * inch, ...estimate('Size from the serveware named in the app') },
  'ramekin-3in': { label: 'Small ramekin (3 in)', d: 3 * inch, ...estimate('Size from the serveware named in the app') },
  'bowl-3.5in': { label: 'Small bowl (3.5 in)', d: 3.5 * inch, ...estimate('Size from the serveware named in the app') },
  'bowl-4in': { label: 'Small bowl (4 in)', d: 4 * inch, ...estimate('Size from the serveware named in the app') },
  'bowl-4.5in': { label: 'Small bowl (4.5 in)', d: 4.5 * inch, ...estimate('Chosen for sides; to confirm with the bowls Yndarena recommends') },
  'bowl-5in': { label: 'Medium bowl (5 in)', d: 5 * inch, ...estimate('Size from the serveware named in the app') },
  'bowl-7in': { label: 'Serving bowl (7 in)', d: 7 * inch, ...estimate('Chosen for a pasta dinner for two; to confirm') },
};

// ---------- Components ----------
// One profile per item and serving style, shared by every view.
// kind:
//   container  fixed bowl; amount above `capacity` adds a second bowl or is kept back to refill (never a bigger image)
//   pile       loose food; `w` is the width at the item's base amount, area grows with the amount at the same height
//   fixed      one piece of known size whatever the amount (a whole wheel)
//   units      one image per counted piece; `unit` is the width of one piece
//   roses      folded roses of `unit` mm; count from the technique's sizing note
//   river      folded slices in a line; length grows with the amount
// All sizes are estimates until tested on a board; `note` explains each.
const P = (kind, spec, note) => ({ kind, ...spec, ...estimate(note) });
export const PROFILES = {
  // Bowls & dips
  'bowl-jam:bowl': P('container', { container: 'ramekin-3in', capacity: 0.5 }, 'Ramekin capacity about 1/2 cup'),
  'bowl-honey:bowl': P('container', { container: 'ramekin-2in', capacity: 4 }, 'Mini bowl capacity about 4 tbsp'),
  'bowl-feta:bowl': P('container', { container: 'bowl-4in', capacity: 1 }, 'Shallow 4 in bowl, about 1 cup'),
  'bowl-feta:swoosh': P('pile', { w: 130 }, 'Parchment about 13 cm wide for 3/4 cup'),
  'bowl-hummus:bowl': P('container', { container: 'bowl-5in', capacity: 1.5 }, '5 in bowl, about 1 1/2 cups'),
  'bowl-hummus:swoosh': P('pile', { w: 150 }, 'Parchment about 15 cm wide for 1 cup'),
  'bowl-olives:bowl': P('container', { container: 'bowl-3.5in', capacity: 0.75 }, '3.5 in bowl, about 3/4 cup'),
  // Cheese (base amounts: 8 oz soft, 6 oz hard, 4 oz goat)
  'brie:wedges': P('pile', { w: 125 }, 'An 8 oz wheel cut and fanned'),
  'brie:whole': P('pile', { w: 115 }, 'An 8 oz wheel is about 11–12 cm across'),
  'camembert:wedges': P('pile', { w: 120 }, 'An 8 oz wheel cut and fanned'),
  'camembert:whole': P('pile', { w: 110 }, 'An 8 oz wheel is about 11 cm across'),
  'cheddar:triangles': P('pile', { w: 115 }, '6 oz cut in thin triangles, fanned'),
  'cheddar:cubes': P('pile', { w: 85 }, '6 oz in 2 cm cubes, loosely piled'),
  'manchego:triangles': P('pile', { w: 125 }, '6 oz cut in thin triangles, fanned'),
  'manchego:cubes': P('pile', { w: 85 }, '6 oz in 2 cm cubes'),
  'gouda:triangles': P('pile', { w: 115 }, '6 oz cut in thin triangles, fanned'),
  'gouda:cubes': P('pile', { w: 85 }, '6 oz in 2 cm cubes'),
  'goat:rounds': P('pile', { w: 105 }, '4 oz log in 1 cm coins'),
  // Charcuterie (base amounts 3–4 oz)
  'prosciutto:roses': P('roses', { unit: 46 }, 'About 3 slices per ounce and 1–2 slices per rose (technique sizing)'),
  'prosciutto:ribbons': P('pile', { w: 110 }, '3 oz in loose folds'),
  'serrano:roses': P('roses', { unit: 46 }, 'Same as prosciutto roses'),
  'serrano:ribbons': P('pile', { w: 110 }, '3 oz in loose folds'),
  'salami:river': P('river', { w: 60, length: 170 }, '4 oz of 4 cm slices, folded in a line'),
  'salami:folds': P('pile', { w: 110 }, '4 oz folded in quarters'),
  'soppressata:river': P('river', { w: 60, length: 170 }, '4 oz of 4 cm slices, folded in a line'),
  'soppressata:folds': P('pile', { w: 110 }, '4 oz folded in quarters'),
  // Fruit & vegetables
  'grapes:clusters': P('pile', { w: 115 }, '8 oz in small clusters'),
  'green-grapes:clusters': P('pile', { w: 115 }, '8 oz in small clusters'),
  'figs:halved': P('units', { unit: 76, layout: 'grid' }, 'One fig, about 4.5 cm, shown as two halves side by side'),
  'apple:fan': P('pile', { w: 110 }, 'One apple sliced and fanned'),
  'pear:fan': P('pile', { w: 110 }, 'One pear sliced and fanned'),
  'strawberries:pile': P('pile', { w: 95 }, '6 oz halved'),
  'dried-apricots:pile': P('pile', { w: 75 }, '3 oz'),
  'carrots:batons': P('pile', { w: 105 }, '8 oz in 9 cm batons', ),
  'celery:batons': P('pile', { w: 115 }, '3 stalks in 10 cm batons'),
  'bell-pepper:strips': P('pile', { w: 100 }, 'One pepper in strips'),
  'cucumber:rounds': P('pile', { w: 100 }, '2 mini cucumbers in rounds'),
  'cucumber:ribbons': P('pile', { w: 110 }, '2 mini cucumbers in ribbons'),
  'tomatoes:pile': P('pile', { w: 90 }, '1 cup cherry tomatoes'),
  // Bread & crackers
  'crackers:fan': P('units', { unit: 48, layout: 'fan' }, 'A round butter cracker is about 4.8 cm'),
  'crackers:stack': P('units', { unit: 48, layout: 'stacks' }, 'A round butter cracker is about 4.8 cm'),
  'seed-crackers:fan': P('units', { unit: 58, layout: 'fan' }, 'A seed cracker about 6 cm long'),
  'seed-crackers:stack': P('units', { unit: 58, layout: 'stacks' }, 'A seed cracker about 6 cm long'),
  'baguette:slices': P('pile', { w: 130 }, 'Half a baguette in thin slices'),
  // Nuts & small bites
  'walnuts:pile': P('pile', { w: 72 }, '1/2 cup'),
  'almonds:pile': P('pile', { w: 72 }, '1/2 cup'),
  // Garnish
  'rosemary:sprig': P('units', { unit: 100, layout: 'sprigs' }, 'A short sprig, about 10 cm'),
  'basil:leaves': P('pile', { w: 55 }, 'Three leaves'),
  'lemon:wedges': P('pile', { w: 55 }, 'Two wedges from a medium lemon'),
  // Everyday meals
  'gnocchi-bowl:bowl': P('container', { container: 'bowl-7in', capacity: 1 }, 'A 7 in bowl for 1 lb of gnocchi with 1 cup of sauce'),
  'lemon-chicken:sliced': P('units', { unit: 140, layout: 'shingle' }, 'One cooked breast, sliced, about 14 cm long'),
  'steak:sliced': P('units', { unit: 150, layout: 'shingle' }, 'One cooked steak, sliced, about 15 cm long'),
  'salmon:fillet': P('units', { unit: 114, layout: 'row' }, 'A 6 oz portion is about 11 × 7.5 cm'),
  'chicken-wraps:halves': P('units', { unit: 150, layout: 'shingle' }, 'One wrap cut in two halves, side by side'),
  'flatbread:pieces': P('units', { unit: 150, layout: 'row' }, 'One small ready-made flatbread, about 15 × 19 cm, cut in four'),
  'potatoes:wedges': P('pile', { w: 130 }, '2 cups of roasted wedges, one layer deep'),
  'green-beans:cooked': P('pile', { w: 85 }, '1 cup of cooked green beans'),
  'rice:bowl': P('container', { container: 'bowl-4.5in', capacity: 1.5 }, 'A 4.5 in bowl for 1 1/2 cups of rice'),
  'side-tomato-avocado:bowl': P('container', { container: 'bowl-4.5in', capacity: 2 }, 'A 4.5 in bowl for two servings'),
  'side-beet-carrot:bowl': P('container', { container: 'bowl-4.5in', capacity: 2 }, 'A 4.5 in bowl for two servings'),
  'side-cabbage-carrot:bowl': P('container', { container: 'bowl-4.5in', capacity: 2 }, 'A 4.5 in bowl for two servings'),
  'side-tomato-basil:bowl': P('container', { container: 'bowl-4in', capacity: 1 }, 'A 4 in bowl for 1 cup'),
  'rustic-bread:slices': P('pile', { w: 120 }, 'Three or four slices from a round loaf'),
};

export const profileOf = (type, style) => PROFILES[`${type}:${style}`] || null;

// How many bowls an amount needs, and what happens to the rest. The bowl never grows.
// mode 'extra': one more bowl for every full capacity. mode 'refill': one bowl on the board, the rest kept back.
export function containerPlan(profile, qty, mode = 'extra') {
  const need = Math.max(1, Math.ceil(qty / profile.capacity - 1e-6));
  const bowls = mode === 'refill' ? 1 : need;
  return { bowls, need, perBowl: Math.min(qty, profile.capacity), keptBack: mode === 'refill' ? Math.max(0, qty - profile.capacity) : 0, over: need > 1 };
}

// Visible fraction of each cutout: [left, top, width, height].
export const visibleOf = (file) => VISIBLE[file] || [0, 0, 1, 1];

// ---------- Fit ----------
// Footprint of a placed group as a polygon in board mm: its rectangle, rotated. Bowls are circles.
export function footprint(p, size, round) {
  const [w, h] = size;
  if (round) return { round: true, cx: p.x, cy: p.y, r: Math.max(w, h) / 2 };
  const a = ((p.r || 0) * Math.PI) / 180, c = Math.cos(a), s = Math.sin(a);
  const at = (u, v) => [p.x + u * c - v * s, p.y + u * s + v * c];
  const pts = [];
  const n = 6;
  for (let i = 0; i <= n; i++) for (const [u, v] of [[-w / 2 + (w * i) / n, -h / 2], [-w / 2 + (w * i) / n, h / 2], [-w / 2, -h / 2 + (h * i) / n], [w / 2, -h / 2 + (h * i) / n]]) pts.push(at(u, v));
  return { round: false, pts, corners: [at(-w / 2, -h / 2), at(w / 2, -h / 2), at(w / 2, h / 2), at(-w / 2, h / 2)] };
}

const insideZone = ([x, y], z) => {
  if (x < z.x || y < z.y || x > z.x + z.w || y > z.y + z.h) return false;
  for (const [cx, cy] of [[z.x, z.y], [z.x + z.w, z.y], [z.x, z.y + z.h], [z.x + z.w, z.y + z.h]]) if (Math.hypot(x - cx, y - cy) < z.corner) return false;
  return true;
};

function points(fp) {
  if (!fp.round) return fp.pts;
  return Array.from({ length: 36 }, (_, i) => [fp.cx + fp.r * Math.cos((i * Math.PI) / 18), fp.cy + fp.r * Math.sin((i * Math.PI) / 18)]);
}

// Smallest distance between two footprints; negative when they overlap (approximate, from sampled edges).
function separation(a, b) {
  if (a.round && b.round) return Math.hypot(a.cx - b.cx, a.cy - b.cy) - a.r - b.r;
  const inPoly = (pt, fp) => (fp.round ? Math.hypot(pt[0] - fp.cx, pt[1] - fp.cy) < fp.r : pointInConvex(pt, fp.corners));
  const pa = points(a), pb = points(b);
  if (pa.some((q) => inPoly(q, b)) || pb.some((q) => inPoly(q, a))) return -1;
  let d = Infinity;
  for (const p of pa) for (const q of pb) d = Math.min(d, Math.hypot(p[0] - q[0], p[1] - q[1]));
  return d;
}

function pointInConvex(pt, poly) {
  let sign = 0;
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length];
    const c = (b[0] - a[0]) * (pt[1] - a[1]) - (b[1] - a[1]) * (pt[0] - a[0]);
    if (Math.abs(c) < 1e-9) continue;
    if (!sign) sign = Math.sign(c); else if (Math.sign(c) !== sign) return false;
  }
  return true;
}

// Share of footprint a covered by footprint b, from a 9 × 9 grid of points inside a.
function covered(a, b, pa) {
  let n = 0, inside = 0;
  const inB = (pt) => (b.fp.round ? Math.hypot(pt[0] - b.fp.cx, pt[1] - b.fp.cy) < b.fp.r : pointInConvex(pt, b.fp.corners));
  const ang = ((pa.r || 0) * Math.PI) / 180, c = Math.cos(ang), s = Math.sin(ang);
  for (let i = 0; i < 9; i++) for (let j = 0; j < 9; j++) {
    const u = (i / 8 - 0.5) * pa.w * 0.98, v = (j / 8 - 0.5) * pa.h * 0.98;
    if (a.fp.round && Math.hypot(u, v) > a.fp.r) continue;
    n++;
    if (inB([pa.x + u * c - v * s, pa.y + u * s + v * c])) inside++;
  }
  return n ? inside / n : 0;
}

// Two ways of serving:
//   'dinner'  plated food in groups: each group keeps LIFT_GAP from the next (garnish may touch).
//   'grazing' a shared board: groups may touch and tuck slightly under each other, up to GRAZING_OVERLAP.
export const GRAZING_OVERLAP = { share: 0.2, ...estimate('Editorial tolerance for crackers and folds tucked against cheese') };

// Checks every group on the board: fully inside the serving zone, and apart from (or only lightly over) its neighbours.
// placed: [{ uid, x, y, r, w, h, round, tuck }] — tuck marks garnish and small fills that may touch.
export function checkFit(placed, z = serviceZone(), mode = 'dinner') {
  const fps = placed.map((p) => ({ p, fp: footprint(p, [p.w, p.h], p.round) }));
  const outside = fps.filter(({ fp }) => !points(fp).every((pt) => insideZone(pt, z))).map(({ p }) => p.uid);
  const crowded = [];
  for (let i = 0; i < fps.length; i++) for (let j = i + 1; j < fps.length; j++) {
    const a = fps[i], b = fps[j];
    if (mode === 'grazing') {
      if (a.p.tuck || b.p.tuck) continue;
      const share = Math.max(covered(a, b, a.p), covered(b, a, b.p));
      if (share > GRAZING_OVERLAP.share) crowded.push([a.p.uid, b.p.uid, -Math.round(share * 100)]);
      continue;
    }
    const gap = a.p.tuck || b.p.tuck ? 0 : LIFT_GAP.mm;
    const d = separation(a.fp, b.fp);
    if (d < gap - 0.5) crowded.push([a.p.uid, b.p.uid, Math.round(d)]);
  }
  return { fits: !outside.length && !crowded.length, outside, crowded };
}
