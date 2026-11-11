import { useEffect, useRef } from 'react';
import { WORDMARK } from '../assets.js';
import sprigSrc from '../media/package/yndarena-rosemary-sprig.webp';

// The intro (owner, 2026-11-11): no box and no button. On the app's own paper, rosemary leaps toward the screen
// while the wordmark settles softly in the middle; then the app shows through. A tap skips it.
// The rosemary is the illustration from the packaging (Packaging_Yndarena.pdf).
const TOTAL = 3900;

// [start x %, start y %, rotation°, length as % of screen height, delay ms]: a loose bunch around the middle.
const SPRIGS = [
  [46, 52, -30, 22, 0], [54, 50, 28, 24, 80], [50, 46, 4, 20, 160], [42, 58, -62, 18, 220], [58, 58, 64, 19, 260],
  [48, 60, 178, 17, 320], [53, 42, -8, 16, 380], [40, 47, -96, 17, 430], [61, 47, 98, 18, 470], [45, 40, -150, 15, 520],
  [56, 38, 150, 15, 560], [38, 54, -120, 14, 600], [63, 55, 122, 14, 640], [50, 56, 200, 16, 690],
];

export default function Entry({ onOpenSet }) {
  const layer = useRef(null);
  const done = useRef(false);
  const finish = () => { if (done.current) return; done.current = true; onOpenSet(); };

  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const el = layer.current;
    if (!reduce && el) {
      const { width: W, height: H } = el.getBoundingClientRect();
      el.querySelectorAll('.fly').forEach((img, i) => {
        const [x, y, rot, len, delay] = SPRIGS[i];
        const rnd = (a, b) => a + ((Math.sin((i + 1) * 97.13) + 1) / 2) * (b - a); // stable per sprig
        const sx = (x / 100) * W, sy = (y / 100) * H;
        const dx = (sx - W / 2) * rnd(5, 8) + rnd(-40, 40);
        const dy = (sy - H / 2) * rnd(4, 7) - H * rnd(0.05, 0.25);
        const s = rnd(2.6, 4), turn = rnd(-40, 40);
        img.style.height = `${(len / 100) * H}px`;
        img.style.left = sx + 'px'; img.style.top = sy + 'px';
        img.animate([
          { transform: `translate(-50%, -50%) rotate(${rot}deg) scale(.25)`, opacity: 0, filter: 'blur(0px)' },
          { transform: `translate(calc(-50% + ${dx * 0.08}px), calc(-50% + ${dy * 0.08}px)) rotate(${rot + turn * 0.1}deg) scale(.7)`, opacity: 1, filter: 'blur(0px)', offset: 0.2 },
          { transform: `translate(calc(-50% + ${dx * 0.55}px), calc(-50% + ${dy * 0.55}px)) rotate(${rot + turn * 0.6}deg) scale(${1 + (s - 1) * 0.5})`, opacity: 0.9, filter: 'blur(1px)', offset: 0.62 },
          { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) rotate(${rot + turn}deg) scale(${s})`, opacity: 0, filter: 'blur(4px)' },
        ], { duration: rnd(2500, 3000), delay, easing: 'cubic-bezier(.33, 0, .2, 1)', fill: 'both' });
      });
    }
    const t = setTimeout(finish, reduce ? 900 : TOTAL);
    return () => clearTimeout(t);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="intro" onClick={finish} role="button" tabIndex={0} aria-label="Yndarena. Tap to continue" onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') finish(); }}>
      <h1 className="sr-only">Yndarena</h1>
      <div className="intro-fly" ref={layer} aria-hidden="true">
        {SPRIGS.map((_, i) => <img key={i} className="fly" src={sprigSrc} alt="" draggable="false" />)}
      </div>
      <img className="intro-mark" src={WORDMARK} alt="" aria-hidden="true" />
      <div className="intro-skip" aria-hidden="true">Tap to skip</div>
    </div>
  );
}
