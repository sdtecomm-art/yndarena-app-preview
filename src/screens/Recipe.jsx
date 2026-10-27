import { useState } from 'react';
import { useNav } from '../nav.jsx';
import { useStore } from '../store.jsx';
import { useActions } from '../actions.js';
import { TopBar, Kicker, Button, Icon, PhotoPending, Stepper, Stars, DemoNote } from '../ui.jsx';
import { SaveButton, ItemIcon, AddToBoardSheet, ReviewSheet, BoardThumb, MediaImg } from '../components.jsx';
import { TechPills } from './Presentation.jsx';
import { RECIPES, RECIPE_TYPES } from '../data/recipes.js';
import { ITEMS } from '../data/catalog.js';
import { fmtQty, frac, presentationsUsingRecipe, presentationItems } from '../lib.js';

export default function Recipe({ params }) {
  const nav = useNav();
  const { user } = useStore();
  const a = useActions();
  const r = RECIPES[params.id];
  const it = ITEMS[r.item];
  const [scale, setScale] = useState(1);
  const [addOpen, setAddOpen] = useState(false);
  const [review, setReview] = useState(null);
  const uses = presentationsUsingRecipe(params.id);
  const mine = user.reviews.filter((x) => x.kind === 'recipe' && x.refId === params.id);
  const yieldQty = r.yield.qty * scale;

  return (
    <>
      <TopBar transparent title="" right={<SaveButton kind="recipe" id={params.id} />} />
      <div style={{ marginTop: 'calc(-1 * (var(--safe-top) + 54px))' }}>
        {r.media?.cover ? (
          <div className="photo-hero"><MediaImg id={r.media.cover} eager /></div>
        ) : (
          <PhotoPending className="hero-board">
            <div style={{ height: 'calc(var(--safe-top) + 46px)' }} />
            <div style={{ display: 'grid', placeItems: 'center', padding: '6px 0 10px' }}>
              <ItemIcon type={r.item} size={190} />
            </div>
          </PhotoPending>
        )}
      </div>

      <div className="pad" style={{ marginTop: 20 }}>
        <Kicker>{RECIPE_TYPES.find((t) => t.id === r.type).label}</Kicker>
        <h1 className="h1" style={{ marginTop: 6 }}>{r.name}</h1>
        <p className="lead" style={{ margin: '10px 0 0' }}>{r.intro}</p>
      </div>

      <div className="facts" style={{ margin: '20px var(--gut) 0' }}>
        <div><div className="v">{r.time}<span style={{ fontSize: 15 }}> min</span></div><div className="k">{r.active} min hands-on</div></div>
        <div><div className="v" style={{ fontSize: 21, paddingTop: 3 }}>{r.difficulty}</div><div className="k">Difficulty</div></div>
        <div><div className="v" style={{ fontSize: 21, paddingTop: 3 }}>{fmtQty(yieldQty, r.yield.unit)}</div><div className="k">Makes</div></div>
      </div>

      
      {uses.length > 0 && (
        <div className="pad section" style={{ marginTop: 14 }}>
          <div className="card card-pad">
            <div className="label">What you make vs. what goes on the board</div>
            {uses.map((u) => {
              const reserve = yieldQty - u.qty;
              return (
                <div key={u.id} style={{ marginTop: 10, fontSize: 15, lineHeight: 1.45 }}>
                  <strong style={{ fontWeight: 500 }}>{u.p.name}</strong> uses {fmtQty(u.qty, it.unit)} on the board.
                  {reserve > 0.01 ? <> Keep {fmtQty(reserve, it.unit)} in reserve to refill.</> : <> Make a bigger batch to have some to refill.</>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="pad section">
        <div className="row-between">
          <h2 className="h2">Ingredients</h2>
          <Stepper label={scale === 1 ? '1 batch' : `${frac(scale)} batches`} onDec={() => setScale(Math.max(0.5, scale - 0.5))} onInc={() => setScale(Math.min(3, scale + 0.5))} />
        </div>
        <div style={{ marginTop: 6 }}>
          {r.ingredients.map((ing) => (
            <div key={ing.key + ing.name} className="ing-row">
              <span>{ing.name}</span>
              <span className="q">{fmtQty(ing.qty * scale, ing.unit)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="pad section">
        <h2 className="h2">Step by step</h2>
        <ol style={{ listStyle: 'none', padding: 0, margin: '8px 0 0' }}>
          {r.steps.map((s, i) => (
            <li key={i} className="ing-row" style={{ justifyContent: 'flex-start', gap: 14 }}>
              <span className="label" style={{ paddingTop: 4, width: 22 }}>{String(i + 1).padStart(2, '0')}</span>
              <span>{s}</span>
            </li>
          ))}
        </ol>
        <p className="small" style={{ marginTop: 12 }}><em>Make ahead.</em> {r.makeAhead}</p>
      </div>

      <div className="pad section">
        <h2 className="h2">Techniques</h2>
        <div style={{ marginTop: 10 }}><TechPills ids={r.techniques} /></div>
      </div>

      <div className="pad section">
        <h2 className="h2">Swaps</h2>
        {r.subs.map((s) => (
          <div key={s.from} className="ing-row">
            <div><div>{s.from} → {s.to}</div><div className="note">{s.note}</div></div>
          </div>
        ))}
      </div>

      <div className="pad section">
        <h2 className="h2">Ways to serve it</h2>
        <div className="row" style={{ gap: 10, marginTop: 12 }}>
          {it.styles.map((s) => (
            <div key={s.id} className="card" style={{ padding: 10, textAlign: 'center', flex: 1 }}>
              <div style={{ background: 'var(--table)', borderRadius: 8, display: 'grid', placeItems: 'center' }}><ItemIcon type={r.item} style={s.id} size={78} /></div>
              <div className="small" style={{ marginTop: 6, color: 'var(--c-black)' }}>{s.label}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 10 }}>
          {uses.map((u) => (
            <button key={u.id} className="list-row" onClick={() => nav.push('presentation', { id: u.id })}>
              <BoardThumb board={u.p.board} items={presentationItems(u.id)} uid={'ru-' + u.id} />
              <div className="grow"><div>{u.p.name}</div><div className="sub">Yndarena board · serves {u.p.serves}</div></div>
              <Icon name="chevron" size={18} />
            </button>
          ))}
        </div>
      </div>

      <div className="pad section">
        <h2 className="h2">Your ratings</h2>
        {mine.length ? mine.map((m) => (
          <div key={m.id} className="ing-row" style={{ display: 'block' }}>
            <Stars value={m.stars} size={18} />
            {m.comment && <div className="small" style={{ marginTop: 4 }}>{m.comment}</div>}
          </div>
        )) : <p className="small">Made it? Tell yourself how it went. Only your own ratings appear here.</p>}
        <Button variant="ghost" small style={{ marginTop: 12 }} icon="check" onClick={() => { const madeId = a.markMade({ kind: 'recipe', refId: params.id }); setReview({ kind: 'recipe', refId: params.id, madeId, noteKey: `recipe:${params.id}`, versionLabel: 'this recipe' }); }}>I made this</Button>
      </div>

      <div className="pad" style={{ marginTop: 24 }}>
        <DemoNote>Preview recipe. Representative quantities, not yet tested in Yndarena’s kitchen.</DemoNote>
      </div>

      <AddToBoardSheet open={addOpen} onClose={() => setAddOpen(false)} rid={params.id} />
      <ReviewSheet key={review?.madeId} open={!!review} onClose={() => setReview(null)} target={review} />
      <div className="sticky-cta">
        <Button variant="ghost" small className="grow" onClick={() => { const id = a.ensureList({ kind: 'recipe', id: params.id, scale }); nav.push('shopping', { id }); }}>Shopping list</Button>
        <Button small className="grow" icon="plus" onClick={() => setAddOpen(true)}>Add to my board</Button>
      </div>
    </>
  );
}
