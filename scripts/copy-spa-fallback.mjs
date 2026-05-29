import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const basePath = process.env.VITE_BASE_PATH || '';
const normalizedEnvBase = normalizeBasePath(basePath);
const baseHtml = await readFile('dist/index.html', 'utf8');
const sitemap = await readFile('dist/sitemap.xml', 'utf8');
const seoRoutes = JSON.parse(await readFile('dist/seo-routes.json', 'utf8'));
const routesByPath = new Map(seoRoutes.map((route) => [normalizeRoutePath(route.path), route]));
const siteRoot = ensureTrailingSlash(routesByPath.get('/')?.url || 'https://pnforce.github.io/GoodStuff/');
const normalizedBase = normalizedEnvBase || normalizeBasePath(new URL(siteRoot).pathname);
const routeMatches = sitemap.matchAll(/<loc>([^<]+)<\/loc>/g);
let routeCount = 0;

function normalizeBasePath(value) {
  const normalized = String(value || '').replace(/^\/+|\/+$/g, '');
  return normalized ? `/${normalized}` : '';
}

function normalizeRoutePath(routePath) {
  if (!routePath || routePath === '/') {
    return '/';
  }

  return `/${routePath.replace(/^\/+|\/+$/g, '')}`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function escapeScriptJson(value) {
  return JSON.stringify(value).replaceAll('</script', '<\\/script');
}

function injectSeo(html, route) {
  if (!route) {
    return html;
  }

  const title = escapeHtml(route.title);
  const description = escapeHtml(route.description);
  const image = escapeHtml(route.image || '');
  const tags = [
    `<meta name="description" content="${description}" />`,
    '<meta name="robots" content="index,follow" />',
    `<link rel="canonical" href="${escapeHtml(route.url)}" />`,
    `<link rel="alternate" type="application/rss+xml" title="GoodStuff RSS" href="${escapeHtml(new URL('feed.xml', siteRoot).toString())}" />`,
    `<meta property="og:type" content="${route.type === 'article' ? 'article' : 'website'}" />`,
    `<meta property="og:site_name" content="GoodStuff" />`,
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${description}" />`,
    `<meta property="og:url" content="${escapeHtml(route.url)}" />`,
    image ? `<meta property="og:image" content="${image}" />` : '',
    '<meta name="twitter:card" content="summary_large_image" />',
    `<meta name="twitter:title" content="${title}" />`,
    `<meta name="twitter:description" content="${description}" />`,
    image ? `<meta name="twitter:image" content="${image}" />` : '',
    `<script type="application/ld+json">${escapeScriptJson(route.structuredData || [])}</script>`,
  ].filter(Boolean).join('\n    ');

  return html
    .replace(/<title>.*?<\/title>/s, `<title>${title}</title>`)
    .replace('</head>', `    ${tags}\n</head>`)
    .replace('<div id="root"></div>', `<div id="root"></div>\n    ${route.staticHtml || ''}`);
}

function ensureTrailingSlash(value) {
  return value.endsWith('/') ? value : `${value}/`;
}

await writeFile('dist/index.html', injectSeo(baseHtml, routesByPath.get('/')), 'utf8');
await copyFile('dist/index.html', 'dist/404.html');

for (const match of routeMatches) {
  const url = new URL(match[1]);
  let routePath = url.pathname;

  if (normalizedBase && routePath.startsWith(normalizedBase)) {
    routePath = routePath.slice(normalizedBase.length);
  }

  if (!routePath || routePath === '/' || path.extname(routePath)) {
    continue;
  }

  const normalizedRoutePath = normalizeRoutePath(routePath);
  const targetDir = path.join('dist', routePath);
  await mkdir(targetDir, { recursive: true });
  await writeFile(
    path.join(targetDir, 'index.html'),
    injectSeo(baseHtml, routesByPath.get(normalizedRoutePath)),
    'utf8',
  );
  routeCount += 1;
}

console.log(`Created dist/404.html and ${routeCount} route index.html files with route-level SEO metadata.`);
