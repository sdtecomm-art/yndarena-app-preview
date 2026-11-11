import { useMemo, useState } from 'react';
import { useStore } from '../store.jsx';
import { useNav } from '../nav.jsx';
import { TopBar, Button, Icon, Chip, useToast, DemoNote, PhotoSlot, ConfirmTap } from '../ui.jsx';
import { iso, fromIso, DAY } from '../lib.js';
import { IS_PREVIEW } from '../data/links.js';
import spineM from '../media/product/yndarena-board-spine-m.webp';
import spineV from '../media/product/yndarena-board-spine-v.webp';
import spineC from '../media/product/yndarena-board-spine-c.webp';

// Each board shown by its own engraved spine, cut from the set's product reference (owner, 2026-11-10).
// To be replaced by photos of the real set.
const SPINE = { m: spineM, v: spineV, c: spineC };
import {
  RECIPES, AISLES, BOARDS, BOARD_ORDER, STAPLES, SAFE, LEFTOVERS, DIETS, AVOID, TIMES,
  byId, fits, pickDinners, ingText, qtyText, unitText, listQty,
} from '../data/recipes.js';

// Cook (v12): plan the week's dinners, get one shopping list, prep with the right board.
// Plans are picked from Yndarena's own recipes by simple rules (diet, foods to avoid, time, no same protein two
// nights in a row). No AI yet, nothing invented, nothing sent anywhere.

const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DOW_LONG = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const DIET_LABEL = { meat: 'Meat', fish: 'Fish', vegetarian: 'Vegetarian', vegan: 'Vegan' };
const CONTAINS_LABEL = { gluten: 'gluten', dairy: 'dairy', egg: 'eggs', soy: 'soy', fish: 'fish', shellfish: 'shellfish', peanut: 'peanuts', treenut: 'tree nuts', sesame: 'sesame' };
const DEFAULT_PREFS = { people: 4, diet: 'all', avoid: [], maxTime: 45 };

export const cookOf = (user) => user.cook || {};
const next7 = (today) => Array.from({ length: 7 }, (_, i) => new Date(today.getTime() + i * DAY));
export function tonight(user, today) {
  const p = cookOf(user).plan;
  const d = p?.days?.find((x) => x.date === iso(today) && x.id);
  return d ? byId(d.id) : null;
}
function activePlan(user, today) {
  const p = cookOf(user).plan;
  if (!p?.days?.length) return null;
  const last = p.days[p.days.length - 1].date;
  return last >= iso(today) ? p : null;
}

// ---------- Tab root ----------
export default function Cook() {
  const { user, today } = useStore();
  const nav = useNav();
  const plan = activePlan(user, today);
  const people = cookOf(user).prefs?.people || 4;
  return (
    <div className="cook">
      <header className="care-head pad">
        <h1 className="display-l">Cook</h1>
      </header>
      {plan ? <WeekPlan plan={plan} people={people} /> : (
        <section className="pad cook-start">
          <PhotoSlot shot="A weeknight dinner on the table, the three boards nearby." ratio="3 / 2" />
          <Button block style={{ marginTop: 16 }} onClick={() => nav.push('cook-setup')}>Plan my week</Button>
        </section>
      )}
      <div className="pad">
        <button className="cook-browse" onClick={() => nav.push('recipes')}><span>All dinners</span><Icon name="chevron" size={16} /></button>
      </div>
    </div>
  );
}

// All dinners, behind one link: browsing is not the main job of Cook.
export function Recipes() {
  const { user } = useStore();
  const nav = useNav();
  const people = cookOf(user).prefs?.people || 4;
  const [filter, setFilter] = useState('all');
  const list = RECIPES.filter((r) => filter === 'all' || r.diet === filter);
  return (
    <>
      <TopBar title="All dinners" />
      <section className="pad cook-all" aria-label="All dinners">
        <div className="g-types">
          {[['all', 'All'], ['meat', 'Meat'], ['fish', 'Fish'], ['vegetarian', 'Vegetarian'], ['vegan', 'Vegan']].map(([id, l]) => <Chip key={id} active={filter === id} onClick={() => setFilter(id)}>{l}</Chip>)}
        </div>
        <div className="cook-rows">
          {list.map((r) => <RecipeRow key={r.id} r={r} onOpen={() => nav.push('recipe', { id: r.id, people })} />)}
        </div>
      </section>
    </>
  );
}

