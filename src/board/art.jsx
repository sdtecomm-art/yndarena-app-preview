// Top-down illustrations for each ready-to-place group. Drawn in local
// coordinates centered on 0,0 within a w x h footprint.
import { ROSEMARY_PATH } from './rosemaryPath.js';
import { MEDIA, photoPiece } from '../data/media.js';
import { groupLayout, imageRect } from './geometry.js';

export function rng(seedStr) {
  let h = 1779033703 ^ seedStr.length;
  for (let i = 0; i < seedStr.length; i++) {
    h = Math.imul(h ^ seedStr.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  let a = h >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const shade = (hex, amt) => {
  const n = parseInt(hex.slice(1), 16);
  let r = (n >> 16) + amt, g = ((n >> 8) & 255) + amt, b = (n & 255) + amt;
  r = Math.max(0, Math.min(255, r)); g = Math.max(0, Math.min(255, g)); b = Math.max(0, Math.min(255, b));
  return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
};

function wedgePath(r, a0, a1) {
  const x0 = r * Math.cos(a0), y0 = r * Math.sin(a0);
  const x1 = r * Math.cos(a1), y1 = r * Math.sin(a1);
  return `M0 0 L${x0} ${y0} A${r} ${r} 0 0 1 ${x1} ${y1} Z`;
}

function Brie({ w, h, style, it }) {
  const R = Math.min(w, h) / 2 - 2;
  if (style === 'whole') {
    return (
      <g>
        <circle r={R} fill={it.rind} />
        <circle r={R - 4} fill={shade(it.rind, 10)} />
        <circle r={R - 7} fill="none" stroke={shade(it.rind, -14)} strokeWidth="0.8" strokeDasharray="2 3" opacity=".6" />
        <path d={wedgePath(R - 1, -0.45, 0.2)} fill={it.color} stroke={it.rind} strokeWidth="3.5" transform="translate(8 2)" />
      </g>
    );
  }
  const n = 6;
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const a0 = (i / n) * Math.PI * 2 + 0.06, a1 = ((i + 1) / n) * Math.PI * 2 - 0.06;
        const mid = (a0 + a1) / 2;
        const off = 3.5;
        return (
          <g key={i} transform={`translate(${Math.cos(mid) * off} ${Math.sin(mid) * off})`}>
            <path d={wedgePath(R - 3, a0, a1)} fill={it.color} />
            <path d={`M${(R - 3) * Math.cos(a0)} ${(R - 3) * Math.sin(a0)} A${R - 3} ${R - 3} 0 0 1 ${(R - 3) * Math.cos(a1)} ${(R - 3) * Math.sin(a1)}`} fill="none" stroke={it.rind} strokeWidth="5" strokeLinecap="round" />
          </g>
        );
      })}
    </g>
  );
}

function Hard({ w, h, style, it, rand }) {
  if (style === 'cubes') {
    const s = Math.max(12, Math.min(w, h) / 3.4);
    const cols = Math.max(2, Math.floor(w / (s * 1.05))), rows = Math.max(2, Math.floor(h / (s * 1.05)));
    const out = [];
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++) {
        if (rand() < 0.12) continue;
        const x = -w / 2 + s / 2 + c * (w - s) / Math.max(1, cols - 1) + (rand() - 0.5) * 4;
        const y = -h / 2 + s / 2 + r * (h - s) / Math.max(1, rows - 1) + (rand() - 0.5) * 4;
        const rot = (rand() - 0.5) * 40;
        out.push(
          <g key={r + '-' + c} transform={`translate(${x} ${y}) rotate(${rot})`}>
            <rect x={-s / 2} y={-s / 2} width={s} height={s} rx="2" fill={shade(it.color, -18)} />
            <rect x={-s / 2} y={-s / 2} width={s - 3} height={s - 3} rx="2" fill={it.color} />
          </g>,
        );
      }
    return <g>{out}</g>;
  }
  const rows = h > 64 ? 2 : 1;
  const th = (h / rows) * 0.86;
  const tw = th * 0.95;
  const n = Math.max(3, Math.floor((w - tw) / (tw * 0.55)) + 1);
  const out = [];
  for (let r = 0; r < rows; r++) {
    const ty = rows === 1 ? 0 : r === 0 ? -h / 4 : h / 4;
    for (let i = 0; i < n; i++) {
      const x = -w / 2 + tw / 2 + (i * (w - tw)) / Math.max(1, n - 1);
      const up = (i + r) % 2 === 0;
      const pts = up ? `${-tw / 2} ${th / 2} ${tw / 2} ${th / 2} 0 ${-th / 2}` : `${-tw / 2} ${-th / 2} ${tw / 2} ${-th / 2} 0 ${th / 2}`;
      out.push(
        <g key={r + '-' + i} transform={`translate(${x} ${ty}) rotate(${(rand() - 0.5) * 6})`}>
          <polygon points={pts} fill={shade(it.color, -24)} transform="translate(1 1.5)" />
          <polygon points={pts} fill={it.color} stroke={shade(it.color, 18)} strokeWidth=".8" strokeLinejoin="round" />
        </g>,
      );
    }
  }
  return <g>{out}</g>;
}

