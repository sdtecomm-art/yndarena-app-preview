import { useEffect, useState } from 'react';
import { useNav } from '../nav.jsx';
import { useActions } from '../actions.js';
import { TopBar, Kicker, Button, Icon, DemoNote, Segmented, Chip } from '../ui.jsx';
import { SaveButton, ItemIcon } from '../components.jsx';
import { TechPills } from './Presentation.jsx';
import BoardView from '../board/BoardView.jsx';
import { MEALS, SIDE_IDEAS } from '../data/meals.js';
import { ITEMS, BOARDS } from '../data/catalog.js';
import { mealItems, mealLayout, fmtQty, techniquesFor } from '../lib.js';
import { groupLayout } from '../board/geometry.js';

function ComponentRow({ it, n }) {
  const item = ITEMS[it.type];
  const l = groupLayout(it);
  const what = item.cat === 'mains' ? 'Main' : item.cat === 'garnish' ? 'Optional finish' : item.cat === 'sides' ? 'Side' : item.cat === 'bowls' ? 'In a small bowl' : 'To share';
  const refill = it.placed != null && it.placed < it.qty;
  return (
    <div className="list-row comp-row" style={{ cursor: 'default' }}>
      <span className="comp-n" aria-label={`Number ${n} on the layout`}>{n}</span>
      <div className="thumb" style={{ width: 48, height: 48, borderRadius: 24 }}><ItemIcon type={it.type} style={it.style} size={48} /></div>
      <div className="grow">
        <div>{item.name}</div>
        <div className="sub">{what}{l.container ? ` · ${l.container.label}` : ''}{refill ? ` · ${fmtQty(it.placed, item.unit)} on the board, the rest to refill` : ''}</div>
      </div>
      <span className="small">{fmtQty(it.qty, item.unit)}</span>
    </div>
  );
}

