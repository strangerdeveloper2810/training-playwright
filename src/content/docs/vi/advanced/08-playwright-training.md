---
title: Lộ trình Playwright
description: Lộ trình học Automation Testing với Playwright - 6 tuần
---

# Lộ trình Đào tạo Playwright

**Dành cho:** QC Team
**Thời gian:** 6 tuần
**Mentor:** Tech Lead

> **Mục tiêu:** Automate 20+ test cases cho HR Tool

---

## Phần 0: Kiến thức nền tảng về Automation Testing

### 0.1 Automation Testing là gì?

**Automation Testing** là việc sử dụng phần mềm/công cụ để thực hiện các test cases một cách tự động, thay vì con người test thủ công.

```
┌─────────────────────────────────────────────────────────────────┐
│                    MANUAL vs AUTOMATION                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Manual Testing              Automation Testing                  │
│  ┌─────────────┐            ┌─────────────────────┐             │
│  │   Tester    │            │    Test Script      │             │
│  │  (Con người)│            │    (Code/Tool)      │             │
│  └──────┬──────┘            └──────────┬──────────┘             │
│         │                              │                         │
│         ▼                              ▼                         │
│  ┌─────────────┐            ┌─────────────────────┐             │
│  │  Click,     │            │  Tự động click,     │             │
│  │  nhập liệu, │            │  nhập liệu,         │             │
│  │  kiểm tra   │            │  kiểm tra           │             │
│  └──────┬──────┘            └──────────┬──────────┘             │
│         │                              │                         │
│         ▼                              ▼                         │
│  ┌─────────────┐            ┌─────────────────────┐             │
│  │  Báo cáo    │            │  Báo cáo tự động    │             │
│  │  (Thủ công) │            │  + Screenshots      │             │
│  └─────────────┘            └─────────────────────┘             │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 0.2 Tại sao cần Automation Testing?

| Lợi ích | Giải thích |
|---------|------------|
| **Tốc độ** | Chạy test nhanh gấp 10-100 lần manual |
| **Độ tin cậy** | Không bị mệt, không bỏ sót, chạy giống nhau mọi lần |
| **Tái sử dụng** | Viết 1 lần, chạy nhiều lần (regression) |
| **Tiết kiệm chi phí** | Dài hạn giảm chi phí test |
| **Chạy song song** | Có thể test nhiều browsers cùng lúc |
| **Chạy 24/7** | CI/CD chạy test mỗi khi deploy |

**Ví dụ thực tế:**

```
Regression Test cho HR Tool (50 test cases):

Manual Testing:
- Thời gian: 50 TCs × 5 phút = 250 phút = ~4 giờ
- Mỗi sprint (2 tuần): 4 giờ × 5 lần = 20 giờ
- Dễ sai sót khi làm nhiều lần

Automation Testing:
- Thời gian viết: 50 TCs × 30 phút = 25 giờ (1 lần)
- Thời gian chạy: 50 TCs = ~10 phút (mỗi lần)
- Chạy tự động mỗi khi có code mới
```

### 0.3 Khi nào nên Manual vs Automation?

```
┌─────────────────────────────────────────────────────────────────┐
│                    NÊN AUTOMATION                                │
├─────────────────────────────────────────────────────────────────┤
│ ✅ Test cases chạy lặp đi lặp lại (Regression, Smoke)           │
│ ✅ Test cases ổn định, ít thay đổi                              │
│ ✅ Test cases có nhiều data combinations                        │
│ ✅ Test cases cần chạy trên nhiều browsers                      │
│ ✅ Test cases cần chạy thường xuyên (mỗi deploy)               │
│ ✅ API testing (response nhanh, dễ automate)                    │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    NÊN MANUAL                                    │
├─────────────────────────────────────────────────────────────────┤
│ ✅ Exploratory testing (khám phá tự do)                         │
│ ✅ Usability testing (đánh giá UX)                              │
│ ✅ Test cases mới, chưa ổn định                                 │
│ ✅ Test 1 lần (hotfix verification)                             │
│ ✅ Test cần đánh giá visual/design                              │
│ ✅ Test cases quá phức tạp để automate                          │
└─────────────────────────────────────────────────────────────────┘
```

### 0.4 Test Pyramid

```
                    ▲
                   /│\
                  / │ \
                 /  │  \       UI Tests (E2E)
                /   │   \      - Ít tests nhất
               /    │    \     - Chậm nhất
              /     │     \    - Đắt nhất
             ───────────────
            /       │       \
           /        │        \    Integration Tests
          /         │         \   - Số lượng vừa phải
         /          │          \  - Tốc độ trung bình
        /           │           \
       ─────────────────────────
      /             │             \
     /              │              \    Unit Tests
    /               │               \   - Nhiều tests nhất
   /                │                \  - Nhanh nhất
  /                 │                 \ - Rẻ nhất
 ───────────────────────────────────────

```

**Giải thích:**

| Loại | Số lượng | Tốc độ | Chi phí | Phạm vi |
|------|----------|--------|---------|---------|
| **Unit Tests** | Nhiều nhất (~70%) | Rất nhanh (ms) | Thấp | Test từng function |
| **Integration Tests** | Vừa phải (~20%) | Trung bình (s) | TB | Test nhiều modules |
| **UI/E2E Tests** | Ít nhất (~10%) | Chậm (s-min) | Cao | Test full flow |

**HR Tool Testing Strategy:**
- **Unit Tests**: Dev viết (backend functions)
- **Integration Tests**: API tests (tRPC endpoints)
- **E2E Tests**: QC viết với Playwright (user flows)

### 0.5 Các loại Automation Tests

```
┌─────────────────────────────────────────────────────────────────┐
│ Loại Test              │ Mô tả                   │ Tools        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│ Unit Test              │ Test 1 function/method  │ Jest, Vitest │
│ ──────────             │                         │              │
│ add(2, 3) → expect 5   │                         │              │
│                                                                  │
│ Integration Test       │ Test nhiều modules      │ Playwright,  │
│ ──────────────────     │ hoạt động cùng nhau     │ Jest         │
│ Login API → DB → JWT   │                         │              │
│                                                                  │
│ E2E Test               │ Test từ góc nhìn user   │ Playwright,  │
│ ────────               │ Full flow               │ Cypress      │
│ Open browser → Login   │                         │              │
│ → Navigate → Action    │                         │              │
│                                                                  │
│ API Test               │ Test API endpoints      │ Playwright,  │
│ ────────               │ không qua UI            │ Postman      │
│ POST /api/login        │                         │              │
│                                                                  │
│ Visual Test            │ So sánh screenshots     │ Playwright,  │
│ ───────────            │ phát hiện UI changes    │ Percy        │
│ Before vs After        │                         │              │
│                                                                  │
│ Performance Test       │ Test tốc độ, load       │ k6, JMeter   │
│ ────────────────       │                         │              │
│ 1000 users đồng thời   │                         │              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 0.6 Automation Testing Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│                 AUTOMATION TESTING WORKFLOW                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. ANALYZE                                                      │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ - Review manual test cases                               │    │
│  │ - Chọn test cases phù hợp để automate                   │    │
│  │ - Xác định test data cần thiết                          │    │
│  └─────────────────────────────────────────────────────────┘    │
│                            │                                     │
│                            ▼                                     │
│  2. DESIGN                                                       │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ - Thiết kế Page Objects                                  │    │
│  │ - Thiết kế test structure                               │    │
│  │ - Xác định locators                                      │    │
│  └─────────────────────────────────────────────────────────┘    │
│                            │                                     │
│                            ▼                                     │
│  3. DEVELOP                                                      │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ - Viết test scripts                                      │    │
│  │ - Tạo test data                                          │    │
│  │ - Debug và fix                                           │    │
│  └─────────────────────────────────────────────────────────┘    │
│                            │                                     │
│                            ▼                                     │
│  4. EXECUTE                                                      │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ - Chạy tests locally                                     │    │
│  │ - Chạy tests trên CI/CD                                  │    │
│  │ - Review kết quả                                         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                            │                                     │
│                            ▼                                     │
│  5. MAINTAIN                                                     │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ - Update tests khi UI thay đổi                          │    │
│  │ - Fix flaky tests                                        │    │
│  │ - Thêm tests mới                                         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Phần 1: Playwright Fundamentals

