import { describe, expect, it } from 'vitest';
import { converters } from '../data/converters';
import { getToolContentReadiness, getToolUseCases, isLaunchReadyFreshTool } from './converter-content';

describe('converter content quality helpers', () => {
  it('builds three use cases for every converter in both locales', () => {
    for (const tool of converters) {
      const english = getToolUseCases(tool, 'en');
      const hebrew = getToolUseCases(tool, 'he');

      expect(english).toHaveLength(3);
      expect(hebrew).toHaveLength(3);
      expect(english.every((item) => item.length > 20)).toBe(true);
      expect(hebrew.every((item) => item.length > 10)).toBe(true);
    }
  });

  it('only marks fresh tools as launch-ready when they have richer content depth', () => {
    const readyFresh = converters.filter((tool) => isLaunchReadyFreshTool(tool));

    expect(readyFresh.length).toBeGreaterThan(0);

    for (const tool of readyFresh) {
      const readiness = getToolContentReadiness(tool);
      expect(tool.new).toBe(true);
      expect(readiness.launchReady).toBe(true);
      expect(readiness.exampleCount).toBeGreaterThanOrEqual(2);
      expect(readiness.faqCount).toBeGreaterThanOrEqual(4);
      expect(readiness.useCaseCount).toBeGreaterThanOrEqual(3);
    }
  });
});
