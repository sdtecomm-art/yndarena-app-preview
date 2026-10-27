// Notes for the people reviewing the preview. Shown only in the review panel, never in the customer journey.

export const REVIEW = {
  updated: '2026-10-27',
  package: 'yndarena-ingredients-v1 (12 transparent PNG, AI-generated)',
  rules: [
    'Quantities, recipes and shopping lists come from the presentation data. Replacing an illustration with a photo changes none of them.',
    'Group pieces (jam, brie, cheddar, prosciutto ribbons, grapes, walnuts) are fitted inside the same approximate footprint the illustrations used, enlarged by one shared visual factor (1.3) and keeping the visible proportions of the cutout. No weight is calibrated to an image.',
    'Unit pieces have a fixed visual size on the 600 × 400 board: cracker 52, fig 62 wide, sprig 100 tall. Board dimensions are still pending, so sizes are approximate.',
    'Prosciutto roses show two or three single-rose cutouts depending on the group size. The number of roses drawn is visual only.',
    'Crackers repeat the single cracker cutout once per piece: a fan of six draws six, two fans add up to twelve. Changing the amount changes the number of crackers and the length of the fan, never the size of a cracker.',
    'Figs draw one cutout per fig, each showing its two halves. Rosemary draws one cutout per sprig.',
    'Cutouts are cropped to their visible area before sizing, so the wide transparent margins around the rosemary sprig do not shrink it.',
    'The same renderer draws the editable board, layout thumbnails, the build-by-layers guide, saved versions and shared links.',
    'The wooden board is still the illustrated one: the package does not include the product board.',
    'Ingredients without a cutout (other cheeses, charcuterie, produce and crunch outside this presentation) keep their illustrations everywhere.',
  ],
  checks: [
    '12 of 12 files match the SHA-256 hashes in the manifest.',
    '12 of 12 files have transparent and visible pixels; visible bounds match the manifest.',
    'Optimized WebP copies keep the alpha channel (checked on each file after export).',
    'Two Halves, The Sprig and Gathered: every group resolves to a cutout (see the table below).',
    'Switching cheddar triangles and cubes, brie wedges and whole, prosciutto roses and ribbons swaps the cutout and keeps the linked technique.',
    'Crackers: 6 pieces draw 6 cutouts; the amount stepper adds or removes cutouts.',
    'Moving, rotating, duplicating, undo/redo and saving versions work on photographic groups as on illustrated ones.',
    'Shopping list totals unchanged after the switch to photos.',
  ],
  pending: [
    'Photos on the real Cheese & Bread board, with weighed portions.',
    'Editorial cover separate from the layout photo.',
    'Overhead photos of The Sprig and Gathered.',
    'Step photos for the build guide.',
    'Prosciutto Rose video, poster, step segments and captions.',
    'Cutouts for the rest of the library and for substitutions.',
  ],
};
