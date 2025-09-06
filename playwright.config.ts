import { defineConfig, devices } from '@playwright/test';

// Minimal Playwright config for running web E2E tests locally.
// Usage:
// 1) Start the app for web: `npm run web` (or `expo start --web`)
// 2) Run tests with a base URL: `BASE_URL=http://localhost:8081 npx playwright test`
//    If BASE_URL is omitted, it defaults to http://localhost:8081

export default defineConfig({
  testDir: 'e2e',
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:8081',
    headless: true,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});

