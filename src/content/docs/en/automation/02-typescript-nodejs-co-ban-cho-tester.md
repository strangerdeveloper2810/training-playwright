---
title: TypeScript & Node.js Basics for Testers
description: Applying TypeScript to writing Playwright tests, and the Node.js basics you need to run an automation project
---

# TypeScript & Node.js Basics for Testers

QC Training Documentation - HR Tool

**Version:** 1.0
**Updated:** 2026-08-20
**Author:** QC Team

---

:::note[Already covered TypeScript somewhere?]
The [Web Basics](../basics/03-web-basics/) lesson (section 5) already introduced TypeScript fundamentals: basic types, function types, interfaces, generics, utility types. If you haven't read that yet, do it first — this lesson does **not** repeat it. Instead it covers two things: (1) applying TypeScript specifically to writing Playwright tests, and (2) the Node.js basics you need to actually run a real automation project.
:::

## Table of Contents

1. [Quick recap: why Playwright needs TypeScript](#1-quick-recap-why-playwright-needs-typescript)
2. [TypeScript in Playwright tests](#2-typescript-in-playwright-tests)
3. [What is Node.js, and why testers need it](#3-what-is-nodejs-and-why-testers-need-it)
4. [The module system: import/export](#4-the-module-system-importexport)
5. [package.json and common npm/yarn/pnpm commands](#5-packagejson-and-common-npmyarnpnpm-commands)
6. [Environment variables with process.env](#6-environment-variables-with-processenv)
7. [Reading/writing files with the fs module](#7-readingwriting-files-with-the-fs-module)
8. [What is tsconfig.json](#8-what-is-tsconfigjson)
9. [Practice Exercises](#9-practice-exercises)

---

## 1. Quick recap: why Playwright needs TypeScript

Playwright tests are `.spec.ts` files — real TypeScript code, not some configuration format or custom language. You don't need to be a TypeScript expert to write good tests, but you do need to recognize a few concepts that show up in **every single** HR Tool test file: `type`/`interface`, `async/await`, `Promise`, generics (`<T>`), optional fields (`?`).

## 2. TypeScript in Playwright tests

### 2.1 Typing your test data

When writing a test you'll often need a data object — give it an explicit type so you can't misspell a field, and so your editor can autocomplete it for you:

```typescript
interface LoginCredentials {
  email: string;
  password: string;
}

interface TestUser {
  email: string;
  password: string;
  role: 'super_admin' | 'admin' | 'hr' | 'tech_lead';
}

const adminUser: TestUser = {
  email: '[TEST_EMAIL]',
  password: '[TEST_PASSWORD]',
  role: 'admin',
};
```

### 2.2 async/await — used on almost every line

Playwright is built on `Promise` (a task that will finish at some point in the future — e.g. "wait for the click to complete", "wait for the page to load"). `await` means "wait for this task to finish before running the next line":

```typescript
test('login succeeds', async ({ page }) => {
  await page.goto('/login');                        // wait for the page to load
  await page.getByLabel('Email').fill('...');        // wait for the fill to complete
  await page.getByRole('button', { name: 'Log in' }).click(); // wait for the click to complete
  await expect(page).toHaveURL(/dashboard/);          // wait until the assertion passes or times out
});
```

:::caution[A very common mistake: forgetting `await`]
If you forget `await` before an action, Playwright will **not wait** for it to finish — it moves on to the next line immediately, which leads to flaky tests (passing sometimes, failing others) that are very hard to debug. Always `await` any `page`, `locator`, or `expect` method call.
:::

### 2.3 Typing a Page Object (preview of the Page Object Model lesson)

```typescript
import { Page, Locator } from '@playwright/test';

class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByLabel('Email');
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    // ...
  }
}
```

`Page` and `Locator` are two types Playwright exports for you to use in declarations — you'll see them constantly once you get to the Page Object Model lesson.

## 3. What is Node.js, and why testers need it

**Node.js** is a JavaScript/TypeScript runtime that runs **outside the browser** — on your machine or on a CI server. A Playwright test doesn't run inside a browser like real frontend code does; it runs under Node.js, and Node.js then **drives** a real browser from the outside.

```
Node.js (your machine / CI)  ──drives──▶  Browser (Chromium/Firefox/WebKit)
     │
     └── runs .spec.ts files, reads test data files, writes reports...
```

Testers need basic Node.js knowledge to: set up the project, run test commands, read errors when a command fails, and understand why some things (reading files, environment variables) behave differently than JavaScript running in a browser.

## 4. The module system: import/export

An HR Tool automation project organizes code into many small files, using `import`/`export` to share code between them — similar to how `apps/web` organizes components:

```typescript
// utils/test-data.ts
export const TEST_USERS = {
  admin: { email: '[TEST_EMAIL]', password: '[TEST_PASSWORD]' },
};

export function generateUniqueEmail(prefix: string): string {
  return `${prefix}-${Date.now()}@example.com`;
}

// tests/auth/login.spec.ts
import { TEST_USERS, generateUniqueEmail } from '../../utils/test-data';
```

| Syntax | Meaning |
|--------|---------|
| `export const x = ...` | Lets other files import the `x` value |
| `export default ...` | The "default" export of a file (only one per file) |
| `import { x } from './path'` | Pulls in the named export `x` from another file |
| `import x from './path'` | Pulls in the default export |

## 5. package.json and common npm/yarn/pnpm commands

`package.json` is a Node.js project's "profile": its name, version, list of required libraries (`dependencies`), and shortcut commands (`scripts`).

```json
{
  "name": "hr-tool-automation",
  "scripts": {
    "test": "playwright test",
    "test:ui": "playwright test --ui",
    "test:headed": "playwright test --headed"
  },
  "devDependencies": {
    "@playwright/test": "^1.40.0"
  }
}
```

Running `npm run test` (or `yarn test`, `pnpm test`) executes exactly the command declared under `scripts.test`. HR Tool uses **Yarn Workspaces** (an Nx monorepo) — you'll see commands like `yarn test:e2e` run from the repo root.

| Command | Meaning |
|---------|---------|
| `npm install` / `yarn install` | Installs every library declared in `package.json` |
| `npm install <pkg>` | Installs one additional library |
| `npm run <script>` | Runs one script declared under `scripts` |
| `npx <command>` | Runs a CLI tool without installing it globally (e.g. `npx playwright test`) |

## 6. Environment variables with process.env

Environment variables are how you pass configuration (which environment to test against, secrets, CI flags) into a program **without hardcoding it in the code**:

```typescript
// playwright.config.ts
export default defineConfig({
  use: {
    baseURL: process.env.BASE_URL || 'https://hr-tool-software.netlify.app',
  },
  retries: process.env.CI ? 2 : 0,   // only retry when running on CI
});
```

`process.env.CI` is a variable that GitHub Actions automatically sets to `"true"` when running on CI — which lets the config change its own behavior (more retries, fewer workers) without touching the code.

## 7. Reading/writing files with the fs module

Node.js ships with a built-in `fs` (file system) module for reading/writing files — useful when you need to read a JSON test-data file, or save `storageState` (covered in the Authentication & Storage State lesson):

```typescript
import fs from 'fs';

// Read a file
const rawData = fs.readFileSync('test-data/candidates.json', 'utf-8');
const candidates = JSON.parse(rawData);

// Check whether a file exists
if (fs.existsSync('.auth/admin.json')) {
  console.log('A saved session already exists, no need to log in again');
}
```

## 8. What is tsconfig.json

`tsconfig.json` declares how strictly the TypeScript compiler should check your code. You don't need to write this file yourself (Playwright generates it when you run `npm init playwright@latest`), but a few fields are worth recognizing:

```json
{
  "compilerOptions": {
    "target": "ES2021",
    "strict": true,
    "module": "commonjs"
  }
}
```

`"strict": true` turns on the full set of strict type checks — which is why you sometimes get a type error even though the code "works" logically.

## 9. Practice Exercises

1. Write a `TestCandidate` interface with fields `fullName`, `email`, `phone`, and `status` (only accepting `'new' | 'reviewing' | 'rejected'`).
2. In your own words, explain what happens if you write `page.click(...)` without an `await` in front of it, inside a test with three sequential steps.
3. Open the `package.json` of a Playwright project (hr-tool, if you have access) and list the `scripts` related to testing.
4. Write a snippet that uses `process.env` to pick a `baseURL` of `staging` or `local` depending on a `TEST_ENV` variable.

## Next Step

Continue with [Unit Testing Basics](../automation/03-unit-testing-co-ban/) — so you can read and understand the unit tests developers write, before diving deeper into Playwright.

---

**Need help?** Contact your QC Lead or post in #qc-team
