import { useEffect, useRef, useState } from 'react';
import { useStore } from '../store.jsx';
import { Sprig } from '../ui.jsx';
import { WORDMARK } from '../assets.js';
import kitchenMobile from '../media/kitchen/yndarena-kitchen-mobile.webp';
import kitchenDesktop from '../media/kitchen/yndarena-kitchen-desktop.webp';
import lidTop from '../media/package/yndarena-box-lid-top.webp';
import lidInside from '../media/package/yndarena-box-lid-inside.webp';
import flapFront from '../media/package/yndarena-box-flap-front.webp';
import { MEDIA } from '../data/media.js';

// Yndarena's general entrance (owner, 2026-11-05): the real gift box on the kitchen counter, and one button.
// The box is built in 3D from the packaging artwork (Packaging_Yndarena.pdf, Illustrator, Oct 2026): lid 44 × 27.7 cm,
// 10 cm tall, magnetic front flap, story printed inside the lid, dark foam insert with the large cavity and the
// narrow slot on the right, as in the owner's unboxing video. Nothing on it is invented: every print is the
// supplied artwork. Inside, instead of the foam insert, sits the app itself (owner, 2026-11-10): the same box
// carries every Yndarena product, so what it holds is the whole home: Home, Cook, Gifts and Gatherings.
// “Open your set” opens the box like the real one: the flap lets go, the lid swings back on its hinge, the camera
// comes closer, then dives into the Home screen inside the box, which grows into the real app. A tap skips it.
const TIMES = { lift: 260, open: 1500, read: 1400, dive: 900 };

export default function Entry({ onOpenSet }) {
  const { state, homeNo } = useStore();
  const signedIn = !!state.session;
  const [phase, setPhase] = useState('closed');
  const [grow, setGrow] = useState(null); // where the Home screen inside the box sits, to grow it from there
  const timers = useRef([]);
  const done = useRef(false);

  const finish = () => { if (done.current) return; done.current = true; timers.current.forEach(clearTimeout); onOpenSet(); };
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const open = () => {
    if (phase !== 'closed') { finish(); return; }
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { setPhase('open'); timers.current.push(setTimeout(finish, 450)); return; }
    const at = (ms, fn) => timers.current.push(setTimeout(fn, ms));
    setPhase('lift');
    at(TIMES.lift, () => setPhase('open'));
    at(TIMES.lift + TIMES.open + TIMES.read, () => {
      const el = document.querySelector('.pkg .mini.is-home'), root = document.querySelector('.entry');
      if (el && root) {
        const r = el.getBoundingClientRect(), o = root.getBoundingClientRect();
        setGrow({ x: r.left - o.left, y: r.top - o.top, s: r.width / o.width, go: false });
        requestAnimationFrame(() => requestAnimationFrame(() => setGrow((g) => g && { ...g, go: true })));
      }
      setPhase('dive');
    });
    at(TIMES.lift + TIMES.open + TIMES.read + TIMES.dive, finish);
  };

  return (
    <div className={`entry is-${phase}`} onClick={phase !== 'closed' ? finish : undefined}>
      <img className="entry-bg is-portrait" src={kitchenMobile} alt="" decoding="async" />
      <img className="entry-bg is-landscape" src={kitchenDesktop} alt="" decoding="async" />
      <div className="entry-scroll">
        <header className="entry-head">
          <img className="entry-wordmark" src={WORDMARK} alt="Yndarena, turning houses into homes" />
          {signedIn && <span className="entry-home"><Sprig />Home No. {homeNo}</span>}
        </header>
        <h1 className="sr-only">Yndarena</h1>

        <div className="entry-stage">
          <GiftBox onOpen={open} />
        </div>

        <div className="entry-foot">
          <button className="btn btn-primary btn-block entry-open" onClick={(e) => { e.stopPropagation(); open(); }}>
            <span>Open your set</span>
          </button>
        </div>
      </div>
      <div className="entry-veil" aria-hidden="true" />
      {grow && (
        <div className={'entry-grow' + (grow.go ? ' is-go' : '')} aria-hidden="true" style={{ '--gx': grow.x + 'px', '--gy': grow.y + 'px', '--gs': grow.s }}>
          <MiniHome className="is-big" />
        </div>
      )}
    </div>
  );
}

