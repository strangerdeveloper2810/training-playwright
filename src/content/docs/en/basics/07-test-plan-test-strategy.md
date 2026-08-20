---
title: Test Plan & Test Strategy
description: How to write a Test Plan, how it differs from a Test Strategy, and Risk-based Testing
---

# Test Plan & Test Strategy

QC Training Documentation - HR Tool

**Version:** 1.0
**Updated:** 2026-08-20
**Author:** QC Team

---

## Table of Contents

1. [What Is a Test Plan](#1-what-is-a-test-plan)
2. [Components of a Test Plan](#2-components-of-a-test-plan)
3. [Test Strategy vs Test Plan](#3-test-strategy-vs-test-plan)
4. [Risk-based Testing](#4-risk-based-testing)
5. [A Condensed Test Plan Example](#5-a-condensed-test-plan-example)
6. [When You Need a Full Test Plan (and When You Don't)](#6-when-you-need-a-full-test-plan-and-when-you-dont)

---

## 1. What Is a Test Plan

A **Test Plan** is a document describing: **what will be tested, how, by whom, by when, and what risks to watch out for** — for a specific scope of work (a sprint, a feature, a release). It's a blueprint, similar to architectural drawings before building a house, helping the whole team (QC, Dev, PM) agree on scope and expectations before testing begins.

Without a Test Plan, QC easily ends up not knowing how much testing is "enough," unclear on who's responsible for what, and prone to missing important risks.

---

## 2. Components of a Test Plan

| Component | Answers the question | Example |
|-----------|------------------------|---------|
| **Scope** | What will be tested, what won't? | Test the new CV Matching module; do NOT re-test all of Authentication (stable, unchanged) |
| **Objectives** | Why test this round at all? | Ensure the new AI matching feature has no critical functional bugs before launching to customers |
| **Test Items** | Which specific features/modules will be tested? | CV-JD scoring, interview question suggestions, 2-tier recommendation |
| **Approach** | How will testing be done — manual, automation, or both? | Manual testing for the main flow + Exploratory Testing for cases where the AI returns unusual results |
| **Entry Criteria** | When is testing ALLOWED to start? | Build deployed to Staging successfully, developer has self-tested and confirmed no blocking issues |
| **Exit Criteria** | When is testing considered DONE, ready to release? | 100% of High-priority test cases Pass, no open High/Critical bugs |
| **Resource & Schedule** | Who does it, and how long will it take? | 1 QC, 3 business days |
| **Risk & Contingency** | What risks might occur, and how will they be handled? | If the AI provider (Gemini) gets rate-limited during testing, switch to testing with the backup provider (DeepSeek) |

---

## 3. Test Strategy vs Test Plan

This is the most commonly confused distinction:

| | Test Strategy | Test Plan |
|---|------------------|-------------|
| **Scope** | The whole project/company, long-term | One specific sprint/feature/release |
| **Nature** | General principles, rarely change | Detailed plan, changes each cycle |
| **Example content** | "Every feature touching multi-tenant permissions must include a test case verifying data isolation between companies" | "Sprint 24: test the Client Requisition Portal feature, done by August 25" |
| **Who writes it** | QC Lead / Test Manager, usually written once and applied long-term | The QC executing that round of testing, rewritten each cycle |

Put simply: **Test Strategy is the "house rules,"** while **Test Plan is "the game plan for one specific match"** played under those rules.

---

## 4. Risk-based Testing

**Risk-based Testing** prioritizes testing based on **risk level** (likelihood of a defect × impact if it occurs), rather than testing every feature equally.

**Simple formula:**

```
Risk level = Likelihood of failure × Impact if failure occurs
```

**Applied to HR Tool's modules:**

| Module/Feature | Likelihood of failure | Impact if it fails | Risk level | Test priority |
|--------------------|:---:|:---:|:---:|:---:|
| Multi-tenant data isolation (Company A sees Company B's data) | Medium | Very high (customer data leak, serious security breach) | **Very high** | 1 |
| Login/Logout | Low (rarely changes) | High (blocks all users) | High | 2 |
| Export report to Excel | Medium | Low (doesn't block core work) | Low | 4 |
| Changing the UI theme color | Low | Very low | Very low | 5 |
| AI CV-JD Matching returning a wrong score | Medium-high (complex AI logic) | High (affects hiring decisions) | High | 2 |

→ With limited QC resources, Risk-based Testing helps answer the most important question: **"If we can only test part of this, what should we test first?"**

---

## 5. A Condensed Test Plan Example

**Test Plan: Sprint 24 - CV Matching v2 Feature**

| Item | Content |
|------|---------|
| **Scope** | Test the new CV-JD Matching module (multi-AI-provider), including: detailed scoring, interview question suggestions, AI provider fallback mechanism |
| **Objectives** | Ensure the feature works correctly and doesn't slow down the existing ATS flow |
| **Test Items** | CV-JD scoring engine, interview question generator, provider fallback (Gemini → Claude → DeepSeek → Minimax) |
| **Approach** | Manual functional testing for the main flow; Risk-based Testing prioritizing the fallback mechanism (high risk due to AI dependency); 2 hours of Exploratory Testing for non-standard CVs/JDs (other languages, unusual formats) |
| **Entry Criteria** | Build deployed to Staging, with at least 20 sample Candidates and 5 sample Jobs available |
| **Exit Criteria** | 100% of High-priority test cases Pass, 0 open Critical/High bugs, the fallback mechanism has been successfully tested at least once |
| **Resource & Schedule** | 1 QC, 3 business days (Aug 20-22, 2026) |
| **Risk & Contingency** | If an AI provider has downtime during testing → log it, report to the Tech Lead, don't count it as an HR Tool bug, and postpone that portion of testing until the provider is back up |

---

## 6. When You Need a Full Test Plan (and When You Don't)

:::tip[A full Test Plan isn't always necessary]
For small changes (fixing a simple UI bug), writing out all 8 Test Plan components is wasted effort — a few lines of Sanity Testing notes are enough. A full Test Plan is worth the effort for: important new features, changes affecting many modules, or large releases.
:::

| Situation | Need a full Test Plan? |
|-----------|----------------------------|
| Fixing a small bug with no impact on other modules | No — just brief Retesting/Sanity notes |
| Adding a new field to an existing form | Not the full version — maybe just a short Scope + Test Items |
| Launching a new feature (a brand-new module) | **Yes** — especially Risk and Entry/Exit Criteria |
| A large release with many accumulated changes (major release) | **Yes** — combined with full Regression Testing |

---

## Practice Exercises

1. Write a condensed Test Plan (following the section 5 template) for launching HR Tool's new "CTV/Referral Portal" feature.
2. Apply Risk-based Testing: list 5 features from any application you're familiar with (not necessarily HR Tool), rank their risk level, and propose a testing priority order.
3. In your own words, explain the difference between Test Strategy and Test Plan, using a real example from your own company/project if possible.
4. For the Test Plan example in section 5, propose one additional Exit Criterion you think it should have.

---

## Next Steps

You've completed the **Basics** group on testing mindset. Next, apply it in practice with [Test Cases by Module](../practice/04-test-cases-by-module/) or learn manual API testing techniques in [Manual API Testing](../practice/06-manual-api-testing/).

---

**Need help?** Contact the QC Lead or post in #qc-team
