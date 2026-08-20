---
title: Authentication & Storage State
description: Cách tránh login lại ở mỗi test bằng storageState, và cách quản lý nhiều role đăng nhập khác nhau
---

# Automation Testing - Authentication & Storage State

Tài liệu đào tạo QC - HR Tool

## Mục lục

1. [Vấn đề: login lại ở mỗi test rất chậm](#1-vấn-đề-login-lại-ở-mỗi-test-rất-chậm)
2. [Storage State là gì](#2-storage-state-là-gì)
3. [Ví dụ thật: auth.setup.ts của HR Tool](#3-ví-dụ-thật-authsetupts-của-hr-tool)
4. [Cấu hình để setup chạy trước các test khác](#4-cấu-hình-để-setup-chạy-trước-các-test-khác)
5. [Dùng storageState đã lưu trong test](#5-dùng-storagestate-đã-lưu-trong-test)
6. [Multi-role: 3 role đăng nhập của HR Tool](#6-multi-role-3-role-đăng-nhập-của-hr-tool)
7. [Storage State hết hạn thì sao](#7-storage-state-hết-hạn-thì-sao)
8. [Bài tập thực hành](#8-bài-tập-thực-hành)
9. [Bước tiếp theo](#9-bước-tiếp-theo)

---

## 1. Vấn đề: login lại ở mỗi test rất chậm

Nếu bạn có 200 test case và mỗi test đều bắt đầu bằng:

```typescript
await page.goto('/login');
await page.getByLabel('Email').fill('...');
await page.getByLabel('Password').fill('...');
await page.getByRole('button', { name: 'Đăng nhập' }).click();
await page.waitForURL('/dashboard');
```

Thì bạn đang tốn thêm vài giây × 200 lần chỉ để login — chưa kể nếu trang login load chậm hoặc có captcha, cả bộ test sẽ chạy rất lâu và dễ flaky (không ổn định). Playwright có giải pháp: **đăng nhập một lần, lưu lại trạng thái, dùng lại nhiều lần.**

## 2. Storage State là gì

Khi bạn đăng nhập vào một web app, trình duyệt lưu lại trạng thái đăng nhập dưới dạng **cookies** và **localStorage**. `storageState` là một tính năng của Playwright cho phép:

1. **Lưu** cookies + localStorage hiện tại của trang ra một file JSON.
2. **Nạp lại** file JSON đó vào một browser context mới — browser context đó sẽ "đã đăng nhập" ngay từ đầu, không cần thao tác gì.

```
[Chạy 1 lần] Login thật → lưu storageState → file .auth/user.json
                                    │
                                    ▼
[Chạy N lần] Test khác → nạp .auth/user.json → đã đăng nhập, chạy thẳng vào test
```

## 3. Ví dụ thật: auth.setup.ts của HR Tool

HR Tool định nghĩa việc đăng nhập như một **setup project** riêng (`apps/e2e/tests/auth/auth.setup.ts`):

```typescript
import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login.page';

const authFile = 'apps/e2e/.auth/user.json';

setup('authenticate', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.loginWithEnv(); // login bằng credential lấy từ biến môi trường

  await page.waitForTimeout(2000);

  // Chờ dấu hiệu chắc chắn đã login thành công
  await expect(page.locator('text=/xin chào/i').first()).toBeVisible({
    timeout: 15000,
  });

  // Lưu cookies + localStorage ra file
  await page.context().storageState({ path: authFile });
});
```

Vài điểm quan trọng:

- `test as setup`: đây không phải một test case thông thường, mà là một **setup script** — chạy 1 lần trước khi các test khác bắt đầu.
- `loginWithEnv()`: login bằng credential lấy từ biến môi trường (`process.env`), không hardcode trong file này.
- `await expect(...).toBeVisible(...)`: chờ đến khi thấy dấu hiệu **chắc chắn** đã đăng nhập thành công (ví dụ dòng chữ chào mừng), không chỉ dựa vào việc URL đổi (URL có thể đổi trước khi trang thực sự load xong).
- `page.context().storageState({ path: authFile })`: đây là dòng lệnh chính — lưu toàn bộ cookie + localStorage của context hiện tại ra file `apps/e2e/.auth/user.json`.

## 4. Cấu hình để setup chạy trước các test khác

Để Playwright biết `auth.setup.ts` phải chạy **trước**, `playwright.config.ts` khai báo project dạng phụ thuộc (`dependencies`):

```typescript
export default defineConfig({
  projects: [
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },
    {
      name: 'chromium',
      use: {
        storageState: 'apps/e2e/.auth/user.json',
      },
      dependencies: ['setup'], // chạy sau project "setup"
    },
  ],
});
```

`dependencies: ['setup']` đảm bảo mọi test trong project `chromium` chỉ chạy **sau khi** project `setup` (chứa `auth.setup.ts`) đã chạy xong và tạo ra file storageState.

## 5. Dùng storageState đã lưu trong test

Có 2 cách dùng storageState đã lưu:

**Cách 1 — khai báo mặc định cho cả project** (như ví dụ ở mục 4, `use: { storageState: '...' }`): mọi test trong project đó tự động "đã đăng nhập".

**Cách 2 — khai báo riêng cho 1 file test** bằng `test.use()`:

```typescript
import { test } from '@playwright/test';

test.use({ storageState: 'apps/e2e/.auth/ctv.json' });

test('CTV xem danh sách ứng viên đã giới thiệu', async ({ page }) => {
  // Vào thẳng trang, không cần login lại
  await page.goto('/ctv/candidates');
});
```

## 6. Multi-role: 3 role đăng nhập của HR Tool

Vì HR Tool có nhiều role với quyền khác nhau, team tạo **3 file setup riêng**, mỗi file ứng với 1 role:

| File setup | Role | File storageState lưu ra |
|---|---|---|
| `auth.setup.ts` | User thường / Admin | `.auth/user.json` |
| `ctv.setup.ts` | CTV (Cộng tác viên / Referral) | `.auth/ctv.json` |
| `hr-headhunt.setup.ts` | HR ở công ty Headhunt mode | `.auth/hr-headhunt.json` |

Nhờ vậy, một test cần kiểm tra tính năng chỉ CTV mới thấy được sẽ dùng `.auth/ctv.json`, còn test kiểm tra tính năng Admin sẽ dùng `.auth/user.json` — mỗi file test tự chọn đúng "vai" cần đóng, không cần biết chi tiết quy trình login của vai đó.

:::tip[Vì sao tách riêng theo role mà không dùng chung 1 file?]
Nếu chỉ có 1 storageState chung, bạn không thể test được các tình huống liên quan tới **phân quyền** (ví dụ: CTV không được thấy nút "Xoá Job", chỉ Admin mới thấy). Có storageState riêng theo role giúp test permission chính xác, đúng góc nhìn của từng loại user.
:::

## 7. Storage State hết hạn thì sao

Token đăng nhập (JWT) thường có thời hạn (ví dụ access token 7 ngày, refresh token 30 ngày). Nếu bạn chạy test sau khi storageState đã hết hạn, các test sẽ fail đồng loạt với lỗi "unauthorized" hoặc bị redirect về trang login. Cách xử lý:

- Chạy lại project `setup` (tức chạy lại `auth.setup.ts`) để tạo storageState mới trước mỗi lần chạy full suite — đây là cách phổ biến nhất, thường được cấu hình tự động trong CI.
- Không commit file `.auth/*.json` vào git (thường được thêm vào `.gitignore`) vì nó chứa token thật, có thời hạn và mang tính nhạy cảm.

## 8. Bài tập thực hành

1. Vẽ lại sơ đồ ở mục 2 nhưng cho trường hợp cụ thể: role CTV, tên file setup, tên file storageState.
2. Giải thích: nếu bỏ dòng `await expect(page.locator('text=/xin chào/i')...).toBeVisible()` trong `auth.setup.ts` và chỉ dựa vào `waitForTimeout(2000)`, điều gì có thể xảy ra nếu server phản hồi chậm hơn 2 giây?
3. Viết cấu hình `dependencies` cho một project mới tên `firefox` cũng cần chạy sau `setup`.
4. Theo bạn, vì sao file `.auth/*.json` không nên commit lên git? Nêu 2 lý do.
5. Nếu một test cần kiểm tra "user chưa đăng nhập bị redirect về trang login", test đó có nên dùng storageState đã lưu không? Giải thích.

## 9. Bước tiếp theo

1. Tiếp tục với [Data-driven Testing](./11-data-driven-testing/) — cách viết 1 đoạn code chạy được nhiều bộ dữ liệu khác nhau.
2. Xem lại [Fixtures & Test Data](./09-fixtures-test-data/) nếu cần ôn lại cách tổ chức test data theo role.

---

**Cần giúp đỡ?** Liên hệ QC Lead hoặc đăng trong #qc-team.
