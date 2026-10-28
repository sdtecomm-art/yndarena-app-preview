import { useNav } from '../nav.jsx';
import { useStore } from '../store.jsx';
import { TopBar, Button, Kicker, Icon, DemoNote, Sprig, useToast, ConfirmTap } from '../ui.jsx';
import { fmtDate } from '../lib.js';

export default function Profile({ onSignOut }) {
  const nav = useNav();
  const toast = useToast();
  const { homeNo, email, account, update, state, today, resetDemo } = useStore();
  const offset = state.demo.dayOffset || 0;
  return (
    <>
      <TopBar title="Your Home" />
      <div className="pad" style={{ textAlign: 'center', marginTop: 6 }}>
        <Sprig className="sprout" style={{ height: 76 }} />
        <div className="kicker" style={{ marginTop: 10 }}>Home No.</div>
        <div style={{ fontFamily: 'var(--display)', fontWeight: 300, fontSize: 64, lineHeight: 1 }}>{homeNo}</div>
        <p className="small" style={{ margin: '8px auto 0', maxWidth: 280 }}>Your number names your space in Yndarena. It stays yours, whatever boards you add.</p>
      </div>

      <div className="pad section">
        <Kicker>Account</Kicker>
        <div className="list-row"><div className="round-ico"><Icon name="mail" size={18} /></div><div className="grow"><div>{email}</div><div className="sub">Signed in with a one-time code</div></div></div>
        <button className="list-row" role="switch" aria-checked={account.marketing} onClick={() => update((d) => { d.backend.accounts[email].marketing = !d.backend.accounts[email].marketing; })}>
          <div className="grow"><div>News and ideas by email</div><div className="sub">Optional. Separate from care and gift reminders.</div></div>
          <span className={'switch' + (account.marketing ? ' is-on' : '')} />
        </button>
        <button className="list-row" onClick={onSignOut}>
          <div className="round-ico"><Icon name="back" size={18} /></div>
          <div className="grow"><div>Sign out</div><div className="sub">Your Home and everything in it stay saved</div></div>
        </button>
      </div>

      <div className="pad section">
        <Kicker>Preview tools</Kicker>
        <button className="list-row" onClick={() => nav.push('review')}>
          <div className="grow"><div>Review panel</div><div className="sub">Image sources, checks and differences for reviewers</div></div>
          <Icon name="chevron" size={18} />
        </button>
        <div className="card card-pad" style={{ marginTop: 10 }}>
          <div className="small">Preview date: <strong style={{ fontWeight: 500, color: 'var(--c-black)' }}>{fmtDate(today, true)}</strong>{offset ? ` (${offset > 0 ? '+' : ''}${offset} days)` : ''}</div>
          <div className="row wrap" style={{ gap: 8, marginTop: 10 }}>
            <Button small variant="ghost" onClick={() => { update((d) => { d.demo.dayOffset = (d.demo.dayOffset || 0) + 21; }); toast('Moved 3 weeks ahead.'); }}>+3 weeks</Button>
            <Button small variant="ghost" onClick={() => { update((d) => { d.demo.dayOffset = (d.demo.dayOffset || 0) + 84; }); toast('Moved 12 weeks ahead.'); }}>+12 weeks</Button>
            {offset !== 0 && <Button small variant="text" onClick={() => update((d) => { d.demo.dayOffset = 0; })}>Back to today</Button>}
          </div>
          <p className="small muted" style={{ marginTop: 10 }}>Move the preview date to see care checks and gift reminders come due.</p>
        </div>
        <ConfirmTap onConfirm={() => { resetDemo(); nav.resetAll(); }} render={(armed, tap) => (
          <Button block variant="ghost" style={{ marginTop: 12 }} onClick={tap}>{armed ? 'Tap again to clear everything' : 'Reset demo'}</Button>
        )} />
        <div style={{ marginTop: 12 }}><DemoNote>Everything here is simulated and stored only in this browser. No production accounts, counters or emails are involved.</DemoNote></div>
      </div>
    </>
  );
}
