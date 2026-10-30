// Outside links the app may open. Leave a link empty until Yndarena provides the real one: the app never makes one up.
// amazonStore: Yndarena's listing or store page on Amazon, where gifts are bought.
export const LINKS = {
  amazonStore: '',
};

// Only Amazon pages are accepted for the gift button.
export const validAmazonUrl = (u) => /^https:\/\/(www\.)?amazon\.[a-z.]{2,6}\/\S+$/i.test(u || '');

// This build is the navigable preview: notes that only make sense here (simulated sends, pending links) show when true.
export const IS_PREVIEW = true;
