import { useEffect, useRef, useState } from 'react';
import { useActions } from '../actions.js';
import { MEDIA, photoPiece, photoGroups } from '../data/media.js';
import { useNav } from '../nav.jsx';
import { useStore } from '../store.jsx';
import { Icon, IconButton, Sheet, Chip, Stepper, Button, DemoNote, useToast } from '../ui.jsx';
import { ItemIcon } from '../components.jsx';
import BoardView from '../board/BoardView.jsx';
import { ITEMS, BOARDS, CATEGORIES, BOARD_W, BOARD_H, sizeFor, styleOf, LAYER_ORDER } from '../data/catalog.js';
import { PRESENTATIONS } from '../data/presentations.js';
import { TECHNIQUES } from '../data/techniques.js';
import { RECIPES } from '../data/recipes.js';
import { uid, fmtQty, totals } from '../lib.js';

const clampItem = (it) => {
  const [w, h] = sizeFor(it.type, it.qty, it.style);
  const mx = Math.min(w, h) / 2 - 8;
  return { ...it, x: Math.max(mx, Math.min(BOARD_W - mx, it.x)), y: Math.max(mx, Math.min(BOARD_H - mx, it.y)) };
};

// Prepared arrangements. Deterministic layouts for the demo content, not an AI engine.
function arrange(kind, items) {
  const order = (it) => LAYER_ORDER.indexOf(ITEMS[it.type].cat);
  const sorted = [...items].sort((a, b) => order(a) - order(b));
  const bowls = sorted.filter((i) => ITEMS[i.type].cat === 'bowls');
  const garnish = sorted.filter((i) => ITEMS[i.type].cat === 'garnish');
  const rest = sorted.filter((i) => !bowls.includes(i) && !garnish.includes(i));
  const out = {};
  if (kind === 'wreath') {
    bowls.forEach((b, i) => { const a = (i / Math.max(1, bowls.length)) * Math.PI * 2; out[b.uid] = { x: 300 + (bowls.length > 1 ? Math.cos(a) * 46 : 0), y: 200 + (bowls.length > 1 ? Math.sin(a) * 34 : 0), r: 0 }; });
    rest.forEach((it, i) => { const a = -Math.PI / 2 + (i / rest.length) * Math.PI * 2; out[it.uid] = { x: 300 + Math.cos(a) * 205, y: 200 + Math.sin(a) * 122, r: ITEMS[it.type].cat === 'crunch' ? (a * 180) / Math.PI + 90 : 0 }; });
    garnish.forEach((g, i) => { out[g.uid] = { x: 300 + (i % 2 ? 1 : -1) * 92, y: 200, r: i % 2 ? 20 : -20 }; });
  } else if (kind === 'rows') {
    const all = [...bowls, ...rest];
    const cols = all.length > 6 ? 4 : 3;
    const rows = Math.ceil(all.length / cols);
    all.forEach((it, i) => { const c = i % cols, r = Math.floor(i / cols); out[it.uid] = { x: 70 + (c + 0.5) * (460 / cols), y: 40 + (r + 0.5) * (320 / rows), r: 0 }; });
    garnish.forEach((g, i) => { out[g.uid] = { x: 556, y: 90 + i * 110, r: 0 }; });
  } else {
    const all = [...bowls, ...rest];
    all.forEach((it, i) => {
      const t = (i + 0.5) / all.length;
      const bx = 90 + t * 420, by = 330 - t * 260;
      const side = ITEMS[it.type].cat === 'crunch' ? 0 : i % 2 ? 1 : -1;
      out[it.uid] = { x: bx + side * 70, y: by + side * 70, r: ITEMS[it.type].cat === 'crunch' ? -33 : 0 };
    });
    garnish.forEach((g, i) => { out[g.uid] = { x: i % 2 ? 520 : 80, y: i % 2 ? 70 : 335, r: 57 }; });
  }
  return items.map((it) => clampItem(out[it.uid] ? { ...it, ...out[it.uid] } : it));
}

