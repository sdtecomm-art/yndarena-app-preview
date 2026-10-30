import { useEffect, useId, useState } from 'react';
import { useNav } from '../nav.jsx';
import { useStore } from '../store.jsx';
import { TopBar, Button, Kicker, Icon, Sheet, DemoNote, Sprig, Chip, Empty, useToast } from '../ui.jsx';
import { MEDIA } from '../data/media.js';
import {
  careStatus, oilPending, fmtDate, fmtShort, daysBetween, iso, fromIso, uid, DAY,
  OCCASION_TYPES, giftInfo, giftWho, whenText, MONTHS, MONTHS_SHORT, CARE_USAGE, usageOf, addUsageInterval,
} from '../lib.js';

const MAX_GIFTS = 3;

// Yndarena's existing care video and support address, as used in the care plan emails.
export const CARE_VIDEO_URL = 'https://yndarenahome.com/wood-care/#video';
export const SUPPORT_EMAIL = 'contact@yndarenahome.com';

const reduceMotion = () => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---------- State of the plan ----------
// Everything here comes from the existing care state (start date, logged checks, oil confirmation).
// Nothing reads the wood: no diagnosis, no score, no streak.
export function careView(care, today) {
  if (care.status !== 'active') {
    return care.status === 'notyet'
      ? { key: 'notyet', kicker: 'When your boards arrive', title: 'Everything is ready for them.', text: 'Tell us the day they come home. Your plan starts that day.', primary: ['My boards are home', 'start'], secondary: ['See how to oil', 'oil-guide'] }
      : { key: 'new', kicker: 'First step', title: 'Oil your boards the day they arrive.', text: 'After that, we will remind you when it is time to check.', primary: ['My boards are home', 'start'], secondary: ['See how to oil', 'oil-guide'] };
  }
  const cs = careStatus(care, today);
  const oil = oilPending(care);
  if (oil) {
    return {
      key: 'oil', hot: true, kicker: 'Oil pending',
      title: 'Your boards are asking for oil.',
      text: `The water soaked in on ${fmtDate(fromIso(oil.at))}. Oil them when you can, then let us know.`,
      primary: ['How to oil', 'oil-guide'], secondary: ['I oiled my boards', 'oiled'],
    };
  }
  const last = [...care.checks].sort((a, b) => ((a.oiledAt || a.at) < (b.oiledAt || b.at) ? -1 : 1)).pop();
  const doneToday = last && (last.at === iso(today) || last.oiledAt === iso(today));
  if (doneToday) {
    return {
      key: 'logged', kicker: 'Care logged today',
      title: 'Your boards are cared for.',
      text: `Next check: ${fmtDate(cs.next)}. We’ll remind you.`,
      primary: ['Browse the care guides', 'focus:oil'], secondary: null,
    };
  }
  if (cs.due) {
    return {
      key: 'due', hot: true, kicker: cs.overdueDays > 0 ? `Check due since ${fmtShort(cs.next)}` : 'Check due today',
      title: 'Time for a quick water test.',
      text: 'A few drops on a clean, dry board, and a few seconds of watching. You tell us what you saw.',
      primary: ['Start water test', 'water-test'], secondary: ['How the test works', 'focus:check'],
    };
  }
  const d = daysBetween(today, cs.next);
  return {
    key: 'upcoming', kicker: 'Next check',
    title: fmtDate(cs.next, cs.next.getUTCFullYear() !== today.getUTCFullYear()),
    text: `In ${d} day${d === 1 ? '' : 's'}. Nothing to do until then. We’ll remind you.`,
    primary: ['Browse the care guides', 'focus:oil'], secondary: ['Check now anyway', 'water-test'],
  };
}

// Facts the plan already holds, shown as they are.
function planFacts(care, today) {
  if (care.status !== 'active') return [];
  const cs = careStatus(care, today);
  const last = [...care.checks].sort((a, b) => ((a.oiledAt || a.at) < (b.oiledAt || b.at) ? -1 : 1)).pop();
  return [
    ['Checks recorded', `${cs.recorded}`],
    ['Last care', last ? `${last.oiledAt ? 'Oiled' : last.result === 'beads' ? 'Beaded' : 'Soaked in'}, ${fmtShort(fromIso(last.oiledAt || last.at))}` : 'None yet'],
    ['Next check', fmtShort(cs.next)],
  ];
}

export function useCareActions() {
  const nav = useNav();
  const toast = useToast();
  const { user, updateUser, today } = useStore();
  return (go) => {
    if (go === 'start') { updateUser((u) => { u.care.status = 'active'; u.care.startedAt = iso(today); }); toast('Your plan starts today.'); return; }
    if (go === 'oiled') {
      const p = oilPending(user.care);
      updateUser((u) => { const c = u.care.checks.find((x) => x.at === p.at && x.n === p.n); if (c) { c.oiled = true; c.oiledAt = iso(today); } });
      toast('Oiling saved to your care plan.');
      return;
    }
    if (go.startsWith('focus:')) {
      const focus = go.slice(6);
      if (nav.tab === 'care' && nav.stack.length === 1) document.getElementById('care-' + focus)?.scrollIntoView({ behavior: reduceMotion() ? 'auto' : 'smooth', block: 'start' });
      else nav.switchTab('care', { name: 'care', params: { focus, t: Date.now() } });
      return;
    }
    nav.push(go);
  };
}

export function NextStep({ care, today, compact }) {
  const act = useCareActions();
  const v = careView(care, today);
  const facts = compact ? [] : planFacts(care, today);
  return (
    <section className={'next-step' + (v.hot ? ' is-hot' : '')} aria-label="Your next step" data-state={v.key}>
      <div className="next-kicker"><span className="pulse-dot" aria-hidden="true" />{v.kicker}</div>
      <h2 className="next-title">{v.title}</h2>
      <p className="next-text">{v.text}</p>
      <div className="next-actions">
        <Button block onClick={() => act(v.primary[1])}>{v.primary[0]}</Button>
        {v.secondary && <Button block variant="text" onClick={() => act(v.secondary[1])}>{v.secondary[0]}</Button>}
      </div>
      {facts.length > 0 && (
        <dl className="plan-facts">
          {facts.map(([k, val]) => <div key={k}><dt>{k}</dt><dd>{val}</dd></div>)}
        </dl>
      )}
    </section>
  );
}

