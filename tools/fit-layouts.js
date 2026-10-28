// Dev-only tool: fits the legacy shared-board layouts into the physical serving zone.
// Keeps each group near its converted position, pushes it inside the groove using its real footprint, separates
// overlaps beyond the grazing tolerance, and when the food cannot fit at once, lowers the amount placed at once
// (the rest is kept aside to refill) by the same share for every group. Output goes to src/data/layoutsMm.js.
import { PRESENTATIONS, PRESENTATION_ORDER } from '../src/data/presentations.js';
import { COMMUNITY, COMMUNITY_ORDER } from '../src/data/community.js';
import { ITEMS } from '../src/data/catalog.js';
import { fromLegacy, serviceZone, footprint, profileOf } from '../src/data/physical.js';
import { groupLayout, boardFit } from '../src/board/geometry.js';

const z = serviceZone();
const TUCK = new Set(['garnish', 'fill']);

function samples(it) {
  const l = groupLayout(it);
  const fp = footprint(it, [l.w, l.h], !!l.round && !(it.r % 360));
  if (fp.round) return Array.from({ length: 24 }, (_, i) => [fp.cx + fp.r * Math.cos(i * Math.PI / 12), fp.cy + fp.r * Math.sin(i * Math.PI / 12)]);
  return fp.pts;
}
// Smallest move that brings every sampled point of the footprint inside the zone (rect with concave corners).
function zonePush(it) {
  let mx = 0, my = 0;
  for (const [x, y] of samples(it)) {
    // 1 mm inside the edge, so rounding the saved coordinates never puts food on the groove.
    let px = Math.min(Math.max(x, z.x + 1), z.x + z.w - 1), py = Math.min(Math.max(y, z.y + 1), z.y + z.h - 1);
    for (const [cx, cy] of [[z.x, z.y], [z.x + z.w, z.y], [z.x, z.y + z.h], [z.x + z.w, z.y + z.h]]) {
      const d = Math.hypot(px - cx, py - cy);
      if (d < z.corner + 1) { const k = (z.corner + 1.6) / (d || 1); px = cx + (px - cx) * k; py = cy + (py - cy) * k; }
    }
    const dx = px - x, dy = py - y;
    if (Math.abs(dx) > Math.abs(mx)) mx = dx;
    if (Math.abs(dy) > Math.abs(my)) my = dy;
  }
  return [mx, my];
}
function aabb(it) {
  const l = groupLayout(it), a = ((it.r || 0) * Math.PI) / 180;
  const c = Math.abs(Math.cos(a)), s = Math.abs(Math.sin(a));
  return { hw: (l.w * c + l.h * s) / 2, hh: (l.w * s + l.h * c) / 2 };
}
// Pushes groups apart only where the real check finds them too covered, and back inside the groove.
function relax(items) {
  const orig = items.map((i) => ({ x: i.x, y: i.y }));
  const its = items.map((i) => ({ ...i }));
  const idx = Object.fromEntries(its.map((it, i) => [it.uid, i]));
  for (let step = 0; step < 500; step++) {
    const fit = boardFit(its, undefined, 'grazing');
    if (fit.fits) break;
    const dx = its.map(() => 0), dy = its.map(() => 0);
    for (const [a, b] of fit.crowded) {
      const i = idx[a], j = idx[b], A = its[i], B = its[j];
      let vx = B.x - A.x, vy = B.y - A.y; const d = Math.hypot(vx, vy) || 1; vx /= d; vy /= d;
      const la = groupLayout(A), lb = groupLayout(B), wa = la.w * la.h, wb = lb.w * lb.h, t = wa + wb;
      dx[i] -= vx * 2.2 * (wb / t); dy[i] -= vy * 2.2 * (wb / t); dx[j] += vx * 2.2 * (wa / t); dy[j] += vy * 2.2 * (wa / t);
    }
    its.forEach((it, i) => {
      if (step < 250) { dx[i] += (orig[i].x - it.x) * 0.004; dy[i] += (orig[i].y - it.y) * 0.004; }
      it.x += dx[i]; it.y += dy[i];
      const [px, py] = zonePush(it); it.x += px; it.y += py;
    });
  }
  return its;
}
const snap = (it, f) => {
  const d = ITEMS[it.type];
  if (f >= 0.999) return it.qty;
  const prof = profileOf(it.type, it.style);
  if (prof?.kind === 'container') return it.qty; // a bowl stays a bowl
  const v = Math.max(d.step, Math.round((it.qty * f) / d.step) * d.step);
  return Math.min(it.qty, +v.toFixed(3));
};

