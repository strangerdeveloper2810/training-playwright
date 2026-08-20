---
title: HTTP & Network Fundamentals for Testers
description: Understand HTTP requests/responses, status codes, headers, cookies/tokens, and how to read the Network tab in DevTools
---

# HTTP & Network Fundamentals for Testers

QC Training Documentation - HR Tool

---

## Table of Contents

1. [What is HTTP](#1-what-is-http)
2. [Request and Response Structure](#2-request-and-response-structure)
3. [HTTP Methods](#3-http-methods)
4. [HTTP Status Codes](#4-http-status-codes)
5. [Common Headers](#5-common-headers)
6. [Cookies, Sessions, and Tokens (JWT)](#6-cookies-sessions-and-tokens-jwt)
7. [What is CORS](#7-what-is-cors)
8. [Hands-on: Reading the Network Tab in DevTools](#8-hands-on-reading-the-network-tab-in-devtools)
9. [Practice Exercises](#9-practice-exercises)

---

## 1. What is HTTP

**HTTP (HyperText Transfer Protocol)** is the "language" a client (your browser) and a server use to talk to each other over the internet. Every time you open a page, click a button, or submit a form, the browser sends an **HTTP request**, and the server replies with an **HTTP response**.

**HTTPS** is HTTP with an added encryption layer (TLS/SSL) so data can't be read by anyone snooping on the connection. Every HR Tool Staging/Production environment runs on HTTPS — if you ever see a "Not Secure" warning or a broken SSL certificate, that's a bug worth reporting immediately, since it affects user security.

---

## 2. Request and Response Structure

An HTTP request has:

```
POST /trpc/auth.login HTTP/1.1        ← Method + path + version
Host: api.staging.ethansoftwaredeveloper.com ← Header
Content-Type: application/json        ← Header
Authorization: Bearer eyJhbGci...     ← Header (if present)

{"email": "hr@example.com", "password": "***"}   ← Body
```

An HTTP response has:

```
HTTP/1.1 200 OK                       ← Status line
Content-Type: application/json        ← Header
Set-Cookie: accessToken=eyJ...; HttpOnly   ← Header

{"result": {"data": {"user": {...}}}}     ← Body
```

The three things a tester should care about most: **method + URL**, **status code**, and **body** (both the request body and the response body).

---

## 3. HTTP Methods

| Method | Meaning | HR Tool example |
|--------|---------|-------------------|
| **GET** | Fetch data, no server-side change | List candidates, view one job's details |
| **POST** | Create data, or perform an action | Create a candidate, log in, upload a CV |
| **PUT** | Replace an entire record | Overwrite an employee record's fields |
| **PATCH** | Update part of a record | Change one application's stage without touching other fields |
| **DELETE** | Remove data | Delete a job posting |

:::note[About tRPC]
Because HR Tool uses tRPC, most real requests go over `POST`, even for "read" actions (queries). The business meaning (read vs. write) still matches the table above — it's just that, at the network level, the HTTP method no longer reflects the action type the way plain REST does. When testing, look at the **called function name** (`candidate.getList` is a read/query, `candidate.create` is a write/mutation) rather than the raw HTTP method alone.
:::

---

## 4. HTTP Status Codes

A status code is the three-digit number the server returns to report how it handled a request.

| Group | Meaning | Common codes | Example |
|-------|---------|----------------|---------|
| **2xx** | Success | `200 OK`, `201 Created` | Login succeeded, candidate created |
| **3xx** | Redirect | `301`, `302`, `304` | Redirected to the login page when not authenticated |
| **4xx** | Client error | `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `422 Unprocessable Entity` | Missing field, not logged in, insufficient permission, resource not found |
| **5xx** | Server error | `500 Internal Server Error`, `503 Service Unavailable` | Server crashed, an unhandled bug |

**401 vs. 403** — a distinction that's easy to get wrong in a bug report:
- **401 Unauthorized**: identity couldn't be verified (not logged in, or the token is missing/expired/invalid).
- **403 Forbidden**: the server knows who you are, but you're **not allowed** to perform that action (e.g. a `tech_lead` trying to delete an employee).

:::caution[Reporting tip]
If you see a `500 Internal Server Error`, that's almost always a **real system bug** (the server hit an unhandled error), not something you did wrong as a tester. Log it immediately along with the response body and clear reproduction steps.
:::

---

## 5. Common Headers

| Header | Meaning |
|--------|---------|
| `Content-Type` | The format of the sent/received data, usually `application/json` |
| `Authorization` | Carries an auth token, in the form `Bearer <token>` |
| `Cookie` | Small pieces of data the browser automatically attaches to every request (session, tokens...) |
| `Set-Cookie` | The server asking the browser to store a new cookie |
| `Accept-Language` | The client's preferred language — relevant when testing HR Tool's English/Vietnamese support |

---

## 6. Cookies, Sessions, and Tokens (JWT)

HTTP is fundamentally **stateless** — the server doesn't automatically remember who you are between two separate requests. So applications need a mechanism to remind the server of your logged-in state. Two common models:

- **Session-based**: the server stores login state (in memory or a database) and only hands the client a short `sessionId` via a cookie.
- **Token-based (JWT - JSON Web Token)**: the server stores nothing; instead it issues the client a self-contained, signed "certificate" (token). Every subsequent request carries that token for the server to verify.

**HR Tool uses JWT**, with two token types:

| Token | Lifetime | Purpose |
|-------|----------|---------|
| **Access token** | 7 days | Authenticates every request |
| **Refresh token** | 30 days | Issues a new access token without forcing a fresh login |

Both tokens live in **`httpOnly`** cookies (unreadable directly by frontend JavaScript, which helps prevent token theft via XSS bugs), configured with `SameSite=None; Secure` on Staging/Production and `SameSite=Lax` for local development.

**Why this matters for testers:**
- A "Logout" test case should verify: after logging out, can the old token still be used to call the API? (If yes, that's a serious security bug.)
- A "session timeout" test case should check whether the system silently refreshes the access token using the refresh token, or abruptly forces a re-login mid-session.

---

## 7. What is CORS

**CORS (Cross-Origin Resource Sharing)** is a browser security mechanism that blocks a page on domain A from calling an API on domain B — unless domain B explicitly allows it via the right response header (`Access-Control-Allow-Origin`).

If you see a red error in the console like:

```
Access to fetch at 'https://api.staging...' from origin 'https://hr-tool-software.netlify.app'
has been blocked by CORS policy
```

that's a sign the backend isn't configured to allow the frontend's origin — **this is a bug to report to the backend team**, not something you did wrong while testing.

---

## 8. Hands-on: Reading the Network Tab in DevTools

1. Open HR Tool Staging, open DevTools (`F12`), select the **Network** tab.
2. Check **Preserve log** (so navigation doesn't clear it) and filter by **Fetch/XHR** (to only see API calls, hiding images/CSS).
3. Perform an action (e.g. log in).
4. Click the request that just appeared (e.g. `login`) and inspect its sub-tabs:
   - **Headers**: method, status code, request/response headers.
   - **Payload/Request**: the data you sent.
   - **Response**: the data the server returned — this is where you verify the data matches expectations.
   - **Timing**: how long the request took — useful when performance is a concern.

:::tip[Tip]
When reporting an API-related bug, right-click the request in the Network tab → **Copy → Copy as cURL**, or **Save all as HAR**, and attach it to the bug report. A developer can then reproduce the exact request without guessing.
:::

---

## 9. Practice Exercises

1. Distinguish `401 Unauthorized` from `403 Forbidden` using a concrete HR Tool example for each role (super_admin, admin, hr, tech_lead).
2. Open DevTools on HR Tool Staging, log in, find the corresponding request, and record: method, full URL, status code, and two headers from the response.
3. Why is HR Tool's access token stored in an `httpOnly` cookie rather than `localStorage`? What class of security bug does this help prevent?
4. You see a CORS error in the console while testing a newly deployed feature. Is that your fault or the system's? How would you report it?
5. Find any request in the Network tab, export it as a HAR file, and explain when you should attach one to a bug report.

---

## Next Steps

Continue with [Database Fundamentals for Testers](../foundations/03-database-co-ban-cho-tester/) to learn how to verify data directly instead of trusting the UI alone.

---

**Need help?** Contact your QC Lead or post in #qc-team
