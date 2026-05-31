import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// TheWellnessGPT — AI-native, evidence-led, GLOBAL wellness answers.
// Static output = fast, clean HTML that AI answer engines (GPTBot, PerplexityBot,
// ClaudeBot, Google) can read + cite. English is the default at the root domain;
// language editions (/zh/, /ms/) added later as separate collections.
export default defineConfig({
  site: 'https://thewellnessgpt.com',
  integrations: [sitemap()],
  build: { format: 'directory' },
});
