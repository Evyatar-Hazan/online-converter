import { expect, test } from '@playwright/test';
import { converters } from '../../src/data/converters';

const categoryCount = 7;
const expectedPublicSeoPages = 2 + categoryCount * 2 + converters.length * 2;

test('English tool page converts JSON to CSV', async ({ page }) => {
  await page.goto('/en/json-to-csv/');
  await expect(page).toHaveTitle(/JSON to CSV Converter/);
  await expect(page.locator('h1')).toContainText('JSON to CSV');
  await page.getByRole('textbox', { name: 'Input' }).fill('[{"name":"Avi","city":"Jerusalem"}]');
  await page.getByRole('button', { name: 'Convert' }).click();
  await expect(page.getByRole('textbox', { name: /Output/ })).toHaveValue(/name,city/);
});

test('Hebrew home page supports RTL and search filtering', async ({ page }) => {
  await page.goto('/he/');
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  await page.getByLabel('חיפוש ממירים').fill('Base64');
  await expect(page.locator('[data-home-tools-grid] [data-tool-card]:visible')).toHaveCount(2);
  await expect(page.getByRole('link', { name: 'Evyatar Hazan' })).toHaveAttribute('href', 'https://evyatarhazan.com/');
});

test('Hebrew category page lists matching tools', async ({ page }) => {
  const textToolCount = converters.filter((tool) => tool.category === 'text').length;

  await page.goto('/he/text/');
  await expect(page.locator('h1')).toContainText('כלי טקסט');
  await expect(page.getByText('מה אפשר לעשות כאן')).toBeVisible();
  await expect(page.getByText('האם הכלים עובדים טוב עם עברית?')).toBeVisible();
  await expect(page.locator('[data-category-tools-grid] [data-tool-card]')).toHaveCount(textToolCount);
  await expect(page.locator('[data-category-tools-grid]').getByRole('link', { name: 'פתח ממיר' }).first()).toBeVisible();
});

test('all English category pages expose tool cards and SEO content', async ({ page }) => {
  const categories = ['data', 'text', 'encoding', 'time', 'developer', 'color', 'calculator'];

  for (const category of categories) {
    await page.goto(`/en/${category}/`);
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', new RegExp(`/en/${category}/$`));
    await expect(page.locator('link[hreflang="he"]')).toHaveAttribute('href', new RegExp(`/he/${category}/$`));
    await expect(page.locator('[data-category-tools-grid] [data-tool-card]').first()).toBeVisible();
    await expect(page.getByText('FAQ').first()).toBeVisible();
  }
});

test('converter page exposes useful options', async ({ page }) => {
  await page.goto('/en/sort-lines/');
  await page.getByRole('textbox', { name: 'Input' }).fill('banana\nApple\ncherry');
  await page.getByLabel('Sort order').selectOption('desc');
  await page.getByLabel('Case sensitive').uncheck();
  await page.getByRole('button', { name: 'Convert' }).click();
  await expect(page.getByRole('textbox', { name: /Output/ })).toHaveValue('cherry\nbanana\nApple');
});

test('converter page shows a quick preview', async ({ page }) => {
  await page.goto('/en/rgb-to-hex/');
  await page.getByRole('textbox', { name: 'Input' }).fill('rgb(79, 70, 229)');
  await page.getByRole('button', { name: 'Convert' }).click();
  await expect(page.getByLabel('Quick preview')).toContainText('#4f46e5');
});

test('converter page can load input and options from a share link', async ({ page }) => {
  const options = encodeURIComponent(JSON.stringify({ direction: 'desc', caseSensitive: false }));
  await page.goto(`/en/sort-lines/?input=banana%0AApple%0Acherry&options=${options}`);
  await expect(page.getByRole('textbox', { name: 'Input' })).toHaveValue('banana\nApple\ncherry');
  await expect(page.getByLabel('Sort order')).toHaveValue('desc');
  await expect(page.getByLabel('Case sensitive')).not.toBeChecked();
  await page.getByRole('button', { name: 'Convert' }).click();
  await expect(page.getByRole('textbox', { name: /Output/ })).toHaveValue('cherry\nbanana\nApple');
});

test('converter page applies new format options', async ({ page }) => {
  await page.goto('/en/rgb-to-hex/');
  await page.getByRole('textbox', { name: 'Input' }).fill('rgb(79, 70, 229)');
  await page.getByLabel('HEX case').selectOption('upper');
  await page.getByLabel('Include #').uncheck();
  await page.getByRole('button', { name: 'Convert' }).click();
  await expect(page.getByRole('textbox', { name: /Output/ })).toHaveValue('4F46E5');
});

