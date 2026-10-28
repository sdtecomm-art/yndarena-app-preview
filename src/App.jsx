import { useEffect, useState } from 'react';
import { StoreProvider, useStore, DEMO_CODE, RETURNING_EMAIL } from './store.jsx';
import { NavProvider, useNav, TABS } from './nav.jsx';
import { ToastProvider, ToastHost, useToast, Icon, Kicker, Sprig, ConfirmTap } from './ui.jsx';
import { useActions } from './actions.js';
import { pad4 } from './lib.js';
import { COMMUNITY } from './data/community.js';
import { ITEMS } from './data/catalog.js';
import Auth from './screens/Auth.jsx';
import Welcome from './screens/Welcome.jsx';
import Home from './screens/Home.jsx';
import Meal from './screens/Meal.jsx';
import Discover from './screens/Discover.jsx';
import Presentation from './screens/Presentation.jsx';
import Recipe from './screens/Recipe.jsx';
import Technique from './screens/Technique.jsx';
import Designer from './screens/Designer.jsx';
import Table from './screens/Table.jsx';
import Shopping from './screens/Shopping.jsx';
import Collection, { DesignItem, MadeItem } from './screens/Collection.jsx';
import Community, { ShareDesign, SharedView, decodeShare, encodeShare } from './screens/Community.jsx';
import Care, { WaterTest } from './screens/Care.jsx';
import Profile, { Story } from './screens/Profile.jsx';
import Review from './screens/Review.jsx';
import { WORDMARK } from './assets.js';

const TAB_META = {
  home: { label: 'Home', icon: 'home' },
  discover: { label: 'Discover', icon: 'discover' },
  collection: { label: 'Collection', icon: 'collection' },
};

