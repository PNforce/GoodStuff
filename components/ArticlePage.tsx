import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import {
  fetchMarkdown,
  loadBookRouteContent,
  versionedAssetPath,
} from '../src/lib/contentApi.ts';
import { setPageMeta } from '../src/lib/seo.ts';
import type { BookContent, CatalogBook, CatalogContent, ChapterContent } from '../src/types/index.ts';

interface ArticleState {
  catalog: CatalogContent;
  bookRef?: CatalogBook;
  book: BookContent;
  markdown?: string;
}

const SITE_NAME = 'GoodStuff';

const LoadingState = () => (
  <div className="flex min-h-screen items-center justify-center bg-white px-6 text-slate-500">
    Loading content...
  </div>
);

const ErrorState: React.FC<{ message: string }> = ({ message }) => (
  <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
    <div className="max-w-xl rounded-lg border border-red-100 bg-white p-8 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-500">Content error</p>
      <h1 className="mt-3 font-serif text-3xl font-bold text-slate-900">內容載入失敗</h1>
      <p className="mt-4 text-slate-600">{message}</p>
      <Link to="/" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-900">
        <ArrowLeft className="h-4 w-4" /> 回首頁
      </Link>
    </div>
  </main>
);

const publishedChapters = (book: BookContent) =>
  book.chapters.filter((chapter) => chapter.published).sort((a, b) => a.order - b.order);