const out = {}, report = [];
const only = new URLSearchParams(location.search).get('only');
const run = (key, place, getType) => {
  if (only && key !== only) return;
  const base = place.map((p, n) => ({ uid: key + n, n, type: getType(p), qty: p.q ?? p.qty, style: p.s || p.style || ITEMS[getType(p)].styles[0].id, r: p.r || 0, ...fromLegacy({ x: p.x, y: p.y }) }));
  let best = null;
  // First lower the amount placed at once; for big boards, then also serve the crackers or bread alongside.
  const tries = [[1, 0], [0.85, 0], [0.75, 0], [0.66, 0], [0.75, 1], [0.66, 1], [0.5, 1], [0.4, 1]];
  for (const [f, crunchAside] of tries) {
    const items = base.map((i) => {
      const placed = snap(i, f);
      const o = placed < i.qty ? { ...i, placed } : { ...i };
      if (crunchAside && ITEMS[i.type].cat === 'crunch') { o.alongside = true; delete o.placed; }
      return o;
    });
    // A few deterministic restarts with the starting points nudged, to get out of a stuck arrangement.
    let after, fit;
    for (let seed = 0; seed < 4; seed++) {
      const start = items.map((i, n) => (seed ? { ...i, x: i.x + Math.sin(n * 7.3 + seed) * 14, y: i.y + Math.cos(n * 3.1 + seed * 2) * 10 } : i));
      after = relax(start).map((i) => ({ ...i, x: Math.round(i.x * 10) / 10, y: Math.round(i.y * 10) / 10 })); fit = boardFit(after, undefined, 'grazing');
      if (fit.fits) break;
    }
    // Still stuck: try other starting spots for the groups that do not fit, keeping the rest where they are.
    if (!fit.fits && f <= 0.5) {
      const stuck = [...new Set([...fit.outside, ...fit.crowded.flatMap((c) => c.slice(0, 2))])];
      search: for (const gx of [0.2, 0.5, 0.8, 0.35, 0.65]) for (const gy of [0.3, 0.7, 0.5]) {
        const start = after.map((i) => (stuck.includes(i.uid) ? { ...i, x: z.x + z.w * gx, y: z.y + z.h * gy } : i));
        const tryIt = relax(start), tf = boardFit(tryIt, undefined, 'grazing');
        if (tf.fits) { after = tryIt; fit = tf; break search; }
      }
    }
    best = { f, crunchAside, after, fit };
    if (fit.fits) break;
  }
  best.after = best.after.map((i) => ({ ...i, x: Math.round(i.x * 10) / 10, y: Math.round(i.y * 10) / 10 }));
  best.fit = boardFit(best.after, undefined, 'grazing');
  out[key] = best.after.map((i) => ({ x: Math.round(i.x * 10) / 10, y: Math.round(i.y * 10) / 10, ...(i.placed != null ? { p: i.placed } : {}), ...(i.alongside ? { alongside: true } : {}) }));
  const name = (u) => ITEMS[best.after.find((i) => i.uid === u).type].name;
  report.push({ key, f: best.f + (best.crunchAside ? ' + crunch alongside' : ''), fits: best.fit.fits, outside: best.fit.outside.map(name), crowded: best.fit.crowded.map(([a, b, d]) => `${name(a)}/${name(b)} ${d}`) });
};
for (const pid of PRESENTATION_ORDER) for (const c of PRESENTATIONS[pid].compositions) run(`${pid}/${c.id}`, c.place, (p) => p.g);
for (const cid of COMMUNITY_ORDER) run(`community/${cid}`, COMMUNITY[cid].items, (p) => p.type);
window.__out = { out, report };
document.body.textContent = 'done';
