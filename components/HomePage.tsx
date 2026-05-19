import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  ArrowRight,
} from 'lucide-react';
import BookCard from './BookCard.tsx';
import { loadHomeContent } from '../src/lib/contentApi.ts';
import { setPageMeta } from '../src/lib/seo.ts';
import type { CatalogBook, CatalogContent, HomeContent, SiteContent } from '../src/types/index.ts';

const AnimatedPlaceholder: React.FC<{ placeholders: string[] }> = ({ placeholders }) => {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);
  const [blink, setBlink] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setBlink((prev) => !prev), 500);
    return () => clearTimeout(timeout);
  }, [blink]);

  useEffect(() => {
    if (placeholders.length === 0) {
      return;
    }

    if (index >= placeholders.length) {
      setIndex(0);
      return;
    }

    if (subIndex === placeholders[index].length + 1 && !reverse) {
      const timeout = setTimeout(() => setReverse(true), 1000);
      return () => clearTimeout(timeout);
    }

    if (subIndex === 0 && reverse) {
      setReverse(false);
      setIndex((prev) => (prev + 1) % placeholders.length);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (reverse ? -1 : 1));
    }, reverse ? 75 : 150);

    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse, placeholders]);

  return (
    <span className="pointer-events-none absolute left-14 top-1/2 hidden -translate-y-1/2 text-lg text-slate-400 sm:block">
      搜尋資料、比較、關鍵字：
      <span className="font-medium text-slate-600">
        {(placeholders[index] ?? '').substring(0, subIndex)}
      </span>
      <span className={`${blink ? 'opacity-100' : 'opacity-0'} ml-0.5 inline-block h-5 border-r-2 border-slate-400 align-middle`} />
    </span>
  );
};

const HeroSection: React.FC<{
  site: SiteContent;
  query: string;
  onQueryChange: (value: string) => void;
}> = ({ site, query, onQueryChange }) => {
  const { hero } = site;

  return (
    <section className="relative flex h-[80vh] w-full items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0 bg-white">
        <div className="mask-image-gradient absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div className="absolute inset-0 h-full w-full bg-gradient-to-t from-white via-transparent to-transparent" />
      </div>

      <div className="container z-10 mx-auto grid grid-cols-1 items-center gap-12 px-6 lg:grid-cols-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="flex flex-col gap-8 text-center lg:col-span-7 lg:text-left"
        >
          <h1 className="font-serif text-5xl font-bold leading-[1.1] tracking-tight text-slate-900 md:text-7xl">
            {hero.titlePrefix}<br />
            <span className="bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
              {hero.titleHighlight}
            </span>
          </h1>

          <div className="group relative mx-auto w-full max-w-2xl lg:mx-0">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-slate-200 to-slate-100 opacity-40 blur transition duration-200 group-hover:opacity-75" />
            <div className="relative flex h-16 items-center rounded-full border border-slate-100 bg-white p-2 shadow-2xl md:h-20">
              <div className="pl-6 text-slate-400">
                <Search className="h-6 w-6" />
              </div>
              <input
                type="text"
                value={query}
                onChange={(event) => onQueryChange(event.target.value)}
                className="z-10 h-full w-full border-none bg-transparent pl-4 text-lg text-slate-900 outline-none placeholder:text-slate-400 sm:placeholder-transparent"
                placeholder="Search content"
              />
              {!query && <AnimatedPlaceholder placeholders={hero.searchPlaceholders} />}
              <button className="flex h-full items-center gap-2 rounded-full bg-slate-900 px-6 font-medium text-white transition-colors hover:bg-slate-800 md:px-8">
                Search <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="relative flex flex-col items-center lg:col-span-5 lg:items-end"
        >
          <div className="relative">
            <motion.div
              className="absolute -right-12 -top-24 z-20 hidden max-w-[280px] rounded-lg border border-slate-100 bg-white p-6 shadow-xl lg:block"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              <p className="font-serif text-lg italic leading-relaxed text-slate-700">
                "{hero.founder.quote}<span className="font-bold text-slate-900">{hero.founder.quoteHighlight}</span>"
              </p>
              <div className="absolute bottom-0 right-8 h-4 w-4 translate-y-1/2 rotate-45 border-r border-slate-100 bg-white" />
            </motion.div>

            <div className="relative h-32 w-32 md:h-40 md:w-40">
              <div className="absolute inset-0 animate-pulse rounded-full border-[3px] border-amber-400" />
              <img
                src={hero.founder.image}
                alt="Founder"
                className="h-full w-full rounded-full border-4 border-white object-cover shadow-lg"
              />
              <div className="absolute bottom-0 right-0 rounded-full border-2 border-white bg-slate-900 px-2 py-1 text-xs font-bold text-white">
                {hero.founder.label}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const categoryLabel = (catalog: CatalogContent, categoryId: string) =>
  catalog.categories.find((category) => category.id === categoryId)?.label ?? categoryId;

const LibrarySection: React.FC<{
  site: SiteContent;
  catalog: CatalogContent;
  books: CatalogBook[];
}> = ({ site, catalog, books }) => {
  const { library } = site;

  return (
    <section className="overflow-hidden border-y border-slate-200 bg-slate-50 py-24">
      <div className="container mx-auto mb-12 px-6">
        <h2 className="font-serif text-3xl font-bold text-slate-900">{library.title}</h2>
        <p className="mt-2 text-slate-500">{library.subtitle}</p>
      </div>

      <div className="container mx-auto px-6">
        {books.length > 0 ? (
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {books.map((book) => (
              <div key={book.slug}>
                <div className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  {categoryLabel(catalog, book.category)}
                </div>
                <BookCard book={book} version={catalog.version} />
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
            目前沒有已發布內容，請檢查 <code className="rounded bg-slate-100 px-1.5 py-0.5">public/content/catalog.json</code>。
          </div>
        )}
      </div>
    </section>
  );
};

const HomePage: React.FC = () => {
  const [content, setContent] = useState<HomeContent | null>(null);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    loadHomeContent(controller.signal)
      .then(setContent)
      .catch((err: unknown) => {
        if (!controller.signal.aborted) {
          setError(err instanceof Error ? err.message : 'Content loading failed.');
        }
      });

    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!content) {
      return;
    }

    setPageMeta({
      title: `${content.site.siteName} | Curated Guides`,
      description: `${content.site.hero.titlePrefix}${content.site.hero.titleHighlight} ${content.site.library.subtitle}`,
      path: '/',
      type: 'website',
    });
  }, [content]);

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="max-w-xl rounded-lg border border-red-100 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-500">Content error</p>
          <h1 className="mt-3 font-serif text-3xl font-bold text-slate-900">資料載入失敗</h1>
          <p className="mt-4 text-slate-600">{error}</p>
        </div>
      </main>
    );
  }

  if (!content) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white px-6 text-slate-500">
        Loading content...
      </main>
    );
  }

  const normalizedQuery = query.trim().toLowerCase();
  const filteredBooks = normalizedQuery
    ? content.books.filter((book) =>
        [book.title, book.summary, book.category].some((value) =>
          value.toLowerCase().includes(normalizedQuery),
        ),
      )
    : content.books;

  return (
    <main className="min-h-screen w-full bg-white">
      <HeroSection site={content.site} query={query} onQueryChange={setQuery} />
      <LibrarySection site={content.site} catalog={content.catalog} books={filteredBooks} />
    </main>
  );
};

export default HomePage;
