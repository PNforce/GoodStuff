import React from 'react';
import { Link } from 'react-router-dom';
import { versionedAssetPath } from '../src/lib/contentApi.ts';
import type { CatalogBook } from '../src/types/index.ts';

const fallbackCoverClass =
  'flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-300 px-4 text-center font-serif text-xl font-bold text-slate-700';

const BookCard: React.FC<{ book: CatalogBook; version?: string }> = ({ book, version }) => {
  const [imageFailed, setImageFailed] = React.useState(false);
  const cover = versionedAssetPath(book.cover, book.updatedAt || version);

  return (
    <Link to={`/articles/${book.slug}`} className="group block">
      <div className="aspect-[2/3] w-full overflow-hidden rounded-lg bg-gray-200">
        {cover && !imageFailed ? (
          <img
            src={cover}
            alt={book.title}
            onError={() => setImageFailed(true)}
            className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className={fallbackCoverClass}>{book.title}</div>
        )}
      </div>
      <h3 className="mt-4 text-base font-semibold text-gray-900">{book.title}</h3>
      {book.summary && (
        <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500">{book.summary}</p>
      )}
    </Link>
  );
};

export default BookCard;
