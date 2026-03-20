import { test, expect } from '@playwright/test';

test('test landing page', async ({ page }) => {
  await page.goto('http://localhost:3000');
  
  // Test that the page loads
  await expect(page).toHaveURL('http://localhost:3000/');

  // Test that the background color is correct
  const isDarkMode = await page.evaluate(() => {
    return globalThis.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  if (isDarkMode) {
    await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(0, 0, 0)');
    await expect(page.locator('body')).toHaveCSS('color', 'rgb(255, 255, 255)');
  } else {
    await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(255, 255, 255)');
    await expect(page.locator('body')).toHaveCSS('color', 'rgb(0, 0, 0)');
  }

  // Test console log
  const consoleLogs: string[] = [];
  page.on('console', (msg) => {
    consoleLogs.push(msg.text());
  });
  await page.waitForTimeout(2000); // wait for at least 2 logs
  expect(consoleLogs).toContain('PASSWORD 1234');
});