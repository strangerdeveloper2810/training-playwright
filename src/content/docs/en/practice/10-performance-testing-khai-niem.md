---
title: Performance Testing - Concepts
description: Core performance testing concepts for QC engineers who aren't performance specialists
---

# Performance Testing - Concepts

QC Training Documentation - HR Tool

You don't need to become a performance engineer to recognize when a feature is "unusually slow" and needs escalating. This lesson gives you the foundational concepts to talk about performance confidently with Dev/Tech Lead.

## Table of Contents

1. [Types of Performance Testing](#1-types-of-performance-testing)
2. [Key metrics to know](#2-key-metrics-to-know)
3. [When QC should care about performance](#3-when-qc-should-care-about-performance)
4. [Common tools (awareness level)](#4-common-tools-awareness-level)
5. [Practice Exercises](#5-practice-exercises)

---

## 1. Types of Performance Testing

| Type | Purpose | Example |
|------|---------|---------|
| **Load Testing** | See how the system behaves under **normal/expected** load | 100 HR staff simultaneously filtering the Candidates list during business hours |
| **Stress Testing** | Push the system past normal load to find its breaking point | Gradually increase concurrent users until the API starts erroring/slowing down |
| **Spike Testing** | Check behavior when load **suddenly** jumps for a short period | A large company imports 5,000 candidates at once |
| **Soak Testing** | Check the system running continuously over a long period | Run the system for 24-48 hours straight to catch memory leaks or gradual slowdowns |

## 2. Key metrics to know

| Metric | Meaning |
|--------|---------|
| **Response Time / Latency** | Time from sending a request to receiving the full response |
| **Throughput** | Number of requests the system can handle per unit of time (requests/second) |
| **Error Rate** | Percentage of requests that fail (timeouts, 500s...) out of the total |
| **Concurrent Users** | Number of users acting on the system at the same time |

When a Dev/Tech Lead says "this API has a P95 latency of 800ms", it means 95% of requests respond in ≤ 800ms — P95/P99 are usually more meaningful than the average, since they reflect the experience of the "unluckiest" users.

## 3. When QC should care about performance

QC (without deep performance expertise) should pay attention and **escalate** when:

- A simple action (search, filter, form submit) noticeably takes more than 2-3 seconds compared to similar actions elsewhere.
- A feature is fast with little data but becomes noticeably slower as data grows (e.g. a list of 1,000 candidates loads much slower than 10 — possibly due to missing pagination or an unoptimized query).
- A heavy feature (AI CV-JD Matching, large file import, report export) has no loading/progress indicator, leaving users unsure whether the system is working or stuck.
- After a deployment, the whole system responds noticeably slower than before (a performance regression).

:::tip[What to record when you spot it]
Record: the specific action, the measured response time (you can get this from the DevTools Network tab), the amount of data involved, and how often it happens (always slow, or only sometimes). This is exactly what Dev needs to investigate.
:::

## 4. Common tools (awareness level)

QC doesn't need to operate these tools directly, but should recognize them when Dev/Automation Testers mention them:

- **k6**: a scripting tool (JavaScript) for simulating many concurrent users hitting an API, measuring response time/error rate — commonly used for API-level Load/Stress Testing.
- **JMeter**: similar to k6 but configured through a GUI, a long-standing industry staple.
- **Lighthouse (Performance tab)**: measures frontend page-load performance (load time, time to interactive...) — QC can run this directly (see [Usability & Accessibility Testing](./09-usability-accessibility-testing/) for how to open Lighthouse).

Deeper, hands-on performance automation is covered later in [Automated Performance & Security Testing](../automation/20-performance-security-testing-tu-dong/) within the Automation track.

## 5. Practice Exercises

1. Open the Network tab in DevTools, search for candidates on Staging, and record the response time (`Time`) of the corresponding API request.
2. Run Lighthouse Performance on the Dashboard page and note the score and "Time to Interactive" metric.
3. In your own words, explain the difference between Load Testing and Stress Testing, with a concrete HR Tool example for each.
4. If you discovered that "Export CSV Report" takes over 30 seconds with 5,000 rows, write a short escalation message to the Tech Lead using the information points covered in section 3.

## Next Steps

Continue with [Security Testing Basics](./11-security-testing-co-ban/).

---

**Need help?** Contact the QC Lead or post in #qc-team
