import { describe, expect, it } from 'vitest';
import { converters } from '../data/converters';
import { categoryLabels, ui } from '../data/site';
import { getConverterIntro, getConverterMetaDescription, getConverterPageTitle, getConverterStructuredData, getSearchIntent, searchIntents } from './converter-seo';

describe('converter SEO helpers', () => {
  it('assigns a supported search intent to every converter', () => {
    for (const tool of converters) {
      expect(searchIntents).toContain(getSearchIntent(tool));
    }
  });

  it('generates unique localized intro copy for every converter', () => {
    const englishIntros = converters.map((tool) => getConverterIntro(tool, 'en'));
    const hebrewIntros = converters.map((tool) => getConverterIntro(tool, 'he'));

    expect(new Set(englishIntros).size).toBe(converters.length);
    expect(new Set(hebrewIntros).size).toBe(converters.length);

    for (const tool of converters) {
      expect(getConverterIntro(tool, 'en')).toContain(tool.shortTitle.en);
      expect(getConverterIntro(tool, 'he')).toContain(tool.shortTitle.he);
    }
  });

  it('generates CTR-friendly localized titles and descriptions for every converter', () => {
    const englishTitles = converters.map((tool) => getConverterPageTitle(tool, 'en'));
    const hebrewTitles = converters.map((tool) => getConverterPageTitle(tool, 'he'));
    const englishDescriptions = converters.map((tool) => getConverterMetaDescription(tool, 'en'));
    const hebrewDescriptions = converters.map((tool) => getConverterMetaDescription(tool, 'he'));

    expect(new Set(englishTitles).size).toBe(converters.length);
    expect(new Set(hebrewTitles).size).toBe(converters.length);
    expect(new Set(englishDescriptions).size).toBe(converters.length);
    expect(new Set(hebrewDescriptions).size).toBe(converters.length);

    for (const tool of converters) {
      const englishTitle = getConverterPageTitle(tool, 'en');
      const hebrewTitle = getConverterPageTitle(tool, 'he');
      const englishDescription = getConverterMetaDescription(tool, 'en');
      const hebrewDescription = getConverterMetaDescription(tool, 'he');

      expect(englishTitle).toContain(tool.title.en);
      expect(hebrewTitle).toContain(tool.title.he);
      expect(englishTitle.length).toBeGreaterThanOrEqual(28);
      expect(englishTitle.length).toBeLessThanOrEqual(68);
      expect(hebrewTitle.length).toBeGreaterThanOrEqual(28);
      expect(hebrewTitle.length).toBeLessThanOrEqual(68);
      expect(englishDescription.length).toBeGreaterThanOrEqual(100);
      expect(englishDescription.length).toBeLessThanOrEqual(170);
      expect(hebrewDescription.length).toBeGreaterThanOrEqual(80);
      expect(hebrewDescription.length).toBeLessThanOrEqual(170);
      expect(englishDescription.toLowerCase()).toContain('browser');
      expect(englishDescription.toLowerCase()).toContain('no upload');
      expect(hebrewDescription).toContain('דפדפן');
      expect(hebrewDescription).toContain('בלי העלאת מידע');
    }
  });

  it('generates SoftwareApplication, FAQPage and BreadcrumbList structured data for every converter', () => {
    for (const tool of converters) {
      for (const locale of ['en', 'he'] as const) {
        const description = getConverterMetaDescription(tool, locale);
        const contextualFaq = [
          {
            question: {
              en: `What input does ${tool.shortTitle.en} expect?`,
              he: `איזה קלט מתאים ל־${tool.shortTitle.he}?`
            },
            answer: {
              en: `${tool.shortTitle.en} expects input that matches the selected converter flow.`,
              he: `${tool.shortTitle.he} מקבל קלט שמתאים לזרימת ההמרה של הכלי.`
            }
          },
          ...tool.faq
        ];

        const schemas = getConverterStructuredData(tool, locale, description, contextualFaq, ui[locale].home, categoryLabels[tool.category][locale]);
        expect(schemas).toHaveLength(3);

        const software = schemas.find((item) => item['@type'] === 'SoftwareApplication');
        const faqPage = schemas.find((item) => item['@type'] === 'FAQPage');
        const breadcrumbs = schemas.find((item) => item['@type'] === 'BreadcrumbList');

        expect(software).toBeDefined();
        expect(software?.name).toBe(tool.title[locale]);
        expect(software?.operatingSystem).toBe('Web browser');
        expect(software?.applicationCategory).toBe('UtilitiesApplication');
        expect(String(software?.url)).toContain(`/${locale}/${tool.slug}/`);
        expect(software?.description).toBe(description);

        expect(faqPage).toBeDefined();
        if (!faqPage || !Array.isArray(faqPage.mainEntity)) {
          throw new Error(`Missing FAQPage schema for ${tool.slug} (${locale})`);
        }
        expect(faqPage.mainEntity.length).toBe(contextualFaq.length);
        expect(faqPage.mainEntity[0]?.['@type']).toBe('Question');
        expect(faqPage.mainEntity[0]?.acceptedAnswer?.['@type']).toBe('Answer');

        expect(breadcrumbs).toBeDefined();
        if (!breadcrumbs || !Array.isArray(breadcrumbs.itemListElement)) {
          throw new Error(`Missing BreadcrumbList schema for ${tool.slug} (${locale})`);
        }
        expect(breadcrumbs.itemListElement).toHaveLength(3);
        expect(breadcrumbs.itemListElement[0]?.name).toBe(ui[locale].home);
        expect(breadcrumbs.itemListElement[1]?.name).toBe(categoryLabels[tool.category][locale]);
        expect(breadcrumbs.itemListElement[2]?.name).toBe(tool.shortTitle[locale]);
      }
    }
  });
});
