// Gatherings: what a gathering is, its starter lists and how its times are read. No recipes, no menus:
// each row is a food or drink someone commits to bring in full.

export const TYPES = [
  { id: 'dinner', label: 'Dinner', name: 'Dinner at home', hour: 19 },
  { id: 'bbq', label: 'BBQ', name: 'BBQ at home', hour: 13 },
  { id: 'brunch', label: 'Brunch', name: 'Brunch at home', hour: 11 },
  { id: 'drinks', label: 'Drinks & bites', name: 'Drinks & bites at home', hour: 18 },
];
export const typeOf = (id) => TYPES.find((t) => t.id === id) || TYPES[0];

// Starter lists. Amounts are a starting point the host edits, not a promise for every appetite or length of party.
// kind 'count': qty × unit, with a size per unit when it avoids doubt. kind 'people': "Enough for N people".
const ceil = (x, min = 1) => Math.max(min, Math.ceil(x));
const T = {
  dinner: (n) => [
    { name: 'Bread', qty: ceil(n / 4), unit: 'loaf' },
    { name: 'Salad', kind: 'people', qty: n },
    { name: 'Wine', qty: ceil(n / 3), unit: 'bottle', size: '750 ml each' },
    { name: 'Soft drinks', qty: ceil(n / 5), unit: 'bottle', size: '2 L each' },
    { name: 'Dessert', kind: 'people', qty: n },
    { name: 'Ice', qty: ceil(n / 5), unit: 'bag', size: '5 lb each' },
  ],
  bbq: (n) => [
    { name: 'Burger buns', qty: ceil(n / 8), unit: 'pack', size: '8 buns each' },
    { name: 'Chips', qty: ceil(n / 4), unit: 'bag', size: '8 oz each' },
    { name: 'Coleslaw', kind: 'people', qty: n },
    { name: 'Soft drinks', qty: ceil(n / 4), unit: 'bottle', size: '2 L each' },
    { name: 'Beer', qty: ceil(n / 6), unit: 'pack', size: '12 cans each' },
    { name: 'Ice', qty: ceil(n / 4), unit: 'bag', size: '5 lb each' },
  ],
  brunch: (n) => [
    { name: 'Bagels', qty: ceil(n / 12), unit: 'dozen' },
    { name: 'Fresh fruit', kind: 'people', qty: n },
    { name: 'Pastries', qty: ceil(n / 12), unit: 'dozen' },
    { name: 'Orange juice', qty: ceil(n / 6), unit: 'bottle', size: '52 fl oz each' },
    { name: 'Coffee', qty: ceil(n / 10), unit: 'bag', size: '12 oz each' },
  ],
  drinks: (n) => [
    { name: 'Chips', qty: ceil(n / 4), unit: 'bag', size: '8 oz each' },
    { name: 'Salsa', qty: ceil(n / 6), unit: 'jar', size: '16 oz each' },
    { name: 'Cheese and crackers', kind: 'people', qty: n },
    { name: 'Wine', qty: ceil(n / 3), unit: 'bottle', size: '750 ml each' },
    { name: 'Sparkling water', qty: ceil(n / 4), unit: 'bottle', size: '1 L each' },
    { name: 'Ice', qty: ceil(n / 5), unit: 'bag', size: '5 lb each' },
  ],
};
export const starterList = (type, people) => (T[type] || T.dinner)(Math.max(1, people)).map((r) => ({ kind: 'count', size: '', ...r, suggested: true }));

const PLURAL = { loaf: 'loaves', dozen: 'dozen', box: 'boxes', person: 'people' };
export const unitText = (qty, unit) => (qty === 1 ? unit : PLURAL[unit] || unit + 's');

// A row is ready to publish when its amount is clear.
export const isComplete = (it) => !!it.name?.trim() && Number(it.qty) > 0 && (it.kind === 'people' || !!it.unit?.trim());

export function amountText(it) {
  if (!isComplete(it)) return 'Amount needed';
  if (it.kind === 'people') return `Enough for ${it.qty} ${it.qty === 1 ? 'person' : 'people'}`;
  return `${it.qty} ${unitText(it.qty, it.unit)}${it.size ? `, ${it.size}` : ''}`;
}
// Short form for confirmations: "2 bags · 5 lb each".
export function amountShort(it) {
  if (it.kind === 'people') return `Enough for ${it.qty} ${it.qty === 1 ? 'person' : 'people'}`;
  return `${it.qty} ${unitText(it.qty, it.unit)}${it.size ? ` · ${it.size}` : ''}`;
}
export const sameAmount = (a, b) => a.name === b.name && Number(a.qty) === Number(b.qty) && (a.unit || '') === (b.unit || '') && (a.size || '') === (b.size || '') && (a.kind || 'count') === (b.kind || 'count');
// Only the food or the amount needs the guest to say yes again; a typo in the name does not.
export const isMajorChange = (from, to) => Number(from.qty) !== Number(to.qty) || (from.unit || '') !== (to.unit || '') || (from.size || '') !== (to.size || '') || (from.kind || 'count') !== (to.kind || 'count');

// ---------- Time ----------
// A gathering keeps its wall-clock time and its time zone; the instant is computed from both.
export const deviceTimeZone = () => { try { return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'; } catch (e) { return 'UTC'; } };

function wallOf(ms, tz) {
  const f = new Intl.DateTimeFormat('en-US', { timeZone: tz, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
  const p = Object.fromEntries(f.formatToParts(new Date(ms)).map((x) => [x.type, x.value]));
  return Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour % 24, +p.minute);
}
export function startInstant(startsAt, tz) {
  const [d, t] = startsAt.split('T');
  const [y, m, day] = d.split('-').map(Number), [hh, mm] = t.split(':').map(Number);
  const guess = Date.UTC(y, m - 1, day, hh, mm);
  let ms = guess - (wallOf(guess, tz) - guess);
  ms = guess - (wallOf(ms, tz) - ms);
  return ms;
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export function timeText(startsAt) {
  const [hh, mm] = startsAt.split('T')[1].split(':').map(Number);
  const h = hh % 12 || 12, ap = hh < 12 ? 'AM' : 'PM';
  return mm ? `${h}:${String(mm).padStart(2, '0')} ${ap}` : `${h} ${ap}`;
}
export function dateText(startsAt, withDay = true) {
  const [y, m, d] = startsAt.split('T')[0].split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return `${withDay ? DAYS[dt.getUTCDay()] + ', ' : ''}${MONTHS[m - 1]} ${d}`;
}
export const whenText = (startsAt) => `${dateText(startsAt)} at ${timeText(startsAt)}`;
export const shortWhen = (startsAt) => { const [y, m, d] = startsAt.split('T')[0].split('-').map(Number); return `${DAYS[new Date(Date.UTC(y, m - 1, d)).getUTCDay()]} at ${timeText(startsAt)}`; };

// Covered = a commitment that stands as it is now. A change waiting for a yes is not covered.
export function progress(g) {
  const live = g.items.filter((i) => isComplete(i) && !i.draft);
  const covered = live.filter((i) => i.status === 'host' || i.status === 'claimed').length;
  const waiting = live.filter((i) => i.status === 'change').length;
  return { covered, total: live.length, waiting, open: live.filter((i) => i.status === 'open').length };
}
