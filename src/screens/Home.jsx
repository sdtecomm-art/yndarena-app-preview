import { useStore } from '../store.jsx';
import { useNav } from '../nav.jsx';
import { Icon, Kicker, Sprig, Button } from '../ui.jsx';
import { BoardThumb, MealCard } from '../components.jsx';
import { PRESENTATIONS } from '../data/presentations.js';
import { MEAL_ORDER } from '../data/meals.js';
import { presentationItems, careStatus, oilPending, giftInfo, giftWho, fmtDate, fmtShort, fromIso, iso, daysBetween, whenText } from '../lib.js';
import { WORDMARK } from '../assets.js';

const MAX_GIFTS = 3;

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning.';
  if (h < 18) return 'Good afternoon.';
  return 'Good evening.';
}

export function AppHead({ onProfile }) {
  const { homeNo } = useStore();
  return (
    <div className="app-head">
      <img className="wordmark" src={WORDMARK} alt="Yndarena, turning houses into homes" />
      <button className="home-chip" onClick={onProfile} aria-label={`Home No. ${homeNo}. Open your Home settings`}>
        <Sprig />
        Home No. {homeNo}
      </button>
    </div>
  );
}

// What the care plan block says comes only from the existing care state; nothing here invents a date or a result.
function careView(care, today) {
  if (care.status !== 'active') {
    return {
      kicker: 'Your care plan',
      title: 'Let’s set up your board care.',
      text: care.status === 'notyet' ? 'Everything will be ready when your boards arrive.' : 'A two-minute video, a quick water test and gentle reminders.',
      cta: 'Set up care', go: 'care',
    };
  }
  const cs = careStatus(care, today);
  if (cs.dueNow) {
    return {
      kicker: `Check ${cs.dueNow.n} of 6`, hot: true,
      title: 'It’s time for a quick water test.',
      text: 'A few drops of water, one minute. The wood will tell you what it needs.',
      cta: 'Start water test', go: 'water-test', second: ['View care plan', 'care'],
    };
  }
  const oil = oilPending(care);
  if (oil) {
    return {
      kicker: 'Oil pending', hot: true,
      title: 'Your board needs oil.',
      text: `The water soaked in on ${fmtShort(fromIso(oil.at))}. Oil when you can, then mark it done.`,
      cta: 'Continue care', go: 'care',
    };
  }
  if (cs.next) {
    const last = [...care.checks].sort((a, b) => (a.at < b.at ? -1 : 1)).pop();
    const doneToday = last && (last.at === iso(today) || last.oiledAt === iso(today));
    return {
      kicker: doneToday ? 'Care done' : 'Your next water test',
      title: doneToday ? 'Your boards are cared for.' : fmtDate(cs.next.date),
      text: doneToday ? `Next water test: ${fmtDate(cs.next.date)}.` : `In ${daysBetween(today, cs.next.date)} days. We’ll remind you.`,
      cta: 'View care plan', go: 'care', second: doneToday ? null : ['Check now', 'water-test'],
    };
  }
  return { kicker: 'Your care plan', title: 'Your care plan is complete.', text: 'Do the water test whenever the wood looks dry.', cta: 'View care plan', go: 'care', second: ['Water test', 'water-test'] };
}

function CareBlock({ care, today }) {
  const nav = useNav();
  const v = careView(care, today);
  const open = (to) => (to === 'water-test' ? nav.push('water-test') : nav.push('care', { seg: 'care' }));
  return (
    <section className={'card care-block' + (v.hot ? ' is-hot' : '')} aria-label="Your care plan">
      <div className="row-between" style={{ alignItems: 'flex-start' }}>
        <Kicker>{v.kicker}</Kicker>
        <div className="round-ico"><Icon name="drop" size={18} /></div>
      </div>
      <h2 className="h2" style={{ marginTop: 2 }}>{v.title}</h2>
      <p className="body" style={{ margin: '6px 0 14px' }}>{v.text}</p>
      <Button block arrow onClick={() => open(v.go)}>{v.cta}</Button>
      {v.second && <Button block variant="text" onClick={() => open(v.second[1])}>{v.second[0]}</Button>}
    </section>
  );
}

