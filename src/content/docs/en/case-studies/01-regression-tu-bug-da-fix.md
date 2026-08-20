---
title: "Case Study: Writing Regression Tests from Fixed Bugs"
description: Analyzing 4 real HR Tool bugs and how automation tests lock the fix in place so the bug can't come back
---

# Case Study: Writing Regression Tests from Fixed Bugs

QC Training Documentation - HR Tool

---

## Table of Contents

1. [Why a fixed bug still needs its own test](#1-why-a-fixed-bug-still-needs-its-own-test)
2. [SCRUM-72: Double password hashing](#2-scrum-72-double-password-hashing)
3. [SCRUM-93: Inconsistent permission checks](#3-scrum-93-inconsistent-permission-checks)
4. [SCRUM-94: Filters not resetting pagination](#4-scrum-94-filters-not-resetting-pagination)
5. [SCRUM-102: Stale closure when uploading multiple files](#5-scrum-102-stale-closure-when-uploading-multiple-files)
6. [The general workflow: from bug fix to regression test](#6-the-general-workflow-from-bug-fix-to-regression-test)

---

## 1. Why a fixed bug still needs its own test

A developer fixes a bug, QC verifies it, the ticket gets closed — but if there's no automated test locking that correct behavior in place, an unrelated change three months later can silently bring the bug back (this is called a *regression*). That's why a mature automation testing process always includes one step: **every important bug fix gets at least one test case that reproduces the exact conditions that caused it.**

HR Tool follows this principle: regression tests live under `tests/bugfixes/`, named after the JIRA ticket (`scrum-72-*.spec.ts`) so anyone reading a failing test report immediately knows which bug is back and which ticket to reread. Below we analyze 4 real bugs, compare the original bug to how the test was written, and point out places where the test is **not perfect** — recognizing a test's limits matters as much as recognizing its strengths.

:::tip[Read before continuing]
This is a case study, not a step-by-step tutorial. The goal is to help you **understand the reasoning** behind a regression test, so when you hit a new bug at work, you know how to test it properly.
:::

## 2. SCRUM-72: Double password hashing

**Original bug:** A user's password was hashed **twice** — once manually in application code, and once more automatically via TypeORM's `@BeforeInsert` hook. Result: newly created users couldn't log in, because the password stored in the DB no longer matched the original password the user entered (it had been hashed on top of itself).

**The test that was written** (`tests/bugfixes/scrum-72-password-hashing.spec.ts`):

```ts
test.describe('SCRUM-72: Password Hashing Fix', () => {
  test.use({ storageState: { cookies: [], origins: [] } }); // Clear auth

  test('TC-SCRUM72-001: User can login with correct credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(TEST_USERS.admin.email, TEST_USERS.admin.password);
    await expect(page).not.toHaveURL(/login/, { timeout: 10000 });
  });

  test('TC-SCRUM72-002: Login fails with wrong password', async ({ page }) => {
    // ...login with a wrong password, expect to stay on the login page
  });

  test('TC-SCRUM72-003: Login form validates password length', async ({ page }) => {
    // ...7-character password, expect it to be blocked by validation
  });
});
```

**Why exactly these 3 tests:** the original bug only affected the **correct login flow** (case 001), but testing that alone wouldn't be conclusive — the test could "pass for the wrong reason" if the system accepted any password at all. The other two tests act as **counter-checks**: case 002 confirms the system still rejects a wrong password (the fix wasn't overcorrected into "accept everything"), and case 003 confirms password-length validation wasn't broken by the hashing change. Together the three form a **verification triangle**: correct passes, incorrect is blocked, and related rules stay intact.

Note the line `test.use({ storageState: { cookies: [], origins: [] } })` — since this test is specifically about the *login* flow, it must clear the session saved by `auth.setup.ts` first, otherwise the test would skip the login form entirely because it's already authenticated.

## 3. SCRUM-93: Inconsistent permission checks

**Original bug:** Some pages checked permissions with a hardcoded `if (role === 'admin')`, while the rest of the system used the shared `hasPermission()` function. The two approaches drifted out of sync, causing inconsistent permission behavior across pages.

**The test that was written:** verifies that an Admin **can see** the "Add" button on the Departments, Positions, and Employees pages, and that those pages load without errors.

```ts
test('TC-SCRUM93-001: Admin can see add button on Departments', async ({ page }) => {
  await page.goto('/departments');
  await page.waitForLoadState('networkidle');
  const addButton = page.getByRole('button', { name: /thêm|add|tạo/i });
  await expect(addButton).toBeVisible();
});
```

**What's worth learning here:** the original bug was an **implementation** issue (two different ways of checking permissions), but the test doesn't assert against the implementation at all — it asserts against **observable user behavior** (whether the Add button is visible). This matters: even if a future refactor replaces `hasPermission()` with a different mechanism entirely, this test remains valid and still provides protection, because it doesn't depend on "how it's done," only on "what the end result is."

:::caution[Limits of this test suite]
The test only verifies that **Admin can see** the button — there's no test yet verifying that a role **without** permission (e.g. Tech Lead) does **not** see it. A complete regression suite for a permission bug should cover both directions: allowed roles (positive) and disallowed roles (negative). This is a good exercise to extend yourself — see the Practice Exercises section.
:::

## 4. SCRUM-94: Filters not resetting pagination

**Original bug:** When a user was viewing page 5 of a list and then changed a filter (e.g. changing the stage filter in the ATS pipeline), the current page number **wasn't reset to page 1**. If the filtered results only had 2 pages, the user would land on a blank screen (still on page 5, but the data only has 2 pages) and assume the system was broken or had no data.

**The test that was written:** checks that pages (Applications, Interviews, Positions, Employees) have filter dropdowns, and that changing a filter triggers a data reload (`waitForLoadState('networkidle')` after selecting an option).

```ts
test('TC-SCRUM94-005: Filter change triggers data refresh', async ({ page }) => {
  await page.goto('/applications');
  await page.waitForLoadState('networkidle');
  const stageFilter = page.locator('[role="combobox"]').first();
  if (await stageFilter.isVisible()) {
    await stageFilter.click();
    const option = page.locator('[role="option"]').first();
    if (await option.isVisible()) {
      await option.click();
      await page.waitForLoadState('networkidle');
    }
  }
});
```

:::caution[An example of an incomplete regression test]
Look closely: this test only confirms the filter **exists** and that changing it **triggers a reload** — it never actually asserts that the page number was reset to 1. This isn't a rigorous regression test for SCRUM-94 specifically; it reads more like a *smoke test* than a real regression test for that exact bug. A stricter version would: navigate to page 3-4 first, change the filter, then explicitly assert "now on page 1" (via the pagination component's state or a URL query param). Recognizing when a test "looks related to the topic" but hasn't actually locked in the original bug is an important review skill for QC.
:::

## 5. SCRUM-102: Stale closure when uploading multiple files

**Original bug:** The `FileUploadZone` component used a closure inside its `processFiles` callback. When a user selected multiple files at once to upload, only the **last** file was added to the list — earlier files were lost because the closure held onto a stale (outdated) value.

**The test that was written:** checks that the CV Matching page loads, the create-session dialog opens, and the file upload area (or an "add file" button) is visible.

**What's worth learning — a coverage gap:** the original bug was specifically about **uploading multiple files at once**, but the current tests don't actually select multiple files and assert that all of them (2, 3, or more) show up in the list afterward. The existing tests stop at "does the page/dialog/upload area render" — a reasonable first step (make sure the UI is even built correctly), but **not yet a regression test that actually locks in SCRUM-102**. In a real work situation, QC should proactively propose adding: a test that selects 2-3 files and asserts all of them appear in the preview list.

## 6. The general workflow: from bug fix to regression test

From the four cases above, here's a workflow that applies to any bug:

1. **Read the original bug description carefully** — pin down the exact condition/action that caused it, not a vague summary of "the area" it happened in.
2. **Write a test that reproduces that exact condition** — not a generic test "somewhere near where the bug was."
3. **Assert on observable outcomes**, not implementation details, so the test keeps its value even after a refactor.
4. **Add counter-check tests** for related cases (correct/incorrect/boundary) to make sure the fix didn't overcorrect and break something else.
5. **Name the file/test after the ticket ID** so anyone reading a failure later can trace it back to the exact bug that resurfaced.
6. **Ask yourself: does this test actually lock in the specific bug, or is it just testing something that looks similar?** — as seen in SCRUM-94 and SCRUM-102, this is a very easy trap to fall into.

## Practice Exercises

1. For SCRUM-93 (permission check), write (on paper or as pseudo-code) an additional test case for the **Tech Lead** role — expecting they should **not** see the "Add" button on the Departments page.
2. For SCRUM-94, rewrite `TC-SCRUM94-005` so it clearly asserts "now on page 1" after changing the filter (hint: check the pagination component's state, or a query param in the URL).
3. For SCRUM-102, propose a new test case: select 3 files at once, and assert all 3 appear in the preview list.
4. Pick a bug you personally reported (or read about in your team's Jira), and try writing a test case following the 6-step workflow in section 6.

## Next steps

Next: [Organizing Test Suites by Business Domain](../case-studies/02-test-suite-theo-domain/)

---

**Need help?** Contact your QC Lead or post in #qc-team
