---
title: "Playwright 101: Cài đặt & Cấu trúc Project"
description: Playwright là gì, mô hình Browser/Context/Page, cài đặt project, viết và chạy test đầu tiên, cấu hình playwright.config.ts
---

# Playwright 101: Cài đặt & Cấu trúc Project

Tài liệu đào tạo QC - HR Tool

**Phiên bản:** 1.0
**Cập nhật:** 20/08/2026
**Tác giả:** QC Team

---

## Mục lục

1. [Playwright là gì?](#1-playwright-là-gì)
2. [Mô hình Browser → Context → Page](#2-mô-hình-browser--context--page)
3. [Test Isolation](#3-test-isolation)
4. [Cài đặt project](#4-cài-đặt-project)
5. [Viết test đầu tiên](#5-viết-test-đầu-tiên)
6. [Chạy test](#6-chạy-test)
7. [playwright.config.ts](#7-playwrightconfigts)
8. [So sánh Playwright với các tool khác](#8-so-sánh-playwright-với-các-tool-khác)
9. [Bài tập thực hành](#9-bài-tập-thực-hành)

---

## 1. Playwright là gì?

**Playwright** là framework automation testing mã nguồn mở của Microsoft, dùng để test web application bằng cách điều khiển browser thật.

**Đặc điểm nổi bật:**
- **Cross-browser**: hỗ trợ Chromium (Chrome/Edge), Firefox, WebKit (engine của Safari)
- **Cross-platform**: Windows, macOS, Linux
- **Cross-language**: TypeScript/JavaScript, Python, Java, .NET (tài liệu này dùng TypeScript, khớp với stack HR Tool)
- **Auto-waiting**: tự động đợi element sẵn sàng trước khi thao tác (xem bài [Actions, Interactions & Waiting](../automation/06-actions-interactions-waiting/))
- **Reliable**: ít flaky test hơn các tool đời trước như Selenium

## 2. Mô hình Browser → Context → Page

```
BROWSER (1 instance trình duyệt)
 ├── CONTEXT 1 (1 session độc lập — cookie/localStorage riêng)
 │    ├── PAGE 1 (1 tab)
 │    └── PAGE 2 (1 tab khác, cùng session)
 └── CONTEXT 2 (session độc lập khác — không share cookie với Context 1)
      └── PAGE 1
```

| Khái niệm | Mô tả | Ví dụ thực tế |
|-----------|-------|---------------|
| **Browser** | Một instance trình duyệt | Một cửa sổ Chrome |
| **Context** | Một session độc lập (cookie, localStorage riêng) | Một người dùng đăng nhập |
| **Page** | Một tab trong context | Một tab trên trình duyệt |

```typescript
test('mỗi test có 1 page trong 1 context riêng', async ({ page }) => {
  // page đã được Playwright tự tạo trong 1 context mới, isolated với mọi test khác
  await page.goto('/login');
});

test('mô phỏng 2 user cùng lúc (ví dụ Admin và HR)', async ({ browser }) => {
  const adminContext = await browser.newContext();
  const hrContext = await browser.newContext();
  const adminPage = await adminContext.newPage();
  const hrPage = await hrContext.newPage();
  // 2 context độc lập — không share cookie, mô phỏng đúng 2 người dùng khác nhau
});
```

## 3. Test Isolation

Mỗi test Playwright chạy trong **context riêng biệt hoàn toàn**: cookie mới, localStorage mới, sessionStorage mới. Điều này có nghĩa:

- Test không ảnh hưởng lẫn nhau — test A fail không kéo test B fail theo.
- Test có thể chạy **song song** (parallel) an toàn.
- Thứ tự chạy test không quan trọng.

:::tip[Vì sao điều này quan trọng khi viết test cho HR Tool]
Vì mỗi test có session riêng, bạn **không thể** giả định rằng "test trước đã login rồi nên test này không cần login nữa". Mỗi test (hoặc mỗi file test, nếu dùng `storageState` — xem bài [Authentication & Storage State](../automation/10-authentication-storage-state/)) phải tự thiết lập trạng thái ban đầu nó cần.
:::

## 4. Cài đặt project

**Yêu cầu:** Node.js 18+ (khuyến nghị bản LTS mới nhất), VS Code, Git.

```bash
mkdir hr-tool-automation && cd hr-tool-automation
npm init playwright@latest

# CLI sẽ hỏi, chọn:
# ✔ TypeScript
# ✔ tests folder tên "tests"
# ✔ GitHub Actions workflow: Yes
# ✔ Install browsers: Yes
```

**Cấu trúc project sau khi cài:**

```
hr-tool-automation/
├── tests/
│   └── example.spec.ts
├── playwright.config.ts
├── package.json
└── .github/workflows/playwright.yml
```

**VS Code extension khuyến nghị:** "Playwright Test for VSCode" (Microsoft) — cho phép chạy/debug từng test ngay trong editor.

## 5. Viết test đầu tiên

```typescript
// tests/example.spec.ts
import { test, expect } from '@playwright/test';

test('trang login hiển thị đúng', async ({ page }) => {
  await page.goto('/login');
  await expect(page.getByLabel('Email')).toBeVisible();
  await expect(page.getByRole('button', { name: /đăng nhập/i })).toBeVisible();
});

// Nhóm nhiều test liên quan bằng describe
test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login'); // chạy trước MỖI test trong nhóm này
  });

  test('hiển thị lỗi khi sai mật khẩu', async ({ page }) => {
    await page.getByLabel('Email').fill('[TEST_EMAIL]');
    await page.getByLabel(/mật khẩu/i).fill('sai-mat-khau');
    await page.getByRole('button', { name: /đăng nhập/i }).click();

    await expect(page.getByText(/không đúng/i)).toBeVisible();
  });
});
```

## 6. Chạy test

```bash
npx playwright test                      # chạy toàn bộ test, headless
npx playwright test --ui                 # UI Mode — khuyến nghị khi đang viết test
npx playwright test tests/auth/login.spec.ts  # chạy 1 file cụ thể
npx playwright test --headed             # chạy với browser hiển thị (xem trực tiếp)
npx playwright test --debug              # chạy debug, dừng ở từng bước
npx playwright show-report               # xem báo cáo HTML sau khi chạy
```

## 7. playwright.config.ts

File cấu hình trung tâm cho toàn bộ project test:

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,                        // chạy test song song
  forbidOnly: !!process.env.CI,                // fail CI nếu còn sót test.only
  retries: process.env.CI ? 2 : 0,             // tự retry khi chạy trên CI
  reporter: [['html'], ['list']],

  use: {
    baseURL: 'https://hr-tool-software.netlify.app', // dùng path tương đối: page.goto('/login')
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  timeout: 60_000,
  expect: { timeout: 10_000 },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
```

| Field | Ý nghĩa |
|-------|---------|
| `testDir` | Thư mục chứa file test |
| `fullyParallel` | Cho phép chạy nhiều test cùng lúc để nhanh hơn |
| `use.baseURL` | URL gốc — cho phép viết `page.goto('/login')` thay vì URL đầy đủ |
| `use.trace` | Khi nào ghi lại trace để debug (xem bài [Debug](../automation/18-debug-trace-viewer-codegen/)) |
| `projects` | Chạy cùng bộ test trên nhiều browser/device khác nhau |
| `retries` | Số lần tự chạy lại một test fail (hữu ích khi test flaky trên CI) |

## 8. So sánh Playwright với các tool khác

| Tiêu chí | Playwright | Cypress | Selenium |
|----------|------------|---------|----------|
| Đa trình duyệt | Chromium, Firefox, WebKit | WebKit hạn chế | Tất cả (qua driver riêng) |
| Auto-waiting | Có sẵn | Có sẵn | Phải tự viết wait |
| Chạy song song | Hỗ trợ sẵn | Cần Cloud (trả phí) | Cần setup Grid |
| Test nhiều tab/window | Dễ | Khó | Dễ |
| API testing tích hợp | Có | Có | Không |
| Tốc độ | Rất nhanh | Nhanh | Chậm hơn |

## 9. Bài tập thực hành

1. Cài đặt một project Playwright mới theo hướng dẫn ở mục 4, chạy thử `npx playwright test` với test mẫu do CLI tự tạo.
2. Sửa `baseURL` trong `playwright.config.ts` thành URL staging của HR Tool, viết 1 test đơn giản kiểm tra trang `/login` hiển thị đúng title.
3. Giải thích bằng lời sự khác nhau giữa `Browser`, `Context`, và `Page` — cho ví dụ khi nào bạn cần tạo nhiều `Context` trong 1 test.
4. Chạy cùng 1 test bằng `--headed` và `--debug`, mô tả sự khác nhau bạn quan sát được.

## Bước tiếp theo

Tiếp theo: [Locators & Selectors](../automation/05-locators-selectors/) — cách "chỉ" cho Playwright biết phải thao tác vào element nào trên trang.

---

**Cần giúp đỡ?** Liên hệ QC Lead hoặc đăng trong #qc-team
