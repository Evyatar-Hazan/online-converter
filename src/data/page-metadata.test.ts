import { describe, expect, it } from 'vitest';
import { converters } from './converters';
import { categoryLabels, locales } from './site';
import { getCategoryMetaDescription, getCategoryPageTitle } from '../lib/category-seo';
import { getConverterMetaDescription, getConverterPageTitle } from '../lib/converter-seo';
import { getHomeMetaDescription, getHomePageTitle } from '../lib/home-seo';

const categories = Object.keys(categoryLabels) as Array<keyof typeof categoryLabels>;

describe('public page metadata', () => {
  it('keeps unique localized titles and descriptions across all public pages', () => {
    for (const locale of locales) {
      const pageEntries = [
        {
          path: `/${locale}/`,
          title: getHomePageTitle(locale),
          description: getHomeMetaDescription(locale)
        },
        ...categories.map((category) => ({
          path: `/${locale}/${category}/`,
          title: getCategoryPageTitle(category, locale),
          description: getCategoryMetaDescription(category, locale, converters.filter((tool) => tool.category === category).length)
        })),
        ...converters.map((tool) => ({
          path: `/${locale}/${tool.slug}/`,
          title: getConverterPageTitle(tool, locale),
          description: getConverterMetaDescription(tool, locale)
        }))
      ];

      const titles = pageEntries.map((entry) => entry.title);
      const descriptions = pageEntries.map((entry) => entry.description);

      expect(new Set(titles).size).toBe(titles.length);
      expect(new Set(descriptions).size).toBe(descriptions.length);

      for (const entry of pageEntries) {
        expect(entry.title.trim().length).toBeGreaterThan(20);
        expect(entry.description.trim().length).toBeGreaterThan(locale === 'he' ? 40 : 55);
        expect(entry.description.trim().length).toBeLessThanOrEqual(180);
        expect(entry.path).toMatch(new RegExp(`^/${locale}/`));
      }
    }
  });
});
