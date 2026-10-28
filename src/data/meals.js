// Everyday meals (package yndarena-everyday-v4). Familiar dinners served on a board.
// Content comes from media-source/everyday-v4/everyday-meals.json. Ids are the package's stable template ids:
// built-in meals are replaced by id on each update, never duplicated, and a Home's saved versions are left as they are.
// Amounts and steps are editorial serving drafts, not kitchen-tested recipes. Minutes are assembly time with the
// food already cooked, never total cooking time.
// Placements are in board mm (330 × 240 board, see physical.js). `alongside` items are served next to the board:
// "Serves 2" is the whole meal, not what fits on the board at once. Fit is checked with estimated sizes only.
// Board follows the main dish (chicken, meat and fish → Meat & Fish); a side never changes it.

export const MEALS_PACKAGE = 'yndarena-everyday-v4';

export const MEALS = {
  'gnocchi-tomato-basil': {
    name: 'Gnocchi, Tomato & Basil',
    category: 'Dinner',
    description: 'Gnocchi with tomato and basil, with a few slices of bread alongside.',
    serves: 2,
    minutes: 3,
    board: 'cheese-bread',
    cover: 'everyday-gnocchi-bread-cover',
    ingredients: [
      '1 lb store-bought potato gnocchi',
      '1 cup prepared tomato sauce, or your usual sauce',
      'A few fresh basil leaves',
      'A few slices of rustic bread',
    ],
    quickPrep: [
      'Cook the gnocchi following the package directions.',
      'Warm your usual tomato sauce and toss with the gnocchi.',
      'Add a few basil leaves. No homemade sauce is required.',
    ],
    serving: [
      'Set the bowl of gnocchi on one side of the clean, dry board.',
      'Lay a few slices of bread beside it, leaving room to reach the bowl.',
      'Finish with basil and bring it to the table.',
    ],
    place: [
      { g: 'gnocchi-bowl', q: 1, x: 112, y: 120 },
      { g: 'rustic-bread', q: 2, x: 258, y: 120, r: 90 },
    ],
    layoutNote: 'Gnocchi stays in its bowl. Bread is the default accompaniment. No salad by default.',
  },
  'lemon-chicken-potatoes': {
    name: 'Lemon Chicken & Potatoes',
    category: 'Dinner',
    description: 'Chicken, golden potatoes and a little green. An easy dinner to gather around.',
    serves: 2,
    minutes: 4,
    board: 'meat-fish',
    cover: 'everyday-lemon-chicken-cover',
    ingredients: [
      '2 cooked chicken breasts, prepared your usual way',
      '2 cups roasted potatoes',
      '1 cup cooked green beans',
      'Lemon, to taste',
    ],
    quickPrep: [
      'Use your usual cooked chicken and roasted potatoes; there is no special cooking method to learn.',
      'Add a little lemon to the chicken if you like.',
      'Use simply cooked green beans or another familiar vegetable.',
    ],
    serving: [
      'Place the cooked chicken in a relaxed overlapping line.',
      'Add the green beans beside it, with a lemon wedge if you like.',
      'Serve the potatoes alongside, in a bowl or on a plate.',
    ],
    place: [
      { g: 'lemon-chicken', q: 2, x: 106, y: 120, arrange: 'column' },
      { g: 'green-beans', q: 1, x: 226, y: 100 },
      { g: 'lemon', q: 2, x: 228, y: 188 },
      { g: 'potatoes', q: 2, alongside: true },
    ],
    layoutNote: 'A cooked main, one familiar starch and one vegetable. No garnish or homemade sauce required.',
  },
  'steak-potatoes': {
    name: 'Steak & Roasted Potatoes',
    category: 'Dinner',
    description: 'Steak and golden potatoes with a fresh tomato-and-avocado side.',
    serves: 2,
    minutes: 4,
    board: 'meat-fish',
    cover: 'everyday-steak-tomato-avocado-cover',
    ingredients: [
      '2 cooked steaks, prepared your usual way',
      '2 cups roasted potatoes',
      '2 tomatoes',
      '1 ripe avocado',
      'A little olive oil; lemon if you like',
    ],
    quickPrep: [
      'Use the steak and potatoes you already know how to cook.',
      'Cut the tomatoes and avocado into chunks.',
      'Dress lightly with olive oil and a little lemon if you like.',
    ],
    serving: [
      'Place the sliced cooked steak in a relaxed overlapping line.',
      'Set the tomato-and-avocado bowl beside it, leaving room to reach both.',
      'Serve the potatoes alongside, in a bowl or on a plate.',
    ],
    place: [
      { g: 'steak', q: 2, x: 111, y: 120, arrange: 'column' },
      { g: 'side-tomato-avocado', q: 2, x: 249.5, y: 120 },
      { g: 'potatoes', q: 2, alongside: true },
    ],
    layoutNote: 'Tomato-and-avocado bowl, not the retired lettuce-and-cucumber bowl. Raw-meat preparation stays off the clean serving surface.',
  },
  // The id keeps its original name for migration; the visible title changed in v4.
  'salmon-rice-greens': {
    name: 'Salmon, Rice & Beet Salad',
    category: 'Dinner',
    description: 'A simple salmon dinner with rice and a colorful beet-and-carrot side.',
    serves: 2,
    minutes: 4,
    board: 'meat-fish',
    cover: 'everyday-salmon-beet-carrot-cover',
    ingredients: [
      '2 cooked salmon portions',
      '1 1/2 cups cooked rice',
      '2 small cooked beets; prepared beets are fine',
      '1 carrot',
      'Lemon and a little olive oil',
    ],
    quickPrep: [
      'Use your usual cooked salmon and plain rice.',
      'Cut the cooked beets into wedges and shave the carrot into ribbons.',
      'Toss the vegetables lightly with lemon and olive oil.',
    ],
    serving: [
      'Set the rice and beet-and-carrot bowls near one side.',
      'Place the cooked salmon beside them, with room to lift each portion.',
      'Add the lemon wedges and bring it to the table.',
    ],
    place: [
      { g: 'rice', q: 1.5, x: 78.8, y: 78.6 },
      { g: 'side-beet-carrot', q: 2, x: 203, y: 79 },
      { g: 'salmon', q: 2, x: 153, y: 181.5 },
      { g: 'lemon', q: 2, x: 286, y: 70, r: 90 },
    ],
    layoutNote: 'Beet-and-carrot bowl replaces the earlier green-bean side.',
  },
  'chicken-wraps': {
    name: 'Chicken Wraps',
    category: 'Lunch or dinner',
    description: 'Chicken wraps with a crisp cabbage-and-carrot side.',
    serves: 2,
    minutes: 3,
    board: 'meat-fish',
    cover: 'everyday-wraps-cabbage-carrot-cover',
    ingredients: [
      '2 flour tortillas',
      'Cooked chicken for 2 wraps',
      'Lettuce and tomato for the wrap filling',
      'A little plain yogurt or your usual dressing, optional',
      '1 cup finely sliced cabbage',
      '1 carrot',
      'A little lemon and olive oil',
    ],
    quickPrep: [
      'Fill and roll the tortillas with cooked chicken, lettuce, tomato and optional dressing.',
      'Cut each wrap into two halves.',
      'Toss finely sliced cabbage and carrot with a little lemon and olive oil.',
    ],
    serving: [
      'Stack the four wrap halves in an easy overlapping line, cut sides visible.',
      'Place the cabbage-and-carrot bowl beside them.',
      'Leave a little space so the halves are easy to pick up.',
    ],
    place: [
      { g: 'chicken-wraps', q: 2, x: 111, y: 120, arrange: 'column' },
      { g: 'side-cabbage-carrot', q: 2, x: 249.5, y: 120 },
    ],
    layoutNote: 'Lettuce and tomato stay inside the wraps. The side is cabbage and carrot. Two wraps, each shown as two halves.',
  },
  'tomato-mozzarella-flatbread': {
    name: 'Tomato & Mozzarella Flatbread',
    category: 'Lunch or dinner',
    description: 'A simple pizza night with fresh tomatoes and basil alongside.',
    serves: 2,
    minutes: 3,
    board: 'cheese-bread',
    cover: 'everyday-flatbread-tomato-basil-cover',
    ingredients: [
      '2 small flatbreads or 1 large ready-made base',
      '1/2 cup tomato sauce',
      '4 oz mozzarella',
      '1 cup cherry tomatoes',
      'A few basil leaves',
      'A little olive oil',
    ],
    quickPrep: [
      'Top a ready-made base with tomato sauce and mozzarella; bake following the base manufacturer instructions.',
      'Halve the cherry tomatoes and toss lightly with basil and olive oil.',
      'Cut the flatbread into easy-to-share pieces.',
    ],
    serving: [
      'Arrange the pieces of one flatbread close to their original shape.',
      'Set the small tomato-and-basil bowl beside it.',
      'Keep the second flatbread warm alongside and bring it out to refill.',
    ],
    place: [
      { g: 'flatbread', q: 1, x: 115, y: 120 },
      { g: 'side-tomato-basil', q: 1, x: 248, y: 120 },
      { g: 'flatbread', q: 1, alongside: true },
    ],
    layoutNote: 'Only fresh tomato and basil in the side bowl. Mozzarella stays on the flatbread.',
  },
};

