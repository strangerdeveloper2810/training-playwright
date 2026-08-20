---
title: Best Practices & Cheatsheet
description: Tổng hợp các nguyên tắc viết automation test tốt, quick-reference Playwright, và checklist tự đánh giá trước khi mở Pull Request
---

# Best Practices & Cheatsheet

Tài liệu đào tạo QC - HR Tool

Đây là bài tổng hợp — dùng để tra cứu nhanh khi viết test, và để tự kiểm tra chất lượng code test của mình trước khi mở Pull Request.

## Mục lục

1. [Best Practices khi viết automation test](#1-best-practices-khi-viết-automation-test)
2. [Cheatsheet: Locators](#2-cheatsheet-locators)
3. [Cheatsheet: Actions](#3-cheatsheet-actions)
4. [Cheatsheet: Assertions](#4-cheatsheet-assertions)
5. [Cheatsheet: Waits](#5-cheatsheet-waits)
6. [Cheatsheet: Test Structure & Commands](#6-cheatsheet-test-structure--commands)
7. [Checklist tự đánh giá trước khi mở PR](#7-checklist-tự-đánh-giá-trước-khi-mở-pr)
8. [Tài nguyên tham khảo](#8-tài-nguyên-tham-khảo)

## 1. Best Practices khi viết automation test

- **Test phải độc lập, không phụ thuộc thứ tự chạy.** Mỗi test nên tự tạo dữ liệu nó cần, không giả định test trước đã chạy và để lại state gì. Nếu chạy 1 mình test đó vẫn phải pass.
- **Tránh hardcode thời gian chờ (`waitForTimeout`).** Dùng assertion tự chờ (`expect(...).toBeVisible()`) hoặc `waitForLoadState`/`waitForResponse` — chờ đúng điều kiện thay vì chờ một khoảng thời gian cố định (vừa chậm vừa không ổn định).
- **Ưu tiên locator theo role/label**, chỉ dùng `data-testid` khi không còn cách nào tốt hơn để định vị element (xem lại [bài Locators & Selectors](./05-locators-selectors/)).
- **Đặt tên test rõ nghĩa**, mô tả được hành vi đang test, ví dụ `'hiển thị lỗi khi email không đúng định dạng'` tốt hơn `'test 3'`.
- **Không đặt assertion trong Page Object** — Page Object chỉ nên chứa action/getter, còn `expect(...)` nằm trong file test (xem [bài Page Object Model](./08-page-object-model/)).
- **Review code test nghiêm túc như review code sản phẩm.** Test là code, cũng cần đúng convention, dễ đọc, dễ maintain — không phải "viết cho có".
- **Dùng fixtures thay vì tạo instance thủ công** mỗi test (xem [bài Fixtures & Test Data](./09-fixtures-test-data/)).
- **Dọn dẹp dữ liệu test đã tạo**, đặt tiền tố `[TEST]` để dễ nhận diện và không làm nhiễu dữ liệu thật.

## 2. Cheatsheet: Locators

```typescript
// Theo role (khuyến nghị hàng đầu)
page.getByRole('button', { name: 'Submit' })
page.getByRole('textbox', { name: 'Email' })
page.getByRole('checkbox', { name: 'Remember me' })

// Theo text / label / placeholder
page.getByText('Xin chào')
page.getByText(/xin chào/i)          // regex, không phân biệt hoa thường
page.getByLabel('Email')
page.getByPlaceholder('Nhập email...')

// Theo test id (khi không còn cách nào tốt hơn)
page.getByTestId('submit-btn')

// Chaining & lọc theo danh sách
page.locator('table tbody tr').first()
page.locator('table tbody tr').nth(2)      // index từ 0
page.locator('li').filter({ hasText: 'Pending' })
```

## 3. Cheatsheet: Actions

```typescript
await element.click();
await element.dblclick();
await element.click({ button: 'right' });

await element.fill('text');   // xoá cũ, nhập mới
await element.clear();

await page.selectOption('select', { label: 'Label text' });
await element.check();
await element.uncheck();

await page.goto('/path');
await page.goBack();

await element.press('Enter');
await page.setInputFiles('input[type="file"]', 'path/to/file.pdf');

await element.hover();
```

## 4. Cheatsheet: Assertions

```typescript
import { expect } from '@playwright/test';

await expect(page).toHaveURL(/dashboard/);
await expect(element).toBeVisible();
await expect(element).toBeEnabled();
await expect(element).toBeChecked();
await expect(element).toHaveText(/regex/i);
await expect(input).toHaveValue('value');
await expect(element).toHaveAttribute('type', 'submit');
await expect(page.locator('tr')).toHaveCount(5);
await expect(element).toBeVisible({ timeout: 10000 }); // custom timeout khi cần
```

## 5. Cheatsheet: Waits

```typescript
await element.waitFor({ state: 'visible' });
await page.waitForLoadState('networkidle');
await page.waitForURL(/dashboard/);
await page.waitForResponse(
  (res) => res.url().includes('/trpc/candidate.list') && res.status() === 200
);

// Hạn chế dùng — chỉ khi thật sự không còn cách nào khác
await page.waitForTimeout(1000);
```

## 6. Cheatsheet: Test Structure & Commands

```typescript
import { test, expect } from '../../fixtures/test-fixtures';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('mô tả rõ hành vi đang test', async ({ page }) => {
    // ARRANGE - ACT - ASSERT
  });

  test.skip('chưa implement', async () => {});
});
```

```bash
npx playwright test                       # Chạy toàn bộ test
npx playwright test --ui                  # UI mode (khuyến nghị khi develop)
npx playwright test --headed              # Mở browser để xem trực tiếp
npx playwright test -g "login"            # Chạy test có tên chứa "login"
npx playwright test --debug               # Debug mode (mở Inspector)
npx playwright codegen <url>              # Sinh code từ hành động thật
npx playwright show-report                # Xem HTML report
npx playwright show-trace trace.zip       # Xem lại trace đã ghi
```

## 7. Checklist tự đánh giá trước khi mở PR

**Trước khi viết test:**
- [ ] Đã xác định rõ test case này verify hành vi gì (không phải "test cho có")
- [ ] Đã kiểm tra chưa có test nào khác đã cover case tương tự

**Trước khi mở Pull Request:**
- [ ] Test chạy pass ổn định ít nhất 3 lần liên tiếp (không flaky)
- [ ] Test chạy độc lập được (chạy riêng 1 mình vẫn pass, không cần test khác chạy trước)
- [ ] Không có `waitForTimeout` hardcode không cần thiết
- [ ] Locator ưu tiên `getByRole`/`getByLabel`, không dùng CSS selector dài dòng nếu không cần
- [ ] Dữ liệu test tạo ra có tiền tố `[TEST]` và được cleanup sau khi test chạy xong
- [ ] Không có credential/token thật nào bị hardcode trong code

**Trước khi merge:**
- [ ] CI (GitHub Actions) chạy pass
- [ ] Đã review lại report/trace nếu có test từng fail trong lúc phát triển

## 8. Tài nguyên tham khảo

| Tài liệu | Link | Mô tả |
|---|---|---|
| Getting Started | [playwright.dev/docs/intro](https://playwright.dev/docs/intro) | Bắt đầu từ đây |
| Best Practices | [playwright.dev/docs/best-practices](https://playwright.dev/docs/best-practices) | Best practices chính thức |
| API Reference | [playwright.dev/docs/api](https://playwright.dev/docs/api/class-playwright) | Tra cứu API đầy đủ |
| Locators Guide | [playwright.dev/docs/locators](https://playwright.dev/docs/locators) | Hướng dẫn locators |
| Assertions Guide | [playwright.dev/docs/test-assertions](https://playwright.dev/docs/test-assertions) | Hướng dẫn assertions |

:::tip[Đây là bài cuối của nhóm Automation Testing]
Nếu bạn đã đi hết 21 bài, bạn đã có đủ kiến thức để viết, tổ chức, debug, và vận hành một bộ automation test thật trong CI/CD. Bước tiếp theo tốt nhất là thực hành: chọn 5-10 test case thủ công đang có ở [Test Cases by Module](../practice/04-test-cases-by-module/) và tự automate chúng.
:::

**Cần giúp đỡ?** Liên hệ QC Lead hoặc #qc-team
