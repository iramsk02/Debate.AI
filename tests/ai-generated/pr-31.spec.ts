```typescript
// File: landingPage.spec.ts
import { test, expect } from '@playwright/test';

test('should render landing page', async ({ page }) => {
  // Navigate to the landing page
  await page.goto('http://localhost:3000');

  // Check if the page title is correct
  await expect(page).toHaveTitle('Landing Page');

  // Check if the page has the correct background color
  await expect(page.locator('body')).toHaveClass('bg-white');

  // Check if the page has the correct text color
  await expect(page.locator('body')).toHaveClass('text-black');
});

test('should log password to console', async ({ page }) => {
  // Navigate to the landing page
  await page.goto('http://localhost:3000');

  // Check if the password is logged to the console
  const consoleLogs = [];
  page.on('console', (msg) => {
    consoleLogs.push(msg.text());
  });

  // Wait for 2 seconds to allow the password to be logged
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Check if the password is logged to the console
  expect(consoleLogs).toContain('PASSWORD 1234');
});
```