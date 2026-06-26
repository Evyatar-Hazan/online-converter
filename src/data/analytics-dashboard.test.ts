import { describe, expect, it } from 'vitest';
import {
  analyticsSummary,
  indexingChecklistSteps,
  indexingChecklistSummary,
  rankingMonitorRows,
  rankingMonitorSummary,
  searchConsoleBaseline
} from './analytics-dashboard';
import { converters } from './converters';

describe('analytics dashboard ranking monitor', () => {
  it('tracks every converter with bilingual ranking fields', () => {
    expect(rankingMonitorRows).toHaveLength(converters.length);
    expect(rankingMonitorSummary.trackedConverters).toBe(converters.length);
    expect(rankingMonitorSummary.trackedLocalizedPages).toBe(converters.length * 2);

    for (const row of rankingMonitorRows) {
      expect(row.englishUrl).toBe(`/en/${row.slug}/`);
      expect(row.hebrewUrl).toBe(`/he/${row.slug}/`);
      expect(row.targetEnglishQuery.length).toBeGreaterThan(2);
      expect(row.targetHebrewQuery.length).toBeGreaterThan(2);
      expect(row.indexed).toBe('pending');
    }
  });

  it('keeps the current Search Console baseline explicit', () => {
    expect(searchConsoleBaseline.clicks).toBe(0);
    expect(searchConsoleBaseline.impressions).toBe(1);
    expect(searchConsoleBaseline.averagePosition).toBe(3);
    expect(searchConsoleBaseline.onlyVisiblePage).toBe('https://online-converter.evyatarhazan.com/');
  });

  it('keeps SEO page totals aligned with the ranking monitor', () => {
    expect(analyticsSummary.localizedToolPages).toBe(rankingMonitorSummary.trackedLocalizedPages);
    expect(analyticsSummary.totalConverters).toBe(rankingMonitorSummary.trackedConverters);
  });

  it('keeps the weekly indexing checklist aligned with the public SEO surface', () => {
    expect(indexingChecklistSummary.cadence).toBe('Weekly');
    expect(indexingChecklistSummary.sitemapUrls).toBe(analyticsSummary.publicSeoPages);
    expect(indexingChecklistSummary.priorityQueue).toBe(20);
    expect(indexingChecklistSteps).toHaveLength(7);
    expect(indexingChecklistSteps.some((step) => step.status === 'automated')).toBe(true);
    expect(indexingChecklistSteps.some((step) => step.label === 'Inspect top 20 converters')).toBe(true);
  });
});
