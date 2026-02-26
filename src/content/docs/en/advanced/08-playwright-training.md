---
title: Playwright Training Path
description: 6-week Automation Testing learning path with Playwright
---

# Playwright Training Path

**For:** QC Team
**Duration:** 6 weeks
**Mentor:** Tech Lead

> **Goal:** Automate 20+ test cases for HR Tool

---

## Part 0: Automation Testing Fundamentals

### 0.1 What is Automation Testing?

**Automation Testing** is using software/tools to execute test cases automatically, instead of manual human testing.

```
┌─────────────────────────────────────────────────────────────────┐
│                    MANUAL vs AUTOMATION                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Manual Testing              Automation Testing                  │
│  ┌─────────────────────┐    ┌─────────────────────┐             │
│  │   Tester            │    │    Test Script      │             │
│  │  (Human)            │    │    (Code/Tool)      │             │
│  └──────────┬──────────┘    └──────────┬──────────┘             │
│             │                          │                         │
│             ▼                          ▼                         │
│  ┌─────────────────────┐    ┌─────────────────────┐             │
│  │  Click, type,       │    │  Automatically      │             │
│  │  verify manually    │    │  click, type,       │             │
│  │                     │    │  verify             │             │
│  └──────────┬──────────┘    └──────────┬──────────┘             │
│             │                          │                         │
│             ▼                          ▼                         │
│  ┌─────────────────────┐    ┌─────────────────────┐             │
│  │  Manual report      │    │  Auto report        │             │
│  │                     │    │  + Screenshots      │             │
│  └─────────────────────┘    └─────────────────────┘             │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 0.2 Why Automation Testing?

| Benefit | Explanation |
|---------|-------------|
| **Speed** | Runs 10-100x faster than manual |
| **Reliability** | No fatigue, no oversight, consistent every time |
| **Reusability** | Write once, run many times (regression) |
| **Cost savings** | Long-term cost reduction |
| **Parallel execution** | Test multiple browsers simultaneously |
| **24/7 execution** | CI/CD runs tests on every deploy |

**Real example:**

```
Regression Test for HR Tool (50 test cases):

Manual Testing:
- Time: 50 TCs × 5 min = 250 min = ~4 hours
- Per sprint (2 weeks): 4 hours × 5 times = 20 hours
- Prone to human error

Automation Testing:
- Writing time: 50 TCs × 30 min = 25 hours (one-time)
- Execution time: 50 TCs = ~10 min (each run)
- Runs automatically on every code change
```

### 0.3 When to Manual vs Automation?

```
┌─────────────────────────────────────────────────────────────────┐
│                    SHOULD AUTOMATE                               │
├─────────────────────────────────────────────────────────────────┤
│ ✅ Test cases run repeatedly (Regression, Smoke)                │
│ ✅ Test cases that are stable, rarely change                    │
│ ✅ Test cases with many data combinations                       │
│ ✅ Test cases that need multiple browsers                       │
│ ✅ Test cases that run frequently (every deploy)                │
│ ✅ API testing (fast response, easy to automate)                │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    SHOULD STAY MANUAL                            │
├─────────────────────────────────────────────────────────────────┤
│ ✅ Exploratory testing (free exploration)                       │
│ ✅ Usability testing (UX evaluation)                            │
│ ✅ New, unstable test cases                                     │
│ ✅ One-time tests (hotfix verification)                         │
│ ✅ Tests requiring visual/design judgment                       │
│ ✅ Test cases too complex to automate                           │
└─────────────────────────────────────────────────────────────────┘
```

### 0.4 Test Pyramid

```
                    ▲
                   /│\
                  / │ \       UI Tests (E2E)
                 /  │  \      - Fewest tests
                /   │   \     - Slowest
               /    │    \    - Most expensive
              ───────────────
             /       │       \
            /        │        \    Integration Tests
           /         │         \   - Moderate amount
          /          │          \  - Medium speed
         ─────────────────────────
        /             │             \
       /              │              \    Unit Tests
      /               │               \   - Most tests
     /                │                \  - Fastest
    /                 │                 \ - Cheapest
   ───────────────────────────────────────