// Yndarena's three boards, from the product reference in the brand kit.
export function ProductStrip({ className = '' }) {
  const m = MEDIA['product-boards-spines'];
  return (
    <figure className={'product-strip ' + className}>
      <img src={m.src} srcSet={m.srcSet} sizes="(max-width: 500px) 92vw, 360px" alt={m.alt} width={m.width} height={m.height} decoding="async" />
    </figure>
  );
}

// ---------- Illustrations ----------
// Drawn, labelled as illustrations: they explain what to look for, they never stand for the customer's board.
// Modelled on the owner's reference of water held on a wooden surface: clear water in irregular, slightly lobed
// drops and small pools, the grain visible through them, a fine edge and small reflections. Absorbed water uses
// the same wood, light, places and amount: no volume, no edge, no reflections, only a diffuse darker patch.

// Organic outline: a closed smooth curve around (cx, cy), stretched by sx and turned by rot (degrees).
function blobPath({ cx, cy, r, sx = 1, rot = 0, seed = 1 }, grow = 1) {
  const n = 24, pts = [];
  const a = 0.08 + (seed % 3) * 0.035, b = 0.06 + (seed % 2) * 0.05, c = 0.035;
  const p1 = seed * 1.7, p2 = seed * 2.3, p3 = seed * 0.9;
  const t = (rot * Math.PI) / 180, ct = Math.cos(t), st = Math.sin(t);
  for (let k = 0; k < n; k++) {
    const th = (2 * Math.PI * k) / n;
    const rr = r * grow * (1 + a * Math.sin(2 * th + p1) + b * Math.sin(3 * th + p2) + c * Math.sin(5 * th + p3));
    const x = rr * Math.cos(th) * sx, y = rr * Math.sin(th);
    pts.push([cx + x * ct - y * st, cy + x * st + y * ct]);
  }
  // Catmull-Rom through the points, as cubic Béziers.
  let d = `M${pts[0][0].toFixed(2)} ${pts[0][1].toFixed(2)}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n], q1 = pts[i], q2 = pts[(i + 1) % n], p3_ = pts[(i + 2) % n];
    const c1 = [q1[0] + (q2[0] - p0[0]) / 6, q1[1] + (q2[1] - p0[1]) / 6], c2 = [q2[0] - (p3_[0] - q1[0]) / 6, q2[1] - (p3_[1] - q1[1]) / 6];
    d += ` C${c1[0].toFixed(2)} ${c1[1].toFixed(2)} ${c2[0].toFixed(2)} ${c2[1].toFixed(2)} ${q2[0].toFixed(2)} ${q2[1].toFixed(2)}`;
  }
  return d + 'Z';
}

// The same water in both states: sizes vary, some drops have run together into small pools.
const WATER = [
  { cx: 48, cy: 40, r: 15, sx: 1.7, rot: -8, seed: 1 },
  { cx: 110, cy: 33, r: 8, sx: 1.2, rot: 15, seed: 2 },
  { cx: 121, cy: 73, r: 11, sx: 1.45, rot: 24, seed: 3 },
  { cx: 70, cy: 80, r: 9, sx: 1.35, rot: -18, seed: 4 },
  { cx: 29, cy: 86, r: 5, sx: 1.1, seed: 5 },
  { cx: 95, cy: 57, r: 4.6, sx: 1.05, seed: 6 },
  { cx: 142, cy: 27, r: 3.8, sx: 1.2, seed: 7 },
  { cx: 140, cy: 96, r: 3.2, seed: 8 },
];

export function Wood({ id, w = 160, h = 110 }) {
  const lines = Math.round(h / 4.2);
  return (
    <>
      <defs>
        <linearGradient id={id + 'wood'} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#b47a4e" /><stop offset=".55" stopColor="#a06a42" /><stop offset="1" stopColor="#8a5733" /></linearGradient>
      </defs>
      <rect width={w} height={h} fill={`url(#${id}wood)`} />
      {Array.from({ length: lines }, (_, i) => {
        const y = (i + 0.5) * (h / lines), wob = 1.6 + (i % 4) * 0.7;
        return <path key={i} d={`M-6 ${y.toFixed(1)} C ${w * 0.3} ${(y - wob).toFixed(1)}, ${w * 0.62} ${(y + wob * 1.3).toFixed(1)}, ${w + 6} ${(y - wob * 0.4).toFixed(1)}`} stroke={i % 5 === 2 ? '#d29a6a' : '#5d3820'} strokeWidth={i % 3 ? 0.45 : 0.9} fill="none" opacity={i % 5 === 2 ? 0.28 : 0.3 + (i % 3) * 0.06} />;
      })}
    </>
  );
}

// One body of water sitting on the wood: clear, the grain shows through, a fine edge and small reflections.
export function SurfaceWater({ b, id }) {
  const d = blobPath(b);
  // Reflections sit inside the water, on its upper-left side, following the shape's own turn.
  const t = ((b.rot || 0) * Math.PI) / 180, sx = b.sx || 1;
  const at = (u, v) => [b.cx + u * Math.cos(t) - v * Math.sin(t), b.cy + u * Math.sin(t) + v * Math.cos(t)];
  const [hx, hy] = at(-b.r * sx * 0.34, -b.r * 0.36), hr = Math.max(0.7, b.r * 0.12);
  const [gx, gy] = at(b.r * sx * 0.38, b.r * 0.28);
  // The dark line under the edge is only a crescent outside the water, so the wood inside keeps its own tone.
  const mid = `${id}m${b.seed}${Math.round(b.cx)}${Math.round(b.cy)}`;
  return (
    <g>
      <mask id={mid} maskUnits="userSpaceOnUse">
        <path d={d} transform="translate(.7 1.1)" fill="#fff" />
        <path d={d} fill="#000" />
      </mask>
      <path d={d} transform="translate(.7 1.1)" fill="#3a1d0b" opacity=".55" mask={`url(#${mid})`} />
      <path d={d} fill={`url(#${id}water)`} />
      <path d={d} fill="none" stroke="#4a2810" strokeOpacity=".4" strokeWidth=".45" />
      <path d={blobPath(b, 0.78)} transform="translate(.6 .9)" fill="none" stroke="#ffe3c4" strokeOpacity=".1" strokeWidth={Math.max(0.6, b.r * 0.1)} />
      <ellipse cx={hx} cy={hy} rx={hr * 1.6} ry={hr * 0.7} transform={`rotate(-30 ${hx} ${hy})`} fill="#fff" opacity=".7" />
      {b.r > 7 && <circle cx={gx} cy={gy} r={hr * 0.45} fill="#fff" opacity=".45" />}
    </g>
  );
}

