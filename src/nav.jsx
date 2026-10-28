// Minimal stack navigation: one stack per tab, full-screen routes hide the tab bar.
import { createContext, useCallback, useContext, useMemo, useState } from 'react';

// Care is a tab again: the care plan is the main reason to open the app. Gift dates stay on the Home.
export const TABS = ['home', 'discover', 'care', 'collection'];
export const FULL = new Set(['designer', 'table', 'water-test', 'oil-guide', 'share']);

const roots = () => Object.fromEntries(TABS.map((t) => [t, [{ name: t, key: t }]]));
let n = 0;

const Ctx = createContext(null);

export function NavProvider({ children }) {
  const [nav, setNav] = useState({ tab: 'home', stacks: roots(), dir: 'none' });

  const push = useCallback((name, params = {}) => {
    setNav((s) => ({ ...s, dir: 'push', stacks: { ...s.stacks, [s.tab]: [...s.stacks[s.tab], { name, params, key: name + ++n }] } }));
  }, []);
  const replace = useCallback((name, params = {}) => {
    setNav((s) => {
      const st = s.stacks[s.tab].slice(0, -1);
      return { ...s, dir: 'push', stacks: { ...s.stacks, [s.tab]: [...st, { name, params, key: name + ++n }] } };
    });
  }, []);
  const pop = useCallback((count = 1) => {
    setNav((s) => {
      const st = s.stacks[s.tab];
      if (st.length <= 1) return s;
      return { ...s, dir: 'pop', stacks: { ...s.stacks, [s.tab]: st.slice(0, Math.max(1, st.length - count)) } };
    });
  }, []);
  const popTo = useCallback((name) => {
    setNav((s) => {
      const st = s.stacks[s.tab];
      const i = st.map((r) => r.name).lastIndexOf(name);
      if (i < 0) return s;
      return { ...s, dir: 'pop', stacks: { ...s.stacks, [s.tab]: st.slice(0, i + 1) } };
    });
  }, []);
  const switchTab = useCallback((tab, route) => {
    setNav((s) => {
      const stacks = { ...s.stacks };
      if (s.tab === tab && !route) stacks[tab] = stacks[tab].slice(0, 1);
      if (route) {
        const r = { params: {}, ...route, key: route.name + ++n };
        stacks[tab] = route.name === tab ? [r] : [stacks[tab][0], r];
      }
      return { ...s, tab, dir: 'none', stacks };
    });
  }, []);
  const resetAll = useCallback((tab = 'home') => setNav({ tab, stacks: roots(), dir: 'none' }), []);

  const value = useMemo(() => {
    const stack = nav.stacks[nav.tab];
    const top = stack[stack.length - 1];
    return { ...nav, stack, top, full: FULL.has(top.name), push, pop, popTo, replace, switchTab, resetAll };
  }, [nav, push, pop, popTo, replace, switchTab, resetAll]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useNav = () => useContext(Ctx);
