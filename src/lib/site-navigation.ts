import { converters } from '../data/converters';
import { categoryLabels } from '../data/site';
import type { ConverterCategory, ConverterTool, Locale } from '../types';

export const priorityHubCategories: ConverterCategory[] = ['data', 'text', 'developer', 'calculator', 'color', 'encoding', 'time'];

export function getPriorityHubLinks(locale: Locale) {
  return priorityHubCategories.map((category) => ({
    category,
    label: categoryLabels[category][locale],
    href: `/${locale}/${category}/`,
    toolCount: converters.filter((tool) => tool.category === category).length
  }));
}

function sortHighlightTools(tools: ConverterTool[]) {
  return [...tools].sort((left, right) => {
    if (Number(Boolean(right.popular)) !== Number(Boolean(left.popular))) {
      return Number(Boolean(right.popular)) - Number(Boolean(left.popular));
    }

    if (Number(Boolean(right.new)) !== Number(Boolean(left.new))) {
      return Number(Boolean(right.new)) - Number(Boolean(left.new));
    }

    return left.slug.localeCompare(right.slug);
  });
}

export function getHomepageHighlightTools(limit = 6) {
  return {
    popular: sortHighlightTools(converters.filter((tool) => tool.popular)).slice(0, limit),
    fresh: sortHighlightTools(converters.filter((tool) => tool.new && !tool.popular)).slice(0, limit)
  };
}
