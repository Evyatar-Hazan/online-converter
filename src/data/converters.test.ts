import { describe, expect, it } from 'vitest';
import { converters } from './converters';

describe('converter registry', () => {
  it('has unique slugs and bilingual SEO metadata', () => {
    const slugs = new Set(converters.map((tool) => tool.slug));
    expect(slugs.size).toBe(converters.length);
    expect(converters.length).toBeGreaterThanOrEqual(20);

    for (const tool of converters) {
      expect(tool.title.en).toBeTruthy();
      expect(tool.title.he).toBeTruthy();
      expect(tool.metaDescription.en.length).toBeGreaterThanOrEqual(50);
      expect(tool.metaDescription.he.length).toBeGreaterThan(30);
      expect(tool.examples.length).toBeGreaterThan(0);
      expect(tool.faq.length).toBeGreaterThan(0);
    }
  });

  it('only references existing related and reverse converters', () => {
    const slugs = new Set(converters.map((tool) => tool.slug));

    for (const tool of converters) {
      if (tool.reverseSlug) {
        expect(slugs.has(tool.reverseSlug)).toBe(true);
      }
      for (const related of tool.related) {
        expect(slugs.has(related)).toBe(true);
      }
    }
  });
});
