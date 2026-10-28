import { useEffect, useState } from 'react';
import { useNav } from '../nav.jsx';
import { useStore } from '../store.jsx';
import { TopBar, Button, Kicker, Icon, Sheet, DemoNote, Sprig, Segmented, Chip, Empty, useToast } from '../ui.jsx';
import {
  careStatus, oilPending, fmtDate, fmtShort, daysBetween, iso, fromIso, uid, DAY,
  OCCASION_TYPES, giftInfo, giftWho, whenText, MONTHS, MONTHS_SHORT, CARE_FIRST_WEEK, CARE_EVERY,
} from '../lib.js';

const MAX_GIFTS = 3;

// Opens from the Home: the care plan block (seg 'care') or the gift dates block (seg 'gifts').
export default function Care({ params = {} }) {
  const seg = params.seg || 'care';
  return (
    <>
      <TopBar title={seg === 'care' ? 'Your care plan' : 'Gift dates'} />
      {seg === 'care' ? <CarePlan /> : <GiftDates startAdd={params.add} />}
    </>
  );
}

// ---------- Care plan ----------
function VideoCard() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button className="card tap" onClick={() => setOpen(true)}>
        <div style={{ position: 'relative', aspectRatio: '16 / 9', background: 'linear-gradient(160deg,#9a6644,#6f4630)', display: 'grid', placeItems: 'center' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(60% 70% at 30% 20%, rgba(255,248,238,.35), transparent)' }} />
          <span className="tag is-lav" style={{ position: 'relative' }}>Video coming soon</span>
        </div>
        <div className="card-pad" style={{ padding: '12px 14px' }}>
          <div className="kicker">2 minutes</div>
          <div className="h3" style={{ fontSize: 18 }}>How to care for your boards</div>
        </div>
      </button>
      <Sheet open={open} onClose={() => setOpen(false)} title="Care video">
        <p className="body" style={{ marginTop: 0 }}>Oil your boards once the day they arrive. After that, the water test tells you when they need it again.</p>
        <DemoNote>Yndarena’s existing care video (yndarenahome.com/wood-care) will play here once it is linked. Until then, follow the steps in your care plan.</DemoNote>
      </Sheet>
    </>
  );
}

function OilSheet({ open, onClose }) {
  return (
    <Sheet open={open} onClose={onClose} title="Board oil and care kit">
      <p className="body" style={{ marginTop: 0 }}>Food-safe mineral oil and a soft cloth are all your boards need. Yndarena’s care kit will be available separately.</p>
      <Button block arrow disabled>See it in the store</Button>
      <div style={{ marginTop: 12 }}><DemoNote>Store link pending. No purchases happen in this preview.</DemoNote></div>
    </Sheet>
  );
}

