import { converters } from './converters';
import { categoryLabels, locales, siteUrl } from './site';
import { getConverterIntro, getSearchIntent, searchIntents, type SearchIntent } from '../lib/converter-seo';
import { getRelatedConverters } from '../lib/related-tools';

const normalizeQuery = (query: string) => query.replace(/\s+/g, ' ').trim();

const getPrimaryQuery = (tool: (typeof converters)[number], locale: 'en' | 'he') => {
  const [firstKeyword] = tool.keywords[locale];

  return normalizeQuery(firstKeyword || tool.shortTitle[locale] || tool.title[locale]);
};

const getKeywordMap = (tool: (typeof converters)[number], locale: 'en' | 'he') => {
  const candidates = [...tool.keywords[locale], tool.shortTitle[locale], tool.title[locale]]
    .map(normalizeQuery)
    .filter(Boolean);

  const deduped = candidates.filter((query, index) => {
    const key = query.toLowerCase();
    return candidates.findIndex((candidate) => candidate.toLowerCase() === key) === index;
  });

  return {
    primary: deduped[0],
    secondary: deduped.slice(1)
  };
};

type OpportunityBand = 'high' | 'medium' | 'watch';
type PriorityTier = 'tier-1' | 'tier-2' | 'tier-3';
type AuditStatus = 'good' | 'partial' | 'missing';

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

export const keywordMapRows = converters.map((tool) => {
  const englishKeywords = getKeywordMap(tool, 'en');
  const hebrewKeywords = getKeywordMap(tool, 'he');

  return {
    slug: tool.slug,
    category: tool.category,
    categoryLabel: categoryLabels[tool.category].en,
    popular: Boolean(tool.popular),
    new: Boolean(tool.new),
    englishUrl: `/en/${tool.slug}/`,
    hebrewUrl: `/he/${tool.slug}/`,
    primaryEnglishQuery: englishKeywords.primary,
    secondaryEnglishQueries: englishKeywords.secondary,
    primaryHebrewQuery: hebrewKeywords.primary,
    secondaryHebrewQueries: hebrewKeywords.secondary
  };
});

export const keywordMapSummary = {
  trackedConverters: keywordMapRows.length,
  mappedEnglishPrimary: keywordMapRows.filter((row) => row.primaryEnglishQuery).length,
  mappedHebrewPrimary: keywordMapRows.filter((row) => row.primaryHebrewQuery).length,
  mappedEnglishSecondary: keywordMapRows.filter((row) => row.secondaryEnglishQueries.length > 0).length,
  mappedHebrewSecondary: keywordMapRows.filter((row) => row.secondaryHebrewQueries.length > 0).length
};

export const priorityKeywordRows = keywordMapRows
  .filter((row) => row.popular || row.new)
  .slice(0, 24);

export const keywordIntentRows = keywordMapRows.map((row) => {
  const tool = converters.find((item) => item.slug === row.slug)!;

  return {
    ...row,
    intent: getSearchIntent(tool)
  };
});

export const keywordIntentSummary = searchIntents.map((intent) => ({
  intent,
  count: keywordIntentRows.filter((row) => row.intent === intent).length
}));

export const priorityIntentRows = keywordIntentRows
  .filter((row) => row.popular || row.new)
  .slice(0, 24);

const hebrewAdvantageIntents: SearchIntent[] = ['calculate', 'validate', 'clean', 'explain'];
const hebrewAdvantageCategories = new Set(['text', 'calculator', 'developer', 'time']);
const englishLongTailIntents: SearchIntent[] = ['convert', 'validate', 'decode', 'clean', 'explain'];
const englishLongTailCategories = new Set(['data', 'text', 'encoding', 'developer', 'time']);
const englishLongTailModifiers = [
  'online',
  'converter',
  'calculator',
  'checker',
  'parser',
  'decoder',
  'encoder',
  'formatter',
  'generator',
  'remover',
  'extractor',
  'lookup'
];

const getHebrewOpportunity = (row: (typeof keywordIntentRows)[number]) => {
  let score = 0;
  const reasons: string[] = [];

  if (row.primaryHebrewQuery.length >= 10) {
    score += 2;
    reasons.push('clear Hebrew exact-match query');
  }

  if (row.secondaryHebrewQueries.length >= 2) {
    score += 1;
    reasons.push('multiple Hebrew variants');
  }

  if (hebrewAdvantageIntents.includes(row.intent)) {
    score += 2;
    reasons.push('intent often underserved in Hebrew');
  }

  if (hebrewAdvantageCategories.has(row.category)) {
    score += 1;
    reasons.push('category fits Hebrew utility searches');
  }

  if (row.popular) {
    score += 1;
    reasons.push('already a priority converter');
  }

  if (row.new) {
    score += 1;
    reasons.push('new page with room to shape positioning early');
  }

  const band: OpportunityBand = score >= 6 ? 'high' : score >= 4 ? 'medium' : 'watch';

  return { score, band, reasons };
};

export const hebrewOpportunityRows = keywordIntentRows.map((row) => ({
  ...row,
  ...getHebrewOpportunity(row)
}));

