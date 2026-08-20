---
title: Writing Standard Test Cases & Test Suites
description: Standard test case structure, ID naming conventions, Test Suites, and Requirement Traceability Matrix
---

# Writing Standard Test Cases & Test Suites

QC Training Documentation - HR Tool

**Version:** 1.0
**Updated:** 2026-08-20
**Author:** QC Team

---

## Table of Contents

1. [What Is a Test Case](#1-what-is-a-test-case)
2. [Standard Test Case Structure](#2-standard-test-case-structure)
3. [Test Case ID Naming Convention](#3-test-case-id-naming-convention)
4. [A Complete Test Case Example](#4-a-complete-test-case-example)
5. [What Is a Test Suite](#5-what-is-a-test-suite)
6. [Requirement Traceability Matrix (RTM)](#6-requirement-traceability-matrix-rtm)
7. [Checklist Before Finalizing a Test Case](#7-checklist-before-finalizing-a-test-case)

---

## 1. What Is a Test Case

A Test Case is a document that describes **exactly** how to verify one specific piece of functionality: what to do, with what data, and what result to expect. A good test case must be clear enough that **someone other than the author** can execute it and get the exact same result.

:::caution[A vague test case is a useless test case]
"Test the login feature" is NOT a test case — it's just a general goal. A real test case must specify: log in with what data, what exact steps, and what specific outcome is expected.
:::

---

## 2. Standard Test Case Structure

| Field | Meaning | Example |
|-------|---------|---------|
| **Test Case ID** | A unique identifier | `TC-JOB-001` |
| **Title/Objective** | A short statement of the test case's goal | Verify creating a new Job with valid data |
| **Module/Feature** | Which module this belongs to | Jobs |
| **Preconditions** | What must be true BEFORE running the test | Logged in as role `hr`, at least 1 Department exists |
| **Test Steps** | Ordered steps, detailed enough for someone else to follow exactly | 1. Go to Jobs menu 2. Click "Create Job" 3. Fill in... |
| **Test Data** | The specific data used in the test | Title: "Senior Backend Engineer", Salary: 30-50 million |
| **Expected Result** | What MUST happen if the system is working correctly | Job created successfully, appears in the list with "Draft" status |
| **Actual Result** | What actually happened when the test was run (filled in during execution) | (filled in after running) |
| **Status** | Pass / Fail / Blocked / Not Run | Pass |
| **Priority** | Importance level: High/Medium/Low | High |
| **Type** | Positive (valid data) or Negative (invalid data, testing error handling) | Positive |

---

## 3. Test Case ID Naming Convention

A common, easy-to-search convention:

```
TC-[MODULE]-[SEQUENCE NUMBER]
```

Applied to HR Tool:

| Module | Prefix | Example ID |
|--------|--------|--------------|
| Authentication | `AUTH` | `TC-AUTH-001` |
| Jobs | `JOB` | `TC-JOB-001` |
| Candidates | `CAND` | `TC-CAND-001` |
| Applications (ATS) | `APP` | `TC-APP-001` |
| Interviews | `INT` | `TC-INT-001` |
| CV Matching | `CVM` | `TC-CVM-001` |
| Referral/CTV | `REF` | `TC-REF-001` |

:::tip[Numbering tip]
Leave gaps between numbers (001, 010, 020...) or group by sub-feature (e.g. `TC-JOB-1xx` for Create, `TC-JOB-2xx` for Update, `TC-JOB-3xx` for Delete) so you can insert new test cases later without renumbering everything.
:::

---

## 4. A Complete Test Case Example

**Test Case ID:** `TC-JOB-001`

**Title:** Verify successful Job creation with valid data

**Module:** Jobs

**Priority:** High

**Type:** Positive

**Preconditions:**
- Logged into Staging (`https://hr-tool-software.netlify.app`) as role `hr`
- The company already has at least 1 Department (e.g. "Engineering")

**Test Steps:**

| # | Step | Expected result of this step |
|---|--------|----------------------------------|
| 1 | Go to the **Jobs** menu | The existing job list is shown |
| 2 | Click **"Create Job"** | The job creation form appears |
| 3 | Enter Title: `Senior Backend Engineer` | The field accepts the value correctly |
| 4 | Select Department: `Engineering` | The dropdown shows the correct department list |
| 5 | Enter Salary Min: `30000000`, Salary Max: `50000000` | The fields accept the values correctly |
| 6 | Click **"Save"** | — |

**Test Data:**
```
Title: Senior Backend Engineer
Department: Engineering
Salary Min: 30,000,000 VND
Salary Max: 50,000,000 VND
Experience Required: 3 years
```

**Expected Result:**
- The Job is created successfully and the system shows a "Job created successfully" message
- The new Job appears in the Jobs list with its default status (e.g. "Draft" or "Open" per business rules)
- All displayed information matches what was entered

**Actual Result:** _(fill in when executing the test)_

**Status:** _(Pass / Fail / Blocked)_

---

## 5. What Is a Test Suite

A **Test Suite** is a collection of related Test Cases grouped together for execution/management — typically by module, by testing type, or by release.

| Grouping style | Example |
|-----------------|---------|
| By module | "Test Suite - Jobs Module" containing all TC-JOB-* |
| By testing type | "Smoke Test Suite" containing the most critical test cases across modules |
| By release | "Regression Suite - Release v2.5" containing test cases to re-run before shipping v2.5 |

A **Test Set** is a related concept, usually referring to **one specific execution run** of a Test Suite (e.g. "Test Set - Regression Run #14, 2026-08-20").

---

## 6. Requirement Traceability Matrix (RTM)

An **RTM** is a table linking **business Requirements** to the **Test Cases** that verify them — it answers two important questions:

1. "Does this requirement already have a test case?" (avoiding untested requirements)
2. "If this requirement changes, which test cases need review?" (avoiding missed test cases when requirements change)

**A simplified RTM example for the CV Matching feature:**

| Requirement ID | Requirement description | Related Test Case(s) | Status |
|-----------------|----------------------------|--------------------------|--------|
| REQ-CVM-01 | The system must score CV-JD matches as a percentage based on skills | TC-CVM-001, TC-CVM-002 | ✅ Tested |
| REQ-CVM-02 | The system must auto-generate suggested interview questions per Candidate | TC-CVM-010 | ✅ Tested |
| REQ-CVM-03 | If the primary AI provider (Gemini) fails, the system must automatically fall back to a backup provider | _(no test case yet)_ | ❌ Not tested — needs to be added |

:::caution[RTM reveals test coverage gaps]
In the example above, REQ-CVM-03 has no test case at all — this is exactly the biggest value of an RTM: it surfaces important requirements (often reliability-related) that are completely missing from the test plan.
:::

---

## 7. Checklist Before Finalizing a Test Case

- [ ] The title clearly states the GOAL, with no ambiguity
- [ ] Preconditions are enough for someone else to set up the same environment
- [ ] Test Steps are numbered, each one a SINGLE concrete action
- [ ] Test Data is specific (don't write "enter valid data" without saying exactly what data)
- [ ] Expected Result is clear and objectively verifiable as Pass/Fail (not vague like "works well")
- [ ] Priority and Type (Positive/Negative) are correctly assigned
- [ ] The Test Case ID follows the team's naming convention

---

## Practice Exercises

1. Write a complete Test Case (with all fields from section 2) for HR Tool's "Log out" feature.
2. Write 2 additional Negative test cases for Job creation: (a) leaving Title empty, (b) Salary Min greater than Salary Max.
3. Design a short RTM (3-5 rows) for the "Invite a member via Invitation" feature — come up with 3 reasonable requirements and map them to test cases.
4. Group the 5 test cases you wrote in exercises 1-2 (and the example in this lesson) into a Test Suite, and give it an appropriate name.

---

## Next Steps

Continue with [Test Plan & Test Strategy](./07-test-plan-test-strategy/) to learn how to plan testing at a broader scale (not just one test case, but an entire release).

---

**Need help?** Contact the QC Lead or post in #qc-team
