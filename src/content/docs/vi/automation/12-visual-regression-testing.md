---
title: Visual Regression Testing
description: Kiểm thử hồi quy giao diện bằng screenshot với Playwright
---

# Visual Regression Testing

Tài liệu đào tạo QC - HR Tool

---

## Mục lục

1. [Visual Regression Testing là gì](#1-visual-regression-testing-là-gì)
2. [So sánh screenshot với `toHaveScreenshot()`](#2-so-sánh-screenshot-với-tohavescreenshot)
3. [Baseline screenshot là gì](#3-baseline-screenshot-là-gì)
4. [Cập nhật baseline khi UI thay đổi có chủ đích](#4-cập-nhật-baseline-khi-ui-thay-đổi-có-chủ-đích)
5. [Vấn đề flaky và cách xử lý](#5-vấn-đề-flaky-và-cách-xử-lý)
6. [Khi nào nên/không nên dùng Visual Regression](#6-khi-nào-nênkhông-nên-dùng-visual-regression)

---

## 1. Visual Regression Testing là gì

Các bài trước, ta dùng `expect()` để kiểm tra một giá trị cụ thể (text, số lượng, URL...). Nhưng có những lỗi mà assertion thông thường không bắt được — ví dụ: một CSS class bị đổi khiến nút "Lưu" bị lệch ra ngoài màn hình, hoặc màu chữ bị trùng với màu nền. Về mặt dữ liệu, mọi thứ vẫn "đúng"; về mặt hiển thị, giao diện đã hỏng.

**Visual Regression Testing** giải quyết đúng vấn đề này: chụp ảnh (screenshot) giao diện tại một thời điểm "chuẩn" (gọi là **baseline**), sau đó ở mỗi lần chạy test tiếp theo, chụp lại ảnh và **so sánh từng pixel** với baseline. Nếu khác biệt vượt một ngưỡng cho phép, test fail và đính kèm ảnh diff để QC/dev xem chỗ nào bị lệch.

:::note[Không thay thế functional testing]
Visual regression chỉ phát hiện lỗi HIỂN THỊ, không biết một nút có hoạt động đúng hay không. Đây là lớp bổ sung, không thay thế các assertion về hành vi (click được, hiển thị đúng data...) đã học ở bài trước.
:::

## 2. So sánh screenshot với `toHaveScreenshot()`

Playwright hỗ trợ sẵn assertion này, không cần cài thêm thư viện:

```typescript
import { test, expect } from '@playwright/test';

test('trang login hiển thị đúng như baseline', async ({ page }) => {
  await page.goto('/login');
  await expect(page).toHaveScreenshot('login-page.png');
});
```

Có thể chụp toàn trang, một vùng cụ thể, hoặc một element:

```typescript
// Toàn trang
await expect(page).toHaveScreenshot('dashboard-full.png');

// Chỉ một element (ví dụ card thống kê trên Dashboard)
await expect(page.locator('[data-testid="stat-cards"]')).toHaveScreenshot('stat-cards.png');
```

Lần chạy đầu tiên, Playwright **chưa có gì để so sánh** — nó sẽ tự tạo ảnh baseline và test được báo là "written", không phải pass/fail. Từ lần chạy thứ hai, ảnh mới sẽ được so với baseline này.

## 3. Baseline screenshot là gì

Baseline là ảnh "chuẩn" được lưu trong repo, thường nằm cạnh file test với tên dạng:

```
tests/auth/login.spec.ts-snapshots/login-page-chromium-darwin.png
```

Chú ý tên file có kèm **tên browser** (`chromium`) và **hệ điều hành** (`darwin` = macOS). Đây là điểm quan trọng: ảnh render trên macOS và Linux có thể khác nhau vài pixel do font-rendering khác nhau, nên baseline phải được tạo trên đúng môi trường sẽ chạy test (thường là môi trường CI, không phải máy local của từng QC).

:::caution[Baseline phải commit vào git]
Nếu không commit ảnh baseline, mỗi máy/mỗi lần CI chạy sẽ tự tạo baseline mới và test sẽ luôn "pass" một cách vô nghĩa — vì không có gì để so sánh thật. Baseline phải là ảnh cố định, được review khi thay đổi giống như review code.
:::

## 4. Cập nhật baseline khi UI thay đổi có chủ đích

Khi UI thay đổi hợp lệ (redesign, đổi màu theo yêu cầu...), baseline cũ sẽ không còn đúng nữa và cần được ghi đè:

```bash
npx playwright test --update-snapshots
```

Quy trình khuyến nghị:
1. Dev thông báo có thay đổi UI có chủ đích (kèm ticket/PR).
2. QC chạy lại `--update-snapshots` trên đúng môi trường tạo baseline (thường là CI hoặc container Docker giống CI).
3. QC **xem lại bằng mắt** từng ảnh mới trước khi commit — không update baseline một cách máy móc, vì nếu bug vô tình lọt qua đúng lúc update, baseline sai sẽ "hợp thức hoá" luôn cả bug đó.
4. Commit ảnh baseline mới kèm PR, để reviewer thấy rõ UI đã đổi như thế nào.

## 5. Vấn đề flaky và cách xử lý

Visual regression là dạng test dễ **flaky** (lúc pass lúc fail dù code không đổi) nhất, vì nhiều yếu tố ngoài ý muốn ảnh hưởng đến pixel:

| Nguyên nhân | Cách xử lý |
|---|---|
| Animation/transition CSS đang chạy khi chụp | Tắt animation trong lúc test: `page.emulateMedia({ reducedMotion: 'reduced' })` hoặc CSS `* { animation: none !important; }` chỉ áp dụng khi test |
| Dữ liệu động (ngày giờ hiện tại, số liệu random) | Che (mask) vùng đó: `toHaveScreenshot({ mask: [page.locator('.current-time')] })` |
| Sai khác nhỏ do font-rendering giữa các lần chạy | Cho phép sai số: `toHaveScreenshot({ maxDiffPixelRatio: 0.02 })` (cho phép lệch tối đa 2% số pixel) |
| Con trỏ chuột/caret nhấp nháy | Di chuột ra ngoài vùng chụp trước khi screenshot, hoặc `caret: 'hide'` |
| Ảnh động (banner quảng cáo, avatar random) | Mask hoặc thay bằng ảnh cố định trong dữ liệu test |

```typescript
await expect(page).toHaveScreenshot('dashboard.png', {
  mask: [page.locator('[data-testid="last-updated-time"]')],
  maxDiffPixelRatio: 0.01,
});
```

## 6. Khi nào nên/không nên dùng Visual Regression

**Nên dùng cho:**
- Các trang/component ít thay đổi nhưng quan trọng về mặt thương hiệu (landing page, email template, trang login).
- Component dùng chung (design system) — một lỗi ở đây ảnh hưởng toàn bộ hệ thống.

**Nên hạn chế với:**
- Trang có nhiều dữ liệu động, khó mask hết (ví dụ Dashboard với biểu đồ real-time).
- Trang thay đổi UI thường xuyên trong giai đoạn đang phát triển nhanh — baseline sẽ phải update liên tục, gây nhiễu nhiều hơn là hữu ích.

:::tip[Bắt đầu nhỏ]
Đừng cố visual-test toàn bộ site ngay từ đầu. Chọn 5-10 trang/component quan trọng nhất (login, dashboard, các component dùng chung trong `packages/ui-web`) để bắt đầu, rồi mở rộng dần khi đã quen với việc quản lý baseline.
:::

## Bài tập thực hành

1. Viết một test dùng `toHaveScreenshot()` để chụp trang login của HR Tool trên Staging. Chạy lần đầu để tạo baseline, sau đó chạy lại để xác nhận test pass.
2. Thử đổi tạm 1 dòng CSS (ví dụ đổi màu nút) rồi chạy lại test — quan sát ảnh diff Playwright tạo ra.
3. Tìm một vùng trên Dashboard có dữ liệu động (thời gian, số liệu) và viết `mask` để loại nó khỏi so sánh.
4. Giải thích bằng lời của bạn: vì sao baseline nên tạo trên môi trường CI thay vì máy local?

## Bước tiếp theo

Tiếp theo, tìm hiểu cách chạy test trên nhiều trình duyệt và chạy song song để tiết kiệm thời gian: [Cross-browser & Parallel Execution](../automation/13-cross-browser-parallel-execution/).

---

**Cần giúp đỡ?** Liên hệ QC Lead hoặc đăng trong #qc-team
