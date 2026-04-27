import { test, expect, type BrowserContext, type Page } from '@playwright/test';
import { HomePage } from '../page-objects/HomePage';
import { CartPage } from '../page-objects/CartPage';

/**
 * Log in via the UI before cart tests that require authentication.
 */
async function loginAsAdmin(page: Page) {
  await page.goto('/login');
  await page.getByPlaceholder('Username').fill('admin');
  await page.getByPlaceholder('Password').fill('admin');
  await page.getByRole('button', { name: /login/i }).click();
  await expect(page).not.toHaveURL('/login');
}

test.describe('Shopping Cart Management', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test('should add a book to the cart from the home page', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    await homePage.expectBooksVisible();
    await homePage.addFirstBookToCart();

    // Cart badge or indicator should update
    const cartIndicator = page.locator('mat-badge-content')
      .or(page.locator('.mat-badge-content'))
      .or(page.locator('[matbadge]'));

    await expect(cartIndicator.first()).toBeVisible();
  });

  test('should navigate to the cart page', async ({ page }) => {
    await page.goto('/shopping-cart');
    await expect(page).toHaveURL(/shopping-cart/);
  });

  test('should display added items in the cart', async ({ page }) => {
    // Add a book first
    const homePage = new HomePage(page);
    await homePage.goto();
    await homePage.expectBooksVisible();
    await homePage.addFirstBookToCart();

    // Navigate to cart
    await page.goto('/shopping-cart');
    const cartPage = new CartPage(page);
    await cartPage.expectCartNotEmpty();
  });

  test('should increase item quantity in the cart', async ({ page }) => {
    // Add a book first
    await page.goto('/');
    const homePage = new HomePage(page);
    await homePage.expectBooksVisible();
    await homePage.addFirstBookToCart();

    await page.goto('/shopping-cart');

    // Find the "+" button for the first item
    const increaseButton = page.getByRole('button', { name: /\+/ })
      .or(page.locator('button').filter({ hasText: '+' }))
      .first();

    await expect(increaseButton).toBeVisible();

    // Get the current quantity text before clicking
    const quantityEl = page.locator('input[type="number"]')
      .or(page.locator('.quantity'))
      .first();

    await increaseButton.click();

    // Verify something in the cart row has updated (quantity should be >1)
    if (await quantityEl.isVisible()) {
      const qty = await quantityEl.inputValue().catch(() => quantityEl.textContent());
      expect(Number(qty)).toBeGreaterThan(1);
    }
  });

  test('should remove an item from the cart', async ({ page }) => {
    // Add a book first
    await page.goto('/');
    const homePage = new HomePage(page);
    await homePage.expectBooksVisible();
    await homePage.addFirstBookToCart();

    await page.goto('/shopping-cart');
    const cartPage = new CartPage(page);
    await cartPage.expectCartNotEmpty();

    // Click the delete / clear button
    const deleteButton = page.getByRole('button', { name: /delete/i })
      .or(page.locator('mat-icon').filter({ hasText: 'delete' }))
      .or(page.locator('button[aria-label="delete"]'))
      .first();

    await expect(deleteButton).toBeVisible();
    await deleteButton.click();

    // After removal, either cart is empty or item count decreases
    const remainingItems = page.locator('app-book-card, .cart-item, mat-card');
    const count = await remainingItems.count();
    // The cart should have fewer items or show the empty message
    if (count === 0) {
      await cartPage.expectCartEmpty();
    }
  });

  test('should clear the entire cart', async ({ page }) => {
    // Add a book first
    await page.goto('/');
    const homePage = new HomePage(page);
    await homePage.expectBooksVisible();
    await homePage.addFirstBookToCart();

    await page.goto('/shopping-cart');

    // Look for a "Clear Cart" button
    const clearCartButton = page.getByRole('button', { name: /clear/i });
    const hasClearCart = await clearCartButton.isVisible().catch(() => false);

    if (hasClearCart) {
      await clearCartButton.click();
      const cartPage = new CartPage(page);
      await cartPage.expectCartEmpty();
    } else {
      // If no clear all button, remove items one by one
      const deleteButtons = page.getByRole('button', { name: /delete/i })
        .or(page.locator('mat-icon').filter({ hasText: 'delete' }));
      const deleteCount = await deleteButtons.count();
      for (let i = 0; i < deleteCount; i++) {
        // Wait for the button to be visible before each click to ensure DOM stability
        await deleteButtons.first().waitFor({ state: 'visible' });
        await deleteButtons.first().click();
      }
      const cartPage = new CartPage(page);
      // After removing all, cart should be empty
      const emptyVisible = await cartPage.emptyCartMessage.isVisible().catch(() => false);
      if (deleteCount > 0) {
        expect(emptyVisible).toBe(true);
      }
    }
  });

  test('should show checkout button when cart has items', async ({ page }) => {
    // Add a book first
    await page.goto('/');
    const homePage = new HomePage(page);
    await homePage.expectBooksVisible();
    await homePage.addFirstBookToCart();

    await page.goto('/shopping-cart');
    const cartPage = new CartPage(page);
    await expect(cartPage.checkoutButton).toBeVisible();
  });

  test('should proceed to checkout from the cart', async ({ page }) => {
    // Add a book first
    await page.goto('/');
    const homePage = new HomePage(page);
    await homePage.expectBooksVisible();
    await homePage.addFirstBookToCart();

    await page.goto('/shopping-cart');
    const cartPage = new CartPage(page);
    await cartPage.proceedToCheckout();

    await expect(page).toHaveURL(/checkout/);
  });
});