### 1.1 Playwright là gì?

**Playwright** là framework automation testing của Microsoft, được phát triển để test web applications.

**Đặc điểm nổi bật:**
- **Cross-browser**: Hỗ trợ Chromium, Firefox, WebKit (Safari engine)
- **Cross-platform**: Windows, macOS, Linux
- **Cross-language**: JavaScript/TypeScript, Python, Java, .NET
- **Auto-waiting**: Tự động đợi elements sẵn sàng
- **Modern web**: Hỗ trợ SPA, iframes, shadow DOM
- **Reliable**: Ít flaky tests hơn các tools khác

### 1.2 Playwright Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    PLAYWRIGHT ARCHITECTURE                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    Test Script (.spec.ts)                 │   │
│  │  test('login', async ({ page }) => {                     │   │
│  │    await page.goto('/login');                            │   │
│  │    await page.fill('input[name="email"]', '...');        │   │
│  │  })                                                       │   │
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
│  │   (Chrome)   │ │              │ │   (Safari)   │            │
│  └──────────────┘ └──────────────┘ └──────────────┘            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 1.3 Core Concepts: Browser, Context, Page

```
┌─────────────────────────────────────────────────────────────────┐
│                 BROWSER → CONTEXT → PAGE                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  BROWSER (1 instance)                                            │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                                                          │    │
│  │  CONTEXT 1 (Session 1)      CONTEXT 2 (Session 2)       │    │
│  │  ┌─────────────────────┐    ┌─────────────────────┐     │    │
│  │  │ - Cookies riêng     │    │ - Cookies riêng     │     │    │
│  │  │ - LocalStorage riêng│    │ - LocalStorage riêng│     │    │
│  │  │                     │    │                     │     │    │
│  │  │  ┌──────┐ ┌──────┐ │    │  ┌──────┐          │     │    │
│  │  │  │Page 1│ │Page 2│ │    │  │Page 1│          │     │    │
│  │  │  │(Tab) │ │(Tab) │ │    │  │(Tab) │          │     │    │
│  │  │  └──────┘ └──────┘ │    │  └──────┘          │     │    │
│  │  └─────────────────────┘    └─────────────────────┘     │    │
│  │                                                          │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Giải thích:**

| Concept | Mô tả | Ví dụ thực tế |
|---------|-------|---------------|
| **Browser** | 1 instance của browser | 1 Chrome window |
| **Context** | 1 session riêng biệt (isolated) | 1 user session |
| **Page** | 1 tab trong context | 1 tab trên browser |

**Code example:**
```typescript
// Playwright tự động quản lý cho bạn
test('my test', async ({ page }) => {
  // page đã được tạo trong 1 context mới
  // mỗi test có context riêng → isolated
  await page.goto('/login');
});

// Nếu cần nhiều pages (tabs):
test('multi-tab', async ({ context }) => {
  const page1 = await context.newPage();
  const page2 = await context.newPage();
  // 2 tabs trong cùng 1 context (share cookies)
});

// Nếu cần nhiều users (contexts):
test('multi-user', async ({ browser }) => {
  const adminContext = await browser.newContext();
  const userContext = await browser.newContext();
  // 2 contexts riêng biệt (không share cookies)
});
```

### 1.4 Test Isolation (Quan trọng!)

**Mỗi test chạy trong môi trường riêng biệt:**

```
┌─────────────────────────────────────────────────────────────────┐
│                    TEST ISOLATION                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Test 1: Login success          Test 2: Login failure           │
│  ┌─────────────────────────┐    ┌─────────────────────────┐    │
│  │ Context A (isolated)    │    │ Context B (isolated)    │    │
│  │ - Fresh cookies         │    │ - Fresh cookies         │    │
│  │ - Fresh localStorage    │    │ - Fresh localStorage    │    │
│  │ - Fresh sessionStorage  │    │ - Fresh sessionStorage  │    │
│  │                         │    │                         │    │
│  │ Login → Success         │    │ Login → Failure         │    │
│  │ (không ảnh hưởng T2)    │    │ (không ảnh hưởng T1)    │    │
│  └─────────────────────────┘    └─────────────────────────┘    │
│                                                                  │
│  ✅ Tests chạy độc lập                                          │
│  ✅ Tests có thể chạy song song (parallel)                      │
│  ✅ Test order không quan trọng                                  │
│  ✅ Fail 1 test không ảnh hưởng tests khác                      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 1.5 Auto-Waiting (Điểm mạnh của Playwright)

Playwright tự động đợi trước khi thực hiện actions:

```typescript
// ❌ Các tools cũ (Selenium) - cần wait thủ công
await driver.sleep(2000);  // Magic wait
await driver.findElement(By.id('button')).click();

// ✅ Playwright - auto-waiting
await page.click('#button');
// Playwright tự động đợi:
// 1. Element xuất hiện trong DOM
// 2. Element visible (không bị hidden)
// 3. Element stable (không animation)
// 4. Element nhận events (không bị element khác che)
// 5. Element enabled (không disabled)
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

**Timeout:**
```typescript
// Default timeout: 30 seconds
await page.click('#button');  // Wait tối đa 30s

// Custom timeout
await page.click('#button', { timeout: 5000 });  // Wait tối đa 5s

// Global config
// playwright.config.ts
export default defineConfig({
  timeout: 60000,  // 60s cho mỗi test
  expect: {
    timeout: 10000  // 10s cho mỗi assertion
  }
});
```

### 1.6 Locator Philosophy

**Playwright khuyến khích locators theo thứ tự ưu tiên:**

```
┌─────────────────────────────────────────────────────────────────┐
│                 LOCATOR PRIORITY (Tốt → Xấu)                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. getByRole()     ← TỐT NHẤT (accessibility, user-centric)    │
│     page.getByRole('button', { name: 'Submit' })                │
│                                                                  │
│  2. getByText()     ← Tốt (user-visible text)                   │
│     page.getByText('Welcome')                                    │
│                                                                  │
│  3. getByLabel()    ← Tốt (form accessibility)                  │
│     page.getByLabel('Email')                                     │
│                                                                  │
│  4. getByPlaceholder() ← Tốt (form hint text)                   │
│     page.getByPlaceholder('Enter email...')                      │
│                                                                  │
│  5. getByTestId()   ← OK (cần thêm data-testid vào code)        │
│     page.getByTestId('submit-button')                            │
│                                                                  │
│  6. locator()       ← Tránh nếu có thể (CSS/XPath selectors)    │
│     page.locator('.btn-primary')                                 │
│     page.locator('#login-form')                                  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Tại sao getByRole tốt nhất?**
- Reflects cách users thật sự tương tác (screen readers, accessibility)
- Resilient - không bị break khi thay đổi CSS class
- Self-documenting - code dễ đọc, dễ hiểu

