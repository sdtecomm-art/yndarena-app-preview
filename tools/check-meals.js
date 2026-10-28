// Dev-only: fit of every meal layout with the physical profiles. Open /tools/check-meals.html on the dev server.
import { MEALS } from '../src/data/meals.js';
import { mealItems } from '../src/lib.js';
import { boardFit, fitMode, groupLayout } from '../src/board/geometry.js';
import { serviceZone } from '../src/data/physical.js';

const out = [];
for (const [id, m] of Object.entries(MEALS)) {
  for (const l of m.layouts) {
    const items = mealItems(id, l.id);
    const mode = fitMode(items);
    const f = boardFit(items, serviceZone(), mode);
    const sizes = items.map((i) => { const g = groupLayout(i); return `${i.type}${i.alongside ? '(along)' : ''} ${g.w.toFixed(0)}×${g.h.toFixed(0)} @${i.x},${i.y}`; });
    out.push({ id, layout: l.id, mode, fits: f.fits, outside: f.outside, crowded: f.crowded, sizes });
  }
}
window.__result = out;
document.getElementById('out').textContent = JSON.stringify(out, null, 1);
