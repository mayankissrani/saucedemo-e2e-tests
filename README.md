# 🧪 SauceDemo E2E Automation Framework

![Playwright](https://img.shields.io/badge/Playwright-45ba4b?style=for-the-badge&logo=Playwright&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)

A robust, scalable end-to-end (E2E) testing framework built for the [SauceDemo (Swag Labs)](https://www.saucedemo.com/) e-commerce application. This project serves as a portfolio piece demonstrating modern Software Quality Assurance (SQA) automation best practices.

## 🎯 Project Highlights

- **Page Object Model (POM):** Clean separation of test logic and page elements for high maintainability and reusability.
- **Zero Flakiness:** Strict adherence to Playwright's web-first assertions and dynamic auto-waiting. **No hardcoded sleeps (`waitForTimeout`) are used.**
- **Cross-Browser Validation:** Configured to run seamlessly across Chromium, Firefox, and WebKit.
- **Continuous Integration (CI):** Fully integrated with GitHub Actions to automatically execute the test suite on every push and pull request.
- **Rich HTML Reporting:** Generates detailed, interactive test reports with screenshots and execution traces for debugging.

## 🧪 Test Scenarios Covered

1. **Authentication:** 
   - Valid login using standard credentials.
   - Error validation for locked-out users.
   - Error validation for invalid/empty credentials.
2. **Inventory & Cart:** 
   - Adding products to the shopping cart.
   - Validating dynamic cart badge updates.
   - Removing items and verifying state changes.
3. **Checkout Flow:** 
   - End-to-end user journey from adding an item to completing the checkout process.
   - Form validation (First Name, Last Name, Postal Code).
   - Order completion verification.

## 🛠️ Tech Stack

- **Test Runner:** [Playwright](https://playwright.dev/)
- **Language:** TypeScript
- **Design Pattern:** Page Object Model (POM)
- **CI/CD:** GitHub Actions

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/mayankissrani/saucedemo-e2e-tests.git
   cd saucedemo-e2e-tests
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Install Playwright browsers:
   ```bash
   npx playwright install --with-deps
   ```

### Running the Tests

**Run all tests in headless mode (default):**
```bash
npx playwright test
```

**Run tests in UI mode (interactive):**
```bash
npx playwright test --ui
```

**Run tests with a visible browser (headed):**
```bash
npx playwright test --headed
```

**View the HTML Test Report:**
```bash
npx playwright show-report
```

## 🔄 CI/CD Pipeline

This project uses **GitHub Actions** for Continuous Integration. The workflow (`.github/workflows/playwright.yml`) is triggered automatically on pushes and pull requests to the `main` branch. 
- It provisions an Ubuntu runner.
- Installs Node.js and dependencies.
- Executes the Playwright test suite.
- Uploads the HTML report as a build artifact for review.