export const MEAL_ORDER = ['gnocchi-tomato-basil', 'lemon-chicken-potatoes', 'steak-potatoes', 'salmon-rice-greens', 'chicken-wraps', 'tomato-mozzarella-flatbread'];

// The four simple salads. Available in Designer as prepared sides; never added to every meal.
export const SIDE_IDEAS = {
  'tomato-avocado': { name: 'Tomato & Avocado Salad', item: 'side-tomato-avocado', ingredients: ['Tomato', 'Avocado', 'Olive oil', 'Lemon, optional'], steps: ['Cut the tomato and avocado into chunks.', 'Dress lightly just before serving.'] },
  'beet-carrot': { name: 'Beet & Carrot Salad', item: 'side-beet-carrot', ingredients: ['Cooked beets', 'Carrot', 'Olive oil', 'Lemon'], steps: ['Cut the cooked beets and shave the carrot into ribbons.', 'Toss lightly with olive oil and lemon.'] },
  'cabbage-carrot': { name: 'Cabbage & Carrot Slaw', item: 'side-cabbage-carrot', ingredients: ['Cabbage', 'Carrot', 'Olive oil', 'Lemon'], steps: ['Finely slice the cabbage and carrot.', 'Toss with a little olive oil and lemon.'] },
  'tomato-basil': { name: 'Tomato & Basil', item: 'side-tomato-basil', ingredients: ['Cherry tomatoes', 'Basil', 'Olive oil'], steps: ['Halve the tomatoes and add a few basil leaves.', 'Dress lightly with olive oil.'] },
};
