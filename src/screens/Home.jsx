import { useStore } from '../store.jsx';
import { useNav } from '../nav.jsx';
import { Icon, Kicker, Sprig, Button, PhotoPending } from '../ui.jsx';
import { PresentationCard, CommunityCard, BoardThumb } from '../components.jsx';
import BoardView from '../board/BoardView.jsx';
import { PRESENTATIONS, PRESENTATION_ORDER, OCCASIONS } from '../data/presentations.js';
import { COMMUNITY_ORDER } from '../data/community.js';
import { TECHNIQUES } from '../data/techniques.js';
import { presentationItems, careStatus, giftInfo, giftWho, fmtShort, daysBetween, whenText } from '../lib.js';
import { ItemIcon } from '../components.jsx';
import { WORDMARK } from '../assets.js';

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

function ContinueCard({ user }) {
  const nav = useNav();
  const r = user.recent;
  if (!r) return null;
  if (r.kind === 'design' && user.designs[r.id]) {
    const d = user.designs[r.id];
    return (
      <button className="card tap" onClick={() => nav.push('designer', { id: d.id })}>
        <div className="row" style={{ padding: 12 }}>
          <BoardThumb board={d.board} items={d.items} uid={'cont-' + d.id} />
          <div className="grow">
            <div className="kicker">Pick up where you left off</div>
            <div className="h3" style={{ fontSize: 17, marginTop: 2 }}>{d.name}</div>
          </div>
          <Icon name="chevron" size={18} />
        </div>
      </button>
    );
  }
  if (r.kind === 'presentation' && PRESENTATIONS[r.id]) {
    const p = PRESENTATIONS[r.id];
    return (
      <button className="card tap" onClick={() => nav.push('presentation', { id: r.id, comp: r.comp })}>
        <div className="row" style={{ padding: 12 }}>
          <BoardThumb board={p.board} items={presentationItems(r.id, r.comp)} uid={'cont-p-' + r.id} />
          <div className="grow">
            <div className="kicker">You were looking at</div>
            <div className="h3" style={{ fontSize: 17, marginTop: 2 }}>{p.name}</div>
          </div>
          <Icon name="chevron" size={18} />
        </div>
      </button>
    );
  }
  return null;
}

function Reminders({ user, today }) {
  const nav = useNav();
  const cards = [];
  if (user.care.status === 'active') {
    const cs = careStatus(user.care, today);
    if (cs.dueNow) cards.push({ k: 'care', icon: 'drop', title: 'Time for the water test', sub: 'A quick check for your boards', action: () => nav.switchTab('care', { name: 'water-test', params: {} }), hot: true });
    else if (cs.next) cards.push({ k: 'care', icon: 'drop', title: 'Next board check', sub: `${fmtShort(cs.next.date)} · in ${daysBetween(today, cs.next.date)} days`, action: () => nav.switchTab('care') });
  }
  const upcoming = user.gifts.map((g) => ({ g, ...giftInfo(g, today) })).filter((x) => x.date).sort((a, b) => a.days - b.days);
  if (upcoming[0]) {
    const x = upcoming[0];
    cards.push({ k: 'gift', icon: 'gift', title: `${giftWho(x.g)} is ${whenText(x.days)}`, sub: fmtShort(x.date), action: () => nav.switchTab('care', { name: 'care', params: { seg: 'gifts' } }), hot: x.stage != null });
  }
  if (!cards.length) return null;
  return (
    <div className="section pad stack-8">
      <Kicker>Your reminders</Kicker>
      {cards.map((c) => (
        <button key={c.k} className="reminder-card tap" onClick={c.action}>
          <div className="round-ico" style={c.hot ? { background: 'rgba(172,162,189,.25)', borderColor: 'rgba(172,162,189,.6)' } : undefined}><Icon name={c.icon} size={18} /></div>
          <div>
            <div style={{ fontSize: 16, lineHeight: 1.3 }}>{c.title}</div>
            <div className="small">{c.sub}</div>
          </div>
          <Icon name="chevron" size={18} />
        </button>
      ))}
    </div>
  );
}

