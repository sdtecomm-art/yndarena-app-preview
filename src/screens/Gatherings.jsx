import { useState } from 'react';
import { useNav } from '../nav.jsx';
import { useStore } from '../store.jsx';
import { TopBar, Button, Icon, Sheet, Chip, DemoNote, useToast, ConfirmTap, PhotoSlot } from '../ui.jsx';
import { useShared } from '../gatherings/useShared.js';
import { host, links, SIMULATED } from '../gatherings/sim.js';
import { VideoSlot } from './Gifts.jsx';
import {
  TYPES, typeOf, amountText, itemLabel, isComplete, isMajorChange, progress,
  whenText, dateText, timeText, startInstant, deviceTimeZone,
} from '../gatherings/model.js';

// ---------- shared bits ----------
const isPast = (g) => startInstant(g.startsAt, g.tz) < Date.now() - 6 * 3600e3;

function nextSaturday(hour) {
  const d = new Date();
  d.setDate(d.getDate() + ((6 - d.getDay() + 7) % 7 || 7));
  const p = (n) => String(n).padStart(2, '0');
  return { date: `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`, time: `${p(hour)}:00` };
}

export function ProgressLine({ g }) {
  const p = progress(g);
  if (!g.items.length) return null;
  return (
    <div className="g-progress">
      <div className="g-bar" aria-hidden="true"><span style={{ width: p.total ? `${(p.covered / p.total) * 100}%` : 0 }} /></div>
      <div className="g-progress-t"><strong>{p.covered} of {p.total}</strong> items confirmed{p.waiting ? ` · ${p.waiting} waiting for a yes` : ''}</div>
    </div>
  );
}

async function share(url, title, toast) {
  try {
    if (navigator.share) { await navigator.share({ title, url }); return; }
  } catch (e) { if (e?.name === 'AbortError') return; }
  try { await navigator.clipboard.writeText(url); toast('Link copied.'); } catch (e) { toast('Copy the link from the box below.'); }
}

// ---------- Gatherings tab ----------
export default function Gatherings() {
  const nav = useNav();
  const { email } = useStore();
  const list = useShared(() => host.list(email));
  const upcoming = list.filter((g) => g.status === 'active' && !isPast(g)).sort((a, b) => startInstant(a.startsAt, a.tz) - startInstant(b.startsAt, b.tz));
  const earlier = list.filter((g) => !upcoming.includes(g)).sort((a, b) => startInstant(b.startsAt, b.tz) - startInstant(a.startsAt, a.tz));
  return (
    <div className="gatherings">
      <header className="care-head pad">
        <h1 className="display-l">Gatherings</h1>
        <p className="lead" style={{ margin: '8px 0 0' }}>Organize what everyone brings.</p>
        <PhotoSlot shot="A shared table with the dishes guests brought, a Yndarena board in the middle." ratio="3 / 2" className="head-photo" />
        <Button block style={{ marginTop: 18 }} onClick={() => nav.push('gathering-new')}>Plan a gathering</Button>
      </header>
      {upcoming.length === 0 && earlier.length === 0 && (
        <div className="pad g-empty">
          <p>Make a list of food and drinks, share one link, and everyone picks what they’ll bring. Guests don’t need the app or an account.</p>
        </div>
      )}
      {upcoming.length > 0 && (
        <section className="pad" style={{ marginTop: 26 }}>
          <div className="section-label"><span>Coming up</span></div>
          <div className="stack-8" style={{ marginTop: 10 }}>{upcoming.map((g) => <GatheringCard key={g.id} g={g} />)}</div>
        </section>
      )}
      {earlier.length > 0 && (
        <section className="pad" style={{ marginTop: 26 }}>
          <div className="section-label"><span>Earlier</span></div>
          <div className="stack-8" style={{ marginTop: 10 }}>{earlier.map((g) => <GatheringCard key={g.id} g={g} />)}</div>
        </section>
      )}
      <div className="pad">
        <VideoSlot title="How Gatherings works" text="Make the list, share one link, and everyone picks what they’ll bring. Guests don’t need the app. About a minute." />
        {SIMULATED && <p className="small muted" style={{ marginTop: 8 }}>Preview: space reserved for the video. It isn’t recorded yet.</p>}
      </div>
    </div>
  );
}

