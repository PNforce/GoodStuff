import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const DEFAULT_SITE_URL = 'https://pnforce.github.io/GoodStuff/';
const DEFAULT_LASTMOD = '2026-05-29';
const SITE_NAME = 'GoodStuff';
const SITE_DESCRIPTION = 'GoodStuff 整理家電、生活商品、店鋪與單品選購指南，協助讀者用公開資料、價格、銷量與使用情境做出更好的購買判斷。';
const SEARCH_TITLE = '搜尋商品比較、店鋪與單品指南 | GoodStuff';
const SEARCH_DESCRIPTION = '用關鍵字快速搜尋 GoodStuff 的商品比較、店鋪介紹與單品推薦，依照用途、品牌、品類與使用情境找到可閱讀的選購內容。';

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

function absolutePageUrl(routePath) {
  return ensureTrailingSlash(absoluteUrl(routePath));
}

function publicFilePath(publicPath) {
  return path.join(publicDir, publicPath.replace(/^\/+/, ''));
}

function escapeXml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function escapeHtml(value) {
  return escapeXml(value);
}

function normalizeWhitespace(value) {
  return String(value).replace(/\s+/g, ' ').trim();
}

function truncate(value, maxLength) {
  const clean = normalizeWhitespace(value);
  if (clean.length <= maxLength) {
    return clean;
  }
  return `${clean.slice(0, maxLength - 1).trim()}…`;
}

function sanitizeDate(value) {
  const match = String(value || '').match(/\d{4}-\d{2}-\d{2}/);
  return match ? match[0] : DEFAULT_LASTMOD;
}

function rssDate(value) {
  return new Date(`${sanitizeDate(value)}T00:00:00.000Z`).toUTCString();
}

function stripMarkdown(markdown) {
  return normalizeWhitespace(
    markdown
      .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/`{1,3}([^`]+)`{1,3}/g, '$1')
      .replace(/^#{1,6}\s+/gm, '')
      .replace(/^\s*[-*+]\s+/gm, '')
      .replace(/^\s*\d+\.\s+/gm, '')
      .replace(/^\s*\|.*\|\s*$/gm, ' ')
      .replace(/[>*_~]/g, ' '),
  );
}

async function readJson(filePath) {
  const text = await readFile(filePath, 'utf8');
  return JSON.parse(text.replace(/^\uFEFF/, ''));
}

async function readMarkdownSnippet(markdownPath) {
  if (!markdownPath) {
    return '';
  }

  try {
    const markdown = await readFile(publicFilePath(markdownPath), 'utf8');
    return truncate(stripMarkdown(markdown), 1100);
  } catch {
    return '';
  }
}

function breadcrumbItems(items) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

function itemList(items) {
  return {
    '@type': 'ItemList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.title,
      url: item.url,
    })),
  };
}

function staticHtml({ title, description, links = [], articleBody = '' }) {
  const linkHtml = links.length
    ? `<ul>${links
        .slice(0, 20)
        .map((link) => `<li><a href="${escapeHtml(link.url || link.path)}">${escapeHtml(link.title)}</a>${link.summary ? `：${escapeHtml(truncate(link.summary, 120))}` : ''}</li>`)
        .join('')}</ul>`
    : '';
  const bodyHtml = articleBody ? `<p>${escapeHtml(truncate(articleBody, 500))}</p>` : '';

  return `<noscript data-goodstuff-seo>
  <section lang="zh-TW">
    <h1>${escapeHtml(title)}</h1>
    <p>${escapeHtml(description)}</p>
    ${bodyHtml}
    ${linkHtml}
  </section>
</noscript>`;
}

const catalog = await readJson(path.join(contentDir, 'catalog.json'));
const catalogLastmod = sanitizeDate(catalog.version);
const routes = [];

function addRoute(route) {
  routes.push({
    ...route,
    lastmod: sanitizeDate(route.lastmod || catalogLastmod),
    url: absolutePageUrl(route.path),
  });
}

addRoute({
  path: '/',
  title: `${SITE_NAME} | 家電與生活商品比較指南`,
  description: SITE_DESCRIPTION,
  type: 'website',
  priority: '1.0',
  lastmod: catalogLastmod,
  image: absoluteUrl('/images/books/product-comparisons.svg'),
  structuredData: [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE_NAME,
      url: absoluteUrl('/'),
      description: SITE_DESCRIPTION,
      inLanguage: 'zh-TW',
      potentialAction: {
        '@type': 'SearchAction',
        target: `${absolutePageUrl('/search')}?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: SITE_NAME,
      url: absoluteUrl('/'),
    },
  ],
  staticHtml: staticHtml({
    title: `${SITE_NAME} | 家電與生活商品比較指南`,
    description: SITE_DESCRIPTION,
  }),
});

