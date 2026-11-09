import { useEffect, useState } from 'react';
import { StoreProvider, useStore, DEMO_CODE, RETURNING_EMAIL } from './store.jsx';
import { NavProvider, useNav, TABS, FULL } from './nav.jsx';
import { ToastProvider, ToastHost, useToast, Icon, Kicker, Sprig, ConfirmTap, Button } from './ui.jsx';
import { pad4 } from './lib.js';
import Auth from './screens/Auth.jsx';
import Welcome from './screens/Welcome.jsx';
import Home from './screens/Home.jsx';
import Care, { WaterTest, OilGuide } from './screens/Care.jsx';
import Cook, { CookSetup, Recipe, Shopping, Prep } from './screens/Cook.jsx';
import Gatherings, { GatheringNew, GatheringHost } from './screens/Gatherings.jsx';
import Guest from './screens/Guest.jsx';
import Gifts from './screens/Gifts.jsx';
import Profile from './screens/Profile.jsx';
import Review from './screens/Review.jsx';
import Entry from './screens/Entry.jsx';
import { demoGathering } from './gatherings/sim.js';
import { WORDMARK } from './assets.js';
import kitchenDesktop from './media/kitchen/yndarena-kitchen-desktop.webp';

const TAB_META = {
  home: { label: 'Home', icon: 'home' },
  cook: { label: 'Cook', icon: 'cook' },
  gatherings: { label: 'Gatherings', icon: 'people' },
  gifts: { label: 'Gifts', icon: 'gift' },
};

