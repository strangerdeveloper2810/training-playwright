---
title: Mobile Web Testing
description: Test giao diện web responsive trên thiết bị di động bằng device emulation của Playwright
---

# Mobile Web Testing

Tài liệu đào tạo QC - HR Tool

---

## Mục lục

1. [Mobile Web Testing khác gì Native App Testing](#1-mobile-web-testing-khác-gì-native-app-testing)
2. [Device Emulation trong Playwright](#2-device-emulation-trong-playwright)
3. [Viết test cho giao diện mobile](#3-viết-test-cho-giao-diện-mobile)
4. [Giới hạn của Emulation](#4-giới-hạn-của-emulation)
5. [Khi nào cần test trên thiết bị thật](#5-khi-nào-cần-test-trên-thiết-bị-thật)

---

## 1. Mobile Web Testing khác gì Native App Testing

Cần phân biệt rõ hai khái niệm dễ nhầm:

| | Mobile Web Testing | Native App Testing |
|---|---|---|
| Đối tượng test | Trang web mở qua browser trên điện thoại (ví dụ HR Tool web app mở bằng Safari trên iPhone) | Ứng dụng cài đặt riêng (ví dụ app HR Tool Mobile viết bằng React Native) |
| Công cụ | Playwright (giả lập browser mobile) | Appium, Detox, hoặc test thủ công trên thiết bị/emulator |
| Bài này nói về | ✅ Mobile Web Testing | Không cover trong bài này |

HR Tool có cả web app (React 19, responsive) và app mobile riêng (React Native, chế độ Headhunt). Bài này chỉ nói về việc test **web app khi mở trên màn hình nhỏ** — tức là kiểm tra responsive design hoạt động đúng, không phải test app mobile native.

## 2. Device Emulation trong Playwright

Playwright có sẵn danh sách thiết bị phổ biến (kích thước màn hình, user agent, tỉ lệ pixel...) để giả lập mà không cần thiết bị thật:

```typescript
import { test, expect, devices } from '@playwright/test';

test.use({ ...devices['iPhone 13'] });

test('trang candidates hiển thị đúng trên mobile', async ({ page }) => {
  await page.goto('/candidates');
  await expect(page.getByRole('heading', { name: 'Ứng viên' })).toBeVisible();
});
```

Hoặc khai báo sẵn thành project riêng trong config (đã học ở bài trước):

```typescript
projects: [
  { name: 'mobile-chrome', use: { ...devices['Pixel 5'] } },
  { name: 'mobile-safari', use: { ...devices['iPhone 13'] } },
],
```

Emulation mô phỏng: kích thước viewport, tỉ lệ pixel (device scale factor), user agent string, và hỗ trợ touch event (`hasTouch: true`) — đủ để test hầu hết các vấn đề về responsive layout.

## 3. Viết test cho giao diện mobile

Những thứ nên test đặc biệt trên mobile (khác với desktop):

```typescript
test('menu chính thu gọn thành hamburger menu trên mobile', async ({ page }) => {
  await page.goto('/dashboard');

  // Trên mobile, sidebar chính bị ẩn, thay bằng nút hamburger
  await expect(page.getByRole('button', { name: 'Menu' })).toBeVisible();
  await expect(page.getByTestId('sidebar-desktop')).not.toBeVisible();

  // Bấm mở menu
  await page.getByRole('button', { name: 'Menu' }).click();
  await expect(page.getByRole('navigation')).toBeVisible();
});

test('bảng dữ liệu chuyển thành card list trên mobile', async ({ page }) => {
  await page.goto('/candidates');

  // Trên desktop là <table>, trên mobile nhiều site đổi thành list card để dễ đọc
  await expect(page.getByTestId('candidates-mobile-card-list')).toBeVisible();
});
```

Các nhóm lỗi thường gặp riêng ở mobile: text/button bị chồng lấp do màn hình hẹp, vùng chạm (tap target) quá nhỏ, modal/dialog che hết màn hình không có cách đóng, form dài không scroll được, bàn phím ảo che mất input đang nhập.

## 4. Giới hạn của Emulation

:::caution[Emulation không phải thiết bị thật]
Device emulation của Playwright giả lập **kích thước và user agent**, nhưng vẫn chạy trên **engine desktop** (Chromium/WebKit chạy trên máy chủ CI hoặc máy dev, không phải trên hệ điều hành iOS/Android thật). Nó KHÔNG phát hiện được:
- Lỗi riêng của Mobile Safari thật trên iOS (khác với WebKit desktop giả lập).
- Vấn đề hiệu năng thật trên thiết bị cấu hình thấp.
- Hành vi bàn phím ảo thật, gesture thật (swipe, pinch-zoom) trên OS thật.
- Lỗi liên quan đến trình duyệt mặc định của từng hãng máy (Samsung Internet, v.v.).
:::

Emulation rất tốt để bắt lỗi **responsive layout** (bố cục vỡ, phần tử che nhau, breakpoint sai) nhanh và rẻ, nhưng không thay được việc test trên thiết bị thật cho các vấn đề sâu hơn.

## 5. Khi nào cần test trên thiết bị thật

| Trường hợp | Nên làm |
|---|---|
| Kiểm tra responsive layout hàng ngày trong CI | Emulation (Playwright) — nhanh, rẻ, tự động hoá tốt |
| Trước khi release tính năng quan trọng ảnh hưởng nhiều tới mobile user | Test tay trên ít nhất 1 thiết bị Android thật + 1 iOS thật |
| Nghi ngờ có vấn đề hiệu năng/animation riêng trên thiết bị cụ thể | Test tay trên đúng thiết bị đó, hoặc dùng dịch vụ cloud device farm (BrowserStack, Sauce Labs) |
| Test app mobile native (React Native) | Không dùng Playwright — dùng công cụ chuyên biệt (Appium/Detox) hoặc test tay |

## Bài tập thực hành

1. Viết một test dùng `devices['iPhone 13']` để mở trang login của HR Tool và kiểm tra form vẫn hiển thị đầy đủ, không bị vỡ layout.
2. Mở trang Dashboard bằng emulation `devices['Pixel 5']` và tự đánh giá: menu chính có chuyển thành dạng thu gọn (hamburger) không?
3. Kể ra 2 loại lỗi mobile mà device emulation của Playwright KHÔNG phát hiện được, và giải thích vì sao.
4. Nếu team chỉ có ngân sách test tay 1 thiết bị thật trước mỗi release, bạn sẽ chọn Android hay iOS, dựa vào yếu tố gì?

## Bước tiếp theo

Tiếp theo, tìm hiểu cách tự động kiểm tra khả năng truy cập (accessibility) trong test: [Accessibility Testing tự động](../automation/15-accessibility-testing-tu-dong/).

---

**Cần giúp đỡ?** Liên hệ QC Lead hoặc đăng trong #qc-team
