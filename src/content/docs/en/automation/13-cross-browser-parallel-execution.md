---
title: Cross-browser & Parallel Execution
description: Running tests across multiple browsers and in parallel to cut down test time
---

# Cross-browser & Parallel Execution

QC Training Documentation - HR Tool

---

## Table of Contents

1. [Why Test Across Multiple Browsers](#1-why-test-across-multiple-browsers)
2. [Declaring `projects` in playwright.config.ts](#2-declaring-projects-in-playwrightconfigts)
3. [Running in Parallel with `workers`](#3-running-in-parallel-with-workers)
4. [Sharding on CI](#4-sharding-on-ci)
5. [Balancing CI Speed vs. Coverage](#5-balancing-ci-speed-vs-coverage)

---

## 1. Why Test Across Multiple Browsers

In [Web Basics](../basics/03-web-basics/) we learned that QC needs to test across multiple browsers because each browser engine (Chromium, Firefox/Gecko, Safari/WebKit) can render CSS or support JavaScript APIs differently. Automated testing needs to do the same thing — run the SAME test suite against multiple engines to catch compatibility issues early instead of relying solely on manual testing.

Playwright supports all three major engines (Chromium, Firefox, WebKit) and can emulate mobile devices purely through configuration, with no need to rewrite any tests.

## 2. Declaring `projects` in playwright.config.ts

A "project" in Playwright is a run configuration — the same test suite executed against a different browser or device:

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 13'] },
    },
  ],
});
```

Running `npx playwright test` executes the **entire** suite against **all 5 projects** — total runs = number of test cases × number of projects. You can run a single project on its own:

```bash
npx playwright test --project=firefox
npx playwright test --project=mobile-safari
```

:::tip[Use meaningful project names]
Project names (`chromium`, `mobile-safari`, etc.) show up in reports and error logs. Clear names let QC immediately identify which browser/device a failure came from without digging into details.
:::

## 3. Running in Parallel with `workers`

By default, Playwright runs multiple test files **in parallel** using several worker processes, cutting total run time significantly:

```typescript
export default defineConfig({
  fullyParallel: true,       // tests within the SAME file also run in parallel
  workers: process.env.CI ? 2 : undefined, // cap workers on CI, unlimited locally
});
```

- **Local**: Playwright automatically sizes worker count based on the machine's CPU cores.
- **CI**: set an explicit number (e.g. 2-4) since CI machines usually have fewer CPUs than a developer's laptop — too many workers can actually slow things down or cause timeouts due to resource contention.

:::caution[Tests must be independent]
Running in parallel is only safe when tests **don't depend on execution order** and **don't share data that could conflict** (e.g. two tests both editing the same record). If two tests both create a Job named "Test Job" at the same time, one may fail due to a data collision — this is a common source of flakiness once parallel execution is turned on.
:::

## 4. Sharding on CI

Once a test suite grows large (hundreds of tests), simply raising `workers` on a single machine hits a CPU/RAM ceiling. **Sharding** solves this by splitting the suite across **multiple CI machines running in parallel**, each handling a slice:

```bash
# Machine 1 of 4
npx playwright test --shard=1/4

# Machine 2 of 4
npx playwright test --shard=2/4
```

Example GitHub Actions config running 4 shards in parallel (CI/CD details are covered in [CI/CD & Reporting](../automation/19-cicd-github-actions-reporting/)):

```yaml
strategy:
  matrix:
    shard: [1, 2, 3, 4]
steps:
  - run: npx playwright test --shard=${{ matrix.shard }}/4
```

`workers` and sharding solve two different problems: `workers` parallelizes **within one machine**; sharding splits work **across multiple machines**. Combining both gives the best throughput for a large suite.

## 5. Balancing CI Speed vs. Coverage

Running the full cross-browser matrix (5 projects) for EVERY test isn't always the right call — it multiplies CI time by 5. A more practical approach:

| Strategy | When to use it |
|---|---|
| Run all 5 projects | Before a release, or on a scheduled nightly build |
| Run `chromium` only | On every push / every open Pull Request — fast feedback matters most |
| Run `chromium` + one mobile project | A reasonable balance for per-PR CI if the team's time budget allows |

:::note
There's no single correct formula — this decision depends on your CI time budget, test suite size, and how critical early cross-browser detection is for the project. Discuss with your Tech Lead to settle on a strategy that fits.
:::

## Practice Exercises

1. Add a `mobile-chrome` project (using `devices['Pixel 5']`) to a `playwright.config.ts` file in a Playwright project you're practicing with, then run `--project=mobile-chrome` to confirm it works.
2. Run `npx playwright test --project=chromium --project=webkit` (two specific projects at once) and compare the total time against running all 5 projects.
3. Explain why two tests that both create data named "Test Candidate" could cause flakiness when run in parallel, and propose a fix (hint: use unique data, e.g. appending a timestamp to the name).
4. If your team has 200 test cases and a CI time budget of only 10 minutes per run, which strategy from the table in section 5 would you pick, and why?

## Next Steps

Next, learn how Playwright emulates mobile devices to test responsive web UIs: [Mobile Web Testing](../automation/14-mobile-web-testing/).

---

**Need help?** Contact your QC Lead or post in #qc-team