```

| Type | Quantity | Speed | Cost | Scope |
|------|----------|-------|------|-------|
| **Unit Tests** | Most (~70%) | Very fast (ms) | Low | Single function |
| **Integration** | Moderate (~20%) | Medium (s) | Medium | Multiple modules |
| **UI/E2E** | Fewest (~10%) | Slow (s-min) | High | Full flow |

**HR Tool Testing Strategy:**
- **Unit Tests**: Dev writes (backend functions)
- **Integration Tests**: API tests (tRPC endpoints)
- **E2E Tests**: QC writes with Playwright (user flows)

### 0.5 Types of Automation Tests

| Type | Description | Tools |
|------|-------------|-------|
| **Unit Test** | Test single function/method | Jest, Vitest |
| **Integration Test** | Test multiple modules together | Playwright, Jest |
| **E2E Test** | Test from user perspective, full flow | Playwright, Cypress |
| **API Test** | Test API endpoints without UI | Playwright, Postman |
| **Visual Test** | Compare screenshots, detect UI changes | Playwright, Percy |
| **Performance Test** | Test speed, load capacity | k6, JMeter |

### 0.6 Automation Testing Workflow

```
1. ANALYZE
   - Review manual test cases
   - Select test cases suitable for automation
   - Identify required test data

2. DESIGN
   - Design Page Objects
   - Design test structure
   - Identify locators

3. DEVELOP
   - Write test scripts
   - Create test data
   - Debug and fix

4. EXECUTE
   - Run tests locally
   - Run tests on CI/CD
   - Review results

5. MAINTAIN
   - Update tests when UI changes
   - Fix flaky tests
   - Add new tests
```

---

## Part 1: Playwright Fundamentals

### 1.1 What is Playwright?

**Playwright** is Microsoft's automation testing framework for web applications.

**Key features:**
- **Cross-browser**: Chromium, Firefox, WebKit (Safari engine)
- **Cross-platform**: Windows, macOS, Linux
- **Cross-language**: JavaScript/TypeScript, Python, Java, .NET
- **Auto-waiting**: Automatically waits for elements to be ready
- **Modern web**: Supports SPA, iframes, shadow DOM
- **Reliable**: Fewer flaky tests than other tools

### 1.2 Playwright Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    PLAYWRIGHT ARCHITECTURE                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    Test Script (.spec.ts)                 │   │
│  └───────────────────────────┬──────────────────────────────┘   │
│                              │                                   │
│                              ▼                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                  Playwright Test Runner                   │   │
│  │  - Manage test execution                                  │   │
│  │  - Parallel workers                                       │   │
│  │  - Reports                                                │   │
│  └───────────────────────────┬──────────────────────────────┘   │
│                              │                                   │
│                              ▼                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    Playwright Library                     │   │
│  │  - Browser automation API                                 │   │
│  │  - Network interception                                   │   │
│  │  - Auto-waiting                                           │   │
│  └───────────────────────────┬──────────────────────────────┘   │
│                              │                                   │
│              ┌───────────────┼───────────────┐                  │
│              ▼               ▼               ▼                  │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐            │
│  │   Chromium   │ │   Firefox    │ │   WebKit     │            │
│  └──────────────┘ └──────────────┘ └──────────────┘            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 1.3 Core Concepts: Browser, Context, Page

```
BROWSER (1 instance)
├── CONTEXT 1 (Session 1 - isolated)
│   ├── Page 1 (Tab)
│   └── Page 2 (Tab)
└── CONTEXT 2 (Session 2 - isolated)
    └── Page 1 (Tab)
```

| Concept | Description | Real-world analogy |
|---------|-------------|-------------------|
| **Browser** | 1 browser instance | 1 Chrome window |
| **Context** | 1 isolated session | 1 user session |
| **Page** | 1 tab in context | 1 browser tab |

**Code example:**
```typescript
// Playwright manages this automatically
test('my test', async ({ page }) => {
  // page is created in a new context
  // each test has its own context → isolated
  await page.goto('/login');
});

// If you need multiple pages (tabs):
test('multi-tab', async ({ context }) => {
  const page1 = await context.newPage();
  const page2 = await context.newPage();
  // 2 tabs in same context (share cookies)
});

