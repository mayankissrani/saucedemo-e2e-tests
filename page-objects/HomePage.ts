import { type Page, type Locator, expect } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly bookCards: Locator;
  readonly cartIcon: Locator;
  readonly cartBadge: Locator;
  readonly loginLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.getByPlaceholder('Search');
    this.bookCards = page.locator('app-book-card');
    this.cartIcon = page.getByRole('link', { name: /shopping_cart/i }).or(
      page.locator('mat-icon').filter({ hasText: 'shopping_cart' })
    );
    this.cartBadge = page.locator('mat-badge-content').or(
      page.locator('.mat-badge-content')
    );
    this.loginLink = page.getByRole('link', { name: /login/i });
  }

  async goto() {
    await this.page.goto('/');
  }

  async search(query: string) {
    await this.searchInput.fill(query);
    await this.searchInput.press('Enter');
  }

  async getBookTitles(): Promise<string[]> {
    const titleElements = this.page.locator('app-book-card mat-card-title');
    await expect(titleElements.first()).toBeVisible();
    return titleElements.allTextContents();
  }

  async addFirstBookToCart() {
    const addToCartButton = this.bookCards.first()
      .getByRole('button', { name: /add to cart/i });
    await addToCartButton.click();
  }

  async navigateToCart() {
    await this.page.getByRole('button', { name: /shopping_cart/i })
      .or(this.page.locator('[routerlink="/shopping-cart"]'))
      .or(this.page.getByRole('link', { name: /cart/i }))
      .first()
      .click();
    await expect(this.page).toHaveURL(/shopping-cart/);
  }

  async expectBooksVisible() {
    await expect(this.bookCards.first()).toBeVisible();
  }

  async clickBookByTitle(title: string) {
    await this.page.getByRole('link', { name: title }).first().click();
  }

  async filterByCategory(category: string) {
    await this.page.getByRole('link', { name: category }).click();
  }
}
