import { test, expect, type Page } from '@playwright/test';
import { LoginPage } from '../page-objects/LoginPage';
import { InventoryPage } from '../page-objects/InventoryPage';
import { CartPage } from '../page-objects/CartPage';

const VALID_USER = 'standard_user';
const VALID_PASS = 'secret_sauce';

async function loginAndGoToInventory(page: Page) {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(VALID_USER, VALID_PASS);
  await expect(page).toHaveURL(/inventory/);
}

test.describe('Shopping Cart', () => {
  test.beforeEach(async ({ page }) => {
    await loginAndGoToInventory(page);
  });

  test('should display products on the inventory page', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.expectInventoryVisible();
    const count = await inventoryPage.getItemCount();
    expect(count).toBeGreaterThan(0);
  });

  test('should add an item to the cart and update the badge', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.addItemToCartByIndex(0);

    await expect(inventoryPage.cartBadge).toBeVisible();
    const badgeCount = await inventoryPage.getCartBadgeCount();
    expect(badgeCount).toBe(1);
  });

  test('should update the badge count when multiple items are added', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.addItemToCartByIndex(0);
    await inventoryPage.addItemToCartByIndex(1);

    const badgeCount = await inventoryPage.getCartBadgeCount();
    expect(badgeCount).toBe(2);
  });

  test('should display added items in the cart', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const itemName = await inventoryPage.getItemName(0).textContent();
    await inventoryPage.addItemToCartByIndex(0);

    await inventoryPage.navigateToCart();

    const cartPage = new CartPage(page);
    await cartPage.expectCartNotEmpty();
    if (itemName) {
      await expect(page.getByText(itemName.trim())).toBeVisible();
    }
  });

  test('should remove an item from the inventory page (change button to Add to Cart)', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.addItemToCartByIndex(0);
    await expect(inventoryPage.cartBadge).toBeVisible();

    await inventoryPage.removeItemFromCartByIndex(0);
    await expect(inventoryPage.cartBadge).not.toBeVisible();
  });

  test('should remove an item from the cart page', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.addItemToCartByIndex(0);
    await inventoryPage.navigateToCart();

    const cartPage = new CartPage(page);
    await cartPage.expectCartNotEmpty();
    await cartPage.removeFirstItem();
    await cartPage.expectCartEmpty();
  });

  test('should show checkout button when cart has items', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.addItemToCartByIndex(0);
    await inventoryPage.navigateToCart();

    const cartPage = new CartPage(page);
    await expect(cartPage.checkoutButton).toBeVisible();
  });
});
