import { readFileSync, writeFileSync } from 'node:fs';

// The built bundle is a single self-contained script with no import/export
// syntax, so it doesn't need to load as an ES module. Removing type="module"
// lets the built index.html run when opened directly via file:// - Chrome
// blocks module scripts under file:// (treats it as a null-origin CORS
// request), but has no such restriction on classic scripts.
const indexPath = 'dist/day-view-calendar/browser/index.html';

const html = readFileSync(indexPath, 'utf8');
const fixed = html.replace(' type="module"', '');

if (fixed === html) {
  console.warn(`Warning: no type="module" attribute found in ${indexPath} - nothing changed.`);
} else {
  writeFileSync(indexPath, fixed);
  console.log(`Removed type="module" from ${indexPath}.`);
}
