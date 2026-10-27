import { photoPiece, photoLayout } from './media.js';

// Board models and the visual library used by Designer, presentations and lists.
// Coordinates live in a 600 x 400 board space. Footprints are approximate on purpose:
// final board dimensions are not confirmed yet, so nothing here claims physical precision.

export const BOARDS = {
  'cheese-bread': {
    id: 'cheese-bread',
    name: 'Cheese & Bread',
    wood: 'Acacia',
    tone: ['#9a6644', '#7c4f33'],
    grain: '#6a4029',
    note: 'Dense and richly grained, with a depth of color built for the table.',
  },
  'fruits-veg': {
    id: 'fruits-veg',
    name: 'Fruits & Vegetables',
    wood: 'Rubberwood',
    tone: ['#dcc199', '#cdae82'],
    grain: '#b8956a',
    note: 'Light, durable, and built for volume.',
  },
  'meat-fish': {
    id: 'meat-fish',
    name: 'Meat & Fish',
    wood: 'Acacia',
    tone: ['#93603f', '#774a2f'],
    grain: '#633c26',
    note: 'Use it for cutting. For serving, most presentations start on Cheese & Bread.',
  },
};

export const BOARD_W = 600;
export const BOARD_H = 400;

export const CATEGORIES = [
  { id: 'bowls', label: 'Bowls & dips' },
  { id: 'cheese', label: 'Cheese' },
  { id: 'charcuterie', label: 'Charcuterie' },
  { id: 'produce', label: 'Fruit & vegetables' },
  { id: 'crunch', label: 'Bread & crackers' },
  { id: 'fill', label: 'Nuts & small bites' },
  { id: 'garnish', label: 'Garnish' },
];

// Layer order used to build boards. Same order the original presentations follow.
export const LAYER_ORDER = ['bowls', 'cheese', 'charcuterie', 'produce', 'crunch', 'fill', 'garnish'];

export const LAYER_COPY = {
  bowls: { title: 'Anchor the bowls', text: 'Bowls and dips go down first. They hold space and give the eye somewhere to rest.' },
  cheese: { title: 'Place the cheeses', text: 'Spread the cheeses apart so each one has its own corner of the board.' },
  charcuterie: { title: 'Fold the charcuterie', text: 'Tuck the folded meats next to the cheeses they pair with.' },
  produce: { title: 'Add fruit and vegetables', text: 'Color goes in now. Let it follow the open spaces.' },
  crunch: { title: 'Bring in the crunch', text: 'Crackers and bread lean against bigger pieces so they stay upright.' },
  fill: { title: 'Fill the gaps', text: 'Small bites close the gaps so the board feels generous.' },
  garnish: { title: 'Finish with rosemary', text: 'A few sprigs, last of all. For love and memory.' },
};

