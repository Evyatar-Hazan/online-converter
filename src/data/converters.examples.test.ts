import { describe, expect, it } from 'vitest';
import { converters } from './converters';

const prioritySlugs = [
  'json-to-xml',
  'xml-to-json',
  'json-to-yaml',
  'yaml-to-json',
  'json-minifier',
  'base64-decode',
  'url-decode',
  'html-escape',
  'html-unescape',
  'text-case-converter'
];

const launchReadyFreshSlugs = [
  'timezone-meeting-planner',
  'cron-expression-explainer',
  'date-difference-calculator',
  'text-case-detector',
  'http-header-parser',
  'json-key-counter',
  'csv-duplicate-row-finder',
  'rgb-to-hex-with-alpha',
  'calorie-macro-calculator',
  'mortgage-affordability-calculator'
];

const batchNineSeoSlugs = [
  'keyword-density-checker',
  'hreflang-tag-generator',
  'canonical-tag-checker',
  'robots-meta-tag-generator',
  'open-graph-tag-generator',
  'redirect-mapping-generator',
  'faq-schema-generator',
  'meta-tags-preview',
  'html-headings-outline-extractor'
];

describe('converter examples coverage', () => {
  it('keeps at least two starter examples for priority converters', () => {
    for (const slug of prioritySlugs) {
      const tool = converters.find((item) => item.slug === slug);

      expect(tool, `Missing converter: ${slug}`).toBeDefined();
      expect(tool?.examples.length, `${slug} should have at least two examples`).toBeGreaterThanOrEqual(2);
    }
  });

  it('keeps at least two starter examples for launch-ready fresh tools', () => {
    for (const slug of launchReadyFreshSlugs) {
      const tool = converters.find((item) => item.slug === slug);

      expect(tool, `Missing converter: ${slug}`).toBeDefined();
      expect(tool?.examples.length, `${slug} should have at least two examples`).toBeGreaterThanOrEqual(2);
    }
  });

  it('keeps at least two starter examples for the current Batch 9 SEO tools', () => {
    for (const slug of batchNineSeoSlugs) {
      const tool = converters.find((item) => item.slug === slug);

      expect(tool, `Missing converter: ${slug}`).toBeDefined();
      expect(tool?.examples.length, `${slug} should have at least two examples`).toBeGreaterThanOrEqual(2);
    }
  });
});
