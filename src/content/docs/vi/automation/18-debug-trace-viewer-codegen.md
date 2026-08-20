---
title: Debug, Trace Viewer & Codegen
description: Cách debug test Playwright thất bại, đọc Trace Viewer, và dùng Codegen để sinh code nhanh
---

# Debug, Trace Viewer & Codegen

Tài liệu đào tạo QC - HR Tool

Test tự động sớm hay muộn cũng sẽ fail — vấn đề là làm sao tìm ra lý do nhanh nhất. Bài này giới thiệu bộ công cụ debug của Playwright, từ cơ bản (console.log, screenshot) đến mạnh nhất (Trace Viewer) và công cụ giúp viết test nhanh hơn (Codegen).

## Mục lục

1. [Debug cơ bản](#1-debug-cơ-bản)
2. [Trace Viewer — công cụ debug mạnh nhất](#2-trace-viewer--công-cụ-debug-mạnh-nhất)
3. [Codegen — tự sinh code từ hành động thật](#3-codegen--tự-sinh-code-từ-hành-động-thật)
4. [VS Code Extension](#4-vs-code-extension)
5. [Bài tập thực hành](#5-bài-tập-thực-hành)

## 1. Debug cơ bản

**`page.pause()`** — dừng test giữa chừng, mở Playwright Inspector để bạn từng bước xem điều gì đang xảy ra:

```typescript
test('debug với pause', async ({ page }) => {
  await page.goto('/login');
  await page.pause(); // mở Inspector, bạn có thể step qua từng dòng, thử locator trực tiếp
  await page.getByLabel('Email').fill('[TEST_EMAIL]');
});
```

**Console log & network log** — in ra thông tin để biết chính xác trạng thái tại một thời điểm:

```typescript
test('log thông tin để debug', async ({ page }) => {
  await page.goto('/candidates');

  console.log('URL hiện tại:', page.url());
  console.log('Số dòng trong bảng:', await page.getByRole('row').count());

  // Log lỗi/console message từ browser (rất hữu ích khi UI im lặng nhưng có lỗi JS ngầm)
  page.on('console', (msg) => console.log(`[browser ${msg.type()}]`, msg.text()));
  page.on('pageerror', (err) => console.error('Page error:', err.message));
  page.on('response', (res) => {
    if (!res.ok()) console.log('Response lỗi:', res.status(), res.url());
  });
});
```

**Screenshot & video khi fail** — cấu hình trong `playwright.config.ts` để tự động chụp lại khi test thất bại, không cần chờ tái hiện lỗi:

```typescript
// playwright.config.ts
export default defineConfig({
  use: {
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
  },
});
```

## 2. Trace Viewer — công cụ debug mạnh nhất

Trace là một "bản ghi" đầy đủ của cả quá trình chạy test: từng action, từng network request, console log, và cả **DOM snapshot** tại mỗi bước — cho phép bạn xem lại chính xác những gì đã xảy ra, ngay cả khi test đã chạy xong (đặc biệt hữu ích khi test fail trên CI, nơi bạn không thể mở browser trực tiếp để xem).

```bash
# Ghi lại trace khi chạy test
npx playwright test --trace on

# Chỉ ghi trace khi retry sau lần fail đầu (khuyến nghị cho CI — nhẹ hơn "on")
npx playwright test --trace on-first-retry

# Mở trace đã ghi để xem lại
npx playwright show-trace trace.zip
```

Trace Viewer hiển thị 3 phần chính bạn nên biết cách đọc:

- **Timeline & Actions**: danh sách từng action (click, fill, waitFor...) theo thứ tự thực hiện, click vào từng action để xem DOM snapshot tại đúng thời điểm đó.
- **Network tab**: toàn bộ request/response đã xảy ra trong lúc test chạy — rất hữu ích để biết API có bị lỗi/chậm không.
- **Console tab**: log và lỗi JavaScript từ browser trong lúc test chạy.

:::tip[Vì sao Trace Viewer quan trọng hơn screenshot]
Screenshot chỉ cho bạn thấy **một khoảnh khắc**. Trace cho bạn xem lại **toàn bộ quá trình** — bạn có thể tìm chính xác action nào gây ra lỗi, network request nào trả về sai, thay vì đoán.
:::

## 3. Codegen — tự sinh code từ hành động thật

Thay vì viết code locator từ đầu, bạn có thể để Playwright **ghi lại** hành động thật của mình trên browser và tự sinh code:

```bash
npx playwright codegen https://hr-tool-software.netlify.app
```

Một browser sẽ mở ra, bạn click/nhập liệu như người dùng thật, Playwright sẽ hiển thị code tương ứng theo thời gian thực trong một cửa sổ riêng — bạn copy đoạn code đó vào file test của mình.

:::caution[Codegen chỉ là điểm khởi đầu, không phải sản phẩm cuối]
Code do Codegen sinh ra thường ưu tiên tốc độ ghi lại hơn là chất lượng locator — nó có thể dùng CSS selector dài dòng thay vì `getByRole`. Luôn xem lại và tinh chỉnh locator theo đúng nguyên tắc đã học ở [bài Locators & Selectors](./05-locators-selectors/) trước khi commit code.
:::

## 4. VS Code Extension

Cài extension **"Playwright Test for VSCode"** để có thể:

- Chạy/debug từng test ngay trong editor (click nút ▶️ cạnh mỗi `test(...)`), không cần gõ lệnh terminal.
- Đặt breakpoint trực tiếp trong code test.
- Dùng "Pick locator" để trỏ chuột vào 1 element trên trang và tự sinh locator tương ứng — nhanh hơn tự đoán CSS selector.
- Xem lại trace ngay trong VS Code sau khi test fail.

## 5. Bài tập thực hành

1. Thêm `trace: 'on-first-retry'` vào file config test của bạn (hoặc file mẫu được cấp), chạy 1 test cho fail có chủ đích, rồi mở trace bằng `npx playwright show-trace` để xem lại.
2. Dùng `npx playwright codegen` để ghi lại việc đăng nhập vào HR Tool trên Staging, sau đó chỉnh sửa code sinh ra để dùng `getByRole`/`getByLabel` thay cho CSS selector nếu có.
3. Cài "Playwright Test for VSCode" và thử chạy 1 test có sẵn ngay trong editor.

## Bước tiếp theo

Tiếp theo: [CI/CD với GitHub Actions & Reporting](./19-cicd-github-actions-reporting/) — chạy test tự động mỗi khi có code mới.

**Cần giúp đỡ?** Liên hệ QC Lead hoặc #qc-team
