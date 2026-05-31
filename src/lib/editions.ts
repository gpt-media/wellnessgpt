// editions.ts — the single source of truth for the global edition model.
//
// Model (ratified GPT-sites architecture standard, §1–§4):
//   root domain  = the DEFAULT English edition (hreflang x-default), real content, USD shown.
//   country editions live in subfolders (/my/ /sg/ /tw/) with local currency + brands.
//   languages live in nested subfolders (/my/ms/ /my/zh/ ...).
// 8 editions per article. NO auto IP/geo redirects — the reader chooses via the header selector.
//
// Everything the engine needs for routing, hreflang, canonical, the language selector,
// and the sitemap derives from EDITIONS. Add a country by adding rows here.

export type UiKey = 'en' | 'ms' | 'zh-Hans' | 'zh-Hant';

export interface Edition {
  /** stable internal key AND the content sub-folder name: src/content/articles/<key>/<slug>.md */
  key: string;
  /** URL base segment(s). '' = root. e.g. 'my', 'my/ms', 'tw'. */
  base: string;
  /** ISO country, or null for the global/default edition. */
  country: 'MY' | 'SG' | 'TW' | null;
  countryName: string;
  flag: string;
  /** hreflang value, also used verbatim as <html lang>. */
  hreflang: string;
  /** which UI-string + script bundle this edition renders in. */
  ui: UiKey;
  /** label shown in the language selector. */
  langLabel: string;
  /** display currency for this edition (content carries the actual localized prices). */
  currency: 'USD' | 'RM' | 'SGD' | 'TWD';
  /** the x-default / root English edition. Exactly one. */
  isDefault: boolean;
}

export const EDITIONS: Edition[] = [
  { key: 'en',    base: '',      country: null, countryName: 'Global',    flag: '🌐', hreflang: 'en',         ui: 'en',      langLabel: 'English',          currency: 'USD', isDefault: true  },
  { key: 'my-en', base: 'my',    country: 'MY', countryName: 'Malaysia',  flag: '🇲🇾', hreflang: 'en-MY',      ui: 'en',      langLabel: 'English',          currency: 'RM',  isDefault: false },
  { key: 'my-ms', base: 'my/ms', country: 'MY', countryName: 'Malaysia',  flag: '🇲🇾', hreflang: 'ms-MY',      ui: 'ms',      langLabel: 'Bahasa Malaysia',  currency: 'RM',  isDefault: false },
  { key: 'my-zh', base: 'my/zh', country: 'MY', countryName: 'Malaysia',  flag: '🇲🇾', hreflang: 'zh-Hans-MY', ui: 'zh-Hans', langLabel: '中文',              currency: 'RM',  isDefault: false },
  { key: 'sg-en', base: 'sg',    country: 'SG', countryName: 'Singapore', flag: '🇸🇬', hreflang: 'en-SG',      ui: 'en',      langLabel: 'English',          currency: 'SGD', isDefault: false },
  { key: 'sg-ms', base: 'sg/ms', country: 'SG', countryName: 'Singapore', flag: '🇸🇬', hreflang: 'ms-SG',      ui: 'ms',      langLabel: 'Bahasa Malaysia',  currency: 'SGD', isDefault: false },
  { key: 'sg-zh', base: 'sg/zh', country: 'SG', countryName: 'Singapore', flag: '🇸🇬', hreflang: 'zh-Hans-SG', ui: 'zh-Hans', langLabel: '中文',              currency: 'SGD', isDefault: false },
  { key: 'tw-zh', base: 'tw',    country: 'TW', countryName: 'Taiwan',    flag: '🇹🇼', hreflang: 'zh-Hant-TW', ui: 'zh-Hant', langLabel: '中文 (繁體)',        currency: 'TWD', isDefault: false },
];

export const DEFAULT_EDITION: Edition = EDITIONS.find((e) => e.isDefault)!;

export function editionByKey(key: string): Edition | undefined {
  return EDITIONS.find((e) => e.key === key);
}

/** Group editions by country, default first — used by the header selector. */
export function editionsByCountry(): { country: string; flag: string; editions: Edition[] }[] {
  const order = [null, 'MY', 'SG', 'TW'];
  return order.map((c) => {
    const editions = EDITIONS.filter((e) => e.country === c);
    return { country: editions[0].countryName, flag: editions[0].flag, editions };
  });
}

/**
 * Astro rest-param value for a page. Root homepage => undefined (maps to '/').
 *   homepage(my)         => 'my'
 *   homepage(my/ms)      => 'my/ms'
 *   article(en,  slug)   => 'articles/<slug>'
 *   article(my/ms, slug) => 'my/ms/articles/<slug>'
 */
export function routeParam(edition: Edition, slug?: string | null): string | undefined {
  const parts: string[] = [];
  if (edition.base) parts.push(edition.base);
  if (slug) parts.push('articles', slug);
  return parts.length ? parts.join('/') : undefined;
}

/** Absolute path (leading + trailing slash) for a page. Root homepage => '/'. */
export function pagePath(edition: Edition, slug?: string | null): string {
  const param = routeParam(edition, slug);
  return param ? `/${param}/` : '/';
}

/** Split a collection entry id ('my-en/best-probiotics') into edition key + slug. */
export function parseEntryId(id: string): { editionKey: string; slug: string } {
  const i = id.indexOf('/');
  return i === -1
    ? { editionKey: id, slug: '' }
    : { editionKey: id.slice(0, i), slug: id.slice(i + 1) };
}
