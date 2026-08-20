---
title: Unit Testing Basics
description: What unit testing is, how it differs from E2E testing, and how to read unit tests developers write with Jest
---

# Unit Testing Basics

QC Training Documentation - HR Tool

**Version:** 1.0
**Updated:** 2026-08-20
**Author:** QC Team

---

## Table of Contents

1. [What is Unit Testing?](#1-what-is-unit-testing)
2. [Unit Test vs. E2E Test](#2-unit-test-vs-e2e-test)
3. [Why QC should be able to read Unit Tests, even without writing them](#3-why-qc-should-be-able-to-read-unit-tests-even-without-writing-them)
4. [Anatomy of a Jest Unit Test](#4-anatomy-of-a-jest-unit-test)
5. [What is Mocking?](#5-what-is-mocking)
6. [Unit Tests at HR Tool](#6-unit-tests-at-hr-tool)
7. [Reading a Coverage Report](#7-reading-a-coverage-report)
8. [Practice Exercises](#8-practice-exercises)

---

## 1. What is Unit Testing?

A **Unit Test** checks the smallest unit of code — usually a single function or method — in **isolation**: no browser, no real API calls, no real database.

Example: HR Tool has a function that scores how well a candidate's CV matches a job description. A unit test for it just calls the function with sample input and checks the output — no need to run the whole application:

```typescript
function calculateMatchScore(candidateSkills: string[], jobSkills: string[]): number {
  const matched = candidateSkills.filter(skill => jobSkills.includes(skill));
  return Math.round((matched.length / jobSkills.length) * 100);
}

test('scores 50% when 2 of 4 required skills match', () => {
  const score = calculateMatchScore(['React', 'Node.js'], ['React', 'Node.js', 'AWS', 'Docker']);
  expect(score).toBe(50);
});
```

## 2. Unit Test vs. E2E Test

| | Unit Test | E2E Test (Playwright) |
|---|---|---|
| **Checks** | A single function/method | A full user journey through the real UI |
| **Speed** | Extremely fast (milliseconds) | Slower (seconds — a real browser has to launch) |
| **Needs a browser?** | No | Yes |
| **Needs a real DB/API?** | No (usually mocked) | Yes (or a staging environment) |
| **Who writes it at HR Tool** | Developer | QC |
| **Catches what kind of bugs** | Logic bugs inside one function | Integration bugs, real UI bugs |

Both are necessary and **complement each other** — a function can pass its unit test (correct logic) while the UI is still broken because it calls the wrong API, and vice versa.

## 3. Why QC should be able to read Unit Tests, even without writing them

At HR Tool, developers write unit tests (for `apps/api`) and component tests (for `apps/web`, using Jest + React Testing Library). QC usually doesn't write this kind of test, but should still be able to read it, because:

- When reviewing a Pull Request that includes tests, you need to judge whether the test **actually verifies the logic** or was just written to check a box.
- When a bug shows up, knowing "should a unit test have caught this?" helps you write a more accurate bug report (is this a logic bug or an integration bug?).
- HR Tool follows a TDD process (tests written before the code) — understanding test structure helps you talk about coverage with developers more effectively.

## 4. Anatomy of a Jest Unit Test

HR Tool uses **Jest 30** for unit/integration testing. The basic structure:

```typescript
import { describe, it, expect } from '@jest/globals';

describe('calculateMatchScore', () => {
  it('returns 100 when every skill matches', () => {
    const score = calculateMatchScore(['React'], ['React']);
    expect(score).toBe(100);
  });

  it('returns 0 when no skills match', () => {
    const score = calculateMatchScore(['Java'], ['React']);
    expect(score).toBe(0);
  });

  it('throws when the job skills list is empty', () => {
    expect(() => calculateMatchScore(['React'], [])).toThrow();
  });
});
```

| Keyword | Meaning |
|---------|---------|
| `describe('...', () => {...})` | Groups related test cases (similar to Playwright's `test.describe`) |
| `it('...', () => {...})` or `test('...', ...)` | A single test case |
| `expect(value).toBe(x)` | An assertion — compares the actual result to what's expected |
| `beforeEach()` / `afterEach()` | Runs before/after every test in a `describe` block |

## 5. What is Mocking?

**Mocking** means faking part of the system (an API call, a database, a third-party service) so a unit test doesn't depend on it — keeping the test fast and stable:

```typescript
// Fake the AI service so we don't call the real Gemini/Claude API in tests
jest.mock('../services/ai-provider.service', () => ({
  matchCvToJd: jest.fn().mockResolvedValue({ score: 85, reasons: ['Skills match well'] }),
}));

test('calls the AI provider and returns the match score', async () => {
  const result = await cvMatchingService.evaluate(candidateId, jobId);
  expect(result.score).toBe(85);
});
```

Without mocking, the test would call the real AI API every single run — slow, costs money, and the result could vary between runs (not deterministic).

## 6. Unit Tests at HR Tool

By convention, every backend feature has a matching test file right next to it:

```
apps/api/src/contexts/recruitment/cv-matching/
├── cv-matching.service.ts
├── cv-matching.service.spec.ts   ← unit test for the service
├── cv-matching.router.ts
├── cv-matching.router.spec.ts    ← test for the tRPC router
```

Convention: test files always end in `.spec.ts` and live next to the file they test — you can find any feature's tests by looking for a `.spec.ts` file with a matching name.

## 7. Reading a Coverage Report

**Test Coverage** is the percentage of code that gets executed when unit tests run. HR Tool aims fairly high (Backend ~99% lines, Frontend ~97% lines). Running `yarn test --coverage` prints something like:

```
File                        | % Stmts | % Branch | % Funcs | % Lines
-----------------------------|---------|----------|---------|--------
cv-matching.service.ts       |   95.2  |   88.0   |  100.0  |  95.2
```

High coverage **does not mean** "no bugs" — it only tells you the code was *executed*, not that the test verified the right behavior. That's exactly why E2E tests (written by QC) are still necessary even when unit test coverage is already very high.

:::tip[A tip for reviewing PRs]
If a PR adds new logic but the file's % Branch coverage is noticeably lower than its % Lines, there's likely an `if/else` branch or `try/catch` path that isn't tested — worth asking the developer about.
:::

## 8. Practice Exercises

1. For the `calculateMatchScore` function in section 1, write an additional test case for when `candidateSkills` is an empty array.
2. In your own words, explain why a developer should **mock** the AI provider call (Gemini/Claude) in a unit test instead of calling it for real.
3. Imagine a PR that adds a "delete candidate" feature — what questions would you ask the developer about unit test coverage before approving it?

## Next Step

Continue with [Playwright 101](../automation/04-playwright-101/) — where you start writing at the E2E layer, the one QC actually owns.

---

**Need help?** Contact your QC Lead or post in #qc-team
