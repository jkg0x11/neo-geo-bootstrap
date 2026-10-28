import { build } from 'vite';
import { readFile, writeFile, copyFile, mkdir, rm, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { execFileSync } from 'node:child_process';

// A classic IIFE keeps the downloaded demo usable by double-clicking index.html.
for (const [entry, name] of [['main.js', 'geo-demo.js'], ['gallery.js', 'geo-catalogue.js']]) await build({
  configFile: false,
  publicDir: false,
  build: {
    outDir: '.build-offline',
    emptyOutDir: false,
    lib: { entry: resolve(entry), name: 'GeoDemo', formats: ['iife'], fileName: () => name },
  },
});
await mkdir('artifacts', { recursive: true });
await rm('.build-offline/site', { recursive: true, force: true });
await mkdir('.build-offline/site', { recursive: true });
execFileSync('cp', ['-R', 'dist/', '.build-offline/site/']);
const folder = '.build-offline/site';
for (const filename of await readdir(folder)) if (filename.endsWith('.zip')) await rm(`${folder}/${filename}`, { force: true });
for (const [page, script] of [['index.html', 'geo-demo.js'], ['gallery.html', 'geo-catalogue.js']]) {
let html = await readFile(`dist/${page}`, 'utf8');
html = html.replace(/<script\b[^>]*type="module"[^>]*><\/script>/g, '')
  .replace(/<link\b[^>]*rel="modulepreload"[^>]*>/g, '')
  .replace(/\s+crossorigin(?:="[^"]*")?/g, '')
  .replace(/\b(href|src)="\/(?!\/)/g, '$1="./')
  .replace('</body>', `<script defer src="./${script}"></script>\n</body>`);
await writeFile(`${folder}/${page}`, html);
await copyFile(`.build-offline/${script}`, `${folder}/${script}`);
}
await copyFile('docs/DOWNLOAD.md', `${folder}/README.md`);
await copyFile('LICENSE', `${folder}/LICENSE`);
await copyFile('node_modules/bootstrap/LICENSE', `${folder}/BOOTSTRAP-LICENSE`);
await copyFile('public/legacy/LICENSE', `${folder}/DIVSHOT-LICENSE`);
await copyFile('public/coverage.json', `${folder}/coverage.json`);
await copyFile('public/coverage.md', `${folder}/coverage.md`);
await copyFile('node_modules/vanilla-calendar-pro/LICENSE', `${folder}/CALENDAR-LICENSE`);
await copyFile('node_modules/@floating-ui/dom/LICENSE', `${folder}/FLOATING-UI-LICENSE`);
await rm('artifacts/neo-geo-bootstrap.zip', { force: true });
execFileSync('zip', ['-qr', resolve('artifacts/neo-geo-bootstrap.zip'), '.'], { cwd: folder });
await copyFile('artifacts/neo-geo-bootstrap.zip', 'public/neo-geo-bootstrap.zip');
await copyFile('artifacts/neo-geo-bootstrap.zip', 'dist/neo-geo-bootstrap.zip');
console.log('Created artifacts/neo-geo-bootstrap.zip (theme + offline demo + licenses).');
