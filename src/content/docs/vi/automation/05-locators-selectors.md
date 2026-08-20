---
title: Locators & Selectors
description: Locator philosophy của Playwright, các loại locator, cách chọn locator bền vững và không bị vỡ khi UI thay đổi
---

# Locators & Selectors

Tài liệu đào tạo QC - HR Tool

**Phiên bản:** 1.0
**Cập nhật:** 20/08/2026
**Tác giả:** QC Team

---

## Mục lục

1. [Locator là gì?](#1-locator-là-gì)
2. [Thứ tự ưu tiên locator (Locator Philosophy)](#2-thứ-tự-ưu-tiên-locator-locator-philosophy)
3. [Các loại locator, có ví dụ](#3-các-loại-locator-có-ví-dụ)
4. [Chaining và Filtering locator](#4-chaining-và-filtering-locator)
5. [Sai lầm thường gặp](#5-sai-lầm-thường-gặp)
6. [Bài tập thực hành](#6-bài-tập-thực-hành)

---

## 1. Locator là gì?

**Locator** là cách bạn "chỉ" cho Playwright biết element nào trên trang cần thao tác — giống việc bạn nói với đồng nghiệp "bấm vào nút Đăng nhập" thay vì "bấm vào phần tử thứ 3 trong div thứ 5".

```typescript
const loginButton = page.getByRole('button', { name: 'Đăng nhập' });
await loginButton.click();
```

Playwright không tìm element ngay khi bạn viết `page.getByRole(...)` — nó chỉ tạo ra một "công thức tìm kiếm". Việc tìm thật sự (và tự động đợi element xuất hiện) chỉ xảy ra khi bạn gọi hành động (`.click()`, `.fill()`...) hoặc assertion (`expect(...)`).

## 2. Thứ tự ưu tiên locator (Locator Philosophy)

Playwright khuyến nghị chọn locator theo thứ tự ưu tiên từ **tốt nhất đến nên tránh**:

```
1. getByRole()          ← TỐT NHẤT — giống cách người dùng/screen reader nhận diện
2. getByLabel()         ← Tốt — cho form field có label
3. getByText()          ← Tốt — theo text hiển thị cho người dùng
4. getByPlaceholder()   ← Tạm được — theo placeholder text
5. getByTestId()        ← OK — cần dev thêm data-testid vào code
6. locator() với CSS/XPath ← TRÁNH nếu có thể
```

**Vì sao `getByRole` tốt nhất?**
- Phản ánh đúng cách người dùng thật (và screen reader) nhận diện element — nếu bạn test được bằng `getByRole`, nhiều khả năng element đó cũng accessible.
- Bền vững hơn: không bị vỡ khi developer đổi tên CSS class hay cấu trúc HTML.
- Tự mô tả (self-documenting): đọc code test là hiểu ngay đang thao tác với element nào.

```typescript
// ❌ Dễ vỡ — CSS class có thể bị đổi bất cứ lúc nào khi dev refactor
await page.locator('.btn.btn-primary.submit-form').click();

// ✅ Bền vững — vẫn đúng dù CSS class thay đổi, miễn giao diện còn là "nút Đăng nhập"
await page.getByRole('button', { name: 'Đăng nhập' }).click();
```

:::caution[Mâu thuẫn cần tránh khi viết Page Object]
Locator philosophy khuyên dùng `getByRole`, nhưng đôi khi code ví dụ cũ vẫn dùng CSS class như `.error-message`. Khi viết Page Object cho HR Tool (xem bài [Page Object Model](../automation/08-page-object-model/)), hãy nhất quán ưu tiên `getByRole`/`getByText`/`getByLabel` — chỉ dùng CSS selector khi thật sự không có role/text/label phù hợp (ví dụ: một `div` thông báo lỗi không có role rõ ràng).
:::

## 3. Các loại locator, có ví dụ

```typescript
// getByRole — ưu tiên số 1
await page.getByRole('button', { name: 'Đăng nhập' }).click();
await page.getByRole('button', { name: /đăng nhập/i }).click(); // không phân biệt hoa/thường
await page.getByRole('link', { name: 'Quên mật khẩu?' }).click();
await page.getByRole('textbox', { name: 'Email' }).fill('[TEST_EMAIL]');
await page.getByRole('checkbox', { name: 'Ghi nhớ đăng nhập' }).check();
await expect(page.getByRole('heading', { name: 'Đăng nhập' })).toBeVisible();

// getByLabel — cho form field
await page.getByLabel('Email').fill('[TEST_EMAIL]');
await page.getByLabel(/mật khẩu/i).fill('[TEST_PASSWORD]');

// getByText — theo nội dung hiển thị
await page.getByText('Đăng nhập vào hệ thống');           // khớp chính xác
await page.getByText('Đăng nhập', { exact: false });      // khớp một phần
await page.getByText(/đăng nhập/i);                        // khớp bằng regex

// getByPlaceholder
await page.getByPlaceholder('Nhập email...').fill('[TEST_EMAIL]');

// getByTestId — cần dev thêm data-testid="submit-btn" vào HTML
await page.getByTestId('submit-btn').click();

// CSS/XPath — chỉ dùng khi không còn lựa chọn nào tốt hơn
await page.locator('.status-badge').isVisible();
await page.locator('xpath=//button[contains(text(), "Submit")]').click();
```

## 4. Chaining và Filtering locator

Locator có thể "lồng" vào nhau để tìm chính xác hơn trong một khu vực cụ thể:

```typescript
// Tìm nút bên trong 1 form cụ thể
const loginForm = page.locator('#login-form');
await loginForm.getByRole('button', { name: 'Đăng nhập' }).click();

// Tìm dòng (row) chứa 1 text cụ thể, rồi tìm cell trong dòng đó
const row = page.getByRole('row', { name: /nguyễn văn a/i });
await expect(row.getByRole('cell', { name: 'Active' })).toBeVisible();

// filter() — lọc theo text hoặc theo element con
const activeCandidates = page.getByRole('row').filter({ hasText: 'Đang xem xét' });
await expect(activeCandidates).toHaveCount(5);

const rowsWithEditButton = page.getByRole('row').filter({
  has: page.getByRole('button', { name: 'Sửa' }),
});
```

`filter({ hasText: ... })` hữu ích khi test các bảng dữ liệu của HR Tool (danh sách Candidate, Job, Application) — bạn có thể lọc đúng dòng cần kiểm tra mà không cần biết vị trí (index) của nó.

## 5. Sai lầm thường gặp

| Sai lầm | Vì sao có vấn đề | Nên làm gì |
|---------|-------------------|-----------|
| Dùng `nth(2)` để chọn "dòng thứ 3" | Thứ tự dòng có thể đổi khi data thay đổi (sort, filter) | Dùng `filter({ hasText })` để tìm đúng dòng theo nội dung |
| Dùng class CSS động (`.MuiButton-root-123`) | Class do framework sinh ra ngẫu nhiên, đổi mỗi build | Dùng `getByRole`/`getByTestId` |
| Locator quá cụ thể (`div > div > span:nth-child(2)`) | Vỡ ngay khi cấu trúc HTML đổi nhẹ | Dùng locator theo ngữ nghĩa (role/text/label) |
| Không dùng `{ exact: true }` khi cần khớp chính xác | `getByText('Job')` có thể khớp luôn `'Jobs'`, `'Job Title'` | Thêm `{ exact: true }` khi cần khớp đúng 100% |

## 6. Bài tập thực hành

1. Mở trang login của HR Tool (staging), viết 3 locator khác nhau để tìm nút "Đăng nhập" (dùng `getByRole`, `getByText`, và CSS selector) — nhận xét locator nào bền vững hơn nếu dev đổi màu/CSS nút.
2. Với danh sách Candidates, viết một locator để tìm dòng có trạng thái "Đang xem xét" và đếm số dòng đó.
3. Giải thích tại sao `page.locator('.btn-primary').click()` có thể click sai nút nếu trang có nhiều nút cùng class `.btn-primary`.

## Bước tiếp theo

Tiếp theo: [Actions, Interactions & Waiting Strategy](../automation/06-actions-interactions-waiting/) — sau khi đã "chỉ" đúng element, làm sao để thao tác với nó.

---

**Cần giúp đỡ?** Liên hệ QC Lead hoặc đăng trong #qc-team
