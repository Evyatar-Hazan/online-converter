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

test('mobile layout keeps the converter usable', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'mobile project only');
  await page.goto('/en/base64-encode/');
  await expect(page.getByLabel('Input')).toBeVisible();
  await expect(page.getByLabel('Output')).toBeVisible();
});
