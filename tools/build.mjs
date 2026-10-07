import { build } from 'esbuild';
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { prerender } from './prerender.mjs';
const root = fileURLToPath(new URL('../', import.meta.url));
await build({
  absWorkingDir: root,
  entryPoints: ['src/app.js'],
  outfile: 'assets/store.js',
  bundle: true,
  format: 'iife',
  platform: 'browser',
  target: ['es2022'],
  minify: false,
  legalComments: 'eof',
  charset: 'utf8',
});
const template = await readFile(new URL('../src/index.template.html', import.meta.url), 'utf8');
const sprite = (await readFile(new URL('../assets/icons/sprite.svg', import.meta.url), 'utf8'))
  .replace(
    '<svg xmlns="http://www.w3.org/2000/svg">',
    '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style="display:none">',
  )
  .replace(/id="/g, 'id="icon-');
const initial = prerender();
const html = template
  .replace('<!-- prerender-templates -->', initial.templates)
  .replace('<!-- initial-content -->', initial.placeholder)
  .replace('<!-- prerender-bootstrap -->', initial.bootstrap)
  .replace(
    '<script type="module" src="src/app.js"></script>',
    '<script defer src="assets/store.js"></script>',
  )
  .replaceAll('assets/icons/sprite.svg#', '#icon-')
  .replace('<body>', '<body>\n' + sprite);
await writeFile(new URL('../index.html', import.meta.url), html);
console.log('Built index.html and assets/store.js. Ready for local viewing or static hosting.');
