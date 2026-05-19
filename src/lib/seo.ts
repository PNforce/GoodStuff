const DEFAULT_SITE_URL = 'https://PNforce.github.io/GoodStuff/';

type MetaKey = 'name' | 'property';

interface PageMeta {
  title: string;
  description: string;
  path: string;
  type?: 'website' | 'article';
}

const ensureTrailingSlash = (value: string) => (value.endsWith('/') ? value : `${value}/`);

export const absoluteSiteUrl = (path = '/') => {
  const siteUrl = ensureTrailingSlash(
    (import.meta.env.VITE_SITE_URL || DEFAULT_SITE_URL).trim() || DEFAULT_SITE_URL,
  );
  const normalizedPath = path === '/' ? '' : path.replace(/^\/+/, '');
  return new URL(normalizedPath, siteUrl).toString();
};

const upsertMeta = (key: MetaKey, value: string, content: string) => {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${key}="${value}"]`);

  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(key, value);
    document.head.appendChild(element);
  }

  element.setAttribute('content', content);
};

const upsertCanonical = (href: string) => {
  let element = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');

  if (!element) {
    element = document.createElement('link');
    element.rel = 'canonical';
    document.head.appendChild(element);
  }

  element.href = href;
};

export const setPageMeta = ({ title, description, path, type = 'website' }: PageMeta) => {
  const canonical = absoluteSiteUrl(path);
  const cleanDescription = description.trim();

  document.title = title;
  upsertCanonical(canonical);
  upsertMeta('name', 'description', cleanDescription);
  upsertMeta('name', 'robots', 'index,follow');
  upsertMeta('property', 'og:type', type);
  upsertMeta('property', 'og:title', title);
  upsertMeta('property', 'og:description', cleanDescription);
  upsertMeta('property', 'og:url', canonical);
};