function CarePlan() {
  const nav = useNav();
  const { user, updateUser, today } = useStore();
  const [oil, setOil] = useState(false);
  const care = user.care;

  if (care.status !== 'active') {
    return (
      <div className="pad" style={{ marginTop: 20 }}>
        <div className="card" style={{ padding: '22px 18px', position: 'relative', overflow: 'hidden' }}>
          <Sprig className="sprout" style={{ position: 'absolute', right: 14, top: 14, height: 84 }} />
          <h2 className="h2" style={{ maxWidth: '78%' }}>A board remembers how it is cared for.</h2>
          <p className="body" style={{ margin: '8px 0 0', maxWidth: '80%' }}>It takes three steps. We’ll remind you when it’s time.</p>
          <div style={{ marginTop: 14 }}>
            {['Watch the care video', 'Do the water test', 'Keep your care plan'].map((t, i) => (
              <div key={t} className="ing-row" style={{ justifyContent: 'flex-start', gap: 12 }}>
                <span className="label" style={{ width: 22, paddingTop: 3 }}>0{i + 1}</span><span>{t}</span>
              </div>
            ))}
          </div>
          {care.status === 'notyet' ? (
            <>
              <p className="small" style={{ marginTop: 14 }}>No boards yet. Everything here will be ready when they arrive.</p>
              <Button block arrow onClick={() => updateUser((u) => { u.care.status = 'active'; u.care.startedAt = iso(today); })}>My boards are home</Button>
            </>
          ) : (
            <div className="stack-8" style={{ marginTop: 16 }}>
              <Button block arrow onClick={() => updateUser((u) => { u.care.status = 'active'; u.care.startedAt = iso(today); })}>My boards are home</Button>
              <Button block variant="text" onClick={() => updateUser((u) => { u.care.status = 'notyet'; })}>Not yet</Button>
            </div>
          )}
        </div>
        <div style={{ marginTop: 18 }}><VideoCard /></div>
      </div>
    );
  }

  const cs = careStatus(care, today);
  const results = Object.fromEntries(care.checks.filter((c) => c.n).map((c) => [c.n, c]));
  const pendingOil = oilPending(care);
  return (
    <div className="pad" style={{ marginTop: 20 }}>
      {pendingOil && (
        <div className="card" style={{ padding: '20px 18px', marginBottom: 14, background: 'rgba(172,162,189,.18)', borderColor: 'rgba(172,162,189,.55)' }}>
          <Kicker>Oil pending</Kicker>
          <h2 className="h2" style={{ marginTop: 6 }}>Your boards need oil.</h2>
          <p className="body" style={{ margin: '6px 0 14px' }}>The water soaked in on {fmtDate(fromIso(pendingOil.at))}. Oil them when you can, then let us know.</p>
          <Button block arrow onClick={() => updateUser((u) => { const c = u.care.checks.find((x) => x.at === pendingOil.at && x.n === pendingOil.n); if (c) { c.oiled = true; c.oiledAt = iso(today); } })}>I oiled my boards</Button>
          <Button block variant="text" onClick={() => setOil(true)}>Need oil?</Button>
        </div>
      )}
      <div className="card" style={{ padding: '20px 18px', background: cs.dueNow ? 'rgba(172,162,189,.18)' : undefined, borderColor: cs.dueNow ? 'rgba(172,162,189,.55)' : undefined }}>
        <Kicker>{cs.dueNow ? `Check ${cs.dueNow.n} of 6` : 'Your care plan'}</Kicker>
        {cs.dueNow ? (
          <>
            <h2 className="h2" style={{ marginTop: 6 }}>Today is a good day for the water test.</h2>
            <p className="body" style={{ margin: '6px 0 14px' }}>A few drops, one minute. The wood will tell you what it needs.</p>
            <Button block arrow onClick={() => nav.push('water-test')}>Start the water test</Button>
          </>
        ) : cs.next ? (
          <>
            <h2 className="h2" style={{ marginTop: 6 }}>Next check: {fmtDate(cs.next.date)}</h2>
            <p className="body" style={{ margin: '6px 0 14px' }}>In {daysBetween(today, cs.next.date)} days. We’ll remind you.</p>
            <Button block variant="ghost" onClick={() => nav.push('water-test')}>Do the water test now</Button>
          </>
        ) : (
          <>
            <h2 className="h2" style={{ marginTop: 6 }}>Your plan is complete.</h2>
            <p className="body" style={{ margin: '6px 0 14px' }}>Keep doing the water test whenever the wood looks dry.</p>
            <Button block variant="ghost" onClick={() => nav.push('water-test')}>Do the water test</Button>
          </>
        )}
      </div>

      <div style={{ marginTop: 18 }}><VideoCard /></div>

      <div className="section">
        <h2 className="h2">Schedule</h2>
        <p className="small" style={{ margin: '4px 0 14px' }}>From the day your boards came home ({fmtShort(fromIso(care.startedAt))}): a first check at week {CARE_FIRST_WEEK}, then every {CARE_EVERY} weeks.</p>
        <div className="timeline">
          {cs.sched.map((s) => {
            const r = results[s.n];
            const now = cs.dueNow?.n === s.n;
            return (
              <div key={s.n} className={'tl-item' + (r ? ' is-done' : '') + (now ? ' is-now' : '')}>
                <div className="row-between">
                  <span style={{ fontSize: 16 }}>Check {s.n}</span>
                  <span className="small">{fmtDate(s.date, s.date.getUTCFullYear() !== today.getUTCFullYear())}</span>
                </div>
                <div className="small">
                  {r ? (r.result === 'beads' ? 'Water beaded up. No oil needed.' : r.oiled ? 'Water soaked in. Oiled.' : 'Water soaked in. Oil pending.') : now ? 'Due now' : s.date < today ? 'Missed. That’s fine, the next one is coming.' : 'Upcoming'}
                </div>
              </div>
            );
          })}
        </div>
        {care.checks.filter((c) => !c.n).length > 0 && (
          <p className="small" style={{ marginTop: 6 }}>Plus {care.checks.filter((c) => !c.n).length} extra check{care.checks.filter((c) => !c.n).length > 1 ? 's' : ''} you did on your own.</p>
        )}
      </div>

      <div className="section">
        <button className="reminder-card tap" onClick={() => setOil(true)}>
          <div className="round-ico"><Icon name="drop" size={18} /></div>
          <div><div style={{ fontSize: 16 }}>Need more oil?</div><div className="small">Board oil and care kit</div></div>
          <Icon name="chevron" size={18} />
        </button>
      </div>

      <div className="section">
        <h2 className="h2">Reminders</h2>
        {[['email', 'By email', 'The same reminders as your current care plan'], ['app', 'In the app', 'A gentle notification on your phone']].map(([k, t, d]) => (
          <button key={k} className="list-row" onClick={() => updateUser((u) => { u.care.prefs[k] = !u.care.prefs[k]; })} role="switch" aria-checked={care.prefs[k]}>
            <div className="grow"><div>{t}</div><div className="sub">{d}</div></div>
            <span className={'switch' + (care.prefs[k] ? ' is-on' : '')} />
          </button>
        ))}
        <div style={{ marginTop: 10 }}><DemoNote>Simulated with demo data. No emails or notifications are sent. The real schedule will come from the existing care plan system.</DemoNote></div>
      </div>
      <OilSheet open={oil} onClose={() => setOil(false)} />
    </div>
  );
}

