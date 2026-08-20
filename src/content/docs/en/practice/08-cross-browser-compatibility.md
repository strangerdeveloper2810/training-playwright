---
title: Cross-browser & Compatibility Testing
description: A guide to browser and device compatibility testing for HR Tool
---

# Cross-browser & Compatibility Testing

QC Training Documentation - HR Tool

The exact same feature can work perfectly in Chrome and still break its layout in Safari, or run fine on desktop but be unusable on mobile. This lesson shows you how to test compatibility systematically, instead of only testing on your favorite browser.

## Table of Contents

1. [Why test across browsers/devices](#1-why-test-across-browsersdevices)
2. [Building a compatibility test matrix](#2-building-a-compatibility-test-matrix)
3. [Compatibility testing workflow](#3-compatibility-testing-workflow)
4. [Common issues](#4-common-issues)
5. [Compatibility Testing Checklist](#5-compatibility-testing-checklist)
6. [Practice Exercises](#6-practice-exercises)

---

## 1. Why test across browsers/devices

Every browser (Chrome, Firefox, Safari, Edge) uses a different rendering engine (Blink, Gecko, WebKit...) and may support CSS/JavaScript slightly differently. HR Tool users can be on any browser or device — QC needs to ensure a consistent experience across the most common configurations, following the priority order from [QC Fundamentals](../basics/01-fundamentals/):

1. Chrome (latest) — primary
2. Firefox (latest) — secondary
3. Safari (latest) — Mac only
4. Edge (latest) — Windows only

## 2. Building a compatibility test matrix

A compatibility matrix combines **Browser × Device × Screen size** for a feature that needs thorough coverage:

| | Desktop Chrome | Desktop Safari | Mobile Safari (iOS) | Mobile Chrome (Android) |
|---|:---:|:---:|:---:|:---:|
| **ATS Pipeline (drag-and-drop Kanban)** | ✅ Full test | ✅ Full test | ⚠️ View-only, no drag test (no drag gesture on mobile) | ⚠️ Same |
| **Create Job form** | ✅ Full test | ✅ Full test | ✅ Full test | ✅ Full test |
| **Dashboard charts** | ✅ Full test | ✅ Full test | ✅ Check responsiveness | ✅ Check responsiveness |

Not every feature needs full coverage on every cell — prioritize by risk: features with complex interactions (drag-and-drop, file upload, real-time updates) deserve more thorough testing than simple display features.

## 3. Compatibility testing workflow

1. Pick the feature to test and identify the most important configurations (based on the matrix above).
2. Test it on each browser/device using the **same set of test cases** — you don't need separate test cases per browser.
3. For every bug found, record the exact **browser + version + OS** in the bug report (see [Bug Report Template](../basics/02-bug-report-template/), Browser Versions section).
4. For responsive/mobile checks, use Chrome DevTools' **Device Toolbar** (`Ctrl+Shift+M` / `Cmd+Shift+M`) to quickly simulate multiple screen sizes before testing on a real device.

## 4. Common issues

| Issue type | Example |
|------------|---------|
| **Different CSS rendering** | Flexbox/Grid alignment shifts on Safari, box-shadow renders differently on Firefox |
| **Unsupported JS API** | Using a newer JavaScript API that an older Safari version doesn't support, causing console errors and a broken feature |
| **Broken responsive breakpoints** | The navigation menu overlaps content at an in-between screen width (e.g. a 768px tablet) |
| **Missing fonts/icons** | Icons render as broken boxes on a browser that doesn't support the icon font properly |
| **Different date/file inputs across OS** | The native date picker/file picker UI differs completely between iOS Safari and Windows Chrome — test the actual interaction flow separately |
| **Mouse-only interactions on mobile** | A feature that only works via hover or drag-and-drop won't function on a touchscreen without a fallback |

## 5. Compatibility Testing Checklist

- [ ] Tested on Chrome (Desktop + Mobile)
- [ ] Tested on Safari (Desktop Mac + iOS, if the feature relates to mobile)
- [ ] Tested on Firefox
- [ ] Tested on Edge (if enterprise users run Windows)
- [ ] Checked responsiveness at least at 3 breakpoints: mobile (~375px), tablet (~768px), desktop (~1440px)
- [ ] Verified desktop-only interactions (hover, drag-and-drop) have a reasonable fallback on mobile
- [ ] Recorded the exact browser version/OS in every compatibility-related bug report

## 6. Practice Exercises

1. Open the HR Tool Dashboard page using Chrome DevTools' Device Toolbar, try 3 sizes: 375px, 768px, 1440px — note down anything unusual about the layout.
2. Compare the Login page's appearance across two different browsers (e.g. Chrome and Safari/Firefox) — are there any differences in fonts, spacing, or behavior?
3. For the drag-and-drop Kanban feature in the ATS Pipeline, propose an alternative testing approach suited for touch devices (no mouse).
4. Write a sample bug report for a hypothetical compatibility issue (e.g. a button obscured on Safari) following the template you've learned.

## Next Steps

Continue with [Usability & Accessibility Testing](./09-usability-accessibility-testing/).

---

**Need help?** Contact the QC Lead or post in #qc-team
