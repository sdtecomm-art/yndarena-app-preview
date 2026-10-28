import { useState } from 'react';
import { useNav } from '../nav.jsx';
import { useStore } from '../store.jsx';
import { useActions } from '../actions.js';
import { TopBar, Segmented, Chip, Icon, IconButton, Button, Empty, Stars, Kicker, PhotoPending, useToast, ConfirmTap } from '../ui.jsx';
import { BoardThumb, ItemIcon, NotesBlock } from '../components.jsx';
import BoardView from '../board/BoardView.jsx';
import { PRESENTATIONS } from '../data/presentations.js';
import { RECIPES } from '../data/recipes.js';
import { COMMUNITY } from '../data/community.js';
import { MEALS } from '../data/meals.js';
import { mediaFor } from '../data/media.js';
import { BOARDS } from '../data/catalog.js';
import { presentationItems, communityItems, listContent } from '../lib.js';

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'meal', label: 'Everyday meals' },
  { id: 'presentation', label: 'Yndarena boards' },
  { id: 'modified', label: 'My versions' },
  { id: 'scratch', label: 'From scratch' },
  { id: 'recipe', label: 'Recipes' },
  { id: 'community', label: 'Other Homes' },
];

const fmt = (iso) => new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

function entryView(e, user) {
  if (e.kind === 'presentation') {
    const p = PRESENTATIONS[e.id];
    return { title: p.name, sub: 'Yndarena board', thumb: <BoardThumb board={p.board} items={presentationItems(e.id, e.compositionId)} uid={'col-' + e.id + (e.compositionId || '')} /> };
  }
  if (e.kind === 'meal') {
    const m = MEALS[e.id];
    if (!m) return null;
    return { title: m.name, sub: 'Everyday meal', thumb: <div className="thumb"><img src={mediaFor(m.cover).small} alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div> };
  }
  if (e.kind === 'recipe') {
    const r = RECIPES[e.id];
    return { title: r.name, sub: 'Recipe', thumb: <div className="thumb"><ItemIcon type={r.item} size={52} /></div> };
  }
  if (e.kind === 'community') {
    const c = COMMUNITY[e.id];
    return { title: c.name, sub: `Shared by Home #${c.home}`, thumb: <BoardThumb board={c.board} items={communityItems(e.id)} uid={'col-' + e.id} /> };
  }
  const d = user.designs[e.id];
  if (!d) return null;
  return { title: d.name, sub: d.kind === 'scratch' ? 'From scratch' : 'My version', thumb: <BoardThumb board={d.board} items={d.items} uid={'col-' + d.id} /> };
}

