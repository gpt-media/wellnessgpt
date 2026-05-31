import { defineCollection, z } from 'astro:content';

// Shared article schema. `faqs` powers FAQPage structured data (high-value for AI citation).
const articleSchema = z.object({
  title: z.string(),
  description: z.string(),               // the direct-answer summary; also the meta description
  publishDate: z.coerce.date(),
  updatedDate: z.coerce.date().optional(),
  author: z.string().default('TheWellnessGPT Editors'),
  category: z.string().default('Wellness'),
  featured: z.boolean().default(false),
  faqs: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
});

// One collection per language. Same schema; slugs match across languages so the
// language versions of an article share a stable URL key (powers hreflang later).
//   articles      -> en-MY  -> /articles/<slug>/
//   articles-ms   -> ms-MY  -> /ms/articles/<slug>/
//   articles-zh   -> zh-MY  -> /zh/articles/<slug>/
const articles = defineCollection({ type: 'content', schema: articleSchema });
const articlesMs = defineCollection({ type: 'content', schema: articleSchema });
const articlesZh = defineCollection({ type: 'content', schema: articleSchema });
// Singapore market (en-SG, ms-SG, zh-SG).
const articlesSg = defineCollection({ type: 'content', schema: articleSchema });
const articlesSgMs = defineCollection({ type: 'content', schema: articleSchema });
const articlesSgZh = defineCollection({ type: 'content', schema: articleSchema });

export const collections = {
  'articles': articles,
  'articles-ms': articlesMs,
  'articles-zh': articlesZh,
  'articles-sg': articlesSg,
  'articles-sg-ms': articlesSgMs,
  'articles-sg-zh': articlesSgZh,
};