function presentationArrangements(design) {
  if (design.origin?.kind !== 'presentation') return [];
  const p = PRESENTATIONS[design.origin.id];
  const t = totals(design.items);
  const same = p.groups.every((g) => Math.abs((t[g.type] || 0) - g.qty) < 0.01) && Object.keys(t).length === p.groups.length;
  if (!same) return [];
  return p.compositions.map((c) => ({ id: 'p-' + c.id, name: `${c.name} (Yndarena layout)`, comp: c }));
}

const GENERIC = [
  { id: 'wreath', name: 'Around the center' },
  { id: 'rows', name: 'Garden rows' },
  { id: 'diagonal', name: 'Along a diagonal' },
];

export default function Designer({ params }) {
  const nav = useNav();
  const toast = useToast();
  const { user, updateUser } = useStore();
  const a = useActions();
  const design = user.designs[params.id];
  const [items, setItems] = useState(design?.items || []);
  const [board, setBoard] = useState(design?.board || 'cheese-bread');
  const [name, setName] = useState(design?.name || '');
  const [sel, setSel] = useState(() => {
    if (!params.focus || !design) return null;
    const m = design.items.filter((i) => i.type === params.focus);
    return m.length ? m[m.length - 1].uid : null;
  });
  const [past, setPast] = useState([]);
  const [future, setFuture] = useState([]);
  const [sheet, setSheet] = useState(null);
  const [cat, setCat] = useState('cheese');
  const [suggestIdx, setSuggestIdx] = useState(0);
  const svgRef = useRef();
  const drag = useRef(null);

  useEffect(() => {
    if (drag.current) return;
    updateUser((u) => { const d = u.designs[params.id]; if (!d) return; d.items = items; d.board = board; d.updatedAt = new Date().toISOString(); u.recent = { kind: 'design', id: params.id, at: d.updatedAt }; });
  }, [items, board]); // eslint-disable-line

  if (!design) return <div className="pad" style={{ paddingTop: 80 }}>This design is no longer here. <Button onClick={() => nav.pop()}>Go back</Button></div>;

  const snapshot = () => { setPast((p) => [...p.slice(-40), { items, board }]); setFuture([]); };
  const commit = (next, nextBoard = board) => { snapshot(); setItems(next); if (nextBoard !== board) setBoard(nextBoard); };
  const undo = () => { if (!past.length) return; const prev = past[past.length - 1]; setFuture((f) => [{ items, board }, ...f]); setPast(past.slice(0, -1)); setItems(prev.items); setBoard(prev.board); setSel(null); };
  const redo = () => { if (!future.length) return; const nx = future[0]; setPast((p) => [...p, { items, board }]); setFuture(future.slice(1)); setItems(nx.items); setBoard(nx.board); setSel(null); };

  const selected = items.find((i) => i.uid === sel);
  const patchSel = (patch) => commit(items.map((i) => (i.uid === sel ? clampItem({ ...i, ...patch }) : i)));

  const toBoard = (e) => {
    const pt = svgRef.current.createSVGPoint();
    pt.x = e.clientX; pt.y = e.clientY;
    return pt.matrixTransform(svgRef.current.getScreenCTM().inverse());
  };
  const onItemDown = (id, e) => {
    e.stopPropagation();
    setSel(id);
    const it = items.find((i) => i.uid === id);
    const p = toBoard(e);
    drag.current = { id, dx: p.x - it.x, dy: p.y - it.y, moved: false, before: items };
    svgRef.current.setPointerCapture?.(e.pointerId);
  };
  const onMove = (e) => {
    const d = drag.current;
    if (!d) return;
    const p = toBoard(e);
    d.moved = true;
    setItems((cur) => cur.map((i) => (i.uid === d.id ? clampItem({ ...i, x: p.x - d.dx, y: p.y - d.dy }) : i)));
  };
  const onUp = () => {
    const d = drag.current;
    drag.current = null;
    if (d?.moved) { setPast((p) => [...p.slice(-40), { items: d.before, board }]); setFuture([]); setItems((x) => [...x]); }
  };

  const addItem = (type) => {
    const it = ITEMS[type];
    const n = items.length;
    const nu = clampItem({ uid: uid('it'), type, qty: it.baseQty, x: 300 + ((n * 53) % 180) - 90, y: 200 + ((n * 37) % 120) - 60, r: 0, style: it.styles[0].id });
    commit([...items, nu]);
    setSel(nu.uid);
    setSheet(null);
  };

  const suggestions = [...presentationArrangements({ ...design, items }), ...GENERIC];
  const suggest = () => {
    if (!items.length) { toast('Add a few groups first.'); return; }
    const s = suggestions[suggestIdx % suggestions.length];
    setSuggestIdx(suggestIdx + 1);
    if (s.comp) {
      const pool = {};
      items.forEach((i) => { (pool[i.type] = pool[i.type] || []).push(i); });
      const next = s.comp.place.map((p) => ({ uid: uid('it'), type: p.g, qty: p.q, x: p.x, y: p.y, r: p.r || 0, style: p.s || ITEMS[p.g].styles[0].id }));
      commit(next);
    } else commit(arrange(s.id, items));
    setSel(null);
    toast(`Arrangement: ${s.name}`);
  };

  const saveVersion = () => {
    updateUser((u) => {
      const d = u.designs[params.id];
      d.name = name;
      d.versions.push({ id: uid('v'), at: new Date().toISOString(), label: `Version ${d.versions.length + 1}`, items, board });
    });
    toast(`Saved as version ${design.versions.length + 1}.`);
  };

  const originText = design.origin
    ? design.origin.kind === 'presentation'
      ? `Based on ${design.origin.name}${design.origin.compositionName ? ', ' + design.origin.compositionName : ''}. The original stays as it is.`
      : design.origin.home ? `Based on ${design.origin.name}, shared by Home #${design.origin.home}.` : `Based on ${design.origin.name}.`
    : 'Started from scratch.';

  const it = selected && ITEMS[selected.type];
  const st = selected && styleOf(selected.type, selected.style);
  const piece = selected && photoPiece(selected.type, st.id);

  return (
    <div className="designer">
      <div className="designer-top">
        <IconButton name="back" label="Done" onClick={() => { updateUser((u) => { u.designs[params.id].name = name; }); nav.pop(); }} />
        <div className="designer-name">
          <input value={name} onChange={(e) => setName(e.target.value)} onBlur={() => updateUser((u) => { u.designs[params.id].name = name; })} aria-label="Design name" />
          <span className="label">Designer · {BOARDS[board].name}</span>
        </div>
        <IconButton name="save" label="Save version" onClick={saveVersion} />
      </div>

      <div className="designer-tools">
        <button className="tool" onClick={() => setSheet('library')}><Icon name="plus" size={20} />Add</button>
        <button className="tool" onClick={undo} disabled={!past.length}><Icon name="undo" size={20} />Undo</button>
        <button className="tool" onClick={redo} disabled={!future.length}><Icon name="redo" size={20} />Redo</button>
        <button className="tool" onClick={suggest}><Icon name="shuffle" size={20} />Arrange</button>
        <button className="tool" onClick={() => setSheet('board')}><Icon name="grid" size={20} />Board</button>
        <button className="tool" onClick={() => setSheet('versions')}><Icon name="layers" size={20} />Versions</button>
        <button className="tool" onClick={() => setSheet('techs')}><Icon name="play" size={20} />Techniques</button>
      </div>

      <div className="designer-canvas" onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}>
        <BoardView svgRef={svgRef} boardId={board} items={items} uid={'des-' + params.id} selected={sel} onItemDown={onItemDown} onBgDown={() => setSel(null)} />
        {!items.length && (
          <div style={{ position: 'absolute', textAlign: 'center', maxWidth: 240 }}>
            <Button small onClick={() => setSheet('library')} icon="plus">Add your first group</Button>
          </div>
        )}
        <div className="canvas-hint">{selected ? 'Drag to move · sizes are approximate' : items.length ? 'Tap a group to edit it' : 'An empty board, ready for you'}</div>
      </div>

      <div className="inspector">
        {selected ? (
          <div>
            <div className="row-between">
              <div>
                <div className="kicker">{CATEGORIES.find((c) => c.id === it.cat).label}</div>
                <div className="h3" style={{ fontSize: 19 }}>{it.name}</div>
              </div>
              <Stepper label={fmtQty(selected.qty, it.unit)} onDec={() => patchSel({ qty: Math.max(it.min, +(selected.qty - it.step).toFixed(3)) })} onInc={() => patchSel({ qty: Math.min(it.max, +(selected.qty + it.step).toFixed(3)) })} />
            </div>
            {it.styles.length > 1 && (
              <div className="row wrap" style={{ gap: 6, marginTop: 10 }}>
                {it.styles.map((s) => <Chip key={s.id} active={st.id === s.id} onClick={() => patchSel({ style: s.id })}>{s.label}</Chip>)}
              </div>
            )}
            <div className="row wrap" style={{ gap: 14, marginTop: 10 }}>
              <button className="link" onClick={() => nav.push('technique', { id: st.tech })}>How to: {TECHNIQUES[st.tech].name}</button>
              {it.recipe && <button className="link" onClick={() => nav.push('recipe', { id: it.recipe })}>Recipe</button>}
            </div>
            {piece && (
              <p className="small muted" style={{ margin: '10px 0 0' }}>
                Photo piece, {MEDIA[piece.asset].label}. Shown as {photoGroups(piece, selected.qty)} {piece.groupName[photoGroups(piece, selected.qty) > 1 ? 1 : 0]}. We assume one fan is about {fmtQty(piece.unitQty, it.unit)}: more cheese adds fans instead of stretching the photo.
              </p>
            )}
            <div className="inspector-actions">
              <button onClick={() => patchSel({ r: ((selected.r || 0) + 15) % 360 })}><Icon name="rotate" size={18} />Rotate</button>
              <button onClick={() => { const c = clampItem({ ...selected, uid: uid('it'), x: selected.x + 28, y: selected.y + 22 }); commit([...items, c]); setSel(c.uid); }}><Icon name="copy" size={18} />Duplicate</button>
              <button onClick={() => (it.subs.length ? setSheet('swap') : toast('No swaps for this one yet.'))}><Icon name="swap" size={18} />Swap</button>
              <button onClick={() => { commit(items.filter((i) => i.uid !== sel)); setSel(null); }}><Icon name="trash" size={18} />Remove</button>
            </div>
          </div>
        ) : (
          <div>
            <div className="small">{originText}</div>
            <div className="row" style={{ gap: 8, marginTop: 12 }}>
              <Button variant="ghost" small className="grow" disabled={!items.length} onClick={() => nav.push('shopping', { id: a.ensureList({ kind: 'design', id: params.id }) })}>Shopping list</Button>
              <Button small className="grow" disabled={!items.length} onClick={() => nav.push('table', { source: { kind: 'design', id: params.id } })}>Bring it to the table</Button>
            </div>
          </div>
        )}
      </div>

      <Sheet open={sheet === 'library'} onClose={() => setSheet(null)} title="Add to your board" tall>
        <div className="chips" style={{ padding: '0 0 12px', margin: '0 calc(-1 * var(--gut))', paddingLeft: 'var(--gut)' }}>
          {CATEGORIES.map((c) => <Chip key={c.id} active={cat === c.id} onClick={() => setCat(c.id)}>{c.label}</Chip>)}
        </div>
        <div className="lib-grid">
          {Object.entries(ITEMS).filter(([, v]) => v.cat === cat).map(([type, v]) => (
            <button key={type} className="lib-item tap" onClick={() => addItem(type)}>
              <div className="lib-art"><ItemIcon type={type} size={64} /></div>
              <div>{v.name}</div>
              <div className="small" style={{ fontSize: 11.5 }}>{v.recipe ? 'Homemade' : fmtQty(v.baseQty, v.unit)}</div>
            </button>
          ))}
        </div>
        <p className="small muted" style={{ marginTop: 14 }}>Each tile is a ready group, sized for the board. Adjust the amount after placing it.</p>
      </Sheet>

      <Sheet open={sheet === 'swap'} onClose={() => setSheet(null)} title="Swap for">
        {selected && it.subs.map((s) => (
          <button key={s} className="list-row" onClick={() => {
            const n = ITEMS[s];
            patchSel({ type: s, qty: n.unit === it.unit ? Math.min(n.max, Math.max(n.min, selected.qty)) : n.baseQty, style: n.styles.find((x) => x.id === selected.style)?.id || n.styles[0].id });
            setSheet(null);
            toast(`Swapped for ${n.name}. Your shopping list follows.`);
          }}>
            <div className="thumb" style={{ width: 52, height: 52, borderRadius: 26 }}><ItemIcon type={s} size={52} /></div>
            <div className="grow"><div>{ITEMS[s].name}</div>{ITEMS[s].recipe && <div className="sub">Homemade · {RECIPES[ITEMS[s].recipe].name}</div>}</div>
            <Icon name="chevron" size={18} />
          </button>
        ))}
      </Sheet>

      <Sheet open={sheet === 'board'} onClose={() => setSheet(null)} title="Choose your board">
        {Object.values(BOARDS).map((b) => (
          <button key={b.id} className="list-row" onClick={() => { if (b.id !== board) commit(items, b.id); setSheet(null); }}>
            <div className="thumb" style={{ background: `linear-gradient(135deg, ${b.tone[0]}, ${b.tone[1]})` }} />
            <div className="grow"><div>{b.name}</div><div className="sub">{b.wood}. {b.note}</div></div>
            {board === b.id && <Icon name="check" />}
          </button>
        ))}
        <DemoNote className="mt">Board sizes are shown the same until final dimensions are confirmed.</DemoNote>
      </Sheet>

      <Sheet open={sheet === 'versions'} onClose={() => setSheet(null)} title="Versions">
        <p className="small" style={{ marginTop: 0 }}>Save a version to come back to it later. Your changes are kept as you go.</p>
        {design.versions.length === 0 && <p className="body">No saved versions yet.</p>}
        {[...design.versions].reverse().map((v) => (
          <div key={v.id} className="list-row">
            <div className="thumb"><BoardView boardId={v.board} items={v.items} uid={'v-' + v.id} /></div>
            <div className="grow"><div>{v.label}</div><div className="sub">{new Date(v.at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · {v.items.length} groups</div></div>
            <Button variant="ghost" small onClick={() => { commit(v.items.map((i) => ({ ...i })), v.board); setSheet(null); toast(`${v.label} restored. Undo if you change your mind.`); }}>Restore</Button>
          </div>
        ))}
        <Button block style={{ marginTop: 16 }} onClick={() => { saveVersion(); setSheet(null); }}>Save current as a version</Button>
      </Sheet>

      <Sheet open={sheet === 'techs'} onClose={() => setSheet(null)} title="Techniques on this board">
        {[...new Set(items.map((i) => styleOf(i.type, i.style).tech))].map((tid) => (
          <button key={tid} className="list-row" onClick={() => { setSheet(null); nav.push('technique', { id: tid }); }}>
            <div className="thumb" style={{ width: 52, height: 52, borderRadius: 26 }}><ItemIcon type={TECHNIQUES[tid].demoType} style={TECHNIQUES[tid].demoStyle} size={52} /></div>
            <div className="grow"><div>{TECHNIQUES[tid].name}</div><div className="sub">{TECHNIQUES[tid].summary}</div></div>
          </button>
        ))}
        {!items.length && <p className="body">Add groups to see the techniques they use.</p>}
        <button className="link" style={{ marginTop: 14 }} onClick={() => { setSheet(null); nav.switchTab('discover', { name: 'discover', params: { seg: 'techniques' } }); }}>Browse all techniques</button>
      </Sheet>
    </div>
  );
}

