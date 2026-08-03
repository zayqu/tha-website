/**
 * Academy content fetch — CURRENTLY DISABLED, NEEDS REAL IMPLEMENTATION.
 *
 * History: this script originally called `https://www.who.int/api/news/release.json`,
 * which is not a real public WHO endpoint. That version silently failed on every
 * run (caught its own errors and returned an empty list), so no new academy
 * content was ever actually fetched, even before this file was reduced to a stub.
 *
 * The workflow that runs this script (.github/workflows/academy-fetch.yml) was
 * also previously misplaced at .github/academy-fetch.yml, where GitHub Actions
 * never picks it up. That location bug has been fixed as part of this same
 * change; this script's logic still needs a real, verified content source.
 *
 * To implement this properly:
 *   1. Confirm a real, stable source (WHO publications RSS/sitemap, a specific
 *      partner's feed, or a manually-curated queue) and verify it against the
 *      live site/API before wiring it up here.
 *   2. Parse and normalize entries into the same shape used by
 *      src/data/academy.json (title, excerpt, url, source, category, date,
 *      topics, status).
 *   3. Merge with existing entries, de-duplicate by url, and write back.
 *
 * Until that's done, this script intentionally does nothing rather than
 * fabricate content or silently report success.
 */
console.log('Academy fetch: no verified content source is configured yet — skipping (see comments in this file).');
process.exit(0);
