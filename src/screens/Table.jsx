import { useMemo, useState } from 'react';
import { useNav } from '../nav.jsx';
import { useStore } from '../store.jsx';
import { useActions } from '../actions.js';
import { TopBar, Button, Icon, DemoNote, Segmented, Sprig, Kicker } from '../ui.jsx';
import { ReviewSheet, RecipeRow, MediaImg } from '../components.jsx';
import { TechPills } from './Presentation.jsx';
import BoardView from '../board/BoardView.jsx';
import { ITEMS, LAYER_COPY, styleOf } from '../data/catalog.js';
import { PRESENTATIONS } from '../data/presentations.js';
import { TECHNIQUES } from '../data/techniques.js';
import { resolveSource, shoppingFromItems, buildLayers, techniquesFor, recipesFor, totals, fmtQty } from '../lib.js';

// Lists what changed against the original presentation, so modified versions get honest guidance.
function changesFromOrigin(design) {
  if (design?.origin?.kind !== 'presentation') return [];
  const p = PRESENTATIONS[design.origin.id];
  const now = totals(design.items);
  const before = Object.fromEntries(p.groups.map((g) => [g.type, g.qty]));
  const out = [];
  const removed = Object.keys(before).filter((t) => !(t in now));
  const added = Object.keys(now).filter((t) => !(t in before));
  for (const r of [...removed]) {
    const swap = added.find((x) => ITEMS[r].subs.includes(x));
    if (swap) {
      out.push(`${ITEMS[swap].name} instead of ${ITEMS[r].name.toLowerCase()}`);
      removed.splice(removed.indexOf(r), 1);
      added.splice(added.indexOf(swap), 1);
    }
  }
  for (const t of added) out.push(`Added ${ITEMS[t].name.toLowerCase()}`);
  for (const t of removed) out.push(`Without ${ITEMS[t].name.toLowerCase()}`);
  for (const [t, q] of Object.entries(now)) {
    if (t in before && Math.abs(before[t] - q) > 0.01) out.push(`${ITEMS[t].name}: ${fmtQty(q, ITEMS[t].unit)} instead of ${fmtQty(before[t], ITEMS[t].unit)}`);
  }
  return out;
}