const BookCover: React.FC<{ book: BookContent; bookRef?: CatalogBook; version: string }> = ({
  book,
  bookRef,
  version,
}) => {
  const [imageFailed, setImageFailed] = useState(false);
  const cover = versionedAssetPath(book.cover || bookRef?.cover || '', book.updatedAt || bookRef?.updatedAt || version);

  return (
    <div className="aspect-[2/3] w-full overflow-hidden rounded-lg bg-slate-200 shadow-sm">
      {cover && !imageFailed ? (
        <img
          src={cover}
          alt={book.title}
          onError={() => setImageFailed(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-300 px-6 text-center font-serif text-2xl font-bold text-slate-700">
          {book.title}
        </div>
      )}
    </div>
  );
};

const BookIndex: React.FC<{
  catalog: CatalogContent;
  bookRef?: CatalogBook;
  book: BookContent;
}> = ({ catalog, bookRef, book }) => {
  const chapters = publishedChapters(book);

  return (
    <main className="min-h-screen bg-white">
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="container mx-auto grid grid-cols-1 gap-10 px-6 py-16 md:grid-cols-[220px_1fr] md:py-20">
          <BookCover book={book} bookRef={bookRef} version={catalog.version} />
          <div className="flex flex-col justify-center">
            <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900">
              <ArrowLeft className="h-4 w-4" /> Back to Library
            </Link>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">{book.category}</p>
            <h1 className="mt-4 font-serif text-4xl font-bold leading-tight text-slate-900 md:text-6xl">{book.title}</h1>
            {book.summary && <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">{book.summary}</p>}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 py-14">
        <h2 className="font-serif text-3xl font-bold text-slate-900">Chapters</h2>
        {chapters.length > 0 ? (
          <div className="mt-8 divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white">
            {chapters.map((chapter) => (
              <Link
                key={chapter.slug}
                to={`/articles/${book.slug}/${chapter.slug}`}
                className="flex flex-col gap-3 p-6 transition hover:bg-slate-50 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <h3 className="font-serif text-xl font-semibold text-slate-900">{chapter.title}</h3>
                  {chapter.summary && <p className="mt-2 text-sm leading-6 text-slate-500">{chapter.summary}</p>}
                </div>
                <ArrowRight className="h-5 w-5 shrink-0 text-slate-400" />
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-500">
            目前沒有已發布章節。
          </div>
        )}
      </section>
    </main>
  );
};

const ChapterView: React.FC<{
  catalog: CatalogContent;
  book: BookContent;
  chapter: ChapterContent;
  markdown: string;
}> = ({ catalog, book, chapter, markdown }) => {
  const chapters = publishedChapters(book);
  const chapterIndex = chapters.findIndex((item) => item.slug === chapter.slug);
  const previous = chapterIndex > 0 ? chapters[chapterIndex - 1] : undefined;
  const next = chapterIndex >= 0 && chapterIndex < chapters.length - 1 ? chapters[chapterIndex + 1] : undefined;
  const assetVersion = book.updatedAt || catalog.version;

  return (
    <main className="min-h-screen bg-white">
      <article className="mx-auto max-w-3xl px-6 py-10 md:py-16">
        <Link to={`/articles/${book.slug}`} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900">
          <ArrowLeft className="h-4 w-4" /> Back to {book.title}
        </Link>

        <header className="mt-10 border-b border-slate-200 pb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">{book.title}</p>
          <h1 className="mt-4 font-serif text-4xl font-bold leading-tight text-slate-900 md:text-5xl">{chapter.title}</h1>
          {chapter.summary && <p className="mt-5 text-lg leading-8 text-slate-600">{chapter.summary}</p>}
        </header>

        <div className="mt-10 text-slate-700">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => <h2 className="mt-10 font-serif text-3xl font-bold text-slate-900">{children}</h2>,
              h2: ({ children }) => <h2 className="mt-10 font-serif text-2xl font-bold text-slate-900">{children}</h2>,
              h3: ({ children }) => <h3 className="mt-8 text-xl font-semibold text-slate-900">{children}</h3>,
              p: ({ children }) => <p className="mt-5 leading-8">{children}</p>,
              ul: ({ children }) => <ul className="mt-5 list-disc space-y-2 pl-6 leading-8">{children}</ul>,
              ol: ({ children }) => <ol className="mt-5 list-decimal space-y-2 pl-6 leading-8">{children}</ol>,
              blockquote: ({ children }) => (
                <blockquote className="mt-6 border-l-4 border-slate-300 pl-5 italic text-slate-600">{children}</blockquote>
              ),
              a: ({ href, children }) => (
                <a
                  href={href}
                  target={href?.startsWith('http') ? '_blank' : undefined}
                  rel={href?.startsWith('http') ? 'noreferrer' : undefined}
                  className="font-semibold text-slate-900 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-900"
                >
                  {children}
                </a>
              ),
              img: ({ src, alt }) => (
                <img
                  src={versionedAssetPath(src ?? '', assetVersion)}
                  alt={alt ?? ''}
                  className="mt-8 w-full rounded-lg border border-slate-200 object-cover"
                />
              ),
              code: ({ children }) => (
                <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm text-slate-900">{children}</code>
              ),
              pre: ({ children }) => (
                <pre className="mt-6 overflow-x-auto rounded-lg bg-slate-950 p-5 text-sm leading-7 text-slate-100">{children}</pre>
              ),
              table: ({ children }) => (
                <div className="mt-8 overflow-x-auto rounded-lg border border-slate-200 shadow-sm">
                  <table className="min-w-full border-collapse bg-white text-left text-sm leading-6">{children}</table>
                </div>
              ),
              thead: ({ children }) => <thead className="bg-slate-900 text-white">{children}</thead>,
              tbody: ({ children }) => <tbody className="divide-y divide-slate-200">{children}</tbody>,
              tr: ({ children }) => <tr className="align-top">{children}</tr>,
              th: ({ children }) => (
                <th className="min-w-40 px-4 py-3 font-semibold">{children}</th>
              ),
              td: ({ children }) => (
                <td className="min-w-40 px-4 py-3 text-slate-700">{children}</td>
              ),
            }}
          >
            {markdown}
          </ReactMarkdown>
        </div>

        {book.affiliateLinks.length > 0 && (
          <aside className="mt-12 rounded-lg border border-slate-200 bg-slate-50 p-6">
            <h2 className="font-serif text-xl font-bold text-slate-900">Affiliate Links</h2>
            <ul className="mt-4 space-y-3">
              {book.affiliateLinks.map((link) => (
                <li key={link.url}>
                  <a href={link.url} className="font-semibold text-slate-900 underline decoration-slate-300 underline-offset-4" target="_blank" rel="noreferrer">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </aside>
        )}

        <nav className="mt-12 flex flex-col gap-4 border-t border-slate-200 pt-8 sm:flex-row sm:justify-between">
          {previous ? (
            <Link to={`/articles/${book.slug}/${previous.slug}`} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900">
              <ArrowLeft className="h-4 w-4" /> {previous.title}
            </Link>
          ) : <span />}
          {next && (
            <Link to={`/articles/${book.slug}/${next.slug}`} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 sm:text-right">
              {next.title} <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </nav>
      </article>
    </main>
  );
};

const ArticlePage: React.FC = () => {
  const { bookSlug = '', chapterSlug } = useParams<{ bookSlug: string; chapterSlug?: string }>();
  const [state, setState] = useState<ArticleState | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      if (!bookSlug) {
        throw new Error('Missing book slug.');
      }

      const routeContent = await loadBookRouteContent(bookSlug, controller.signal);
      const published = publishedChapters(routeContent.book);
      const chapter = chapterSlug
        ? published.find((item) => item.slug === chapterSlug)
        : undefined;

      if (chapterSlug && !chapter) {
        throw new Error(`Chapter "${chapterSlug}" is not published or does not exist.`);
      }

      const markdown = chapter ? await fetchMarkdown(chapter.md, controller.signal) : undefined;
      setState({ ...routeContent, markdown });
    }

    setState(null);
    setError('');
    load().catch((err: unknown) => {
      if (!controller.signal.aborted) {
        setError(err instanceof Error ? err.message : 'Content loading failed.');
      }
    });

    return () => controller.abort();
  }, [bookSlug, chapterSlug]);

  const activeChapter = useMemo(() => {
    if (!state || !chapterSlug) {
      return undefined;
    }
    return publishedChapters(state.book).find((chapter) => chapter.slug === chapterSlug);
  }, [state, chapterSlug]);

  useEffect(() => {
    if (!state) {
      return;
    }

    const path = activeChapter
      ? `/articles/${state.book.slug}/${activeChapter.slug}`
      : `/articles/${state.book.slug}`;
    const title = activeChapter
      ? `${activeChapter.title} | ${state.book.title} | ${SITE_NAME}`
      : `${state.book.title} | ${SITE_NAME}`;
    const description = activeChapter?.summary || state.book.summary || state.bookRef?.summary || `${state.book.title} on ${SITE_NAME}`;

    setPageMeta({
      title,
      description,
      path,
      type: activeChapter ? 'article' : 'website',
    });
  }, [state, activeChapter]);

  if (error) {
    return <ErrorState message={error} />;
  }

  if (!state) {
    return <LoadingState />;
  }

  if (chapterSlug && activeChapter && state.markdown !== undefined) {
    return (
      <ChapterView
        catalog={state.catalog}
        book={state.book}
        chapter={activeChapter}
        markdown={state.markdown}
      />
    );
  }

  return <BookIndex catalog={state.catalog} bookRef={state.bookRef} book={state.book} />;
};

export default ArticlePage;
