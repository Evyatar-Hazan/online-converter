import { describe, expect, it } from 'vitest';
import { categoryLabels, locales } from '../data/site';
import { getCategoryAudience, getCategorySelectionChecks, getHomeAudienceList, getHomeTrustBlocks } from './page-content';

describe('page content helpers', () => {
  it('keeps home trust content substantial in both locales', () => {
    for (const locale of locales) {
      const blocks = getHomeTrustBlocks(locale);
      const audience = getHomeAudienceList(locale);

      expect(blocks.length).toBe(3);
      expect(audience.length).toBe(3);
      for (const block of blocks) {
        expect(block.title.length).toBeGreaterThan(10);
        expect(block.description.length).toBeGreaterThan(30);
      }
      for (const item of audience) {
        expect(item.length).toBeGreaterThan(20);
      }
    }
  });

  it('provides audience and selection guidance for every category page', () => {
    const categories = Object.keys(categoryLabels) as Array<keyof typeof categoryLabels>;

    for (const category of categories) {
      for (const locale of locales) {
        const audience = getCategoryAudience(category, locale);
        const checks = getCategorySelectionChecks(category, locale);

        expect(audience.length).toBe(3);
        expect(checks.length).toBe(3);
        audience.forEach((item) => expect(item.length).toBeGreaterThan(10));
        checks.forEach((item) => expect(item.length).toBeGreaterThan(20));
      }
    }
  });
});
