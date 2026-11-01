import { Icon } from '../ui.jsx';
import { GiftDates } from './Care.jsx';
import { IS_PREVIEW } from '../data/links.js';

// A space at the end of a section for a short video: how the feature works and what it is for.
// No video exists yet; the frame says so instead of pretending to play.
export function VideoSlot({ title, text }) {
  return (
    <section className="video-slot" aria-label={`Video: ${title}`}>
      <div className="vs-frame">
        <span className="vs-play" aria-hidden="true"><Icon name="play" size={22} fill="currentColor" /></span>
        <span className="vs-soon">Video coming soon</span>
      </div>
      <div className="vs-t">{title}</div>
      <p className="vs-s">{text}</p>
    </section>
  );
}

const HOW = [
  { icon: 'calendar', t: 'Save the date', s: 'A first name, the occasion and the day. Every year, or just once.' },
  { icon: 'bell', t: 'We remind you twice', s: '21 days before, then 10 days before. Time to choose and to ship.' },
  { icon: 'mail', t: 'Your way', s: 'Push notifications, email, or both. You choose for each date.' },
  { icon: 'gift', t: 'Find the gift', s: 'Give Yndarena: a thoughtful gift for their home, on Amazon.' },
];

// Gifts: the dates that matter, reminders with time to spare, and a gift that fits a home.
export default function Gifts({ params = {} }) {
  return (
    <div className="gifts">
      <header className="care-head pad">
        <h1 className="display-l">Gifts</h1>
        <p className="lead" style={{ margin: '8px 0 0' }}>Keep the days that matter close. We’ll remind you in time to find a gift.</p>
      </header>

      <section className="pad gifts-how" aria-label="How gift reminders work">
        <ol>
          {HOW.map((h) => (
            <li key={h.t}>
              <span className="round-ico"><Icon name={h.icon} size={18} /></span>
              <span><span className="gh-t">{h.t}</span><span className="gh-s">{h.s}</span></span>
            </li>
          ))}
        </ol>
      </section>

      <section className="gifts-dates" aria-label="Your dates">
        <div className="pad"><div className="section-label"><span>Your dates · up to 3</span></div></div>
        <GiftDates startAdd={params.add} />
      </section>

      <div className="pad">
        <VideoSlot title="How Gifts works" text="Save a date, get two reminders ahead of it, and find a gift for their home. About a minute." />
        {IS_PREVIEW && <p className="small muted" style={{ marginTop: 8 }}>Preview: space reserved for the video. It isn’t recorded yet.</p>}
      </div>
    </div>
  );
}
