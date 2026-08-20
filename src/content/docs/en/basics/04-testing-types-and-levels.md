---
title: Testing Types and Levels
description: Classifying testing by function, level, and technique - foundational knowledge for QC
---

# Testing Types and Levels

QC Training Documentation - HR Tool

**Version:** 1.0
**Updated:** 2026-08-20
**Author:** QC Team

---

## Table of Contents

1. [Why Classify Testing at All](#1-why-classify-testing-at-all)
2. [Test Levels](#2-test-levels)
3. [Functional Testing in Detail](#3-functional-testing-in-detail)
4. [Non-Functional Testing in Detail](#4-non-functional-testing-in-detail)
5. [Testing by Technique: Black-box, White-box, Grey-box](#5-testing-by-technique-black-box-white-box-grey-box)
6. [Smoke vs Sanity vs Regression vs Retesting](#6-smoke-vs-sanity-vs-regression-vs-retesting)
7. [Summary Table](#7-summary-table)

---

## 1. Why Classify Testing at All

In [QC Fundamentals](./01-fundamentals/), you learned there are many kinds of testing: functional, non-functional, smoke, regression... But knowing the names isn't enough — without understanding what each one actually means, you'll get confused when planning a test cycle or when someone asks "what kind of test is this?" in a review.

This lesson organizes the whole picture into three distinct lenses:

- **By level** — at which stage of the software lifecycle testing happens.
- **By goal** — whether testing checks "does it do the right thing" or "does it do it well" (performance, UX, etc.).
- **By technique** — whether the tester can see the code underneath or not.

:::note[Tip]
These three lenses aren't mutually exclusive. A single test case can be System Testing (level) AND Functional Testing (goal) AND Black-box Testing (technique) — all at once.
:::

---

## 2. Test Levels

Test Level describes which "layer" of the system is being tested, from smallest to largest:

```
Unit Testing
    ↓ (individual functions/modules in isolation)
Integration Testing
    ↓ (multiple modules combined)
System Testing
    ↓ (the whole system, end-to-end)
Acceptance Testing (UAT)
    ↓ (customer/stakeholder sign-off)
```

| Level | Checks | Who does it | HR Tool example |
|-------|--------|--------------|-------------------|
| **Unit Testing** | Whether a single function/method behaves correctly in isolation | Developer | The CV-JD match-scoring function returns the correct percentage given two specific skill sets |
| **Integration Testing** | Whether multiple modules/services work correctly together (API calling the database, backend calling an AI provider...) | Developer, sometimes QC | Does the `candidate.create` router correctly save data to PostgreSQL and trigger the right matching job in BullMQ? |
| **System Testing** | The entire system, from UI to backend, following a real user flow | QC | Log in → create a Job → create a Candidate → view CV Matching score → move the Candidate through ATS stages |
| **Acceptance Testing (UAT)** | Whether the system meets the actual business needs of the customer/stakeholder | BA, Product Owner, customer, often supported by QC | A recruitment agency customer trials the Client Requisition Portal flow before go-live |

:::tip[Why QC should still understand Unit/Integration Testing]
Even though QC mostly works at the System Testing and UAT levels, understanding Unit/Integration Testing helps you: (1) know how far the developer already tested, so you don't waste time re-testing simple logic, (2) write more accurate bug reports because you can guess which layer a bug likely lives in, and (3) transition more easily into automation testing later (unit tests are the foundation for understanding Playwright tests).
:::

---

## 3. Functional Testing in Detail

Functional Testing answers: **"Does the feature work correctly according to requirements?"** This is what QC does the most, day to day.

| Type | Description | HR Tool example |
|------|--------------|--------------------|
| **Unit Function Testing** | Testing a single feature in isolation | The login form is tested only for email/password entry |
| **Integration Function Testing** | Testing how features interact | After a Job is created, does it correctly appear in the list Candidates can apply to? |
| **Regression Testing** | Re-testing existing features after a change, to make sure nothing broke (see [Regression Checklist](../practice/05-regression-test-checklist/)) | After fixing a CV Matching bug, re-test the whole ATS flow to see if anything else was affected |
| **Smoke Testing** | A quick check of the most critical flows right after deployment, to decide whether deeper testing is worthwhile (see [Smoke Checklist](../practice/03-smoke-test-checklist/)) | After deploying to Staging, verify login + dashboard + Job creation work within 10 minutes |
| **Sanity Testing** | A narrow, focused check of exactly what was just changed | Dev reports a fix for "CV upload fails above 5MB" → re-test only the CV upload flow |

---

## 4. Non-Functional Testing in Detail

Non-Functional Testing answers: **"HOW WELL does the system behave?"** — not right/wrong functionality, but overall quality.

| Type | Core question | HR Tool example | Detailed lesson |
|------|----------------|--------------------|-------------------|
| **Performance Testing** | Is the system fast enough, and how much load can it handle? | How long does the Dashboard take to load when a company has 10,000 Candidates? | [Performance Testing Concepts](../practice/10-performance-testing-khai-niem/) |
| **Security Testing** | Is data properly protected, are there exploitable vulnerabilities? | Can Company A view Company B's Candidate data (a multi-tenant violation)? | [Security Testing Basics](../practice/11-security-testing-co-ban/) |
| **Usability Testing** | Is the system easy and intuitive to use? | Can a new HR employee find the "Create Job" button without a tutorial? | [Usability & Accessibility](../practice/09-usability-accessibility-testing/) |
| **Compatibility Testing** | Does it work correctly across browsers/devices/OSes? | Does the ATS Kanban board support drag-and-drop on both Safari and Chrome? | [Cross-browser Compatibility](../practice/08-cross-browser-compatibility/) |
| **Accessibility Testing** | Can users with disabilities (visual, motor, etc.) use the product? | Can the entire Job creation form be navigated using only the keyboard (Tab, Enter)? | [Usability & Accessibility](../practice/09-usability-accessibility-testing/) |
| **Localization/i18n Testing** | Is content displayed correctly for each language/region? | HR Tool ships English (`en/`) and Vietnamese (`vi/`) translations — does switching languages break layout, drop text, or leave English strings in the Vietnamese version? | (falls under Compatibility/Usability) |

:::caution[A real localization example at HR Tool]
HR Tool is a bilingual product (`en/` and `vi/` locales per domain under `apps/web/src/locales/`). This is a very common bug pattern: a new feature ships with a complete English translation but a missing Vietnamese one, or vice versa — and because the UI still "works", this kind of bug slips through ordinary smoke testing unless you check both languages deliberately.
:::

---

## 5. Testing by Technique: Black-box, White-box, Grey-box

This lens classifies testing by **how much of the underlying code you can see**:

| Technique | Can you see the code? | Characteristics | Who typically does it |
|-----------|--------------------------|------------------|--------------------------|
| **Black-box Testing** | No | Testing purely through the UI/API like a real user, with no concern for internal implementation | QC (most day-to-day work) |
| **White-box Testing** | Yes | Testing based on internal logic, branch conditions (if/else), line-level coverage | Developer (unit tests) |
| **Grey-box Testing** | Partially | Knowing enough about architecture/data flow (e.g. API endpoints, DB schema) without reading every line of code, and using that knowledge to test more effectively | Experienced QC, automation testers |

:::tip[Why Grey-box matters for a Fullstack Tester]
As you learn more about system architecture ([Fullstack Architecture](../foundations/01-kien-truc-fullstack-cho-tester/)) and how to read data in the database ([Database Fundamentals](../foundations/03-database-co-ban-cho-tester/)), you gradually move from Black-box toward Grey-box testing — testing becomes far more effective because you know exactly where to look when you suspect a bug.
:::

---

## 6. Smoke vs Sanity vs Regression vs Retesting

These four terms are the most commonly confused. Here's a clear breakdown:

| Term | Scope | When it's done | Goal |
|------|-------|------------------|------|
| **Smoke Testing** | Broad but shallow — only the most critical flows | Right after deployment | Decide "is this build even worth testing more deeply?" |
| **Sanity Testing** | Narrow, focused on one specific area just changed | After being told a specific bug/feature was fixed | Quickly confirm that change works, without full coverage |
| **Regression Testing** | Broad and deep — re-tests related (old + new) functionality | Before release, or after a large change affecting many modules | Make sure the new change didn't break existing, previously working functionality |
| **Retesting** | Only the exact bug reported earlier | After a developer confirms a specific bug ticket is fixed | Confirm THAT SPECIFIC bug is actually fixed (nothing else) |

**A worked example using an HR Tool scenario:**

1. A developer fixes the bug "Cannot delete a Job that already has Candidate applications" (ticket SCRUM-120).
2. QC does **Retesting**: re-try exactly that bug — delete a Job with existing applications and check whether the error still occurs.
3. Since this change touches deletion logic, QC also does **Sanity Testing**: try deleting a Job with no applications, try deleting a Candidate, and check nearby related flows.
4. Before releasing to Production, QC runs full **Regression Testing** per the [Regression Checklist](../practice/05-regression-test-checklist/): re-test the Jobs, Candidates, and Applications modules to confirm nothing else was affected unexpectedly.
5. After deploying to Production, QC runs **Smoke Testing**: a quick check that login, dashboard, and the main flows are still alive.

---

## 7. Summary Table

| Lens | Types |
|------|-------|
| By level | Unit → Integration → System → Acceptance |
| By goal (Functional) | Smoke, Sanity, Regression, Retesting, Integration Function Testing |
| By goal (Non-functional) | Performance, Security, Usability, Compatibility, Accessibility, Localization |
| By technique | Black-box, White-box, Grey-box |

:::note[Remember]
A real test case, e.g. "Verify creating a new Job with salary min > salary max shows a validation error," can be described as: a **System-level, Functional, Black-box test case, part of the Regression suite**. These four labels describe four different aspects of the SAME test case — they don't contradict each other.
:::

---

## Practice Exercises

1. List three test cases you've written or run before (or invent some for HR Tool). For each, identify: its level (Unit/Integration/System/UAT), whether it's Functional or Non-functional, and whether it's Black-box/White-box/Grey-box.
2. A new "Export Candidate list to Excel" feature is about to be released. Which type of testing would you run BEFORE release (smoke/sanity/regression), and which AFTER releasing to production? Explain your reasoning.
3. Find a real localization bug example (from any website you use, not necessarily HR Tool) — describe the bug and explain why it's easy to miss if you only test in one language.
4. In your own words, explain why Grey-box Testing helps QC work more effectively than pure Black-box Testing.

---

## Next Steps

Continue with [Test Design Techniques](./05-test-design-techniques/) to learn how to systematically DESIGN test cases instead of just guessing randomly.

---

**Need help?** Contact the QC Lead or post in #qc-team
