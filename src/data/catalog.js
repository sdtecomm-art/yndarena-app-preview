// Board models and the visual library used by Designer, presentations and lists.
// Board coordinates are millimetres on the 330 × 240 mm board (see physical.js). Physical sizes of each group
// live in physical.js; `fp` below is only the footprint of the old illustrations, on the legacy 600 × 400 canvas.

export const BOARDS = {
  'cheese-bread': {
    id: 'cheese-bread',
    name: 'Cheese & Bread',
    wood: 'Acacia',
    tone: ['#9a6644', '#7c4f33'],
    grain: '#6a4029',
    tint: .5, // how much of the tone is laid over the generic surface texture
    note: 'For cheese, bread, pasta and flatbreads.',
    serves: 'Cheese, bread, pasta and flatbread',
  },
  'fruits-veg': {
    id: 'fruits-veg',
    name: 'Fruits & Vegetables',
    wood: 'Rubberwood',
    tone: ['#dcc199', '#cdae82'],
    grain: '#b8956a',
    tint: .55, // how much of the tone is laid over the generic surface texture
    note: 'For fruit, vegetables and dips.',
    serves: 'Fruit and vegetables',
  },
  'meat-fish': {
    id: 'meat-fish',
    name: 'Meat & Fish',
    wood: 'Acacia',
    tone: ['#93603f', '#774a2f'],
    grain: '#633c26',
    tint: .5, // how much of the tone is laid over the generic surface texture
    note: 'For cooked chicken, meat and fish, sliced or served. Prep raw meat on a separate board.',
    serves: 'Chicken, meat and fish',
  },
};

export { BOARD } from './physical.js';

export const CATEGORIES = [
  { id: 'mains', label: 'Mains' },
  { id: 'sides', label: 'Sides & salads' },
  { id: 'bowls', label: 'Bowls & dips' },
  { id: 'cheese', label: 'Cheese' },
  { id: 'charcuterie', label: 'Charcuterie' },
  { id: 'produce', label: 'Fruit & vegetables' },
  { id: 'crunch', label: 'Bread & crackers' },
  { id: 'fill', label: 'Nuts & small bites' },
  { id: 'garnish', label: 'Garnish' },
];

// Layer order used to build boards. Same order the original presentations follow.
export const LAYER_ORDER = ['bowls', 'sides', 'mains', 'cheese', 'charcuterie', 'produce', 'crunch', 'fill', 'garnish'];

export const LAYER_COPY = {
  sides: { title: 'Set the sides', text: 'Bowls and sides go down first, so the main has room around them.' },
  mains: { title: 'Bring in the main', text: 'Place it where everyone can reach it, with a little space to lift each piece.' },
  bowls: { title: 'Anchor the bowls', text: 'Bowls and dips go down first. They hold space and give the eye somewhere to rest.' },
  cheese: { title: 'Place the cheeses', text: 'Spread the cheeses apart so each one has its own corner of the board.' },
  charcuterie: { title: 'Fold the charcuterie', text: 'Tuck the folded meats next to the cheeses they pair with.' },
  produce: { title: 'Add fruit and vegetables', text: 'Color goes in now. Let it follow the open spaces.' },
  crunch: { title: 'Bring in the crunch', text: 'Crackers and bread lean against bigger pieces so they stay upright.' },
  fill: { title: 'Fill the gaps', text: 'Small bites close the gaps so the board feels generous.' },
  garnish: { title: 'Finish the board', text: 'A last touch of green or a wedge of lemon, if you like.' },
};

