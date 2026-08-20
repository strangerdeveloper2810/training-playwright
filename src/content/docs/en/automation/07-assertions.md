---
title: Assertions
description: Playwright's expect API, auto-retrying web-first assertions, soft assertions, and how to write assertions you can trust
---

# Assertions

QC Training Documentation - HR Tool

**Version:** 1.0
**Updated:** 2026-08-20
**Author:** QC Team

---

## Table of Contents

1. [What is an assertion in Playwright?](#1-what-is-an-assertion-in-playwright)
2. [Web-first assertions auto-retry](#2-web-first-assertions-auto-retry)
3. [Common assertion groups](#3-common-assertion-groups)
4. [Soft assertions](#4-soft-assertions)
5. [Screenshot assertions (introduction)](#5-screenshot-assertions-introduction)
6. [Custom timeouts for assertions](#6-custom-timeouts-for-assertions)
7. [Practice Exercises](#7-practice-exercises)

---

## 1. What is an assertion in Playwright?

An assertion is a statement that says "the result must be this, otherwise the test fails." It's the **most important** part of a test — a test with no assertions (just clicking through steps) doesn't really verify anything, because it only passes when nothing crashes, without ever confirming the result was actually correct.

```typescript
await expect(page.locator('.status')).toHaveText('Success');
```

## 2. Web-first assertions auto-retry

This is the biggest difference from a typical assertion: Playwright's `expect(locator)` **automatically retries** until the condition is true or the timeout runs out — you don't write any retry logic yourself.

```typescript
// ✅ Web-first assertion — auto-retries, recommended
await expect(page.locator('.status')).toHaveText('Success');
// Playwright will re-check repeatedly for up to 10s (default),
// until the text equals 'Success' or time runs out.

// ❌ Non-retrying assertion — prone to flakiness
const text = await page.locator('.status').textContent();
expect(text).toBe('Success');
// Reads the value EXACTLY ONCE at that moment — if the UI hasn't finished updating yet, the test fails unfairly.
```

:::tip[A rule of thumb]
If your assertion looks like `await expect(locator).toXxx(...)` — it auto-retries and is safe.
If you have to `await` a value into a variable first and then `expect(value).toBe(...)` — it does **not** retry and is more prone to flakiness. Always prefer the first form.
:::

## 3. Common assertion groups

```typescript
// Visibility
await expect(element).toBeVisible();
await expect(element).toBeHidden();
await expect(element).toBeAttached();       // present in the DOM (may still be hidden)
await expect(page.getByText('Error')).not.toBeVisible(); // negate with .not

// Text content
await expect(page.locator('.title')).toHaveText('Dashboard');          // exact match
await expect(page.locator('.welcome')).toContainText('Welcome');       // partial match
await expect(page.locator('.count')).toHaveText(/\d+ candidates/);     // regex
await expect(page.locator('.menu-item')).toHaveText(['Dashboard', 'Candidates', 'Jobs']); // multiple elements

// Input/Form
await expect(page.getByLabel('Email')).toHaveValue('[TEST_EMAIL]');
await expect(page.getByLabel('Email')).toBeEditable();

// State
await expect(page.getByRole('button', { name: 'Log in' })).toBeEnabled();
await expect(page.locator('.submit-btn')).toBeDisabled();
await expect(page.getByRole('checkbox')).toBeChecked();
await expect(page.getByLabel('Email')).toBeFocused();

// Attribute/Class/CSS
await expect(page.locator('a.active')).toHaveAttribute('href', '/candidates');
await expect(page.locator('.nav-link')).toHaveClass(/active/);

// Element count
await expect(page.getByRole('row')).toHaveCount(11); // header row + 10 data rows

// Whole page
await expect(page).toHaveURL(/.*dashboard/);
await expect(page).toHaveTitle(/HR Tool/);
```

## 4. Soft assertions

A regular assertion **stops the test immediately** on failure. `expect.soft()` lets the test **keep running** even if that assertion fails, and reports every failure at the end:

```typescript
test('verify all dashboard stats', async ({ page }) => {
  await page.goto('/dashboard');

  await expect.soft(page.locator('.stat-total-jobs')).toHaveText('12');
  await expect.soft(page.locator('.stat-total-candidates')).toHaveText('87');
  await expect.soft(page.locator('.stat-total-interviews')).toHaveText('5');
  // Even if stat-total-jobs is wrong, the test keeps checking the other two stats
  // → the final report shows ALL 3 results, not just the first failure
});
```

:::tip[When to use soft assertions]
Use `expect.soft()` when you want to check **several independent values** in one test (e.g. multiple stat tiles on a dashboard) and want to know **every** one that's wrong, not just the first. For **sequential** steps where a later step depends on an earlier one succeeding (e.g. you must log in successfully before you can navigate further), stick with regular `expect()` so the test stops immediately on failure instead of producing noisy, cascading errors.
:::

## 5. Screenshot assertions (introduction)

```typescript
await expect(page).toHaveScreenshot('login-page.png');
```

This is the entry point to **visual regression testing** — comparing the current screenshot against a previously saved "baseline" image to catch unintended UI changes. This topic gets a full lesson at [Visual Regression Testing](../automation/12-visual-regression-testing/) — for now, just know this assertion exists.

## 6. Custom timeouts for assertions

```typescript
// Default timeout for every assertion (set in playwright.config.ts)
export default defineConfig({
  expect: { timeout: 10_000 },
});

// A custom timeout for one specific assertion — useful when one part of the UI is slower than usual
await expect(page.locator('.ai-matching-result')).toBeVisible({ timeout: 30_000 });
```

## 7. Practice Exercises

1. Write a login test that, after submitting, asserts all three of: the URL changed to `/dashboard`, the page title is correct, and the user's name appears correctly in the header.
2. Explain why the following code is prone to flakiness, and rewrite it correctly:
   ```typescript
   const count = await page.locator('.notification-badge').textContent();
   expect(count).toBe('3');
   ```
3. Write a test using `expect.soft()` to check 4 stat values on HR Tool's Dashboard page all at once.

## Next Step

With these 7 lessons, you now have everything you need to write a complete Playwright test. Continue with [Page Object Model](../automation/08-page-object-model/) — how to organize test code so it stays maintainable as the project grows.

---

**Need help?** Contact your QC Lead or post in #qc-team
