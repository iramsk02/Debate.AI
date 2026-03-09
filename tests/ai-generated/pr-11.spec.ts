import { test, expect } from '@playwright/test';

test('Debate page renders correctly', async ({ page }) => {
  await page.goto('http://localhost:3000');

  const debatePageHeader = page.getByRole('heading', { name: 'Debate.AI' });
  await expect(debatePageHeader).toBeVisible();

  const debatterUsername = page.getByText('debatter2222333');
  await expect(debatterUsername).toBeVisible();
});

test('Debate page layout is correct', async ({ page }) => {
  await page.goto('http://localhost:3000');

  const debatePageHeader = page.getByRole('heading', { name: 'Debate.AI' });
  await expect(debatePageHeader).toBeVisible();

  const hiddenElement = page.locator('.hidden');
  await expect(hiddenElement).not.toBeVisible();

  await page.emulateMedia({ media: 'screen' });
  await page.setViewportSize({ width: 768, height: 1024 });
  await expect(hiddenElement).toBeVisible();
});