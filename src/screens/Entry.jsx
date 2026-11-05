import { useEffect, useRef, useState } from 'react';
import { useStore } from '../store.jsx';
import { Sprig } from '../ui.jsx';
import { WORDMARK } from '../assets.js';
import kitchenMobile from '../media/kitchen/yndarena-kitchen-mobile.webp';
import kitchenDesktop from '../media/kitchen/yndarena-kitchen-desktop.webp';
import lidTop from '../media/package/yndarena-box-lid-top.webp';
import lidInside from '../media/package/yndarena-box-lid-inside.webp';
import flapFront from '../media/package/yndarena-box-flap-front.webp';

// Yndarena's general entrance (owner, 2026-11-05): the real gift box on the kitchen counter, and one button.
// The box is built in 3D from the packaging artwork (Packaging_Yndarena.pdf, Illustrator, Oct 2026): lid 44 × 27.7 cm,
// 10 cm tall, magnetic front flap, story printed inside the lid, dark foam insert with the large cavity and the
// narrow slot on the right, as in the owner's unboxing video. Nothing on it is invented: every print is the
// supplied artwork, and the inside is left as it is in the video (no boards are drawn inside).
// “Open your set” opens the box like the real one: the flap lets go, the lid swings back on its hinge, the camera
// comes closer to the story inside the lid, then dives into the box and the app appears. A tap skips it.
const TIMES = { lift: 260, open: 1500, read: 1500, dive: 650 };

export default function Entry({ onOpenSet }) {
  const { state, homeNo } = useStore();
  const signedIn = !!state.session;
  const [phase, setPhase] = useState('closed');
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
    at(TIMES.lift + TIMES.open + TIMES.read, () => setPhase('dive'));
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
          <span className="pkg-foam">
            <span className="pkg-cavity" />
            <span className="pkg-slot" />
          </span>
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
