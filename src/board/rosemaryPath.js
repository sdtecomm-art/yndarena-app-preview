// The engraved rosemary silhouette, read from the brand kit SVG so it lives in one file.
import svg from '../assets/rosemary.svg?raw';

export const ROSEMARY_PATH = svg.match(/ d="([^"]+)"/)[1];
