import { TopBar } from '../ui.jsx';
import { REVIEW } from '../data/review.js';

const SECTIONS = [
  ['scope', 'What changed in v11'],
  ['data', 'Saved data'],
  ['gatherings', 'Gatherings: implemented'],
  ['simulated', 'Simulated in this preview'],
  ['pending', 'Pending'],
  ['kept', 'Kept as it was'],
];

// For reviewers only: what is real, what is simulated, what is pending.
export default function Review() {
  return (
    <>
      <TopBar title="Review panel" />
      <div className="pad review">
        <p className="small muted">Updated {REVIEW.updated}. Not part of the customer journey.</p>
        {SECTIONS.map(([k, t]) => (
          <section key={k} className="g-sec">
            <div className="section-label"><span>{t}</span></div>
            <ul className="review-list">{REVIEW[k].map((x) => <li key={x}>{x}</li>)}</ul>
          </section>
        ))}
      </div>
    </>
  );
}
