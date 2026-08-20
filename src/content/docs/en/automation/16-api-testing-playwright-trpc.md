---
title: API Testing with Playwright & tRPC
description: Test APIs directly with Playwright's request fixture, call HR Tool's tRPC endpoints, and mock network responses with page.route
---

# API Testing with Playwright & tRPC

QC Training Documentation - HR Tool

Playwright isn't only for driving a browser. It also ships a dedicated fixture called `request` that lets you call an API directly without opening a browser at all — much faster than UI testing, and great for seeding data or verifying backend logic independently of the interface.

## Table of Contents

1. [What is the `request` fixture](#1-what-is-the-request-fixture)
2. [Testing a regular REST endpoint](#2-testing-a-regular-rest-endpoint)
3. [Testing HR Tool's tRPC endpoints](#3-testing-hr-tools-trpc-endpoints)
4. [Network mocking with `page.route`](#4-network-mocking-with-pageroute)
5. [When to use API tests vs UI tests](#5-when-to-use-api-tests-vs-ui-tests)
6. [Practice exercises](#6-practice-exercises)

## 1. What is the `request` fixture

Playwright exposes an `APIRequestContext` through the `request` fixture — it lets you send `GET`/`POST`/`PUT`/`DELETE` requests straight to an API, like Postman but written as code that runs alongside your automated test suite in CI.

```typescript
import { test, expect } from '@playwright/test';

test('call an API directly, no browser needed', async ({ request }) => {
  const response = await request.get('/health');
  expect(response.ok()).toBeTruthy();
});
```

Why this is often faster and more stable than driving the UI:

| Criterion | UI test | API test (`request`) |
|---|---|---|
| Speed | Slow (rendering, animations, waiting) | Fast (just an HTTP round-trip) |
| Stability | Prone to flakiness (layout shifts, moving elements) | Much more stable |
| Coverage | The full user journey | Backend/API logic only |
| Best used for | Confirming the real user experience | Verifying business logic, fast data seeding |

## 2. Testing a regular REST endpoint

For a plain REST API, the test structure is straightforward: send the request, check the status code, check the response body.

```typescript
// tests/api/auth.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Auth API', () => {
  test('successful login returns an access token', async ({ request }) => {
    const response = await request.post('/api/auth/login', {
      data: { email: 'admin@test.com', password: 'password123' },
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body).toHaveProperty('accessToken');
    expect(body.user.email).toBe('admin@test.com');
  });

  test('wrong password returns 401', async ({ request }) => {
    const response = await request.post('/api/auth/login', {
      data: { email: 'admin@test.com', password: 'wrong-password' },
    });

    expect(response.status()).toBe(401);
  });
});
```

:::note[Test data]
`admin@test.com` / `password123` here are just illustrative placeholders. When you write real tests, always use a test account provided by your QC Lead — never hardcode real credentials in code, especially anything pushed to git.
:::

## 3. Testing HR Tool's tRPC endpoints

HR Tool uses **tRPC**, not plain REST, so the request/response shape is a little different. Because the backend is configured with `httpBatchLink` **without a transformer**, every request goes through a "batch" shape — the input is wrapped in an object keyed by index `"0"`, and the response is an **array**, with the actual result at `[0].result.data`.

```typescript
// utils/trpc.ts — helper for calling tRPC from tests
import type { APIRequestContext } from '@playwright/test';

const API = process.env.API_URL || 'http://localhost:3000';

export async function loginToken(
  request: APIRequestContext,
  email = '[TEST_EMAIL]',
  password = '[TEST_PASSWORD]'
): Promise<string> {
  const res = await request.post(`${API}/trpc/auth.login?batch=1`, {
    data: { '0': { email, password } },
  });
  const json = await res.json();
  const token = json?.[0]?.result?.data?.accessToken;
  if (!token) throw new Error(`login failed: ${JSON.stringify(json).slice(0, 200)}`);
  return token;
}

export async function trpcMutate<T = unknown>(
  request: APIRequestContext,
  token: string,
  path: string,
  input: unknown
): Promise<T> {
  const res = await request.post(`${API}/trpc/${path}?batch=1`, {
    headers: { Authorization: `Bearer ${token}` },
    data: { '0': input },
  });
  const json = await res.json();
  if (json?.[0]?.error) throw new Error(`${path}: ${json[0].error.message}`);
  return json[0].result.data as T;
}

export async function trpcQuery<T = unknown>(
  request: APIRequestContext,
  token: string,
  path: string,
  input: unknown = {}
): Promise<T> {
  const qs = encodeURIComponent(JSON.stringify({ '0': input }));
  const res = await request.get(`${API}/trpc/${path}?batch=1&input=${qs}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const json = await res.json();
  if (json?.[0]?.error) throw new Error(`${path}: ${json[0].error.message}`);
  return json[0].result.data as T;
}
```

Using it in a test:

```typescript
import { test, expect } from '@playwright/test';
import { loginToken, trpcMutate, trpcQuery } from '../../utils/trpc';

test('create a candidate via tRPC, then verify with a query', async ({ request }) => {
  const token = await loginToken(request);

  const created = await trpcMutate(request, token, 'candidate.create', {
    name: '[TEST] Jane Doe',
    email: `candidate-${Date.now()}@example.com`,
  });
  expect(created).toHaveProperty('id');

  const list = await trpcQuery(request, token, 'candidate.list', { page: 1, limit: 10 });
  expect(Array.isArray(list.items)).toBeTruthy();
});
```

:::tip[Why write a dedicated helper?]
The `?batch=1` + `"0"` key format is fairly unusual compared to REST. Writing these three helpers (`loginToken`, `trpcMutate`, `trpcQuery`) once and reusing them everywhere avoids every test re-implementing the same response-parsing logic.
:::

:::caution[The exact format can differ between projects]
How tRPC wraps requests/responses depends on the `httpBatchLink` configuration and whether a `transformer` (commonly `superjson`) is used. Some tRPC projects use a `{ json: { ... } }` / `result.data.json` shape instead of `{ "0": ... }` / `result.data`. Always check the real router configuration of the project you're testing before copying this helper verbatim.
:::

## 4. Network mocking with `page.route`

Sometimes you need to test how the UI behaves when the API **fails** or returns **unusual data** — situations that are hard to reproduce with real data (a 500 error, a slow response, an empty list). `page.route()` lets you intercept a request and return a fake response, without touching the real backend at all.

```typescript
import { test, expect } from '@playwright/test';

test('renders mocked data correctly', async ({ page }) => {
  await page.route('**/trpc/candidate.list*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([{
        result: { data: { items: [{ id: '1', name: 'Mock Candidate' }], total: 1 } },
      }]),
    });
  });

  await page.goto('/candidates');
  await expect(page.getByText('Mock Candidate')).toBeVisible();
});

