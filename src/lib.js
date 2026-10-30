// Pure helpers: quantities, shopping lists, designs, care schedule and gift dates.
import { ITEMS, BOARDS, styleOf, LAYER_ORDER } from './data/catalog.js';
import { RECIPES, PANTRY } from './data/recipes.js';
import { PRESENTATIONS } from './data/presentations.js';
import { COMMUNITY } from './data/community.js';
import { TECHNIQUES } from './data/techniques.js';
import { MEALS } from './data/meals.js';
import { fromLegacy } from './data/physical.js';
import { LAYOUTS_MM } from './data/layoutsMm.js';
import { groupLayout } from './board/geometry.js';

export const uid = (p = 'id') => p + '-' + Math.random().toString(36).slice(2, 9);
export const pad4 = (n) => String(n).padStart(4, '0');

// ---------- Quantities ----------
const FRACS = [[0, ''], [0.125, '1/8'], [0.25, '1/4'], [0.33, '1/3'], [0.5, '1/2'], [0.67, '2/3'], [0.75, '3/4'], [1, '']];
export function frac(q) {
  const whole = Math.floor(q + 0.02);
  const rest = q - whole;
  let best = FRACS[0], diff = 9;
  for (const f of FRACS) { const d = Math.abs(rest - f[0]); if (d < diff) { diff = d; best = f; } }
  const w = best[0] === 1 ? whole + 1 : whole;
  if (!best[1]) return String(w);
  return w ? `${w} ${best[1]}` : best[1];
}

const PLURAL = { slices: ['slice', 'slices'], sprigs: ['sprig', 'sprigs'], pieces: ['piece', 'pieces'], clove: ['clove', 'cloves'], can: ['can', 'cans'], stalks: ['stalk', 'stalks'], loaf: ['loaf', 'loaves'], cup: ['cup', 'cups'], pinch: ['pinch', 'pinches'], servings: ['serving', 'servings'], wedges: ['wedge', 'wedges'], leaves: ['leaf', 'leaves'] };
export function fmtQty(q, unit) {
  const n = frac(q);
  if (unit === 'each') return n;
  const pl = PLURAL[unit];
  if (pl) return `${n} ${q > 1.02 ? pl[1] : pl[0]}`;
  return `${n} ${unit}`;
}

const VOL = { tsp: 1, tbsp: 3, cup: 48 };
function fmtVolume(tsp) {
  if (tsp >= 12) return fmtQty(Math.round((tsp / 48) * 12) / 12, 'cup');
  if (tsp >= 3) return fmtQty(Math.round((tsp / 3) * 2) / 2, 'tbsp');
  return fmtQty(Math.round(tsp * 4) / 4, 'tsp');
}

// ---------- Designs ----------
// Placements authored on the legacy 600 × 400 canvas are converted to board mm on read; the source data is untouched.
// Meals are authored in mm (units: 'mm').
export function itemsFromPlacements(place, units = 'legacy') {
  return place.map((p) => {
    // Alongside items have no place on the board; they get the centre until someone puts them on it.
    const pos = p.x == null ? { x: 165, y: 120 } : units === 'mm' ? { x: p.x, y: p.y } : fromLegacy({ x: p.x, y: p.y });
    const it = { uid: uid('it'), type: p.g || p.type, qty: p.q ?? p.qty, ...pos, r: p.r || 0, style: p.s || p.style || ITEMS[p.g || p.type].styles[0].id };
    if (p.alongside) it.alongside = true;
    if (p.overflow) it.overflow = p.overflow;
    if (p.arrange) it.arrange = p.arrange;
    if (p.p != null && p.p < it.qty) it.placed = p.p;
    return it;
  });
}

// Uses the physical layout (mm) when there is one; otherwise converts the original placement.
function withLayout(place, key) {
  const mm = LAYOUTS_MM[key];
  if (!mm || mm.length !== place.length) return itemsFromPlacements(place);
  return itemsFromPlacements(place.map((p, i) => ({ ...p, x: mm[i].x, y: mm[i].y, ...(mm[i].p != null ? { p: mm[i].p } : {}), ...(mm[i].alongside ? { alongside: true } : {}) })), 'mm');
}

export function presentationItems(presId, compId) {
  const p = PRESENTATIONS[presId];
  const comp = p.compositions.find((c) => c.id === compId) || p.compositions[0];
  return withLayout(comp.place, `${presId}/${comp.id}`).map((it, i) => ({ ...it, uid: `${presId}-${comp.id}-${i}` }));
}

export function mealLayout(mid, layoutId) {
  const m = MEALS[mid];
  return m.layouts.find((l) => l.id === layoutId) || m.layouts[0];
}
export function mealItems(mid, layoutId) {
  const l = mealLayout(mid, layoutId);
  return itemsFromPlacements(l.place, 'mm').map((it, i) => ({ ...it, uid: `${mid}-${l.id}-${i}` }));
}

