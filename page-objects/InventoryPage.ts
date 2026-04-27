import { type Page, type Locator, expect } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly inventoryList: Locator;
  readonly inventoryItems: Locator;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.inventoryList = page.locator('.inventory_list');
    this.inventoryItems = page.locator('.inventory_item');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.cartLink = page.locator('.shopping_cart_link');
  }

  async goto() {
    await this.page.goto('/inventory.html');
  }

  async expectInventoryVisible() {
    await expect(this.inventoryList).toBeVisible();
  }

  async getItemCount(): Promise<number> {
    return this.inventoryItems.count();
  }

  async addItemToCartByIndex(index = 0) {
    const addButton = this.inventoryItems
      .nth(index)
      .locator('[data-test^="add-to-cart"]');
    await addButton.click();
  }

  async addItemToCartByName(name: string) {
    const item = this.inventoryItems.filter({ hasText: name });
    await item.locator('[data-test^="add-to-cart"]').click();
  }

  async removeItemFromCartByIndex(index = 0) {
    const removeButton = this.inventoryItems
      .nth(index)
      .locator('[data-test^="remove"]');
    await removeButton.click();
  }

  async getCartBadgeCount(): Promise<number> {
    const text = await this.cartBadge.textContent();
    return text ? parseInt(text, 10) : 0;
  }

  async navigateToCart() {
    await this.cartLink.click();
    await expect(this.page).toHaveURL(/cart/);
  }

  getItemName(index = 0): Locator {
    return this.inventoryItems.nth(index).locator('.inventory_item_name');
  }
}
