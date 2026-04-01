import { test, expect } from '@playwright/test';

test('scanner page loads', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/./);
});