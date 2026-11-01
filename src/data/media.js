// Product images used by the app. Only authentic product references live here; food imagery was retired with
// recipes, presentations and Designer (v11). Source files and their manifests live in media-source/.
import spines1400 from '../media/product/yndarena-boards-spines-1400.webp';
import spines800 from '../media/product/yndarena-boards-spines-800.webp';

export const MEDIA = {
  // The three boards seen from their spines, as on the stand. Rendered from Yndarena's own product reference
  // (brand kit, TABLAS.pdf), turned to lie horizontally. Not AI-generated, not a photo.
  'product-boards-spines': {
    role: 'product', src: spines1400, small: spines800, srcSet: `${spines800} 800w, ${spines1400} 1400w`, width: 1400, height: 296,
    alt: 'The three Yndarena boards stacked: Meat & Fish, Fruits & Vegetables and Cheese & Bread, each with its engraved rosemary',
    provenance: 'brand-reference', sourceFile: 'brand-kit/sources/TABLAS.pdf, page 1', status: 'reference', label: 'Product reference',
  },
};
