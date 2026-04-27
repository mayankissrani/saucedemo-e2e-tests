import { test, expect, type Page } from '@playwright/test';
import { LoginPage } from '../page-objects/LoginPage';
import { InventoryPage } from '../page-objects/InventoryPage';
import { CartPage } from '../page-objects/CartPage';
import { CheckoutPage } from '../page-objects/CheckoutPage';

const VALID_USER = 'standard_user';
const VALID_PASS = 'secret_sauce';

const CONTACT_INFO = {
  firstName: 'Jane',
  lastName: 'Doe',
  postalCode: '90210',
};

async function loginAddItemAndGoToCart(page: Page) {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(VALID_USER, VALID_PASS);
  await expect(page).toHaveURL(/inventory/);

  const inventoryPage = new InventoryPage(page);
  await inventoryPage.addItemToCartByIndex(0);
  await inventoryPage.navigateToCart();
  await expect(page).toHaveURL(/cart/);
}

test.describe('Checkout Process', () => {
  test('should proceed from cart to checkout step one', async ({ page }) => {
    await loginAddItemAndGoToCart(page);

    const cartPage = new CartPage(page);
    await cartPage.proceedToCheckout();

    const checkoutPage = new CheckoutPage(page);
    await checkoutPage.expectOnStepOne();
  });

  test('should display the checkout information form on step one', async ({ page }) => {
    await loginAddItemAndGoToCart(page);

    const cartPage = new CartPage(page);
    await cartPage.proceedToCheckout();

    const checkoutPage = new CheckoutPage(page);
    await expect(checkoutPage.firstNameInput).toBeVisible();
    await expect(checkoutPage.lastNameInput).toBeVisible();
    await expect(checkoutPage.postalCodeInput).toBeVisible();
    await expect(checkoutPage.continueButton).toBeVisible();
  });

  test('should show error when continuing without filling contact info', async ({ page }) => {
    await loginAddItemAndGoToCart(page);

    const cartPage = new CartPage(page);
    await cartPage.proceedToCheckout();

    const checkoutPage = new CheckoutPage(page);
    await checkoutPage.continueButton.click();

    await expect(page.locator('[data-test="error"]')).toBeVisible();
  });

  test('should proceed to step two after filling contact info', async ({ page }) => {
    await loginAddItemAndGoToCart(page);

    const cartPage = new CartPage(page);
    await cartPage.proceedToCheckout();

    const checkoutPage = new CheckoutPage(page);
    await checkoutPage.fillContactInfo(CONTACT_INFO);
    await checkoutPage.continueToStepTwo();

    await checkoutPage.expectOnStepTwo();
  });

  test('should display order summary on step two', async ({ page }) => {
    await loginAddItemAndGoToCart(page);

    const cartPage = new CartPage(page);
    await cartPage.proceedToCheckout();

    const checkoutPage = new CheckoutPage(page);
    await checkoutPage.fillContactInfo(CONTACT_INFO);
    await checkoutPage.continueToStepTwo();

    await expect(checkoutPage.summaryTotal).toBeVisible();
    await expect(checkoutPage.finishButton).toBeVisible();
  });

  test('should complete the full checkout flow and show confirmation', async ({ page }) => {
    await loginAddItemAndGoToCart(page);

    const cartPage = new CartPage(page);
    await cartPage.proceedToCheckout();

    const checkoutPage = new CheckoutPage(page);
    await checkoutPage.fillContactInfo(CONTACT_INFO);
    await checkoutPage.continueToStepTwo();
    await checkoutPage.finish();

    await checkoutPage.expectOrderConfirmation();
  });
});
