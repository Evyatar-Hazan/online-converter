import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { converters } from './converters';
import { categoryLabels, locales, siteName, siteUrl } from './site';

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

  it('can generate sitemap entries for every public page', () => {
    const urls = [
      ...locales.map((locale) => `/${locale}/`),
      ...locales.flatMap((locale) => categoryKeys.map((category) => `/${locale}/${category}/`)),
      ...locales.flatMap((locale) => converters.map((tool) => `/${locale}/${tool.slug}/`))
    ];

    expect(urls.length).toBe(2 + locales.length * categoryKeys.length + locales.length * converters.length);
    expect(new Set(urls).size).toBe(urls.length);

    for (const path of urls) {
      expect(`${siteUrl}${path}`).toMatch(/^https:\/\/online-converter\.evyatarhazan\.com\/(en|he)\//);
    }
  });

  it('keeps robots.txt open for indexing and points to the sitemap', () => {
    const robots = readFileSync(join(process.cwd(), 'public/robots.txt'), 'utf8');

    expect(robots).toContain('User-agent: *');
    expect(robots).toContain('Allow: /');
    expect(robots).not.toMatch(/Disallow:\s*\//);
    expect(robots).toContain(`Sitemap: ${siteUrl}/sitemap.xml`);
  });
});