export function GatheringCard({ g, compact }) {
  const nav = useNav();
  const p = progress(g);
  const state = g.status === 'cancelled' ? 'Cancelled' : isPast(g) ? 'Past' : null;
  return (
    <button className="g-card" onClick={() => nav.push('gathering', { id: g.id })}>
      <span className="g-card-date" aria-hidden="true"><span className="m">{dateText(g.startsAt, false).slice(0, 3)}</span><span className="d">{g.startsAt.slice(8, 10).replace(/^0/, '')}</span></span>
      <span className="grow">
        <span className="g-card-t">{g.name}</span>
        <span className="g-card-s">{state ? `${state} · ` : ''}{timeText(g.startsAt)} · {g.people} people</span>
        {!state && !compact && <span className="g-card-p">{p.covered} of {p.total} items confirmed{p.waiting ? ` · ${p.waiting} waiting for a yes` : ''}</span>}
        {!state && compact && <span className="g-card-p">{p.open ? `${p.open} still needed` : 'Everything has someone'}</span>}
      </span>
      <Icon name="chevron" size={18} />
    </button>
  );
}

// ---------- Create ----------
export function GatheringNew({ params = {} }) {
  const nav = useNav();
  const { email } = useStore();
  const toast = useToast();
  const from = params.from ? host.get(email, params.from) : null;
  const [type, setType] = useState(from?.type || 'dinner');
  const start = nextSaturday(typeOf(type).hour);
  const [date, setDate] = useState(start.date);
  const [time, setTime] = useState(start.time);
  const [people, setPeople] = useState(from?.people || 6);
  const [includeSelf, setIncludeSelf] = useState(true);
  const [name, setName] = useState(from ? from.name : typeOf(type).name);
  const [named, setNamed] = useState(!!from);
  const [busy, setBusy] = useState(false);

  const pick = (t) => { setType(t); if (!named) setName(typeOf(t).name); if (!from) setTime(nextSaturday(typeOf(t).hour).time); };
  const create = async () => {
    if (busy) return;
    setBusy(true);
    // Reusing a list copies only food, drinks and amounts: no guests, emails, confirmations or reminders.
    const items = from ? from.items.map((i) => ({ name: i.name, note: amountText(i) })) : [];
    const id = await host.create(email, { type, name: name.trim() || typeOf(type).name, startsAt: `${date}T${time}`, tz: deviceTimeZone(), people, includeSelf, hostName: '', items });
    nav.replace('gathering', { id, fresh: true });
    toast('Now add what people can bring.');
  };
  return (
    <>
      <TopBar title={from ? 'Use this list again' : 'Plan a gathering'} />
      <div className="pad g-create">
        {from && <p className="small" style={{ marginTop: 0 }}>Food, drinks and amounts from “{from.name}”. Guests, emails and reminders are not copied.</p>}
        <fieldset className="g-fs">
          <legend className="g-q">What are you planning?</legend>
          <div className="g-types">{TYPES.map((t) => <Chip key={t.id} active={type === t.id} onClick={() => pick(t.id)}>{t.label}</Chip>)}</div>
        </fieldset>
        <div className="g-q">When?</div>
        <div className="row" style={{ gap: 12 }}>
          <label className="field grow"><span className="label">Date</span><input className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} /></label>
          <label className="field" style={{ width: 130 }}><span className="label">Time</span><input className="input" type="time" value={time} onChange={(e) => setTime(e.target.value)} /></label>
        </div>
        <div className="g-q">How many people?</div>
        <div className="row-between">
          <div className="stepper" role="group" aria-label="Number of people">
            <button onClick={() => setPeople(Math.max(1, people - 1))} aria-label="Fewer people"><Icon name="minus" size={18} /></button>
            <span aria-live="polite">{people} people</span>
            <button onClick={() => setPeople(Math.min(60, people + 1))} aria-label="More people"><Icon name="plus" size={18} /></button>
          </div>
        </div>
        <label className="check" style={{ marginTop: 12 }}>
          <input type="checkbox" checked={includeSelf} onChange={(e) => setIncludeSelf(e.target.checked)} />
          <span className="box">{includeSelf && <Icon name="check" size={14} stroke={2} />}</span>
          <span>Include yourself</span>
        </label>
        <label className="field" style={{ marginTop: 22 }}>
          <span className="label">Name</span>
          <input className="input" value={name} maxLength={60} onChange={(e) => { setName(e.target.value); setNamed(true); }} />
        </label>
        <p className="small muted" style={{ marginTop: 8 }}>You can add a place or a note later. No address needed.</p>
        <Button block style={{ marginTop: 18 }} disabled={busy || !date || !time} onClick={create}>Create my list</Button>
      </div>
    </>
  );
}

