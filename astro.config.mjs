import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// TheWellnessGPT — AI-native, evidence-led wellness answers for life in Malaysia.
// Static output = fast, clean HTML that AI answer engines (GPTBot, PerplexityBot,
// ClaudeBot, Google) can read + cite. This is the whole point: be the source.
export default defineConfig({
  site: 'https://thewellnessgpt.com',
  integrations: [sitemap()],
  build: { format: 'directory' },
  // Locale routing: all content lives under /my/ so adding /sg/, /us/, /uk/ later is a clean copy.
  // Root (/) -> /my/ is handled by a SERVER-SIDE redirect in vercel.json (instant 307, no
  // visible "Redirecting..." flash page that Astro's static meta-refresh redirect produced).
});
