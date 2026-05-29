import type {
  BookContent,
  CatalogBook,
  CatalogCategory,
  CatalogContent,
  ChapterContent,
  HomeContent,
  SearchContent,
  SearchIndexItem,
  SiteContent,
} from '../types';

const APP_BASE = import.meta.env.BASE_URL || '/';
const CONTENT_ROOT = '/content';

type UnknownRecord = Record<string, unknown>;

const resolvePublicPath = (path: string): string => {
  if (!path || /^(https?:)?\/\//i.test(path) || path.startsWith('data:')) {
    return path;
  }

  if (!path.startsWith('/')) {
    return path;
  }

  if (APP_BASE === '/') {
    return path;
  }

  return `${APP_BASE.replace(/\/$/, '')}${path}`;
};

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const readRecord = (value: unknown, label: string): UnknownRecord => {
  if (!isRecord(value)) {
    throw new Error(`${label} must be an object.`);
  }
  return value;
};

const readString = (value: unknown, fallback = ''): string =>
  typeof value === 'string' ? value : fallback;

const readBoolean = (value: unknown, fallback = true): boolean =>
  typeof value === 'boolean' ? value : fallback;

const readNumber = (value: unknown, fallback = 0): number =>
  typeof value === 'number' && Number.isFinite(value) ? value : fallback;

const readArray = <T>(value: unknown, mapper: (item: unknown, index: number) => T): T[] =>
  Array.isArray(value) ? value.map(mapper) : [];

const assertSlug = (slug: string, label: string) => {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error(`${label} slug "${slug}" must use lowercase letters, numbers, and hyphens.`);
  }
};

const sortByOrder = <T extends { order: number }>(items: T[]): T[] =>
  [...items].sort((a, b) => a.order - b.order);

export const versionedAssetPath = (path: string, version?: string): string => {
  const resolvedPath = resolvePublicPath(path);

  if (!resolvedPath || !version || /^(https?:)?\/\//i.test(resolvedPath) || resolvedPath.startsWith('data:')) {
    return resolvedPath;
  }

  const separator = resolvedPath.includes('?') ? '&' : '?';
  return `${resolvedPath}${separator}v=${encodeURIComponent(version)}`;
};