function ContinueRow({ user }) {
  const nav = useNav();
  const r = user.recent;
  if (r?.kind === 'design' && user.designs[r.id]) {
    const d = user.designs[r.id];
    return (
      <button className="card tap" onClick={() => nav.push('designer', { id: d.id })}>
        <div className="row" style={{ padding: 10 }}>
          <BoardThumb board={d.board} items={d.items} uid={'cont-' + d.id} />
          <div className="grow">
            <div className="kicker">Pick up where you left off</div>
            <div className="h3" style={{ fontSize: 16, marginTop: 2 }}>{d.name}</div>
          </div>
          <Icon name="chevron" size={18} />
        </div>
      </button>
    );
  }
  if (r?.kind === 'presentation' && PRESENTATIONS[r.id]) {
    const p = PRESENTATIONS[r.id];
    return (
      <button className="card tap" onClick={() => nav.push('presentation', { id: r.id, comp: r.comp })}>
        <div className="row" style={{ padding: 10 }}>
          <BoardThumb board={p.board} items={presentationItems(r.id, r.comp)} uid={'cont-p-' + r.id} />
          <div className="grow">
            <div className="kicker">You were looking at</div>
            <div className="h3" style={{ fontSize: 16, marginTop: 2 }}>{p.name}</div>
          </div>
          <Icon name="chevron" size={18} />
        </div>
      </button>
    );
  }
  return null;
}

function GiftBlock({ gifts, today }) {
  const nav = useNav();
  const list = gifts.map((g) => ({ g, ...giftInfo(g, today) })).filter((x) => x.date).sort((a, b) => a.days - b.days);
  const next = list[0];
  return (
    <section className="section pad" aria-label="Gift dates">
      <div className="section-head" style={{ padding: 0 }}>
        <h2 className="h2">Gift dates</h2>
        {gifts.length > 0 && <button className="link" onClick={() => nav.push('care', { seg: 'gifts' })}>Manage</button>}
      </div>
      {gifts.length === 0 ? (
        <button className="reminder-card tap" style={{ marginTop: 12 }} onClick={() => nav.push('care', { seg: 'gifts', add: true })}>
          <div className="round-ico"><Icon name="gift" size={18} /></div>
          <div><div style={{ fontSize: 16, lineHeight: 1.3 }}>Keep a special date close</div><div className="small">We’ll remind you 21 and 10 days ahead</div></div>
          <Icon name="plus" size={18} />
        </button>
      ) : (
        <>
          {next?.stage && <p className="small" style={{ margin: '6px 0 0' }}>Reminder sent: {giftWho(next.g)} is {whenText(next.days)}.</p>}
          <div className="stack-8" style={{ marginTop: 12 }}>
            {list.map((x) => (
              <button key={x.g.id} className="reminder-card tap" onClick={() => nav.push('care', { seg: 'gifts' })}>
                <div className="round-ico" style={x.stage ? { background: 'rgba(172,162,189,.25)', borderColor: 'rgba(172,162,189,.6)' } : undefined}><Icon name="gift" size={18} /></div>
                <div>
                  <div style={{ fontSize: 16, lineHeight: 1.3 }}>{giftWho(x.g)}</div>
                  <div className="small">{fmtShort(x.date)} · {whenText(x.days)}</div>
                </div>
                <Icon name="chevron" size={18} />
              </button>
            ))}
          </div>
          {gifts.length < MAX_GIFTS && <Button block variant="text" icon="plus" style={{ marginTop: 6 }} onClick={() => nav.push('care', { seg: 'gifts', add: true })}>Add a date</Button>}
        </>
      )}
    </section>
  );
}

// Three everyday meals, a different trio each day so the Home stays fresh without showing the whole catalog.
function mealsForToday(today) {
  const start = Math.floor(today.getTime() / 86400000) % MEAL_ORDER.length;
  return [0, 1, 2].map((i) => MEAL_ORDER[(start + i * 2) % MEAL_ORDER.length]);
}

export default function Home({ openProfile }) {
  const { user, today } = useStore();
  const nav = useNav();

  return (
    <>
      <AppHead onProfile={openProfile} />
      <div className="pad" style={{ marginTop: 8 }}>
        <h1 className="h1" style={{ fontSize: 32 }}>{greeting()}</h1>
      </div>

      <div className="pad" style={{ marginTop: 14 }}>
        <CareBlock care={user.care} today={today} />
      </div>

      <section className="section" aria-label="Ideas for your table">
        <div className="section-head">
          <h2 className="h2">Ideas for your table</h2>
          <button className="link" onClick={() => nav.switchTab('discover', { name: 'discover', params: { seg: 'meals' } })}>Discover</button>
        </div>
        <p className="small pad" style={{ margin: '-4px 0 12px' }}>Serve what you already love.</p>
        <div className="pad stack-8">
          {mealsForToday(today).map((id) => <MealCard key={id} id={id} compact />)}
          <ContinueRow user={user} />
        </div>
      </section>

      <GiftBlock gifts={user.gifts} today={today} />

      <div style={{ textAlign: 'center', margin: '30px 0 0' }}>
        <button className="link" onClick={() => nav.push('story')}>Our story</button>
        <div className="label" style={{ marginTop: 14 }}>turning houses into homes</div>
      </div>
    </>
  );
}
