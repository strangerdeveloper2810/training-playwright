---
title: Manual API Testing with Postman
description: A guide to manual API testing with Postman/Thunder Client, including testing HR Tool's REST and tRPC endpoints
---

# Manual API Testing with Postman

QC Training Documentation - HR Tool

This lesson shows you how to test an API without writing a single line of code — all you need is a request tool like Postman or Thunder Client. This is a must-have skill for any **fullstack tester**: many bugs (broken logic, missing validation, wrong data returned, leaked permissions) show up at the API layer long before they ever reach the UI.

## Table of Contents

1. [Why QC needs to test APIs](#1-why-qc-needs-to-test-apis)
2. [Setting up Postman](#2-setting-up-postman)
3. [Anatomy of a request](#3-anatomy-of-a-request)
4. [Testing a regular REST endpoint](#4-testing-a-regular-rest-endpoint)
5. [Testing an HR Tool tRPC endpoint](#5-testing-an-hr-tool-trpc-endpoint)
6. [Testing Authentication](#6-testing-authentication)
7. [Testing CRUD Operations](#7-testing-crud-operations)
8. [Testing by Role & Cross-Company](#8-testing-by-role--cross-company)
9. [Common Test Scenarios](#9-common-test-scenarios)
10. [Writing API test cases](#10-writing-api-test-cases)
11. [Debugging API Issues](#11-debugging-api-issues)
12. [Full example: a Login API test suite](#12-full-example-a-login-api-test-suite)
13. [API Test Checklist by Router](#13-api-test-checklist-by-router)
14. [Practice Exercises](#14-practice-exercises)

---

## 1. Why QC needs to test APIs

The UI is just a "shell" that displays data. The real data and business logic live in the **API** (the backend layer). If you only test through the UI, you can easily miss:

- Validation bugs the UI happens to hide (e.g. the UI limits a field's length client-side, but the API never re-checks it).
- Authorization bugs — user A calling the API directly can retrieve user B's data, or another company's data, even though the UI never exposes a button that leads there.
- Bugs that only trigger when a field is missing or malformed in a way the UI would never send, because the UI always sends "correct" data.

:::tip[Rule of thumb]
A feature is only fully tested once you've verified **both the UI and the API behind it**.
:::

## 2. Setting up Postman

1. Download Postman: https://www.postman.com/downloads/ (or use the **Thunder Client** VS Code extension, or plain `curl`/DevTools if you'd rather not install anything).
2. Create a dedicated **Workspace**, e.g. `HR Tool QC`.
3. Create a **Collection** (a group of requests) per module: `Auth`, `Candidates`, `Jobs`, `Applications`...
4. Create an **Environment** with shared variables:

| Variable | Value (Staging) |
|----------|------------------|
| `base_url` | `https://api.staging.ethansoftwaredeveloper.com` |
| `access_token` | (paste it here after logging in) |
| `company_id` | (the UUID of the company you're testing) |

Reference the variable with `{{base_url}}` in the URL field — when you switch environments, you only need to change it in one place.

**Fastest way to grab an access token:** log into the web app → open DevTools (F12) → **Application** tab → **Local Storage** → copy the `accessToken` value. This is faster than calling the login API from Postman.

## 3. Anatomy of a request

An HTTP request has four main parts (covered in [HTTP & Network Fundamentals](../foundations/02-http-network-co-ban/)):

| Part | Example |
|------|---------|
| **Method** | `POST` |
| **URL** | `{{base_url}}/trpc/auth.login` |
| **Headers** | `Content-Type: application/json`, `Authorization: Bearer {{access_token}}` |
| **Body** | `{"json": {"email": "admin-test@example.com", "password": "..."}}` |

In Postman these map to: the URL bar + method dropdown, the **Headers** tab, and the **Body** tab (choose `raw` + `JSON`).

## 4. Testing a regular REST endpoint

For a standard REST API, the general rules are:

- `GET` reads data — usually no body, sometimes query params: `GET /api/candidates?page=1&limit=10`.
- `POST` creates a resource — the body carries the data to create.
- `PUT`/`PATCH` update a resource — `PUT` typically replaces the whole resource, `PATCH` updates only part of it.
- `DELETE` removes a resource — usually no body needed.

Example: testing `GET /api/candidates/123`:

1. Set method to `GET`, URL to `{{base_url}}/api/candidates/123`.
2. Add header `Authorization: Bearer {{access_token}}`.
3. Send the request and check:
   - Status code is `200`.
   - The response body has the expected fields (`id`, `fullName`, `email`...).
   - The `id` field in the response equals `123` (the resource you actually asked for).

## 5. Testing an HR Tool tRPC endpoint

HR Tool uses **tRPC 11** for its entire API — this is the biggest difference from plain REST you need to understand:

- Every endpoint sits under `/trpc/<router>.<procedure>`, e.g. `/trpc/auth.login`, `/trpc/candidate.create`, `/trpc/job.list`.

| Procedure type | HTTP Method | When it's used | Example |
|-----------------|-------------|-----------------|---------|
| **query** | GET | Reading data | `employee.list`, `candidate.getById` |
| **mutation** | POST | Create/Update/Delete | `employee.create`, `application.updateStage` |

- For **queries**, the input is encoded into the query string: `GET /trpc/employee.list?input={"json":{"page":1,"limit":10}}` — the safest way to get the exact format right is to **open the Network tab in DevTools while using the real feature on the web app** and copy the exact request into Postman.
- For **mutations**, the client always uses `POST`, with the body wrapped inside a `json` object:

```json
{
  "json": {
    "email": "admin-test@example.com",
    "password": "YourPassword"
  }
}
```

- The response is wrapped the same way:

```json
{
  "result": {
    "data": {
      "json": { "user": { "id": "...", "role": "admin" } }
    }
  }
}
```

- On error, tRPC returns `error.json.message` and `error.json.code` (e.g. `UNAUTHORIZED`, `BAD_REQUEST`, `INTERNAL_SERVER_ERROR`) instead of relying solely on the HTTP status code — read this field carefully when filing a bug.

:::caution[Note]
Never guess the shape of a tRPC request/response. The safest approach is always to open DevTools → Network tab on the real web app, perform the action, and copy the real request/response into Postman.
:::

## 6. Testing Authentication

### 6.1 Login Test Cases

| Test Case | Input | Expected |
|-----------|-------|----------|
| Correct email/password | Valid credentials | `200` + access/refresh tokens |
| Wrong password | Valid email, wrong password | `401 UNAUTHORIZED` |
| Email doesn't exist | Never-registered email | `401 UNAUTHORIZED` (must not reveal "email doesn't exist") |
| Empty email | `""` | `400 BAD_REQUEST` |
| Malformed email | `"notanemail"` | `400 BAD_REQUEST` |
| Empty password | `""` | `400 BAD_REQUEST` |

### 6.2 Token Refresh

```http
POST {{base_url}}/trpc/auth.refresh
Content-Type: application/json

{ "json": { "refreshToken": "{{refresh_token}}" } }
```

| Test Case | Expected |
|-----------|----------|
| Valid refresh token | New access + refresh token |
| Expired refresh token | `401 UNAUTHORIZED` |
| Invalid refresh token | `401 UNAUTHORIZED` |
| Empty refresh token | `400 BAD_REQUEST` |

### 6.3 Protected Routes

Every route except `auth.login` requires an `Authorization` header:

| Test Case | Expected |
|-----------|----------|
| Valid token | `200` + data |
| Expired token | `401 UNAUTHORIZED` |
| No token | `401 UNAUTHORIZED` |
| Malformed token | `401 UNAUTHORIZED` |

## 7. Testing CRUD Operations

Using the `employee` module as an example — the same four groups apply to `candidate`, `job`, `application`, and so on.

### 7.1 CREATE

| Scenario | Input | Expected |
|----------|-------|----------|
| All required fields valid | Valid data | `200` + created object |
| Missing required field | Missing `name` | `400 BAD_REQUEST` |
| Duplicate unique field | `email` already exists | `400`/`409` |
| Invalid foreign key | `departmentId` doesn't exist | `400`/`404` |
| Invalid enum value | `status: "invalid"` | `400 BAD_REQUEST` |
| No permission | User lacks permission | `403 FORBIDDEN` |

### 7.2 READ

| Scenario | Expected |
|----------|----------|
| List with valid params | `200` + paginated list |
| Page beyond the last page | Empty list or error |
| Limit above the max allowed | Capped at the max (e.g. 50) |
| Get by an existing ID | `200` + object |
| Get by a non-existent ID | `404 NOT_FOUND` |
| Get another company's data | `403 FORBIDDEN` (see section 8) |

### 7.3 UPDATE

| Scenario | Expected |
|----------|----------|
| Valid update | `200` + updated object |
| Non-existent ID | `404 NOT_FOUND` |
| Invalid field value | `400 BAD_REQUEST` |
| Update to a duplicate unique value | `400`/`409` |
| Partial update | Only the submitted fields change |
| No permission | `403 FORBIDDEN` |

### 7.4 DELETE

| Scenario | Expected |
|----------|----------|
| Valid delete | `200` + success message |
| Non-existent ID | `404 NOT_FOUND` |
| Delete with dependent records | `400` (if there's a foreign-key constraint) |
| No permission | `403 FORBIDDEN` |
| Delete the same record twice | Second call returns `404 NOT_FOUND` |

## 8. Testing by Role & Cross-Company

### 8.1 HR Tool Roles

| Role | Access scope |
|------|---------------|
| `super_admin` | Every company, every feature |
| `admin` | Their own company, every feature within it |
| `hr` | Their own company, HR-facing features |
| `tech_lead` | Their own company, read-only + interview feedback |

### 8.2 Permission Test Matrix

Every important endpoint should have a table like this:

| Role | Endpoint: `employee.create` — Expected |
|------|------------------------------------------|
| `super_admin` | `200` |
| `admin` | `200` |
| `hr` | `200` |
| `tech_lead` | `403 FORBIDDEN` (no create permission) |
| Not logged in | `401 UNAUTHORIZED` |

### 8.3 Cross-Company Access Test

This is the **most important** test group for a multi-tenant system like HR Tool — checking whether Company A can see or modify Company B's data:

```
1. Log in as an admin of Company A
2. Grab the ID of an employee that belongs to Company B
3. Call GET /trpc/employee.getById with that ID
4. Expected result: 403 FORBIDDEN or 404 NOT_FOUND
   (must NOT return 200 with real data — that's a serious security bug)
```

:::caution[Security risk]
If step 3 above returns `200` with real data from Company B, that's an **IDOR** (Insecure Direct Object Reference) bug — report it at the highest priority. See [Security Testing Basics](./11-security-testing-co-ban/) for more.
:::

## 9. Common Test Scenarios

### 9.1 Pagination

| Test | Input | Verify |
|------|-------|--------|
| First page | `page=1, limit=10` | `items.length <= 10`, `total > 0` |
| Last page | `page=totalPages` | `items.length <= limit` |
| Beyond the last page | `page=999` | `items=[]`, `total` unchanged |
| Zero page | `page=0` | Error, or treated as page 1 |
| Negative page | `page=-1` | Error |
| Zero limit | `limit=0` | Error, or a default limit is used |
| Limit above the max | `limit=1000` | Capped at the max (e.g. 50) |

### 9.2 Filters

| Test | Verify |
|------|--------|
| Single filter | All results match the filter |
| Multiple filters | Results match ALL filters |
| Invalid filter value | Error, or silently ignored |
| Filter by a non-existent foreign key | Empty results |

### 9.3 Search

| Test | Input | Verify |
|------|-------|--------|
| Exact match | `"Nguyen Van A"` | Found |
| Partial match | `"nguyen"` | Found |
| Case-insensitive | `"NGUYEN"` | Found |
| No match | `"xyz123"` | Empty result |
| Special characters | `"O'Brien"` | Handled correctly |
| SQL injection attempt | `"'; DROP TABLE--"` | No error, no injection occurs |

### 9.4 Date/Time & Validation

| Test | Input | Expected |
|------|-------|----------|
| Valid date | `"2025-02-01"` | Accepted |
| Wrong format | `"01-02-2025"` | Error |
| Non-existent date | `"2025-02-30"` | Error |
| Malformed email | `"not-an-email"` | `400 BAD_REQUEST` |
| Malformed UUID | `"abc"` | Error |
| Negative number for a positive-only field | `-5` | Error |

## 10. Writing API test cases

A solid API test case verifies three things:

1. **Status code** — the expected class of outcome (`200`/`201` on success, `400` on bad input, `401` when unauthenticated, `403` when unauthorized, `404` when the resource doesn't exist, `500` on server error).
2. **Response body/schema** — correct fields, correct types, and no leaking of sensitive fields (e.g. a login response should never return `password`, even hashed).
3. **Response time** — does the API respond within a reasonable time (e.g. under 1-2 seconds for a typical call)? If it's unusually slow, log it so it can be escalated (see [Performance Testing - Concepts](./10-performance-testing-khai-niem/)).

Always test both **positive cases** (correct input) and **negative cases** (missing fields, wrong types, no permission, expired token).

## 11. Debugging API Issues

### 11.1 Reading an error response

```json
{
  "error": {
    "message": "Input validation failed",
    "code": -32600,
    "data": {
      "code": "BAD_REQUEST",
      "httpStatus": 400,
      "path": "employee.create",
      "zodError": {
        "issues": [
          { "code": "invalid_type", "expected": "string", "received": "undefined", "path": ["name"], "message": "Required" }
        ]
      }
    }
  }
}
```

Fields worth checking: `data.code` (error category), `data.path` (which procedure failed), `data.zodError.issues` (exactly which field is wrong, since HR Tool validates with Zod).

### 11.2 Common Error Codes

| Code | HTTP Status | Meaning |
|------|-------------|---------|
| `BAD_REQUEST` | 400 | Invalid input |
| `UNAUTHORIZED` | 401 | Missing/invalid token |
| `FORBIDDEN` | 403 | No permission |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Duplicate/conflict |
| `INTERNAL_SERVER_ERROR` | 500 | Server-side bug |

### 11.3 Debug Checklist

- [ ] Is the token still valid? (check expiry)
- [ ] Correct HTTP method? (GET for query, POST for mutation)
- [ ] `Content-Type: application/json` header present?
- [ ] Body in the right shape (`{"json": {...}}`)?
- [ ] All required fields present?
- [ ] Field types correct? (string vs number vs uuid)
- [ ] Do the foreign keys exist?
- [ ] Does the user have permission?
- [ ] Does the data belong to the user's company?

### 11.4 Cross-checking with Browser DevTools

1. Open the Network tab (F12), filter by `trpc`.
2. Click a request to inspect its **Headers** (token, content-type), **Payload** (request body), **Response** (the real response), and **Timing** (response time).
3. Compare it against the request you're testing in Postman — any difference tells you what your Postman request is missing.

## 12. Full example: a Login API test suite

| ID | Description | Input | Expected Result |
|----|-------------|-------|------------------|
| API-LOGIN-01 | Correct email/password | Valid email + password | `200`, returns `access_token`, never returns `password` |
| API-LOGIN-02 | Wrong password | Valid email, wrong password | `401`, clear message, doesn't reveal whether the email exists |
| API-LOGIN-03 | Missing email field | Body has no `email` | `400`, message clearly states the missing field |
| API-LOGIN-04 | Malformed email | `email: "not-an-email"` | `400` |
| API-LOGIN-05 | Email with special but valid characters | `email: "test+1@gmail.com"` | `200` if the account exists — **this is a real bug that actually happened** (the system returned `500` instead of handling it correctly) |
| API-LOGIN-06 | Account doesn't exist | Email never registered | `401`, must not reveal "email doesn't exist" (prevents account enumeration) |

:::note[Real HR Tool case]
API-LOGIN-05 is based on a real bug documented in the [Bug Report Template](../basics/02-bug-report-template/) — a good example of why it's worth testing "unusual" inputs (special characters, edge-case data) at the API level.
:::

## 13. API Test Checklist by Router

### 13.1 General checklist for every endpoint

- [ ] **Authentication**: works with a valid token, rejects invalid/expired/missing tokens
- [ ] **Authorization**: correct per role (`super_admin`, `admin`, `hr`, `tech_lead`), blocks cross-company access
- [ ] **Input validation**: required fields, correct types, correct formats (email/phone...), valid enums, valid foreign keys, unique constraints
- [ ] **Business logic**: happy path works, edge cases are handled, error messages are clear
- [ ] **Response**: correct status code, correct format, no sensitive data leaked

### 13.2 HR Tool's real router list to cover

Use this list as a skeleton when building a full API test suite for a sprint or release:

**Auth:** `auth.login`, `auth.refresh`, `auth.logout`
**User:** `user.me`, `user.updateProfile`
**Employee:** `employee.create`, `employee.list`, `employee.getById`, `employee.update`, `employee.delete`, `employee.stats`
**Department / Position:** `create`, `list`, `update`, `delete`
**Job:** `job.createFromJD`, `job.list`, `job.getById`, `job.updateStatus`, `job.delete`
**Candidate:** `candidate.createFromCV`, `candidate.list`, `candidate.getById`, `candidate.updateStatus`, `candidate.delete`
**Application:** `application.create`, `application.list`, `application.getById`, `application.updateStage`, `application.updateNotes`, `application.delete`, `application.stats`
**Interview:** `interview.create`, `interview.list`, `interview.getById`, `interview.updateStatus`, `interview.addFeedback`, `interview.delete`, `interview.stats`
**CV Matching:** `cvMatching.createSession`, `cvMatching.listSessions`, `cvMatching.getSession`, `cvMatching.addDocuments`, `cvMatching.startMatching`, `cvMatching.getResults`, `cvMatching.deleteSession`
**Company (Super Admin):** `company.create`, `company.list`, `company.getById`, `company.update`, `company.delete`, `company.createUser`, `company.updateUser`, `company.deleteUser`
**Invitation:** `invitation.create`, `invitation.list`, `invitation.validateToken`, `invitation.accept`, `invitation.revoke`

## 14. Practice Exercises

1. Install Postman and create the `HR Tool QC` collection with an environment containing `base_url`.
2. Open DevTools on the Staging web app, log in, and observe the real request sent to `/trpc/auth.login` — note down the exact method, headers, and body.
3. Recreate that same request in Postman and send it — compare the response with what you saw in DevTools.
4. Write 3 additional negative test cases for any API in the Candidates or Jobs module (not already covered above).
5. Try calling a mutation API (e.g. create a candidate) **without** sending the `Authorization` header — do you get a `401` as expected?
6. Try the cross-company test from section 8.3 (if your test environment lets you create two companies) — record what actually happens.

## Next Steps

Continue with [Database Testing in Practice](./07-database-testing-thuc-hanh/) to learn how to verify data after calling an API/performing an action.

---

**Need help?** Contact the QC Lead or post in #qc-team
