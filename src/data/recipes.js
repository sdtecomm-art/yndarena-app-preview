// Yndarena dinners (v12, 2026-11-09). 36 everyday dinners for 4, in US units.
//
// Status: KITCHEN DRAFTS. Written for Yndarena from standard home-cooking methods (ingredient lists and plain
// directions are not protected by copyright; no third-party recipe text, photo or layout was copied). They have
// NOT been cooked and tested yet: amounts and times must be confirmed in Yndarena's kitchen before launch.
//
// Verified facts used in every recipe (USDA FSIS Safe Minimum Internal Temperature Chart; USDA leftovers guidance):
//   poultry, ground poultry 165°F · ground beef/pork 160°F · whole cuts of beef, pork 145°F + 3 min rest ·
//   fish 145°F · egg dishes 160°F · leftovers: refrigerate within 2 hours, eat within 3–4 days.
// Board guidance follows USDA cross-contamination advice: raw meat, poultry and seafood on their own board,
// produce on another, bread on another. That is exactly the three Yndarena boards.
//
// Ingredient row: [quantity, unit, item, aisle, note?]
//   aisle: P produce · M meat & seafood · D dairy & eggs · B bakery · A pantry · F frozen · S spices & oils
// Prep rows by board: m = Meat & Fish · v = Fruits & Vegetables · c = Cheese & Bread
// diet: meat | fish | vegetarian | vegan · protein: chicken | beef | pork | turkey | fish | shellfish | plant | egg
// contains: gluten | dairy | egg | soy | fish | shellfish | peanut | treenut | sesame

export const AISLES = [
  ['P', 'Produce'], ['M', 'Meat & seafood'], ['D', 'Dairy & eggs'], ['B', 'Bakery'], ['A', 'Pantry'], ['F', 'Frozen'], ['S', 'Spices & oils'],
];
export const BOARDS = {
  v: { name: 'Fruits & Vegetables', short: 'Vegetables board' },
  c: { name: 'Cheese & Bread', short: 'Cheese & Bread board' },
  m: { name: 'Meat & Fish', short: 'Meat & Fish board' },
};
// Cut in this order so nothing raw from the meat board touches what you eat uncooked.
export const BOARD_ORDER = ['v', 'c', 'm'];
// Most kitchens already have these: shown apart in the shopping list.
export const STAPLES = new Set(['salt', 'black pepper', 'olive oil', 'neutral oil']);

export const SAFE = {
  poultry: 'Cook chicken and turkey to 165°F in the thickest part. Use a thermometer: color isn’t a reliable sign.',
  ground: 'Cook ground beef and pork to 160°F.',
  whole: 'Cook steaks, chops and roasts to 145°F, then let them rest 3 minutes before slicing.',
  fish: 'Cook fish to 145°F, or until it flakes easily with a fork.',
  shellfish: 'Cook shrimp until pink and opaque all the way through.',
  egg: 'Cook egg dishes to 160°F, until set in the center.',
};
export const LEFTOVERS = 'Leftovers: into the fridge within 2 hours, eat within 3 to 4 days.';

const R = (o) => ({ servings: 4, ...o });

