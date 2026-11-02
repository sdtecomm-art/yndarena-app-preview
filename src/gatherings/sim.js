// Gatherings service, SIMULATED for this preview.
// The interface is what the app would call on a real backend (host calls carry the account; guest calls carry
// only a public id or a private manage token). Here the "server" is this browser's localStorage, so tabs of the
// same browser share it, but other phones do not: this is not sync between devices. Nothing is sent: reminders
// and notices are written to an outbox and marked as simulated, never as delivered.
import { isComplete, startInstant, typeOf, isMajorChange, amountText } from './model.js';

const KEY = 'ynd-shared-sim-v1';
export const SIMULATED = true;
const EVT = 'ynd-shared-change';

// ---------- storage and atomicity ----------
const read = () => { try { return JSON.parse(localStorage.getItem(KEY)) || { gatherings: {}, byPublic: {} }; } catch (e) { return { gatherings: {}, byPublic: {} }; } };
const write = (db) => { localStorage.setItem(KEY, JSON.stringify(db)); window.dispatchEvent(new Event(EVT)); };

// Every write runs inside one exclusive lock shared by all tabs, so two reservations can never both read
// "available" (the Web Locks API; a real backend would use a transaction or a conditional update).
async function tx(fn) {
  const run = () => { const db = read(); const out = fn(db); if (out?.write !== false) write(db); return out?.result ?? out; };
  if (navigator.locks?.request) return navigator.locks.request('ynd-gatherings', run);
  return run();
}

export function subscribe(cb) {
  const on = (e) => { if (!e.key || e.key === KEY) cb(); };
  window.addEventListener('storage', on);
  window.addEventListener(EVT, cb);
  return () => { window.removeEventListener('storage', on); window.removeEventListener(EVT, cb); };
}

const token = (bytes = 16) => Array.from(crypto.getRandomValues(new Uint8Array(bytes)), (b) => b.toString(16).padStart(2, '0')).join('');
const shortId = () => token(5);
const now = () => Date.now();
const clone = (x) => JSON.parse(JSON.stringify(x));

// ---------- reminders and notices (outbox) ----------
// Scheduled reminders are recomputed after every change: only future ones are kept, a changed time cancels the old
// ones and creates new keys, and a key never appears twice, so reloads, retries or double runs cannot duplicate.
function desiredReminders(g) {
  const out = [];
  if (g.status !== 'active') return out;
  const start = startInstant(g.startsAt, g.tz);
  const add = (key, to, channel, at, kind, label) => { if (at > now()) out.push({ key, to, channel, at, kind, label }); };
  for (const ch of ['push', 'email']) {
    if (!g.hostChannels?.[ch]) continue;
    add(`${g.id}|host-24h|${g.startsAt}|${ch}`, 'host', ch, start - 24 * 3600e3, 'host-24h', 'Summary of the gathering and what is still needed');
    add(`${g.id}|host-3h|${g.startsAt}|${ch}`, 'host', ch, start - 3 * 3600e3, 'host-3h', 'Only if items are still needed or changes wait for a yes');
  }
  for (const it of g.items) {
    const c = it.claim;
    if (c?.source === 'guest' && c.email && (it.status === 'claimed' || it.status === 'change')) {
      add(`${g.id}|guest-3h|${c.id}|${g.startsAt}`, `guest:${c.name}`, 'email', start - 3 * 3600e3, 'guest-3h', `${it.name}, ${g.startsAt}, with the manage link`);
    }
  }
  return out;
}
function syncOutbox(g) {
  g.outbox = g.outbox || [];
  const want = desiredReminders(g);
  const keys = new Set(want.map((w) => w.key));
  for (const e of g.outbox) if (e.type === 'reminder' && e.status === 'scheduled' && !keys.has(e.key)) { e.status = 'cancelled'; e.cancelledAt = now(); }
  for (const w of want) if (!g.outbox.some((e) => e.key === w.key && e.status === 'scheduled')) g.outbox.push({ type: 'reminder', status: 'scheduled', simulated: true, ...w });
}
// Immediate notices follow the channels each person accepted. Same key twice = one notice.
function notice(g, key, to, channels, label) {
  g.outbox = g.outbox || [];
  for (const ch of channels) {
    const k = `${key}|${ch}`;
    if (g.outbox.some((e) => e.key === k)) continue;
    g.outbox.push({ type: 'notice', key: k, to, channel: ch, at: now(), status: 'would-send', simulated: true, label });
  }
}
const hostChannels = (g) => ['push', 'email'].filter((c) => g.hostChannels?.[c]);

