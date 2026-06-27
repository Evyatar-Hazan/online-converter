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

describe('converter examples coverage', () => {
  it('keeps at least two starter examples for priority converters', () => {
    for (const slug of prioritySlugs) {
      const tool = converters.find((item) => item.slug === slug);

      expect(tool, `Missing converter: ${slug}`).toBeDefined();
      expect(tool?.examples.length, `${slug} should have at least two examples`).toBeGreaterThanOrEqual(2);
    }
  });
});