function RecipeRow({ r, onOpen, right }) {
  return (
    <button className="cook-row" onClick={onOpen}>
      <span className={'cook-dot is-' + r.diet} aria-hidden="true" />
      <span className="grow">
        <span className="cook-row-t">{r.name}</span>
        <span className="cook-row-s">{r.time} min</span>
      </span>
      {right || <Icon name="chevron" size={16} />}
    </button>
  );
}

function WeekPlan({ plan, people }) {
  const { updateUser, today, user } = useStore();
  const nav = useNav();
  const toast = useToast();
  const prefs = { ...DEFAULT_PREFS, ...cookOf(user).prefs };
  const items = useMemo(() => shoppingItems(plan, people), [plan, people]);
  const have = cookOf(user).have || {};
  const toBuy = items.filter((i) => !i.staple && !have[i.key]).length;
  const swap = (idx) => {
    const ids = plan.days.map((d) => d.id);
    const keep = ids.map((id, i) => (i === idx ? null : id));
    const seed = (plan.seed || 1) + ':' + idx + ':' + Date.now();
    const out = pickDinners(prefs, ids.length, seed, keep);
    if (!out[idx] || out[idx] === ids[idx]) { toast('No other dinner fits your choices.'); return; }
    updateUser((u) => { u.cook.plan.days[idx].id = out[idx]; });
  };
  return (
    <section className="pad cook-week" aria-label="This week">
      <div className="row-between">
        <div className="section-label"><span>This week</span></div>
      </div>
      <div className="cook-rows">
        {plan.days.map((d, i) => {
          const r = byId(d.id); const date = fromIso(d.date);
          const isToday = d.date === iso(today);
          return (
            <div key={d.date} className={'cook-night' + (isToday ? ' is-today' : '')}>
              <div className="cook-day"><span>{isToday ? 'Tonight' : DOW[date.getUTCDay()]}</span><small>{date.getUTCDate()}</small></div>
              {r ? <RecipeRow r={r} onOpen={() => nav.push('recipe', { id: r.id, people })} right={<span />} /> : <div className="cook-row is-empty grow">Nothing fits. Change your choices.</div>}
              <button className="cook-swap" aria-label={`Swap ${DOW_LONG[date.getUTCDay()]}’s dinner`} onClick={() => swap(i)}><Icon name="shuffle" size={18} /></button>
            </div>
          );
        })}
      </div>
      <div className="cook-actions">
        <Button block onClick={() => nav.push('shopping')}>Shopping list · {toBuy} to buy</Button>
        <div className="row" style={{ gap: 8 }}>
          <Button small variant="ghost" className="grow" onClick={() => nav.push('prep')}>Prep ahead</Button>
          <Button small variant="ghost" className="grow" onClick={() => nav.push('cook-setup')}>Change plan</Button>
        </div>
        {/* Two taps, so a plan isn't lost by accident. The shopping list goes with it; your own items stay. */}
        <ConfirmTap onConfirm={() => { updateUser((u) => { delete u.cook.plan; u.cook.have = {}; }); toast('Plan deleted.'); }}
          render={(armed, tap) => <Button block variant="text" onClick={tap}>{armed ? 'Tap again to delete' : 'Delete plan'}</Button>} />
      </div>
    </section>
  );
}