// ---------- Host view ----------
const rowState = (it) => {
  if (!isComplete(it)) return { tag: 'Amount needed', who: 'Not shared yet' };
  if (it.status === 'open') return { tag: 'Still needed', who: 'Nobody yet' };
  if (it.status === 'host') return { tag: 'You’re providing', who: 'You' };
  if (it.status === 'change') return { tag: 'Needs confirmation', who: it.claim.name, warn: true };
  return { tag: it.claim.source === 'host' || it.claim.confirmedBy === 'host' ? 'Confirmed by host' : 'Confirmed', who: it.claim.name };
};

function ItemRow({ it, onOpen }) {
  const s = rowState(it);
  return (
    <button className={'g-row' + (s.warn ? ' is-warn' : '')} onClick={() => onOpen(it.id)}>
      <span className="grow">
        <span className="g-row-t">{it.name}</span>
        {amountText(it) && <span className="g-row-a">{amountText(it)}</span>}
      </span>
      {it.status === 'open' && isComplete(it) ? <Icon name="chevron" size={16} /> : (
        <span className="g-row-who">
          <span className="g-row-name">{s.who}</span>
          <span className={'g-tag' + (s.warn ? ' is-warn' : '')}>{s.warn && <Icon name="info" size={12} />}{s.tag}</span>
        </span>
      )}
    </button>
  );
}

