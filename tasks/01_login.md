# Task 01 — Login Screen

## Objective
Implement an authentication screen that allows users to:
- Sign in with email and password
- Create a new account (sign up)
- Continue anonymously (guest)

## Scope
- New UI screen, routing, basic validation, and wiring to an auth service.
- Works on Web and Native via Expo Router.

## Deliverables
- Route `app/auth/login.tsx` (Expo Router)
- Optional: `app/auth/signup.tsx` or sign‑up inline in the same screen
- Auth service in `src/services/authService.ts`
- Types in `src/types/auth.ts`
- Unit tests for the service and component behavior

## Functional Requirements
- Email/password form
  - Fields: email, password
  - Submit button: “Sign in”
  - Validation:
    - Email must be in a valid format
    - Password minimum 8 chars (configurable)
  - Show error messages inline under fields
  - Loading state disables actions while request is in flight
- Sign up
  - A secondary action that routes to a sign‑up flow or expands inline fields
  - Same validation rules as sign‑in
- Anonymous login
  - “Continue as guest” action that authenticates without credentials
  - Store an in‑memory/secure flag to distinguish guest vs. registered users
- Post‑auth navigation
  - On success, navigate to `/` (home). Replace history so back does not return to login
  - If already authenticated, redirect from `/auth/login` to `/`

## Non‑Functional Requirements
- Accessibility: labels, roles, focus order, keyboard navigation, screen reader hints
- Security: never log passwords; use HTTPS; store tokens via `expo-secure-store`
- Performance: debounce submit to avoid duplicate requests; minimal re‑renders
- Error handling: friendly messages for invalid credentials and network failures

## UI/UX
- Layout
  - Title, email + password inputs, “Show/Hide password” toggle
  - Primary button: “Sign in”
  - Secondary link/button: “Create account”
  - Tertiary: “Continue as guest”
  - Google SSO button: “Sign in with Google” using the official multicolor G mark (PNG)
- Google button spec
  - Asset: `assets/google/google_g.png` (multicolor “G”, transparent, ~18–24 px square)
  - Layout: left‑aligned G icon; centered label text
  - Size: height 44, border radius 8, horizontal padding 12
  - Colors (light): background `#ffffff`, border `#dadce0`, label `#3c4043`
  - Colors (dark): background `#1f1f1f`, border `#3c4043`, label `#e3e3e3`
  - Pressed feedback: light `#f1f3f4`, dark `#2a2a2a`; Android ripple accordingly
  - Disabled: reduce opacity and ignore presses while submitting
  - Accessibility: role=button, label “Sign in with Google”, icon ignores invert colors
- Visual feedback: disabled buttons and spinner while submitting

## Routing (Expo Router)
- File: `app/auth/login.tsx`
- Optional sign‑up: `app/auth/signup.tsx`
- Auth guard: if user is authenticated, redirect to `/`

## Service API
Create `src/services/authService.ts` with the following functions. For now, implement using a simple mock or your real backend API.

```ts
export type AuthUser = {
  id: string;
  email?: string;
  isAnonymous: boolean;
  token: string; // JWT or opaque token
};

export async function loginWithEmailPassword(email: string, password: string): Promise<AuthUser> {}
export async function signUpWithEmailPassword(email: string, password: string): Promise<AuthUser> {}
export async function loginAnonymously(): Promise<AuthUser> {}
export async function signOut(): Promise<void> {}
```

- Persist the token securely (e.g., `expo-secure-store`) and expose helpers to load/save/clear session
- Provide an in‑memory auth context or store to share auth state across screens

## Acceptance Criteria
- User can:
  - Enter email and password and sign in
  - Navigate to sign‑up and create an account
  - Continue as guest without credentials
  - See a Google SSO button with correct styling and pressed/disabled states
- Validation errors show and prevent submission until resolved
- On success, app navigates to `/` and does not return to login on back
- Session persists across app restarts (except for guest if product decides otherwise)
- Basic tests pass:
  - Service functions resolve/reject as expected (mock API)
  - Component renders, validates, disables on submit, and calls the correct service

## Test Plan
- Unit: `jest` + React Native Testing Library
  - Valid/invalid email; short password; submit disabled while loading
  - Calls `loginWithEmailPassword` with correct args
  - Anonymous path triggers `loginAnonymously`
- Integration: mock service to simulate success/failure and assert routing via Expo Router

- E2E (Web): Playwright
  - Setup:
    - Install: `npm i -D @playwright/test && npx playwright install`
    - Start web: `npm run web` (or `expo start --web`)
    - Run: `BASE_URL=http://localhost:8081 npx playwright test e2e/login.spec.ts`
  - Cases:
    - Login page renders at `/auth/login` with Email and Password fields visible.
    - Client validation shows “Enter a valid email” and “Min 8 characters” for bad inputs.
    - Submitting `demo@example.com` + wrong password shows “Invalid email or password” and stays on `/auth/login`.
    - Optional success path: valid credentials (`demo@example.com` / `pass1234`) navigate to `/` and replace history.
    - Optional guest path: “Continue as guest” navigates to `/` without credentials.
  - Notes:
    - Test clears `localStorage` before load to avoid being already authenticated.
    - Selectors use accessible labels/roles to align with a11y best practices.

## Notes & Follow‑ups
- Replace mock service with real API when available
- Add telemetry events: `auth_login_submit`, `auth_signup_submit`, `auth_anonymous_continue`, include result/surface (no PII)
- Confirm product rules for guest persistence and upgrade to full account flow
