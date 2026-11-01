// Local, simulated state for the preview. Nothing here talks to production:
// no real accounts, no Home counter, no emails, no purchases.
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { pad4, todayDate, iso, DAY } from './lib.js';

const KEY = 'ynd-preview-v2';
export const DEMO_CODE = '246810';
export const EXPIRED_CODE = '000000';
export const RETURNING_EMAIL = 'home@example.com';

export function emptyUser() {
  return {
    welcomed: false,
    care: { status: 'none', startedAt: null, checks: [], prefs: { email: true, app: true }, oil: null },
    gifts: [],
  };
}

// Demo data for the returning Home. Clearly a sample account, never shown to new users.
function returningUser() {
  const u = emptyUser();
  const t = todayDate();
  u.welcomed = true;
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
  };
}

// v11 retired recipes, presentations, Designer and Collection. Their fields leave the active experience but are
// not deleted: they move, untouched, under `retiredV11` in the same user, so nothing is purged as a side effect.
// Account, Home number, care plan, gift dates and channel choices are never touched.
export const RETIRED_FIELDS = ['saved', 'designs', 'made', 'notes', 'lists', 'reviews', 'shares', 'recent'];
export function migrateV11(state) {
  for (const user of Object.values(state.users || {})) {
    const moved = {};
    for (const k of RETIRED_FIELDS) if (k in user) { moved[k] = user[k]; delete user[k]; }
    if (Object.keys(moved).length) user.retiredV11 = { ...(user.retiredV11 || {}), ...moved, movedAt: user.retiredV11?.movedAt || new Date().toISOString() };
  }
  delete state.pendingShare;
  return state;
}

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const state = JSON.parse(raw);
      const before = JSON.stringify(state);
      migrateV11(state);
      // Persist the migration once.
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

