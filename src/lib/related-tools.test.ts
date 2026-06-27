import { describe, expect, it } from 'vitest';
import { converterBySlug, converters } from '../data/converters';
import { getRelatedConverters } from './related-tools';

describe('related tools ranking', () => {
  it('returns up to three distinct related tools for every converter', () => {
    for (const tool of converters) {
      const related = getRelatedConverters(tool, 3);

      expect(related.length).toBeGreaterThan(0);
      expect(related.length).toBeLessThanOrEqual(3);
      expect(new Set(related.map((item) => item.slug)).size).toBe(related.length);
      expect(related.some((item) => item.slug === tool.slug)).toBe(false);
    }
  });

  it('puts the inverse converter inside related tools when a reverse slug exists', () => {
    for (const tool of converters.filter((item) => item.reverseSlug)) {
      const related = getRelatedConverters(tool, 3);

      expect(related.map((item) => item.slug)).toContain(tool.reverseSlug);
    }
  });

  it('keeps strong intent-adjacent recommendations for priority tools', () => {
    expect(getRelatedConverters(converterBySlug.get('json-to-csv')!, 3).map((item) => item.slug)).toContain('csv-to-json');
    expect(getRelatedConverters(converterBySlug.get('base64-decode')!, 3).map((item) => item.slug)).toContain('base64-encode');
    expect(getRelatedConverters(converterBySlug.get('percentage-calculator')!, 3).map((item) => item.slug)).toContain('discount-calculator');
  });
});
