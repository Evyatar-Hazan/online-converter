import type { ConverterTool, Locale } from '../types';

const scoreTool = (tool: ConverterTool) => Number(Boolean(tool.popular)) * 2 + Number(Boolean(tool.new));

const compareToolTitles = (left: ConverterTool, right: ConverterTool, locale: Locale) =>
  left.shortTitle[locale].localeCompare(right.shortTitle[locale], locale);

export const rankCategoryTools = (tools: ConverterTool[], locale: Locale) =>
  [...tools].sort((left, right) => {
    const scoreDiff = scoreTool(right) - scoreTool(left);

    if (scoreDiff !== 0) {
      return scoreDiff;
    }

    return compareToolTitles(left, right, locale);
  });

export const getCategoryToolBuckets = (tools: ConverterTool[], locale: Locale) => {
  const ordered = rankCategoryTools(tools, locale);
  const popular = ordered.filter((tool) => tool.popular);
  const fresh = ordered.filter((tool) => tool.new && !tool.popular);
  const slugsInHighlights = new Set([...popular, ...fresh].map((tool) => tool.slug));
  const remaining = ordered.filter((tool) => !slugsInHighlights.has(tool.slug));

  return {
    ordered,
    popular,
    fresh,
    remaining
  };
};