// If you need multiple users (contexts):
test('multi-user', async ({ browser }) => {
  const adminContext = await browser.newContext();
  const userContext = await browser.newContext();
  // 2 separate contexts (don't share cookies)
});
```

### 1.4 Test Isolation

**Each test runs in an isolated environment:**

```
Test 1: Login success          Test 2: Login failure
┌─────────────────────────┐    ┌─────────────────────────┐
│ Context A (isolated)    │    │ Context B (isolated)    │
│ - Fresh cookies         │    │ - Fresh cookies         │
│ - Fresh localStorage    │    │ - Fresh localStorage    │
│                         │    │                         │
│ Login → Success         │    │ Login → Failure         │
│ (doesn't affect T2)     │    │ (doesn't affect T1)     │
└─────────────────────────┘    └─────────────────────────┘

✅ Tests run independently
✅ Tests can run in parallel
✅ Test order doesn't matter
✅ 1 test failure doesn't affect others
```

### 1.5 Auto-Waiting

Playwright automatically waits before performing actions:

```typescript
// ❌ Old tools (Selenium) - manual waits
await driver.sleep(2000);  // Magic wait
await driver.findElement(By.id('button')).click();

// ✅ Playwright - auto-waiting
await page.click('#button');
// Playwright automatically waits for:
// 1. Element appears in DOM
// 2. Element visible (not hidden)
// 3. Element stable (no animation)
// 4. Element receives events (not covered by another)
// 5. Element enabled (not disabled)
```

**Auto-waiting conditions:**

| Action | Waits for |
|--------|-----------|
| `click()` | Visible, stable, receives events, enabled |
| `fill()` | Visible, enabled, editable |
| `check()` | Visible, enabled, unchecked |
| `selectOption()` | Visible, enabled |
| `expect().toBeVisible()` | Element visible |
| `expect().toHaveText()` | Element has expected text |

### 1.6 Locator Philosophy

**Playwright recommends locators in this priority order:**

```
1. getByRole()     ← BEST (accessibility, user-centric)
   page.getByRole('button', { name: 'Submit' })

2. getByText()     ← Good (user-visible text)
   page.getByText('Welcome')

3. getByLabel()    ← Good (form accessibility)
   page.getByLabel('Email')

4. getByPlaceholder() ← Good (form hint text)
   page.getByPlaceholder('Enter email...')

5. getByTestId()   ← OK (requires data-testid in code)
   page.getByTestId('submit-button')

6. locator()       ← Avoid if possible (CSS/XPath)
   page.locator('.btn-primary')
```

**Why is getByRole best?**
- Reflects how real users interact (screen readers, accessibility)
- Resilient - doesn't break when CSS class changes
- Self-documenting - code is easy to read and understand

### 1.7 Assertions

**Playwright assertions auto-retry:**

```typescript
// ✅ Auto-retry assertion (recommended)
await expect(page.locator('.status')).toHaveText('Success');
// Playwright retries until text = 'Success' or timeout

// ❌ Non-retry assertion (avoid)
const text = await page.locator('.status').textContent();
expect(text).toBe('Success');
// Only checks once, prone to flakiness
```

### 1.8 Comparison with Other Tools

| Feature | Playwright | Cypress | Selenium |
|---------|------------|---------|----------|
| **Multi-browser** | ✅ Chromium, Firefox, WebKit | ⚠️ Limited WebKit | ✅ All browsers |
| **Auto-waiting** | ✅ Built-in | ✅ Built-in | ❌ Manual waits |
| **Parallel execution** | ✅ Native | ✅ With Cloud | ⚠️ Grid setup |
| **Network mocking** | ✅ Full control | ✅ Full control | ❌ Limited |
| **Mobile emulation** | ✅ Built-in | ❌ No | ⚠️ Appium needed |
| **API testing** | ✅ Built-in | ✅ Built-in | ❌ No |
| **Multiple tabs** | ✅ Easy | ⚠️ Workarounds | ✅ Native |
| **Speed** | 🚀 Very fast | 🚀 Fast | 🐢 Slower |

---

## Learning Path Overview

| Phase | Duration | Goal |
|-------|----------|------|
| **Phase 1** Basics | 2 weeks | Understand Playwright, write first test |
| **Phase 2** Advanced | 2 weeks | POM, Fixtures, API Testing |
| **Phase 3** Practice | 2 weeks | Write automation tests for HR Tool |

---

## Phase 1: Basics (Week 1-2)

### Week 1: Setup & First Tests

#### Day 1-2: Environment Setup

**Requirements:**
- Node.js 18+ (recommended 20 LTS)
- VS Code
- Git

**Install Playwright:**
```bash
# Create new project
mkdir hr-tool-automation
cd hr-tool-automation
npm init playwright@latest