function parseHash() {
  const m = location.hash.match(/^#\/s\/(.+)$/);
  return m ? decodeShare(m[1]) : null;
}

function ScreenFor({ route, onSignOut, openProfile }) {
  const p = route.params || {};
  switch (route.name) {
    case 'home': return <Home openProfile={openProfile} />;
    case 'discover': return <Discover params={p} />;
    case 'collection': return <Collection />;
    case 'care': return <Care params={p} />;
    case 'presentation': return <Presentation params={p} />;
    case 'meal': return <Meal params={p} />;
    case 'recipe': return <Recipe params={p} />;
    case 'technique': return <Technique params={p} />;
    case 'community': return <Community params={p} />;
    case 'table': return <Table params={p} />;
    case 'shopping': return <Shopping params={p} />;
    case 'item': return <DesignItem params={p} />;
    case 'made': return <MadeItem params={p} />;
    case 'share': return <ShareDesign params={p} />;
    case 'water-test': return <WaterTest />;
    case 'profile': return <Profile onSignOut={onSignOut} />;
    case 'story': return <Story />;
    case 'review': return <Review />;
    default: return null;
  }
}

function Main({ onSignOut }) {
  const nav = useNav();
  const { state, update } = useStore();
  const a = useActions();
  const toast = useToast();

  // A shared link opened while signed out: finish the action after sign in.
  useEffect(() => {
    const ps = state.pendingShare;
    if (!ps) return;
    update((d) => { d.pendingShare = null; });
    const id = a.fromShared(ps.payload);
    nav.switchTab('collection', ps.kind === 'edit' ? { name: 'designer', params: { id } } : { name: 'item', params: { id } });
    toast(ps.kind === 'edit' ? 'A copy is ready for you to make yours.' : 'Saved to your collection.');
  }, []); // eslint-disable-line

  const openProfile = () => nav.push('profile');
  return (
    <>
      <div className="screens">
        {TABS.map((tab) =>
          nav.stacks[tab].map((route, i) => {
            const isTop = tab === nav.tab && i === nav.stacks[tab].length - 1;
            const full = ['designer', 'table', 'water-test', 'share'].includes(route.name);
            const anim = isTop && i > 0 ? (nav.dir === 'push' ? ' anim-push' : nav.dir === 'pop' ? ' anim-pop' : '') : '';
            if (route.name === 'designer') {
              return <div key={route.key} className={'screen is-full' + anim} hidden={!isTop}><Designer params={route.params} /></div>;
            }
            return (
              <div key={route.key} className={'screen' + (full ? ' is-full' : ' has-tabbar') + anim} hidden={!isTop}>
                <div className="screen-scroll">
                  <ScreenFor route={route} onSignOut={onSignOut} openProfile={openProfile} />
                </div>
              </div>
            );
          }),
        )}
      </div>
      {!nav.full && (
        <nav className="tabbar" aria-label="Main">
          {TABS.map((t) => (
            <button key={t} className={nav.tab === t ? 'is-active' : ''} onClick={() => nav.switchTab(t)} aria-current={nav.tab === t ? 'page' : undefined}>
              <Icon name={TAB_META[t].icon} size={23} />
              {TAB_META[t].label}
              <span className="tab-dot" />
            </button>
          ))}
        </nav>
      )}
    </>
  );
}

function AppScreen({ shared, setShared }) {
  const { state, user, update } = useStore();
  const nav = useNav();
  const toast = useToast();

  const signOut = () => { update((d) => { d.session = null; }); nav.resetAll(); };
  const closeShared = () => { history.replaceState(null, '', location.pathname); setShared(null); };

  if (shared) {
    return (
      <SharedView
        payload={shared}
        onClose={closeShared}
        onSignIn={(kind) => { update((d) => { d.pendingShare = { payload: shared, kind }; }); closeShared(); }}
      />
    );
  }
  if (!state.session) {
    return (
      <Auth
        key="auth"
        onSignedIn={(kind, number) => {
          nav.resetAll();
          if (kind === 'returning') toast(`Welcome back to Home No. ${pad4(number)}.`);
        }}
      />
    );
  }
  if (!user.welcomed) return <Welcome onDone={() => nav.resetAll()} />;
  return <Main onSignOut={signOut} />;
}

const JOURNEYS = [
  ['new', 'Sign up as a new Home'],
  ['returning', 'Sign in as a returning Home'],
  ['care', 'Care plan and water test'],
  ['meal', 'An everyday meal on the board'],
  ['meal-designer', 'Swap a side in Designer'],
  ['presentation', 'Explore a presentation'],
  ['layouts', 'Switch layouts, same ingredients'],
  ['designer', 'Make it yours in Designer'],
  ['technique', 'Look up a technique'],
  ['recipe', 'Recipe and shopping list'],
  ['build', 'Build a board by layers'],
  ['collection', 'Your collection'],
  ['h2h', 'Adapt a board from another Home'],
  ['shared', 'Open a shared link'],
  ['gifts', 'Gift dates'],
];

function SidePanels({ children, setShared }) {
  const { state, update, resetDemo } = useStore();
  const nav = useNav();
  const a = useActions();
  const toast = useToast();

  const ensureSession = () => {
    if (!state.session || !state.users[state.session.email]?.welcomed) {
      update((d) => { d.session = { email: RETURNING_EMAIL }; });
      toast('Signed in as the demo Home No. 0045.');
    }
  };
  const run = (k) => {
    setShared(null);
    if (k === 'new') { update((d) => { d.session = null; }); nav.resetAll(); return; }
    if (k === 'returning') { update((d) => { d.session = { email: RETURNING_EMAIL }; }); nav.resetAll(); toast('Welcome back to Home No. 0045.'); return; }
    if (k === 'shared') {
      const c = COMMUNITY['h2h-midnight'];
      const enc = encodeShare({ name: c.name, board: c.board, origin: c.origin, items: c.items.map((i) => ({ ...i, style: i.style || ITEMS[i.type].styles[0].id })) }, c.home, c.note);
      history.replaceState(null, '', '#/s/' + enc);
      setShared(decodeShare(enc));
      return;
    }
    ensureSession();
    nav.resetAll();
    const L = 'love-like-rosemary';
    setTimeout(() => {
      if (k === 'meal') nav.switchTab('discover', { name: 'meal', params: { id: 'steak-potatoes' } });
      if (k === 'meal-designer') { const id = a.fromMeal('salmon-rice-greens'); nav.switchTab('discover', { name: 'designer', params: { id } }); }
      if (k === 'presentation') nav.switchTab('discover', { name: 'presentation', params: { id: L } });
      if (k === 'layouts') nav.switchTab('discover', { name: 'presentation', params: { id: L, comp: 'the-sprig' } });
      if (k === 'designer') { const id = a.fromPresentation(L, 'two-halves'); nav.switchTab('discover', { name: 'designer', params: { id } }); }
      if (k === 'technique') nav.switchTab('discover', { name: 'technique', params: { id: 'prosciutto-rose' } });
      if (k === 'recipe') nav.switchTab('discover', { name: 'recipe', params: { id: 'fig-jam' } });
      if (k === 'build') nav.switchTab('discover', { name: 'table', params: { source: { kind: 'presentation', id: L, compositionId: 'two-halves' } } });
      if (k === 'collection') nav.switchTab('collection');
      if (k === 'h2h') nav.switchTab('discover', { name: 'community', params: { id: 'h2h-midnight' } });
      if (k === 'care') nav.switchTab('care');
      if (k === 'review') nav.switchTab('home', { name: 'review', params: {} });
      if (k === 'gifts') nav.switchTab('care', { name: 'care', params: { seg: 'gifts' } });
    }, 30);
  };

  return (
    <div className="stage">
      <aside className="side">
        <img className="wordmark" src={WORDMARK} alt="Yndarena, turning houses into homes" />
        <Kicker className="mt"><span style={{ display: 'block', marginTop: 26 }}>App preview · v0.1</span></Kicker>
        <h1>Turning houses into homes.</h1>
        <p>A navigable preview of the Yndarena app for iOS and Android. Open this link on a phone to use it full screen.</p>
        <div className="side-box">
          <strong>Sign-in code</strong>
          <code>{DEMO_CODE}</code>
          <p style={{ margin: '6px 0 0', fontSize: 13.5 }}>Returning Home: {RETURNING_EMAIL}<br />Any other email creates a new Home.</p>
        </div>
        <div className="side-box">
          <strong>Simulated in this preview</strong>
          Accounts, codes and Home numbers, emails and reminders, sharing and review. Changes are saved in this browser only.
        </div>
      </aside>
      <div className="device">
        <div className="app">
          <div className="status-bar"><span>9:41</span><span style={{ letterSpacing: '.1em' }}>●●● ▮</span></div>
          <div className="island" />
          {children}
          <div id="sheet-root" />
          <ToastHost />
          <div className="home-ind" />
        </div>
      </div>
      <aside className="side">
        <Kicker>Journeys to try</Kicker>
        <ul className="side-list">
          {JOURNEYS.map(([k, label], i) => (
            <li key={k}><button onClick={() => run(k)}><span className="num">{String(i + 1).padStart(2, '0')}</span>{label}<Icon name="arrow" size={16} /></button></li>
          ))}
        </ul>
        <div className="row" style={{ marginTop: 18, gap: 10 }}>
          <button className="link" onClick={() => run('review')}>Review panel</button>
          <ConfirmTap onConfirm={() => { resetDemo(); nav.resetAll(); setShared(null); toast('Preview reset.'); }} render={(armed, tap) => <button className="link" onClick={tap}>{armed ? 'Tap again to clear everything' : 'Reset demo'}</button>} />
          <Sprig style={{ height: 34, marginLeft: 'auto' }} />
        </div>
      </aside>
    </div>
  );
}

function Shell() {
  const [shared, setShared] = useState(parseHash);
  useEffect(() => {
    const on = () => setShared(parseHash());
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return (
    <SidePanels setShared={setShared}>
      <AppScreen shared={shared} setShared={setShared} />
    </SidePanels>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <NavProvider>
        <ToastProvider>
          <Shell />
        </ToastProvider>
      </NavProvider>
    </StoreProvider>
  );
}
