---
title: Accessibility Testing tự động
description: Tự động kiểm tra khả năng truy cập (a11y) trong test Playwright bằng axe-core
---

# Accessibility Testing tự động

Tài liệu đào tạo QC - HR Tool

---

## Mục lục

1. [Nhắc lại: Accessibility là gì](#1-nhắc-lại-accessibility-là-gì)
2. [Cài đặt @axe-core/playwright](#2-cài-đặt-axe-coreplaywright)
3. [Viết test kiểm tra accessibility](#3-viết-test-kiểm-tra-accessibility)
4. [Đọc kết quả violations](#4-đọc-kết-quả-violations)
5. [Giới hạn: a11y automation không thay được test thủ công](#5-giới-hạn-a11y-automation-không-thay-được-test-thủ-công)

---

## 1. Nhắc lại: Accessibility là gì

Ở bài [Usability & Accessibility Testing](../practice/09-usability-accessibility-testing/), ta đã học cách tự kiểm tra accessibility thủ công bằng Lighthouse/axe DevTools extension. Bài này học cách đưa việc kiểm tra đó vào **test tự động**, để mỗi lần code thay đổi, test sẽ tự phát hiện nếu có lỗi a11y mới phát sinh — thay vì phải nhớ tự bật extension kiểm tra tay mỗi lần.

## 2. Cài đặt @axe-core/playwright

axe-core là engine kiểm tra accessibility mã nguồn mở (cùng công nghệ đứng sau axe DevTools extension), có gói tích hợp sẵn cho Playwright:

```bash
npm install --save-dev @axe-core/playwright
```

## 3. Viết test kiểm tra accessibility

```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('trang login không có lỗi accessibility nghiêm trọng', async ({ page }) => {
  await page.goto('/login');

  const results = await new AxeBuilder({ page }).analyze();

  expect(results.violations).toEqual([]);
});
```

`AxeBuilder` quét toàn bộ trang hiện tại và trả về danh sách `violations` (vi phạm). Có thể thu hẹp phạm vi quét hoặc loại trừ một số quy tắc chưa muốn áp dụng ngay:

```typescript
const results = await new AxeBuilder({ page })
  .include('#main-content')           // chỉ quét trong 1 vùng cụ thể
  .exclude('.third-party-widget')      // bỏ qua widget của bên thứ 3 không kiểm soát được
  .withTags(['wcag2a', 'wcag2aa'])     // chỉ áp dụng theo chuẩn WCAG 2.0 mức A và AA
  .analyze();
```

:::tip[Bắt đầu với danh sách loại trừ, siết dần theo thời gian]
Nếu áp dụng ngay cho toàn bộ site đang chạy production, có thể phát hiện ra hàng trăm vi phạm cùng lúc, gây choáng và khó bắt đầu sửa. Cách thực tế hơn: bắt đầu test 3-5 trang quan trọng nhất, dùng `.exclude()` cho những phần chưa kịp sửa, rồi thu hẹp danh sách loại trừ dần qua từng sprint.
:::

## 4. Đọc kết quả violations

Mỗi vi phạm trong `results.violations` có cấu trúc:

```json
{
  "id": "color-contrast",
  "impact": "serious",
  "description": "Đảm bảo độ tương phản màu chữ/nền đạt chuẩn WCAG AA",
  "nodes": [
    {
      "target": [".btn-submit"],
      "failureSummary": "Fix bất kỳ lỗi nào sau: Phần tử có độ tương phản 2.1:1, cần tối thiểu 4.5:1"
    }
  ]
}
```

Các trường quan trọng cần đọc:
- **`id`**: mã quy tắc bị vi phạm (ví dụ `color-contrast`, `image-alt`, `label`, `aria-required-attr`).
- **`impact`**: mức độ nghiêm trọng — `minor`, `moderate`, `serious`, `critical`. Nên ưu tiên sửa `serious`/`critical` trước.
- **`nodes[].target`**: CSS selector chỉ ra chính xác element bị lỗi, giúp dev tìm nhanh trong code.
- **`nodes[].failureSummary`**: giải thích cụ thể vì sao vi phạm và gợi ý sửa.

Khi report bug từ kết quả này, dùng đúng [Template báo cáo lỗi](../basics/02-bug-report-template/) đã học, gắn label `accessibility`, đính kèm đoạn JSON vi phạm vào phần Console Log/Error Message.

## 5. Giới hạn: a11y automation không thay được test thủ công

axe-core (và mọi tool tự động khác) chỉ phát hiện được các lỗi có thể kiểm tra **bằng cấu trúc HTML/CSS** — tương phản màu, thiếu `alt`, thiếu `label`, thiếu thuộc tính ARIA bắt buộc... Theo các nghiên cứu về accessibility, công cụ tự động chỉ bắt được khoảng 30-40% tổng số vấn đề accessibility thực tế.

**KHÔNG tự động kiểm tra được:**
- Trải nghiệm thực tế khi dùng screen reader (VoiceOver, NVDA) — thứ tự đọc có hợp lý không, tên nút có đủ rõ nghĩa khi nghe không nhìn màn hình không.
- Có điều hướng được toàn bộ trang chỉ bằng bàn phím (Tab, Enter, Esc) một cách hợp lý không.
- Nội dung ảnh có ý nghĩa (`alt` tồn tại nhưng có mô tả đúng nội dung ảnh không, hay chỉ là chuỗi rác để qua tool).

:::caution
axe-core báo "0 violations" KHÔNG có nghĩa là trang hoàn toàn accessible. Đó chỉ có nghĩa là không có lỗi nào mà tool này kiểm tra được. Vẫn cần lịch test thủ công định kỳ (tự dùng bàn phím/screen reader) như đã học ở bài Usability & Accessibility Testing.
:::

## Bài tập thực hành

1. Cài `@axe-core/playwright` vào một project Playwright, viết test quét trang login của HR Tool, in ra `results.violations.length`.
2. Nếu tìm thấy vi phạm, chọn 1 vi phạm và viết báo cáo lỗi theo đúng template đã học ở bài Bug Report Template.
3. Thử `.withTags(['wcag2aa'])` và so sánh số lượng violations với khi không giới hạn tag — giải thích vì sao khác nhau.
4. Vì sao "axe-core báo 0 violations" không đủ để kết luận trang hoàn toàn accessible? Nêu 2 ví dụ lỗi mà axe-core không bắt được nhưng test tay bằng bàn phím sẽ phát hiện ra.

## Bước tiếp theo

Đây là bài cuối của nhóm "kiểm thử giao diện nâng cao". Tiếp theo, chuyển sang kiểm thử tầng API/backend: [API Testing với Playwright & tRPC](../automation/16-api-testing-playwright-trpc/).

---

**Cần giúp đỡ?** Liên hệ QC Lead hoặc đăng trong #qc-team
