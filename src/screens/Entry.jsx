import { useStore } from '../store.jsx';
import { Icon, Sprig } from '../ui.jsx';
import { WORDMARK } from '../assets.js';
import kitchenMobile from '../media/kitchen/yndarena-kitchen-mobile.webp';
import kitchenDesktop from '../media/kitchen/yndarena-kitchen-desktop.webp';
import set540 from '../media/product/yndarena-upright-original-v7-540.webp';
import set270 from '../media/product/yndarena-upright-original-v7-270.webp';

// Yndarena's general entrance. The kitchen photos are background layers only; everything else is code.
// The set is the owner's original artwork (media v7): a front view of three 18 mm spines, 330 mm tall, so the image
// is always 54:330 and is only ever scaled as a whole (never stretched, cropped or put in perspective).
// Clean entrance (owner, 2026-11-05): wordmark, Home number, the set in the middle and one button. No headline,
// no product card. The set stands alone in the middle of the stage (the “More for your home · Coming soon” teaser was removed, 2026-11-05).
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
        <h1 className="sr-only">Yndarena</h1>

        <div className="entry-stage">
          <button className="entry-set" onClick={onOpenSet} tabIndex={-1} aria-label="Cutting Board Set: Cheese & Bread, Fruits & Vegetables, Meat & Fish. Open your set">
            <img src={set540} srcSet={`${set270} 270w, ${set540} 540w`} sizes="80px" width="540" height="3300" alt="" decoding="async" />
            <span className="entry-ground" aria-hidden="true" />
          </button>
        </div>

        <div className="entry-foot">
          <button className="btn btn-primary btn-block entry-open" onClick={onOpenSet}>
            <span>Open your set</span>
          </button>
        </div>
      </div>
    </div>
  );
}