export const RECIPES = [
  // ---------- Chicken ----------
  R({ id: 'lemon-chicken-sheet-pan', name: 'Sheet-pan lemon chicken with potatoes and green beans', diet: 'meat', protein: 'chicken', time: 45, contains: [], safe: 'poultry',
    blurb: 'One pan, crisp potatoes, bright lemon.',
    ing: [[1.75, 'lb', 'boneless skinless chicken thighs', 'M'], [1.5, 'lb', 'baby potatoes', 'P'], [12, 'oz', 'green beans', 'P'], [1, '', 'lemon', 'P'], [3, 'clove', 'garlic', 'P'], [3, 'tbsp', 'olive oil', 'S'], [1, 'tsp', 'dried oregano', 'S'], [1, 'tsp', 'salt', 'S'], [0.5, 'tsp', 'black pepper', 'S']],
    prep: { v: ['Halve the potatoes.', 'Trim the green beans.', 'Mince the garlic, zest and halve the lemon.'], m: ['Trim the chicken thighs.'] },
    ahead: ['Trim the green beans and mince the garlic.'],
    steps: ['Heat the oven to 425°F. Toss the potatoes with 1 tbsp oil and a pinch of salt and roast 15 minutes.', 'Toss the chicken with the rest of the oil, garlic, lemon zest, oregano, salt and pepper.', 'Add the chicken and green beans to the pan. Roast 20 to 25 minutes, until the chicken reaches 165°F.', 'Squeeze the lemon over everything and serve.'] }),
  R({ id: 'chicken-broccoli-stir-fry', name: 'Chicken and broccoli stir-fry with rice', diet: 'meat', protein: 'chicken', time: 30, contains: ['soy', 'gluten'], safe: 'poultry',
    blurb: 'Faster than takeout, and you know what’s in it.',
    ing: [[1.5, 'cup', 'long-grain white rice', 'A'], [1.5, 'lb', 'boneless skinless chicken breast', 'M'], [12, 'oz', 'broccoli florets', 'P'], [1, '', 'red bell pepper', 'P'], [3, 'clove', 'garlic', 'P'], [1, 'tbsp', 'fresh ginger, grated', 'P'], [0.25, 'cup', 'low-sodium soy sauce', 'A'], [1, 'tbsp', 'honey', 'A'], [1, 'tbsp', 'cornstarch', 'A'], [2, 'tbsp', 'neutral oil', 'S']],
    prep: { v: ['Cut the broccoli into bite-size florets.', 'Slice the bell pepper.', 'Mince the garlic and grate the ginger.'], m: ['Cut the chicken into 1-inch pieces.'] },
    ahead: ['Cut the broccoli and pepper, mince the garlic.', 'Mix the soy sauce, honey and cornstarch with 1/4 cup water.'],
    steps: ['Cook the rice following the package.', 'Mix the soy sauce, honey and cornstarch with 1/4 cup water.', 'Heat 1 tbsp oil in a large skillet over high heat. Cook the chicken 5 to 6 minutes until it reaches 165°F. Move it to a plate.', 'Add the rest of the oil, the broccoli and pepper. Cook 3 minutes, add garlic and ginger for 30 seconds.', 'Return the chicken, pour in the sauce and stir until glossy, about 1 minute. Serve over rice.'] }),
  R({ id: 'chicken-fajitas', name: 'Chicken fajitas', diet: 'meat', protein: 'chicken', time: 30, contains: ['gluten', 'dairy'], safe: 'poultry',
    blurb: 'Everyone builds their own.',
    ing: [[1.5, 'lb', 'boneless skinless chicken breast', 'M'], [2, '', 'bell peppers', 'P'], [1, '', 'yellow onion', 'P'], [1, '', 'lime', 'P'], [2, 'tsp', 'chili powder', 'S'], [1, 'tsp', 'ground cumin', 'S'], [2, 'tbsp', 'neutral oil', 'S'], [1, 'tsp', 'salt', 'S'], [8, '', 'flour tortillas (8-inch)', 'B'], [0.5, 'cup', 'sour cream', 'D'], [1, 'jar', 'salsa (16 oz)', 'A']],
    prep: { v: ['Slice the peppers and onion into strips.', 'Cut the lime into wedges.'], m: ['Slice the chicken into thin strips.'] },
    ahead: ['Slice the peppers and onion.'],
    steps: ['Toss the chicken with chili powder, cumin, salt and 1 tbsp oil.', 'Cook the chicken in a hot skillet 6 to 7 minutes, until it reaches 165°F. Move to a plate.', 'Add the rest of the oil, peppers and onion. Cook 5 minutes until soft at the edges.', 'Return the chicken, squeeze lime over it. Warm the tortillas and serve with sour cream and salsa.'] }),
  R({ id: 'chicken-white-bean-kale-soup', name: 'Chicken, white bean and kale soup', diet: 'meat', protein: 'chicken', time: 40, contains: [], safe: 'poultry',
    blurb: 'A big pot that’s even better the next day.',
    ing: [[1, 'lb', 'boneless skinless chicken breast', 'M'], [1, '', 'yellow onion', 'P'], [2, '', 'carrots', 'P'], [2, '', 'celery ribs', 'P'], [3, 'clove', 'garlic', 'P'], [1, 'bunch', 'kale', 'P'], [2, 'can', 'cannellini beans (15 oz)', 'A'], [6, 'cup', 'low-sodium chicken broth', 'A'], [1, 'tsp', 'dried thyme', 'S'], [1, 'tbsp', 'olive oil', 'S'], [1, 'tsp', 'salt', 'S']],
    prep: { v: ['Dice the onion, carrots and celery.', 'Mince the garlic.', 'Strip the kale from the stems and chop it.'], m: [] },
    ahead: ['Dice the onion, carrots and celery.', 'Chop the kale.'],
    steps: ['Heat the oil in a large pot. Cook the onion, carrots and celery 6 minutes.', 'Add garlic and thyme for 1 minute, then the broth and the whole chicken breasts.', 'Simmer 15 to 18 minutes, until the chicken reaches 165°F. Lift it out and shred it with two forks on a plate.', 'Add the drained beans and kale to the pot and simmer 5 minutes. Return the chicken, season and serve.'] }),
  R({ id: 'greek-chicken-bowls', name: 'Greek chicken bowls with cucumber yogurt', diet: 'meat', protein: 'chicken', time: 35, contains: ['dairy'], safe: 'poultry',
    blurb: 'Fresh, cold and hot in one bowl.',
    ing: [[1.5, 'cup', 'long-grain white rice', 'A'], [1.5, 'lb', 'boneless skinless chicken thighs', 'M'], [1, '', 'cucumber', 'P'], [1, 'pint', 'cherry tomatoes', 'P'], [0.5, '', 'red onion', 'P'], [1, '', 'lemon', 'P'], [2, 'clove', 'garlic', 'P'], [1, 'cup', 'plain Greek yogurt', 'D'], [4, 'oz', 'feta cheese', 'D'], [1, 'tsp', 'dried oregano', 'S'], [2, 'tbsp', 'olive oil', 'S'], [1, 'tsp', 'salt', 'S']],
    prep: { v: ['Dice the cucumber; grate a quarter of it for the sauce.', 'Halve the tomatoes, thinly slice the onion.', 'Mince the garlic, juice the lemon.'], c: ['Crumble the feta.'], m: ['Trim the chicken thighs.'] },
    ahead: ['Make the yogurt sauce: yogurt, grated cucumber, half the garlic, lemon juice, salt.'],
    steps: ['Cook the rice following the package.', 'Rub the chicken with oil, oregano, the rest of the garlic and salt. Cook in a skillet over medium-high heat 5 to 6 minutes per side, until it reaches 165°F. Rest, then slice.', 'Stir the yogurt with the grated cucumber, a squeeze of lemon and a pinch of salt.', 'Fill bowls with rice, chicken, cucumber, tomatoes, onion and feta. Top with the sauce.'] }),
  R({ id: 'chicken-cutlets-spaghetti', name: 'Crispy chicken cutlets with spaghetti and marinara', diet: 'meat', protein: 'chicken', time: 40, contains: ['gluten', 'dairy', 'egg'], safe: 'poultry',
    blurb: 'The weeknight version of a family favorite.',
    ing: [[1.5, 'lb', 'boneless skinless chicken breast', 'M'], [2, '', 'eggs', 'D'], [1, 'cup', 'Italian breadcrumbs', 'A'], [0.5, 'cup', 'grated parmesan', 'D'], [4, 'oz', 'mozzarella', 'D'], [1, 'jar', 'marinara sauce (24 oz)', 'A'], [12, 'oz', 'spaghetti', 'A'], [3, 'tbsp', 'olive oil', 'S'], [1, 'tsp', 'salt', 'S']],
    prep: { c: ['Slice the mozzarella.'], m: ['Halve the chicken breasts horizontally into thin cutlets.'] },
    ahead: ['Slice the mozzarella.'],
    steps: ['Boil the spaghetti in salted water following the package. Warm the marinara.', 'Dip the cutlets in beaten egg, then in breadcrumbs mixed with the parmesan.', 'Fry in oil over medium heat 3 to 4 minutes per side, until golden and 165°F inside.', 'Top each cutlet with mozzarella and a spoon of sauce, cover the pan 1 minute to melt. Serve with the spaghetti and sauce.'] }),
  R({ id: 'honey-garlic-drumsticks', name: 'Honey-garlic drumsticks with roasted carrots', diet: 'meat', protein: 'chicken', time: 50, contains: ['soy', 'gluten'], safe: 'poultry',
    blurb: 'Sticky, sweet and easy on a weeknight.',
    ing: [[8, '', 'chicken drumsticks', 'M'], [1, 'lb', 'carrots', 'P'], [3, 'clove', 'garlic', 'P'], [3, 'tbsp', 'honey', 'A'], [2, 'tbsp', 'low-sodium soy sauce', 'A'], [2, 'tbsp', 'olive oil', 'S'], [1, 'tsp', 'salt', 'S']],
    prep: { v: ['Cut the carrots into sticks.', 'Mince the garlic.'], m: ['Pat the drumsticks dry.'] },
    ahead: ['Cut the carrots.', 'Mix the honey, soy sauce and garlic.'],
    steps: ['Heat the oven to 425°F. Toss drumsticks and carrots with oil and salt on a sheet pan.', 'Roast 25 minutes.', 'Brush the drumsticks with honey, soy sauce and garlic. Roast 10 to 15 minutes more, until they reach 165°F.'] }),
  // ---------- Beef ----------
  R({ id: 'beef-tacos', name: 'Weeknight beef tacos', diet: 'meat', protein: 'beef', time: 25, contains: ['dairy'], safe: 'ground',
    blurb: 'Taco night in 25 minutes.',
    ing: [[1, 'lb', 'ground beef', 'M'], [1, '', 'yellow onion', 'P'], [1, '', 'small head iceberg lettuce', 'P'], [2, '', 'tomatoes', 'P'], [1, '', 'lime', 'P'], [2, 'tsp', 'chili powder', 'S'], [1, 'tsp', 'ground cumin', 'S'], [1, 'tsp', 'salt', 'S'], [8, '', 'corn tortillas (6-inch)', 'B'], [1, 'cup', 'shredded cheddar', 'D']],
    prep: { v: ['Dice the onion and tomatoes.', 'Shred the lettuce.', 'Cut the lime into wedges.'], c: ['Shred the cheddar if it isn’t pre-shredded.'] },
    ahead: ['Dice the onion and tomatoes, shred the lettuce.'],
    steps: ['Brown the beef with the onion in a skillet, breaking it up, until it reaches 160°F. Drain the fat.', 'Stir in chili powder, cumin, salt and 1/3 cup water. Simmer 3 minutes.', 'Warm the tortillas and fill with beef, lettuce, tomatoes and cheese. Squeeze lime on top.'] }),
  R({ id: 'beef-and-broccoli', name: 'Beef and broccoli with rice', diet: 'meat', protein: 'beef', time: 30, contains: ['soy', 'gluten'], safe: 'whole',
    blurb: 'Thin-sliced steak, glossy sauce.',
    ing: [[1.5, 'cup', 'long-grain white rice', 'A'], [1, 'lb', 'flank steak', 'M'], [12, 'oz', 'broccoli florets', 'P'], [3, 'clove', 'garlic', 'P'], [1, 'tbsp', 'fresh ginger, grated', 'P'], [0.25, 'cup', 'low-sodium soy sauce', 'A'], [1, 'tbsp', 'brown sugar', 'A'], [1, 'tbsp', 'cornstarch', 'A'], [2, 'tbsp', 'neutral oil', 'S']],
    prep: { v: ['Cut the broccoli into florets.', 'Mince the garlic and grate the ginger.'], m: ['Slice the steak thinly across the grain.'] },
    ahead: ['Cut the broccoli and mix the sauce.'],
    steps: ['Cook the rice following the package.', 'Mix soy sauce, brown sugar and cornstarch with 1/3 cup water.', 'Sear the beef in 1 tbsp oil over high heat, in batches, 2 minutes per batch, to 145°F. Move to a plate.', 'Cook the broccoli in the rest of the oil with 2 tbsp water, 3 minutes. Add garlic and ginger, then the beef and sauce. Stir until glossy.'] }),
  R({ id: 'spaghetti-meat-sauce', name: 'Spaghetti with meat sauce', diet: 'meat', protein: 'beef', time: 40, contains: ['gluten', 'dairy'], safe: 'ground',
    blurb: 'The one everybody eats.',
    ing: [[1, 'lb', 'ground beef', 'M'], [1, '', 'yellow onion', 'P'], [3, 'clove', 'garlic', 'P'], [1, 'can', 'crushed tomatoes (28 oz)', 'A'], [12, 'oz', 'spaghetti', 'A'], [1, 'tsp', 'dried basil', 'S'], [1, 'tbsp', 'olive oil', 'S'], [1, 'tsp', 'salt', 'S'], [0.5, 'cup', 'grated parmesan', 'D']],
    prep: { v: ['Dice the onion and mince the garlic.'], c: ['Grate the parmesan.'] },
    ahead: ['Dice the onion. The sauce itself keeps 3 to 4 days in the fridge.'],
    steps: ['Cook the onion in oil 5 minutes. Add the beef and brown it to 160°F, then the garlic for 1 minute.', 'Add tomatoes, basil and salt. Simmer 20 minutes.', 'Meanwhile boil the spaghetti. Toss with the sauce and top with parmesan.'] }),
  R({ id: 'sirloin-potatoes-salad', name: 'Seared sirloin with crispy potatoes and salad', diet: 'meat', protein: 'beef', time: 40, contains: [], safe: 'whole',
    blurb: 'A steak night without a grill.',
    ing: [[1.5, 'lb', 'top sirloin steak', 'M'], [1.5, 'lb', 'baby potatoes', 'P'], [5, 'oz', 'mixed salad greens', 'P'], [1, 'pint', 'cherry tomatoes', 'P'], [2, 'sprig', 'fresh rosemary', 'P'], [2, 'tbsp', 'red wine vinegar', 'A'], [4, 'tbsp', 'olive oil', 'S'], [1.5, 'tsp', 'salt', 'S'], [0.5, 'tsp', 'black pepper', 'S']],
    prep: { v: ['Halve the potatoes and tomatoes.', 'Chop the rosemary.'], m: ['Pat the steak dry and season it.'] },
    ahead: ['Halve the tomatoes and whisk the dressing: vinegar, 2 tbsp oil, salt.'],
    steps: ['Heat the oven to 425°F. Roast the potatoes with 1 tbsp oil, rosemary and salt for 30 minutes.', 'Sear the steak in 1 tbsp oil over high heat, 4 to 5 minutes per side, to 145°F. Rest 3 minutes, then slice across the grain.', 'Toss the greens and tomatoes with vinegar, oil and salt. Serve with the steak and potatoes.'] }),
  // ---------- Pork ----------
  R({ id: 'pork-tenderloin-sweet-potato', name: 'Pork tenderloin with sweet potatoes and apples', diet: 'meat', protein: 'pork', time: 45, contains: [], safe: 'whole',
    blurb: 'Sweet, savory, one pan.',
    ing: [[1.25, 'lb', 'pork tenderloin', 'M'], [2, '', 'sweet potatoes', 'P'], [2, '', 'apples', 'P'], [1, '', 'red onion', 'P'], [2, 'tbsp', 'Dijon mustard', 'A'], [1, 'tsp', 'dried thyme', 'S'], [2, 'tbsp', 'olive oil', 'S'], [1, 'tsp', 'salt', 'S']],
    prep: { v: ['Cube the sweet potatoes.', 'Core and slice the apples, cut the onion into wedges.'], m: ['Trim the silver skin from the pork.'] },
    ahead: ['Cube the sweet potatoes.'],
    steps: ['Heat the oven to 425°F. Toss sweet potatoes and onion with oil, thyme and salt. Roast 10 minutes.', 'Rub the pork with mustard and salt and set it on the pan with the apples.', 'Roast 20 to 25 minutes, until the pork reaches 145°F. Rest 3 minutes and slice.'] }),
  R({ id: 'pork-fried-rice', name: 'Pork fried rice', diet: 'meat', protein: 'pork', time: 30, contains: ['egg', 'soy', 'gluten', 'sesame'], safe: 'whole',
    blurb: 'Best with rice cooked the day before.',
    ing: [[1.5, 'cup', 'long-grain white rice', 'A', 'cook a day ahead'], [12, 'oz', 'boneless pork loin chops', 'M'], [3, '', 'eggs', 'D'], [1.5, 'cup', 'frozen peas and carrots', 'F'], [4, '', 'green onions', 'P'], [2, 'clove', 'garlic', 'P'], [3, 'tbsp', 'low-sodium soy sauce', 'A'], [1, 'tbsp', 'toasted sesame oil', 'S'], [2, 'tbsp', 'neutral oil', 'S']],
    prep: { v: ['Slice the green onions, mince the garlic.'], m: ['Cut the pork into small cubes.'] },
    ahead: ['Cook the rice and chill it uncovered, then cover.', 'Slice the green onions.'],
    steps: ['Cook the pork in 1 tbsp oil over high heat until it reaches 145°F. Move to a plate.', 'Scramble the eggs in the pan, then set aside with the pork.', 'Add the rest of the oil, the cold rice and frozen vegetables. Cook 5 minutes, stirring.', 'Add garlic, soy sauce, sesame oil, pork, eggs and green onions. Toss and serve.'] }),
  R({ id: 'pork-chops-mash', name: 'Pork chops with mashed potatoes and green beans', diet: 'meat', protein: 'pork', time: 40, contains: ['dairy'], safe: 'whole',
    blurb: 'Comfort food that fits a Tuesday.',
    ing: [[4, '', 'boneless pork chops (1 inch thick)', 'M'], [2, 'lb', 'Yukon Gold potatoes', 'P'], [12, 'oz', 'green beans', 'P'], [2, 'clove', 'garlic', 'P'], [4, 'tbsp', 'butter', 'D'], [0.5, 'cup', 'milk', 'D'], [1, 'tbsp', 'olive oil', 'S'], [1.5, 'tsp', 'salt', 'S'], [0.5, 'tsp', 'black pepper', 'S']],
    prep: { v: ['Peel and cube the potatoes.', 'Trim the green beans, mince the garlic.'], m: ['Pat the chops dry and season them.'] },
    ahead: ['Trim the green beans.'],
    steps: ['Boil the potatoes in salted water 15 minutes until tender. Drain and mash with 3 tbsp butter and the milk.', 'Sear the chops in oil over medium-high heat 4 to 5 minutes per side, to 145°F. Rest 3 minutes.', 'Cook the green beans in the same pan with the rest of the butter, garlic and 2 tbsp water, 5 minutes.'] }),
  // ---------- Turkey ----------
  R({ id: 'turkey-chili', name: 'Turkey and bean chili', diet: 'meat', protein: 'turkey', time: 45, contains: [], safe: 'poultry',
    blurb: 'Make it Sunday, eat it twice.',
    ing: [[1, 'lb', 'ground turkey', 'M'], [1, '', 'yellow onion', 'P'], [1, '', 'bell pepper', 'P'], [3, 'clove', 'garlic', 'P'], [1, 'can', 'diced tomatoes (28 oz)', 'A'], [2, 'can', 'kidney beans (15 oz)', 'A'], [1, 'cup', 'low-sodium chicken broth', 'A'], [2, 'tbsp', 'chili powder', 'S'], [1, 'tsp', 'ground cumin', 'S'], [1, 'tbsp', 'olive oil', 'S'], [1, 'tsp', 'salt', 'S']],
    prep: { v: ['Dice the onion and pepper, mince the garlic.'], m: [] },
    ahead: ['Dice the onion and pepper. The whole chili keeps 3 to 4 days in the fridge.'],
    steps: ['Cook the onion and pepper in oil 5 minutes.', 'Add the turkey and cook, breaking it up, to 165°F. Add garlic, chili powder and cumin for 1 minute.', 'Add tomatoes, drained beans and broth. Simmer 25 minutes, season and serve.'] }),
  R({ id: 'turkey-meatballs-orzo', name: 'Turkey meatballs with lemony zucchini orzo', diet: 'meat', protein: 'turkey', time: 40, contains: ['egg', 'gluten', 'dairy'], safe: 'poultry',
    blurb: 'Light, lemony, kid-friendly.',
    ing: [[1, 'lb', 'ground turkey', 'M'], [1, '', 'egg', 'D'], [0.33, 'cup', 'plain breadcrumbs', 'A'], [0.5, 'cup', 'grated parmesan', 'D'], [2, 'clove', 'garlic', 'P'], [2, '', 'zucchini', 'P'], [1, '', 'lemon', 'P'], [1.5, 'cup', 'orzo', 'A'], [2, 'tbsp', 'olive oil', 'S'], [1, 'tsp', 'salt', 'S']],
    prep: { v: ['Dice the zucchini, mince the garlic, zest the lemon.'], c: ['Grate the parmesan.'] },
    ahead: ['Dice the zucchini.'],
    steps: ['Heat the oven to 425°F. Mix turkey, egg, breadcrumbs, half the parmesan, garlic and salt. Roll 16 meatballs.', 'Bake on an oiled sheet 15 to 18 minutes, to 165°F.', 'Boil the orzo following the package. Sauté the zucchini in oil 4 minutes.', 'Toss orzo, zucchini, lemon zest and juice and the rest of the parmesan. Serve with the meatballs.'] }),
  // ---------- Fish and shellfish ----------
  R({ id: 'salmon-asparagus', name: 'Sheet-pan salmon with asparagus', diet: 'fish', protein: 'fish', time: 25, contains: ['fish'], safe: 'fish',
    blurb: 'Twenty-five minutes, one pan.',
    ing: [[4, '', 'salmon fillets (6 oz each)', 'M'], [1, 'lb', 'asparagus', 'P'], [1, '', 'lemon', 'P'], [2, 'clove', 'garlic', 'P'], [2, 'tbsp', 'olive oil', 'S'], [1, 'tsp', 'dried dill', 'S'], [1, 'tsp', 'salt', 'S']],
    prep: { v: ['Snap the woody ends off the asparagus.', 'Slice the lemon, mince the garlic.'], m: ['Pat the salmon dry.'] },
    ahead: ['Trim the asparagus.'],
    steps: ['Heat the oven to 400°F. Toss the asparagus with half the oil and salt on a sheet pan.', 'Set the salmon on the pan, brush with the rest of the oil, garlic and dill, and top with lemon slices.', 'Roast 12 to 15 minutes, until the salmon reaches 145°F and flakes easily.'] }),
  R({ id: 'fish-tacos-slaw', name: 'Fish tacos with lime cabbage slaw', diet: 'fish', protein: 'fish', time: 30, contains: ['fish', 'egg'], safe: 'fish',
    blurb: 'Crunchy, bright, Friday-worthy.',
    ing: [[1.5, 'lb', 'cod fillets', 'M'], [1, '', 'small head red cabbage', 'P'], [2, '', 'limes', 'P'], [1, 'bunch', 'cilantro', 'P'], [1, '', 'avocado', 'P'], [0.33, 'cup', 'mayonnaise', 'A'], [2, 'tsp', 'chili powder', 'S'], [1, 'tsp', 'ground cumin', 'S'], [1, 'tbsp', 'neutral oil', 'S'], [1, 'tsp', 'salt', 'S'], [8, '', 'corn tortillas (6-inch)', 'B']],
    prep: { v: ['Thinly slice half the cabbage.', 'Chop the cilantro, slice the avocado, juice the limes.'], m: ['Cut the cod into 4 pieces.'] },
    ahead: ['Slice the cabbage and make the slaw dressing: mayonnaise, lime juice, salt.'],
    steps: ['Toss the cabbage with mayonnaise, half the lime juice, cilantro and salt.', 'Season the cod with chili powder, cumin and salt. Cook in oil over medium-high heat 3 to 4 minutes per side, to 145°F.', 'Flake the fish into warm tortillas, top with slaw and avocado.'] }),
  R({ id: 'shrimp-garlic-linguine', name: 'Garlic shrimp linguine with spinach', diet: 'fish', protein: 'shellfish', time: 25, contains: ['shellfish', 'gluten', 'dairy'], safe: 'shellfish',
    blurb: 'Restaurant feel, weeknight effort.',
    ing: [[1, 'lb', 'large shrimp, peeled and deveined', 'M'], [12, 'oz', 'linguine', 'A'], [4, 'clove', 'garlic', 'P'], [1, '', 'lemon', 'P'], [5, 'oz', 'baby spinach', 'P'], [1, 'bunch', 'parsley', 'P'], [3, 'tbsp', 'butter', 'D'], [0.25, 'tsp', 'red pepper flakes', 'S'], [1, 'tbsp', 'olive oil', 'S'], [1, 'tsp', 'salt', 'S']],
    prep: { v: ['Slice the garlic, chop the parsley, zest and juice the lemon.'], m: ['Pat the shrimp dry.'] },
    ahead: ['Chop the parsley.'],
    steps: ['Boil the linguine in salted water. Save 1/2 cup of the water.', 'Cook the shrimp in oil over medium-high heat 2 minutes per side, until pink and opaque. Move to a plate.', 'Melt the butter with garlic and pepper flakes, 1 minute. Add spinach until wilted.', 'Toss in the pasta, shrimp, lemon and a splash of pasta water. Finish with parsley.'] }),
  R({ id: 'cod-tomatoes-olives', name: 'Baked cod with tomatoes, olives and couscous', diet: 'fish', protein: 'fish', time: 30, contains: ['fish', 'gluten'], safe: 'fish',
    blurb: 'Mediterranean, mostly hands-off.',
    ing: [[1.5, 'lb', 'cod fillets', 'M'], [1, 'pint', 'cherry tomatoes', 'P'], [2, 'clove', 'garlic', 'P'], [1, '', 'lemon', 'P'], [0.5, 'cup', 'pitted kalamata olives', 'A'], [1, 'cup', 'couscous', 'A'], [2, 'tbsp', 'olive oil', 'S'], [1, 'tsp', 'dried oregano', 'S'], [1, 'tsp', 'salt', 'S']],
    prep: { v: ['Halve the tomatoes, slice the garlic.', 'Halve the olives, slice the lemon.'], m: ['Cut the cod into 4 pieces.'] },
    ahead: ['Halve the tomatoes and olives.'],
    steps: ['Heat the oven to 400°F. Toss tomatoes, olives, garlic, oregano and oil in a baking dish. Roast 10 minutes.', 'Nestle the cod in the dish, top with lemon and salt. Bake 12 to 15 minutes, to 145°F.', 'Meanwhile make the couscous following the package. Serve with the fish and pan juices.'] }),
  R({ id: 'salmon-rice-bowls', name: 'Salmon rice bowls with cucumber and edamame', diet: 'fish', protein: 'fish', time: 30, contains: ['fish', 'soy', 'gluten', 'sesame'], safe: 'fish',
    blurb: 'A sushi-bar bowl at home.',
    ing: [[1.5, 'cup', 'short-grain rice', 'A'], [1.25, 'lb', 'salmon fillets', 'M'], [1, '', 'cucumber', 'P'], [2, '', 'carrots', 'P'], [1, '', 'avocado', 'P'], [2, '', 'green onions', 'P'], [1, 'cup', 'frozen shelled edamame', 'F'], [2, 'tbsp', 'low-sodium soy sauce', 'A'], [1, 'tbsp', 'rice vinegar', 'A'], [1, 'tsp', 'toasted sesame oil', 'S']],
    prep: { v: ['Slice the cucumber, grate the carrots.', 'Slice the avocado and green onions.'], m: ['Pat the salmon dry.'] },
    ahead: ['Slice the cucumber, grate the carrots.'],
    steps: ['Cook the rice following the package. Cook the edamame in boiling water 3 minutes.', 'Roast the salmon at 400°F 12 to 15 minutes, to 145°F. Flake it.', 'Mix soy sauce, vinegar and sesame oil.', 'Fill bowls with rice, salmon and the vegetables. Drizzle the sauce.'] }),
  R({ id: 'lemon-tilapia-broccoli', name: 'Lemon-butter tilapia with broccoli and rice', diet: 'fish', protein: 'fish', time: 25, contains: ['fish', 'dairy'], safe: 'fish',
    blurb: 'Mild fish the whole table likes.',
    ing: [[1.5, 'cup', 'long-grain white rice', 'A'], [4, '', 'tilapia fillets (6 oz each)', 'M'], [12, 'oz', 'broccoli florets', 'P'], [1, '', 'lemon', 'P'], [2, 'tbsp', 'butter', 'D'], [1, 'tsp', 'paprika', 'S'], [1, 'tbsp', 'olive oil', 'S'], [1, 'tsp', 'salt', 'S']],
    prep: { v: ['Cut the broccoli into florets, juice the lemon.'], m: ['Pat the tilapia dry.'] },
    ahead: ['Cut the broccoli.'],
    steps: ['Cook the rice following the package. Steam or roast the broccoli.', 'Season the fish with paprika and salt. Cook in oil over medium-high heat 2 to 3 minutes per side, to 145°F.', 'Add butter and lemon juice to the pan and spoon it over the fish.'] }),
  R({ id: 'tuna-white-bean-salad', name: 'Tuna and white bean salad with toasted bread', diet: 'fish', protein: 'fish', time: 15, contains: ['fish', 'gluten'], safe: null,
    blurb: 'No-cook night.',
    ing: [[2, 'can', 'tuna in olive oil (5 oz)', 'A'], [2, 'can', 'cannellini beans (15 oz)', 'A'], [0.5, '', 'red onion', 'P'], [1, 'pint', 'cherry tomatoes', 'P'], [1, 'bunch', 'parsley', 'P'], [1, '', 'lemon', 'P'], [3, 'tbsp', 'olive oil', 'S'], [0.5, 'tsp', 'salt', 'S'], [1, '', 'loaf crusty bread', 'B']],
    prep: { v: ['Thinly slice the onion, halve the tomatoes, chop the parsley.'], c: ['Slice the bread and toast it.'] },
    ahead: ['Slice the onion and soak it in cold water to soften it.'],
    steps: ['Rinse and drain the beans.', 'Toss beans, tuna, onion, tomatoes and parsley with lemon juice, oil and salt.', 'Serve with the toasted bread.'] }),
  // ---------- Vegetarian ----------
  R({ id: 'black-bean-quesadillas', name: 'Black bean quesadillas with corn salsa', diet: 'vegetarian', protein: 'plant', time: 20, contains: ['gluten', 'dairy'], safe: null,
    blurb: 'Crisp outside, melty inside.',
    ing: [[2, 'can', 'black beans (15 oz)', 'A'], [8, '', 'flour tortillas (8-inch)', 'B'], [8, 'oz', 'Monterey Jack cheese', 'D'], [1, 'cup', 'frozen corn', 'F'], [1, '', 'red bell pepper', 'P'], [0.5, '', 'red onion', 'P'], [1, '', 'lime', 'P'], [1, '', 'avocado', 'P'], [1, 'tsp', 'ground cumin', 'S'], [0.5, 'tsp', 'salt', 'S']],
    prep: { v: ['Dice the pepper and onion, cube the avocado.'], c: ['Shred the cheese.'] },
    ahead: ['Make the salsa: corn, pepper, onion, lime, salt.'],
    steps: ['Mash the drained beans with cumin and salt.', 'Mix the thawed corn with pepper, onion, lime juice and salt for the salsa.', 'Spread beans and cheese on half of each tortilla, fold, and cook in a dry skillet 2 to 3 minutes per side.', 'Cut into wedges and serve with salsa and avocado.'] }),
  R({ id: 'vegetable-frittata', name: 'Vegetable frittata with green salad', diet: 'vegetarian', protein: 'egg', time: 30, contains: ['egg', 'dairy'], safe: 'egg',
    blurb: 'Uses up the vegetables in the fridge.',
    ing: [[8, '', 'eggs', 'D'], [0.5, 'cup', 'milk', 'D'], [0.5, 'cup', 'grated parmesan', 'D'], [1, '', 'zucchini', 'P'], [1, '', 'red bell pepper', 'P'], [0.5, '', 'yellow onion', 'P'], [5, 'oz', 'baby spinach', 'P'], [5, 'oz', 'mixed salad greens', 'P'], [2, 'tbsp', 'olive oil', 'S'], [1, 'tsp', 'salt', 'S']],
    prep: { v: ['Dice the zucchini, pepper and onion.'], c: ['Grate the parmesan.'] },
    ahead: ['Dice the zucchini, pepper and onion.'],
    steps: ['Heat the oven to 400°F. Whisk eggs, milk, parmesan and salt.', 'Cook the vegetables in oil in an oven-safe skillet 6 minutes, add spinach until wilted.', 'Pour in the eggs, cook 2 minutes, then bake 12 to 15 minutes, until set in the center (160°F).', 'Serve in wedges with the greens.'] }),
  R({ id: 'caprese-flatbreads', name: 'Tomato and mozzarella flatbreads with arugula', diet: 'vegetarian', protein: 'plant', time: 20, contains: ['gluten', 'dairy'], safe: null,
    blurb: 'Pizza night, fresher.',
    ing: [[4, '', 'naan or flatbreads', 'B'], [8, 'oz', 'fresh mozzarella', 'D'], [3, '', 'tomatoes', 'P'], [1, 'bunch', 'basil', 'P'], [5, 'oz', 'arugula', 'P'], [3, 'tbsp', 'olive oil', 'S'], [1, 'tbsp', 'balsamic vinegar', 'A'], [0.5, 'tsp', 'salt', 'S']],
    prep: { v: ['Slice the tomatoes, pick the basil leaves.'], c: ['Slice the mozzarella.'] },
    ahead: [],
    steps: ['Heat the oven to 450°F. Brush the flatbreads with oil.', 'Top with tomatoes and mozzarella. Bake 8 to 10 minutes.', 'Finish with basil. Toss the arugula with oil, balsamic and salt and serve alongside.'] }),
  R({ id: 'pasta-primavera', name: 'Pasta primavera', diet: 'vegetarian', protein: 'plant', time: 30, contains: ['gluten', 'dairy'], safe: null,
    blurb: 'All the green things, one bowl.',
    ing: [[12, 'oz', 'penne', 'A'], [1, '', 'zucchini', 'P'], [1, '', 'yellow squash', 'P'], [1, 'pint', 'cherry tomatoes', 'P'], [3, 'clove', 'garlic', 'P'], [1, '', 'lemon', 'P'], [1, 'cup', 'frozen peas', 'F'], [0.5, 'cup', 'grated parmesan', 'D'], [3, 'tbsp', 'olive oil', 'S'], [1, 'tsp', 'salt', 'S']],
    prep: { v: ['Cut the zucchini and squash into half-moons, halve the tomatoes, slice the garlic.'], c: ['Grate the parmesan.'] },
    ahead: ['Cut the zucchini and squash.'],
    steps: ['Boil the penne; add the peas for the last 2 minutes. Save 1/2 cup of the water.', 'Cook zucchini and squash in oil 5 minutes, add tomatoes and garlic for 2 minutes.', 'Toss with the pasta, lemon, parmesan and a splash of pasta water.'] }),
  R({ id: 'baked-ziti-spinach', name: 'Baked ziti with spinach', diet: 'vegetarian', protein: 'plant', time: 50, contains: ['gluten', 'dairy'], safe: null,
    blurb: 'Bake once, lunch tomorrow.',
    ing: [[1, 'lb', 'ziti', 'A'], [1, 'jar', 'marinara sauce (24 oz)', 'A'], [15, 'oz', 'ricotta', 'D'], [8, 'oz', 'mozzarella', 'D'], [0.5, 'cup', 'grated parmesan', 'D'], [5, 'oz', 'baby spinach', 'P'], [2, 'clove', 'garlic', 'P'], [0.5, 'tsp', 'salt', 'S']],
    prep: { v: ['Chop the spinach, mince the garlic.'], c: ['Shred the mozzarella, grate the parmesan.'] },
    ahead: ['Assemble the whole dish, cover and refrigerate; bake 10 minutes longer.'],
    steps: ['Heat the oven to 375°F. Boil the ziti 2 minutes less than the package says.', 'Mix ricotta, spinach, garlic, half the parmesan and salt.', 'Toss the pasta with sauce and the ricotta mix. Top with mozzarella and the rest of the parmesan.', 'Bake 20 to 25 minutes, until bubbling.'] }),
  R({ id: 'veggie-egg-fried-rice', name: 'Vegetable egg fried rice', diet: 'vegetarian', protein: 'egg', time: 20, contains: ['egg', 'soy', 'gluten', 'sesame'], safe: null,
    blurb: 'Twenty minutes with yesterday’s rice.',
    ing: [[1.5, 'cup', 'long-grain white rice', 'A', 'cook a day ahead'], [4, '', 'eggs', 'D'], [2, 'cup', 'frozen mixed vegetables', 'F'], [4, '', 'green onions', 'P'], [2, 'clove', 'garlic', 'P'], [3, 'tbsp', 'low-sodium soy sauce', 'A'], [1, 'tsp', 'toasted sesame oil', 'S'], [2, 'tbsp', 'neutral oil', 'S']],
    prep: { v: ['Slice the green onions, mince the garlic.'] },
    ahead: ['Cook the rice and chill it.'],
    steps: ['Scramble the eggs in 1 tbsp oil until fully cooked; set aside.', 'Cook the cold rice and frozen vegetables in the rest of the oil over high heat 5 minutes.', 'Add garlic, soy sauce, sesame oil, eggs and green onions. Toss and serve.'] }),
  R({ id: 'caprese-grilled-cheese-soup', name: 'Mozzarella grilled cheese with tomato soup', diet: 'vegetarian', protein: 'plant', time: 30, contains: ['gluten', 'dairy'], safe: null,
    blurb: 'A rainy-day classic, from scratch.',
    ing: [[8, '', 'slices sourdough bread', 'B'], [8, 'oz', 'fresh mozzarella', 'D'], [2, 'tbsp', 'butter', 'D'], [0.25, 'cup', 'heavy cream', 'D'], [1, 'can', 'crushed tomatoes (28 oz)', 'A'], [2, 'cup', 'low-sodium vegetable broth', 'A'], [1, '', 'yellow onion', 'P'], [2, 'clove', 'garlic', 'P'], [1, 'bunch', 'basil', 'P'], [1, 'tbsp', 'olive oil', 'S'], [1, 'tsp', 'salt', 'S']],
    prep: { v: ['Dice the onion, mince the garlic, pick the basil.'], c: ['Slice the bread and the mozzarella.'] },
    ahead: ['Make the soup; it keeps 3 to 4 days in the fridge.'],
    steps: ['Cook onion in oil 5 minutes, add garlic 1 minute, then tomatoes and broth. Simmer 15 minutes.', 'Blend until smooth, stir in the cream and salt.', 'Fill the bread with mozzarella and basil, butter the outside, and cook in a skillet 3 minutes per side.'] }),
  // ---------- Vegan ----------
  R({ id: 'chickpea-spinach-curry', name: 'Chickpea and spinach curry with rice', diet: 'vegan', protein: 'plant', time: 35, contains: [], safe: null,
    blurb: 'Pantry cans, big flavor.',
    ing: [[1.5, 'cup', 'basmati rice', 'A'], [2, 'can', 'chickpeas (15 oz)', 'A'], [1, 'can', 'coconut milk (13.5 oz)', 'A'], [1, 'can', 'diced tomatoes (14.5 oz)', 'A'], [1, '', 'yellow onion', 'P'], [3, 'clove', 'garlic', 'P'], [1, 'tbsp', 'fresh ginger, grated', 'P'], [5, 'oz', 'baby spinach', 'P'], [2, 'tbsp', 'curry powder', 'S'], [2, 'tbsp', 'neutral oil', 'S'], [1, 'tsp', 'salt', 'S']],
    prep: { v: ['Dice the onion, mince the garlic, grate the ginger.'] },
    ahead: ['Dice the onion. The curry keeps 3 to 4 days in the fridge.'],
    steps: ['Cook the rice following the package.', 'Cook the onion in oil 5 minutes. Add garlic, ginger and curry powder for 1 minute.', 'Add drained chickpeas, tomatoes and coconut milk. Simmer 15 minutes.', 'Stir in the spinach until wilted. Season and serve over rice.'] }),
  R({ id: 'sweet-potato-black-bean-tacos', name: 'Sweet potato and black bean tacos', diet: 'vegan', protein: 'plant', time: 35, contains: [], safe: null,
    blurb: 'Roasty, smoky, filling.',
    ing: [[2, '', 'sweet potatoes', 'P'], [1, '', 'red onion', 'P'], [1, '', 'avocado', 'P'], [1, '', 'lime', 'P'], [1, 'bunch', 'cilantro', 'P'], [1, 'can', 'black beans (15 oz)', 'A'], [2, 'tsp', 'chili powder', 'S'], [1, 'tsp', 'ground cumin', 'S'], [2, 'tbsp', 'olive oil', 'S'], [1, 'tsp', 'salt', 'S'], [8, '', 'corn tortillas (6-inch)', 'B']],
    prep: { v: ['Cube the sweet potatoes, slice the onion.', 'Slice the avocado, chop the cilantro.'] },
    ahead: ['Cube the sweet potatoes.'],
    steps: ['Heat the oven to 425°F. Roast sweet potatoes and onion with oil, chili powder, cumin and salt, 25 minutes.', 'Warm the drained beans.', 'Fill warm tortillas with sweet potatoes, beans, avocado and cilantro. Squeeze lime on top.'] }),
  R({ id: 'lentil-vegetable-soup', name: 'Lentil and vegetable soup', diet: 'vegan', protein: 'plant', time: 45, contains: ['gluten'], safe: null,
    blurb: 'Cheap, hearty, freezes well.',
    ing: [[1.5, 'cup', 'brown or green lentils', 'A'], [1, '', 'yellow onion', 'P'], [2, '', 'carrots', 'P'], [2, '', 'celery ribs', 'P'], [3, 'clove', 'garlic', 'P'], [5, 'oz', 'baby spinach', 'P'], [1, 'can', 'diced tomatoes (14.5 oz)', 'A'], [6, 'cup', 'low-sodium vegetable broth', 'A'], [1, 'tsp', 'ground cumin', 'S'], [1, 'tsp', 'smoked paprika', 'S'], [2, 'tbsp', 'olive oil', 'S'], [1, 'tsp', 'salt', 'S'], [1, '', 'loaf crusty bread', 'B', 'check the label if you eat vegan']],
    prep: { v: ['Dice the onion, carrots and celery, mince the garlic.'], c: ['Slice the bread.'] },
    ahead: ['Dice the onion, carrots and celery.'],
    steps: ['Cook onion, carrots and celery in oil 6 minutes. Add garlic and spices 1 minute.', 'Add rinsed lentils, tomatoes and broth. Simmer 25 to 30 minutes, until the lentils are tender.', 'Stir in the spinach, season, and serve with bread.'] }),
  R({ id: 'tofu-vegetable-stir-fry', name: 'Crispy tofu and vegetable stir-fry', diet: 'vegan', protein: 'plant', time: 35, contains: ['soy', 'gluten'], safe: null,
    blurb: 'Crisp tofu, sweet-salty sauce.',
    ing: [[1.5, 'cup', 'long-grain white rice', 'A'], [14, 'oz', 'extra-firm tofu', 'P'], [12, 'oz', 'broccoli florets', 'P'], [1, '', 'red bell pepper', 'P'], [2, '', 'carrots', 'P'], [2, 'clove', 'garlic', 'P'], [1, 'tbsp', 'fresh ginger, grated', 'P'], [3, 'tbsp', 'low-sodium soy sauce', 'A'], [1, 'tbsp', 'maple syrup', 'A'], [2, 'tbsp', 'cornstarch', 'A'], [3, 'tbsp', 'neutral oil', 'S']],
    prep: { v: ['Cut the broccoli, slice the pepper and carrots.', 'Mince the garlic, grate the ginger.'], c: ['Press the tofu dry and cut it into cubes.'] },
    ahead: ['Cut all the vegetables.', 'Press the tofu.'],
    steps: ['Cook the rice following the package.', 'Toss the tofu with 1 tbsp cornstarch and fry in 2 tbsp oil until golden, 8 minutes. Set aside.', 'Stir-fry the vegetables in the rest of the oil 4 minutes; add garlic and ginger.', 'Mix soy sauce, maple syrup, 1 tbsp cornstarch and 1/3 cup water. Add with the tofu and toss until glossy.'] }),
  R({ id: 'roasted-veg-white-bean-pasta', name: 'Roasted vegetable and white bean pasta', diet: 'vegan', protein: 'plant', time: 40, contains: ['gluten'], safe: null,
    blurb: 'The oven does the work.',
    ing: [[12, 'oz', 'penne', 'A'], [1, '', 'eggplant', 'P'], [1, '', 'zucchini', 'P'], [1, '', 'red onion', 'P'], [1, 'pint', 'cherry tomatoes', 'P'], [1, 'bunch', 'basil', 'P'], [1, 'can', 'cannellini beans (15 oz)', 'A'], [1, 'tsp', 'dried Italian seasoning', 'S'], [4, 'tbsp', 'olive oil', 'S'], [1, 'tsp', 'salt', 'S']],
    prep: { v: ['Cube the eggplant and zucchini, cut the onion into wedges.', 'Pick the basil leaves.'] },
    ahead: ['Cube the eggplant and zucchini.'],
    steps: ['Heat the oven to 425°F. Roast eggplant, zucchini, onion and tomatoes with 3 tbsp oil, seasoning and salt, 25 minutes.', 'Boil the penne. Save 1/2 cup of the water.', 'Toss pasta, vegetables, drained beans, the rest of the oil and a splash of pasta water. Finish with basil.'] }),
  R({ id: 'peanut-noodles', name: 'Peanut noodles with crunchy vegetables', diet: 'vegan', protein: 'plant', time: 25, contains: ['peanut', 'soy', 'gluten'], safe: null,
    blurb: 'Great warm or cold for lunch.',
    ing: [[12, 'oz', 'spaghetti or lo mein noodles', 'A'], [0.33, 'cup', 'creamy peanut butter', 'A'], [3, 'tbsp', 'low-sodium soy sauce', 'A'], [1, 'tbsp', 'rice vinegar', 'A'], [1, 'tbsp', 'maple syrup', 'A'], [0.25, 'cup', 'roasted peanuts', 'A'], [1, 'tbsp', 'fresh ginger, grated', 'P'], [1, 'clove', 'garlic', 'P'], [1, '', 'cucumber', 'P'], [2, '', 'carrots', 'P'], [1, '', 'red bell pepper', 'P'], [4, '', 'green onions', 'P']],
    prep: { v: ['Cut the cucumber, carrots and pepper into matchsticks.', 'Slice the green onions, grate the ginger and garlic.'], c: ['Roughly chop the peanuts.'] },
    ahead: ['Cut the vegetables. Whisk the sauce.'],
    steps: ['Boil the noodles; rinse under cold water.', 'Whisk peanut butter, soy sauce, vinegar, maple syrup, ginger, garlic and 1/4 cup hot water.', 'Toss noodles, vegetables and sauce. Top with peanuts and green onions.'] }),
];

