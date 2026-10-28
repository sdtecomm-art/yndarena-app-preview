import { useMemo, useState } from 'react';
import { useNav } from '../nav.jsx';
import { Icon, Chip, Kicker, DemoNote } from '../ui.jsx';
import { PresentationCard, CommunityCard, RecipeRow, ItemIcon, MealCard } from '../components.jsx';
import { MEALS, MEAL_ORDER } from '../data/meals.js';
import { PRESENTATIONS, PRESENTATION_ORDER, OCCASIONS } from '../data/presentations.js';
import { RECIPES, RECIPE_TYPES } from '../data/recipes.js';
import { TECHNIQUES, TECH_GROUPS } from '../data/techniques.js';
import { COMMUNITY_ORDER } from '../data/community.js';
import { ITEMS } from '../data/catalog.js';
import { presentationsUsingRecipe } from '../lib.js';

const SEGS = [
  { id: 'meals', label: 'Everyday meals' },
  { id: 'presentations', label: 'Boards to share' },
  { id: 'recipes', label: 'Recipes' },
  { id: 'techniques', label: 'Techniques' },
  { id: 'h2h', label: 'From home to home' },
];

function search(q) {
  const s = q.trim().toLowerCase();
  if (!s) return null;
  const has = (t) => t.toLowerCase().includes(s);
  const pres = PRESENTATION_ORDER.filter((id) => {
    const p = PRESENTATIONS[id];
    return has(p.name) || p.groups.some((g) => has(ITEMS[g.type].name));
  });
  const recipes = Object.keys(RECIPES).filter((id) => has(RECIPES[id].name) || RECIPES[id].ingredients.some((i) => has(i.name)));
  const techs = Object.keys(TECHNIQUES).filter((id) => has(TECHNIQUES[id].name) || TECHNIQUES[id].compatible.some((c) => has(ITEMS[c].name)));
  const meals = MEAL_ORDER.filter((id) => has(MEALS[id].name) || MEALS[id].ingredients.some(has));
  return { pres, recipes, techs, meals };
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

export default function Discover({ params = {} }) {
  const [seg, setSeg] = useState(params.seg || 'meals');
  const [occasion, setOccasion] = useState(params.occasion || 'all');
  const [rtype, setRtype] = useState('all');
  const [tgroup, setTgroup] = useState('all');
  const [q, setQ] = useState('');
  const results = useMemo(() => search(q), [q]);

  return (
    <>
      <div className="pad" style={{ paddingTop: 'calc(var(--safe-top) + 16px)' }}>
        <h1 className="h1">Discover</h1>
        <label className="row" style={{ marginTop: 14, height: 46, padding: '0 14px', borderRadius: 23, background: 'var(--c-bone)', border: '1px solid var(--c-line)' }}>
          <Icon name="search" size={18} />
          <input className="grow" style={{ border: 0, background: 'transparent', outline: 'none', fontSize: 16 }} placeholder="Search by name or ingredient" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search" />
          {q && <button onClick={() => setQ('')} aria-label="Clear search"><Icon name="close" size={16} /></button>}
        </label>
      </div>

      {results ? (
        <div className="pad" style={{ marginTop: 18 }}>
          {!results.pres.length && !results.recipes.length && !results.techs.length && !results.meals.length && (
            <p className="body">Nothing yet for “{q}”. Try an ingredient like chicken, brie or honey.</p>
          )}
          {results.meals.length > 0 && (
            <div className="stack-12" style={{ marginBottom: 22 }}>
              <Kicker>Everyday meals</Kicker>
              {results.meals.map((id) => <MealCard key={id} id={id} compact />)}
            </div>
          )}
          {results.pres.length > 0 && (
            <div className="stack-12">
              <Kicker>Boards</Kicker>
              {results.pres.map((id) => <PresentationCard key={id} id={id} wide />)}
            </div>
          )}
          {results.recipes.length > 0 && (
            <div style={{ marginTop: 22 }}>
              <Kicker>Recipes</Kicker>
              {results.recipes.map((id) => <RecipeRow key={id} id={id} />)}
            </div>
          )}
          {results.techs.length > 0 && (
            <div style={{ marginTop: 22 }}>
              <Kicker>Techniques</Kicker>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 10 }}>
                {results.techs.map((id) => <TechniqueTile key={id} id={id} />)}
              </div>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="chips" style={{ marginTop: 16 }}>
            {SEGS.map((s) => <Chip key={s.id} active={seg === s.id} onClick={() => setSeg(s.id)}>{s.label}</Chip>)}
          </div>

          {seg === 'meals' && (
            <div style={{ marginTop: 18 }}>
              <div className="pad">
                <p className="body" style={{ marginTop: 0 }}>Serve what you already love. Cook it your usual way or use store-bought, then bring it to the table in a few minutes.</p>
              </div>
              <div className="pad stack-16" style={{ marginTop: 12 }}>
                {MEAL_ORDER.map((id) => <MealCard key={id} id={id} />)}
              </div>
            </div>
          )}

          {seg === 'presentations' && (
            <div style={{ marginTop: 18 }}>
              <div className="pad">
                <div className="kicker">By occasion</div>
                <div className="row wrap" style={{ gap: 6, marginTop: 8 }}>
                  <button className={'tag' + (occasion === 'all' ? ' is-dark' : '')} onClick={() => setOccasion('all')}>All</button>
                  {OCCASIONS.map((o) => <button key={o.id} className={'tag' + (occasion === o.id ? ' is-dark' : '')} onClick={() => setOccasion(o.id)}>{o.label}</button>)}
                </div>
                {occasion !== 'all' && <p className="small italic" style={{ margin: '12px 0 0' }}>{OCCASIONS.find((o) => o.id === occasion).line}</p>}
              </div>
              <div className="pad stack-16" style={{ marginTop: 16 }}>
                {PRESENTATION_ORDER.filter((id) => occasion === 'all' || PRESENTATIONS[id].occasion === occasion).map((id) => <PresentationCard key={id} id={id} wide />)}
              </div>
            </div>
          )}

          {seg === 'recipes' && (
            <div style={{ marginTop: 18 }}>
              <div className="pad">
                <div className="row wrap" style={{ gap: 6 }}>
                  <button className={'tag' + (rtype === 'all' ? ' is-dark' : '')} onClick={() => setRtype('all')}>All</button>
                  {RECIPE_TYPES.map((t) => <button key={t.id} className={'tag' + (rtype === t.id ? ' is-dark' : '')} onClick={() => setRtype(t.id)}>{t.label}</button>)}
                </div>
                <div className="row wrap" style={{ gap: 6, marginTop: 8 }}>
                  {OCCASIONS.map((o) => <button key={o.id} className={'tag' + (occasion === o.id ? ' is-lav' : '')} onClick={() => setOccasion(occasion === o.id ? 'all' : o.id)}>{o.label}</button>)}
                </div>
              </div>
              <div className="pad" style={{ marginTop: 8 }}>
                {Object.keys(RECIPES)
                  .filter((id) => rtype === 'all' || RECIPES[id].type === rtype)
                  .filter((id) => occasion === 'all' || presentationsUsingRecipe(id).some((x) => x.p.occasion === occasion))
                  .map((id) => <RecipeRow key={id} id={id} />)}
              </div>
            </div>
          )}

          {seg === 'techniques' && (
            <div className="pad" style={{ marginTop: 18 }}>
              <div className="row wrap" style={{ gap: 6 }}>
                <button className={'tag' + (tgroup === 'all' ? ' is-dark' : '')} onClick={() => setTgroup('all')}>All</button>
                {TECH_GROUPS.map((g) => <button key={g.id} className={'tag' + (tgroup === g.id ? ' is-dark' : '')} onClick={() => setTgroup(g.id)}>{g.label}</button>)}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 14 }}>
                {Object.keys(TECHNIQUES).filter((id) => tgroup === 'all' || TECHNIQUES[id].group === tgroup).map((id) => <TechniqueTile key={id} id={id} />)}
              </div>
            </div>
          )}

          {seg === 'h2h' && (
            <div className="pad" style={{ marginTop: 18 }}>
              <p className="body" style={{ marginTop: 0 }}>Boards made in other Homes, reviewed by Yndarena before they appear here. Save one, or make it yours.</p>
              <DemoNote>Demo data. These creations and Home numbers are examples for the preview.</DemoNote>
              <div className="stack-16" style={{ marginTop: 16 }}>
                {COMMUNITY_ORDER.map((id) => <div key={id}><CommunityCard id={id} width="100%" /></div>)}
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
