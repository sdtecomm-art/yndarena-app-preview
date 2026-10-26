import { useEffect, useState } from 'react';
import { useNav } from '../nav.jsx';
import { useActions } from '../actions.js';
import { useStore } from '../store.jsx';
import { TopBar, Kicker, Button, Icon, DemoNote } from '../ui.jsx';
import { ItemIcon } from '../components.jsx';
import { TECHNIQUES, TECH_GROUPS } from '../data/techniques.js';
import { ITEMS, styleOf } from '../data/catalog.js';
import { PRESENTATIONS, PRESENTATION_ORDER } from '../data/presentations.js';
import { COMMUNITY, COMMUNITY_ORDER } from '../data/community.js';
import { uid } from '../lib.js';

const STEP_MS = 3200;

function findUse(tid) {
  for (const pid of PRESENTATION_ORDER) {
    for (const c of PRESENTATIONS[pid].compositions) {
      if (c.place.some((p) => styleOf(p.g, p.s).tech === tid)) return { kind: 'presentation', id: pid, comp: c.id, name: `${PRESENTATIONS[pid].name}, ${c.name}` };
    }
  }
  for (const cid of COMMUNITY_ORDER) {
    if (COMMUNITY[cid].items.some((p) => styleOf(p.type, p.style).tech === tid)) return { kind: 'community', id: cid, name: COMMUNITY[cid].name };
  }
  return null;
}

// Demo player: illustrated steps standing in for Yndarena's own short videos.
function DemoPlayer({ t }) {
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(true);
  useEffect(() => {
    if (!playing) return;
    const id = setTimeout(() => setI((x) => (x + 1) % t.steps.length), STEP_MS);
    return () => clearTimeout(id);
  }, [i, playing, t.steps.length]);
  const k = (i + 1) / t.steps.length;
  return (
    <div className="demo-stage" onClick={() => setPlaying(!playing)} role="button" aria-label={playing ? 'Pause demo' : 'Play demo'}>
      <div className="demo-progress">
        {t.steps.map((_, j) => <span key={j} className={j < i ? 'done' : j === i && playing ? 'cur' : j === i ? 'done' : ''}><i key={i + '-' + j} /></span>)}
      </div>
      <div key={i} className="demo-art" style={{ transform: `scale(${0.7 + 0.3 * k})`, opacity: 0.55 + 0.45 * k }}>
        <ItemIcon type={t.demoType} style={t.demoStyle} size={210} />
      </div>
      <div key={'t' + i} className="demo-step-txt"><span className="label" style={{ marginRight: 8 }}>Step {i + 1}</span>{t.steps[i]}</div>
      {!playing && <div style={{ position: 'absolute', width: 56, height: 56, borderRadius: 28, background: 'rgba(250,245,239,.9)', display: 'grid', placeItems: 'center' }}><Icon name="play" /></div>}
    </div>
  );
}

export default function Technique({ params }) {
  const nav = useNav();
  const a = useActions();
  const { updateUser } = useStore();
  const t = TECHNIQUES[params.id];
  const use = findUse(params.id);
  const [type, style] = (() => {
    const tp = t.demoType;
    const st = ITEMS[tp].styles.find((s) => s.tech === params.id) || ITEMS[tp].styles[0];
    return [tp, st.id];
  })();

  const tryOnBoard = () => {
    const id = a.scratch(ITEMS[type].cat === 'produce' ? 'fruits-veg' : 'cheese-bread');
    updateUser((u) => {
      const d = u.designs[id];
      d.name = `Practice: ${t.name}`;
      d.items.push({ uid: uid('it'), type, qty: ITEMS[type].baseQty, x: 300, y: 200, r: 0, style });
    });
    nav.push('designer', { id });
  };

  return (
    <>
      <TopBar title="Technique" />
      <DemoPlayer t={t} />
      <div className="pad" style={{ marginTop: 10 }}>
        <DemoNote>Demo animation. Yndarena’s own short video will replace it.</DemoNote>
      </div>
      <div className="pad" style={{ marginTop: 18 }}>
        <Kicker>{TECH_GROUPS.find((g) => g.id === t.group).label} · {t.minutes} min</Kicker>
        <h1 className="h1" style={{ marginTop: 6 }}>{t.name}</h1>
        <p className="lead" style={{ margin: '8px 0 0' }}>{t.summary}</p>
      </div>

      <div className="pad row" style={{ marginTop: 18, gap: 10 }}>
        <Button variant="ghost" small className="grow" onClick={tryOnBoard}>Try it on a board</Button>
        {use && (
          <Button small className="grow" onClick={() => (use.kind === 'presentation' ? nav.push('presentation', { id: use.id, comp: use.comp }) : nav.push('community', { id: use.id }))}>See it in a presentation</Button>
        )}
      </div>
      {use && <p className="small pad" style={{ marginTop: 8 }}>Used in {use.name}.</p>}

      <div className="pad section">
        <h2 className="h2">Steps</h2>
        <ol style={{ listStyle: 'none', padding: 0, margin: '8px 0 0' }}>
          {t.steps.map((s, i) => (
            <li key={i} className="ing-row" style={{ justifyContent: 'flex-start', gap: 14 }}>
              <span className="label" style={{ paddingTop: 4, width: 22 }}>{String(i + 1).padStart(2, '0')}</span>
              <span>{s}</span>
            </li>
          ))}
        </ol>
      </div>

      {t.tools.length > 0 && (
        <div className="pad section">
          <h2 className="h2">Tools</h2>
          {t.tools.map((x) => <div key={x} className="ing-row"><span>{x}</span></div>)}
        </div>
      )}

      <div className="pad section">
        <h2 className="h2">Size guide</h2>
        <p className="body" style={{ margin: '6px 0 0' }}>{t.sizing}</p>
      </div>

      <div className="pad section">
        <h2 className="h2">Works with</h2>
        <div className="row wrap" style={{ gap: 8, marginTop: 10 }}>
          {t.compatible.map((c) => <span key={c} className="tag">{ITEMS[c].name}</span>)}
        </div>
      </div>

      {t.simpler && (
        <div className="pad section">
          <div className="card card-pad">
            <div className="label">Simpler option</div>
            <p className="body" style={{ margin: '6px 0 0' }}>{t.simpler}</p>
          </div>
        </div>
      )}
    </>
  );
}

