import { useMemo, useState } from 'react';
import { useNav } from '../nav.jsx';
import { Icon, Chip, TopBar } from '../ui.jsx';
import { PresentationCard, RecipeRow, ItemIcon, MealCard, BoardThumb } from '../components.jsx';
import { MEALS, MEAL_ORDER, SHARE_ORDER } from '../data/meals.js';
import { PRESENTATIONS, PRESENTATION_ORDER, OCCASIONS } from '../data/presentations.js';
import { RECIPES, RECIPE_TYPES } from '../data/recipes.js';
import { TECHNIQUES, TECH_GROUPS } from '../data/techniques.js';
import { ITEMS } from '../data/catalog.js';
import { presentationItems } from '../lib.js';

// Discover is one catalog: everything that brings food to the table, each entry once, by its own id.
// Main dishes and snacks are the meals (their quick prep lives on the meal), boards to share are the
// presentations, and the homemade dips, spreads, bites and sides are the recipes.
const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'mains', label: 'Main dishes' },
  { id: 'snacks', label: 'Snacks to share' },
  { id: 'boards', label: 'Boards to share' },
  ...RECIPE_TYPES.filter((t) => Object.values(RECIPES).some((r) => r.type === t.id)),
];
// Older links asked for a section; they land on the matching filter.
const FROM_SEG = { meals: 'mains', presentations: 'boards', recipes: 'all', techniques: 'all', h2h: 'all' };

function entries(filter) {
  const meals = (ids) => ids.map((id) => ({ kind: 'meal', id }));
  if (filter === 'mains') return meals(MEAL_ORDER);
  if (filter === 'snacks') return meals(SHARE_ORDER);
  if (filter === 'boards') return PRESENTATION_ORDER.map((id) => ({ kind: 'presentation', id }));
  return Object.keys(RECIPES).filter((id) => RECIPES[id].type === filter).map((id) => ({ kind: 'recipe', id }));
}

function search(q) {
  const s = q.trim().toLowerCase();
  if (!s) return null;
  const has = (t) => t.toLowerCase().includes(s);
  const seen = new Set(), out = [];
  const add = (e) => { const k = e.kind + ':' + e.id; if (!seen.has(k)) { seen.add(k); out.push(e); } };
  for (const id of [...MEAL_ORDER, ...SHARE_ORDER]) if (has(MEALS[id].name) || MEALS[id].ingredients.some(has)) add({ kind: 'meal', id });
  for (const id of PRESENTATION_ORDER) { const p = PRESENTATIONS[id]; if (has(p.name) || p.groups.some((g) => has(ITEMS[g.type].name))) add({ kind: 'presentation', id }); }
  for (const id of Object.keys(RECIPES)) if (has(RECIPES[id].name) || RECIPES[id].ingredients.some((i) => has(i.name))) add({ kind: 'recipe', id });
  return out;
}

function PresentationRow({ id }) {
  const nav = useNav();
  const p = PRESENTATIONS[id];
  const occ = OCCASIONS.find((o) => o.id === p.occasion);
  return (
    <button className="card tap meal-row" onClick={() => nav.push('presentation', { id })}>
      <div className="meal-row-art"><BoardThumb board={p.board} items={presentationItems(id, p.compositions[0].id)} uid={'dp-' + id} /></div>
      <div className="grow">
        <div className="kicker">{occ.label}</div>
        <div className="h3" style={{ fontSize: 18, marginTop: 2 }}>{p.name}</div>
        <div className="small" style={{ fontSize: 13 }}>Serves {p.serves} · {p.time} min</div>
      </div>
      <Icon name="chevron" size={18} />
    </button>
  );
}

function Entry({ e, big }) {
  if (e.kind === 'meal') return <MealCard id={e.id} compact={!big} />;
  if (e.kind === 'presentation') return big ? <PresentationCard id={e.id} wide /> : <PresentationRow id={e.id} />;
  return <RecipeRow id={e.id} />;
}