export default function Home({ openProfile }) {
  const { user, today } = useStore();
  const nav = useNav();
  const hero = PRESENTATIONS['love-like-rosemary'];
  const hasActivity = !!user.recent || user.made.length > 0;
  const careNone = user.care.status === 'none';
  const giftsNone = user.gifts.length === 0;

  return (
    <>
      <AppHead onProfile={openProfile} />
      <div className="pad" style={{ marginTop: 16 }}>
        <h1 className="display">{greeting()}</h1>
        <p className="lead" style={{ margin: '8px 0 0' }}>{hasActivity ? 'Something to share tonight?' : 'Here’s a board to start with. Everything you need is inside.'}</p>
      </div>

      {hasActivity && <div className="pad" style={{ marginTop: 18 }}><ContinueCard user={user} /></div>}

      <div className="pad" style={{ marginTop: 18 }}>
        <button className="card board-card tap" onClick={() => nav.push('presentation', { id: 'love-like-rosemary' })}>
          <PhotoPending className="board-art" >
            <BoardView boardId={hero.board} items={presentationItems('love-like-rosemary', 'two-halves')} uid="hero" />
          </PhotoPending>
          <div className="card-body">
            <div className="kicker">Featured · For Two</div>
            <div className="card-title" style={{ fontSize: 28, marginTop: 4 }}>{hero.name}</div>
            <p className="small" style={{ margin: '6px 0 10px' }}>{hero.intro}</p>
            <span className="row" style={{ gap: 14 }}>
              <span className="meta"><Icon name="clock" size={15} />{hero.time} min</span>
              <span className="meta"><Icon name="people" size={15} />Serves {hero.serves}</span>
              <span className="meta"><Icon name="grid" size={15} />3 layouts</span>
            </span>
          </div>
        </button>
      </div>

      <div className="section">
        <div className="section-head"><h2 className="h2">Find your occasion</h2></div>
        <div className="hscroll">
          {OCCASIONS.map((o) => (
            <button key={o.id} className="card tap" style={{ width: 150, padding: 14 }} onClick={() => nav.switchTab('discover', { name: 'discover', params: { seg: 'presentations', occasion: o.id } })}>
              <Sprig style={{ height: 34, background: o.id === 'special' ? 'var(--c-lavender)' : 'var(--c-sage)' }} />
              <div className="h3" style={{ fontSize: 18, marginTop: 8 }}>{o.label}</div>
              <div className="small" style={{ fontSize: 13 }}>{o.line}</div>
            </button>
          ))}
        </div>
      </div>

      <Reminders user={user} today={today} />

      {(careNone || giftsNone) && (
        <div className="section pad stack-8">
          <Kicker>Included in your Home</Kicker>
          {careNone && (
            <button className="reminder-card tap" onClick={() => nav.switchTab('care')}>
              <div className="round-ico"><Icon name="drop" size={18} /></div>
              <div><div style={{ fontSize: 16, lineHeight: 1.3 }}>Care for your boards</div><div className="small">A two-minute video, the water test and reminders</div></div>
              <Icon name="chevron" size={18} />
            </button>
          )}
          {giftsNone && (
            <button className="reminder-card tap" onClick={() => nav.switchTab('care', { name: 'care', params: { seg: 'gifts' } })}>
              <div className="round-ico"><Icon name="gift" size={18} /></div>
              <div><div style={{ fontSize: 16, lineHeight: 1.3 }}>Keep a special date close</div><div className="small">We’ll remind you 21 and 10 days ahead</div></div>
              <Icon name="chevron" size={18} />
            </button>
          )}
        </div>
      )}

      <div className="section">
        <div className="section-head">
          <h2 className="h2">More to share</h2>
          <button className="link" onClick={() => nav.switchTab('discover', { name: 'discover', params: { seg: 'presentations' } })}>See all</button>
        </div>
        <div className="hscroll">
          {PRESENTATION_ORDER.filter((id) => id !== 'love-like-rosemary').map((id) => <PresentationCard key={id} id={id} />)}
        </div>
      </div>

      <div className="section">
        <div className="section-head">
          <h2 className="h2">Little techniques</h2>
          <button className="link" onClick={() => nav.switchTab('discover', { name: 'discover', params: { seg: 'techniques' } })}>All</button>
        </div>
        <div className="hscroll">
          {['prosciutto-rose', 'salami-river', 'grape-clusters', 'cracker-fan', 'apple-fan'].map((id) => {
            const t = TECHNIQUES[id];
            return (
              <button key={id} className="card tap" style={{ width: 132, padding: 10 }} onClick={() => nav.push('technique', { id })}>
                <div style={{ background: 'var(--table)', borderRadius: 10, display: 'grid', placeItems: 'center', height: 92 }}>
                  <ItemIcon type={t.demoType} style={t.demoStyle} size={84} />
                </div>
                <div className="h3" style={{ fontSize: 16, marginTop: 8 }}>{t.name}</div>
                <div className="small" style={{ fontSize: 12.5 }}>{t.minutes} min</div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="section">
        <div className="section-head">
          <h2 className="h2">From home to home</h2>
          <button className="link" onClick={() => nav.switchTab('discover', { name: 'discover', params: { seg: 'h2h' } })}>More</button>
        </div>
        <div className="hscroll">{COMMUNITY_ORDER.map((id) => <CommunityCard key={id} id={id} />)}</div>
      </div>

      <div className="memory" style={{ marginTop: 34 }}>
        <div>
          <p>“If this wooden spoon could talk, it could tell the whole story of my life.”</p>
          <button className="link" style={{ marginTop: 14 }} onClick={() => nav.push('story')}>Our story</button>
        </div>
        <Sprig />
      </div>
      <div style={{ textAlign: 'center', margin: '28px 0 0' }} className="label">turning houses into homes</div>
    </>
  );
}

