import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const DEFAULT_SITE_URL = 'https://PNforce.github.io/GoodStuff/';
const root = process.cwd();
const publicDir = path.join(root, 'public');
const contentDir = path.join(publicDir, 'content');
const siteUrl = ensureTrailingSlash(process.env.VITE_SITE_URL || DEFAULT_SITE_URL);

function ensureTrailingSlash(value) {
  return value.endsWith('/') ? value : `${value}/`;
}

function absoluteUrl(routePath) {
  const normalizedPath = routePath === '/' ? '' : routePath.replace(/^\/+/, '');
  return new URL(normalizedPath, siteUrl).toString();
}

function escapeXml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

async function readJson(filePath) {
  const text = await readFile(filePath, 'utf8');
  return JSON.parse(text.replace(/^\uFEFF/, ''));
}

const catalog = await readJson(path.join(contentDir, 'catalog.json'));
const urls = [
  {
    loc: absoluteUrl('/'),
    lastmod: catalog.version,
    priority: '1.0',
  },
];

const books = [...(catalog.books || [])]
  .filter((book) => book.published !== false)
  .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

for (const bookRef of books) {
  const bookJsonPath = path.join(publicDir, bookRef.bookJson.replace(/^\//, ''));
  const book = await readJson(bookJsonPath);
  const lastmod = book.updatedAt || bookRef.updatedAt || catalog.version;

  urls.push({
    loc: absoluteUrl(`/articles/${book.slug}`),
    lastmod,
    priority: book.slug === 'affiliate-product-comparisons' ? '0.9' : '0.7',
  });

  const chapters = [...(book.chapters || [])]
    .filter((chapter) => chapter.published !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  for (const chapter of chapters) {
    urls.push({
      loc: absoluteUrl(`/articles/${book.slug}/${chapter.slug}`),
      lastmod,
      priority: book.slug === 'affiliate-product-comparisons' ? '0.8' : '0.6',
    });
  }
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${escapeXml(url.loc)}</loc>
    <lastmod>${escapeXml(url.lastmod)}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${url.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>
`;

const robots = `User-agent: *
Allow: /

Sitemap: ${absoluteUrl('/sitemap.xml')}
`;

await mkdir(publicDir, { recursive: true });
await writeFile(path.join(publicDir, 'sitemap.xml'), sitemap, 'utf8');
await writeFile(path.join(publicDir, 'robots.txt'), robots, 'utf8');

console.log(`Generated robots.txt and sitemap.xml with ${urls.length} URLs.`);
