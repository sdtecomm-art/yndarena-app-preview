import { useStore } from '../store.jsx';
import { Icon, Sprig } from '../ui.jsx';
import { WORDMARK } from '../assets.js';
import kitchenMobile from '../media/kitchen/yndarena-kitchen-mobile.webp';
import kitchenDesktop from '../media/kitchen/yndarena-kitchen-desktop.webp';
import set1000 from '../media/product/yndarena-set-perspective-1000.webp';
import set600 from '../media/product/yndarena-set-perspective-600.webp';

// Yndarena's general entrance: a kitchen counter with the products. The kitchen photos are background layers only;
// the logo, copy, product hotspot and the Coming soon volume are built here, so text stays live and accessible.
// Products sit in "scene" coordinates (percent of the photo), so they stay on the counter whatever the screen shape.
export default function Entry({ onOpenSet }) {
  const { state, homeNo } = useStore();
  const signedIn = !!state.session;
  return (
    <div className="entry">
      <div className="entry-scene is-portrait" aria-hidden="false">
        <img className="entry-bg" src={kitchenMobile} alt="" decoding="async" />
        <Products onOpenSet={onOpenSet} />
      </div>
      <div className="entry-scene is-landscape">
        <img className="entry-bg" src={kitchenDesktop} alt="" decoding="async" />
        <Products onOpenSet={onOpenSet} />
      </div>

      <header className="entry-head">
        <img className="entry-wordmark" src={WORDMARK} alt="Yndarena, turning houses into homes" />
        {signedIn && <span className="entry-home"><Sprig />Home No. {homeNo}</span>}
      </header>
      <div className="entry-copy">
        <h1>Turning houses into homes.</h1>
        <p>Kitchen pieces named after Yndarena, for the meals you’ll want to remember.</p>
      </div>

      <div className="entry-foot">
        <button className="entry-card" onClick={onOpenSet}>
          <span className="entry-card-k">Your set</span>
          <span className="entry-card-t">Cutting Board Set</span>
          <span className="entry-card-s">Care plan, everyday meals and gift dates</span>
          <span className="entry-card-go" aria-hidden="true"><Icon name="arrow" size={18} /></span>
        </button>
        <p className="entry-note">{signedIn ? 'One account and one Home number for all of Yndarena.' : 'One account for all of Yndarena.'}</p>
      </div>
    </div>
  );
}

function Products({ onOpenSet }) {
  return (
    <>
      <button className="entry-set" onClick={onOpenSet} aria-label="Cutting Board Set. Open its care plan, meals and gift dates" tabIndex={-1}>
        <span className="entry-shadow" />
        <img src={set1000} srcSet={`${set600} 600w, ${set1000} 1000w`} sizes="(max-width: 600px) 60vw, 520px" alt="" decoding="async" />
      </button>
      <div className="entry-soon" role="note" aria-label="More for your home. Coming soon.">
        <span className="entry-shadow" />
        <div className="soon-top" />
        <div className="soon-front">
          <span className="soon-t">More for your home.</span>
          <span className="soon-s">Coming soon.</span>
        </div>
      </div>
    </>
  );
}