// ---------- Plan setup ----------
export function CookSetup() {
  const { user, updateUser, today } = useStore();
  const nav = useNav();
  const toast = useToast();
  const prev = { ...DEFAULT_PREFS, ...cookOf(user).prefs };
  const [people, setPeople] = useState(prev.people);
  const [diet, setDiet] = useState(prev.diet);
  const [avoid, setAvoid] = useState(prev.avoid);
  const [maxTime, setMaxTime] = useState(prev.maxTime);
  const days = next7(today);
  const prevDays = activePlan(user, today)?.days.map((d) => d.date);
  const [picked, setPicked] = useState(() => new Set(prevDays || days.filter((d) => d.getUTCDay() >= 1 && d.getUTCDay() <= 5).map(iso)));
  const prefs = { people, diet, avoid, maxTime };
  const pool = RECIPES.filter((r) => fits(r, prefs)).length;
  const toggleDay = (k) => setPicked((s) => { const n = new Set(s); n.has(k) ? n.delete(k) : n.add(k); return n; });
  const toggleAvoid = (a) => setAvoid((s) => (s.includes(a) ? s.filter((x) => x !== a) : [...s, a]));
  const dates = days.map(iso).filter((k) => picked.has(k));
  const make = () => {
    const seed = Date.now();
    const ids = pickDinners(prefs, dates.length, seed);
    updateUser((u) => {
      u.cook = u.cook || {};
      u.cook.prefs = prefs;
      u.cook.plan = { seed, createdAt: iso(today), days: dates.map((date, i) => ({ date, id: ids[i] })) };
      u.cook.have = {};
    });
    toast(`${dates.length} dinners planned.`);
    nav.pop();
  };
  return (
    <>
      <TopBar title="Plan my week" />
      <div className="pad g-create cook-setup">
        <div className="g-q">Which nights?</div>
        <div className="cook-days">
          {days.map((d) => { const k = iso(d); return (
            <button key={k} className={'cook-daychip' + (picked.has(k) ? ' is-active' : '')} aria-pressed={picked.has(k)} onClick={() => toggleDay(k)}>
              <span>{DOW[d.getUTCDay()]}</span><strong>{d.getUTCDate()}</strong>
            </button>
          ); })}
        </div>
        <div className="g-q">For how many people?</div>
        <div className="stepper" role="group" aria-label="Number of people">
          <button onClick={() => setPeople(Math.max(1, people - 1))} aria-label="Fewer people"><Icon name="minus" size={18} /></button>
          <span aria-live="polite">{people} {people === 1 ? 'person' : 'people'}</span>
          <button onClick={() => setPeople(Math.min(12, people + 1))} aria-label="More people"><Icon name="plus" size={18} /></button>
        </div>
        <div className="g-q">What do you eat?</div>
        <div className="g-types">{DIETS.map(([id, l]) => <Chip key={id} active={diet === id} onClick={() => setDiet(id)}>{l}</Chip>)}</div>
        <div className="g-q">Anything to leave out?</div>
        <div className="g-types">{AVOID.map(([id, l]) => <Chip key={id} active={avoid.includes(id)} onClick={() => toggleAvoid(id)}>{l}</Chip>)}</div>
        <p className="small muted" style={{ marginTop: 8 }}>Check labels for allergies.</p>
        <div className="g-q">Time to cook</div>
        <div className="g-types">{TIMES.map(([v, l]) => <Chip key={v} active={maxTime === v} onClick={() => setMaxTime(v)}>{l}</Chip>)}</div>
        {pool < dates.length && <p className="small" style={{ marginTop: 18 }}>Only {pool} {pool === 1 ? 'dinner fits' : 'dinners fit'}. Pick fewer nights or loosen a filter.</p>}
        <Button block style={{ marginTop: 10 }} disabled={!dates.length || !pool} onClick={make}>{dates.length ? `Plan ${dates.length} ${dates.length === 1 ? 'dinner' : 'dinners'}` : 'Pick at least one night'}</Button>
      </div>
    </>
  );
}

