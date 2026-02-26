---
title: Smoke Test Checklist
description: Quick verification checklist after each deployment
---

# Smoke Test Checklist

HR Tool QC Training Materials

**Document Version:** 1.0
**Last Updated:** 26/02/2026
**Author:** QC Team

---

Smoke Test is the most basic test suite to ensure the system is stable after each deployment. QC should run Smoke Test **before** starting detailed testing.

---

## 1. When to Run Smoke Test?

| Situation | Required |
|-----------|----------|
| After each deployment to Staging | ✅ |
| After merging large PR | ✅ |
| Start of work day | ✅ |
| After fixing critical bug | ✅ |
| Before starting regression test | ✅ |

**Estimated Time:** 15-20 minutes (Full) | 5 minutes (Quick)

---

## 2. Smoke Test Checklist

### 2.1 Authentication Module

| # | Test Case | Steps | Expected | Pass/Fail |
|---|-----------|-------|----------|-----------|
| SM-01 | Super Admin Login | 1. Go to /login<br>2. Enter Super Admin account<br>3. Click Login | Redirect to Admin Dashboard | ☐ |
| SM-02 | Admin Login | 1. Go to /login<br>2. Enter admin account<br>3. Click Login | Redirect to Company Dashboard | ☐ |
| SM-03 | Logout | 1. Click avatar<br>2. Click Logout | Redirect to /login, session cleared | ☐ |
| SM-04 | Invalid Login | 1. Enter wrong password<br>2. Click Login | Show error message | ☐ |
| SM-05 | Session Persistence | 1. Login successfully<br>2. Refresh page | Session maintained, not logged out | ☐ |

### 2.2 Dashboard Module

| # | Test Case | Steps | Expected | Pass/Fail |
|---|-----------|-------|----------|-----------|
| SM-06 | Dashboard Load | 1. Login as Admin<br>2. Go to Dashboard | Stats display, charts load successfully | ☐ |
| SM-07 | Stats Cards | Observe stat cards | Display numbers (not NaN/undefined) | ☐ |
| SM-08 | Quick Actions | Click quick action buttons | Navigate to correct page | ☐ |

### 2.3 Employee Module

| # | Test Case | Steps | Expected | Pass/Fail |
|---|-----------|-------|----------|-----------|
| SM-09 | List Employees | 1. Go to Employees<br>2. Observe list | List displays, pagination works | ☐ |
| SM-10 | Create Employee | 1. Click Create<br>2. Fill form<br>3. Submit | Created successfully, appears in list | ☐ |
| SM-11 | View Employee | Click on 1 employee | Detail displays correctly | ☐ |
| SM-12 | Search Employee | Enter name in search box | Filter results correctly | ☐ |

### 2.4 Department & Position Module

| # | Test Case | Steps | Expected | Pass/Fail |
|---|-----------|-------|----------|-----------|
| SM-13 | List Departments | Go to Departments | Department list displays | ☐ |
| SM-14 | Create Department | Create new department | Created successfully | ☐ |
| SM-15 | List Positions | Go to Positions | Position list displays | ☐ |
| SM-16 | Create Position | Create new position | Created successfully | ☐ |

### 2.5 Job (JD) Module

| # | Test Case | Steps | Expected | Pass/Fail |
|---|-----------|-------|----------|-----------|
| SM-17 | List Jobs | Go to Jobs | Job list displays | ☐ |
| SM-18 | Create Job from JD | 1. Click Create from JD<br>2. Paste JD text<br>3. Submit | AI parses successfully, job created | ☐ |
| SM-19 | View Job Detail | Click on 1 job | Parsed data displays correctly | ☐ |

### 2.6 Candidate (CV) Module

| # | Test Case | Steps | Expected | Pass/Fail |
|---|-----------|-------|----------|-----------|
| SM-20 | List Candidates | Go to Candidates | Candidate list displays | ☐ |
| SM-21 | Create Candidate from CV | 1. Click Create from CV<br>2. Paste CV text<br>3. Submit | AI parses successfully, candidate created | ☐ |
| SM-22 | View Candidate Detail | Click on 1 candidate | Parsed data displays correctly | ☐ |

### 2.7 Application (ATS) Module

| # | Test Case | Steps | Expected | Pass/Fail |
|---|-----------|-------|----------|-----------|
| SM-23 | List Applications | Go to Applications | Application list displays | ☐ |
| SM-24 | Create Application | 1. Click Create<br>2. Select Candidate + Job | Application created | ☐ |
| SM-25 | Update Stage | Change stage of 1 application | Stage updated successfully | ☐ |

### 2.8 Interview Module

| # | Test Case | Steps | Expected | Pass/Fail |
|---|-----------|-------|----------|-----------|
| SM-26 | List Interviews | Go to Interviews | Interview list displays | ☐ |
| SM-27 | Schedule Interview | 1. From Application detail<br>2. Click Schedule Interview<br>3. Fill info | Interview created | ☐ |
| SM-28 | Add Feedback | Add feedback for interview | Feedback saved successfully | ☐ |

