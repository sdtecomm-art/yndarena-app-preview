// Visual resources, kept apart from the content they illustrate.
// Every asset declares its role, provenance and status so the UI can say what it is.
// Roles: 'cover' (editorial), 'layout-top' (overhead view of one layout), 'step' (a build step),
// 'cutout' (transparent Designer piece), 'video' (technique clip).
// Status: 'provisional' (usable for preview, not verified) | 'final' (shot on the real boards, tested).
import llrTop1080 from '../media/presentations/llr-two-halves-top-1080.webp';
import llrTop640 from '../media/presentations/llr-two-halves-top-640.webp';
import cheddarFan from '../media/designer/cheddar-fan.webp';

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
    note: 'Generated to explore the photographic direction. The board is generic and portions are not verified.',
  },
  'cheddar-fan': {
    role: 'cutout',
    src: cheddarFan,
    width: 360,
    height: 281,
    alt: 'Fan of six aged cheddar triangles, seen from above.',
    provenance: 'ai-generated',
    status: 'provisional',
    label: 'AI sample cutout',
    note: 'Appearance sample. It does not encode weight, size or a verified cut.',
  },
};

// Photographic Designer pieces, per item type and serving style.
// unitQty: quantity one photographed group stands for (an assumption until weighed on set).
// footprint: board units one group occupies; anchor: resting point inside the image (0 to 1).
// More quantity repeats the group instead of stretching it.
export const PHOTO_PIECES = {
  'cheddar:triangles': {
    asset: 'cheddar-fan',
    unitQty: 2,
    groupName: ['fan of 6 slices', 'fans of 6 slices'],
    footprint: [96, 75],
    anchor: [0.5, 0.55],
    maxGroups: 4,
  },
};

export function photoPiece(type, style) {
  return PHOTO_PIECES[`${type}:${style}`] || null;
}

export function photoGroups(piece, qty) {
  return Math.max(1, Math.min(piece.maxGroups, Math.round(qty / piece.unitQty)));
}

// Footprint of a photographic piece for a quantity: groups sit side by side, overlapping a little.
export function photoFootprint(piece, qty) {
  const n = photoGroups(piece, qty);
  const [w, h] = piece.footprint;
  return [w + (n - 1) * w * 0.62, h];
}
