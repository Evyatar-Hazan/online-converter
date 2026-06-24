import { converters } from './converters';
import { categoryLabels, locales } from './site';

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
