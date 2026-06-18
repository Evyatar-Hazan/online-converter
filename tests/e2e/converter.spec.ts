import { expect, test } from '@playwright/test';

test('English tool page converts JSON to CSV', async ({ page }) => {
  await page.goto('/en/json-to-csv/');
  await expect(page).toHaveTitle(/JSON to CSV Converter/);
  await expect(page.locator('h1')).toContainText('JSON to CSV');
  await page.getByLabel('Input').fill('[{"name":"Avi","city":"Jerusalem"}]');
  await page.getByRole('button', { name: 'Convert' }).click();
  await expect(page.getByLabel('Output')).toHaveValue(/name,city/);
});

test('Hebrew home page supports RTL and search filtering', async ({ page }) => {
  await page.goto('/he/');
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  await page.getByLabel('חיפוש ממירים').fill('Base64');
  await expect(page.locator('[data-tool-card]:visible')).toHaveCount(2);
});

test('Hebrew category page lists matching tools', async ({ page }) => {
  await page.goto('/he/text/');
  await expect(page.locator('h1')).toContainText('כלי טקסט');
  await expect(page.getByText('מה אפשר לעשות כאן')).toBeVisible();
  await expect(page.getByText('האם הכלים עובדים טוב עם עברית?')).toBeVisible();
  await expect(page.locator('[data-tool-card]')).toHaveCount(7);
  await expect(page.getByRole('link', { name: 'פתח ממיר' }).first()).toBeVisible();
});

test('converter page exposes useful options', async ({ page }) => {
  await page.goto('/en/sort-lines/');
  await page.getByLabel('Input').fill('banana\nApple\ncherry');
  await page.getByLabel('Sort order').selectOption('desc');
  await page.getByLabel('Case sensitive').uncheck();
  await page.getByRole('button', { name: 'Convert' }).click();
  await expect(page.getByLabel('Output')).toHaveValue('cherry\nbanana\nApple');
});

test('converter page shows a quick preview', async ({ page }) => {
  await page.goto('/en/rgb-to-hex/');
  await page.getByLabel('Input').fill('rgb(79, 70, 229)');
  await page.getByRole('button', { name: 'Convert' }).click();
  await expect(page.getByLabel('Quick preview')).toContainText('#4f46e5');
});

test('mobile layout keeps the converter usable', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'mobile project only');
  await page.goto('/en/base64-encode/');
  await expect(page.getByLabel('Input')).toBeVisible();
  await expect(page.getByLabel('Output')).toBeVisible();
});
