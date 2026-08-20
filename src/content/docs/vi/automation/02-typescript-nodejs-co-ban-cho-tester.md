---
title: TypeScript & Node.js cơ bản cho Tester
description: Ứng dụng TypeScript vào việc viết Playwright test, và Node.js cơ bản để chạy được project automation
---

# TypeScript & Node.js cơ bản cho Tester

Tài liệu đào tạo QC - HR Tool

**Phiên bản:** 1.0
**Cập nhật:** 20/08/2026
**Tác giả:** QC Team

---

:::note[Đã học TypeScript ở đâu rồi?]
Bài [Web Basics](../basics/03-web-basics/) (mục 5) đã giới thiệu TypeScript cơ bản: basic types, function types, interface, generic, utility type. Nếu bạn chưa đọc phần đó, hãy đọc trước — bài này **không lặp lại** mà đi tiếp vào 2 việc: (1) áp dụng TypeScript cụ thể khi viết Playwright test, và (2) Node.js cơ bản để chạy được một project automation thật.
:::

## Mục lục

1. [Ôn nhanh: vì sao Playwright cần TypeScript](#1-ôn-nhanh-vì-sao-playwright-cần-typescript)
2. [TypeScript áp dụng trong Playwright test](#2-typescript-áp-dụng-trong-playwright-test)
3. [Node.js là gì và vì sao tester cần biết](#3-nodejs-là-gì-và-vì-sao-tester-cần-biết)
4. [Module system: import/export](#4-module-system-importexport)
5. [package.json và các lệnh npm/yarn/pnpm thường dùng](#5-packagejson-và-các-lệnh-npmyarnpnpm-thường-dùng)
6. [Biến môi trường với process.env](#6-biến-môi-trường-với-processenv)
7. [Đọc/ghi file với module fs](#7-đọcghi-file-với-module-fs)
8. [tsconfig.json là gì](#8-tsconfigjson-là-gì)
9. [Bài tập thực hành](#9-bài-tập-thực-hành)

---

## 1. Ôn nhanh: vì sao Playwright cần TypeScript

Playwright test là các file `.spec.ts` — nghĩa là code TypeScript thật, không phải cấu hình hay ngôn ngữ riêng. Bạn không cần giỏi TypeScript để viết test tốt, nhưng cần đọc hiểu được các khái niệm sau vì chúng xuất hiện trong **mọi** file test của HR Tool: `type`/`interface`, `async/await`, `Promise`, generic (`<T>`), optional field (`?`).

## 2. TypeScript áp dụng trong Playwright test

### 2.1 Khai báo type cho test data

Khi viết test, bạn thường cần một object dữ liệu test — nên đặt type rõ ràng để tránh viết sai field và để IDE gợi ý (autocomplete):

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

### 2.2 async/await — gần như mọi dòng test đều dùng

Playwright hoạt động dựa trên `Promise` (một tác vụ sẽ hoàn thành trong tương lai — ví dụ "đợi click xong", "đợi trang tải xong"). `await` nghĩa là "đợi tác vụ này xong rồi mới chạy dòng tiếp theo":

```typescript
test('login thành công', async ({ page }) => {
  await page.goto('/login');                 // đợi trang load xong
  await page.getByLabel('Email').fill('...');  // đợi fill xong
  await page.getByRole('button', { name: 'Đăng nhập' }).click(); // đợi click xong
  await expect(page).toHaveURL(/dashboard/);  // đợi assertion pass hoặc timeout
});
```

:::caution[Lỗi rất thường gặp: quên `await`]
Nếu bạn quên `await` trước một action, Playwright sẽ **không đợi** hành động đó hoàn thành mà chạy tiếp ngay dòng sau — dẫn đến test flaky (lúc pass lúc fail) rất khó debug. Luôn luôn `await` trước bất kỳ method nào của `page`, `locator`, hoặc `expect`.
:::

### 2.3 Type cho Page Object (xem trước bài Page Object Model)

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

`Page` và `Locator` là 2 type có sẵn Playwright export ra để bạn khai báo — bạn sẽ thấy chúng liên tục khi học bài Page Object Model.

## 3. Node.js là gì và vì sao tester cần biết

**Node.js** là môi trường chạy JavaScript/TypeScript **bên ngoài trình duyệt** — trên máy của bạn hoặc trên server CI/CD. Playwright test không chạy trong browser như code frontend thật; nó chạy bằng Node.js, rồi Node.js **điều khiển** một browser thật từ bên ngoài.

```
Node.js (máy bạn/CI)  ──điều khiển──▶  Browser (Chromium/Firefox/WebKit)
     │
     └── chạy file .spec.ts, đọc file test data, ghi report...
```

Tester cần biết Node.js cơ bản để: cài đặt project, chạy lệnh test, đọc lỗi khi câu lệnh thất bại, và hiểu vì sao một số thứ (đọc file, biến môi trường) hoạt động khác với JavaScript chạy trong browser.

## 4. Module system: import/export

HR Tool automation project tổ chức code thành nhiều file nhỏ, dùng `import`/`export` để chia sẻ code giữa các file — tương tự cách `apps/web` của HR Tool tổ chức component:

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

| Cú pháp | Ý nghĩa |
|---------|---------|
| `export const x = ...` | Cho phép file khác import biến `x` |
| `export default ...` | Export "mặc định" của file (mỗi file chỉ có 1) |
| `import { x } from './path'` | Lấy biến `x` đã export từ file khác |
| `import x from './path'` | Lấy export default |

## 5. package.json và các lệnh npm/yarn/pnpm thường dùng

`package.json` là "hồ sơ" của một project Node.js: tên, version, danh sách thư viện cần cài (`dependencies`), và các lệnh tắt (`scripts`).

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

Chạy `npm run test` (hoặc `yarn test`, `pnpm test`) sẽ thực thi đúng lệnh khai báo trong `scripts.test`. HR Tool dùng **Yarn Workspaces** (monorepo Nx) — bạn sẽ thấy lệnh dạng `yarn test:e2e` ở cấp gốc dự án.

| Lệnh | Ý nghĩa |
|------|---------|
| `npm install` / `yarn install` | Cài toàn bộ thư viện khai báo trong `package.json` |
| `npm install <pkg>` | Cài thêm 1 thư viện mới |
| `npm run <script>` | Chạy 1 script khai báo trong `scripts` |
| `npx <command>` | Chạy 1 công cụ CLI mà không cần cài global (ví dụ `npx playwright test`) |

## 6. Biến môi trường với process.env

Biến môi trường (environment variable) là cách truyền cấu hình (URL môi trường test, secret, flag CI) vào chương trình **mà không hardcode trong code**:

```typescript
// playwright.config.ts
export default defineConfig({
  use: {
    baseURL: process.env.BASE_URL || 'https://hr-tool-software.netlify.app',
  },
  retries: process.env.CI ? 2 : 0,   // Chỉ retry khi chạy trên CI
});
```

`process.env.CI` là biến môi trường mà GitHub Actions tự động set thành `"true"` khi chạy trên CI — nhờ vậy config có thể tự thay đổi hành vi (retry nhiều hơn, chạy ít worker hơn) mà không cần sửa code.

## 7. Đọc/ghi file với module fs

Node.js có module có sẵn `fs` (file system) để đọc/ghi file — hữu ích khi bạn cần đọc file test data JSON, hoặc lưu `storageState` (sẽ học ở bài Authentication & Storage State):

```typescript
import fs from 'fs';

// Đọc file
const rawData = fs.readFileSync('test-data/candidates.json', 'utf-8');
const candidates = JSON.parse(rawData);

// Kiểm tra file có tồn tại không
if (fs.existsSync('.auth/admin.json')) {
  console.log('Đã có session lưu sẵn, không cần login lại');
}
```

## 8. tsconfig.json là gì

`tsconfig.json` khai báo TypeScript compiler nên kiểm tra code nghiêm khắc đến mức nào. Bạn không cần tự viết file này (Playwright tạo sẵn khi bạn `npm init playwright@latest`), nhưng nên biết vài field hay gặp:

```json
{
  "compilerOptions": {
    "target": "ES2021",
    "strict": true,
    "module": "commonjs"
  }
}
```

`"strict": true` bật toàn bộ kiểm tra type nghiêm ngặt — đây là lý do đôi khi bạn viết test bị báo lỗi type dù code "chạy được" về mặt logic.

## 9. Bài tập thực hành

1. Viết một `interface TestCandidate` gồm các field: `fullName`, `email`, `phone`, `status` (chỉ nhận `'new' | 'reviewing' | 'rejected'`).
2. Giải thích bằng lời: điều gì xảy ra nếu bạn viết `page.click(...)` mà quên `await` phía trước, trong một test có 3 bước liên tiếp?
3. Mở file `package.json` của một project Playwright (nếu có quyền truy cập hr-tool) và liệt kê các `scripts` liên quan đến test.
4. Viết đoạn code dùng `process.env` để chọn `baseURL` là `staging` hoặc `local` tuỳ theo một biến môi trường tên `TEST_ENV`.

## Bước tiếp theo

Tiếp theo: [Unit Testing cơ bản](../automation/03-unit-testing-co-ban/) — để bạn đọc hiểu được unit test do developer viết, trước khi đi sâu vào Playwright.

---

**Cần giúp đỡ?** Liên hệ QC Lead hoặc đăng trong #qc-team
