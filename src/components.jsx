import { useState } from 'react';
import BoardView from './board/BoardView.jsx';
import { ItemVisual } from './board/art.jsx';
import { ITEMS, BOARDS } from './data/catalog.js';
import { sizeOf } from './board/geometry.js';
import { PRESENTATIONS, OCCASIONS } from './data/presentations.js';
import { RECIPES } from './data/recipes.js';
import { COMMUNITY } from './data/community.js';
import { MEALS } from './data/meals.js';
import { presentationItems, communityItems } from './lib.js';
import { MEDIA, mediaFor } from './data/media.js';
import { useStore, isSaved } from './store.jsx';
import { useActions } from './actions.js';
import { useNav } from './nav.jsx';
import { Icon, IconButton, Meta, Sheet, Stars, Button, Segmented, PhotoPending, readPhoto, useToast, Chip } from './ui.jsx';

export function BoardThumb({ board, items, uid }) {
  return (
    <div className="thumb">
      <BoardView boardId={board} items={items} uid={uid} />
    </div>
  );
}

export function ItemIcon({ type, style, size = 64 }) {
  const it = ITEMS[type];
  const [w, h] = sizeOf({ type, qty: it.baseQty, style: style || it.styles[0].id });
  const m = Math.max(w, h) * 1.08;
  return (
    <svg viewBox={`${-m / 2} ${-m / 2} ${m} ${m}`} width={size} height={size} aria-hidden="true">
      <ItemVisual type={type} it={it} w={w} h={h} style={style || it.styles[0].id} qty={it.baseQty} seed={'icon-' + type} />
    </svg>
  );
}

export function SaveButton({ kind, id, light }) {
  const { user } = useStore();
  const a = useActions();
  const toast = useToast();
  const saved = isSaved(user, kind, id);
  return (
    <IconButton
      name="collection"
      label={saved ? 'Saved' : 'Save'}
      className={light ? 'on-light' : ''}
      active={saved}
      onClick={() => toast(a.toggleSave(kind, id) ? 'Saved to your collection.' : 'Removed from your collection.')}
    />
  );
}

// Responsive, lazy image for a registered asset, always labelled with what it is.
export function MediaImg({ id, sizes = '(max-width: 500px) 100vw, 390px', eager, tag = true }) {
  const m = mediaFor(id);
  return (
    <>
      <img src={m.src} srcSet={m.srcSet} sizes={sizes} alt={m.alt} width={m.width} height={m.height} loading={eager ? 'eager' : 'lazy'} decoding="async" />
      {tag && <span className="photo-tag">{m.label}</span>}
    </>
  );
}

// The visual that represents a presentation in lists: its editorial cover when there is one,
// otherwise the overhead photo of its first layout, otherwise the layout illustration.
export function presentationPhoto(id) {
  const p = PRESENTATIONS[id];
  const first = p.compositions[0].media;
  return p.media?.cover || first?.topView || first?.cover || null;
}

// The photo shown for one layout: its overhead reference when there is one, otherwise its inspiration cover.
export function compositionPhoto(comp) {
  return comp.media?.topView || comp.media?.cover || null;
}

export function PresentationVisual({ id, label, eager }) {
  const p = PRESENTATIONS[id];
  const photo = presentationPhoto(id);
  if (photo) return <div className="photo-hero"><MediaImg id={photo} eager={eager} /></div>;
  return (
    <PhotoPending className="board-art">
      <BoardView boardId={p.board} items={presentationItems(id, p.compositions[0].id)} label={label || `${p.name}, illustration`} />
    </PhotoPending>
  );
}

export function PresentationCard({ id, wide }) {
  const nav = useNav();
  const p = PRESENTATIONS[id];
  const occ = OCCASIONS.find((o) => o.id === p.occasion);
  return (
    <button className="card board-card tap" style={wide ? undefined : { width: 260 }} onClick={() => nav.push('presentation', { id })}>
      <PresentationVisual id={id} />
      <div className="card-body">
        <div className="kicker">{occ.label} · {p.context}</div>
        <div className="card-title" style={{ marginTop: 4 }}>{p.name}</div>
        <div className="metas" style={{ marginTop: 8 }}>
          <Meta icon="clock">{p.time} min</Meta>
          <Meta icon="people">Serves {p.serves}</Meta>
          {p.compositions.length > 1 && <Meta icon="grid">{p.compositions.length} layouts</Meta>}
        </div>
      </div>
    </button>
  );
}