// ---------- Helpers ----------
export const DIETS = [
  ['all', 'Everything'], ['pescatarian', 'Fish, no meat'], ['vegetarian', 'Vegetarian'], ['vegan', 'Vegan'],
];
export const AVOID = [
  ['beef', 'Beef'], ['pork', 'Pork'], ['shellfish', 'Shellfish'], ['fish', 'Fish'], ['gluten', 'Gluten'], ['dairy', 'Dairy'], ['egg', 'Eggs'], ['soy', 'Soy'], ['peanut', 'Peanuts'], ['sesame', 'Sesame'],
];
export const TIMES = [[30, '30 min or less'], [45, 'Up to 45 min'], [999, 'Any']];
const DIET_OK = { all: ['meat', 'fish', 'vegetarian', 'vegan'], pescatarian: ['fish', 'vegetarian', 'vegan'], vegetarian: ['vegetarian', 'vegan'], vegan: ['vegan'] };

export const byId = (id) => RECIPES.find((r) => r.id === id);
export function fits(r, prefs) {
  if (!DIET_OK[prefs.diet || 'all'].includes(r.diet)) return false;
  if (r.time > (prefs.maxTime || 999)) return false;
  for (const a of prefs.avoid || []) {
    if (r.protein === a || r.contains.includes(a)) return false;
    if (a === 'fish' && r.protein === 'fish') return false;
  }
  return true;
}

