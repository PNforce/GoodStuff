import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, BookOpen, Layers, PackageSearch, Search } from 'lucide-react';
import { loadSearchContent } from '../src/lib/contentApi.ts';
import { setPageMeta } from '../src/lib/seo.ts';
import type { SearchContent, SearchIndexItem } from '../src/types/index.ts';

const SEARCH_TITLE = '搜尋商品比較、店鋪與單品指南 | GoodStuff';
const SEARCH_DESCRIPTION = '用關鍵字快速搜尋 GoodStuff 的商品比較、店鋪介紹與單品推薦，依照用途、品牌、品類與使用情境找到可閱讀的選購內容。';

const quickKeywords = ['Dyson', '除濕機', '空氣清淨機', '吸塵器', '投影機', '電煮鍋', '手燈', '店鋪'];

const normalize = (value: string) =>
  value
    .toLocaleLowerCase('zh-TW')
    .replace(/\s+/g, ' ')
    .trim();

const splitTerms = (query: string) => normalize(query).split(' ').filter(Boolean);

const typeLabel = (type: SearchIndexItem['type']) => (type === 'collection' ? '分類入口' : '文章');

const typeIcon = (type: SearchIndexItem['type']) =>
  type === 'collection' ? <Layers className="h-4 w-4" /> : <BookOpen className="h-4 w-4" />;

const scoreResult = (item: SearchIndexItem, terms: string[]) => {
  if (terms.length === 0) {
    return item.type === 'collection' ? 5 : 0;
  }

  const title = normalize(item.title);
  const summary = normalize(item.summary);
  let score = 0;

  for (const term of terms) {
    if (title === term) {
      score += 80;
    } else if (title.includes(term)) {
      score += 40;
    }

    if (summary.includes(term)) {
      score += 16;
    }

    if (normalize(item.bookTitle).includes(term)) {
      score += 10;
    }
  }

  if (item.type === 'collection') {
    score += 6;
  }

  return score;
};

const LoadingState = () => (
  <main className="flex min-h-screen items-center justify-center bg-white px-6 text-slate-500">
    Loading search index...
  </main>
);

const ErrorState: React.FC<{ message: string }> = ({ message }) => (
  <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
    <div className="max-w-xl rounded-lg border border-red-100 bg-white p-8 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-500">Search error</p>
      <h1 className="mt-3 font-serif text-3xl font-bold text-slate-900">搜尋資料載入失敗</h1>
      <p className="mt-4 text-slate-600">{message}</p>
      <Link to="/" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-900">
        <ArrowLeft className="h-4 w-4" /> 回首頁
      </Link>
    </div>
  </main>
);

