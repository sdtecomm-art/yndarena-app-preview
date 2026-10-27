// Video registry for techniques and board care. Built from media-source/media-v2/video-plan.json.
// No clip exists yet: every entry is 'not-generated'. Playback controls appear only for status 'ready'
// with a videoSrc. Until then the technique shows a photo of the result next to the written steps.
// poster: a MEDIA id. It shows the finished result, never the movement.
// scenes: how many separate actions the production plan asks for (see GUIA-VIDEOS-HIGGSFIELD.md).

const pending = (poster, scenes) => ({ status: 'not-generated', videoSrc: null, captionsSrc: null, poster, scenes, segments: [] });

export const VIDEOS = {
  'brie-wedges': pending('brie-four-wedges-fan', 2),
  'cheese-triangles': pending('aged-gouda-triangles-fan', 2),
  'cheese-cubes': pending('manchego-cubes-group', 2),
  'coins-rounds': pending('goat-cheese-coins-group', 2),
  'prosciutto-rose': pending('prosciutto-single-rose', 2),
  'prosciutto-ribbons': pending('prosciutto-ribbon-group', 1),
  'salami-river': pending('salami-river-group', 1),
  'salami-folds': pending('salami-folded-quarters-group', 1),
  'grape-clusters': pending('green-grapes-small-cluster', 1),
  'fig-halves': pending('fresh-fig-two-halves', 1),
  'apple-fan': pending('crisp-apple-slice-fan', 1),
  'crudite-batons': pending('carrot-batons-group', 2),
  'cucumber-ribbons': pending('mini-cucumber-ribbons-group', 2),
  'baguette-slices': pending('baguette-slices-group', 1),
  'cracker-fan': pending('seed-cracker-single', 1),
  'bowls-first': pending('whipped-feta-ivory-bowl', 1),
  'spoon-swoosh': pending('lemon-herb-hummus-parchment-swoosh', 1),
  'filling-gaps': pending('marcona-almonds-pile', 1),
  'herb-garnish': pending('rosemary-single-sprig', 1),
  // Board care reuses Yndarena's existing care video once it is linked (yndarenahome.com/wood-care).
  // The generic wood texture is not a poster of the product, so care has no poster.
  'board-care': { ...pending(null, 1), reuse: 'Existing care video on yndarenahome.com/wood-care, not linked in this preview yet' },
};

// Priority order suggested by the production guide.
export const VIDEO_PRIORITY = ['crudite-batons', 'spoon-swoosh', 'prosciutto-rose', 'salami-river', 'cucumber-ribbons'];

export const videoReady = (v) => !!v && v.status === 'ready' && !!v.videoSrc;
