import { test, expect } from '@playwright/test';

test('Landing Page Test', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await expect(page).toHaveTitle(/Landing Page/);
  await expect(page.locator('div.min-h-screen')).toBeVisible();
  await expect(page.locator('div.min-h-screen')).toHaveClass(/bg-white|bg-black/);
  await expect(page.locator('div.min-h-screen')).toHaveClass(/text-black|text-white/);
});

test('Console Log Test', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.waitForTimeout(2000); // wait for 2 seconds to allow console logs to appear
  const consoleLogs = await page.evaluate(() => {
    return window.console.log.calls;
  });
  expect(consoleLogs.length).toBeGreaterThan(0);
  consoleLogs.forEach((log) => {
    expect(log.args[0]).toContain('PASSWORD 1234');
  });
});

test('No Interactive Elements Test', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await expect(page.locator('button')).not.toBeVisible();
  await expect(page.locator('input')).not.toBeVisible();
});