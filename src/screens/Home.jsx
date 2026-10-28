import { useStore } from '../store.jsx';
import { useNav } from '../nav.jsx';
import { Icon, Kicker, Sprig, Button } from '../ui.jsx';
import { BoardThumb, MealCard } from '../components.jsx';
import { NextStep, ProductStrip, useCareActions } from './Care.jsx';
import { PRESENTATIONS } from '../data/presentations.js';
import { MEAL_ORDER } from '../data/meals.js';
import { presentationItems, giftInfo, giftWho, fmtShort, whenText } from '../lib.js';
import { WORDMARK } from '../assets.js';

const MAX_GIFTS = 3;

// A quiet nod to the time of day, under the ideas: the care plan leads the Home.
function greeting() {
  const h = new Date().getHours();
  if (h < 11) return 'Something easy for breakfast or later.';
  if (h < 16) return 'Something easy for lunch or tonight.';
  return 'Something easy for tonight.';
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

// The care plan opens the Home: what it is for, the product, and the next step from the plan's own data.
function CareHero({ care, today }) {
  const act = useCareActions();
  return (
    <section className="care-hero" aria-label="Your Yndarena Care Plan">
      <div className="pad">
        <div className="eyebrow">Your Yndarena Care Plan</div>
        <h1 className="display-xl">Made with love.<br /><em>Cared for with ease.</em></h1>
        <p className="hero-lede">Know when to oil, see how, and let us remind you.</p>
      </div>
      <ProductStrip className="hero-product" />
      <div className="pad">
        <NextStep care={care} today={today} compact />
      </div>
      <div className="guide-rail" role="list" aria-label="Care guides">
        {GUIDES.map((g) => (
          <button key={g.id} role="listitem" className="guide-tile" onClick={() => act(g.go)}>
            <span className="ico"><Icon name={g.icon} size={20} /></span>
            <span className="t">{g.title}</span>
            <span className="s">{g.sub}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

const GUIDES = [
  { id: 'check', icon: 'drop', title: 'Water test', sub: 'One minute at your board', go: 'focus:check' },
  { id: 'oil', icon: 'hand', title: 'How to oil', sub: 'Step by step', go: 'oil-guide' },
  { id: 'everyday', icon: 'wash', title: 'Everyday care', sub: 'Wash, dry, store', go: 'focus:everyday' },
  { id: 'help', icon: 'help', title: 'Need a hand?', sub: 'Answers and support', go: 'focus:help' },
];

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
    <div className="home">
      <AppHead onProfile={openProfile} />
      <CareHero care={user.care} today={today} />

      <section className="section" aria-label="Ideas for your table">
        <div className="section-head">
          <h2 className="h2">Ideas for your table</h2>
          <button className="link" onClick={() => nav.switchTab('discover', { name: 'discover', params: { seg: 'meals' } })}>See all</button>
        </div>
        <p className="small pad" style={{ margin: '-4px 0 12px' }}>Serve what you already love. {greeting()}</p>
        <div className="pad stack-8">
          {mealsForToday(today).map((id) => <MealCard key={id} id={id} compact />)}
          <ContinueRow user={user} />
        </div>
      </section>

      <GiftBlock gifts={user.gifts} today={today} />

      <footer className="home-sign">
        <Sprig style={{ height: 40 }} />
        <div className="label">turning houses into homes</div>
      </footer>
    </div>
  );
}
