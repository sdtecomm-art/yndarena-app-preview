import { Icon } from '../ui.jsx';
import { GiftDates } from './Care.jsx';

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
    </section>
  );
}


// Gifts: the dates that matter, reminders with time to spare, and a gift that fits a home.
export default function Gifts({ params = {} }) {
  return (
    <div className="gifts">
      <header className="care-head pad">
        <h1 className="display-l">Gifts</h1>
      </header>

      <div className="pad gifts-video">
        <VideoSlot title="How Gifts works" text="Save a date, get two reminders ahead of it, and find a gift for their home. About a minute." />
      </div>


      <section className="gifts-dates" aria-label="Your dates">
        <div className="pad"><div className="section-label"><span>Your dates</span></div></div>
        <GiftDates startAdd={params.add} />
      </section>
    </div>
  );
}
