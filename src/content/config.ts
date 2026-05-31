import { defineCollection, z } from 'astro:content';

const articleSchema = z.object({
  title: z.string(),
  description: z.string(),
  publishDate: z.coerce.date(),
  updatedDate: z.coerce.date().optional(),
  author: z.string().default('TheWellnessGPT Editors'),
  category: z.string().default('Wellness'),
  featured: z.boolean().default(false),
  faqs: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
});

// Global, English default at the root. Language editions (zh, ms) added later as
// separate collections (articles-zh, articles-ms) once translated via the skill.
const articles = defineCollection({ type: 'content', schema: articleSchema });
export const collections = { 'articles': articles };
