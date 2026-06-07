#!/usr/bin/env node
// check-emdash.mjs — build-time em-dash guard for rendered prose.
//
// Scans built dist/**/*.html, extracts VISIBLE rendered text (strips <script>/<style>/
// comments/tags and decodes em-dash HTML entities), and flags the em-dash AI-tell:
//   — U+2014 EM DASH        (incl. entities &mdash; &#8212; &#x2014;)
//   ― U+2015 HORIZONTAL BAR (incl. entities &#8213; &#x2015;)
// in visible text. Exits non-zero and lists offenders if any non-allowlisted em-dash remains.
//
// Deliberately NOT over-strict:
//   • en-dash – (U+2013) and hyphen - are LEGITIMATE (numeric ranges like "RM90–280") — never flagged.
//   • Allowlist escape hatch: scripts/emdash-allow.txt (one substring per line, # = comment).
//     For each flagged hit, a ~60-char context window is taken; if it contains any allowlist
//     substring, the hit is SKIPPED (e.g. a quoted source title that genuinely has an em-dash).
//
// This is a separate gate, NOT wired into `astro build` — keeps the build fast/clean and means
// not every em-dash hard-blocks the build (the allowlist can exempt genuine exceptions).
//
// Usage: node scripts/check-emdash.mjs  (run after `astro build`)

import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, resolve, posix } from 'node:path';
import { fileURLToPath } from 'node:url';

const DIST = resolve(fileURLToPath(new URL('../dist', import.meta.url)));
const ALLOW_FILE = resolve(fileURLToPath(new URL('./emdash-allow.txt', import.meta.url)));

if (!existsSync(DIST)) {
  console.error(`[check:emdash] dist/ not found at ${DIST} — run \`npm run build\` first.`);
  process.exit(1);
}

/** Recursively collect every .html file under a directory. */
function htmlFiles(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const s = statSync(full);
    if (s.isDirectory()) out.push(...htmlFiles(full));
    else if (name.endsWith('.html')) out.push(full);
  }
  return out;
}

/** Load allowlist substrings: one per line, ignore blanks and #-comments. */
function loadAllowlist() {
  if (!existsSync(ALLOW_FILE)) return [];
  return readFileSync(ALLOW_FILE, 'utf8')
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0 && !l.startsWith('#'));
}

/**
 * Reduce HTML to VISIBLE rendered text:
 *   1. drop <script>…</script> and <style>…</style> (content never rendered as prose)
 *   2. drop HTML comments
 *   3. drop all remaining tags
 *   4. decode em-dash entities to the literal char so entity forms are caught too
 * (Other entities are left as-is; we only care about em-dash detection here.)
 */
function visibleText(html) {
  let t = html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ');
  // decode em-dash + horizontal-bar entities to literal chars
  t = t
    .replace(/&mdash;/g, '—')
    .replace(/&#8212;/g, '—')
    .replace(/&#x2014;/gi, '—')
    .replace(/&#8213;/g, '―')
    .replace(/&#x2015;/gi, '―');
  return t;
}

// FLAG these chars in visible text; en-dash (–) and hyphen (-) are intentionally absent.
const EMDASH_RE = /[—―]/g;

const allowlist = loadAllowlist();
const files = htmlFiles(DIST);
const violations = []; // { from, snippet }
let allowed = 0;

for (const file of files) {
  const text = visibleText(readFileSync(file, 'utf8'));
  const fromUrl = '/' + posix.relative(
    DIST.split(/[\\/]/).join(posix.sep),
    file.split(/[\\/]/).join(posix.sep),
  );
  let m;
  while ((m = EMDASH_RE.exec(text)) !== null) {
    const i = m.index;
    const context = text.slice(Math.max(0, i - 30), i + 30).replace(/\s+/g, ' ').trim();
    if (allowlist.some((sub) => context.includes(sub))) {
      allowed++;
      continue;
    }
    violations.push({ from: fromUrl, snippet: context });
  }
}

console.log(
  `[check:emdash] scanned ${files.length} html file(s)` +
    (allowed ? `, ${allowed} allowlisted occurrence(s) skipped` : '') + '.',
);

if (violations.length) {
  console.error(`[check:emdash] ✗ ${violations.length} em-dash(es) in rendered prose:`);
  for (const v of violations) {
    console.error(`   ${v.from}\n      …${v.snippet}…`);
  }
  console.error(
    `\n[check:emdash] Fix by rewording (em-dashes read as an AI-tell). ` +
      `If an em-dash is genuinely legitimate (e.g. a quoted source title), ` +
      `add a substring of its surrounding text to scripts/emdash-allow.txt.`,
  );
  process.exit(1);
}

console.log('[check:emdash] ✓ clean — no em-dashes in rendered prose.');
