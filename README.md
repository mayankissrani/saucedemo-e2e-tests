# SauceDemo E2E Test Suite

A professional, interview-ready end-to-end (E2E) automation framework targeting the **[SauceDemo (Swag Labs)](https://www.saucedemo.com/)** application — the industry-standard demo site for QA automation portfolios.

Built with **Playwright** and **TypeScript** using the **Page Object Model (POM)** design pattern.

---

## Tech Stack

| Technology | Purpose |
|---|---|
| [Playwright](https://playwright.dev/) | Cross-browser E2E automation framework |
| [TypeScript](https://www.typescriptlang.org/) | Type-safe test authoring |
| Page Object Model | Maintainable, reusable test architecture |
| GitHub Actions | CI/CD — tests run on every push and PR |

---

## Project Structure

```
├── .github/workflows/
│   └── playwright.yml        # CI/CD pipeline
├── page-objects/             # Page Object Model classes
│   ├── LoginPage.ts          # Login page locators and actions
│   ├── InventoryPage.ts      # Product inventory page
│   ├── CartPage.ts           # Shopping cart page
│   └── CheckoutPage.ts       # Multi-step checkout flow
├── tests/
│   ├── auth.spec.ts          # Login & authentication scenarios
│   ├── cart.spec.ts          # Cart management scenarios
│   └── checkout.spec.ts      # End-to-end checkout flow
├── playwright.config.ts      # Cross-browser config, reporters, timeouts
├── tsconfig.json
└── package.json
```

---

## Test Scenarios Covered

### `auth.spec.ts` — Authentication
- ✅ Login form is displayed
- ✅ Successful login with `standard_user`
- ✅ Locked-out user sees an appropriate error
- ✅ Invalid credentials show an error
- ✅ Missing username/password show field-level errors

### `cart.spec.ts` — Shopping Cart Management
- ✅ Inventory page displays products
- ✅ Adding an item updates the cart badge
- ✅ Badge count reflects multiple items added
- ✅ Cart page displays the correct item name
- ✅ Remove button on inventory page resets badge
- ✅ Remove button on cart page empties the cart
- ✅ Checkout button is visible when cart has items

### `checkout.spec.ts` — Checkout Flow
- ✅ Cart proceeds to checkout step one
- ✅ Step one displays the contact information form
- ✅ Continuing without info shows a validation error
- ✅ Valid info progresses to the order summary (step two)
- ✅ Step two displays the order total and finish button
- ✅ **Full E2E flow**: login → add item → cart → info → summary → "Thank you for your order!"

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) >= 18

### 1. Install dependencies

```bash
npm install
```

### 2. Install Playwright browsers

```bash
npx playwright install --with-deps
```

### 3. Run the full test suite

```bash
npm test
```

### 4. Run with the interactive Playwright UI

```bash
npm run test:ui
```

### 5. Run in headed mode (watch the browser)

```bash
npm run test:headed
```

### 6. Run against a specific browser

```bash
npm run test:chromium
npm run test:firefox
npm run test:webkit
```

### 7. View the HTML report

```bash
npm run report
```

---

## Design Principles

| Concern | Approach |
|---|---|
| **No fixed waits** | Playwright's built-in auto-waiting and `expect()` web-first assertions |
| **Test isolation** | Each test starts from a fresh browser context — no shared state |
| **Reliable locators** | `[data-test="*"]` attributes — the most stable selector strategy |
| **Maintainability** | Page Object Model separates test logic from page interactions |
| **Reporting** | Playwright HTML reporter with screenshot and trace on failure |
| **Cross-browser** | Chromium, Firefox, and WebKit in `playwright.config.ts` |
| **CI/CD** | GitHub Actions workflow on every push and pull request |

---

## CI/CD

Tests run automatically via [GitHub Actions](.github/workflows/playwright.yml) on every push and pull request. The HTML report and test artifacts are uploaded after each run and retained for 30 days.

