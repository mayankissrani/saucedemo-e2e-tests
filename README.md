# BookCart E2E Tests

End-to-end tests for the [BookCart](https://bookcart.azurewebsites.net/) application built with **Playwright** and **TypeScript**.

## Project Structure

```
├── .github/workflows/
│   └── playwright.yml        # CI/CD – runs on every push/PR
├── page-objects/             # Page Object Model classes
│   ├── LoginPage.ts
│   ├── RegisterPage.ts
│   ├── HomePage.ts
│   ├── CartPage.ts
│   └── CheckoutPage.ts
├── tests/
│   ├── auth.spec.ts          # Login and registration
│   ├── search.spec.ts        # Product search and navigation
│   ├── cart.spec.ts          # Shopping cart management
│   ├── checkout.spec.ts      # Checkout + visual regression
│   └── api.spec.ts           # API validation tests
├── playwright.config.ts      # Cross-browser config, HTML reporter
├── tsconfig.json
└── package.json
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) >= 18

### Install dependencies and browsers

```bash
npm install
npx playwright install --with-deps
```

### Run all tests

```bash
npm test
```

### Run a specific browser

```bash
npm run test:chromium
npm run test:firefox
npm run test:webkit
```

### Run API tests only

```bash
npm run test:api
```

### View HTML report

```bash
npm run report
```

## Design Decisions

| Concern | Approach |
|---|---|
| **No fixed waits** | Playwright's built-in auto-waiting + `expect()` web-first assertions |
| **Test isolation** | Each test starts from a fresh browser context |
| **Selectors** | `getByRole`, `getByPlaceholder`, `getByLabel` – no brittle XPath/CSS |
| **Reporting** | Playwright HTML reporter (`playwright-report/`) + CI artifacts |
| **Visual testing** | `expect(page).toHaveScreenshot()` on home and checkout pages |
| **Cross-browser** | Chromium, Firefox, WebKit configured in `playwright.config.ts` |
| **CI/CD** | GitHub Actions workflow triggers on push and pull requests |

## CI/CD

Tests run automatically via [GitHub Actions](.github/workflows/playwright.yml) on every push and pull request. The HTML report is uploaded as a workflow artifact after each run.