**Ví dụ so sánh:**
```typescript
// ❌ Fragile - CSS class có thể thay đổi
await page.locator('.btn.btn-primary.submit-form').click();

// ❌ Fragile - ID có thể thay đổi
await page.locator('#btnSubmit').click();

// ✅ Resilient - tìm theo role và accessible name
await page.getByRole('button', { name: 'Submit' }).click();
```

### 1.7 Assertions

**Playwright assertions tự động retry:**

```typescript
// ✅ Auto-retry assertion (recommended)
await expect(page.locator('.status')).toHaveText('Success');
// Playwright sẽ retry cho đến khi text = 'Success' hoặc timeout

// ❌ Non-retry assertion (avoid)
const text = await page.locator('.status').textContent();
expect(text).toBe('Success');
// Chỉ check 1 lần, dễ flaky
```

**Common assertions:**

```typescript
// Visibility
await expect(element).toBeVisible();
await expect(element).toBeHidden();
await expect(element).toBeAttached();  // In DOM

// State
await expect(element).toBeEnabled();
await expect(element).toBeDisabled();
await expect(element).toBeChecked();
await expect(element).toBeFocused();

// Content
await expect(element).toHaveText('exact text');
await expect(element).toContainText('partial');
await expect(element).toHaveValue('input value');

// Attribute
await expect(element).toHaveAttribute('href', '/link');
await expect(element).toHaveClass('active');
await expect(element).toHaveCSS('color', 'red');

// Count
await expect(page.locator('tr')).toHaveCount(10);

// Page
await expect(page).toHaveURL('/dashboard');
await expect(page).toHaveTitle('Dashboard');
```

### 1.8 So sánh Playwright với các tools khác

| Feature | Playwright | Cypress | Selenium |
|---------|------------|---------|----------|
| **Multi-browser** | ✅ Chromium, Firefox, WebKit | ⚠️ Limited WebKit | ✅ All browsers |
| **Auto-waiting** | ✅ Built-in | ✅ Built-in | ❌ Manual waits |
| **Parallel execution** | ✅ Native | ✅ With Cloud | ⚠️ Grid setup |
| **Network mocking** | ✅ Full control | ✅ Full control | ❌ Limited |
| **Mobile emulation** | ✅ Built-in | ❌ No | ⚠️ Appium needed |
| **API testing** | ✅ Built-in | ✅ Built-in | ❌ No |
| **Multiple tabs** | ✅ Easy | ⚠️ Workarounds | ✅ Native |
| **iframes** | ✅ Easy | ⚠️ Complex | ✅ Switch context |
| **Shadow DOM** | ✅ Native | ⚠️ Plugins | ⚠️ Complex |
| **Language** | JS/TS, Python, Java, .NET | JS/TS only | Many |
| **Speed** | 🚀 Very fast | 🚀 Fast | 🐢 Slower |
| **Debugging** | ✅ Inspector, Trace | ✅ Time-travel | ⚠️ Limited |

---

## Tổng quan Lộ trình

| Giai đoạn | Thời gian | Mục tiêu |
|-----------|-----------|----------|
| **Phase 1** Căn bản | 2 tuần | Hiểu Playwright, viết test đầu tiên |
| **Phase 2** Nâng cao | 2 tuần | POM, Fixtures, API Testing |
| **Phase 3** Thực hành | 2 tuần | Viết automation tests cho HR Tool |

---

## Phase 1: Căn bản (Tuần 1-2)

### Tuần 1: Cài đặt & Test đầu tiên

#### Ngày 1-2: Cài đặt môi trường

**Yêu cầu:**
- Node.js 18+ (khuyến nghị 20 LTS)
- VS Code
- Git

**Cài đặt Playwright:**
```bash
# Tạo project mới
mkdir hr-tool-automation
cd hr-tool-automation
npm init playwright@latest

# Chọn:
# ✔ TypeScript
# ✔ tests folder
# ✔ GitHub Actions workflow: Yes
# ✔ Install browsers: Yes
```

**Cấu trúc project:**
```
hr-tool-automation/
├── tests/
│   └── example.spec.ts      # Test files
├── tests-examples/           # Example tests (có thể xóa)
├── playwright.config.ts      # Configuration
├── package.json
└── .github/
    └── workflows/
        └── playwright.yml    # CI config
```

**VS Code Extensions:**
- **Playwright Test for VSCode** (Microsoft) - Bắt buộc
- **ESLint** - Code quality
- **Prettier** - Code formatting

#### Ngày 3: Test đầu tiên

```typescript
// tests/example.spec.ts
import { test, expect } from '@playwright/test';

// Test đơn giản nhất
test('has title', async ({ page }) => {
  // 1. Navigate đến URL
  await page.goto('https://hr-tool-software.netlify.app');

  // 2. Assert title
  await expect(page).toHaveTitle(/HR Tool/);
});

// Test với nhiều steps
test('login page loads correctly', async ({ page }) => {
  // Step 1: Go to login page
  await page.goto('https://hr-tool-software.netlify.app/login');

  // Step 2: Check form elements visible
  await expect(page.getByLabel('Email')).toBeVisible();
  await expect(page.getByLabel(/mật khẩu/i)).toBeVisible();
  await expect(page.getByRole('button', { name: /đăng nhập/i })).toBeVisible();
});

// Test group (describe)
test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    // Runs before each test in this describe block
    await page.goto('https://hr-tool-software.netlify.app/login');
  });

  test('shows login form', async ({ page }) => {
    await expect(page.getByLabel('Email')).toBeVisible();
  });

  test('shows error for invalid credentials', async ({ page }) => {
    await page.getByLabel('Email').fill('wrong@email.com');
    await page.getByLabel(/mật khẩu/i).fill('wrongpassword');
    await page.getByRole('button', { name: /đăng nhập/i }).click();

    await expect(page.getByText(/không đúng/i)).toBeVisible();
  });
});
```

**Chạy tests:**
```bash
# Chạy tất cả tests (headless)
npx playwright test

# Chạy với UI mode (khuyến nghị khi develop)
npx playwright test --ui

# Chạy 1 file cụ thể
npx playwright test tests/auth/login.spec.ts

# Chạy với browser hiển thị
npx playwright test --headed

# Chạy với debug mode
npx playwright test --debug

# Xem report
npx playwright show-report
```

#### Ngày 4: Locators chi tiết

