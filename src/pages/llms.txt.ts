import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';
import { DEFAULT_EDITION, pagePath, parseEntryId } from '../lib/editions';
import { SITE } from '../lib/site';

// /llms.txt — points AI answer engines at our canonical, high-value content. Generated from
// the default (root English, x-default) edition of the articles collection so it stays in
// sync as articles are added. Plain text, served at the site root.
const clean = (s: string) => (s || '').replace(/\s+/g, ' ').trim();

export const prerender = true;

export const GET: APIRoute = async ({ site }) => {
  const base = (site ? site.origin : SITE.domain).replace(/\/$/, '');
  const articles = (await getCollection('articles'))
    .map((e) => ({ e, ...parseEntryId(e.slug) }))
    .filter((x) => x.editionKey === DEFAULT_EDITION.key && x.slug)
    .sort((a, b) => b.e.data.publishDate.valueOf() - a.e.data.publishDate.valueOf());

  // Reports are single, global, English-only research pages at /reports/<slug>/ (no edition
  // routing), so the path is built directly from the slug rather than via pagePath().
  const reports = (await getCollection('reports'))
    .sort((a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf());

  const lines = [
    `# ${SITE.name}`,
    '',
    `> ${clean(SITE.orgDescription)}`,
    '',
    '## Key pages',
    `- [About](${base}/about/): About ${SITE.name}`,
    `- [Editorial Standards](${base}/editorial-standards/): How articles are researched and reviewed`,
    `- [Medical Disclaimer](${base}/medical-disclaimer/): Guidance only, not a substitute for medical advice`,
    '',
    '## Reports',
    ...reports.map((r) => `- [${clean(r.data.title)}](${base}/reports/${r.slug}/): ${clean(r.data.description)}`),
    '',
    '## Articles',
    ...articles.map((x) => `- [${clean(x.e.data.title)}](${base}${pagePath(DEFAULT_EDITION, x.slug)}): ${clean(x.e.data.description)}`),
    '',
  ];

  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
