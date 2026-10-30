import { useEffect, useRef, useState } from 'react';
import { useStore, authApi, createAccount, DEMO_CODE, EXPIRED_CODE, RETURNING_EMAIL } from '../store.jsx';
import { Button, Wordmark, DemoNote, IconButton, Icon } from '../ui.jsx';
import { pad4 } from '../lib.js';

const RESEND_SECONDS = 30;
const validEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e) && e.length <= 190;

// Unified access: one email field, a one-time code, and the account is found or created.
export default function Auth({ onSignedIn, initialEmail = '', onAllProducts }) {
  const { state, update } = useStore();
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState(initialEmail);
  const [emailErr, setEmailErr] = useState('');
  const [code, setCode] = useState('');
  const [codeErr, setCodeErr] = useState(null);
  const [cooldown, setCooldown] = useState(0);
  const [sending, setSending] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const inputRef = useRef();

  useEffect(() => {
    if (!cooldown) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  useEffect(() => { if (step === 'code') setTimeout(() => inputRef.current?.focus(), 350); }, [step]);

  const clean = email.trim().toLowerCase();

  const sendCode = () => {
    if (!validEmail(clean)) { setEmailErr('Please enter a valid email address.'); return; }
    setEmailErr('');
    setSending(true);
    setTimeout(() => { setSending(false); setStep('code'); setCode(''); setCodeErr(null); setCooldown(RESEND_SECONDS); }, 700);
  };

  const verify = (value) => {
    const res = authApi.verify(value);
    if (res === 'ok') {
      if (authApi.exists(state, clean)) {
        update((d) => { d.session = { email: clean }; });
        onSignedIn?.('returning', state.backend.accounts[clean].number);
      } else setStep('create');
    } else setCodeErr(res);
  };

  const onCode = (v) => {
    const digits = v.replace(/\D/g, '').slice(0, 6);
    setCode(digits);
    setCodeErr(null);
    if (digits.length === 6) setTimeout(() => verify(digits), 180);
  };

  const create = () => {
    update((d) => createAccount(d, clean, marketing));
    onSignedIn?.('new');
  };

  return (
    <div className="auth">
      <div className="light-window" />
      <div className="auth-inner" style={{ position: 'relative' }}>
        {step !== 'email' && (
          <div style={{ marginLeft: -10, marginTop: -6 }}>
            <IconButton name="back" label="Change email" onClick={() => { setStep('email'); setCodeErr(null); }} />
          </div>
        )}

        {step === 'email' && (
          <>
            {onAllProducts && <button className="all-products" onClick={onAllProducts}><Icon name="back" size={14} />All products</button>}
            <Wordmark height={64} />
            <h1>Your Home starts here.</h1>
            <p className="lead">Sign in or create your Yndarena account.</p>
            <form className="stack-16" style={{ marginTop: 26 }} onSubmit={(e) => { e.preventDefault(); sendCode(); }}>
              <label className="field">
                <span className="label">Email address</span>
                <input className={'input' + (emailErr ? ' is-error' : '')} type="email" inputMode="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(e) => { setEmail(e.target.value); setEmailErr(''); }} />
                {emailErr && <div className="err">{emailErr}</div>}
              </label>
              <Button block type="submit" disabled={sending}>{sending ? 'Sending code' : 'Continue with email'}</Button>
            </form>
            <p className="small muted" style={{ marginTop: 14 }}>No password. We’ll send you a one-time code.</p>
            <div style={{ marginTop: 'auto', paddingTop: 22 }}>
              <DemoNote>
                Preview only. No email is sent. Any new address creates a demo Home. Use <button className="link" style={{ padding: 0 }} type="button" onClick={() => setEmail(RETURNING_EMAIL)}>{RETURNING_EMAIL}</button> to see a returning Home.
              </DemoNote>
            </div>
          </>
        )}

        {step === 'code' && (
          <>
            <div className="kicker" style={{ marginTop: 18 }}>Step 2 of 2</div>
            <h1 style={{ marginTop: 10 }}>Check your email.</h1>
            <p className="lead">We sent a 6-digit code to <strong style={{ fontWeight: 500, color: 'var(--c-black)' }}>{clean}</strong>.</p>
            <div className={'code-boxes' + (codeErr ? ' is-error' : '')} style={{ marginTop: 22 }} onClick={() => inputRef.current?.focus()}>
              {Array.from({ length: 6 }, (_, i) => <span key={i} className={i === code.length ? 'is-cur' : ''}>{code[i] || ''}</span>)}
              <input ref={inputRef} value={code} onChange={(e) => onCode(e.target.value)} inputMode="numeric" autoComplete="one-time-code" aria-label="One-time code" maxLength={6} />
            </div>
            {codeErr === 'wrong' && <div className="err">That code doesn’t match. Check the most recent email and try again.</div>}
            {codeErr === 'expired' && (
              <div className="err">This code has expired. Request a new one below.</div>
            )}
            <div className="row-between" style={{ marginTop: 18 }}>
              <button className="link" disabled={cooldown > 0} style={cooldown > 0 ? { opacity: 0.45, borderColor: 'transparent' } : undefined} onClick={() => { setCooldown(RESEND_SECONDS); setCode(''); setCodeErr(null); }}>
                {cooldown > 0 ? `Send a new code in 0:${String(cooldown).padStart(2, '0')}` : 'Send a new code'}
              </button>
              <button className="link" onClick={() => setStep('email')}>Change email</button>
            </div>
            <div style={{ marginTop: 'auto', paddingTop: 22 }} className="stack-8">
              <DemoNote>
                Demo code: <strong style={{ letterSpacing: '.18em' }}>{DEMO_CODE}</strong>. Try <strong>{EXPIRED_CODE}</strong> to see an expired code, or any other code to see an error.
              </DemoNote>
            </div>
          </>
        )}

        {step === 'create' && (
          <>
            <div className="kicker" style={{ marginTop: 18 }}>New Home</div>
            <h1 style={{ marginTop: 10 }}>Create your Home.</h1>
            <p className="lead">There’s no Yndarena account for <strong style={{ fontWeight: 500, color: 'var(--c-black)' }}>{clean}</strong> yet. Your Home will get its own number.</p>
            <div className="card card-pad" style={{ marginTop: 22 }}>
              <label className="check">
                <input type="checkbox" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} />
                <span className="box">{marketing && <Icon name="check" size={14} stroke={2} />}</span>
                <span>Send me occasional news and ideas from Yndarena. Optional, and you can change it anytime.</span>
              </label>
            </div>
            <p className="small muted" style={{ marginTop: 14 }}>By creating your Home you agree to the Terms and Privacy Policy. The app is free. No memberships, no paywalls.</p>
            <div className="stack-12" style={{ marginTop: 'auto', paddingTop: 22 }}>
              <Button block onClick={create}>Create my Home</Button>
              <Button block variant="text" onClick={() => setStep('email')}>Use a different email</Button>
              <DemoNote>Simulated. The next Home number comes from a local demo counter (next: No. {pad4(state.backend.counter + 1)}), not the production counter.</DemoNote>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