```typescript
// tests/locators.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Locator Examples', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://hr-tool-software.netlify.app/login');
  });

  test('getByRole examples', async ({ page }) => {
    // Button
    await page.getByRole('button', { name: 'Đăng nhập' }).click();
    await page.getByRole('button', { name: /đăng nhập/i }).click();  // Case insensitive

    // Link
    await page.getByRole('link', { name: 'Quên mật khẩu?' }).click();

    // Textbox (input type="text", input type="email", textarea)
    await page.getByRole('textbox', { name: 'Email' }).fill('test@example.com');

    // Checkbox
    await page.getByRole('checkbox', { name: 'Ghi nhớ đăng nhập' }).check();

    // Heading
    await expect(page.getByRole('heading', { name: 'Đăng nhập' })).toBeVisible();

    // Table elements
    await page.getByRole('table');
    await page.getByRole('row', { name: /nguyễn văn a/i });
    await page.getByRole('cell', { name: 'Active' });
  });

  test('getByText examples', async ({ page }) => {
    // Exact text
    await page.getByText('Đăng nhập vào hệ thống');

    // Partial text (substring)
    await page.getByText('Đăng nhập', { exact: false });

    // Regex (case insensitive)
    await page.getByText(/đăng nhập/i);
  });

  test('getByLabel examples', async ({ page }) => {
    // By label text
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByLabel('Mật khẩu').fill('password123');

    // Case insensitive
    await page.getByLabel(/mật khẩu/i).fill('password123');
  });

  test('getByPlaceholder examples', async ({ page }) => {
    await page.getByPlaceholder('Nhập email...').fill('test@example.com');
    await page.getByPlaceholder(/nhập email/i).fill('test@example.com');
  });

  test('getByTestId examples', async ({ page }) => {
    // Requires data-testid attribute in HTML
    // <button data-testid="submit-btn">Submit</button>
    await page.getByTestId('submit-btn').click();
  });

  test('CSS/XPath locators (use as last resort)', async ({ page }) => {
    // CSS selector
    await page.locator('.btn-primary').click();
    await page.locator('#login-form').isVisible();
    await page.locator('input[name="email"]').fill('test@example.com');

    // XPath (avoid if possible)
    await page.locator('xpath=//button[contains(text(), "Submit")]').click();
  });

  test('chaining locators', async ({ page }) => {
    // Find button inside specific form
    const loginForm = page.locator('#login-form');
    await loginForm.getByRole('button', { name: 'Đăng nhập' }).click();

    // Find cell in specific row
    const row = page.getByRole('row', { name: /nguyễn văn a/i });
    await expect(row.getByRole('cell', { name: 'Active' })).toBeVisible();
  });

  test('filtering locators', async ({ page }) => {
    await page.goto('/employees');

    // Filter rows that contain specific text
    const activeEmployees = page.getByRole('row').filter({ hasText: 'Active' });
    await expect(activeEmployees).toHaveCount(5);

    // Filter by child element
    const rowsWithEditButton = page.getByRole('row').filter({
      has: page.getByRole('button', { name: 'Sửa' })
    });
  });
});
```

#### Ngày 5: Assertions chi tiết

```typescript
// tests/assertions.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Assertion Examples', () => {
  test('visibility assertions', async ({ page }) => {
    await page.goto('/login');

    // Element visible
    await expect(page.getByRole('button', { name: 'Đăng nhập' })).toBeVisible();

    // Element hidden
    await expect(page.getByRole('dialog')).toBeHidden();

    // Element attached to DOM (but may be hidden)
    await expect(page.locator('.loading-spinner')).toBeAttached();

    // Element NOT visible (negation)
    await expect(page.getByText('Error')).not.toBeVisible();
  });

  test('text assertions', async ({ page }) => {
    await page.goto('/dashboard');

    // Exact text
    await expect(page.locator('.title')).toHaveText('Dashboard');

    // Contains text
    await expect(page.locator('.welcome')).toContainText('Xin chào');

    // Regex
    await expect(page.locator('.count')).toHaveText(/\d+ nhân viên/);

    // Array of texts (for multiple elements)
    await expect(page.locator('.menu-item')).toHaveText([
      'Dashboard',
      'Nhân viên',
      'Phòng ban'
    ]);
  });

  test('input assertions', async ({ page }) => {
    await page.goto('/login');

    await page.getByLabel('Email').fill('test@example.com');
    await expect(page.getByLabel('Email')).toHaveValue('test@example.com');

    // Empty value
    await expect(page.getByLabel('Mật khẩu')).toHaveValue('');

    // Editable
    await expect(page.getByLabel('Email')).toBeEditable();
  });

  test('state assertions', async ({ page }) => {
    await page.goto('/login');

    // Enabled/Disabled
    await expect(page.getByRole('button', { name: 'Đăng nhập' })).toBeEnabled();

    // After some condition, button may be disabled
    await expect(page.locator('.submit-btn')).toBeDisabled();

    // Checked (checkbox/radio)
    await page.getByRole('checkbox').check();
    await expect(page.getByRole('checkbox')).toBeChecked();

    // Focused
    await page.getByLabel('Email').focus();
    await expect(page.getByLabel('Email')).toBeFocused();
  });

  test('attribute assertions', async ({ page }) => {
    await page.goto('/employees');

    // Has attribute
    await expect(page.locator('a.active')).toHaveAttribute('href', '/employees');

    // Has class
    await expect(page.locator('.nav-link')).toHaveClass(/active/);

    // Has CSS property
    await expect(page.locator('.error')).toHaveCSS('color', 'rgb(255, 0, 0)');
  });

  test('count assertions', async ({ page }) => {
    await page.goto('/employees');

    // Exact count
    await expect(page.getByRole('row')).toHaveCount(11);  // header + 10 rows

    // Greater than
    const rows = await page.getByRole('row').count();
    expect(rows).toBeGreaterThan(1);
  });

  test('page assertions', async ({ page }) => {
    await page.goto('/login');

    // URL
    await expect(page).toHaveURL(/.*login/);
    await expect(page).toHaveURL('https://hr-tool-software.netlify.app/login');

    // Title
    await expect(page).toHaveTitle(/HR Tool/);

    // Screenshot comparison (visual testing)
    await expect(page).toHaveScreenshot('login-page.png');
  });

  test('soft assertions', async ({ page }) => {
    // Soft assertions don't stop test on failure
    await page.goto('/dashboard');

    await expect.soft(page.locator('.stat-1')).toHaveText('10');
    await expect.soft(page.locator('.stat-2')).toHaveText('5');
    await expect.soft(page.locator('.stat-3')).toHaveText('3');
    // Test continues even if some assertions fail
    // All failures reported at the end
  });

  test('custom timeout', async ({ page }) => {
    await page.goto('/slow-page');

    // Wait longer for slow elements
    await expect(page.locator('.data')).toBeVisible({ timeout: 30000 });
  });
});
```

**Bài tập cuối Tuần 1:**
- [ ] Viết test login cho HR Tool staging
- [ ] Viết test kiểm tra sidebar navigation
- [ ] Sử dụng các loại locators khác nhau

---

### Tuần 2: Actions & Debugging

#### Ngày 1: Actions

