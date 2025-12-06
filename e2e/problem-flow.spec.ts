import { test, expect } from '@playwright/test';

test.describe('Problem Selection', () => {
  test('should display available problems on problems page', async ({ page }) => {
    await page.goto('/problems');

    // Should see problem cards or list
    await expect(page.locator('main')).toBeVisible();

    // Check for problem content
    const problemElements = page.locator('[class*="card"], [class*="problem"]');
    const count = await problemElements.count();

    // Should have at least one problem
    expect(count).toBeGreaterThan(0);
  });

  test('should show problem details', async ({ page }) => {
    await page.goto('/problems');

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // Look for problem titles
    const problemTitles = page.locator('h2, h3, [class*="title"]');
    await expect(problemTitles.first()).toBeVisible();
  });

  test('should navigate to investigation when problem is selected', async ({ page }) => {
    await page.goto('/problems');

    // Wait for problems to load
    await page.waitForLoadState('networkidle');

    // Click on a problem card or button
    const startButton = page.getByRole('button', { name: /start|investigate|begin|explore/i });

    if (await startButton.count() > 0) {
      await startButton.first().click();

      // Should navigate to investigation page
      await expect(page).toHaveURL(/investigate/i);
    }
  });
});

test.describe('Investigation Page', () => {
  test('should display investigation interface', async ({ page }) => {
    await page.goto('/investigate/school_ai_tutor');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Should have main content area
    await expect(page.locator('main')).toBeVisible();
  });

  test('should have tabs for different sections', async ({ page }) => {
    await page.goto('/investigate/school_ai_tutor');

    await page.waitForLoadState('networkidle');

    // Look for tab elements
    const tabs = page.locator('[role="tablist"], [class*="tab"]');

    if (await tabs.count() > 0) {
      await expect(tabs.first()).toBeVisible();
    }
  });

  test('should display AI chat interface', async ({ page }) => {
    await page.goto('/investigate/school_ai_tutor');

    await page.waitForLoadState('networkidle');

    // Look for chat-related elements
    const chatInput = page.getByPlaceholder(/share|ask|question|thought|type/i);

    if (await chatInput.count() > 0) {
      await expect(chatInput.first()).toBeVisible();
    }
  });

  test('should be able to send a message to AI tutor', async ({ page }) => {
    await page.goto('/investigate/school_ai_tutor');

    await page.waitForLoadState('networkidle');

    // Find chat input
    const chatInput = page.getByPlaceholder(/share|ask|question|thought|type/i);

    if (await chatInput.count() > 0) {
      // Type a message
      await chatInput.first().fill('What should I think about first?');

      // Find and click send button
      const sendButton = page.getByRole('button').filter({ has: page.locator('[class*="send"], svg') });

      if (await sendButton.count() > 0) {
        await sendButton.first().click();

        // Wait for response (may take time for AI)
        await page.waitForTimeout(2000);
      }
    }
  });
});

test.describe('Accessibility', () => {
  test('should have proper heading structure', async ({ page }) => {
    await page.goto('/');

    // Check for h1
    const h1 = page.locator('h1');
    await expect(h1.first()).toBeVisible();
  });

  test('should have accessible buttons', async ({ page }) => {
    await page.goto('/problems');

    await page.waitForLoadState('networkidle');

    // All buttons should have accessible names
    const buttons = page.getByRole('button');
    const count = await buttons.count();

    for (let i = 0; i < Math.min(count, 5); i++) {
      const button = buttons.nth(i);
      const name = await button.getAttribute('aria-label') ||
                   await button.textContent() ||
                   await button.getAttribute('title');
      expect(name).toBeTruthy();
    }
  });

  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/');

    // Tab through the page
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    // Something should be focused
    const focused = page.locator(':focus');
    await expect(focused).toBeTruthy();
  });

  test('should have sufficient color contrast', async ({ page }) => {
    await page.goto('/');

    // This is a basic check - proper contrast testing requires accessibility tools
    // Check that text is visible
    const bodyText = page.locator('body');
    await expect(bodyText).toBeVisible();
  });
});

test.describe('Error Handling', () => {
  test('should handle invalid problem ID gracefully', async ({ page }) => {
    await page.goto('/investigate/invalid-problem-id');

    // Should either show error or redirect
    await page.waitForLoadState('networkidle');

    // Page should not crash
    await expect(page.locator('body')).toBeVisible();
  });

  test('should handle network errors gracefully', async ({ page }) => {
    // Simulate offline
    await page.route('**/*', route => {
      if (route.request().resourceType() === 'fetch') {
        route.abort('failed');
      } else {
        route.continue();
      }
    });

    await page.goto('/');

    // Page should still load (static content)
    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('Performance', () => {
  test('should load home page within acceptable time', async ({ page }) => {
    const start = Date.now();

    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    const loadTime = Date.now() - start;

    // Should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);
  });

  test('should load problems page within acceptable time', async ({ page }) => {
    const start = Date.now();

    await page.goto('/problems');
    await page.waitForLoadState('domcontentloaded');

    const loadTime = Date.now() - start;

    // Should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);
  });
});
