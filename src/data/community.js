// From home to home. DEMO DATA: these creations, notes and Home numbers are examples
// for the preview. Real submissions will be reviewed by Yndarena before publishing.

export const COMMUNITY = {
  'h2h-midnight': {
    name: 'Late Night, Two Glasses',
    home: '0012',
    board: 'cheese-bread',
    serves: 2,
    time: 15,
    note: 'We made this after the kids were asleep. Swapped cheddar for manchego and kept the jam.',
    origin: { kind: 'presentation', id: 'love-like-rosemary', name: 'Love, Like Rosemary' },
    items: [
      { type: 'bowl-jam', qty: 0.25, x: 300, y: 196 },
      { type: 'brie', qty: 6, x: 168, y: 112, style: 'whole' },
      { type: 'manchego', qty: 4, x: 436, y: 300, r: 10, style: 'triangles' },
      { type: 'prosciutto', qty: 3, x: 432, y: 120, style: 'roses' },
      { type: 'grapes', qty: 6, x: 150, y: 288 },
      { type: 'crackers', qty: 12, x: 300, y: 310, r: 0, style: 'fan' },
      { type: 'rosemary', qty: 2, x: 300, y: 92 },
    ],
  },
  'h2h-little-hands': {
    name: 'Little Hands Garden',
    home: '0031',
    board: 'fruits-veg',
    serves: 4,
    time: 20,
    note: 'Our kids chose where everything goes. The cucumber rounds disappeared first.',
    origin: null,
    items: [
      { type: 'bowl-hummus', qty: 1, x: 300, y: 200 },
      { type: 'cucumber', qty: 2, x: 140, y: 110, style: 'rounds' },
      { type: 'cheddar', qty: 6, x: 460, y: 110, style: 'cubes' },
      { type: 'strawberries', qty: 6, x: 140, y: 296 },
      { type: 'carrots', qty: 8, x: 460, y: 296, r: 10, style: 'batons' },
      { type: 'green-grapes', qty: 8, x: 300, y: 336 },
      { type: 'crackers', qty: 12, x: 300, y: 72, r: 0, style: 'stack' },
    ],
  },
  'h2h-book-club': {
    name: 'Book Club Thursday',
    home: '0007',
    board: 'cheese-bread',
    serves: 6,
    time: 35,
    note: 'Golden Hour with a few changes. Pears instead of apple, and more olives because nobody can stop.',
    origin: { kind: 'presentation', id: 'golden-hour', name: 'Golden Hour' },
    items: [
      { type: 'bowl-olives', qty: 1, x: 150, y: 110 },
      { type: 'bowl-feta', qty: 0.75, x: 456, y: 300, style: 'swoosh' },
      { type: 'brie', qty: 8, x: 460, y: 104, style: 'wedges' },
      { type: 'gouda', qty: 6, x: 140, y: 300, style: 'triangles' },
      { type: 'salami', qty: 6, x: 300, y: 204, r: 20, style: 'river' },
      { type: 'pear', qty: 1, x: 300, y: 82 },
      { type: 'grapes', qty: 10, x: 300, y: 326 },
      { type: 'crackers', qty: 24, x: 546, y: 210, r: 90, style: 'fan' },
      { type: 'rosemary', qty: 2, x: 62, y: 210 },
    ],
  },
};

export const COMMUNITY_ORDER = ['h2h-midnight', 'h2h-little-hands', 'h2h-book-club'];
