---
title: Visual Regression Testing
description: Catching UI regressions with screenshot comparison in Playwright
---

# Visual Regression Testing

QC Training Documentation - HR Tool

---

## Table of Contents

1. [What Is Visual Regression Testing](#1-what-is-visual-regression-testing)
2. [Comparing Screenshots with `toHaveScreenshot()`](#2-comparing-screenshots-with-tohavescreenshot)
3. [What Is a Baseline Screenshot](#3-what-is-a-baseline-screenshot)
4. [Updating Baselines After Intentional UI Changes](#4-updating-baselines-after-intentional-ui-changes)
5. [Flakiness and How to Handle It](#5-flakiness-and-how-to-handle-it)
6. [When to Use (or Skip) Visual Regression](#6-when-to-use-or-skip-visual-regression)

---

## 1. What Is Visual Regression Testing

In previous lessons, `expect()` checked concrete values — text, counts, URLs. But some bugs slip past that kind of assertion entirely: a CSS class change pushes the "Save" button off-screen, or text color suddenly matches the background. From a data standpoint everything is still "correct"; visually, the UI is broken.

**Visual regression testing** targets exactly this gap: capture a screenshot of the UI at a known-good moment (the **baseline**), then on every later run, capture a new screenshot and compare it **pixel by pixel** against that baseline. If the difference exceeds an allowed threshold, the test fails and attaches a diff image so QC/developers can see exactly what shifted.

:::note[Not a replacement for functional testing]
Visual regression only catches DISPLAY bugs — it has no idea whether a button actually works. Treat it as an additional layer on top of the behavioral assertions (clickable, shows correct data, etc.) from earlier lessons, not a substitute for them.
:::

## 2. Comparing Screenshots with `toHaveScreenshot()`

Playwright ships with this assertion built in — no extra library needed:

```typescript
import { test, expect } from '@playwright/test';

test('login page matches the baseline', async ({ page }) => {
  await page.goto('/login');
  await expect(page).toHaveScreenshot('login-page.png');
});
```

You can capture the full page, a specific region, or a single element:

```typescript
// Full page
await expect(page).toHaveScreenshot('dashboard-full.png');

// Just one element (e.g. the stat cards on the Dashboard)
await expect(page.locator('[data-testid="stat-cards"]')).toHaveScreenshot('stat-cards.png');
```

On the very first run, Playwright has nothing to compare against — it creates the baseline image automatically and reports the test as "written" rather than pass/fail. From the second run onward, new screenshots are compared against that baseline.

## 3. What Is a Baseline Screenshot

The baseline is the "reference" image committed to the repo, usually stored next to the test file with a name like:

```
tests/auth/login.spec.ts-snapshots/login-page-chromium-darwin.png
```

Notice the filename includes both the **browser** (`chromium`) and the **operating system** (`darwin` = macOS). This matters: rendering on macOS vs. Linux can differ by a few pixels due to font rendering differences, so baselines should be generated on the same environment the tests actually run on — usually CI, not an individual QC's laptop.

:::caution[Baselines must be committed to git]
If you don't commit baseline images, every machine (and every CI run) generates its own baseline from scratch, and the test will always "pass" in a meaningless way — there's nothing real to compare against. Baselines are fixed reference images that should be reviewed on change, just like code.
:::

## 4. Updating Baselines After Intentional UI Changes

When the UI changes on purpose (a redesign, a requested color change...), the old baseline becomes invalid and needs to be overwritten:

```bash
npx playwright test --update-snapshots
```

Recommended workflow:
1. Developers announce an intentional UI change (with a ticket/PR reference).
2. QC re-runs `--update-snapshots` on the same environment used to generate the original baseline (usually CI, or a Docker container matching it).
3. QC **visually reviews** every new image before committing — never update baselines blindly. If a real bug happens to land at the same time as the update, a careless baseline update would "legitimize" that bug.
4. Commit the new baseline images together with the PR so reviewers can see exactly how the UI changed.

## 5. Flakiness and How to Handle It

Visual regression tests are among the most **flaky** (passing sometimes, failing other times with no code change) because many factors outside your control affect individual pixels:

| Cause | Mitigation |
|---|---|
| CSS animation/transition still running when the screenshot is taken | Disable animations during the test: `page.emulateMedia({ reducedMotion: 'reduced' })`, or a test-only CSS rule `* { animation: none !important; }` |
| Dynamic content (current time, random numbers) | Mask that region: `toHaveScreenshot({ mask: [page.locator('.current-time')] })` |
| Small rendering differences between runs due to font rendering | Allow a tolerance: `toHaveScreenshot({ maxDiffPixelRatio: 0.02 })` (up to 2% of pixels may differ) |
| Blinking cursor/caret | Move focus away before the screenshot, or use `caret: 'hide'` |
| Dynamic images (ad banners, random avatars) | Mask them, or use fixed images in test data |

```typescript
await expect(page).toHaveScreenshot('dashboard.png', {
  mask: [page.locator('[data-testid="last-updated-time"]')],
  maxDiffPixelRatio: 0.01,
});
```

## 6. When to Use (or Skip) Visual Regression

**Good fit for:**
- Pages/components that change rarely but matter a lot visually (landing page, email templates, the login page).
- Shared design-system components — a bug here affects the entire product.

**Use sparingly for:**
- Pages with a lot of dynamic content that's hard to fully mask (e.g. a Dashboard with real-time charts).
- Pages whose UI is still changing rapidly during active development — baselines would need constant updates, creating more noise than value.

:::tip[Start small]
Don't try to visually test the entire site on day one. Pick the 5-10 most important pages/components (login, dashboard, shared components in `packages/ui-web`) to start, then expand as your team gets comfortable maintaining baselines.
:::

## Practice Exercises

1. Write a test using `toHaveScreenshot()` to capture the HR Tool login page on Staging. Run it once to create the baseline, then run it again to confirm it passes.
2. Temporarily change one CSS rule (e.g. the button color), rerun the test, and inspect the diff image Playwright generates.
3. Find a region on the Dashboard with dynamic content (a timestamp, a live counter) and write a `mask` to exclude it from the comparison.
4. In your own words, explain why baselines should be generated on CI rather than a local machine.

## Next Steps

Next, learn how to run tests across multiple browsers and in parallel to save time: [Cross-browser & Parallel Execution](../automation/13-cross-browser-parallel-execution/).

---

**Need help?** Contact your QC Lead or post in #qc-team
