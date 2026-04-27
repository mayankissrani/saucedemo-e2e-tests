import { type Page, type Locator, expect } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;
  readonly emptyCartMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartItems = page.locator('.cart-item').or(page.locator('mat-card').filter({ has: page.locator('.delete') }));
    this.checkoutButton = page.getByRole('button', { name: /checkout/i });
    this.emptyCartMessage = page.getByText(/your shopping cart is empty/i);
  }

  async goto() {
    await this.page.goto('/shopping-cart');
  }

  async getItemCount(): Promise<number> {
    return this.cartItems.count();
  }

  async increaseQuantity(itemIndex = 0) {
    const increaseBtn = this.cartItems.nth(itemIndex)
      .getByRole('button', { name: /\+/ })
      .or(this.page.locator('button').filter({ hasText: '+' }).nth(itemIndex));
    await increaseBtn.click();
  }

  async decreaseQuantity(itemIndex = 0) {
    const decreaseBtn = this.cartItems.nth(itemIndex)
      .getByRole('button', { name: /-/ })
      .or(this.page.locator('button').filter({ hasText: '-' }).nth(itemIndex));
    await decreaseBtn.click();
  }

  async removeItem(itemIndex = 0) {
    const deleteBtn = this.cartItems.nth(itemIndex)
      .getByRole('button', { name: /delete/i })
      .or(this.page.locator('button mat-icon').filter({ hasText: 'delete' }).nth(itemIndex));
    await deleteBtn.click();
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
    await expect(this.page).toHaveURL(/checkout/);
  }

  async expectCartEmpty() {
    await expect(this.emptyCartMessage).toBeVisible();
  }

  async expectCartNotEmpty() {
    await expect(this.checkoutButton).toBeVisible();
  }
}
