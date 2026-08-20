---
title: Assertions
description: expect API của Playwright, web-first assertions tự động retry, soft assertions và cách viết assertion đáng tin cậy
---

# Assertions

Tài liệu đào tạo QC - HR Tool

**Phiên bản:** 1.0
**Cập nhật:** 20/08/2026
**Tác giả:** QC Team

---

## Mục lục

1. [Assertion là gì trong Playwright](#1-assertion-là-gì-trong-playwright)
2. [Web-first assertions tự động retry](#2-web-first-assertions-tự-động-retry)
3. [Các nhóm assertion thường dùng](#3-các-nhóm-assertion-thường-dùng)
4. [Soft assertions](#4-soft-assertions)
5. [Assertion cho screenshot (giới thiệu)](#5-assertion-cho-screenshot-giới-thiệu)
6. [Timeout riêng cho assertion](#6-timeout-riêng-cho-assertion)
7. [Bài tập thực hành](#7-bài-tập-thực-hành)

---

## 1. Assertion là gì trong Playwright

Assertion là câu lệnh khẳng định "kết quả phải như thế này, nếu không thì test fail". Đây là phần **quan trọng nhất** của một test — một test không có assertion (chỉ click qua các bước) không thực sự kiểm tra được gì cả, vì nó chỉ pass khi không có lỗi crash, mà không xác nhận kết quả có đúng không.

```typescript
await expect(page.locator('.status')).toHaveText('Thành công');
```

## 2. Web-first assertions tự động retry

Đây là điểm khác biệt lớn nhất so với assertion thông thường: `expect(locator)` của Playwright **tự động thử lại** cho đến khi điều kiện đúng hoặc hết timeout — không cần bạn tự viết retry logic.

```typescript
// ✅ Web-first assertion — tự động retry, khuyến nghị dùng
await expect(page.locator('.status')).toHaveText('Thành công');
// Playwright sẽ kiểm tra lại nhiều lần trong tối đa 10s (mặc định),
// cho đến khi text đúng bằng 'Thành công' hoặc hết thời gian.

// ❌ Assertion không retry — dễ flaky
const text = await page.locator('.status').textContent();
expect(text).toBe('Thành công');
// Chỉ đọc giá trị ĐÚNG 1 LẦN tại thời điểm gọi — nếu UI chưa cập nhật xong, test fail oan.
```

:::tip[Quy tắc ghi nhớ]
Nếu assertion của bạn có dạng `await expect(locator).toXxx(...)` — nó tự động retry, an toàn.
Nếu bạn phải `await` để lấy giá trị ra biến rồi mới `expect(bien).toBe(...)` — nó **không** retry, dễ flaky hơn. Luôn ưu tiên dạng đầu tiên.
:::

## 3. Các nhóm assertion thường dùng

```typescript
// Visibility
await expect(element).toBeVisible();
await expect(element).toBeHidden();
await expect(element).toBeAttached();       // có trong DOM (có thể đang bị ẩn)
await expect(page.getByText('Lỗi')).not.toBeVisible(); // phủ định với .not

// Nội dung text
await expect(page.locator('.title')).toHaveText('Dashboard');          // khớp chính xác
await expect(page.locator('.welcome')).toContainText('Xin chào');      // chứa 1 phần
await expect(page.locator('.count')).toHaveText(/\d+ ứng viên/);       // regex
await expect(page.locator('.menu-item')).toHaveText(['Dashboard', 'Ứng viên', 'Việc làm']); // nhiều element

// Input/Form
await expect(page.getByLabel('Email')).toHaveValue('[TEST_EMAIL]');
await expect(page.getByLabel('Email')).toBeEditable();

// Trạng thái
await expect(page.getByRole('button', { name: 'Đăng nhập' })).toBeEnabled();
await expect(page.locator('.submit-btn')).toBeDisabled();
await expect(page.getByRole('checkbox')).toBeChecked();
await expect(page.getByLabel('Email')).toBeFocused();

// Attribute/Class/CSS
await expect(page.locator('a.active')).toHaveAttribute('href', '/candidates');
await expect(page.locator('.nav-link')).toHaveClass(/active/);

// Số lượng element
await expect(page.getByRole('row')).toHaveCount(11); // header + 10 dòng dữ liệu

// Toàn trang
await expect(page).toHaveURL(/.*dashboard/);
await expect(page).toHaveTitle(/HR Tool/);
```

## 4. Soft assertions

Assertion thông thường **dừng test ngay** khi fail. `expect.soft()` cho phép test **tiếp tục chạy** dù assertion đó fail, và báo cáo toàn bộ lỗi ở cuối:

```typescript
test('kiểm tra đầy đủ số liệu trên dashboard', async ({ page }) => {
  await page.goto('/dashboard');

  await expect.soft(page.locator('.stat-total-jobs')).toHaveText('12');
  await expect.soft(page.locator('.stat-total-candidates')).toHaveText('87');
  await expect.soft(page.locator('.stat-total-interviews')).toHaveText('5');
  // Dù stat-total-jobs sai, test vẫn tiếp tục kiểm tra 2 stat còn lại
  // → báo cáo cuối cùng cho biết CẢ 3 kết quả, không chỉ dừng ở lỗi đầu tiên
});
```

:::tip[Khi nào nên dùng soft assertion]
Dùng `expect.soft()` khi bạn muốn kiểm tra **nhiều giá trị độc lập** trong 1 test (ví dụ: nhiều ô số liệu trên dashboard) và muốn biết **tất cả** ô nào sai, chứ không chỉ ô đầu tiên. Với các bước có tính **tuần tự** (bước sau phụ thuộc bước trước, ví dụ phải login thành công mới điều hướng tiếp được), vẫn nên dùng assertion thường (`expect()`) để test dừng ngay khi có lỗi, tránh lỗi dây chuyền gây nhiễu kết quả.
:::

## 5. Assertion cho screenshot (giới thiệu)

```typescript
await expect(page).toHaveScreenshot('trang-login.png');
```

Đây là bước đầu của **visual regression testing** — so sánh ảnh chụp màn hình hiện tại với ảnh "chuẩn" đã lưu trước đó để phát hiện thay đổi UI ngoài ý muốn. Chủ đề này sẽ được học đầy đủ ở bài [Visual Regression Testing](../automation/12-visual-regression-testing/) — bài này chỉ cần biết assertion này tồn tại.

## 6. Timeout riêng cho assertion

```typescript
// Timeout mặc định cho mọi assertion (đặt trong playwright.config.ts)
export default defineConfig({
  expect: { timeout: 10_000 },
});

// Timeout riêng cho 1 assertion cụ thể — hữu ích khi 1 phần UI chậm hơn bình thường
await expect(page.locator('.ai-matching-result')).toBeVisible({ timeout: 30_000 });
```

## 7. Bài tập thực hành

1. Viết 1 test login: sau khi submit, khẳng định (assert) đủ 3 điều: URL đổi sang `/dashboard`, tiêu đề trang đúng, và tên user hiển thị đúng trên header.
2. Giải thích vì sao đoạn code sau dễ bị flaky, và sửa lại cho đúng:
   ```typescript
   const count = await page.locator('.notification-badge').textContent();
   expect(count).toBe('3');
   ```
3. Viết 1 test dùng `expect.soft()` để kiểm tra 4 ô số liệu trên trang Dashboard của HR Tool cùng lúc.

## Bước tiếp theo

Với 7 bài vừa qua, bạn đã có đủ nền tảng để viết được một test Playwright hoàn chỉnh. Tiếp theo: [Page Object Model](../automation/08-page-object-model/) — cách tổ chức code test để dễ bảo trì khi project lớn dần.

---

**Cần giúp đỡ?** Liên hệ QC Lead hoặc đăng trong #qc-team
