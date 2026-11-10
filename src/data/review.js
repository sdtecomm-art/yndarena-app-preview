// Notes for the people reviewing the preview. Shown only in the review panel, never in the customer journey.

export const REVIEW = {
  updated: '2026-11-02',
  scope: [
    'Photos (owner, 2026-11-10): every place where a real photo belongs now shows a “Photo coming” frame that names the shot, instead of a drawing: Home hero (the boards), the water test (beading, soaking, placing the drops; also in Care and in the test itself), the five oiling steps, each recipe, Gatherings, the guest page and Plan a gift. The kitchen behind the entrance box is still a render.',
    'Entrance (2026-11-10): slower on purpose (about 13 seconds the first time, 7 after). The first time on a device, a shortened version of the story printed inside the lid appears over the open box (5 of its sentences, verbatim; three are left out to keep it short). Box artwork re-rendered at 3000 px; the inside of the lid is plain white because its small print couldn’t be sharp on screen (owner’s choice). A tap skips everything. At the end the wordmark lingers on the app’s paper, fades, and the screen below shows through (no hard cut). The closed box at rest is a sharp still made from the 3D box with the print projected in at full resolution; the 3D box takes over when it opens.',
    'v12 (owner and partner, 2026-11-09): Cook is back as a tool, not a catalog. Tabs: Home · Cook · Gifts · Gatherings. Cook plans the week’s dinners (nights, people, diet, foods to leave out, time), builds one shopping list added up and sorted by aisle (I have this, own items, share), and shows for each recipe which Yndarena board to use and in what order, each prep block headed by that board’s engraved spine (cut from the product reference; to be replaced by photos of the real set). Prep ahead lists what can be cut for the next three dinners. Care moved inside Home (care plan tile, next step, water test).',
    'Recipes: 36 dinners for 4 in US units, written for Yndarena (src/data/recipes.js). They are KITCHEN DRAFTS: not cooked and tested yet. Food-safety temperatures and leftover times follow USDA FSIS guidance. No third-party recipe text, photo or layout was copied. No calories or budgets: deliberately left out of v1.',
    'Plans are picked by rules (diet, avoid list, time, no same protein two nights in a row), not by AI. AI swaps can come later on top of the same verified library.',
    'v11 (owner brief, 2026-11-01): recipes, everyday meals, boards to share, From home to home, Designer, techniques, Photo/Layout, Collection, saved items, notes, versions and shopping lists were removed from the app and from the code, with their food images and source packages (they remain in the git history). Discover and Collection left the tab bar.',
    'Navigation: Home, Care, Gifts and Gatherings (order set by the owner 2026-11-04; the Home shows Gift dates above Gatherings). Gifts explains the feature (save a date, two reminders, channels per date, Give Yndarena on Amazon) above the dates; the Home keeps a short Gift dates block that opens it. The Yndarena entrance (2026-11-05) is the real gift box on the kitchen counter, built in 3D from Packaging_Yndarena.pdf (lid, magnetic flap, story inside the lid). Inside, instead of the foam insert, the box is filled with rosemary drawn from the packaging illustration, because the same box carries every Yndarena product (owner, 2026-11-10), with the wordmark, the Home number and “Open your set”. The button opens the box (flap, lid on its hinge, then the rosemary leaps out of the box toward the screen while a circle of the app’s paper opens into the app) in about 4 seconds; a tap skips it; reduced motion gets a short fade.',
    'Gatherings ends with a space for a short video on how it works; in Gifts the video sits at the top, under the title (owner request 2026-11-02). No video exists yet: the frame says “Video coming soon”.',
    'Old links: #/s/… (shared boards) and any screen name from earlier versions open a short page with “Go to Home”. Nothing crashes.',
  ],
  data: [
    'Migration on load: the retired fields (saved, designs, made, notes, lists, reviews, shares, recent) move untouched to user.retiredV11 in the same browser storage. Nothing is purged. Account, Home number, care plan, care history, gift dates and every channel choice stay as they were.',
    'Removing that retired data for good is a separate, explicit operation for production. It is not part of this change.',
  ],
  gatherings: [
    'Real in this build: the whole flow, the rules and the data model. A host creates a gathering (type, date and time, people), starts with an empty list and adds each item themselves (no suggested items since 2026-11-02). Each item is just “What” and an optional free-text “How much” (for example “2 bags” or “for 6”); units, sizes and the Amount/Enough for switch were removed. Older items keep their amount, shown as text, marks what they provide, records a confirmation received in person (“Confirmed by host”), shares one link, requests changes, reschedules, cancels and reuses a list without guests, emails or reminders.',
    'Guests open #/g/<id> with no app, account or Home number. They see only that gathering. Each reservation takes the whole row and returns a private manage token (128-bit random) in its own link; the public data never contains tokens or emails, so knowing a name cannot edit someone else’s item.',
    'Reservations run inside one exclusive lock (Web Locks API) shared by all tabs of the browser, so two reservations can’t both see “available”. Each sheet opening carries one request key, so a double tap books once. Switching items takes the new one first and only then frees the old one.',
    'Major changes (food or amount) and a new date or time keep what the guest agreed and ask them to confirm; the row stays theirs and doesn’t count as covered. They can confirm, or say they can’t, which frees it. With no answer nothing is released automatically; the host can record a confirmation or free the row.',
    'Reminders follow the rules: host 24 hours before and 3 hours before (only if something is still needed); guest 3 hours before if they chose email; immediate notices for a guest cancelling, a change and a cancellation. Only future reminders are kept, a new time cancels the old ones, and every entry has a unique key so nothing is queued twice.',
  ],
  simulated: [
    'There is no shared backend: the gathering “server” is this browser’s localStorage. Tabs of the same browser see each other’s changes (that is how simultaneous reservations were tested), but another phone does not. Sync between devices is NOT implemented or tested.',
    'Nothing is sent. Push notifications, emails and reminders are written to an outbox marked “simulated” and shown in the host view; they are never marked as delivered. No device permission is requested.',
    'Share uses the phone’s share sheet or copies the link. “You opened Share update” records only that the host opened it, not that anyone received or read it.',
  ],
  pending: [
    'Two short videos: How Gatherings works and How Gifts works (about a minute each).',
    'A real backend for gatherings (accounts for hosts, public guest endpoint, conditional writes or transactions for reservations, secure manage tokens), then a test with two separate devices.',
    'Push notification and email providers, with the device permission for push, the 24-hour and 3-hour jobs and idempotent sending.',
    'Yndarena’s Amazon link for gifts: set LINKS.amazonStore in src/data/links.js to enable View on Amazon.',
    'Approve the oiling steps; confirm on real boards that about 5 seconds is enough for the water test. The care emails still mention the old schedule.',
    'Decide whether the retired data kept under retiredV11 should be removed in production, as a separate operation.',
  ],
  kept: [
    'Home: the water test is the lead feature of the care plan (owner, 2026-11-10): both outcomes side by side, its due or next date, the last result and one button. Oil pending or boards not home yet still show first. Care: Everyday care (section 03 and its Home tile) and the How to oil section (02) were removed from the Care tab on 2026-11-08 at the owner’s request. The step-by-step oil guide stays as its own screen, opened from the water test result (“Time to oil”), the next-step card and the Home tile, with the care video link. Plan, history, arrival, oil pending, reminders by usage (14 days, one calendar month, 42 days), the short water test and its illustrations, the oiling instructions. Need a hand stays removed.',
    'Gift dates: 21 and 10 days ahead, yearly or one-time, push/email/both per date. Plan a gift keeps only Give Yndarena · View on Amazon.',
    'Product: v7 original set artwork and the 33 × 24 × 1.8 cm dimensions.',
  ],
};
