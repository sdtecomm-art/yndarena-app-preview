import { useEffect, useRef, useState } from 'react';
import { useStore } from '../store.jsx';
import { Sprig } from '../ui.jsx';
import { WORDMARK } from '../assets.js';
import kitchenMobile from '../media/kitchen/yndarena-kitchen-mobile.webp';
import kitchenDesktop from '../media/kitchen/yndarena-kitchen-desktop.webp';
import lidTop from '../media/package/yndarena-box-lid-top.webp';
import lidInside from '../media/package/yndarena-box-lid-inside.webp';
import flapFront from '../media/package/yndarena-box-flap-front.webp';
import sprigSrc from '../media/package/yndarena-rosemary-sprig.webp';

// Yndarena's general entrance: the real gift box on the kitchen counter, and one button.
// The box is built in 3D from the packaging artwork (Packaging_Yndarena.pdf, Illustrator, Oct 2026): lid 44 × 27.7 cm,
// 10 cm tall, magnetic front flap, story printed inside the lid. Every print is the supplied artwork.
// Inside (owner, 2026-11-10): no foam and no single product, because the same box carries every Yndarena product.
// It is filled with rosemary, the brand's symbol, drawn from the rosemary illustration on the packaging.
// “Open your set”: the flap lets go, the lid swings back on its hinge, the rosemary leaps out of the box toward
// the screen, and a circle of the app's own paper opens behind it into the app. A tap skips it.
// Slow on purpose (owner, 2026-11-10): the opening is the brand's moment. A tap anywhere skips it.
const TIMES = { lift: 450, open: 2300, story: 6200, hold: 700, burst: 3500 };
const STORY_KEY = 'ynd-story-seen';
// The story printed inside the lid (Packaging_Yndarena.pdf, page 4), shortened: its sentences are verbatim, three are left out.
const STORY = [
  'Yndarena was a woman we still hold dear. She was our grandmother’s companion in the kitchen.',
  'She taught us that rosemary is a symbol of love and memory.',
  'For her, cooking was an act of love. The kind that leaves its mark on memory.',
  'In that same spirit, this brand was born, and it carries her name.',
  'We believe that what is made with love endures. Like Yndarena and her rosemary.',
];

