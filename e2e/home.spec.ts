import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('should display the welcome page', async ({ page }) => {
    await page.goto('/');

    // Check for KAITE branding or welcome content
    await expect(page).toHaveTitle(/KAITE|Learner/i);
  });

  test('should have navigation elements', async ({ page }) => {
    await page.goto('/');

    // Check for header/navigation
    const header = page.locator('header');
    await expect(header).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Page should still be usable
    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('Navigation', () => {
  test('should navigate to problems page', async ({ page }) => {
    await page.goto('/');

    // Look for a link or button to problems
    const problemsLink = page.getByRole('link', { name: /problem|start|begin|explore/i });

    if (await problemsLink.count() > 0) {
      await problemsLink.first().click();
      await expect(page).toHaveURL(/problem/i);
    }
  });
});
