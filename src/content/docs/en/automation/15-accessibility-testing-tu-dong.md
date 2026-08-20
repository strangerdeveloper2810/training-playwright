---
title: Accessibility Testing Automation
description: Automatically checking accessibility (a11y) in Playwright tests using axe-core
---

# Accessibility Testing Automation

QC Training Documentation - HR Tool

---

## Table of Contents

1. [Recap: What Is Accessibility](#1-recap-what-is-accessibility)
2. [Installing @axe-core/playwright](#2-installing-axe-coreplaywright)
3. [Writing an Accessibility Test](#3-writing-an-accessibility-test)
4. [Reading the Violations Output](#4-reading-the-violations-output)
5. [Limits: Automation Doesn't Replace Manual Testing](#5-limits-automation-doesnt-replace-manual-testing)

---

## 1. Recap: What Is Accessibility

In [Usability & Accessibility Testing](../practice/09-usability-accessibility-testing/), we covered manually checking accessibility with the Lighthouse/axe DevTools browser extensions. This lesson covers bringing that same check into **automated tests**, so that every code change is automatically screened for new a11y issues instead of relying on someone remembering to run the extension manually.

## 2. Installing @axe-core/playwright

axe-core is an open-source accessibility-checking engine (the same technology behind the axe DevTools extension), with an official Playwright integration:

```bash
npm install --save-dev @axe-core/playwright
```

## 3. Writing an Accessibility Test

```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('login page has no serious accessibility violations', async ({ page }) => {
  await page.goto('/login');

  const results = await new AxeBuilder({ page }).analyze();

  expect(results.violations).toEqual([]);
});
```

`AxeBuilder` scans the current page and returns a list of `violations`. You can narrow the scope or exclude rules you're not ready to enforce yet:

```typescript
const results = await new AxeBuilder({ page })
  .include('#main-content')           // only scan a specific region
  .exclude('.third-party-widget')      // skip a third-party widget you don't control
  .withTags(['wcag2a', 'wcag2aa'])     // only apply WCAG 2.0 Level A and AA rules
  .analyze();
```

:::tip[Start with an exclusion list, then tighten it over time]
Running this against an entire production site on day one can surface hundreds of violations at once, which is overwhelming and hard to act on. A more practical approach: start with the 3-5 most important pages, use `.exclude()` for parts you haven't fixed yet, and shrink that exclusion list gradually sprint by sprint.
:::

## 4. Reading the Violations Output

Each entry in `results.violations` looks like this:

```json
{
  "id": "color-contrast",
  "impact": "serious",
  "description": "Ensures the contrast between foreground and background colors meets WCAG AA",
  "nodes": [
    {
      "target": [".btn-submit"],
      "failureSummary": "Fix any of the following: Element has a contrast ratio of 2.1:1, needs at least 4.5:1"
    }
  ]
}
```

Key fields to read:
- **`id`**: the rule that was violated (e.g. `color-contrast`, `image-alt`, `label`, `aria-required-attr`).
- **`impact`**: severity — `minor`, `moderate`, `serious`, `critical`. Prioritize fixing `serious`/`critical` first.
- **`nodes[].target`**: the CSS selector pinpointing the exact element with the issue, so developers can find it quickly.
- **`nodes[].failureSummary`**: a concrete explanation of why it's a violation and how to fix it.

When filing a bug from this output, use the same [Bug Report Template](../basics/02-bug-report-template/) you already know, tag it with an `accessibility` label, and paste the violation JSON into the Console Log/Error Message section.

## 5. Limits: Automation Doesn't Replace Manual Testing

axe-core (like any automated tool) can only detect issues that show up **structurally in HTML/CSS** — color contrast, missing `alt` text, missing `label`, missing required ARIA attributes, and so on. Accessibility research generally puts automated tools at catching only around 30-40% of real-world accessibility issues.

**What automation CANNOT catch:**
- The actual experience of using a screen reader (VoiceOver, NVDA) — whether the reading order makes sense, whether button names are meaningful when heard without seeing the screen.
- Whether the entire page can be navigated sensibly using only the keyboard (Tab, Enter, Esc).
- Whether image content is actually meaningful (an `alt` attribute exists, but does it accurately describe the image, or is it just filler text to satisfy a tool?).

:::caution
axe-core reporting "0 violations" does NOT mean a page is fully accessible. It only means there are no violations of the rules this particular tool can check. You still need a regular manual testing routine (keyboard navigation, screen reader spot-checks) as covered in the Usability & Accessibility Testing lesson.
:::

## Practice Exercises

1. Install `@axe-core/playwright` in a Playwright project, write a test that scans the HR Tool login page, and print `results.violations.length`.
2. If you find any violations, pick one and write it up using the Bug Report Template you learned earlier.
3. Try `.withTags(['wcag2aa'])` and compare the violation count against an unfiltered scan — explain why they differ.
4. Why isn't "axe-core reports 0 violations" enough to conclude a page is fully accessible? Give two examples of issues axe-core would miss but manual keyboard testing would catch.

## Next Steps

This wraps up the "advanced UI testing" group. Next, move on to testing the API/backend layer: [API Testing with Playwright & tRPC](../automation/16-api-testing-playwright-trpc/).

---

**Need help?** Contact your QC Lead or post in #qc-team
