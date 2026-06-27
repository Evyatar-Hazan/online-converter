import { describe, expect, it } from 'vitest';
import { converters } from '../data/converters';
import { getCategoryToolBuckets, rankCategoryTools } from './category-tools';

describe('category tool ordering', () => {
  it('sorts popular tools before new tools and standard tools', () => {
    const textTools = converters.filter((tool) => tool.category === 'text');
    const ordered = rankCategoryTools(textTools, 'en');

    const scores = ordered.map((tool) => Number(Boolean(tool.popular)) * 2 + Number(Boolean(tool.new)));
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

    expect(seen.size).toBe(developerTools.length);
  });
});
