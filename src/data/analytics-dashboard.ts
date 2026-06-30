import { converters } from './converters';
import { categoryLabels, locales, siteUrl } from './site';
import { getToolContentReadiness, isLaunchReadyFreshTool } from '../lib/converter-content';
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
type MonetizationFit = 'high' | 'medium' | 'low';
type ImplementationRisk = 'low' | 'medium';

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
  newTools: converters.filter((tool) => isLaunchReadyFreshTool(tool)).length,
  trackedEvents: analyticsEvents.length,
  adPlacements: 4
};

export const contentQualitySummary = {
  launchReadyFreshTools: converters.filter((tool) => isLaunchReadyFreshTool(tool)).length,
  toolsWithTwoExamples: converters.filter((tool) => getToolContentReadiness(tool).exampleCount >= 2).length,
  toolsWithRichFaq: converters.filter((tool) => getToolContentReadiness(tool).faqCount >= 4).length,
  toolsWithUseCases: converters.filter((tool) => getToolContentReadiness(tool).useCaseCount >= 3).length
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

export const stabilizationChecklist = [
  {
    area: 'Snippet quality',
    detail: 'Keep every public title literal, unique and exact-match friendly, then keep descriptions browser-based, bilingual and no-upload focused.',
    status: 'ready-now'
  },
  {
    area: 'Content depth',
    detail: 'Strengthen thin-feeling pages through richer template guidance, practical checks and output-ready usage sections before adding more converters.',
    status: 'ready-now'
  },
  {
    area: 'Ad layout readiness',
    detail: 'Reserve stable placements that stay visible without looking like internal placeholders or crowding the workflow.',
    status: 'ready-now'
  },
  {
    area: 'Data follow-up',
    detail: 'Wait for Search Console impressions, indexing deltas and live ad fill before pushing CTR experiments or analytics-driven prioritization.',
    status: 'waiting-for-data'
  }
] as const;

export const snippetDefinitionOfDone = [
  {
    area: 'Titles',
    rule: 'Every home, category and tool page keeps a literal, unique title with the exact tool or category name visible.',
    owner: 'SEO guardrail'
  },
  {
    area: 'Descriptions',
    rule: 'Every indexable page keeps a unique description that says browser-based, bilingual and no-upload in language-appropriate wording.',
    owner: 'SEO guardrail'
  },
  {
    area: 'Language style',
    rule: 'Avoid vague marketing phrases and keep snippet wording practical, specific and easy to verify.',
    owner: 'Content quality'
  }
] as const;

export const operationsCadence = [
  {
    area: 'Ranking review',
    cadence: 'Weekly',
    owner: 'Search Console',
    trigger: 'Run when new impressions or indexed pages appear.'
  },
  {
    area: 'CTR watchlist',
    cadence: 'Weekly',
    owner: 'Search Console + Content',
    trigger: 'Promote only pages that already have enough impressions to justify copy changes.'
  },
  {
    area: 'Weekly audit automation',
    cadence: 'Weekly',
    owner: 'Codex automation',
    trigger: 'Run the recurring audit lane to verify local quality gates, deploy health, monetization readiness and open blockers.'
  }
] as const;

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
  const priority = tool.popular ? 'P1' : isLaunchReadyFreshTool(tool) ? 'P2' : 'P3';
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
    new: isLaunchReadyFreshTool(tool),
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
    evidence: `${converterSeoAuditSummary.localizedTitles}/${converterSeoAuditSummary.trackedConverters} converters now render localized page titles with literal browser-based suffixes while keeping exact-match converter names visible.`,
    nextStep: 'Hold this wording stable until Search Console shows enough impressions to justify tighter experiments.'
  },
  {
    area: 'Meta description',
    status: 'good',
    evidence: `${converterSeoAuditSummary.localizedMetaDescriptions}/${converterSeoAuditSummary.trackedConverters} converters now render localized meta descriptions that stay literal, browser-based, bilingual and no-upload focused.`,
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
  },
  {
    area: 'Thin-page guardrail',
    status: 'good',
    evidence: 'The converter template now includes practical use, workflow fit, result checklist, trust checks, examples, FAQ, tips and issue guidance for every localized tool page.',
    nextStep: 'Use template depth plus launch-ready gates to avoid shipping thin new pages before stabilization is complete.'
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
    newTools: tools.filter((tool) => isLaunchReadyFreshTool(tool)).length
  };
});

