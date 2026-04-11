// @ts-check
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  timeout: 30_000,
  expect: {
    timeout: 10000,
  },
  retries: 2,
  workers: 4,
  // Keep default output and always use a fixed 1000ms pause after each test.
  reporter: [
    [process.env.CI ? 'github' : 'list'],
    ['./tests/pause-reporter.js', { delayMs: 1000 }],
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Collect trace. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    baseURL: process.env.BASE_URL || 'https://www.dla-marbach.de/',
  },

  /* Configure projects for browsers */
  projects: [
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'] },
    },
    /* Mobile bei Bedarf aktivieren
    {
       name: 'mobile',
       use: { ...devices['Pixel 5'] },
    },
    */
  ],
});
