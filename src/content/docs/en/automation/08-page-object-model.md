---
title: Page Object Model
description: How to organize automation test code with the Page Object Model for maintainability and reuse
---

# Automation Testing - Page Object Model

QC Training Documentation - HR Tool

## Table of Contents

1. [The problem: unstructured test code](#1-the-problem-unstructured-test-code)
2. [What is the Page Object Model](#2-what-is-the-page-object-model)
3. [Structure: Base Page and child pages](#3-structure-base-page-and-child-pages)
4. [Real example from HR Tool: BasePage](#4-real-example-from-hr-tool-basepage)
5. [Real example from HR Tool: CandidatesPage](#5-real-example-from-hr-tool-candidatespage)
6. [Principles for writing good Page Objects](#6-principles-for-writing-good-page-objects)
7. [Using the template to create a new Page Object](#7-using-the-template-to-create-a-new-page-object)
8. [Common mistakes](#8-common-mistakes)
9. [Practice exercises](#9-practice-exercises)
10. [Next steps](#10-next-steps)

---

## 1. The problem: unstructured test code

Imagine you write 20 test cases for the **Candidates** page, and every single test contains something like:

```typescript
await page.locator('h1').filter({ hasText: /candidates/i });
await page.getByRole('button', { name: /upload cv/i }).click();
```

If a developer renames the button from "Upload CV" to "Add CV", you now have to fix **20 different test files**. This is exactly the problem the **Page Object Model (POM)** solves.

:::note[Core idea]
Instead of writing locators and actions directly inside every test, we group them into a **class** that represents one screen. Tests only call that class's methods — they don't need to know where the locators live.
:::

## 2. What is the Page Object Model

The Page Object Model is a design pattern where each page (or each important UI area) is represented by its own class, called a **Page Object**. This class contains:

- **Locators**: definitions of how to find elements on the page (buttons, inputs, tables...).
- **Actions**: methods that perform actions on the page (click, fill a form, search...).

Benefits:

| Benefit | Explanation |
|---|---|
| **Easier maintenance** | UI changes (text, CSS class) → fix it in one place inside the Page Object, not in every test |
| **Reusability** | Many tests reuse the same methods like `goto()`, `search()` |
| **Readability** | Tests read like a story: `candidatesPage.goto()` → `candidatesPage.search('Nguyen')` — no technical locators mixed in |
| **Separation of concerns** | The Page Object handles "how to interact with the UI"; the test handles "is the result correct" |

## 3. Structure: Base Page and child pages

HR Tool organizes Page Objects using **inheritance**:

```
BasePage (abstract class)
   │  holds locators & methods SHARED by every page
   │  (sidebar, search, loading spinner, toast message...)
   │
   ├── LoginPage        extends BasePage
   ├── DashboardPage    extends BasePage
   ├── CandidatesPage   extends BasePage
   ├── JobsPage         extends BasePage
   ├── ApplicationsPage extends BasePage
   └── InterviewsPage   extends BasePage
```

`BasePage` doesn't represent any specific page — it's where things **every page has** live (navigation sidebar, search box, loading spinner, toast notifications). Each child page extends `BasePage` and only needs to define what's **unique to that page**.

## 4. Real example from HR Tool: BasePage

Here is the real `BasePage` used in HR Tool's automation suite (`apps/e2e/pages/base.page.ts`):

```typescript
import type { Page, Locator } from '@playwright/test';

export abstract class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Shared locators
  get sidebar(): Locator {
    return this.page.locator('nav, aside').first();
  }

  get searchInput(): Locator {
    return this.page
      .locator('main input[type="text"], .content input[type="text"]')
      .first();
  }

  get loadingSpinner(): Locator {
    return this.page.locator('[data-testid="loading"], .loading, .spinner');
  }

  // Shared actions
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  async waitForLoading(): Promise<void> {
    const spinner = this.loadingSpinner;
    if (await spinner.isVisible()) {
      await spinner.waitFor({ state: 'hidden', timeout: 30000 });
    }
  }

  async navigateTo(path: string): Promise<void> {
    await this.page.goto(path);
    await this.waitForPageLoad();
  }

  async search(query: string): Promise<void> {
    await this.searchInput.fill(query);
    await this.page.keyboard.press('Enter');
    await this.waitForLoading();
  }

  async getToastMessage(): Promise<string | null> {
    const toast = this.page.locator('[role="alert"], .toast, .notification');
    if (await toast.isVisible()) {
      return toast.textContent();
    }
    return null;
  }
}
```

A few things worth noticing:

- `abstract class` means you **cannot** write `new BasePage(page)` directly — it only exists so other classes can extend it.
- Locators are written as `get sidebar()` (getters) — meaning every time you access `this.sidebar`, Playwright re-resolves the element on the current page, avoiding "stale locator" errors when the page changes.
- `waitForLoading()` waits for the **spinner to disappear** before continuing — critical to avoid the test running too fast and clicking an element before the page finishes loading.

## 5. Real example from HR Tool: CandidatesPage

Here is `CandidatesPage`, which extends `BasePage` (`apps/e2e/pages/candidates.page.ts`):

```typescript
import type { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class CandidatesPage extends BasePage {
  readonly pageTitle: Locator;
  readonly uploadCVButton: Locator;
  readonly candidateTable: Locator;
  readonly statusFilter: Locator;
  readonly emptyState: Locator;

  constructor(page: Page) {
    super(page); // calls BasePage's constructor
    this.pageTitle = page.locator('h1').filter({ hasText: /candidates/i });
    this.uploadCVButton = page.getByRole('button', { name: /upload cv/i });
    this.candidateTable = page.locator('table, [data-testid="candidate-table"]');
    this.statusFilter = page.locator('select, [data-testid="status-filter"]').first();
    this.emptyState = page
      .locator('[data-testid="empty-state"]')
      .or(page.getByText(/no candidates yet/i));
  }

  async goto(): Promise<void> {
    await this.navigateTo('/candidates'); // navigateTo() is inherited from BasePage
  }

  async clickUploadCV(): Promise<void> {
    await this.uploadCVButton.click();
  }

  async filterByStatus(status: string): Promise<void> {
    await this.statusFilter.selectOption({ label: status });
    await this.waitForLoading();
  }

  async getCandidateCount(): Promise<number> {
    if (await this.emptyState.isVisible()) {
      return 0;
    }
    const rows = this.candidateTable.locator('tbody tr');
    return rows.count();
  }
}
```

Thanks to this, a test case ends up very clean:

```typescript
test('Filter candidates by "Approved" status', async ({ candidatesPage }) => {
  await candidatesPage.goto();
  await candidatesPage.filterByStatus('Approved');

  expect(await candidatesPage.getCandidateCount()).toBeGreaterThan(0);
});
```

No technical locator ever leaks into the test — everything lives inside `CandidatesPage`.

:::tip[Why does the constructor call `super(page)`?]
`super(page)` calls the parent class's (`BasePage`) constructor to assign `this.page = page`. If you forget `super(page)`, TypeScript raises a compile error immediately — this is a mandatory rule of inheritance in TypeScript/JavaScript.
:::

## 6. Principles for writing good Page Objects

| Do | Don't |
|---|---|
| Keep locators + actions inside the Page Object | Put `expect(...)` (assertions) inside the Page Object |
| Return data from methods (`getCandidateCount()`) so the test can assert itself | Let the Page Object decide pass/fail |
| Prefer `getByRole`, `getByLabel`, `getByText` (see [Locators & Selectors](./05-locators-selectors/)) | Overuse long, brittle CSS selectors |
| Name methods after business actions (`filterByStatus`, `clickUploadCV`) | Name methods after implementation details (`clickButton2`, `fillInput1`) |
| One Page Object per page/area | Cram every page into one giant class |

:::caution[Why no assertions inside a Page Object?]
If `CandidatesPage` itself wrote `expect(count).toBeGreaterThan(0)` internally, that Page Object would only ever fit one scenario. But if the method just **returns data** (`getCandidateCount()`), it can be reused across many tests with many different assertions (`toBe(0)`, `toBeGreaterThan(5)`, `toEqual(...)`).
:::

## 7. Using the template to create a new Page Object

HR Tool ships a ready-made template at `apps/e2e/templates/page-object.template.ts` to copy whenever you need a Page Object for a new feature (e.g. `employees.page.ts`). The template already includes common locator groups (page title, action buttons, table, search & filter, form modal, confirm dialog, toast) and shared methods (`search`, `openCreateForm`, `getRowCount`, `openDeleteConfirm`...). Workflow for creating a new Page Object:

1. Copy `page-object.template.ts` → rename it to `[feature-name].page.ts`.
2. Replace `[FeatureName]` with the feature's name (PascalCase, e.g. `Employees`).
3. Replace `[feature-url]` with the page's real URL (e.g. `/employees`).
4. Remove locators/methods you don't need, add the ones specific to that feature.
5. Register the new Page Object in `fixtures/test-fixtures.ts` (see [Fixtures & Test Data](./09-fixtures-test-data/)) so tests can use it right away via a fixture.

## 8. Common mistakes

- **Forgetting `extends BasePage`**: the new Page Object won't have `navigateTo`, `waitForLoading`, etc. and you'll have to reimplement them.
- **Defining locators as `readonly x = page.locator(...)` instead of `get x()`**: in some setups this "freezes" the locator at creation time — Playwright's `Locator` is lazy by design so both styles usually work, but stay consistent with your team's convention.
- **Writing assertions (`expect`) directly inside a Page Object** — violates the principle in section 6.
- **One method doing too much** (filling a form, submitting, and verifying all at once), which makes it impossible to reuse individual steps across tests.

## 9. Practice exercises

1. Read `JobsPage` (similar to `CandidatesPage` but for the Jobs page) and list: how many locators are unique to it, how many methods are unique to it, and which methods are inherited from `BasePage`.
2. Suppose the Candidates page adds an "Export Excel" button. Write a new locator and a `clickExportExcel()` method for `CandidatesPage` (just write the code, no need to run it).
3. In your own words, explain why `filterByStatus()` calls `waitForLoading()` at the end rather than at the beginning.
4. Copy `page-object.template.ts` and try filling it in for a hypothetical "Departments" feature (`/departments`) — just fill in `[FeatureName]` and `[feature-url]`, no need to run any real test.
5. If two different pages both share a "list + filter + search" layout, would you introduce an intermediate class (e.g. `ListPage extends BasePage`) that both `CandidatesPage` and `JobsPage` extend? Give one argument for and one against.

## 10. Next steps

1. Continue with [Fixtures & Test Data](./09-fixtures-test-data/) — how to inject ready-made Page Objects into tests without manually calling `new` on each one.
2. Revisit [Locators & Selectors](./05-locators-selectors/) if you're not yet confident about choosing good locators.

---

**Need help?** Contact your QC Lead or post in #qc-team.