function GiftBox({ onOpen }) {
  return (
    <button className="pkg" onClick={(e) => { e.stopPropagation(); onOpen(); }} tabIndex={-1} aria-label="Yndarena gift box with the Cutting Board Set. Open your set">
      <span className="pkg-shadow" aria-hidden="true" />
      <span className="pkg-world" aria-hidden="true">
        {/* Base: four white walls and the foam insert */}
        <span className="pkg-face pkg-front" />
        <span className="pkg-face pkg-back" />
        <span className="pkg-face pkg-left" />
        <span className="pkg-face pkg-right" />
        <span className="pkg-face pkg-inside">
          <MiniApp />
        </span>
        {/* Lid: printed top, story inside, magnetic flap with the rosemary */}
        <span className="pkg-lid">
          <span className="pkg-lid-out"><img src={lidTop} alt="" draggable="false" /></span>
          <span className="pkg-lid-in"><img src={lidInside} alt="" draggable="false" /></span>
          <span className="pkg-flap">
            <span className="pkg-flap-out"><img src={flapFront} alt="" draggable="false" /></span>
            <span className="pkg-flap-in" />
          </span>
        </span>
      </span>
    </button>
  );
}

// The app, small, inside the box: four screens side by side. Decorative (aria-hidden on the parent): the real
// screens open right after. Copy matches the real app.
const MINI_TABS = ['Home', 'Cook', 'Gifts', 'Gatherings'];
function MiniTabs({ on }) {
  return <span className="mini-tabs">{MINI_TABS.map((t) => <span key={t} className={t === on ? 'on' : ''}><i />{t}</span>)}</span>;
}
function MiniHome({ className = '' }) {
  const spines = MEDIA['product-boards-spines'];
  return (
    <span className={'mini is-home ' + className}>
      <img className="mini-mark" src={WORDMARK} alt="" />
      <span className="mini-eyebrow">Your Yndarena care plan</span>
      <span className="mini-h">Made with love.<em>Cared for with ease.</em></span>
      <img className="mini-spines" src={spines.small} alt="" />
      <span className="mini-card"><b>Time for a quick water test.</b><span className="mini-btn">Start water test</span></span>
      <span className="mini-sec">Tonight</span>
      <span className="mini-row">Sheet-pan salmon with asparagus<small>25 min</small></span>
      <MiniTabs on="Home" />
    </span>
  );
}
function MiniApp() {
  return (
    <span className="pkg-app">
      <MiniHome />
      <span className="mini is-cook">
        <span className="mini-title">Cook</span>
        <span className="mini-sec">This week · 5 dinners</span>
        {[['Mon', 'Lemon chicken with potatoes'], ['Tue', 'Chickpea and spinach curry'], ['Wed', 'Fish tacos with lime slaw'], ['Thu', 'Spaghetti with meat sauce'], ['Fri', 'Pasta primavera']].map(([d, n]) => (
          <span key={d} className="mini-row"><small className="mini-day">{d}</small>{n}</span>
        ))}
        <span className="mini-btn is-block">Shopping list</span>
        <MiniTabs on="Cook" />
      </span>
      <span className="mini is-gifts">
        <span className="mini-title">Gifts</span>
        <span className="mini-video"><i /></span>
        <span className="mini-sec">Your dates</span>
        <span className="mini-row">Ana’s birthday<small>in 16 days</small></span>
        <span className="mini-row">Mom and Dad’s anniversary<small>in 54 days</small></span>
        <MiniTabs on="Gifts" />
      </span>
      <span className="mini is-gather">
        <span className="mini-title">Gatherings</span>
        <span className="mini-card"><b>BBQ at home</b><span>Saturday at 1 PM · 6 people</span><span className="mini-bar"><i /></span></span>
        <span className="mini-sec">Still needed</span>
        <span className="mini-row">Ice<small>2 bags</small></span>
        <span className="mini-row">Burger buns<small>Alex</small></span>
        <MiniTabs on="Gatherings" />
      </span>
    </span>
  );
}
