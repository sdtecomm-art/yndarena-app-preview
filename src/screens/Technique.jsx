import { useState } from 'react';
import { useNav } from '../nav.jsx';
import { useActions } from '../actions.js';
import { useStore } from '../store.jsx';
import { TopBar, Kicker, Button, DemoNote } from '../ui.jsx';
import { TechniqueVideo, techniqueVideo, stepOf } from './TechniqueVideo.jsx';
import { TECHNIQUES, TECH_GROUPS } from '../data/techniques.js';
import { ITEMS, styleOf } from '../data/catalog.js';
import { PRESENTATIONS, PRESENTATION_ORDER } from '../data/presentations.js';
import { COMMUNITY, COMMUNITY_ORDER } from '../data/community.js';
import { uid } from '../lib.js';

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

export default function Technique({ params }) {
  const nav = useNav();
  const a = useActions();
  const { updateUser } = useStore();
  const t = TECHNIQUES[params.id];
  const video = techniqueVideo(t, params.id);
  const [seg, setSeg] = useState(null);
  const hasSegments = video.status === 'ready' && video.segments.length > 0;
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
      <TechniqueVideo t={t} video={video} seg={seg} onSeg={setSeg} />
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
        {t.stepsStatus === 'provisional' && (
          <div style={{ marginTop: 8 }}><DemoNote>Provisional script. The steps will be confirmed by the person who demonstrates the technique on camera.</DemoNote></div>
        )}
        <ol style={{ listStyle: 'none', padding: 0, margin: '8px 0 0' }}>
          {t.steps.map(stepOf).map((s, i) => (
            <li key={i} className="ing-row" style={{ justifyContent: 'flex-start', gap: 14 }}>
              <span className="label" style={{ paddingTop: 4, width: 22 }}>{String(i + 1).padStart(2, '0')}</span>
              <span className="grow">
                {s.title && <strong style={{ fontWeight: 500, display: 'block' }}>{s.title}</strong>}
                {s.text}
              </span>
              {hasSegments && video.segments.some((g) => g.step === i) && (
                <button className="link" onClick={() => setSeg(i)}>Watch</button>
              )}
            </li>
          ))}
        </ol>
      </div>

      {video.status !== 'ready' && video.shotPlan?.length > 0 && (
        <div className="pad section">
          <h2 className="h2">What the video will show</h2>
          <p className="small" style={{ margin: '4px 0 6px' }}>Hands only, on the real board, at normal speed. Each step will be playable on its own.</p>
          {video.shotPlan.map((x, i) => (
            <div key={i} className="ing-row" style={{ justifyContent: 'flex-start', gap: 14 }}>
              <span className="label" style={{ paddingTop: 4, width: 22 }}>{String(i + 1).padStart(2, '0')}</span>
              <span>{x}</span>
            </div>
          ))}
        </div>
      )}

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

