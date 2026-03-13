```typescript
// tests/landing-page.spec.ts
import { test, expect } from '@playwright/test';

test('should render landing page', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await expect(page.locator('div.min-h-screen.bg-white.dark:bg-black.text-black.dark:text-white.font-sans.selection:bg-black.selection:text-white.dark:selection:bg-white.dark:selection:text-black')).toBeVisible();
});

test('should not display removed paragraph', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await expect(page.locator('p', { hasText: 'This is just for11111 testing22' })).not.toBeVisible();
});

test('should not display deleted component', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await expect(page.locator('p', { hasText: 'helllo How are you' })).not.toBeVisible();
});

test('should log password to console', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for 2 seconds to allow console logs to appear
  const consoleLogs = await page.on('console', async msg => {
    if (msg.text().includes('PRINTING PASSWORD :ABCD')) {
      return true;
    }
  });
  await expect(consoleLogs).toBe(true);
});
```