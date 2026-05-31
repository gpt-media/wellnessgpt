// site.ts — brand identity + multilingual UI chrome for this site.
//
// To stand up a sibling GPT site (e.g. TheLongevityGPT) you edit THIS file
// (name, domain, logo, hero copy, org description) plus the CSS accent token.
// editions.ts (the i18n structure) stays identical across sites.

import type { UiKey } from './editions';

export const SITE = {
  name: 'TheWellnessGPT',
  domain: 'https://www.thewellnessgpt.com',
  /** logo renders as: The<span class=accent>Wellness</span>GPT */
  logo: { pre: 'The', accent: 'Wellness', post: 'GPT' },
  defaultAuthor: 'TheWellnessGPT Editors',
  /** Organization JSON-LD description (publisher entity for AI engines). */
  orgDescription: 'Evidence-led wellness answers for a global audience.',
  /** appended to the homepage <title>. */
  titleTagline: 'Smarter answers for how you feel',
};

/** Per-language homepage hero copy (the brand's editorial voice). */
export const HERO: Record<UiKey, { kicker: string; tagline: string; intro: string }> = {
  en: {
    kicker: 'Wellness, decoded',
    tagline: 'Smarter answers for how you feel.',
    intro:
      'Evidence-led wellness guidance: supplements, gut health, sleep, energy, and what actually works. Clear comparisons, real mechanisms, no hype.',
  },
  ms: {
    kicker: 'Kesihatan, dirungkai',
    tagline: 'Jawapan lebih bijak untuk kesihatan anda.',
    intro:
      'Panduan kesihatan berasaskan bukti: suplemen, kesihatan usus, tidur, tenaga, dan apa yang benar-benar berkesan. Perbandingan jelas, mekanisme sebenar, tanpa hype.',
  },
  'zh-Hans': {
    kicker: '健康，讲明白',
    tagline: '更聪明的健康解答。',
    intro:
      '以证据为本的健康指南：补充剂、肠道健康、睡眠、精力，以及真正有效的方法。清晰对比，真实机制，不夸大。',
  },
  'zh-Hant': {
    kicker: '健康，講明白',
    tagline: '更聰明的健康解答。',
    intro:
      '以證據為本的健康指南：補充劑、腸道健康、睡眠、精力，以及真正有效的方法。清晰對比，真實機制，不誇大。',
  },
};

/** Mechanical UI chrome (nav, footer, labels). Standard terms, in-language per "one language per page". */
export const UI: Record<UiKey, Record<string, string>> = {
  en: {
    navHome: 'Home', navAbout: 'About', featured: 'Featured',
    faqHeading: 'Frequently asked questions', metaBy: 'By', metaPublished: 'Published', metaUpdated: 'Updated',
    pickerLabel: 'Region & language', footerEditorial: 'Editorial Standards', footerDisclaimer: 'Medical Disclaimer',
    rights: 'All rights reserved.', disclaimerLine: 'Educational content, not medical advice.',
    emptySoon: 'First answers publishing soon.', dateLocale: 'en-GB',
  },
  ms: {
    navHome: 'Laman Utama', navAbout: 'Tentang', featured: 'Pilihan',
    faqHeading: 'Soalan lazim', metaBy: 'Oleh', metaPublished: 'Diterbitkan', metaUpdated: 'Dikemas kini',
    pickerLabel: 'Wilayah & bahasa', footerEditorial: 'Piawaian Editorial', footerDisclaimer: 'Penafian Perubatan',
    rights: 'Hak cipta terpelihara.', disclaimerLine: 'Kandungan pendidikan, bukan nasihat perubatan.',
    emptySoon: 'Jawapan pertama akan diterbitkan tidak lama lagi.', dateLocale: 'ms-MY',
  },
  'zh-Hans': {
    navHome: '首页', navAbout: '关于', featured: '精选',
    faqHeading: '常见问题', metaBy: '作者', metaPublished: '发布于', metaUpdated: '更新于',
    pickerLabel: '地区与语言', footerEditorial: '编辑标准', footerDisclaimer: '医疗免责声明',
    rights: '保留所有权利。', disclaimerLine: '教育内容，并非医疗建议。',
    emptySoon: '首批解答即将发布。', dateLocale: 'zh-Hans',
  },
  'zh-Hant': {
    navHome: '首頁', navAbout: '關於', featured: '精選',
    faqHeading: '常見問題', metaBy: '作者', metaPublished: '發佈於', metaUpdated: '更新於',
    pickerLabel: '地區與語言', footerEditorial: '編輯標準', footerDisclaimer: '醫療免責聲明',
    rights: '保留所有權利。', disclaimerLine: '教育內容，並非醫療建議。',
    emptySoon: '首批解答即將發佈。', dateLocale: 'zh-Hant',
  },
};

/** "Prices in RM" style note per language. */
export function pricesNote(ui: UiKey, currency: string): string {
  switch (ui) {
    case 'ms': return `Harga dalam ${currency}`;
    case 'zh-Hans': return `价格以 ${currency} 计`;
    case 'zh-Hant': return `價格以 ${currency} 計`;
    default: return `Prices in ${currency}`;
  }
}
