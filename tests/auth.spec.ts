import { test, expect } from '@playwright/test';
import { LoginPage } from '../page-objects/LoginPage';

const VALID_USER = 'standard_user';
const VALID_PASS = 'secret_sauce';

test.describe('Authentication', () => {
  test('should display the login form', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
  });

  test('should log in successfully with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(VALID_USER, VALID_PASS);

    await loginPage.expectLoginSuccess();
  });

  test('should show error for locked-out user', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('locked_out_user', VALID_PASS);

    await loginPage.expectLoginError();
    await expect(loginPage.errorMessage).toContainText('locked out');
  });

  test('should show error for invalid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('invalid_user', 'wrong_password');

    await loginPage.expectLoginError();
    await expect(loginPage.errorMessage).toContainText('Username and password do not match');
  });

  test('should show error when username is missing', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('', VALID_PASS);

    await loginPage.expectLoginError();
    await expect(loginPage.errorMessage).toContainText('Username is required');
  });

  test('should show error when password is missing', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(VALID_USER, '');

    await loginPage.expectLoginError();
    await expect(loginPage.errorMessage).toContainText('Password is required');
  });
});