const ResultCard: React.FC<{ item: SearchIndexItem }> = ({ item }) => (
  <Link
    to={item.url}
    className="block rounded-lg border border-slate-200 bg-white p-5 transition hover:border-slate-400 hover:shadow-sm"
  >
    <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500">
      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1">
        {typeIcon(item.type)}
        {typeLabel(item.type)}
      </span>
      <span>{item.bookTitle}</span>
      {item.updatedAt && <span>更新 {item.updatedAt}</span>}
    </div>
    <h2 className="mt-3 font-serif text-2xl font-bold leading-snug text-slate-900">{item.title}</h2>
    {item.summary && <p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-600">{item.summary}</p>}
  </Link>
);

const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [content, setContent] = useState<SearchContent | null>(null);
  const [error, setError] = useState('');

  const query = searchParams.get('q') ?? '';
  const activeBook = searchParams.get('book') ?? 'all';

  useEffect(() => {
    setPageMeta({
      title: SEARCH_TITLE,
      description: SEARCH_DESCRIPTION,
      path: '/search',
      type: 'website',
    });
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    loadSearchContent(controller.signal)
      .then(setContent)
      .catch((err: unknown) => {
        if (!controller.signal.aborted) {
          setError(err instanceof Error ? err.message : 'Search content loading failed.');
        }
      });

    return () => controller.abort();
  }, []);

  const setParam = (key: 'q' | 'book', value: string) => {
    const next = new URLSearchParams(searchParams);

    if (!value || value === 'all') {
      next.delete(key);
    } else {
      next.set(key, value);
    }

    setSearchParams(next, { replace: true });
  };

  const bookOptions = useMemo(() => {
    if (!content) {
      return [];
    }

    return content.books.map((book) => ({
      slug: book.slug,
      title: book.title,
      count: content.items.filter((item) => item.bookSlug === book.slug).length,
    }));
  }, [content]);

  const results = useMemo(() => {
    if (!content) {
      return [];
    }

    const terms = splitTerms(query);

    return content.items
      .filter((item) => activeBook === 'all' || item.bookSlug === activeBook)
      .filter((item) => terms.every((term) => item.searchableText.includes(term)))
      .map((item) => ({ item, score: scoreResult(item, terms) }))
      .sort((a, b) => b.score - a.score || a.item.order - b.item.order)
      .map(({ item }) => item);
  }, [activeBook, content, query]);

  const totalArticles = content?.items.filter((item) => item.type === 'article').length ?? 0;
  const totalCollections = content?.items.filter((item) => item.type === 'collection').length ?? 0;

  if (error) {
    return <ErrorState message={error} />;
  }

  if (!content) {
    return <LoadingState />;
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="container mx-auto px-6 py-10 md:py-14">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900">
            <ArrowLeft className="h-4 w-4" /> 回首頁
          </Link>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_280px] lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Search GoodStuff</p>
              <h1 className="mt-3 font-serif text-4xl font-bold leading-tight text-slate-900 md:text-6xl">
                搜尋商品比較、店鋪與單品指南
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
                輸入品牌、品類、用途或使用情境，快速找到 GoodStuff 已整理的比較文、店鋪文與單品推薦。
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm">
              <div>
                <p className="text-3xl font-bold text-slate-900">{totalArticles}</p>
                <p className="mt-1 text-slate-500">文章</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-900">{totalCollections}</p>
                <p className="mt-1 text-slate-500">分類入口</p>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
            <label className="flex items-center gap-3">
              <Search className="h-5 w-5 shrink-0 text-slate-400" />
              <input
                value={query}
                onChange={(event) => setParam('q', event.target.value)}
                placeholder="搜尋 Dyson、除濕機、空氣清淨機、電煮鍋..."
                className="min-h-12 w-full bg-transparent text-base text-slate-900 outline-none placeholder:text-slate-400"
              />
            </label>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {quickKeywords.map((keyword) => (
              <button
                key={keyword}
                type="button"
                onClick={() => setParam('q', keyword)}
                className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-600 hover:border-slate-400 hover:text-slate-900"
              >
                {keyword}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto grid gap-8 px-6 py-10 lg:grid-cols-[240px_1fr]">
        <aside>
          <div className="sticky top-6 rounded-lg border border-slate-200 bg-white p-4">
            <p className="text-sm font-semibold text-slate-900">篩選分類</p>
            <div className="mt-4 space-y-2">
              <button
                type="button"
                onClick={() => setParam('book', 'all')}
                className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm font-semibold ${activeBook === 'all' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                全部內容
                <span>{content.items.length}</span>
              </button>
              {bookOptions.map((book) => (
                <button
                  key={book.slug}
                  type="button"
                  onClick={() => setParam('book', book.slug)}
                  className={`flex w-full items-center justify-between gap-3 rounded-md px-3 py-2 text-left text-sm font-semibold ${activeBook === book.slug ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
                >
                  <span>{book.title}</span>
                  <span>{book.count}</span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        <div>
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500">
                {query ? `搜尋「${query}」` : '顯示全部可搜尋內容'}
              </p>
              <h2 className="mt-1 font-serif text-3xl font-bold text-slate-900">{results.length} 個結果</h2>
            </div>
            {(query || activeBook !== 'all') && (
              <button
                type="button"
                onClick={() => setSearchParams({}, { replace: true })}
                className="inline-flex items-center justify-center rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-slate-400"
              >
                清除搜尋
              </button>
            )}
          </div>

          {results.length > 0 ? (
            <div className="grid gap-4">
              {results.map((item) => (
                <ResultCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center">
              <PackageSearch className="mx-auto h-10 w-10 text-slate-400" />
              <h2 className="mt-4 font-serif text-2xl font-bold text-slate-900">沒有找到符合內容</h2>
              <p className="mt-3 text-slate-500">換成品牌、品類或使用情境搜尋，例如「除濕」、「小房間」、「Dyson」。</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default SearchPage;
