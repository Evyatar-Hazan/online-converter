import { converters } from '../data/converters';
import { categoryLabels, locales } from '../data/site';

export function getPublicPaths() {
  const categories = Object.keys(categoryLabels);

  return [
    ...locales.map((locale) => `/${locale}/`),
    ...locales.flatMap((locale) => categories.map((category) => `/${locale}/${category}/`)),
    ...locales.flatMap((locale) => converters.map((tool) => `/${locale}/${tool.slug}/`))
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

  return '0.8';
}
