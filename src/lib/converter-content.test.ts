import { describe, expect, it } from 'vitest';
import { converters } from '../data/converters';
import {
  getToolContentReadiness,
  getToolDecisionChecks,
  getToolJumpLinks,
  getToolPageSignals,
  getToolResultChecklist,
  getToolUseCases,
  getToolWorkflowSummary,
  isLaunchReadyFreshTool
} from './converter-content';

describe('converter content quality helpers', () => {
  it('builds three use cases for every converter in both locales', () => {
    for (const tool of converters) {
      const english = getToolUseCases(tool, 'en');
      const hebrew = getToolUseCases(tool, 'he');

      expect(english).toHaveLength(3);
      expect(hebrew).toHaveLength(3);
      expect(english.every((item: string) => item.length > 20)).toBe(true);
      expect(hebrew.every((item: string) => item.length > 10)).toBe(true);
    }
  });

  it('builds result and trust checklists for every converter in both locales', () => {
    for (const tool of converters) {
      const englishResultChecklist = getToolResultChecklist(tool, 'en');
      const hebrewResultChecklist = getToolResultChecklist(tool, 'he');
      const englishDecisionChecks = getToolDecisionChecks(tool, 'en');
      const hebrewDecisionChecks = getToolDecisionChecks(tool, 'he');

      expect(englishResultChecklist).toHaveLength(3);
      expect(hebrewResultChecklist).toHaveLength(3);
      expect(englishDecisionChecks).toHaveLength(3);
      expect(hebrewDecisionChecks).toHaveLength(3);
      expect(englishResultChecklist.every((item: string) => item.length > 20)).toBe(true);
      expect(hebrewResultChecklist.every((item: string) => item.length > 12)).toBe(true);
      expect(englishDecisionChecks.every((item: string) => item.length > 20)).toBe(true);
      expect(hebrewDecisionChecks.every((item: string) => item.length > 12)).toBe(true);
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

  it('uses intent-specific copy for priority converters instead of only generic phrasing', () => {
    const checks = [
      {
        converterId: 'jsonToCsv',
        locale: 'en' as const,
        getter: getToolUseCases,
        needle: 'spreadsheet-ready rows'
      },
      {
        converterId: 'sortLines',
        locale: 'he' as const,
        getter: getToolUseCases,
        needle: 'מילות מפתח'
      },
      {
        converterId: 'canonicalTagChecker',
        locale: 'en' as const,
        getter: getToolDecisionChecks,
        needle: 'source HTML'
      },
      {
        converterId: 'metaDescriptionLengthChecker',
        locale: 'he' as const,
        getter: getToolResultChecklist,
        needle: 'תוצאות חיפוש'
      }
    ];

    for (const check of checks) {
      const tool = converters.find((item) => item.converterId === check.converterId);

      expect(tool, `${check.converterId} should exist`).toBeTruthy();
      expect(check.getter(tool!, check.locale).join(' ')).toContain(check.needle);
    }
  });

  it('builds useful page signals and jump links for every converter', () => {
    for (const tool of converters) {
      const signals = getToolPageSignals(tool, 'en');
      const jumpLinks = getToolJumpLinks(tool, 'he');
      const workflow = getToolWorkflowSummary(tool, 'en');

      expect(signals).toHaveLength(3);
      expect(signals.every((item) => item.label.length > 2 && item.value.length > 12)).toBe(true);
      expect(jumpLinks.some((item) => item.id === 'converter')).toBe(true);
      expect(jumpLinks.some((item) => item.id === 'related-tools')).toBe(true);
      expect(workflow.length).toBeGreaterThan(40);
    }
  });
});
