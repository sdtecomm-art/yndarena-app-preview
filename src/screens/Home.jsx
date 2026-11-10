import { useStore } from '../store.jsx';
import { useNav } from '../nav.jsx';
import { Icon, Kicker, Sprig, Button } from '../ui.jsx';
import { NextStep, ProductStrip, useCareActions, WaterTestFeature, careView } from './Care.jsx';
import { tonight } from './Cook.jsx';
import { giftInfo, giftWho, fmtShort, whenText, giftChannelText } from '../lib.js';
import { WORDMARK } from '../assets.js';
import { GatheringCard } from './Gatherings.jsx';
import { useShared } from '../gatherings/useShared.js';
import { host } from '../gatherings/sim.js';
import { startInstant } from '../gatherings/model.js';

const MAX_GIFTS = 3;

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
        <p className="hero-lede">A quick water test tells you when to oil. We’ll remind you to do it.</p>
      </div>
      <ProductStrip className="hero-product" />
      <div className="pad stack-12">
        {/* Oil pending or boards not home yet come first; otherwise the water test leads. */}
        {careView(care, today).primary[1] !== 'water-test' && <NextStep care={care} today={today} compact />}
        <WaterTestFeature care={care} today={today} />
      </div>
      <div className="guide-rail is-grid" role="list" aria-label="Care guides">
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
  { id: 'oil', icon: 'hand', title: 'How to oil', sub: 'Step by step', go: 'oil-guide' },
  { id: 'plan', icon: 'calendar', title: 'Care plan', sub: 'Reminders, history', go: 'care' },
];

function CookBlock({ user, today }) {
  const nav = useNav();
  const r = tonight(user, today);
  const people = user.cook?.prefs?.people || 4;
  return (
    <section className="section pad" aria-label="Dinner">
      <div className="section-head" style={{ padding: 0 }}>
        <h2 className="h2">{r ? 'Tonight' : 'This week’s dinners'}</h2>
        <button className="link" onClick={() => nav.switchTab('cook')}>{user.cook?.plan ? 'Your week' : 'Cook'}</button>
      </div>
      <div style={{ marginTop: 12 }}>
        {r ? (
          <button className="reminder-card tap" onClick={() => nav.switchTab('cook', { name: 'recipe', params: { id: r.id, people } })}>
            <div className="round-ico"><Icon name="cook" size={18} /></div>
            <div><div style={{ fontSize: 16, lineHeight: 1.3 }}>{r.name}</div><div className="small">{r.time} min · for {people}</div></div>
            <Icon name="chevron" size={18} />
          </button>
        ) : (
          <button className="reminder-card tap" onClick={() => nav.switchTab('cook', { name: 'cook-setup' })}>
            <div className="round-ico"><Icon name="calendar" size={18} /></div>
            <div><div style={{ fontSize: 16, lineHeight: 1.3 }}>Plan my week</div><div className="small">Dinners, one shopping list, prep with your boards</div></div>
            <Icon name="plus" size={18} />
          </button>
        )}
      </div>
    </section>
  );
}

function GiftBlock({ gifts, today }) {
  const nav = useNav();
  const list = gifts.map((g) => ({ g, ...giftInfo(g, today) })).filter((x) => x.date).sort((a, b) => a.days - b.days);
  const next = list[0];
  return (
    <section className="section pad" aria-label="Gift dates">
      <div className="section-head" style={{ padding: 0 }}>
        <h2 className="h2">Gift dates</h2>
        {gifts.length > 0 && <button className="link" onClick={() => nav.switchTab('gifts')}>Manage</button>}
      </div>
      {gifts.length === 0 ? (
        <button className="reminder-card tap" style={{ marginTop: 12 }} onClick={() => nav.switchTab('gifts', { name: 'gifts', params: { add: true, t: Date.now() } })}>
          <div className="round-ico"><Icon name="gift" size={18} /></div>
          <div><div style={{ fontSize: 16, lineHeight: 1.3 }}>Keep a special date close</div><div className="small">We’ll remind you 21 and 10 days ahead</div></div>
          <Icon name="plus" size={18} />
        </button>
      ) : (
        <>
          {next?.stage && <p className="small" style={{ margin: '6px 0 0' }}>Reminder sent: {giftWho(next.g)} is {whenText(next.days)}.</p>}
          <div className="stack-8" style={{ marginTop: 12 }}>
            {list.map((x) => (
              <button key={x.g.id} className="reminder-card tap" onClick={() => nav.switchTab('gifts')}>
                <div className="round-ico" style={x.stage ? { background: 'rgba(172,162,189,.25)', borderColor: 'rgba(172,162,189,.6)' } : undefined}><Icon name="gift" size={18} /></div>
                <div>
                  <div style={{ fontSize: 16, lineHeight: 1.3 }}>{giftWho(x.g)}</div>
                  <div className="small">{fmtShort(x.date)} · {whenText(x.days)} · {giftChannelText(x.g)}</div>
                </div>
                <Icon name="chevron" size={18} />
              </button>
            ))}
          </div>
          {gifts.length < MAX_GIFTS && <Button block variant="text" icon="plus" style={{ marginTop: 6 }} onClick={() => nav.switchTab('gifts', { name: 'gifts', params: { add: true, t: Date.now() } })}>Add a date</Button>}
        </>
      )}
    </section>
  );
}

// A compact way into Gatherings: the next one if there is one, else the action to plan one.
function GatheringsBlock() {
  const nav = useNav();
  const { email } = useStore();
  const list = useShared(() => host.list(email));
  const next = list.filter((g) => g.status === 'active' && startInstant(g.startsAt, g.tz) > Date.now() - 6 * 3600e3).sort((a, b) => startInstant(a.startsAt, a.tz) - startInstant(b.startsAt, b.tz))[0];
  return (
    <section className="section pad" aria-label="Gatherings">
      <div className="section-head" style={{ padding: 0 }}>
        <h2 className="h2">Gatherings</h2>
        {next && <button className="link" onClick={() => nav.switchTab('gatherings')}>All</button>}
      </div>
      <div style={{ marginTop: 12 }}>
        {next ? <GatheringCard g={next} compact /> : (
          <button className="reminder-card tap" onClick={() => nav.switchTab('gatherings', { name: 'gathering-new' })}>
            <div className="round-ico"><Icon name="people" size={18} /></div>
            <div><div style={{ fontSize: 16, lineHeight: 1.3 }}>Plan a gathering</div><div className="small">Organize what everyone brings</div></div>
            <Icon name="plus" size={18} />
          </button>
        )}
      </div>
    </section>
  );
}

export default function Home({ openProfile }) {
  const { user, today } = useStore();
  const nav = useNav();

  return (
    <div className="home">
      <button className="all-products" onClick={nav.allProducts}><Icon name="back" size={14} />All products</button>
      <AppHead onProfile={openProfile} />
      <CareHero care={user.care} today={today} />

      <CookBlock user={user} today={today} />
      <GiftBlock gifts={user.gifts} today={today} />
      <GatheringsBlock />

      <footer className="home-sign">
        <Sprig style={{ height: 40 }} />
        <div className="label">turning houses into homes</div>
      </footer>
    </div>
  );
}