### 2.9 CV Matching Module

| # | Test Case | Steps | Expected | Pass/Fail |
|---|-----------|-------|----------|-----------|
| SM-29 | Create Session | 1. Go to CV Matching<br>2. Create new session | Session created | ☐ |
| SM-30 | Add Documents | Add CV and JD to session | Documents added | ☐ |
| SM-31 | Start Matching | Click Start Matching | AI matching works, results available | ☐ |

### 2.10 Settings & Admin Module

| # | Test Case | Steps | Expected | Pass/Fail |
|---|-----------|-------|----------|-----------|
| SM-32 | Invitation (Admin) | 1. Go to Settings > Invitations<br>2. Invite new user | Invitation created | ☐ |
| SM-33 | Company List (Super Admin) | Go to Admin > Companies | Company list displays | ☐ |
| SM-34 | System Logs (Super Admin) | Go to Admin > Logs | Logs display | ☐ |

---

## 3. Smoke Test Report Template

```markdown
# Smoke Test Report

**Date:** [YYYY-MM-DD]
**Tester:** [QC Name]
**Environment:** Staging (https://hr-tool-software.netlify.app/)
**Build/Version:** [Version if available]
**Browser:** [Chrome/Firefox + version]

## Summary
- **Total Test Cases:** 34
- **Passed:** [X]
- **Failed:** [X]
- **Blocked:** [X]
- **Pass Rate:** [X%]

## Results

| Module | Total | Passed | Failed | Blocked |
|--------|-------|--------|--------|---------|
| Authentication | 5 | | | |
| Dashboard | 3 | | | |
| Employee | 4 | | | |
| Department & Position | 4 | | | |
| Job | 3 | | | |
| Candidate | 3 | | | |
| Application | 3 | | | |
| Interview | 3 | | | |
| CV Matching | 3 | | | |
| Settings & Admin | 3 | | | |

## Failed Test Cases

| TC ID | Summary | Actual Result | Jira Ticket |
|-------|---------|---------------|-------------|
| SM-XX | [Description] | [Actual result] | SCRUM-XXX |

## Blocked Test Cases

| TC ID | Summary | Blocked By |
|-------|---------|------------|
| SM-XX | [Description] | [Reason/Dependency] |

## Recommendation
- [ ] **GO** - Can proceed with detailed testing
- [ ] **NO GO** - Need to fix critical issues first

## Notes
[Additional notes if any]
```

---

## 4. Smoke Test Tips

1. **Test order:** Test Authentication first, if it fails, stop there
2. **Time limit:** Smoke test should not exceed 30 minutes
3. **Take notes:** Note any anomaly, no matter how small
4. **Screenshot:** Capture screenshots of errors immediately
5. **Report immediately:** If there's a blocker, notify Dev right away without waiting to complete

---

## 5. Quick Smoke Test (5 minutes)

For quick verification after hotfix:

| # | Check | Expected |
|---|-------|----------|
| 1 | Login Super Admin | ✅ Success |
| 2 | Login Admin | ✅ Success |
| 3 | Dashboard loads | ✅ No errors |
| 4 | Create 1 employee | ✅ Success |
| 5 | Create 1 job from JD | ✅ AI works |

:::tip[Tip]
If all 5 pass → System OK for basic operations
:::

---

## 6. Cross-Cutting Concerns

| # | Test Case | Steps | Expected | Status |
|---|-----------|-------|----------|--------|
| CC-01 | Language switch | Change EN/VI | UI text changes | ☐ |
| CC-02 | Theme switch | Change Light/Dark | Theme changes | ☐ |
| CC-03 | Pagination | Navigate pages in list | Pagination works | ☐ |
| CC-04 | Error boundary | Force error (if possible) | Error page displays, not blank | ☐ |
| CC-05 | 404 page | Navigate to /invalid-url | 404 page displays | ☐ |

---

## 7. Post-Test Summary

### Test Results

| Module | Pass | Fail | Blocked |
|--------|:----:|:----:|:-------:|
| Authentication | /5 | | |
| Dashboard | /3 | | |
| Employee | /4 | | |
| Department & Position | /4 | | |
| Job | /3 | | |
| Candidate | /3 | | |
| Application | /3 | | |
| Interview | /3 | | |
| CV Matching | /3 | | |
| Settings & Admin | /3 | | |
| Cross-Cutting | /5 | | |
| **TOTAL** | **/39** | | |

### Issues Found

| # | Module | Description | Severity | JIRA Ticket |
|---|--------|-------------|----------|-------------|
| 1 | | | | |
| 2 | | | | |
| 3 | | | | |

### Environment

- **URL tested:**
- **Browser:**
- **Date/Time:**
- **Tester:**

### Deploy Decision

- [ ] **PASS** - Safe to proceed
- [ ] **FAIL** - Has critical issues, recommend rollback
- [ ] **PASS WITH ISSUES** - Non-critical issues, can proceed

---

**Notes:**
- Clean up all [TEST] data created during smoke test
- Report any issues immediately in #bugs channel
- Save this checklist with date for archive
