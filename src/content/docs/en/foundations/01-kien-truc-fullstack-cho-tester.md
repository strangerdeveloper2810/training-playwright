---
title: Full-stack Architecture for Testers
description: Understand the Client - Server - Database architecture and how HR Tool's pieces fit together
---

# Full-stack Architecture for Testers

QC Training Documentation - HR Tool

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Client - Server - Database Architecture](#2-client---server---database-architecture)
3. [Frontend, Backend, Database and the API Layer](#3-frontend-backend-database-and-the-api-layer)
4. [What is a Monorepo](#4-what-is-a-monorepo)
5. [REST vs GraphQL vs tRPC](#5-rest-vs-graphql-vs-trpc)
6. [The Request-Response Lifecycle](#6-the-request-response-lifecycle)
7. [Why Testers Need This Mental Model](#7-why-testers-need-this-mental-model)
8. [Practice Exercises](#8-practice-exercises)

---

## 1. Introduction

Before you can write a good test case or automation script, you need to answer one question: **"What is this application actually made of?"**

Many new QC engineers only ever see the UI rendered in a browser and assume that's the whole application. In reality, every modern web application — HR Tool included — is made of several layers running on different processes (sometimes different machines) that talk to each other over a network. When something breaks, a skilled tester's first question is always: **"Which layer is this failing in?"** — is the UI rendering wrong, is the server returning wrong data, or was the data already wrong in the database?

This lesson builds a mental map of web application architecture in general, then applies it directly to HR Tool's real structure.

---

## 2. Client - Server - Database Architecture

Most web applications follow the classic three-tier model:

```
┌─────────────┐        HTTP Request         ┌─────────────┐        Query         ┌─────────────┐
│             │ ───────────────────────────► │             │ ───────────────────► │             │
│   CLIENT    │                              │   SERVER    │                      │  DATABASE   │
│  (Browser)  │ ◄─────────────────────────── │  (Backend)  │ ◄─────────────────── │ (PostgreSQL)│
│             │        HTTP Response         │             │        Result        │             │
└─────────────┘                              └─────────────┘                      └─────────────┘
```

- **Client**: what the user directly sees and interacts with — a browser (Chrome, Safari...) or a mobile app. It runs on the user's own device.
- **Server**: the "brain" that handles business logic — it receives requests from the client, checks permissions, processes data, and returns a result. It runs on infrastructure the user never sees directly.
- **Database**: where data is stored long-term (employee lists, candidates, job postings...). The server reads and writes to the database on the client's behalf.

The client **never** talks to the database directly — everything must go through the server. That's why opening DevTools in your browser will never show you the database contents, only whatever data the server chooses to expose through its API.

:::tip[Keep this in mind]
When data looks wrong on the UI, resist the urge to just say "the site is broken." Ask instead: where did it go wrong? Did the UI render correct data incorrectly (a frontend bug), did the server return the wrong data (a backend bug), or was the data already wrong in the database (a data/processing bug)?
:::

---

## 3. Frontend, Backend, Database and the API Layer

| Term | Role | Example technologies | HR Tool's choice |
|------|------|------------------------|-------------------|
| **Frontend** | Renders the UI, captures user interaction | React, Vue, Angular | React 19 + Vite (`apps/web`) |
| **Backend** | Business logic, authorization, database access | NestJS, Express, Django, Spring Boot | NestJS 11 (`apps/api`) |
| **Database** | Persists data | PostgreSQL, MySQL, MongoDB | PostgreSQL 16 + TypeORM |
| **API layer** | The "contract" that defines how the frontend calls the backend | REST, GraphQL, tRPC | tRPC 11 |

An **API (Application Programming Interface)** is the set of "doors" a backend exposes so the frontend (or any other client — Postman, a mobile app) can call into it. For example, the frontend wants a list of candidates, so it calls an endpoint like `candidate.getList`. The backend receives the request, queries the database, and returns a structured result — usually JSON.

An important detail: **the frontend and backend are two independent programs**, running as separate processes (potentially on different machines). They don't know each other's internals — they only communicate through the API. This is exactly why you can test the backend in isolation (via Postman, no UI needed) or the frontend in isolation (using mocked data).

---

## 4. What is a Monorepo

A **monorepo** (mono-repository) keeps multiple applications and libraries inside a **single Git repository**, instead of giving each application its own repo (a "multi-repo" setup).

HR Tool is organized as a monorepo, managed with **Nx**:

```
hr-tool/
├── apps/
│   ├── api/        NestJS backend (port 3000)
│   ├── web/        React 19 web app (port 4200)
│   ├── landing/    Astro 5 landing page (port 4321)
│   ├── mobile/     React Native mobile app
│   └── e2e/        Playwright end-to-end tests
├── packages/
│   ├── shared/       Shared constants, roles, permissions
│   ├── api-client/   Auto-generated tRPC client & React Query hooks
│   ├── ui-web/       Shared web UI library
│   └── ui-mobile/    Shared mobile UI library
```

**Why this matters for a tester:**

- When a bug is reported, knowing whether the relevant code lives in `apps/api` (backend bug) or `apps/web` (frontend bug) helps you write a much more precise bug report.
- Changes to `packages/shared` (say, renaming a permission/role) can ripple across **multiple apps at once** (`api`, `web`, `mobile`) — which is exactly why shared-package changes call for wider regression testing.
- HR Tool's backend is further organized by **Bounded Context** — split by business domain, not by technical layer: `apps/api/src/contexts/recruitment`, `hr`, `platform` (multi-tenancy), `observability`, `shared`. When testing a feature, you can usually find the relevant code by matching it to the right business context.

---

## 5. REST vs GraphQL vs tRPC

These are the three most common "styles" a frontend uses to call a backend. You don't need to be able to build all three, but you should recognize which one you're working with so you can test its API correctly (the `practice/06-manual-api-testing` lesson covers hands-on practice).

| Trait | REST | GraphQL | tRPC |
|-------|------|---------|------|
| Calling style | Many URLs, one per resource (`/users`, `/jobs/1`) | One URL, client chooses which fields to fetch | Call functions directly, like calling code |
| Type safety | Not enforced between FE-BE by default | Has an explicit schema | Fully type-safe FE-BE (shared TypeScript) |
| Popularity | Extremely common, near industry standard | Common for complex data graphs | Common in TypeScript full-stack monorepos |
| Used by HR Tool? | No | No | ✅ Yes (tRPC 11) |

**tRPC** stands out because both frontend and backend are written in TypeScript inside the same monorepo — when the backend changes an API, TypeScript immediately flags any frontend code using it incorrectly, eliminating a whole category of "API contract mismatch" bugs common with REST. That doesn't mean bugs disappear — business logic can still be wrong, and returned data can still fail to match expectations. Catching those is exactly the tester's job.

At the network level, a tRPC call is still an ordinary HTTP request (usually `POST /trpc/<router>.<procedure>`), so every API-testing technique covered later (Postman, DevTools) still applies.

---

## 6. The Request-Response Lifecycle

When you click "Log in" on HR Tool, what actually happens?

```
1. User types email/password and clicks "Log in"
        ↓
2. Frontend (React) calls: trpc.auth.login({ email, password })
        ↓
3. A request travels over the network: POST /trpc/auth.login
        ↓
4. Backend (NestJS) receives it and validates the input
        ↓
5. Backend queries the database for a user with that email
        ↓
6. Backend compares the hashed password, issues a JWT access + refresh token
        ↓
7. Backend responds: 200 OK + Set-Cookie with the tokens
        ↓
8. Frontend receives the response, stores "logged in" state, redirects to the dashboard
        ↓
9. User sees the dashboard
```

All nine steps typically happen in under a second, but **every single step is a place where something can go wrong**:

- Step 4: malformed input isn't validated → a raw 500 error instead of a clear message.
- Step 5: a multi-tenancy query bug returns the wrong company's user.
- Step 7: the token isn't set correctly (missing `httpOnly`, wrong `SameSite`) → a security bug.
- Step 8: the frontend receives a successful response but mishandles it and never redirects.

---

## 7. Why Testers Need This Mental Model

1. **Sharper bug reports** — instead of "the page is broken," you can write "`POST /trpc/candidate.create` returns a 500 error," which lets a developer localize the problem far faster.
2. **Choosing the right tool** — rendering bugs call for DevTools/Console, wrong data calls for the Network tab or Postman, persisted-data bugs call for a database query.
3. **Deciding where automation belongs** — some scenarios are best tested through the UI (Playwright), others are faster and more stable tested directly against the API — covered in `automation/16-api-testing-playwright-trpc`.
4. **Judging blast radius** — a change to `packages/shared` or to the database layer can affect many features at once, more so than a change confined to one UI component.

:::note[Don't worry if it's not all clear yet]
You don't need to be able to write backend or frontend code to be an excellent tester. The goal of this lesson is a **mental model** good enough to read errors correctly and communicate precisely with the engineering team.
:::

---

## 8. Practice Exercises

1. Redraw the Client - Server - Database diagram in your own words, applied to HR Tool (which web app calls which API, which API talks to which database).
2. Open HR Tool Staging, open DevTools → Network tab, log in, and find the request named something like `auth.login`. What URL does it hit? What method does it use?
3. You receive a report: "The employee list shows empty even though a new employee was just created." List at least three layers (frontend/backend/database) that could be the cause, and how you'd check each one.
4. How does tRPC differ from REST? Why might a TypeScript monorepo choose tRPC?
5. In HR Tool's Bounded Context structure, which context would an "interview scheduling" feature most likely live in — `recruitment`, `hr`, `platform`, or `observability`? Explain your reasoning.

---

## Next Steps

Continue with [HTTP & Network Fundamentals](../foundations/02-http-network-co-ban/) to understand exactly how the client and server "talk" to each other over HTTP.

---

**Need help?** Contact your QC Lead or post in #qc-team
