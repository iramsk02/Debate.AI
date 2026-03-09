import { test, expect } from '@playwright/test';

test('Debate Page contains expected elements', async ({ page }) => {
  await page.goto('http://localhost:3000');
  
  // Verify the DebatePage header is present
  const debateHeader = page.locator('.text-[10px] font-bold tracking-[0.4em] uppercase');
  await expect(debateHeader).toContainText('Debate.AI');
  
  // Verify the debatter username is displayed
  const debatterUsername = page.locator('div >> text="debatter2222333"');
  await expect(debatterUsername).toBeVisible();
});

test('Debate Page layout is correct', async ({ page }) => {
  await page.goto('http://localhost:3000');
  
  // Verify the DebatePage layout is correct on different screen sizes
  await expect(page.locator('.hidden md.flex')).not.toBeVisible();
  await page.emulateMedia({ media: 'screen' });
  await page.setViewportSize({ width: 768, height: 1024 });
  await expect(page.locator('.hidden md.flex')).toBeVisible();
});