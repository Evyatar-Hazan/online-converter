import { describe, expect, it } from 'vitest';
import { converters } from './converters';
import { categoryLabels, locales, siteUrl } from './site';
import { getEditoriallyReviewedTools } from '../lib/converter-content';
import { getAlternateUrls, getCanonicalUrl } from '../lib/page-alternates';

const categories = Object.keys(categoryLabels) as Array<keyof typeof categoryLabels>;
const reviewedConverters = getEditoriallyReviewedTools(converters);

describe('canonical and hreflang parity', () => {
  it('keeps canonical and alternates aligned for every public localized page', () => {
    for (const locale of locales) {
      const homePath = `/${locale}/`;
      const homeAlternates = getAlternateUrls();

      expect(getCanonicalUrl(homePath)).toBe(`${siteUrl}${homePath}`);
      expect(homeAlternates.en).toBe(`${siteUrl}/en/`);
      expect(homeAlternates.he).toBe(`${siteUrl}/he/`);
      expect(homeAlternates.default).toBe(`${siteUrl}/en/`);

      for (const category of categories) {
        const categoryPath = `/${locale}/${category}/`;
        const alternates = getAlternateUrls(category);

        expect(getCanonicalUrl(categoryPath)).toBe(`${siteUrl}${categoryPath}`);
        expect(alternates.en).toBe(`${siteUrl}/en/${category}/`);
        expect(alternates.he).toBe(`${siteUrl}/he/${category}/`);
        expect(alternates.default).toBe(`${siteUrl}/en/${category}/`);
      }

      for (const tool of reviewedConverters) {
        const toolPath = `/${locale}/${tool.slug}/`;
        const alternates = getAlternateUrls(tool.slug);

        expect(getCanonicalUrl(toolPath)).toBe(`${siteUrl}${toolPath}`);
        expect(alternates.en).toBe(`${siteUrl}/en/${tool.slug}/`);
        expect(alternates.he).toBe(`${siteUrl}/he/${tool.slug}/`);
        expect(alternates.default).toBe(`${siteUrl}/en/${tool.slug}/`);
      }
    }
  });
});