export default function Entry({ onOpenSet }) {
  const { state, homeNo } = useStore();
  const signedIn = !!state.session;
  const [phase, setPhase] = useState('closed');
  const [origin, setOrigin] = useState(null); // where the box sits on screen: the reveal opens from there
  const timers = useRef([]);
  const flyRef = useRef(null);
  const done = useRef(false);

  const finish = () => { if (done.current) return; done.current = true; timers.current.forEach(clearTimeout); onOpenSet(); };
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  // Each sprig in the box is measured where it lies, then a flat copy leaps from that exact spot toward the viewer.
  const burst = () => {
    const root = document.querySelector('.entry'), layer = flyRef.current;
    if (!root || !layer) return;
    const o = root.getBoundingClientRect();
    const box = document.querySelector('.pkg-inside')?.getBoundingClientRect();
    if (box) setOrigin({ x: box.left - o.left + box.width / 2, y: box.top - o.top + box.height / 2 });
    const cx = o.width / 2, cy = o.height * 0.42;
    document.querySelectorAll('.pkg .ros').forEach((el, i) => {
      const r = el.getBoundingClientRect();
      const x = r.left - o.left + r.width / 2, y = r.top - o.top + r.height / 2;
      const len = Math.max(r.width, r.height) * 0.92;
      const rot = +el.dataset.rot;
      const img = document.createElement('img');
      img.src = sprigSrc; img.alt = ''; img.className = 'fly';
      img.style.height = len + 'px'; img.style.left = x + 'px'; img.style.top = y + 'px';
      layer.appendChild(img);
      const rnd = (a, b) => a + ((Math.sin((i + 1) * 97.13) + 1) / 2) * (b - a); // stable per sprig
      const dx = (x - cx) * rnd(2.2, 3.6) + rnd(-60, 60);
      const dy = (y - cy) * rnd(1.6, 2.6) - o.height * rnd(0.25, 0.55);
      const s = rnd(2.6, 4.2), turn = rnd(-45, 45);
      img.animate([
        { transform: `translate(-50%, -50%) rotate(${rot}deg) scale(1)`, opacity: 1, filter: 'blur(0px)' },
        { transform: `translate(calc(-50% + ${dx * 0.12}px), calc(-50% + ${dy * 0.18 - 14}px)) rotate(${rot + turn * 0.15}deg) scale(1.12)`, opacity: 1, filter: 'blur(0px)', offset: 0.22 },
        { transform: `translate(calc(-50% + ${dx * 0.55}px), calc(-50% + ${dy * 0.55}px)) rotate(${rot + turn * 0.6}deg) scale(${1 + (s - 1) * 0.5})`, opacity: 0.95, filter: 'blur(0.5px)', offset: 0.62 },
        { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) rotate(${rot + turn}deg) scale(${s})`, opacity: 0, filter: 'blur(3px)' },
      ], { duration: rnd(2300, 2900), delay: rnd(0, 650), easing: 'cubic-bezier(.33, 0, .2, 1)', fill: 'both' });
    });
  };

  const open = () => {
    if (phase !== 'closed') { finish(); return; }
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { setPhase('open'); timers.current.push(setTimeout(finish, 450)); return; }
    const at = (ms, fn) => timers.current.push(setTimeout(fn, ms));
    // The story shows the first time on this device; after that the box opens straight to the rosemary.
    let seen = false; try { seen = localStorage.getItem(STORY_KEY) === '1'; localStorage.setItem(STORY_KEY, '1'); } catch (e) { /* private mode */ }
    const story = seen ? 0 : TIMES.story;
    setPhase('lift');
    at(TIMES.lift, () => setPhase('open'));
    if (story) at(TIMES.lift + TIMES.open, () => setPhase('story'));
    const b = TIMES.lift + TIMES.open + story + TIMES.hold;
    at(b, () => { burst(); setPhase('burst'); });
    at(b + TIMES.burst, finish);
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
      <div className="entry-reveal" aria-hidden="true" style={origin ? { '--rx': origin.x + 'px', '--ry': origin.y + 'px' } : undefined}>
        <img src={WORDMARK} alt="" />
      </div>
      <div className="entry-fly" ref={flyRef} aria-hidden="true" />
      <div className="entry-story" aria-hidden={phase !== 'story'}>
        <img className="es-sprig" src={sprigSrc} alt="" />
        {STORY.map((l, i) => <p key={i} style={{ transitionDelay: `${0.5 + i * 0.55}s` }}>{l}</p>)}
        <img className="es-mark" src={WORDMARK} alt="Yndarena" style={{ transitionDelay: `${0.6 + STORY.length * 0.55}s` }} />
      </div>
      {phase !== 'closed' && <div className="entry-skip" aria-hidden="true">Tap to skip</div>}
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
          <RosemaryBed />
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

// The rosemary bed: sprigs lying in the box, laid out by hand so the box looks full but not messy.
// [left %, top %, length as % of the box depth, rotation°]
const BED = [
  [12, 30, 92, 78], [24, 62, 88, 102], [36, 28, 95, 84], [47, 66, 90, 96], [58, 32, 92, 80], [70, 64, 94, 104], [82, 30, 88, 86], [90, 66, 84, 98],
  [18, 50, 86, 262], [41, 46, 90, 276], [63, 50, 88, 266], [86, 46, 86, 280],
  [6, 70, 70, 112], [30, 80, 76, 70], [52, 18, 74, 108], [75, 16, 72, 72], [95, 22, 66, 118], [66, 84, 72, 252],
];
function RosemaryBed() {
  return (
    <span className="pkg-bed">
      {BED.map(([x, y, l, r], i) => (
        <img key={i} className="ros" data-rot={r} src={sprigSrc} alt="" draggable="false"
          style={{ left: x + '%', top: y + '%', height: `calc(var(--d) * ${l / 100})`, transform: `translate(-50%, -50%) rotate(${r}deg)`, animationDelay: `${(i % 6) * -0.7}s` }} />
      ))}
    </span>
  );
}
