import { describe, expect, it } from 'vitest';
import { converters } from './converters';

describe('converter FAQ coverage', () => {
  it('gives every popular converter specific FAQ beyond the shared generic pair', () => {
    const popularTools = converters.filter((tool) => tool.popular);

    expect(popularTools.length).toBeGreaterThan(0);

    for (const tool of popularTools) {
      expect(tool.faq.length, `${tool.slug} should have specific FAQ entries`).toBeGreaterThan(2);
    }
  });
});
