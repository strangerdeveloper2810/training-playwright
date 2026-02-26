---
title: Test Cases by Module
description: Detailed test cases for each HR Tool module
---

# Test Cases by Module

HR Tool QC Training Materials

**Document Version:** 1.0
**Last Updated:** 26/02/2026
**Author:** QC Team

---

This document contains detailed test cases for each module of HR Tool. QC uses this for functional testing.

---

## Table of Contents

1. [Authentication Module](#1-authentication-module)
2. [Employee Module](#2-employee-module)
3. [Department Module](#3-department-module)
4. [Position Module](#4-position-module)
5. [Job (JD) Module](#5-job-jd-module)
6. [Candidate (CV) Module](#6-candidate-cv-module)
7. [Application Module](#7-application-module)
8. [Interview Module](#8-interview-module)
9. [CV Matching Module](#9-cv-matching-module)
10. [Admin Module (Super Admin only)](#10-admin-module-super-admin-only)
11. [Permission Test Matrix](#11-permission-test-matrix)

---

## 1. Authentication Module

### 1.1 Login

| TC ID | Test Case | Precondition | Steps | Expected Result | Priority |
|-------|-----------|--------------|-------|-----------------|----------|
| AUTH-01 | Login with valid credentials | Account exists | 1. Go to /login<br>2. Enter correct email + password<br>3. Click Login | Redirect to Dashboard based on role | High |
| AUTH-02 | Login with wrong email | - | 1. Enter non-existent email<br>2. Enter any password<br>3. Click Login | Show error "Invalid email or password" | High |
| AUTH-03 | Login with wrong password | Account exists | 1. Enter correct email<br>2. Enter wrong password<br>3. Click Login | Show error, don't reveal if email is correct | High |
| AUTH-04 | Login with empty email | - | 1. Leave email empty<br>2. Enter password<br>3. Click Login | Validation error: Email required | Medium |
| AUTH-05 | Login with empty password | - | 1. Enter email<br>2. Leave password empty<br>3. Click Login | Validation error: Password required | Medium |
| AUTH-06 | Login with invalid email format | - | 1. Enter "abc" or "abc@"<br>2. Click Login | Validation error: Invalid email | Medium |
| AUTH-07 | Login remember session | Logged in | 1. Close browser<br>2. Reopen, go to app | Session maintained (7 days) | Medium |
| AUTH-08 | Login redirect | Not logged in | 1. Access /employees directly | Redirect to /login | High |

### 1.2 Logout

| TC ID | Test Case | Precondition | Steps | Expected Result | Priority |
|-------|-----------|--------------|-------|-----------------|----------|
| AUTH-09 | Logout successfully | Logged in | 1. Click avatar<br>2. Click Logout | Redirect to /login, clear session | High |
| AUTH-10 | Access after logout | Just logged out | 1. Press Back on browser | Cannot access, redirect to login | High |

### 1.3 Invitation Flow

| TC ID | Test Case | Precondition | Steps | Expected Result | Priority |
|-------|-----------|--------------|-------|-----------------|----------|
| AUTH-11 | Accept valid invitation | Have pending invitation | 1. Click invitation link<br>2. Set password<br>3. Submit | Account created, can login | High |
| AUTH-12 | Invitation expired | Invitation > 7 days | 1. Click invitation link | Show error "Invitation has expired" | Medium |
| AUTH-13 | Invitation already used | Invitation accepted | 1. Click invitation link again | Show error "Invitation already used" | Medium |
| AUTH-14 | Password validation | Valid invitation | 1. Enter password < 6 characters | Validation error for password | Medium |

---

## 2. Employee Module

### 2.1 List & Search

| TC ID | Test Case | Precondition | Steps | Expected Result | Priority |
|-------|-----------|--------------|-------|-----------------|----------|
| EMP-01 | View employee list | At least 1 employee | Go to /employees | List displays with pagination | High |
| EMP-02 | Search by name | Have employees | Enter name in search box | Filter correctly by name | High |
| EMP-03 | Filter by department | Have employees + departments | Select department filter | Only show employees from that department | Medium |
| EMP-04 | Filter by status | Have employees with different statuses | Select status filter | Filter correctly by status | Medium |
| EMP-05 | Pagination | > 10 employees | Click page 2, 3... | Navigate correctly | Medium |
| EMP-06 | Empty state | No employees | Go to /employees | Show "No employees yet" | Low |

### 2.2 Create Employee

| TC ID | Test Case | Precondition | Steps | Expected Result | Priority |
|-------|-----------|--------------|-------|-----------------|----------|
| EMP-07 | Create with full info | Have department + position | 1. Click Create<br>2. Fill all fields<br>3. Submit | Created successfully, appears in list | High |
| EMP-08 | Create with minimum info | - | Only fill required fields | Created successfully | High |
| EMP-09 | Duplicate employee code | Employee exists | Enter code that matches another employee | Error: Employee code already exists | High |
| EMP-10 | Duplicate email | Employee exists | Enter duplicate email | Error: Email already in use | High |
| EMP-11 | Invalid email format | - | Enter invalid email format | Validation error | Medium |
| EMP-12 | Required fields empty | - | Leave name or email empty | Validation error | Medium |
| EMP-13 | Cancel create | On create form | Click Cancel | Return to list, nothing created | Low |

### 2.3 View & Edit Employee

| TC ID | Test Case | Precondition | Steps | Expected Result | Priority |
|-------|-----------|--------------|-------|-----------------|----------|
| EMP-14 | View employee detail | Employee exists | Click on employee | Show full information | High |
| EMP-15 | Edit employee info | Employee exists | 1. Click Edit<br>2. Change info<br>3. Save | Update successful | High |
| EMP-16 | Edit with invalid data | - | Clear required field, save | Validation error | Medium |
| EMP-17 | Cancel edit | Editing | Click Cancel | Don't save changes | Low |

### 2.4 Delete Employee

| TC ID | Test Case | Precondition | Steps | Expected Result | Priority |
|-------|-----------|--------------|-------|-----------------|----------|
| EMP-18 | Delete employee | Employee exists | 1. Click Delete<br>2. Confirm | Deleted successfully, removed from list | High |
| EMP-19 | Cancel delete | - | 1. Click Delete<br>2. Cancel confirmation | Not deleted | Low |

---

## 3. Department Module

| TC ID | Test Case | Precondition | Steps | Expected Result | Priority |
|-------|-----------|--------------|-------|-----------------|----------|
| DEPT-01 | View department list | - | Go to /departments | List displays | High |
| DEPT-02 | Create department | - | 1. Click Create<br>2. Enter name + type<br>3. Submit | Created successfully | High |
| DEPT-03 | Duplicate name | Department exists | Enter duplicate name | Error: Name already exists | High |
| DEPT-04 | Edit department | Department exists | Change name, save | Updated successfully | Medium |
| DEPT-05 | Delete department (no employees) | No employees | Delete | Deleted successfully | Medium |
| DEPT-06 | Delete department (has employees) | Has employees | Delete | Warning or error | High |
| DEPT-07 | Required fields | - | Leave name empty | Validation error | Medium |

---

## 4. Position Module

| TC ID | Test Case | Precondition | Steps | Expected Result | Priority |
|-------|-----------|--------------|-------|-----------------|----------|
| POS-01 | View position list | - | Go to /positions | List displays | High |
| POS-02 | Filter by department | Have departments | Select department filter | Filter correctly | Medium |
| POS-03 | Create position | Have department | 1. Click Create<br>2. Select department<br>3. Enter name<br>4. Submit | Created successfully | High |
| POS-04 | Duplicate name in department | Position exists | Enter duplicate name in same department | Error | High |
| POS-05 | Edit position | Position exists | Change name, save | Updated successfully | Medium |
| POS-06 | Delete position (no employees) | No employees | Delete | Deleted successfully | Medium |
| POS-07 | Delete position (has employees) | Has employees | Delete | Warning or error | High |

---

## 5. Job (JD) Module

| TC ID | Test Case | Precondition | Steps | Expected Result | Priority |
|-------|-----------|--------------|-------|-----------------|----------|
| JOB-01 | View job list | - | Go to /jobs | List displays | High |
| JOB-02 | Create from JD text | - | 1. Click Create from JD<br>2. Paste JD text<br>3. Submit | AI parses successfully | High |
| JOB-03 | Create with empty JD | - | Submit with empty JD | Validation error | Medium |
| JOB-04 | Create with very short JD | - | Paste JD < 50 characters | AI may fail or warning | Medium |
| JOB-05 | View job detail | Job exists | Click on job | Show parsed data | High |
| JOB-06 | Change job status | Job exists | Change status Open/Closed | Updated successfully | Medium |
| JOB-07 | Delete job (no applications) | No applications | Delete | Deleted successfully | Medium |
| JOB-08 | Delete job (has applications) | Has applications | Delete | Warning or cascade delete | High |
| JOB-09 | Filter by status | Have jobs | Filter Open/Closed | Filter correctly | Medium |

---

## 6. Candidate (CV) Module

| TC ID | Test Case | Precondition | Steps | Expected Result | Priority |
|-------|-----------|--------------|-------|-----------------|----------|
| CAN-01 | View candidate list | - | Go to /candidates | List displays | High |
| CAN-02 | Create from CV text | - | 1. Click Create from CV<br>2. Paste CV text<br>3. Submit | AI parses successfully | High |
| CAN-03 | Duplicate email | Candidate exists | Create CV with duplicate email | Error: Email already exists | High |
| CAN-04 | View candidate detail | Candidate exists | Click on candidate | Show parsed data | High |
| CAN-05 | Update candidate status | Candidate exists | Change status | Updated successfully | Medium |
| CAN-06 | Filter by status | Have candidates | Select status filter | Filter correctly | Medium |
| CAN-07 | Filter by skills | Have candidates | Select skill filter | Filter correctly | Medium |
| CAN-08 | Search by name/email | Have candidates | Enter name or email | Search correctly | Medium |
| CAN-09 | Delete candidate | Candidate exists | Delete | Deleted successfully | Medium |

---

## 7. Application Module

| TC ID | Test Case | Precondition | Steps | Expected Result | Priority |
|-------|-----------|--------------|-------|-----------------|----------|
| APP-01 | View application list | - | Go to /applications | List displays | High |
| APP-02 | Create application | Have candidate + job | 1. Click Create<br>2. Select Candidate<br>3. Select Job<br>4. Submit | Created successfully | High |
| APP-03 | Duplicate application | Application exists | Create with same candidate + job | Error: Application already exists | High |
| APP-04 | Update stage | Application exists | Change stage (applied → screening → interview...) | Updated successfully | High |
| APP-05 | Add notes | Application exists | Add/edit notes | Saved successfully | Medium |
| APP-06 | Filter by stage | Have applications | Select stage filter | Filter correctly | Medium |
| APP-07 | View application detail | Application exists | Click on application | Show full information | High |
| APP-08 | Schedule interview from detail | Application exists | Click Schedule Interview | Open create interview form | High |
| APP-09 | Delete application | Application exists | Delete | Deleted successfully + cascade interviews | Medium |

---

## 8. Interview Module

| TC ID | Test Case | Precondition | Steps | Expected Result | Priority |
|-------|-----------|--------------|-------|-----------------|----------|
| INT-01 | View interview list | - | Go to /interviews | List displays | High |
| INT-02 | Create interview | Have application | 1. Click Create<br>2. Select Application<br>3. Select type + date<br>4. Submit | Created successfully | High |
| INT-03 | Schedule in past | - | Select date in the past | Warning or error | Medium |
| INT-04 | View interview detail | Interview exists | Click on interview | Show full information | High |
| INT-05 | Add feedback | Interview exists | 1. Click Add Feedback<br>2. Enter feedback + rating<br>3. Save | Saved successfully | High |
| INT-06 | Update status | Interview exists | Change status (scheduled → completed/cancelled) | Updated successfully | High |
| INT-07 | Filter by type | Have interviews | Filter HR/Technical/Culture | Filter correctly | Medium |
| INT-08 | Filter by status | Have interviews | Filter by status | Filter correctly | Medium |
| INT-09 | Delete interview | Interview exists | Delete | Deleted successfully | Medium |

---

## 9. CV Matching Module

| TC ID | Test Case | Precondition | Steps | Expected Result | Priority |
|-------|-----------|--------------|-------|-----------------|----------|
| MAT-01 | View session list | - | Go to /cv-matching | Session list displays | High |
| MAT-02 | Create session | - | 1. Click Create session<br>2. Enter name<br>3. Submit | Session created | High |
| MAT-03 | Add JD to session | Session exists | 1. Go to session<br>2. Add JD (select existing or paste new) | JD added | High |
| MAT-04 | Add CVs to session | Session has JD | Add multiple CVs | CVs added | High |
| MAT-05 | Start matching | Session has JD + CVs | Click Start Matching | AI processing, results available | High |
| MAT-06 | View matching results | Matching completed | View results | Show scores + breakdown | High |
| MAT-07 | Sort results by score | Have results | Sort by score | Sort correctly | Medium |
| MAT-08 | View interview questions | Have results | View suggested questions | Show HR + Tech questions | Medium |
| MAT-09 | Create application from result | Have results | Click Create Application | Application created with matching score | Medium |
| MAT-10 | Delete session | Session exists | Delete | Delete session + documents + results | Medium |

---

## 10. Admin Module (Super Admin only)

| TC ID | Test Case | Precondition | Steps | Expected Result | Priority |
|-------|-----------|--------------|-------|-----------------|----------|
| ADM-01 | View company list | Login Super Admin | Go to Admin > Companies | List displays | High |
| ADM-02 | Create company | Login Super Admin | 1. Click Create<br>2. Enter info + admin account<br>3. Submit | Company + Admin created | High |
| ADM-03 | View company detail | Company exists | Click on company | Show users + stats | High |
| ADM-04 | Create user for company | Company exists | 1. Go to company detail<br>2. Add user<br>3. Submit | User created | High |
| ADM-05 | View system logs | Login Super Admin | Go to Admin > Logs | Logs display | Medium |
| ADM-06 | Filter logs | Have logs | Filter by level/action/date | Filter correctly | Medium |
| ADM-07 | Export logs | Have logs | Click Export | Download CSV/JSON file | Low |
| ADM-08 | System monitor | Login Super Admin | Go to Admin > System | Metrics display | Medium |
| ADM-09 | Access denied (non-admin) | Login Admin/HR | Access /admin/* | 403 Forbidden or redirect | High |

---

## 11. Permission Test Matrix

Test operations with each role:

| Operation | Super Admin | Admin | HR | Tech Lead |
|-----------|:-----------:|:-----:|:--:|:---------:|
| **Employees** |||||
| View list | ✅ | ✅ | ✅ | ✅ |
| Create | ✅ | ✅ | ✅ | ❌ |
| Edit | ✅ | ✅ | ✅ | ❌ |
| Delete | ✅ | ✅ | ✅ | ❌ |
| **Jobs** |||||
| View list | ✅ | ✅ | ✅ | ✅ |
| Create | ✅ | ✅ | ✅ | ❌ |
| Edit | ✅ | ✅ | ✅ | ❌ |
| Delete | ✅ | ✅ | ✅ | ❌ |
| **Candidates** |||||
| View list | ✅ | ✅ | ✅ | ✅ |
| Create | ✅ | ✅ | ✅ | ❌ |
| Edit | ✅ | ✅ | ✅ | ❌ |
| Delete | ✅ | ✅ | ✅ | ❌ |
| **Applications** |||||
| View list | ✅ | ✅ | ✅ | ✅ |
| Create | ✅ | ✅ | ✅ | ❌ |
| Update stage | ✅ | ✅ | ✅ | ❌ |
| Delete | ✅ | ✅ | ✅ | ❌ |
| **Interviews** |||||
| View list | ✅ | ✅ | ✅ | ✅ |
| Create | ✅ | ✅ | ✅ | ✅ |
| Add feedback | ✅ | ✅ | ✅ | ✅ |
| Delete | ✅ | ✅ | ✅ | ✅ |
| **Settings** |||||
| View | ✅ | ✅ | ❌ | ❌ |
| Invitations | ✅ | ✅ | ❌ | ❌ |
| **Admin** |||||
| Companies | ✅ | ❌ | ❌ | ❌ |
| System logs | ✅ | ❌ | ❌ | ❌ |

:::note[Testing Guide]
- ✅ = Verify user CAN perform the action
- ❌ = Verify user CANNOT perform the action (403 or button hidden)
:::

---

## Status Legend

| Status | Meaning |
|--------|---------|
| Not tested | Test not yet executed |
| Pass | Test passed |
| Fail | Test failed, bug reported |
| Blocked | Cannot test due to dependency |
| N/A | Not applicable |

---

## Priority Legend

| Priority | Description |
|----------|-------------|
| High | Must test every release |
| Medium | Test when time permits |
| Low | Nice to have |

---

**Last Execution Date:** ___________
**Tester:** ___________
**Environment:** ___________