export function communityItems(cid) {
  return withLayout(COMMUNITY[cid].items, `community/${cid}`).map((it, i) => ({ ...it, uid: `${cid}-${i}` }));
}

export function totals(items) {
  const t = {};
  for (const it of items) t[it.type] = (t[it.type] || 0) + it.qty;
  return t;
}

export function techniquesFor(items) {
  const seen = new Set();
  for (const it of items) { const t = styleOf(it.type, it.style).tech; if (t) seen.add(t); }
  return [...seen].filter((t) => TECHNIQUES[t]);
}

export function recipesFor(items) {
  const seen = new Set();
  for (const it of items) if (ITEMS[it.type].recipe) seen.add(ITEMS[it.type].recipe);
  return [...seen];
}

export function presentationsUsingRecipe(rid) {
  const item = RECIPES[rid].item;
  return Object.entries(PRESENTATIONS)
    .filter(([, p]) => p.groups.some((g) => g.type === item))
    .map(([id, p]) => ({ id, p, qty: p.groups.find((g) => g.type === item).qty }));
}

// What does not sit on the board at once: groups served alongside, and amounts kept back to refill.
export function servingSplit(items) {
  const aside = [...new Set(items.filter((i) => i.alongside).map((i) => ITEMS[i.type].name))];
  const refill = [...new Set(items.filter((i) => !i.alongside && i.placed != null && i.placed < i.qty).map((i) => ITEMS[i.type].name))];
  return { aside, refill };
}
const list = (xs) => xs.map((x) => x.toLowerCase()).join(', ').replace(/, ([^,]*)$/, ' and $1');
export function servingSplitText(items) {
  const { aside, refill } = servingSplit(items);
  const parts = [];
  if (refill.length) parts.push(`Set out part of the ${list(refill)} and keep the rest aside to refill.`);
  if (aside.length) parts.push(`Serve the ${list(aside)} alongside the board.`);
  return parts.join(' ');
}

// ---------- Shopping ----------
// Builds a grouped list from placed items. Recipe items expand into their own ingredients.
export function shoppingFromItems(items, boardId, extraRecipes = []) {
  const map = new Map();
  const add = (key, name, qty, unit, from) => {
    if (qty == null) {
      // No amount in the source ("a few", "to taste"): listed once, without a quantity.
      const prev = map.get(key + '|free');
      if (prev) { if (from && !prev.from.includes(from)) prev.from.push(from); }
      else map.set(key + '|free', { key, name, amount: null, unit: null, vol: false, from: from ? [from] : [], pantry: PANTRY.has(key) });
      return;
    }
    const vol = VOL[unit];
    const k = vol ? key + '|vol' : key + '|' + unit;
    const prev = map.get(k);
    if (prev) { prev.amount += vol ? qty * vol : qty; if (from && !prev.from.includes(from)) prev.from.push(from); }
    else map.set(k, { key, name, amount: vol ? qty * vol : qty, unit, vol: !!vol, from: from ? [from] : [], pantry: PANTRY.has(key) });
  };
  const tot = totals(items);
  const recipeBatches = {};
  for (const [type, qty] of Object.entries(tot)) {
    const it = ITEMS[type];
    if (it.recipe) {
      const r = RECIPES[it.recipe];
      const batches = Math.max(1, Math.ceil((qty / r.yield.qty) * 2) / 2);
      recipeBatches[it.recipe] = Math.max(recipeBatches[it.recipe] || 0, batches);
    } else if (Array.isArray(it.shop)) {
      const from = it.shop.length > 1 ? it.name : null;
      for (const l of it.shop) add(l.key, l.name, l.qty == null ? null : (l.qty * qty) / it.baseQty, l.unit, from);
    } else if (it.shop) add(it.shop, 'Honey', qty, it.unit, null);
    else add(type, it.name, qty, it.unit, null);
  }
  for (const rid of extraRecipes) recipeBatches[rid] = Math.max(recipeBatches[rid] || 0, 1);
  for (const [rid, batches] of Object.entries(recipeBatches)) {
    for (const ing of RECIPES[rid].ingredients) add(ing.key, ing.name.split(',')[0], ing.qty * batches, ing.unit, RECIPES[rid].name);
  }
  const counted = new Set([...map.values()].filter((l) => l.amount != null).map((l) => l.key));
  const lines = [...map.values()].filter((l) => l.amount != null || !counted.has(l.key)).map((l) => ({
    ...l,
    label: l.amount == null ? '' : l.vol ? fmtVolume(l.amount) : fmtQty(l.amount, l.unit),
  }));
  const serveware = [];
  if (boardId) serveware.push(`${BOARDS[boardId].name} board`);
  // Bowls come from each group's container plan: a second bowl appears when the amount needs it.
  const bowls = {};
  for (const it of items) {
    const l = groupLayout(it);
    if (l.container) bowls[l.container.label] = (bowls[l.container.label] || 0) + l.plan.bowls;
  }
  for (const [label, n] of Object.entries(bowls)) serveware.push(n > 1 ? `${label} × ${n}` : label);
  for (const type of Object.keys(tot)) if (ITEMS[type].serveware && !items.some((i) => i.type === type && groupLayout(i).container)) serveware.push(ITEMS[type].serveware);
  const tools = new Set();
  for (const it of items) for (const t of ITEMS[it.type].tools) tools.add(t);
  for (const it of items) { const st = styleOf(it.type, it.style); if (st.tech === 'spoon-swoosh') tools.add('Parchment paper'); }
  return {
    groceries: lines.filter((l) => !l.pantry).sort((a, b) => a.name.localeCompare(b.name)),
    pantry: lines.filter((l) => l.pantry).sort((a, b) => a.name.localeCompare(b.name)),
    serveware,
    tools: [...tools],
    recipeBatches,
  };
}

