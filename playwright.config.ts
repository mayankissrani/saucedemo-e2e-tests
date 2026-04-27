import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  /* Maximum time one test can run */
  timeout: 60_000,
  /* Run tests in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code */
  forbidOnly: !!process.env.CI,
  /* Retry failed tests on CI */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI to avoid resource constraints */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter configuration */
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list'],
  ],
  /* Shared settings for all the projects below */
  use: {
    baseURL: 'https://bookcart.azurewebsites.net',
    /* Collect trace on first retry */
    trace: 'on-first-retry',
    /* Capture screenshot on failure */
    screenshot: 'only-on-failure',
    /* Capture video on first retry */
    video: 'on-first-retry',
  },
  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  /* Output directory for test artifacts */
  outputDir: 'test-results/',
});