// An everyday meal: its cover, name and the time to bring it to the table once the food is ready.
export function MealCard({ id, compact }) {
  const nav = useNav();
  const m = MEALS[id];
  const cover = mediaFor(m.cover);
  if (compact) {
    return (
      <button className="card tap meal-row" onClick={() => nav.push('meal', { id })}>
        <img src={cover.small} alt="" loading="lazy" decoding="async" />
        <div className="grow">
          <div className="kicker">{m.category}</div>
          <div className="h3" style={{ fontSize: 18, marginTop: 2 }}>{m.name}</div>
          <div className="small" style={{ fontSize: 13 }}>Serves {m.serves} · {m.minutes} min to serve</div>
        </div>
        <Icon name="chevron" size={18} />
      </button>
    );
  }
  return (
    <button className="card board-card tap" onClick={() => nav.push('meal', { id })}>
      <div className="photo-hero"><MediaImg id={m.cover} /></div>
      <div className="card-body">
        <div className="kicker">Everyday meal · {m.category}</div>
        <div className="card-title" style={{ marginTop: 4 }}>{m.name}</div>
        <p className="small" style={{ margin: '6px 0 8px' }}>{m.description}</p>
        <div className="metas">
          <Meta icon="clock">{m.minutes} min to serve</Meta>
          <Meta icon="people">Serves {m.serves}</Meta>
        </div>
      </div>
    </button>
  );
}

export function CommunityCard({ id, width = 240 }) {
  const nav = useNav();
  const c = COMMUNITY[id];
  return (
    <button className="card board-card tap" style={{ width }} onClick={() => nav.push('community', { id })}>
      <PhotoPending className="board-art" tag="Layout view">
        <BoardView boardId={c.board} items={communityItems(id)} uid={'cc-' + id} />
      </PhotoPending>
      <div className="card-body">
        <div className="kicker">Shared by Home #{c.home}</div>
        <div className="card-title" style={{ marginTop: 4, fontSize: 21 }}>{c.name}</div>
        <div className="metas" style={{ marginTop: 8 }}>
          <Meta icon="clock">{c.time} min</Meta>
          <Meta icon="people">Serves {c.serves}</Meta>
        </div>
      </div>
    </button>
  );
}

export function RecipeRow({ id, onClick }) {
  const nav = useNav();
  const r = RECIPES[id];
  return (
    <button className="list-row" onClick={onClick || (() => nav.push('recipe', { id }))}>
      <div className="thumb" style={{ width: 56, height: 56, borderRadius: 28 }}>
        {r.media?.cover ? <img src={MEDIA[r.media.cover].small} alt="" loading="lazy" decoding="async" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <ItemIcon type={r.item} size={56} />}
      </div>
      <div className="grow">
        <div>{r.name}</div>
        <div className="sub">{r.time} min · {r.difficulty}</div>
      </div>
      <Icon name="chevron" size={18} />
    </button>
  );
}

// "How did it turn out?" Board and recipe ratings live side by side, never as consecutive forms.
export function ReviewSheet({ open, onClose, target }) {
  const a = useActions();
  const toast = useToast();
  const recipes = target?.recipes || [];
  const [tab, setTab] = useState('board');
  const [stars, setStars] = useState(0);
  const [comment, setComment] = useState('');
  const [photo, setPhoto] = useState(null);
  const [note, setNote] = useState('');
  const [rec, setRec] = useState({});
  if (!target) return null;
  const isRecipeOnly = target.kind === 'recipe';
  const save = () => {
    if (!isRecipeOnly && stars) a.addReview({ kind: target.kind, refId: target.refId, version: target.version, stars, comment, photo, aspect: 'presentation' });
    if (isRecipeOnly && stars) a.addReview({ kind: 'recipe', refId: target.refId, version: 'original', stars, comment, photo, aspect: 'recipe' });
    for (const [rid, v] of Object.entries(rec)) if (v.stars) a.addReview({ kind: 'recipe', refId: rid, version: 'original', stars: v.stars, comment: v.comment || '', aspect: 'recipe' });
    if (note.trim() && target.madeId) a.setNote(target.noteKey, { text: note.trim() });
    toast('Thank you. It’s in your collection under Made.');
    onClose();
  };
  return (
    <Sheet open={open} onClose={onClose} title="How did it turn out?" tall>
      <p className="small" style={{ marginTop: 0 }}>All optional. Rate what you like, skip what you don’t.</p>
      {!isRecipeOnly && recipes.length > 0 && (
        <Segmented
          className="mb"
          value={tab}
          onChange={setTab}
          options={[{ id: 'board', label: 'The board' }, { id: 'recipes', label: `The recipes (${recipes.length})` }]}
        />
      )}
      {(tab === 'board' || isRecipeOnly) && (
        <div className="stack-16" style={{ marginTop: 18 }}>
          <div>
            <div className="label">{isRecipeOnly ? 'Taste, instructions and result' : 'Assembly and how it looked'}</div>
            <div style={{ marginTop: 6 }}><Stars value={stars} onChange={setStars} /></div>
          </div>
          <label className="field">
            <span className="label">Review</span>
            <textarea className="input" placeholder={isRecipeOnly ? 'How did it taste? Were the steps clear?' : 'Was it easy to build? How did it look on the table?'} value={comment} onChange={(e) => setComment(e.target.value)} />
          </label>
          <div>
            <div className="label">Photo · optional</div>
            <div className="photos" style={{ marginTop: 8 }}>
              {photo && <img src={photo} alt="Your photo" />}
              <label className="photo-add">
                <Icon name="camera" />
                <input type="file" accept="image/*" hidden onChange={async (e) => { if (e.target.files[0]) setPhoto(await readPhoto(e.target.files[0])); }} />
              </label>
            </div>
          </div>
          <div className="small muted">Your review is tied to {target.versionLabel || 'this version'}. In this preview it stays on this device.</div>
        </div>
      )}
      {tab === 'recipes' && !isRecipeOnly && (
        <div style={{ marginTop: 12 }}>
          {recipes.map((rid) => (
            <div key={rid} style={{ padding: '12px 0', borderBottom: '1px solid var(--c-line)' }}>
              <div className="h3" style={{ fontSize: 17 }}>{RECIPES[rid].name}</div>
              <div className="label" style={{ marginTop: 6 }}>Taste, instructions and result</div>
              <Stars size={22} value={rec[rid]?.stars || 0} onChange={(v) => setRec({ ...rec, [rid]: { ...rec[rid], stars: v } })} />
              <input className="input" style={{ fontSize: 15 }} placeholder="A few words, if you like" value={rec[rid]?.comment || ''} onChange={(e) => setRec({ ...rec, [rid]: { ...rec[rid], comment: e.target.value } })} />
            </div>
          ))}
        </div>
      )}
      {target.madeId && (
        <label className="field" style={{ marginTop: 22 }}>
          <span className="label">Private note · only you</span>
          <textarea className="input" placeholder="Who was there, what you changed, what to remember." value={note} onChange={(e) => setNote(e.target.value)} />
        </label>
      )}
      <div className="row" style={{ marginTop: 22 }}>
        <Button variant="ghost" small onClick={onClose}>Skip for now</Button>
        <Button small className="grow" onClick={save}>Save</Button>
      </div>
    </Sheet>
  );
}

