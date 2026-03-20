import { test, expect } from '@playwright/test';

test('Landing Page Test', async ({ page }) => {
  await page.goto('http://localhost:3000');
  
  // Test if the navigation is visible
  const navigation = page.getByRole('navigation');
  await expect(navigation).toBeVisible();
  
  // Check for any console logs
  const consoleLogs = [];
  page.on('console', (log) => {
    consoleLogs.push(log.text);
  });
  
  // Wait for at least one console log
  await new Promise((resolve) => {
    const intervalId = setInterval(async () => {
      if (consoleLogs.length > 0) {
        clearInterval(intervalId);
        resolve();
      }
    }, 100);
  });
  
  // Verify the console log message
  expect(consoleLogs).toContain('PASSWORD 1234');
});