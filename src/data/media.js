// Visual resources, kept apart from the content they illustrate.
// Every asset declares its role, provenance and status so the preview can say what it is.
// Roles: 'cover' (editorial), 'layout-top' (overhead view of one layout), 'step' (a build step),
// 'cutout' (transparent Designer piece), 'video' (technique clip).
// Status: 'provisional' (usable for preview, not verified) | 'final' (shot on the real boards, tested).
// Source files and their manifest live in media-source/; the app only bundles optimized copies.
import llrTop1080 from '../media/presentations/llr-two-halves-top-1080.webp';
import llrTop640 from '../media/presentations/llr-two-halves-top-640.webp';
import jam from '../media/ingredients/fig-rosemary-jam-ivory-ramekin.webp';
import brieFan from '../media/ingredients/brie-four-wedges-fan.webp';
import brieWheel from '../media/ingredients/brie-wheel-cut-wedge.webp';
import cheddarFan from '../media/ingredients/cheddar-six-triangles-fan.webp';
import cheddarCubes from '../media/ingredients/cheddar-cubes-group.webp';
import prosciuttoRose from '../media/ingredients/prosciutto-single-rose.webp';
import prosciuttoRibbons from '../media/ingredients/prosciutto-ribbon-group.webp';
import grapes from '../media/ingredients/red-grapes-small-cluster.webp';
import figHalves from '../media/ingredients/fresh-fig-two-halves.webp';
import walnuts from '../media/ingredients/rosemary-honey-walnuts-pile.webp';
import sprig from '../media/ingredients/rosemary-single-sprig.webp';
import cracker from '../media/ingredients/plain-round-cracker-single.webp';

const cutout = (src, aspect, alt, sha256, sourceFile, extra = {}) => ({
  role: 'cutout', src, aspect, alt, sha256, sourceFile,
  provenance: 'ai-generated', status: 'provisional', label: 'AI cutout', ...extra,
});

export const MEDIA = {
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
  'fig-rosemary-jam-ivory-ramekin': cutout(jam, 0.9976, 'Fig jam in an ivory ramekin', '15d36e0e6e6e4cf041eb2e7ead34133de840eb5788fbfc3aff9a71345727d3da', 'fig-rosemary-jam-ivory-ramekin.png'),
  'brie-four-wedges-fan': cutout(brieFan, 1.4141, 'Four brie wedges in a fan', '4aa3470e6482824f44c1206412639bd7ee6728218d80277762353a9099ae7be0', 'brie-four-wedges-fan.png'),
  'brie-wheel-cut-wedge': cutout(brieWheel, 1.0797, 'Whole brie with one wedge cut', 'f433705efa1345cc89b4ee95a914e1d9b33a27481b1f1a5bf55fdf2d6394b95e', 'brie-wheel-cut-wedge.png'),
  'cheddar-six-triangles-fan': cutout(cheddarFan, 1.2651, 'Aged cheddar triangles in a fan', '5d8c2c02635a721234d3513ef0914b54702615242446c16502e6c9fbfd28d7c2', 'cheddar-six-triangles-fan.png', { reused: true }),
  'cheddar-cubes-group': cutout(cheddarCubes, 1.0096, 'Aged cheddar cubes', '4c7a4b9427c2b7f82c0c551f1d9853b649fab258111f93e741b0591cb4cbade1', 'cheddar-cubes-group.png'),
  'prosciutto-single-rose': cutout(prosciuttoRose, 1.0474, 'A prosciutto rose', '236d39a714d79d35a8d2b39c3eac06e05159aa340f33faf244b60d658e3e2ca2', 'prosciutto-single-rose.png'),
  'prosciutto-ribbon-group': cutout(prosciuttoRibbons, 1.0553, 'Loose prosciutto ribbons', 'a211e52f65d65a0099c22bb41eb9125c76f711211b1bd5c73277d09daec172b5', 'prosciutto-ribbon-group.png'),
  'red-grapes-small-cluster': cutout(grapes, 1.05, 'A small cluster of red grapes', 'd71697fc0eb7e2747dc6c173ce01d3ba74c00b65b0a017299b5a770254bc84a4', 'red-grapes-small-cluster.png'),
  'fresh-fig-two-halves': cutout(figHalves, 1.3115, 'One fresh fig cut in two halves', 'fa5673598ecad44146d5ea395de007a34c012a86e8b6cc0cc4031afb38345687', 'fresh-fig-two-halves.png'),
  'rosemary-honey-walnuts-pile': cutout(walnuts, 1.037, 'Rosemary honey walnuts', '734b8fb7e2cee50212ad149b0bbf8a7a15984573d970548231e8296105276563', 'rosemary-honey-walnuts-pile.png'),
  'rosemary-single-sprig': cutout(sprig, 0.4083, 'A sprig of rosemary', 'aa3bbfd665b76896799cac68361391df3f06c1b387bb424f4f6cb2cf5e3cccde', 'rosemary-single-sprig.png'),
  'plain-round-cracker-single': cutout(cracker, 1.0112, 'A round cracker', '4b72fe3ec55a3fd2c46c553e7807c8f9290080a4f5df4f8f0d77265be7f4206d', 'plain-round-cracker-single.png'),
};