// ---------- public projection ----------
// What anyone with the shared link may see: no tokens, no emails, nothing from the host's account.
function publicView(g) {
  return {
    publicId: g.publicId, name: g.name, type: g.type, startsAt: g.startsAt, tz: g.tz, people: g.people,
    location: g.location || '', note: g.note || '', status: g.status,
    items: g.items.filter((i) => isComplete(i) && !i.draft).map((i) => ({
      id: i.id, name: i.name, note: amountText(i),
      state: i.status === 'open' ? 'open' : i.status === 'change' ? 'pending' : 'taken',
      by: i.status === 'host' ? 'Host' : i.claim?.name || '',
    })),
  };
}

// ---------- host ----------
const own = (db, email, gid) => { const g = db.gatherings[gid]; if (!g || g.hostEmail !== email) throw new Error('not-found'); return g; };
const amount = (i) => ({ name: i.name, note: amountText(i) });

export const host = {
  list: (email) => Object.values(read().gatherings).filter((g) => g.hostEmail === email).map(clone),
  get: (email, gid) => { const g = read().gatherings[gid]; return g && g.hostEmail === email ? clone(g) : null; },

  create: (email, data) => tx((db) => {
    const id = 'g' + shortId(), publicId = token(9);
    const g = {
      id, publicId, hostEmail: email, hostName: data.hostName || '', type: data.type, name: data.name || typeOf(data.type).name,
      startsAt: data.startsAt, tz: data.tz, people: data.people, includeSelf: data.includeSelf,
      location: '', note: '', status: 'active', createdAt: now(), hostChannels: { push: false, email: false }, outbox: [],
      items: data.items.map((r) => ({ id: 'i' + shortId(), name: r.name, note: amountText(r), status: 'open', claim: null, change: null })),
    };
    db.gatherings[id] = g; db.byPublic[publicId] = id;
    syncOutbox(g);
    return { result: id };
  }),

  details: (email, gid, patch) => tx((db) => {
    const g = own(db, email, gid);
    const timeChanged = patch.startsAt && patch.startsAt !== g.startsAt;
    const from = g.startsAt;
    Object.assign(g, patch);
    if (timeChanged) {
      // A new date or time asks every guest who said yes to confirm again. The old time is kept to show it.
      for (const it of g.items) {
        if (!it.claim || it.status === 'host') continue;
        // Keep a pending amount change and its original time: the guest sees everything that changed since their yes.
        const pc = it.change;
        it.status = 'change';
        it.change = { id: shortId(), type: pc?.type === 'amount' || pc?.type === 'both' ? 'both' : 'time', fromStart: pc?.fromStart || from, toStart: g.startsAt, from: it.claim.accepted, requestedAt: now() };
        if (it.claim.email) notice(g, `time|${it.claim.id}|${g.startsAt}`, `guest:${it.claim.name}`, ['email'], 'New date or time: please confirm');
      }
    }
    syncOutbox(g);
  }),
  cancel: (email, gid) => tx((db) => {
    const g = own(db, email, gid);
    if (g.status === 'cancelled') return { write: false };
    g.status = 'cancelled'; g.cancelledAt = now();
    for (const it of g.items) if (it.claim?.email) notice(g, `cancelled|${it.claim.id}`, `guest:${it.claim.name}`, ['email'], 'The gathering was cancelled');
    syncOutbox(g);
  }),
  channels: (email, gid, ch) => tx((db) => { const g = own(db, email, gid); g.hostChannels = { push: !!ch.push, email: !!ch.email }; syncOutbox(g); }),

  addItem: (email, gid, r) => tx((db) => { const g = own(db, email, gid); g.items.push({ id: 'i' + shortId(), name: r.name.trim(), note: amountText(r), status: 'open', claim: null, change: null }); }),
  // Open or host rows change directly. A taken row only takes a correction of its name here.
  editItem: (email, gid, iid, r) => tx((db) => {
    const g = own(db, email, gid), it = g.items.find((x) => x.id === iid);
    if (it.claim && it.status !== 'host') {
      if (isMajorChange(amount(it), r)) throw new Error('needs-request');
      it.name = r.name; it.claim.accepted = { ...it.claim.accepted, name: r.name };
    } else Object.assign(it, { name: r.name.trim(), note: amountText(r), suggested: false });
  }),
  removeItem: (email, gid, iid) => tx((db) => {
    const g = own(db, email, gid), it = g.items.find((x) => x.id === iid);
    if (it.claim && it.status !== 'host') throw new Error('taken');
    g.items = g.items.filter((x) => x.id !== iid); syncOutbox(g);
  }),
  provide: (email, gid, iid, on) => tx((db) => {
    const g = own(db, email, gid), it = g.items.find((x) => x.id === iid);
    if (on && it.status !== 'open') throw new Error('taken');
    if (on) { it.status = 'host'; it.claim = null; } else if (it.status === 'host') it.status = 'open';
  }),
  // Someone told the host in person or by message. Kept apart from a guest's own reservation.
  confirmFor: (email, gid, iid, name) => tx((db) => {
    const g = own(db, email, gid), it = g.items.find((x) => x.id === iid);
    if (it.status !== 'open') throw new Error('taken');
    it.status = 'claimed';
    it.claim = { id: shortId(), name: name.trim(), source: 'host', at: now(), accepted: amount(it), email: null };
    syncOutbox(g);
  }),
  requestChange: (email, gid, iid, to) => tx((db) => {
    const g = own(db, email, gid), it = g.items.find((x) => x.id === iid);
    if (!it.claim) throw new Error('not-taken');
    const pc = it.change;
    it.change = { id: shortId(), type: pc?.fromStart ? 'both' : 'amount', from: it.claim.accepted, fromStart: pc?.fromStart, toStart: pc?.toStart, requestedAt: now() };
    Object.assign(it, { name: to.name, note: amountText(to) });
    it.status = 'change';
    if (it.claim.email) notice(g, `change|${it.change.id}`, `guest:${it.claim.name}`, ['email'], `Change requested: ${it.name}`);
    syncOutbox(g);
  }),
  sharedUpdate: (email, gid, iid) => tx((db) => { const it = own(db, email, gid).items.find((x) => x.id === iid); if (it.change) it.change.sharedByHostAt = now(); }),
  // The guest said yes outside the app. Marked as confirmed by the host, never as the guest's own action.
  confirmChange: (email, gid, iid) => tx((db) => {
    const g = own(db, email, gid), it = g.items.find((x) => x.id === iid);
    if (it.status !== 'change') return { write: false };
    it.claim.accepted = amount(it); it.claim.confirmedBy = 'host'; it.claim.confirmedAt = now();
    it.status = 'claimed'; it.change = null; syncOutbox(g);
  }),
  // Free a taken row. The host must tell the person; if they left an email, a notice is queued.
  release: (email, gid, iid) => tx((db) => {
    const g = own(db, email, gid), it = g.items.find((x) => x.id === iid);
    if (it.claim?.email) notice(g, `released|${it.claim.id}`, `guest:${it.claim.name}`, ['email'], `The host freed ${it.name}`);
    it.status = 'open'; it.claim = null; it.change = null; syncOutbox(g);
  }),
};

