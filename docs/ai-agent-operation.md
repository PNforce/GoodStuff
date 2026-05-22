# AI Agent Operation Guide

GoodStuff is a data-driven static site. Public content is loaded from JSON and Markdown under `public/content`.

Primary AI-agent prompt:

- `claude_code_prompt_0517.txt`

Use that file as the canonical operating prompt for future Claude Code / Codex maintenance tasks. This document is a shorter reference.

## Content Contract

Primary files:

- `public/content/site.json`: homepage copy and global site metadata.
- `public/content/catalog.json`: public book list, categories, ordering, and book manifest paths.
- `public/content/books/{bookSlug}/book.json`: book metadata and chapter list.
- `public/content/books/{bookSlug}/chapters/*.md`: chapter bodies.

Current public books:

- `127-jp-stock`: finance sample content.
- `product-comparisons`: 20 two-product comparison guides.
- `shops-introduce`: 18 store or multi-product introduction articles.
- `profuct-introduce`: 82 single-product introduction articles. Keep this existing slug.

Do not edit `src/data/siteData.ts` for public content. It is legacy fallback/reference data only.

## Safe Workflow

1. Read `public/content/catalog.json`.
2. Read the target book manifest from `catalog.books[].bookJson`.
3. Edit Markdown files under the target book's `chapters/` folder.
4. Update `book.json` when adding, hiding, renaming, or reordering chapters.
5. Update `catalog.json` only when adding, hiding, renaming, reordering, or recategorizing books.
6. Update `site.json` only when changing homepage/global copy.
7. Keep all `slug` values lowercase and hyphenated.

## Writing Rules

### Product Comparisons

- Route: `/articles/product-comparisons/{chapterSlug}`.
- Do not reintroduce the old `affiliate-product-comparisons` slug.
- Each article compares two products.
- Required sections include `## 插圖圖片`, upper `## 購買參考`, `## 適合誰看這篇`, `## 兩款商品快速比較`, `## 產品重點`, `## 真實評測與網友意見整理`, `## 怎麼選`, bottom `## 購買參考`, and `## 資料來源與查核`.
- `## 兩款商品快速比較` must remain a GitHub Flavored Markdown table.
- Product headings under `## 產品重點` must link to matching purchase URLs.
- Keep two self-made SVGs per article under `/images/product-comparisons/`.
- Current SVGs use a widened `1400` canvas/viewBox; preserve left/right spacing.

### Shop Introductions

- Route: `/articles/shops-introduce/{chapterSlug}`.
- Do not reintroduce `openclaw-generated-content` or `openclaw-001`.
- Chapter slugs use `shops-001` through `shops-018`.
- Articles introduce a store, theme, or product group rather than a single product.
- Link product headings only when a reliable purchase URL exists.
- Do not invent purchase URLs.
- Public content must not contain `OpenClaw` or `openclaw`.

### Single Product Introductions

- Route: `/articles/profuct-introduce/{chapterSlug}`.
- Keep the existing `profuct-introduce` slug.
- Articles introduce one product and recommend suitable target customers.
- Required sections include `## 適合誰看這篇`, `## 商品圖片`, `## 商品介紹`, target customer/recommendation section, unsuitable-user section, review-observation section, `## 產品定位摘要`, `## 相關連結`, and `## 查核筆記`.
- `## 商品介紹` must be at least 400 Chinese characters; 500 to 700 is preferred.
- Do not use the same text template for every page.
- Do not write procurement instructions as the main content.
- Use public product title, shop, price, sales, image, and category information.
- Do not fabricate review comments.

## GA4

GA4 Measurement ID: `G-49G5GBLQRP`.

- Google tag lives in `index.html`.
- `page_view` is sent manually from `src/lib/seo.ts` through `src/lib/analytics.ts`.
- `affiliate_click` is sent from rendered article links when URLs match `s.shopee.*`.
- See `docs/analytics.md` for GA4 setup and report guidance.

## Validation Checklist

- Every `catalog.books[].slug` is unique.
- Every `catalog.books[].bookJson` exists.
- Every `book.chapters[].slug` is unique within the book.
- Every `book.chapters[].md` exists.
- JSON has no comments and no trailing commas.
- Markdown images use public URLs or public site paths.
- Shopee affiliate links use normal Markdown links.
- No secrets, private keys, passwords, tokens, or internal-only files are committed.

## Deployment

Build with:

```powershell
$env:VITE_BASE_PATH='/GoodStuff/'
$env:VITE_SITE_URL='https://PNforce.github.io/GoodStuff/'
npm.cmd run build
```

The `postbuild` script copies `dist/index.html` to `dist/404.html` and route folders so direct article URLs work on GitHub Pages.