export const hebrewOpportunitySummary = {
  trackedConverters: hebrewOpportunityRows.length,
  high: hebrewOpportunityRows.filter((row) => row.band === 'high').length,
  medium: hebrewOpportunityRows.filter((row) => row.band === 'medium').length,
  watch: hebrewOpportunityRows.filter((row) => row.band === 'watch').length
};

export const priorityHebrewOpportunityRows = [...hebrewOpportunityRows]
  .sort((left, right) => right.score - left.score || Number(right.popular) - Number(left.popular) || left.slug.localeCompare(right.slug))
  .slice(0, 24);

const getEnglishLongTailOpportunity = (row: (typeof keywordIntentRows)[number]) => {
  let score = 0;
  const reasons: string[] = [];
  const englishWordCount = row.primaryEnglishQuery.split(/\s+/).filter(Boolean).length;
  const hasSpecificModifier = englishLongTailModifiers.some((modifier) =>
    row.primaryEnglishQuery.toLowerCase().includes(modifier)
  );

  if (englishWordCount >= 3) {
    score += 2;
    reasons.push('clear multi-word exact-match query');
  }

  if (englishWordCount >= 4) {
    score += 1;
    reasons.push('deeper long-tail phrasing');
  }

  if (row.secondaryEnglishQueries.length >= 2) {
    score += 1;
    reasons.push('multiple English search variants');
  }

  if (englishLongTailIntents.includes(row.intent)) {
    score += 2;
    reasons.push('intent fits exact-match utility pages');
  }

  if (englishLongTailCategories.has(row.category)) {
    score += 1;
    reasons.push('category competes well on specific utility terms');
  }

  if (hasSpecificModifier) {
    score += 1;
    reasons.push('query includes a strong utility modifier');
  }

  if (row.popular) {
    score += 1;
    reasons.push('already a priority converter');
  }

  if (row.new) {
    score += 1;
    reasons.push('new page with room to win long-tail coverage early');
  }

  if (score === 0) {
    score = 1;
    reasons.push('niche exact-match page worth monitoring');
  }

  const band: OpportunityBand = score >= 6 ? 'high' : score >= 4 ? 'medium' : 'watch';

  return { score, band, reasons };
};

export const englishLongTailRows = keywordIntentRows.map((row) => ({
  ...row,
  ...getEnglishLongTailOpportunity(row)
}));

export const englishLongTailSummary = {
  trackedConverters: englishLongTailRows.length,
  high: englishLongTailRows.filter((row) => row.band === 'high').length,
  medium: englishLongTailRows.filter((row) => row.band === 'medium').length,
  watch: englishLongTailRows.filter((row) => row.band === 'watch').length
};

export const priorityEnglishLongTailRows = [...englishLongTailRows]
  .sort((left, right) => right.score - left.score || Number(right.popular) - Number(left.popular) || left.slug.localeCompare(right.slug))
  .slice(0, 24);

const highValueIntents: SearchIntent[] = ['convert', 'calculate', 'validate', 'clean', 'decode'];

export const searchDemandProxyRows = keywordIntentRows.map((row) => {
  const hebrewRow = hebrewOpportunityRows.find((item) => item.slug === row.slug)!;
  const englishRow = englishLongTailRows.find((item) => item.slug === row.slug)!;
  let proxyScore = hebrewRow.score + englishRow.score;
  const reasons = [...hebrewRow.reasons, ...englishRow.reasons];

  if (highValueIntents.includes(row.intent)) {
    proxyScore += 2;
    reasons.push('intent maps directly to common utility demand');
  }

  if (row.popular) {
    proxyScore += 2;
    reasons.push('already marked as a business priority tool');
  }

  if (row.new) {
    proxyScore += 1;
    reasons.push('new page can gain traction early if improved fast');
  }

  const tier: PriorityTier = proxyScore >= 15 ? 'tier-1' : proxyScore >= 11 ? 'tier-2' : 'tier-3';

  return {
    ...row,
    hebrewScore: hebrewRow.score,
    englishScore: englishRow.score,
    proxyScore,
    tier,
    reasons: [...new Set(reasons)]
  };
});

export const searchDemandProxySummary = {
  trackedConverters: searchDemandProxyRows.length,
  tier1: searchDemandProxyRows.filter((row) => row.tier === 'tier-1').length,
  tier2: searchDemandProxyRows.filter((row) => row.tier === 'tier-2').length,
  tier3: searchDemandProxyRows.filter((row) => row.tier === 'tier-3').length
};

export const prioritySearchDemandProxyRows = [...searchDemandProxyRows]
  .sort((left, right) => right.proxyScore - left.proxyScore || Number(right.popular) - Number(left.popular) || left.slug.localeCompare(right.slug))
  .slice(0, 24);

const genericFaqQuestions = new Set([
  'Is my data uploaded to a server?',
  'Can I use this converter for free?'
]);