test('representative converters work across major categories', async ({ page }) => {
  const cases = [
    { path: '/en/base64-encode/', input: 'hello', output: 'aGVsbG8=' },
    { path: '/en/html-escape/', input: '<strong>Avi</strong>', output: '&lt;strong&gt;Avi&lt;/strong&gt;' },
    { path: '/en/percentage-calculator/', input: '20, 150', output: '20% of 150 = 30' },
    { path: '/en/hex-to-rgb/', input: '#4f46e5', output: 'rgb(79, 70, 229)' },
    { path: '/en/date-to-timestamp/', input: '2026-06-19T00:00:00Z', output: '1781827200' }
  ];

  for (const item of cases) {
    await page.goto(item.path);
    await page.getByRole('textbox', { name: 'Input' }).fill(item.input);
    await page.getByRole('button', { name: 'Convert' }).click();
    await expect(page.getByRole('textbox', { name: /Output/ })).toHaveValue(new RegExp(item.output.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
});

test('invalid input exposes an accessible error state', async ({ page }) => {
  await page.goto('/en/json-to-csv/');
  const input = page.getByRole('textbox', { name: 'Input' });
  await input.fill('{bad json');
  await page.getByRole('button', { name: 'Convert' }).click();

  await expect(input).toHaveAttribute('aria-invalid', 'true');
  await expect(input).toHaveAttribute('aria-errormessage', /error/);
  await expect(page.getByText('Input needs attention')).toBeVisible();
  await expect(page.getByText('Check brackets, quotes, headers and separators.')).toBeVisible();
});

test('primary converter flow has no browser console errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') {
      errors.push(message.text());
    }
  });
  page.on('pageerror', (error) => errors.push(error.message));

  await page.goto('/en/json-to-csv/');
  await page.getByRole('textbox', { name: 'Input' }).fill('[{"name":"Avi","city":"Jerusalem"}]');
  await page.getByRole('button', { name: 'Convert' }).click();
  await expect(page.getByRole('textbox', { name: /Output/ })).toHaveValue(/name,city/);
  expect(errors).toEqual([]);
});

test('tool pages emit privacy-safe analytics events', async ({ page }) => {
  await page.goto('/en/json-to-csv/');
  await expect
    .poll(() => page.evaluate(() => (window as Window & { dataLayer?: Array<Record<string, unknown>> }).dataLayer?.some((event) => event.event === 'view_tool')))
    .toBe(true);

  await page.getByRole('textbox', { name: 'Input' }).fill('[{"name":"Avi","city":"Jerusalem"}]');
  await page.getByRole('button', { name: 'Convert' }).click();
  await expect
    .poll(() =>
      page.evaluate(() =>
        (window as Window & { dataLayer?: Array<Record<string, unknown>> }).dataLayer?.some(
          (event) => event.event === 'convert_tool' && event.tool === 'json-to-csv'
        )
      )
    )
    .toBe(true);

  await expect(page.locator('[data-ad-placement="top"]')).toHaveAttribute('data-ad-real', /true|false/);
});

test('home search and category filters emit analytics without raw query text', async ({ page }) => {
  await page.goto('/en/');
  await page.getByLabel('Search converters').fill('json');
  await expect
    .poll(() =>
      page.evaluate(() =>
        (window as Window & { dataLayer?: Array<Record<string, unknown>> }).dataLayer?.some(
          (event) => event.event === 'search_tools' && event.queryLength === 4 && !('query' in event)
        )
      )
    )
    .toBe(true);

  await page.getByRole('button', { name: 'Calculators' }).click();
  await expect
    .poll(() =>
      page.evaluate(() =>
        (window as Window & { dataLayer?: Array<Record<string, unknown>> }).dataLayer?.some(
          (event) => event.event === 'filter_tools' && event.category === 'calculator'
        )
      )
    )
    .toBe(true);
});

test('analytics dashboard is internal and summarizes tracking readiness', async ({ page }) => {
  await page.goto('/analytics/');
  await expect(page).toHaveTitle(/Analytics Dashboard/);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow');
  await expect(page.locator('h1')).toContainText('Analytics readiness');
  await expect(page.locator('[data-analytics-kpi="public-seo-pages"]')).toContainText('Public SEO pages');
  await expect(page.locator('[data-analytics-kpi="public-seo-pages"] strong')).toHaveText(String(expectedPublicSeoPages));
  await expect(page.getByText('view_tool')).toBeVisible();
  await expect(page.getByText('convert_tool')).toBeVisible();
  await expect(page.getByText('Cloudflare Web Analytics')).toBeVisible();
});

test('mobile layout keeps the converter usable', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'mobile project only');
  await page.goto('/en/base64-encode/');
  await expect(page.getByRole('textbox', { name: 'Input' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: /Output/ })).toBeVisible();
  await expect(page.locator('.tool-jump-nav')).toBeVisible();
  await expect(page.locator('.tool-jump-nav a').first()).toBeVisible();
  await expect(page.getByRole('button', { name: 'Convert' })).toBeVisible();
});

test('mobile sort-lines keeps options and actions readable', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'mobile project only');
  await page.goto('/en/sort-lines/');
  await expect(page.getByLabel('Sort order')).toBeVisible();
  await expect(page.getByLabel('Case sensitive')).toBeVisible();
  await expect(page.getByLabel('Source field actions toolbar').getByRole('button', { name: 'Load sample' })).toBeVisible();
  await expect(page.getByLabel('Source field actions toolbar').getByRole('button', { name: 'Clear' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Copy share link' })).toBeVisible();
});

test('Hebrew tool pages keep RTL chrome while textareas stay content-aware', async ({ page }) => {
  await page.goto('/he/sort-lines/');
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  await expect(page.locator('.tool-jump-nav')).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'קלט' })).toHaveAttribute('dir', 'auto');
  await expect(page.getByRole('textbox', { name: /פלט/ })).toHaveAttribute('dir', 'auto');
});