export function WaterDefs({ id }) {
  return (
    <defs>
      <linearGradient id={id + 'water'} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#fff4e6" stopOpacity=".24" />
        <stop offset=".55" stopColor="#ffd9b0" stopOpacity=".1" />
        <stop offset="1" stopColor="#ffd9b0" stopOpacity=".04" />
      </linearGradient>
      <filter id={id + 'soak'} x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="2.4" /></filter>
    </defs>
  );
}

export function DropsArt({ kind, label = true, className = '' }) {
  const id = 'w' + kind + useId().replace(/[^a-zA-Z0-9]/g, '');
  return (
    <div className={'drops-art ' + className} data-kind={kind}>
      <svg viewBox="0 0 160 110" role="img" aria-label={kind === 'beads' ? 'Illustration: clear water staying on the surface of the wood in drops and small pools' : 'Illustration: water sinking into the wood, leaving darker patches'}>
        <WaterDefs id={id} />
        <Wood id={id} />
        {kind === 'beads'
          ? WATER.map((b) => <SurfaceWater key={b.seed} b={b} id={id} />)
          : (
            <g filter={`url(#${id}soak)`}>
              {WATER.map((b) => <path key={b.seed} d={blobPath(b, 1.12)} fill="#4a260e" opacity=".36" />)}
              {WATER.filter((b) => b.r > 6).map((b) => <path key={'c' + b.seed} d={blobPath(b, 0.7)} fill="#3a1d0b" opacity=".16" />)}
            </g>
          )}
      </svg>
      {label && <span className="illus-tag">Illustration</span>}
    </div>
  );
}

// Seconds to watch the drops. Editorial guidance, to be confirmed on Yndarena's real boards.
const WATCH_SECONDS = 5;

const RESULTS = {
  beads: { title: 'It beads up', look: 'The water stays on the surface in drops or small pools.', means: 'The grain is still holding its oil.', todo: 'No oil needed today.' },
  soaks: { title: 'It soaks in', look: 'The water sinks into the wood, leaving a darker patch.', means: 'The wood is asking for oil.', todo: 'Oil it when you can.' },
};

function ResultCompare() {
  return (
    <div className="compare">
      {['beads', 'soaks'].map((k) => (
        <div key={k} className="compare-col">
          <DropsArt kind={k} />
          <div className="compare-title">{RESULTS[k].title}</div>
          <p className="compare-text">{RESULTS[k].look}</p>
          <div className={'compare-todo' + (k === 'soaks' ? ' is-oil' : '')}>{RESULTS[k].todo}</div>
        </div>
      ))}
    </div>
  );
}

// ---------- Oil and care content ----------
// Materials, timing and the reminders schedule are approved facts (set contents, care plan emails, schedule).
// Step wording and everyday care are drafts pending Yndarena's approval: see the review panel.
export const OIL_FACTS = [
  ['What you need', 'The mineral oil and the cloth that came with your set, and a clean, dry board.'],
  ['When', 'The day your boards arrive. After that, whenever the water test soaks in.'],
  ['Where', 'Every surface: both faces and all four edges.'],
];

export const OIL_STEPS = [
  { title: 'Start clean and dry', text: 'Wash the board, wipe it and let it dry completely before any oil goes on.', art: 'dry' },
  { title: 'A little oil on the surface', text: 'Pour a small amount of mineral oil onto one face. You can always add more.', art: 'pour' },
  { title: 'Spread it with the cloth', text: 'Rub it in following the grain, in a thin, even layer. Then the other face and the edges.', art: 'spread' },
  { title: 'Let the wood drink it in', text: 'Leave the board standing on its edge while the oil soaks in.', art: 'rest' },
  { title: 'Wipe off what is left', text: 'When the surface stops taking in oil, wipe away the excess with a dry part of the cloth.', art: 'wipe' },
];

function StepArt({ kind }) {
  return (
    <svg viewBox="0 0 120 80" className="step-art" aria-hidden="true">
      <rect x="10" y={kind === 'rest' ? 10 : 30} width={kind === 'rest' ? 18 : 100} height={kind === 'rest' ? 62 : 40} rx="4" fill="#9a6644" />
      {kind !== 'rest' && Array.from({ length: 5 }, (_, i) => <path key={i} d={`M14 ${36 + i * 7} C 45 ${33 + i * 7}, 75 ${39 + i * 7}, 106 ${35 + i * 7}`} stroke="#6a4029" strokeWidth=".6" fill="none" opacity=".5" />)}
      {kind === 'dry' && <><path d="M30 18c8-6 16 6 24 0s16 6 24 0" stroke="#9b9f8e" strokeWidth="2" fill="none" strokeLinecap="round" /><path d="M42 10c8-6 16 6 24 0" stroke="#9b9f8e" strokeWidth="2" fill="none" strokeLinecap="round" /></>}
      {kind === 'pour' && <><path d="M70 6h14l-3 12H73z" fill="#e8d9b0" stroke="#786350" strokeWidth="1" /><path d="M77 18c0 6 0 9-1 12" stroke="#d9b45a" strokeWidth="2.4" strokeLinecap="round" /><ellipse cx="74" cy="44" rx="12" ry="4" fill="#e3b85a" opacity=".75" /></>}
      {kind === 'spread' && <><path d="M30 46c14-4 30 4 50-2" stroke="#e3b85a" strokeWidth="6" strokeLinecap="round" opacity=".55" /><rect x="70" y="34" width="26" height="16" rx="5" fill="#f4f1ec" stroke="#786350" strokeWidth="1" transform="rotate(-8 83 42)" /><path d="M58 60h30M80 56l8 4-8 4" stroke="#584234" strokeWidth="1.4" fill="none" strokeLinecap="round" /></>}
      {kind === 'rest' && <><rect x="40" y="10" width="18" height="62" rx="4" fill="#d6b88d" /><rect x="70" y="10" width="18" height="62" rx="4" fill="#93603f" /><path d="M4 74h108" stroke="#786350" strokeWidth="1.4" /><circle cx="104" cy="22" r="9" fill="none" stroke="#786350" strokeWidth="1.2" /><path d="M104 16v6l4 3" stroke="#786350" strokeWidth="1.2" fill="none" strokeLinecap="round" /></>}
      {kind === 'wipe' && <><rect x="52" y="30" width="30" height="18" rx="6" fill="#f4f1ec" stroke="#786350" strokeWidth="1" transform="rotate(10 67 39)" /><path d="M20 62h30" stroke="#584234" strokeWidth="1.4" strokeLinecap="round" /><path d="M28 58l-8 4 8 4" stroke="#584234" strokeWidth="1.4" fill="none" strokeLinecap="round" /></>}
    </svg>
  );
}

