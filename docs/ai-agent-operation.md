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

## Production Rules

### Product Comparisons

The public route is `/articles/product-comparisons/{chapterSlug}`. Do not reintroduce the old `affiliate-product-comparisons` slug.

- Keep the book slug as `product-comparisons`.
- Keep all 20 product comparison chapters in `public/content/books/product-comparisons/chapters/`.
- Each chapter must include an upper `## 購買參考` section before `## 適合誰看這篇`.
- Product headings under `## 產品重點` must link to their matching purchase URL, for example `### [Product Name](https://...) 重點`.
- `## 兩款商品快速比較` must remain a GitHub Flavored Markdown table.
- Keep `remark-gfm` in `components/ArticlePage.tsx` and `package.json` so tables render as styled HTML tables.
- Keep two self-made SVGs per product comparison article under `/images/product-comparisons/`.
- Current product comparison SVGs use a widened `1400` canvas/viewBox. Preserve the widened left/right plan spacing; do not return to the older 1200-wide layout.

### Shop Introductions

The public route is `/articles/shops-introduce/{chapterSlug}`. Do not reintroduce the old `openclaw-generated-content` slug or `openclaw-001` chapter format.

- Keep the book slug as `shops-introduce`.
- Chapter slugs use `shops-001` through `shops-018`; filenames use `001-shops-001.md` style.
- Under `## 商品介紹`, link product headings when the source article provides a reliable purchase URL.
- Do not invent purchase URLs when the source article has no reliable link.
- Public content, metadata, and route data must not contain `OpenClaw` or `openclaw`.

### Covers

The two category thumbnails are required:

- `public/images/books/product-comparisons.svg`
- `public/images/books/shops-introduce.svg`

## Deployment

Build with:

```powershell
$env:VITE_BASE_PATH='/GoodStuff/'
$env:VITE_SITE_URL='https://PNforce.github.io/GoodStuff/'
npm.cmd run build
```

The `postbuild` script copies `dist/index.html` to `dist/404.html` so direct article URLs work on GitHub Pages.
