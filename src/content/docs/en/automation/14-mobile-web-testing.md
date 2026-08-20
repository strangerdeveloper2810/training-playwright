---
title: Mobile Web Testing
description: Testing responsive web UIs on mobile devices using Playwright's device emulation
---

# Mobile Web Testing

QC Training Documentation - HR Tool

---

## Table of Contents

1. [Mobile Web Testing vs. Native App Testing](#1-mobile-web-testing-vs-native-app-testing)
2. [Device Emulation in Playwright](#2-device-emulation-in-playwright)
3. [Writing Tests for Mobile UI](#3-writing-tests-for-mobile-ui)
4. [Limits of Emulation](#4-limits-of-emulation)
5. [When You Need a Real Device](#5-when-you-need-a-real-device)

---

## 1. Mobile Web Testing vs. Native App Testing

It's important to separate two concepts that are easy to confuse:

| | Mobile Web Testing | Native App Testing |
|---|---|---|
| What's under test | A website opened through a browser on a phone (e.g. the HR Tool web app opened in Safari on an iPhone) | A dedicated installed application (e.g. the HR Tool Mobile app built with React Native) |
| Tooling | Playwright (emulates a mobile browser) | Appium, Detox, or manual testing on a device/emulator |
| Covered in this lesson | ✅ Mobile Web Testing | Not covered here |

HR Tool has both a responsive web app (React 19) and a separate native mobile app (React Native, Headhunt mode). This lesson only covers testing the **web app on a small screen** — i.e. verifying responsive design works correctly — not testing the native mobile app.

## 2. Device Emulation in Playwright

Playwright ships with a built-in list of common devices (screen size, user agent, pixel ratio...) that you can emulate without needing a physical device:

```typescript
import { test, expect, devices } from '@playwright/test';

test.use({ ...devices['iPhone 13'] });

test('candidates page renders correctly on mobile', async ({ page }) => {
  await page.goto('/candidates');
  await expect(page.getByRole('heading', { name: 'Candidates' })).toBeVisible();
});
```

Or declare it as a dedicated project in the config (covered in the previous lesson):

```typescript
projects: [
  { name: 'mobile-chrome', use: { ...devices['Pixel 5'] } },
  { name: 'mobile-safari', use: { ...devices['iPhone 13'] } },
],
```

Emulation simulates: viewport size, device pixel ratio, user agent string, and touch support (`hasTouch: true`) — enough to catch most responsive layout issues.

## 3. Writing Tests for Mobile UI

Things worth testing specifically on mobile (beyond what you'd test on desktop):

```typescript
test('main navigation collapses into a hamburger menu on mobile', async ({ page }) => {
  await page.goto('/dashboard');

  // On mobile, the main sidebar is hidden and replaced by a hamburger button
  await expect(page.getByRole('button', { name: 'Menu' })).toBeVisible();
  await expect(page.getByTestId('sidebar-desktop')).not.toBeVisible();

  // Open the menu
  await page.getByRole('button', { name: 'Menu' }).click();
  await expect(page.getByRole('navigation')).toBeVisible();
});

test('data table becomes a card list on mobile', async ({ page }) => {
  await page.goto('/candidates');

  // Desktop renders a <table>; many sites switch to a card list for readability on narrow screens
  await expect(page.getByTestId('candidates-mobile-card-list')).toBeVisible();
});
```

Common mobile-specific bug categories: overlapping text/buttons on narrow screens, tap targets that are too small, modals/dialogs that cover the entire screen with no visible way to close them, long forms that don't scroll properly, and the on-screen keyboard covering the field currently being edited.

## 4. Limits of Emulation

:::caution[Emulation is not a real device]
Playwright's device emulation simulates **screen size and user agent**, but still runs on a **desktop engine** (Chromium/WebKit running on a CI machine or dev laptop, not on real iOS/Android hardware). It will NOT catch:
- Bugs specific to real Mobile Safari on iOS (different from desktop WebKit emulating it).
- Real performance issues on lower-end hardware.
- Real virtual keyboard behavior or real gestures (swipe, pinch-zoom) on an actual OS.
- Bugs tied to a manufacturer's default browser (e.g. Samsung Internet).
:::

Emulation is excellent for catching **responsive layout** bugs (broken layouts, overlapping elements, wrong breakpoints) quickly and cheaply, but it doesn't replace testing on real hardware for deeper issues.

## 5. When You Need a Real Device

| Scenario | Recommended approach |
|---|---|
| Daily responsive-layout checks in CI | Emulation (Playwright) — fast, cheap, automates well |
| Before releasing a feature with heavy mobile impact | Manual testing on at least one real Android device and one real iOS device |
| Suspected performance/animation issue specific to a device | Manual testing on that exact device, or a cloud device farm (BrowserStack, Sauce Labs) |
| Testing the native mobile app (React Native) | Don't use Playwright — use dedicated tools (Appium/Detox) or manual testing |

## Practice Exercises

1. Write a test using `devices['iPhone 13']` to open the HR Tool login page and verify the form still renders fully without a broken layout.
2. Open the Dashboard using `devices['Pixel 5']` emulation and assess for yourself: does the main menu collapse into a hamburger-style menu?
3. Name two categories of mobile bugs that Playwright's device emulation cannot catch, and explain why.
4. If your team can only afford manual testing on one real device before each release, would you pick Android or iOS, and what factors would drive that choice?

## Next Steps

Next, learn how to automatically check accessibility within your tests: [Accessibility Testing Automation](../automation/15-accessibility-testing-tu-dong/).

---

**Need help?** Contact your QC Lead or post in #qc-team