```typescript
// tests/actions.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Action Examples', () => {
  test('click actions', async ({ page }) => {
    await page.goto('/login');

    // Basic click
    await page.getByRole('button', { name: 'Đăng nhập' }).click();

    // Double click
    await page.locator('.item').dblclick();

    // Right click
    await page.locator('.item').click({ button: 'right' });

    // Click with modifier keys
    await page.locator('.item').click({ modifiers: ['Control'] });  // Ctrl+Click

    // Click at specific position
    await page.locator('.canvas').click({ position: { x: 100, y: 200 } });

    // Force click (bypass actionability checks)
    await page.locator('.hidden-button').click({ force: true });
  });

  test('input actions', async ({ page }) => {
    await page.goto('/employees/new');

    // Fill (clears existing value first)
    await page.getByLabel('Tên').fill('Nguyễn Văn A');

    // Type (character by character, triggers keydown/keypress/keyup)
    await page.getByLabel('Email').pressSequentially('test@example.com', { delay: 50 });

    // Clear
    await page.getByLabel('Tên').clear();

    // Press single key
    await page.getByLabel('Search').press('Enter');

    // Key combinations
    await page.keyboard.press('Control+a');  // Select all
    await page.keyboard.press('Control+c');  // Copy

    // Type special characters
    await page.keyboard.type('Hello\nWorld');  // With newline
  });

  test('select dropdown', async ({ page }) => {
    await page.goto('/employees/new');

    // Select by value
    await page.getByLabel('Phòng ban').selectOption('engineering');

    // Select by label text
    await page.getByLabel('Phòng ban').selectOption({ label: 'Engineering' });

    // Select by index
    await page.getByLabel('Phòng ban').selectOption({ index: 2 });

    // Multiple select
    await page.locator('select[multiple]').selectOption(['opt1', 'opt2']);
  });

  test('checkbox and radio', async ({ page }) => {
    await page.goto('/settings');

    // Check
    await page.getByRole('checkbox', { name: 'Nhận thông báo' }).check();

    // Uncheck
    await page.getByRole('checkbox', { name: 'Nhận thông báo' }).uncheck();

    // Set checked state (check if unchecked, do nothing if already checked)
    await page.getByRole('checkbox').setChecked(true);
    await page.getByRole('checkbox').setChecked(false);

    // Radio button
    await page.getByRole('radio', { name: 'Nam' }).check();
  });

  test('file upload', async ({ page }) => {
    await page.goto('/employees/new');

    // Single file
    await page.getByLabel('Upload CV').setInputFiles('files/cv.pdf');

    // Multiple files
    await page.locator('input[type="file"]').setInputFiles([
      'files/doc1.pdf',
      'files/doc2.pdf'
    ]);

    // Clear files
    await page.locator('input[type="file"]').setInputFiles([]);

    // File from buffer
    await page.locator('input[type="file"]').setInputFiles({
      name: 'test.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('Hello World')
    });
  });

  test('hover and focus', async ({ page }) => {
    await page.goto('/employees');

    // Hover
    await page.getByRole('row').first().hover();
    await expect(page.locator('.action-buttons')).toBeVisible();

    // Focus
    await page.getByLabel('Search').focus();
    await expect(page.getByLabel('Search')).toBeFocused();

    // Blur
    await page.getByLabel('Search').blur();
  });

  test('drag and drop', async ({ page }) => {
    await page.goto('/kanban');

    // Drag and drop
    await page.locator('.card').dragTo(page.locator('.column-done'));

    // Manual drag
    await page.locator('.card').hover();
    await page.mouse.down();
    await page.locator('.column-done').hover();
    await page.mouse.up();
  });
});
```

#### Ngày 2-3: Navigation & Waiting

```typescript
// tests/navigation.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('basic navigation', async ({ page }) => {
    // Go to URL
    await page.goto('https://hr-tool-software.netlify.app');

    // Go to relative URL (uses baseURL from config)
    await page.goto('/login');

    // Wait for navigation options
    await page.goto('/dashboard', {
      waitUntil: 'networkidle'  // Wait until no network requests for 500ms
    });

    // Get current URL
    const url = page.url();
    console.log('Current URL:', url);
  });

  test('wait for URL', async ({ page }) => {
    await page.goto('/login');

    await page.getByLabel('Email').fill('admin@test.com');
    await page.getByLabel('Mật khẩu').fill('password123');
    await page.getByRole('button', { name: 'Đăng nhập' }).click();

    // Wait for URL to change
    await page.waitForURL('**/dashboard');
    // or with regex
    await page.waitForURL(/.*dashboard.*/);
  });

  test('back and forward', async ({ page }) => {
    await page.goto('/employees');
    await page.goto('/departments');

    // Go back
    await page.goBack();
    await expect(page).toHaveURL(/.*employees/);

    // Go forward
    await page.goForward();
    await expect(page).toHaveURL(/.*departments/);

    // Reload
    await page.reload();
  });
});

test.describe('Waiting Strategies', () => {
  test('auto-waiting', async ({ page }) => {
    await page.goto('/employees');

    // Playwright tự động wait cho:
    // - Element visible
    // - Element stable (không animation)
    // - Element enabled
    // - Element receives events
    await page.getByRole('button', { name: 'Thêm' }).click();
  });

  test('wait for element', async ({ page }) => {
    await page.goto('/dashboard');

    // Wait for element to appear
    await page.waitForSelector('.loading', { state: 'hidden' });

    // Wait with different states
    await page.waitForSelector('.data-table', { state: 'visible' });
    await page.waitForSelector('.modal', { state: 'attached' });  // In DOM
    await page.waitForSelector('.toast', { state: 'detached' });  // Removed from DOM
  });

  test('wait for load state', async ({ page }) => {
    // Wait for different load states
    await page.goto('/dashboard');

    // DOM content loaded
    await page.waitForLoadState('domcontentloaded');

    // All resources loaded
    await page.waitForLoadState('load');

    // No network activity for 500ms
    await page.waitForLoadState('networkidle');
  });

  test('wait for network', async ({ page }) => {
    await page.goto('/employees');

    // Wait for specific request
    const requestPromise = page.waitForRequest('**/api/employees');
    await page.getByRole('button', { name: 'Refresh' }).click();
    const request = await requestPromise;
    console.log('Request URL:', request.url());

    // Wait for response
    const responsePromise = page.waitForResponse('**/api/employees');
    await page.getByRole('button', { name: 'Load' }).click();
    const response = await responsePromise;
    console.log('Response status:', response.status());

    // Wait for response with condition
    const dataResponse = page.waitForResponse(
      response => response.url().includes('/api/employees') && response.status() === 200
    );
    await page.click('.refresh');
    await dataResponse;
  });

  test('wait for function', async ({ page }) => {
    await page.goto('/dashboard');

    // Wait for custom condition
    await page.waitForFunction(() => {
      return document.querySelectorAll('.chart').length > 0;
    });

    // With arguments
    await page.waitForFunction(
      (expectedCount) => document.querySelectorAll('.item').length >= expectedCount,
      5  // argument
    );
  });

  test('explicit timeout', async ({ page }) => {
    await page.goto('/slow-page');

    // Custom timeout for specific action
    await page.getByRole('button').click({ timeout: 60000 });

    // Custom timeout for assertion
    await expect(page.locator('.data')).toBeVisible({ timeout: 30000 });
  });
});
```

#### Ngày 4: Debugging