export function GatheringHost({ params }) {
  const nav = useNav();
  const toast = useToast();
  const { email } = useStore();
  const g = useShared(() => host.get(email, params.id));
  const [sheet, setSheet] = useState(null); // {kind, id}
  if (!g) return <><TopBar title="Gathering" /><div className="pad"><p className="body">This gathering is no longer here.</p></div></>;
  const live = g.items;
  const needed = live.filter((i) => i.status === 'open' || !isComplete(i));
  const mine = live.filter((i) => i.status === 'host');
  const guests = live.filter((i) => isComplete(i) && (i.status === 'claimed' || i.status === 'change')).sort((a, b) => (a.status === 'change' ? -1 : 1) - (b.status === 'change' ? -1 : 1));
  const url = links.guest(g.publicId);
  const cancelled = g.status === 'cancelled';
  const anyGuest = guests.length > 0;
  const open = (id) => setSheet({ kind: 'item', id });

  return (
    <>
      <TopBar title="Your gathering" />
      <div className="pad g-host">
        {cancelled && <div className="g-banner">This gathering was cancelled. Its reminders are stopped and its link shows the cancellation.</div>}
        <h1 className="display-m" style={{ marginTop: 4 }}>{g.name}</h1>
        <p className="g-when">{whenText(g.startsAt)} · {g.people} people{g.location ? ` · ${g.location}` : ''}</p>
        {g.note && <p className="small" style={{ margin: '6px 0 0' }}>{g.note}</p>}
        <ProgressLine g={g} />
        {!cancelled && live.length === 0 && (
          <div className="g-start">
            <h2 className="h2">What should people bring?</h2>
            <p className="small" style={{ margin: '6px 0 14px' }}>Add what you’d like people to bring. Then share one link and they pick.</p>
            <Button block onClick={() => setSheet({ kind: 'add' })}>Add the first item</Button>
            <Button block variant="text" style={{ marginTop: 4 }} onClick={() => setSheet({ kind: 'details' })}>Edit details</Button>
          </div>
        )}
        {!cancelled && live.length > 0 && (
          <div className="g-actions">
            <Button small className="grow" onClick={() => share(url, g.name, toast)}>Share gathering</Button>
            <Button small variant="ghost" className="grow" onClick={() => setSheet({ kind: 'add' })}>Add an item</Button>
            <Button small variant="ghost" className="grow" onClick={() => setSheet({ kind: 'details' })}>Edit details</Button>
          </div>
        )}
        {live.length > 0 && <>
          <Group title="Still needed" empty="Every item has someone.">{needed.map((it) => <ItemRow key={it.id} it={it} onOpen={open} />)}</Group>
          <Group title="You’re providing" empty="Tap an item and choose “I’ll provide this”.">{mine.map((it) => <ItemRow key={it.id} it={it} onOpen={open} />)}</Group>
          <Group title="Guests are bringing" empty="When guests pick something, it shows up here.">{guests.map((it) => <ItemRow key={it.id} it={it} onOpen={open} />)}</Group>
        </>}

        {live.length > 0 && <section className="g-sec">
          <div className="section-label"><span>Share</span></div>
          <div className="g-link"><code>{url}</code></div>
          <a className="link" href={url} target="_blank" rel="noreferrer">Open the guest page</a>
        </section>}

        <HostReminders g={g} />

        {live.length > 0 && <section className="g-sec">
          <Button block variant="ghost" onClick={() => nav.push('gathering-new', { from: g.id })}>Use this list again</Button>
        </section>}
        {SIMULATED && <div style={{ marginTop: 16 }}><DemoNote>Preview: this list is saved in this browser only. Guests on other phones can’t see it yet, and nothing is sent.</DemoNote></div>}
      </div>

      <ItemSheet g={g} id={sheet?.kind === 'item' ? sheet.id : null} onClose={() => setSheet(null)} />
      <AddSheet g={g} open={sheet?.kind === 'add'} onClose={() => setSheet(null)} />
      <DetailsSheet g={g} open={sheet?.kind === 'details'} onClose={() => setSheet(null)} />
    </>
  );
}

function Group({ title, empty, children }) {
  const n = Array.isArray(children) ? children.length : 0;
  return (
    <section className="g-sec">
      <div className="g-group-h"><h2 className="h2">{title}</h2><span className="g-count">{n}</span></div>
      {n ? <div className="g-rows">{children}</div> : <p className="small muted g-empty-row">{empty}</p>}
    </section>
  );
}

function HostReminders({ g }) {
  const { email } = useStore();
  const ch = g.hostChannels || {};
  const outbox = (g.outbox || []).filter((e) => e.status !== 'cancelled');
  const fmt = (ms) => new Date(ms).toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', timeZone: g.tz });
  const label = { 'host-24h': 'You · 24 hours before', 'host-3h': 'You · 3 hours before', 'guest-3h': 'Guest · 3 hours before' };
  return (
    <section className="g-sec">
      <div className="section-label"><span>Remind me by</span></div>
      <p className="small" style={{ margin: '8px 0 0' }}>A summary 24 hours before, and 3 hours before only if something is still needed. Choose one or both.</p>
      {[['push', 'Push notifications', 'On this phone. It asks for permission the first time.'], ['email', 'Email', 'To the address on your account.']].map(([k, t, d]) => (
        <button key={k} className="list-row" role="switch" aria-checked={!!ch[k]} disabled={g.status !== 'active'} onClick={() => host.channels(email, g.id, { ...ch, [k]: !ch[k] })}>
          <div className="grow"><div>{t}</div><div className="sub">{d}</div></div>
          <span className={'switch' + (ch[k] ? ' is-on' : '')} />
        </button>
      ))}
      {outbox.length > 0 && (
        <details className="g-outbox">
          <summary>Reminders and notices · {outbox.length} <span className="g-sim">simulated</span></summary>
          <ul>
            {outbox.map((e) => (
              <li key={e.key}>
                <span className="grow">{e.type === 'reminder' ? label[e.kind] : e.label}<span className="sub">{e.type === 'reminder' ? `${fmt(e.at)} · ${e.channel}` : `${e.to === 'host' ? 'To you' : 'To the guest'} · ${e.channel}`}</span></span>
                <span className="g-tag">{e.type === 'reminder' ? 'Scheduled' : 'Would send'}</span>
              </li>
            ))}
          </ul>
          <p className="small muted" style={{ margin: '6px 0 0' }}>Nothing is delivered from this preview. Real sending needs the notification and email services.</p>
        </details>
      )}
    </section>
  );
}

