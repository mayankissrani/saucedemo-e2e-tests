import { test, expect } from '@playwright/test';
import { LoginPage } from '../page-objects/LoginPage';
import { RegisterPage } from '../page-objects/RegisterPage';

/**
 * Helper: generate a unique username to avoid collisions between test runs.
 */
function uniqueUser(prefix = 'testuser') {
  return `${prefix}_${Date.now()}`;
}

test.describe('Authentication', () => {
  test.describe('Login', () => {
    test('should display the login form', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();

      await expect(loginPage.usernameInput).toBeVisible();
      await expect(loginPage.passwordInput).toBeVisible();
      await expect(loginPage.loginButton).toBeVisible();
    });

    test('should show error on invalid credentials', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login('nonexistent_user_xyz', 'wrongpassword123');

      await expect(loginPage.errorMessage).toBeVisible();
    });

    test('should login successfully with valid credentials', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      // Using the known demo credentials for BookCart
      await loginPage.login('admin', 'admin');

      // After login, should redirect away from /login
      await expect(page).not.toHaveURL('/login');
      // Verify the username or a user-menu indicator is visible
      await expect(page.getByRole('button', { name: /admin/i })
        .or(page.getByText(/admin/i))
        .first()
      ).toBeVisible();
    });

    test('should navigate to register page from login page', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();

      await page.getByRole('link', { name: /register/i }).click();
      await expect(page).toHaveURL(/register/);
    });
  });

  test.describe('Registration', () => {
    test('should display the registration form', async ({ page }) => {
      const registerPage = new RegisterPage(page);
      await registerPage.goto();

      await expect(registerPage.firstNameInput).toBeVisible();
      await expect(registerPage.lastNameInput).toBeVisible();
      await expect(registerPage.usernameInput).toBeVisible();
      await expect(registerPage.passwordInput).toBeVisible();
      await expect(registerPage.confirmPasswordInput).toBeVisible();
      await expect(registerPage.registerButton).toBeVisible();
    });

    test('should register a new user successfully', async ({ page }) => {
      const registerPage = new RegisterPage(page);
      await registerPage.goto();

      const username = uniqueUser();
      await registerPage.register({
        firstName: 'Test',
        lastName: 'User',
        username,
        password: 'Test@1234',
        gender: 'Male',
      });

      await registerPage.expectRegistrationSuccess();
    });

    test('should show validation errors for empty form submission', async ({ page }) => {
      const registerPage = new RegisterPage(page);
      await registerPage.goto();

      await registerPage.registerButton.click();

      // Expect at least one required-field validation message
      const validationError = page.getByText(/required/i)
        .or(page.locator('mat-error').first());
      await expect(validationError).toBeVisible();
    });

    test('should show error when username already exists', async ({ page }) => {
      const registerPage = new RegisterPage(page);
      await registerPage.goto();

      // "admin" is a well-known existing user on the demo site
      await registerPage.register({
        firstName: 'Admin',
        lastName: 'User',
        username: 'admin',
        password: 'Admin@1234',
        gender: 'Male',
      });

      const errorMessage = page.getByText(/already exists/i)
        .or(page.getByText(/username.*taken/i))
        .or(page.locator('mat-error'));
      await expect(errorMessage).toBeVisible();
    });
  });
});