# Choose:
# ✔ TypeScript
# ✔ tests folder
# ✔ GitHub Actions workflow: Yes
# ✔ Install browsers: Yes
```

**VS Code Extensions:**
- **Playwright Test for VSCode** (Microsoft) - Required
- **ESLint** - Code quality
- **Prettier** - Code formatting

#### Day 3: First Test

```typescript
// tests/example.spec.ts
import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://hr-tool-software.netlify.app');
  await expect(page).toHaveTitle(/HR Tool/);
});

test('login page loads', async ({ page }) => {
  await page.goto('https://hr-tool-software.netlify.app/login');
  await expect(page.getByRole('button', { name: /login/i })).toBeVisible();
});

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://hr-tool-software.netlify.app/login');
  });

  test('shows login form', async ({ page }) => {
    await expect(page.getByLabel('Email')).toBeVisible();
  });

  test('shows error for invalid credentials', async ({ page }) => {
    await page.getByLabel('Email').fill('wrong@email.com');
    await page.getByLabel('Password').fill('wrongpassword');
    await page.getByRole('button', { name: /login/i }).click();
    await expect(page.getByText(/invalid/i)).toBeVisible();
  });
});
```

**Running tests:**
```bash
npx playwright test              # Run all tests (headless)
npx playwright test --ui         # UI mode (recommended for development)
npx playwright test --headed     # See browser
npx playwright test --debug      # Debug mode
npx playwright show-report       # View report
```

#### Day 4: Locators

```typescript
// Priority order for finding elements:

// 1. getByRole - PREFERRED (accessibility)
page.getByRole('button', { name: 'Login' })
page.getByRole('textbox', { name: 'Email' })

// 2. getByText
page.getByText('Welcome')
page.getByText(/login/i)  // regex, case-insensitive

// 3. getByLabel
page.getByLabel('Email')
page.getByLabel('Password')

// 4. getByPlaceholder
page.getByPlaceholder('Enter email...')

// 5. getByTestId
page.getByTestId('submit-button')

// 6. CSS selectors - AVOID if possible
page.locator('.btn-primary')
```

#### Day 5: Assertions

```typescript
// Visibility
await expect(page.getByRole('button')).toBeVisible();
await expect(page.getByRole('dialog')).toBeHidden();

// Text content
await expect(page.locator('.title')).toHaveText('Dashboard');
await expect(page.locator('.message')).toContainText('success');

// Attribute
await expect(page.getByRole('button')).toBeEnabled();
await expect(page.locator('input')).toHaveValue('test@example.com');

// Count
await expect(page.getByRole('row')).toHaveCount(10);

// URL
await expect(page).toHaveURL(/.*dashboard/);
```

**Week 1 Assignment:**
- [ ] Write login test for HR Tool staging
- [ ] Write sidebar navigation test

---

### Week 2: Actions & Debugging

#### Day 1: Actions

```typescript
// Click
await page.getByRole('button').click();
await page.getByRole('button').dblclick();

// Type / Fill
await page.getByLabel('Email').fill('test@example.com');

// Select dropdown
await page.getByLabel('Department').selectOption('engineering');

// Checkbox / Radio
await page.getByRole('checkbox').check();
await page.getByRole('radio', { name: 'Male' }).check();

// File upload
await page.getByLabel('Upload CV').setInputFiles('cv.pdf');

// Keyboard
await page.getByLabel('Search').press('Enter');
```

#### Day 2-3: Navigation & Waiting

```typescript
// Navigation
await page.goto('/employees');
await page.waitForURL('**/dashboard');
await page.goBack();

// Waiting
await page.waitForSelector('.loading', { state: 'hidden' });
await page.waitForLoadState('networkidle');

const responsePromise = page.waitForResponse('**/api/employees');
await page.click('button');
await responsePromise;
```

#### Day 4: Debugging

```bash
# Playwright Inspector
npx playwright test --debug

# Trace viewer
npx playwright test --trace on
npx playwright show-trace trace.zip
```

```typescript
// Pause in code
await page.pause();

