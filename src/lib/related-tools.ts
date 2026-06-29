import { converters } from '../data/converters';
import type { ConverterTool } from '../types';
import { isLaunchReadyFreshTool } from './converter-content';
import { getSearchIntent } from './converter-seo';

interface ScoredRelatedTool {
  tool: ConverterTool;
  score: number;
}

function scoreRelatedTool(source: ConverterTool, candidate: ConverterTool) {
  if (source.slug === candidate.slug) {
    return -1;
  }

  let score = 0;

  if (source.reverseSlug && candidate.slug === source.reverseSlug) {
    score += 120;
  }

  if (source.related.includes(candidate.slug)) {
    score += 70;
  }

  if (candidate.related.includes(source.slug)) {
    score += 35;
  }

  if (source.category === candidate.category) {
    score += 28;
  }

  if (getSearchIntent(source) === getSearchIntent(candidate)) {
    score += 26;
  }

  if (source.outputType === candidate.inputType) {
    score += 24;
  }

  if (source.inputType === candidate.outputType) {
    score += 14;
  }

  if (source.inputType === candidate.inputType) {
    score += 10;
  }

  if (source.outputType === candidate.outputType) {
    score += 8;
  }

  if (candidate.popular) {
    score += 8;
  }

  if (isLaunchReadyFreshTool(candidate)) {
    score += 4;
  }

  return score;
}

function rankRelatedTools(source: ConverterTool, predicate?: (candidate: ConverterTool) => boolean) {
  return converters
    .map((tool) => ({ tool, score: scoreRelatedTool(source, tool) }))
    .filter((entry) => entry.score > 0 && (!predicate || predicate(entry.tool)))
    .sort((left, right) => {
      if (right.score !== left.score) return right.score - left.score;
      if (Number(right.tool.popular) !== Number(left.tool.popular)) return Number(right.tool.popular) - Number(left.tool.popular);
      return left.tool.slug.localeCompare(right.tool.slug);
    });
}

function pickRankedTools(source: ConverterTool, limit: number, predicate?: (candidate: ConverterTool) => boolean, exclude = new Set<string>()) {
  const picked: ScoredRelatedTool[] = [];
  const used = new Set<string>(exclude);

  for (const entry of rankRelatedTools(source, predicate)) {
    if (used.has(entry.tool.slug)) continue;
    picked.push(entry);
    used.add(entry.tool.slug);

    if (picked.length === limit) {
      break;
    }
  }

  return picked.map((entry) => entry.tool);
}

export function getInverseConverter(source: ConverterTool) {
  return source.reverseSlug ? converters.find((tool) => tool.slug === source.reverseSlug) : undefined;
}

export function getWorkflowRelatedConverters(source: ConverterTool, limit = 3, exclude = new Set<string>()) {
  const sourceIntent = getSearchIntent(source);
  return pickRankedTools(
    source,
    limit,
    (candidate) =>
      candidate.slug !== source.slug &&
      candidate.category !== source.category &&
      (getSearchIntent(candidate) === sourceIntent ||
        source.outputType === candidate.inputType ||
        source.inputType === candidate.outputType ||
        source.related.includes(candidate.slug) ||
        candidate.related.includes(source.slug)),
    exclude
  );
}

export function getCategoryRelatedConverters(source: ConverterTool, limit = 3, exclude = new Set<string>()) {
  return pickRankedTools(source, limit, (candidate) => candidate.slug !== source.slug && candidate.category === source.category, exclude);
}

export function getRelatedConverters(source: ConverterTool, limit = 3) {
  return pickRankedTools(source, limit);
}
