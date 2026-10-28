// Notes for the people reviewing the preview. Shown only in the review panel, never in the customer journey.

export const REVIEW = {
  updated: '2026-10-27',
  packages: [
    'yndarena-ingredients-v1: 12 transparent PNG (Love, Like Rosemary). SHA-256 checked against its manifest.',
    'yndarena-media-v2: 33 transparent cutouts, 5 recipe covers, 7 presentation covers, 1 generic wood texture. All AI-generated.',
    'yndarena-everyday-v4: 16 prepared components and 6 meal covers. Replaces everyday-v3, which was never integrated in this preview. SHA-256 and visible bounds match its manifest (22 of 22).',
  ],
  rules: [
    'One registry (src/data/media.js) maps every item and serving style to its cutout. Designer, layout thumbnails, the build-by-layers guide, saved versions, Collection, From home to home and shared links all draw through the same renderer, so no screen can fall back to an old illustration.',
    'Quantities, recipes and shopping lists come from the presentation data. Replacing an illustration with a photo changes none of them. No weight or piece count is read from an image.',
    'Group pieces are fitted inside the same approximate footprint the illustrations used, enlarged by one shared visual factor (1.3), keeping the visible proportions measured on the alpha channel.',
    'Salami and soppressata rivers lay the river cutout along the footprint and repeat it end to end when the footprint is long (the number of copies is visual only). Carrot batons may turn 90° to follow a long footprint. Nothing is stretched.',
    'Long cracker fans overlap more instead of running off the board; short stacks hold four crackers each.',
    'Unit pieces have a fixed visual size on the 600 × 400 board: round cracker 52, seed cracker 54 wide, fig 62 wide, sprig 100 tall. Crackers repeat once per piece in fans and short stacks; the number of crackers follows the amount.',
    'Prosciutto and serrano roses show two or three single-rose cutouts depending on the group size. That count is visual only.',
    'The parchment under the hummus and whipped feta swooshes is part of the cutout and is kept.',
    'Covers are editorial inspiration. The Layout view and the build guide always show the layout data, and the customer sees a note saying so under every inspiration cover.',
    'Board surface: a generic texture clipped to the existing board outline and tinted toward each board’s tone. Geometry and Designer coordinates are unchanged. Replace it per board in BOARD_SURFACES when the product reference exists.',
    'From home to home has no authentic photos: each creation shows its own layout rendered with the cutouts. Generated covers are never shown as a Home’s photo.',
  ],
  checks: [
    'v1: 12 of 12 files match the SHA-256 in their manifest.',
    'v2: files arrived re-encoded as WebP through the chat, so their SHA-256 differs from the manifest. Dimensions match 46 of 46 and the visible bounds (alpha ≥ 32) of the 33 cutouts match the manifest exactly.',
    'All 45 cutouts keep their alpha channel after optimization (checked on each exported file).',
    'Every serving style of the 33 library items resolves to a cutout (see coverage below).',
    'Switching styles and substitutions swaps the cutout and keeps the linked technique.',
    'Moving, rotating, duplicating, undo/redo, saving and reopening versions keep the photographic pieces.',
    'Shopping list totals unchanged after the switch to photos.',
  ],
  // Differences observed between each inspiration cover and the layout data. Not shown to customers.
  coverNotes: {
    'love-like-rosemary-the-sprig': ['Brie in wedges; the layout uses the whole wheel', 'Prosciutto as roses; the layout uses ribbons', 'Pale hard cheese where the layout has aged cheddar'],
    'love-like-rosemary-gathered': ['Hard cheese in triangles; the layout uses cheddar cubes', 'Crackers in two small fans; the layout has one fan of twelve', 'Sprigs spread around the wreath; the layout groups three beside the jam'],
    'golden-hour-salami-river': ['Crackers in one group; the layout runs a line along each shore', 'Prosciutto roses and grapes split in two places; the layout keeps one group of each', 'Portions not weighed'],
    'golden-hour-four-corners': ['Bowls in opposite corners; the layout puts both bowls in the center', 'Brie in wedges; the layout uses the whole wheel', 'Whipped feta in a bowl; the layout uses a swoosh'],
    'sunday-garden-rainbow': ['Hummus in the center; the layout sets it lower', 'Pale cheese cubes where the layout has cheddar', 'Cracker fans on both sides; the layout has one fan along the bottom'],
    'sunday-garden-garden-rows': ['Vertical columns; the layout uses horizontal rows', 'Cucumber in rounds; the layout uses ribbons', 'Rosemary in two corners; the layout has one bunch'],
    'the-copper-pot-long-table': ['Salami in flat rounds, not folded into a river', 'Copper pot outside the board, as a prop', 'Pale cheese where the layout has aged cheddar'],
    'llr-two-halves-top': ['See the Two Halves comparison below'],
  },
  pending: [
    'Everyday meals: amounts and steps are editorial drafts; nothing is kitchen-tested. Covers use generic wood, not Yndarena boards.',
    'Photos on the real Yndarena boards, with weighed portions.',
    'A product reference for each board surface (wood, grain and finish) to replace the generic texture.',
    'Technique videos: 20 clips planned (video-plan.json), none generated. Start with Batons and Strips, Spoon Swoosh, Prosciutto Rose, Salami River and Cucumber Ribbons.',
    'Link to Yndarena’s existing board care video (yndarenahome.com/wood-care).',
    'Step photos for the build guide.',
    'Original PNG files of media-v2, to record matching SHA-256 values.',
  ],
};
