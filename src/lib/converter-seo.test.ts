import { describe, expect, it } from 'vitest';
import { converters } from '../data/converters';
import { getConverterIntro, getSearchIntent, searchIntents } from './converter-seo';

describe('converter SEO helpers', () => {
  it('assigns a supported search intent to every converter', () => {
    for (const tool of converters) {
      expect(searchIntents).toContain(getSearchIntent(tool));
    }
  });

  it('generates unique localized intro copy for every converter', () => {
    const englishIntros = converters.map((tool) => getConverterIntro(tool, 'en'));
    const hebrewIntros = converters.map((tool) => getConverterIntro(tool, 'he'));

    expect(new Set(englishIntros).size).toBe(converters.length);
    expect(new Set(hebrewIntros).size).toBe(converters.length);

    for (const tool of converters) {
      expect(getConverterIntro(tool, 'en')).toContain(tool.shortTitle.en);
      expect(getConverterIntro(tool, 'he')).toContain(tool.shortTitle.he);
    }
  });
});
