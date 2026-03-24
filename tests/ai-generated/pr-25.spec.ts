import { test, expect } from '@playwright/test';

test('Landing Page Test', async ({ page }) => {
  await page.goto('http://localhost:3000');
  
  // Test navigation presence
  await expect(page.getByRole('navigation')).toBeVisible();

  // Test background color and text color
  const body = page.locator('body');
  await expect(body).toHaveClass(/(bg-white|bg-black)/);
  await expect(body).toHaveClass(/(text-black|text-white)/);

  // Test font family
  await expect(body).toHaveAttribute('class', expect.stringContaining('font-sans'));

  // Test selection background and text color
  await page.evaluate(() => {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(document.body);
    selection.addRange(range);
  });
  const selection = page.locator('::selection');
  await expect(selection).toHaveCSS('background-color', expect.stringContaining(/(black|white)/));
  await expect(selection).toHaveCSS('color', expect.stringContaining(/(white|black)/));

  // Test interval log
  const consoleLogs = [];
  page.on('console', (msg) => {
    consoleLogs.push(msg.text());
  });
  await new Promise(resolve => setTimeout(resolve, 2000));
  await expect(consoleLogs).toContain('PASSWORD QWERTY');
});