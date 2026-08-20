---
title: Best Practices & Cheatsheet
description: A rundown of good automation testing habits, a Playwright quick-reference, and a checklist to self-review before opening a Pull Request
---

# Best Practices & Cheatsheet

QC Training Documentation - HR Tool

This is a wrap-up lesson — use it as a quick reference while writing tests, and to self-check the quality of your test code before opening a Pull Request.

## Table of Contents

1. [Best practices for writing automation tests](#1-best-practices-for-writing-automation-tests)
2. [Cheatsheet: Locators](#2-cheatsheet-locators)
3. [Cheatsheet: Actions](#3-cheatsheet-actions)
4. [Cheatsheet: Assertions](#4-cheatsheet-assertions)
5. [Cheatsheet: Waits](#5-cheatsheet-waits)
6. [Cheatsheet: Test Structure & Commands](#6-cheatsheet-test-structure--commands)
7. [Pre-PR self-review checklist](#7-pre-pr-self-review-checklist)
8. [Further reading](#8-further-reading)

## 1. Best practices for writing automation tests

- **Tests must be independent of run order.** Each test should create the data it needs itself, never assuming a previous test ran and left some state behind. If you run that one test in isolation, it must still pass.
- **Avoid hardcoded waits (`waitForTimeout`).** Use a self-waiting assertion (`expect(...).toBeVisible()`) or `waitForLoadState`/`waitForResponse` — wait for the actual condition instead of an arbitrary fixed duration (both slower and less reliable).
- **Prefer role/label-based locators**, and only reach for `data-testid` when there's genuinely no better way to target an element (see [Locators & Selectors](./05-locators-selectors/)).
- **Give tests meaningful names** that describe the behavior under test — `'shows an error when the email format is invalid'` is better than `'test 3'`.
- **Don't put assertions inside a Page Object** — a Page Object should only hold actions/getters; `expect(...)` belongs in the test file (see [Page Object Model](./08-page-object-model/)).
- **Review test code as seriously as you'd review product code.** Tests are code too — they deserve the same conventions, readability, and maintainability, not a "just make it pass" attitude.
- **Use fixtures instead of manually instantiating objects** in every test (see [Fixtures & Test Data](./09-fixtures-test-data/)).
- **Clean up any test data you create**, and prefix it with `[TEST]` so it's easy to identify and doesn't pollute real data.

## 2. Cheatsheet: Locators

```typescript
// By role (top recommendation)
page.getByRole('button', { name: 'Submit' })
page.getByRole('textbox', { name: 'Email' })
page.getByRole('checkbox', { name: 'Remember me' })

// By text / label / placeholder
page.getByText('Hello')
page.getByText(/hello/i)             // regex, case-insensitive
page.getByLabel('Email')
page.getByPlaceholder('Enter your email...')

// By test id (when nothing else works well)
page.getByTestId('submit-btn')

// Chaining & filtering within a list
page.locator('table tbody tr').first()
page.locator('table tbody tr').nth(2)      // zero-indexed
page.locator('li').filter({ hasText: 'Pending' })
```

## 3. Cheatsheet: Actions

```typescript
await element.click();
await element.dblclick();
await element.click({ button: 'right' });

await element.fill('text');   // clears existing value, types new text
await element.clear();

await page.selectOption('select', { label: 'Label text' });
await element.check();
await element.uncheck();

await page.goto('/path');
await page.goBack();

await element.press('Enter');
await page.setInputFiles('input[type="file"]', 'path/to/file.pdf');

await element.hover();
```

## 4. Cheatsheet: Assertions

```typescript
import { expect } from '@playwright/test';

await expect(page).toHaveURL(/dashboard/);
await expect(element).toBeVisible();
await expect(element).toBeEnabled();
await expect(element).toBeChecked();
await expect(element).toHaveText(/regex/i);
await expect(input).toHaveValue('value');
await expect(element).toHaveAttribute('type', 'submit');
await expect(page.locator('tr')).toHaveCount(5);
await expect(element).toBeVisible({ timeout: 10000 }); // custom timeout when needed
```

## 5. Cheatsheet: Waits

```typescript
await element.waitFor({ state: 'visible' });
await page.waitForLoadState('networkidle');
await page.waitForURL(/dashboard/);
await page.waitForResponse(
  (res) => res.url().includes('/trpc/candidate.list') && res.status() === 200
);

// Use sparingly — only when there's truly no other option
await page.waitForTimeout(1000);
```

## 6. Cheatsheet: Test Structure & Commands

```typescript
import { test, expect } from '../../fixtures/test-fixtures';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('clearly describes the behavior under test', async ({ page }) => {
    // ARRANGE - ACT - ASSERT
  });

  test.skip('not implemented yet', async () => {});
});
```

```bash
npx playwright test                       # Run the full suite
npx playwright test --ui                  # UI mode (recommended during development)
npx playwright test --headed              # Open a visible browser
npx playwright test -g "login"            # Run tests whose name matches "login"
npx playwright test --debug               # Debug mode (opens the Inspector)
npx playwright codegen <url>              # Generate code from real actions
npx playwright show-report                # View the HTML report
npx playwright show-trace trace.zip       # Replay a recorded trace
```

## 7. Pre-PR self-review checklist

**Before writing a test:**
- [ ] You've clearly identified what behavior this test verifies (not testing "just to have a test")
- [ ] You've checked that no other test already covers the same case

**Before opening a Pull Request:**
- [ ] The test passes reliably at least 3 times in a row (not flaky)
- [ ] The test runs independently (still passes when run alone, without any other test running first)
- [ ] No unnecessary hardcoded `waitForTimeout`
- [ ] Locators prefer `getByRole`/`getByLabel` over long, brittle CSS selectors where possible
- [ ] Any test data created is prefixed with `[TEST]` and cleaned up after the test runs
- [ ] No real credentials or tokens are hardcoded in the code

**Before merging:**
- [ ] CI (GitHub Actions) passes
- [ ] Any report/trace from a test that failed during development has been reviewed

## 8. Further reading

| Resource | Link | Description |
|---|---|---|
| Getting Started | [playwright.dev/docs/intro](https://playwright.dev/docs/intro) | Start here |
| Best Practices | [playwright.dev/docs/best-practices](https://playwright.dev/docs/best-practices) | Official best practices |
| API Reference | [playwright.dev/docs/api](https://playwright.dev/docs/api/class-playwright) | Full API reference |
| Locators Guide | [playwright.dev/docs/locators](https://playwright.dev/docs/locators) | Locators guide |
| Assertions Guide | [playwright.dev/docs/test-assertions](https://playwright.dev/docs/test-assertions) | Assertions guide |

:::tip[This wraps up the Automation Testing track]
If you've made it through all 21 lessons, you now have what you need to write, organize, debug, and operate a real automation test suite in CI/CD. The best next step is to practice: pick 5-10 manual test cases from [Test Cases by Module](../practice/04-test-cases-by-module/) and automate them yourself.
:::

**Need help?** Contact your QC Lead or #qc-team