// Seeded shuffle so a plan is stable until the person asks for another.
function rng(seed) { let s = 0; for (const ch of String(seed)) s = (s * 31 + ch.charCodeAt(0)) >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
export function pickDinners(prefs, count, seed, keep = []) {
  const pool = RECIPES.filter((r) => fits(r, prefs));
  const rand = rng(seed);
  const shuffled = pool.map((r) => [rand(), r]).sort((a, b) => a[0] - b[0]).map((x) => x[1]);
  const out = [];
  for (let i = 0; i < count; i++) {
    if (keep[i]) { out.push(keep[i]); continue; }
    const used = new Set(out.filter(Boolean));
    const prev = out[i - 1] && byId(out[i - 1]);
    const choice = shuffled.find((r) => !used.has(r.id) && !keep.includes(r.id) && (!prev || r.protein !== prev.protein))
      || shuffled.find((r) => !used.has(r.id) && !keep.includes(r.id));
    out.push(choice ? choice.id : null);
  }
  return out;
}

// Quantities: scale and print like a cook would (1/2, 1 1/4…).
const FR = [[0, ''], [0.125, '1/8'], [0.25, '1/4'], [0.33, '1/3'], [0.5, '1/2'], [0.66, '2/3'], [0.75, '3/4'], [1, '']];
export function qtyText(q) {
  if (!q) return '';
  const whole = Math.floor(q + 0.02), rest = q - whole;
  let best = FR[0], d = 9;
  for (const f of FR) { const dd = Math.abs(rest - f[0]); if (dd < d) { d = dd; best = f; } }
  const w = best[0] === 1 ? whole + 1 : whole;
  return [w || '', best[0] === 1 ? '' : best[1]].filter(Boolean).join(' ') || '1/8';
}
const PL = { clove: 'cloves', cup: 'cups', can: 'cans', jar: 'jars', bunch: 'bunches', pint: 'pints', sprig: 'sprigs', lb: 'lb', oz: 'oz', tbsp: 'tbsp', tsp: 'tsp' };
export function unitText(q, u) { if (!u) return ''; return q > 1 ? (PL[u] || u + 's') : u; }
export function ingText([q, u, item], scale = 1) {
  const n = Math.round(q * scale * 100) / 100;
  return [qtyText(n), unitText(n, u), item].filter(Boolean).join(' ');
}
// Whole items you can't buy in fractions (2.5 lemons → 3 lemons) round up in the shopping list.
export function listQty(q, u) { return !u || ['can', 'jar', 'bunch', 'pint', 'clove', 'sprig'].includes(u) ? Math.ceil(q - 0.05) : Math.round(q * 100) / 100; }
