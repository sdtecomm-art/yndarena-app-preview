import { useEffect, useMemo, useState } from 'react';
import { Button, Icon, Sheet, DemoNote, useToast, ConfirmTap } from '../ui.jsx';
import { WORDMARK } from '../assets.js';
import { useShared } from '../gatherings/useShared.js';
import { guest, device, links, SIMULATED } from '../gatherings/sim.js';
import { amountShort, amountText, whenText, shortWhen, startInstant } from '../gatherings/model.js';

const newReq = () => (crypto.randomUUID ? crypto.randomUUID() : String(Math.random()));
const validEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e);

// The page a guest opens from the shared link: no app, no account, no Home number.
// It shows only this gathering. A private manage link lets the guest change or cancel their own commitment.
export default function Guest({ publicId, token: tokenFromLink, onLeave }) {
  const toast = useToast();
  const [token, setToken] = useState(tokenFromLink || device.links()[publicId] || null);
  useEffect(() => { if (tokenFromLink) { device.remember(publicId, tokenFromLink); setToken(tokenFromLink); } }, [tokenFromLink, publicId]);
  const view = useShared(() => guest.view(publicId));
  const me = useShared(() => (token ? guest.mine(token) : null));
  const [pick, setPick] = useState(null); // item id
  const [justBooked, setJustBooked] = useState(false);

  useEffect(() => { if (token && !me && view) { device.forget(publicId); setToken(null); } }, [token, me, view, publicId]);

  if (!view) {
    return (
      <div className="guest">
        <img className="guest-wordmark" src={WORDMARK} alt="Yndarena" />
        <h1 className="display-m">This link doesn’t open a gathering.</h1>
        <p className="body">Ask the host for a new link.</p>
        {onLeave && <Button block variant="ghost" style={{ marginTop: 18 }} onClick={onLeave}>Close</Button>}
      </div>
    );
  }
  const cancelled = view.status !== 'active';
  const available = view.items.filter((i) => i.state === 'open');
  const covered = view.items.filter((i) => i.state !== 'open' && i.id !== me?.item.id);

  return (
    <div className="guest">
      <img className="guest-wordmark" src={WORDMARK} alt="Yndarena" />
      <div className="eyebrow" style={{ marginTop: 18 }}>You’re invited</div>
      <h1 className="display-m" style={{ marginTop: 6 }}>{view.name}</h1>
      <p className="g-when">{whenText(view.startsAt)}</p>
      {view.location && <p className="g-meta"><Icon name="home" size={15} />{view.location}</p>}
      {view.note && <p className="g-meta"><Icon name="note" size={15} />{view.note}</p>}

      {cancelled && <div className="g-banner" role="status">This gathering was cancelled by the host. Nothing to bring.</div>}

      {me && !cancelled && <Mine me={me} token={token} publicId={publicId} fresh={justBooked} onCancelled={() => { device.forget(publicId); setToken(null); setJustBooked(false); toast('Cancelled. The item is free again.'); }} onSwitch={() => toast('Pick another item below.')} />}

      {!cancelled && (
        <section className="g-sec">
          <h2 className="h2">{me ? 'Still needed' : 'Pick something to bring.'}</h2>
          {!me && <p className="small" style={{ margin: '4px 0 0' }}>Bring the full amount of the item you choose.</p>}
          {available.length ? (
            <div className="g-rows" style={{ marginTop: 10 }}>
              {available.map((i) => (
                <button key={i.id} className="g-row" onClick={() => setPick(i.id)}>
                  <span className="grow"><span className="g-row-t">{i.name}</span><span className="g-row-a">{amountText(i)}</span></span>
                  <span className="g-pick">{me ? 'Switch' : 'Bring this'}</span>
                </button>
              ))}
            </div>
          ) : <p className="small muted" style={{ marginTop: 10 }}>Everything on the list has someone. Thank you.</p>}
        </section>
      )}

      {covered.length > 0 && (
        <section className="g-sec">
          <h2 className="h2">Already covered</h2>
          <div className="g-rows" style={{ marginTop: 10 }}>
            {covered.map((i) => (
              <div key={i.id} className="g-row is-static">
                <span className="grow"><span className="g-row-t">{i.name}</span><span className="g-row-a">{amountText(i)}</span></span>
                <span className="g-row-who"><span className="g-row-name">{i.by}</span><span className="g-tag">{i.state === 'pending' ? 'Being confirmed' : 'Taken'}</span></span>
              </div>
            ))}
          </div>
        </section>
      )}

      {SIMULATED && <div style={{ marginTop: 22 }}><DemoNote>Preview: this list lives in this browser only. People on other phones won’t see your choice yet, and no email is sent.</DemoNote></div>}

      <PickSheet view={view} id={pick} me={me} token={token} onClose={() => setPick(null)} onBooked={(t) => { device.remember(publicId, t); setToken(t); setPick(null); setJustBooked(true); window.scrollTo?.(0, 0); document.querySelector('.guest')?.scrollIntoView?.(); }} />
    </div>
  );
}

