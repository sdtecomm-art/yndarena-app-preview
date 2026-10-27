import { TopBar, Kicker, DemoNote } from '../ui.jsx';
import BoardView from '../board/BoardView.jsx';
import { MEDIA, PACKAGES, PHOTO_PIECES, BOARD_SURFACES, photoPiece } from '../data/media.js';
import { VIDEOS, videoReady } from '../data/videos.js';
import { ITEMS, BOARDS, CATEGORIES, styleOf } from '../data/catalog.js';
import { TECHNIQUES } from '../data/techniques.js';
import { PRESENTATIONS, PRESENTATION_ORDER } from '../data/presentations.js';
import { RECIPES } from '../data/recipes.js';
import { COMMUNITY, COMMUNITY_ORDER } from '../data/community.js';
import { REVIEW } from '../data/review.js';

const MODE = { group: 'Group', cluster: 'Group (visual count)', units: 'One per unit' };

function coverage(placements) {
  const keys = [...new Set(placements.map(([type, style]) => `${type}:${styleOf(type, style).id}`))];
  return { keys, missing: keys.filter((k) => !photoPiece(...k.split(':'))) };
}

function CoverageRow({ name, placements }) {
  const { keys, missing } = coverage(placements);
  return (
    <div className="ing-row" style={{ display: 'block' }}>
      <div>{name} <span className="small">· {keys.length} groups, {missing.length ? `${missing.length} illustrated` : 'all photographic'}</span></div>
      {missing.length > 0 && <div className="note">Illustrated: {missing.join(', ')}</div>}
    </div>
  );
}

// Every serving style of one category at its base amount, at true relative size, on a board.
function categorySheet(cat) {
  const pieces = Object.entries(ITEMS).filter(([, it]) => it.cat === cat).flatMap(([type, it]) => it.styles.map((s) => [type, s.id]));
  const cols = cat === 'crunch' ? 2 : pieces.length > 12 ? 5 : pieces.length > 6 ? 4 : 3;
  const rows = Math.ceil(pieces.length / cols);
  return pieces.map(([type, style], i) => ({
    uid: `${type}:${style}`, type, style, qty: ITEMS[type].baseQty, r: 0,
    x: (600 / cols) * ((i % cols) + 0.5), y: (400 / rows) * (Math.floor(i / cols) + 0.5),
  }));
}

// Where each cover is used, for the covers list.
function coverUses(id) {
  const uses = [];
  for (const pid of PRESENTATION_ORDER) {
    const p = PRESENTATIONS[pid];
    if (p.media?.cover === id) uses.push(`${p.name} card`);
    for (const c of p.compositions) if (c.media?.cover === id || c.media?.topView === id) uses.push(`${p.name} · ${c.name}`);
  }
  for (const [rid, r] of Object.entries(RECIPES)) if (r.media?.cover === id) uses.push(`${r.name} recipe`);
  return uses;
}

