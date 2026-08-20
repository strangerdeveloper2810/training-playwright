---
title: CI/CD with GitHub Actions & Reporting
description: Run Playwright tests automatically on GitHub Actions, run them in parallel with sharding, and read the results
---

# CI/CD with GitHub Actions & Reporting

QC Training Documentation - HR Tool

Automation tests only deliver real value when they **run automatically**, without anyone needing to remember to click a button. This lesson covers configuring GitHub Actions to run tests on every Pull Request, running them in parallel for speed, and how to read the results.

## Table of Contents

1. [Why automation tests need CI/CD](#1-why-automation-tests-need-cicd)
2. [Basic GitHub Actions configuration](#2-basic-github-actions-configuration)
3. [Running faster with Matrix & Sharding](#3-running-faster-with-matrix--sharding)
4. [Viewing the report (HTML Report)](#4-viewing-the-report-html-report)
5. [Notifications on failure](#5-notifications-on-failure)
6. [Practice exercises](#6-practice-exercises)

## 1. Why automation tests need CI/CD

If automation tests only run on someone's personal machine, you get:

- Tests that are easy to forget to run before merging.
- Different results on different machines (different Node version, different OS).
- No visibility into whether tests passed when reviewing a Pull Request.

Wiring tests into CI/CD (GitHub Actions) solves all three: tests run automatically, in a consistent environment, with results visible right on the Pull Request.

## 2. Basic GitHub Actions configuration

```yaml
# .github/workflows/playwright.yml
name: Playwright Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright Browsers
        run: npx playwright install --with-deps

      - name: Run Playwright tests
        run: npx playwright test
        env:
          BASE_URL: ${{ secrets.STAGING_BASE_URL }}

      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

Note: `BASE_URL` (or any URL/credential) should come from **GitHub Secrets**, never hardcoded directly in the YAML file.

## 3. Running faster with Matrix & Sharding

As your test suite grows, running it sequentially gets slow. Two techniques help you parallelize:

**Matrix — run across multiple browsers at once:**

```yaml
jobs:
  test:
    strategy:
      matrix:
        browser: [chromium, firefox, webkit]
    steps:
      # ...(same setup steps as above)
      - name: Run tests on ${{ matrix.browser }}
        run: npx playwright test --project=${{ matrix.browser }}
```

**Sharding — split the suite into chunks that run in parallel:**

```yaml
jobs:
  test:
    strategy:
      matrix:
        shard: [1, 2, 3]
    steps:
      # ...(same setup steps as above)
      - name: Run tests (shard ${{ matrix.shard }}/3)
        run: npx playwright test --shard=${{ matrix.shard }}/3
```

You can combine both (matrix by browser × shard) for a very large suite, but weigh the tradeoff — more parallel jobs means more CI runner-minutes consumed.

## 4. Viewing the report (HTML Report)

Playwright generates an HTML report automatically after each run:

```bash
npx playwright show-report
```

The report shows which tests passed/failed, how long each one took, and, for failures, the attached screenshot/trace (if configured, see [Debug & Trace Viewer](./18-debug-trace-viewer-codegen/)). In CI, the report is saved as an artifact (`actions/upload-artifact`) so you can download and inspect it after the job finishes — since CI has no UI to open it directly.

## 5. Notifications on failure

For a team, waiting to check GitHub isn't fast enough. You can wire up automatic Slack notifications when the job fails:

```yaml
      - name: Notify Slack on failure
        if: failure()
        uses: slackapi/slack-github-action@v1
        with:
          payload: |
            {"text": "❌ Playwright tests failed on ${{ github.ref_name }}. See report: ${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}"}
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

:::note[Introductory level]
Setting up the Slack webhook is usually a one-time task for a Tech Lead/DevOps engineer. QC/automation testers should know this mechanism exists and know how to read the notification — you don't necessarily need to set it up yourself.
:::

## 6. Practice exercises

1. Sketch (in words or a diagram) the flow: code gets pushed → what GitHub Actions runs → where the results show up.
2. Explain the difference between "matrix by browser" and "sharding" — when would you use each?
3. Open a sample HTML report (or one already in the hr-tool repo) and find: which test failed, and why (based on the error message/trace if available).

## Next Steps

Next: [Automated Performance & Security Testing](./20-performance-security-testing-tu-dong/) — an introduction to more advanced tooling.

**Need help?** Contact your QC Lead or #qc-team