export const EVERYDAY = [
  { icon: 'wash', title: 'Wash by hand', text: 'Warm water and a little mild soap. Never soak it, never the dishwasher.' },
  { icon: 'air', title: 'Dry on its edge', text: 'Wipe it right away, then let it stand on its edge so air reaches both faces.' },
  { icon: 'stand', title: 'Store in the stand', text: 'Keep the boards in their stand, away from the stove and direct sun.' },
  { icon: 'heat', title: 'Hot pans on a trivet', text: 'Hot pans and baking dishes rest on a trivet, never on the wood.' },
];


function OilSheet({ open, onClose }) {
  return (
    <Sheet open={open} onClose={onClose} title="I need board oil">
      <p className="body" style={{ marginTop: 0 }}>Your set came with mineral oil and a cloth. When the oil runs out, any food-safe mineral oil made for cutting boards will do.</p>
      <div className="kit-card">
        <div className="label">Yndarena board oil and care kit</div>
        <p className="small" style={{ margin: '6px 0 12px' }}>It will be available in the Yndarena store.</p>
        <Button block disabled>Store link coming soon</Button>
      </div>
      <div style={{ marginTop: 12 }}><DemoNote>Store link pending. No purchases happen in this preview.</DemoNote></div>
    </Sheet>
  );
}

// ---------- Care tab ----------
export default function Care({ params = {}, root }) {
  const seg = params.seg || 'care';
  if (seg === 'gifts') {
    return (
      <>
        <TopBar title="Gift dates" />
        <GiftDates startAdd={params.add} />
      </>
    );
  }
  return <CarePlan params={params} root={root} />;
}

function Section({ id, n, title, lead, children }) {
  return (
    <section className="care-sec" id={'care-' + id} aria-labelledby={'care-h-' + id}>
      <div className="care-sec-head">
        <span className="care-sec-n">{n}</span>
        <h2 className="h2" id={'care-h-' + id}>{title}</h2>
      </div>
      {lead && <p className="care-lead">{lead}</p>}
      {children}
    </section>
  );
}

// How often we remind: part of the plan itself, next to the next check and the channels. No FAQ.
function ReminderPlan({ care, today }) {
  const { updateUser } = useStore();
  const usage = usageOf(care);
  const active = care.status === 'active';
  const cs = active ? careStatus(care, today) : null;
  const on = care.prefs.email || care.prefs.app;
  return (
    <section className="reminder-plan" aria-labelledby="remind-h">
      <h2 id="remind-h" className="rp-title">How often will you remind me?</h2>
      <p className="rp-lead">It depends on how often you use your boards.</p>
      <div className="rp-options" role="radiogroup" aria-label="How often you use your boards">
        {Object.entries(CARE_USAGE).map(([k, u]) => (
          <button key={k} role="radio" aria-checked={usage === k} className={'rp-option' + (usage === k ? ' is-on' : '')} onClick={() => updateUser((x) => { x.care.usage = k; })}>
            <span className="rp-radio" aria-hidden="true" />
            <span className="rp-l">{u.label} use</span>
            <span className="rp-h">{u.hint.replace(/^about /, 'About ')}</span>
          </button>
        ))}
      </div>
      <p className="rp-note">We’ll remind you to check your boards. Oil them when they need it.</p>
      <div className="rp-next">
        <Icon name="bell" size={16} />
        <span>{!active ? 'Reminders start the day your boards come home.' : !on ? `Reminders are off. Next check: ${fmtDate(cs.next)}.` : cs.due ? 'A check is due now. We won’t send the missed ones.' : `Next reminder: ${fmtDate(cs.next, cs.next.getUTCFullYear() !== today.getUTCFullYear())}.`}</span>
      </div>
      <div className="rp-channels">
        {[['email', 'By email'], ['app', 'In the app']].map(([k, t]) => (
          <button key={k} className="list-row" onClick={() => updateUser((u) => { u.care.prefs[k] = !u.care.prefs[k]; })} role="switch" aria-checked={care.prefs[k]}>
            <div className="grow"><div>{t}</div></div>
            <span className={'switch' + (care.prefs[k] ? ' is-on' : '')} />
          </button>
        ))}
      </div>
      <DemoNote>Simulated in this preview. No emails or notifications are sent.</DemoNote>
    </section>
  );
}

