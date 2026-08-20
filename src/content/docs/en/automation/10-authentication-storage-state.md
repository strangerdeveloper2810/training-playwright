---
title: Authentication & Storage State
description: How to avoid logging in on every test using storageState, and how to manage multiple login roles
---

# Automation Testing - Authentication & Storage State

QC Training Documentation - HR Tool

## Table of Contents

1. [The problem: logging in on every test is slow](#1-the-problem-logging-in-on-every-test-is-slow)
2. [What is Storage State](#2-what-is-storage-state)
3. [Real example: HR Tool's auth.setup.ts](#3-real-example-hr-tools-authsetupts)
4. [Configuring setup to run before other tests](#4-configuring-setup-to-run-before-other-tests)
5. [Using a saved storageState in a test](#5-using-a-saved-storagestate-in-a-test)
6. [Multi-role: HR Tool's 3 login roles](#6-multi-role-hr-tools-3-login-roles)
7. [What happens when storage state expires](#7-what-happens-when-storage-state-expires)
8. [Practice exercises](#8-practice-exercises)
9. [Next steps](#9-next-steps)

---

## 1. The problem: logging in on every test is slow

If you have 200 test cases and every single one starts with:

```typescript
await page.goto('/login');
await page.getByLabel('Email').fill('...');
await page.getByLabel('Password').fill('...');
await page.getByRole('button', { name: 'Sign in' }).click();
await page.waitForURL('/dashboard');
```

You're paying an extra few seconds × 200 runs just to log in — and if the login page is slow or has a captcha, your whole suite runs painfully long and becomes flaky. Playwright has a solution: **log in once, save the resulting state, reuse it everywhere.**

## 2. What is Storage State

When you log into a web app, the browser stores your logged-in state as **cookies** and **localStorage**. Playwright's `storageState` feature lets you:

1. **Save** the current page's cookies + localStorage to a JSON file.
2. **Load** that JSON file into a fresh browser context — that context is "already logged in" from the very first action, no extra steps needed.

```
[Run once] Real login → save storageState → file .auth/user.json
                                    │
                                    ▼
[Run N times] Other tests → load .auth/user.json → already logged in, jump straight into the test
```

## 3. Real example: HR Tool's auth.setup.ts

HR Tool defines the login flow as its own **setup project** (`apps/e2e/tests/auth/auth.setup.ts`):

```typescript
import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login.page';

const authFile = 'apps/e2e/.auth/user.json';

setup('authenticate', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.loginWithEnv(); // logs in using credentials from environment variables

  await page.waitForTimeout(2000);

  // Wait for a reliable sign that login succeeded
  await expect(page.locator('text=/welcome/i').first()).toBeVisible({
    timeout: 15000,
  });

  // Save cookies + localStorage to a file
  await page.context().storageState({ path: authFile });
});
```

A few important details:

- `test as setup`: this isn't a regular test case, it's a **setup script** — it runs once, before other tests start.
- `loginWithEnv()`: logs in using credentials read from environment variables (`process.env`), never hardcoded in this file.
- `await expect(...).toBeVisible(...)`: waits for a **reliable** sign of a successful login (e.g. a welcome message), rather than trusting only that the URL changed (the URL can change before the page has actually finished loading).
- `page.context().storageState({ path: authFile })`: this is the key line — it saves all of the current context's cookies and localStorage to `apps/e2e/.auth/user.json`.

## 4. Configuring setup to run before other tests

For Playwright to know `auth.setup.ts` must run **first**, `playwright.config.ts` declares it as a dependency between projects:

```typescript
export default defineConfig({
  projects: [
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },
    {
      name: 'chromium',
      use: {
        storageState: 'apps/e2e/.auth/user.json',
      },
      dependencies: ['setup'], // runs after the "setup" project
    },
  ],
});
```

`dependencies: ['setup']` guarantees that every test in the `chromium` project only runs **after** the `setup` project (containing `auth.setup.ts`) has finished and produced the storageState file.

## 5. Using a saved storageState in a test

There are two ways to use a saved storageState:

**Option 1 — declare it as the default for an entire project** (as in section 4, `use: { storageState: '...' }`): every test in that project is automatically "already logged in".

**Option 2 — declare it for a single test file** with `test.use()`:

```typescript
import { test } from '@playwright/test';

test.use({ storageState: 'apps/e2e/.auth/ctv.json' });

test('CTV views the list of referred candidates', async ({ page }) => {
  // Go straight to the page, no need to log in again
  await page.goto('/ctv/candidates');
});
```

## 6. Multi-role: HR Tool's 3 login roles

Because HR Tool has several roles with different permissions, the team created **3 separate setup files**, one per role:

| Setup file | Role | Saved storageState file |
|---|---|---|
| `auth.setup.ts` | Regular user / Admin | `.auth/user.json` |
| `ctv.setup.ts` | CTV (referral partner) | `.auth/ctv.json` |
| `hr-headhunt.setup.ts` | HR at a company in Headhunt mode | `.auth/hr-headhunt.json` |

This way, a test that needs to check a CTV-only feature uses `.auth/ctv.json`, while a test checking an Admin-only feature uses `.auth/user.json` — each test file simply picks the right "role to play", without needing to know that role's login flow in detail.

:::tip[Why separate files per role instead of one shared file?]
With a single shared storageState, you can't test **permission-related** scenarios (e.g. a CTV shouldn't see a "Delete Job" button that only Admins see). Having a storageState per role lets you test permissions accurately, from each user type's actual point of view.
:::

## 7. What happens when storage state expires

Login tokens (JWTs) usually have an expiry (e.g. a 7-day access token, a 30-day refresh token). If you run tests after the storageState has expired, tests fail en masse with "unauthorized" errors or get redirected back to the login page. How teams handle this:

- Re-run the `setup` project (i.e. re-run `auth.setup.ts`) to generate a fresh storageState before every full suite run — this is the most common approach, usually automated in CI.
- Never commit `.auth/*.json` files to git (they're typically added to `.gitignore`) since they contain real, time-limited, sensitive tokens.

## 8. Practice exercises

1. Redraw the diagram from section 2 for a specific case: the CTV role, its setup file name, and its storageState file name.
2. Explain: if you removed the `await expect(page.locator('text=/welcome/i')...).toBeVisible()` line from `auth.setup.ts` and relied only on `waitForTimeout(2000)`, what could go wrong if the server responds slower than 2 seconds?
3. Write the `dependencies` configuration for a new project named `firefox` that also needs to run after `setup`.
4. Why shouldn't `.auth/*.json` files be committed to git? Give two reasons.
5. If a test needs to verify "an unauthenticated user gets redirected to the login page", should that test use a saved storageState? Explain why or why not.

## 9. Next steps

1. Continue with [Data-driven Testing](./11-data-driven-testing/) — how to write one piece of code that runs against many different datasets.
2. Revisit [Fixtures & Test Data](./09-fixtures-test-data/) to refresh how test data is organized per role.

---

**Need help?** Contact your QC Lead or post in #qc-team.