// Each item type is a ready-to-place group, never a single grape or cracker.
// fp = footprint [w, h] at baseQty in board units. Size scales gently with quantity.
export const ITEMS = {
  // Cheese
  brie: {
    name: 'Brie', cat: 'cheese', unit: 'oz', baseQty: 8, step: 2, min: 2, max: 16, fp: [112, 112],
    art: 'brie', color: '#f6ecd8', rind: '#e2d1b0',
    styles: [
      { id: 'wedges', label: 'Wedges', tech: 'brie-wedges' },
      { id: 'whole', label: 'Whole, one wedge cut', tech: 'brie-wedges' },
    ],
    subs: ['camembert'],
    tools: ['Cheese knife'],
  },
  camembert: {
    name: 'Camembert', cat: 'cheese', unit: 'oz', baseQty: 8, step: 2, min: 2, max: 16, fp: [108, 108],
    art: 'brie', color: '#f3e6cc', rind: '#dcc7a0',
    styles: [
      { id: 'wedges', label: 'Wedges', tech: 'brie-wedges' },
      { id: 'whole', label: 'Whole, one wedge cut', tech: 'brie-wedges' },
    ],
    subs: ['brie'],
    tools: ['Cheese knife'],
  },
  cheddar: {
    name: 'Aged cheddar', cat: 'cheese', unit: 'oz', baseQty: 6, step: 2, min: 2, max: 16, fp: [118, 84],
    art: 'hard', color: '#e8a64a',
    styles: [
      { id: 'triangles', label: 'Triangles', tech: 'cheese-triangles' },
      { id: 'cubes', label: 'Cubes', tech: 'cheese-cubes' },
    ],
    subs: ['manchego', 'gouda'],
    tools: ['Chef’s knife'],
  },
  manchego: {
    name: 'Manchego', cat: 'cheese', unit: 'oz', baseQty: 6, step: 2, min: 2, max: 16, fp: [118, 84],
    art: 'hard', color: '#efd9a2',
    styles: [
      { id: 'triangles', label: 'Triangles', tech: 'cheese-triangles' },
      { id: 'cubes', label: 'Cubes', tech: 'cheese-cubes' },
    ],
    subs: ['cheddar', 'gouda'],
    tools: ['Chef’s knife'],
  },
  gouda: {
    name: 'Aged gouda', cat: 'cheese', unit: 'oz', baseQty: 6, step: 2, min: 2, max: 16, fp: [118, 84],
    art: 'hard', color: '#f1c066',
    styles: [
      { id: 'triangles', label: 'Triangles', tech: 'cheese-triangles' },
      { id: 'cubes', label: 'Cubes', tech: 'cheese-cubes' },
    ],
    subs: ['cheddar', 'manchego'],
    tools: ['Chef’s knife'],
  },
  goat: {
    name: 'Goat cheese log', cat: 'cheese', unit: 'oz', baseQty: 4, step: 2, min: 2, max: 8, fp: [96, 46],
    art: 'goat', color: '#fbf8f1',
    styles: [{ id: 'rounds', label: 'Rounds', tech: 'coins-rounds' }],
    subs: [],
    tools: ['Unflavored dental floss or a thin knife'],
  },

  // Charcuterie
  prosciutto: {
    name: 'Prosciutto', cat: 'charcuterie', unit: 'oz', baseQty: 3, step: 1, min: 1, max: 8, fp: [96, 90],
    art: 'prosciutto', color: '#d8877c', fat: '#f3d6cc',
    styles: [
      { id: 'roses', label: 'Roses', tech: 'prosciutto-rose' },
      { id: 'ribbons', label: 'Ribbons', tech: 'prosciutto-ribbons' },
    ],
    subs: ['serrano'],
    tools: [],
  },
  serrano: {
    name: 'Serrano ham', cat: 'charcuterie', unit: 'oz', baseQty: 3, step: 1, min: 1, max: 8, fp: [96, 90],
    art: 'prosciutto', color: '#c46a63', fat: '#efcfc4',
    styles: [
      { id: 'roses', label: 'Roses', tech: 'prosciutto-rose' },
      { id: 'ribbons', label: 'Ribbons', tech: 'prosciutto-ribbons' },
    ],
    subs: ['prosciutto'],
    tools: [],
  },
  salami: {
    name: 'Salami', cat: 'charcuterie', unit: 'oz', baseQty: 4, step: 1, min: 2, max: 10, fp: [160, 62],
    art: 'salami', color: '#a9453f',
    styles: [
      { id: 'river', label: 'River', tech: 'salami-river' },
      { id: 'folds', label: 'Folded quarters', tech: 'salami-folds' },
    ],
    subs: ['soppressata'],
    tools: [],
  },
  soppressata: {
    name: 'Soppressata', cat: 'charcuterie', unit: 'oz', baseQty: 4, step: 1, min: 2, max: 10, fp: [160, 62],
    art: 'salami', color: '#8f3a36',
    styles: [
      { id: 'river', label: 'River', tech: 'salami-river' },
      { id: 'folds', label: 'Folded quarters', tech: 'salami-folds' },
    ],
    subs: ['salami'],
    tools: [],
  },

  // Produce
  grapes: {
    name: 'Red grapes', cat: 'produce', unit: 'oz', baseQty: 8, step: 2, min: 2, max: 16, fp: [92, 92],
    art: 'grapes', color: '#6e3049',
    styles: [{ id: 'clusters', label: 'Small clusters', tech: 'grape-clusters' }],
    subs: ['green-grapes'],
    tools: ['Kitchen scissors'],
  },
  'green-grapes': {
    name: 'Green grapes', cat: 'produce', unit: 'oz', baseQty: 8, step: 2, min: 2, max: 16, fp: [92, 92],
    art: 'grapes', color: '#a9b45c',
    styles: [{ id: 'clusters', label: 'Small clusters', tech: 'grape-clusters' }],
    subs: ['grapes'],
    tools: ['Kitchen scissors'],
  },
  figs: {
    name: 'Fresh figs', cat: 'produce', unit: 'each', baseQty: 4, step: 1, min: 1, max: 8, fp: [76, 64],
    art: 'figs', color: '#6b3a4f', flesh: '#d9707a',
    styles: [{ id: 'halved', label: 'Halved', tech: 'fig-halves' }],
    subs: ['strawberries'],
    tools: ['Paring knife'],
  },
  apple: {
    name: 'Crisp apple', cat: 'produce', unit: 'each', baseQty: 1, step: 1, min: 1, max: 3, fp: [104, 62],
    art: 'apple', color: '#b8473f', flesh: '#f6ecc9',
    styles: [{ id: 'fan', label: 'Fanned slices', tech: 'apple-fan' }],
    subs: ['pear'],
    tools: ['Paring knife', 'Small bowl with lemon water'],
  },
  pear: {
    name: 'Ripe pear', cat: 'produce', unit: 'each', baseQty: 1, step: 1, min: 1, max: 3, fp: [104, 62],
    art: 'apple', color: '#b7b25a', flesh: '#f7f0d2',
    styles: [{ id: 'fan', label: 'Fanned slices', tech: 'apple-fan' }],
    subs: ['apple'],
    tools: ['Paring knife', 'Small bowl with lemon water'],
  },
  strawberries: {
    name: 'Strawberries', cat: 'produce', unit: 'oz', baseQty: 6, step: 2, min: 2, max: 16, fp: [74, 70],
    art: 'pile', color: '#cf3f45', shape: 'berry',
    styles: [{ id: 'pile', label: 'Loose pile', tech: 'filling-gaps' }],
    subs: ['grapes'],
    tools: [],
  },
  'dried-apricots': {
    name: 'Dried apricots', cat: 'produce', unit: 'oz', baseQty: 3, step: 1, min: 1, max: 8, fp: [64, 56],
    art: 'pile', color: '#e39a45', shape: 'round',
    styles: [{ id: 'pile', label: 'Loose pile', tech: 'filling-gaps' }],
    subs: ['figs'],
    tools: [],
  },
  carrots: {
    name: 'Carrots', cat: 'produce', unit: 'oz', baseQty: 8, step: 2, min: 2, max: 16, fp: [124, 70],
    art: 'batons', color: '#e8833a',
    styles: [{ id: 'batons', label: 'Batons', tech: 'crudite-batons' }],
    subs: ['celery'],
    tools: ['Vegetable peeler', 'Chef’s knife'],
  },
  celery: {
    name: 'Celery', cat: 'produce', unit: 'stalks', baseQty: 3, step: 1, min: 1, max: 6, fp: [124, 70],
    art: 'batons', color: '#a9c27a',
    styles: [{ id: 'batons', label: 'Batons', tech: 'crudite-batons' }],
    subs: ['carrots'],
    tools: ['Chef’s knife'],
  },
  'bell-pepper': {
    name: 'Bell pepper', cat: 'produce', unit: 'each', baseQty: 1, step: 1, min: 1, max: 3, fp: [116, 66],
    art: 'batons', color: '#e2b23a', alt: '#d24c3c',
    styles: [{ id: 'strips', label: 'Strips', tech: 'crudite-batons' }],
    subs: ['carrots'],
    tools: ['Chef’s knife'],
  },
  cucumber: {
    name: 'Mini cucumbers', cat: 'produce', unit: 'each', baseQty: 2, step: 1, min: 1, max: 6, fp: [92, 80],
    art: 'cucumber', color: '#5f7d45', flesh: '#dfe8c2',
    styles: [
      { id: 'rounds', label: 'Rounds', tech: 'coins-rounds' },
      { id: 'ribbons', label: 'Ribbons', tech: 'cucumber-ribbons' },
    ],
    subs: [],
    tools: ['Chef’s knife', 'Vegetable peeler'],
  },
  tomatoes: {
    name: 'Cherry tomatoes', cat: 'produce', unit: 'cup', baseQty: 1, step: 0.5, min: 0.5, max: 3, fp: [76, 72],
    art: 'pile', color: '#d9452f', shape: 'round',
    styles: [{ id: 'pile', label: 'Loose pile', tech: 'filling-gaps' }],
    subs: ['strawberries'],
    tools: [],
  },

  // Crunch
  crackers: {
    name: 'Crackers', cat: 'crunch', unit: 'pieces', baseQty: 16, step: 4, min: 4, max: 40, fp: [138, 54],
    art: 'crackers', color: '#e2c08a',
    styles: [
      { id: 'fan', label: 'Fanned line', tech: 'cracker-fan' },
      { id: 'stack', label: 'Short stacks', tech: 'cracker-fan' },
    ],
    subs: ['seed-crackers'],
    tools: [],
  },
  'seed-crackers': {
    name: 'Seed crackers (gluten free)', cat: 'crunch', unit: 'pieces', baseQty: 16, step: 4, min: 4, max: 40, fp: [138, 54],
    art: 'crackers', color: '#c9a56d', seeded: true,
    styles: [
      { id: 'fan', label: 'Fanned line', tech: 'cracker-fan' },
      { id: 'stack', label: 'Short stacks', tech: 'cracker-fan' },
    ],
    subs: ['crackers'],
    tools: [],
  },
  baguette: {
    name: 'Baguette', cat: 'crunch', unit: 'loaf', baseQty: 0.5, step: 0.5, min: 0.5, max: 2, fp: [146, 60],
    art: 'baguette', color: '#d9a35f', crumb: '#f4e2bd',
    styles: [{ id: 'slices', label: 'Thin slices', tech: 'baguette-slices' }],
    subs: [],
    tools: ['Serrated bread knife'],
  },

  // Fill
  walnuts: {
    name: 'Rosemary Honey Walnuts', cat: 'fill', unit: 'cup', baseQty: 0.5, step: 0.25, min: 0.25, max: 1.5, fp: [72, 62],
    art: 'pile', color: '#9b6a3e', shape: 'nut', recipe: 'rosemary-walnuts',
    styles: [{ id: 'pile', label: 'Loose pile', tech: 'filling-gaps' }],
    subs: ['almonds'],
    tools: [],
  },
  almonds: {
    name: 'Marcona almonds', cat: 'fill', unit: 'cup', baseQty: 0.5, step: 0.25, min: 0.25, max: 1.5, fp: [72, 62],
    art: 'pile', color: '#d6b07a', shape: 'almond',
    styles: [{ id: 'pile', label: 'Loose pile', tech: 'filling-gaps' }],
    subs: ['walnuts'],
    tools: [],
  },

  // Bowls & dips. Each bowl brings its own serveware into the list.
  'bowl-jam': {
    name: 'Fig & Rosemary Jam', cat: 'bowls', unit: 'cup', baseQty: 0.25, step: 0.25, min: 0.25, max: 1, fp: [62, 62],
    art: 'bowl', color: '#7b2f3a', recipe: 'fig-jam', serveware: 'Small ramekin (3 in)',
    styles: [{ id: 'bowl', label: 'In a small bowl', tech: 'bowls-first' }],
    subs: ['bowl-honey'],
    tools: ['Small spoon'],
  },
  'bowl-honey': {
    name: 'Honey', cat: 'bowls', unit: 'tbsp', baseQty: 3, step: 1, min: 1, max: 8, fp: [52, 52],
    art: 'bowl', color: '#e0a73a', serveware: 'Mini bowl (2 in)', shop: 'honey',
    styles: [{ id: 'bowl', label: 'In a small bowl', tech: 'bowls-first' }],
    subs: ['bowl-jam'],
    tools: ['Honey dipper or small spoon'],
  },
  'bowl-feta': {
    name: 'Whipped Feta with Honey', cat: 'bowls', unit: 'cup', baseQty: 0.75, step: 0.25, min: 0.25, max: 2, fp: [84, 84],
    art: 'bowl', color: '#f7f2e6', drizzle: '#e0a73a', recipe: 'whipped-feta', serveware: 'Shallow bowl (4 in)',
    styles: [
      { id: 'bowl', label: 'In a shallow bowl', tech: 'bowls-first' },
      { id: 'swoosh', label: 'Spoon swoosh on parchment', tech: 'spoon-swoosh' },
    ],
    subs: ['bowl-hummus'],
    tools: ['Small spoon'],
  },
  'bowl-hummus': {
    name: 'Lemon Herb Hummus', cat: 'bowls', unit: 'cup', baseQty: 1, step: 0.25, min: 0.5, max: 2, fp: [98, 98],
    art: 'bowl', color: '#e8d2a4', drizzle: '#a89a3e', recipe: 'lemon-hummus', serveware: 'Medium bowl (5 in)',
    styles: [
      { id: 'bowl', label: 'In a bowl', tech: 'bowls-first' },
      { id: 'swoosh', label: 'Spoon swoosh on parchment', tech: 'spoon-swoosh' },
    ],
    subs: ['bowl-feta'],
    tools: ['Small spoon'],
  },
  'bowl-olives': {
    name: 'Citrus Marinated Olives', cat: 'bowls', unit: 'cup', baseQty: 0.5, step: 0.25, min: 0.25, max: 1.5, fp: [70, 70],
    art: 'bowl', color: '#5d6a33', olives: true, recipe: 'citrus-olives', serveware: 'Small bowl (3.5 in)',
    styles: [{ id: 'bowl', label: 'In a small bowl', tech: 'bowls-first' }],
    subs: [],
    tools: ['Small bowl for pits'],
  },

  // Garnish
  rosemary: {
    name: 'Fresh rosemary', cat: 'garnish', unit: 'sprigs', baseQty: 3, step: 1, min: 1, max: 8, fp: [34, 86],
    art: 'rosemary', color: '#6f7a5a',
    styles: [{ id: 'sprig', label: 'Whole sprigs', tech: 'herb-garnish' }],
    subs: [],
    tools: [],
  },
};

// Approximate footprint in board units for an illustrated group.
export function baseSize(type, qty) {
  const it = ITEMS[type];
  const k = Math.max(0.62, Math.min(1.55, Math.sqrt(qty / it.baseQty)));
  if (it.art === 'rosemary') return [it.fp[0], it.fp[1]];
  return [it.fp[0] * k, it.fp[1] * k];
}

// Size of a group as drawn: photographic pieces keep their own proportions inside the same footprint.
export function sizeFor(type, qty, style) {
  const it = ITEMS[type];
  const piece = photoPiece(type, style || it.styles[0].id);
  const base = baseSize(type, qty);
  if (!piece) return base;
  const l = photoLayout(piece, qty, base);
  return [l.w, l.h];
}

export function styleOf(type, styleId) {
  const it = ITEMS[type];
  return it.styles.find((s) => s.id === styleId) || it.styles[0];
}
