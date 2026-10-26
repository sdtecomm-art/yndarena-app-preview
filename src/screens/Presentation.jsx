import { useEffect, useState } from 'react';
import { useNav } from '../nav.jsx';
import { useActions } from '../actions.js';
import { TopBar, Kicker, Button, Icon, PhotoPending, DemoNote, Sprig } from '../ui.jsx';
import { SaveButton, RecipeRow } from '../components.jsx';
import BoardView from '../board/BoardView.jsx';
import { PRESENTATIONS, OCCASIONS } from '../data/presentations.js';
import { ITEMS, BOARDS, LAYER_COPY } from '../data/catalog.js';
import { TECHNIQUES } from '../data/techniques.js';
import { RECIPES } from '../data/recipes.js';
import { presentationItems, techniquesFor, fmtQty, buildLayers, shoppingFromItems } from '../lib.js';

export function TechPills({ ids }) {
  const nav = useNav();
  return (
    <div className="row wrap" style={{ gap: 8 }}>
      {ids.map((t) => (
        <button key={t} className="tech-pill" onClick={() => nav.push('technique', { id: t })}>
          <span className="round"><Icon name="play" size={12} /></span>
          {TECHNIQUES[t].name}
        </button>
      ))}
    </div>
  );
}

export function IngredientList({ items }) {
  const nav = useNav();
  const groups = {};
  for (const it of items) groups[it.type] = (groups[it.type] || 0) + it.qty;
  return (
    <div>
      {Object.entries(groups).map(([type, qty]) => {
        const it = ITEMS[type];
        const r = it.recipe && RECIPES[it.recipe];
        return (
          <div key={type} className="ing-row">
            <div>
              {r ? (
                <button onClick={() => nav.push('recipe', { id: it.recipe })} style={{ borderBottom: '1px solid var(--c-taupe)' }}>{it.name}</button>
              ) : it.name}
              {r && <div className="note">Homemade · recipe makes {fmtQty(r.yield.qty, r.yield.unit)}</div>}
            </div>
            <span className="q">{fmtQty(qty, it.unit)}{it.unit === 'each' ? '' : ''}</span>
          </div>
        );
      })}
    </div>
  );
}

export function Swaps({ items }) {
  const seen = new Set();
  const rows = [];
  for (const it of items) {
    if (seen.has(it.type)) continue;
    seen.add(it.type);
    const subs = ITEMS[it.type].subs;
    if (subs.length) rows.push([ITEMS[it.type].name, subs.map((s) => ITEMS[s].name).join(' or ')]);
  }
  if (!rows.length) return <p className="small">No swaps for this board.</p>;
  return (
    <div>
      {rows.map(([a, b]) => (
        <div key={a} className="ing-row">
          <span>{a}</span>
          <span className="q" style={{ textAlign: 'right', whiteSpace: 'normal' }}>{b}</span>
        </div>
      ))}
    </div>
  );
}