function PickSheet({ view, id, me, token, onClose, onBooked }) {
  const it = view.items.find((x) => x.id === id);
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  // One request key per opening of the sheet: a double tap sends the same request twice, and gets one booking.
  const req = useMemo(() => newReq(), [id]); // eslint-disable-line react-hooks/exhaustive-deps
  const close = () => { setErr(''); setBusy(false); onClose(); };
  if (!id) return <Sheet open={false} onClose={close} />;
  const gone = !it || it.state !== 'open';
  const submit = async () => {
    setBusy(true); setErr('');
    const r = me ? await guest.switch(token, id, req) : await guest.claim(view.publicId, id, name, req);
    setBusy(false);
    if (r.token) { setName(''); onBooked(r.token); return; }
    setErr(r.error === 'taken' ? 'Someone else picked this a moment ago. The list is up to date: choose another item.' : r.error === 'cancelled' ? 'The host cancelled this gathering.' : 'This item is no longer on the list.');
  };
  return (
    <Sheet open={!!id} onClose={close} title={me ? 'Switch to this item?' : 'Bring this?'}>
      {it && <p className="g-sheet-big">{it.name}</p>}
      {it && <p className="g-sheet-a">{amountText(it)}</p>}
      {me && <p className="small" style={{ marginTop: 6 }}>Instead of {me.item.name.toLowerCase()}. Your current item stays yours until this one is confirmed.</p>}
      {!me && !gone && (
        <label className="field" style={{ marginTop: 14 }}>
          <span className="label">Your name</span>
          <input className="input" value={name} maxLength={40} autoComplete="given-name" placeholder="Alex" onChange={(e) => setName(e.target.value)} />
          <span className="small muted" style={{ display: 'block', marginTop: 6 }}>This is how you’ll appear on the list. No account or email needed.</span>
        </label>
      )}
      {err && <p className="err" role="alert" style={{ marginTop: 12 }}>{err}</p>}
      {!err && gone && <p className="err" role="alert" style={{ marginTop: 12 }}>Someone else picked this a moment ago. Choose another item.</p>}
      <Button block style={{ marginTop: 18 }} disabled={busy || gone || !!err || (!me && !name.trim())} onClick={submit}>{busy ? 'Saving…' : me ? 'Switch to this' : 'I’ll bring this'}</Button>
      {(err || gone) && <Button block variant="ghost" style={{ marginTop: 8 }} onClick={close}>Back to the list</Button>}
    </Sheet>
  );
}

