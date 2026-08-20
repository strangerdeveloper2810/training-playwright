---
title: Test Metrics & Dashboard
description: Key metrics QC/QA teams track and how to present them in a sprint/release report
---

# Test Metrics & Dashboard

QC Training Documentation - HR Tool

A test report isn't just "how many test cases we ran." Stakeholders (PM, CTO, customers) need numbers that actually reflect product quality. This lesson introduces the key metrics and how to present them clearly.

## Table of Contents

1. [Why metrics, not just narrative reports](#1-why-metrics-not-just-narrative-reports)
2. [Key metrics](#2-key-metrics)
3. [How to present a report dashboard](#3-how-to-present-a-report-dashboard)
4. [Sample metrics table](#4-sample-metrics-table)
5. [Explaining numbers to non-technical stakeholders](#5-explaining-numbers-to-non-technical-stakeholders)
6. [Practice Exercises](#6-practice-exercises)

---

## 1. Why metrics, not just narrative reports

A sentence like "testing went fine this sprint, a few minor bugs" doesn't help anyone make a decision. Concrete metrics (numbers) help you:

- Compare quality across sprints/releases over time (is it getting better or worse?).
- Spot high-risk areas early (which module produces the most bugs?).
- Make an objective, evidence-based call on whether to release or hold.

## 2. Key metrics

| Metric | Formula / How to calculate | Meaning |
|--------|------------------------------|---------|
| **Defect Density** | Bugs found ÷ number of test cases (or ÷ feature size) | Which features have a higher bug ratio and need closer review before release |
| **Defect Leakage** | Bugs found in Production ÷ total bugs (QC + Production) | Measures how effective the test process is — high leakage means QC is missing a lot of bugs |
| **Test Case Pass Rate** | Passed test cases ÷ total executed test cases | The percentage of test cases that met their expected result |
| **Test Coverage** | Features/requirements with test cases ÷ total features/requirements | Measures how much of the requirements the test documentation actually covers (not code coverage) |
| **Mean Time To Detect (MTTD)** | Average time from when a bug enters the code to when it's found | High MTTD means bugs live longer before being caught, potentially affecting more users |
| **Mean Time To Resolve (MTTR)** | Average time from when a bug is reported to when it's fixed & verified | Measures how quickly the team responds to reported issues |

## 3. How to present a report dashboard

A weekly/sprint/release report dashboard should include at minimum:

1. **Quick overview** (3-5 headline numbers, easy to scan): total test cases, pass rate, new bugs, open bugs by priority.
2. **Trend chart** (if possible): pass rate or bug count across recent sprints, to spot a rising or falling trend.
3. **Bugs by module**: helps identify which module is currently "hot" (high bug count).
4. **Risks/blockers list**: open Critical/High bugs that could affect the release decision.

:::tip[Tooling]
If the team uses JIRA, most of these numbers can be pulled directly from a JIRA Dashboard/JQL filter rather than calculated by hand. Ask your QC Lead for help setting up the right filters.
:::

## 4. Sample metrics table

**Sprint 24 Report — CV Matching Module**

| Metric | Value |
|--------|-------|
| Total test cases executed | 85 |
| Passed | 78 |
| Failed | 7 |
| **Pass Rate** | 91.8% |
| New bugs found | 9 |
| Critical/High bugs | 2 |
| Bugs fixed & verified | 6 |
| Bugs still open | 3 |
| **Defect Density** | 9 ÷ 85 ≈ 0.11 bugs/test case |

## 5. Explaining numbers to non-technical stakeholders

When presenting to a PM/customer, don't just hand over raw numbers — add a sentence explaining what they mean in practice:

> "Pass rate is 91.8% — up from last sprint's 87% — but there are 2 remaining Critical bugs related to incorrect CV Matching scores in certain edge cases. Recommendation: **do not release** this module until both Critical bugs are fixed and verified."

Rule of thumb: always pair numbers with a **concrete recommended action** (release/hold, need more testing time, which module Dev should prioritize) — that's the real value of a report, not the numbers by themselves.

## 6. Practice Exercises

1. Using a recent sprint you were part of (or hypothetical data), calculate the Pass Rate and Defect Density using the formulas above.
2. Explain the difference between Defect Density and Defect Leakage — why do these two numbers measure different aspects of quality?
3. Write a short summary (3-4 sentences) for a PM about a module's test results, including a release/hold recommendation.
4. Propose the 3 metrics you think are most important for the "Quick overview" section of a weekly HR Tool report dashboard.

## Next Steps

Go back to [Test Report Templates](./06-test-report-template/) for the full report template, or continue to the [Automation Testing](../automation/01-vi-sao-automation-test-pyramid/) track.

---

**Need help?** Contact the QC Lead or post in #qc-team