// ---------- Water test ----------
export function WaterTest() {
  const nav = useNav();
  const toast = useToast();
  const { user, updateUser, today } = useStore();
  const [step, setStep] = useState('drop');
  const [drops, setDrops] = useState([]);
  const [secs, setSecs] = useState(60);
  const [result, setResult] = useState(null);
  const [oilOpen, setOilOpen] = useState(false);
  const [oilAns, setOilAns] = useState(null);
  const cs = careStatus(user.care, today);

  useEffect(() => {
    if (step !== 'wait' || secs <= 0) return;
    const t = setTimeout(() => setSecs(secs - 1), 1000);
    return () => clearTimeout(t);
  }, [step, secs]);

  const log = (res, oiled) => {
    updateUser((u) => {
      const n = cs.dueNow ? cs.dueNow.n : 0;
      u.care.checks.push({ n, at: iso(today), result: res, oiled });
    });
  };
  const nextDate = cs.next ? fmtDate(cs.next.date) : null;

  const addDrop = (e) => {
    if (drops.length >= 5) return;
    const r = e.currentTarget.getBoundingClientRect();
    setDrops([...drops, { x: ((e.clientX - r.left) / r.width) * 320, y: ((e.clientY - r.top) / r.height) * 200, k: Date.now() }]);
  };

  return (
    <>
      <TopBar close title="Water test" />
      <div className="pad">
        <div className="step-dots" style={{ marginBottom: 16 }}>
          {['drop', 'wait', 'result', 'after'].map((s, i) => <span key={s} className={['drop', 'wait', 'result', 'after'].indexOf(step) >= i ? 'on' : ''} />)}
        </div>

        {(step === 'drop' || step === 'wait') && (
          <>
            <h1 className="h1" style={{ fontSize: 32 }}>{step === 'drop' ? 'A few drops of water.' : 'Now wait a minute.'}</h1>
            <p className="body" style={{ margin: '8px 0 16px' }}>
              {step === 'drop' ? 'Put a few drops of water on the surface of your board. Tap the wood to try it here.' : 'Watch the drops. Do they stay round, or sink into the wood?'}
            </p>
            <div className="water" onClick={step === 'drop' ? addDrop : undefined} role="button" aria-label="Tap to add a drop">
              <svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice">
                {Array.from({ length: 14 }, (_, i) => <path key={i} d={`M-10 ${8 + i * 15} C 90 ${2 + i * 15}, 200 ${16 + i * 15}, 330 ${6 + i * 15}`} stroke="#6a4029" strokeWidth={i % 3 ? 0.7 : 1.4} fill="none" opacity=".35" />)}
                {drops.map((d) => (
                  <g key={d.k} className="drop fall" style={{ transformOrigin: `${d.x}px ${d.y}px` }}>
                    <ellipse cx={d.x} cy={d.y} rx="11" ry="9" fill="rgba(235,244,250,.55)" stroke="rgba(255,255,255,.7)" strokeWidth="1" />
                    <ellipse cx={d.x - 3} cy={d.y - 3} rx="3" ry="2" fill="#fff" opacity=".85" />
                    <ellipse cx={d.x + 2} cy={d.y + 6} rx="9" ry="3" fill="#3b2416" opacity=".2" />
                  </g>
                ))}
              </svg>
              {step === 'drop' && drops.length === 0 && <div className="canvas-hint" style={{ bottom: 12 }}>Tap the wood</div>}
            </div>
            {step === 'drop' ? (
              <Button block arrow style={{ marginTop: 18 }} disabled={!drops.length} onClick={() => { setStep('wait'); setSecs(60); }}>Done, start the minute</Button>
            ) : (
              <>
                <div style={{ textAlign: 'center', fontFamily: 'var(--display)', fontSize: 54, lineHeight: 1, marginTop: 18 }}>0:{String(secs).padStart(2, '0')}</div>
                <Button block arrow style={{ marginTop: 14 }} onClick={() => setStep('result')}>{secs > 0 ? 'Skip, I already waited' : 'See what happened'}</Button>
              </>
            )}
          </>
        )}

        {step === 'result' && (
          <>
            <h1 className="h1" style={{ fontSize: 32 }}>What did the water do?</h1>
            <div className="stack-12" style={{ marginTop: 18 }}>
              {[
                ['beads', 'It beads up', 'The drops stay round on the surface.'],
                ['soaks', 'It soaks in', 'The drops spread and darken the wood.'],
              ].map(([k, t, d]) => (
                <button key={k} className="card tap" style={{ display: 'grid', gridTemplateColumns: '84px 1fr', gap: 14, alignItems: 'center', padding: 12 }} onClick={() => { setResult(k); setStep('after'); if (k === 'beads') log('beads', false); }}>
                  <div className="water" style={{ aspectRatio: '1', borderRadius: 10 }}>
                    <svg viewBox="0 0 84 84">
                      {k === 'beads' ? (
                        <><ellipse cx="42" cy="42" rx="16" ry="13" fill="rgba(235,244,250,.6)" stroke="rgba(255,255,255,.8)" /><ellipse cx="37" cy="37" rx="4" ry="3" fill="#fff" /></>
                      ) : (
                        <ellipse cx="42" cy="44" rx="26" ry="18" fill="#4a2a18" opacity=".45" />
                      )}
                    </svg>
                  </div>
                  <div><div className="h3">{t}</div><div className="small">{d}</div></div>
                </button>
              ))}
            </div>
          </>
        )}

        {step === 'after' && result === 'beads' && (
          <div style={{ textAlign: 'center', paddingTop: 10 }}>
            <Sprig className="sprout" style={{ height: 90 }} />
            <h1 className="h1" style={{ marginTop: 12 }}>You’re all set.</h1>
            <p className="lead" style={{ margin: '8px 0 0' }}>The grain is still holding its oil. No oil needed today.</p>
            {nextDate && <p className="small" style={{ marginTop: 10 }}>We’ll remind you for the next check on {nextDate}.</p>}
            <Button block arrow style={{ marginTop: 22 }} onClick={() => { nav.pop(); toast('Check saved to your care plan.'); }}>Done</Button>
          </div>
        )}

        {step === 'after' && result === 'soaks' && !oilAns && (
          <OilAsk onAnswer={(v) => { setOilAns(v); updateUser((u) => { u.care.oil = v; }); }} />
        )}
        {step === 'after' && result === 'soaks' && oilAns === 'yes' && (
          <>
            <h1 className="h1" style={{ fontSize: 32 }}>The wood is asking for oil.</h1>
            <p className="body" style={{ margin: '8px 0 6px' }}>Here’s how. It takes five minutes, then time to rest.</p>
            {[
              'Wash the board, dry it well and let it air dry completely.',
              'Pour a little food-safe oil on the surface.',
              'Spread a thin layer with a soft cloth, following the grain. Do every side.',
              'Let it soak in for at least 20 minutes. Overnight is even better.',
              'Wipe off any oil that’s left on the surface.',
            ].map((t, i) => (
              <div key={i} className="ing-row" style={{ justifyContent: 'flex-start', gap: 14 }}><span className="label" style={{ width: 22, paddingTop: 3 }}>0{i + 1}</span><span>{t}</span></div>
            ))}
            <div className="stack-8" style={{ marginTop: 18 }}>
              <Button block arrow onClick={() => { log('soaks', true); nav.pop(); toast('Oiled and saved. Your boards thank you.'); }}>I oiled my boards</Button>
              <Button block variant="text" onClick={() => { log('soaks', false); nav.pop(); toast('Saved. Oil them when you can.'); }}>I’ll do it later</Button>
            </div>
          </>
        )}
        {step === 'after' && result === 'soaks' && oilAns === 'no' && (
          <>
            <h1 className="h1" style={{ fontSize: 32 }}>The wood is asking for oil.</h1>
            <p className="body" style={{ margin: '8px 0 16px' }}>Food-safe mineral oil and a soft cloth are all you need. Once you have it, come back here for the steps.</p>
            <Button block arrow onClick={() => setOilOpen(true)}>Get board oil</Button>
            <div className="stack-8" style={{ marginTop: 10 }}>
              <Button block variant="ghost" onClick={() => { setOilAns('yes'); updateUser((u) => { u.care.oil = 'yes'; }); }}>I found some at home</Button>
              <Button block variant="text" onClick={() => { log('soaks', false); nav.pop(); toast('Saved. We’ll check in again soon.'); }}>Save and finish</Button>
            </div>
            <OilSheet open={oilOpen} onClose={() => setOilOpen(false)} />
          </>
        )}
        <div style={{ marginTop: 22 }}><DemoNote>Guided test with demo data. The result is saved only in this preview.</DemoNote></div>
      </div>
    </>
  );
}

