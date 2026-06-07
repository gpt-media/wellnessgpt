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
});

const articles = defineCollection({ type: 'content', schema: articleSchema });
export const collections = { articles };