export default function Collection() {
  const nav = useNav();
  const { user } = useStore();
  const a = useActions();
  const [seg, setSeg] = useState('saved');
  const [filter, setFilter] = useState('all');

  const designs = Object.values(user.designs).sort((x, y) => (y.updatedAt > x.updatedAt ? 1 : -1));
  const saved = [
    ...designs.map((d) => ({ kind: 'design', id: d.id, cat: d.kind, at: d.updatedAt })),
    ...user.saved.map((s) => ({ ...s, cat: s.kind })),
  ].filter((e) => filter === 'all' || e.cat === filter);
  const lists = Object.values(user.lists);

  const open = (e) => {
    if (e.kind === 'design') nav.push('item', { id: e.id });
    else if (e.kind === 'presentation') nav.push('presentation', { id: e.id });
    else if (e.kind === 'recipe') nav.push('recipe', { id: e.id });
    else if (e.kind === 'meal') nav.push('meal', { id: e.id });
    else nav.push('community', { id: e.id });
  };

  return (
    <>
      <div className="pad row-between" style={{ paddingTop: 'calc(var(--safe-top) + 16px)' }}>
        <h1 className="h1">Your collection</h1>
        <Button small variant="ghost" icon="plus" onClick={() => { const id = a.scratch(); nav.push('designer', { id }); }}>New</Button>
      </div>
      <div className="pad" style={{ marginTop: 14 }}>
        <Segmented value={seg} onChange={setSeg} options={[{ id: 'saved', label: 'Saved' }, { id: 'made', label: `Made${user.made.length ? ' · ' + user.made.length : ''}` }]} />
      </div>

      {seg === 'saved' && (
        <>
          <div className="chips" style={{ marginTop: 14 }}>
            {FILTERS.map((f) => <Chip key={f.id} active={filter === f.id} onClick={() => setFilter(f.id)}>{f.label}</Chip>)}
          </div>
          <div className="pad" style={{ marginTop: 8 }}>
            {saved.length === 0 && (
              <div style={{ marginTop: 12 }}>
                <Empty title={filter === 'all' ? 'Nothing saved yet' : 'Nothing here yet'} action={<Button small arrow onClick={() => nav.switchTab('discover')}>Discover boards</Button>}>
                  Save a board or a recipe you like, or make one your own. It will wait for you here.
                </Empty>
              </div>
            )}
            {saved.map((e) => {
              const v = entryView(e, user);
              if (!v) return null;
              return (
                <button key={e.kind + e.id} className="list-row" onClick={() => open(e)}>
                  {v.thumb}
                  <div className="grow"><div>{v.title}</div><div className="sub">{v.sub}</div></div>
                  <Icon name="chevron" size={18} />
                </button>
              );
            })}
          </div>
          <div className="pad section">
            <Kicker>Shopping lists</Kicker>
            {lists.length === 0 && <p className="small">Lists you create from a board or recipe appear here, each one linked to what you’re making.</p>}
            {lists.map((l) => {
              const c = listContent(l, user);
              if (!c) return null;
              const all = [...c.groceries, ...c.pantry];
              const left = all.filter((x) => !l.have?.[x.key]).length;
              return (
                <button key={l.id} className="list-row" onClick={() => nav.push('shopping', { id: l.id })}>
                  <div className="round-ico"><Icon name="list" size={18} /></div>
                  <div className="grow"><div>{c.title}</div><div className="sub">{left} of {all.length} still to buy</div></div>
                  <Icon name="chevron" size={18} />
                </button>
              );
            })}
          </div>
        </>
      )}

      {seg === 'made' && (
        <div className="pad" style={{ marginTop: 14 }}>
          {user.made.length === 0 && (
            <Empty title="Your first board is waiting" action={<Button small arrow onClick={() => nav.push('presentation', { id: 'love-like-rosemary' })}>Start with one for two</Button>}>
              When you bring a board to the table, mark it as made. Photos and notes are optional, and only yours.
            </Empty>
          )}
          {user.made.map((m) => {
            const v = entryView({ kind: m.kind === 'design' ? 'design' : m.kind, id: m.refId, compositionId: m.compositionId }, user);
            if (!v) return null;
            const rv = user.reviews.find((r) => r.kind === m.kind && r.refId === m.refId);
            return (
              <button key={m.id} className="list-row" onClick={() => (m.kind === 'design' ? nav.push('item', { id: m.refId }) : m.kind === 'recipe' ? nav.push('recipe', { id: m.refId }) : nav.push('made', { id: m.id }))}>
                {v.thumb}
                <div className="grow">
                  <div>{v.title}</div>
                  <div className="sub">{fmt(m.at)}{m.version ? ' · ' + m.version : ''}</div>
                  {rv && <Stars value={rv.stars} size={13} />}
                </div>
                <Icon name="chevron" size={18} />
              </button>
            );
          })}
        </div>
      )}
    </>
  );
}

