#!/usr/bin/env node
// check-links.mjs — build-time internal-link-integrity check.
//
// Scans built dist/**/*.html for internal links (href="/...") and asserts each one
// resolves to a real path in dist (a file, or a directory with an index.html).
// Exits non-zero and lists offenders if any internal link is broken.
//
// This is the structural guard behind the component-rendered Related blocks: links the
// engine derives from the collection can never 404, and this check proves it on every build
// (and also catches any hand-typed links in markdown bodies that have rotted).
//
// Usage: node scripts/check-links.mjs  (run after `astro build`)

import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, resolve, posix } from 'node:path';
import { fileURLToPath } from 'node:url';

const DIST = resolve(fileURLToPath(new URL('../dist', import.meta.url)));

if (!existsSync(DIST)) {
  console.error(`[check:links] dist/ not found at ${DIST} — run \`npm run build\` first.`);
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

/**
 * Resolve a root-relative URL path to a dist filesystem path that must exist.
 * "/foo/"     -> dist/foo/index.html
 * "/foo"      -> dist/foo/index.html  OR  dist/foo  (file, e.g. /sitemap.xml without ext is rare)
 * "/a/b.png"  -> dist/a/b.png
 * Returns true if the target exists on disk.
 */
function resolves(urlPath) {
  // strip query/hash
  let p = urlPath.split('#')[0].split('?')[0];
  if (!p.startsWith('/')) return true; // not root-relative; out of scope here
  // decode %20 etc. so paths with encoded chars are checked against the real file
  try { p = decodeURIComponent(p); } catch { /* leave as-is on malformed encoding */ }

  const rel = p.replace(/^\/+/, '');           // drop leading slash(es)
  const base = rel ? join(DIST, rel) : DIST;   // "/" -> dist root

  // 1) directory-style URL -> needs an index.html
  if (p.endsWith('/') || rel === '') {
    return existsSync(join(base, 'index.html'));
  }
  // 2) exact file on disk (has an extension, e.g. /og-default.png, /llms.txt)
  if (existsSync(base) && statSync(base).isFile()) return true;
  // 3) extensionless pretty URL -> Astro emits dir/index.html
  if (existsSync(join(base, 'index.html'))) return true;
  // 4) directory that exists but no index.html, or genuinely missing
  return false;
}

const files = htmlFiles(DIST);
const HREF = /href\s*=\s*["']([^"']+)["']/gi;
const broken = []; // { from, href }
let internalChecked = 0;

for (const file of files) {
  const html = readFileSync(file, 'utf8');
  const fromUrl = '/' + posix.relative(DIST.split(/[\\/]/).join(posix.sep), file.split(/[\\/]/).join(posix.sep));
  let m;
  while ((m = HREF.exec(html)) !== null) {
    const href = m[1].trim();
    // only internal, root-relative links — skip external, anchors, mailto, tel, protocol-relative
    if (!href.startsWith('/') || href.startsWith('//')) continue;
    internalChecked++;
    if (!resolves(href)) broken.push({ from: fromUrl, href });
  }
}

console.log(`[check:links] scanned ${files.length} html file(s), checked ${internalChecked} internal link(s).`);

if (broken.length) {
  console.error(`[check:links] ✗ ${broken.length} broken internal link(s):`);
  // de-dupe identical (href) targets for a readable report, but keep an example source
  const byHref = new Map();
  for (const b of broken) {
    if (!byHref.has(b.href)) byHref.set(b.href, b.from);
  }
  for (const [href, from] of byHref) {
    console.error(`   ${href}   (e.g. from ${from})`);
  }
  process.exit(1);
}

console.log('[check:links] ✓ all internal links resolve.');