// Links the app can be opened with. #/g/… is a gathering's guest page (and #/g/…/m/… a guest's private manage
// link). Anything else under #/ is an old link to a retired feature: it gets a short way back, never a crash.
function parseHash() {
  const g = location.hash.match(/^#\/g\/([a-f0-9]+)(?:\/m\/([a-f0-9]+))?$/);
  if (g) return { kind: 'guest', publicId: g[1], token: g[2] || null };
  if (/^#\/./.test(location.hash)) return { kind: 'retired' };
  return null;
}

// A screen name from an older version (recipes, Designer, Collection…) lands here instead of failing.
function Retired({ onHome }) {
  return (
    <div className="pad retired">
      <Sprig style={{ height: 48 }} />
      <h1 className="display-m">This page is no longer in the app.</h1>
      <p className="body">It belonged to an earlier version. Your care plan, gift dates and dinners are where you left them.</p>
      <Button block style={{ marginTop: 18 }} onClick={onHome}>Go to Home</Button>
    </div>
  );
}

function ScreenFor({ route, onSignOut, openProfile, root }) {
  const nav = useNav();
  const p = route.params || {};
  switch (route.name) {
    case 'home': return <Home openProfile={openProfile} />;
    case 'care': return <Care params={p} root={root} />;
    case 'cook': return <Cook />;
    case 'cook-setup': return <CookSetup />;
    case 'recipe': return <Recipe params={p} />;
    case 'shopping': return <Shopping />;
    case 'prep': return <Prep />;
    case 'gatherings': return <Gatherings />;
    case 'gifts': return <Gifts params={p} />;
    case 'gathering-new': return <GatheringNew params={p} />;
    case 'gathering': return <GatheringHost params={p} />;
    case 'water-test': return <WaterTest params={p} />;
    case 'oil-guide': return <OilGuide />;
    case 'profile': return <Profile onSignOut={onSignOut} />;
    case 'review': return <Review />;
    default: return <Retired onHome={() => nav.switchTab('home')} />;
  }
}

function Main({ onSignOut }) {
  const nav = useNav();
  const openProfile = () => nav.push('profile');
  return (
    <>
      <div className="screens">
        {TABS.map((tab) =>
          nav.stacks[tab].map((route, i) => {
            const isTop = tab === nav.tab && i === nav.stacks[tab].length - 1;
            const full = FULL.has(route.name);
            const anim = isTop && i > 0 ? (nav.dir === 'push' ? ' anim-push' : nav.dir === 'pop' ? ' anim-pop' : '') : '';
            return (
              <div key={route.key} className={'screen' + (full ? ' is-full' : ' has-tabbar') + anim} hidden={!isTop}>
                <div className="screen-scroll">
                  <ScreenFor route={route} onSignOut={onSignOut} openProfile={openProfile} root={false} />
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
  // On desktop, the wide kitchen photo becomes the page backdrop while the entrance is open.
  useEffect(() => { document.body.classList.toggle('is-entry', nav.atEntry && !shared); }, [nav.atEntry, shared]);

  const signOut = () => { update((d) => { d.session = null; }); nav.resetAll(); };
  const closeShared = () => { history.replaceState(null, '', location.pathname); setShared(null); };

  // Guests open their page with no account and no Home number.
  if (shared?.kind === 'guest') return <div className="guest-wrap"><Guest key={shared.publicId + (shared.token || '')} publicId={shared.publicId} token={shared.token} onLeave={closeShared} /></div>;
  if (shared?.kind === 'retired') return <div className="guest-wrap"><Retired onHome={() => { closeShared(); nav.openSet(); nav.resetAll(); }} /></div>;
  if (nav.atEntry) return <Entry onOpenSet={nav.openSet} />;
  if (!state.session) {
    return (
      <Auth
        key="auth"
        onAllProducts={nav.allProducts}
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
  ['entry', 'Yndarena entrance and products'],
  ['new', 'Sign up as a new Home'],
  ['returning', 'Sign in as a returning Home'],
  ['cook', 'Plan the week’s dinners'],
  ['care', 'Care plan and water test'],
  ['oil', 'How to oil, step by step'],
  ['plan', 'Plan a gathering'],
  ['host', 'A gathering, as the host'],
  ['guest', 'The same gathering, as a guest'],
  ['gifts', 'Gift dates'],
];

function SidePanels({ children, setShared }) {
  const { state, update, resetDemo } = useStore();
  const nav = useNav();
  const toast = useToast();

  const ensureSession = () => {
    if (!state.session || !state.users[state.session.email]?.welcomed) {
      update((d) => { d.session = { email: RETURNING_EMAIL }; });
      toast('Signed in as the demo Home No. 0045.');
    }
  };
  const run = (k) => {
    setShared(null);
    if (k === 'entry') { nav.allProducts(); return; }
    nav.openSet();
    if (k === 'new') { update((d) => { d.session = null; }); nav.resetAll(); return; }
    if (k === 'returning') { update((d) => { d.session = { email: RETURNING_EMAIL }; }); nav.resetAll(); toast('Welcome back to Home No. 0045.'); return; }
    ensureSession();
    nav.resetAll();
    setTimeout(async () => {
      if (k === 'cook') nav.switchTab('cook');
      if (k === 'care') nav.switchTab('home', { name: 'care', params: {} });
      if (k === 'oil') nav.switchTab('home', { name: 'oil-guide', params: {} });
      if (k === 'review') nav.switchTab('home', { name: 'review', params: {} });
      if (k === 'gifts') nav.switchTab('gifts');
      if (k === 'plan') nav.switchTab('gatherings', { name: 'gathering-new', params: {} });
      if (k === 'host' || k === 'guest') {
        const g = await demoGathering(RETURNING_EMAIL);
        if (k === 'host') nav.switchTab('gatherings', { name: 'gathering', params: { id: g.id } });
        else { history.replaceState(null, '', '#/g/' + g.publicId); setShared(parseHash()); }
      }
    }, 30);
  };

  return (
    <div className="stage">
      <div className="entry-backdrop" style={{ backgroundImage: `url(${kitchenDesktop})` }} aria-hidden="true" />
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
          Accounts, codes and Home numbers, reminders and emails, and the shared gathering lists. Everything is saved in this browser only: other phones don’t see it.
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
            <li key={k}><button onClick={() => run(k)}><span className="num">{String(i + 1).padStart(2, '0')}</span>{label}<Icon name="chevron" size={16} /></button></li>
          ))}
        </ul>
        <div className="row" style={{ marginTop: 18, gap: 10 }}>
          <button className="link" onClick={() => run('review')}>Review panel</button>
          <ConfirmTap onConfirm={() => { resetDemo(); try { localStorage.removeItem('ynd-shared-sim-v1'); localStorage.removeItem('ynd-guest-links-v1'); } catch (e) { /* ignore */ } nav.resetAll(); setShared(null); toast('Preview reset.'); }} render={(armed, tap) => <button className="link" onClick={tap}>{armed ? 'Tap again to clear everything' : 'Reset demo'}</button>} />
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
