# AI Agent Operation Guide

GoodStuff is a data-driven static site. Public content is loaded from JSON and Markdown under `public/content`.

## Content Contract

Primary files:

- `public/content/site.json`: homepage copy and global site metadata.
- `public/content/catalog.json`: public book list, categories, ordering, and book manifest paths.
- `public/content/books/{bookSlug}/book.json`: book metadata and chapter list.
- `public/content/books/{bookSlug}/chapters/*.md`: chapter bodies.

Current public books:

- `127-jp-stock`: finance sample content.
- `product-comparisons`: home appliance and lifestyle product comparison guides.
- `shops-introduce`: store and product recommendation articles.

Do not edit `src/data/siteData.ts` for public content. It is legacy fallback/reference data only.

## Safe Workflow

1. Read `public/content/catalog.json`.
2. Read the target book manifest from `catalog.books[].bookJson`.
3. Edit Markdown files under the target book's `chapters/` folder.
4. Update `book.json` when adding, hiding, renaming, or reordering chapters.
5. Update `catalog.json` only when adding, hiding, renaming, reordering, or recategorizing books.
6. Update `site.json` only when changing homepage/global copy.
7. Keep all `slug` values lowercase and hyphenated.

## Validation Checklist

- Every `catalog.books[].slug` is unique.
- Every `catalog.books[].bookJson` exists.
- Every `book.chapters[].slug` is unique within the book.
- Every `book.chapters[].md` exists.
- JSON has no comments and no trailing commas.
- Markdown images use public paths such as `/images/product-comparisons/example.svg`.

## Deployment

Build with:

```powershell
$env:VITE_BASE_PATH='/GoodStuff/'
$env:VITE_SITE_URL='https://PNforce.github.io/GoodStuff/'
npm.cmd run build
```

The `postbuild` script copies `dist/index.html` to `dist/404.html` so direct article URLs work on GitHub Pages.