type BacklogRow = {
  slugHint: string;
  converter: string;
  category: string;
  batch: string;
  priorityTier: PriorityTier;
  monetizationFit: MonetizationFit;
  implementationRisk: ImplementationRisk;
  hebrewAdvantage: boolean;
  primaryIntent: SearchIntent;
  primaryEnglishQuery: string;
  primaryHebrewQuery: string;
  reason: string;
};

export const converterBacklogRows: BacklogRow[] = [
  {
    slugHint: 'keyword-density-checker',
    converter: 'Keyword density checker',
    category: 'SEO',
    batch: 'Batch 9',
    priorityTier: 'tier-1',
    monetizationFit: 'high',
    implementationRisk: 'low',
    hebrewAdvantage: false,
    primaryIntent: 'validate',
    primaryEnglishQuery: 'keyword density checker',
    primaryHebrewQuery: 'בודק צפיפות מילות מפתח',
    reason: 'Strong SEO intent and simple browser-side text analysis.'
  },
  {
    slugHint: 'hreflang-tag-generator',
    converter: 'Hreflang tag generator',
    category: 'SEO',
    batch: 'Batch 9',
    priorityTier: 'tier-1',
    monetizationFit: 'high',
    implementationRisk: 'low',
    hebrewAdvantage: true,
    primaryIntent: 'generate',
    primaryEnglishQuery: 'hreflang tag generator',
    primaryHebrewQuery: 'מחולל תגיות hreflang',
    reason: 'High-value bilingual SEO workflow and a clear fit for this site brand.'
  },
  {
    slugHint: 'canonical-tag-checker',
    converter: 'Canonical tag checker',
    category: 'SEO',
    batch: 'Batch 9',
    priorityTier: 'tier-1',
    monetizationFit: 'high',
    implementationRisk: 'low',
    hebrewAdvantage: false,
    primaryIntent: 'validate',
    primaryEnglishQuery: 'canonical tag checker',
    primaryHebrewQuery: 'בודק תגית canonical',
    reason: 'Exact-match SEO utility query with simple parsing rules.'
  },
  {
    slugHint: 'robots-meta-tag-generator',
    converter: 'Robots meta tag generator',
    category: 'SEO',
    batch: 'Batch 9',
    priorityTier: 'tier-1',
    monetizationFit: 'high',
    implementationRisk: 'low',
    hebrewAdvantage: true,
    primaryIntent: 'generate',
    primaryEnglishQuery: 'robots meta tag generator',
    primaryHebrewQuery: 'מחולל תגית robots',
    reason: 'Strong search intent and direct relevance to search-focused site owners.'
  },
  {
    slugHint: 'open-graph-tag-generator',
    converter: 'Open Graph tag generator',
    category: 'SEO',
    batch: 'Batch 9',
    priorityTier: 'tier-1',
    monetizationFit: 'high',
    implementationRisk: 'low',
    hebrewAdvantage: false,
    primaryIntent: 'generate',
    primaryEnglishQuery: 'open graph tag generator',
    primaryHebrewQuery: 'מחולל תגיות Open Graph',
    reason: 'Popular marketing workflow with clear value for content teams.'
  },
  {
    slugHint: 'slug-generator',
    converter: 'Slug generator',
    category: 'SEO',
    batch: 'Batch 9',
    priorityTier: 'tier-1',
    monetizationFit: 'medium',
    implementationRisk: 'low',
    hebrewAdvantage: true,
    primaryIntent: 'generate',
    primaryEnglishQuery: 'slug generator',
    primaryHebrewQuery: 'מחולל slug',
    reason: 'Broad utility demand and useful bilingual formatting opportunity.'
  },
  {
    slugHint: 'redirect-mapping-generator',
    converter: 'Redirect mapping generator',
    category: 'SEO',
    batch: 'Batch 9',
    priorityTier: 'tier-2',
    monetizationFit: 'high',
    implementationRisk: 'low',
    hebrewAdvantage: false,
    primaryIntent: 'generate',
    primaryEnglishQuery: 'redirect mapping generator',
    primaryHebrewQuery: 'מחולל מפת הפניות',
    reason: 'Good SEO migration intent and structured output from simple logic.'
  },
  {
    slugHint: 'faq-schema-generator',
    converter: 'FAQ schema generator',
    category: 'SEO',
    batch: 'Batch 9',
    priorityTier: 'tier-2',
    monetizationFit: 'high',
    implementationRisk: 'low',
    hebrewAdvantage: true,
    primaryIntent: 'generate',
    primaryEnglishQuery: 'faq schema generator',
    primaryHebrewQuery: 'מחולל FAQ schema',
    reason: 'Strong publisher intent and easy JSON-LD generation path.'
  },
  {
    slugHint: 'meta-tags-preview',
    converter: 'Meta tags preview',
    category: 'SEO',
    batch: 'Batch 9',
    priorityTier: 'tier-2',
    monetizationFit: 'high',
    implementationRisk: 'low',
    hebrewAdvantage: false,
    primaryIntent: 'validate',
    primaryEnglishQuery: 'meta tags preview',
    primaryHebrewQuery: 'תצוגה מקדימה של meta tags',
    reason: 'CTR-focused SEO support tool with strong organic intent.'
  },
  {
    slugHint: 'html-headings-outline-extractor',
    converter: 'HTML headings outline extractor',
    category: 'SEO',
    batch: 'Batch 9',
    priorityTier: 'tier-2',
    monetizationFit: 'medium',
    implementationRisk: 'low',
    hebrewAdvantage: false,
    primaryIntent: 'validate',
    primaryEnglishQuery: 'html headings outline extractor',
    primaryHebrewQuery: 'מחלץ מבנה כותרות HTML',
    reason: 'Useful audit query for content and SEO workflows using local parsing only.'
  },
  {
    slugHint: 'sql-formatter',
    converter: 'SQL formatter',
    category: 'Developer',
    batch: 'Batch 10',
    priorityTier: 'tier-1',
    monetizationFit: 'medium',
    implementationRisk: 'low',
    hebrewAdvantage: false,
    primaryIntent: 'format',
    primaryEnglishQuery: 'sql formatter',
    primaryHebrewQuery: 'מפרמט SQL',
    reason: 'Well-known developer query with immediate utility and low implementation risk.'
  },
  {
    slugHint: 'jwt-claims-viewer',
    converter: 'JWT claims viewer',
    category: 'Developer',
    batch: 'Batch 10',
    priorityTier: 'tier-1',
    monetizationFit: 'medium',
    implementationRisk: 'low',
    hebrewAdvantage: false,
    primaryIntent: 'decode',
    primaryEnglishQuery: 'jwt claims viewer',
    primaryHebrewQuery: 'מציג claims של JWT',
    reason: 'Clear developer exact-match query and safe local token decoding.'
  },
  {
    slugHint: 'env-parser',
    converter: '.env parser',
    category: 'Developer',
    batch: 'Batch 10',
    priorityTier: 'tier-2',
    monetizationFit: 'medium',
    implementationRisk: 'low',
    hebrewAdvantage: false,
    primaryIntent: 'validate',
    primaryEnglishQuery: '.env parser',
    primaryHebrewQuery: 'מנתח קובץ env',
    reason: 'Developer utility that fits no-upload privacy positioning.'
  },
  {
    slugHint: 'curl-command-formatter',
    converter: 'cURL command formatter',
    category: 'Developer',
    batch: 'Batch 10',
    priorityTier: 'tier-2',
    monetizationFit: 'medium',
    implementationRisk: 'low',
    hebrewAdvantage: false,
    primaryIntent: 'format',
    primaryEnglishQuery: 'curl command formatter',
    primaryHebrewQuery: 'מפרמט פקודת curl',
    reason: 'Popular troubleshooting task with simple text transformation.'
  },
  {
    slugHint: 'regex-tester',
    converter: 'Regex tester',
    category: 'Developer',
    batch: 'Batch 10',
    priorityTier: 'tier-2',
    monetizationFit: 'medium',
    implementationRisk: 'medium',
    hebrewAdvantage: false,
    primaryIntent: 'validate',
    primaryEnglishQuery: 'regex tester',
    primaryHebrewQuery: 'בודק regex',
    reason: 'High developer demand, though the UX needs careful edge-case handling.'
  },
  {
    slugHint: 'json-lines-to-json-array',
    converter: 'JSON Lines to JSON array',
    category: 'Data',
    batch: 'Batch 10',
    priorityTier: 'tier-1',
    monetizationFit: 'medium',
    implementationRisk: 'low',
    hebrewAdvantage: false,
    primaryIntent: 'convert',
    primaryEnglishQuery: 'json lines to json array',
    primaryHebrewQuery: 'המרת JSON Lines למערך JSON',
    reason: 'Very direct data-format conversion query with low implementation risk.'
  },
  {
    slugHint: 'json-array-to-json-lines',
    converter: 'JSON array to JSON Lines',
    category: 'Data',
    batch: 'Batch 10',
    priorityTier: 'tier-1',
    monetizationFit: 'medium',
    implementationRisk: 'low',
    hebrewAdvantage: false,
    primaryIntent: 'convert',
    primaryEnglishQuery: 'json array to json lines',
    primaryHebrewQuery: 'המרת מערך JSON ל-JSON Lines',
    reason: 'Strong paired reverse converter that benefits from direct internal linking.'
  },
  {
    slugHint: 'html-table-to-csv',
    converter: 'HTML table to CSV',
    category: 'Data',
    batch: 'Batch 10',
    priorityTier: 'tier-1',
    monetizationFit: 'medium',
    implementationRisk: 'low',
    hebrewAdvantage: false,
    primaryIntent: 'convert',
    primaryEnglishQuery: 'html table to csv',
    primaryHebrewQuery: 'המרת טבלת HTML ל-CSV',
    reason: 'Classic format-conversion search and easy browser-only extraction.'
  },
  {
    slugHint: 'html-table-to-json',
    converter: 'HTML table to JSON',
    category: 'Data',
    batch: 'Batch 10',
    priorityTier: 'tier-1',
    monetizationFit: 'medium',
    implementationRisk: 'low',
    hebrewAdvantage: false,
    primaryIntent: 'convert',
    primaryEnglishQuery: 'html table to json',
    primaryHebrewQuery: 'המרת טבלת HTML ל-JSON',
    reason: 'Strong developer and analyst workflow with clean local parsing.'
  },
  {
    slugHint: 'xml-formatter',
    converter: 'XML formatter',
    category: 'Data',
    batch: 'Batch 10',
    priorityTier: 'tier-2',
    monetizationFit: 'medium',
    implementationRisk: 'low',
    hebrewAdvantage: false,
    primaryIntent: 'format',
    primaryEnglishQuery: 'xml formatter',
    primaryHebrewQuery: 'מפרמט XML',
    reason: 'Broad utility query and a natural extension of existing structured-data tools.'
  },
  {
    slugHint: 'remove-duplicate-lines',
    converter: 'Remove duplicate lines',
    category: 'Text',
    batch: 'Batch 11',
    priorityTier: 'tier-1',
    monetizationFit: 'medium',
    implementationRisk: 'low',
    hebrewAdvantage: true,
    primaryIntent: 'clean',
    primaryEnglishQuery: 'remove duplicate lines',
    primaryHebrewQuery: 'הסרת שורות כפולות',
    reason: 'Strong utility phrasing in both languages and tiny implementation surface.'
  },
  {
    slugHint: 'bullet-list-formatter',
    converter: 'Bullet list formatter',
    category: 'Text',
    batch: 'Batch 11',
    priorityTier: 'tier-2',
    monetizationFit: 'medium',
    implementationRisk: 'low',
    hebrewAdvantage: true,
    primaryIntent: 'format',
    primaryEnglishQuery: 'bullet list formatter',
    primaryHebrewQuery: 'מפרמט רשימת בולטים',
    reason: 'Useful writing workflow with a bilingual gap in Hebrew-first results.'
  },
  {
    slugHint: 'whitespace-visualizer',
    converter: 'Whitespace visualizer',
    category: 'Text',
    batch: 'Batch 11',
    priorityTier: 'tier-2',
    monetizationFit: 'low',
    implementationRisk: 'low',
    hebrewAdvantage: false,
    primaryIntent: 'validate',
    primaryEnglishQuery: 'whitespace visualizer',
    primaryHebrewQuery: 'מציג רווחים נסתרים',
    reason: 'Niche but exact-match query with clear utility and low build cost.'
  },
  {
    slugHint: 'unicode-normalizer',
    converter: 'Unicode normalizer',
    category: 'Text',
    batch: 'Batch 11',
    priorityTier: 'tier-2',
    monetizationFit: 'low',
    implementationRisk: 'low',
    hebrewAdvantage: true,
    primaryIntent: 'clean',
    primaryEnglishQuery: 'unicode normalizer',
    primaryHebrewQuery: 'מנרמל Unicode',
    reason: 'Helps multilingual text cleanup and aligns well with Hebrew support.'
  },
  {
    slugHint: 'sentence-case-converter',
    converter: 'Sentence case converter',
    category: 'Text',
    batch: 'Batch 11',
    priorityTier: 'tier-2',
    monetizationFit: 'medium',
    implementationRisk: 'low',
    hebrewAdvantage: true,
    primaryIntent: 'convert',
    primaryEnglishQuery: 'sentence case converter',
    primaryHebrewQuery: 'ממיר ל-sentence case',
    reason: 'Straightforward text-format query with broad content-team appeal.'
  },
  {
    slugHint: 'title-case-converter',
    converter: 'Title case converter',
    category: 'Text',
    batch: 'Batch 11',
    priorityTier: 'tier-2',
    monetizationFit: 'medium',
    implementationRisk: 'low',
    hebrewAdvantage: false,
    primaryIntent: 'convert',
    primaryEnglishQuery: 'title case converter',
    primaryHebrewQuery: 'ממיר ל-title case',
    reason: 'Popular exact-match text utility that complements the text-case detector.'
  },
  {
    slugHint: 'comma-list-to-bullet-list',
    converter: 'Comma list to bullet list',
    category: 'Text',
    batch: 'Batch 11',
    priorityTier: 'tier-2',
    monetizationFit: 'low',
    implementationRisk: 'low',
    hebrewAdvantage: true,
    primaryIntent: 'convert',
    primaryEnglishQuery: 'comma separated list to bullet list',
    primaryHebrewQuery: 'המרת רשימה מופרדת בפסיקים לבולטים',
    reason: 'Simple list transformation with clear copy-and-paste workflows.'
  },
  {
    slugHint: 'bullet-list-to-comma-list',
    converter: 'Bullet list to comma list',
    category: 'Text',
    batch: 'Batch 11',
    priorityTier: 'tier-2',
    monetizationFit: 'low',
    implementationRisk: 'low',
    hebrewAdvantage: true,
    primaryIntent: 'convert',
    primaryEnglishQuery: 'bullet list to comma separated list',
    primaryHebrewQuery: 'המרת רשימת בולטים לרשימה בפסיקים',
    reason: 'Natural reverse-tool companion that supports structured internal linking.'
  },
  {
    slugHint: 'rtl-text-cleaner',
    converter: 'RTL text cleaner',
    category: 'Text',
    batch: 'Batch 11',
    priorityTier: 'tier-1',
    monetizationFit: 'medium',
    implementationRisk: 'low',
    hebrewAdvantage: true,
    primaryIntent: 'clean',
    primaryEnglishQuery: 'rtl text cleaner',
    primaryHebrewQuery: 'מנקה טקסט RTL',
    reason: 'Clear Hebrew-first advantage because many competing tools ignore RTL edge cases.'
  },
  {
    slugHint: 'punctuation-normalizer',
    converter: 'Punctuation normalizer',
    category: 'Text',
    batch: 'Batch 11',
    priorityTier: 'tier-2',
    monetizationFit: 'low',
    implementationRisk: 'low',
    hebrewAdvantage: true,
    primaryIntent: 'clean',
    primaryEnglishQuery: 'punctuation normalizer',
    primaryHebrewQuery: 'מנרמל סימני פיסוק',
    reason: 'Useful editorial cleanup tool with bilingual and RTL relevance.'
  },
  {
    slugHint: 'vat-calculator',
    converter: 'VAT calculator',
    category: 'Calculator',
    batch: 'Batch 12',
    priorityTier: 'tier-1',
    monetizationFit: 'high',
    implementationRisk: 'low',
    hebrewAdvantage: true,
    primaryIntent: 'calculate',
    primaryEnglishQuery: 'vat calculator',
    primaryHebrewQuery: 'מחשבון מעמ',
    reason: 'Strong commercial intent and especially useful for Hebrew-speaking local business users.'
  },
  {
    slugHint: 'discount-percentage-calculator',
    converter: 'Discount percentage calculator',
    category: 'Calculator',
    batch: 'Batch 12',
    priorityTier: 'tier-1',
    monetizationFit: 'high',
    implementationRisk: 'low',
    hebrewAdvantage: false,
    primaryIntent: 'calculate',
    primaryEnglishQuery: 'discount percentage calculator',
    primaryHebrewQuery: 'מחשבון אחוז הנחה',
    reason: 'Popular commerce query with very simple local math.'
  },
  {
    slugHint: 'profit-margin-calculator',
    converter: 'Profit margin calculator',
    category: 'Calculator',
    batch: 'Batch 12',
    priorityTier: 'tier-1',
    monetizationFit: 'high',
    implementationRisk: 'low',
    hebrewAdvantage: true,
    primaryIntent: 'calculate',
    primaryEnglishQuery: 'profit margin calculator',
    primaryHebrewQuery: 'מחשבון שולי רווח',
    reason: 'Business-intent query that can monetize well with finance and SaaS ads.'
  },
  {
    slugHint: 'markup-calculator',
    converter: 'Markup calculator',
    category: 'Calculator',
    batch: 'Batch 12',
    priorityTier: 'tier-1',
    monetizationFit: 'high',
    implementationRisk: 'low',
    hebrewAdvantage: true,
    primaryIntent: 'calculate',
    primaryEnglishQuery: 'markup calculator',
    primaryHebrewQuery: 'מחשבון מרקאפ',
    reason: 'Strong e-commerce/business utility and a good sibling for margin calculations.'
  },
  {
    slugHint: 'break-even-calculator',
    converter: 'Break-even calculator',
    category: 'Calculator',
    batch: 'Batch 12',
    priorityTier: 'tier-1',
    monetizationFit: 'high',
    implementationRisk: 'low',
    hebrewAdvantage: true,
    primaryIntent: 'calculate',
    primaryEnglishQuery: 'break even calculator',
    primaryHebrewQuery: 'מחשבון נקודת איזון',
    reason: 'High-value SMB search intent with manageable math and strong Hebrew gap.'
  },
  {
    slugHint: 'savings-goal-calculator',
    converter: 'Savings goal calculator',
    category: 'Calculator',
    batch: 'Batch 12',
    priorityTier: 'tier-2',
    monetizationFit: 'high',
    implementationRisk: 'low',
    hebrewAdvantage: false,
    primaryIntent: 'calculate',
    primaryEnglishQuery: 'savings goal calculator',
    primaryHebrewQuery: 'מחשבון יעד חיסכון',
    reason: 'Consumer finance query with healthy monetization potential.'
  },
  {
    slugHint: 'invoice-due-date-calculator',
    converter: 'Invoice due date calculator',
    category: 'Calculator',
    batch: 'Batch 12',
    priorityTier: 'tier-1',
    monetizationFit: 'high',
    implementationRisk: 'low',
    hebrewAdvantage: true,
    primaryIntent: 'calculate',
    primaryEnglishQuery: 'invoice due date calculator',
    primaryHebrewQuery: 'מחשבון תאריך יעד לחשבונית',
    reason: 'Practical business workflow that is underserved in Hebrew.'
  },
  {
    slugHint: 'work-hours-calculator',
    converter: 'Work hours calculator',
    category: 'Calculator',
    batch: 'Batch 12',
    priorityTier: 'tier-1',
    monetizationFit: 'high',
    implementationRisk: 'low',
    hebrewAdvantage: true,
    primaryIntent: 'calculate',
    primaryEnglishQuery: 'work hours calculator',
    primaryHebrewQuery: 'מחשבון שעות עבודה',
    reason: 'High repeat-use utility with strong bilingual local-business relevance.'
  },
  {
    slugHint: 'overtime-pay-calculator',
    converter: 'Overtime pay calculator',
    category: 'Calculator',
    batch: 'Batch 12',
    priorityTier: 'tier-2',
    monetizationFit: 'high',
    implementationRisk: 'medium',
    hebrewAdvantage: true,
    primaryIntent: 'calculate',
    primaryEnglishQuery: 'overtime pay calculator',
    primaryHebrewQuery: 'מחשבון שעות נוספות',
    reason: 'Very strong user intent but needs careful assumptions and clear disclaimers.'
  },
  {
    slugHint: 'commission-calculator',
    converter: 'Commission calculator',
    category: 'Calculator',
    batch: 'Batch 12',
    priorityTier: 'tier-2',
    monetizationFit: 'high',
    implementationRisk: 'low',
    hebrewAdvantage: true,
    primaryIntent: 'calculate',
    primaryEnglishQuery: 'commission calculator',
    primaryHebrewQuery: 'מחשבון עמלה',
    reason: 'Commercial-intent math tool that can attract business and sales traffic.'
  },
  {
    slugHint: 'date-format-converter',
    converter: 'Date format converter',
    category: 'Time',
    batch: 'Batch 13',
    priorityTier: 'tier-1',
    monetizationFit: 'medium',
    implementationRisk: 'low',
    hebrewAdvantage: false,
    primaryIntent: 'convert',
    primaryEnglishQuery: 'date format converter',
    primaryHebrewQuery: 'ממיר פורמט תאריך',
    reason: 'Very literal utility query with broad developer and business use.'
  },
  {
    slugHint: 'unix-timestamp-converter',
    converter: 'Unix timestamp converter',
    category: 'Time',
    batch: 'Batch 13',
    priorityTier: 'tier-1',
    monetizationFit: 'medium',
    implementationRisk: 'low',
    hebrewAdvantage: false,
    primaryIntent: 'convert',
    primaryEnglishQuery: 'unix timestamp converter',
    primaryHebrewQuery: 'ממיר Unix timestamp',
    reason: 'Classic developer search query and easy local conversion logic.'
  },
  {
    slugHint: 'week-number-calculator',
    converter: 'Week number calculator',
    category: 'Time',
    batch: 'Batch 13',
    priorityTier: 'tier-2',
    monetizationFit: 'medium',
    implementationRisk: 'low',
    hebrewAdvantage: true,
    primaryIntent: 'calculate',
    primaryEnglishQuery: 'week number calculator',
    primaryHebrewQuery: 'מחשבון מספר שבוע',
    reason: 'Useful planning utility with decent business workflow demand.'
  },
  {
    slugHint: 'business-quarter-calculator',
    converter: 'Business quarter calculator',
    category: 'Time',
    batch: 'Batch 13',
    priorityTier: 'tier-2',
    monetizationFit: 'medium',
    implementationRisk: 'low',
    hebrewAdvantage: true,
    primaryIntent: 'calculate',
    primaryEnglishQuery: 'business quarter calculator',
    primaryHebrewQuery: 'מחשבון רבעון עסקי',
    reason: 'Business reporting helper with straightforward date logic.'
  },
  {
    slugHint: 'csv-header-normalizer',
    converter: 'CSV header normalizer',
    category: 'Data',
    batch: 'Batch 13',
    priorityTier: 'tier-1',
    monetizationFit: 'medium',
    implementationRisk: 'low',
    hebrewAdvantage: false,
    primaryIntent: 'clean',
    primaryEnglishQuery: 'csv header normalizer',
    primaryHebrewQuery: 'מנרמל כותרות CSV',
    reason: 'Natural extension of the existing CSV suite with simple deterministic logic.'
  },
  {
    slugHint: 'csv-to-html-table',
    converter: 'CSV to HTML table',
    category: 'Data',
    batch: 'Batch 13',
    priorityTier: 'tier-1',
    monetizationFit: 'medium',
    implementationRisk: 'low',
    hebrewAdvantage: false,
    primaryIntent: 'convert',
    primaryEnglishQuery: 'csv to html table',
    primaryHebrewQuery: 'המרת CSV לטבלת HTML',
    reason: 'Common publishing conversion query and easy reverse-pair opportunity.'
  },
  {
    slugHint: 'markdown-table-to-csv',
    converter: 'Markdown table to CSV',
    category: 'Data',
    batch: 'Batch 13',
    priorityTier: 'tier-1',
    monetizationFit: 'medium',
    implementationRisk: 'low',
    hebrewAdvantage: false,
    primaryIntent: 'convert',
    primaryEnglishQuery: 'markdown table to csv',
    primaryHebrewQuery: 'המרת טבלת Markdown ל-CSV',
    reason: 'Clear reverse-path companion for existing markdown and CSV tools.'
  },
  {
    slugHint: 'csv-to-json-lines',
    converter: 'CSV to JSON Lines',
    category: 'Data',
    batch: 'Batch 13',
    priorityTier: 'tier-1',
    monetizationFit: 'medium',
    implementationRisk: 'low',
    hebrewAdvantage: false,
    primaryIntent: 'convert',
    primaryEnglishQuery: 'csv to json lines',
    primaryHebrewQuery: 'המרת CSV ל-JSON Lines',
    reason: 'Strong data engineering workflow with exact-match search intent.'
  },
  {
    slugHint: 'query-string-to-json',
    converter: 'Query string to JSON',
    category: 'Developer',
    batch: 'Batch 13',
    priorityTier: 'tier-1',
    monetizationFit: 'medium',
    implementationRisk: 'low',
    hebrewAdvantage: false,
    primaryIntent: 'convert',
    primaryEnglishQuery: 'query string to json',
    primaryHebrewQuery: 'המרת query string ל-JSON',
    reason: 'Direct parsing utility with strong developer intent.'
  },
  {
    slugHint: 'json-to-query-string',
    converter: 'JSON to query string',
    category: 'Developer',
    batch: 'Batch 13',
    priorityTier: 'tier-1',
    monetizationFit: 'medium',
    implementationRisk: 'low',
    hebrewAdvantage: false,
    primaryIntent: 'convert',
    primaryEnglishQuery: 'json to query string',
    primaryHebrewQuery: 'המרת JSON ל-query string',
    reason: 'Paired reverse converter that supports bundle growth through shared logic.'
  }
];

