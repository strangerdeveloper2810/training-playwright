---
title: Test Design Techniques
description: Equivalence Partitioning, Boundary Value Analysis, Decision Table, State Transition, and other standard test design techniques
---

# Test Design Techniques

QC Training Documentation - HR Tool

**Version:** 1.0
**Updated:** 2026-08-20
**Author:** QC Team

---

## Table of Contents

1. [Why Test Design Techniques Matter](#1-why-test-design-techniques-matter)
2. [Equivalence Partitioning](#2-equivalence-partitioning)
3. [Boundary Value Analysis](#3-boundary-value-analysis)
4. [Decision Table Testing](#4-decision-table-testing)
5. [State Transition Testing](#5-state-transition-testing)
6. [Use Case Testing](#6-use-case-testing)
7. [Error Guessing & Exploratory Testing](#7-error-guessing--exploratory-testing)
8. [Choosing the Right Technique](#8-choosing-the-right-technique)

---

## 1. Why Test Design Techniques Matter

For a form with just 5 fields, the number of possible input combinations is practically infinite. QC doesn't have time (and doesn't need) to test every combination. Test Design Techniques are systematic methods for choosing **a small set of test cases that still catches most defects** — instead of guessing randomly.

:::tip[Benefits]
Using the right technique helps you: (1) avoid missing edge cases that are most likely to cause bugs, (2) avoid writing redundant test cases, and (3) justify WHY you chose a given test case when asked in review.
:::

---

## 2. Equivalence Partitioning

**Definition:** Divide the space of possible inputs into "partitions" where every value inside a partition is expected to be handled the same way. You only need to test one representative value per partition, not every value.

**When to use it:** When an input has a wide range of possible values (numbers, strings, dropdown options).

**Applied example — the "Years of experience required" field when creating a Job at HR Tool** (accepts an integer from 0 to 50):

| Partition | Representative value | Expected outcome |
|-----------|-------------------------|---------------------|
| Valid: 0 to 50 | 25 | Saved successfully |
| Invalid: less than 0 | -5 | Validation error shown |
| Invalid: greater than 50 | 100 | Validation error shown |
| Invalid: not a number | "abc" | Validation error shown |
| Invalid: empty (if required) | "" | "This field is required" error |

→ Out of countless possible values, we only need **5 test cases** to fully cover all equivalence partitions.

---

## 3. Boundary Value Analysis

**Definition:** Most bugs happen right at the **boundary** between valid/invalid partitions (off-by-one errors when a developer uses `<` instead of `<=`). BVA focuses testing precisely at and around boundary values.

**When to use it:** As a complement to Equivalence Partitioning, especially effective for fields with numeric min/max limits or string length limits.

**Applied example — "Salary Min" and "Salary Max" fields when creating a Job** (assume salary must be between 1,000,000 and 500,000,000 VND, and Salary Min must be less than Salary Max):

| Test case | Value | Expected outcome |
|-----------|-------|---------------------|
| Just below lower bound | Salary Min = 999,999 | Validation error (below allowed range) |
| Exactly at lower bound | Salary Min = 1,000,000 | Valid |
| Just above lower bound | Salary Min = 1,000,001 | Valid |
| Just below upper bound | Salary Max = 499,999,999 | Valid |
| Exactly at upper bound | Salary Max = 500,000,000 | Valid |
| Just above upper bound | Salary Max = 500,000,001 | Validation error (above allowed range) |
| Min equals Max | Salary Min = Salary Max = 20,000,000 | Confirm with BA: is this valid or an error? |
| Min greater than Max | Salary Min = 30,000,000, Salary Max = 20,000,000 | Validation error "Salary Min must be less than Salary Max" |

:::caution[Note]
The "Min equals Max" case is a boundary that's frequently overlooked and frequently misunderstood between dev/QC/BA. When you hit an ambiguous edge like this, always confirm the rule with a BA/PO before concluding it's a bug.
:::

---

## 4. Decision Table Testing

**Definition:** Used when the output depends on a **combination of multiple conditions** at once (not just a single input). A decision table lists every possible combination of conditions and the corresponding expected outcome.

**When to use it:** Logic with multiple AND/OR conditions — for example, filters or permission checks.

**Applied example — filtering Candidates by "Active status" and "Has AI-parsed CV"** at HR Tool:

| # | Status = Active | Has AI-parsed CV | Expected outcome |
|---|:---:|:---:|-------------------|
| 1 | ✅ | ✅ | Shown in filtered list |
| 2 | ✅ | ❌ | Shown, with a "CV not parsed" badge |
| 3 | ❌ | ✅ | Not shown (inactive) |
| 4 | ❌ | ❌ | Not shown (inactive) |

**A second example — permission to delete a Job based on Role and Job status** (combining two conditions: role and status):

| # | Role | Job has Applications? | Expected outcome |
|---|------|:---:|-------------------|
| 1 | admin | No | Deletable |
| 2 | admin | Yes | A confirmation warning is shown before deletion |
| 3 | hr | No | Deletable |
| 4 | hr | Yes | A confirmation warning is shown before deletion |
| 5 | tech_lead | No | No permission, delete button hidden/disabled |
| 6 | tech_lead | Yes | No permission, delete button hidden/disabled |

→ With 2 conditions × 2 values (Active/Inactive × Parsed/Not-parsed) there are 4 combinations; with 3 roles × 2 statuses there are 6 — a decision table ensures none get missed.

---

## 5. State Transition Testing

**Definition:** Used when an object has multiple **states** and clear rules about which state can transition to which. Testing focuses on: valid transitions, invalid transitions (which must be blocked), and whether the resulting state is correct.

**When to use it:** Workflows, pipelines, or the lifecycle of an entity (an order, an application, a ticket...).

**Applied example — HR Tool's Application Pipeline (ATS)**, with states: `Applied → Screening → Interview → Offer → Hired`, and `Rejected` possible from any stage before `Hired`.

```
Applied ──▶ Screening ──▶ Interview ──▶ Offer ──▶ Hired
   │            │              │           │
   └────────────┴──────────────┴───────────┴──▶ Rejected
```

| # | Current state | Action | New state | Valid? |
|---|------------------|--------|-------------|--------|
| 1 | Applied | Move to Screening | Screening | ✅ Valid |
| 2 | Applied | Move to Rejected | Rejected | ✅ Valid |
| 3 | Applied | Jump straight to Interview (skipping Screening) | — | ❌ Must be blocked (if the process requires sequential stages) |
| 4 | Hired | Move to Rejected | — | ❌ Must be blocked (Hired is a terminal state) |
| 5 | Rejected | Move to any other state | — | ❌ Must be blocked (Rejected is a terminal state) |
| 6 | Offer | Move to Hired | Hired | ✅ Valid |

:::tip[Why test cases #3 and #4 matter]
These are exactly the test cases most likely to be forgotten when testing by intuition alone (everyone naturally thinks of the "happy path" first), yet they're where the most serious real-world bugs tend to occur — for example, a Candidate accidentally moved to the wrong stage because the UI allowed clicking an invalid transition button.
:::

---

## 6. Use Case Testing

**Definition:** Testing based on the **real usage flow** of a specific actor (user type), including both the "happy path" (main flow) and "alternative flows"/"exception flows".

**When to use it:** Features involving permissions (multiple roles) or multi-step business processes.

**Applied example — "Tech Lead writes interview feedback"** at HR Tool:

- **Actor:** `tech_lead`
- **Happy path:** Tech Lead logs in → opens an Interview assigned to them → fills out the feedback form + rating → Submits → feedback is saved successfully and visible to HR.
- **Alternative flow 1:** Tech Lead tries to open an Interview NOT assigned to them → the system blocks it, showing "Access denied" (per the permission matrix, `tech_lead` can only read + write their own interviews).
- **Alternative flow 2:** Tech Lead submits feedback without a rating (required) → submission is blocked with a validation error.
- **Exception flow:** Tech Lead loses network connection right when submitting feedback → the system must show a clear error and must NOT lose the content already entered (shouldn't force them to start over).

---

## 7. Error Guessing & Exploratory Testing

**Error Guessing:** Using experience and intuition to "guess" where bugs are likely to hide — empty data, special characters, negative numbers, oversized files, rapid double-clicking, multiple tabs open at once...

**Exploratory Testing:** Testing without pre-written test cases — you learn the system as you test, and use what you observe to decide the next step. Usually done in time-boxed "sessions" (e.g. 30-60 minutes) with a documented exploration goal (a "charter").

| Technique | When to use it | HR Tool example |
|-----------|------------------|--------------------|
| Error Guessing | To complement the systematic techniques above, catching bugs "nobody thought of" | Try entering a Candidate name that's entirely emoji, or upload a CV file named with characters like `../../etc/passwd` |
| Exploratory Testing | New, complex, poorly documented features, or when you want to find bugs outside your existing test cases | Spend 45 minutes freely exploring the new n8n-style Workflow Automation feature with no test cases, just taking notes on anything unusual |

:::note[Exploratory Testing isn't "random poking"]
Many people mistake Exploratory Testing for testing without any plan. In practice it still has a clear goal (a charter) — e.g. "explore how CV Matching behaves with CVs that aren't in English or Vietnamese" — the difference is you don't write step-by-step instructions in advance; you adapt based on what you observe.
:::

---

## 8. Choosing the Right Technique

| Situation | Best-fit technique |
|-----------|------------------------|
| A field accepting numeric/string input with a range | Equivalence Partitioning + Boundary Value Analysis |
| Logic depending on multiple combined conditions (filters, permissions) | Decision Table Testing |
| An entity with a multi-step lifecycle/workflow | State Transition Testing |
| A feature spanning multiple roles and business flows | Use Case Testing |
| A new feature, poorly documented, looking for "weird" bugs | Exploratory Testing + Error Guessing |

---

## Practice Exercises

1. Apply Equivalence Partitioning + Boundary Value Analysis to a "Phone number" field (assume the rule: exactly 10 digits, must start with 0). Write at least 6 test cases.
2. Draw a Decision Table for the logic: "A Candidate is only invited to interview if their CV Matching score >= 70% AND the Job is Active." List all 4 combinations.
3. Draw a State Transition diagram for the lifecycle of a bug ticket in the Jira project your team uses (e.g. Open → In Progress → In Review → Done, possibly Reopened). Identify 2 INVALID transitions worth testing.
4. Spend 20 minutes doing Exploratory Testing on the HR Tool Staging environment with a charter of your choice (e.g. "explore the new Company creation flow"), and note at least 2 unusual observations (bug or not).

---

## Next Steps

Continue with [Writing Standard Test Cases](./06-viet-test-case-chuan/) to learn how to properly document the test cases you just designed.

---

**Need help?** Contact the QC Lead or post in #qc-team
