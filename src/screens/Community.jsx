import { useState } from 'react';
import { useNav } from '../nav.jsx';
import { useStore } from '../store.jsx';
import { useActions, sharedItems } from '../actions.js';
import { TopBar, Button, Kicker, Meta, DemoNote, PhotoPending, Icon, Sprig, useToast } from '../ui.jsx';
import { SaveButton } from '../components.jsx';
import { IngredientList, TechPills } from './Presentation.jsx';
import BoardView from '../board/BoardView.jsx';
import { COMMUNITY } from '../data/community.js';
import { BOARDS } from '../data/catalog.js';
import { communityItems, techniquesFor, servingSplitText } from '../lib.js';
import { shareList } from './Shopping.jsx';
import { WORDMARK } from '../assets.js';

export default function Community({ params }) {
  const nav = useNav();
  const a = useActions();
  const c = COMMUNITY[params.id];
  const items = communityItems(params.id);
  return (
    <>
      <TopBar transparent title="" right={<SaveButton kind="community" id={params.id} />} />
      <div style={{ marginTop: 'calc(-1 * (var(--safe-top) + 54px))' }}>
        <PhotoPending className="hero-board" tag="Layout view · no photo shared">
          <div style={{ height: 'calc(var(--safe-top) + 40px)' }} />
          <BoardView boardId={c.board} items={items} uid={'h2h-' + params.id} />
        </PhotoPending>
      </div>
      <div className="pad" style={{ marginTop: 20 }}>
        <Kicker>From home to home</Kicker>
        <h1 className="h1" style={{ marginTop: 6 }}>{c.name}</h1>
        <div className="row wrap" style={{ gap: 6, marginTop: 10 }}>
          <span className="tag is-lav">Shared by Home #{c.home}</span>
          <span className="tag">Reviewed by Yndarena</span>
        </div>
        <div className="metas" style={{ marginTop: 12 }}>
          <Meta icon="clock">{c.time} min</Meta>
          <Meta icon="people">Serves {c.serves}</Meta>
          <Meta icon="grid">{BOARDS[c.board].name}</Meta>
        </div>
      </div>
      {c.note && (
        <div className="memory" style={{ marginTop: 20 }}>
          <div>
            <div className="label" style={{ marginBottom: 6 }}>A note from Home #{c.home}</div>
            <p style={{ fontSize: 20 }}>“{c.note}”</p>
          </div>
          <Sprig style={{ height: 54 }} />
        </div>
      )}
      {c.origin && (
        <p className="small pad" style={{ marginTop: 14 }}>
          A new version of <button className="link" style={{ padding: 0 }} onClick={() => nav.push('presentation', { id: c.origin.id })}>{c.origin.name}</button>
        </p>
      )}
            <div className="pad section" style={{ marginTop: 10 }}>
        <div className="row-between">
          <h2 className="h2">Ingredients</h2>
          <button className="link" onClick={() => nav.push('shopping', { id: a.ensureList({ kind: 'community', id: params.id }) })}>Shopping list</button>
        </div>
        <IngredientList items={items} />
        {servingSplitText(items) && <p className="small" style={{ marginTop: 10 }}>On a 33 × 24 cm board: {servingSplitText(items)}</p>}
      </div>
      <div className="pad section">
        <h2 className="h2">Techniques</h2>
        <div style={{ marginTop: 10 }}><TechPills ids={techniquesFor(items)} /></div>
      </div>
      <div className="pad" style={{ marginTop: 24 }}>
        <DemoNote>Demo data. This creation, its note and Home number are examples. No rankings or follower counts, by design.</DemoNote>
      </div>
      <div className="sticky-cta">
        <Button variant="ghost" small className="grow" icon="edit" onClick={() => { const id = a.fromCommunity(params.id); nav.push('designer', { id }); }}>Make it yours</Button>
        <Button small className="grow" onClick={() => nav.push('table', { source: { kind: 'community', id: params.id } })}>Bring it to the table</Button>
      </div>
    </>
  );
}

