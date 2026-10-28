// Visual resources, kept apart from the content they illustrate.
// Every asset declares its role, provenance and status so the preview can say what it is.
// Roles: 'cover' (editorial inspiration), 'layout-top' (overhead view of one layout), 'cutout' (transparent
// Designer piece), 'surface' (board texture), 'video' (technique clip, see videos.js).
// Status: 'provisional' (usable for preview, not verified) | 'final' (shot on the real boards, tested).
// Source files and their manifests live in media-source/; the app only bundles optimized copies.
import llrTop1080 from '../media/presentations/llr-two-halves-top-1080.webp';
import llrTop640 from '../media/presentations/llr-two-halves-top-640.webp';
import spines1400 from '../media/product/yndarena-boards-spines-1400.webp';
import spines800 from '../media/product/yndarena-boards-spines-800.webp';

const files = (all) => Object.fromEntries(Object.entries(all).map(([p, url]) => [p.split('/').pop().replace('.webp', ''), url]));
const INGREDIENT_FILES = files(import.meta.glob('../media/ingredients/*.webp', { eager: true, query: '?url', import: 'default' }));
const COVER_FILES = files(import.meta.glob(['../media/recipes/*.webp', '../media/presentations/*.webp'], { eager: true, query: '?url', import: 'default' }));
const SURFACE_FILES = files(import.meta.glob('../media/surfaces/*.webp', { eager: true, query: '?url', import: 'default' }));
const EVERYDAY_FILES = files(import.meta.glob('../media/everyday/*.webp', { eager: true, query: '?url', import: 'default' }));

// Packages the assets came from. v2 files arrived re-encoded as WebP, so their bytes differ from the
// package manifest; their dimensions and visible bounds were checked against it instead.
export const PACKAGES = {
  v1: { name: 'yndarena-ingredients-v1', source: 'media-source/love-like-rosemary/ingredients', hashCheck: 'sha256 matches manifest' },
  v2: { name: 'yndarena-media-v2', source: 'media-source/media-v2', hashCheck: 'received re-encoded; size and visible bounds match manifest' },
  v4: { name: 'yndarena-everyday-v4', source: 'media-source/everyday-v4', hashCheck: 'sha256 and visible bounds match manifest' },
};

// aspect: width / height of the visible food, measured on the alpha channel after cropping.
const cutout = (id, aspect, alt, pkg, extra = {}) => ({
  role: 'cutout', src: (pkg === 'v4' ? EVERYDAY_FILES : INGREDIENT_FILES)[id], aspect, alt, pkg, sourceFile: `${id}.png`,
  provenance: 'ai-generated', status: 'provisional', label: 'AI cutout', ...extra,
});

const mealCover = (id, alt, sha256) => ({
  role: 'cover', kind: 'meal', src: EVERYDAY_FILES[`${id}-1080`], small: EVERYDAY_FILES[`${id}-640`],
  srcSet: `${EVERYDAY_FILES[`${id}-640`]} 640w, ${EVERYDAY_FILES[`${id}-1080`]} 1080w`,
  width: 1080, height: 720, alt, pkg: 'v4', sourceFile: `${id}.png`, sha256,
  provenance: 'ai-generated', status: 'provisional', label: 'AI inspiration',
});

const cover = (id, kind, alt) => ({
  role: 'cover', kind, src: COVER_FILES[`${id}-1080`], small: COVER_FILES[`${id}-640`], srcSet: `${COVER_FILES[`${id}-640`]} 640w, ${COVER_FILES[`${id}-1080`]} 1080w`,
  width: 1080, height: 720, alt, pkg: 'v2', sourceFile: `${id}.png`,
  provenance: 'ai-generated', status: 'provisional', label: 'AI inspiration',
});