// An everyday meal or a board to share. Photo and Layout are the same scene: Photo is clean, Layout adds the aids.
export default function Meal({ params }) {
  const nav = useNav();
  const a = useActions();
  const m = MEALS[params.id];
  const [view, setView] = useState('photo');
  const [layoutId, setLayoutId] = useState(params.layout || m.layouts[0].id);
  const layout = mealLayout(params.id, layoutId);
  const items = mealItems(params.id, layout.id);
  const numbered = items.map((it, i) => ({ it, n: i + 1 }));
  const onBoard = numbered.filter((x) => !x.it.alongside), alongside = numbered.filter((x) => x.it.alongside);
  const pending = items.filter((i) => ITEMS[i.type].pending);
  const hasSide = items.some((i) => ITEMS[i.type].side);
  const sides = Object.values(SIDE_IDEAS).filter((s) => !items.some((i) => i.type === s.item));
  const techs = techniquesFor(items);
  const share = m.kind === 'share';

  useEffect(() => { a.setRecent('meal', params.id); }, []); // eslint-disable-line

  const makeIt = () => { const id = a.fromMeal(params.id, layout.id); nav.push('designer', { id }); };
  const openList = () => { const id = a.ensureList({ kind: 'meal', id: params.id }); nav.push('shopping', { id }); };

  return (
    <>
      <TopBar transparent title="" right={<SaveButton kind="meal" id={params.id} />} />
      <div className="meal-stage">
        <div className="scene-frame">
          <BoardView key={layout.id} boardId={m.board} items={items} uid={'meal-' + params.id} scene={view} label={`${m.name}, ${view === 'photo' ? 'photo view' : 'layout view with numbers'}`} />
        </div>
        <div className="scene-bar">
          <Segmented value={view} onChange={setView} options={[{ id: 'photo', label: 'Photo' }, { id: 'layout', label: 'Layout' }]} />
          <span className="scene-cap">{view === 'photo' ? 'Rendered from this layout' : 'Numbers match the list below'}</span>
        </div>
      </div>
      {m.layouts.length > 1 && (
        <div className="chips" style={{ marginTop: 12 }} role="group" aria-label="Arrangement">
          {m.layouts.map((l) => <Chip key={l.id} active={l.id === layout.id} onClick={() => setLayoutId(l.id)}>{l.name}</Chip>)}
        </div>
      )}
      <p className="small pad hero-note">
        {pending.length
          ? `Same board, food and sizes in both views. ${pending.length === items.length ? 'Photos of this meal are' : 'Some photos are'} still in production: the outlines show the real size of each dish.`
          : 'Same board, food and sizes in both views. Food images are AI cutouts, not photos of a tested meal.'}
      </p>

      <div className="pad" style={{ marginTop: 14 }}>
        <Kicker>{share ? 'Board to share' : `Everyday meal · ${m.category}`}</Kicker>
        <h1 className="h1" style={{ marginTop: 6, fontSize: 38 }}>{m.name}</h1>
        <p className="lead" style={{ margin: '10px 0 0' }}>{m.description}</p>
      </div>

      <div className="facts" style={{ margin: '20px var(--gut) 0' }}>
        <div><div className="v">{m.minutes}<span style={{ fontSize: 15 }}> min</span></div><div className="k">To assemble</div></div>
        <div><div className="v">{m.serves}</div><div className="k">Serves</div></div>
        <div><div className="v" style={{ fontSize: 19, paddingTop: 4 }}>{BOARDS[m.board].name}</div><div className="k">Board</div></div>
      </div>
      <p className="small pad" style={{ margin: '10px 0 0' }}>{m.cook || 'Cooking is not included: cook it your usual way, or use store-bought.'}</p>
      <div className="action-bar">
        <Button variant="ghost" small className="grow" onClick={openList}>Shopping list</Button>
        <Button small className="grow" icon="edit" onClick={makeIt}>Make it yours</Button>
      </div>

      <div className="pad section" style={{ marginTop: 14 }}>
        <h2 className="h2">Serve it</h2>
        <ol className="serve-steps">{m.serving.map((s) => <li key={s}><span>{s}</span></li>)}</ol>
        {m.scale && <p className="small" style={{ marginTop: 10 }}>{m.scale}</p>}
      </div>

      <div className="pad section">
        <h2 className="h2">On the board</h2>
        <div style={{ marginTop: 6 }}>{onBoard.map(({ it, n }) => <ComponentRow key={it.uid} it={it} n={n} />)}</div>
        {alongside.length > 0 && (
          <>
            <h3 className="h3" style={{ fontSize: 19, marginTop: 18 }}>Alongside</h3>
            <p className="small" style={{ margin: '2px 0 0' }}>Serves {m.serves} is the whole {share ? 'board' : 'meal'}. These go next to the board, on a plate or in their own bowl.</p>
            <div style={{ marginTop: 4 }}>{alongside.map(({ it, n }) => <ComponentRow key={it.uid} it={it} n={n} />)}</div>
          </>
        )}
        <p className="small" style={{ marginTop: 10 }}>Laid out for a 33 × 24 cm board (13 × 9.5 in), using estimated sizes. {layout.note || ''}</p>
        {hasSide && !share && <p className="small" style={{ marginTop: 10 }}>Prefer another side? In Make it yours you can swap or remove it, or add {sides.map((s) => s.name).join(', ').replace(/, ([^,]*)$/, ' or $1')}.</p>}
      </div>

      <div className="pad section">
        <div className="row-between">
          <h2 className="h2">What you’ll need</h2>
          <button className="link" onClick={openList}>Shopping list</button>
        </div>
        <div style={{ marginTop: 6 }}>{m.ingredients.map((x) => <div key={x} className="ing-row"><span>{x}</span></div>)}</div>
      </div>

      {techs.length > 0 && (
        <div className="pad section">
          <h2 className="h2">Techniques</h2>
          <div style={{ marginTop: 10 }}><TechPills ids={techs} /></div>
        </div>
      )}

      <div className="pad section">
        <details className="quick-prep card card-pad">
          <summary>
            <span><span className="label">Optional</span><span className="h3" style={{ display: 'block', fontSize: 19, marginTop: 4 }}>Quick prep</span></span>
            <span className="chev"><Icon name="chevron" size={18} /></span>
          </summary>
          <p className="small" style={{ margin: '10px 0 4px' }}>Cook it your usual way, or use store-bought. Nothing here is required, and it is not part of the assembly minutes.</p>
          {m.quickPrep.map((x) => <div key={x} className="ing-row"><span>{x}</span></div>)}
        </details>
      </div>

      <div className="pad section">
        <div className="card card-pad">
          <div className="label">Board tips</div>
          <p className="body" style={{ margin: '6px 0 0' }}>Serve cooked food on a clean, dry board, and keep raw meat on a separate cutting board. Let hot pans and baking dishes rest on a trivet, not on the board.</p>
        </div>
      </div>

      <div className="pad" style={{ marginTop: 20 }}>
        <DemoNote>Preview content. A serving guide, not a kitchen-tested recipe. Minutes count from when the food is ready.</DemoNote>
      </div>
      <div className="sticky-cta">
        <Button variant="ghost" small className="grow" onClick={openList}>Shopping list</Button>
        <Button small className="grow" icon="edit" onClick={makeIt}>Make it yours</Button>
      </div>
    </>
  );
}