```typescript
// tests/debugging.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Debugging Techniques', () => {
  test('using pause', async ({ page }) => {
    await page.goto('/login');

    // Pause execution - opens Playwright Inspector
    await page.pause();
    // In Inspector:
    // - Step through code
    // - Explore selectors
    // - Record actions

    await page.getByLabel('Email').fill('test@example.com');
  });

  test('console logging', async ({ page }) => {
    await page.goto('/employees');

    // Log page URL
    console.log('Current URL:', page.url());

    // Log element text
    const title = await page.locator('.title').textContent();
    console.log('Page title:', title);

    // Log element count
    const rowCount = await page.getByRole('row').count();
    console.log('Row count:', rowCount);

    // Log inner HTML
    const html = await page.locator('.content').innerHTML();
    console.log('HTML:', html);
  });

  test('screenshots', async ({ page }) => {
    await page.goto('/dashboard');

    // Full page screenshot
    await page.screenshot({ path: 'screenshots/dashboard-full.png', fullPage: true });

    // Viewport only
    await page.screenshot({ path: 'screenshots/dashboard-viewport.png' });

    // Element screenshot
    await page.locator('.chart').screenshot({ path: 'screenshots/chart.png' });
  });

  test('video recording', async ({ browser }) => {
    // Video is configured in playwright.config.ts
    // use: { video: 'on' }

    // Or create context with video
    const context = await browser.newContext({
      recordVideo: { dir: 'videos/' }
    });
    const page = await context.newPage();

    await page.goto('/login');
    await page.getByLabel('Email').fill('test@example.com');

    // Close context to save video
    await context.close();
  });

  test('browser console logs', async ({ page }) => {
    // Listen to console events
    page.on('console', msg => {
      console.log(`Browser console [${msg.type()}]: ${msg.text()}`);
    });

    // Listen to errors
    page.on('pageerror', error => {
      console.error('Page error:', error.message);
    });

    await page.goto('/dashboard');
  });

  test('network logging', async ({ page }) => {
    // Log all requests
    page.on('request', request => {
      console.log('Request:', request.method(), request.url());
    });

    // Log all responses
    page.on('response', response => {
      console.log('Response:', response.status(), response.url());
    });

    await page.goto('/employees');
  });
});
```

**Commands hữu ích:**
```bash
# Debug mode (opens Inspector)
npx playwright test --debug

# Debug specific test
npx playwright test --debug -g "login"

# Record trace
npx playwright test --trace on

# View trace
npx playwright show-trace trace.zip

# UI mode (recommended for development)
npx playwright test --ui

# Headed mode (see browser)
npx playwright test --headed

# Slow motion
npx playwright test --headed --slow-mo=1000
```

#### Ngày 5: Configuration

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // Test directory
  testDir: './tests',

  // Test file pattern
  testMatch: '**/*.spec.ts',

  // Run tests in parallel
  fullyParallel: true,

  // Fail build on CI if test.only left in code
  forbidOnly: !!process.env.CI,

  // Retry failed tests
  retries: process.env.CI ? 2 : 0,

  // Number of parallel workers
  workers: process.env.CI ? 1 : undefined,

  // Reporter
  reporter: [
    ['html'],               // HTML report
    ['list'],               // Console output
    ['junit', { outputFile: 'results.xml' }]  // For CI
  ],

  // Shared settings for all projects
  use: {
    // Base URL
    baseURL: 'https://hr-tool-software.netlify.app',

    // Trace on first retry
    trace: 'on-first-retry',

    // Screenshot on failure
    screenshot: 'only-on-failure',

    // Video on failure
    video: 'retain-on-failure',

    // Viewport
    viewport: { width: 1280, height: 720 },

    // Default timeout for actions
    actionTimeout: 10000,

    // Default timeout for navigation
    navigationTimeout: 30000,
  },

  // Test timeout
  timeout: 60000,

  // Assertion timeout
  expect: {
    timeout: 10000,
  },

  // Projects for different browsers/devices
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 13'] },
    },
  ],

  // Web server to run before tests
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:4200',
    reuseExistingServer: !process.env.CI,
  },
});
```

**Bài tập cuối Tuần 2:**
- [ ] Viết test tạo Employee mới
- [ ] Viết test flow: Login -> Navigate -> Logout
- [ ] Debug test thất bại với Inspector

---

## Phase 2: Nâng cao (Tuần 3-4)

### Tuần 3: Page Object Model & Fixtures

#### Page Object Model (POM)

**Tại sao cần POM?**

```
❌ KHÔNG CÓ POM (Code lặp lại, khó maintain):

test('login success', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Email').fill('admin@test.com');
  await page.getByLabel('Mật khẩu').fill('password123');
  await page.getByRole('button', { name: 'Đăng nhập' }).click();
});

test('login failure', async ({ page }) => {
  await page.goto('/login');  // Duplicate
  await page.getByLabel('Email').fill('wrong@test.com');  // Duplicate locator
  await page.getByLabel('Mật khẩu').fill('wrong');        // Duplicate locator
  await page.getByRole('button', { name: 'Đăng nhập' }).click();  // Duplicate
});

// Nếu UI thay đổi (label "Email" -> "Email address")
// => Phải sửa tất cả tests!

✅ CÓ POM (Reusable, dễ maintain):

test('login success', async ({ loginPage }) => {
  await loginPage.goto();
  await loginPage.login('admin@test.com', 'password123');
});

test('login failure', async ({ loginPage }) => {
  await loginPage.goto();
  await loginPage.login('wrong@test.com', 'wrong');
});

// Nếu UI thay đổi
// => Chỉ sửa LoginPage class 1 lần!
```

**Cấu trúc thư mục với POM:**
```
tests/
├── pages/                    # Page Objects
│   ├── LoginPage.ts
│   ├── DashboardPage.ts
│   ├── EmployeeListPage.ts
│   └── EmployeeFormPage.ts
├── fixtures/                 # Custom fixtures
│   └── auth.fixture.ts
├── auth/                     # Auth tests
│   └── login.spec.ts
├── employees/                # Employee tests
│   ├── list.spec.ts
│   └── crud.spec.ts
└── smoke/                    # Smoke tests
    └── smoke.spec.ts
```

**Page Objects:**

```typescript
// pages/LoginPage.ts
import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  // Page instance
  readonly page: Page;

  // Locators (defined once)
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly forgotPasswordLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByLabel('Email');
    this.passwordInput = page.getByLabel(/mật khẩu/i);
    this.loginButton = page.getByRole('button', { name: /đăng nhập/i });
    this.errorMessage = page.locator('.error-message');
    this.forgotPasswordLink = page.getByRole('link', { name: /quên mật khẩu/i });
  }

  // Actions
  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async clickForgotPassword() {
    await this.forgotPasswordLink.click();
  }

  // Assertions
  async expectError(message: string | RegExp) {
    await expect(this.errorMessage).toContainText(message);
  }

  async expectFormVisible() {
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.loginButton).toBeVisible();
  }
}
```

```typescript
// pages/DashboardPage.ts
import { Page, Locator, expect } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;
  readonly welcomeMessage: Locator;
  readonly statsCards: Locator;
  readonly sidebar: Locator;
  readonly userMenu: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.welcomeMessage = page.locator('.welcome-message');
    this.statsCards = page.locator('.stat-card');
    this.sidebar = page.locator('nav[aria-label="sidebar"]');
    this.userMenu = page.getByRole('button', { name: /avatar/i });
    this.logoutButton = page.getByRole('menuitem', { name: /đăng xuất/i });
  }

  async navigateTo(menuItem: string) {
    await this.sidebar.getByRole('link', { name: menuItem }).click();
  }

  async logout() {
    await this.userMenu.click();
    await this.logoutButton.click();
  }

  async getStatValue(statName: string): Promise<string> {
    const card = this.statsCards.filter({ hasText: statName });
    return await card.locator('.value').textContent() || '0';
  }

  async expectLoaded() {
    await expect(this.page).toHaveURL(/.*dashboard/);
    await expect(this.statsCards.first()).toBeVisible();
  }
}
```

```typescript
// pages/EmployeeListPage.ts
import { Page, Locator, expect } from '@playwright/test';

