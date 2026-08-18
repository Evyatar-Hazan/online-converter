import { converters } from '../data/converters';
import { categoryLabels, locales } from '../data/site';
import { infoPageSlugs } from '../data/info-pages';
import { getEditoriallyReviewedTools } from './converter-content';

export function getPublicPaths() {
  const categories = Object.keys(categoryLabels);

  return [
    ...locales.map((locale) => `/${locale}/`),
    ...locales.flatMap((locale) => categories.map((category) => `/${locale}/${category}/`)),
    ...locales.flatMap((locale) => infoPageSlugs.map((slug) => `/${locale}/${slug}/`)),
    ...locales.flatMap((locale) =>
      getEditoriallyReviewedTools(converters).map((tool) => `/${locale}/${tool.slug}/`)
    )
  ];
}

export function getSitemapPriority(path: string) {
  const segments = path.split('/').filter(Boolean);
  if (segments.length === 1) {
    return '0.9';
  }

  if (segments.length === 2 && segments[1] in categoryLabels) {
    return '0.9';
  }

  if (segments.length === 2 && infoPageSlugs.includes(segments[1] as (typeof infoPageSlugs)[number])) {
    return '0.6';
  }

  return '0.8';
}
