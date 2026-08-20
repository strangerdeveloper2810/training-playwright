---
title: "Case Study: Organizing Test Suites by Business Domain"
description: Analyzing how hr-tool organizes tests for the ATS Pipeline and CTV Portal to extract principles for other domains
---

# Case Study: Organizing Test Suites by Business Domain

QC Training Documentation - HR Tool

---

## Table of Contents

1. [Why organize by domain, not by page/URL](#1-why-organize-by-domain-not-by-pageurl)
2. [Case 1: ATS Pipeline — scaffold the tests first, skip when data is missing](#2-case-1-ats-pipeline--scaffold-the-tests-first-skip-when-data-is-missing)
3. [Case 2: CTV Portal — suite-level storageState and unique data](#3-case-2-ctv-portal--suite-level-storagestate-and-unique-data)
4. [General principles for other domains](#4-general-principles-for-other-domains)

---

## 1. Why organize by domain, not by page/URL

There are two common ways to organize a large automation test suite:

- **By page/URL** (`tests/pages/departments.spec.ts`, `tests/pages/positions.spec.ts`...) — easy to start with, but once a system grows, a single business process (e.g. "recruiting") spans multiple pages (Jobs → Candidates → Applications → Interviews), and tests end up scattered, making the overall picture hard to see.
- **By business domain** (`tests/ats/`, `tests/referral/`, `tests/recruitment/`...) — group tests by the real business flow, regardless of how many pages/APIs it touches.

HR Tool chose the second approach. Below we analyze two real domains: the **ATS Pipeline** (`tests/ats/application-pipeline.spec.ts`) and the **CTV Portal** (`tests/referral/ctv-portal.spec.ts`) to see the benefits of this organization clearly.

## 2. Case 1: ATS Pipeline — scaffold the tests first, skip when data is missing

```ts
import { test, expect } from '../../fixtures/test-fixtures';
import { APPLICATION_STAGES } from '../../utils/test-data';

test.describe('SCRUM-118: Application Pipeline (ATS)', () => {
  test.describe('Application List Page', () => {
    test('TC-ATS-001: Displays the applications page', async ({ applicationsPage }) => {
      await applicationsPage.goto();
      await expect(applicationsPage.pageTitle).toBeVisible();
      await expect(applicationsPage.createButton).toBeVisible();
    });
    // ...
  });

  test.describe('Stage Transitions', () => {
    // TODO: Implement when there's test data
    test.skip('TC-ATS-009: Applied → Screening transition', async ({ page }) => {
      // Navigate to application detail
      // Change stage to screening
      // Verify stage changed
    });
    test.skip('TC-ATS-010: Screening → Interview transition', async ({ page }) => { /* ... */ });
    test.skip('TC-ATS-011: Interview → Offer transition', async ({ page }) => { /* ... */ });
    test.skip('TC-ATS-012: Offer → Hired transition', async ({ page }) => { /* ... */ });
    test.skip('TC-ATS-013: Reject a candidate from any stage', async ({ page }) => { /* ... */ });
  });
});
```

**What's worth learning here isn't the code that runs — it's the code that DOESN'T run yet:**

- Every `test.describe` block is organized around the **real ATS business flow**: List Page → Creation → Stage Transitions → Pipeline Stats — the order an application actually moves through in real life, not the order pages appear in a menu.
- Tests use **custom fixtures** (`applicationsPage`, `dashboardPage`) that are injected automatically instead of manually creating `new ApplicationsPage(page)` in every test — this keeps tests short and focused on business logic instead of repeating setup code.
- The five stage-transition test cases (Applied → Screening → Interview → Offer → Hired) are written **deliberately with `test.skip()`** and a `// TODO: Implement when there's test data` comment — this is NOT something forgotten, it's a technique: **"scaffold the tests first, skip when a precondition is missing."**

:::tip[Why skipping is better than not writing the test at all]
If this test didn't exist, nobody would know the "stage transition" flow isn't automated yet — it would simply be invisible. But once it's written and marked `test.skip()`, every CI run's report clearly shows **"5 skipped"** — a visible signal reminding the team there's technical debt here, instead of a TODO comment buried in code that nobody rereads.
:::

## 3. Case 2: CTV Portal — suite-level storageState and unique data

```ts
import { test, expect } from '../../fixtures/test-fixtures';

test.use({ storageState: 'apps/e2e/.auth/ctv.json' });

test.describe('CTV portal', () => {
  test('should submit a candidate via the job picker', async ({ page }) => {
    await page.goto('/ctv/submit');
    // ... pick a job from the dropdown

    // Unique candidate so the attribution engine doesn't reject as duplicate.
    const email = `ctv.e2e.${Date.now()}@seed.test`;
    await page.locator('input[name="fullName"]').fill('E2E CTV Candidate');
    await page.locator('input[name="email"]').fill(email);

    await page.getByRole('button', { name: 'Nộp', exact: true }).click();
    await expect(page.getByText('Đã nộp ứng viên').first()).toBeVisible({ timeout: 15000 });
  });

  test('should list my submissions', async ({ page }) => { /* ... */ });
  test('should list my commissions', async ({ page }) => { /* ... */ });
});
```

Two things worth noticing:

**1. `test.use({ storageState: ... })` sits at the top of the file, applying to the ENTIRE SUITE** (unlike the previous case study, where a single test overrode storageState locally). Since all three tests in this file need to run as the CTV (collaborator) role, declaring it once at the top of the `describe` block avoids repeating it per test, and makes it obvious from the very first lines of the file which role this whole suite runs as.

**2. Generating a unique email with `Date.now()`** — the code comment explains exactly why: HR Tool has an "attribution engine" (a first-submitted-wins mechanism for candidate ownership), and if two test runs used the same email, the second run would be rejected as a duplicate candidate — not because the test is wrong, but because that's exactly correct business behavior. This is a textbook example of a broader principle: **when a business process has an anti-duplication mechanism, test data must also be unique per run**, otherwise a test will pass the first time and then fail (or pass for the wrong reason) on every subsequent run.

:::caution[The risk of not doing this]
If the email were hardcoded, the first CI run would pass, but the second run would fail because the system blocks the duplicate — QC could easily mistake this for a new bug and waste time investigating something that is, in fact, a test-data design problem.
:::

## 4. General principles for other domains

From the two cases above, here are organizing principles for domain-based test suites that apply to any business process (CV Matching, Payroll, Onboarding...):

1. **Group `test.describe` blocks around the real business flow**, not the order pages appear in the UI — anyone reading the report should immediately understand what real-world process is being tested.
2. **Use shared fixtures** for page objects/data that repeat across a domain, to avoid duplicating setup code.
3. **Use deliberate `test.skip()` with a reason comment** when you know a business branch isn't testable yet (missing data, missing environment) — don't let it silently disappear from the suite.
4. **Use `test.use({ storageState })` at the file level** when the whole suite runs under one fixed role, and only override it at the individual-test level when a specific test needs a different role.
5. **Generate unique test data** on every run, especially when the business logic has uniqueness/anti-duplication constraints (email, ID, slug...).

## Practice Exercises

1. Pick another HR Tool business domain (e.g. CV Matching or Interview scheduling). Sketch the `test.describe` blocks you'd organize, following the real business flow.
2. For one of the five `test.skip()` cases in the ATS Pipeline, write full pseudo-code for it (e.g. TC-ATS-009), assuming you now have the test data you need.
3. Explain, in your own words, why using `Date.now()` to generate a test email is better than a fixed email, given HR Tool's "attribution engine."

## Next steps

Next: [Multi-role Auth & Permission Testing](../case-studies/03-multi-role-auth-permission/)

---

**Need help?** Contact your QC Lead or post in #qc-team
