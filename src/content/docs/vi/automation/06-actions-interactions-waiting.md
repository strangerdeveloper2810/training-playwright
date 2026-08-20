---
title: "Actions, Interactions & Waiting Strategy"
description: Các hành động cơ bản trong Playwright (click, fill, upload, drag-drop) và chiến lược chờ (waiting) đúng cách
---

# Actions, Interactions & Waiting Strategy

Tài liệu đào tạo QC - HR Tool

**Phiên bản:** 1.0
**Cập nhật:** 20/08/2026
**Tác giả:** QC Team

---

## Mục lục

1. [Click actions](#1-click-actions)
2. [Nhập liệu (input actions)](#2-nhập-liệu-input-actions)
3. [Dropdown, checkbox, radio](#3-dropdown-checkbox-radio)
4. [Upload file](#4-upload-file)
5. [Hover, focus, drag-drop](#5-hover-focus-drag-drop)
6. [Iframe và nhiều tab/window](#6-iframe-và-nhiều-tabwindow)
7. [Auto-waiting — điểm mạnh của Playwright](#7-auto-waiting--điểm-mạnh-của-playwright)
8. [Khi nào cần chờ thủ công](#8-khi-nào-cần-chờ-thủ-công)
9. [Bài tập thực hành](#9-bài-tập-thực-hành)

---

## 1. Click actions

```typescript
await page.getByRole('button', { name: 'Đăng nhập' }).click();      // click thường
await page.locator('.item').dblclick();                              // double click
await page.locator('.item').click({ button: 'right' });              // click phải
await page.locator('.item').click({ modifiers: ['Control'] });       // Ctrl+Click
await page.locator('.canvas').click({ position: { x: 100, y: 200 } }); // click vào vị trí cụ thể trong element
await page.locator('.hidden-button').click({ force: true });         // bỏ qua kiểm tra actionability (dùng cẩn thận!)
```

:::caution[`force: true` là "con dao 2 lưỡi"]
`force: true` bỏ qua toàn bộ kiểm tra Playwright thường làm (element có visible không, có bị che không...). Dùng nó để test pass nhanh, nhưng nếu element thực sự không click được với người dùng thật, bạn đang **che giấu một bug** thay vì test đúng hành vi thực tế.
:::

## 2. Nhập liệu (input actions)

```typescript
await page.getByLabel('Tên').fill('Nguyễn Văn A');   // xoá giá trị cũ rồi điền giá trị mới (nhanh)
await page.getByLabel('Email').pressSequentially('[TEST_EMAIL]', { delay: 50 }); // gõ từng ký tự, trigger đủ sự kiện keydown/keyup

await page.getByLabel('Tên').clear();                 // xoá trắng field
await page.getByLabel('Search').press('Enter');       // nhấn 1 phím

await page.keyboard.press('Control+a');               // tổ hợp phím (chọn tất cả)
await page.keyboard.press('Control+c');
```

`fill()` phù hợp cho hầu hết trường hợp (nhanh, đủ dùng). `pressSequentially()` chỉ cần khi bạn thật sự muốn test hành vi gõ từng ký tự (ví dụ: ô search có auto-suggest phản hồi theo từng ký tự).

## 3. Dropdown, checkbox, radio

```typescript
// Select dropdown
await page.getByLabel('Phòng ban').selectOption('engineering');       // theo value
await page.getByLabel('Phòng ban').selectOption({ label: 'Engineering' }); // theo label hiển thị
await page.locator('select[multiple]').selectOption(['opt1', 'opt2']);     // multi-select

// Checkbox
await page.getByRole('checkbox', { name: 'Nhận thông báo' }).check();
await page.getByRole('checkbox', { name: 'Nhận thông báo' }).uncheck();
await page.getByRole('checkbox').setChecked(true); // check nếu chưa check, không làm gì nếu đã check

// Radio
await page.getByRole('radio', { name: 'Nam' }).check();
```

## 4. Upload file

```typescript
// 1 file
await page.getByLabel('Upload CV').setInputFiles('files/cv-mau.pdf');

// nhiều file
await page.locator('input[type="file"]').setInputFiles(['files/doc1.pdf', 'files/doc2.pdf']);

// xoá file đã chọn
await page.locator('input[type="file"]').setInputFiles([]);

// tạo file "giả" trong bộ nhớ, không cần file thật trên đĩa
await page.locator('input[type="file"]').setInputFiles({
  name: 'cv-test.txt',
  mimeType: 'text/plain',
  buffer: Buffer.from('Nội dung CV test'),
});
```

Rất hữu ích khi test tính năng upload CV/JD của HR Tool — bạn có thể test cả file hợp lệ và file "giả lập" sai định dạng/quá lớn mà không cần chuẩn bị file thật trên đĩa.

## 5. Hover, focus, drag-drop

```typescript
// Hover — nhiều UI chỉ hiện nút "Sửa/Xoá" khi hover vào dòng
await page.getByRole('row').first().hover();
await expect(page.locator('.action-buttons')).toBeVisible();

// Focus/Blur
await page.getByLabel('Search').focus();
await page.getByLabel('Search').blur();

// Drag and drop — dùng cho Kanban board (ATS pipeline của HR Tool)
await page.locator('.candidate-card').dragTo(page.locator('.column-interview'));

// Drag thủ công (khi dragTo() không đủ, ví dụ cần nhiều bước)
await page.locator('.candidate-card').hover();
await page.mouse.down();
await page.locator('.column-interview').hover();
await page.mouse.up();
```

## 6. Iframe và nhiều tab/window

```typescript
// Iframe: dùng frameLocator thay vì locator thường
const frame = page.frameLocator('iframe[title="payment-widget"]');
await frame.getByRole('button', { name: 'Xác nhận' }).click();

// Mở tab mới và chờ nó xuất hiện (ví dụ nút "Xem trước CV" mở tab mới)
const [newTab] = await Promise.all([
  page.waitForEvent('popup'),
  page.getByRole('link', { name: 'Xem trước CV' }).click(),
]);
await newTab.waitForLoadState();
await expect(newTab).toHaveURL(/cv-preview/);
```

## 7. Auto-waiting — điểm mạnh của Playwright

Trước khi thực hiện một action, Playwright **tự động đợi** element đạt đủ điều kiện "actionable":

```typescript
// ❌ Các tool đời cũ (Selenium) — phải tự viết wait thủ công
await driver.sleep(2000);
await driver.findElement(By.id('button')).click();

// ✅ Playwright — tự động đợi, không cần viết wait thủ công
await page.getByRole('button', { name: 'Đăng nhập' }).click();
```

Trước khi `click()`, Playwright tự kiểm tra: element đã xuất hiện trong DOM, đang visible, đã "ổn định" (không còn animation), không bị element khác che, và đang enabled — tất cả trong giới hạn timeout (mặc định 30 giây).

| Action | Tự động đợi điều kiện |
|--------|------------------------|
| `click()` | Visible, stable, receives events, enabled |
| `fill()` | Visible, enabled, editable |
| `check()` | Visible, enabled, chưa checked |
| `expect().toBeVisible()` | Element visible |

## 8. Khi nào cần chờ thủ công

Auto-waiting xử lý hầu hết trường hợp, nhưng một số tình huống cần bạn chủ động chờ:

```typescript
// Chờ URL đổi sau khi submit form
await page.getByRole('button', { name: 'Đăng nhập' }).click();
await page.waitForURL('**/dashboard');

// Chờ 1 network request/response cụ thể hoàn thành
const responsePromise = page.waitForResponse(
  (res) => res.url().includes('/trpc/candidate.list') && res.status() === 200
);
await page.getByRole('button', { name: 'Tải lại' }).click();
await responsePromise;

// Chờ 1 điều kiện tuỳ ý trên trang
await page.waitForFunction(() => document.querySelectorAll('.candidate-card').length > 0);

// Timeout riêng cho 1 action cụ thể (khi action đó chậm hơn bình thường)
await page.getByRole('button', { name: 'Xuất báo cáo' }).click({ timeout: 60_000 });
```

:::caution[Đừng dùng `page.waitForTimeout()` để "chờ cho chắc"]
`await page.waitForTimeout(3000)` (chờ cứng 3 giây) là cách chờ **tệ nhất** — vừa làm test chạy chậm không cần thiết, vừa không đảm bảo đủ thời gian khi hệ thống chậm hơn dự kiến. Luôn ưu tiên chờ theo điều kiện cụ thể (`waitForURL`, `waitForResponse`, hoặc để auto-wait của action/assertion tự xử lý).
:::

## 9. Bài tập thực hành

1. Viết test: điền form "Tạo Job mới" với đầy đủ field, click Submit, và chờ đúng cách cho đến khi thấy thông báo thành công (không dùng `waitForTimeout`).
2. Viết test upload 1 file CV giả lập (dùng buffer, không cần file thật) vào form ứng tuyển.
3. Giải thích: vì sao `page.click('#btn', { force: true })` có thể khiến test pass nhưng vẫn đang che giấu một bug thật.
4. Với tính năng kéo-thả candidate giữa các cột trong ATS pipeline, viết test dùng `dragTo()`.

## Bước tiếp theo

Tiếp theo: [Assertions](../automation/07-assertions/) — cách khẳng định kết quả test đúng như kỳ vọng.

---

**Cần giúp đỡ?** Liên hệ QC Lead hoặc đăng trong #qc-team