function OilAsk({ onAnswer }) {
  return (
    <>
      <h1 className="h1" style={{ fontSize: 32 }}>The wood is asking for oil.</h1>
      <p className="body" style={{ margin: '8px 0 18px' }}>Do you have board oil at home?</p>
      <div className="stack-8">
        <Button block onClick={() => onAnswer('yes')}>Yes, I have oil</Button>
        <Button block variant="ghost" onClick={() => onAnswer('no')}>Not right now</Button>
      </div>
    </>
  );
}

// ---------- Gift dates ----------
function GiftDates({ startAdd }) {
  const { user, updateUser, today } = useStore();
  const nav = useNav();
  const blank = () => ({ id: null, name: '', occasion: 'Birthday', m: today.getUTCMonth() + 1, d: today.getUTCDate(), once: false, y: today.getUTCFullYear() });
  const [edit, setEdit] = useState(() => (startAdd && user.gifts.length < MAX_GIFTS ? blank() : null));
  const [plan, setPlan] = useState(null);
  const gifts = user.gifts.map((g) => ({ g, ...giftInfo(g, today) })).sort((a, b) => (a.days ?? 9999) - (b.days ?? 9999));

  return (
    <div className="pad" style={{ marginTop: 20 }}>
      <p className="body" style={{ marginTop: 0 }}>Keep special dates close. We’ll remind you 21 days before and again 10 days before, with time to plan a gift.</p>
      {gifts.length === 0 && (
        <div style={{ marginTop: 14 }}>
          <Empty title="Keep a special date close" action={<Button small arrow onClick={() => setEdit({ id: null, name: '', occasion: 'Birthday', m: today.getUTCMonth() + 1, d: today.getUTCDate(), once: false, y: today.getUTCFullYear() })}>Add a date</Button>}>
            A birthday, an anniversary, a housewarming. Just a first name and a day.
          </Empty>
        </div>
      )}
      <div style={{ marginTop: 8 }}>
        {gifts.map(({ g, date, days, stage, first, second, sentOn }) => (
          <div key={g.id} style={{ borderBottom: '1px solid var(--c-line)' }}>
            <button className="gift-card" style={{ borderBottom: 0 }} onClick={() => { const [m, d] = g.md.split('-').map(Number); setEdit({ id: g.id, name: g.name, occasion: g.occasion, m, d, once: !!g.y, y: g.y || today.getUTCFullYear() }); }}>
              <div className="date-badge">
                <span className="m">{date ? MONTHS_SHORT[date.getUTCMonth()] : '—'}</span>
                <span className="d">{date ? date.getUTCDate() : ''}</span>
              </div>
              <div>
                <div style={{ fontSize: 16.5, lineHeight: 1.3 }}>{giftWho(g)}</div>
                <div className="small">{date ? (days === 0 ? 'Today' : `In ${days} days`) : 'Date has passed'} · {g.y ? `One time, ${g.y}` : 'Every year'}</div>
              </div>
              <Icon name="edit" size={18} />
            </button>
            {date && (
              <div className="row wrap" style={{ gap: 6, padding: '0 0 14px 68px' }}>
                <span className={'tag' + (stage ? ' is-lav' : '')}>{stage ? (sentOn >= today ? 'Reminder goes out today' : `Reminder sent ${fmtShort(sentOn)}`) : `First reminder ${fmtShort(first)}`}</span>
                {stage !== 10 && <span className="tag">Second {fmtShort(second)}</span>}
                <button className="tag is-dark" onClick={() => setPlan(g)}>Plan a gift</button>
              </div>
            )}
          </div>
        ))}
      </div>
      {gifts.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <Button block variant="ghost" icon="plus" disabled={gifts.length >= MAX_GIFTS} onClick={() => setEdit({ id: null, name: '', occasion: 'Birthday', m: today.getUTCMonth() + 1, d: today.getUTCDate(), once: false, y: today.getUTCFullYear() })}>Add a date</Button>
          {gifts.length >= MAX_GIFTS && <p className="small muted" style={{ marginTop: 8 }}>You can keep up to {MAX_GIFTS} dates, the same as your current care plan.</p>}
        </div>
      )}
      {gifts[0]?.date && (
        <div className="card card-pad" style={{ marginTop: 20 }}>
          <div className="label">What the next reminder will say</div>
          <p style={{ margin: '6px 0 0', fontSize: 15.5 }}>
            <strong style={{ fontWeight: 500 }}>
              {gifts[0].days >= 11
                ? (gifts[0].g.occasion === 'Other' ? `A special day for ${gifts[0].g.name} is coming up` : `${giftWho(gifts[0].g)} is coming up`)
                : (gifts[0].g.occasion === 'Other' ? `A special day for ${gifts[0].g.name} is ${whenText(gifts[0].days)}` : `${giftWho(gifts[0].g)} is ${whenText(gifts[0].days)}`)}
            </strong>
          </p>
          <p className="small" style={{ margin: '4px 0 0' }}>{giftWho(gifts[0].g)} is on {fmtDate(gifts[0].date)}. There is no rush.</p>
        </div>
      )}
      <div style={{ marginTop: 16 }}><DemoNote>Simulated reminders. The schedule follows the existing care plan rules: 21 and 10 days ahead. Nothing is sent from this preview.</DemoNote></div>

      <GiftEditor value={edit} onClose={() => setEdit(null)} today={today} onSave={(v) => {
        updateUser((u) => {
          const md = `${String(v.m).padStart(2, '0')}-${String(v.d).padStart(2, '0')}`;
          const prev = u.gifts.find((x) => x.id === v.id);
          const g = { id: v.id || uid('g'), name: v.name.trim().slice(0, 60), occasion: v.occasion, md, addedAt: prev?.addedAt || iso(today), ...(v.once ? { y: v.y } : {}) };
          const i = u.gifts.findIndex((x) => x.id === v.id);
          if (i >= 0) u.gifts[i] = g; else u.gifts.push(g);
        });
        setEdit(null);
      }} onDelete={(id) => { updateUser((u) => { u.gifts = u.gifts.filter((x) => x.id !== id); }); setEdit(null); }} />

      <Sheet open={!!plan} onClose={() => setPlan(null)} title="Plan a gift">
        {plan && (
          <>
            <p className="body" style={{ marginTop: 0 }}>Something for {plan.name}’s kitchen, or a board made by you.</p>
            <button className="reminder-card tap" style={{ marginTop: 6 }} onClick={() => { setPlan(null); nav.push('presentation', { id: plan.occasion === 'Housewarming' ? 'golden-hour' : plan.occasion === 'Anniversary' ? 'love-like-rosemary' : 'copper-pot' }); }}>
              <div className="round-ico"><Icon name="grid" size={18} /></div>
              <div><div style={{ fontSize: 16 }}>Make them a board</div><div className="small">An idea for the day itself</div></div>
              <Icon name="chevron" size={18} />
            </button>
            <button className="reminder-card" style={{ marginTop: 8, opacity: 0.7 }} disabled>
              <div className="round-ico"><Icon name="gift" size={18} /></div>
              <div><div style={{ fontSize: 16 }}>Yndarena gifts</div><div className="small">Store link pending in this preview</div></div>
              <Icon name="chevron" size={18} />
            </button>
          </>
        )}
      </Sheet>
    </div>
  );
}