// ---------- Recipe ----------
export function Recipe({ params }) {
  const r = byId(params.id);
  const [people, setPeople] = useState(params.people || 4);
  if (!r) return <><TopBar title="Recipe" /><p className="pad">This recipe is no longer in the app.</p></>;
  const scale = people / r.servings;
  const boards = BOARD_ORDER.filter((b) => r.prep[b]?.length);
  return (
    <>
      <TopBar title="Recipe" />
      <article className="pad recipe">
        <PhotoSlot shot={`${r.name}, plated at home, with the board it was prepped on.`} ratio="4 / 3" />
        <div className="eyebrow" style={{ marginTop: 16 }}>{DIET_LABEL[r.diet]} · {r.time} min</div>
        <h1 className="display-m" style={{ marginTop: 6 }}>{r.name}</h1>
        {r.contains.length > 0 && <p className="small" style={{ marginTop: 8 }}>Contains {r.contains.map((c) => CONTAINS_LABEL[c]).join(', ')}.</p>}

        <div className="row-between" style={{ marginTop: 18 }}>
          <span className="g-q" style={{ margin: 0 }}>Serves</span>
          <div className="stepper" role="group" aria-label="Servings">
            <button onClick={() => setPeople(Math.max(1, people - 1))} aria-label="Fewer servings"><Icon name="minus" size={18} /></button>
            <span aria-live="polite">{people}</span>
            <button onClick={() => setPeople(Math.min(12, people + 1))} aria-label="More servings"><Icon name="plus" size={18} /></button>
          </div>
        </div>

        <section className="recipe-sec">
          <h2 className="h2">Prep with your boards</h2>
          <div style={{ height: 8 }} />
          {boards.map((b) => (
            <div key={b} className={'board-block is-' + b}>
              <img className="board-spine" src={SPINE[b]} alt={`${BOARDS[b].name} board`} width="1215" height="96" decoding="async" />
              <ul>{r.prep[b].map((t) => <li key={t}>{t}</li>)}</ul>
            </div>
          ))}
        </section>

        <section className="recipe-sec">
          <h2 className="h2">Ingredients</h2>
          <ul className="ing-list">{r.ing.map((x) => <li key={x[2]}>{ingText(x, scale)}{x[4] ? <span className="muted">, {x[4]}</span> : null}</li>)}</ul>
        </section>

        <section className="recipe-sec">
          <h2 className="h2">Steps</h2>
          <ol className="step-list">{r.steps.map((s) => <li key={s}>{s}</li>)}</ol>
        </section>

        {r.safe && <section className="recipe-sec recipe-safe"><p className="small"><Icon name="info" size={14} /> {SAFE[r.safe]}</p></section>}
      </article>
    </>
  );
}

// ---------- Shopping list ----------
export function shoppingItems(plan, people) {
  const map = new Map();
  for (const d of plan.days) {
    const r = byId(d.id); if (!r) continue;
    const scale = people / r.servings;
    for (const [q, u, item, aisle] of r.ing) {
      const key = (item + '|' + u).toLowerCase();
      const cur = map.get(key) || { key, item, unit: u, aisle, q: 0, staple: STAPLES.has(item), for: new Set() };
      cur.q += q * scale; cur.for.add(r.name);
      map.set(key, cur);
    }
  }
  return [...map.values()].map((x) => ({ ...x, q: listQty(x.q, x.unit), for: [...x.for] }));
}
// Spices, oils and staples are bought by the jar or bottle: name only, no added-up teaspoons.
const itemLine = (i) => (i.aisle === 'S' || i.staple ? i.item[0].toUpperCase() + i.item.slice(1) : [qtyText(i.q), unitText(i.q, i.unit), i.item].filter(Boolean).join(' '));

