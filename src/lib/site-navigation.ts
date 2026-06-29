import { converters } from '../data/converters';
import { categoryLabels } from '../data/site';
import { isLaunchReadyFreshTool } from './converter-content';
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

    if (Number(isLaunchReadyFreshTool(right)) !== Number(isLaunchReadyFreshTool(left))) {
      return Number(isLaunchReadyFreshTool(right)) - Number(isLaunchReadyFreshTool(left));
    }

    return left.slug.localeCompare(right.slug);
  });
}

export function getHomepageHighlightTools(limit = 6) {
  return {
    popular: sortHighlightTools(converters.filter((tool) => tool.popular)).slice(0, limit),
    fresh: sortHighlightTools(converters.filter((tool) => isLaunchReadyFreshTool(tool) && !tool.popular)).slice(0, limit)
  };
}
