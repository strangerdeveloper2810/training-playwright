---
title: Locators & Selectors
description: Playwright's locator philosophy, the different locator types, and how to write locators that survive UI changes
---

# Locators & Selectors

QC Training Documentation - HR Tool

**Version:** 1.0
**Updated:** 2026-08-20
**Author:** QC Team

---

## Table of Contents

1. [What is a locator?](#1-what-is-a-locator)
2. [Locator priority (Locator Philosophy)](#2-locator-priority-locator-philosophy)
3. [Locator types, with examples](#3-locator-types-with-examples)
4. [Chaining and filtering locators](#4-chaining-and-filtering-locators)
5. [Common mistakes](#5-common-mistakes)
6. [Practice Exercises](#6-practice-exercises)

---

## 1. What is a locator?

A **locator** is how you tell Playwright which element on the page to act on — like telling a coworker "click the Log In button" instead of "click the 3rd element inside the 5th div."

```typescript
const loginButton = page.getByRole('button', { name: 'Log in' });
await loginButton.click();
```

Playwright doesn't actually search for the element the moment you write `page.getByRole(...)` — that line only builds a "search recipe." The real lookup (and the automatic wait for the element to appear) only happens when you call an action (`.click()`, `.fill()`...) or an assertion (`expect(...)`).

## 2. Locator priority (Locator Philosophy)

Playwright recommends choosing locators in this order, from **best to avoid**:

```
1. getByRole()          ← BEST — matches how users/screen readers perceive the page
2. getByLabel()         ← Good — for form fields with a label
3. getByText()          ← Good — matches user-visible text
4. getByPlaceholder()   ← Acceptable — matches placeholder text
5. getByTestId()        ← OK — requires devs to add data-testid
6. locator() with CSS/XPath ← Avoid if possible
```

**Why is `getByRole` the best?**
- It reflects how real users (and screen readers) perceive an element — if you can test something with `getByRole`, there's a good chance it's also accessible.
- It's more resilient: it won't break just because a developer renamed a CSS class or restructured the markup.
- It's self-documenting: reading the test tells you exactly what element is being acted on.

```typescript
// ❌ Fragile — the CSS class can be renamed any time during a refactor
await page.locator('.btn.btn-primary.submit-form').click();

// ✅ Resilient — still correct even if the CSS class changes, as long as it's still the "Log in" button
await page.getByRole('button', { name: 'Log in' }).click();
```

:::caution[An inconsistency worth avoiding when writing a Page Object]
The locator philosophy recommends `getByRole`, but some older example code still uses CSS classes like `.error-message`. When writing Page Objects for HR Tool (see [Page Object Model](../automation/08-page-object-model/)), stay consistent and prefer `getByRole`/`getByText`/`getByLabel` — only fall back to a CSS selector when there's genuinely no meaningful role/text/label available (e.g. an error `div` with no clear role).
:::

## 3. Locator types, with examples

```typescript
// getByRole — top priority
await page.getByRole('button', { name: 'Log in' }).click();
await page.getByRole('button', { name: /log in/i }).click(); // case-insensitive
await page.getByRole('link', { name: 'Forgot password?' }).click();
await page.getByRole('textbox', { name: 'Email' }).fill('[TEST_EMAIL]');
await page.getByRole('checkbox', { name: 'Remember me' }).check();
await expect(page.getByRole('heading', { name: 'Log in' })).toBeVisible();

// getByLabel — for form fields
await page.getByLabel('Email').fill('[TEST_EMAIL]');
await page.getByLabel(/password/i).fill('[TEST_PASSWORD]');

// getByText — matches visible content
await page.getByText('Sign in to your account');          // exact match
await page.getByText('Sign in', { exact: false });        // partial match
await page.getByText(/sign in/i);                          // regex match

// getByPlaceholder
await page.getByPlaceholder('Enter your email...').fill('[TEST_EMAIL]');

// getByTestId — requires dev to add data-testid="submit-btn" in the HTML
await page.getByTestId('submit-btn').click();

// CSS/XPath — only use when nothing better is available
await page.locator('.status-badge').isVisible();
await page.locator('xpath=//button[contains(text(), "Submit")]').click();
```

## 4. Chaining and filtering locators

Locators can be nested to search more precisely within a specific area:

```typescript
// Find a button inside a specific form
const loginForm = page.locator('#login-form');
await loginForm.getByRole('button', { name: 'Log in' }).click();

// Find the row containing specific text, then find a cell inside that row
const row = page.getByRole('row', { name: /john doe/i });
await expect(row.getByRole('cell', { name: 'Active' })).toBeVisible();

// filter() — narrow down by text or by a child element
const activeCandidates = page.getByRole('row').filter({ hasText: 'Under Review' });
await expect(activeCandidates).toHaveCount(5);

const rowsWithEditButton = page.getByRole('row').filter({
  has: page.getByRole('button', { name: 'Edit' }),
});
```

`filter({ hasText: ... })` is especially handy when testing HR Tool's data tables (Candidates, Jobs, Applications lists) — you can find the exact row you care about by content, without needing to know its position (index).

## 5. Common mistakes

| Mistake | Why it's a problem | What to do instead |
|---------|---------------------|---------------------|
| Using `nth(2)` to pick "the 3rd row" | Row order can shift when data changes (sorting, filtering) | Use `filter({ hasText })` to find the right row by content |
| Using auto-generated CSS classes (`.MuiButton-root-123`) | Framework-generated classes change on every build | Use `getByRole`/`getByTestId` |
| Overly specific locators (`div > div > span:nth-child(2)`) | Breaks the moment the markup shifts slightly | Use semantic locators (role/text/label) |
| Skipping `{ exact: true }` when you need an exact match | `getByText('Job')` may also match `'Jobs'`, `'Job Title'` | Add `{ exact: true }` when you need a 100% exact match |

## 6. Practice Exercises

1. Open HR Tool's login page (staging) and write three different locators to find the "Log in" button (using `getByRole`, `getByText`, and a CSS selector) — note which is the most resilient if a developer changes the button's color/CSS.
2. For the Candidates list, write a locator that finds rows with status "Under Review" and counts them.
3. Explain why `page.locator('.btn-primary').click()` could click the wrong button if the page has multiple buttons sharing the `.btn-primary` class.

## Next Step

Continue with [Actions, Interactions & Waiting Strategy](../automation/06-actions-interactions-waiting/) — now that you can correctly point at an element, how do you interact with it?

---

**Need help?** Contact your QC Lead or post in #qc-team