function Mine({ me, token, publicId, fresh, onCancelled, onSwitch }) {
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [asking, setAsking] = useState(false);
  const it = me.accepted;
  const manage = links.manage(publicId, token);
  const reminderAt = startInstant(me.gathering.startsAt, me.gathering.tz) - 3 * 3600e3;
  const tooLate = reminderAt <= Date.now();
  const c = me.change;
  return (
    <section className="g-mine" aria-live="polite">
      <div className="eyebrow">{fresh ? 'Thank you' : 'Your commitment'}</div>
      <h2 className="g-mine-t">You’re bringing {it.name.toLowerCase()}</h2>
      <p className="g-mine-a">{amountShort(it)}</p>
      <p className="g-mine-w">{shortWhen(me.gathering.startsAt)}</p>

      {c && (
        <div className="g-change is-guest">
          <span className="label">The host asked for a change</span>
          {c.amountChanged && <p>You agreed to {amountShort(c.from).toLowerCase()}{c.from.name !== c.to.name ? ` of ${c.from.name.toLowerCase()}` : ''}. Now: <strong>{amountShort(c.to).toLowerCase()}{c.from.name !== c.to.name ? ` of ${c.to.name.toLowerCase()}` : ''}</strong>.</p>}
          {c.toStart && <p>New time: <strong>{whenText(c.toStart)}</strong> (was {whenText(c.fromStart)}).</p>}
          <div className="stack-8" style={{ marginTop: 10 }}>
            <Button block onClick={async () => { await guest.respond(token, true); toast('Thanks. Your commitment is updated.'); }}>Confirm change</Button>
            <ConfirmTap onConfirm={async () => { await guest.respond(token, false); onCancelled(); }} render={(armed, tap) => <Button block variant="ghost" onClick={tap}>{armed ? 'Tap again. Someone else can take it.' : 'I can’t bring this'}</Button>} />
          </div>
        </div>
      )}

      <div className="g-manage">
        <span className="label">Keep this link to change or cancel</span>
        <code>{manage}</code>
        <Button small variant="ghost" onClick={async () => { try { await navigator.clipboard.writeText(manage); toast('Link copied.'); } catch (e) { toast('Copy the link above.'); } }}>Copy my link</Button>
        <p className="small muted" style={{ margin: '6px 0 0' }}>Only this link can change your item. Don’t share it.</p>
      </div>

      <div className="g-remind">
        {me.email ? (
          <>
            <p className="small" style={{ margin: 0 }}><Icon name="mail" size={14} /> Reminder by email to {me.email}{tooLate ? '. Its time has passed, so updates only.' : ', 3 hours before.'}</p>
            <button className="link" onClick={() => guest.email(token, null)}>Stop emails</button>
          </>
        ) : !asking ? (
          <Button block variant="ghost" onClick={() => setAsking(true)}>Email me a reminder</Button>
        ) : (
          <>
            <p className="small" style={{ marginTop: 0 }}>We’ll email you {tooLate ? 'important updates' : 'a reminder 3 hours before, and important updates'} about this gathering only. Never for marketing or other gatherings.</p>
            {tooLate && <p className="small muted">It’s less than 3 hours away, so no reminder will be scheduled.</p>}
            <label className="field"><span className="label">Email</span><input className="input" type="email" inputMode="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
            <div className="row" style={{ gap: 8, marginTop: 12 }}>
              <Button small className="grow" disabled={!validEmail(email.trim())} onClick={async () => { await guest.email(token, email.trim()); setAsking(false); toast('Saved for this gathering.'); }}>Save</Button>
              <Button small variant="ghost" className="grow" onClick={() => setAsking(false)}>Not now</Button>
            </div>
          </>
        )}
      </div>

      <div className="row" style={{ gap: 8, marginTop: 14 }}>
        <Button small variant="ghost" className="grow" onClick={onSwitch}>Change item</Button>
        <ConfirmTap onConfirm={async () => { await guest.cancel(token); onCancelled(); }} render={(armed, tap) => <Button small variant="ghost" className="grow" onClick={tap}>{armed ? 'Tap again to cancel' : 'Cancel'}</Button>} />
      </div>
    </section>
  );
}