// ---------- guest ----------
const byPublic = (db, pid) => db.gatherings[db.byPublic[pid]];
const byToken = (db, t) => {
  for (const g of Object.values(db.gatherings)) for (const it of g.items) if (t && it.claim?.token === t) return { g, it };
  return null;
};
function mine(g, it) {
  return {
    gathering: publicView(g),
    item: { id: it.id, name: it.name, note: amountText(it) },
    name: it.claim.name, accepted: it.claim.accepted, email: it.claim.email || null,
    change: it.status === 'change' ? { type: it.change.type, from: it.change.from, to: amount(it), fromStart: it.change.fromStart, toStart: it.change.toStart, amountChanged: isMajorChange(it.change.from, amount(it)) } : null,
  };
}

export const guest = {
  view: (pid) => { const g = byPublic(read(), pid); return g ? publicView(g) : null; },
  mine: (t) => { const f = byToken(read(), t); return f ? mine(f.g, f.it) : null; },

  // Reserve a whole row. `req` is generated once per tap: a repeated request returns the same reservation.
  claim: (pid, iid, name, req) => tx((db) => {
    const g = byPublic(db, pid);
    if (!g) return { result: { error: 'gone' }, write: false };
    if (g.status !== 'active') return { result: { error: 'cancelled' }, write: false };
    const it = g.items.find((x) => x.id === iid);
    if (it?.claim?.req === req) return { result: { token: it.claim.token }, write: false };
    if (!it || it.status !== 'open' || !isComplete(it)) return { result: { error: 'taken' }, write: false };
    const t = token(16);
    it.status = 'claimed';
    it.claim = { id: shortId(), name: name.trim(), source: 'guest', token: t, req, at: now(), accepted: amount(it), email: null };
    return { result: { token: t } };
  }),
  // Move to another row: the new one is taken first, and the old one is only freed if that worked.
  switch: (t, iid, req) => tx((db) => {
    const f = byToken(db, t);
    if (!f) return { result: { error: 'gone' }, write: false };
    const { g, it: old } = f;
    const it = g.items.find((x) => x.id === iid);
    if (it?.claim?.req === req) return { result: { token: it.claim.token }, write: false };
    if (!it || it.status !== 'open') return { result: { error: 'taken' }, write: false };
    const nt = token(16);
    it.status = 'claimed';
    it.claim = { id: shortId(), name: old.claim.name, source: 'guest', token: nt, req, at: now(), accepted: amount(it), email: old.claim.email };
    old.status = 'open'; old.claim = null; old.change = null;
    syncOutbox(g);
    return { result: { token: nt } };
  }),
  cancel: (t) => tx((db) => {
    const f = byToken(db, t);
    if (!f) return { write: false };
    const { g, it } = f;
    notice(g, `guest-cancelled|${it.claim.id}`, 'host', hostChannels(g), `${it.claim.name} can’t bring ${it.name} anymore`);
    it.status = 'open'; it.claim = null; it.change = null;
    syncOutbox(g);
  }),
  respond: (t, accept) => tx((db) => {
    const f = byToken(db, t);
    if (!f || f.it.status !== 'change') return { write: false };
    const { g, it } = f;
    if (accept) { it.claim.accepted = amount(it); it.claim.confirmedBy = 'guest'; it.status = 'claimed'; it.change = null; }
    else {
      notice(g, `declined|${it.change.id}`, 'host', hostChannels(g), `${it.claim.name} can’t bring the new request for ${it.name}`);
      it.status = 'open'; it.claim = null; it.change = null;
    }
    syncOutbox(g);
  }),
  // Optional, for this gathering only: its reminder and important updates. Never for marketing.
  email: (t, email) => tx((db) => { const f = byToken(db, t); if (!f) return { write: false }; f.it.claim.email = email || null; syncOutbox(f.g); }),
};

