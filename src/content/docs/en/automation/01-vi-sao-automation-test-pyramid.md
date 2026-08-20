---
title: Why Automation Testing?
description: What automation testing is, the Test Automation Pyramid, ROI, and when to automate vs. test manually
---

# Why Automation Testing?

QC Training Documentation - HR Tool

**Version:** 1.0
**Updated:** 2026-08-20
**Author:** QC Team

---

## Table of Contents

1. [What is Automation Testing?](#1-what-is-automation-testing)
2. [Why do we need Automation Testing?](#2-why-do-we-need-automation-testing)
3. [The Test Automation Pyramid](#3-the-test-automation-pyramid)
4. [When to automate, when to stay manual](#4-when-to-automate-when-to-stay-manual)
5. [Automation Testing Workflow](#5-automation-testing-workflow)
6. [The learning path in this section](#6-the-learning-path-in-this-section)
7. [Practice Exercises](#7-practice-exercises)

---

## 1. What is Automation Testing?

In earlier lessons you got comfortable with **manual testing**: opening a browser yourself, clicking, typing data, watching the result, and comparing it to what you expected. That approach is flexible, but it has one problem — every time HR Tool ships a release, you repeat the exact same steps, dozens of times, week after week.

**Automation Testing** means writing code that performs those steps for you: it opens the browser, clicks, types, compares the result — and reports pass/fail on its own.

```
┌─────────────────────────────────────────────────────────────────┐
│                    MANUAL vs AUTOMATION                          │
├─────────────────────────────────────────────────────────────────┤
│  Manual Testing               Automation Testing                 │
│  ┌─────────────┐            ┌─────────────────────┐             │
│  │   Tester    │            │    Test Script      │             │
│  │  (Human)    │            │    (Code)           │             │
│  └──────┬──────┘            └──────────┬──────────┘             │
│         ▼                              ▼                         │
│  Click, type data,          Automatically clicks, types,        │
│  eyeball the result         checks with assertions               │
│         ▼                              ▼                         │
│  Manual report              Automatic report + screenshots       │
└─────────────────────────────────────────────────────────────────┘
```

Automation **does not replace** manual testing — it frees you from repetitive work so you can spend time on things a machine cannot do: exploratory testing, UX judgment, thinking up new edge cases.

## 2. Why do we need Automation Testing?

| Benefit | Explanation |
|---------|-------------|
| **Speed** | An automation suite runs 10-100x faster than doing it by hand |
| **Reliability** | Machines don't get tired, don't skip steps, run identically every time |
| **Reusability** | Write once, run again every day, every deploy |
| **Long-term cost savings** | Higher upfront cost, but re-running is nearly free |
| **Parallel execution** | Test multiple browsers/devices at once |
| **Runs 24/7** | Hook it into CI/CD and it runs on every new commit |

**A real cost comparison, for a 50-case regression suite on HR Tool:**

```
Manual Testing:
- 50 cases × 5 min/case = 250 minutes (~4 hours) per run
- Re-run ~5 times per 2-week sprint → 20 hours/sprint

Automation Testing:
- Writing 50 cases × 30 min/case = 25 hours (one time only)
- Re-running: ~10 minutes (fully automated, no one has to watch)
- From sprint 2 onward: essentially free in terms of human time
```

:::tip[Automation isn't "cheap" from day one]
Writing an automated test costs **more** upfront than testing it once by hand. Automation only pays off once that test case is run **many times** (regression, smoke). Don't automate a test case that only runs once and gets discarded.
:::

## 3. The Test Automation Pyramid

The Test Pyramid is the classic model describing **how many tests you should have at each layer**:

```
                    ▲
                   /│\
                  / │ \        UI / E2E Tests
                 /  │  \       - Fewest (~10%)
                /   │   \      - Slowest, most expensive
               ───────────
              /      │      \
             /       │       \    Integration Tests
            /        │        \   - Moderate amount (~20%)
           /         │         \
          ─────────────────────
         /           │           \
        /            │            \   Unit Tests
       /             │             \  - Most numerous (~70%)
      /              │              \ - Fastest, cheapest
     ───────────────────────────────
```

| Layer | Who writes it | Quantity | Speed | Scope |
|-------|---------------|----------|-------|-------|
| **Unit Tests** | Developer | Most | Very fast (ms) | Tests a single function/method in isolation |
| **Integration Tests** | Dev + QC | Moderate | Medium (seconds) | Tests multiple modules working together (e.g. API + DB) |
| **UI/E2E Tests** | QC | Fewest | Slow (seconds-minutes) | Tests a full user journey through the UI |

**Applied to HR Tool:**
- **Unit Tests**: developers write these for services/functions in `apps/api` (Jest) and components in `apps/web` (Jest + React Testing Library).
- **Integration Tests**: testing tRPC routers against a real database.
- **E2E Tests**: QC writes these with Playwright — simulating a real user opening a browser, logging in, and performing a business flow (creating a Job, screening a CV, moving a candidate through pipeline stages...).

Why UI/E2E tests should be the **smallest layer**: they're slow (a real browser has to launch), fragile when the UI changes (flaky), and much more expensive to maintain than unit tests. QC should focus UI automation on the **most important** flows (login, the core hiring flow), not try to automate every single test case.

## 4. When to automate, when to stay manual

```
✅ GOOD FIT FOR AUTOMATION               ✅ GOOD FIT FOR MANUAL
- Repetitive test cases (regression,     - Exploratory testing (free-form discovery)
  smoke tests on every deploy)           - Usability testing (UX/UI judgment)
- Stable cases, UI rarely changes        - New, not-yet-stable features
- Cases with many data combinations      - One-off tests (hotfix verification)
- Needs multi-browser/device coverage    - Needs visual/design judgment
- API testing (fast response, easy)      - Too complex to automate reasonably
```

:::caution[A common mistake]
Don't try to automate **every** test case from day one. Pick the important, stable, frequently-repeated flows first (login, creating a candidate, the ATS pipeline) and automate those. Automating a feature whose UI is still changing constantly will cost you more in test maintenance than the test itself ever saves.
:::

## 5. Automation Testing Workflow

```
1. ANALYZE   → Review manual test cases, pick good automation candidates
2. DESIGN    → Design Page Objects, decide locators, plan test structure
3. DEVELOP   → Write the test script, prepare test data
4. EXECUTE   → Run locally, run on CI/CD, review the report
5. MAINTAIN  → Update tests when the UI changes, fix flaky tests, add new ones
```

Automation isn't "write it once and forget it" — the **MAINTAIN** step usually costs more effort than you'd expect, because HR Tool's UI keeps evolving.

## 6. The learning path in this section

The "Automation Testing" group has 21 lessons, going from fundamentals to advanced topics. Here's a suggested 6-week pace if you're learning this alongside your day-to-day manual testing work:

| Week | Topics |
|------|--------|
| 1 | Why automation (this lesson), TypeScript/Node.js basics, Unit testing basics, Playwright 101 |
| 2 | Locators, Actions, Assertions |
| 3 | Page Object Model, Fixtures & Test Data, Authentication & Storage State |
| 4 | Data-driven testing, Visual regression, Cross-browser/parallel, Mobile web, Automated accessibility |
| 5 | API/tRPC testing, Database verification, Debugging (Trace Viewer, Codegen) |
| 6 | CI/CD, Automated performance/security testing, Best Practices & Cheatsheet |

You don't have to go through it 100% linearly, but you should follow the order within each week — later lessons build on the ones before them.

## 7. Practice Exercises

1. List 5 test cases you currently run manually every sprint for HR Tool. For each one, decide: should it be automated or stay manual? Justify using the table in section 4.
2. Sketch out the Test Pyramid for your own QC team today — estimate what percentage of your current tests sit at each layer (it's very likely most of it is manual UI testing right now — is that a problem?).
3. For the "Log in to HR Tool" flow, estimate the time cost of testing it manually every day for a month, versus the one-time cost of automating it.

## Next Step

Continue with [TypeScript & Node.js Basics for Testers](../automation/02-typescript-nodejs-co-ban-cho-tester/) — the coding foundation you need before writing Playwright tests.

---

**Need help?** Contact your QC Lead or post in #qc-team
