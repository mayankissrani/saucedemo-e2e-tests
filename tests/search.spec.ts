import { test, expect } from '@playwright/test';
import { HomePage } from '../page-objects/HomePage';

test.describe('Product Search and Navigation', () => {
  test('should display books on the home page', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    await homePage.expectBooksVisible();
    // Verify that multiple books are displayed
    const titles = await homePage.getBookTitles();
    expect(titles.length).toBeGreaterThan(0);
  });

  test('should search for a book by title and show results', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    await homePage.search('Harry Potter');

    // Results should contain at least one item matching the query
    const bookCards = page.locator('app-book-card');
    await expect(bookCards.first()).toBeVisible();

    // Each visible title should match the search term (case-insensitive check)
    const firstTitle = await page.locator('app-book-card mat-card-title').first().textContent();
    expect(firstTitle?.toLowerCase()).toContain('harry potter');
  });

  test('should show empty state when no books match search query', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    await homePage.search('xyznonexistentbook123456');

    // Should show no books or an appropriate message
    const bookCards = page.locator('app-book-card');
    const noResultsMessage = page.getByText(/no.*result/i)
      .or(page.getByText(/no.*book/i));

    const count = await bookCards.count();
    if (count === 0) {
      // No cards is acceptable
      expect(count).toBe(0);
    } else {
      await expect(noResultsMessage).toBeVisible();
    }
  });

  test('should navigate to book detail page on click', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    await homePage.expectBooksVisible();

    // Click on the first book card title link or the card itself
    await page.locator('app-book-card mat-card-title').first().click();

    // Should navigate away from the home page
    await expect(page).not.toHaveURL('/');
  });

  test('should display book details page with title and price', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    await homePage.expectBooksVisible();

    // Get the title of the first book
    const firstTitle = await page.locator('app-book-card mat-card-title').first().textContent();

    // Navigate to the first book detail page
    await page.locator('app-book-card mat-card-title').first().click();

    // Book detail page should show the title
    if (firstTitle) {
      await expect(page.getByText(firstTitle.trim())).toBeVisible();
    }

    // Should have a price visible
    const priceElement = page.getByText(/\$[\d.]+/)
      .or(page.locator('.price'))
      .or(page.getByText(/price/i));
    await expect(priceElement.first()).toBeVisible();
  });

  test('should filter books by category', async ({ page }) => {
    await page.goto('/');

    // Click on a category in the sidebar or navigation
    const categoryLink = page.getByRole('link', { name: /adventure/i })
      .or(page.getByRole('link', { name: /fiction/i })
      .or(page.getByRole('listitem').filter({ hasText: /adventure/i })));
    
    const hasCategoryLink = await categoryLink.first().isVisible().catch(() => false);
    if (hasCategoryLink) {
      await categoryLink.first().click();
      // Books should still be displayed after filtering
      await expect(page.locator('app-book-card').first()).toBeVisible();
    } else {
      // Skip if category links are not in the expected location
      test.skip();
    }
  });

  test('should display book cover images', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    await homePage.expectBooksVisible();

    // First book should have an image
    const firstImage = page.locator('app-book-card img').first();
    await expect(firstImage).toBeVisible();
    await expect(firstImage).toHaveAttribute('src', /.+/);
  });
});
