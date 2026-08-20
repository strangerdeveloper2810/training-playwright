---
title: Database Fundamentals for Testers
description: Learn to read data directly from the database to verify test outcomes instead of trusting the UI alone
---

# Database Fundamentals for Testers

QC Training Documentation - HR Tool

---

## Table of Contents

1. [Why Testers Need to Read a Database](#1-why-testers-need-to-read-a-database)
2. [Basic Concepts: Tables, Rows, Columns, Keys](#2-basic-concepts-tables-rows-columns-keys)
3. [Relationships Between Tables](#3-relationships-between-tables)
4. [Basic SQL Statements](#4-basic-sql-statements)
5. [SQL vs NoSQL](#5-sql-vs-nosql)
6. [Tools for Browsing a Database](#6-tools-for-browsing-a-database)
7. [Practice Exercises](#7-practice-exercises)

---

## 1. Why Testers Need to Read a Database

The UI only shows what the frontend **chooses** to display — and the frontend can render the wrong thing, render incomplete data, or show stale cached data. If you only trust the UI to confirm that an action "succeeded," you can miss serious bugs such as:

- The UI says "Candidate created successfully," but due to a transaction bug, the data **was never actually saved**.
- The UI looks correct, but the data was saved as a **duplicate** (two records instead of one) because of a double-submit bug.
- Deleting a job from the UI doesn't correctly handle related data (its applications) — they might be deleted when they shouldn't be, or left "orphaned," pointing at a job that no longer exists.
- Data from Company A accidentally leaks into Company B's records (a multi-tenancy isolation bug).

**Verifying directly against the database** is the most reliable way to confirm that an action truly happened as expected at the storage layer, not just at the display layer.

:::note[Access scope]
In practice, QC engineers are usually only granted **read-only** access to the Staging database, never direct write/delete access. Always request the correct access through your QC Lead/Tech Lead first.
:::

---

## 2. Basic Concepts: Tables, Rows, Columns, Keys

A **relational database** like PostgreSQL (HR Tool runs PostgreSQL 16) stores data in **tables**, similar to a spreadsheet with multiple sheets:

| id | full_name | email | company_id |
|----|-----------|-------|------------|
| 1 | John Smith | john@example.com | 10 |
| 2 | Jane Doe | jane@example.com | 10 |

- **Table**: a "sheet" holding data about one kind of entity, e.g. the `candidates` table, the `jobs` table, the `users` table.
- **Row (record)**: one specific entry, e.g. one particular candidate.
- **Column (field)**: an attribute, e.g. `full_name`, `email`.
- **Primary Key**: the column (usually `id`) that guarantees each row is unique.
- **Foreign Key**: a column referencing another table's primary key, used to express relationships — e.g. `company_id` above references the `companies` table.

---

## 3. Relationships Between Tables

Two common relationship types:

**One-to-many**: one company has many employees, but each employee belongs to exactly one company.

```
companies (1) ──────< employees (many)
   id=10                company_id=10
```

**Many-to-many**: one candidate can apply to many jobs, and one job can receive many candidates — usually modeled through a join table, e.g. an `applications` table linking `candidates` and `jobs`:

```
candidates ──< applications >── jobs
```

This is exactly the model behind HR Tool's **ATS (Applicant Tracking System)** module: an `application` is a join record tied to one `candidate` and one `job`, with its own status fields (which stage of the pipeline it's in: Applied → Screening → Interview → Offer → Hired).

**Why this matters for testers:** when testing "delete a job," ask what happens to the `application` records referencing it — do they get cascade-deleted, does the delete get blocked, or do they become "orphaned" (still existing, but pointing at a job that no longer exists)? Each behavior is something you should confirm matches the intended design.

---

## 4. Basic SQL Statements

**SQL (Structured Query Language)** is the language used to query relational databases. You don't need to write complex SQL, but being able to read and write basic `SELECT` statements to verify data is a core skill.

> The examples below use table/column names that are reasonable given HR Tool's known modules (candidates, jobs, applications, companies) — they're meant to build your reading comprehension of SQL. Real table/column names may differ; confirm against a real ERD/migration or with a tech lead before relying on them in a live environment.

**SELECT** — fetch data:
```sql
SELECT id, full_name, email FROM candidates;
```
Fetches three columns from every row in `candidates`.

**WHERE** — filter:
```sql
SELECT * FROM candidates WHERE email = 'john@example.com';
```
Only returns rows with an exact `email` match.

**ORDER BY** — sort:
```sql
SELECT * FROM jobs ORDER BY created_at DESC;
```
Puts the most recently created jobs first.

**JOIN** — combine data from multiple tables:
```sql
SELECT applications.id, candidates.full_name, jobs.title
FROM applications
JOIN candidates ON applications.candidate_id = candidates.id
JOIN jobs ON applications.job_id = jobs.id
WHERE jobs.company_id = 10;
```
Lists applications together with the candidate's name and the job's title, scoped to company `id = 10`.

**COUNT** — count rows:
```sql
SELECT COUNT(*) FROM candidates WHERE company_id = 10;
```
Counts total candidates for company 10 — useful for verifying whether a number shown on a dashboard actually matches the real data.

:::tip[How to learn this quickly]
You don't need to memorize every clause. Start with simple `SELECT` + `WHERE` statements to check one specific record after a test action, then expand from there as needed.
:::

---

## 5. SQL vs NoSQL

| | SQL (relational) | NoSQL (non-relational) |
|---|---|---|
| Data structure | Tables, fixed schema | Documents/JSON, flexible schema |
| Examples | PostgreSQL, MySQL | MongoDB, Redis |
| Relationships | Strong, via JOINs | Weaker, often nested |
| Best for | Structured data with many relationships (like HR/recruitment) | Data whose shape changes often, or that needs very high throughput |

HR Tool uses PostgreSQL (SQL) as its primary store, but also uses **Redis** (a key-value store often classified as NoSQL) for **caching and background job queues (BullMQ)** — for example, the background queue that scores CV-JD matches with AI. Testers don't need to query Redis directly, but should know that some data (like AI matching results) can arrive **after a short delay** because it's being processed asynchronously — that's expected behavior, not a display bug.

---

## 6. Tools for Browsing a Database

A few popular GUI tools for browsing PostgreSQL data without hand-writing SQL in a terminal:

| Tool | Platform | Notes |
|------|----------|-------|
| **TablePlus** | Mac/Windows | Clean UI, easy to use, limited free tier |
| **DBeaver** | Mac/Windows/Linux | Free, supports many database types |
| **pgAdmin** | Web-based | PostgreSQL's official tool |

Connecting usually requires: host, port, username, password, and database name — your QC Lead/Tech Lead will provide these for the Staging environment (never Production credentials).

:::caution[Safety rules]
- Only use a **read-only** account on the Staging database — never run `UPDATE`/`DELETE` manually unless explicitly instructed.
- Never connect directly to the **Production** database.
- Never share database connection details (host, password) outside the team.
:::

---

## 7. Practice Exercises

1. Explain the difference between a Primary Key and a Foreign Key using the `applications` table linking `candidates` and `jobs`.
2. Write (on paper — no need to run it) a `SELECT` statement that returns every `candidate` whose `email` contains the word "test" — hint: look into `LIKE '%test%'`.
3. If the dashboard shows "Total candidates: 25" but a `COUNT(*)` query returns 23, what would you suspect, and how would you write up the bug?
4. Why might AI-processed data (via the BullMQ + Redis queue) not appear immediately on the UI right after you perform an action? How should that shape how you write test cases for the CV Matching feature?
5. Why should QC only ever be granted read-only access to the Staging database?

---

## Next Steps

Continue with [Git & Team Workflow](../foundations/04-git-quy-trinh-nhom/) to understand how the team collaborates on code — especially important if you'll be writing automated tests.

---

**Need help?** Contact your QC Lead or post in #qc-team
