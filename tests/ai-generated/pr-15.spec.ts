```typescript
import { test, expect } from '@playwright/test';

test('landing page loads', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await expect(page.locator('text="Debate.AI"')).toBeVisible();
});

test('debate page loads', async ({ page }) => {
  await page.goto('http://localhost:3000/debate');
  await expect(page.locator('text="Debate.AI"')).toBeVisible();
});

test('debate page input works', async ({ page }) => {
  await page.goto('http://localhost:3000/debate');
  const input = page.locator('input');
  await input.fill('test topic');
  await expect(input).toHaveValue('test topic');
});

test('debate page rounds dropdown works', async ({ page }) => {
  await page.goto('http://localhost:3000/debate');
  const roundsDropdown = page.locator('select');
  await roundsDropdown.selectOption('3');
  await expect(roundsDropdown).toHaveValue('3');
});

test('debate page start button works', async ({ page }) => {
  await page.goto('http://localhost:3000/debate');
  const startButton = page.locator('button', { hasText: 'Start' });
  await startButton.click();
  await expect(page.locator('text="debatter2222333"')).toBeVisible();
});

test('debate page should not crash when topic contains "crash"', async ({ page }) => {
  await page.goto('http://localhost:3000/debate');
  const input = page.locator('input');
  await input.fill('crash topic');
  const startButton = page.locator('button', { hasText: 'Start' });
  await startButton.click();
  await expect(page.locator('text="debatter2222333"')).toBeVisible();
});

test('landing page interval logging', async ({ page }) => {
  await page.goto('http://localhost:3000');
  const consoleLogs = [];
  page.on('console', (log) => consoleLogs.push(log));
  await new Promise((resolve) => setTimeout(resolve, 2000));
  expect(consoleLogs.length).toBeGreaterThan(0);
});

test('debate page interval logging', async ({ page }) => {
  await page.goto('http://localhost:3000/debate');
  const consoleLogs = [];
  page.on('console', (log) => consoleLogs.push(log));
  await new Promise((resolve) => setTimeout(resolve, 2000));
  expect(consoleLogs.length).toBeGreaterThan(0);
});

test('debate page render count', async ({ page }) => {
  await page.goto('http://localhost:3000/debate');
  const renderCount = await page.evaluate(() => {
    return document.querySelector('.render-count');
  });
  expect(renderCount).not.toBeNull();
});
```