// Photographic pieces, per item type and serving style.
// mode 'group': one image fitted inside the item's existing approximate footprint, keeping its proportions.
// mode 'cluster': a few copies arranged inside the footprint; the count is visual only.
// mode 'units': one image per counted unit (a cracker, a fig, a sprig), so the picture matches the count.
// Weight and volume stay with the presentation data: images never set a quantity.
export const PHOTO_PIECES = {
  'bowl-jam:bowl': { asset: 'fig-rosemary-jam-ivory-ramekin', mode: 'group' },
  'brie:wedges': { asset: 'brie-four-wedges-fan', mode: 'group' },
  'brie:whole': { asset: 'brie-wheel-cut-wedge', mode: 'group' },
  'cheddar:triangles': { asset: 'cheddar-six-triangles-fan', mode: 'group' },
  'cheddar:cubes': { asset: 'cheddar-cubes-group', mode: 'group' },
  'prosciutto:roses': { asset: 'prosciutto-single-rose', mode: 'cluster' },
  'prosciutto:ribbons': { asset: 'prosciutto-ribbon-group', mode: 'group' },
  'grapes:clusters': { asset: 'red-grapes-small-cluster', mode: 'group' },
  'walnuts:pile': { asset: 'rosemary-honey-walnuts-pile', mode: 'group' },
  'figs:halved': { asset: 'fresh-fig-two-halves', mode: 'units', layout: 'grid', unitWidth: 62, unit: 'fig' },
  'rosemary:sprig': { asset: 'rosemary-single-sprig', mode: 'units', layout: 'sprigs', unitHeight: 100, unit: 'sprig' },
  'crackers:fan': { asset: 'plain-round-cracker-single', mode: 'units', layout: 'fan', unitWidth: 52, unit: 'cracker' },
  'crackers:stack': { asset: 'plain-round-cracker-single', mode: 'units', layout: 'stacks', unitWidth: 52, unit: 'cracker' },
};

export function photoPiece(type, style) {
  return PHOTO_PIECES[`${type}:${style}`] || null;
}

// Photos read smaller than flat illustrations at the same footprint, so they get one shared visual scale.
// It only changes how large pieces look on the board, never a quantity.
export const PHOTO_SCALE = 1.3;

const contain = (bw, bh, aspect) => (bw / bh > aspect ? [bh * aspect, bh] : [bw, bw / aspect]);

// Lays out the images of one photographic group in local coordinates centered on 0,0.
// base: the item's approximate footprint for its quantity, the same one illustrations use.
// Returns the group size (for selection and hit areas) and the parts to draw.
export function photoLayout(piece, qty, base) {
  const m = MEDIA[piece.asset];
  const [bw, bh] = [base[0] * PHOTO_SCALE, base[1] * PHOTO_SCALE];
  if (piece.mode === 'group') {
    const [w, h] = contain(bw, bh, m.aspect);
    return { w, h, parts: [{ x: 0, y: 0, w, h, r: 0 }] };
  }
  if (piece.mode === 'cluster') {
    const three = bw > 80;
    const s = Math.min(bw, bh) * (three ? 0.56 : 0.62);
    const pts = three ? [[-0.22, -0.18], [0.22, -0.12], [0, 0.22]] : [[-0.21, 0], [0.21, 0]];
    return { w: bw, h: bh, parts: pts.map(([px, py], i) => ({ x: px * bw, y: py * bh, w: s * m.aspect, h: s, r: [-14, 22, 70][i] })) };
  }
  const n = Math.max(1, Math.round(qty));
  if (piece.layout === 'fan') {
    // Overlapping crackers along a shallow arc; long fans continue on a second row.
    const d = piece.unitWidth, step = d * 0.36, perRow = 14;
    const rows = Math.ceil(n / perRow), cols = Math.min(n, perRow);
    const w = d + (cols - 1) * step, h = d + 6 + (rows - 1) * d * 0.7;
    const parts = Array.from({ length: n }, (_, i) => {
      const c = i % perRow, row = Math.floor(i / perRow), t = cols > 1 ? c / (cols - 1) : 0.5;
      return { x: -w / 2 + d / 2 + c * step, y: -h / 2 + d / 2 + 6 - Math.sin(Math.PI * t) * 6 + row * d * 0.7, w: d, h: d / m.aspect, r: -10 + t * 20 };
    });
    return { w, h, parts };
  }
  if (piece.layout === 'stacks') {
    const d = piece.unitWidth, per = 4, stacks = Math.ceil(n / per), cols = Math.min(stacks, 4), rows = Math.ceil(stacks / cols);
    const w = cols * d * 1.08, h = rows * d * 1.08;
    const parts = Array.from({ length: n }, (_, i) => {
      const s = Math.floor(i / per), k = i % per, c = s % cols, row = Math.floor(s / cols);
      return { x: -w / 2 + d * 0.54 + c * d * 1.08 + k * 1.6, y: -h / 2 + d * 0.54 + row * d * 1.08 - k * 2.2, w: d, h: d / m.aspect, r: k * 7 };
    });
    return { w, h, parts };
  }
  if (piece.layout === 'sprigs') {
    // Sprigs fan out from a shared base, like a small bunch.
    const uh = piece.unitHeight, uw = uh * m.aspect;
    const angles = n === 1 ? [0] : Array.from({ length: n }, (_, i) => -12 * (n - 1) / 2 * 1.4 + i * 12 * 1.4);
    const spread = Math.abs(angles[0]) * Math.PI / 180;
    const w = uw + 2 * Math.sin(spread) * uh, h = uh;
    return { w, h, parts: angles.map((a) => ({ x: 0, y: h / 2, w: uw, h: uh, r: a, origin: 'bottom' })) };
  }
  // grid: one image per unit, two columns.
  const uw = piece.unitWidth, uh = uw / m.aspect, cols = Math.min(n, 2), rows = Math.ceil(n / cols);
  const w = cols * uw * 0.96, h = rows * uh * 0.96;
  return {
    w, h,
    parts: Array.from({ length: n }, (_, i) => ({ x: -w / 2 + uw * 0.48 + (i % cols) * uw * 0.96, y: -h / 2 + uh * 0.48 + Math.floor(i / cols) * uh * 0.96, w: uw, h: uh, r: (i % 2 ? 8 : -6) })),
  };
}
