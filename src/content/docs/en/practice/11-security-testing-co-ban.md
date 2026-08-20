---
title: Security Testing Basics
description: OWASP Top 10 concepts and basic security test cases manual QC can perform
---

# Security Testing Basics

QC Training Documentation - HR Tool

You don't need to be a hacker to catch basic security flaws. This lesson introduces the OWASP Top 10 in plain language and the security test cases manual QC can run without any specialized tooling.

## Table of Contents

1. [What is the OWASP Top 10](#1-what-is-the-owasp-top-10)
2. [OWASP Top 10 in plain language](#2-owasp-top-10-in-plain-language)
3. [Test case: IDOR (accessing another company's/user's data)](#3-test-case-idor-accessing-another-companys users-data)
4. [Test case: basic input validation](#4-test-case-basic-input-validation)
5. [Test case: Session & Token](#5-test-case-session--token)
6. [Principles for reporting security bugs](#6-principles-for-reporting-security-bugs)
7. [Practice Exercises](#7-practice-exercises)

---

## 1. What is the OWASP Top 10

**OWASP** (Open Worldwide Application Security Project) is a non-profit focused on web application security. The **OWASP Top 10** is a periodically updated list of the most common and dangerous web vulnerability categories — treat it as required reading for anyone working on the web, QC included.

:::caution[Scope of this lesson]
This lesson only helps you **recognize and report** basic security issues. It does not teach deep exploitation techniques — if you suspect a serious vulnerability, report it immediately to the Tech Lead/Security team rather than probing further on Staging or Production.
:::

## 2. OWASP Top 10 in plain language

| # | Vulnerability category | Plain-language explanation |
|---|------------------------|------------------------------|
| 1 | **Broken Access Control** | A user can do something they shouldn't be able to (view/edit someone else's data, reach an admin page despite not being an admin) |
| 2 | **Cryptographic Failures** | Sensitive data (passwords, tokens) isn't encrypted/hashed properly |
| 3 | **Injection** | An attacker sneaks malicious code (SQL, scripts...) through input to manipulate the system |
| 4 | **Insecure Design** | A flaw baked into the system's design, not just its code (e.g. no limit on login attempts) |
| 5 | **Security Misconfiguration** | Misconfigured settings (debug mode left on in production, exposing detailed error info to end users) |
| 6 | **Vulnerable Components** | Using a library/dependency with a known vulnerability that hasn't been updated |
| 7 | **Authentication Failures** | Flaws in authentication: weak passwords still accepted, no brute-force protection |
| 8 | **Data Integrity Failures** | Data gets tampered with in transit or during processing |
| 9 | **Logging & Monitoring Failures** | The system doesn't log enough to detect/investigate a security incident |
| 10 | **Server-Side Request Forgery** | The system gets tricked into sending a request to an unintended destination (usually related to file/URL-fetching features) |

Manual QC typically finds issues in categories 1 (Broken Access Control), 3 (basic Injection), and 7 (Authentication) most easily — the next three sections dig into how.

## 3. Test case: IDOR (accessing another company's/user's data)

**IDOR** (Insecure Direct Object Reference) falls under Broken Access Control — it happens when the system relies only on the ID in a request without checking whether the caller actually has permission for that ID.

Since HR Tool is a **multi-tenant** system (every record is tied to a `company_id`), this is the MOST IMPORTANT category of test cases to run against any new feature:

1. Log into Company A, perform an action to obtain a record's ID (e.g. a candidate's ID) — this ID usually appears in the URL, like `/candidates/abc-123`.
2. Log into Company B (a different account), and try to directly access the URL `/candidates/abc-123` (which belongs to Company A).
3. **Expected result**: the system must return an error (403 Forbidden or 404 Not Found), and must NOT display Company A's data.
4. Repeat the same test by calling the API/tRPC directly with that ID (using Postman, see [Manual API Testing](./06-manual-api-testing/)) — the UI might block it while the underlying API doesn't.

:::tip[Also test across roles within the same company]
Beyond cross-company checks, also test IDOR between **roles** within the same company — e.g. can a `tech_lead` (per the README, limited to read-only + writing interview feedback) click through or call an API to edit Employee data?
:::

## 4. Test case: basic input validation

The goal is to check whether the system validates input properly, catching early warning signs of injection risk — without doing any deep exploitation.

A safe, basic way to test:

1. Enter special characters into input fields (especially search boxes, names, descriptions) such as: `' OR '1'='1`, `<script>alert(1)</script>`, `"; DROP TABLE users; --`.
2. Observe:
   - Does the system throw a 500 (Internal Server Error)? → a sign the input isn't handled safely, report it immediately.
   - Does the `<script>` string get rendered back on the page verbatim (unescaped)? → a sign of potential XSS (Cross-Site Scripting) risk, report it even if you haven't confirmed it's exploitable.
   - Does the system reasonably reject it (clear validation error) or store it as plain text without executing it? → this is **safe** behavior and meets expectations.
3. **Do not** attempt more advanced injection techniques or real exploitation — just detect the anomaly and report it.

## 5. Test case: Session & Token

| Test case | How to test | Expected result |
|-----------|--------------|-------------------|
| Does logout invalidate the token | Log in, save the `access_token`, click Logout, then call an API again with the old token | The API must return `401 Unauthorized` — the old token must no longer work |
| Does the token have a lifetime limit | Check the access token's expiry (HR Tool: 7 days) and refresh token's expiry (30 days) via docs/Dev | Tokens must expire exactly as designed, never live forever |
| Can't log in with an expired session | Wait for the token to expire (or test with a forged/tampered token) | The system denies access and requires logging in again |

## 6. Principles for reporting security bugs

- Report **immediately** to the Tech Lead/QC Lead through a private channel (not a public Slack channel), since a security vulnerability could be exploited if disclosed too broadly.
- Describe clearly: reproduction steps, the account/data used to test, and the estimated impact (whose data could be viewed/modified/deleted).
- Tag the ticket with the `security` label (see [Bug Report Template](../basics/02-bug-report-template/), Bug Categories section).
- Never probe further or share vulnerability details with anyone not directly involved.

## 7. Practice Exercises

1. Run the IDOR test case described in section 3 using two different Company accounts on Staging — record the result (pass/fail).
2. Try entering `<script>alert(1)</script>` into the name field when creating a new candidate — observe and record the system's behavior.
3. Check: after logging out, try reusing the old token (if you have the means/knowledge to do so) to call any API — does it correctly return `401`?
4. List 3 items from the OWASP Top 10 that you think manual QC (without specialized tools) can realistically catch, and explain why.

## Next Steps

Continue with [Test Metrics & Dashboard](../reports/07-test-metrics-dashboard/) to learn how to report overall testing results.

---

**Need help?** Contact the QC Lead or post in #qc-team
