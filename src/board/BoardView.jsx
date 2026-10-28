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

// Places alongside-the-board items in a row under the board, at the same scale.
function alongsideSlots(items) {
  const out = {};
  let x = 0, rowH = 0, y = BOARD.h + BAND_GAP + 12;
  for (const it of items) {
    const l = groupLayout(it);
    if (x > 0 && x + l.w > BOARD.w) { x = 0; y += rowH + 8; rowH = 0; }
    out[it.uid] = { x: x + l.w / 2, y: y + l.h / 2 };
    x += l.w + 10; rowH = Math.max(rowH, l.h);
  }
  return { slots: out, bottom: items.length ? y + rowH : BOARD.h };
}

export default function BoardView({ boardId, items, uid, selected, layerState, onItemDown, onBgDown, svgRef, className = '', label, flag }) {
  const board = BOARDS[boardId] || BOARDS['cheese-bread'];
  // SVG defs ids must be unique per instance: hidden screens keep their own copies mounted.
  uid = 'b' + useId().replace(/[^a-zA-Z0-9]/g, '');
  const along = items.filter((i) => i.alongside && ITEMS[i.type]);
  const { slots, bottom } = alongsideSlots(along);
  const H = bottom + PAD;
  return (
    <svg
      ref={svgRef}
      className={'board-svg ' + className}
      viewBox={`${-PAD} ${-PAD} ${BOARD.w + PAD * 2} ${H + PAD}`}
      role="img"
      aria-label={label || `${board.name} board, 33 × 24 cm`}
      onPointerDown={onBgDown}
    >
      <Surface board={board} uid={uid} />
      {along.length > 0 && (
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
    </svg>
  );
}
