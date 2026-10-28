import { useEffect, useState } from 'react';
import { useNav } from '../nav.jsx';
import { useActions } from '../actions.js';
import { TopBar, Kicker, Button, Icon, DemoNote, Segmented } from '../ui.jsx';
import { SaveButton, MediaImg, ItemIcon } from '../components.jsx';
import BoardView from '../board/BoardView.jsx';
import { MEALS, SIDE_IDEAS } from '../data/meals.js';
import { ITEMS, BOARDS } from '../data/catalog.js';
import { mealItems, fmtQty } from '../lib.js';
import { groupLayout } from '../board/geometry.js';

function ComponentRow({ it }) {
  const item = ITEMS[it.type];
  const l = groupLayout(it);
  const what = item.cat === 'mains' ? 'Main' : item.cat === 'garnish' ? 'Optional finish' : 'Side';
  return (
    <div className="list-row" style={{ cursor: 'default' }}>
      <div className="thumb" style={{ width: 52, height: 52, borderRadius: 26 }}><ItemIcon type={it.type} style={it.style} size={52} /></div>
      <div className="grow"><div>{item.name}</div><div className="sub">{what}{l.container ? ` · ${l.container.label}` : ''}</div></div>
      <span className="small">{fmtQty(it.qty, item.unit)}</span>
    </div>
  );
}

// An everyday meal: the whole board first, up to three serving steps, then optional quick prep.
export default function Meal({ params }) {
  const nav = useNav();
  const a = useActions();
  const m = MEALS[params.id];
  const [view, setView] = useState('photo');
  const items = mealItems(params.id);
  const onBoard = items.filter((i) => !i.alongside), alongside = items.filter((i) => i.alongside);
  const sides = Object.values(SIDE_IDEAS).filter((s) => !items.some((i) => i.type === s.item));

  useEffect(() => { a.setRecent('meal', params.id); }, []); // eslint-disable-line

  return (
    <>
      <TopBar transparent title="" right={<SaveButton kind="meal" id={params.id} />} />
      <div style={{ marginTop: 'calc(-1 * (var(--safe-top) + 54px))' }}>
        {view === 'photo' ? (
          <div className="photo-hero">
            <MediaImg id={m.cover} eager />
            <div className="view-toggle"><Segmented value={view} onChange={setView} options={[{ id: 'photo', label: 'Photo' }, { id: 'layout', label: 'Layout' }]} /></div>
          </div>
        ) : (
          <div className="hero-board" style={{ position: 'relative' }}>
            <div style={{ height: 'calc(var(--safe-top) + 40px)' }} />
            <BoardView boardId={m.board} items={items} label={`${m.name}, layout`} />
            <span className="photo-tag">AI preview</span>
            <div className="view-toggle"><Segmented value={view} onChange={setView} options={[{ id: 'photo', label: 'Photo' }, { id: 'layout', label: 'Layout' }]} /></div>
          </div>
        )}
      </div>
      {view === 'photo' && <p className="small pad hero-note">An inspiration image. Switch to Layout for the pieces on your board.</p>}

      <div className="pad" style={{ marginTop: 18 }}>
        <Kicker>Everyday meal · {m.category}</Kicker>
        <h1 className="h1" style={{ marginTop: 6, fontSize: 38 }}>{m.name}</h1>
        <p className="lead" style={{ margin: '10px 0 0' }}>{m.description}</p>
      </div>

      <div className="facts" style={{ margin: '20px var(--gut) 0' }}>
        <div><div className="v">{m.minutes}<span style={{ fontSize: 15 }}> min</span></div><div className="k">To serve, food ready</div></div>
        <div><div className="v">{m.serves}</div><div className="k">Serves</div></div>
        <div><div className="v" style={{ fontSize: 19, paddingTop: 4 }}>{BOARDS[m.board].name}</div><div className="k">Board</div></div>
      </div>

      <div className="pad section" style={{ marginTop: 14 }}>
        <h2 className="h2">Serve it</h2>
        <ol className="serve-steps">{m.serving.map((s) => <li key={s}><span>{s}</span></li>)}</ol>
      </div>

      <div className="pad section">
        <h2 className="h2">On the board</h2>
        <div style={{ marginTop: 6 }}>{onBoard.map((it) => <ComponentRow key={it.uid} it={it} />)}</div>
        {alongside.length > 0 && (
          <>
            <h3 className="h3" style={{ fontSize: 19, marginTop: 18 }}>Alongside</h3>
            <p className="small" style={{ margin: '2px 0 0' }}>Serves {m.serves} is the whole meal. These go next to the board, in a bowl or on a plate.</p>
            <div style={{ marginTop: 4 }}>{alongside.map((it) => <ComponentRow key={it.uid} it={it} />)}</div>
          </>
        )}
        <p className="small" style={{ marginTop: 10 }}>Laid out for a 33 × 24 cm board (13 × 9.5 in), using estimated sizes.</p>
        <p className="small" style={{ marginTop: 10 }}>Prefer another side? In Make it yours you can swap or remove it, or add {sides.map((s) => s.name).join(', ').replace(/, ([^,]*)$/, ' or $1')}.</p>
      </div>

      <div className="pad section">
        <div className="row-between">
          <h2 className="h2">What you’ll need</h2>
          <button className="link" onClick={() => { const id = a.ensureList({ kind: 'meal', id: params.id }); nav.push('shopping', { id }); }}>Shopping list</button>
        </div>
        <div style={{ marginTop: 6 }}>{m.ingredients.map((x) => <div key={x} className="ing-row"><span>{x}</span></div>)}</div>
      </div>

      <div className="pad section">
        <details className="quick-prep card card-pad">
          <summary>
            <span><span className="label">Optional</span><span className="h3" style={{ display: 'block', fontSize: 19, marginTop: 4 }}>Quick prep</span></span>
            <span className="chev"><Icon name="chevron" size={18} /></span>
          </summary>
          <p className="small" style={{ margin: '10px 0 4px' }}>Cook it your usual way, or use store-bought. Nothing here is required.</p>
          {m.quickPrep.map((x) => <div key={x} className="ing-row"><span>{x}</span></div>)}
        </details>
      </div>

      <div className="pad section">
        <div className="card card-pad">
          <div className="label">Board tips</div>
          <p className="body" style={{ margin: '6px 0 0' }}>Serve cooked food on a clean, dry board, and keep raw meat on a separate cutting board. Let hot pans rest on a trivet, not on the board.</p>
        </div>
      </div>

      <div className="pad" style={{ marginTop: 20 }}>
        <DemoNote>Preview content. A serving guide, not a kitchen-tested recipe. Minutes count from when the food is ready. Images are AI previews, not photos of a tested meal or of Yndarena boards.</DemoNote>
      </div>
      <div className="sticky-cta">
        <Button variant="ghost" small className="grow" onClick={() => { const id = a.ensureList({ kind: 'meal', id: params.id }); nav.push('shopping', { id }); }}>Shopping list</Button>
        <Button small className="grow" icon="edit" onClick={() => { const id = a.fromMeal(params.id); nav.push('designer', { id }); }}>Make it yours</Button>
      </div>
    </>
  );
}
