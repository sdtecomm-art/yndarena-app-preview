import { useId, useMemo } from 'react';
import { BOARDS, BOARD_W, BOARD_H, ITEMS, sizeFor } from '../data/catalog.js';
import { ItemVisual, rng } from './art.jsx';
import { MEDIA, BOARD_SURFACES, photoPiece } from '../data/media.js';
import { ROSEMARY_PATH } from './rosemaryPath.js';

const PAD = 18;

function WoodGrain({ board, uid }) {
  const surface = MEDIA[BOARD_SURFACES[board.id]] || null;
  const lines = useMemo(() => {
    const rand = rng(board.id);
    return Array.from({ length: 22 }, (_, i) => {
      const y = 8 + i * 18 + rand() * 8;
      const a = 4 + rand() * 9, b = 4 + rand() * 9;
      return `M-10 ${y} C 150 ${y - a}, 300 ${y + b}, 450 ${y - a / 2} S 640 ${y + b / 2}, 640 ${y}`;
    });
  }, [board.id]);
  return (
    <>
      <defs>
        <linearGradient id={`wood-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={board.tone[0]} />
          <stop offset="1" stopColor={board.tone[1]} />
        </linearGradient>
        <radialGradient id={`light-${uid}`} cx="0.28" cy="0.18" r="0.9">
          <stop offset="0" stopColor="#fff8ee" stopOpacity=".28" />
          <stop offset="0.6" stopColor="#fff8ee" stopOpacity="0" />
        </radialGradient>
        <clipPath id={`clip-${uid}`}>
          <rect x="0" y="0" width={BOARD_W} height={BOARD_H} rx="22" />
        </clipPath>
        <filter id={`sh-${uid}`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="1.5" dy="3" stdDeviation="2.4" floodColor="#2c1d12" floodOpacity=".28" />
        </filter>
        <filter id={`psh-${uid}`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="1" dy="2" stdDeviation="1.6" floodColor="#2c1d12" floodOpacity=".22" />
        </filter>
        <filter id={`bsh-${uid}`} x="-10%" y="-10%" width="120%" height="130%">
          <feDropShadow dx="0" dy="8" stdDeviation="9" floodColor="#3b2a1e" floodOpacity=".22" />
        </filter>
      </defs>
      <rect x="0" y="0" width={BOARD_W} height={BOARD_H} rx="22" fill={`url(#wood-${uid})`} filter={`url(#bsh-${uid})`} />
      <g clipPath={`url(#clip-${uid})`}>
        {surface ? (
          <>
            {/* Generic texture inside the existing outline, tinted toward this board's wood. */}
            <image href={surface.src} x="0" y={(BOARD_H - BOARD_W) / 2} width={BOARD_W} height={BOARD_W} preserveAspectRatio="xMidYMid slice" />
            <rect x="0" y="0" width={BOARD_W} height={BOARD_H} fill={`url(#wood-${uid})`} opacity={board.tint} />
          </>
        ) : lines.map((d, i) => (
          <path key={i} d={d} fill="none" stroke={board.grain} strokeWidth={i % 4 ? 0.8 : 1.6} opacity={i % 3 ? 0.18 : 0.3} />
        ))}
        <rect x="0" y="0" width={BOARD_W} height={BOARD_H} fill={`url(#light-${uid})`} />
        <g transform={`translate(${BOARD_W - 46} ${BOARD_H - 92}) scale(0.13)`} opacity=".32">
          <path d={ROSEMARY_PATH} fill={board.grain} fillRule="evenodd" />
        </g>
      </g>
      <rect x="1" y="1" width={BOARD_W - 2} height={BOARD_H - 2} rx="21" fill="none" stroke="#fff" strokeOpacity=".12" strokeWidth="2" />
    </>
  );
}

export default function BoardView({
  boardId,
  items,
  uid = 'b',
  selected,
  layerState,
  onItemDown,
  onBgDown,
  svgRef,
  className = '',
  label,
}) {
  const board = BOARDS[boardId] || BOARDS['cheese-bread'];
  // SVG defs ids must be unique per instance: hidden screens keep their own copies mounted.
  uid = 'b' + useId().replace(/[^a-zA-Z0-9]/g, '');
  return (
    <svg
      ref={svgRef}
      className={'board-svg ' + className}
      viewBox={`${-PAD} ${-PAD} ${BOARD_W + PAD * 2} ${BOARD_H + PAD * 2}`}
      role="img"
      aria-label={label || `${board.name} board illustration`}
      onPointerDown={onBgDown}
    >
      <WoodGrain board={board} uid={uid} />
      {items.map((p) => {
        const it = ITEMS[p.type];
        if (!it) return null;
        const style = p.style || it.styles[0].id;
        const [w, h] = sizeFor(p.type, p.qty, style);
        const isPhoto = !!photoPiece(p.type, style);
        const st = layerState ? layerState[p.uid] : 'done';
        if (st === 'future')
          return (
            <g key={p.uid} transform={`translate(${p.x} ${p.y}) rotate(${p.r || 0})`}>
              <rect x={-w / 2} y={-h / 2} width={w} height={h} rx="12" fill="#fff" fillOpacity=".08" stroke="#fff" strokeOpacity=".45" strokeDasharray="4 5" />
            </g>
          );
        return (
          <g
            key={p.uid}
            className={'board-item' + (st === 'current' ? ' is-current' : '') + (selected === p.uid ? ' is-selected' : '')}
            transform={`translate(${p.x} ${p.y}) rotate(${p.r || 0})`}
            onPointerDown={onItemDown ? (e) => onItemDown(p.uid, e) : undefined}
            style={onItemDown ? { cursor: 'grab' } : undefined}
          >
            <rect x={-w / 2 - 6} y={-h / 2 - 6} width={w + 12} height={h + 12} fill="transparent" />
            <g filter={`url(#${isPhoto ? 'psh' : 'sh'}-${uid})`}>
              <ItemVisual type={p.type} it={it} w={w} h={h} style={style} qty={p.qty} seed={p.uid} />
            </g>
            {st === 'current' && (
              <rect className="pulse" x={-w / 2 - 7} y={-h / 2 - 7} width={w + 14} height={h + 14} rx="14" fill="none" stroke="#faf5ef" strokeWidth="2.5" strokeDasharray="6 5" />
            )}
            {selected === p.uid && (
              <rect x={-w / 2 - 8} y={-h / 2 - 8} width={w + 16} height={h + 16} rx="14" fill="none" stroke="#faf5ef" strokeWidth="2.5" strokeDasharray="7 5" />
            )}
          </g>
        );
      })}
    </svg>
  );
}
