---
title: Bug Report Template
description: Guide for writing standard bug reports in JIRA
---

# Bug Report Template - QC & BA Guide

HR Tool QC Training Materials

**Document Version:** 1.0
**Last Updated:** 26/02/2026
**Author:** QC Team

---

## Table of Contents

1. [Bug Summary Format](#1-bug-summary-format)
2. [Bug Report Template](#2-bug-report-template)
3. [Priority Guidelines](#3-priority-guidelines)
4. [Bug Categories (Labels)](#4-bug-categories-labels)
5. [Module/Component List](#5-modulecomponent-list)
6. [Test Environment & Setup](#6-test-environment--setup)
7. [Role & Permission Matrix](#7-role--permission-matrix)
8. [Bug Report Checklist](#8-bug-report-checklist)
9. [Automation Test Bug Template](#9-automation-test-bug-template)
10. [Complete Bug Report Example](#10-complete-bug-report-example)
11. [Tips for QC](#11-tips-for-qc)

---

## 1. Bug Summary Format

**Standard Format:**

```
[Module] - [Feature] - [Brief issue description]
```

**Good Examples:**
- `[Auth] - Login - Cannot login with email containing trailing space`
- `[Employee] - Create - Error 500 when creating employee with duplicate code`
- `[CV-Matching] - Upload - PDF file > 5MB fails to upload without error message`

**Bad Examples:**
- `Login error` (too vague)
- `Bug` (no information)
- `Not working` (unclear)

---

## 2. Bug Report Template

### 2.1 Basic Information

| Field | Description | Required |
|-------|-------------|----------|
| **Summary** | Bug title in standard format | ✅ |
| **Issue Type** | Bug | ✅ |
| **Priority** | Highest/High/Medium/Low | ✅ |
| **Affects Version** | Version where bug was found | ✅ |
| **Environment** | Staging | ✅ |
| **Component** | Affected module | ✅ |
| **Assignee** | Assigned developer | ❌ |
| **Labels** | `manual-test`, `automation-test`, `regression` | ❌ |

### 2.2 Description Template

```markdown
## Bug Description
[Brief description of what the bug is and where it occurs]

## Preconditions
- User logged in with role: [super_admin/admin/hr/tech_lead]
- Existing data: [describe required data]
- Browser: [Chrome/Firefox/Safari]
- Device: [Desktop/Mobile]

## Steps to Reproduce
1. Navigate to [specific URL]
2. Click on [specific element]
3. Enter data: [specific test data]
4. Click [button/action]
5. Observe result

## Expected Result
[Detailed description of how the system SHOULD behave]

## Actual Result
[Detailed description of how the system IS behaving - this is the bug]

## Test Data
- Email: [contact QC Lead for test accounts]
- Password: ********
- [Other data used for testing]

## Error Message / Console Log
```
[Paste error message or console log here]
```

## Attachments
- [ ] Bug screenshot
- [ ] Video recording (if needed)
- [ ] HAR file (if API-related)
- [ ] Console log

## API Information (if applicable)
- Endpoint: `POST /trpc/auth.login`
- Request Body: `{"email": "test@example.com", "password": "***"}`
- Response: `{"error": "...", "code": "..."}`
- Status Code: 500

## Additional Notes
[Extra notes, workaround if available]
```

---

## 3. Priority Guidelines

| Priority | Criteria | Example |
|----------|----------|---------|
| **Highest** | Blocker - Cannot continue testing/using | Login not working, App crash |
| **High** | Critical - Main feature not working | Cannot create employee, CV matching fails |
| **Medium** | Major - Secondary feature issue, has workaround | Filter not working but search works |
| **Low** | Minor - UI issues, typo, no functional impact | Text truncated, wrong icon color |

---

## 4. Bug Categories (Labels)

### Test Type Labels

- `manual-test` - Bug from manual testing
- `automation-test` - Bug from automation testing
- `regression` - Regression bug (was fixed but reappeared)
- `smoke-test` - Bug from smoke testing

### Bug Type Labels

- `functional` - Functional bug
- `ui-ux` - UI/UX bug
- `performance` - Performance issue
- `security` - Security issue
- `api` - API bug
- `data` - Data issue
- `integration` - Integration bug

---

## 5. Module/Component List

| Component | Description |
|-----------|-------------|
| `auth` | Login, logout, token |
| `employee` | Employee management |
| `department` | Department management |
| `position` | Position management |
| `job` | Job posting management (JD) |
| `candidate` | Candidate management (CV) |
| `application` | Application tracking |
| `interview` | Interview management |
| `cv-matching` | CV-JD matching |
| `invitation` | Member invitation |
| `dashboard` | Dashboard page |
| `settings` | Settings |
| `admin` | System administration (Super Admin) |

---

## 6. Test Environment & Setup

### 6.1 Staging Environment

| Env | URL |
|-----|-----|
| **Staging** | https://hr-tool-software.netlify.app/ |

### 6.2 How to Setup Test Environment

#### Step 1: Login as Super Admin

1. Navigate to: https://hr-tool-software.netlify.app/login
2. Contact QC Lead for **Super Admin** credentials

#### Step 2: Create a new Company for testing

1. After logging in as Super Admin, go to **Admin > Companies**
2. Click **"Create Company"**
3. Fill in details:
   - Company name: `QC Test Company [Your Name]` (e.g., `QC Test Company John`)
   - Admin Email: `admin-test-[name]@example.com`
   - Admin Password: (choose a secure password)
   - Admin Name: `Admin Test`
4. Click **Create**

#### Step 3: Create additional users with different roles

1. Login with the **Admin** account you just created
2. Go to **Settings > Invitations**
3. Invite additional users with various roles:

| Role | Suggested Email | Testing Purpose |
|------|-----------------|-----------------|
| **Admin** | admin-test@example.com | Test full company access |
| **HR** | hr-test@example.com | Test HR permissions |
| **Tech Lead** | techlead-test@example.com | Test Tech Lead permissions |

#### Step 4: Accept Invitation

1. Check email (or get link from Super Admin)
2. Navigate to invitation link
3. Set password for new account
4. Login and start testing

### 6.3 Test Data Guidelines

:::caution[IMPORTANT]
- Each QC should create their own Company to avoid data conflicts
- Name Company using format: `QC Test Company [Your Name]`
- Don't delete other people's data
:::

### 6.4 Browser Versions

Always specify browser version when testing:
- Chrome: `Chrome 121.0.6167.85`
- Firefox: `Firefox 122.0`
- Safari: `Safari 17.2`
- Edge: `Edge 121.0.2277.83`

---

## 7. Role & Permission Matrix

| Permission | Super Admin | Admin | HR | Tech Lead |
|------------|:-----------:|:-----:|:--:|:---------:|
| Manage Companies | ✅ | ❌ | ❌ | ❌ |
| System Logs | ✅ | ❌ | ❌ | ❌ |
| Employees - View | ✅ | ✅ | ✅ | ✅ |
| Employees - Edit | ✅ | ✅ | ✅ | ❌ |
| Jobs - View | ✅ | ✅ | ✅ | ✅ |
| Jobs - Edit | ✅ | ✅ | ✅ | ❌ |
| Candidates - View | ✅ | ✅ | ✅ | ✅ |
| Candidates - Edit | ✅ | ✅ | ✅ | ❌ |
| Applications - View | ✅ | ✅ | ✅ | ✅ |
| Applications - Edit | ✅ | ✅ | ✅ | ❌ |
| Interviews - View | ✅ | ✅ | ✅ | ✅ |
| Interviews - Edit | ✅ | ✅ | ✅ | ✅ |
| Settings | ✅ | ✅ | ❌ | ❌ |

:::tip[Tip]
Test features with each role to ensure permissions work correctly!
:::

---

## 8. Bug Report Checklist

Before submitting a bug, QC should ensure:

- [ ] Summary follows format `[Module] - [Feature] - [Issue]`
- [ ] Complete Steps to Reproduce included
- [ ] Expected Result and Actual Result are clear
- [ ] Screenshot or video evidence attached
- [ ] Bug reproduced at least 2 times
- [ ] Console log checked and attached if errors exist
- [ ] Correct Priority set
- [ ] Correct Component/Module selected
- [ ] Correct Labels added
- [ ] Test data included (no real sensitive data)
- [ ] Role being tested specified (Super Admin/Admin/HR/Tech Lead)

---

## 9. Automation Test Bug Template

```markdown
## Automation Test Bug Report

### Test Case Information
- **Test Suite:** [Suite name]
- **Test Case ID:** TC-XXX
- **Test Case Name:** [Test case name]
- **Test Script Location:** `tests/e2e/auth/login.spec.ts`

### Failure Details
- **Run ID:** [CI/CD run ID if available]
- **Failure Rate:** X/Y runs failed
- **First Seen:** [Date discovered]

### Error Log
```
[Paste full error stack trace]
```

### Screenshots
[Attach screenshot from automation]

### Environment
- **Node Version:** v20.x
- **Playwright Version:** 1.40.x
- **Browser:** Chromium headless
- **Base URL:** https://hr-tool-software.netlify.app/

### Analysis
- [ ] Real bug (needs code fix)
- [ ] Flaky test (needs test fix)
- [ ] Environment issue (needs infra check)
```

---

## 10. Complete Bug Report Example

### Summary

`[Auth] - Login - Error 500 when logging in with email containing special character`

### Description

**Bug Description**

User cannot login when email contains `+` character (e.g., test+1@gmail.com), system returns 500 error instead of proper email validation.

**Preconditions**
- Access login page on Staging
- Have account with email: test+1@gmail.com that has been invited
- Browser: Chrome 121.0.6167.85
- Role: Admin

**Steps to Reproduce**
1. Navigate to https://hr-tool-software.netlify.app/login
2. Enter email: `test+1@gmail.com`
3. Enter password: `[test password]`
4. Click "Login" button
5. Observe result

**Expected Result**
- User logs in successfully and is redirected to Dashboard
- OR clear error message displayed if email/password is wrong

**Actual Result**
- System displays "Internal Server Error"
- Console log shows 500 error
- User cannot login

**Console Log**

```
POST /trpc/auth.login 500 (Internal Server Error)
{
  "error": {
    "message": "Invalid email format",
    "code": "INTERNAL_SERVER_ERROR"
  }
}
```

**Attachments**
- screenshot-login-error.png
- video-reproduce-bug.mp4

**Additional Notes**
- Bug only occurs with email containing `+` character, normal emails work fine
- Workaround: Use email without special characters

---

## 11. Tips for QC

1. **Create separate Company** - Create your own Company for testing to avoid affecting others
2. **Test with multiple roles** - Each bug should be verified with different roles
3. **Reproduce before logging** - Ensure bug can be consistently reproduced
4. **1 bug = 1 ticket** - Don't combine multiple bugs in one ticket
5. **Annotate screenshots** - Use annotation tools to highlight error areas
6. **Keep videos short** - Record just enough to reproduce, not too long
7. **Check for duplicates** - Search before logging to avoid duplicates
8. **Update status** - Close verified bugs or reopen if not fully fixed
9. **Respond to comments** - Developers may ask for more info, respond quickly
10. **Specify Environment** - Always note that you're testing on Staging

---

## Quick Links

- **Staging URL:** https://hr-tool-software.netlify.app/
- **Jira Project:** https://hr-tool.atlassian.net/browse/SCRUM

---

**Need help?** Contact QC Lead or post in #qc-team
