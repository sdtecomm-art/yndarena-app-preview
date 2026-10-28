// Writes media-source/pending/pending-assets.json and PENDING-ASSETS.md from the catalog: every component
// without a cutout, with the physical size its photo must fill and the meals that use it. Run: node tools/pending-manifest.mjs
import { writeFileSync } from 'node:fs';
import { ITEMS } from '../src/data/catalog.js';
import { PROFILES, CONTAINERS } from '../src/data/physical.js';
import { MEALS } from '../src/data/meals.js';

const out = [];
for (const [type, it] of Object.entries(ITEMS)) {
  if (!it.pending) continue;
  for (const st of it.styles) {
    const prof = PROFILES[`${type}:${st.id}`];
    const c = prof?.container && CONTAINERS[prof.container];
    const usedIn = Object.entries(MEALS).filter(([, m]) => m.layouts.some((l) => l.place.some((p) => p.g === type && (p.s || it.styles[0].id) === st.id))).map(([, m]) => m.name);
    out.push({
      id: `${type}--${st.id}`,
      file: `${type}-${st.id}.png`,
      component: it.name,
      style: st.label,
      shot: c ? `Top-down, transparent PNG, food in a plain ivory ${c.label.toLowerCase()} like the existing bowl cutouts` : prof.kind === 'units' ? `Top-down, transparent PNG, one ${prof.layout === 'grid' ? 'piece' : 'serving'} only; the app repeats it per piece` : 'Top-down, transparent PNG, one group as served',
      footprintMm: c ? { diameter: Math.round(c.d) } : prof.kind === 'units' ? { unitWidth: prof.unit, aspect: prof.aspect } : { width: prof.w, aspect: prof.aspect },
      amount: `${it.baseQty} ${it.unit}`,
      usedIn,
      rules: 'Same light as the v4 cutouts (soft window light, upper left). No board, no other food, no props. Not a photo of another dish.',
    });
  }
}
writeFileSync('media-source/pending/pending-assets.json', JSON.stringify({ created: '2026-10-28', count: out.length, assets: out }, null, 2) + '\n');
const md = ['# Pending photo resources', '', `Generated from the catalog on 2026-10-28. ${out.length} cutouts. Until they exist, the app shows each component as its physical outline with “Photo pending”, never a drawing or another dish.`, '', '| File | Component | Shot | Size on the board (mm) | Used in |', '|---|---|---|---|---|',
  ...out.map((a) => `| ${a.file} | ${a.component} (${a.style}) | ${a.shot} | ${Object.entries(a.footprintMm).filter(([, v]) => v != null).map(([k, v]) => `${k} ${v}`).join(', ')} | ${a.usedIn.join('; ')} |`),
  '', 'Also pending: a real photo of each meal on a Yndarena board (replaces nothing; the Photo view is rendered from the layout), and a product photo of each board surface (the boards still use a generic wood texture).', ''];
writeFileSync('media-source/pending/PENDING-ASSETS.md', md.join('\n'));
console.log(out.length, 'pending assets');