function Group({ title, list }) {
  if (!list.length) return null;
  return (
    <div style={{ marginTop: 22 }}>
      <div className="section-label"><span>{title}</span></div>
      <div className="stack-8" style={{ marginTop: 10 }}>{list.map((e) => <Entry key={e.kind + e.id} e={e} />)}</div>
    </div>
  );
}

export default function Discover({ params = {} }) {
  const [filter, setFilter] = useState(params.filter || FROM_SEG[params.seg] || 'all');
  const [q, setQ] = useState('');
  const results = useMemo(() => search(q), [q]);
  const recipesOnly = (f) => entries(f).filter((e) => e.kind === 'recipe');

  return (
    <>
      <div className="pad" style={{ paddingTop: 'calc(var(--safe-top) + 16px)' }}>
        <h1 className="h1">Ideas for your table</h1>
        <p className="lead" style={{ margin: '8px 0 0' }}>Simple recipes, easy meals, and ways to serve them on your Yndarena board.</p>
        <label className="search-field">
          <Icon name="search" size={18} />
          <input className="grow" placeholder="Search recipes" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search recipes" />
          {q && <button onClick={() => setQ('')} aria-label="Clear search"><Icon name="close" size={16} /></button>}
        </label>
      </div>

      {results ? (
        <div className="pad" style={{ marginTop: 16 }}>
          {!results.length && <p className="body">Nothing yet for “{q}”. Try an ingredient like chicken, cheese or tomato.</p>}
          <div className="stack-8">{results.map((e) => <Entry key={e.kind + e.id} e={e} />)}</div>
        </div>
      ) : (
        <>
          <div className="chips" style={{ marginTop: 14 }} role="group" aria-label="Filter recipes">
            {FILTERS.map((f) => <Chip key={f.id} active={filter === f.id} onClick={() => setFilter(f.id)}>{f.label}</Chip>)}
          </div>
          {filter === 'all' ? (
            <div className="pad" style={{ marginTop: 2 }}>
              <Group title="Main dishes" list={entries('mains')} />
              <Group title="Snacks to share" list={entries('snacks')} />
              <Group title="Boards to share" list={entries('boards')} />
              <Group title="Dips, spreads, bites and sides" list={RECIPE_TYPES.flatMap((t) => recipesOnly(t.id))} />
            </div>
          ) : (
            <div className="pad stack-12" style={{ marginTop: 16 }}>
              {filter === 'mains' && <p className="small" style={{ margin: 0 }}>Cook it your usual way or use store-bought. Each one has an optional quick prep.</p>}
              {entries(filter).map((e) => <Entry key={e.kind + e.id} e={e} big={e.kind !== 'recipe'} />)}
            </div>
          )}
        </>
      )}
    </>
  );
}

export function TechniqueTile({ id }) {
  const nav = useNav();
  const t = TECHNIQUES[id];
  return (
    <button className="card tap" style={{ padding: 10 }} onClick={() => nav.push('technique', { id })}>
      <div style={{ background: 'var(--table)', borderRadius: 10, display: 'grid', placeItems: 'center', height: 96 }}>
        <ItemIcon type={t.demoType} style={t.demoStyle} size={88} />
      </div>
      <div className="h3" style={{ fontSize: 16, marginTop: 8 }}>{t.name}</div>
      <div className="small" style={{ fontSize: 12.5 }}>{TECH_GROUPS.find((g) => g.id === t.group).label} · {t.minutes} min</div>
    </button>
  );
}

// All techniques, opened from Designer. Not a Discover section: each recipe and board links its own.
export function TechniquesIndex() {
  return (
    <>
      <TopBar title="Techniques" />
      <div className="pad" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 8 }}>
        {Object.keys(TECHNIQUES).map((id) => <TechniqueTile key={id} id={id} />)}
      </div>
    </>
  );
}
