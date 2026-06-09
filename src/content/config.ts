import { defineCollection, z } from 'astro:content';
import { SITE } from '../lib/site';

// One `articles` collection. Each article exists once per edition, stored under an
// edition sub-folder: src/content/articles/<editionKey>/<slug>.md
//   en/best-probiotics.md       -> root (x-default, English)
//   my-en/best-probiotics.md    -> /my/articles/best-probiotics/
//   my-zh/best-probiotics.md    -> /my/zh/articles/best-probiotics/  ... (8 editions)
// Slug is stable across editions (the hreflang key); the edition folder carries
// the localized/translated copy. entry.slug => '<editionKey>/<slug>'.
const articleSchema = z.object({
  title: z.string(),
  description: z.string(),
  publishDate: z.coerce.date(),
  updatedDate: z.coerce.date().optional(),
  author: z.string().default(SITE.defaultAuthor),
  category: z.string().default('Wellness'),
  featured: z.boolean().default(false),
  /** optional absolute path to a per-article OG/social image; drives og:image + ImageObject. */
  image: z.string().optional(),
  faqs: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
  /** Optional entity tags (topics, strains, compounds) — substrate for entity-overlap
   *  related-linking + topical-cluster signals. Optional by design: not every article needs
   *  it; the Related block falls back to category + recency when absent. NOT backfilled. */
  entities: z.array(z.string()).optional(),
});

const articles = defineCollection({ type: 'content', schema: articleSchema });

// `reports` collection — original, data-led research reports (e.g. "The State of
// Supplements 2026"). Distinct from `articles`: reports are single, global, English-only
// long-form analyses published at /reports/<slug>/ via a bespoke page, not the 8-edition
// articles routing. Minimal schema; the report's structured data (Dataset + Article
// @graph) lives in its bespoke page, the same way ArticlePage builds its own JSON-LD.
const reportSchema = z.object({
  title: z.string(),
  description: z.string(),
  publishDate: z.coerce.date(),
  updatedDate: z.coerce.date().optional(),
});

const reports = defineCollection({ type: 'content', schema: reportSchema });
export const collections = { articles, reports };
