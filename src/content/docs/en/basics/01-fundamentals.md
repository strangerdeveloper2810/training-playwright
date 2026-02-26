---
title: QC Fundamentals
description: QC Training - Quality Control basics and how to work at HR Tool
---

# QC Training - Fundamentals & Onboarding Guide

HR Tool QC Training Materials

**Document Version:** 1.0
**Last Updated:** 26/02/2026
**Author:** QC Team

---

## 1. Introduction

Welcome to the QC team! This document provides the foundational knowledge needed to start testing the HR Tool platform.

### What is QC?

Quality Control (QC) is the process of ensuring that a product meets the required quality standards before it reaches end users.

### QC vs QA

| Aspect | QC (Quality Control) | QA (Quality Assurance) |
|--------|---------------------|------------------------|
| Focus | Product | Process |
| Approach | Reactive | Proactive |
| Goal | Find defects | Prevent defects |
| When | During/After development | Throughout SDLC |

---

## 2. QC Role & Responsibilities

### Primary Responsibilities

1. **Test Planning** - Create test plans and test cases
2. **Test Execution** - Execute manual and automated tests
3. **Bug Reporting** - Document and track defects
4. **Verification** - Verify bug fixes
5. **Documentation** - Maintain test documentation

### Daily Tasks

- Review new features/changes in sprint
- Execute test cases
- Report and track bugs in JIRA
- Communicate with developers
- Update test documentation

---

## 3. Testing Types

| Type | Description | When |
|------|-------------|------|
| **Smoke Test** | Quick sanity check | After every deployment |
| **Functional Test** | Feature verification | During development |
| **Regression Test** | Ensure no side effects | Before releases |
| **API Test** | Backend endpoint testing | Integration phase |
| **E2E Test** | Full user flow | Before major releases |

---

## 4. Testing Tools

| Tool | Purpose |
|------|---------|
| **JIRA** | Bug tracking, task management |
| **Confluence** | Documentation |
| **Chrome DevTools** | Frontend debugging |
| **Thunder Client** | API testing |
| **Playwright** | Automation testing |

---

## 5. HR Tool Overview

HR Tool is a SaaS platform for HR management with modules:

- **Authentication** - Login, roles, permissions
- **Employees** - Employee management
- **Jobs** - Job descriptions with AI parsing
- **Candidates** - CV management with AI parsing
- **Applications** - ATS pipeline
- **Interviews** - Interview scheduling
- **CV Matching** - AI-powered matching

---

## 6. Environment Setup

### Staging Environment

| Item | Value |
|------|-------|
| **Web URL** | https://hr-tool-software.netlify.app |
| **API URL** | https://hr-tool-staging.ddnsfree.com |
| **Browser** | Chrome (latest) |

### Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Super Admin | Contact QC Lead | Contact QC Lead |
| Admin | Contact QC Lead | Contact QC Lead |
| HR | Contact QC Lead | Contact QC Lead |
| Tech Lead | Contact QC Lead | Contact QC Lead |

> Contact QC Lead or Tech Lead for test account credentials.

---

## 7. Communication Guidelines

- **Slack** - Daily communication
- **JIRA** - Bug reports, tasks
- **Confluence** - Documentation
- **Daily Standup** - 9:00 AM

### Bug Reporting Flow

1. Find bug → Reproduce → Document
2. Create JIRA ticket with evidence
3. Assign to developer
4. Verify fix when done
5. Close ticket

---

## Next Steps

1. Read [Bug Report Template](/en/basics/02-bug-report-template/)
2. Study [Smoke Test Checklist](/en/practice/03-smoke-test-checklist/)
3. Practice with staging environment
