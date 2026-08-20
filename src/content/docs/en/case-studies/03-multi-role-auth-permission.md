---
title: "Case Study: Multi-role Auth & Permission Testing"
description: Analyzing hr-tool's per-role storageState mechanism and how to design tests for a multi-tenant RBAC system
---

# Case Study: Multi-role Auth & Permission Testing

QC Training Documentation - HR Tool

---

## Table of Contents

1. [The problem: one system, many roles, many companies](#1-the-problem-one-system-many-roles-many-companies)
2. [HR Tool's 3 role-based setup files](#2-hr-tools-3-role-based-setup-files)
3. [A real permission test: SCRUM-93](#3-a-real-permission-test-scrum-93)
4. [Designing a permission matrix before writing tests](#4-designing-a-permission-matrix-before-writing-tests)
5. [Don't forget multi-tenancy: permissions vs. data isolation](#5-dont-forget-multi-tenancy-permissions-vs-data-isolation)

---

## 1. The problem: one system, many roles, many companies

HR Tool has two layers of access control stacked on top of each other, and automation tests have to handle both:

- **RBAC (Role-Based Access Control):** `super_admin`, `admin`, `hr`, `tech_lead` — each role sees and can do different things.
- **Multi-tenancy:** each company (`companyId`) has fully separated data — a user from Company A must never see Company B's data, even if both users share the same role.

If every test logged in from scratch (filling the login form, submitting, waiting for the redirect...), a full test suite covering multiple roles would be slow and full of duplicated code. HR Tool solves this with a **per-role `storageState`** mechanism: log in once per role, save that session, and later tests simply "load" that saved session.

## 2. HR Tool's 3 role-based setup files

**`tests/auth/auth.setup.ts`** — the default role (reads credentials from environment variables via `loginWithEnv()`, nothing hardcoded):

```ts
const authFile = 'apps/e2e/.auth/user.json';

setup('authenticate', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.loginWithEnv();
  await page.waitForTimeout(2000);
  await expect(page.locator('text=/xin chào/i').first()).toBeVisible({ timeout: 15000 });
  await page.context().storageState({ path: authFile });
});
```

**`tests/auth/ctv.setup.ts`** — the collaborator (CTV) role:

```ts
const authFile = 'apps/e2e/.auth/ctv.json';

setup('authenticate ctv', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('[TEST_CTV_EMAIL]', '[TEST_CTV_PASSWORD]');
  await page.waitForURL(/\/ctv/, { timeout: 15000 });
  await page.context().storageState({ path: authFile });
});
```

**`tests/auth/hr-headhunt.setup.ts`** — an HR role at a headhunt company:

```ts
const authFile = 'apps/e2e/.auth/hr-headhunt.json';

setup('authenticate hr-headhunt', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('[TEST_HR_EMAIL]', '[TEST_HR_PASSWORD]');
  await page.waitForURL((url) => !url.pathname.startsWith('/login'), { timeout: 15000 });
  await page.context().storageState({ path: authFile });
});
```

:::caution[Never copy real credentials verbatim]
The real code has actual credentials in place of `[TEST_CTV_EMAIL]`/`[TEST_HR_EMAIL]` above. These are internal test account details — whenever you write documentation, reports, or share sample code, ALWAYS replace them with placeholders like the ones above, even for test-only accounts.
:::

**3 things worth learning** from these three files:

1. Each role gets **its own setup file and its own storageState file** (`user.json`, `ctv.json`, `hr-headhunt.json`) — no role shares a session with another.
2. Each file waits for a **different confirmation signal**, matched to where that role actually lands after logging in: the default role waits for a "welcome" text, CTV waits for the URL to contain `/ctv`, and the headhunt HR role waits for the URL to **no longer** be `/login`. This shows you have to understand each role's real UI behavior — you can't reuse one generic wait condition for every role.
3. `playwright.config.ts` declares these setups as **dependency projects** — other tests simply write `test.use({ storageState: 'apps/e2e/.auth/ctv.json' })` to "become" that role, without needing to know the login details at all.

## 3. A real permission test: SCRUM-93

```ts
test('TC-SCRUM93-001: Admin can see add button on Departments', async ({ page }) => {
  await page.goto('/departments');
  await page.waitForLoadState('networkidle');
  const addButton = page.getByRole('button', { name: /thêm|add|tạo/i });
  await expect(addButton).toBeVisible();
});
```

This test runs under the default session (the Admin role, via `auth.setup.ts`) and asserts that Admin **can see** the "Add" button on the Departments, Positions, and Employees pages. This is the **positive case** of permission testing: an allowed role → should be able to see/do it.

## 4. Designing a permission matrix before writing tests

The SCRUM-93 suite only covers half the picture. A complete permission test suite needs a **role × feature × action matrix**, e.g.:

| Feature | super_admin | admin | hr | tech_lead |
|---|:---:|:---:|:---:|:---:|
| View Departments | ✅ | ✅ | ✅ | ✅ |
| Add/Edit Departments | ✅ | ✅ | ❌ | ❌ |
| View Employees | ✅ | ✅ | ✅ | ✅ |
| Edit Employees | ✅ | ✅ | ✅ | ❌ |
| Manage Companies (Super Admin only) | ✅ | ❌ | ❌ | ❌ |

Every cell in this matrix needs **two directions** of testing:
- **Positive:** an allowed role → the action succeeds / the UI element is visible.
- **Negative:** a disallowed role → the action is blocked (403, or the UI element is absent) — **this is exactly what SCRUM-93 is currently missing**, and a good opportunity for you to add it yourself (see Practice Exercises).

:::tip[Why the negative case matters just as much as the positive one]
A dangerous permission gap is rarely "an allowed role can't do something it should" (annoying, but not a security issue) — it's usually **"a disallowed role can still do it"** (leaking data, modifying something it shouldn't be able to touch). The negative case is exactly the kind of test that catches this dangerous category of bug.
:::

## 5. Don't forget multi-tenancy: permissions vs. data isolation

The matrix in section 4 only answers "can role X do Y" — but multi-tenancy raises a second, separate question: **"can a user from Company A see Company B's data, even with the same role?"**. This is a different kind of test — not RBAC, but **data isolation** (the same topic covered as IDOR in `basics/11-security-testing-co-ban`). A complete multi-tenant test suite needs both layers:

1. Whether role X can/can't do action Y within its own company (RBAC — this lesson).
2. Whether role X can be blocked from accessing another company's data even by tampering with an ID in the URL/request (data isolation — the `basics/11` lesson).

## Practice Exercises

1. Draw a complete permission matrix (like the one in section 4) for at least 5 HR Tool features, using the Role & Permission Matrix in `basics/02-bug-report-template` as a reference.
2. Write pseudo-code for a negative test case: the `tech_lead` role should **not** see the "Add" button on the Departments page.
3. Explain why the three setup files wait on three different signals (welcome text / `/ctv` URL / non-`/login` URL) instead of sharing one generic wait condition.
4. Design (in words) a data-isolation test case: a Company A user tries to access a Company B candidate's detail page by changing the ID in the URL — what result do you expect?

## Next steps

You've now completed the entire Case Studies group. Go back to [Automation Testing](../automation/01-vi-sao-automation-test-pyramid/) to review, or check [Best Practices & Cheatsheet](../automation/21-best-practices-cheatsheet/) to tie everything together.

---

**Need help?** Contact your QC Lead or post in #qc-team