const books = [...(catalog.books || [])]
  .filter((book) => book.published !== false)
  .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

const llmsLines = [
  `# ${SITE_NAME}`,
  '',
  `> ${SITE_DESCRIPTION}`,
  '',
  `- Site: ${absoluteUrl('/')}`,
  `- Sitemap: ${absoluteUrl('/sitemap.xml')}`,
  `- RSS: ${absoluteUrl('/feed.xml')}`,
  `- Search: ${absolutePageUrl('/search')}`,
  '',
  '## Collections',
];
const feedItems = [];
const searchLinks = [];

for (const bookRef of books) {
  const bookJsonPath = publicFilePath(bookRef.bookJson);
  const book = await readJson(bookJsonPath);
  const lastmod = sanitizeDate(book.updatedAt || bookRef.updatedAt || catalogLastmod);
  const bookPath = `/articles/${book.slug}`;
  const bookUrl = absolutePageUrl(bookPath);
  const bookTitle = book.title || bookRef.title || book.slug;
  const bookDescription = truncate(book.summary || bookRef.summary || `${bookTitle} on ${SITE_NAME}`, 220);
  const cover = book.cover || bookRef.cover || '/images/books/product-comparisons.svg';
  const chapters = [...(book.chapters || [])]
    .filter((chapter) => chapter.published !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const chapterLinks = chapters.map((chapter) => ({
    title: chapter.title,
    summary: chapter.summary,
    path: `/articles/${book.slug}/${chapter.slug}`,
    url: absolutePageUrl(`/articles/${book.slug}/${chapter.slug}`),
  }));

  llmsLines.push(`- [${bookTitle}](${bookUrl}): ${bookDescription}`);
  searchLinks.push({
    title: bookTitle,
    summary: bookDescription,
    path: bookPath,
    url: bookUrl,
  });

  addRoute({
    path: bookPath,
    title: `${bookTitle} | ${SITE_NAME}`,
    description: bookDescription,
    type: 'website',
    priority: book.slug === 'product-comparisons' ? '0.9' : '0.7',
    lastmod,
    image: absoluteUrl(cover),
    structuredData: [
      {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: bookTitle,
        headline: bookTitle,
        description: bookDescription,
        url: bookUrl,
        inLanguage: 'zh-TW',
        dateModified: lastmod,
        isPartOf: {
          '@type': 'WebSite',
          name: SITE_NAME,
          url: absoluteUrl('/'),
        },
        mainEntity: itemList(chapterLinks.slice(0, 50)),
      },
      {
        '@context': 'https://schema.org',
        ...breadcrumbItems([
          { name: SITE_NAME, url: absoluteUrl('/') },
          { name: bookTitle, url: bookUrl },
        ]),
      },
    ],
    staticHtml: staticHtml({
      title: bookTitle,
      description: bookDescription,
      links: chapterLinks,
    }),
  });

  llmsLines.push('');
  llmsLines.push(`## ${bookTitle}`);

  for (const chapter of chapters) {
    const chapterPath = `/articles/${book.slug}/${chapter.slug}`;
    const chapterUrl = absolutePageUrl(chapterPath);
    const articleBody = await readMarkdownSnippet(chapter.md);
    const description = truncate(chapter.summary || articleBody || `${chapter.title} on ${SITE_NAME}`, 240);

    llmsLines.push(`- [${chapter.title}](${chapterUrl}): ${description}`);
    searchLinks.push({
      title: chapter.title,
      summary: description,
      path: chapterPath,
      url: chapterUrl,
    });
    feedItems.push({
      title: chapter.title,
      description,
      url: chapterUrl,
      lastmod,
      section: bookTitle,
    });

    addRoute({
      path: chapterPath,
      title: `${chapter.title} | ${bookTitle} | ${SITE_NAME}`,
      description,
      type: 'article',
      priority: book.slug === 'product-comparisons' ? '0.8' : '0.6',
      lastmod,
      image: absoluteUrl(cover),
      structuredData: [
        {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: chapter.title,
          description,
          articleBody,
          articleSection: bookTitle,
          url: chapterUrl,
          mainEntityOfPage: chapterUrl,
          inLanguage: 'zh-TW',
          datePublished: lastmod,
          dateModified: lastmod,
          publisher: {
            '@type': 'Organization',
            name: SITE_NAME,
            url: absoluteUrl('/'),
          },
          isPartOf: {
            '@type': 'WebSite',
            name: SITE_NAME,
            url: absoluteUrl('/'),
          },
        },
        {
          '@context': 'https://schema.org',
          ...breadcrumbItems([
            { name: SITE_NAME, url: absoluteUrl('/') },
            { name: bookTitle, url: bookUrl },
            { name: chapter.title, url: chapterUrl },
          ]),
        },
      ],
      staticHtml: staticHtml({
        title: chapter.title,
        description,
        articleBody,
      }),
    });
  }

  llmsLines.push('');
}

addRoute({
  path: '/search',
  title: SEARCH_TITLE,
  description: SEARCH_DESCRIPTION,
  type: 'website',
  priority: '0.95',
  lastmod: catalogLastmod,
  image: absoluteUrl('/images/books/product-comparisons.svg'),
  structuredData: [
    {
      '@context': 'https://schema.org',
      '@type': 'SearchResultsPage',
      name: SEARCH_TITLE,
      headline: SEARCH_TITLE,
      description: SEARCH_DESCRIPTION,
      url: absolutePageUrl('/search'),
      inLanguage: 'zh-TW',
      dateModified: catalogLastmod,
      isPartOf: {
        '@type': 'WebSite',
        name: SITE_NAME,
        url: absoluteUrl('/'),
      },
      mainEntity: itemList(searchLinks.slice(0, 80)),
    },
    {
      '@context': 'https://schema.org',
      ...breadcrumbItems([
        { name: SITE_NAME, url: absoluteUrl('/') },
        { name: '搜尋入口', url: absolutePageUrl('/search') },
      ]),
    },
  ],
  staticHtml: staticHtml({
    title: SEARCH_TITLE,
    description: SEARCH_DESCRIPTION,
    links: searchLinks.slice(0, 80),
  }),
});

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (route) => `  <url>
    <loc>${escapeXml(route.url)}</loc>
    <lastmod>${escapeXml(route.lastmod)}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${route.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>
`;

const robots = `User-agent: *
Allow: /

Sitemap: ${absoluteUrl('/sitemap.xml')}
`;

const rssItems = feedItems
  .sort((a, b) => b.lastmod.localeCompare(a.lastmod))
  .slice(0, 80)
  .map(
    (item) => `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(item.url)}</link>
      <guid isPermaLink="true">${escapeXml(item.url)}</guid>
      <pubDate>${escapeXml(rssDate(item.lastmod))}</pubDate>
      <category>${escapeXml(item.section)}</category>
      <description>${escapeXml(item.description)}</description>
    </item>`,
  )
  .join('\n');

const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(SITE_NAME)}</title>
    <link>${escapeXml(absoluteUrl('/'))}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>zh-TW</language>
    <lastBuildDate>${escapeXml(rssDate(catalogLastmod))}</lastBuildDate>
${rssItems}
  </channel>
</rss>
`;

await mkdir(publicDir, { recursive: true });
await writeFile(path.join(publicDir, 'sitemap.xml'), sitemap, 'utf8');
await writeFile(path.join(publicDir, 'robots.txt'), robots, 'utf8');
await writeFile(path.join(publicDir, 'seo-routes.json'), `${JSON.stringify(routes, null, 2)}\n`, 'utf8');
await writeFile(path.join(publicDir, 'llms.txt'), `${llmsLines.join('\n').trim()}\n`, 'utf8');
await writeFile(path.join(publicDir, 'feed.xml'), feed, 'utf8');
await writeFile(path.join(publicDir, 'rss.xml'), feed, 'utf8');

console.log(`Generated robots.txt, sitemap.xml, seo-routes.json, llms.txt, and feed.xml with ${routes.length} URLs.`);