export function Shopping() {
  const { user, updateUser, today } = useStore();
  const toast = useToast();
  const plan = activePlan(user, today);
  const people = cookOf(user).prefs?.people || 4;
  const have = cookOf(user).have || {};
  const extra = cookOf(user).extra || [];
  const [text, setText] = useState('');
  const items = useMemo(() => (plan ? shoppingItems(plan, people) : []), [plan, people]);
  if (!plan) return <><TopBar title="Shopping list" /><p className="pad body">Plan your week first, and the list builds itself.</p></>;
  const toggle = (k) => updateUser((u) => { u.cook.have = u.cook.have || {}; u.cook.have[k] = !u.cook.have[k]; });
  const addExtra = () => { const t = text.trim(); if (!t) return; updateUser((u) => { u.cook.extra = [...(u.cook.extra || []), { id: 'x' + Date.now(), text: t }]; }); setText(''); };
  const removeExtra = (id) => updateUser((u) => { u.cook.extra = (u.cook.extra || []).filter((x) => x.id !== id); });
  const buy = items.filter((i) => !i.staple);
  const staples = items.filter((i) => i.staple);
  const left = buy.filter((i) => !have[i.key]);
  const share = async () => {
    const lines = AISLES.flatMap(([a, label]) => { const xs = left.filter((i) => i.aisle === a); return xs.length ? [label.toUpperCase(), ...xs.map((i) => '- ' + itemLine(i)), ''] : []; });
    const body = ['Shopping list', '', ...lines, ...extra.map((x) => '- ' + x.text)].join('\n');
    try { if (navigator.share) await navigator.share({ title: 'Shopping list', text: body }); else { await navigator.clipboard.writeText(body); toast('List copied.'); } } catch (e) { /* closed */ }
  };
  return (
    <>
      <TopBar title="Shopping list" right={<button className="link" onClick={share}>Share</button>} />
      <div className="pad shop">
        <p className="small" style={{ marginTop: 0 }}>{left.length} to buy</p>
        {AISLES.map(([a, label]) => {
          const xs = buy.filter((i) => i.aisle === a);
          if (!xs.length) return null;
          return (
            <section key={a} className="shop-sec">
              <h2 className="label">{label}</h2>
              {xs.map((i) => <ShopRow key={i.key} i={i} done={!!have[i.key]} onToggle={() => toggle(i.key)} />)}
            </section>
          );
        })}
        <section className="shop-sec">
          <h2 className="label">Check you have</h2>
          {staples.map((i) => <ShopRow key={i.key} i={i} done={!!have[i.key]} onToggle={() => toggle(i.key)} />)}
        </section>
        <section className="shop-sec">
          <h2 className="label">Your own items</h2>
          {extra.map((x) => (
            <div key={x.id} className="shop-row"><span className="grow">{x.text}</span><button className="link" onClick={() => removeExtra(x.id)}>Remove</button></div>
          ))}
          <div className="row" style={{ gap: 8, marginTop: 8 }}>
            <input className="input grow" value={text} maxLength={60} placeholder="Coffee, paper towels…" onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addExtra()} aria-label="Add your own item" />
            <Button small variant="ghost" disabled={!text.trim()} onClick={addExtra}>Add</Button>
          </div>
        </section>
      </div>
    </>
  );
}
function ShopRow({ i, done, onToggle }) {
  return (
    <label className={'shop-row check' + (done ? ' is-done' : '')}>
      <input type="checkbox" checked={done} onChange={onToggle} />
      <span className="box">{done && <Icon name="check" size={14} stroke={2} />}</span>
      <span className="grow"><span className="shop-t">{itemLine(i)}</span>{i.for.length > 1 && <span className="shop-s">For {i.for.length} dinners</span>}</span>
    </label>
  );
}

// ---------- Prep ahead ----------
export function Prep() {
  const { user, today } = useStore();
  const plan = activePlan(user, today);
  if (!plan) return <><TopBar title="Prep ahead" /><p className="pad body">Plan your week first.</p></>;
  // Only the next three dinners: cut vegetables are best used within a couple of days.
  const soon = plan.days.filter((d) => d.date >= iso(today)).slice(0, 3).map((d) => ({ d, r: byId(d.id) })).filter((x) => x.r && x.r.ahead.length);
  return (
    <>
      <TopBar title="Prep ahead" />
      <div className="pad prep">
        <p className="body" style={{ marginTop: 0 }}>Vegetables only. Meat and fish on the day.</p>
        {soon.length === 0 && <p className="small">Nothing to prep ahead for your next dinners.</p>}
        {soon.map(({ d, r }) => {
          const date = fromIso(d.date);
          return (
            <section key={d.date} className="prep-sec">
              <div className="eyebrow">{d.date === iso(today) ? 'Tonight' : DOW_LONG[date.getUTCDay()]}</div>
              <h2 className="prep-t">{r.name}</h2>
              <ul>{r.ahead.map((t) => <li key={t}>{t}</li>)}</ul>
            </section>
          );
        })}
        <p className="small muted" style={{ marginTop: 16 }}>Keep it covered in the fridge.</p>
      </div>
    </>
  );
}
