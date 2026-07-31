import { describe, expect, it } from 'vitest';
import { converterBySlug, converters } from '../data/converters';
import { isEditoriallyReviewedTool } from './converter-content';
import { getCategoryRelatedConverters, getInverseConverter, getRelatedConverters, getWorkflowRelatedConverters } from './related-tools';

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
    const reviewedSlugs = new Set(converters.filter(isEditoriallyReviewedTool).map((tool) => tool.slug));
    for (const tool of converters.filter((item) => item.reverseSlug && reviewedSlugs.has(item.reverseSlug))) {
      const related = getRelatedConverters(tool, 3);

      expect(related.map((item) => item.slug)).toContain(tool.reverseSlug);
    }
  });

  it('keeps strong intent-adjacent recommendations for priority tools', () => {
    expect(getRelatedConverters(converterBySlug.get('json-to-csv')!, 3).map((item) => item.slug)).toContain('csv-to-json');
    expect(getRelatedConverters(converterBySlug.get('base64-decode')!, 3).map((item) => item.slug)).toContain('base64-encode');
    expect(getRelatedConverters(converterBySlug.get('percentage-calculator')!, 3).length).toBeGreaterThan(0);
  });

  it('finds inverse tools directly from reverse slugs', () => {
    expect(getInverseConverter(converterBySlug.get('json-to-csv')!)?.slug).toBe('csv-to-json');
    expect(getInverseConverter(converterBySlug.get('word-counter')!)).toBeUndefined();
  });

  it('builds workflow-related recommendations outside the current category', () => {
    const workflow = getWorkflowRelatedConverters(converterBySlug.get('json-to-csv')!, 3);

    expect(workflow.length).toBeGreaterThan(0);
    expect(workflow.some((tool) => tool.slug.includes('json'))).toBe(true);
    expect(workflow.every((tool) => tool.category !== 'data')).toBe(true);
  });

  it('builds category-related recommendations inside the current category', () => {
    const related = getCategoryRelatedConverters(converterBySlug.get('json-to-csv')!, 3);

    expect(related.length).toBeGreaterThan(0);
    expect(related.every((tool) => tool.category === 'data')).toBe(true);
  });
});
