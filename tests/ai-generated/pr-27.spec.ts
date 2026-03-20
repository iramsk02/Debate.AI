import { test, expect } from '@playwright/test';

test('Landing Page', async ({ page }) => {
  await page.goto('http://localhost:3000');

  // Verify the page title
  await expect(page).toHaveTitle('Landing Page');

  // Verify the background color and text color
  await expect(page.locator('div.min-h-screen')).toHaveCSS('background-color', 'rgb(255, 255, 255)');
  await expect(page.locator('div.min-h-screen')).toHaveCSS('color', 'rgb(0, 0, 0)');

  // Verify the font family
  await expect(page.locator('div.min-h-screen')).toHaveCSS('font-family', 'sans-serif');

  // Verify the selection background color and text color
  await expect(page.locator('div.min-h-screen')).toHaveCSS('background-color', 'rgb(255, 255, 255)', { property: 'selection-background-color' });
  await expect(page.locator('div.min-h-screen')).toHaveCSS('color', 'rgb(0, 0, 0)', { property: 'selection-color' });

  // Verify the console log
  const consoleLogs = [];
  page.on('console', (msg) => {
    consoleLogs.push(msg.text());
  });
  await page.waitForTimeout(1500); // wait for at least one console log
  expect(consoleLogs).toContain('PASSWORD : QQWERT');
});