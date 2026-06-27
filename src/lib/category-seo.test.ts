import { describe, expect, it } from 'vitest';
import { converters } from '../data/converters';
import { categoryLabels, locales } from '../data/site';
import { getCategoryMetaDescription, getCategoryPageTitle } from './category-seo';

describe('category SEO helpers', () => {
  it('generates unique localized titles and descriptions for every category', () => {
    const categories = Object.keys(categoryLabels) as Array<keyof typeof categoryLabels>;

    for (const locale of locales) {
      const titles = categories.map((category) => getCategoryPageTitle(category, locale));
      const descriptions = categories.map((category) => {
        const toolCount = converters.filter((tool) => tool.category === category).length;
        return getCategoryMetaDescription(category, locale, toolCount);
      });

      expect(new Set(titles).size).toBe(titles.length);
      expect(new Set(descriptions).size).toBe(descriptions.length);

      for (const title of titles) {
        expect(title.length).toBeGreaterThanOrEqual(24);
        expect(title.length).toBeLessThanOrEqual(68);
      }

      for (const description of descriptions) {
        expect(description.length).toBeGreaterThanOrEqual(locale === 'he' ? 90 : 110);
        expect(description.length).toBeLessThanOrEqual(180);
      }
    }
  });
});
