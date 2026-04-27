import { type Page, type Locator, expect } from '@playwright/test';

export class CheckoutPage {
  readonly page: Page;
  readonly addressInput: Locator;
  readonly cityInput: Locator;
  readonly stateInput: Locator;
  readonly postalCodeInput: Locator;
  readonly countryInput: Locator;
  readonly placeOrderButton: Locator;
  readonly orderConfirmationMessage: Locator;
  readonly orderSummary: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addressInput = page.getByLabel(/address/i).or(page.getByPlaceholder(/address/i));
    this.cityInput = page.getByLabel(/city/i).or(page.getByPlaceholder(/city/i));
    this.stateInput = page.getByLabel(/state/i).or(page.getByPlaceholder(/state/i));
    this.postalCodeInput = page.getByLabel(/postal|zip/i).or(page.getByPlaceholder(/postal|zip/i));
    this.countryInput = page.getByLabel(/country/i).or(page.getByPlaceholder(/country/i));
    this.placeOrderButton = page.getByRole('button', { name: /place order/i });
    this.orderConfirmationMessage = page.getByText(/order placed/i)
      .or(page.getByText(/successfully/i))
      .or(page.getByText(/thank you/i));
    this.orderSummary = page.locator('.order-summary').or(page.locator('mat-card').filter({ hasText: /order/i }));
  }

  async goto() {
    await this.page.goto('/checkout');
  }

  async fillShippingDetails(details: {
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  }) {
    await this.addressInput.fill(details.address);
    await this.cityInput.fill(details.city);
    await this.stateInput.fill(details.state);
    await this.postalCodeInput.fill(details.postalCode);
    await this.countryInput.fill(details.country);
  }

  async placeOrder() {
    await this.placeOrderButton.click();
  }

  async expectOrderConfirmation() {
    await expect(this.orderConfirmationMessage).toBeVisible();
  }

  async expectOnCheckoutPage() {
    await expect(this.page).toHaveURL(/checkout/);
  }
}