export class EmployeeListPage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly departmentFilter: Locator;
  readonly statusFilter: Locator;
  readonly addButton: Locator;
  readonly table: Locator;
  readonly rows: Locator;
  readonly pagination: Locator;
  readonly emptyState: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.getByPlaceholder(/tìm kiếm/i);
    this.departmentFilter = page.getByLabel(/phòng ban/i);
    this.statusFilter = page.getByLabel(/trạng thái/i);
    this.addButton = page.getByRole('button', { name: /thêm/i });
    this.table = page.getByRole('table');
    this.rows = this.table.locator('tbody tr');
    this.pagination = page.locator('.pagination');
    this.emptyState = page.getByText(/không có dữ liệu/i);
  }

  async goto() {
    await this.page.goto('/employees');
  }

  async search(keyword: string) {
    await this.searchInput.fill(keyword);
    await this.searchInput.press('Enter');
    await this.page.waitForLoadState('networkidle');
  }

  async filterByDepartment(department: string) {
    await this.departmentFilter.selectOption({ label: department });
    await this.page.waitForLoadState('networkidle');
  }

  async filterByStatus(status: string) {
    await this.statusFilter.selectOption({ label: status });
    await this.page.waitForLoadState('networkidle');
  }

  async clickAdd() {
    await this.addButton.click();
  }

  async clickRow(name: string) {
    await this.rows.filter({ hasText: name }).click();
  }

  async clickEditButton(name: string) {
    const row = this.rows.filter({ hasText: name });
    await row.getByRole('button', { name: /sửa/i }).click();
  }

  async clickDeleteButton(name: string) {
    const row = this.rows.filter({ hasText: name });
    await row.getByRole('button', { name: /xóa/i }).click();
  }

  async goToPage(pageNumber: number) {
    await this.pagination.getByRole('button', { name: String(pageNumber) }).click();
  }

  async expectRowCount(count: number) {
    await expect(this.rows).toHaveCount(count);
  }

  async expectEmpty() {
    await expect(this.emptyState).toBeVisible();
  }

  async expectRowVisible(name: string) {
    await expect(this.rows.filter({ hasText: name })).toBeVisible();
  }
}
```

#### Fixtures

```typescript
// fixtures/auth.fixture.ts
import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { EmployeeListPage } from '../pages/EmployeeListPage';

// Define fixture types
type AuthFixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  employeeListPage: EmployeeListPage;
  authenticatedPage: void;
};

// Extend base test with fixtures
export const test = base.extend<AuthFixtures>({
  // Page object fixtures
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  dashboardPage: async ({ page }, use) => {
    const dashboardPage = new DashboardPage(page);
    await use(dashboardPage);
  },

  employeeListPage: async ({ page }, use) => {
    const employeeListPage = new EmployeeListPage(page);
    await use(employeeListPage);
  },

  // Auto-login fixture
  authenticatedPage: async ({ page }, use) => {
    // Login before test
    await page.goto('/login');
    await page.getByLabel('Email').fill('admin@test.com');
    await page.getByLabel(/mật khẩu/i).fill('password123');
    await page.getByRole('button', { name: /đăng nhập/i }).click();
    await page.waitForURL('**/dashboard');

    // Run test
    await use();

    // Cleanup after test (optional)
    // await page.goto('/logout');
  },
});

export { expect } from '@playwright/test';
```

**Sử dụng trong tests:**

```typescript
// tests/auth/login.spec.ts
import { test, expect } from '../../fixtures/auth.fixture';

test.describe('Authentication', () => {
  test('AUTH-01: Login với credentials hợp lệ', async ({ loginPage, dashboardPage }) => {
    await loginPage.goto();
    await loginPage.login('admin@test.com', 'password123');
    await dashboardPage.expectLoaded();
  });

  test('AUTH-02: Login với email sai', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login('wrong@email.com', 'password123');
    await loginPage.expectError(/không đúng/i);
  });

  test('AUTH-03: Login với password sai', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login('admin@test.com', 'wrongpassword');
    await loginPage.expectError(/không đúng/i);
  });

  test('AUTH-09: Logout thành công', async ({
    authenticatedPage,
    dashboardPage,
    loginPage,
    page
  }) => {
    // Already logged in via authenticatedPage fixture
    await dashboardPage.logout();
    await loginPage.expectFormVisible();
  });
});
```

```typescript
// tests/employees/list.spec.ts
import { test, expect } from '../../fixtures/auth.fixture';

test.describe('Employee List', () => {
  // Auto-login trước mỗi test
  test.beforeEach(async ({ authenticatedPage, employeeListPage }) => {
    await employeeListPage.goto();
  });

  test('EMP-01: View employee list', async ({ employeeListPage }) => {
    await employeeListPage.expectRowCount(10);
  });

  test('EMP-02: Search by name', async ({ employeeListPage }) => {
    await employeeListPage.search('Nguyễn');
    await employeeListPage.expectRowVisible('Nguyễn');
  });

  test('EMP-03: Filter by department', async ({ employeeListPage }) => {
    await employeeListPage.filterByDepartment('Engineering');
    // Assert only Engineering employees shown
  });
});
```

#### Storage State (Tái sử dụng login session)

```typescript
// auth.setup.ts
import { test as setup } from '@playwright/test';
import path from 'path';

const authFile = path.join(__dirname, '.auth/user.json');

setup('authenticate', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Email').fill('admin@test.com');
  await page.getByLabel(/mật khẩu/i).fill('password123');
  await page.getByRole('button', { name: /đăng nhập/i }).click();

  await page.waitForURL('**/dashboard');

  // Save storage state (cookies, localStorage)
  await page.context().storageState({ path: authFile });
});
```

```typescript
// playwright.config.ts
export default defineConfig({
  projects: [
    // Setup project - runs first
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },

    // Main tests - depend on setup
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: '.auth/user.json',  // Use saved auth
      },
      dependencies: ['setup'],
    },
  ],
});
```

**Bài tập cuối Tuần 3:**
- [ ] Tạo Page Objects cho: LoginPage, DashboardPage, EmployeeListPage
- [ ] Tạo auth fixture để reuse login state
- [ ] Refactor existing tests để sử dụng POM

---

### Tuần 4: API Testing & CI/CD

#### API Testing với Playwright

```typescript
// tests/api/auth.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Auth API', () => {
  test('login success', async ({ request }) => {
    const response = await request.post('/trpc/auth.login', {
      data: {
        json: {
          email: 'admin@test.com',
          password: 'password123'
        }
      }
    });

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.result.data.json).toHaveProperty('accessToken');
    expect(body.result.data.json).toHaveProperty('user');
    expect(body.result.data.json.user).toHaveProperty('email', 'admin@test.com');
  });

  test('login failure', async ({ request }) => {
    const response = await request.post('/trpc/auth.login', {
      data: {
        json: {
          email: 'wrong@email.com',
          password: 'wrongpassword'
        }
      }
    });

    expect(response.ok()).toBeFalsy();
    expect(response.status()).toBe(401);
  });
});
```

```typescript
// tests/api/employee.spec.ts
import { test, expect } from '@playwright/test';