export const converterBacklogSummary = {
  total: converterBacklogRows.length,
  tier1: converterBacklogRows.filter((row) => row.priorityTier === 'tier-1').length,
  tier2: converterBacklogRows.filter((row) => row.priorityTier === 'tier-2').length,
  tier3: converterBacklogRows.filter((row) => row.priorityTier === 'tier-3').length,
  highMonetization: converterBacklogRows.filter((row) => row.monetizationFit === 'high').length,
  lowRisk: converterBacklogRows.filter((row) => row.implementationRisk === 'low').length,
  hebrewFirst: converterBacklogRows.filter((row) => row.hebrewAdvantage).length
};

export const converterBacklogCategoryRows = Array.from(
  converterBacklogRows.reduce((map, row) => {
    const current = map.get(row.category) ?? {
      category: row.category,
      tools: 0,
      highMonetization: 0,
      hebrewFirst: 0
    };

    current.tools += 1;
    current.highMonetization += Number(row.monetizationFit === 'high');
    current.hebrewFirst += Number(row.hebrewAdvantage);
    map.set(row.category, current);
    return map;
  }, new Map<string, { category: string; tools: number; highMonetization: number; hebrewFirst: number }>())
    .values()
).sort((left, right) => right.tools - left.tools || left.category.localeCompare(right.category));

