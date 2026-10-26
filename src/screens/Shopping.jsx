import { useNav } from '../nav.jsx';
import { useStore } from '../store.jsx';
import { TopBar, Icon, IconButton, Kicker, Stepper, useToast } from '../ui.jsx';
import { listContent, frac } from '../lib.js';

export function shareText(c, have) {
  const lines = [`${c.title}${c.subtitle ? ' · ' + c.subtitle : ''}`, ''];
  const buy = [...c.groceries, ...c.pantry].filter((l) => !have[l.key]);
  lines.push('To buy:');
  buy.forEach((l) => lines.push(`- ${l.name}: ${l.label}`));
  if (c.serveware.length || c.tools.length) {
    lines.push('', 'Bowls and tools:');
    [...c.serveware, ...c.tools].forEach((t) => lines.push(`- ${t}`));
  }
  lines.push('', 'From my Yndarena Home');
  return lines.join('\n');
}

export async function shareList(title, text, toast) {
  try {
    if (navigator.share) { await navigator.share({ title, text }); return; }
  } catch (e) { if (e?.name === 'AbortError') return; }
  try { await navigator.clipboard.writeText(text); toast('List copied. Paste it anywhere.'); }
  catch { toast('Sharing isn’t available here.'); }
}

export default function Shopping({ params }) {
  const nav = useNav();
  const toast = useToast();
  const { user, updateUser } = useStore();
  const list = user.lists[params.id];
  const c = list && listContent(list, user);
  if (!c) return (<><TopBar title="Shopping list" /><p className="pad body">This list is linked to a board that no longer exists.</p></>);

  const have = list.have || {};
  const toggle = (key) => updateUser((u) => { const l = u.lists[params.id]; l.have = { ...l.have, [key]: !l.have[key] }; });
  const all = [...c.groceries, ...c.pantry];
  const toBuy = all.filter((l) => !have[l.key]).length;

  const openSource = () => {
    const s = list.source;
    if (s.kind === 'presentation') nav.push('presentation', { id: s.id, comp: s.compositionId });
    else if (s.kind === 'design') nav.push('designer', { id: s.id });
    else if (s.kind === 'recipe') nav.push('recipe', { id: s.id });
    else if (s.kind === 'community') nav.push('community', { id: s.id });
  };

  const Line = ({ l }) => (
    <button className={'check-row' + (have[l.key] ? ' is-done' : '')} onClick={() => toggle(l.key)} aria-pressed={!!have[l.key]}>
      <span className="box">{have[l.key] && <Icon name="check" size={14} stroke={2} />}</span>
      <span className="txt">
        {l.name}
        {l.from.length > 0 && <span className="small" style={{ display: 'block' }}>For {l.from.join(', ')}</span>}
      </span>
      <span className="q">{l.label}</span>
    </button>
  );

  return (
    <>
      <TopBar title="Shopping list" right={<IconButton name="share" label="Share list" onClick={() => shareList(c.title, shareText(c, have), toast)} />} />
      <div className="pad">
        <Kicker>Linked to</Kicker>
        <button onClick={openSource} style={{ textAlign: 'left' }}>
          <h1 className="h1" style={{ marginTop: 6 }}>{c.title}</h1>
          {c.subtitle && <div className="small">{c.subtitle} <Icon name="chevron" size={13} /></div>}
        </button>
        <p className="small" style={{ marginTop: 12 }}>
          {toBuy} to buy · {all.length - toBuy} already have. Tap anything you already have. Your marks stay when the board changes.
        </p>
        {list.source.kind === 'recipe' && (
          <div className="row-between" style={{ marginTop: 8 }}>
            <span className="label">Batches</span>
            <Stepper label={frac(list.source.scale || 1)} onDec={() => updateUser((u) => { const s = u.lists[params.id].source; s.scale = Math.max(0.5, (s.scale || 1) - 0.5); })} onInc={() => updateUser((u) => { const s = u.lists[params.id].source; s.scale = Math.min(3, (s.scale || 1) + 0.5); })} />
          </div>
        )}
      </div>

      <div className="pad section" style={{ marginTop: 18 }}>
        <Kicker>Groceries</Kicker>
        {c.groceries.map((l) => <Line key={l.key + l.unit} l={l} />)}
      </div>
      {c.pantry.length > 0 && (
        <div className="pad section">
          <Kicker>Pantry · you may already have these</Kicker>
          {c.pantry.map((l) => <Line key={l.key + l.unit} l={l} />)}
        </div>
      )}
      {(c.serveware.length > 0 || c.tools.length > 0) && (
        <div className="pad section">
          <Kicker>Bowls, board and tools</Kicker>
          {[...c.serveware, ...c.tools].map((t) => (
            <Line key={t} l={{ key: 'tool:' + t, name: t, from: [], label: '' }} />
          ))}
        </div>
      )}
    </>
  );
}