export default function Table({ params }) {
  const nav = useNav();
  const { user } = useStore();
  const a = useActions();
  const src = params.source;
  const s = resolveSource(src, user);
  const design = src.kind === 'design' ? user.designs[src.id] : null;
  const mode = src.kind === 'presentation' ? 'original' : src.kind === 'design' && design?.kind === 'scratch' ? 'scratch' : 'modified';
  const comp = src.kind === 'presentation' ? PRESENTATIONS[src.id].compositions.find((c) => c.id === src.compositionId) || PRESENTATIONS[src.id].compositions[0] : null;
  const items = s?.items || [];
  const layers = useMemo(() => buildLayers(items, comp?.tips), [items, comp]);
  const shop = useMemo(() => shoppingFromItems(items, s?.board), [items, s?.board]);
  const recipes = recipesFor(items);
  const techs = techniquesFor(items);
  const changes = changesFromOrigin(design);

  const [phase, setPhase] = useState('ready');
  const [tab, setTab] = useState('ingredients');
  const [done, setDone] = useState({});
  const [step, setStep] = useState(0);
  const [review, setReview] = useState(null);

  if (!s) return <div className="pad" style={{ paddingTop: 80 }}>This board is no longer available.</div>;

  const layerState = {};
  if (phase === 'build') {
    layers.forEach((l, i) => l.uids.forEach((u) => { layerState[u] = i < step ? 'done' : i === step ? 'current' : 'future'; }));
  }
  const finished = phase === 'finished';
  const toggle = (k) => setDone({ ...done, [k]: !done[k] });

  const badge = mode === 'original'
    ? { text: 'Yndarena sequence', cls: 'is-dark' }
    : mode === 'modified'
      ? { text: 'Updated for your version', cls: 'is-lav' }
      : { text: 'Guidance for your design', cls: 'is-sage' };

  const madeIt = () => {
    const entry = src.kind === 'presentation'
      ? { kind: 'presentation', refId: src.id, compositionId: comp.id, version: comp.name }
      : src.kind === 'community'
        ? { kind: 'community', refId: src.id, version: 'Shared version' }
        : { kind: 'design', refId: src.id, version: design.versions.length ? design.versions[design.versions.length - 1].label : 'Current version' };
    const madeId = a.markMade(entry);
    setReview({
      kind: entry.kind, refId: entry.refId, version: entry.version, madeId,
      noteKey: `${entry.kind}:${entry.refId}`, recipes,
      versionLabel: src.kind === 'presentation' ? `the ${comp.name} layout` : 'your version',
    });
  };

  const cur = layers[step];

  return (
    <>
      <TopBar close title={phase === 'ready' ? 'Get ready' : 'Build your board'} />
      <div className="pad" style={{ marginTop: 4 }}>
        <div className="row wrap" style={{ gap: 6 }}>
          <span className={'tag ' + badge.cls}>{badge.text}</span>
          {s.subtitle && <span className="tag">{s.subtitle}</span>}
        </div>
        <h1 className="h1" style={{ marginTop: 10, fontSize: 32 }}>{s.title}</h1>
      </div>

      <div className="pad" style={{ marginTop: 14 }}>
        <Segmented value={phase === 'ready' ? 'ready' : 'build'} onChange={(v) => { setPhase(v); if (v === 'build') setStep(0); }} options={[{ id: 'ready', label: '1 · Get ready' }, { id: 'build', label: '2 · Build your board' }]} />
      </div>

      {phase === 'ready' && (
        <>
          <div className="pad" style={{ marginTop: 16 }}>
            {mode === 'scratch' && <DemoNote>This is your own design, so there’s no tested sequence. Below is guidance based on the groups and techniques you chose.</DemoNote>}
            {mode === 'modified' && changes.length > 0 && (
              <div className="card card-pad">
                <div className="label">Changed from the original</div>
                {changes.map((c) => <div key={c} className="small" style={{ marginTop: 4 }}>{c}</div>)}
              </div>
            )}
          </div>
          <div className="chips" style={{ marginTop: 14 }}>
            {[['ingredients', 'Ingredients'], ['tools', 'Bowls & tools'], ['prep', `Make ahead${recipes.length ? ' (' + recipes.length + ')' : ''}`], ['tech', 'Techniques']].map(([k, l]) => (
              <button key={k} className={'chip' + (tab === k ? ' is-active' : '')} onClick={() => setTab(k)}>{l}</button>
            ))}
          </div>
          <div className="pad" style={{ marginTop: 10 }}>
            {tab === 'ingredients' && [...shop.groceries, ...shop.pantry].map((l) => (
              <button key={l.key + l.unit} className={'check-row' + (done['i:' + l.key] ? ' is-done' : '')} onClick={() => toggle('i:' + l.key)}>
                <span className="box">{done['i:' + l.key] && <Icon name="check" size={14} stroke={2} />}</span>
                <span className="txt">{l.name}{l.from.length > 0 && <span className="small" style={{ display: 'block', textDecoration: 'none' }}>For {l.from.join(', ')}</span>}</span>
                <span className="q">{l.label}</span>
              </button>
            ))}
            {tab === 'tools' && [...shop.serveware, ...shop.tools].map((t) => (
              <button key={t} className={'check-row' + (done['t:' + t] ? ' is-done' : '')} onClick={() => toggle('t:' + t)}>
                <span className="box">{done['t:' + t] && <Icon name="check" size={14} stroke={2} />}</span>
                <span className="txt">{t}</span>
              </button>
            ))}
            {tab === 'prep' && (recipes.length ? recipes.map((r) => <RecipeRow key={r} id={r} />) : <p className="body">Nothing to make ahead. Everything goes straight on the board.</p>)}
            {tab === 'tech' && (
              <div style={{ paddingTop: 8 }}>
                <p className="small" style={{ marginTop: 0 }}>Short demos for the cuts and folds on this board.</p>
                <TechPills ids={techs} />
              </div>
            )}
          </div>
          <div className="sticky-cta" style={{ marginTop: 22 }}>
            <Button block arrow onClick={() => { setPhase('build'); setStep(0); }}>Start building</Button>
          </div>
        </>
      )}

      {phase !== 'ready' && (
        <>
          <div className="build-board" style={{ marginTop: 14 }}>
            <BoardView boardId={s.board} items={items} uid={'build'} layerState={finished ? null : layerState} />
          </div>
          {!finished && cur && (
            <div className="pad" style={{ marginTop: 14 }}>
              <div className="step-dots">{layers.map((_, i) => <span key={i} className={i <= step ? 'on' : ''} />)}</div>
              <Kicker className="mt" ><span style={{ display: 'block', marginTop: 14 }}>Layer {step + 1} of {layers.length}</span></Kicker>
              <h2 className="h2" style={{ marginTop: 4 }}>{LAYER_COPY[cur.cat].title}</h2>
              <p className="body" style={{ margin: '6px 0 0' }}>{cur.tip || LAYER_COPY[cur.cat].text}</p>
              {mode === 'modified' && <p className="small muted" style={{ margin: '6px 0 0' }}>Positions follow your version. The highlighted spots show where each group goes.</p>}
              <div style={{ marginTop: 10 }}>
                {Object.entries(cur.uids.reduce((acc, u) => { const it = items.find((x) => x.uid === u); const k = it.type + '|' + it.style; acc[k] = acc[k] || { it, qty: 0, n: 0 }; acc[k].qty += it.qty; acc[k].n += 1; return acc; }, {})).map(([k, v]) => {
                  const st = styleOf(v.it.type, v.it.style);
                  return (
                    <div key={k} className="ing-row">
                      <div>
                        <div>{ITEMS[v.it.type].name} <span className="small">· {st.label.toLowerCase()}{v.n > 1 ? `, in ${v.n} spots` : ''}</span></div>
                        <button className="note" style={{ borderBottom: '1px solid var(--c-line-strong)' }} onClick={() => nav.push('technique', { id: st.tech })}>How to: {TECHNIQUES[st.tech].name}</button>
                      </div>
                      <span className="q">{fmtQty(v.qty, ITEMS[v.it.type].unit)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {finished && (
            <div className="pad" style={{ marginTop: 18, textAlign: 'center' }}>
              <div className="trio" style={{ justifyContent: 'center' }}><Sprig className="sprout" /><Sprig className="sprout" /><Sprig className="sprout" /></div>
              <h2 className="h1" style={{ marginTop: 14 }}>Ready to share.</h2>
              <p className="lead" style={{ margin: '8px 0 0' }}>It doesn’t need to look perfect. It only needs the people around it.</p>
              {comp?.media?.topView && (
                <div style={{ marginTop: 18, textAlign: 'left' }}>
                  <div className="label" style={{ marginBottom: 8 }}>Reference photo of this layout</div>
                  <div className="photo-hero" style={{ borderRadius: 12, overflow: 'hidden' }}><MediaImg id={comp.media.topView} /></div>
                  <p className="small muted" style={{ marginTop: 8 }}>Yours doesn’t need to match it. The guide above follows the layout you chose.</p>
                </div>
              )}
            </div>
          )}
          {mode === 'original' && !finished && <div className="pad" style={{ marginTop: 14 }}><DemoNote>Preview: this sequence follows Yndarena’s layer order but has not been kitchen-tested yet.</DemoNote></div>}
          {mode === 'scratch' && !finished && <div className="pad" style={{ marginTop: 14 }}><DemoNote>General guidance by layer for your own design. Not a tested sequence.</DemoNote></div>}
          <div className="sticky-cta" style={{ marginTop: 18 }}>
            {!finished ? (
              <>
                <Button variant="ghost" small onClick={() => (step === 0 ? setPhase('ready') : setStep(step - 1))}>Back</Button>
                <Button small className="grow" arrow onClick={() => (step < layers.length - 1 ? setStep(step + 1) : setPhase('finished'))}>{step < layers.length - 1 ? 'Next layer' : 'Finish'}</Button>
              </>
            ) : (
              <>
                <Button variant="ghost" small onClick={() => nav.pop()}>Close</Button>
                <Button small className="grow" onClick={madeIt}>I made it</Button>
              </>
            )}
          </div>
        </>
      )}
      <ReviewSheet key={review?.madeId} open={!!review} onClose={() => { setReview(null); nav.pop(); }} target={review} />
    </>
  );
}