// Review panel: provenance, coverage, covers, videos and checks. Reached from preview tools only.
export default function Review() {
  const llr = PRESENTATIONS['love-like-rosemary'];
  const twoHalves = llr.compositions.find((c) => c.id === 'two-halves');
  const styles = Object.entries(ITEMS).flatMap(([type, it]) => it.styles.map((s) => [type, s.id]));
  const lib = coverage(styles);
  const covers = Object.keys(MEDIA).filter((id) => ['cover', 'layout-top'].includes(MEDIA[id].role));
  const videos = Object.entries(VIDEOS);
  const ready = videos.filter(([, v]) => videoReady(v));
  return (
    <>
      <TopBar title="Review panel" />
      <div className="pad">
        <Kicker>Preview tools · not part of the app</Kicker>
        <h1 className="h1" style={{ marginTop: 6 }}>Photographic library</h1>
        <p className="small" style={{ marginTop: 8 }}>Updated {REVIEW.updated}.</p>
        <ul className="check-list">{REVIEW.packages.map((m) => <li key={m}><span className="mk">·</span>{m}</li>)}</ul>
      </div>

      <div className="pad section">
        <h2 className="h2">Library coverage</h2>
        <p className="small" style={{ margin: '4px 0 0' }}>
          {Object.keys(ITEMS).length} items, {lib.keys.length} serving styles: {lib.keys.length - lib.missing.length} photographic{lib.missing.length ? `, ${lib.missing.length} illustrated (${lib.missing.join(', ')})` : ', none illustrated'}.
        </p>
      </div>

      <div className="pad section">
        <h2 className="h2">Library on a board</h2>
        <p className="small" style={{ margin: '4px 0 0' }}>Each serving style at its base amount, at the size Designer draws it.</p>
        {CATEGORIES.map((cat) => (
          <div key={cat.id} style={{ marginTop: 12 }}>
            <div className="label" style={{ marginBottom: 6 }}>{cat.label}</div>
            <BoardView boardId={cat.id === 'produce' ? 'fruits-veg' : 'cheese-bread'} items={categorySheet(cat.id)} label={`${cat.label}, every serving style`} />
          </div>
        ))}
      </div>

      <div className="pad section">
        <h2 className="h2">Pieces and sources</h2>
        {CATEGORIES.map((cat) => (
          <div key={cat.id} style={{ marginTop: 10 }}>
            <div className="label">{cat.label}</div>
            {Object.entries(PHOTO_PIECES).filter(([key]) => ITEMS[key.split(':')[0]].cat === cat.id).map(([key, piece]) => {
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
                    <div className="sub">{m.sourceFile}{m.reused ? ' (reused)' : ''} · {PACKAGES[m.pkg].name}</div>
                    <div className="sub">{MODE[piece.mode]}{piece.turn ? ', may turn 90°' : ''} · {TECHNIQUES[st.tech].name} · {m.label}, {m.status}</div>
                    {m.note && <div className="sub">{m.note}</div>}
                    <div className="sub" style={{ fontFamily: 'var(--sans)', fontSize: 11 }}>manifest sha256 {m.sha256.slice(0, 12)}…{m.pkg === 'v2' ? ' (received re-encoded)' : ''}</div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="pad section">
        <h2 className="h2">Coverage by layout</h2>
        {PRESENTATION_ORDER.flatMap((pid) => PRESENTATIONS[pid].compositions.map((c) => (
          <CoverageRow key={pid + c.id} name={`${PRESENTATIONS[pid].name} · ${c.name}`} placements={c.place.map((pl) => [pl.g, pl.s])} />
        )))}
        {COMMUNITY_ORDER.map((cid) => (
          <CoverageRow key={cid} name={`From home to home · ${COMMUNITY[cid].name}`} placements={COMMUNITY[cid].items.map((i) => [i.type, i.style])} />
        ))}
      </div>

      <div className="pad section">
        <h2 className="h2">Covers</h2>
        <p className="small" style={{ margin: '4px 0 0' }}>AI-generated editorial images. Customers see them as inspiration; the Layout view stays the reference.</p>
        {covers.map((id) => {
          const m = MEDIA[id];
          return (
            <div key={id} className="list-row" style={{ alignItems: 'flex-start' }}>
              <div className="thumb" style={{ width: 72, height: 48, borderRadius: 6 }}>
                <img src={m.small || m.src} alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div className="grow">
                <div>{coverUses(id).join(', ') || 'Not used'}</div>
                <div className="sub">{m.sourceFile || id} · {m.label}, {m.status}</div>
                {(REVIEW.coverNotes[id] || []).map((n) => <div key={n} className="sub">≠ {n}</div>)}
              </div>
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
        <h2 className="h2">Videos</h2>
        <p className="small" style={{ margin: '4px 0 0' }}>{ready.length} of {videos.length} available. Playback controls appear only for clips marked ready with a file.</p>
        {videos.map(([id, v]) => (
          <div key={id} className="ing-row">
            <span>{TECHNIQUES[id]?.name || 'How to care for your boards'}</span>
            <span className="q" style={{ textAlign: 'right' }}>{videoReady(v) ? 'Ready' : `Not generated · ${v.scenes} scene${v.scenes > 1 ? 's' : ''}`}</span>
          </div>
        ))}
      </div>

      <div className="pad section">
        <h2 className="h2">Board surface</h2>
        {Object.entries(BOARD_SURFACES).map(([bid, sid]) => (
          <div key={bid} className="ing-row"><span>{BOARDS[bid].name}</span><span className="q">{MEDIA[sid].label}, {MEDIA[sid].status}</span></div>
        ))}
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