// Each item type is a ready-to-place group, never a single grape or cracker.
// Everyday meal components (cat 'mains' and 'sides') are prepared food: cooked your usual way or store-bought.
// Their tech is null (no technique to learn) and shop lists what to buy for baseQty, from everyday-meals.json;
// a null qty means the source gives no amount ("a few", "to taste").
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

  // Mains, ready to serve
  'gnocchi-bowl': {
    name: 'Gnocchi, tomato & basil', cat: 'mains', unit: 'lb', baseQty: 1, step: 0.5, min: 0.5, max: 3, fp: [150, 150],
    art: 'bowl', color: '#c4472f', serveware: 'Serving bowl',
    styles: [{ id: 'bowl', label: 'In a bowl', tech: null }],
    subs: [], tools: ['Serving spoon'],
    shop: [{ key: 'gnocchi', name: 'Potato gnocchi, store-bought', qty: 1, unit: 'lb' }, { key: 'tomato-sauce', name: 'Tomato sauce', qty: 1, unit: 'cup' }, { key: 'basil', name: 'Fresh basil', qty: null }],
  },
  'lemon-chicken': {
    name: 'Cooked chicken breasts', cat: 'mains', unit: 'each', baseQty: 2, step: 1, min: 1, max: 6, fp: [110, 80],
    art: 'pile', color: '#d9a35f', shape: 'round',
    styles: [{ id: 'sliced', label: 'Sliced', tech: null }],
    subs: [], tools: [],
    shop: [{ key: 'chicken-breast', name: 'Chicken breasts, cooked your usual way', qty: 2, unit: 'each' }],
  },
  steak: {
    name: 'Cooked steak', cat: 'mains', unit: 'each', baseQty: 2, step: 1, min: 1, max: 6, fp: [110, 80],
    art: 'pile', color: '#8a4a36', shape: 'round',
    styles: [{ id: 'sliced', label: 'Sliced', tech: null }],
    subs: [], tools: ['Steak knives'],
    shop: [{ key: 'steak', name: 'Steaks, cooked your usual way', qty: 2, unit: 'each' }],
  },
  salmon: {
    name: 'Cooked salmon', cat: 'mains', unit: 'each', baseQty: 2, step: 1, min: 1, max: 6, fp: [100, 70],
    art: 'pile', color: '#e08a63', shape: 'round',
    styles: [{ id: 'fillet', label: 'Fillets', tech: null }],
    subs: [], tools: ['Fish server or spatula'],
    shop: [{ key: 'salmon', name: 'Salmon portions, cooked', qty: 2, unit: 'each' }],
  },
  'chicken-wraps': {
    name: 'Chicken wraps', cat: 'mains', unit: 'each', baseQty: 2, step: 1, min: 1, max: 6, fp: [120, 80],
    art: 'baguette', color: '#e6d3ad', crumb: '#f4e2bd',
    styles: [{ id: 'halves', label: 'Cut in halves', tech: null }],
    subs: [], tools: [],
    shop: [
      { key: 'tortillas', name: 'Flour tortillas', qty: 2, unit: 'each' },
      { key: 'cooked-chicken', name: 'Cooked chicken, for the wraps', qty: null },
      { key: 'lettuce', name: 'Lettuce, for the filling', qty: null },
      { key: 'tomato', name: 'Tomato, for the filling', qty: null },
      { key: 'yogurt-dressing', name: 'Plain yogurt or your usual dressing, optional', qty: null },
    ],
  },
  flatbread: {
    name: 'Small tomato & mozzarella flatbread', cat: 'mains', unit: 'each', baseQty: 1, step: 1, min: 1, max: 4, fp: [170, 170],
    art: 'baguette', color: '#d9a35f', crumb: '#f1d5a8',
    styles: [{ id: 'pieces', label: 'Cut in four', tech: null }],
    subs: [], tools: ['Pizza cutter or knife'],
    shop: [
      { key: 'flatbread-base', name: 'Small ready-made flatbread bases', qty: 1, unit: 'each' },
      { key: 'tomato-sauce', name: 'Tomato sauce', qty: 0.25, unit: 'cup' },
      { key: 'mozzarella', name: 'Mozzarella', qty: 2, unit: 'oz' },
      { key: 'olive-oil', name: 'Olive oil', qty: null },
    ],
  },

  // Sides, ready to serve. The four salads are simple and optional: choose, swap or remove them.
  potatoes: {
    name: 'Roasted potatoes', cat: 'sides', unit: 'cup', baseQty: 2, step: 0.5, min: 0.5, max: 6, fp: [130, 112],
    art: 'pile', color: '#d9a35f', shape: 'round',
    styles: [{ id: 'wedges', label: 'Wedges', tech: null }],
    subs: ['rice'], tools: [],
    shop: [{ key: 'potatoes', name: 'Potatoes, roasted your usual way', qty: 2, unit: 'cup' }],
  },
  'green-beans': {
    name: 'Green beans', cat: 'sides', unit: 'cup', baseQty: 1, step: 0.5, min: 0.5, max: 4, fp: [124, 96],
    art: 'batons', color: '#5f7d45',
    styles: [{ id: 'cooked', label: 'Cooked', tech: null }],
    subs: ['side-tomato-basil', 'side-beet-carrot'], tools: [],
    shop: [{ key: 'green-beans', name: 'Green beans, simply cooked', qty: 1, unit: 'cup' }],
  },
  rice: {
    name: 'Cooked rice', cat: 'sides', unit: 'cup', baseQty: 1.5, step: 0.5, min: 0.5, max: 4, fp: [112, 112],
    art: 'bowl', color: '#f4efe4', serveware: 'Small bowl for the rice',
    styles: [{ id: 'bowl', label: 'In a bowl', tech: null }],
    subs: ['potatoes'], tools: ['Serving spoon'],
    shop: [{ key: 'rice', name: 'Rice, cooked', qty: 1.5, unit: 'cup' }],
  },
  'side-tomato-avocado': {
    name: 'Tomato & Avocado Salad', cat: 'sides', unit: 'servings', baseQty: 2, step: 1, min: 1, max: 6, fp: [112, 112],
    art: 'bowl', color: '#c4472f', serveware: 'Small salad bowl', side: 'tomato-avocado',
    styles: [{ id: 'bowl', label: 'In a bowl', tech: null }],
    subs: ['side-beet-carrot', 'side-cabbage-carrot', 'side-tomato-basil'], tools: ['Salad spoon'],
    shop: [{ key: 'tomato', name: 'Tomatoes', qty: 2, unit: 'each' }, { key: 'avocado', name: 'Ripe avocado', qty: 1, unit: 'each' }, { key: 'olive-oil', name: 'Olive oil', qty: null }, { key: 'lemon', name: 'Lemon, optional', qty: null }],
  },
  'side-beet-carrot': {
    name: 'Beet & Carrot Salad', cat: 'sides', unit: 'servings', baseQty: 2, step: 1, min: 1, max: 6, fp: [112, 112],
    art: 'bowl', color: '#8a2a4a', serveware: 'Small salad bowl', side: 'beet-carrot',
    styles: [{ id: 'bowl', label: 'In a bowl', tech: null }],
    subs: ['side-tomato-avocado', 'side-cabbage-carrot', 'side-tomato-basil'], tools: ['Salad spoon'],
    shop: [{ key: 'beets', name: 'Small cooked beets (prepared is fine)', qty: 2, unit: 'each' }, { key: 'carrot', name: 'Carrot', qty: 1, unit: 'each' }, { key: 'olive-oil', name: 'Olive oil', qty: null }, { key: 'lemon', name: 'Lemon', qty: null }],
  },
  'side-cabbage-carrot': {
    name: 'Cabbage & Carrot Slaw', cat: 'sides', unit: 'servings', baseQty: 2, step: 1, min: 1, max: 6, fp: [112, 112],
    art: 'bowl', color: '#d8d6a8', serveware: 'Small salad bowl', side: 'cabbage-carrot',
    styles: [{ id: 'bowl', label: 'In a bowl', tech: null }],
    subs: ['side-tomato-avocado', 'side-beet-carrot', 'side-tomato-basil'], tools: ['Salad spoon'],
    shop: [{ key: 'cabbage', name: 'Cabbage, finely sliced', qty: 1, unit: 'cup' }, { key: 'carrot', name: 'Carrot', qty: 1, unit: 'each' }, { key: 'olive-oil', name: 'Olive oil', qty: null }, { key: 'lemon', name: 'Lemon', qty: null }],
  },
  'side-tomato-basil': {
    name: 'Tomato & Basil', cat: 'sides', unit: 'cup', baseQty: 1, step: 0.5, min: 0.5, max: 3, fp: [104, 104],
    art: 'bowl', color: '#d9452f', serveware: 'Small bowl', side: 'tomato-basil',
    styles: [{ id: 'bowl', label: 'In a bowl', tech: null }],
    subs: ['side-tomato-avocado', 'side-beet-carrot', 'side-cabbage-carrot'], tools: [],
    shop: [{ key: 'cherry-tomatoes', name: 'Cherry tomatoes', qty: 1, unit: 'cup' }, { key: 'basil', name: 'Fresh basil', qty: null }, { key: 'olive-oil', name: 'Olive oil', qty: null }],
  },
  'rustic-bread': {
    name: 'Rustic bread', cat: 'crunch', unit: 'servings', baseQty: 2, step: 1, min: 1, max: 6, fp: [140, 100],
    art: 'baguette', color: '#c9955a', crumb: '#f1dfbd',
    styles: [{ id: 'slices', label: 'Slices', tech: null }],
    subs: ['baguette'], tools: ['Bread knife'],
    shop: [{ key: 'rustic-bread', name: 'Rustic bread, a few slices', qty: null }],
  },

  // Catalog expansion (2026-10-28). Prepared your usual way or store-bought. Photos pending (see review panel):
  // until they exist, every view shows the physical footprint with its name, never a drawing of the food.
  'spaghetti-bowl': {
    name: 'Spaghetti marinara', short: 'Spaghetti', cat: 'mains', unit: 'servings', baseQty: 2, step: 1, min: 1, max: 6, fp: [150, 150],
    art: 'bowl', color: '#b8432c', serveware: 'Serving bowl (7 in)', pending: true,
    styles: [{ id: 'bowl', label: 'In a bowl', tech: 'portion-bowl' }],
    subs: [], tools: ['Pasta tongs'],
    shop: [{ key: 'spaghetti', name: 'Spaghetti', qty: 8, unit: 'oz' }, { key: 'marinara', name: 'Marinara sauce, jarred or your own', qty: 1.5, unit: 'cup' }],
  },
  'garlic-bread': {
    name: 'Garlic bread', cat: 'crunch', unit: 'pieces', baseQty: 4, step: 2, min: 2, max: 8, fp: [130, 90],
    art: 'baguette', color: '#d9a35f', crumb: '#f1dfbd', pending: true,
    styles: [{ id: 'slices', label: 'Slices', tech: null }],
    subs: ['rustic-bread'], tools: ['Bread knife'],
    shop: [{ key: 'garlic-bread', name: 'Garlic bread, store-bought or homemade', qty: 4, unit: 'pieces' }],
  },
  parmesan: {
    name: 'Grated parmesan', short: 'Parmesan', cat: 'bowls', unit: 'cup', baseQty: 0.25, step: 0.25, min: 0.25, max: 1, fp: [52, 52],
    art: 'bowl', color: '#f1e3bf', serveware: 'Mini bowl (2 in)', pending: true,
    styles: [{ id: 'bowl', label: 'In a mini bowl', tech: 'bowls-first' }],
    subs: [], tools: ['Small spoon'],
    shop: [{ key: 'parmesan', name: 'Parmesan, grated', qty: 0.25, unit: 'cup' }],
  },
  'ravioli-plate': {
    name: 'Cheese ravioli, tomato & basil', short: 'Cheese ravioli', cat: 'mains', unit: 'servings', baseQty: 2, step: 1, min: 1, max: 4, fp: [150, 150],
    art: 'bowl', color: '#c4472f', serveware: 'Shallow pasta bowl (7 in)', pending: true,
    styles: [{ id: 'plate', label: 'In a shallow bowl', tech: 'portion-bowl' }],
    subs: [], tools: ['Slotted spoon'],
    shop: [{ key: 'ravioli', name: 'Cheese ravioli, fresh or frozen', qty: 18, unit: 'oz' }, { key: 'tomato-sauce', name: 'Tomato sauce', qty: 1, unit: 'cup' }],
  },
  'risotto-bowl': {
    name: 'Creamy mushroom risotto', short: 'Mushroom risotto', cat: 'mains', unit: 'servings', baseQty: 2, step: 1, min: 1, max: 4, fp: [140, 140],
    art: 'bowl', color: '#d9c7a1', serveware: 'Serving bowl (6 in)', pending: true,
    styles: [{ id: 'bowl', label: 'In a bowl', tech: 'portion-bowl' }],
    subs: [], tools: ['Serving spoon'],
    shop: [{ key: 'arborio', name: 'Arborio rice, or a ready-made mushroom risotto', qty: 1, unit: 'cup' }, { key: 'mushrooms', name: 'Mushrooms', qty: 8, unit: 'oz' }, { key: 'broth', name: 'Vegetable or chicken broth', qty: 4, unit: 'cup' }],
  },
  'bbq-sliders': {
    name: 'BBQ chicken sliders', cat: 'mains', unit: 'each', baseQty: 4, step: 1, min: 2, max: 8, fp: [130, 130],
    art: 'pile', color: '#a8582f', shape: 'round', pending: true,
    styles: [{ id: 'sliders', label: 'Sliders', tech: 'slider-assembly' }],
    subs: [], tools: ['Small skewers or picks, optional'],
    shop: [{ key: 'slider-buns', name: 'Slider buns', qty: 4, unit: 'each' }, { key: 'cooked-chicken', name: 'Cooked chicken, shredded', qty: 1.5, unit: 'cup' }, { key: 'bbq-sauce', name: 'BBQ sauce', qty: 0.33, unit: 'cup' }],
  },
  pickles: {
    name: 'Pickle chips', short: 'Pickles', cat: 'bowls', unit: 'cup', baseQty: 0.5, step: 0.25, min: 0.25, max: 1, fp: [62, 62],
    art: 'bowl', color: '#8f9b45', serveware: 'Small ramekin (3 in)', pending: true,
    styles: [{ id: 'bowl', label: 'In a small bowl', tech: 'bowls-first' }],
    subs: [], tools: ['Small fork'],
    shop: [{ key: 'pickles', name: 'Pickle chips', qty: 0.5, unit: 'cup' }],
  },
  'creamy-coleslaw': {
    name: 'Creamy coleslaw', cat: 'sides', unit: 'servings', baseQty: 2, step: 1, min: 1, max: 6, fp: [112, 112],
    art: 'bowl', color: '#e8e2c4', serveware: 'Small salad bowl', pending: true,
    styles: [{ id: 'bowl', label: 'In a bowl', tech: null }],
    subs: ['side-cabbage-carrot'], tools: ['Salad spoon'],
    shop: [{ key: 'coleslaw', name: 'Coleslaw, deli or homemade', qty: 1.5, unit: 'cup' }],
  },
  'grilled-cheese': {
    name: 'Grilled cheese', cat: 'mains', unit: 'each', baseQty: 2, step: 1, min: 1, max: 4, fp: [120, 100],
    art: 'baguette', color: '#d9a35f', crumb: '#f2c45a', pending: true,
    styles: [{ id: 'triangles', label: 'Cut in triangles', tech: 'sandwich-triangles' }],
    subs: [], tools: ['Serrated knife'],
    shop: [{ key: 'sandwich-bread', name: 'Sandwich bread', qty: 4, unit: 'slices' }, { key: 'cheddar-slices', name: 'Cheddar or American cheese slices', qty: 4, unit: 'slices' }, { key: 'butter', name: 'Butter', qty: null }],
  },
  'tomato-soup': {
    name: 'Tomato soup', cat: 'sides', unit: 'servings', baseQty: 2, step: 1, min: 1, max: 4, fp: [128, 128],
    art: 'bowl', color: '#c9432e', serveware: 'Soup bowl (5 in)', pending: true,
    styles: [{ id: 'bowl', label: 'In soup bowls', tech: null }],
    subs: [], tools: ['Soup spoons'],
    shop: [{ key: 'tomato-soup', name: 'Tomato soup, carton or homemade', qty: 2, unit: 'cup' }],
  },
  quesadilla: {
    name: 'Cheese quesadillas', cat: 'mains', unit: 'each', baseQty: 2, step: 1, min: 1, max: 4, fp: [150, 100],
    art: 'baguette', color: '#e3b46a', crumb: '#f6d77a', pending: true,
    styles: [{ id: 'wedges', label: 'Cut in triangles', tech: 'sandwich-triangles' }],
    subs: [], tools: ['Pizza cutter or knife'],
    shop: [{ key: 'tortillas-8in', name: 'Flour tortillas (8 in)', qty: 2, unit: 'each' }, { key: 'shredded-cheese', name: 'Shredded cheese', qty: 1.5, unit: 'cup' }],
  },
  salsa: {
    name: 'Salsa', cat: 'bowls', unit: 'cup', baseQty: 0.5, step: 0.25, min: 0.25, max: 1, fp: [62, 62],
    art: 'bowl', color: '#c4472f', serveware: 'Small ramekin (3 in)', pending: true,
    styles: [{ id: 'bowl', label: 'In a small bowl', tech: 'bowls-first' }],
    subs: [], tools: ['Small spoon'],
    shop: [{ key: 'salsa', name: 'Salsa, jarred or fresh', qty: 0.5, unit: 'cup' }],
  },
  'sour-cream': {
    name: 'Sour cream', short: 'Sour cream', cat: 'bowls', unit: 'cup', baseQty: 0.5, step: 0.25, min: 0.25, max: 1, fp: [62, 62],
    art: 'bowl', color: '#f7f3ea', serveware: 'Small ramekin (3 in)', pending: true,
    styles: [{ id: 'bowl', label: 'In a small bowl', tech: 'bowls-first' }],
    subs: [], tools: ['Small spoon'],
    shop: [{ key: 'sour-cream', name: 'Sour cream', qty: 0.5, unit: 'cup' }],
  },
  'mac-cheese': {
    name: 'Mac & cheese', cat: 'mains', unit: 'servings', baseQty: 2, step: 1, min: 1, max: 4, fp: [150, 150],
    art: 'bowl', color: '#f0b440', serveware: 'Serving bowl (7 in)', pending: true,
    styles: [{ id: 'bowl', label: 'In a bowl', tech: 'portion-bowl' }],
    subs: [], tools: ['Serving spoon'],
    shop: [{ key: 'mac-cheese', name: 'Mac & cheese, boxed, deli or your own', qty: 2, unit: 'servings' }],
  },
  broccoli: {
    name: 'Broccoli florets', cat: 'sides', unit: 'cup', baseQty: 1.5, step: 0.5, min: 0.5, max: 3, fp: [100, 80],
    art: 'pile', color: '#4f7a3a', shape: 'round', pending: true,
    styles: [{ id: 'florets', label: 'Florets', tech: null }],
    subs: ['green-beans'], tools: [],
    shop: [{ key: 'broccoli', name: 'Broccoli, simply cooked', qty: 1.5, unit: 'cup' }],
  },
  'pretzel-bites': {
    name: 'Soft pretzel bites', cat: 'crunch', unit: 'cup', baseQty: 2, step: 1, min: 1, max: 6, fp: [130, 104],
    art: 'pile', color: '#8a5a2f', shape: 'round', pending: true,
    styles: [{ id: 'pile', label: 'Loose pile', tech: 'filling-gaps' }],
    subs: [], tools: ['Small tongs or picks'],
    shop: [{ key: 'pretzel-bites', name: 'Soft pretzel bites, frozen or bakery', qty: 2, unit: 'cup' }],
  },
  mustard: {
    name: 'Mustard dip', short: 'Mustard', cat: 'bowls', unit: 'cup', baseQty: 0.5, step: 0.25, min: 0.25, max: 1, fp: [62, 62],
    art: 'bowl', color: '#d8a52c', serveware: 'Small ramekin (3 in)', pending: true,
    styles: [{ id: 'bowl', label: 'In a small bowl', tech: 'bowls-first' }],
    subs: [], tools: ['Small spoon'],
    shop: [{ key: 'mustard', name: 'Yellow or honey mustard', qty: 0.5, unit: 'cup' }],
  },
  'cheese-dip': {
    name: 'Cheese dip', short: 'Cheese dip', cat: 'bowls', unit: 'cup', baseQty: 0.5, step: 0.25, min: 0.25, max: 1, fp: [62, 62],
    art: 'bowl', color: '#f0b440', serveware: 'Small ramekin (3 in)', pending: true,
    styles: [{ id: 'bowl', label: 'In a small bowl', tech: 'bowls-first' }],
    subs: [], tools: ['Small spoon'],
    shop: [{ key: 'cheese-dip', name: 'Cheese dip, jarred or warmed', qty: 0.5, unit: 'cup' }],
  },
  'buffalo-dip': {
    name: 'Buffalo chicken dip', short: 'Buffalo dip', cat: 'bowls', unit: 'cup', baseQty: 1.5, step: 0.5, min: 0.5, max: 3, fp: [98, 98],
    art: 'bowl', color: '#d9773f', serveware: 'Medium bowl (5 in)', pending: true,
    styles: [
      { id: 'bowl', label: 'In a serving bowl', tech: 'bowls-first' },
      { id: 'dish', label: 'In its baking dish, next to the board', tech: null },
    ],
    subs: [], tools: ['Small spoon', 'Trivet for the baking dish'],
    shop: [{ key: 'cooked-chicken', name: 'Cooked chicken, shredded', qty: 1, unit: 'cup' }, { key: 'cream-cheese', name: 'Cream cheese', qty: 4, unit: 'oz' }, { key: 'hot-sauce', name: 'Buffalo hot sauce', qty: 0.25, unit: 'cup' }, { key: 'ranch', name: 'Ranch or blue cheese dressing', qty: 0.25, unit: 'cup' }],
  },
  'tortilla-chips': {
    name: 'Tortilla chips', cat: 'crunch', unit: 'cup', baseQty: 3, step: 1, min: 1, max: 6, fp: [130, 100],
    art: 'crackers', color: '#e3c27a', pending: true,
    styles: [{ id: 'pile', label: 'Loose pile', tech: 'filling-gaps' }],
    subs: ['crackers'], tools: [],
    shop: [{ key: 'tortilla-chips', name: 'Tortilla chips', qty: 3, unit: 'cup' }],
  },

  // Garnish
  lemon: {
    name: 'Lemon wedges', cat: 'garnish', unit: 'wedges', baseQty: 2, step: 1, min: 1, max: 8, fp: [64, 52],
    art: 'pile', color: '#f0d24a', shape: 'round',
    styles: [{ id: 'wedges', label: 'Wedges', tech: null }],
    subs: [], tools: [],
    shop: [{ key: 'lemon', name: 'Lemon', qty: null }],
  },
  basil: {
    name: 'Fresh basil', cat: 'garnish', unit: 'leaves', baseQty: 3, step: 1, min: 1, max: 10, fp: [54, 44],
    art: 'rosemary', color: '#4f7a3a',
    styles: [{ id: 'leaves', label: 'Leaves', tech: null }],
    subs: [], tools: [],
    shop: [{ key: 'basil', name: 'Fresh basil', qty: null }],
  },
  rosemary: {
    name: 'Fresh rosemary', cat: 'garnish', unit: 'sprigs', baseQty: 3, step: 1, min: 1, max: 8, fp: [34, 86],
    art: 'rosemary', color: '#6f7a5a',
    styles: [{ id: 'sprig', label: 'Whole sprigs', tech: 'herb-garnish' }],
    subs: [],
    tools: [],
  },
};

// Footprint of an illustrated group on the legacy 600 × 400 canvas (converted to mm by the renderer).
export function baseSize(type, qty) {
  const it = ITEMS[type];
  const k = Math.max(0.62, Math.min(1.55, Math.sqrt(qty / it.baseQty)));
  if (it.art === 'rosemary') return [it.fp[0], it.fp[1]];
  return [it.fp[0] * k, it.fp[1] * k];
}

export function styleOf(type, styleId) {
  const it = ITEMS[type];
  return it.styles.find((s) => s.id === styleId) || it.styles[0];
}
