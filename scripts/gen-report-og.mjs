#!/usr/bin/env node
// gen-report-og.mjs — one-off generator for the report's static Open Graph image.
//
// The site has a per-page OG mechanism (BaseLayout's `image` prop → og:image/twitter:image)
// but no dynamic OG route. This script renders a branded 1200×630 social card for the
// State of Supplements 2026 report as a committed static PNG under public/reports/, using
// the site's own palette + serif (matching favicon.svg and global.css). Run on demand, not
// at build:
//
//   node scripts/gen-report-og.mjs
//
// Rasterized with `sharp` (already in the dependency tree). The PNG is the committed artifact;
// this script just makes it reproducible. Numbers/wording mirror the report verbatim
// (57.6% prevalence and 54,221 CAERS suspect reports are both stated in the report body).

import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));
const OUT = resolve(ROOT, 'public/reports/state-of-supplements-2026-og.png');

// Brand tokens, kept in sync with src/styles/global.css + public/favicon.svg.
const PAPER = '#fbf9f6';
const INK = '#181818';
const INK_SOFT = '#4a4a4a';
const ACCENT = '#2f7d5a'; // sage green — wellness-coded accent
const LINE = '#e6e0d8';
const SERIF = "Georgia, 'Times New Roman', serif"; // system-safe serif for headless raster
const SANS = '-apple-system, Helvetica, Arial, sans-serif';

const W = 1200;
const H = 630;

// 1200×630 social card. Layout: brand lockup, kicker, headline, subline, the two headline
// stats as a numeric callout, source line. SVG text only (sharp rasterizes with its bundled
// fonts). No em-dashes anywhere (periods / colons / "·" per house style).
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="${PAPER}"/>
  <rect x="0" y="0" width="${W}" height="12" fill="${ACCENT}"/>

  <!-- brand lockup: monogram + wordmark (mirrors favicon.svg + .logo in global.css) -->
  <g>
    <rect x="72" y="68" width="48" height="48" rx="11" fill="${ACCENT}"/>
    <text x="96" y="102" text-anchor="middle" font-family="${SERIF}" font-weight="700" font-size="28" fill="#ffffff">W</text>
    <text x="136" y="101" font-family="${SERIF}" font-weight="700" font-size="28" fill="${INK}">The<tspan fill="${ACCENT}">Wellness</tspan>GPT</text>
  </g>

  <text x="72" y="178" font-family="${SANS}" font-weight="700" font-size="22" letter-spacing="3" fill="${ACCENT}">ORIGINAL DATA STUDY</text>

  <!-- headline + subline (verbatim-safe paraphrase of the report's lede) -->
  <text x="72" y="244" font-family="${SERIF}" font-weight="700" font-size="56" fill="${INK}">57.6% of US adults take</text>
  <text x="72" y="312" font-family="${SERIF}" font-weight="700" font-size="56" fill="${INK}">a dietary supplement</text>
  <text x="72" y="362" font-family="${SANS}" font-size="26" fill="${INK_SOFT}">And the #1 category in the FDA's adverse-event file.</text>

  <!-- headline stats: prevalence + the federal adverse-event count -->
  <g font-family="${SERIF}">
    <text x="72" y="500" font-weight="700" font-size="104" fill="${ACCENT}">57.6<tspan font-size="36" fill="${INK_SOFT}" font-family="${SANS}" font-weight="600">%</tspan></text>
    <text x="72" y="540" font-family="${SANS}" font-size="24" fill="${INK}">of US adults take a supplement</text>
  </g>

  <line x1="560" y1="400" x2="560" y2="556" stroke="${LINE}" stroke-width="2"/>

  <g font-family="${SERIF}">
    <text x="608" y="500" font-weight="700" font-size="104" fill="${INK}">54,221</text>
    <text x="608" y="540" font-family="${SANS}" font-size="24" fill="${INK}">FDA adverse-event reports naming supplements</text>
  </g>

  <text x="72" y="596" font-family="${SANS}" font-size="22" fill="${INK_SOFT}">The State of Supplements 2026</text>
  <text x="${W - 72}" y="596" text-anchor="end" font-family="${SANS}" font-size="22" fill="${INK_SOFT}">thewellnessgpt.com</text>
</svg>`;

mkdirSync(dirname(OUT), { recursive: true });
// Opaque card: drop the alpha channel and palette-quantize so the committed PNG stays small
// (a flat-color social card compresses well as an indexed PNG; ~no visible quality loss).
const png = await sharp(Buffer.from(svg))
  .flatten({ background: PAPER })
  .png({ palette: true, quality: 90, effort: 9 })
  .toBuffer();
writeFileSync(OUT, png);
console.log(`[gen-report-og] wrote ${OUT} (${png.length} bytes, ${W}x${H})`);
