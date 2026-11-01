// Pure helpers: dates, care schedule and gift dates.

export const uid = (p = 'id') => p + '-' + Math.random().toString(36).slice(2, 9);
export const pad4 = (n) => String(n).padStart(4, '0');

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
