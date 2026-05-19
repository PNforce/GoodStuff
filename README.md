# GoodStuff Data-Driven Static Site

This site loads public content from JSON and Markdown under `public/content`.

Final publish repo:

```text
M:\#github_others\GoodStuff
```

Canonical content files:

- `public/content/site.json`
- `public/content/catalog.json`
- `public/content/books/{bookSlug}/book.json`
- `public/content/books/{bookSlug}/chapters/*.md`

Changing those files updates the site after browser refresh. Editing `src/data/siteData.ts` or `deploy_books.py` is no longer required for normal content updates.

Old generated article HTML has been moved to `legacy_public_articles/` so it does not shadow the new React routes.

OpenClaw source Markdown from `projects/CRM/generated_content` is published as a separate `OpenClaw 選品內容` category through `public/content/books/openclaw-generated-content/`.

## Run Locally

```powershell
npm install
npm run dev
```

Open the Vite URL, usually `http://localhost:3000`.

Because this workspace path contains `#`, Vite may warn about the project root. If dev mode serves a blank page, use the static verification path:

```powershell
npm run build
npm run preview
```

For GitHub Pages project pages, build with:

```powershell
$env:VITE_BASE_PATH='/GoodStuff/'
npm run build
```

`npm run build` also creates `dist/404.html` so direct React article URLs work on GitHub Pages.

## Operation Docs

- Human user guide: `docs/human-user-operation.md`
- AI agent guide: `docs/ai-agent-operation.md`
- GitHub Pages deploy guide: `docs/github-pages-deploy.md`
