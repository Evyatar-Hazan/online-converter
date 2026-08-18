import { describe, expect, it } from 'vitest';
import { converters } from './converters';
import { categoryLabels, locales, siteName } from './site';
import { getEditoriallyReviewedTools } from '../lib/converter-content';
import { getCategoryMetaDescription, getCategoryPageTitle } from '../lib/category-seo';
import { getConverterMetaDescription, getConverterPageTitle } from '../lib/converter-seo';
import { getHomeMetaDescription, getHomePageTitle } from '../lib/home-seo';
import { infoPageSlugs, infoPages } from './info-pages';

const categories = Object.keys(categoryLabels) as Array<keyof typeof categoryLabels>;
const reviewedConverters = getEditoriallyReviewedTools(converters);
const disallowedEnglishPhrases = ['best', 'ultimate', 'perfect', 'powerful', 'seamless'];
const disallowedHebrewPhrases = ['הכי טוב', 'מושלם', 'עוצמתי במיוחד', 'ללא מאמץ'];

describe('public page metadata', () => {
  it('keeps unique localized titles and descriptions across all public pages', () => {
    for (const locale of locales) {
      const pageEntries = [
        {
          path: `/${locale}/`,
          title: getHomePageTitle(locale),
          description: getHomeMetaDescription(locale),
          requiresBrowserAndUploadLanguage: true
        },
        ...categories.map((category) => ({
          path: `/${locale}/${category}/`,
          title: getCategoryPageTitle(category, locale),
          description: getCategoryMetaDescription(category, locale, converters.filter((tool) => tool.category === category).length),
          requiresBrowserAndUploadLanguage: true
        })),
        ...reviewedConverters.map((tool) => ({
          path: `/${locale}/${tool.slug}/`,
          title: getConverterPageTitle(tool, locale),
          description: getConverterMetaDescription(tool, locale),
          requiresBrowserAndUploadLanguage: true
        })),
        ...infoPageSlugs.map((slug) => ({
          path: `/${locale}/${slug}/`,
          title: `${infoPages[slug][locale].title} | ${siteName[locale]}`,
          description: infoPages[slug][locale].description,
          requiresBrowserAndUploadLanguage: false
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
        if (locale === 'he' && entry.requiresBrowserAndUploadLanguage !== false) {
          expect(entry.description).toContain('בדפדפן');
          expect(entry.description).toMatch(/בלי העלא(?:ה|ת מידע)/);
          expect(disallowedHebrewPhrases.some((phrase) => entry.description.includes(phrase))).toBe(false);
        } else if (locale === 'en' && entry.requiresBrowserAndUploadLanguage !== false) {
          expect(entry.description.toLowerCase()).toContain('browser');
          expect(entry.description.toLowerCase()).toContain('no upload');
          expect(disallowedEnglishPhrases.some((phrase) => entry.description.toLowerCase().includes(phrase))).toBe(false);
        }
      }
    }
  });
});
