---
title: Data-driven Testing
description: How to write one test that runs against many different datasets, avoiding duplicated code
---

# Automation Testing - Data-driven Testing

QC Training Documentation - HR Tool

## Table of Contents

1. [The problem: copy-pasting tests just to change the input](#1-the-problem-copy-pasting-tests-just-to-change-the-input)
2. [What is data-driven testing](#2-what-is-data-driven-testing)
3. [How to do it: looping over an array of data](#3-how-to-do-it-looping-over-an-array-of-data)
4. [Applied example: validating the Create Job form](#4-applied-example-validating-the-create-job-form)
5. [Applied example: testing across multiple roles](#5-applied-example-testing-across-multiple-roles)
6. [Naming tests clearly when data-driven](#6-naming-tests-clearly-when-data-driven)
7. [When NOT to use data-driven testing](#7-when-not-to-use-data-driven-testing)
8. [Practice exercises](#8-practice-exercises)
9. [Next steps](#9-next-steps)

---

## 1. The problem: copy-pasting tests just to change the input

Suppose you need to test validation on the "Minimum Salary" field in the Create Job form with several different inputs: a negative number, letters, an empty value, a number that's too large... If you write each as a separate test:

```typescript
test('Negative salary shows an error', async ({ page }) => { /* ... */ });
test('Non-numeric salary shows an error', async ({ page }) => { /* ... */ });
test('Empty salary shows an error', async ({ page }) => { /* ... */ });
test('Salary too large shows an error', async ({ page }) => { /* ... */ });
```

These four tests are 95% identical, differing only in the **input value** and the **expected error message**. That's exactly the signal to reach for **data-driven testing**.

## 2. What is data-driven testing

Data-driven testing is a technique where you write **one piece of test logic** and run it repeatedly against **many different datasets**. Each dataset produces its own distinct test case (its own name, its own independent pass/fail), while the code itself is written only once.

:::note[Not a Playwright-specific concept]
Data-driven testing is a general test-design technique (already covered in [Test Design Techniques](../basics/05-test-design-techniques/) via Equivalence Partitioning and Boundary Value Analysis). This lesson covers how to **implement that technique in code** using Playwright.
:::

## 3. How to do it: looping over an array of data

The basic idea: define an array of datasets, then use a regular JavaScript `for` loop to generate multiple `test(...)` calls:

```typescript
import { test, expect } from '@playwright/test';

const invalidSalaries = [
  { input: '-1000', expectedError: /salary must be greater than 0/i },
  { input: 'abc', expectedError: /salary must be a number/i },
  { input: '', expectedError: /please enter a salary/i },
];

for (const { input, expectedError } of invalidSalaries) {
  test(`Invalid minimum salary: "${input}"`, async ({ page }) => {
    await page.goto('/jobs/new');
    await page.getByLabel(/minimum salary/i).fill(input);
    await page.getByRole('button', { name: /save/i }).click();

    await expect(page.getByText(expectedError)).toBeVisible();
  });
}
```

The key point: this `for` loop runs while **Playwright is collecting the list of tests** (before any test actually runs), not inside a `test()` body. As a result, Playwright sees **3 separate test cases**, each with its own name, each showing pass/fail independently in the report — not one test looping three times internally.

## 4. Applied example: validating the Create Job form

Applying this fully to the example from section 1, combined with a Page Object (see [Page Object Model](./08-page-object-model/)):

```typescript
import { test, expect } from '../../fixtures/test-fixtures';

const salaryTestCases = [
  { case: 'negative number', value: '-1000', error: /salary must be greater than 0/i },
  { case: 'letters', value: 'abc', error: /salary must be a number/i },
  { case: 'empty', value: '', error: /please enter a salary/i },
  { case: 'too large', value: '999999999999', error: /invalid salary/i },
];

test.describe('Validate minimum salary when creating a Job', () => {
  for (const { case: caseName, value, error } of salaryTestCases) {
    test(`Case: ${caseName}`, async ({ jobsPage }) => {
      await jobsPage.goto();
      await jobsPage.openCreateForm();
      await jobsPage.fillSalaryMin(value); // assuming this method exists on JobsPage
      await jobsPage.submitForm();

      await expect(jobsPage.page.getByText(error)).toBeVisible();
    });
  }
});
```

The test report will show:

```
Validate minimum salary when creating a Job
  ✓ Case: negative number
  ✓ Case: letters
  ✓ Case: empty
  ✗ Case: too large   ← if it fails, you know IMMEDIATELY which case
```

## 5. Applied example: testing across multiple roles

Data-driven testing is also very useful when testing the same behavior across **multiple roles** (see [Authentication & Storage State](./10-authentication-storage-state/)):

```typescript
const roleStorageStates = [
  { role: 'admin', storageState: 'apps/e2e/.auth/user.json', canDelete: true },
  { role: 'ctv', storageState: 'apps/e2e/.auth/ctv.json', canDelete: false },
];

for (const { role, storageState, canDelete } of roleStorageStates) {
  test.describe(`Delete Job permission - ${role} role`, () => {
    test.use({ storageState });

    test(`${role} ${canDelete ? 'CAN' : 'CANNOT'} see the delete Job button`, async ({ jobsPage }) => {
      await jobsPage.goto();
      const deleteButtonVisible = await jobsPage.deleteButton.isVisible().catch(() => false);
      expect(deleteButtonVisible).toBe(canDelete);
    });
  });
}
```

One single block of code, but it verifies the correct permission matrix for both roles.

## 6. Naming tests clearly when data-driven

:::caution[Common mistake: identical test names]
If you write `test('Validate salary', ...)` identically for all 4 datasets, the report will show 4 **identical-looking** lines — you won't know which case failed. Always bake the **value or description of that dataset into the test name**, as shown in sections 3-4 (`` `Invalid minimum salary: "${input}"` ``).
:::

## 7. When NOT to use data-driven testing

Data-driven testing isn't always the best choice:

| Use it when | Avoid it when |
|---|---|
| It's the same flow of actions, only the input/expected result differs | Each case follows a **genuinely different flow** (e.g. one case needs an extra navigation step) |
| There are many datasets (5+), so writing each one out would be very repetitive | There are only 2-3 cases, and writing them separately is still clear and readable |
| You want it to be easy to add new datasets later (just add one line to the array) | Each dataset needs complex, very different setup |

## 8. Practice exercises

1. Add one more dataset to `salaryTestCases` in section 4 for the case "minimum salary greater than maximum salary" — choose a reasonable input and error message yourself.
2. In your own words, explain why the `for` loop that generates multiple `test()` calls must live **outside** a test function, and must never be written as a `for` loop **inside** a single `test()`.
3. Apply data-driven testing to this scenario: searching Candidates with 3 different keywords (one with results, one with no results, one with special characters) — write sample code.
4. Based on the table in section 7, should "testing login for 3 different roles, each redirecting to a different dashboard page" be data-driven? Explain.
5. Modify the code in section 5 to add a third role, `hr-headhunt`, with `canDelete: false`.

## 9. Next steps

1. This wraps up the "core skills" group of Automation Testing lessons — continue with more specialized topics: Visual Regression, Cross-browser & Parallel Execution, Mobile Web Testing.
2. Revisit [Fixtures & Test Data](./09-fixtures-test-data/) and [Authentication & Storage State](./10-authentication-storage-state/) if the examples in sections 4-5 weren't fully clear.

---

**Need help?** Contact your QC Lead or post in #qc-team.