// ---------- Sharing your own design ----------
export function encodeShare(d, homeNo, note) {
  // u: 'mm' marks board millimetres; links made before have none and use the 600 × 400 canvas. Item flags: a alongside, r refill, c stacked.
  const payload = { u: 'mm', n: d.name.replace(/ · (My version|Copy)$/, ''), b: d.board, h: homeNo, t: note || undefined, o: d.origin?.name, i: d.items.map((i) => [i.type, i.qty, Math.round(i.x * 10) / 10, Math.round(i.y * 10) / 10, i.r || 0, i.style, (i.alongside ? 'a' : '') + (i.overflow === 'refill' ? 'r' : '') + (i.arrange === 'column' ? 'c' : '')]) };
  const json = JSON.stringify(payload);
  return btoa(unescape(encodeURIComponent(json))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
export function decodeShare(s) {
  try {
    const b = s.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(decodeURIComponent(escape(atob(b))));
  } catch { return null; }
}

export function ShareDesign({ params }) {
  const nav = useNav();
  const toast = useToast();
  const { user, updateUser, homeNo } = useStore();
  const d = user.designs[params.id];
  const [withNote, setWithNote] = useState(false);
  const [note, setNote] = useState('');
  const [done, setDone] = useState(null);
  if (!d) return null;
  const url = `${location.href.split('#')[0]}#/s/${encodeShare(d, homeNo, withNote ? note : '')}`;
  const visible = [
    'Board name and layout',
    'Ingredients and quantities',
    `“Shared by Home #${homeNo}”`,
    d.origin ? `Based on ${d.origin.name}` : null,
    withNote && note ? 'Your note to other Homes' : null,
  ].filter(Boolean);

  return (
    <>
      <TopBar close title="Share" />
      <div className="pad">
        <h1 className="h1">Share {d.name.replace(/ · (My version|Copy)$/, '')}</h1>
        <div className="build-board" style={{ marginTop: 14, borderRadius: 14 }}><BoardView boardId={d.board} items={d.items} uid={'share-' + d.id} /></div>
      </div>
      <div className="pad section" style={{ marginTop: 20 }}>
        <Kicker>What others will see</Kicker>
        {visible.map((v) => (
          <div key={v} className="check-row is-done" style={{ cursor: 'default' }}>
            <span className="box"><Icon name="check" size={14} stroke={2} /></span>
            <span style={{ fontSize: 16 }}>{v}</span>
          </div>
        ))}
        <label className="check" style={{ marginTop: 14 }}>
          <input type="checkbox" checked={withNote} onChange={(e) => setWithNote(e.target.checked)} />
          <span className="box">{withNote && <Icon name="check" size={14} stroke={2} />}</span>
          <span>Add a short note for other Homes</span>
        </label>
        {withNote && <textarea className="input" style={{ marginTop: 6 }} placeholder="What made this one special?" value={note} maxLength={240} onChange={(e) => setNote(e.target.value)} />}
        <div className="card card-pad" style={{ marginTop: 16 }}>
          <div className="label">Always private</div>
          <p className="small" style={{ margin: '4px 0 0' }}>Your private notes, photos, ratings and email are never shared.</p>
        </div>
      </div>
      <div className="pad stack-8 section">
        <Button block icon="link" onClick={() => {
          updateUser((u) => { if (!u.shares.find((s) => s.designId === d.id)) u.shares.push({ designId: d.id, status: 'link', at: new Date().toISOString() }); });
          shareList(d.name, `A board from my Yndarena Home: ${url}`, toast);
          setDone('link');
        }}>Share a link</Button>
        <p className="small muted" style={{ margin: '2px 0 10px' }}>Anyone with the link can view it without an account. To save or edit it, they sign in to their own Home.</p>
        <Button block variant="ghost" onClick={() => {
          updateUser((u) => { const s = u.shares.find((x) => x.designId === d.id); if (s) s.status = 'in-review'; else u.shares.push({ designId: d.id, status: 'in-review', note, at: new Date().toISOString() }); });
          setDone('propose');
          toast('Sent to Yndarena for review.');
        }}>Propose to From home to home</Button>
        <p className="small muted" style={{ margin: '2px 0 0' }}>Yndarena reviews every creation before it appears for other Homes.</p>
        {done === 'link' && <DemoNote>Preview link: it encodes the board in the URL, so it opens in any browser. <a href={url} target="_blank" rel="noreferrer" style={{ color: 'inherit' }}>Open it</a></DemoNote>}
        {done === 'propose' && <DemoNote>Simulated. Nothing is sent. In the app this goes to Yndarena’s review queue.</DemoNote>}
        <Button variant="text" onClick={() => nav.pop()}>Done</Button>
      </div>
    </>
  );
}

// Public view of a shared link. Works without signing in.
export function SharedView({ payload, onSignIn, onClose }) {
  const { user } = useStore();
  const a = useActions();
  const nav = useNav();
  const toast = useToast();
  const items = sharedItems(payload).map((it, i) => ({ ...it, uid: 's' + i }));
  const act = (kind) => {
    if (!user) { onSignIn(kind); return; }
    const id = a.fromShared(payload);
    onClose();
    if (kind === 'edit') nav.switchTab('collection', { name: 'designer', params: { id } });
    else { nav.switchTab('collection', { name: 'item', params: { id } }); toast('Saved to your collection.'); }
  };
  return (
    <div className="screen is-full">
      <div className="screen-scroll">
        <div className="app-head">
          <img className="wordmark" src={WORDMARK} alt="Yndarena, turning houses into homes" />
          <button className="link" onClick={onClose}>{user ? 'Back to my Home' : 'Open the app'}</button>
        </div>
        <div className="pad" style={{ marginTop: 14 }}>
          <Kicker>A board shared with you</Kicker>
          <h1 className="h1" style={{ marginTop: 6 }}>{payload.n}</h1>
          <div className="row wrap" style={{ gap: 6, marginTop: 10 }}>
            <span className="tag is-lav">Shared by Home #{payload.h}</span>
            <span className="tag">{BOARDS[payload.b]?.name}</span>
          </div>
        </div>
        <div className="build-board" style={{ marginTop: 14 }}><BoardView boardId={payload.b} items={items} uid="shared" /></div>
        {payload.t && <div className="memory"><p style={{ fontSize: 20 }}>“{payload.t}”</p><Sprig style={{ height: 50 }} /></div>}
        {payload.o && <p className="small pad" style={{ marginTop: 12 }}>Based on {payload.o}</p>}
        <div className="pad section">
          <h2 className="h2">Ingredients</h2>
          <IngredientList items={items} />
        </div>
        <div className="sticky-cta" style={{ marginTop: 18 }}>
          <Button variant="ghost" small className="grow" onClick={() => act('save')}>Save</Button>
          <Button small className="grow" onClick={() => act('edit')}>Make it yours</Button>
        </div>
        {!user && <p className="small pad" style={{ textAlign: 'center' }}>You can look without an account. To save or edit, sign in to your Home.</p>}
      </div>
    </div>
  );
}

