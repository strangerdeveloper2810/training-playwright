---
title: Automated Performance & Security Testing
description: An introduction to automated performance tooling (Lighthouse CI, k6) and security tooling (dependency scanning, OWASP ZAP) at an awareness level for QC/testers
---

# Automated Performance & Security Testing

QC Training Documentation - HR Tool

This lesson is **introductory** — the goal isn't to turn you into a performance/security expert, but to make sure you know these tools exist, understand roughly how they work, and know when to escalate to a specialist.

## Table of Contents

1. [Why QC/testers should know about these tools](#1-why-qctesters-should-know-about-these-tools)
2. [Automated performance: Lighthouse CI](#2-automated-performance-lighthouse-ci)
3. [Automated load testing: k6](#3-automated-load-testing-k6)
4. [Automated security: dependency scanning & OWASP ZAP](#4-automated-security-dependency-scanning--owasp-zap)
5. [When to escalate](#5-when-to-escalate)
6. [Practice exercises](#6-practice-exercises)

## 1. Why QC/testers should know about these tools

In [Performance Testing Concepts](../practice/10-performance-testing-khai-niem/) and [Basic Security Testing](../practice/11-security-testing-co-ban/), you learned to spot performance/security issues manually. This lesson shows how those same issues can be **continuously automated** (running on every deploy), so you don't have to wait for a manual QC pass to catch them.

## 2. Automated performance: Lighthouse CI

**Lighthouse** is Google's tool for measuring Web Vitals (LCP — largest contentful paint, CLS — cumulative layout shift, TBT — total blocking time...). **Lighthouse CI** lets you run Lighthouse automatically in a pipeline and **fail the build** if scores drop below an acceptable threshold.

```yaml
# Example step in GitHub Actions
- name: Run Lighthouse CI
  run: |
    npm install -g @lhci/cli
    lhci autorun --collect.url=https://hr-tool-software.netlify.app
```

How to read the results: Lighthouse CI scores 0-100 across four categories (Performance, Accessibility, Best Practices, SEO), along with a list of specific issues (unoptimized images, an oversized JS bundle...). QC isn't expected to fix these issues personally, but should know how to read the report to report the right issue back to dev/FE accurately.

## 3. Automated load testing: k6

**k6** is an open-source tool for simulating many concurrent users hitting an API/website at once, to measure how much load the system can handle.

```javascript
// script.js - a very basic k6 scenario
import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  vus: 20,        // 20 virtual users
  duration: '30s',
};

export default function () {
  http.get('https://hr-tool-software.netlify.app/api/jobs');
  sleep(1);
}
```

```bash
k6 run script.js
```

The results report key metrics: `http_req_duration` (p95 — the response time under which 95% of requests completed), and `http_req_failed` (the error rate). If p95 spikes or the error rate climbs as virtual users increase, that's a sign the system isn't handling load well — worth reporting to the backend team.

## 4. Automated security: dependency scanning & OWASP ZAP

**Dependency scanning** — checks whether the packages/libraries a project depends on have known security vulnerabilities (CVEs):

```bash
npm audit
# or use Snyk for a more detailed report + fix suggestions
npx snyk test
```

**OWASP ZAP baseline scan** — automatically scans a website for common vulnerabilities (missing security headers, basic XSS, sensitive information leaking in responses...), typically run in CI against a staging environment:

```yaml
- name: OWASP ZAP Baseline Scan
  uses: zaproxy/action-baseline@v0.10.0
  with:
    target: 'https://hr-tool-staging.example.com'
```

:::caution[Only run against staging, never production]
Both load testing (k6) and security scanning (ZAP) generate abnormal traffic/request patterns — never point either at production without explicit approval and oversight from the operations team.
:::

## 5. When to escalate

QC/automation testers should **report and escalate** to a specialist (Performance Engineer, Security Engineer, Tech Lead) when:

- Lighthouse CI/k6 reports a significant drop in score or a spike in response time compared to before.
- `npm audit`/Snyk finds a High or Critical severity vulnerability.
- OWASP ZAP reports a discovered vulnerability (even at Medium severity) — don't attempt to "explore it further" without authorization.

Your role here is to be the **early detector and reporter**, not the person who resolves these deep, specialized issues.

## 6. Practice exercises

1. Run `npm audit` on any Node.js project you have access to (or hr-tool if you have permission) and read the report — how many vulnerabilities are there, and at what severity?
2. Explain in your own words what `p95 response time` means, and how it differs from average response time.
3. If Lighthouse CI reports the Performance score dropped from 90 to 60 after a deploy, what would you do before reporting it to a developer?

## Next Steps

Next: [Best Practices & Cheatsheet](./21-best-practices-cheatsheet/) — pulling together everything you've learned about automation testing.

**Need help?** Contact your QC Lead or #qc-team
