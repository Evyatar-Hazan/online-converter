import { describe, expect, it } from 'vitest';
import { categoryLabels } from '../data/site';
import { isLaunchReadyFreshTool } from './converter-content';
import { getHomepageHighlightTools, getPriorityHubLinks, priorityHubCategories } from './site-navigation';

describe('site navigation helpers', () => {
  it('keeps the priority hub list stable and unique', () => {
    expect(priorityHubCategories).toEqual(['data', 'text', 'developer', 'calculator', 'color', 'encoding', 'time']);
    expect(new Set(priorityHubCategories).size).toBe(priorityHubCategories.length);
  });

  it('builds localized priority hub links for both locales', () => {
    for (const locale of ['en', 'he'] as const) {
      const links = getPriorityHubLinks(locale);

      expect(links).toHaveLength(priorityHubCategories.length);
      expect(links.map((item) => item.category)).toEqual(priorityHubCategories);

      for (const link of links) {
        expect(link.label).toBe(categoryLabels[link.category][locale]);
        expect(link.href).toBe(`/${locale}/${link.category}/`);
        expect(link.toolCount).toBeGreaterThan(0);
      }
    }
  });

  it('returns homepage highlight buckets from the registry', () => {
    const { popular, fresh } = getHomepageHighlightTools();

    expect(popular.length).toBeGreaterThan(0);
    expect(popular.every((tool) => tool.popular)).toBe(true);
    expect(fresh.length).toBeGreaterThan(0);
    expect(fresh.every((tool) => isLaunchReadyFreshTool(tool) && !tool.popular)).toBe(true);
  });
});