// Screenshot
await page.screenshot({ path: 'debug.png' });
```

#### Day 5: Configuration

```typescript
// playwright.config.ts
export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  retries: 2,
  use: {
    baseURL: 'https://hr-tool-software.netlify.app',
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
  },
});
```

**Week 2 Assignment:**
- [ ] Write create employee test
- [ ] Write Login -> Navigate -> Logout flow

---

## Phase 2: Advanced (Week 3-4)

### Week 3: Page Object Model & Fixtures

#### Page Object Model

**Why POM?**
- Reusable code
- Easy maintenance when UI changes
- Clean, readable test code

```typescript
// pages/LoginPage.ts
export class LoginPage {
  constructor(private page: Page) {}

  readonly emailInput = this.page.getByLabel('Email');
  readonly passwordInput = this.page.getByLabel('Password');
  readonly loginButton = this.page.getByRole('button', { name: /login/i });

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}
```

```typescript
// Using in tests
test('successful login', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('admin@test.com', 'password123');
  await expect(page).toHaveURL(/.*dashboard/);
});
```

#### Fixtures

```typescript
// fixtures/auth.fixture.ts
export const test = base.extend({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  authenticatedPage: async ({ page }, use) => {
    await page.goto('/login');
    await page.getByLabel('Email').fill('admin@test.com');
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: /login/i }).click();
    await page.waitForURL('**/dashboard');
    await use();
  },
});
```

**Week 3 Assignment:**
- [ ] Create LoginPage, SidebarPage, EmployeeListPage
- [ ] Create auth fixture for reuse

---

### Week 4: API Testing & CI/CD

#### API Testing (tRPC)

```typescript
test('login API', async ({ request }) => {
  const response = await request.post('/trpc/auth.login', {
    data: {
      json: { email: 'admin@test.com', password: 'password123' }
    }
  });

  expect(response.ok()).toBeTruthy();
  const body = await response.json();
  expect(body.result.data.json).toHaveProperty('accessToken');
});
```

#### Network Mocking

```typescript
await page.route('**/trpc/employee.list*', async (route) => {
  await route.fulfill({
    status: 200,
    body: JSON.stringify({
      result: { data: { json: { items: [], total: 0 } } }
    })
  });
});
```

#### GitHub Actions

```yaml
# .github/workflows/playwright.yml
name: Playwright Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx playwright test
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

**Week 4 Assignment:**
- [ ] Write API tests for tRPC endpoints
- [ ] Setup GitHub Actions workflow

---

## Phase 3: Practice with HR Tool (Week 5-6)

### Week 5: Automate Manual Test Cases

Refer to [Test Cases by Module](/en/practice/04-test-cases-by-module) to identify test cases to automate.

**Priority test cases:**
- Authentication: AUTH-01 to AUTH-10
- Employee: EMP-01 to EMP-19
- Smoke tests

### Week 6: Smoke Test Automation

Refer to [Smoke Test Checklist](/en/practice/03-smoke-test-checklist) to write smoke test automation.

---

## Resources

| Resource | Link |
|----------|------|
| Getting Started | [playwright.dev/docs/intro](https://playwright.dev/docs/intro) |
| Best Practices | [playwright.dev/docs/best-practices](https://playwright.dev/docs/best-practices) |
| API Reference | [playwright.dev/docs/api](https://playwright.dev/docs/api/class-playwright) |
| Playwright Full Course | [YouTube Playlist](https://www.youtube.com/playlist?list=PLUeDIlio4THEXmQxNvKmdDxAVloGTHXMr) |
| TAU Course | [testautomationu.applitools.com](https://testautomationu.applitools.com/playwright-intro/) |

---

## Completion Checklist

### Phase 1
- [ ] Install Playwright successfully
- [ ] Write 5+ basic test cases
- [ ] Understand locators and assertions
- [ ] Debug failed tests

### Phase 2
- [ ] Create Page Object Model
- [ ] Setup authentication fixture
- [ ] Write API tests
- [ ] Understand CI/CD integration

### Phase 3
- [ ] Automate 20+ test cases for HR Tool
- [ ] Setup CI/CD pipeline
- [ ] Write documentation
- [ ] Demo to team

---

## Tips

1. **Don't skip Part 0 & Phase 1** - Strong foundation is important
2. **Practice daily** - 1-2 hours/day is better than 8 hours on weekend
3. **Read official docs first** - YouTube/Blog later
4. **Ask when stuck** - Don't spend more than 30 minutes on one issue
5. **Commit code daily** - Track progress, backup work

---

**Mentor:** Tech Lead | **Support:** Slack #qc-automation
