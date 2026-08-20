---
title: Fixtures & Test Data
description: How to use Playwright custom fixtures to inject Page Objects into tests, and how to organize test data
---

# Automation Testing - Fixtures & Test Data

QC Training Documentation - HR Tool

## Table of Contents

1. [The problem: every test has to `new` its own Page Object](#1-the-problem-every-test-has-to-new-its-own-page-object)
2. [What is a fixture in Playwright](#2-what-is-a-fixture-in-playwright)
3. [Real example from HR Tool: test-fixtures.ts](#3-real-example-from-hr-tool-test-fixturests)
4. [Using a fixture in a test](#4-using-a-fixture-in-a-test)
5. [Test data: hardcoded vs. data factory](#5-test-data-hardcoded-vs-data-factory)
6. [Real example: HR Tool's test-data.ts](#6-real-example-hr-tools-test-datats)
7. [Faker.js: when you need random data](#7-fakerjs-when-you-need-random-data)
8. [Practice exercises](#8-practice-exercises)
9. [Next steps](#9-next-steps)

---

## 1. The problem: every test has to `new` its own Page Object

In the previous lesson we built `CandidatesPage`. Without anything special, every test has to create its own instance:

```typescript
import { test } from '@playwright/test';
import { CandidatesPage } from '../pages/candidates.page';
import { JobsPage } from '../pages/jobs.page';

test('...', async ({ page }) => {
  const candidatesPage = new CandidatesPage(page);
  const jobsPage = new JobsPage(page);
  // repeat these two lines in EVERY test that needs candidatesPage/jobsPage
});
```

This repeats across hundreds of tests. Playwright's **fixtures** solve exactly this: define it once, use it everywhere.

## 2. What is a fixture in Playwright

A fixture is an "ingredient" that Playwright **automatically prepares** before a test runs and **automatically cleans up** afterward. Playwright ships a few built-in fixtures like `page`, `browser`, `context` — you've already been using them without realizing it:

```typescript
test('...', async ({ page }) => {
  // "page" is already a built-in Playwright fixture
});
```

A **custom fixture** is one the team defines itself, using `test.extend()`. HR Tool uses custom fixtures to automatically prepare 6 Page Objects — tests just "ask" for the one they need.

## 3. Real example from HR Tool: test-fixtures.ts

Here is the real `apps/e2e/fixtures/test-fixtures.ts` in use:

```typescript
import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { DashboardPage } from '../pages/dashboard.page';
import { CandidatesPage } from '../pages/candidates.page';
import { JobsPage } from '../pages/jobs.page';
import { ApplicationsPage } from '../pages/applications.page';
import { InterviewsPage } from '../pages/interviews.page';

type HRToolFixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  candidatesPage: CandidatesPage;
  jobsPage: JobsPage;
  applicationsPage: ApplicationsPage;
  interviewsPage: InterviewsPage;
};

export const test = base.extend<HRToolFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },
  candidatesPage: async ({ page }, use) => {
    await use(new CandidatesPage(page));
  },
  jobsPage: async ({ page }, use) => {
    await use(new JobsPage(page));
  },
  applicationsPage: async ({ page }, use) => {
    await use(new ApplicationsPage(page));
  },
  interviewsPage: async ({ page }, use) => {
    await use(new InterviewsPage(page));
  },
});

export { expect };
```

Breaking it down:

- `base.extend<HRToolFixtures>({...})`: "extends" Playwright's original `test` object with 6 new fixtures.
- `type HRToolFixtures`: declares the type for each fixture — this gives you TypeScript autocomplete and a compile error if you misspell a fixture name.
- Each fixture is a function `async ({ page }, use) => { await use(new XxxPage(page)); }`: Playwright resolves the built-in `page` fixture first, creates `new XxxPage(page)`, then hands it to the test via `use(...)`.
- The file **re-exports `test` and `expect`** — meaning in your test files you import from this file instead of directly from `@playwright/test`.

## 4. Using a fixture in a test

```typescript
import { test, expect } from '../../fixtures/test-fixtures';

test('View candidate details', async ({ candidatesPage }) => {
  await candidatesPage.goto();
  await candidatesPage.searchCandidate('John Smith');
  await candidatesPage.clickCandidate('John Smith');

  expect(await candidatesPage.getToastMessage()).toBeNull();
});

test('Create a new Job and check the list', async ({ jobsPage, dashboardPage }) => {
  // Ask for as many Page Objects as you need in the destructuring
  await jobsPage.goto();
  // ...
});
```

Compared to the manual approach in section 1: you no longer see `new CandidatesPage(page)` anywhere — Playwright creates and hands it over exactly when the test needs it, based on the name you declared in `{ candidatesPage }`.

:::tip[Playwright only creates a fixture when the test actually uses it]
If a test only declares `{ page }` without declaring `{ candidatesPage }`, Playwright **won't** bother creating a `CandidatesPage` for that test. Fixtures are only instantiated "lazily" (on demand), which keeps tests fast.
:::

## 5. Test data: hardcoded vs. data factory

Besides Page Objects, every test needs **data** to fill forms, search for, and compare results against. There are two common ways to organize test data:

| Approach | Description | Pros | Cons |
|---|---|---|---|
| **Hardcoded** | Fixed objects/constants defined up front (what HR Tool currently uses) | Simple, readable, stable data across runs | If two tests run in parallel and create data with the same name/email, they may collide |
| **Data factory** | A function that generates fresh data on every call (usually paired with a library like `faker.js`) | Different data every run, avoids collisions, tests are more independent | Results aren't fixed, harder to debug the exact data used unless you log it |

## 6. Real example: HR Tool's test-data.ts

HR Tool currently uses the **hardcoded** approach. Here's the real structure of `apps/e2e/utils/test-data.ts` (real values replaced with placeholders so no real login credentials are exposed):

```typescript
export const TEST_USERS = {
  hr: {
    email: process.env.TEST_USER_EMAIL || '[TEST_HR_EMAIL]',
    password: process.env.TEST_USER_PASSWORD || '[TEST_HR_PASSWORD]',
    role: 'hr',
  },
  admin: {
    email: process.env.TEST_USER_EMAIL || '[TEST_ADMIN_EMAIL]',
    password: process.env.TEST_USER_PASSWORD || '[TEST_ADMIN_PASSWORD]',
    role: 'admin',
  },
  techLead: {
    email: '[TEST_TECHLEAD_EMAIL]',
    password: '[TEST_TECHLEAD_PASSWORD]',
    role: 'tech_lead',
  },
};

export const SAMPLE_CV = {
  fullName: 'John Test',
  email: 'test.candidate@example.com',
  phone: '0901234567',
  skills: ['JavaScript', 'TypeScript', 'React', 'Node.js'],
  experience: '3 years of experience as a Frontend Developer',
};

export const APPLICATION_STAGES = {
  APPLIED: 'applied',
  SCREENING: 'screening',
  INTERVIEW: 'interview',
  OFFER: 'offer',
  HIRED: 'hired',
  REJECTED: 'rejected',
} as const;
```

:::caution[Why read credentials from `process.env` first, with a hardcoded fallback?]
`process.env.TEST_USER_EMAIL || '[TEST_HR_EMAIL]'` means: **prefer** the value from an environment variable (set separately on CI or a local `.env` file), and only fall back to the hardcoded value if the environment variable doesn't exist. This is how teams avoid committing real credentials to git — but you still need to make sure the hardcoded "fallback" value is never itself a real, working credential.
:::

`APPLICATION_STAGES` uses `as const` — a TypeScript syntax that turns the object's values into fixed "literal types" (`'applied' | 'screening' | ...'`) instead of the general `string` type, so if you typo `'aplied'`, TypeScript flags it at compile time.

## 7. Faker.js: when you need random data

If the team ever needs to generate many Candidates/Jobs with different data (e.g. for performance testing, or to avoid email collisions when tests run in parallel), you can use the [`@faker-js/faker`](https://fakerjs.dev/) library:

```typescript
import { faker } from '@faker-js/faker';

function createRandomCandidate() {
  return {
    fullName: faker.person.fullName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
  };
}
```

This is called a **data factory** — a function that "produces" fresh test data on every call, instead of reusing one fixed dataset.

## 8. Practice exercises

1. Add an `employeesPage` fixture to `HRToolFixtures` (assuming an `EmployeesPage` class already exists) — just write the correct syntax, no need to actually run it.
2. Explain: if two test files run in parallel and both use `TEST_USERS.admin` to log in, what could go wrong? Suggest one way to avoid it (hint: see [Authentication & Storage State](./10-authentication-storage-state/)).
3. Write a `createRandomJob()` function using `faker.js` (hypothetically) that returns `{ title, skills, experience }` with random data.
4. In your opinion, should `SAMPLE_CV` and `SAMPLE_JD` in `test-data.ts` stay hardcoded, or move to a data factory? Justify your answer using the comparison table in section 5.
5. Look at the `test-fixtures.ts` code in section 3: if you add a new fixture but forget to add it to `type HRToolFixtures`, what happens when TypeScript compiles?

## 9. Next steps

1. Continue with [Authentication & Storage State](./10-authentication-storage-state/) — how to avoid logging in again in every single test.
2. Revisit [Page Object Model](./08-page-object-model/) if it's not yet clear why Page Objects come before fixtures.

---

**Need help?** Contact your QC Lead or post in #qc-team.
