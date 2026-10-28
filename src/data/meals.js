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
  // ---------- Catalog expansion, 2026-10-28 (NUEVO-CONTENIDO.md) ----------
  // Same rules as above. `layouts` holds two arrangements of the same components and amounts; `place` is the first.
  // `cook` says what the assembly minutes leave out. Photos of these components are pending (review panel).
  'spaghetti-marinara': {
    name: 'Spaghetti Marinara',
    category: 'Dinner',
    description: 'Spaghetti in a warm marinara, with parmesan and basil to finish and garlic bread on the side.',
    serves: 2,
    minutes: 3,
    cook: 'Cooking the pasta and warming the sauce are not included. Follow the package or your usual way.',
    board: 'cheese-bread',
    ingredients: ['8 oz spaghetti', '1 1/2 cups marinara sauce, jarred or your own', 'A little grated parmesan, optional', 'A few basil leaves, optional', '4 pieces of garlic bread'],
    quickPrep: ['Cook the spaghetti following the package directions.', 'Warm the marinara and toss it with the drained pasta.', 'Warm the garlic bread in the oven while you plate.'],
    serving: ['Fill the warmed bowl with the spaghetti, a finger below the rim.', 'Set the parmesan and the basil beside it.', 'Bring the garlic bread to the table on a plate next to the board. It does not fit on the board with the bowl.'],
    layouts: [
      { id: 'bowl-left', name: 'Bowl to the left', place: [
        { g: 'spaghetti-bowl', q: 2, x: 112, y: 120 },
        { g: 'parmesan', q: 0.25, x: 246, y: 76 },
        { g: 'basil', q: 3, x: 248, y: 166 },
        { g: 'garlic-bread', q: 4, alongside: true },
      ] },
      { id: 'bowl-right', name: 'Bowl to the right', place: [
        { g: 'spaghetti-bowl', q: 2, x: 218, y: 120 },
        { g: 'parmesan', q: 0.25, x: 84, y: 76 },
        { g: 'basil', q: 3, x: 82, y: 166 },
        { g: 'garlic-bread', q: 4, alongside: true },
      ] },
    ],
    layoutNote: 'A 7 in bowl leaves no room for the bread at 33 × 24 cm, so the garlic bread goes alongside.',
  },
  'cheese-ravioli': {
    name: 'Cheese Ravioli, Tomato & Basil',
    category: 'Dinner',
    description: 'Cheese ravioli in tomato sauce with a little basil. Bread if you like, no salad needed.',
    serves: 2,
    minutes: 3,
    cook: 'Cooking the ravioli is not included. Fresh or frozen, follow the package.',
    board: 'cheese-bread',
    ingredients: ['18 oz cheese ravioli, fresh or frozen', '1 cup tomato sauce', 'A few basil leaves', 'A slice or two of rustic bread, optional'],
    quickPrep: ['Cook the ravioli following the package directions.', 'Warm the sauce and spoon it over the drained ravioli.', 'Tear a few basil leaves over the top.'],
    serving: ['Spoon the ravioli into the shallow pasta bowl and wipe the rim.', 'Tear a few basil leaves over the top.', 'Set the bread beside it, if you are serving bread.'],
    layouts: [
      { id: 'bowl-left', name: 'Bowl to the left', place: [
        { g: 'ravioli-plate', q: 2, x: 112, y: 120 },
        { g: 'rustic-bread', q: 1, x: 256, y: 120 },
      ] },
      { id: 'bowl-right', name: 'Bowl to the right', place: [
        { g: 'ravioli-plate', q: 2, x: 218, y: 120 },
        { g: 'rustic-bread', q: 1, x: 74, y: 120 },
      ] },
    ],
    layoutNote: 'Bread is optional. No standard salad. The basil goes on the ravioli, not on the board.',
  },
  'mushroom-risotto': {
    name: 'Creamy Mushroom Risotto',
    category: 'Dinner',
    description: 'A bowl of mushroom risotto with parmesan, and a little bread only if you want it.',
    serves: 2,
    minutes: 3,
    cook: 'Cooking the risotto is not included. Ready-made works too.',
    board: 'cheese-bread',
    ingredients: ['About 3 cups of mushroom risotto, homemade or ready-made', 'A little grated parmesan, optional', 'A slice or two of rustic bread, optional'],
    quickPrep: ['Make the risotto your usual way, or warm a ready-made one.', 'Loosen it with a splash of warm broth just before serving.'],
    serving: ['Spoon the risotto into the warmed bowl and smooth the top.', 'Set the parmesan beside it.', 'Add the bread, if you are serving bread.'],
    layouts: [
      { id: 'bowl-left', name: 'Bowl to the left', place: [
        { g: 'risotto-bowl', q: 2, x: 102, y: 120 },
        { g: 'parmesan', q: 0.25, x: 218, y: 70 },
        { g: 'rustic-bread', q: 1, x: 252, y: 164 },
      ] },
      { id: 'bowl-right', name: 'Bowl to the right', place: [
        { g: 'risotto-bowl', q: 2, x: 228, y: 120 },
        { g: 'parmesan', q: 0.25, x: 112, y: 70 },
        { g: 'rustic-bread', q: 1, x: 78, y: 164 },
      ] },
    ],
    layoutNote: 'A smaller bowl than the pasta dinners, so bread can sit on the board.',
  },
  'bbq-chicken-sliders': {
    name: 'BBQ Chicken Sliders',
    category: 'Lunch or dinner',
    description: 'Small buns with BBQ chicken and pickles, with a bowl of creamy coleslaw.',
    serves: 2,
    minutes: 4,
    cook: 'Cooking the chicken is not included. Rotisserie or leftover chicken works well.',
    board: 'meat-fish',
    ingredients: ['4 slider buns', '1 1/2 cups cooked chicken, shredded', '1/3 cup BBQ sauce', '1/2 cup pickle chips', '1 1/2 cups coleslaw, deli or homemade'],
    quickPrep: ['Warm the shredded chicken with the BBQ sauce.', 'Split the buns and toast them lightly, if you like.'],
    serving: ['Fill the buns just before serving and set them in a block of two by two.', 'Place the coleslaw bowl beside them.', 'Add the pickles in a small bowl.'],
    scale: 'Two sliders per person. For more people, add sliders in pairs; the board holds four.',
    layouts: [
      { id: 'sliders-left', name: 'Sliders to the left', place: [
        { g: 'bbq-sliders', q: 4, x: 94, y: 120 },
        { g: 'creamy-coleslaw', q: 2, x: 232, y: 80 },
        { g: 'pickles', q: 0.5, x: 266, y: 180 },
      ] },
      { id: 'sliders-right', name: 'Sliders to the right', place: [
        { g: 'bbq-sliders', q: 4, x: 236, y: 120 },
        { g: 'creamy-coleslaw', q: 2, x: 84, y: 80 },
        { g: 'pickles', q: 0.5, x: 112, y: 180 },
      ] },
    ],
    layoutNote: 'Creamy coleslaw, not the cabbage-and-carrot slaw of Chicken Wraps.',
  },
  'grilled-cheese-soup': {
    name: 'Grilled Cheese & Tomato Soup',
    category: 'Lunch or dinner',
    description: 'Grilled cheese cut in triangles on the board, with tomato soup in bowls alongside.',
    serves: 2,
    minutes: 2,
    cook: 'Making the sandwiches and warming the soup are not included.',
    board: 'cheese-bread',
    ingredients: ['4 slices of sandwich bread', '4 slices of cheddar or American cheese', 'Butter', '2 cups tomato soup, carton or homemade'],
    quickPrep: ['Butter the bread, fill with cheese and cook in a pan until golden on both sides.', 'Warm the soup in a pot.'],
    serving: ['Cut each sandwich corner to corner and lay the triangles in a short overlapping line.', 'Ladle the soup into bowls and set them next to the board.', 'Keep the pot on the stove or a trivet, never on the wood.'],
    layouts: [
      { id: 'line', name: 'In one line', place: [
        { g: 'grilled-cheese', q: 2, x: 165, y: 120 },
        { g: 'tomato-soup', q: 2, alongside: true },
      ] },
      { id: 'column', name: 'Stacked', place: [
        { g: 'grilled-cheese', q: 2, x: 165, y: 120, arrange: 'column' },
        { g: 'tomato-soup', q: 2, alongside: true },
      ] },
    ],
    layoutNote: 'Soup goes alongside in bowls. No hot pots on the wood.',
  },
  'cheese-quesadillas': {
    name: 'Cheese Quesadillas',
    category: 'Lunch or dinner',
    description: 'Golden cheese quesadillas in triangles, with salsa and sour cream for dipping.',
    serves: 2,
    minutes: 2,
    cook: 'Cooking the quesadillas is not included.',
    board: 'cheese-bread',
    ingredients: ['2 flour tortillas (8 in)', '1 1/2 cups shredded cheese', '1/2 cup salsa, optional', '1/2 cup sour cream, optional'],
    quickPrep: ['Fill half of each tortilla with cheese, fold and cook in a dry pan until golden on both sides.', 'Rest for a minute, then cut into triangles.'],
    serving: ['Lay the triangles of each quesadilla in a short overlapping line.', 'Set the salsa and sour cream in small bowls beside them.', 'Leave space to pick up each piece.'],
    layouts: [
      { id: 'dips-right', name: 'Dips to the right', place: [
        { g: 'quesadilla', q: 2, x: 110, y: 120, arrange: 'column' },
        { g: 'salsa', q: 0.5, x: 246, y: 76 },
        { g: 'sour-cream', q: 0.5, x: 246, y: 168 },
      ] },
      { id: 'dips-left', name: 'Dips to the left', place: [
        { g: 'quesadilla', q: 2, x: 220, y: 120, arrange: 'column' },
        { g: 'salsa', q: 0.5, x: 84, y: 76 },
        { g: 'sour-cream', q: 0.5, x: 84, y: 168 },
      ] },
    ],
    layoutNote: 'Its own dish: not the chicken wraps under another name.',
  },
  'mac-and-cheese': {
    name: 'Classic Mac & Cheese',
    category: 'Dinner',
    description: 'A warm bowl of mac & cheese, with a little broccoli if you like.',
    serves: 2,
    minutes: 2,
    cook: 'Cooking is not included. Boxed, deli or your own recipe all work.',
    board: 'cheese-bread',
    ingredients: ['Mac & cheese for 2, boxed, deli or homemade', '1 1/2 cups broccoli florets, optional'],
    quickPrep: ['Make the mac & cheese your usual way.', 'Steam or roast the broccoli until just tender.'],
    serving: ['Spoon the mac & cheese into the warmed bowl.', 'Set the broccoli beside it, or serve it on a plate next to the board.'],
    layouts: [
      { id: 'side-on-board', name: 'Broccoli on the board', place: [
        { g: 'mac-cheese', q: 2, x: 112, y: 120 },
        { g: 'broccoli', q: 1.5, x: 258, y: 120 },
      ] },
      { id: 'side-alongside', name: 'Broccoli alongside', place: [
        { g: 'mac-cheese', q: 2, x: 165, y: 120 },
        { g: 'broccoli', q: 1.5, alongside: true },
      ] },
    ],
    layoutNote: 'No bread or salad by default.',
  },
  'cheddar-apples-crackers': {
    kind: 'share',
    name: 'Cheddar, Apples & Crackers',
    category: 'Board to share',
    description: 'Sharp cheddar, crisp apple slices and crackers. An easy board for an afternoon or a movie night.',
    serves: 4,
    minutes: 6,
    cook: 'No cooking. Slicing the apple and the cheese is included in the minutes.',
    board: 'cheese-bread',
    ingredients: ['6 oz aged cheddar', '1 crisp apple', '16 round crackers', '1/2 cup pickle chips, optional'],
    quickPrep: ['Cut the cheddar into thin triangles.', 'Slice the apple just before serving; a squeeze of lemon keeps it from browning.'],
    serving: ['Fan the cheddar triangles in one corner.', 'Lay the apple slices in a fan beside them.', 'Run the crackers in a line along the bottom, with room to take one.', 'Serve the pickles next to the board in a small bowl, if you like.'],
    layouts: [
      { id: 'corners', name: 'Corners and a line', place: [
        { g: 'cheddar', s: 'triangles', q: 6, x: 98, y: 82 },
        { g: 'apple', q: 1, x: 236, y: 84 },
        { g: 'crackers', s: 'fan', q: 16, x: 165, y: 184 },
        { g: 'pickles', q: 0.5, alongside: true },
      ] },
      { id: 'stacks', name: 'Crackers in short stacks', place: [
        { g: 'cheddar', s: 'triangles', q: 6, x: 98, y: 74 },
        { g: 'apple', q: 1, x: 98, y: 168 },
        { g: 'crackers', s: 'stack', q: 16, x: 232, y: 120 },
        { g: 'pickles', q: 0.5, alongside: true },
      ] },
    ],
    layoutNote: 'Pickles are optional and go alongside: on the board they would crowd the crackers.',
  },
  'pretzel-bites-mustard': {
    kind: 'share',
    name: 'Soft Pretzel Bites & Mustard',
    category: 'Board to share',
    description: 'Warm soft pretzel bites with mustard, and a cheese dip if you like. Refill from the oven as they go.',
    serves: 4,
    minutes: 3,
    cook: 'Baking or warming the bites is not included. Follow the package.',
    board: 'cheese-bread',
    ingredients: ['4 cups soft pretzel bites, frozen or bakery', '1/2 cup yellow or honey mustard', '1/2 cup cheese dip, optional'],
    quickPrep: ['Bake or warm the pretzel bites following the package.', 'Warm the cheese dip, if you are serving it.'],
    serving: ['Set the mustard and cheese dip in small bowls.', 'Pile half of the warm bites beside them.', 'Keep the rest warm in the oven and refill the board as it empties.'],
    layouts: [
      { id: 'dips-right', name: 'Dips to the right', place: [
        { g: 'pretzel-bites', q: 4, p: 2, x: 116, y: 120, overflow: 'refill' },
        { g: 'mustard', q: 0.5, x: 248, y: 78 },
        { g: 'cheese-dip', q: 0.5, x: 248, y: 166 },
      ] },
      { id: 'dips-top', name: 'Dips on top', place: [
        { g: 'pretzel-bites', q: 4, p: 2, x: 165, y: 158, overflow: 'refill' },
        { g: 'mustard', q: 0.5, x: 118, y: 66 },
        { g: 'cheese-dip', q: 0.5, x: 212, y: 66 },
      ] },
    ],
    layoutNote: 'Half the bites on the board at once; the rest stay warm to refill.',
  },
  'buffalo-chicken-dip': {
    kind: 'share',
    name: 'Buffalo Chicken Dip & Dippers',
    category: 'Board to share',
    description: 'A warm buffalo chicken dip with tortilla chips and crisp carrot and celery batons.',
    serves: 4,
    minutes: 5,
    cook: 'Mixing and baking the dip are not included.',
    board: 'meat-fish',
    ingredients: ['1 cup cooked chicken, shredded', '4 oz cream cheese', '1/4 cup buffalo hot sauce', '1/4 cup ranch or blue cheese dressing', '3 cups tortilla chips, or crackers', '8 oz carrots', '3 celery stalks'],
    quickPrep: ['Mix the chicken, cream cheese, hot sauce and dressing, and bake until bubbling.', 'Cut the carrots and celery into batons.'],
    serving: ['Spoon the dip into a serving bowl, or keep it in its baking dish on a trivet next to the board.', 'Pile about two thirds of the chips and group the vegetables around the dip.', 'Keep the rest of the chips in the bag to refill.'],
    layouts: [
      { id: 'dip-on-board', name: 'Dip on the board', place: [
        { g: 'buffalo-dip', s: 'bowl', q: 1.5, x: 85, y: 90 },
        { g: 'tortilla-chips', q: 3, p: 2, x: 240, y: 77, overflow: 'refill' },
        { g: 'carrots', q: 8, x: 232, y: 167, r: 90 },
        { g: 'celery', q: 3, alongside: true },
      ] },
      { id: 'dip-alongside', name: 'Dip in its dish, alongside', place: [
        { g: 'buffalo-dip', s: 'dish', q: 1.5, alongside: true },
        { g: 'tortilla-chips', q: 3, p: 2, x: 90, y: 76, overflow: 'refill' },
        { g: 'celery', q: 3, x: 96, y: 166 },
        { g: 'carrots', q: 8, x: 232, y: 120, r: 90 },
      ] },
    ],
    layoutNote: 'With the dip on the board, the celery waits alongside. A hot baking dish never goes on the wood.',
  },
};

