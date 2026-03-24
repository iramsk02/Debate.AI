```typescript
import { test, expect } from '@playwright/test';

test('should render landing page', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await expect(page).toHaveTitle('Landing Page');
  await expect(page.locator('section.relative.h-screen.flex.flex-col.items-center.justify-center.px-6.overflow-hidden')).toBeVisible();
});

test('should not have paragraph with text "This is just for11111 testing22"', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await expect(page.locator('p', { hasText: 'This is just for11111 testing22' })).not.toBeVisible();
});

test('should have console log "PRINTING PASSWORD :ABCD" every second', async ({ page }) => {
  await page.goto('http://localhost:3000');
  const consoleLogs: string[] = [];
  page.on('console', (msg) => {
    consoleLogs.push(msg.text());
  });
  await new Promise((resolve) => setTimeout(resolve, 2000));
  expect(consoleLogs).toContain('PRINTING PASSWORD :ABCD');
});

test('should not have component "anv"', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await expect(page.locator('p', { hasText: 'helllo How are you' })).not.toBeVisible();
});
```