function Goat({ w, h, it }) {
  const n = 5, r = h / 2 - 2;
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const x = -w / 2 + r + (i * (w - 2 * r)) / (n - 1);
        return (
          <g key={i}>
            <circle cx={x} cy="0" r={r} fill={shade(it.color, -16)} />
            <circle cx={x - 1} cy="-1" r={r - 2.5} fill={it.color} />
          </g>
        );
      })}
    </g>
  );
}

function Prosciutto({ w, h, style, it, rand }) {
  if (style === 'ribbons') {
    const n = 3;
    return (
      <g>
        {Array.from({ length: n }, (_, i) => {
          const y = -h / 3 + (i * h) / 3 + 4;
          const amp = h / 7;
          const d = `M${-w / 2 + 6} ${y} C${-w / 4} ${y - amp * 2}, ${-w / 8} ${y + amp * 2}, 0 ${y} S${w / 4} ${y - amp * 2}, ${w / 2 - 6} ${y}`;
          return (
            <g key={i}>
              <path d={d} fill="none" stroke={it.fat} strokeWidth={h / 4.2} strokeLinecap="round" />
              <path d={d} fill="none" stroke={it.color} strokeWidth={h / 5.6} strokeLinecap="round" />
            </g>
          );
        })}
      </g>
    );
  }
  const count = w > 80 ? 3 : 2;
  const pts = count === 3
    ? [[-w * 0.22, -h * 0.18], [w * 0.22, -h * 0.12], [0, h * 0.22]]
    : [[-w * 0.2, 0], [w * 0.2, 0]];
  const r = Math.min(w, h) * (count === 3 ? 0.27 : 0.3);
  return (
    <g>
      {pts.map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y}) rotate(${rand() * 360})`}>
          <circle r={r} fill={it.color} />
          {[0.82, 0.58, 0.34].map((k, j) => (
            <path key={j} d={`M${-r * k} 0 A${r * k} ${r * k} 0 1 1 ${r * k * 0.4} ${r * k * 0.9}`} fill="none" stroke={it.fat} strokeWidth="2.2" opacity=".9" />
          ))}
          <circle r={r * 0.14} fill={shade(it.color, -30)} />
        </g>
      ))}
    </g>
  );
}

function Salami({ w, h, style, it, rand }) {
  const slice = (key, x, y, r) => (
    <g key={key} transform={`translate(${x} ${y})`}>
      <circle r={r} fill={shade(it.color, -30)} />
      <circle r={r - 2} fill={it.color} />
      {Array.from({ length: 7 }, (_, j) => (
        <circle key={j} cx={(rand() - 0.5) * r * 1.3} cy={(rand() - 0.5) * r * 1.3} r={1 + rand() * 1.4} fill="#f2d7cf" opacity=".85" />
      ))}
    </g>
  );
  if (style === 'folds') {
    const fans = Math.max(2, Math.round(w / 55));
    const out = [];
    for (let f = 0; f < fans; f++) {
      const cx = -w / 2 + (w / fans) * (f + 0.5);
      for (let k = 0; k < 3; k++) {
        const r = h * 0.42;
        out.push(
          <g key={f + '-' + k} transform={`translate(${cx + (k - 1) * 6} ${(k - 1) * 4}) rotate(${-30 + k * 30})`}>
            <path d={`M0 0 L${r} 0 A${r} ${r} 0 0 1 0 ${r} Z`} fill={shade(it.color, -24)} />
            <path d={`M1 1 L${r - 2} 1 A${r - 2} ${r - 2} 0 0 1 1 ${r - 2} Z`} fill={it.color} />
          </g>,
        );
      }
    }
    return <g>{out}</g>;
  }
  const n = Math.max(6, Math.round(w / 15));
  const r = h * 0.36;
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const t = i / (n - 1);
        const x = -w / 2 + r + t * (w - 2 * r);
        const y = Math.sin(t * Math.PI * 2) * (h / 2 - r);
        return slice(i, x, y, r);
      })}
    </g>
  );
}

function Grapes({ w, h, it, rand }) {
  const clusters = w > 70 ? 2 : 1;
  const out = [];
  for (let c = 0; c < clusters; c++) {
    const cx = clusters === 1 ? 0 : (c === 0 ? -w * 0.18 : w * 0.2);
    const cy = clusters === 1 ? 0 : (c === 0 ? -h * 0.12 : h * 0.14);
    const R = Math.min(w, h) * (clusters === 1 ? 0.45 : 0.32);
    const g = Math.max(4.5, R / 3.6);
    out.push(<path key={'st' + c} d={`M${cx} ${cy - R} q 6 -8 12 -10`} stroke="#6b5233" strokeWidth="2" fill="none" />);
    const n = Math.round((R * R) / (g * g) * 0.75) + 3;
    for (let i = 0; i < n; i++) {
      const a = rand() * Math.PI * 2, d = Math.sqrt(rand()) * (R - g);
      const x = cx + Math.cos(a) * d * 0.85, y = cy + Math.sin(a) * d;
      out.push(
        <g key={c + '-' + i}>
          <circle cx={x} cy={y} r={g} fill={shade(it.color, -18)} />
          <circle cx={x - 0.5} cy={y - 0.5} r={g - 1} fill={it.color} />
          <circle cx={x - g * 0.35} cy={y - g * 0.35} r={g * 0.28} fill="#fff" opacity=".28" />
        </g>,
      );
    }
  }
  return <g>{out}</g>;
}

function Figs({ w, h, qty, it, rand }) {
  const halves = Math.max(2, Math.min(8, Math.round(qty * 2)));
  const cols = Math.ceil(Math.sqrt(halves));
  const rows = Math.ceil(halves / cols);
  const cw = w / cols, ch = h / rows;
  const s = Math.min(cw, ch) * 0.48;
  return (
    <g>
      {Array.from({ length: halves }, (_, i) => {
        const x = -w / 2 + cw * ((i % cols) + 0.5);
        const y = -h / 2 + ch * (Math.floor(i / cols) + 0.5);
        const rot = (rand() - 0.5) * 70;
        const d = `M0 ${-s} C${s * 0.5} ${-s * 0.6}, ${s * 0.95} ${s * 0.1}, ${s * 0.75} ${s * 0.55} C${s * 0.5} ${s}, ${-s * 0.5} ${s}, ${-s * 0.75} ${s * 0.55} C${-s * 0.95} ${s * 0.1}, ${-s * 0.5} ${-s * 0.6}, 0 ${-s} Z`;
        return (
          <g key={i} transform={`translate(${x} ${y}) rotate(${rot})`}>
            <path d={d} fill={it.color} />
            <path d={d} fill={it.flesh} transform="scale(.8) translate(0 2)" />
            <path d={d} fill="#efc3a8" transform="scale(.45) translate(0 6)" opacity=".8" />
            {Array.from({ length: 6 }, (_, j) => (
              <circle key={j} cx={(rand() - 0.5) * s * 0.7} cy={(rand() - 0.2) * s * 0.7} r="0.9" fill="#8a3b3b" />
            ))}
          </g>
        );
      })}
    </g>
  );
}

function AppleFan({ w, h, it }) {
  const n = 8;
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const x = -w / 2 + 14 + (i * (w - 28)) / (n - 1);
        const rot = -20 + i * 5;
        return (
          <g key={i} transform={`translate(${x} 0) rotate(${rot})`}>
            <path d={`M-6 ${-h / 2 + 4} Q 10 0 -6 ${h / 2 - 4} Q 2 0 -6 ${-h / 2 + 4} Z`} fill={it.flesh} stroke={it.color} strokeWidth="2.6" strokeLinejoin="round" />
          </g>
        );
      })}
    </g>
  );
}

function Pile({ w, h, it, rand }) {
  const unit = it.shape === 'berry' ? 9 : it.shape === 'nut' ? 7 : it.shape === 'almond' ? 5.5 : 7.5;
  const n = Math.round((w * h) / (unit * unit * 4.2));
  const out = [];
  for (let i = 0; i < n; i++) {
    const a = rand() * Math.PI * 2, d = Math.sqrt(rand());
    const x = Math.cos(a) * d * (w / 2 - unit), y = Math.sin(a) * d * (h / 2 - unit);
    const rot = rand() * 360;
    let el;
    if (it.shape === 'berry') {
      el = (
        <g transform={`translate(${x} ${y}) rotate(${rot})`}>
          <path d={`M0 ${unit} C${-unit} ${unit * 0.2}, ${-unit * 0.8} ${-unit * 0.8}, 0 ${-unit * 0.6} C${unit * 0.8} ${-unit * 0.8}, ${unit} ${unit * 0.2}, 0 ${unit} Z`} fill={it.color} />
          <path d={`M-4 ${-unit * 0.6} l4 -4 l4 4 l-4 -1 Z`} fill="#4f7a3a" />
          <circle cx="-2" cy="1" r=".8" fill="#f6e1a5" /><circle cx="2" cy="4" r=".8" fill="#f6e1a5" />
        </g>
      );
    } else if (it.shape === 'nut') {
      el = (
        <g transform={`translate(${x} ${y}) rotate(${rot})`}>
          <ellipse rx={unit} ry={unit * 0.78} fill={it.color} />
          <path d={`M${-unit * 0.7} 0 Q 0 ${-unit * 0.5} ${unit * 0.7} 0 M0 ${-unit * 0.7} Q ${unit * 0.3} 0 0 ${unit * 0.7}`} stroke={shade(it.color, -40)} strokeWidth="1.2" fill="none" />
        </g>
      );
    } else if (it.shape === 'almond') {
      el = <ellipse transform={`translate(${x} ${y}) rotate(${rot})`} rx={unit} ry={unit * 0.62} fill={it.color} stroke={shade(it.color, -30)} strokeWidth=".8" />;
    } else {
      el = (
        <g transform={`translate(${x} ${y})`}>
          <circle r={unit} fill={shade(it.color, -24)} />
          <circle r={unit - 1.2} fill={it.color} />
          <circle cx={-unit * 0.35} cy={-unit * 0.35} r={unit * 0.28} fill="#fff" opacity=".3" />
        </g>
      );
    }
    out.push(<g key={i}>{el}</g>);
  }
  return <g>{out}</g>;
}

function Batons({ w, h, it, rand }) {
  const n = Math.max(6, Math.round(h / 6.5));
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const y = -h / 2 + 5 + (i * (h - 10)) / (n - 1);
        const len = w * (0.78 + rand() * 0.2);
        const col = it.alt && i % 2 ? it.alt : it.color;
        return (
          <g key={i} transform={`translate(${(rand() - 0.5) * 8} ${y}) rotate(${(rand() - 0.5) * 6})`}>
            <rect x={-len / 2} y="-3.4" width={len} height="6.8" rx="3" fill={shade(col, -22)} />
            <rect x={-len / 2} y="-3.4" width={len - 2} height="5.4" rx="3" fill={col} />
          </g>
        );
      })}
    </g>
  );
}

function Cucumber({ w, h, style, it, rand }) {
  if (style === 'ribbons') {
    const n = 3;
    return (
      <g>
        {Array.from({ length: n }, (_, i) => {
          const x = -w / 3 + (i * w) / 3;
          const pts = [];
          for (let k = 0; k <= 6; k++) pts.push(`${x + (k % 2 ? 10 : -10)} ${-h / 2 + 4 + (k * (h - 8)) / 6}`);
          const d = 'M' + pts.join(' L');
          return (
            <g key={i}>
              <path d={d} fill="none" stroke={it.color} strokeWidth="13" strokeLinejoin="round" strokeLinecap="round" />
              <path d={d} fill="none" stroke={it.flesh} strokeWidth="9" strokeLinejoin="round" strokeLinecap="round" />
            </g>
          );
        })}
      </g>
    );
  }
  const r = Math.min(13, h / 4.2);
  const cols = Math.max(3, Math.round(w / (r * 1.6)));
  const rows = Math.max(2, Math.round(h / (r * 2.1)));
  const out = [];
  for (let rr = 0; rr < rows; rr++)
    for (let c = 0; c < cols; c++) {
      const x = -w / 2 + r + (c * (w - 2 * r)) / Math.max(1, cols - 1);
      const y = -h / 2 + r + (rr * (h - 2 * r)) / Math.max(1, rows - 1);
      out.push(
        <g key={rr + '-' + c} transform={`translate(${x} ${y})`}>
          <circle r={r} fill={it.color} />
          <circle r={r - 2} fill={it.flesh} />
          {Array.from({ length: 5 }, (_, j) => {
            const a = (j / 5) * Math.PI * 2 + rand();
            return <ellipse key={j} cx={Math.cos(a) * r * 0.35} cy={Math.sin(a) * r * 0.35} rx="1.4" ry=".8" fill="#c3cf9a" />;
          })}
        </g>,
      );
    }
  return <g>{out}</g>;
}

function Crackers({ w, h, style, it, rand }) {
  const s = h * 0.82;
  const cracker = (key, x, y, rot) => (
    <g key={key} transform={`translate(${x} ${y}) rotate(${rot})`}>
      <rect x={-s / 2 + 1.5} y={-s / 2 + 1.5} width={s} height={s} rx="5" fill={shade(it.color, -34)} opacity=".7" />
      <rect x={-s / 2} y={-s / 2} width={s} height={s} rx="5" fill={it.color} stroke={shade(it.color, -30)} strokeWidth="1" />
      {(it.seeded ? [[-6, -5], [4, -3], [-2, 5], [6, 6], [-7, 6], [1, -8]] : [[-6, -6], [6, -6], [0, 0], [-6, 6], [6, 6]]).map(([a, b], j) => (
        <circle key={j} cx={a * s / 26} cy={b * s / 26} r={it.seeded ? 1.3 : 1} fill={shade(it.color, it.seeded ? -60 : -40)} />
      ))}
    </g>
  );
  if (style === 'stack') {
    const stacks = Math.max(2, Math.round(w / (s * 1.3)));
    const out = [];
    for (let i = 0; i < stacks; i++) {
      const x = -w / 2 + s / 2 + (i * (w - s)) / Math.max(1, stacks - 1);
      for (let k = 0; k < 3; k++) out.push(cracker(i + '-' + k, x + k * 2, -k * 2.5, (rand() - 0.5) * 10));
    }
    return <g>{out}</g>;
  }
  const n = Math.max(4, Math.round(w / (s * 0.5)));
  return <g>{Array.from({ length: n }, (_, i) => cracker(i, -w / 2 + s / 2 + (i * (w - s)) / (n - 1), (i % 2) * 2 - 1, -8 + (i * 16) / (n - 1)))}</g>;
}

function Baguette({ w, h, it }) {
  const n = Math.max(5, Math.round(w / 20));
  const rx = h * 0.42, ry = h * 0.3;
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const x = -w / 2 + rx + (i * (w - 2 * rx)) / (n - 1);
        return (
          <g key={i} transform={`translate(${x} ${(i % 2) * 3 - 1.5}) rotate(-70)`}>
            <ellipse rx={rx} ry={ry} fill={shade(it.color, -30)} />
            <ellipse rx={rx - 3} ry={ry - 3} fill={it.crumb} />
          </g>
        );
      })}
    </g>
  );
}

function Bowl({ w, h, style, it, rand }) {
  const R = Math.min(w, h) / 2 - 1;
  const drizzle = it.drizzle;
  if (style === 'swoosh') {
    return (
      <g>
        <rect x={-w / 2} y={-h / 2} width={w} height={h} rx="3" fill="#f6efe2" stroke="#e3d6c2" strokeWidth="1" transform="rotate(-6)" />
        <path d={`M${-R * 0.85} ${R * 0.1} C${-R * 0.7} ${-R * 0.8}, ${R * 0.7} ${-R * 0.8}, ${R * 0.85} ${-R * 0.05} C${R * 0.8} ${R * 0.7}, ${-R * 0.6} ${R * 0.85}, ${-R * 0.85} ${R * 0.1} Z`} fill={it.color} />
        <path d={`M${-R * 0.55} ${R * 0.15} C${-R * 0.2} ${-R * 0.35}, ${R * 0.3} ${-R * 0.35}, ${R * 0.55} ${R * 0.05}`} fill="none" stroke={shade(it.color, -22)} strokeWidth="5" strokeLinecap="round" opacity=".5" />
        {drizzle && <path d={`M${-R * 0.5} ${R * 0.1} C${-R * 0.2} ${-R * 0.3}, ${R * 0.3} ${-R * 0.3}, ${R * 0.5} 0`} fill="none" stroke={drizzle} strokeWidth="2.4" strokeLinecap="round" />}
      </g>
    );
  }
  return (
    <g>
      <circle r={R} fill="#fbf8f2" stroke="#e2d7c6" strokeWidth="1.2" />
      <circle r={R * 0.78} fill={it.color} />
      {it.olives &&
        Array.from({ length: Math.round(R * 0.9) }, (_, i) => {
          const a = rand() * Math.PI * 2, d = Math.sqrt(rand()) * R * 0.6;
          return <ellipse key={i} cx={Math.cos(a) * d} cy={Math.sin(a) * d} rx="5" ry="3.6" transform={`rotate(${rand() * 180} ${Math.cos(a) * d} ${Math.sin(a) * d})`} fill={i % 3 ? '#6d7a3a' : '#4a2c3b'} />;
        })}
      {!it.olives && drizzle && (
        <path d={`M${-R * 0.55} ${-R * 0.1} q ${R * 0.14} ${-R * 0.22} ${R * 0.28} 0 t ${R * 0.28} 0 t ${R * 0.28} 0 t ${R * 0.28} 0`} fill="none" stroke={drizzle} strokeWidth={Math.max(1.6, R * 0.07)} strokeLinecap="round" />
      )}
      {!it.olives && !drizzle && (
        <path d={`M${-R * 0.4} ${R * 0.25} Q 0 ${R * 0.45} ${R * 0.4} ${R * 0.2}`} fill="none" stroke={shade(it.color, 40)} strokeWidth="1.6" opacity=".45" strokeLinecap="round" />
      )}
      {!it.olives && it.color === '#e8d2a4' && [[-0.25, 0.25], [0.2, 0.3], [0.05, -0.35], [0.35, -0.05], [-0.4, -0.15]].map(([a, b], i) => (
        <circle key={i} cx={a * R} cy={b * R} r={Math.max(1, R * 0.045)} fill="#6f8a3d" opacity=".8" />
      ))}
      {!it.olives && <ellipse cx={-R * 0.3} cy={-R * 0.32} rx={R * 0.16} ry={R * 0.08} fill="#fff" opacity=".35" />}
    </g>
  );
}

function Rosemary({ h, qty, it }) {
  const n = Math.max(1, Math.min(3, Math.round(qty)));
  const sc = h / 600;
  const angles = n === 1 ? [0] : n === 2 ? [-12, 12] : [-16, 0, 16];
  return (
    <g>
      {angles.map((a, i) => (
        <g key={i} transform={`rotate(${a} 0 ${h / 2}) translate(${-118.5 * sc} ${-h / 2}) scale(${sc})`}>
          <path d={ROSEMARY_PATH} fill={it.color} fillRule="evenodd" />
        </g>
      ))}
    </g>
  );
}

const ARTS = {
  brie: Brie, hard: Hard, goat: Goat, prosciutto: Prosciutto, salami: Salami, grapes: Grapes,
  figs: Figs, apple: AppleFan, pile: Pile, batons: Batons, cucumber: Cucumber, crackers: Crackers,
  baguette: Baguette, bowl: Bowl, rosemary: Rosemary,
};

export function ItemArt({ it, w, h, style, qty, seed }) {
  const Art = ARTS[it.art];
  const rand = rng(seed + ':' + style + ':' + Math.round(w));
  return <Art it={it} w={w} h={h} style={style} qty={qty} rand={rand} />;
}

// Photographic group: the cutouts of one group, laid out in mm by groupLayout from its physical profile.
function PhotoPiece({ piece, item }) {
  const m = MEDIA[piece.asset];
  const { parts } = groupLayout(item);
  return (
    <g>
      {parts.map((p, i) => {
        const r = imageRect(piece.asset, p);
        return (
          <image key={i} href={m.src} x={r.x} y={r.y} width={r.w} height={r.h} preserveAspectRatio="xMidYMid meet"
            transform={`translate(${p.x} ${p.y}) rotate(${p.r})`} />
        );
      })}
    </g>
  );
}

// Chooses the photographic piece when one exists for this item and style, otherwise the illustration.
export function ItemVisual({ type, it, w, h, style, qty, seed, item }) {
  const piece = photoPiece(type, style);
  if (piece) return <PhotoPiece piece={piece} item={{ ...(item || {}), type, qty, style }} />;
  return <ItemArt it={it} w={w} h={h} style={style} qty={qty} seed={seed} />;
}