const seoAuditRows = converters.map((tool) => ({
  slug: tool.slug,
  title: tool.title.en,
  uniqueIntroEn: getConverterIntro(tool, 'en'),
  uniqueIntroHe: getConverterIntro(tool, 'he'),
  hasSingleExample: tool.examples.length === 1,
  hasMultipleExamples: tool.examples.length >= 2,
  hasOnlyGenericFaq:
    tool.faq.length > 0 &&
    tool.faq.every((item) => genericFaqQuestions.has(item.question.en)),
  relatedCount: getRelatedConverters(tool, 3).length,
  hasReverseLink: Boolean(tool.reverseSlug),
  relatedIncludesReverse: Boolean(tool.reverseSlug && getRelatedConverters(tool, 3).some((item) => item.slug === tool.reverseSlug))
}));

export const converterSeoAuditSummary = {
  trackedConverters: converters.length,
  localizedTitles: converters.length,
  localizedMetaDescriptions: converters.length,
  visibleH1: converters.length,
  convertersWithUniqueIntroCopy:
    new Set(seoAuditRows.map((row) => row.uniqueIntroEn)).size === converters.length &&
    new Set(seoAuditRows.map((row) => row.uniqueIntroHe)).size === converters.length
      ? converters.length
      : 0,
  convertersWithExamples: seoAuditRows.filter((row) => !row.hasSingleExample || row.hasMultipleExamples).length,
  convertersWithMultipleExamples: seoAuditRows.filter((row) => row.hasMultipleExamples).length,
  convertersUsingOnlyGenericFaq: seoAuditRows.filter((row) => row.hasOnlyGenericFaq).length,
  convertersWithReverseLink: seoAuditRows.filter((row) => row.hasReverseLink).length,
  convertersWithRelatedLinks: seoAuditRows.filter((row) => row.relatedCount > 0).length,
  convertersWhoseRelatedIncludesReverse: seoAuditRows.filter((row) => row.relatedIncludesReverse).length
};

export const converterSeoAuditChecks: Array<{
  area: string;
  status: AuditStatus;
  evidence: string;
  nextStep: string;
}> = [
  {
    area: 'Title',
    status: 'good',
    evidence: `${converterSeoAuditSummary.localizedTitles}/${converterSeoAuditSummary.trackedConverters} converters now render localized page titles with intent-aware CTR suffixes while keeping exact-match converter names visible.`,
    nextStep: 'Monitor impressions and tighten suffixes only where Search Console shows weak CTR.'
  },
  {
    area: 'Meta description',
    status: 'good',
    evidence: `${converterSeoAuditSummary.localizedMetaDescriptions}/${converterSeoAuditSummary.trackedConverters} converters now render localized meta descriptions that highlight browser-based usage, bilingual support, examples and no-upload privacy cues.`,
    nextStep: 'Tune wording per page only after impression and CTR data appears in Search Console.'
  },
  {
    area: 'H1',
    status: 'good',
    evidence: 'Every converter template renders a visible H1 from the localized tool title.',
    nextStep: 'Keep literal exact-match phrasing for ranking clarity.'
  },
  {
    area: 'Intro copy',
    status: 'good',
    evidence: `${converterSeoAuditSummary.convertersWithUniqueIntroCopy}/${converterSeoAuditSummary.trackedConverters} converters now render unique intent-specific intro copy in both Hebrew and English.`,
    nextStep: 'Use the same intent layer to guide examples and FAQ depth in 7.3 and 7.4.'
  },
  {
    area: 'Examples',
    status: 'partial',
    evidence: `${converterSeoAuditSummary.convertersWithMultipleExamples}/${converterSeoAuditSummary.trackedConverters} converters currently have multiple examples; the rest rely on a single sample.`,
    nextStep: 'Implement 7.3 by adding more practical examples to priority converters first.'
  },
  {
    area: 'FAQ',
    status: 'partial',
    evidence: `${converterSeoAuditSummary.convertersUsingOnlyGenericFaq}/${converterSeoAuditSummary.trackedConverters} converters still rely only on the shared privacy/free FAQ pair plus generated generic questions.`,
    nextStep: 'Implement 7.4 with converter-specific FAQ for high-priority pages.'
  },
  {
    area: 'Related tools',
    status: 'good',
    evidence: `${converterSeoAuditSummary.convertersWithRelatedLinks}/${converterSeoAuditSummary.trackedConverters} converters now render intent-ranked related tools, and ${converterSeoAuditSummary.convertersWhoseRelatedIncludesReverse}/${converterSeoAuditSummary.convertersWithReverseLink} reverse-capable converters surface the inverse tool inside the related section.`,
    nextStep: 'Use this intent layer again when expanding category hubs and internal linking in 8.4 and 9.2.'
  },
  {
    area: 'Structured data',
    status: 'good',
    evidence: 'The converter template now emits SoftwareApplication, FAQPage and BreadcrumbList JSON-LD through a shared helper, and dedicated tests enforce schema presence and core fields for every converter in both locales.',
    nextStep: 'Keep the helper as the single source of truth when expanding converter schema depth later.'
  }
];

export const priorityConverterSeoAuditRows = seoAuditRows
  .filter((row) => row.hasSingleExample || row.hasOnlyGenericFaq || !row.hasReverseLink)
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
