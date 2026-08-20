---
title: Database Verification in Automation
description: When automated tests need to verify data directly in the database, how to connect safely, and what risks to watch for
---

# Database Verification in Automation

QC Training Documentation - HR Tool

Most automation tests only need to verify through the UI or the API — that's enough. But there are cases where both the UI and the API can "lie": showing the right thing while the underlying data is wrong, or hiding a record from the UI while it still exists in the database. This lesson covers when and how automated tests should verify the database directly.

## Table of Contents

1. [Why you sometimes need to verify the database directly](#1-why-you-sometimes-need-to-verify-the-database-directly)
2. [Connecting to a database from a Playwright test](#2-connecting-to-a-database-from-a-playwright-test)
3. [Example: create via UI, verify via DB, then clean up](#3-example-create-via-ui-verify-via-db-then-clean-up)
4. [Risks to watch for](#4-risks-to-watch-for)
5. [Best practices](#5-best-practices)
6. [Practice exercises](#6-practice-exercises)

## 1. Why you sometimes need to verify the database directly

A few situations where the UI/API alone aren't enough:

- **Soft-delete**: the UI hides a "deleted" candidate from the list, but the actual record still exists in the database with a `deletedAt` flag. Looking at the UI alone, you can't be sure whether the data was physically removed — which matters for data-compliance requirements.
- **Data integrity**: after a bulk update, the UI shows the correct value for the records you happen to look at, but some other record might have been updated incorrectly without you checking every single one through the UI.
- **Multi-tenant isolation**: you need to be certain company A's data never gets tagged with company B's `companyId` — hard to see from the UI, since the UI always only shows data for the currently logged-in company.
- **Hidden side effects**: an action might create several related records (e.g. creating an Application also creates an `ApplicationStageEvent` log entry) that the UI never displays directly.

Outside of these cases, verifying through the UI/API is still the preferred choice — faster to write and cheaper to maintain.

## 2. Connecting to a database from a Playwright test

Playwright has no built-in database API — you use a regular Node.js library (e.g. `pg` for PostgreSQL) inside your test file or a dedicated helper.

```typescript
// utils/db.ts
import { Pool } from 'pg';

// This must always point at a dedicated test/staging database — NEVER production
const pool = new Pool({ connectionString: process.env.TEST_DATABASE_URL });

export async function queryDb<T = unknown>(sql: string, params: unknown[] = []): Promise<T[]> {
  const result = await pool.query(sql, params);
  return result.rows as T[];
}

export async function closeDbPool() {
  await pool.end();
}
```

:::caution[Never point at production]
`TEST_DATABASE_URL` must always be a connection string dedicated to a test/staging environment. Never let an automation test — which may have `DELETE`/`UPDATE` privileges — run directly against the production database.
:::

## 3. Example: create via UI, verify via DB, then clean up

```typescript
import { test, expect } from '../../fixtures/test-fixtures';
import { queryDb } from '../../utils/db';

test.describe('Candidate creation - verify DB', () => {
  const testEmail = `candidate-${Date.now()}@example.com`;

  test('creating a candidate via UI produces the correct DB record', async ({ candidatesPage }) => {
    await candidatesPage.goto();
    await candidatesPage.createCandidate({ name: '[TEST] DB Check', email: testEmail });

    // Verify directly in the database — the table/columns below are illustrative;
    // check them against the real schema before relying on this.
    const rows = await queryDb<{ id: string; email: string; company_id: string }>(
      'SELECT id, email, company_id FROM candidates WHERE email = $1',
      [testEmail]
    );

    expect(rows).toHaveLength(1);
    expect(rows[0].email).toBe(testEmail);
  });

  test.afterEach(async () => {
    // Clean up test data so it doesn't pollute the test environment
    await queryDb('DELETE FROM candidates WHERE email = $1', [testEmail]);
  });
});
```

## 4. Risks to watch for

| Risk | Why | How to mitigate |
|---|---|---|
| Slower test runs | Opening a DB connection takes time, especially with many queries | Use a connection pool, only query when truly necessary |
| Requires DB access | Not every QC has database credentials | Request read (and write, if cleanup is needed) access to the **test/staging** database from your Tech Lead |
| Leftover data if cleanup is skipped | A test creates data but never deletes it, polluting the test environment | Always clean up in `afterEach`/`afterAll`; prefix test data with `[TEST]` so it's easy to spot and batch-clean if needed |
| Tests tightly coupled to the schema | Renaming a column or table breaks the automation immediately | Only use DB verification for cases that truly need it; otherwise prefer API/UI verification |

## 5. Best practices

- Only use DB verification for **important cases that can't be verified another way** (data integrity, soft-delete, multi-tenant isolation) — don't reach for it by default.
- Prefer verifying through a tRPC query (see [API/tRPC Testing](./16-api-testing-playwright-trpc/)) whenever it's sufficient — it's less coupled to the raw schema than direct SQL.
- Always clean up test data you create, and prefix it with `[TEST]` so leftovers are easy to spot.
- Never grant an automation test `DELETE`/`UPDATE` privileges on the production database.

## 6. Practice exercises

1. Describe a concrete HR Tool scenario where, in your opinion, the UI/API alone isn't enough to conclude a test passed and a DB check is needed.
2. Write (on paper or as pseudocode) a test case that verifies that deleting a Job doesn't cascade-delete its related Applications (or handles them however the intended design specifies).
3. Name two risks of giving an automation test direct write access to a production database.

## Next Steps

Next: [Debug, Trace Viewer & Codegen](./18-debug-trace-viewer-codegen/) — tools for debugging a failing automated test.

**Need help?** Contact your QC Lead or #qc-team
