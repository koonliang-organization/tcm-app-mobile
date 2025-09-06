import { expect, test } from '@playwright/test';

// Basic regression check for the Login page UI/flow on web.
// Assumes the app is running for web and reachable at BASE_URL.
// Example run:
//   BASE_URL=http://localhost:8081 npx playwright test e2e/login.spec.ts

test.describe('Login page', () => {
  test('shows fields, validates input, and handles invalid sign-in', async ({ page }) => {
    // Ensure a clean session before any app scripts run
    await page.addInitScript(() => {
      try {
        window.localStorage?.clear?.();
      } catch {}
    });

    await page.goto('/auth/login');

    // Fields are visible
    const email = page.getByRole('textbox', { name: 'Email' })
    const password = page.getByRole('textbox', { name: 'Password' })
    await expect(email).toBeVisible();
    await expect(password).toBeVisible();

    // Trigger client-side validation
    await email.fill('invalid');
    await password.fill('short');
    await expect(page.getByText(/enter a valid email/i)).toBeVisible();
    await expect(page.getByText(/min 8 characters/i)).toBeVisible();

    // Enter valid-looking credentials but wrong password to force server error
    await email.fill('demo@example.com');
    await password.fill('wrongpass'); // 9 chars

    await page.getByRole('button', { name: /^Sign in$/ }).click();

    // Error message appears and URL stays on login
    await expect(page.getByText(/invalid email or password/i)).toBeVisible();
    await expect(page).toHaveURL(/\/auth\/login/);
  });
});
