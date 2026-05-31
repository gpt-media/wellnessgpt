# TheWellnessGPT

Evidence-led, global wellness answers, built to be fast, clean, and easily read and cited by search and AI answer engines.

## Architecture — global root + country editions

- The root domain is the default English edition (`hreflang="x-default"`), USD shown.
- Country editions in subfolders: `/my/` `/sg/` `/tw/`, with local currency + brands.
- Languages in nested subfolders: `/my/ms/` `/my/zh/` `/sg/ms/` `/sg/zh/`; Taiwan `/tw/` is Traditional Chinese.
- 8 editions per article. Bidirectional `hreflang` (+ x-default) and a self-referencing canonical on every page; a footer region/language selector; no automatic IP/geo redirects.

The edition model lives in `src/lib/editions.ts`; brand identity + multilingual UI chrome in `src/lib/site.ts`. Add a country by adding a row to `EDITIONS`.

Stack: Astro static site (near-zero JavaScript = fast, clean, citeable HTML).

## Content layout

One `articles` collection, one sub-folder per edition:

    src/content/articles/<editionKey>/<slug>.md
    keys: en  my-en  my-ms  my-zh  sg-en  sg-ms  sg-zh  tw-zh

The slug is stable across editions (the hreflang key); each file holds the localized/translated copy. Frontmatter: `title, description, publishDate, [updatedDate], [author], category, [featured], faqs[]`. The `faqs` array auto-emits FAQPage structured data.

## Local development

    npm install
    npm run dev      # http://localhost:4321
    npm run build    # static site -> dist/

Note: Astro 5 caches the content collection in `node_modules/.astro/`. After adding or removing article files, clear caches before a verification build:

    rm -rf .astro dist node_modules/.astro && npm run build

## Editorial voice

Evidence-led, mechanism-first, honest, no hype. Names real brands fairly. No em-dashes in prose. Educational content, not medical advice.
