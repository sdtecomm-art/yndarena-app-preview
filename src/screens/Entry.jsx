import { useStore } from '../store.jsx';
import { Icon, Sprig } from '../ui.jsx';
import { WORDMARK } from '../assets.js';
import kitchenMobile from '../media/kitchen/yndarena-kitchen-mobile.webp';
import kitchenDesktop from '../media/kitchen/yndarena-kitchen-desktop.webp';
import set540 from '../media/product/yndarena-upright-original-v7-540.webp';
import set270 from '../media/product/yndarena-upright-original-v7-270.webp';
import teaser from '../media/product/yndarena-rosemary-question-v7.webp';

// Yndarena's general entrance. The kitchen photos are background layers only; everything else is code.
// The set is the owner's original artwork (media v7): a front view of three 18 mm spines, 330 mm tall, so the image
// is always 54:330 and is only ever scaled as a whole (never stretched, cropped or put in perspective).
// The rosemary question mark is a decorative brand symbol for what comes next, not a product.
export default function Entry({ onOpenSet }) {
  const { state, homeNo } = useStore();
  const signedIn = !!state.session;
  return (
    <div className="entry">
      <img className="entry-bg is-portrait" src={kitchenMobile} alt="" decoding="async" />
      <img className="entry-bg is-landscape" src={kitchenDesktop} alt="" decoding="async" />
      <div className="entry-scroll">
        <header className="entry-head">
          <img className="entry-wordmark" src={WORDMARK} alt="Yndarena, turning houses into homes" />
          {signedIn && <span className="entry-home"><Sprig />Home No. {homeNo}</span>}
        </header>
        <div className="entry-copy">
          <h1>Turning houses into homes.</h1>
          <p>Kitchen pieces named after Yndarena, for the meals you’ll want to remember.</p>
        </div>

        <div className="entry-stage">
          <button className="entry-set" onClick={onOpenSet} tabIndex={-1} aria-label="Cutting Board Set: Cheese & Bread, Fruits & Vegetables, Meat & Fish. Open your set">
            <img src={set540} srcSet={`${set270} 270w, ${set540} 540w`} sizes="80px" width="540" height="3300" alt="" decoding="async" />
            <span className="entry-ground" aria-hidden="true" />
          </button>
          <div className="entry-soon">
            <img src={teaser} width="720" height="1080" alt="" aria-hidden="true" decoding="async" />
            <p className="soon-t">More for your home</p>
            <p className="soon-s">Coming soon</p>
          </div>
        </div>

        <div className="entry-foot">
          <div className="entry-card">
            <span className="entry-card-k">Available now</span>
            <span className="entry-card-t">Cutting Board Set</span>
            <span className="entry-card-s">Three boards, 33 × 24 × 1.8 cm each. Care plan, everyday meals and gift dates.</span>
            <button className="btn btn-primary btn-block entry-open" onClick={onOpenSet}>
              <span>Open your set</span>
              <span className="btn-arrow"><Icon name="arrow" size={16} /></span>
            </button>
          </div>
          <p className="entry-note">{signedIn ? 'Your Home number belongs to your account, for all of Yndarena.' : 'One account for all of Yndarena.'}</p>
        </div>
      </div>
    </div>
  );
}