test('shows an error message when the API returns 500', async ({ page }) => {
  await page.route('**/trpc/candidate.list*', async (route) => {
    await route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({ error: { message: 'Internal Server Error' } }),
    });
  });

  await page.goto('/candidates');
  await expect(page.getByText(/error/i)).toBeVisible();
});

test('modifies the original response before returning it', async ({ page }) => {
  await page.route('**/trpc/candidate.list*', async (route) => {
    const response = await route.fetch();
    const json = await response.json();
    // assuming json[0].result.data.items exists, tweak it to check the UI reflects the change
    await route.fulfill({ response, json });
  });

  await page.goto('/candidates');
});
```

Three common uses for network mocking: simulating a server error, simulating an empty list, and tweaking the real response to test a specific field without creating real data for it.

## 5. When to use API tests vs UI tests

- **Use API tests when:** you want to quickly verify business logic (validation, permissions, calculations); you need to seed a lot of data before a UI test; you want to test edge cases (errors, timeouts) that are hard to reproduce through the UI.
- **Use UI tests when:** you need to confirm a real user can actually complete the flow (clicking the right thing, seeing the right message); you're testing something that only exists at the interface layer (form validation, animations, responsiveness).
- In practice, a good automation suite usually **combines both**: use the API to seed setup data quickly, then use a UI test to verify the real experience.

## 6. Practice exercises

1. Write a test that uses `request` to log in to HR Tool via tRPC and retrieve an `accessToken`.
2. Use that token to call a `list` endpoint (e.g. `job.list` or `candidate.list`) and assert the response has an `items` field.
3. Write a test that uses `page.route` to simulate a 500 error for the Candidates page, and check that the UI shows an appropriate error message.
4. Think of one situation where you'd prefer an API test over a UI test for HR Tool, and explain why.

## Next Steps

Next: [Database Verification in Automation](./17-database-verification-automation/) — when automated tests need to verify data directly in the database.

**Need help?** Contact your QC Lead or #qc-team