// This device's own manage links, so a guest finds their commitment again without an account.
const DEVICE = 'ynd-guest-links-v1';
export const device = {
  links: () => { try { return JSON.parse(localStorage.getItem(DEVICE)) || {}; } catch (e) { return {}; } },
  remember: (pid, t) => { const d = device.links(); d[pid] = t; localStorage.setItem(DEVICE, JSON.stringify(d)); },
  forget: (pid) => { const d = device.links(); delete d[pid]; localStorage.setItem(DEVICE, JSON.stringify(d)); },
};

export const links = {
  guest: (pid) => `${location.origin}${location.pathname}#/g/${pid}`,
  manage: (pid, t) => `${location.origin}${location.pathname}#/g/${pid}/m/${t}`,
};

// Preview only: a sample gathering for the demo Home, with one sample guest ("Alex") so the host view has something
// in each group. Created once; the names are placeholders, not real people.
export async function demoGathering(email) {
  const have = host.list(email).find((g) => g.demo);
  if (have) return have;
  const d = new Date(); d.setDate(d.getDate() + ((6 - d.getDay() + 7) % 7 || 7));
  const p = (n) => String(n).padStart(2, '0');
  const { starterList, deviceTimeZone } = await import('./model.js');
  const id = await host.create(email, { type: 'dinner', name: 'Dinner at home', startsAt: `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T19:00`, tz: deviceTimeZone(), people: 8, includeSelf: true, hostName: '', items: starterList('dinner', 8) });
  await tx((db) => { db.gatherings[id].demo = true; });
  const g = host.get(email, id);
  await host.provide(email, id, g.items.find((i) => i.name === 'Dessert').id, true);
  await guest.claim(g.publicId, g.items.find((i) => i.name === 'Ice').id, 'Alex', 'demo-alex');
  return host.get(email, id);
}