export const MEAL_ORDER = [
  'gnocchi-tomato-basil', 'lemon-chicken-potatoes', 'steak-potatoes', 'salmon-rice-greens', 'chicken-wraps', 'tomato-mozzarella-flatbread',
  'spaghetti-marinara', 'cheese-ravioli', 'mushroom-risotto', 'bbq-chicken-sliders', 'grilled-cheese-soup', 'cheese-quesadillas', 'mac-and-cheese',
].filter((id) => !MEALS[id].kind);

// Snacks to share live under Boards to share, next to the presentations, with the same meal screen.
export const SHARE_ORDER = ['cheddar-apples-crackers', 'pretzel-bites-mustard', 'buffalo-chicken-dip'];

// First layout is the default; meals without `layouts` have one.
for (const m of Object.values(MEALS)) {
  if (m.layouts) m.place = m.layouts[0].place;
  else m.layouts = [{ id: 'main', name: 'Layout', place: m.place }];
}

// The four simple salads. Available in Designer as prepared sides; never added to every meal.
export const SIDE_IDEAS = {
  'tomato-avocado': { name: 'Tomato & Avocado Salad', item: 'side-tomato-avocado', ingredients: ['Tomato', 'Avocado', 'Olive oil', 'Lemon, optional'], steps: ['Cut the tomato and avocado into chunks.', 'Dress lightly just before serving.'] },
  'beet-carrot': { name: 'Beet & Carrot Salad', item: 'side-beet-carrot', ingredients: ['Cooked beets', 'Carrot', 'Olive oil', 'Lemon'], steps: ['Cut the cooked beets and shave the carrot into ribbons.', 'Toss lightly with olive oil and lemon.'] },
  'cabbage-carrot': { name: 'Cabbage & Carrot Slaw', item: 'side-cabbage-carrot', ingredients: ['Cabbage', 'Carrot', 'Olive oil', 'Lemon'], steps: ['Finely slice the cabbage and carrot.', 'Toss with a little olive oil and lemon.'] },
  'tomato-basil': { name: 'Tomato & Basil', item: 'side-tomato-basil', ingredients: ['Cherry tomatoes', 'Basil', 'Olive oil'], steps: ['Halve the tomatoes and add a few basil leaves.', 'Dress lightly with olive oil.'] },
};
