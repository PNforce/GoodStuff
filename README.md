# GoodStuff

GoodStuff is a public, data-driven static website for practical product notes, comparison guides, and curated research collections.

Website:

https://pnforce.github.io/GoodStuff/

## What This Site Contains

- Product comparison articles and buying notes
- Store and product recommendation collections
- Markdown chapters and JSON catalog data that can be updated without rewriting the app
- Static pages published through GitHub Pages

The public content lives under:

```text
public/content
```

When JSON or Markdown content is updated and the site is rebuilt by GitHub Pages, the website content changes accordingly.

## For Readers

Use the website URL above as the entry point. The repository is mainly the public source for the site content and publishing workflow.

## For Maintainers

Operational notes are kept in `docs/`:

- `docs/human-user-operation.md`
- `docs/ai-agent-operation.md`
- `docs/github-pages-deploy.md`
- `docs/analytics.md`

The production site is built by GitHub Actions and published to GitHub Pages.
