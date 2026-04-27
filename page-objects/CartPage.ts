import { type Page, type Locator, expect } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartItems = page.locator('.cart_item');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
  }

  async goto() {
    await this.page.goto('/cart.html');
  }

  async getItemCount(): Promise<number> {
    return this.cartItems.count();
  }

  async removeItemByName(name: string) {
    const item = this.cartItems.filter({ hasText: name });
    const dataTestAttr = name.toLowerCase().replace(/\s+/g, '-');
    await item.locator(`[data-test="remove-${dataTestAttr}"]`).click();
  }

  async removeFirstItem() {
    const removeButton = this.cartItems.first().locator('[data-test^="remove"]');
    await removeButton.click();
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
    await expect(this.page).toHaveURL(/checkout-step-one/);
  }

  async expectCartEmpty() {
    await expect(this.cartItems).toHaveCount(0);
  }

  async expectCartNotEmpty() {
    await expect(this.cartItems.first()).toBeVisible();
  }

  getItemName(index = 0): Locator {
    return this.cartItems.nth(index).locator('.inventory_item_name');
  }
}