let authToken: string;

test.beforeAll(async ({ request }) => {
  // Login to get token
  const loginResponse = await request.post('/trpc/auth.login', {
    data: {
      json: {
        email: 'admin@test.com',
        password: 'password123'
      }
    }
  });

  const loginData = await loginResponse.json();
  authToken = loginData.result.data.json.accessToken;
});

test.describe('Employee API', () => {
  test('list employees', async ({ request }) => {
    const response = await request.post('/trpc/employee.list', {
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
      data: {
        json: {
          page: 1,
          limit: 10
        }
      }
    });

    expect(response.ok()).toBeTruthy();

    const body = await response.json();
    expect(body.result.data.json).toHaveProperty('items');
    expect(body.result.data.json).toHaveProperty('total');
    expect(Array.isArray(body.result.data.json.items)).toBeTruthy();
  });

  test('create employee', async ({ request }) => {
    const response = await request.post('/trpc/employee.create', {
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
      data: {
        json: {
          name: '[TEST] Automation Employee',
          email: `test-${Date.now()}@example.com`,
          employeeCode: `EMP-${Date.now()}`,
          departmentId: 'valid-department-id',
          positionId: 'valid-position-id',
          joinDate: new Date().toISOString(),
          contractType: 'full_time'
        }
      }
    });

    expect(response.ok()).toBeTruthy();

    const body = await response.json();
    expect(body.result.data.json).toHaveProperty('id');
  });
});
```

#### Network Mocking

```typescript
// tests/mocking.spec.ts
import { test, expect } from '@playwright/test';

test('mock API response', async ({ page }) => {
  // Mock employee list
  await page.route('**/trpc/employee.list*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        result: {
          data: {
            json: {
              items: [
                { id: '1', name: 'Mock Employee 1', email: 'mock1@test.com' },
                { id: '2', name: 'Mock Employee 2', email: 'mock2@test.com' },
              ],
              total: 2,
              page: 1,
              limit: 10
            }
          }
        }
      })
    });
  });

  await page.goto('/employees');
  await expect(page.getByText('Mock Employee 1')).toBeVisible();
  await expect(page.getByText('Mock Employee 2')).toBeVisible();
});

test('mock error response', async ({ page }) => {
  await page.route('**/trpc/employee.list*', async (route) => {
    await route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({
        error: { message: 'Internal Server Error' }
      })
    });
  });

  await page.goto('/employees');
  await expect(page.getByText(/lỗi/i)).toBeVisible();
});

test('modify response', async ({ page }) => {
  await page.route('**/trpc/employee.list*', async (route) => {
    // Get original response
    const response = await route.fetch();
    const json = await response.json();

    // Modify response
    json.result.data.json.items = json.result.data.json.items.map((item: any) => ({
      ...item,
      name: '[MODIFIED] ' + item.name
    }));

    // Return modified response
    await route.fulfill({ json });
  });

  await page.goto('/employees');
});
```

#### CI/CD với GitHub Actions

```yaml
# .github/workflows/playwright.yml
name: Playwright Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]
  schedule:
    # Run daily at 6 AM UTC
    - cron: '0 6 * * *'

jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright Browsers
        run: npx playwright install --with-deps

      - name: Run Playwright tests
        run: npx playwright test
        env:
          BASE_URL: https://hr-tool-software.netlify.app

      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30

      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: test-results
          path: test-results/
          retention-days: 7
```

**Bài tập cuối Tuần 4:**
- [ ] Viết API tests cho auth.login, employee.list
- [ ] Setup GitHub Actions workflow
- [ ] Tạo mock cho error scenarios

---

## Phase 3: Thực hành với HR Tool (Tuần 5-6)

### Tuần 5: Automation Manual Test Cases

Tham khảo [Test Cases by Module](/vi/practice/04-test-cases-by-module) để xác định test cases cần automate.

**Test cases ưu tiên:**
- Authentication: AUTH-01 → AUTH-10
- Employee: EMP-01 → EMP-19
- Smoke tests

### Tuần 6: Smoke Test & Integration

Tham khảo [Smoke Test Checklist](/vi/practice/03-smoke-test-checklist) để viết smoke test automation.

---

## Tài nguyên học tập

### Official Documentation

| Tài liệu | Link | Mô tả |
|----------|------|-------|
| **Getting Started** | [playwright.dev/docs/intro](https://playwright.dev/docs/intro) | Bắt đầu từ đây |
| **Best Practices** | [playwright.dev/docs/best-practices](https://playwright.dev/docs/best-practices) | Các best practices |
| **API Reference** | [playwright.dev/docs/api](https://playwright.dev/docs/api/class-playwright) | API đầy đủ |
| **Locators** | [playwright.dev/docs/locators](https://playwright.dev/docs/locators) | Hướng dẫn locators |
| **Assertions** | [playwright.dev/docs/test-assertions](https://playwright.dev/docs/test-assertions) | Assertions guide |

### Video Courses

| Course | Link | Mô tả |
|--------|------|-------|
| **Playwright Full Course** | [YouTube](https://www.youtube.com/playlist?list=PLUeDIlio4THEXmQxNvKmdDxAVloGTHXMr) | Course đầy đủ |
| **Test Automation University** | [TAU](https://testautomationu.applitools.com/playwright-intro/) | Free course |

---

## Checklist hoàn thành

### Phase 1
- [ ] Cài đặt Playwright thành công
- [ ] Viết được 5+ test cases cơ bản
- [ ] Hiểu locators và assertions
- [ ] Debug được test thất bại

### Phase 2
- [ ] Tạo được Page Object Model
- [ ] Setup authentication fixture
- [ ] Viết được API tests
- [ ] Hiểu CI/CD integration

### Phase 3
- [ ] Automate 20+ test cases cho HR Tool
- [ ] Setup CI/CD pipeline
- [ ] Viết documentation
- [ ] Demo cho team

---

## Tips

1. **Đừng skip Phase 0 & 1** - Nền tảng vững chắc rất quan trọng
2. **Thực hành mỗi ngày** - 1-2 giờ/ngày tốt hơn 8 giờ cuối tuần
3. **Đọc official docs trước** - YouTube/Blog sau
4. **Hỏi khi stuck** - Đừng mất quá 30 phút cho 1 vấn đề
5. **Commit code hàng ngày** - Track progress, backup work

---

**Mentor:** Tech Lead | **Support:** Slack #qc-automation
