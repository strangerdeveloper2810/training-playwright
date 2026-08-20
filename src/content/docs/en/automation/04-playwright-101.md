---
title: "Playwright 101: Setup & Project Structure"
description: What Playwright is, the Browser/Context/Page model, project setup, writing and running your first test, and playwright.config.ts
---

# Playwright 101: Setup & Project Structure

QC Training Documentation - HR Tool

**Version:** 1.0
**Updated:** 2026-08-20
**Author:** QC Team

---

## Table of Contents

1. [What is Playwright?](#1-what-is-playwright)
2. [The Browser → Context → Page model](#2-the-browser--context--page-model)
3. [Test Isolation](#3-test-isolation)
4. [Setting up a project](#4-setting-up-a-project)
5. [Writing your first test](#5-writing-your-first-test)
6. [Running tests](#6-running-tests)
7. [playwright.config.ts](#7-playwrightconfigts)
8. [Playwright vs. other tools](#8-playwright-vs-other-tools)
9. [Practice Exercises](#9-practice-exercises)

---

## 1. What is Playwright?

**Playwright** is Microsoft's open-source automation testing framework, used to test web applications by driving a real browser.

**Standout features:**
- **Cross-browser**: Chromium (Chrome/Edge), Firefox, WebKit (Safari's engine)
- **Cross-platform**: Windows, macOS, Linux
- **Cross-language**: TypeScript/JavaScript, Python, Java, .NET (this documentation uses TypeScript, matching HR Tool's stack)
- **Auto-waiting**: automatically waits for elements to be ready before acting (see [Actions, Interactions & Waiting](../automation/06-actions-interactions-waiting/))
- **Reliable**: far fewer flaky tests than older tools like Selenium

## 2. The Browser → Context → Page model

```
BROWSER (one browser instance)
 ├── CONTEXT 1 (one independent session — its own cookies/localStorage)
 │    ├── PAGE 1 (one tab)
 │    └── PAGE 2 (another tab, same session)
 └── CONTEXT 2 (a separate independent session — doesn't share cookies with Context 1)
      └── PAGE 1
```

| Concept | Description | Real-world example |
|---------|-------------|---------------------|
| **Browser** | One browser instance | One Chrome window |
| **Context** | One independent session (its own cookies/localStorage) | One logged-in user |
| **Page** | One tab within a context | One browser tab |

```typescript
test('every test gets its own page in its own context', async ({ page }) => {
  // page was already created by Playwright inside a fresh context, isolated from every other test
  await page.goto('/login');
});

test('simulate two users at once (e.g. Admin and HR)', async ({ browser }) => {
  const adminContext = await browser.newContext();
  const hrContext = await browser.newContext();
  const adminPage = await adminContext.newPage();
  const hrPage = await hrContext.newPage();
  // Two independent contexts — no shared cookies, accurately simulating two different users
});
```

## 3. Test Isolation

Every Playwright test runs in a **fully separate context**: fresh cookies, fresh localStorage, fresh sessionStorage. That means:

- Tests don't affect each other — test A failing doesn't drag test B down with it.
- Tests can run **in parallel** safely.
- Run order doesn't matter.

:::tip[Why this matters when testing HR Tool]
Because every test has its own session, you **cannot** assume "the previous test already logged in, so this one doesn't need to." Every test (or every test file, if you use `storageState` — see [Authentication & Storage State](../automation/10-authentication-storage-state/)) has to establish whatever starting state it needs.
:::

## 4. Setting up a project

**Requirements:** Node.js 18+ (latest LTS recommended), VS Code, Git.

```bash
mkdir hr-tool-automation && cd hr-tool-automation
npm init playwright@latest

# The CLI will ask you to choose:
# ✔ TypeScript
# ✔ tests folder named "tests"
# ✔ GitHub Actions workflow: Yes
# ✔ Install browsers: Yes
```

**Project structure after setup:**

```
hr-tool-automation/
├── tests/
│   └── example.spec.ts
├── playwright.config.ts
├── package.json
└── .github/workflows/playwright.yml
```

**Recommended VS Code extension:** "Playwright Test for VSCode" (Microsoft) — lets you run/debug individual tests right from the editor.

## 5. Writing your first test

```typescript
// tests/example.spec.ts
import { test, expect } from '@playwright/test';

test('the login page renders correctly', async ({ page }) => {
  await page.goto('/login');
  await expect(page.getByLabel('Email')).toBeVisible();
  await expect(page.getByRole('button', { name: /log in/i })).toBeVisible();
});

// Group related tests with describe
test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login'); // runs before EVERY test in this group
  });

  test('shows an error on wrong password', async ({ page }) => {
    await page.getByLabel('Email').fill('[TEST_EMAIL]');
    await page.getByLabel(/password/i).fill('wrong-password');
    await page.getByRole('button', { name: /log in/i }).click();

    await expect(page.getByText(/incorrect/i)).toBeVisible();
  });
});
```

## 6. Running tests

```bash
npx playwright test                      # run everything, headless
npx playwright test --ui                 # UI Mode — recommended while writing tests
npx playwright test tests/auth/login.spec.ts  # run one specific file
npx playwright test --headed             # run with a visible browser window
npx playwright test --debug              # run in debug mode, step by step
npx playwright show-report               # view the HTML report after a run
```

## 7. playwright.config.ts

The central configuration file for the whole test project:

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,                        // run tests in parallel
  forbidOnly: !!process.env.CI,                // fail CI if test.only was left in
  retries: process.env.CI ? 2 : 0,             // auto-retry on CI
  reporter: [['html'], ['list']],

  use: {
    baseURL: 'https://hr-tool-software.netlify.app', // lets you write page.goto('/login')
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  timeout: 60_000,
  expect: { timeout: 10_000 },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
```

| Field | Meaning |
|-------|---------|
| `testDir` | Folder containing test files |
| `fullyParallel` | Allows multiple tests to run at once, for speed |
| `use.baseURL` | Base URL — lets you write `page.goto('/login')` instead of a full URL |
| `use.trace` | When to record a trace for debugging (see [Debugging](../automation/18-debug-trace-viewer-codegen/)) |
| `projects` | Run the same test suite across multiple browsers/devices |
| `retries` | How many times to auto-retry a failing test (useful for flaky tests on CI) |

## 8. Playwright vs. other tools

| Criterion | Playwright | Cypress | Selenium |
|-----------|------------|---------|----------|
| Multi-browser | Chromium, Firefox, WebKit | Limited WebKit | All (via separate drivers) |
| Auto-waiting | Built in | Built in | Manual waits required |
| Parallel execution | Built in | Needs paid Cloud | Needs Grid setup |
| Multiple tabs/windows | Easy | Hard | Easy |
| Built-in API testing | Yes | Yes | No |
| Speed | Very fast | Fast | Slower |

## 9. Practice Exercises

1. Set up a new Playwright project following section 4, and run the CLI's sample test with `npx playwright test`.
2. Change `baseURL` in `playwright.config.ts` to HR Tool's staging URL, and write a simple test checking that `/login` renders with the right title.
3. In your own words, explain the difference between `Browser`, `Context`, and `Page` — and give an example of when you'd need multiple `Context`s in one test.
4. Run the same test with `--headed` and with `--debug`, and describe the difference you observe.

## Next Step

Continue with [Locators & Selectors](../automation/05-locators-selectors/) — how to tell Playwright exactly which element to act on.

---

**Need help?** Contact your QC Lead or post in #qc-team
