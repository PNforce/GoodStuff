import { copyFile, mkdir, readFile } from 'node:fs/promises';
import path from 'node:path';

await copyFile('dist/index.html', 'dist/404.html');

const basePath = process.env.VITE_BASE_PATH || '/';
const normalizedBase = basePath === '/' ? '' : `/${basePath.replace(/^\/+|\/+$/g, '')}`;
const sitemap = await readFile('dist/sitemap.xml', 'utf8');
const routeMatches = sitemap.matchAll(/<loc>([^<]+)<\/loc>/g);
let routeCount = 0;

for (const match of routeMatches) {
  const url = new URL(match[1]);
  let routePath = url.pathname;

  if (normalizedBase && routePath.startsWith(normalizedBase)) {
    routePath = routePath.slice(normalizedBase.length);
  }

  if (!routePath || routePath === '/' || path.extname(routePath)) {
    continue;
  }

  const targetDir = path.join('dist', routePath);
  await mkdir(targetDir, { recursive: true });
  await copyFile('dist/index.html', path.join(targetDir, 'index.html'));
  routeCount += 1;
}

console.log(`Created dist/404.html and ${routeCount} route index.html files for static SPA deep links.`);