function CarePlan({ params, root }) {
  const nav = useNav();
  const { user, updateUser, today, homeNo } = useStore();
  const [oil, setOil] = useState(false);
  const care = user.care;

  useEffect(() => {
    if (!params.focus) return;
    const t = setTimeout(() => document.getElementById('care-' + params.focus)?.scrollIntoView({ behavior: reduceMotion() ? 'auto' : 'smooth', block: 'start' }), 60);
    return () => clearTimeout(t);
  }, [params.focus, params.t]);

  const active = care.status === 'active';
  const cs = active ? careStatus(care, today) : null;
  const history = [...care.checks].sort((a, b) => (a.at < b.at ? 1 : -1));

  return (
    <div className="care-screen">
      {root ? (
        <header className="care-head pad">
          <div className="eyebrow">Your Yndarena Care Plan · Home No. {homeNo}</div>
          <h1 className="display-l">Care</h1>
        </header>
      ) : <TopBar title="Your care plan" />}

      <div className="pad">
        <NextStep care={care} today={today} />
        <ReminderPlan care={care} today={today} />
      </div>

      <Section id="check" n="01" title="Check your board" lead="A water test helps you see whether the wood needs oil. A few drops on a clean, dry board, about 5 seconds of watching.">
        <ResultCompare />
        <div className="stack-8" style={{ marginTop: 16 }}>
          <Button block onClick={() => nav.push('water-test')}>Start water test</Button>
          <Button block variant="ghost" onClick={() => nav.push('water-test', { practice: true })}>Walk me through it, nothing saved</Button>
        </div>
      </Section>

      <Section id="oil" n="02" title="How to oil" lead="A few minutes of work, then time for the wood to drink it in.">
        <dl className="oil-facts">
          {OIL_FACTS.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
        </dl>
        <button className="guide-open" onClick={() => nav.push('oil-guide')}>
          <ol className="guide-peek">
            {OIL_STEPS.slice(0, 3).map((s, i) => <li key={s.title}><span className="n">{i + 1}</span>{s.title}</li>)}
            <li className="more">+ {OIL_STEPS.length - 3} more steps</li>
          </ol>
          <span className="guide-cta">Open the step-by-step guide <Icon name="chevron" size={16} /></span>
        </button>
        <div className="oil-choice" role="group" aria-label="Board oil">
          <button className="choice" onClick={() => nav.push('oil-guide')}><Icon name="check" size={18} /><span>I already have board oil</span></button>
          <button className="choice" onClick={() => setOil(true)}><Icon name="bag" size={18} /><span>I need board oil</span></button>
        </div>
        <a className="video-link" href={CARE_VIDEO_URL} target="_blank" rel="noreferrer">
          <span className="play"><Icon name="play" size={14} fill="currentColor" /></span>
          <span className="grow"><span className="t">Watch Yndarena’s care video</span><span className="s">2 minutes · opens yndarenahome.com</span></span>
          <Icon name="external" size={16} />
        </a>
      </Section>

      <Section id="everyday" n="03" title="Everyday care" lead="After each use. No oil needed for this part.">
        <div className="everyday-grid">
          {EVERYDAY.map((e) => (
            <div key={e.title} className="everyday-tile">
              <span className="ico"><Icon name={e.icon} size={22} /></span>
              <div className="t">{e.title}</div>
              <p>{e.text}</p>
            </div>
          ))}
        </div>
      </Section>

      <section className="care-sec" id="care-history">
        <details className="history" open={params.focus === 'history' || undefined}>
          <summary>
            <span><span className="label">Care history</span><span className="history-sum">{active ? `${cs.recorded} check${cs.recorded === 1 ? '' : 's'} recorded · next ${fmtShort(cs.next)}` : 'Starts when your boards are home'}</span></span>
            <Icon name="chevron" size={18} className="chev" />
          </summary>
          {active && (
            <div className="timeline" style={{ marginTop: 12 }}>
              <div className="tl-item is-now">
                <div className="row-between"><span style={{ fontSize: 16 }}>Next check</span><span className="small">{fmtDate(cs.next, cs.next.getUTCFullYear() !== today.getUTCFullYear())}</span></div>
                <div className="small">{cs.due ? 'Due now' : `${CARE_USAGE[cs.usage].label} use · ${CARE_USAGE[cs.usage].hint}`}</div>
              </div>
              {history.map((c, i) => (
                <div key={c.at + i} className="tl-item is-done">
                  <div className="row-between"><span style={{ fontSize: 16 }}>Water test</span><span className="small">{fmtDate(fromIso(c.at), fromIso(c.at).getUTCFullYear() !== today.getUTCFullYear())}</span></div>
                  <div className="small">{c.result === 'beads' ? 'Water stayed on the surface. No oil needed.' : c.oiled ? `Water soaked in. Oiled${c.oiledAt ? ` ${fmtShort(fromIso(c.oiledAt))}` : ''}.` : 'Water soaked in. Oil pending.'}</div>
                </div>
              ))}
              <div className="tl-item is-done">
                <div className="row-between"><span style={{ fontSize: 16 }}>Boards came home</span><span className="small">{fmtDate(fromIso(care.startedAt), fromIso(care.startedAt).getUTCFullYear() !== today.getUTCFullYear())}</span></div>
              </div>
            </div>
          )}
          {care.status === 'none' && <Button block variant="text" onClick={() => updateUser((u) => { u.care.status = 'notyet'; })}>My boards haven’t arrived yet</Button>}
        </details>
      </section>

      <div className="care-sign">
        <Sprig style={{ height: 44 }} />
        <p>A board remembers how it is cared for.</p>
      </div>
      <OilSheet open={oil} onClose={() => setOil(false)} />
    </div>
  );
}

// ---------- Oil guide ----------
export function OilGuide() {
  const nav = useNav();
  const toast = useToast();
  const { user, updateUser, today } = useStore();
  const [kit, setKit] = useState(false);
  const pending = oilPending(user.care);
  const markOiled = () => {
    updateUser((u) => { const c = u.care.checks.find((x) => x.at === pending.at && x.n === pending.n); if (c) { c.oiled = true; c.oiledAt = iso(today); } });
    nav.pop();
    toast('Oiling saved to your care plan.');
  };
  return (
    <>
      <TopBar close title="How to oil" />
      <div className="pad oil-guide">
        <div className="eyebrow">Step-by-step guide</div>
        <h1 className="display-m">Oil your boards.</h1>
        <p className="lead" style={{ margin: '8px 0 0' }}>A few minutes of work, then time for the wood to drink it in.</p>
        <dl className="oil-facts" style={{ marginTop: 18 }}>
          {OIL_FACTS.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
        </dl>
        <ol className="oil-steps">
          {OIL_STEPS.map((s, i) => (
            <li key={s.title}>
              <StepArt kind={s.art} />
              <div>
                <div className="step-n">Step {i + 1}</div>
                <div className="step-t">{s.title}</div>
                <p>{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
        <a className="video-link" href={CARE_VIDEO_URL} target="_blank" rel="noreferrer">
          <span className="play"><Icon name="play" size={14} fill="currentColor" /></span>
          <span className="grow"><span className="t">See it in Yndarena’s care video</span><span className="s">2 minutes · opens yndarenahome.com</span></span>
          <Icon name="external" size={16} />
        </a>
        <div className="stack-8" style={{ marginTop: 20 }}>
          {pending ? (
            <>
              <Button block onClick={markOiled}>I oiled my boards</Button>
              <Button block variant="text" onClick={() => { nav.pop(); toast('Saved. Oil them when you can.'); }}>I’ll do it later</Button>
            </>
          ) : (
            <Button block onClick={() => nav.pop()}>Done</Button>
          )}
          <Button block variant="ghost" icon="bag" onClick={() => setKit(true)}>I need board oil</Button>
        </div>
        {pending && <p className="small" style={{ marginTop: 10 }}>Oil pending since the water test on {fmtDate(fromIso(pending.at))}.</p>}
      </div>
      <OilSheet open={kit} onClose={() => setKit(false)} />
    </>
  );
}

// ---------- Water test ----------
// The customer does the test on the real board; the screen only guides, times and records what they saw.
// practice: a walkthrough that never saves a result.
export function WaterTest({ params = {} }) {
  const nav = useNav();
  const toast = useToast();
  const { user, updateUser, today } = useStore();
  const practice = !!params.practice;
  const [step, setStep] = useState('drops');
  const [drops, setDrops] = useState([]);
  // A small helper count, started only once the drops are on the board. It never decides anything.
  const [secs, setSecs] = useState(WATCH_SECONDS);
  const [kit, setKit] = useState(false);
  const cs = careStatus(user.care, today);
  const active = user.care.status === 'active';

  useEffect(() => {
    if (step !== 'watch' || secs <= 0) return;
    const t = setTimeout(() => setSecs(secs - 1), 1000);
    return () => clearTimeout(t);
  }, [step, secs]);

  const log = (res) => {
    if (practice || !active) return;
    updateUser((u) => { u.care.checks.push({ n: u.care.checks.length + 1, at: iso(today), result: res, oiled: false, due: cs.due }); });
  };
  const choose = (res) => { log(res); setStep(res); };
  // After a check, the next one counts from today.
  const nextDate = active ? fmtDate(addUsageInterval(today, usageOf(user.care))) : null;

  const addDrop = (e) => {
    if (drops.length >= 6) return;
    const r = e.currentTarget.getBoundingClientRect();
    const k = Date.now();
    setDrops([...drops, { cx: ((e.clientX - r.left) / r.width) * 320, cy: ((e.clientY - r.top) / r.height) * 180, r: 7 + (k % 5), sx: 1 + (k % 4) * 0.15, rot: (k % 50) - 25, seed: 1 + (k % 9), k }]);
  };
  const order = ['drops', 'watch', 'result'];
  const idx = Math.min(order.indexOf(step) < 0 ? 3 : order.indexOf(step), 3);

  return (
    <>
      <TopBar close title={practice ? 'Water test · walkthrough' : 'Water test'} />
      <div className="pad wt">
        <div className="wt-progress" aria-label={`Step ${Math.min(idx + 1, 3)} of 3`}>
          {['Drops', 'About 5 seconds', 'What you saw'].map((t, i) => <span key={t} className={idx >= i ? 'on' : ''}>{t}</span>)}
        </div>
        {practice && <div className="wt-practice">Walkthrough: nothing is saved to your care plan.</div>}

        {step === 'drops' && (
          <>
            <div className="where is-board"><Icon name="hand" size={16} />At your board</div>
            <h1 className="display-m">Put a few drops of water on a clean, dry board.</h1>
            <p className="body" style={{ margin: '8px 0 0' }}>Start with a board that is clean and completely dry. A few drops from your fingertips on the face you cut on most is enough.</p>
            <div className="where is-screen" style={{ marginTop: 20 }}><Icon name="phone" size={16} />On this screen, only a picture</div>
            <div className="water" onClick={addDrop} role="button" tabIndex={0} aria-label="Illustration. Tap to see how drops look on wood. It does not check your board.">
              <svg viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice">
                <WaterDefs id="demo" />
                <Wood id="demo" w={320} h={180} />
                {drops.map((d) => (
                  <g key={d.k} className="drop fall"><SurfaceWater b={d} id="demo" /></g>
                ))}
              </svg>
              <span className="illus-tag">Illustration</span>
              {drops.length === 0 && <div className="canvas-hint">Tap to see how drops look</div>}
            </div>
            <p className="small" style={{ marginTop: 8 }}>Tapping here doesn’t check your board. Only your eyes can.</p>
            <Button block style={{ marginTop: 16 }} onClick={() => { setStep('watch'); setSecs(WATCH_SECONDS); }}>The drops are on my board</Button>
          </>
        )}

        {step === 'watch' && (
          <>
            <div className="where is-board"><Icon name="hand" size={16} />At your board</div>
            <h1 className="display-m">Watch the drops for about 5 seconds.</h1>
            <p className="body" style={{ margin: '8px 0 0' }}>Do they stay rounded on top, or soak into the wood?</p>
            <div className="watch-row">
              <DropsArt kind="beads" label={false} className="mini" />
              <span className="watch-or">or</span>
              <DropsArt kind="soaks" label={false} className="mini" />
            </div>
            <div className="watch-count" role="timer" aria-live="off" aria-label={secs > 0 ? `About ${secs} seconds` : 'About 5 seconds have passed'}>
              <Icon name="clock" size={15} />
              <span>{secs > 0 ? `${secs} s` : 'About 5 seconds have passed'}</span>
            </div>
            <span className="sr-only" aria-live="polite">{secs === 0 ? 'About 5 seconds have passed. Tell us what you saw.' : ''}</span>
            <Button block style={{ marginTop: 14 }} onClick={() => setStep('result')}>Tell us what you saw</Button>
            <p className="small" style={{ marginTop: 10, textAlign: 'center' }}>If it is already clear, answer now. The count is only a guide; it doesn’t check the wood.</p>
          </>
        )}

        {step === 'result' && (
          <>
            <div className="where is-board"><Icon name="hand" size={16} />Look at your board</div>
            <h1 className="display-m">What did the water do?</h1>
            <div className="stack-12" style={{ marginTop: 16 }}>
              {['beads', 'soaks'].map((k) => (
                <button key={k} className="result-card" onClick={() => choose(k)}>
                  <DropsArt kind={k} />
                  <span className="rc-body">
                    <span className="rc-title">{RESULTS[k].title}</span>
                    <span className="rc-look">{RESULTS[k].look}</span>
                    <span className={'compare-todo' + (k === 'soaks' ? ' is-oil' : '')}>{RESULTS[k].todo}</span>
                  </span>
                </button>
              ))}
            </div>
            <Button block variant="ghost" style={{ marginTop: 12 }} onClick={() => setStep('unsure')}>I’m not sure</Button>
            <p className="small" style={{ marginTop: 12 }}>You choose the result. Nothing on this screen measures the wood.</p>
          </>
        )}

        {step === 'unsure' && (
          <>
            <h1 className="display-m">No need to guess.</h1>
            <p className="body" style={{ margin: '8px 0 16px' }}>Nothing has been saved. Compare what you see with the two pictures, or wipe the board dry and try a fresh spot in good light.</p>
            <ResultCompare />
            <div className="stack-8" style={{ marginTop: 18 }}>
              <Button block onClick={() => setStep('result')}>I can tell now</Button>
              <Button block variant="ghost" onClick={() => { setDrops([]); setStep('drops'); }}>Try a fresh spot</Button>
              <Button block variant="text" onClick={() => { nav.pop(); toast('Nothing saved. Try again whenever you like.'); }}>Leave without saving</Button>
            </div>
          </>
        )}

        {step === 'beads' && (
          <div className="wt-done">
            <DropsArt kind="beads" label={false} className="small" />
            <h1 className="display-m" style={{ marginTop: 18 }}>You’re all set.</h1>
            <p className="lead" style={{ margin: '8px 0 0' }}>{RESULTS.beads.means} No oil needed today.</p>
            <p className="small" style={{ marginTop: 10 }}>Wipe the water off the board with a dry cloth.</p>
            {practice ? <p className="small" style={{ marginTop: 6 }}>This was a walkthrough. Nothing was saved.</p> : nextDate && <p className="small" style={{ marginTop: 6 }}>Saved. We’ll remind you for the next check on {nextDate}.</p>}
            <Button block style={{ marginTop: 22 }} onClick={() => { nav.pop(); if (!practice && active) toast('Check saved to your care plan.'); }}>Done</Button>
          </div>
        )}

        {step === 'soaks' && (
          <>
            <DropsArt kind="soaks" label={false} className="small" />
            <h1 className="display-m" style={{ marginTop: 18 }}>The wood is asking for oil.</h1>
            <p className="body" style={{ margin: '8px 0 6px' }}>{practice ? 'This was a walkthrough. Nothing was saved.' : 'Saved to your care plan. Oil it when you can: today, or in the next few days.'}</p>
            <p className="small" style={{ margin: '0 0 6px' }}>First, wipe the water off and let the board dry completely.</p>
            <div className="oil-choice" style={{ marginTop: 16 }}>
              <button className="choice" onClick={() => nav.replace('oil-guide')}><Icon name="check" size={18} /><span>I already have board oil</span></button>
              <button className="choice" onClick={() => setKit(true)}><Icon name="bag" size={18} /><span>I need board oil</span></button>
            </div>
            <Button block variant="text" style={{ marginTop: 10 }} onClick={() => { nav.pop(); if (!practice && active) toast('We’ll keep “Oil pending” on your Home until you oil them.'); }}>I’ll oil them later</Button>
            <OilSheet open={kit} onClose={() => setKit(false)} />
          </>
        )}
        <div style={{ marginTop: 22 }}><DemoNote>{practice ? 'Walkthrough with demo data. Nothing is saved.' : active ? 'Guided test with demo data. Results are saved only in this preview.' : 'Your plan starts when your boards are home, so this test is not saved.'}</DemoNote></div>
      </div>
    </>
  );
}

// ---------- Gift dates ----------
function GiftDates({ startAdd }) {
  const { user, updateUser, today } = useStore();
  const nav = useNav();
  const blank = () => ({ id: null, name: '', occasion: 'Birthday', m: today.getUTCMonth() + 1, d: today.getUTCDate(), once: false, y: today.getUTCFullYear() });
  const [edit, setEdit] = useState(() => (startAdd && user.gifts.length < MAX_GIFTS ? blank() : null));
  const [plan, setPlan] = useState(null);
  const gifts = user.gifts.map((g) => ({ g, ...giftInfo(g, today) })).sort((a, b) => (a.days ?? 9999) - (b.days ?? 9999));

  return (
    <div className="pad" style={{ marginTop: 20 }}>
      <p className="body" style={{ marginTop: 0 }}>Keep special dates close. We’ll remind you 21 days before and again 10 days before, with time to plan a gift.</p>
      {gifts.length === 0 && (
        <div style={{ marginTop: 14 }}>
          <Empty title="Keep a special date close" action={<Button small onClick={() => setEdit({ id: null, name: '', occasion: 'Birthday', m: today.getUTCMonth() + 1, d: today.getUTCDate(), once: false, y: today.getUTCFullYear() })}>Add a date</Button>}>
            A birthday, an anniversary, a housewarming. Just a first name and a day.
          </Empty>
        </div>
      )}
      <div style={{ marginTop: 8 }}>
        {gifts.map(({ g, date, days, stage, first, second, sentOn }) => (
          <div key={g.id} style={{ borderBottom: '1px solid var(--c-line)' }}>
            <button className="gift-card" style={{ borderBottom: 0 }} onClick={() => { const [m, d] = g.md.split('-').map(Number); setEdit({ id: g.id, name: g.name, occasion: g.occasion, m, d, once: !!g.y, y: g.y || today.getUTCFullYear() }); }}>
              <div className="date-badge">
                <span className="m">{date ? MONTHS_SHORT[date.getUTCMonth()] : '—'}</span>
                <span className="d">{date ? date.getUTCDate() : ''}</span>
              </div>
              <div>
                <div style={{ fontSize: 16.5, lineHeight: 1.3 }}>{giftWho(g)}</div>
                <div className="small">{date ? (days === 0 ? 'Today' : `In ${days} days`) : 'Date has passed'} · {g.y ? `One time, ${g.y}` : 'Every year'}</div>
              </div>
              <Icon name="edit" size={18} />
            </button>
            {date && (
              <div className="row wrap" style={{ gap: 6, padding: '0 0 14px 68px' }}>
                <span className={'tag' + (stage ? ' is-lav' : '')}>{stage ? (sentOn >= today ? 'Reminder goes out today' : `Reminder sent ${fmtShort(sentOn)}`) : `First reminder ${fmtShort(first)}`}</span>
                {stage !== 10 && <span className="tag">Second {fmtShort(second)}</span>}
                <button className="tag is-dark" onClick={() => setPlan(g)}>Plan a gift</button>
              </div>
            )}
          </div>
        ))}
      </div>
      {gifts.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <Button block variant="ghost" icon="plus" disabled={gifts.length >= MAX_GIFTS} onClick={() => setEdit({ id: null, name: '', occasion: 'Birthday', m: today.getUTCMonth() + 1, d: today.getUTCDate(), once: false, y: today.getUTCFullYear() })}>Add a date</Button>
          {gifts.length >= MAX_GIFTS && <p className="small muted" style={{ marginTop: 8 }}>You can keep up to {MAX_GIFTS} dates, the same as your current care plan.</p>}
        </div>
      )}
      {gifts[0]?.date && (
        <div className="card card-pad" style={{ marginTop: 20 }}>
          <div className="label">What the next reminder will say</div>
          <p style={{ margin: '6px 0 0', fontSize: 15.5 }}>
            <strong style={{ fontWeight: 500 }}>
              {gifts[0].days >= 11
                ? (gifts[0].g.occasion === 'Other' ? `A special day for ${gifts[0].g.name} is coming up` : `${giftWho(gifts[0].g)} is coming up`)
                : (gifts[0].g.occasion === 'Other' ? `A special day for ${gifts[0].g.name} is ${whenText(gifts[0].days)}` : `${giftWho(gifts[0].g)} is ${whenText(gifts[0].days)}`)}
            </strong>
          </p>
          <p className="small" style={{ margin: '4px 0 0' }}>{giftWho(gifts[0].g)} is on {fmtDate(gifts[0].date)}. There is no rush.</p>
        </div>
      )}
      <div style={{ marginTop: 16 }}><DemoNote>Simulated reminders. The schedule follows the existing care plan rules: 21 and 10 days ahead. Nothing is sent from this preview.</DemoNote></div>

      <GiftEditor value={edit} onClose={() => setEdit(null)} today={today} onSave={(v) => {
        updateUser((u) => {
          const md = `${String(v.m).padStart(2, '0')}-${String(v.d).padStart(2, '0')}`;
          const prev = u.gifts.find((x) => x.id === v.id);
          const g = { id: v.id || uid('g'), name: v.name.trim().slice(0, 60), occasion: v.occasion, md, addedAt: prev?.addedAt || iso(today), ...(v.once ? { y: v.y } : {}) };
          const i = u.gifts.findIndex((x) => x.id === v.id);
          if (i >= 0) u.gifts[i] = g; else u.gifts.push(g);
        });
        setEdit(null);
      }} onDelete={(id) => { updateUser((u) => { u.gifts = u.gifts.filter((x) => x.id !== id); }); setEdit(null); }} />

      <Sheet open={!!plan} onClose={() => setPlan(null)} title="Plan a gift">
        {plan && (
          <>
            <p className="body" style={{ marginTop: 0 }}>Something for {plan.name}’s kitchen, or a board made by you.</p>
            <button className="reminder-card tap" style={{ marginTop: 6 }} onClick={() => { setPlan(null); nav.push('presentation', { id: plan.occasion === 'Housewarming' ? 'golden-hour' : plan.occasion === 'Anniversary' ? 'love-like-rosemary' : 'copper-pot' }); }}>
              <div className="round-ico"><Icon name="grid" size={18} /></div>
              <div><div style={{ fontSize: 16 }}>Make them a board</div><div className="small">An idea for the day itself</div></div>
              <Icon name="chevron" size={18} />
            </button>
            <button className="reminder-card" style={{ marginTop: 8, opacity: 0.7 }} disabled>
              <div className="round-ico"><Icon name="gift" size={18} /></div>
              <div><div style={{ fontSize: 16 }}>Yndarena gifts</div><div className="small">Store link pending in this preview</div></div>
              <Icon name="chevron" size={18} />
            </button>
          </>
        )}
      </Sheet>
    </div>
  );
}

function GiftEditor({ value, onClose, onSave, onDelete, today }) {
  const [v, setV] = useState(value);
  useEffect(() => { setV(value); }, [value]);
  if (!v) return <Sheet open={false} onClose={onClose} />;
  const daysIn = new Date(Date.UTC(v.once ? v.y : 2024, v.m, 0)).getUTCDate();
  const thisYear = today.getUTCFullYear();
  const target = v.once ? new Date(Date.UTC(v.y, v.m - 1, v.d)) : null;
  const past = target && target < new Date(today.getTime() - DAY);
  const valid = v.name.trim() && v.d <= daysIn && !past;
  return (
    <Sheet open={!!value} onClose={onClose} title={v.id ? 'Edit date' : 'Add a date'} tall>
      <div className="stack-16">
        <label className="field">
          <span className="label">First name</span>
          <input className="input" value={v.name} maxLength={60} placeholder="Ana" onChange={(e) => setV({ ...v, name: e.target.value })} />
        </label>
        <div>
          <span className="label">Occasion</span>
          <div className="row wrap" style={{ gap: 6, marginTop: 8 }}>
            {OCCASION_TYPES.map((o) => <Chip key={o} active={v.occasion === o} onClick={() => setV({ ...v, occasion: o })}>{o}</Chip>)}
          </div>
        </div>
        <div className="row" style={{ gap: 14 }}>
          <label className="field grow">
            <span className="label">Month</span>
            <select className="input" value={v.m} onChange={(e) => setV({ ...v, m: +e.target.value })}>
              {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
            </select>
          </label>
          <label className="field" style={{ width: 90 }}>
            <span className="label">Day</span>
            <select className="input" value={v.d} onChange={(e) => setV({ ...v, d: +e.target.value })}>
              {Array.from({ length: 31 }, (_, i) => <option key={i} value={i + 1}>{i + 1}</option>)}
            </select>
          </label>
        </div>
        <label className="check">
          <input type="checkbox" checked={v.once} onChange={(e) => setV({ ...v, once: e.target.checked })} />
          <span className="box">{v.once && <Icon name="check" size={14} stroke={2} />}</span>
          <span>Only once, in a specific year. Otherwise we remind you every year.</span>
        </label>
        {v.once && (
          <label className="field">
            <span className="label">Year</span>
            <select className="input" value={v.y} onChange={(e) => setV({ ...v, y: +e.target.value })}>
              {Array.from({ length: 6 }, (_, i) => <option key={i} value={thisYear + i}>{thisYear + i}</option>)}
            </select>
          </label>
        )}
        {v.d > daysIn && <div className="err">That day doesn’t exist in {MONTHS[v.m - 1]}{v.once ? ' ' + v.y : ''}.</div>}
        {past && <div className="err">That date has already passed.</div>}
        <Button block disabled={!valid} onClick={() => onSave(v)}>{v.id ? 'Save changes' : 'Save date'}</Button>
        {v.id && <Button block variant="text" onClick={() => onDelete(v.id)}>Remove this date</Button>}
      </div>
    </Sheet>
  );
}