export default function Presentation({ params }) {
  const nav = useNav();
  const a = useActions();
  const p = PRESENTATIONS[params.id];
  const [compId, setCompId] = useState(params.comp || p.compositions[0].id);
  const comp = p.compositions.find((c) => c.id === compId);
  const items = presentationItems(params.id, compId);
  const techs = techniquesFor(items);
  const layers = buildLayers(items, comp.tips);
  const shop = shoppingFromItems(items, p.board);
  const recipes = [...new Set(p.groups.map((g) => ITEMS[g.type].recipe).filter(Boolean))];
  const occ = OCCASIONS.find((o) => o.id === p.occasion);

  useEffect(() => { a.setRecent('presentation', params.id, { comp: compId }); }, [compId]); // eslint-disable-line

  return (
    <>
      <TopBar transparent title="" right={<SaveButton kind="presentation" id={params.id} />} />
      <div style={{ marginTop: 'calc(-1 * (var(--safe-top) + 54px))' }}>
        <PhotoPending className="hero-board">
          <div style={{ height: 'calc(var(--safe-top) + 40px)' }} />
          <BoardView key={compId} boardId={p.board} items={items} uid={'pres-' + compId} label={`${p.name}, ${comp.name} layout`} />
        </PhotoPending>
      </div>

      {p.compositions.length > 1 && (
        <div style={{ marginTop: 14 }}>
          <div className="pad row-between" style={{ marginBottom: 8 }}>
            <Kicker>Layouts · same ingredients</Kicker>
            <span className="small" style={{ fontSize: 12.5 }}>{p.compositions.findIndex((c) => c.id === compId) + 1} of {p.compositions.length}</span>
          </div>
          <div className="comp-switch">
            {p.compositions.map((c) => (
              <button key={c.id} className={'comp-card' + (c.id === compId ? ' is-active' : '')} onClick={() => setCompId(c.id)} aria-pressed={c.id === compId}>
                <div style={{ background: 'var(--table)', borderRadius: 6 }}>
                  <BoardView boardId={p.board} items={presentationItems(params.id, c.id)} uid={'cs-' + c.id} />
                </div>
                <div className="comp-name">{c.name}</div>
              </button>
            ))}
          </div>
          <p className="small pad" style={{ margin: '10px 0 0' }}><em>{comp.name}.</em> {comp.desc}</p>
        </div>
      )}

      <div className="pad" style={{ marginTop: 22 }}>
        <Kicker>{occ.label} · {p.context}</Kicker>
        <h1 className="h1" style={{ marginTop: 6, fontSize: 40 }}>{p.name}</h1>
        <p className="lead" style={{ margin: '10px 0 0' }}>{p.intro}</p>
      </div>

      <div className="facts" style={{ margin: '20px var(--gut) 0' }}>
        <div><div className="v">{p.time}<span style={{ fontSize: 15 }}> min</span></div><div className="k">{p.active} min hands-on</div></div>
        <div><div className="v">{p.serves}</div><div className="k">Serves</div></div>
        <div><div className="v" style={{ fontSize: 19, paddingTop: 4 }}>{BOARDS[p.board].name}</div><div className="k">Board</div></div>
      </div>

      
      <div className="pad section" style={{ marginTop: 14 }}>
        <div className="row-between">
          <h2 className="h2">Ingredients</h2>
          <button className="link" onClick={() => { const id = a.ensureList({ kind: 'presentation', id: params.id, compositionId: compId }); nav.push('shopping', { id }); }}>Shopping list</button>
        </div>
        <IngredientList items={items} />
      </div>

      <div className="pad section">
        <h2 className="h2">Bowls and tools</h2>
        <div style={{ marginTop: 6 }}>
          {[...shop.serveware, ...shop.tools].map((t) => <div key={t} className="ing-row"><span>{t}</span></div>)}
        </div>
      </div>

      {recipes.length > 0 && (
        <div className="pad section">
          <h2 className="h2">Make ahead</h2>
          <p className="small" style={{ margin: '4px 0 0' }}>Homemade parts of this board. Each recipe makes a little more than the board needs, so you can refill.</p>
          {recipes.map((rid) => <RecipeRow key={rid} id={rid} />)}
        </div>
      )}

      <div className="pad section">
        <h2 className="h2">Techniques in this layout</h2>
        <p className="small" style={{ margin: '4px 0 12px' }}>Cuts and folds change with the layout. Tap one for a short demo.</p>
        <TechPills ids={techs} />
      </div>

      <div className="pad section">
        <h2 className="h2">Built in {layers.length} layers</h2>
        <div style={{ marginTop: 8 }}>
          {layers.map((l, i) => (
            <div key={l.cat} className="ing-row" style={{ justifyContent: 'flex-start' }}>
              <span className="label" style={{ width: 26, paddingTop: 3 }}>{String(i + 1).padStart(2, '0')}</span>
              <div>
                <div>{LAYER_COPY[l.cat].title}</div>
                <div className="note">{l.tip || LAYER_COPY[l.cat].text}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pad section">
        <h2 className="h2">Swaps</h2>
        <Swaps items={items} />
      </div>

      <div className="memory">
        <p>{p.memory}</p>
        <Sprig />
      </div>

      <div className="pad" style={{ marginTop: 20 }}>
        <DemoNote>Preview content. Quantities and steps are representative and have not been kitchen-tested yet. Illustrations stand in for photos.</DemoNote>
      </div>
      <div className="sticky-cta">
        <Button variant="ghost" small className="grow" icon="edit" onClick={() => { const id = a.fromPresentation(params.id, compId); nav.push('designer', { id }); }}>Make it yours</Button>
        <Button small className="grow" onClick={() => nav.push('table', { source: { kind: 'presentation', id: params.id, compositionId: compId } })}>Bring it to the table</Button>
      </div>
    </>
  );
}
