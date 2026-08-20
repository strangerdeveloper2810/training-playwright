---
title: Database Testing in Practice
description: A hands-on guide to verifying data in the database after performing actions on HR Tool's UI/API
---

# Database Testing in Practice

QC Training Documentation - HR Tool

[Database Fundamentals for Testers](../foundations/03-database-co-ban-cho-tester/) introduced basic SQL. This lesson puts it into practice: **perform an action on the UI/API, then verify it directly in the database** to make sure the system doesn't just "look right" — the data actually is right.

## Table of Contents

1. [Why trusting the UI alone isn't enough](#1-why-trusting-the-ui-alone-isnt-enough)
2. [Workflow for verifying the DB after an action](#2-workflow-for-verifying-the-db-after-an-action)
3. [Checking Data Integrity](#3-checking-data-integrity)
4. [Checking delete behavior (Cascading & Soft-delete)](#4-checking-delete-behavior-cascading--soft-delete)
5. [Checking Multi-tenant Isolation](#5-checking-multi-tenant-isolation)
6. [Practice Exercises](#6-practice-exercises)

---

## 1. Why trusting the UI alone isn't enough

The UI can "lie" in several unintentional ways:

- It shows a "Created successfully" message even though the record wasn't actually persisted (due to stale frontend caching).
- It shows exactly what you just typed, but only because the frontend kept the old state in memory — not because the backend saved it correctly.
- It removes an item from a list view, while the underlying record is still sitting in the database (only hidden at the UI layer).

Verifying directly in the database is the only way to be 100% certain the data is correct.

:::caution[Access]
Only verify the database on the **Staging** environment, using a **read-only** account issued by your QC Lead. Never modify or delete data directly in the database.
:::

## 2. Workflow for verifying the DB after an action

1. Note down exactly what action you just performed on the UI (e.g. created a new candidate with email `nguyenvana@test.com`).
2. Connect to the Staging database with the tool you were given (TablePlus/DBeaver/pgAdmin).
3. Query for the record you just created:

```sql
SELECT id, full_name, email, status, created_at
FROM candidates
WHERE email = 'nguyenvana@test.com'
ORDER BY created_at DESC
LIMIT 1;
```

4. Compare **every field** in the result against what you entered in the UI — don't just check "does a record exist", verify the details: correct `full_name`, correct `email`, `status` initialized to the right default value, `company_id` matching the company you're logged in as.
5. If the action touches other tables (e.g. creating an application should also link the correct `candidate_id` and `job_id`), query those relationships too.

## 3. Checking Data Integrity

Data integrity means the data always respects its intended constraints. Things QC should check:

- **No unreasonable duplicates**: e.g. can two candidates share the same email within the same company — is that blocked, or does the system allow it?
- **Required fields (NOT NULL)**: important fields (email, company_id) should never be empty in the DB, even if the UI accidentally allowed a form to submit without them.
- **Correct data types**: date fields must hold valid dates, numeric fields (like `salary_min`) must be numbers, not text.
- **Consistency across related tables**: if a Job has an `applications_count`, does that number match `SELECT COUNT(*) FROM applications WHERE job_id = ...`?

```sql
-- Check for candidates with duplicate emails within the same company
SELECT company_id, email, COUNT(*) 
FROM candidates 
GROUP BY company_id, email 
HAVING COUNT(*) > 1;
```

## 4. Checking delete behavior (Cascading & Soft-delete)

When a user deletes a record, one of two things happens:

- **Soft-delete**: the record stays in the database but gets flagged as deleted (e.g. `deleted_at IS NOT NULL`, or `status = 'deleted'`). This is common so data can be restored or kept for history.
- **Hard-delete**: the record is physically removed from the database and cannot be recovered.

Test cases QC should run:

1. Delete a Job that has candidates applied to it (linked Applications) — how does the system handle it? Do the applications get deleted too (cascading delete), is deletion blocked, or does the Job move to an "archived" state instead of being deleted?
2. After deleting via the UI, query the DB to confirm the expected behavior (soft vs. hard delete) — if it's a soft-delete, the record must still exist but be flagged, and must not reappear in normal UI/API listings.
3. Check related (child) tables for **orphan records** — child records that still exist after their parent record was deleted.

:::tip[Tip]
Orphan records or unclear cascading behavior are usually serious bugs (Medium-High priority) because they affect long-term data correctness — report them with concrete query evidence.
:::

## 5. Checking Multi-tenant Isolation

HR Tool is a **multi-tenant** system: every record is tied to a `company_id`, and data from Company A must never leak into Company B. This is the **most important** category of database test cases for HR Tool.

How to check:

1. Create test data under two different companies (following the setup guide in [QC Fundamentals](../basics/01-fundamentals/) — each QC should create their own test company).
2. While logged into Company A, try these to see if you can "see" Company B's data:
   - Swap the ID directly in the URL (e.g. `/candidates/<a-company-B-id>`).
   - Call the API/tRPC directly with a Company B ID (see [Security Testing Basics](./11-security-testing-co-ban/) for the IDOR technique).
3. Verify with a query: every SELECT that powers a feature must filter by `WHERE company_id = ...` — if this condition is missing at the code level, data will leak across tenants.

```sql
-- Quick check: list the company_id values returned for a feature
-- If a user belonging to only one company sees more than one company_id here, that's a data leak
SELECT DISTINCT company_id FROM candidates WHERE id IN (/* IDs returned by the UI/API */);
```

## 6. Practice Exercises

1. Create a new candidate through the UI, then write a SQL query to verify every field you entered was saved correctly in the database.
2. Try deleting a Job that has a linked Application — observe what the UI reports, then query the DB to confirm whether it's a soft-delete or hard-delete, and how the related Application was handled.
3. Write a query to check whether any candidate has a duplicate email within the same company.
4. In your own words, explain why a missing `company_id` condition in a query is a serious security bug, not just a display glitch.

## Next Steps

Continue with [Cross-browser & Compatibility Testing](./08-cross-browser-compatibility/).

---

**Need help?** Contact the QC Lead or post in #qc-team
