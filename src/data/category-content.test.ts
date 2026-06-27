import { describe, expect, it } from 'vitest';
import { categoryContent, categoryLabels, locales } from './site';

describe('category content', () => {
  it('provides useful bilingual copy for every category page', () => {
    const categories = Object.keys(categoryLabels) as Array<keyof typeof categoryLabels>;

    for (const category of categories) {
      for (const locale of locales) {
        const content = categoryContent[category][locale];
        expect(content.title.length).toBeGreaterThan(8);
        expect(content.description.length).toBeGreaterThan(30);
        expect(content.intro.length).toBeGreaterThan(40);
        expect(content.useCases.length).toBeGreaterThanOrEqual(3);
        expect(content.faq.length).toBeGreaterThanOrEqual(4);

        for (const useCase of content.useCases) {
          expect(useCase.length).toBeGreaterThan(8);
        }

        for (const faq of content.faq) {
          expect(faq.question.length).toBeGreaterThan(8);
          expect(faq.answer.length).toBeGreaterThan(20);
        }
      }
    }
  });
});