async function fetchJson<T>(path: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(resolvePublicPath(path), {
    cache: 'no-store',
    signal,
  });

  if (!response.ok) {
    throw new Error(`Cannot load ${path}: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}

export async function fetchMarkdown(path: string, signal?: AbortSignal): Promise<string> {
  const response = await fetch(resolvePublicPath(path), {
    cache: 'no-store',
    signal,
  });

  if (!response.ok) {
    throw new Error(`Cannot load ${path}: ${response.status} ${response.statusText}`);
  }

  return response.text();
}

export function normalizeSiteContent(value: unknown): SiteContent {
  const data = readRecord(value, 'site.json');
  const hero = readRecord(data.hero, 'site.hero');
  const founder = readRecord(hero.founder, 'site.hero.founder');
  const library = readRecord(data.library, 'site.library');

  const site: SiteContent = {
    siteName: readString(data.siteName, 'GoodStuff'),
    version: readString(data.version, 'dev'),
    hero: {
      titlePrefix: readString(hero.titlePrefix, '把內容整理成可更新的資料，'),
      titleHighlight: readString(hero.titleHighlight, '用靜態網站發布。'),
      searchPlaceholders: readArray(hero.searchPlaceholders, (item) => readString(item)).filter(Boolean),
      founder: {
        quote: readString(founder.quote),
        quoteHighlight: readString(founder.quoteHighlight),
        image: readString(founder.image),
        label: readString(founder.label, 'FOUNDER'),
      },
    },
    library: {
      title: readString(library.title, 'Featured Collections'),
      subtitle: readString(library.subtitle, 'The foundation of our intelligence.'),
    },
  };

  if (site.hero.searchPlaceholders.length === 0) {
    site.hero.searchPlaceholders = ['Dyson', '除濕機', '店鋪推薦'];
  }

  return site;
}

const normalizeCategory = (item: unknown, index: number): CatalogCategory => {
  const category = readRecord(item, `catalog.categories[${index}]`);
  const id = readString(category.id);
  assertSlug(id, `catalog.categories[${index}]`);

  return {
    id,
    label: readString(category.label, id),
    order: readNumber(category.order, index),
  };
};

const normalizeCatalogBook = (item: unknown, index: number): CatalogBook => {
  const book = readRecord(item, `catalog.books[${index}]`);
  const slug = readString(book.slug);
  assertSlug(slug, `catalog.books[${index}]`);

  return {
    slug,
    title: readString(book.title, slug),
    category: readString(book.category, 'uncategorized'),
    summary: readString(book.summary),
    cover: readString(book.cover),
    bookJson: readString(book.bookJson, `${CONTENT_ROOT}/books/${slug}/book.json`),
    published: readBoolean(book.published, true),
    order: readNumber(book.order, index),
    updatedAt: readString(book.updatedAt),
  };
};

export function normalizeCatalogContent(value: unknown): CatalogContent {
  const data = readRecord(value, 'catalog.json');
  const categories = sortByOrder(readArray(data.categories, normalizeCategory));
  const books = sortByOrder(readArray(data.books, normalizeCatalogBook));
  const seen = new Set<string>();

  for (const book of books) {
    if (seen.has(book.slug)) {
      throw new Error(`catalog.books contains duplicate slug "${book.slug}".`);
    }
    seen.add(book.slug);
  }

  return {
    version: readString(data.version, 'dev'),
    categories,
    books,
  };
}

const normalizeAffiliateLink = (item: unknown, index: number) => {
  const link = readRecord(item, `book.affiliateLinks[${index}]`);
  return {
    label: readString(link.label, `Link ${index + 1}`),
    url: readString(link.url),
  };
};

const normalizeChapter = (item: unknown, index: number): ChapterContent => {
  const chapter = readRecord(item, `book.chapters[${index}]`);
  const slug = readString(chapter.slug);
  assertSlug(slug, `book.chapters[${index}]`);

  return {
    slug,
    title: readString(chapter.title, slug),
    summary: readString(chapter.summary),
    md: readString(chapter.md),
    order: readNumber(chapter.order, index),
    published: readBoolean(chapter.published, true),
  };
};

export function normalizeBookContent(value: unknown): BookContent {
  const data = readRecord(value, 'book.json');
  const slug = readString(data.slug);
  assertSlug(slug, 'book');

  const chapters = sortByOrder(readArray(data.chapters, normalizeChapter));
  const chapterSlugs = new Set<string>();

  for (const chapter of chapters) {
    if (!chapter.md) {
      throw new Error(`Chapter "${chapter.slug}" is missing md path.`);
    }
    if (chapterSlugs.has(chapter.slug)) {
      throw new Error(`book.chapters contains duplicate slug "${chapter.slug}".`);
    }
    chapterSlugs.add(chapter.slug);
  }

  return {
    slug,
    title: readString(data.title, slug),
    category: readString(data.category, 'uncategorized'),
    summary: readString(data.summary),
    cover: readString(data.cover),
    updatedAt: readString(data.updatedAt),
    affiliateLinks: readArray(data.affiliateLinks, normalizeAffiliateLink).filter((link) => link.url),
    chapters,
  };
}

export async function loadSiteContent(signal?: AbortSignal): Promise<SiteContent> {
  return normalizeSiteContent(await fetchJson(`${CONTENT_ROOT}/site.json`, signal));
}

export async function loadCatalogContent(signal?: AbortSignal): Promise<CatalogContent> {
  return normalizeCatalogContent(await fetchJson(`${CONTENT_ROOT}/catalog.json`, signal));
}

export async function loadHomeContent(signal?: AbortSignal): Promise<HomeContent> {
  const [site, catalog] = await Promise.all([
    loadSiteContent(signal),
    loadCatalogContent(signal),
  ]);

  return {
    site,
    catalog,
    books: catalog.books.filter((book) => book.published),
  };
}

export async function loadBookContent(bookJsonPath: string, signal?: AbortSignal): Promise<BookContent> {
  return normalizeBookContent(await fetchJson(bookJsonPath, signal));
}

export async function loadBookRouteContent(
  bookSlug: string,
  signal?: AbortSignal,
): Promise<{ catalog: CatalogContent; bookRef?: CatalogBook; book: BookContent }> {
  const catalog = await loadCatalogContent(signal);
  const bookRef = catalog.books.find((book) => book.slug === bookSlug);
  const bookJsonPath = bookRef?.bookJson ?? `${CONTENT_ROOT}/books/${bookSlug}/book.json`;
  const book = await loadBookContent(bookJsonPath, signal);

  return {
    catalog,
    bookRef,
    book,
  };
}

const normalizeSearchText = (...values: string[]) =>
  values
    .join(' ')
    .toLocaleLowerCase('zh-TW')
    .replace(/\s+/g, ' ')
    .trim();

export async function loadSearchContent(signal?: AbortSignal): Promise<SearchContent> {
  const catalog = await loadCatalogContent(signal);
  const bookRefs = catalog.books.filter((book) => book.published);
  const books = await Promise.all(bookRefs.map((book) => loadBookContent(book.bookJson, signal)));
  const items: SearchIndexItem[] = [];

  for (const book of books) {
    const bookRef = bookRefs.find((item) => item.slug === book.slug);
    const updatedAt = book.updatedAt || bookRef?.updatedAt || catalog.version;

    items.push({
      id: `collection:${book.slug}`,
      type: 'collection',
      title: book.title,
      summary: book.summary || bookRef?.summary || '',
      url: `/articles/${book.slug}`,
      bookSlug: book.slug,
      bookTitle: book.title,
      category: book.category || bookRef?.category || 'uncategorized',
      order: bookRef?.order ?? 0,
      updatedAt,
      searchableText: normalizeSearchText(book.title, book.summary, book.slug, book.category),
    });

    for (const chapter of book.chapters.filter((chapter) => chapter.published)) {
      items.push({
        id: `article:${book.slug}:${chapter.slug}`,
        type: 'article',
        title: chapter.title,
        summary: chapter.summary,
        url: `/articles/${book.slug}/${chapter.slug}`,
        bookSlug: book.slug,
        bookTitle: book.title,
        category: book.category || bookRef?.category || 'uncategorized',
        order: (bookRef?.order ?? 0) * 1000 + chapter.order,
        updatedAt,
        searchableText: normalizeSearchText(
          chapter.title,
          chapter.summary,
          chapter.slug,
          book.title,
          book.summary,
          book.category,
        ),
      });
    }
  }

  return {
    catalog,
    books,
    items: items.sort((a, b) => a.order - b.order),
  };
}