// ---------- item editing ----------
function AmountForm({ value, onChange }) {
  const v = value;
  return (
    <div className="stack-16">
      <label className="field"><span className="label">What</span><input className="input" autoFocus value={v.name} maxLength={60} placeholder="Ice" onChange={(e) => onChange({ ...v, name: e.target.value })} /></label>
      <label className="field"><span className="label">How much, optional</span><input className="input" value={v.note} maxLength={40} placeholder="2 bags" onChange={(e) => onChange({ ...v, note: e.target.value })} /></label>
    </div>
  );
}

const blankItem = { name: '', note: '' };

function AddSheet({ g, open, onClose }) {
  const { email } = useStore();
  const toast = useToast();
  const [v, setV] = useState(blankItem);
  return (
    <Sheet open={open} onClose={() => { setV(blankItem); onClose(); }} title="Add an item" tall>
      <AmountForm value={v} onChange={setV} />
      <Button block style={{ marginTop: 18 }} disabled={!v.name.trim()} onClick={async () => { await host.addItem(email, g.id, v); setV(blankItem); onClose(); }}>Add to the list</Button>
      <Button block variant="ghost" style={{ marginTop: 8 }} disabled={!v.name.trim()} onClick={async () => { await host.addItem(email, g.id, v); setV(blankItem); toast(`${v.name.trim()} added. Add the next one.`); }}>Add and add another</Button>
    </Sheet>
  );
}

