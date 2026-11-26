# Tejas Mahajan — Blog

Personal technical writing on biology, chemistry, industry biochem, computer architecture, quant trading, and machine learning.

**Live site:** [https://tejas-ml.github.io/blog/](https://tejas-ml.github.io/blog/)

This is a project site under the existing portfolio at [tejas-ml.github.io](https://tejas-ml.github.io). Built with [Astro](https://astro.build) and deployed to GitHub Pages.

## Sections

Each section has its own page and RSS feed:

- [Biology](https://tejas-ml.github.io/blog/biology/) · [feed](https://tejas-ml.github.io/blog/biology/rss.xml)
- [Chemistry](https://tejas-ml.github.io/blog/chemistry/) · [feed](https://tejas-ml.github.io/blog/chemistry/rss.xml)
- [Industry biochem](https://tejas-ml.github.io/blog/industry-biochem/) · [feed](https://tejas-ml.github.io/blog/industry-biochem/rss.xml)
- [Computer architecture](https://tejas-ml.github.io/blog/computer-architecture/) · [feed](https://tejas-ml.github.io/blog/computer-architecture/rss.xml)
- [Quant trading](https://tejas-ml.github.io/blog/quant-trading/) · [feed](https://tejas-ml.github.io/blog/quant-trading/rss.xml)
- [AI & ML](https://tejas-ml.github.io/blog/ai-ml/) · [feed](https://tejas-ml.github.io/blog/ai-ml/rss.xml)

The home page lists every post, with a section badge on each entry.

## Add a new post

1. Create a Markdown file in `src/content/posts/`, for example `src/content/posts/2026-12-01-short-slug.md`.
2. Add frontmatter and write the post. The `category` field is required and must be one of the section slugs below:

```markdown
---
title: "Your title"
description: "One-sentence summary for listings, RSS, and search."
pubDate: 2026-12-01
category: biology
tags: ["single-cell", "computational biology"]
---

Your markdown here. Math works with KaTeX: $x^2$ or

$$
e^{i\pi} + 1 = 0
$$
```

Valid `category` values:

- `biology`
- `chemistry`
- `industry-biochem`
- `computer-architecture`
- `quant-trading`
- `ai-ml`

3. Rebuild the GitHub Pages output and commit both the Markdown and `docs/`:

```bash
npm run pages
git add src/content/posts docs
git commit -m "Add post: your title"
git push
```

The post will appear at `https://tejas-ml.github.io/blog/posts/short-slug/` (the filename stem after an optional `YYYY-MM-DD-` prefix) and on its section page.

Set `draft: true` in frontmatter to keep a post out of the public build.

The site is an [Astro](https://astro.build) project. The compiled static files in `docs/` are what GitHub Pages serves. Do not edit `docs/` by hand.

## Local development

```bash
npm install
npm run dev
```

Then open [http://localhost:4321/blog/](http://localhost:4321/blog/).

```bash
npm run build     # production build in dist/
npm run preview   # preview the production build
npm run pages     # rebuild and refresh docs/ for GitHub Pages
```

## Feeds and sitemap

- All posts: [https://tejas-ml.github.io/blog/rss.xml](https://tejas-ml.github.io/blog/rss.xml)
- Sitemap: [https://tejas-ml.github.io/blog/sitemap-index.xml](https://tejas-ml.github.io/blog/sitemap-index.xml)
- Per-section feeds are listed under [Sections](#sections).

## License

MIT. Writing is © Tejas Mahajan.