export function recipeShopping(rid, scale) {
  const r = RECIPES[rid];
  const lines = r.ingredients.map((ing) => ({
    key: ing.key, name: ing.name.split(',')[0], unit: ing.unit, from: [], pantry: PANTRY.has(ing.key),
    label: VOL[ing.unit] ? fmtVolume(ing.qty * scale * VOL[ing.unit]) : fmtQty(ing.qty * scale, ing.unit),
  }));
  const it = ITEMS[r.item];
  return {
    groceries: lines.filter((l) => !l.pantry),
    pantry: lines.filter((l) => l.pantry),
    serveware: it.serveware ? [it.serveware] : [],
    tools: [...it.tools],
    recipeBatches: { [rid]: scale },
  };
}

// Resolves any list source to { title, board, items } so lists stay live.
export function resolveSource(src, user) {
  if (src.kind === 'presentation') {
    const p = PRESENTATIONS[src.id];
    const comp = p.compositions.find((c) => c.id === src.compositionId) || p.compositions[0];
    return { title: p.name, subtitle: comp.name, board: p.board, items: presentationItems(src.id, comp.id) };
  }
  if (src.kind === 'design') {
    const d = user.designs[src.id];
    if (!d) return null;
    return { title: d.name, subtitle: d.kind === 'scratch' ? 'From scratch' : 'Your version', board: d.board, items: d.items };
  }
  if (src.kind === 'community') {
    const c = COMMUNITY[src.id];
    return { title: c.name, subtitle: `Shared by Home #${c.home}`, board: c.board, items: communityItems(src.id) };
  }
  if (src.kind === 'meal') {
    const m = MEALS[src.id];
    if (!m) return null;
    return { title: m.name, subtitle: m.kind === 'share' ? 'Board to share' : 'Everyday meal', board: m.board, items: mealItems(src.id, src.compositionId) };
  }
  if (src.kind === 'recipe') {
    const r = RECIPES[src.id];
    return { title: r.name, subtitle: 'Recipe', board: null, items: [], recipe: true };
  }
  return null;
}

export function listContent(list, user) {
  const s = resolveSource(list.source, user);
  if (!s) return null;
  if (s.recipe) return { ...s, ...recipeShopping(list.source.id, list.source.scale || 1) };
  return { ...s, ...shoppingFromItems(s.items, s.board) };
}

// ---------- Layers ----------
export function buildLayers(items, tips = {}) {
  const layers = [];
  for (const cat of LAYER_ORDER) {
    const its = items.filter((i) => ITEMS[i.type].cat === cat);
    if (its.length) layers.push({ cat, uids: its.map((i) => i.uid), tip: tips[cat] });
  }
  return layers;
}

// ---------- Dates ----------
export const DAY = 86400000;
export function todayDate(offsetDays = 0) {
  const n = new Date();
  return new Date(Date.UTC(n.getFullYear(), n.getMonth(), n.getDate()) + offsetDays * DAY);
}
export const iso = (d) => d.toISOString().slice(0, 10);
export const fromIso = (s) => new Date(s + 'T00:00:00Z');
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export const MONTHS_SHORT = MONTHS.map((m) => m.slice(0, 3));
export const fmtDate = (d, withYear = false) => `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}${withYear ? ', ' + d.getUTCFullYear() : ''}`;
export const fmtShort = (d) => `${MONTHS_SHORT[d.getUTCMonth()]} ${d.getUTCDate()}`;
export const daysBetween = (a, b) => Math.round((b - a) / DAY);
export { MONTHS };

