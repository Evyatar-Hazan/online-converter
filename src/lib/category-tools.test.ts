import { describe, expect, it } from 'vitest';
import { converters } from '../data/converters';
import { getEditoriallyReviewedTools, isLaunchReadyFreshTool } from './converter-content';
import { getCategoryToolBuckets, getPriorityCategoryTools, rankCategoryTools } from './category-tools';

describe('category tool ordering', () => {
  it('sorts popular tools before new tools and standard tools', () => {
    const textTools = converters.filter((tool) => tool.category === 'text');
    const ordered = rankCategoryTools(textTools, 'en');

    const scores = ordered.map((tool) => Number(Boolean(tool.popular)) * 2 + Number(isLaunchReadyFreshTool(tool)));
    expect(scores).toEqual([...scores].sort((left, right) => right - left));
  });

  it('builds non-overlapping highlight buckets for category pages', () => {
    const developerTools = converters.filter((tool) => tool.category === 'developer');
    const buckets = getCategoryToolBuckets(developerTools, 'en');
    const seen = new Set<string>();

    for (const group of [buckets.popular, buckets.fresh, buckets.remaining]) {
      for (const tool of group) {
        expect(seen.has(tool.slug)).toBe(false);
        seen.add(tool.slug);
      }
    }

    expect(seen.size).toBe(getEditoriallyReviewedTools(developerTools).length);
  });

  it('returns top category tools without the current converter when requested', () => {
    const textTools = converters.filter((tool) => tool.category === 'text');
    const priority = getPriorityCategoryTools(textTools, 'en', {
      excludeSlug: 'text-case-converter',
      limit: 4
    });
    const expectedCount = Math.min(
      4,
      getEditoriallyReviewedTools(textTools).filter((tool) => tool.slug !== 'text-case-converter').length
    );

    expect(priority).toHaveLength(expectedCount);
    expect(priority.some((tool) => tool.slug === 'text-case-converter')).toBe(false);
  });
});
