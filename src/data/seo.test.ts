import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { categoryLabels, locales, siteName, siteUrl } from './site';
import { getCategoryMetaDescription, getCategoryPageTitle } from '../lib/category-seo';
import { isEditoriallyReviewedTool } from '../lib/converter-content';
import { getPublicPaths, getSitemapPriority } from '../lib/public-pages';
import { converters } from './converters';

const categoryKeys = Object.keys(categoryLabels);

describe('SEO surfaces', () => {
  it('has unique tool titles and descriptions per locale', () => {
    for (const locale of locales) {
      const titles = converters.map((tool) => `${tool.title[locale]} | ${siteName[locale]}`);
      const descriptions = converters.map((tool) => tool.metaDescription[locale]);

      expect(new Set(titles).size).toBe(titles.length);
      expect(new Set(descriptions).size).toBe(descriptions.length);

      for (const description of descriptions) {
        expect(description.length).toBeGreaterThanOrEqual(locale === 'he' ? 40 : 55);
        expect(description.length).toBeLessThanOrEqual(170);
      }
    }
  });

  it('has unique category titles and descriptions per locale', () => {
    for (const locale of locales) {
      const titles = categoryKeys.map((category) => `${getCategoryPageTitle(category as keyof typeof categoryLabels, locale)} | ${siteName[locale]}`);
      const descriptions = categoryKeys.map((category) => {
        const toolCount = converters.filter((tool) => tool.category === category).length;
        return getCategoryMetaDescription(category as keyof typeof categoryLabels, locale, toolCount);
      });

      expect(new Set(titles).size).toBe(titles.length);
      expect(new Set(descriptions).size).toBe(descriptions.length);

      for (const description of descriptions) {
        expect(description.length).toBeGreaterThanOrEqual(locale === 'he' ? 90 : 110);
        expect(description.length).toBeLessThanOrEqual(180);
      }
    }
  });

  it('only includes editorially reviewed tool pages in the sitemap', () => {
    const urls = getPublicPaths();
    const reviewedToolCount = converters.filter(isEditoriallyReviewedTool).length;

    expect(urls.length).toBe(2 + locales.length * categoryKeys.length + locales.length * reviewedToolCount);
    expect(new Set(urls).size).toBe(urls.length);

    for (const path of urls) {
      expect(`${siteUrl}${path}`).toMatch(/^https:\/\/online-converter\.evyatarhazan\.com\/(en|he)\//);
    }

    expect(urls).not.toContain('/analytics/');
    expect(urls).toContain('/en/json-to-csv/');
    expect(urls).not.toContain('/en/aspect-ratio-calculator/');
  });

  it('assigns stable sitemap priorities by page depth', () => {
    expect(getSitemapPriority('/en/')).toBe('0.9');
    expect(getSitemapPriority('/he/text/')).toBe('0.9');
    expect(getSitemapPriority('/en/json-to-csv/')).toBe('0.8');
    expect(getSitemapPriority('/he/sort-lines/')).toBe('0.8');
  });

  it('keeps robots.txt open for indexing and points to the sitemap', () => {
    const robots = readFileSync(join(process.cwd(), 'public/robots.txt'), 'utf8');

    expect(robots).toContain('User-agent: *');
    expect(robots).toContain('Allow: /');
    expect(robots).not.toMatch(/Disallow:\s*\//);
    expect(robots).toContain(`Sitemap: ${siteUrl}/sitemap.xml`);
  });
});
