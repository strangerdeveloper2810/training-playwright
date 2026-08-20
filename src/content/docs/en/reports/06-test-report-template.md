---
title: Test Report Templates
description: Standard test report template for the team
---

# Test Report Template

HR Tool QC Training Materials

**Document Version:** 1.0
**Last Updated:** 26/02/2026
**Author:** QC Team

---

## Test Report

### Project Information

| Field | Value |
|-------|-------|
| **Project Name** | HR Tool |
| **Report Type** | [ ] Smoke Test / [ ] Regression / [ ] UAT / [ ] Sprint |
| **Version/Build** | |
| **Environment** | [ ] Staging / [ ] Production |
| **Report Date** | |
| **Prepared By** | |

---

## 1. Executive Summary

### 1.1 Overall Status

| Metric | Value |
|--------|-------|
| **Total Test Cases** | |
| **Executed** | |
| **Passed** | |
| **Failed** | |
| **Blocked** | |
| **Pass Rate** | % |

### 1.2 Release Recommendation

- [ ] **APPROVED** - Ready for production
- [ ] **APPROVED WITH CONDITIONS** - Can deploy with known issues
- [ ] **NOT APPROVED** - Critical issues must be fixed

---

## 2. Test Scope

### 2.1 In Scope

| Module/Feature | Test Type | Priority |
|----------------|-----------|----------|
| Authentication | Regression | High |
| Dashboard | Regression | High |
| Employees | Regression | High |
| Jobs | Regression | High |
| Candidates | Regression | High |
| Applications | Regression | High |

### 2.2 Out of Scope

| Item | Reason |
|------|--------|
| Performance Testing | Scheduled for next sprint |
| Security Testing | Separate audit planned |

---

## 3. Test Results by Module

### 3.1 Authentication

| Test Case | Status | Comments |
|-----------|--------|----------|
| Login valid credentials | Pass/Fail | |
| Login invalid credentials | Pass/Fail | |
| Logout | Pass/Fail | |

**Module Summary:** ___ / ___ Pass

### 3.2 Dashboard

| Test Case | Status | Comments |
|-----------|--------|----------|
| Stats cards display | Pass/Fail | |
| Charts render | Pass/Fail | |

**Module Summary:** ___ / ___ Pass

---

## 4. Defects Summary

### 4.1 Defects by Severity

| Severity | Open | Fixed | Total |
|----------|:----:|:-----:|:-----:|
| Critical | | | |
| Major | | | |
| Minor | | | |
| **Total** | | | |

### 4.2 Defect List

| ID | Title | Module | Severity | Status | JIRA |
|----|-------|--------|----------|--------|------|
| 1 | | | | | |
| 2 | | | | | |

---

## 5. Test Environment

| Component | Details |
|-----------|---------|
| **URL** | https://hr-tool-software.netlify.app |
| **API URL** | https://api.staging.ethansoftwaredeveloper.com |
| **Browser** | Chrome 120 |

---

## 6. Sign-off

### QC Team Sign-off

| Name | Role | Signature | Date |
|------|------|-----------|------|
| | QC Tester | | |
| | QC Lead | | |

### Stakeholder Sign-off

| Name | Role | Signature | Date |
|------|------|-----------|------|
| | Tech Lead | | |
| | PM | | |

---

**Report Generated:** [Date Time]
**HR Tool QC Team**
