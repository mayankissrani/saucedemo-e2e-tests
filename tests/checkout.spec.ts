import { test, expect, type Page } from '@playwright/test';
import { CheckoutPage } from '../page-objects/CheckoutPage';

/**
 * Log in and add a book to the cart to prepare for checkout tests.
 */
async function prepareCartForCheckout(page: Page) {
  // Login
  await page.goto('/login');
  await page.getByPlaceholder('Username').fill('admin');
  await page.getByPlaceholder('Password').fill('admin');
  await page.getByRole('button', { name: /login/i }).click();
  await expect(page).not.toHaveURL('/login');

  // Add first available book to cart
  await page.goto('/');
  const bookCards = page.locator('app-book-card');
  await expect(bookCards.first()).toBeVisible();
  const addToCartBtn = bookCards.first().getByRole('button', { name: /add to cart/i });
  await addToCartBtn.click();

  // Navigate to shopping cart
  await page.goto('/shopping-cart');
  await expect(page.getByRole('button', { name: /checkout/i })).toBeVisible();
}

test.describe('Checkout Process', () => {
  test('should reach the checkout page from the cart', async ({ page }) => {
    await prepareCartForCheckout(page);

    await page.getByRole('button', { name: /checkout/i }).click();
    await expect(page).toHaveURL(/checkout/);
  });

  test('should display the checkout form', async ({ page }) => {
    await prepareCartForCheckout(page);
    await page.goto('/checkout');

    const checkoutPage = new CheckoutPage(page);
    await checkoutPage.expectOnCheckoutPage();

    // Checkout page should have a place order button or form elements
    const placeOrderOrFormVisible =
      (await checkoutPage.placeOrderButton.isVisible().catch(() => false)) ||
      (await checkoutPage.addressInput.isVisible().catch(() => false));
    expect(placeOrderOrFormVisible).toBe(true);
  });

  test('should display order summary in checkout', async ({ page }) => {
    await prepareCartForCheckout(page);
    await page.goto('/checkout');

    // Order summary should show a price or total
    const orderTotal = page.getByText(/total/i)
      .or(page.locator('.order-summary'))
      .or(page.locator('mat-card').filter({ hasText: /total/i }));
    await expect(orderTotal.first()).toBeVisible();
  });

  test('should complete checkout by placing an order', async ({ page }) => {
    await prepareCartForCheckout(page);
    await page.getByRole('button', { name: /checkout/i }).click();
    await expect(page).toHaveURL(/checkout/);

    const checkoutPage = new CheckoutPage(page);

    // Fill in shipping details if the form is present
    const isFormPresent = await checkoutPage.addressInput.isVisible().catch(() => false);
    if (isFormPresent) {
      await checkoutPage.fillShippingDetails({
        address: '123 Test Street',
        city: 'Test City',
        state: 'Test State',
        postalCode: '12345',
        country: 'US',
      });
    }

    await checkoutPage.placeOrder();
    await checkoutPage.expectOrderConfirmation();
  });

  test('should visual-test the home page layout', async ({ page }) => {
    await page.goto('/');
    const bookCards = page.locator('app-book-card');
    await expect(bookCards.first()).toBeVisible();

    // Visual regression snapshot of the home page
    await expect(page).toHaveScreenshot('home-page.png', {
      fullPage: false,
      // Allow small pixel differences due to dynamic content
      maxDiffPixelRatio: 0.05,
    });
  });

  test('should visual-test the checkout page layout', async ({ page }) => {
    await prepareCartForCheckout(page);
    await page.goto('/checkout');

    const checkoutPage = new CheckoutPage(page);
    await checkoutPage.expectOnCheckoutPage();

    // Mask dynamic content like prices that might change
    await expect(page).toHaveScreenshot('checkout-page.png', {
      fullPage: false,
      maxDiffPixelRatio: 0.05,
    });
  });
});
