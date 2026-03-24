import { test, expect } from '@playwright/test';

test('should load landing page', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await expect(page).toContainText('Hero Section');
});

test('should not contain removed paragraph', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await expect(page).not.toContainText('This is just for11111 testing22');
});

test('should not contain deleted component', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await expect(page).not.toContainText('helllo How are you');
});

test('should log password to console every second', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.waitForTimeout(2000); // wait for 2 seconds to ensure console log is triggered
  const consoleLogs = await page.on('console', (msg) => {
    expect(msg.text()).toContain('PRINTING PASSWORD :ABCD');
  });
});