export const converterBacklogBatchRows = Array.from(
  converterBacklogRows.reduce((map, row) => {
    const current = map.get(row.batch) ?? {
      batch: row.batch,
      tools: 0,
      tier1: 0,
      highMonetization: 0
    };

    current.tools += 1;
    current.tier1 += Number(row.priorityTier === 'tier-1');
    current.highMonetization += Number(row.monetizationFit === 'high');
    map.set(row.batch, current);
    return map;
  }, new Map<string, { batch: string; tools: number; tier1: number; highMonetization: number }>())
    .values()
).sort((left, right) => left.batch.localeCompare(right.batch));

export const priorityConverterBacklogRows = [...converterBacklogRows]
  .sort((left, right) => {
    const score = (row: BacklogRow) =>
      Number(row.priorityTier === 'tier-1') * 4 +
      Number(row.monetizationFit === 'high') * 3 +
      Number(row.implementationRisk === 'low') * 2 +
      Number(row.hebrewAdvantage);

    return score(right) - score(left) || left.slugHint.localeCompare(right.slugHint);
  })
  .slice(0, 24);

export const hebrewFirstBacklogRows = converterBacklogRows
  .filter((row) => row.hebrewAdvantage)
  .sort((left, right) => {
    const tierRank = { 'tier-1': 0, 'tier-2': 1, 'tier-3': 2 };
    return (
      tierRank[left.priorityTier] - tierRank[right.priorityTier] ||
      Number(right.monetizationFit === 'high') - Number(left.monetizationFit === 'high') ||
      left.slugHint.localeCompare(right.slugHint)
    );
  })
  .slice(0, 20);

export const backlogQualityRequirements = [
  {
    area: 'Unique examples',
    rule: 'Every new converter must launch with at least two realistic bilingual examples.'
  },
  {
    area: 'Specific FAQ',
    rule: 'Every new converter must include at least two tool-specific FAQ answers plus the shared privacy guidance.'
  },
  {
    area: 'Use cases',
    rule: 'Every new converter must explain who it helps, when to use it, and what makes it different from adjacent tools.'
  },
  {
    area: 'Reverse or related links',
    rule: 'Every new converter should connect to the reverse flow or the next logical step in the workflow.'
  }
] as const;
