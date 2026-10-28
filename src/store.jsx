// Local, simulated state for the preview. Nothing here talks to production:
// no real accounts, no Home counter, no emails, no purchases.
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { uid, pad4, presentationItems, todayDate, iso, DAY } from './lib.js';
import { fromLegacy } from './data/physical.js';

const KEY = 'ynd-preview-v2';
export const DEMO_CODE = '246810';
export const EXPIRED_CODE = '000000';
export const RETURNING_EMAIL = 'home@example.com';

export function emptyUser() {
  return {
    welcomed: false,
    saved: [],
    designs: {},
    made: [],
    notes: {},
    lists: {},
    reviews: [],
    shares: [],
    care: { status: 'none', startedAt: null, checks: [], prefs: { email: true, app: true }, oil: null },
    gifts: [],
    recent: null,
  };
}

// Demo data for the returning Home. Clearly a sample account, never shown to new users.
function returningUser() {
  const u = emptyUser();
  const t = todayDate();
  const daysAgo = (n) => new Date(t.getTime() - n * DAY).toISOString();
  u.welcomed = true;
  u.saved = [
    { kind: 'presentation', id: 'golden-hour', at: daysAgo(12) },
    { kind: 'recipe', id: 'fig-jam', at: daysAgo(30) },
  ];
  const items = presentationItems('love-like-rosemary', 'two-halves').map((it) => ({
    ...it,
    uid: uid('it'),
    type: it.type === 'cheddar' ? 'manchego' : it.type,
  }));
  const did = 'd-anniversary';
  u.designs[did] = {
    id: did,
    units: 'mm',
    name: 'Love, Like Rosemary · Our version',
    board: 'cheese-bread',
    kind: 'modified',
    origin: { kind: 'presentation', id: 'love-like-rosemary', compositionId: 'two-halves', name: 'Love, Like Rosemary', compositionName: 'Two Halves' },
    items,
    versions: [{ id: 'v1', at: daysAgo(40), label: 'Version 1', items, board: 'cheese-bread' }],
    createdAt: daysAgo(40),
    updatedAt: daysAgo(36),
  };
  u.made = [
    { id: 'm1', kind: 'design', refId: did, at: daysAgo(36), version: 'Version 1' },
    { id: 'm2', kind: 'recipe', refId: 'fig-jam', at: daysAgo(37) },
  ];
  u.notes[`design:${did}`] = { text: 'Our anniversary. Manchego instead of cheddar, and we ate it on the balcony.', photos: [] };
  u.reviews = [
    { id: 'r1', kind: 'design', refId: did, version: 'Version 1', stars: 5, comment: 'Easy to put together and it looked lovely.', at: daysAgo(36) },
    { id: 'r2', kind: 'recipe', refId: 'fig-jam', version: 'original', stars: 4, comment: 'Next time a little less sugar.', at: daysAgo(36) },
  ];
  u.lists['l-anniv'] = { id: 'l-anniv', source: { kind: 'design', id: did }, have: { crackers: true, honey: true }, createdAt: daysAgo(38) };
  const start = new Date(t.getTime() - 22 * 7 * DAY);
  u.care = {
    status: 'active',
    startedAt: iso(start),
    checks: [
      { n: 1, at: iso(new Date(start.getTime() + 21 * DAY)), result: 'soaks', oiled: true },
      { n: 2, at: iso(new Date(start.getTime() + 105 * DAY)), result: 'beads', oiled: false },
    ],
    prefs: { email: true, app: true },
    oil: 'yes',
  };
  const inDays = (n) => { const d = new Date(t.getTime() + n * DAY); return `${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`; };
  u.gifts = [
    { id: 'g1', name: 'Ana', occasion: 'Birthday', md: inDays(16) },
    { id: 'g2', name: 'Leo and Sam', occasion: 'Wedding', md: '05-10', y: t.getUTCFullYear() + 1 },
    { id: 'g3', name: 'Mom and Dad', occasion: 'Anniversary', md: inDays(54) },
  ];
  u.recent = { kind: 'design', id: did, at: daysAgo(2) };
  return u;
}

function initialState() {
  return {
    backend: {
      counter: 127,
      accounts: { [RETURNING_EMAIL]: { number: 45, createdAt: todayDate(-180).toISOString(), marketing: false } },
    },
    users: { [RETURNING_EMAIL]: returningUser() },
    session: null,
    demo: { dayOffset: 0 },
    pendingShare: null,
  };
}

// Designs saved before the move to physical units (600 × 400 canvas) are converted once to board mm.
// The original items and versions are kept untouched under `legacy`; names, boards and contents stay the same.
export function migrateDesigns(state) {
  for (const user of Object.values(state.users || {})) {
    for (const d of Object.values(user.designs || {})) {
      if (d.units === 'mm') continue;
      d.legacy = { items: d.items, versions: d.versions, canvas: [600, 400] };
      const conv = (items) => items.map((i) => ({ ...i, ...fromLegacy({ x: i.x, y: i.y }) }));
      d.items = conv(d.items || []);
      d.versions = (d.versions || []).map((v) => ({ ...v, items: conv(v.items || []) }));
      d.units = 'mm';
    }
  }
  return state;
}

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const state = JSON.parse(raw);
      const before = JSON.stringify(state);
      migrateDesigns(state);
      // Persist the conversion once, so every later read sees board mm.
      if (JSON.stringify(state) !== before) localStorage.setItem(KEY, JSON.stringify(state));
      return state;
    }
  } catch (e) { /* storage unavailable */ }
  return initialState();
}

const Ctx = createContext(null);

export function StoreProvider({ children }) {
  const [state, setState] = useState(load);
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* quota or private mode */ }
  }, [state]);

  const update = useCallback((fn) => {
    setState((s) => { const d = structuredClone(s); fn(d); return d; });
  }, []);

  const value = useMemo(() => {
    const email = state.session?.email;
    const user = email ? state.users[email] : null;
    const account = email ? state.backend.accounts[email] : null;
    const updateUser = (fn) => update((d) => fn(d.users[d.session.email], d));
    const today = todayDate(state.demo.dayOffset || 0);
    return {
      state, update, user, account, email, updateUser, today,
      homeNo: account ? pad4(account.number) : null,
      resetDemo: () => { try { localStorage.removeItem(KEY); } catch (e) { /* ignore */ } setState(initialState()); },
    };
  }, [state, update]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useStore = () => useContext(Ctx);

// Simulated auth backend. Mirrors the intended flow only.
export const authApi = {
  verify(code) {
    if (code === EXPIRED_CODE) return 'expired';
    if (code === DEMO_CODE) return 'ok';
    return 'wrong';
  },
  exists(state, email) { return !!state.backend.accounts[email]; },
};

export function createAccount(d, email, marketing) {
  d.backend.counter += 1;
  d.backend.accounts[email] = { number: d.backend.counter, createdAt: new Date().toISOString(), marketing };
  d.users[email] = emptyUser();
  d.session = { email };
}

export function isSaved(user, kind, id) {
  return user.saved.some((s) => s.kind === kind && s.id === id);
}
