import { useNav } from '../nav.jsx';
import { useStore } from '../store.jsx';
import { TopBar, Button, Kicker, Icon, DemoNote, Sprig, useToast } from '../ui.jsx';
import { fmtDate } from '../lib.js';
import { WORDMARK } from '../assets.js';

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
        <button className="list-row" onClick={() => nav.push('story')}>
          <div className="round-ico"><Sprig style={{ height: 22 }} /></div>
          <div className="grow"><div>Our story</div><div className="sub">Yndarena and her rosemary</div></div>
          <Icon name="chevron" size={18} />
        </button>
        <button className="list-row" onClick={onSignOut}>
          <div className="round-ico"><Icon name="back" size={18} /></div>
          <div className="grow"><div>Sign out</div><div className="sub">Your Home and everything in it stay saved</div></div>
        </button>
      </div>

      <div className="pad section">
        <Kicker>Preview tools</Kicker>
        <div className="card card-pad" style={{ marginTop: 10 }}>
          <div className="small">Preview date: <strong style={{ fontWeight: 500, color: 'var(--c-black)' }}>{fmtDate(today, true)}</strong>{offset ? ` (${offset > 0 ? '+' : ''}${offset} days)` : ''}</div>
          <div className="row wrap" style={{ gap: 8, marginTop: 10 }}>
            <Button small variant="ghost" onClick={() => { update((d) => { d.demo.dayOffset = (d.demo.dayOffset || 0) + 21; }); toast('Moved 3 weeks ahead.'); }}>+3 weeks</Button>
            <Button small variant="ghost" onClick={() => { update((d) => { d.demo.dayOffset = (d.demo.dayOffset || 0) + 84; }); toast('Moved 12 weeks ahead.'); }}>+12 weeks</Button>
            {offset !== 0 && <Button small variant="text" onClick={() => update((d) => { d.demo.dayOffset = 0; })}>Back to today</Button>}
          </div>
          <p className="small muted" style={{ marginTop: 10 }}>Move the preview date to see care checks and gift reminders come due.</p>
        </div>
        <Button block variant="ghost" style={{ marginTop: 12 }} onClick={() => { if (window.confirm('Reset the whole preview? All local changes will be cleared.')) { resetDemo(); nav.resetAll(); } }}>Reset demo</Button>
        <div style={{ marginTop: 12 }}><DemoNote>Everything here is simulated and stored only in this browser. No production accounts, counters or emails are involved.</DemoNote></div>
      </div>
    </>
  );
}

export function Story() {
  return (
    <>
      <TopBar title="Our story" />
      <div className="pad" style={{ paddingBottom: 10 }}>
        <div className="trio" style={{ justifyContent: 'center', marginTop: 8 }}><Sprig className="sprout" /><Sprig className="sprout" /><Sprig className="sprout" /></div>
        <div className="body stack-16" style={{ marginTop: 22, fontSize: 17.5 }}>
          <p style={{ margin: 0 }}>Yndarena was a woman we still hold dear. She was our grandmother’s companion in the kitchen. She taught us that rosemary is a symbol of love and memory.</p>
          <p style={{ margin: 0 }}>We loved watching her cook. Whatever she was making, she hummed softly and put her whole heart into it. For her, cooking was an act of love. The kind that leaves its mark on memory. Like rosemary.</p>
          <p className="quote" style={{ margin: '8px 0' }}>“If this wooden spoon<br />could talk, it could<br />tell the whole story<br />of my life.”</p>
          <p style={{ margin: 0 }}>Today, her old wooden spoons and the copper pot where she made her magical jams still keep us company in our kitchen. And with them, our happiest memories.</p>
          <p style={{ margin: 0 }}>In that same spirit, this brand was born, and it carries her name. We believe that what is made with love endures.</p>
          <p style={{ margin: 0 }} className="italic">Like Yndarena and her rosemary.</p>
        </div>
        <div className="divider" style={{ margin: '26px 0' }} />
        <div style={{ textAlign: 'center' }}>
          <img src={WORDMARK} alt="Yndarena, turning houses into homes" style={{ height: 54, width: 'auto', margin: '0 auto' }} />
          <div className="label" style={{ marginTop: 10, letterSpacing: '.32em' }}>turning houses into homes</div>
          <p className="quote" style={{ marginTop: 18, fontSize: 24 }}>Let’s make memories.</p>
        </div>
      </div>
    </>
  );
}
