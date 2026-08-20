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

### Project Description

HR Tool is a multi-tenant SaaS platform built specifically for **recruitment agencies, headhunting firms, IT staffing/outsourcing vendors, startups, and SMEs** — its focus is candidate sourcing, AI-powered CV-JD matching, and managing a network of recruiting collaborators (CTV), not generic internal HR administration.

Architecture: an **Nx monorepo** with `apps/api` (NestJS 11 + tRPC 11), `apps/web` (React 19 + Vite), `apps/landing` (Astro 5), and `apps/mobile` (React Native) — see [Fullstack Architecture for Testers](../foundations/01-kien-truc-fullstack-cho-tester/) for details.

### Main Modules

| Module | Description | Key Features |
|--------|-------------|---------------|
| **Authentication** | Login/logout, member invitations | JWT (7-day access token, 30-day refresh token), invite-only — no open signup |
| **AI CV-JD Matching** | AI-scored CV vs. JD matching | Multi-provider AI (Gemini/Claude/DeepSeek/Minimax), multi-criteria scoring, suggested interview questions |
| **Candidates / Jobs** | Candidate profiles & job postings | Automatic AI CV/JD parsing, full-text search (Meilisearch) |
| **Applications (ATS Pipeline)** | Kanban-style recruitment pipeline | `Applied → Screening → Client Submit → Interview → Offer → Hired/Rejected`, Time-to-Submit/Time-to-Hire tracking |
| **Client Requisition Portal** | Portal for the agency's clients | Manages headcount, salary range, and commission % per project |
| **CTV / Referral Network** | Network of candidate-referring collaborators | Dedicated CTV portal, "first-submitted, first-owned" attribution rule, commission lifecycle with warranty/clawback |
| **Interviews** | Interview scheduling, feedback | Structured evaluation and ratings |
| **CV Template Engine** | Standardizes candidate CVs into a template | One-click export as agency-branded CVs |
| **Workflow Automation** | n8n-style automation for ATS rules | Event-triggered rules, dry-run mode before going live |
| **File Storage** | Storing CVs and attachments | MinIO (S3-compatible, self-hosted) |

:::note[Why this list differs from older docs]
This list reflects the real feature set documented in hr-tool's `README.vn.md`. If you see older material centered on Employees/Departments/Positions as the core modules, that's outdated — the product's current focus is **sourcing & ATS for agencies**, not internal HR administration.
:::

### User Roles

| Role | Description | Access |
|------|--------------|--------|
| `super_admin` | System owner (`companyId = null`) | Every tenant, system settings |
| `admin` | Tenant administrator | Full access within their own company |
| `hr` | Recruiting & HR specialist | Most recruitment-related features |
| `tech_lead` | Technical interviewer | Read-only + interview feedback |

:::tip[CTV is not one of the four roles above]
Referral collaborators (CTV) access the platform through a separate **CTV Portal (Referral Portal)**, distinct from the four internal roles above. When writing automation tests, each access type (regular user, CTV, headhunt) has its own `storageState` — see [Case Study: Multi-role Auth & Permission Testing](../case-studies/03-multi-role-auth-permission/).
:::

---

## 6. Environment Setup

### Staging Environment

| Item | Value |
|------|-------|
| **Web App URL** | https://hr-tool-software.netlify.app (Netlify) |
| **API URL** | https://api.staging.ethansoftwaredeveloper.com (VPS + Cloudflare Tunnel) |
| **Landing Page URL** | https://ethansoftwaredeveloper.com (Vercel) |
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
