import { useId } from 'react';
import { BOARDS, ITEMS } from '../data/catalog.js';
import { ItemVisual } from './art.jsx';
import { MEDIA, BOARD_SURFACES, photoPiece } from '../data/media.js';
import { BOARD, GROOVE, serviceZone } from '../data/physical.js';
import { groupLayout } from './geometry.js';
import { ROSEMARY_PATH } from './rosemaryPath.js';

// Everything here is in millimetres: the board is 330 × 240, drawn at its real proportion.
const PAD = 10;
const BAND_GAP = 14;

// Concave-cornered outline of the juice groove (estimated position, see physical.js).
export function groovePath(off = 0) {
  const z = serviceZone(), R = z.corner;
  const x0 = z.x - off, y0 = z.y - off, x1 = z.x + z.w + off, y1 = z.y + z.h + off, r = R + off;
  return `M${x0 + r} ${y0} L${x1 - r} ${y0} A${r} ${r} 0 0 0 ${x1} ${y0 + r} L${x1} ${y1 - r} A${r} ${r} 0 0 0 ${x1 - r} ${y1} L${x0 + r} ${y1} A${r} ${r} 0 0 0 ${x0} ${y1 - r} L${x0} ${y0 + r} A${r} ${r} 0 0 0 ${x0 + r} ${y0} Z`;
}

