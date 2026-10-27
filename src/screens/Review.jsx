import { TopBar, Kicker, DemoNote } from '../ui.jsx';
import { MEDIA, PHOTO_PIECES, photoPiece } from '../data/media.js';
import { ITEMS, styleOf } from '../data/catalog.js';
import { TECHNIQUES } from '../data/techniques.js';
import { PRESENTATIONS } from '../data/presentations.js';
import { REVIEW } from '../data/review.js';

const MODE = { group: 'Group', cluster: 'Group (visual count)', units: 'One per unit' };

// Review panel: provenance, checks and differences. Reached from preview tools only.
export default function Review() {
  const p = PRESENTATIONS['love-like-rosemary'];
  const twoHalves = p.compositions.find((c) => c.id === 'two-halves');
  return (
    <>
      <TopBar title="Review panel" />
      <div className="pad">
        <Kicker>Preview tools · not part of the app</Kicker>
        <h1 className="h1" style={{ marginTop: 6 }}>Love, Like Rosemary</h1>
        <p className="small" style={{ marginTop: 8 }}>Photographic ingredients, updated {REVIEW.updated}. Package: {REVIEW.package}.</p>
      </div>

      <div className="pad section">
        <h2 className="h2">Pieces and sources</h2>
        <div style={{ marginTop: 8 }}>
          {Object.entries(PHOTO_PIECES).map(([key, piece]) => {
            const [type, style] = key.split(':');
            const m = MEDIA[piece.asset];
            const st = styleOf(type, style);
            return (
              <div key={key} className="list-row" style={{ alignItems: 'flex-start' }}>
                <div className="thumb" style={{ width: 52, height: 52, background: 'linear-gradient(135deg,#9a6644,#7c4f33)' }}>
                  <img src={m.src} alt="" loading="lazy" style={{ maxWidth: 44, maxHeight: 44, objectFit: 'contain' }} />
                </div>
                <div className="grow">
                  <div>{ITEMS[type].name} · {st.label}</div>
                  <div className="sub">{m.sourceFile}{m.reused ? ' (reused)' : ''}</div>
                  <div className="sub">{MODE[piece.mode]} · {TECHNIQUES[st.tech].name} · {m.label}, {m.status}</div>
                  <div className="sub" style={{ fontFamily: 'var(--sans)', fontSize: 11 }}>sha256 {m.sha256.slice(0, 12)}…</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="pad section">
        <h2 className="h2">Coverage by layout</h2>
        {p.compositions.map((c) => {
          const seen = [...new Map(c.place.map((pl) => [`${pl.g}:${styleOf(pl.g, pl.s).id}`, pl])).keys()];
          const missing = seen.filter((k) => !photoPiece(...k.split(':')));
          return (
            <div key={c.id} className="ing-row" style={{ display: 'block' }}>
              <div>{c.name} <span className="small">· {seen.length} groups, {missing.length ? `${missing.length} illustrated` : 'all photographic'}</span></div>
              {missing.length > 0 && <div className="note">Illustrated: {missing.join(', ')}</div>}
            </div>
          );
        })}
      </div>

      <div className="pad section">
        <h2 className="h2">Reference photo vs. Two Halves</h2>
        <p className="small" style={{ margin: '4px 0 0' }}>{MEDIA['llr-two-halves-top'].label}, used as the cover of the original. The editable layout remains the reference for Designer and the build guide.</p>
        <div className="label" style={{ marginTop: 12 }}>Same in both</div>
        <ul className="check-list">{twoHalves.media.matches.map((m) => <li key={m}><span className="mk">=</span>{m}</li>)}</ul>
        <div className="label" style={{ marginTop: 10 }}>Different in the photo</div>
        <ul className="check-list">{twoHalves.media.differs.map((m) => <li key={m}><span className="mk">≠</span>{m}</li>)}</ul>
      </div>

      <div className="pad section">
        <h2 className="h2">Rendering rules</h2>
        <ul className="check-list">{REVIEW.rules.map((m) => <li key={m}><span className="mk">·</span>{m}</li>)}</ul>
      </div>

      <div className="pad section">
        <h2 className="h2">Checks</h2>
        <ul className="check-list">{REVIEW.checks.map((m) => <li key={m}><span className="mk">✓</span>{m}</li>)}</ul>
      </div>

      <div className="pad section">
        <h2 className="h2">Pending</h2>
        <ul className="check-list">{REVIEW.pending.map((m) => <li key={m}><span className="mk">○</span>{m}</li>)}</ul>
        <div style={{ marginTop: 14 }}><DemoNote>Images are AI-generated previews. They do not verify portions, board dimensions or that a preparation was tested.</DemoNote></div>
      </div>
    </>
  );
}