function ItemSheet({ g, id, onClose }) {
  const { email } = useStore();
  const toast = useToast();
  const it = g.items.find((x) => x.id === id);
  const [mode, setMode] = useState(null); // edit | typo | confirmFor | ask
  const [v, setV] = useState(null);
  const [who, setWho] = useState('');
  const close = () => { setMode(null); setV(null); setWho(''); onClose(); };
  if (!it) return <Sheet open={false} onClose={close} />;
  const taken = it.claim && it.status !== 'host';
  const cur = { name: it.name, note: amountText(it) };
  const startEdit = (m) => { setV({ ...cur }); setMode(m); };
  const save = async () => {
    const r = { name: v.name.trim(), note: v.note.trim() };
    if (taken && isMajorChange(it.claim.accepted, r)) { setMode('ask'); return; }
    await host.editItem(email, g.id, it.id, r); close();
  };
  const run = async (fn, msg) => { try { await fn(); if (msg) toast(msg); close(); } catch (e) { toast(e.message === 'taken' ? 'Someone took this item a moment ago.' : 'That didn’t work. Try again.'); close(); } };
  const s = rowState(it);
  return (
    <Sheet open={!!id} onClose={close} title={mode === 'ask' ? 'Request a change?' : it.name} tall>
      {!mode && (
        <>
          {amountText(it) && <p className="g-sheet-a">{amountText(it)}</p>}
          <p className="small" style={{ margin: '2px 0 14px' }}>{s.tag}{taken ? ` · ${it.claim.name}` : ''}</p>
          {it.status === 'change' && <ChangeBox it={it} g={g} />}
          {g.status === 'active' && (
            <div className="stack-8">
              {it.status === 'open' && isComplete(it) && <Button block onClick={() => run(() => host.provide(email, g.id, it.id, true))}>I’ll provide this</Button>}
              {it.status === 'open' && isComplete(it) && <Button block variant="ghost" onClick={() => setMode('confirmFor')}>Someone confirmed with me</Button>}
              {it.status === 'host' && <Button block variant="ghost" onClick={() => run(() => host.provide(email, g.id, it.id, false))}>I won’t provide this</Button>}
              {it.status === 'change' && <Button block onClick={() => share(links.guest(g.publicId), `${g.name}: change to ${it.name}`, toast).then(() => host.sharedUpdate(email, g.id, it.id))}>Share update</Button>}
              {it.status === 'change' && <Button block variant="ghost" onClick={() => run(() => host.confirmChange(email, g.id, it.id), `Marked as confirmed by you for ${it.claim.name}.`)}>{it.claim.name} confirmed with me</Button>}
              {taken ? (
                <>
                  <Button block variant="ghost" onClick={() => startEdit('typo')}>Fix a typo in the name</Button>
                  <Button block variant="ghost" onClick={() => startEdit('edit')}>Change the amount</Button>
                  <ConfirmTap onConfirm={() => run(() => host.release(email, g.id, it.id), `${it.name} is needed again. Let ${it.claim.name} know.`)} render={(armed, tap) => <Button block variant="text" onClick={tap}>{armed ? `Tap again. Remember to tell ${it.claim.name}.` : 'Free this item'}</Button>} />
                </>
              ) : (
                <>
                  <Button block variant="ghost" onClick={() => startEdit('edit')}>Edit</Button>
                  <Button block variant="text" onClick={() => run(() => host.removeItem(email, g.id, it.id))}>Remove from the list</Button>
                </>
              )}
            </div>
          )}
        </>
      )}
      {mode === 'confirmFor' && (
        <>
          <p className="small" style={{ marginTop: 0 }}>For someone who told you in person or by message. It will show as “Confirmed by host”.</p>
          <label className="field"><span className="label">Their name</span><input className="input" autoFocus value={who} maxLength={40} onChange={(e) => setWho(e.target.value)} /></label>
          <Button block style={{ marginTop: 16 }} disabled={!who.trim()} onClick={() => run(() => host.confirmFor(email, g.id, it.id, who), `${who.trim()} is bringing ${it.name}.`)}>Save</Button>
        </>
      )}
      {mode === 'typo' && (
        <>
          <p className="small" style={{ marginTop: 0 }}>A small correction to the name. {it.claim.name} doesn’t need to confirm again.</p>
          <label className="field"><span className="label">Name</span><input className="input" autoFocus value={v.name} maxLength={60} onChange={(e) => setV({ ...v, name: e.target.value })} /></label>
          <Button block style={{ marginTop: 16 }} disabled={!v.name.trim()} onClick={() => run(() => host.editItem(email, g.id, it.id, { ...cur, name: v.name.trim() }))}>Save</Button>
        </>
      )}
      {mode === 'edit' && (
        <>
          {taken && <p className="small" style={{ marginTop: 0 }}>{it.claim.name} agreed to bring {itemLabel(it.claim.accepted)}. A new amount asks them to confirm again.</p>}
          <AmountForm value={v} onChange={setV} />
          <Button block style={{ marginTop: 18 }} disabled={!v.name.trim()} onClick={save}>Save</Button>
        </>
      )}
      {mode === 'ask' && (
        <>
          <p className="body" style={{ marginTop: 0 }}><strong>{it.claim.name} agreed to bring {itemLabel(it.claim.accepted)}.</strong> Ask for {itemLabel({ name: v.name.trim(), note: v.note.trim() })} instead?</p>
          <p className="small">Until {it.claim.name} says yes, this item shows “Needs confirmation” and doesn’t count as covered. Nobody else can take it.</p>
          <div className="stack-8" style={{ marginTop: 14 }}>
            <Button block onClick={() => run(() => host.requestChange(email, g.id, it.id, { name: v.name.trim(), note: v.note.trim() }), 'Change requested.')}>Request change</Button>
            <Button block variant="ghost" onClick={() => setMode(null)}>Cancel</Button>
          </div>
        </>
      )}
    </Sheet>
  );
}

