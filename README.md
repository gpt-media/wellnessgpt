# TheWellnessGPT

Evidence-led wellness answers for life in Malaysia and Singapore. Built to be fast, clean, and easily read and cited by search and AI answer engines.

Stack: Astro static site. Near-zero JavaScript means fast pages and clean HTML. Articles are markdown in src/content/articles/ (one collection per locale). Region-prefixed locales: /my/ (en/ms/zh) and /sg/ (en/ms/zh).

## Local development

    npm install
    npm run dev      # http://localhost:4321
    npm run build    # outputs static site to dist/

## Add a new article

Create src/content/articles/your-slug.md with frontmatter (title, description, publishDate, category, optional featured, and a faqs array). The faqs array auto-generates FAQPage structured data. New article URL: /my/articles/your-slug/.

## Status

Local scaffold, not yet deployed. English /my/ pages are done; /sg/ English and all BM and 中文 pages, plus all articles, are pending the content pass. Repository host, Vercel, and DNS are not yet configured.

## Editorial voice

Clear, calm, evidence-led. Explain the mechanism and the strength of the evidence before recommending anything; compare the real options available in Malaysia; flag weak or hyped claims honestly; keep it relevant to local prices, products, and life. Educational content, not medical advice. Independent publication.
