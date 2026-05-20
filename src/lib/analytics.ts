const DEFAULT_GA_MEASUREMENT_ID = 'G-49G5GBLQRP';
const DEFAULT_SITE_URL = 'https://PNforce.github.io/GoodStuff/';
const GA_SCRIPT_ID = 'goodstuff-ga4';

type GtagCommand = 'js' | 'config' | 'event';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (command: GtagCommand, target: string | Date, params?: Record<string, unknown>) => void;
    goodstuffAnalyticsReady?: boolean;
  }
}

const measurementId = (import.meta.env.VITE_GA_MEASUREMENT_ID || DEFAULT_GA_MEASUREMENT_ID).trim();
const siteUrl = (import.meta.env.VITE_SITE_URL || DEFAULT_SITE_URL).trim() || DEFAULT_SITE_URL;

let initialized = false;
let lastPageViewKey = '';

const canTrack = () => typeof window !== 'undefined' && typeof document !== 'undefined' && Boolean(measurementId);

export const initAnalytics = () => {
  if (!canTrack() || initialized) {
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || ((...args: unknown[]) => {
    window.dataLayer?.push(args);
  });

  if (!document.getElementById(GA_SCRIPT_ID)) {
    const script = document.createElement('script');
    script.id = GA_SCRIPT_ID;
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
    document.head.appendChild(script);
  }

  if (!window.goodstuffAnalyticsReady) {
    window.gtag('js', new Date());
    window.gtag('config', measurementId, { send_page_view: false });
    window.goodstuffAnalyticsReady = true;
  }

  initialized = true;
};

const resolveUrl = (url?: string) => {
  if (!url || !canTrack()) {
    return undefined;
  }

  try {
    return new URL(url, window.location.href);
  } catch {
    return undefined;
  }
};

export const isShopeeAffiliateUrl = (url?: string) => {
  const parsedUrl = resolveUrl(url);
  const hostname = parsedUrl?.hostname.toLowerCase() || '';
  return hostname === 's.shopee.tw' || hostname.startsWith('s.shopee.');
};

const withTrailingSlash = (value: string) => (value.endsWith('/') ? value : `${value}/`);
const canonicalPageUrl = (path: string) => new URL(path.replace(/^\/+/, ''), withTrailingSlash(siteUrl));
const currentPath = () => `${window.location.pathname}${window.location.search}${window.location.hash}`;

export const trackPageView = (path: string, title: string) => {
  if (!canTrack()) {
    return;
  }

  initAnalytics();

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const pageUrl = canonicalPageUrl(normalizedPath);
  const pagePath = `${pageUrl.pathname}${pageUrl.search}${pageUrl.hash}`;
  const pageViewKey = `${pagePath}|${title}`;

  if (pageViewKey === lastPageViewKey) {
    return;
  }

  lastPageViewKey = pageViewKey;

  window.gtag?.('event', 'page_view', {
    page_title: title,
    page_location: pageUrl.toString(),
    page_path: pagePath,
  });
};

export const trackAffiliateClick = ({
  url,
  label,
  bookSlug,
  bookTitle,
  chapterSlug,
  chapterTitle,
}: {
  url?: string;
  label?: string;
  bookSlug?: string;
  bookTitle?: string;
  chapterSlug?: string;
  chapterTitle?: string;
}) => {
  if (!isShopeeAffiliateUrl(url)) {
    return;
  }

  const parsedUrl = resolveUrl(url);
  if (!parsedUrl) {
    return;
  }

  initAnalytics();

  window.gtag?.('event', 'affiliate_click', {
    affiliate_network: 'shopee',
    link_domain: parsedUrl.hostname,
    link_url: parsedUrl.toString(),
    link_text: (label || '').replace(/\s+/g, ' ').trim().slice(0, 120),
    page_location: window.location.href,
    page_path: currentPath(),
    book_slug: bookSlug,
    book_title: bookTitle,
    chapter_slug: chapterSlug,
    chapter_title: chapterTitle,
    transport_type: 'beacon',
  });
};