function GiftEditor({ value, onClose, onSave, onDelete, today }) {
  const [v, setV] = useState(value);
  useEffect(() => { setV(value); }, [value]);
  if (!v) return <Sheet open={false} onClose={onClose} />;
  const daysIn = new Date(Date.UTC(v.once ? v.y : 2024, v.m, 0)).getUTCDate();
  const thisYear = today.getUTCFullYear();
  const target = v.once ? new Date(Date.UTC(v.y, v.m - 1, v.d)) : null;
  const past = target && target < new Date(today.getTime() - DAY);
  const valid = v.name.trim() && v.d <= daysIn && !past;
  return (
    <Sheet open={!!value} onClose={onClose} title={v.id ? 'Edit date' : 'Add a date'} tall>
      <div className="stack-16">
        <label className="field">
          <span className="label">First name</span>
          <input className="input" value={v.name} maxLength={60} placeholder="Ana" onChange={(e) => setV({ ...v, name: e.target.value })} />
        </label>
        <div>
          <span className="label">Occasion</span>
          <div className="row wrap" style={{ gap: 6, marginTop: 8 }}>
            {OCCASION_TYPES.map((o) => <Chip key={o} active={v.occasion === o} onClick={() => setV({ ...v, occasion: o })}>{o}</Chip>)}
          </div>
        </div>
        <div className="row" style={{ gap: 14 }}>
          <label className="field grow">
            <span className="label">Month</span>
            <select className="input" value={v.m} onChange={(e) => setV({ ...v, m: +e.target.value })}>
              {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
            </select>
          </label>
          <label className="field" style={{ width: 90 }}>
            <span className="label">Day</span>
            <select className="input" value={v.d} onChange={(e) => setV({ ...v, d: +e.target.value })}>
              {Array.from({ length: 31 }, (_, i) => <option key={i} value={i + 1}>{i + 1}</option>)}
            </select>
          </label>
        </div>
        <label className="check">
          <input type="checkbox" checked={v.once} onChange={(e) => setV({ ...v, once: e.target.checked })} />
          <span className="box">{v.once && <Icon name="check" size={14} stroke={2} />}</span>
          <span>Only once, in a specific year. Otherwise we remind you every year.</span>
        </label>
        {v.once && (
          <label className="field">
            <span className="label">Year</span>
            <select className="input" value={v.y} onChange={(e) => setV({ ...v, y: +e.target.value })}>
              {Array.from({ length: 6 }, (_, i) => <option key={i} value={thisYear + i}>{thisYear + i}</option>)}
            </select>
          </label>
        )}
        {v.d > daysIn && <div className="err">That day doesn’t exist in {MONTHS[v.m - 1]}{v.once ? ' ' + v.y : ''}.</div>}
        {past && <div className="err">That date has already passed.</div>}
        <Button block arrow disabled={!valid} onClick={() => onSave(v)}>{v.id ? 'Save changes' : 'Save date'}</Button>
        {v.id && <Button block variant="text" onClick={() => onDelete(v.id)}>Remove this date</Button>}
      </div>
    </Sheet>
  );
}