// What was agreed, what is asked now, and what we actually know about the notice.
function ChangeBox({ it, g }) {
  const c = it.change;
  const emailQueued = (g.outbox || []).some((e) => e.type === 'notice' && (e.key.startsWith(`change|${c.id}`) || e.key.startsWith(`time|${it.claim.id}|${g.startsAt}`)));
  return (
    <div className="g-change">
      {(c.type === 'amount' || c.type === 'both') && <div><span className="label">Agreed</span><p>{itemLabel(c.from)}</p></div>}
      {(c.type === 'amount' || c.type === 'both') && <div><span className="label">Now asking</span><p>{itemLabel(it)}</p></div>}
      {(c.type === 'time' || c.type === 'both') && <div><span className="label">New time</span><p>{whenText(c.toStart)} (was {whenText(c.fromStart)})</p></div>}
      <ul className="g-steps">
        <li className="on">Change requested</li>
        <li className={emailQueued || c.sharedByHostAt ? 'on' : ''}>{it.claim.email ? 'Email to the guest · simulated' : c.sharedByHostAt ? 'You opened Share update' : 'No email on file. Share the update yourself.'}</li>
        <li>Waiting for {it.claim.name}’s yes</li>
      </ul>
    </div>
  );
}

function DetailsSheet({ g, open, onClose }) {
  const { email } = useStore();
  const toast = useToast();
  const [d, setD] = useState(null);
  const v = d || { name: g.name, date: g.startsAt.slice(0, 10), time: g.startsAt.slice(11, 16), people: g.people, location: g.location || '', note: g.note || '' };
  const changedTime = `${v.date}T${v.time}` !== g.startsAt;
  const guestsTaken = g.items.filter((i) => i.claim && i.status !== 'host').length;
  const close = () => { setD(null); onClose(); };
  return (
    <Sheet open={open} onClose={close} title="Edit details" tall>
      <div className="stack-16">
        <label className="field"><span className="label">Name</span><input className="input" value={v.name} maxLength={60} onChange={(e) => setD({ ...v, name: e.target.value })} /></label>
        <div className="row" style={{ gap: 12 }}>
          <label className="field grow"><span className="label">Date</span><input className="input" type="date" value={v.date} onChange={(e) => setD({ ...v, date: e.target.value })} /></label>
          <label className="field" style={{ width: 130 }}><span className="label">Time</span><input className="input" type="time" value={v.time} onChange={(e) => setD({ ...v, time: e.target.value })} /></label>
        </div>
        <label className="field"><span className="label">People</span><input className="input" type="number" inputMode="numeric" min="1" value={v.people} onChange={(e) => setD({ ...v, people: Math.max(1, Math.round(+e.target.value || 1)) })} /></label>
        <label className="field"><span className="label">Place, optional</span><input className="input" value={v.location} maxLength={60} placeholder="Our place, or the park" onChange={(e) => setD({ ...v, location: e.target.value })} /></label>
        <label className="field"><span className="label">Note, optional</span><textarea className="input" value={v.note} maxLength={200} onChange={(e) => setD({ ...v, note: e.target.value })} /></label>
        {changedTime && guestsTaken > 0 && <p className="g-warn">A new date or time asks the {guestsTaken} guest{guestsTaken > 1 ? 's' : ''} who said yes to confirm again. Reminders move with it.</p>}
        <Button block disabled={!v.name.trim() || !v.date || !v.time} onClick={async () => { await host.details(email, g.id, { name: v.name.trim(), startsAt: `${v.date}T${v.time}`, people: v.people, location: v.location.trim(), note: v.note.trim() }); toast(changedTime && guestsTaken ? 'Saved. Guests are asked to confirm the new time.' : 'Saved.'); close(); }}>Save changes</Button>
        {g.status === 'active' && <ConfirmTap onConfirm={async () => { await host.cancel(email, g.id); toast('Gathering cancelled. Reminders stopped.'); close(); }} render={(armed, tap) => <Button block variant="text" onClick={tap}>{armed ? 'Tap again to cancel the gathering' : 'Cancel this gathering'}</Button>} />}
      </div>
    </Sheet>
  );
}