// Detail for one of your own designs.
export function DesignItem({ params }) {
  const nav = useNav();
  const toast = useToast();
  const { user, updateUser } = useStore();
  const a = useActions();
  const d = user.designs[params.id];
  if (!d) return (<><TopBar title="" /><p className="pad body">This design was removed.</p></>);
  const made = user.made.filter((m) => m.kind === 'design' && m.refId === d.id);
  const reviews = user.reviews.filter((r) => r.kind === 'design' && r.refId === d.id);
  const share = user.shares.find((s) => s.designId === d.id);
  return (
    <>
      <TopBar title={d.kind === 'scratch' ? 'From scratch' : 'My version'} right={<IconButton name="share" label="Share" onClick={() => nav.push('share', { id: d.id })} />} />
      <PhotoPending className="hero-board" tag="Your layout"><BoardView boardId={d.board} items={d.items} uid={'item-' + d.id} /></PhotoPending>
      <div className="pad" style={{ marginTop: 18 }}>
        <div className="row wrap" style={{ gap: 6 }}>
          <span className={'tag ' + (d.kind === 'scratch' ? 'is-sage' : 'is-lav')}>{d.kind === 'scratch' ? 'From scratch' : 'Modified version'}</span>
          <span className="tag">{BOARDS[d.board].name}</span>
          {share && <span className="tag">{share.status === 'in-review' ? 'Proposed · in review' : 'Link shared'}</span>}
        </div>
        <h1 className="h1" style={{ marginTop: 10 }}>{d.name}</h1>
        {d.origin && (
          <p className="small" style={{ marginTop: 8 }}>
            Based on{' '}
            <button className="link" style={{ padding: 0 }} onClick={() => (d.origin.kind === 'presentation' ? nav.push('presentation', { id: d.origin.id, comp: d.origin.compositionId }) : d.origin.kind === 'community' ? nav.push('community', { id: d.origin.id }) : d.origin.kind === 'meal' ? nav.push('meal', { id: d.origin.id }) : null)}>
              {d.origin.name}{d.origin.home ? ` · Home #${d.origin.home}` : ''}
            </button>
          </p>
        )}
      </div>
      <div className="pad stack-8" style={{ marginTop: 16 }}>
        <Button block arrow onClick={() => nav.push('table', { source: { kind: 'design', id: d.id } })}>{made.length ? 'Make it again' : 'Bring it to the table'}</Button>
        <div className="row" style={{ gap: 8 }}>
          <Button variant="ghost" small className="grow" icon="edit" onClick={() => nav.push('designer', { id: d.id })}>Edit</Button>
          <Button variant="ghost" small className="grow" icon="copy" onClick={() => { const id = a.copyDesign(d.id); toast('Copy created. The original stays as it is.'); nav.push('designer', { id }); }}>Edit a copy</Button>
        </div>
        <Button variant="text" onClick={() => nav.push('shopping', { id: a.ensureList({ kind: 'design', id: d.id }) })}>Shopping list</Button>
      </div>

      <div className="pad section"><NotesBlock noteKey={`design:${d.id}`} /></div>

      <div className="pad section">
        <Kicker>Made</Kicker>
        {made.length === 0 && <p className="small">Not made yet.</p>}
        {made.map((m) => {
          const rv = reviews.find((r) => r.version === m.version);
          return (
            <div key={m.id} className="ing-row" style={{ display: 'block' }}>
              <div>{fmt(m.at)} <span className="small">· {m.version}</span></div>
              {rv && <><Stars value={rv.stars} size={15} />{rv.comment && <div className="small">{rv.comment}</div>}</>}
            </div>
          );
        })}
      </div>

      <div className="pad section">
        <ConfirmTap
          onConfirm={() => {
            nav.pop();
            updateUser((u) => { delete u.designs[d.id]; u.made = u.made.filter((m) => !(m.kind === 'design' && m.refId === d.id)); if (u.recent?.id === d.id) u.recent = null; });
          }}
          render={(armed, tap) => <button className="link" style={{ color: '#8c3f33', borderColor: '#c9a49c' }} onClick={tap}>{armed ? 'Tap again to remove' : 'Remove design'}</button>}
        />
      </div>
    </>
  );
}

// Detail for something made from an original (Yndarena or another Home).
export function MadeItem({ params }) {
  const nav = useNav();
  const { user } = useStore();
  const a = useActions();
  const m = user.made.find((x) => x.id === params.id);
  if (!m) return (<><TopBar title="" /><p className="pad body">Not found.</p></>);
  const isPres = m.kind === 'presentation';
  const p = isPres ? PRESENTATIONS[m.refId] : null;
  const c = !isPres ? COMMUNITY[m.refId] : null;
  const items = isPres ? presentationItems(m.refId, m.compositionId) : communityItems(m.refId);
  const rv = user.reviews.find((r) => r.kind === m.kind && r.refId === m.refId);
  return (
    <>
      <TopBar title="Made" />
      <PhotoPending className="hero-board" tag="Layout view"><BoardView boardId={isPres ? p.board : c.board} items={items} uid={'made-' + m.id} /></PhotoPending>
      <div className="pad" style={{ marginTop: 18 }}>
        <span className="tag">{fmt(m.at)}{m.version ? ' · ' + m.version : ''}</span>
        <h1 className="h1" style={{ marginTop: 10 }}>{isPres ? p.name : c.name}</h1>
        <p className="small">{isPres ? 'Yndarena board, made without changes.' : `Shared by Home #${c.home}.`}</p>
        {rv && <div style={{ marginTop: 8 }}><Stars value={rv.stars} size={18} />{rv.comment && <p className="small">{rv.comment}</p>}</div>}
      </div>
      <div className="pad stack-8" style={{ marginTop: 16 }}>
        <Button block arrow onClick={() => nav.push('table', { source: isPres ? { kind: 'presentation', id: m.refId, compositionId: m.compositionId } : { kind: 'community', id: m.refId } })}>Make it again</Button>
        <Button block variant="ghost" icon="edit" onClick={() => { const id = isPres ? a.fromPresentation(m.refId, m.compositionId) : a.fromCommunity(m.refId); nav.push('designer', { id }); }}>Edit a copy</Button>
      </div>
      <div className="pad section"><NotesBlock noteKey={`${m.kind}:${m.refId}`} /></div>
    </>
  );
}
