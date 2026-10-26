import { useStore } from './store.jsx';
import { uid, presentationItems, communityItems } from './lib.js';
import { PRESENTATIONS } from './data/presentations.js';
import { COMMUNITY } from './data/community.js';
import { RECIPES } from './data/recipes.js';
import { ITEMS, BOARDS } from './data/catalog.js';

const now = () => new Date().toISOString();
const fresh = (items) => items.map((it) => ({ ...it, uid: uid('it') }));

export function useActions() {
  const { updateUser, user } = useStore();

  // Ids are generated outside the state updaters: React may run updaters later, during render.
  const newDesign = (u, d, id) => {
    u.designs[id] = { id, versions: [], createdAt: now(), updatedAt: now(), ...d };
    u.recent = { kind: 'design', id, at: now() };
    return id;
  };

  return {
    toggleSave(kind, id) {
      const was = user.saved.some((s) => s.kind === kind && s.id === id);
      updateUser((u) => {
        const i = u.saved.findIndex((s) => s.kind === kind && s.id === id);
        if (i >= 0) u.saved.splice(i, 1);
        else u.saved.unshift({ kind, id, at: now() });
      });
      return !was;
    },
    setRecent(kind, id, extra = {}) {
      updateUser((u) => { u.recent = { kind, id, at: now(), ...extra }; });
    },
    fromPresentation(presId, compId) {
      const p = PRESENTATIONS[presId];
      const comp = p.compositions.find((c) => c.id === compId) || p.compositions[0];
      const id = uid('d');
      updateUser((u) => {
        newDesign(u, {
          name: `${p.name} · My version`,
          board: p.board,
          kind: 'modified',
          origin: { kind: 'presentation', id: presId, compositionId: comp.id, name: p.name, compositionName: comp.name },
          items: fresh(presentationItems(presId, comp.id)),
        }, id);
      });
      return id;
    },
    fromCommunity(cid) {
      const c = COMMUNITY[cid];
      const id = uid('d');
      updateUser((u) => {
        newDesign(u, {
          name: `${c.name} · My version`,
          board: c.board,
          kind: 'modified',
          origin: { kind: 'community', id: cid, name: c.name, home: c.home },
          items: fresh(communityItems(cid)),
        }, id);
      });
      return id;
    },
    fromShared(payload) {
      const id = uid('d');
      updateUser((u) => {
        newDesign(u, {
          name: `${payload.n} · My version`,
          board: payload.b,
          kind: 'modified',
          origin: { kind: 'shared', name: payload.n, home: payload.h },
          items: payload.i.map((p) => ({ uid: uid('it'), type: p[0], qty: p[1], x: p[2], y: p[3], r: p[4], style: p[5] })),
        }, id);
      });
      return id;
    },
    copyDesign(did) {
      const id = uid('d');
      updateUser((u) => {
        const d = u.designs[did];
        newDesign(u, {
          name: d.name.replace(/ · (My version|Copy)$/, '') + ' · Copy',
          board: d.board,
          kind: d.kind === 'scratch' ? 'scratch' : 'modified',
          origin: d.origin ? { ...d.origin } : { kind: 'design', id: did, name: d.name },
          items: fresh(d.items),
        }, id);
      });
      return id;
    },
    scratch(board = 'cheese-bread') {
      const id = uid('d');
      updateUser((u) => {
        const count = Object.values(u.designs).filter((d) => d.kind === 'scratch').length + 1;
        newDesign(u, { name: `My board ${count}`, board, kind: 'scratch', origin: null, items: [] }, id);
      });
      return id;
    },
    addRecipe(rid, designId, style) {
      const r = RECIPES[rid];
      const it = ITEMS[r.item];
      const id = designId || uid('d');
      updateUser((u) => {
        if (!designId) {
          const count = Object.values(u.designs).filter((d) => d.kind === 'scratch').length + 1;
          newDesign(u, { name: `My board ${count}`, board: 'cheese-bread', kind: 'scratch', origin: null, items: [] }, id);
        }
        const d = u.designs[id];
        const taken = d.items.length;
        d.items.push({ uid: uid('it'), type: r.item, qty: it.baseQty, x: 300 + ((taken * 47) % 160) - 80, y: 200 + ((taken * 31) % 120) - 60, r: 0, style: style || it.styles[0].id });
        d.updatedAt = now();
        u.recent = { kind: 'design', id, at: now() };
      });
      return id;
    },
    ensureList(source) {
      const id = 'l-' + source.kind + '-' + source.id + (source.compositionId ? '-' + source.compositionId : '');
      updateUser((u) => {
        if (!u.lists[id]) u.lists[id] = { id, source, have: {}, createdAt: now() };
        else u.lists[id].source = source;
      });
      return id;
    },
    markMade(entry) {
      const id = uid('m');
      updateUser((u) => { u.made.unshift({ id, at: now(), ...entry }); });
      return id;
    },
    addReview(review) {
      updateUser((u) => { u.reviews.unshift({ id: uid('r'), at: now(), ...review }); });
    },
    setNote(key, patch) {
      updateUser((u) => { u.notes[key] = { text: '', photos: [], ...(u.notes[key] || {}), ...patch }; });
    },
  };
}

export function boardName(id) { return BOARDS[id]?.name || ''; }
