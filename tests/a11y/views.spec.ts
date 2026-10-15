import { AxeBuilder } from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

// Scan nach WCAG 2.2 A/AA (A11Y-1, -3, -7, -9). Bisher gibt es nur die
// Startseite; weitere Ansichten und Teilzustände aus DESIGN.md kommen mit
// ihren Arbeitspaketen hinzu (docs/work-plan.md).
const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

test('Startseite hat keine axe-Verstöße', async ({ page }) => {
  await page.goto('./');
  const result = await new AxeBuilder({ page }).withTags(TAGS).analyze();
  expect(result.violations).toEqual([]);
});
