# AI Agent Operation Guide

This project is now a data-driven static site. The React UI is fixed, and public content is loaded from JSON and Markdown under `public/content`.

Final publish repo:

```text
M:\#github_others\GoodStuff
```

## Content Contract

Primary files:

- `public/content/site.json`: homepage copy and global site metadata.
- `public/content/catalog.json`: public book list, categories, ordering, and book manifest paths.
- `public/content/books/{bookSlug}/book.json`: book metadata, affiliate links, and chapter list.
- `public/content/books/{bookSlug}/chapters/*.md`: chapter bodies.

Do not edit `src/data/siteData.ts` for public content. It is legacy fallback/reference data only.

Current published books:

- `127-jp-stock`: finance sample content.
- `affiliate-product-comparisons`: shopping comparison guides.
- `openclaw-generated-content`: OpenClaw generated content from `projects/CRM/generated_content`, exposed as the `openclaw` category.

When new Markdown appears in `projects/CRM/generated_content`, convert/copy it into `public/content/books/openclaw-generated-content/chapters/` and update `public/content/books/openclaw-generated-content/book.json`. The source folder is retained for traceability, but the public site reads only `public/content`.

## Safe Agent Workflow

1. Read `public/content/catalog.json`.
2. For each target book, read its `bookJson`.
3. Edit or add Markdown files under the book's `chapters/` folder.
4. Update `book.json` when adding, hiding, renaming, or reordering chapters.
5. Update `catalog.json` only when adding, hiding, renaming, reordering, or recategorizing books.
6. Update `site.json` only when changing homepage/global copy.
7. Keep `slug` values lowercase and hyphenated.
8. For OpenClaw additions, keep the public book slug `openclaw-generated-content` unless the user explicitly asks to split it into multiple books.

## Validation Checklist

- Every `catalog.books[].slug` is unique.
- Every `catalog.books[].bookJson` exists.
- Every `book.chapters[].slug` is unique within the book.
- Every `book.chapters[].md` exists.
- `published: false` content should not be expected to show in UI.
- JSON must be valid: no comments, no trailing commas.
- Markdown images should use web paths like `/content/books/book-slug/assets/image.jpg`.

## Runtime Behavior

The app fetches JSON and Markdown with `cache: no-store`, so content-only updates are visible after browser refresh. Image paths receive a version query string from `updatedAt` or `catalog.version`.

Routes:

- `/`: loads `site.json` and `catalog.json`.
- `/articles/:bookSlug`: loads one `book.json` and renders the chapter index.
- `/articles/:bookSlug/:chapterSlug`: loads the chapter md and renders it with `react-markdown`.

In this workspace, the absolute path contains `#`. Vite build works, but dev mode may warn or mis-serve TSX in some Windows shells. For verification in this workspace, prefer `npm run build` followed by `npm run preview`.

For GitHub Pages project-page deployment, build with `VITE_BASE_PATH=/GoodStuff/` so JSON, Markdown, images, router links, and Vite assets resolve under `/GoodStuff/`.

The `postbuild` script creates `dist/404.html` from `dist/index.html`. Keep it: GitHub Pages uses that file as the SPA fallback for direct article URLs.

## Legacy Files

`deploy_books.py` and the copied `legacy_public_articles/**/*.html` are no longer the canonical content path. The old HTML was moved out of `public/` because static servers can otherwise shadow React routes such as `/articles/127-jp-stock/toyota`.

If a converter is needed later, make it emit `public/content/**/*.json` and `public/content/**/*.md`, not standalone article HTML.
