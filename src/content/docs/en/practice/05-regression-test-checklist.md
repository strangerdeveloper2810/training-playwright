---
title: Regression Test Checklist
description: Full test checklist before production release
---

# Regression Test Checklist

HR Tool QC Training Materials

**Document Version:** 1.0
**Last Updated:** 26/02/2026
**Author:** QC Team

---

## Overview

Regression testing ensures existing features still work after code changes.

**Estimated Time:** 2-3 hours
**When to Run:** Before production releases

---

## Pre-Test Checklist

| Item | Status |
|------|--------|
| Staging deployed with release candidate | [ ] |
| Test data prepared | [ ] |
| All test accounts accessible | [ ] |
| Known issues list reviewed | [ ] |

---

## Module 1: Authentication (30 min)

| # | Test Case | Status | Notes |
|---|-----------|--------|-------|
| 1.1 | Login with valid credentials (all roles) | [ ] | |
| 1.2 | Login with invalid credentials | [ ] | |
| 1.3 | Logout functionality | [ ] | |
| 1.4 | Token persistence | [ ] | |
| 1.5 | Role-based access | [ ] | |

**Module 1 Result:** ___/5 Pass

---

## Module 2: Dashboard (15 min)

| # | Test Case | Status | Notes |
|---|-----------|--------|-------|
| 2.1 | Dashboard loads for all roles | [ ] | |
| 2.2 | Stats cards show correct numbers | [ ] | |
| 2.3 | Charts render correctly | [ ] | |
| 2.4 | Quick actions work | [ ] | |

**Module 2 Result:** ___/4 Pass

---

## Module 3: Employees (25 min)

| # | Test Case | Status | Notes |
|---|-----------|--------|-------|
| 3.1 | Employee list loads | [ ] | |
| 3.2 | Search by name | [ ] | |
| 3.3 | Filter by department | [ ] | |
| 3.4 | Create employee | [ ] | |
| 3.5 | Edit employee | [ ] | |
| 3.6 | Delete employee | [ ] | |

**Module 3 Result:** ___/6 Pass

---

## Module 4: Jobs (20 min)

| # | Test Case | Status | Notes |
|---|-----------|--------|-------|
| 4.1 | Job list loads | [ ] | |
| 4.2 | Create job from JD | [ ] | |
| 4.3 | AI parsing accuracy | [ ] | |
| 4.4 | Edit job | [ ] | |
| 4.5 | Delete job | [ ] | |

**Module 4 Result:** ___/5 Pass

---

## Module 5: Candidates (20 min)

| # | Test Case | Status | Notes |
|---|-----------|--------|-------|
| 5.1 | Candidate list loads | [ ] | |
| 5.2 | Create from CV | [ ] | |
| 5.3 | AI parsing accuracy | [ ] | |
| 5.4 | Edit candidate | [ ] | |
| 5.5 | Delete candidate | [ ] | |

**Module 5 Result:** ___/5 Pass

---

## Module 6: Applications (25 min)

| # | Test Case | Status | Notes |
|---|-----------|--------|-------|
| 6.1 | Application list loads | [ ] | |
| 6.2 | Create application | [ ] | |
| 6.3 | Stage transitions | [ ] | |
| 6.4 | Add notes | [ ] | |
| 6.5 | Delete application | [ ] | |

**Module 6 Result:** ___/5 Pass

---

## Module 7: CV Matching (25 min)

| # | Test Case | Status | Notes |
|---|-----------|--------|-------|
| 7.1 | Create session | [ ] | |
| 7.2 | Add documents | [ ] | |
| 7.3 | Start matching | [ ] | |
| 7.4 | View results | [ ] | |
| 7.5 | Delete session | [ ] | |

**Module 7 Result:** ___/5 Pass

---

## Summary

| Module | Total | Pass | Fail | Rate |
|--------|:-----:|:----:|:----:|:----:|
| 1. Authentication | 5 | | | % |
| 2. Dashboard | 4 | | | % |
| 3. Employees | 6 | | | % |
| 4. Jobs | 5 | | | % |
| 5. Candidates | 5 | | | % |
| 6. Applications | 5 | | | % |
| 7. CV Matching | 5 | | | % |
| **TOTAL** | **35** | | | **%** |

---

## Release Recommendation

- [ ] **GO** - All critical tests pass
- [ ] **GO with Issues** - Minor issues, can release
- [ ] **NO GO** - Critical issues found

---

## Sign-off

| Role | Name | Status | Date |
|------|------|--------|------|
| QC Tester | | [ ] Approved | |
| QC Lead | | [ ] Approved | |
