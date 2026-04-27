import { type Page, type Locator, expect } from '@playwright/test';

export class RegisterPage {
  readonly page: Page;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly maleRadio: Locator;
  readonly femaleRadio: Locator;
  readonly registerButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = page.getByPlaceholder('First Name');
    this.lastNameInput = page.getByPlaceholder('Last Name');
    this.usernameInput = page.getByPlaceholder('Username');
    this.passwordInput = page.getByPlaceholder('Password');
    this.confirmPasswordInput = page.getByPlaceholder('Confirm Password');
    this.maleRadio = page.getByLabel('Male');
    this.femaleRadio = page.getByLabel('Female');
    this.registerButton = page.getByRole('button', { name: /register/i });
  }

  async goto() {
    await this.page.goto('/register');
  }

  async register(userData: {
    firstName: string;
    lastName: string;
    username: string;
    password: string;
    gender?: 'Male' | 'Female';
  }) {
    await this.firstNameInput.fill(userData.firstName);
    await this.lastNameInput.fill(userData.lastName);
    await this.usernameInput.fill(userData.username);
    await this.passwordInput.fill(userData.password);
    await this.confirmPasswordInput.fill(userData.password);
    if (userData.gender === 'Female') {
      await this.femaleRadio.check();
    } else {
      await this.maleRadio.check();
    }
    await this.registerButton.click();
  }

  async expectRegistrationSuccess() {
    // After successful registration, user should be redirected to login or home
    await expect(this.page).not.toHaveURL('/register');
  }
}