// Care plan (2026-10-30, owner update): reminders to CHECK the boards, set by how often they are used.
// Frequent: 14 days (shown as "about every 10 to 14 days"). Regular: one calendar month. Occasional: 42 days.
// The plan repeats while reminders are on; there is no last check. It counts from the day the boards came home,
// then from the last real care: a water test, or the day the boards were oiled. Opening the app never moves it.
export const CARE_USAGE = {
  frequent: { label: 'Frequent', hint: 'about every 10 to 14 days', days: 14 },
  regular: { label: 'Regular', hint: 'about once a month', months: 1 },
  occasional: { label: 'Occasional', hint: 'about every 6 weeks', days: 42 },
};
export const usageOf = (care) => (CARE_USAGE[care?.usage] ? care.usage : 'regular');

// Adds one calendar month and keeps the last day of a short month (Jan 31 -> Feb 28 or 29).
export function addMonthClamped(d, n = 1) {
  const y = d.getUTCFullYear(), m = d.getUTCMonth() + n, day = d.getUTCDate();
  const last = new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
  return new Date(Date.UTC(y, m, Math.min(day, last)));
}
export function addUsageInterval(d, usage) {
  const u = CARE_USAGE[usage] || CARE_USAGE.regular;
  return u.months ? addMonthClamped(d, u.months) : new Date(d.getTime() + u.days * DAY);
}

// The care event that starts the current cycle: the latest water test or oiling, else the arrival date.
export function careReference(care) {
  let ref = care.startedAt ? fromIso(care.startedAt) : null, kind = 'arrival';
  for (const c of care.checks || []) {
    for (const [at, k] of [[c.at, 'check'], [c.oiledAt, 'oiled']]) {
      if (!at) continue;
      const d = fromIso(at);
      if (!ref || d > ref) { ref = d; kind = k; }
    }
  }
  return { ref, kind };
}

export function careStatus(care, today) {
  const usage = usageOf(care);
  const { ref, kind } = careReference(care);
  const next = ref ? addUsageInterval(ref, usage) : null;
  const recorded = (care.checks || []).length;
  // A date in the past means one check is due now: never a pile of missed reminders.
  const due = !!next && next <= today;
  return { usage, ref, refKind: kind, next, due, overdueDays: due ? daysBetween(next, today) : 0, recorded };
}

// The most recent water test said "oil" and the Home hasn't confirmed oiling yet. Never assumed done.
export function oilPending(care) {
  if (care.status !== 'active' || !care.checks.length) return null;
  const last = [...care.checks].sort((a, b) => (a.at < b.at ? -1 : 1)).pop();
  return last.result === 'soaks' && !last.oiled ? last : null;
}

// Gift dates, same rules as the existing system: reminders 21 and 10 days ahead.
export const OCCASION_TYPES = ['Birthday', 'Anniversary', 'Housewarming', 'Wedding', 'Holiday', 'Other'];
export function nextOccurrence(g, today) {
  const [m, d] = g.md.split('-').map(Number);
  if (g.y) {
    const t = new Date(Date.UTC(g.y, m - 1, d));
    return t >= today ? t : null;
  }
  const make = (y) => {
    const leap = (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
    if (m === 2 && d === 29 && !leap) return new Date(Date.UTC(y, 2, 1));
    return new Date(Date.UTC(y, m - 1, d));
  };
  const y = today.getUTCFullYear();
  const t = make(y);
  return t >= today ? t : make(y + 1);
}
export function giftInfo(g, today) {
  const date = nextOccurrence(g, today);
  if (!date) return { date: null, days: null, stage: null };
  const days = daysBetween(today, date);
  const stage = days < 0 || days > 21 ? null : days >= 11 ? 21 : 10;
  const first = new Date(date.getTime() - 21 * DAY), second = new Date(date.getTime() - 10 * DAY);
  // A date added inside a window gets that stage's reminder on the next daily run, never a late first one.
  const added = g.addedAt ? fromIso(g.addedAt) : null;
  let sentOn = null;
  if (stage) { const due = stage === 21 ? first : second; sentOn = added && added > due ? added : due; }
  return { date, days, stage, first, second, sentOn };
}
// Reminder channels chosen for each date. Dates saved before this choice existed keep what the original system did:
// email. Push and email are separate; when both are on, each reminder goes once to each channel.
export const giftChannels = (g) => ({ push: !!g.channels?.push, email: g.channels ? !!g.channels.email : true });
export function giftChannelText(g) {
  const c = giftChannels(g);
  return c.push && c.email ? 'Push + email' : c.push ? 'Push' : 'Email';
}

export function giftWho(g) {
  if (g.occasion === 'Other') return `The day you set aside for ${g.name}`;
  return `${g.name}’s ${g.occasion.toLowerCase()}`;
}
export function whenText(days) {
  if (days === 0) return 'today';
  if (days === 1) return 'tomorrow';
  return `in ${days} days`;
}