export const MEDIA = {
  // The three boards seen from their spines, as on the stand. Rendered from Yndarena's own product reference
  // (brand kit, TABLAS.pdf, "Tables image reference"), turned to lie horizontally. Not AI-generated, not a photo.
  'product-boards-spines': {
    role: 'product', src: spines1400, small: spines800, srcSet: `${spines800} 800w, ${spines1400} 1400w`, width: 1400, height: 296,
    alt: 'The three Yndarena boards stacked: Meat & Fish, Fruits & Vegetables and Cheese & Bread, each with its engraved rosemary',
    provenance: 'brand-reference', sourceFile: 'brand-kit/sources/TABLAS.pdf, page 1', status: 'reference', label: 'Product reference',
  },

  'llr-two-halves-top': {
    role: 'layout-top',
    src: llrTop1080,
    srcSet: `${llrTop640} 640w, ${llrTop1080} 1080w`,
    width: 1080,
    height: 1080,
    alt: 'Overhead photo of a board for two: fig jam in the center, brie, cheddar and prosciutto on each side, grapes, figs, crackers, walnuts and rosemary.',
    provenance: 'ai-generated',
    status: 'provisional',
    label: 'AI reference image',
  },

  // Cutouts, package v1 (Love, Like Rosemary)
  'fig-rosemary-jam-ivory-ramekin': cutout('fig-rosemary-jam-ivory-ramekin', 0.9976, 'Fig jam in an ivory ramekin', 'v1', { sha256: '15d36e0e6e6e4cf041eb2e7ead34133de840eb5788fbfc3aff9a71345727d3da' }),
  'brie-four-wedges-fan': cutout('brie-four-wedges-fan', 1.4141, 'Four brie wedges in a fan', 'v1', { sha256: '4aa3470e6482824f44c1206412639bd7ee6728218d80277762353a9099ae7be0' }),
  'brie-wheel-cut-wedge': cutout('brie-wheel-cut-wedge', 1.0797, 'Whole brie with one wedge cut', 'v1', { sha256: 'f433705efa1345cc89b4ee95a914e1d9b33a27481b1f1a5bf55fdf2d6394b95e' }),
  'cheddar-six-triangles-fan': cutout('cheddar-six-triangles-fan', 1.2651, 'Aged cheddar triangles in a fan', 'v1', { sha256: '5d8c2c02635a721234d3513ef0914b54702615242446c16502e6c9fbfd28d7c2', reused: true }),
  'cheddar-cubes-group': cutout('cheddar-cubes-group', 1.0096, 'Aged cheddar cubes', 'v1', { sha256: '4c7a4b9427c2b7f82c0c551f1d9853b649fab258111f93e741b0591cb4cbade1' }),
  'prosciutto-single-rose': cutout('prosciutto-single-rose', 1.0474, 'A prosciutto rose', 'v1', { sha256: '236d39a714d79d35a8d2b39c3eac06e05159aa340f33faf244b60d658e3e2ca2' }),
  'prosciutto-ribbon-group': cutout('prosciutto-ribbon-group', 1.0553, 'Loose prosciutto ribbons', 'v1', { sha256: 'a211e52f65d65a0099c22bb41eb9125c76f711211b1bd5c73277d09daec172b5' }),
  'red-grapes-small-cluster': cutout('red-grapes-small-cluster', 1.05, 'A small cluster of red grapes', 'v1', { sha256: 'd71697fc0eb7e2747dc6c173ce01d3ba74c00b65b0a017299b5a770254bc84a4' }),
  'fresh-fig-two-halves': cutout('fresh-fig-two-halves', 1.3115, 'One fresh fig cut in two halves', 'v1', { sha256: 'fa5673598ecad44146d5ea395de007a34c012a86e8b6cc0cc4031afb38345687' }),
  'rosemary-honey-walnuts-pile': cutout('rosemary-honey-walnuts-pile', 1.037, 'Rosemary honey walnuts', 'v1', { sha256: '734b8fb7e2cee50212ad149b0bbf8a7a15984573d970548231e8296105276563' }),
  'rosemary-single-sprig': cutout('rosemary-single-sprig', 0.4083, 'A sprig of rosemary', 'v1', { sha256: 'aa3bbfd665b76896799cac68361391df3f06c1b387bb424f4f6cb2cf5e3cccde' }),
  'plain-round-cracker-single': cutout('plain-round-cracker-single', 1.0112, 'A round cracker', 'v1', { sha256: '4b72fe3ec55a3fd2c46c553e7807c8f9290080a4f5df4f8f0d77265be7f4206d' }),

  // Cutouts, package v2 (the rest of the library). sha256 is the manifest value of the original PNG.
  'honey-ivory-bowl': cutout('honey-ivory-bowl', 1.0036, 'Honey in an ivory bowl', 'v2', { sha256: 'ad6764405d00cab0f7405a275160ed005d750e807d5450da5bb83f79249a08a2' }),
  'whipped-feta-ivory-bowl': cutout('whipped-feta-ivory-bowl', 0.9815, 'Whipped feta with honey in an ivory bowl', 'v2', { sha256: 'd47e59252d414e3c16468e4d4e7f399884b36b044d03ac34f3d3089388bdd0b1' }),
  'whipped-feta-parchment-swoosh': cutout('whipped-feta-parchment-swoosh', 0.9415, 'Whipped feta swooshed on parchment', 'v2', { sha256: 'e14a6cb01d06a08136b2e75e3da2870ba29a88b94a99e696c3db99476242dbda', note: 'Parchment is part of the cutout.' }),
  'lemon-herb-hummus-ivory-bowl': cutout('lemon-herb-hummus-ivory-bowl', 1.0041, 'Lemon herb hummus in an ivory bowl', 'v2', { sha256: 'a3dc2fbf67910c90987b3ccf1d6738e8c6fe9b7317d1e0b552301cd98d354806' }),
  'lemon-herb-hummus-parchment-swoosh': cutout('lemon-herb-hummus-parchment-swoosh', 1.2669, 'Lemon herb hummus swooshed on parchment', 'v2', { sha256: '1d9b233d762631800d9f96429b9294f621c1b5c542fc5e991bafb7dc2855e0ec', note: 'Parchment is part of the cutout.' }),
  'citrus-marinated-olives-ivory-bowl': cutout('citrus-marinated-olives-ivory-bowl', 0.9823, 'Citrus marinated olives in an ivory bowl', 'v2', { sha256: '87fe7309450ab4b218a8e28ac7eb6d28f619f46d1137a490f6a785cb19614ea2' }),
  'carrot-batons-group': cutout('carrot-batons-group', 0.8566, 'Carrot batons', 'v2', { sha256: 'c23bfd1fe4b41d100bc36d514ceae36fb24be54b8349eee8e1945211be4bfb50' }),
  'celery-batons-group': cutout('celery-batons-group', 1.0966, 'Celery batons', 'v2', { sha256: '3e5b43c8483550b8f01754060cf3f60b9e06236903440aadffe5f19e2b9a6d6a' }),
  'bell-pepper-strips-group': cutout('bell-pepper-strips-group', 0.9948, 'Yellow bell pepper strips', 'v2', { sha256: 'db5f929525e85610b9f12fad4241c8ea4a088a918f7a603f7669ce64017efc24' }),
  'camembert-wedges-fan': cutout('camembert-wedges-fan', 1.1474, 'Camembert wedges in a fan', 'v2', { sha256: 'b7b050babe49446b6be94af566d864ab54e21059540ac615dada5f27de4aea96' }),
  'camembert-wheel-cut-wedge': cutout('camembert-wheel-cut-wedge', 1.0279, 'Whole camembert with one wedge cut', 'v2', { sha256: '4006e6a669d4bb1cc8ea415bf4a7bb5f30d66b97c149e7daead5185fe8361025' }),
  'manchego-triangles-fan': cutout('manchego-triangles-fan', 1.292, 'Manchego triangles in a fan', 'v2', { sha256: 'ef055afbf078dff026081c6e288c0f90f7dc12d4c99441782c2d064d4ef65690' }),
  'manchego-cubes-group': cutout('manchego-cubes-group', 0.9877, 'Manchego cubes', 'v2', { sha256: '9a8c257530cec2a63a9d4e18d3bedcc549d08008e33f4b9d445c3a5c0d192974' }),
  'aged-gouda-triangles-fan': cutout('aged-gouda-triangles-fan', 1.2363, 'Aged gouda triangles in a fan', 'v2', { sha256: '72474d8419849adfcf5e0fda8abe802e33e80edbc6735c29705cb83cbf6fe928' }),
  'aged-gouda-cubes-group': cutout('aged-gouda-cubes-group', 0.9833, 'Aged gouda cubes', 'v2', { sha256: 'e0e8f2b2766c9e38b7491069d9d967a6ffdd69b45da002be3bbef6ccbb65d4c3' }),
  'goat-cheese-coins-group': cutout('goat-cheese-coins-group', 1.1893, 'Goat cheese coins in a row', 'v2', { sha256: '1073c329baec733f3dc92485082bfe30c5ef06557b01b85fd732c2e03f1f7c0d' }),
  'serrano-single-rose': cutout('serrano-single-rose', 1.006, 'A serrano ham rose', 'v2', { sha256: 'b87e19984ed8c6321644b2f2f265d874583eba2b34d8e468fd3b0bc8b8db689e' }),
  'serrano-ribbon-group': cutout('serrano-ribbon-group', 1.1918, 'Loose serrano ham ribbons', 'v2', { sha256: '5599017e474d7682813226f05fdd074567c28c61b2abecb8f79c0842ce73a1f7' }),
  'salami-river-group': cutout('salami-river-group', 0.8921, 'Folded salami slices in a river', 'v2', { sha256: '6d000c70204d401c2d242ca62ccb1f3afd390469ea9e61af37ce6d35e0bacbd1' }),
  'salami-folded-quarters-group': cutout('salami-folded-quarters-group', 1.4013, 'Salami folded into quarters', 'v2', { sha256: 'deaa70d4f365089db933de00840e908c10e7fb80b21b1de82fbe5f5ce8714a5e' }),
  'soppressata-river-group': cutout('soppressata-river-group', 0.6386, 'Folded soppressata slices in a river', 'v2', { sha256: '3924b3a6af652c0dd06d889803a52d57ccce0bb2fe263230ce7629407d11bba5' }),
  'soppressata-folded-quarters-group': cutout('soppressata-folded-quarters-group', 1.1713, 'Soppressata folded into quarters', 'v2', { sha256: '528968f0e8b81020d42f5edfa36cc9303eefc0ab411edc66c48dafe117448f94' }),
  'green-grapes-small-cluster': cutout('green-grapes-small-cluster', 1.0453, 'A small cluster of green grapes', 'v2', { sha256: '3fd1cefdbbcac2f911cf7930d54664167ad94fdbab15c0d320870d527ebff73e' }),
  'crisp-apple-slice-fan': cutout('crisp-apple-slice-fan', 1.1298, 'Apple slices in a fan', 'v2', { sha256: '989dba6bb323c143c7b8b8d527bd87dfc4f3f640a14215bc61317d1eecab923f' }),
  'ripe-pear-slice-fan': cutout('ripe-pear-slice-fan', 1.0762, 'Pear slices in a fan', 'v2', { sha256: 'ed646f51b665dbba03bc37fddffcac90d07baa2d642fd7ca10c9ee58608e424e' }),
  'strawberries-halved-group': cutout('strawberries-halved-group', 1.0826, 'Halved strawberries', 'v2', { sha256: 'e37962e1cd364c79852137056ad296b3d8d195f9c30a8830ee0190639da47d3c' }),
  'dried-apricots-pile': cutout('dried-apricots-pile', 1.021, 'A pile of dried apricots', 'v2', { sha256: 'ec684cc10e5ca5af0dbaf1f0a980a81e6743386c97d0273beb02b614da9fd276' }),
  'mini-cucumber-rounds-group': cutout('mini-cucumber-rounds-group', 1.1041, 'Mini cucumber rounds', 'v2', { sha256: '7cfdb2a6f1bd4207bbfc80557ba8611255c32e62936b1a80161e27f3d401724c' }),
  'mini-cucumber-ribbons-group': cutout('mini-cucumber-ribbons-group', 1.1498, 'Mini cucumber ribbons', 'v2', { sha256: 'fdf0ce06a07704824a26cb246047a87efd86a75f37c08900a9ba43f3fb90fff1' }),
  'cherry-tomatoes-group': cutout('cherry-tomatoes-group', 1.0291, 'Cherry tomatoes', 'v2', { sha256: '864ceab95e50d670efa5ed67262d4e0c8a0bde781360b831f831045a3358fc86' }),
  'seed-cracker-single': cutout('seed-cracker-single', 1.3008, 'A gluten-free seed cracker', 'v2', { sha256: 'f8d219435a78702f65ddb342508b2add7f636955c7bdb695c9273c17f42ae779' }),
  'baguette-slices-group': cutout('baguette-slices-group', 1.1882, 'Thin baguette slices', 'v2', { sha256: '66e01741e88acaacf16793d0b231f3b82688317694ce0dae408495cf09e2987e' }),
  'marcona-almonds-pile': cutout('marcona-almonds-pile', 1.002, 'A pile of Marcona almonds', 'v2', { sha256: '60f64faa512170514c6bec603638d434cf9746a5f0bf63076a589dbed5f6e007' }),

  // Editorial covers, package v2. Inspiration only: the Layout view stays the source for placement and amounts.
  'recipe-whipped-feta-with-honey': cover('recipe-whipped-feta-with-honey', 'recipe', 'Whipped feta in a bowl with a honey swirl'),
  'recipe-fig-rosemary-jam': cover('recipe-fig-rosemary-jam', 'recipe', 'Fig jam in a ramekin beside a rosemary sprig'),
  'recipe-rosemary-honey-walnuts': cover('recipe-rosemary-honey-walnuts', 'recipe', 'Rosemary honey walnuts in a shallow bowl'),
  'recipe-lemon-herb-hummus': cover('recipe-lemon-herb-hummus', 'recipe', 'Lemon herb hummus with olive oil and parsley'),
  'recipe-citrus-marinated-olives': cover('recipe-citrus-marinated-olives', 'recipe', 'Green and black olives with orange zest and rosemary'),
  'golden-hour-salami-river': cover('golden-hour-salami-river', 'presentation', 'A long board with a salami river, whipped feta, olives, cheeses, apple and grapes'),
  'golden-hour-four-corners': cover('golden-hour-four-corners', 'presentation', 'A board with a different group of cheese, charcuterie and fruit in each corner'),
  'sunday-garden-rainbow': cover('sunday-garden-rainbow', 'presentation', 'Vegetables and fruit arranged by color around a bowl of hummus'),
  'sunday-garden-garden-rows': cover('sunday-garden-garden-rows', 'presentation', 'Vegetables, fruit, cheese cubes and crackers in neat rows beside hummus'),
  'the-copper-pot-long-table': cover('the-copper-pot-long-table', 'presentation', 'A generous board with jam, honey, cheeses, prosciutto, salami, fruit and bread'),
  'love-like-rosemary-the-sprig': cover('love-like-rosemary-the-sprig', 'presentation', 'A diagonal board with jam, brie, figs, grapes, prosciutto roses and crackers'),
  'love-like-rosemary-gathered': cover('love-like-rosemary-gathered', 'presentation', 'A round wreath of cheese, prosciutto, figs and grapes around a bowl of fig jam'),

  // Everyday meals, package v4: prepared components and covers. sha256 matches the package manifest.
  'gnocchi-tomato-basil-bowl': cutout('gnocchi-tomato-basil-bowl', 0.997, 'Gnocchi with tomato sauce and basil in a bowl', 'v4', { sha256: '23b75335697f535775dcb377ea93d0b931a37b9abd69414d45934f7a7cb76057' }),
  'cooked-lemon-chicken-slices': cutout('cooked-lemon-chicken-slices', 1.2095, 'Sliced cooked lemon chicken', 'v4', { sha256: '06d747306fed6ec6a8140dc7792dabe71daf489e70f846c40172a1ce7ec1ed97' }),
  'cooked-steak-slices': cutout('cooked-steak-slices', 1.3938, 'Sliced cooked steak', 'v4', { sha256: 'bfdd394f03b7336e288000435d60e013a5fecbe00cb34693f867050928172a66' }),
  'cooked-salmon-fillet': cutout('cooked-salmon-fillet', 1.493, 'A cooked salmon fillet', 'v4', { sha256: '92ffa7aa6bf3420e4a5794499c39b7a65d28151b75972824f6d333a63e68e6e8' }),
  'cooked-rice-ivory-bowl': cutout('cooked-rice-ivory-bowl', 0.9791, 'Cooked rice in an ivory bowl', 'v4', { sha256: 'a9da993b2fb66aff2ced59457d4c6e4e0bee50e68f236ee1de82b30fe9467515' }),
  'roasted-potato-wedges-group': cutout('roasted-potato-wedges-group', 1.0588, 'Roasted potato wedges', 'v4', { sha256: '47fec2a27093f8098aa54e356e5bb7806a8fb589cfa0f2dd240ddc72e70251ba' }),
  'cooked-green-beans-group': cutout('cooked-green-beans-group', 0.7176, 'Cooked green beans', 'v4', { sha256: '1c4e938cbc2ceb705541f2d976ae183dd71f37c0b30aa8a0d0995fbe8cb81da1' }),
  'chicken-wrap-two-halves': cutout('chicken-wrap-two-halves', 1.447, 'A chicken wrap cut in two halves', 'v4', { sha256: '6202357a198ceda3ecddd45b0f8cd391055cc3fa7250a0a4a9c34ab17f002202' }),
  'tomato-mozzarella-flatbread-four-pieces': cutout('tomato-mozzarella-flatbread-four-pieces', 0.7924, 'Tomato and mozzarella flatbread cut in four', 'v4', { sha256: '4fd80fd4b4edfbd057d20e785a6a222f5164784c00d89aa51a902691459ecabe' }),
  'fresh-basil-three-leaves': cutout('fresh-basil-three-leaves', 1.2419, 'Three fresh basil leaves', 'v4', { sha256: 'a39ccb6137d554fdb6022b8edac189550f44fc38fa43a269f2565dbd824a205b' }),
  'lemon-two-wedges': cutout('lemon-two-wedges', 1.283, 'Two lemon wedges', 'v4', { sha256: '97633cfbcde52b23cb1deff46a66a586a5b06772568539eb4f680ae48036a7e6' }),
  'rustic-bread-slices-group': cutout('rustic-bread-slices-group', 1.2338, 'Slices of rustic bread', 'v4', { sha256: '89e65537d34c52b386a5d55f750bce32e39f173f7c31efb3735d94a8fa501f55' }),
  'tomato-avocado-salad-ivory-bowl': cutout('tomato-avocado-salad-ivory-bowl', 1.0062, 'Tomato and avocado salad in an ivory bowl', 'v4', { sha256: '322450ca2e4a220680f83592840cb19e5ba6e17e1be35a7c4ef4cc16a4c5b123' }),
  'beet-carrot-salad-ivory-bowl': cutout('beet-carrot-salad-ivory-bowl', 0.9952, 'Beet and carrot salad in an ivory bowl', 'v4', { sha256: 'bf9b45a6e943ef4c2e18b2adebd7354d1aa92fdf4218e2597c5f88f619f0b024' }),
  'cabbage-carrot-slaw-ivory-bowl': cutout('cabbage-carrot-slaw-ivory-bowl', 0.999, 'Cabbage and carrot slaw in an ivory bowl', 'v4', { sha256: '24b0c3f61313d02c7ca5e9317e274fabfe4dd82c0dc01baf32d04531325c9420' }),
  'tomato-basil-salad-ivory-bowl': cutout('tomato-basil-salad-ivory-bowl', 0.9852, 'Cherry tomatoes and basil in an ivory bowl', 'v4', { sha256: 'f224e10e77bad3743971a33abc3f5e33f67cd9fa5bd14caf8f133f6009faf3ae' }),
  'everyday-gnocchi-bread-cover': mealCover('everyday-gnocchi-bread-cover', 'A bowl of gnocchi with tomato and basil on a wooden board, with slices of rustic bread', '49b681215df581f99d80c88dfe1db62eaa53d9a9b3b84c357f9c026302e867af'),
  'everyday-lemon-chicken-cover': mealCover('everyday-lemon-chicken-cover', 'Sliced lemon chicken with roasted potatoes, green beans and lemon on a wooden board', 'ad55665d185f18d80986b24e4788292c67f4462f2d6679b58b31358512058335'),
  'everyday-steak-tomato-avocado-cover': mealCover('everyday-steak-tomato-avocado-cover', 'Sliced steak with roasted potatoes and a tomato and avocado salad on a wooden board', 'bf579e30fbb4f5f6b725a30d1136b1f67a1997dfa5160b1dc9579d7054c6b077'),
  'everyday-salmon-beet-carrot-cover': mealCover('everyday-salmon-beet-carrot-cover', 'Salmon with a bowl of rice and a beet and carrot salad on a wooden board', '957f9bf1de2fc7fb8dbb9f325f2d9f4dd2240aae2b470dcbdc806e55537068b5'),
  'everyday-wraps-cabbage-carrot-cover': mealCover('everyday-wraps-cabbage-carrot-cover', 'Chicken wrap halves with a cabbage and carrot slaw on a wooden board', 'a26ad655f74ab03921f4c3ef400c15d4105281589cf7f20fa6c3d9febd7c85df'),
  'everyday-flatbread-tomato-basil-cover': mealCover('everyday-flatbread-tomato-basil-cover', 'A tomato and mozzarella flatbread cut in pieces with a bowl of tomatoes and basil', 'cdc1ccd6ba9e422baede5d347e4e7edf418916e65bfce6cb62bebfabf7386aeb'),

  // Board surface. Generic and provisional: not the wood, grain or finish of Yndarena's boards.
  'generic-honey-wood-surface': {
    role: 'surface', src: SURFACE_FILES['generic-honey-wood-surface'], width: 720, height: 720, pkg: 'v2',
    sourceFile: 'generic-honey-wood-surface.png', alt: '', provenance: 'ai-generated', status: 'provisional', label: 'Generic wood',
  },
};

