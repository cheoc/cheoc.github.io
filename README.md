# Lab notes

Static blog built with Astro and served from GitHub Pages at
https://cheoc.github.io/. The index lists one row per project post (preview
image, date, reading time, title, summary, tags); each post has its own page.

```
src/content/posts/*.mdx ──> getPosts() ──> index: one row per post, newest first
                                       ├─> /posts/<file-name>/: the full post
                                       └─> /rss.xml
```

## Add a post

1. Create `src/content/posts/<slug>.mdx`. The file name becomes the URL.
2. Put the preview image in `src/assets/posts/<slug>/`.
3. Fill the frontmatter:
   - `title`, `date`, `tags` (list), `summary` (one line on the index),
     `lede` (paragraph under the title)
   - `cover` (preview image path, relative to the MDX file) and `coverAlt`
   - optional `cta: { text, label, href }`: the box at the end of the post
   - optional `minutes`: reading time, when most text sits in components
   - `order` (number): ranks posts that share a date, higher first
   - `datePending: true` hides the date until you confirm it
   - `draft: true` keeps the post out of the build (it still shows in `npm run dev`)
4. Write the body in Markdown. `##` headings feed the contents box, which
   appears once a post has four or more of them.

Site title, subtitle, email and the LinkedIn/GitHub links are in
`src/data/site.ts`; the contact links show on the Get in touch page.

## Run

```sh
npm install
npm run dev            # http://localhost:4321
npm run build          # writes dist/
npm run check:numbers  # NIR post tables match reference/nir-showcase.dc.html
```

## Deploy

Push to `main`. `.github/workflows/deploy.yml` builds the site, runs
`check:numbers` and publishes `dist/` to GitHub Pages.
