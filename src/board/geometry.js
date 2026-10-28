// Shared geometry for every view that draws a board: Designer, layouts, thumbnails, build guide, Collection,
// saved versions and shared links. Sizes come from the physical profiles (mm), never from the images.
import { ITEMS, baseSize } from '../data/catalog.js';
import { MEDIA, photoPiece } from '../data/media.js';
import { CONTAINERS, containerPlan, profileOf, visibleOf, checkFit, BOARD, LEGACY } from '../data/physical.js';

const GAP = 6;

// Image rectangle that puts the visible food of `asset` exactly on a part of size w × h centered at x, y.
export function imageRect(asset, part) {
  const [vl, vt, vw, vh] = visibleOf(asset);
  const W = part.w / vw, H = part.h / vh;
  const ox = W * (vl + vw / 2), oy = part.origin === 'bottom' ? H * (vt + vh) : H * (vt + vh / 2);
  return { x: -ox, y: -oy, w: W, h: H };
}

// Layout of one placed group in local mm coordinates, centered on 0,0.
// Returns its visible size (used for fit and selection), the parts to draw and, for bowls, the container plan.
export function groupLayout(item) {
  const it = ITEMS[item.type];
  const style = item.style || it.styles[0].id;
  const piece = photoPiece(item.type, style);
  const prof = profileOf(item.type, style);
  if (!prof) {
    const [w, h] = baseSize(item.type, item.qty).map((v, i) => v * (i ? BOARD.h / LEGACY.h : BOARD.w / LEGACY.w));
    return { w, h, parts: [], illustrated: true };
  }
  // Without a cutout yet, the profile's expected top view sets the proportions (bowls are round).
  const a = piece ? MEDIA[piece.asset].aspect : prof.aspect || 1;
  // What is drawn is what sits on the board at once (placed); the prepared amount (qty) is what the shopping list uses.
  const qty = item.placed ?? item.qty;

  if (prof.kind === 'container') {
    const plan = containerPlan(prof, qty, item.overflow);
    const d = CONTAINERS[prof.container].d, dh = d / a;
    const n = plan.bowls, w = n * d + (n - 1) * GAP;
    return { w, h: dh, round: n === 1, plan, container: CONTAINERS[prof.container], parts: Array.from({ length: n }, (_, i) => ({ x: -w / 2 + d / 2 + i * (d + GAP), y: 0, w: d, h: dh, r: 0 })) };
  }
  if (prof.kind === 'pile' || prof.kind === 'fixed') {
    // Loose food spreads: same heap height, so the area follows the amount. A whole wheel keeps its size.
    const k = prof.kind === 'fixed' ? 1 : Math.max(0.6, Math.min(1.8, Math.sqrt(qty / it.baseQty)));
    const w = prof.w * k, h = w / a;
    return { w, h, parts: [{ x: 0, y: 0, w, h, r: 0 }] };
  }
  if (prof.kind === 'roses') {
    const n = Math.max(1, Math.round(qty * 2)), s = prof.unit, cols = Math.min(n, 3), rows = Math.ceil(n / cols);
    const w = s + (cols - 1) * s * 0.86 + (rows > 1 ? s * 0.43 : 0), h = s + (rows - 1) * s * 0.8;
    return {
      w, h, count: n,
      parts: Array.from({ length: n }, (_, i) => {
        const r = Math.floor(i / cols), c = i % cols;
        return { x: -w / 2 + s / 2 + c * s * 0.86 + (r % 2 ? s * 0.43 : 0), y: -h / 2 + s / 2 + r * s * 0.8, w: s * a, h: s, r: [-14, 22, 70, 8, -30, 40][i % 6] };
      }),
    };
  }
  if (prof.kind === 'river') {
    // The river cutout runs upright; laid across, repeated end to end. Copies are visual, the length follows the amount.
    const across = prof.w, along = across / a, len = prof.length * (qty / it.baseQty), step = along * 0.85;
    const k = Math.max(1, Math.round((len - along) / step) + 1), w = along + (k - 1) * step;
    return { w, h: across, parts: Array.from({ length: k }, (_, i) => ({ x: -w / 2 + along / 2 + i * step, y: i % 2 ? across * 0.05 : -across * 0.05, w: across, h: along, r: 90 })) };
  }
  // Units: one image per counted piece.
  const n = Math.max(1, Math.round(qty)), u = prof.unit, uh = u / a;
  if (prof.layout === 'fan') {
    const along = Math.min(n, 16), rows = Math.ceil(n / 16);
    const step = along > 1 ? Math.min(u * 0.36, (u * 4.2 - u) / (along - 1)) : 0;
    const w = u + (along - 1) * step, h = uh + 4 + (rows - 1) * uh * 0.7;
    return {
      w, h, count: n,
      parts: Array.from({ length: n }, (_, i) => {
        const c = i % 16, row = Math.floor(i / 16), t = along > 1 ? c / (along - 1) : 0.5;
        return { x: -w / 2 + u / 2 + c * step, y: -h / 2 + uh / 2 + 4 - Math.sin(Math.PI * t) * 4 + row * uh * 0.7, w: u, h: uh, r: -10 + t * 20 };
      }),
    };
  }
  if (prof.layout === 'stacks') {
    const per = 4, stacks = Math.ceil(n / per), cols = stacks <= 3 ? stacks : 2, rows = Math.ceil(stacks / cols);
    const w = cols * u * 1.06, h = rows * uh * 1.06 + 4;
    return {
      w, h, count: n,
      parts: Array.from({ length: n }, (_, i) => {
        const s = Math.floor(i / per), k = i % per, c = s % cols, row = Math.floor(s / cols);
        return { x: -w / 2 + u * 0.53 + c * u * 1.06 + k * 0.9, y: -h / 2 + uh * 0.53 + 4 + row * uh * 1.06 - k * 1.2, w: u, h: uh, r: k * 7 };
      }),
    };
  }
  if (prof.layout === 'sprigs') {
    const L = u, sw = L * a;
    const angles = n === 1 ? [0] : Array.from({ length: n }, (_, i) => -8.4 * (n - 1) + i * 16.8);
    const spread = (Math.abs(angles[0]) * Math.PI) / 180;
    const w = sw + 2 * Math.sin(spread) * L;
    return { w, h: L, count: n, parts: angles.map((r) => ({ x: 0, y: L / 2, w: sw, h: L, r, origin: 'bottom' })) };
  }
  if (prof.layout === 'grid') {
    const cols = Math.min(n, 2), rows = Math.ceil(n / cols), w = cols * u * 0.96, h = rows * uh * 0.96;
    return { w, h, count: n, parts: Array.from({ length: n }, (_, i) => ({ x: -w / 2 + u * 0.48 + (i % cols) * u * 0.96, y: -h / 2 + uh * 0.48 + Math.floor(i / cols) * uh * 0.96, w: u, h: uh, r: i % 2 ? 8 : -6 })) };
  }
  // row: pieces side by side with room to lift each one. shingle: overlapping, like sliced pieces laid in a line.
  // arrange 'column' stacks the same pieces top to bottom instead of left to right.
  if (item.arrange === 'column') {
    const per = 3, rows = Math.min(n, per), cols = Math.ceil(n / per);
    const sy = prof.layout === 'shingle' ? uh * 0.62 : uh + GAP, sx = u + GAP;
    const w = u + (cols - 1) * sx, h = uh + (rows - 1) * sy;
    return {
      w, h, count: n,
      parts: Array.from({ length: n }, (_, i) => {
        const r = i % per, c = Math.floor(i / per);
        return { x: -w / 2 + u / 2 + c * sx, y: -h / 2 + uh / 2 + r * sy, w: u, h: uh, r: prof.layout === 'shingle' ? (r % 2 ? 3 : -2) : 0 };
      }),
    };
  }
  const per = 3, cols = Math.min(n, per), rows = Math.ceil(n / per);
  const sx = prof.layout === 'shingle' ? u * 0.6 : u + GAP, sy = prof.layout === 'shingle' ? uh * 0.62 : uh + GAP;
  const w = u + (cols - 1) * sx, h = uh + (rows - 1) * sy + (prof.layout === 'shingle' && cols > 1 ? uh * 0.18 : 0);
  return {
    w, h, count: n,
    parts: Array.from({ length: n }, (_, i) => {
      const c = i % per, r = Math.floor(i / per);
      const dy = prof.layout === 'shingle' && cols > 1 ? (c % 2 ? uh * 0.09 : -uh * 0.09) : 0;
      return { x: -w / 2 + u / 2 + c * sx, y: -h / 2 + uh / 2 + r * sy + dy + (prof.layout === 'shingle' && cols > 1 ? uh * 0.09 : 0), w: u, h: uh, r: prof.layout === 'shingle' ? (c % 2 ? 4 : -3) : 0 };
    }),
  };
}

export const sizeOf = (item) => { const l = groupLayout(item); return [l.w, l.h]; };

// Garnish and small fills may tuck against other food; dishes keep a gap to be lifted.
const TUCK = new Set(['garnish', 'fill']);

// Fit of a whole board, on-board items only.
export function boardFit(items, zone, mode = 'dinner') {
  const placed = items.filter((i) => !i.alongside).map((i) => {
    const l = groupLayout(i);
    return { uid: i.uid, x: i.x, y: i.y, r: i.r || 0, w: l.w, h: l.h, round: !!l.round /* a single bowl stays a circle when rotated */, tuck: TUCK.has(ITEMS[i.type].cat) };
  });
  return checkFit(placed, zone, mode);
}

// Plated meals keep space to lift each dish; shared boards may touch. A board with a main or a side is plated.
export const fitMode = (items) => (items.some((i) => ['mains', 'sides'].includes(ITEMS[i.type]?.cat)) ? 'dinner' : 'grazing');