export function NotesBlock({ noteKey }) {
  const { user } = useStore();
  const a = useActions();
  const n = user.notes[noteKey] || { text: '', photos: [] };
  const [text, setText] = useState(n.text);
  return (
    <div className="card card-pad">
      <div className="row-between">
        <div className="label">Private notes and photos</div>
        <span className="tag">Only you</span>
      </div>
      <textarea
        className="input"
        style={{ fontSize: 16 }}
        placeholder="Write anything you want to remember. Optional."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={() => text !== n.text && a.setNote(noteKey, { text })}
      />
      <div className="photos" style={{ marginTop: 12 }}>
        {n.photos.map((p, i) => <img key={i} src={p} alt={`Your photo ${i + 1}`} />)}
        <label className="photo-add" aria-label="Add a photo">
          <Icon name="camera" />
          <input type="file" accept="image/*" hidden onChange={async (e) => {
            if (!e.target.files[0]) return;
            const ph = await readPhoto(e.target.files[0]);
            a.setNote(noteKey, { photos: [...n.photos, ph], text });
          }} />
        </label>
      </div>
    </div>
  );
}

export function AddToBoardSheet({ open, onClose, rid }) {
  const { user } = useStore();
  const a = useActions();
  const nav = useNav();
  const r = RECIPES[rid];
  const it = ITEMS[r.item];
  const [style, setStyle] = useState(it.styles[0].id);
  const designs = Object.values(user.designs).sort((x, y) => (y.updatedAt > x.updatedAt ? 1 : -1));
  const [target, setTarget] = useState(designs[0]?.id || 'new');
  return (
    <Sheet open={open} onClose={onClose} title="Add to my board">
      <div className="label">Way to serve it</div>
      <div className="row wrap" style={{ marginTop: 8 }}>
        {it.styles.map((s) => <Chip key={s.id} active={style === s.id} onClick={() => setStyle(s.id)}>{s.label}</Chip>)}
      </div>
      <div className="label" style={{ marginTop: 20 }}>Board</div>
      <div style={{ marginTop: 4 }}>
        <button className="list-row" onClick={() => setTarget('new')}>
          <div className="round-ico"><Icon name="plus" size={18} /></div>
          <div className="grow"><div>Start a new board</div><div className="sub">On {BOARDS['cheese-bread'].name}, you can change it later</div></div>
          {target === 'new' && <Icon name="check" />}
        </button>
        {designs.map((d) => (
          <button key={d.id} className="list-row" onClick={() => setTarget(d.id)}>
            <BoardThumb board={d.board} items={d.items} uid={'atb-' + d.id} />
            <div className="grow"><div>{d.name}</div><div className="sub">{d.items.length} groups</div></div>
            {target === d.id && <Icon name="check" />}
          </button>
        ))}
      </div>
      <Button block arrow style={{ marginTop: 18 }} onClick={() => {
        const id = a.addRecipe(rid, target === 'new' ? null : target, style);
        onClose();
        nav.push('designer', { id, focus: r.item });
      }}>Add and open Designer</Button>
    </Sheet>
  );
}
