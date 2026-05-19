import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import BookCard from './BookCard.tsx';
import { loadHomeContent } from '../src/lib/contentApi.ts';
import { setPageMeta } from '../src/lib/seo.ts';
import type { CatalogBook, CatalogContent, HomeContent, SiteContent } from '../src/types/index.ts';

const HeroSection: React.FC<{ site: SiteContent }> = ({ site }) => {
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
            目前沒有已發布內容。
          </div>
        )}
      </div>
    </section>
  );
};

const HomePage: React.FC = () => {
  const [content, setContent] = useState<HomeContent | null>(null);
  const [error, setError] = useState('');

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

  return (
    <main className="min-h-screen w-full bg-white">
      <HeroSection site={content.site} />
      <LibrarySection site={content.site} catalog={content.catalog} books={content.books} />
    </main>
  );
};

export default HomePage;
