---
title: Usability & Accessibility Testing
description: A guide to testing usability and accessibility for HR Tool
---

# Usability & Accessibility Testing

QC Training Documentation - HR Tool

A feature that "works correctly" isn't necessarily a feature that's pleasant to use. This lesson covers two important non-functional dimensions: **Usability** (how easy something is to use) and **Accessibility** (whether people with disabilities or limitations can use it).

## Table of Contents

1. [Usability Testing](#1-usability-testing)
2. [Nielsen's 10 Usability Heuristics (condensed)](#2-nielsens-10-usability-heuristics-condensed)
3. [What is Accessibility Testing](#3-what-is-accessibility-testing)
4. [Basic WCAG criteria to check](#4-basic-wcag-criteria-to-check)
5. [Quick self-checks with tools](#5-quick-self-checks-with-tools)
6. [Practice Exercises](#6-practice-exercises)

---

## 1. Usability Testing

Usability testing checks whether users can accomplish their goal **easily, efficiently, and without frustration**. QC doesn't need to be a UX expert, but should develop a reflex for spotting obvious usability problems while doing functional testing.

Questions QC should ask while testing any feature:

- Would a first-time user immediately understand what to do, or would they need to read instructions?
- How many steps/clicks does it take to complete a task? Could it be shortened?
- Are error messages clear and actionable, or do they just say "An error occurred"?
- Do important actions (delete, submit) require confirmation to prevent accidental clicks?

## 2. Nielsen's 10 Usability Heuristics (condensed)

| # | Heuristic | How to apply while testing |
|---|-----------|------------------------------|
| 1 | Visibility of system status | After clicking "Save", is there a clear loading indicator/confirmation? |
| 2 | Match the real world | Is the terminology used in the app understandable to HR staff, not overly technical? |
| 3 | User control & freedom | Is there a Cancel/Back option during a long-running action? |
| 4 | Consistency & standards | Does the "Save" button always sit in the same place, same color, throughout the app? |
| 5 | Error prevention | Does the form validate before submit, instead of letting users submit bad data and only then showing an error? |
| 6 | Recognition over recall | Are previously selected filters remembered when returning to a page? |
| 7 | Flexibility & efficiency | Are there shortcuts/bulk actions for power users? |
| 8 | Aesthetic & minimalist design | Is the page cluttered with unnecessary information? |
| 9 | Help users recognize & recover from errors | Does the error message explain "why" and "how to fix it"? |
| 10 | Help & documentation | Are there tooltips/guides for complex features (like CV Matching)? |

## 3. What is Accessibility Testing

Accessibility (often shortened to **a11y**) ensures software can be used by people with disabilities: visual impairments (using a screen reader), motor difficulties (keyboard-only, no mouse), color blindness, and more. The most common standard is **WCAG** (Web Content Accessibility Guidelines).

This isn't just an ethical concern — many of HR Tool's enterprise and government customers require accessibility compliance as a contractual condition.

## 4. Basic WCAG criteria to check

| Criterion | Meaning | Quick way to test |
|-----------|---------|---------------------|
| **Contrast ratio** | Enough contrast between text and background to read clearly (minimum 4.5:1 for normal text) | Use Lighthouse or a contrast-checking extension |
| **Keyboard navigation** | Every function is usable with the keyboard alone (Tab, Enter, Space, Esc) | Put the mouse away and use `Tab` to move through the entire form/menu |
| **Logical tab order** | The `Tab` order follows the on-screen visual logic | Press `Tab` repeatedly and watch whether focus "jumps around" oddly |
| **Alt text for images** | Images have descriptions a screen reader can announce | Inspect element, check the `alt` attribute |
| **ARIA labels** | Interactive elements (icon-only buttons) have a label so a screen reader understands their purpose | Inspect element, look for `aria-label` |
| **Focus indicator** | When `Tab`-ing to an element, is there a clear outline/highlight showing where focus is? | Observe visually while tabbing |

## 5. Quick self-checks with tools

**Google Lighthouse** (built into Chrome DevTools):

1. Open DevTools (`F12`) → **Lighthouse** tab.
2. Select the **Accessibility** category (you can deselect the others to run faster).
3. Click **Analyze page load**.
4. Read the score and the list of issues, each with a severity level.

**axe DevTools** (browser extension, more detailed than Lighthouse):

1. Install the "axe DevTools" extension for Chrome/Firefox.
2. Open DevTools → the **axe DevTools** tab.
3. Click **Scan ALL of my page**.
4. Review the list of issues — each one explains which WCAG criterion was violated and suggests a fix.

:::tip[Tip]
You don't need to run both tools on every page. Prioritize pages with heavy interaction (Create Job form, Dashboard, ATS Pipeline) — that's where accessibility issues tend to show up most.
:::

## 6. Practice Exercises

1. Open the HR Tool Login page and try to log in **using only the keyboard** (no mouse) — can you complete it? Note any element you couldn't reach with `Tab`.
2. Run Lighthouse Accessibility on the Dashboard page, note the score and at least 2 issues it lists.
3. Run axe DevTools on the Create Job page, list any issues found and their severity.
4. Apply any 3 Nielsen heuristics to evaluate the usability of the "Invite a team member" flow — what would you improve?

## Next Steps

Continue with [Performance Testing - Concepts](./10-performance-testing-khai-niem/).

---

**Need help?** Contact the QC Lead or post in #qc-team