function Surface({ board, uid }) {
  const surface = MEDIA[BOARD_SURFACES[board.id]] || null;
  const W = BOARD.w, H = BOARD.h, rx = BOARD.cornerRadius.mm;
  return (
    <>
      <defs>
        <linearGradient id={`wood-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={board.tone[0]} />
          <stop offset="1" stopColor={board.tone[1]} />
        </linearGradient>
        <radialGradient id={`light-${uid}`} cx="0.28" cy="0.18" r="0.9">
          <stop offset="0" stopColor="#fff8ee" stopOpacity=".26" />
          <stop offset="0.6" stopColor="#fff8ee" stopOpacity="0" />
        </radialGradient>
        <clipPath id={`clip-${uid}`}><rect x="0" y="0" width={W} height={H} rx={rx} /></clipPath>
        <filter id={`sh-${uid}`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx=".8" dy="1.6" stdDeviation="1.3" floodColor="#2c1d12" floodOpacity=".28" />
        </filter>
        <filter id={`psh-${uid}`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx=".6" dy="1.1" stdDeviation=".9" floodColor="#2c1d12" floodOpacity=".24" />
        </filter>
        <filter id={`bsh-${uid}`} x="-10%" y="-10%" width="120%" height="130%">
          <feDropShadow dx="0" dy="4.5" stdDeviation="5" floodColor="#3b2a1e" floodOpacity=".22" />
        </filter>
      </defs>
      <rect x="0" y="0" width={W} height={H} rx={rx} fill={`url(#wood-${uid})`} filter={`url(#bsh-${uid})`} />
      <g clipPath={`url(#clip-${uid})`}>
        {surface && (
          <>
            {/* Generic texture inside the board outline, tinted toward this board's wood. */}
            <image href={surface.src} x="0" y={(H - W) / 2} width={W} height={W} preserveAspectRatio="xMidYMid slice" />
            <rect x="0" y="0" width={W} height={H} fill={`url(#wood-${uid})`} opacity={board.tint} />
          </>
        )}
        <rect x="0" y="0" width={W} height={H} fill={`url(#light-${uid})`} />
        {/* Juice groove: a soft channel with a lit lower lip. Position estimated. */}
        <path d={groovePath(GROOVE.width / 2)} fill="none" stroke={board.grain} strokeWidth={GROOVE.width} strokeOpacity=".5" />
        <path d={groovePath(GROOVE.width / 2 - 1.4)} fill="none" stroke="#fff6ea" strokeWidth=".8" strokeOpacity=".28" />
        <g transform={`translate(${W - GROOVE.inset - 22} ${H - GROOVE.inset - 46}) scale(0.066)`} opacity=".3">
          <path d={ROSEMARY_PATH} fill={board.grain} fillRule="evenodd" />
        </g>
      </g>
      <rect x=".6" y=".6" width={W - 1.2} height={H - 1.2} rx={rx - 0.6} fill="none" stroke="#fff" strokeOpacity=".12" strokeWidth="1.1" />
    </>
  );
}

// Loose food served next to the board sits on a plate; food already in its own bowl or dish needs none.
const plateOf = (l) => (l.container ? 0 : Math.max(l.w, l.h) + 16);

// Places alongside-the-board items in a row under the board, at the same scale, centred like a table setting.
function alongsideSlots(items) {
  const out = {};
  const rows = [[]];
  let x = 0;
  for (const it of items) {
    const l = groupLayout(it), d = plateOf(l), w = d || l.w, h = d || l.h;
    if (x > 0 && x + w > BOARD.w) { rows.push([]); x = 0; }
    rows[rows.length - 1].push({ it, w, h, d });
    x += w + 10;
  }
  let y = BOARD.h + BAND_GAP + 12;
  for (const row of rows) {
    if (!row.length) continue;
    const total = row.reduce((a, r) => a + r.w, 0) + (row.length - 1) * 10, rowH = Math.max(...row.map((r) => r.h));
    let cx = (BOARD.w - total) / 2;
    for (const r of row) { out[r.it.uid] = { x: cx + r.w / 2, y: y + rowH / 2, plate: r.d }; cx += r.w + 10; }
    y += rowH + 8;
  }
  return { slots: out, bottom: items.length ? y - 8 : BOARD.h };
}

function Plate({ d, uid }) {
  return (
    <g filter={`url(#bsh-${uid})`}>
      <circle r={d / 2} fill={`url(#plate-${uid})`} />
      <circle r={d / 2 - d * 0.12} fill="none" stroke="#e7dfd4" strokeWidth=".8" />
    </g>
  );
}

// Layout aids: what Photo leaves out. Numbers match the list under the board.
function Aids({ items, slots }) {
  return (
    <g className="layout-aids" style={{ pointerEvents: 'none' }}>
      <path d={groovePath(-1.5)} fill="none" stroke="#fff6ea" strokeOpacity=".55" strokeWidth=".7" strokeDasharray="2.5 2.5" />
      <g fontSize="7" fill="#786350" letterSpacing=".06em">
        <line x1="0" x2={BOARD.w} y1={-5} y2={-5} stroke="#786350" strokeOpacity=".45" strokeWidth=".5" />
        <text x={BOARD.w / 2} y={-7.5} textAnchor="middle">33 cm</text>
        <text x={BOARD.w + 6} y={BOARD.h / 2} textAnchor="middle" transform={`rotate(90 ${BOARD.w + 6} ${BOARD.h / 2})`}>24 cm</text>
      </g>
      {items.map((p, i) => {
        const c = p.alongside ? slots[p.uid] : { x: p.x, y: p.y };
        if (!c) return null;
        // The number sits on the upper left of the group, clear of its centre (and of any pending label).
        const l = groupLayout(p), r = ((p.alongside ? 0 : p.r || 0) * Math.PI) / 180;
        const bw = Math.abs(l.w * Math.cos(r)) + Math.abs(l.h * Math.sin(r)), bh = Math.abs(l.w * Math.sin(r)) + Math.abs(l.h * Math.cos(r));
        const k = l.container ? 0.36 : 0.5;
        const pos = { x: c.x - bw * k + 9, y: c.y - bh * k + 9 };
        return (
          <g key={p.uid} transform={`translate(${pos.x} ${pos.y})`}>
            <circle r="7.5" fill="#231f20" fillOpacity=".86" stroke="#faf5ef" strokeWidth="1" />
            <text y="2.6" textAnchor="middle" fontSize="7.6" fill="#faf5ef" fontFamily="var(--sans)">{i + 1}</text>
          </g>
        );
      })}
    </g>
  );
}

// scene: 'photo' draws the clean table scene; 'layout' draws the same scene with aids to reproduce it.
// Both use the same viewBox, so switching never changes the height. Without scene: the working view (Designer etc.).
export default function BoardView({ boardId, items, uid, selected, layerState, onItemDown, onBgDown, svgRef, className = '', label, flag, scene }) {
  const board = BOARDS[boardId] || BOARDS['cheese-bread'];
  // SVG defs ids must be unique per instance: hidden screens keep their own copies mounted.
  uid = 'b' + useId().replace(/[^a-zA-Z0-9]/g, '');
  const along = items.filter((i) => i.alongside && ITEMS[i.type]);
  const { slots, bottom } = alongsideSlots(along);
  const H = bottom + PAD;
  const top = scene ? PAD + 6 : PAD;
  return (
    <svg
      ref={svgRef}
      className={'board-svg ' + className + (scene ? ' is-scene is-' + scene : '')}
      viewBox={`${-PAD} ${-top} ${BOARD.w + PAD * 2} ${H + top}`}
      role="img"
      aria-label={label || `${board.name} board, 33 × 24 cm`}
      onPointerDown={onBgDown}
    >
      <defs>
        <radialGradient id={`plate-${uid}`} cx=".4" cy=".35" r=".75">
          <stop offset="0" stopColor="#fffdf9" />
          <stop offset=".8" stopColor="#f3eee6" />
          <stop offset="1" stopColor="#e6ded2" />
        </radialGradient>
      </defs>
      <Surface board={board} uid={uid} />
      {along.map((p) => slots[p.uid]?.plate ? <g key={'pl' + p.uid} transform={`translate(${slots[p.uid].x} ${slots[p.uid].y})`}><Plate d={slots[p.uid].plate} uid={uid} /></g> : null)}
      {along.length > 0 && scene !== 'photo' && (
        <g className="alongside-band">
          <line x1="0" x2={BOARD.w} y1={BOARD.h + BAND_GAP / 2 + 2} y2={BOARD.h + BAND_GAP / 2 + 2} stroke="#8a7c6c" strokeOpacity=".35" strokeWidth=".6" strokeDasharray="2 2" />
          <text x="0" y={BOARD.h + BAND_GAP + 6} className="band-label">ALONGSIDE</text>
        </g>
      )}
      {items.map((p) => {
        const it = ITEMS[p.type];
        if (!it) return null;
        const style = p.style || it.styles[0].id;
        const l = groupLayout(p);
        const w = l.w, h = l.h;
        const isPhoto = !!photoPiece(p.type, style);
        const pos = p.alongside ? { ...slots[p.uid], r: 0 } : { x: p.x, y: p.y, r: p.r || 0 };
        const st = layerState ? layerState[p.uid] : 'done';
        if (st === 'future')
          return (
            <g key={p.uid} transform={`translate(${pos.x} ${pos.y}) rotate(${pos.r})`}>
              <rect x={-w / 2} y={-h / 2} width={w} height={h} rx="6" fill="#fff" fillOpacity=".08" stroke="#fff" strokeOpacity=".45" strokeWidth=".6" strokeDasharray="2.2 2.8" />
            </g>
          );
        const flagged = flag && flag.has(p.uid);
        return (
          <g
            key={p.uid}
            className={'board-item' + (st === 'current' ? ' is-current' : '') + (selected === p.uid ? ' is-selected' : '') + (p.alongside ? ' is-alongside' : '')}
            transform={`translate(${pos.x} ${pos.y}) rotate(${pos.r})`}
            onPointerDown={onItemDown ? (e) => onItemDown(p.uid, e) : undefined}
            style={onItemDown ? { cursor: p.alongside ? 'pointer' : 'grab' } : undefined}
          >
            <rect x={-w / 2 - 3} y={-h / 2 - 3} width={w + 6} height={h + 6} fill="transparent" />
            <g filter={`url(#${isPhoto ? 'psh' : 'sh'}-${uid})`}>
              <ItemVisual type={p.type} it={it} w={w} h={h} style={style} qty={p.qty} seed={p.uid} item={p} />
            </g>
            {st === 'current' && <rect className="pulse" x={-w / 2 - 4} y={-h / 2 - 4} width={w + 8} height={h + 8} rx="7" fill="none" stroke="#faf5ef" strokeWidth="1.4" strokeDasharray="3.3 2.8" />}
            {flagged && <rect x={-w / 2 - 3} y={-h / 2 - 3} width={w + 6} height={h + 6} rx="6" fill="none" stroke="#e8b04a" strokeWidth="1.2" strokeDasharray="2 2" />}
            {selected === p.uid && <rect x={-w / 2 - 4.5} y={-h / 2 - 4.5} width={w + 9} height={h + 9} rx="7" fill="none" stroke="#faf5ef" strokeWidth="1.4" strokeDasharray="3.8 2.8" />}
          </g>
        );
      })}
      {scene === 'layout' && <Aids items={items.filter((i) => ITEMS[i.type])} slots={slots} />}
    </svg>
  );
}
