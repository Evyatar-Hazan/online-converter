import { converters } from './converters';
import { categoryLabels, locales, siteUrl } from './site';

const normalizeQuery = (query: string) => query.replace(/\s+/g, ' ').trim();

const getPrimaryQuery = (tool: (typeof converters)[number], locale: 'en' | 'he') => {
  const [firstKeyword] = tool.keywords[locale];

  return normalizeQuery(firstKeyword || tool.shortTitle[locale] || tool.title[locale]);
};

export const analyticsEvents = [
  {
    name: 'view_home',
    purpose: 'Measures bilingual homepage demand and entry traffic.',
    owner: 'SEO',
    priority: 'P1'
  },
  {
    name: 'view_category',
    purpose: 'Measures category landing pages that can become SEO clusters.',
    owner: 'SEO',
    priority: 'P1'
  },
  {
    name: 'view_tool',
    purpose: 'Measures converter page visits by slug, category, converter and locale.',
    owner: 'SEO',
    priority: 'P1'
  },
  {
    name: 'search_tools',
    purpose: 'Measures home search demand without storing raw query text.',
    owner: 'Product',
    priority: 'P1'
  },
  {
    name: 'filter_tools',
    purpose: 'Measures category interest from the tool index.',
    owner: 'Product',
    priority: 'P2'
  },
  {
    name: 'convert_tool',
    purpose: 'Measures manual converter usage and output completion.',
    owner: 'Product',
    priority: 'P1'
  },
  {
    name: 'convert_error',
    purpose: 'Measures failed conversions so weak tools can be improved.',
    owner: 'Quality',
    priority: 'P1'
  },
  {
    name: 'load_sample',
    purpose: 'Measures whether examples help users start faster.',
    owner: 'UX',
    priority: 'P2'
  },
  {
    name: 'copy_output',
    purpose: 'Measures successful output usage.',
    owner: 'Product',
    priority: 'P1'
  },
  {
    name: 'download_output',
    purpose: 'Measures higher-intent converter usage.',
    owner: 'Product',
    priority: 'P1'
  },
  {
    name: 'copy_share_link',
    purpose: 'Measures deep-link sharing and repeatable workflows.',
    owner: 'Growth',
    priority: 'P2'
  },
  {
    name: 'view_ad_slot',
    purpose: 'Measures ad slot visibility by placement without personal data.',
    owner: 'Monetization',
    priority: 'P1'
  },
  {
    name: 'click_outbound_link',
    purpose: 'Measures exits to owned or external domains.',
    owner: 'Growth',
    priority: 'P3'
  }
] as const;

export const analyticsProviders = [
  {
    name: 'Cloudflare Web Analytics',
    env: 'PUBLIC_CLOUDFLARE_WEB_ANALYTICS_TOKEN',
    status: import.meta.env.PUBLIC_CLOUDFLARE_WEB_ANALYTICS_TOKEN ? 'ready' : 'missing env',
    role: 'Privacy-friendly page analytics and Core Web Vitals source.'
  },
  {
    name: 'Plausible',
    env: 'PUBLIC_PLAUSIBLE_DOMAIN',
    status: import.meta.env.PUBLIC_PLAUSIBLE_DOMAIN ? 'ready' : 'optional',
    role: 'Optional event dashboard for custom funnel events.'
  },
  {
    name: 'dataLayer',
    env: 'built-in',
    status: 'ready',
    role: 'Local event queue that can feed GA4/GTM later if needed.'
  }
] as const;

const categoryKeys = Object.keys(categoryLabels) as Array<keyof typeof categoryLabels>;

export const analyticsSummary = {
  totalConverters: converters.length,
  publicSeoPages: locales.length + locales.length * categoryKeys.length + locales.length * converters.length,
  localizedToolPages: locales.length * converters.length,
  categoryPages: locales.length * categoryKeys.length,
  locales: locales.length,
  categories: categoryKeys.length,
  popularTools: converters.filter((tool) => tool.popular).length,
  newTools: converters.filter((tool) => tool.new).length,
  trackedEvents: analyticsEvents.length,
  adPlacements: 4
};

export const searchConsoleBaseline = {
  verifiedAt: '2026-06-26',
  period: 'Last 3 months',
  source: 'Google Search Console performance report',
  clicks: 0,
  impressions: 1,
  ctr: '0%',
  averagePosition: 3,
  onlyVisiblePage: `${siteUrl}/`,
  note: 'Search Console has one homepage impression and no visible converter-page ranking rows yet.'
} as const;