// Covers retired by everyday-v4 (replacement-map.json). Any stored reference to an old id resolves to its successor.
export const MEDIA_REPLACED = {
  'everyday-gnocchi-cover': 'everyday-gnocchi-bread-cover',
  'everyday-steak-cover': 'everyday-steak-tomato-avocado-cover',
  'everyday-salmon-cover': 'everyday-salmon-beet-carrot-cover',
  'everyday-chicken-wraps-cover': 'everyday-wraps-cabbage-carrot-cover',
  'everyday-flatbread-cover': 'everyday-flatbread-tomato-basil-cover',
};
export const mediaFor = (id) => MEDIA[MEDIA_REPLACED[id] || id] || null;

// Board surface per board model. Replace an entry with the real product reference when it exists;
// the renderer clips it to the existing board outline, so geometry and Designer coordinates never change.
export const BOARD_SURFACES = {
  'cheese-bread': 'generic-honey-wood-surface',
  'fruits-veg': 'generic-honey-wood-surface',
  'meat-fish': 'generic-honey-wood-surface',
};

// Photographic pieces, per item type and serving style. This is the single map every renderer uses.
// mode 'group': one image fitted inside the item's existing approximate footprint, keeping its proportions.
//   turn: the image may be laid 90° to follow a long footprint (batons).
//   chain: the image is laid along the footprint and repeated end to end (salami rivers).
// mode 'cluster': a few copies of a single piece arranged inside the footprint; the count is visual only.
// mode 'units': one image per counted unit (a cracker, a fig, a sprig), so the picture matches the count.
// Weight and volume stay with the presentation data: images never set a quantity.
export const PHOTO_PIECES = {
  // Bowls & dips
  'bowl-jam:bowl': { asset: 'fig-rosemary-jam-ivory-ramekin', mode: 'group' },
  'bowl-honey:bowl': { asset: 'honey-ivory-bowl', mode: 'group' },
  'bowl-feta:bowl': { asset: 'whipped-feta-ivory-bowl', mode: 'group' },
  'bowl-feta:swoosh': { asset: 'whipped-feta-parchment-swoosh', mode: 'group' },
  'bowl-hummus:bowl': { asset: 'lemon-herb-hummus-ivory-bowl', mode: 'group' },
  'bowl-hummus:swoosh': { asset: 'lemon-herb-hummus-parchment-swoosh', mode: 'group' },
  'bowl-olives:bowl': { asset: 'citrus-marinated-olives-ivory-bowl', mode: 'group' },
  // Cheese
  'brie:wedges': { asset: 'brie-four-wedges-fan', mode: 'group' },
  'brie:whole': { asset: 'brie-wheel-cut-wedge', mode: 'group' },
  'camembert:wedges': { asset: 'camembert-wedges-fan', mode: 'group' },
  'camembert:whole': { asset: 'camembert-wheel-cut-wedge', mode: 'group' },
  'cheddar:triangles': { asset: 'cheddar-six-triangles-fan', mode: 'group' },
  'cheddar:cubes': { asset: 'cheddar-cubes-group', mode: 'group' },
  'manchego:triangles': { asset: 'manchego-triangles-fan', mode: 'group' },
  'manchego:cubes': { asset: 'manchego-cubes-group', mode: 'group' },
  'gouda:triangles': { asset: 'aged-gouda-triangles-fan', mode: 'group' },
  'gouda:cubes': { asset: 'aged-gouda-cubes-group', mode: 'group' },
  'goat:rounds': { asset: 'goat-cheese-coins-group', mode: 'group' },
  // Charcuterie
  'prosciutto:roses': { asset: 'prosciutto-single-rose', mode: 'cluster' },
  'prosciutto:ribbons': { asset: 'prosciutto-ribbon-group', mode: 'group' },
  'serrano:roses': { asset: 'serrano-single-rose', mode: 'cluster' },
  'serrano:ribbons': { asset: 'serrano-ribbon-group', mode: 'group' },
  'salami:river': { asset: 'salami-river-group', mode: 'group', chain: true },
  'salami:folds': { asset: 'salami-folded-quarters-group', mode: 'group' },
  'soppressata:river': { asset: 'soppressata-river-group', mode: 'group', chain: true },
  'soppressata:folds': { asset: 'soppressata-folded-quarters-group', mode: 'group' },
  // Fruit & vegetables
  'grapes:clusters': { asset: 'red-grapes-small-cluster', mode: 'group' },
  'green-grapes:clusters': { asset: 'green-grapes-small-cluster', mode: 'group' },
  'figs:halved': { asset: 'fresh-fig-two-halves', mode: 'units', layout: 'grid', unitWidth: 62, unit: 'fig' },
  'apple:fan': { asset: 'crisp-apple-slice-fan', mode: 'group' },
  'pear:fan': { asset: 'ripe-pear-slice-fan', mode: 'group' },
  'strawberries:pile': { asset: 'strawberries-halved-group', mode: 'group' },
  'dried-apricots:pile': { asset: 'dried-apricots-pile', mode: 'group' },
  'carrots:batons': { asset: 'carrot-batons-group', mode: 'group', turn: true },
  'celery:batons': { asset: 'celery-batons-group', mode: 'group' },
  'bell-pepper:strips': { asset: 'bell-pepper-strips-group', mode: 'group' },
  'cucumber:rounds': { asset: 'mini-cucumber-rounds-group', mode: 'group' },
  'cucumber:ribbons': { asset: 'mini-cucumber-ribbons-group', mode: 'group' },
  'tomatoes:pile': { asset: 'cherry-tomatoes-group', mode: 'group' },
  // Bread & crackers
  'crackers:fan': { asset: 'plain-round-cracker-single', mode: 'units', layout: 'fan', unitWidth: 52, unit: 'cracker' },
  'crackers:stack': { asset: 'plain-round-cracker-single', mode: 'units', layout: 'stacks', unitWidth: 52, unit: 'cracker' },
  'seed-crackers:fan': { asset: 'seed-cracker-single', mode: 'units', layout: 'fan', unitWidth: 54, unit: 'cracker' },
  'seed-crackers:stack': { asset: 'seed-cracker-single', mode: 'units', layout: 'stacks', unitWidth: 54, unit: 'cracker' },
  'baguette:slices': { asset: 'baguette-slices-group', mode: 'group' },
  // Nuts & small bites
  'walnuts:pile': { asset: 'rosemary-honey-walnuts-pile', mode: 'group' },
  'almonds:pile': { asset: 'marcona-almonds-pile', mode: 'group' },
  // Everyday meals: prepared components. Mains served by the piece repeat one image per piece.
  'gnocchi-bowl:bowl': { asset: 'gnocchi-tomato-basil-bowl', mode: 'group' },
  'lemon-chicken:sliced': { asset: 'cooked-lemon-chicken-slices', mode: 'units', layout: 'row', unitWidth: 150, unit: 'breast' },
  'steak:sliced': { asset: 'cooked-steak-slices', mode: 'units', layout: 'row', unitWidth: 160, unit: 'steak' },
  'salmon:fillet': { asset: 'cooked-salmon-fillet', mode: 'units', layout: 'row', unitWidth: 150, unit: 'portion' },
  'chicken-wraps:halves': { asset: 'chicken-wrap-two-halves', mode: 'units', layout: 'row', unitWidth: 160, unit: 'wrap' },
  'flatbread:pieces': { asset: 'tomato-mozzarella-flatbread-four-pieces', mode: 'units', layout: 'row', unitWidth: 200, unit: 'flatbread' },
  'potatoes:wedges': { asset: 'roasted-potato-wedges-group', mode: 'group' },
  'green-beans:cooked': { asset: 'cooked-green-beans-group', mode: 'group', turn: true },
  'rice:bowl': { asset: 'cooked-rice-ivory-bowl', mode: 'group' },
  'side-tomato-avocado:bowl': { asset: 'tomato-avocado-salad-ivory-bowl', mode: 'group' },
  'side-beet-carrot:bowl': { asset: 'beet-carrot-salad-ivory-bowl', mode: 'group' },
  'side-cabbage-carrot:bowl': { asset: 'cabbage-carrot-slaw-ivory-bowl', mode: 'group' },
  'side-tomato-basil:bowl': { asset: 'tomato-basil-salad-ivory-bowl', mode: 'group' },
  'rustic-bread:slices': { asset: 'rustic-bread-slices-group', mode: 'group' },
  'lemon:wedges': { asset: 'lemon-two-wedges', mode: 'group' },
  'basil:leaves': { asset: 'fresh-basil-three-leaves', mode: 'group' },
  // Garnish
  'rosemary:sprig': { asset: 'rosemary-single-sprig', mode: 'units', layout: 'sprigs', unitHeight: 100, unit: 'sprig' },
};

export function photoPiece(type, style) {
  return PHOTO_PIECES[`${type}:${style}`] || null;
}