export const rankingWorkflowSteps = [
  {
    step: 'Collect',
    description: 'Export Search Console rows by page and query once meaningful impressions exist.'
  },
  {
    step: 'Map',
    description: 'Match each URL to converter slug, locale, category and target Hebrew/English query.'
  },
  {
    step: 'Prioritize',
    description: 'Improve indexed pages with impressions, low CTR, or average positions 4-20 first.'
  },
  {
    step: 'Repeat',
    description: 'Refresh weekly until rankings stabilize enough for per-converter decisions.'
  }
] as const;

export const rankingMonitorRows = converters.map((tool) => {
  const priority = tool.popular ? 'P1' : tool.new ? 'P2' : 'P3';
  const nextAction =
    priority === 'P1'
      ? 'Inspect indexing and strengthen snippet/content first.'
      : priority === 'P2'
        ? 'Wait for indexing data, then tune title and internal links.'
        : 'Monitor until impressions appear.';

  return {
    slug: tool.slug,
    category: tool.category,
    categoryLabel: categoryLabels[tool.category].en,
    englishUrl: `/en/${tool.slug}/`,
    hebrewUrl: `/he/${tool.slug}/`,
    targetEnglishQuery: getPrimaryQuery(tool, 'en'),
    targetHebrewQuery: getPrimaryQuery(tool, 'he'),
    indexed: 'pending',
    impressions: 0,
    clicks: 0,
    ctr: 'n/a',
    averagePosition: 'n/a',
    priority,
    nextAction
  };
});

export const rankingMonitorSummary = {
  trackedConverters: rankingMonitorRows.length,
  trackedLocalizedPages: rankingMonitorRows.length * locales.length,
  p1Converters: rankingMonitorRows.filter((row) => row.priority === 'P1').length,
  p2Converters: rankingMonitorRows.filter((row) => row.priority === 'P2').length,
  rowsWithSearchConsoleData: 0
};

export const priorityRankingRows = rankingMonitorRows
  .filter((row) => row.priority !== 'P3')
  .slice(0, 24);

export const indexingChecklistSummary = {
  cadence: 'Weekly',
  sitemapUrls: analyticsSummary.publicSeoPages,
  priorityQueue: 20,
  blockedByGoogle: true
} as const;

export const indexingChecklistSteps = [
  {
    step: '1',
    label: 'Recheck Pages report',
    owner: 'Search Console',
    status: 'waiting',
    detail: 'Open the Pages report and confirm whether Google still shows processing or has exposed indexed and excluded buckets.'
  },
  {
    step: '2',
    label: 'Compare sitemap count',
    owner: 'Local + Search Console',
    status: 'ready',
    detail: `Confirm that ${analyticsSummary.publicSeoPages} public URLs still match the live sitemap before trusting indexing deltas.`
  },
  {
    step: '3',
    label: 'Review homepage and category hubs',
    owner: 'Search Console',
    status: 'ready',
    detail: 'Check the homepage plus top category pages first because they feed internal links to every converter cluster.'
  },
  {
    step: '4',
    label: 'Inspect top 20 converters',
    owner: 'Search Console',
    status: 'ready',
    detail: 'Run URL Inspection for the first 20 priority converter pages and record indexed, discovered, crawled or duplicate outcomes.'
  },
  {
    step: '5',
    label: 'Request indexing only for gaps',
    owner: 'Search Console',
    status: 'ready',
    detail: 'Submit indexing requests only for high-value pages that are missing from Google or stuck without a clear exclusion reason.'
  },
  {
    step: '6',
    label: 'Watch technical blockers',
    owner: 'Local',
    status: 'automated',
    detail: 'Keep canonical, hreflang, robots, sitemap and internal noindex checks green via the automated SEO build check.'
  },
  {
    step: '7',
    label: 'Promote pages with impressions',
    owner: 'Search Console + Content',
    status: 'waiting',
    detail: 'When impressions appear, move those URLs into the ranking watchlist and improve copy, snippets and related links first.'
  }
] as const;

export const analyticsCategoryRows = categoryKeys.map((category) => {
  const tools = converters.filter((tool) => tool.category === category);
  return {
    category,
    label: categoryLabels[category].en,
    tools: tools.length,
    localizedPages: tools.length * locales.length,
    popular: tools.filter((tool) => tool.popular).length,
    newTools: tools.filter((tool) => tool.new).length
  };
});
