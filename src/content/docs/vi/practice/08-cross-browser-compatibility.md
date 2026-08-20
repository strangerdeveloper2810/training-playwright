---
title: Cross-browser & Compatibility Testing
description: Hướng dẫn kiểm thử tương thích trình duyệt và thiết bị cho HR Tool
---

# Cross-browser & Compatibility Testing

Tài liệu đào tạo QC - HR Tool

Cùng một tính năng có thể hoạt động hoàn hảo trên Chrome nhưng vỡ layout trên Safari, hoặc chạy tốt trên desktop nhưng không dùng được trên mobile. Bài này hướng dẫn cách test tương thích một cách có hệ thống, thay vì chỉ test trên trình duyệt quen dùng.

## Mục lục

1. [Vì sao cần test đa trình duyệt/thiết bị](#1-vì-sao-cần-test-đa-trình-duyệtthiết-bị)
2. [Xây dựng ma trận test compatibility](#2-xây-dựng-ma-trận-test-compatibility)
3. [Quy trình test compatibility](#3-quy-trình-test-compatibility)
4. [Các lỗi thường gặp](#4-các-lỗi-thường-gặp)
5. [Checklist Compatibility Testing](#5-checklist-compatibility-testing)
6. [Bài tập thực hành](#6-bài-tập-thực-hành)

---

## 1. Vì sao cần test đa trình duyệt/thiết bị

Mỗi trình duyệt (Chrome, Firefox, Safari, Edge) dùng một "engine" render riêng (Blink, Gecko, WebKit...), và có thể hỗ trợ CSS/JavaScript hơi khác nhau. Người dùng HR Tool có thể dùng bất kỳ trình duyệt/thiết bị nào — QC cần đảm bảo trải nghiệm nhất quán trên các cấu hình phổ biến nhất, theo đúng thứ tự ưu tiên đã nêu ở bài [QC Fundamentals](../basics/01-fundamentals/):

1. Chrome (mới nhất) — chính
2. Firefox (mới nhất) — phụ
3. Safari (mới nhất) — chỉ Mac
4. Edge (mới nhất) — chỉ Windows

## 2. Xây dựng ma trận test compatibility

Ma trận compatibility là bảng kết hợp **Browser × Device × Màn hình** cho một tính năng cần test kỹ:

| | Desktop Chrome | Desktop Safari | Mobile Safari (iOS) | Mobile Chrome (Android) |
|---|:---:|:---:|:---:|:---:|
| **ATS Pipeline (kéo-thả Kanban)** | ✅ Full test | ✅ Full test | ⚠️ Chỉ test xem, không kéo-thả (không có drag trên mobile) | ⚠️ Tương tự |
| **Form tạo Job** | ✅ Full test | ✅ Full test | ✅ Full test | ✅ Full test |
| **Dashboard biểu đồ** | ✅ Full test | ✅ Full test | ✅ Kiểm tra responsive | ✅ Kiểm tra responsive |

Không phải tính năng nào cũng cần test đầy đủ trên mọi ô — hãy ưu tiên theo mức độ rủi ro: tính năng có nhiều tương tác phức tạp (kéo-thả, upload file, real-time) cần test kỹ hơn tính năng hiển thị đơn giản.

## 3. Quy trình test compatibility

1. Chọn tính năng cần test và xác định các cấu hình quan trọng nhất (dựa theo ma trận ở trên).
2. Test lần lượt trên từng trình duyệt/thiết bị, dùng **cùng một bộ test case** (không cần viết test case riêng cho mỗi browser).
3. Với mỗi lỗi phát hiện, ghi rõ **trình duyệt + version + OS** trong bug report (xem [Template Báo cáo lỗi](../basics/02-bug-report-template/), mục Browser Versions).
4. Với responsive/mobile, dùng Chrome DevTools **Device Toolbar** (`Ctrl+Shift+M` / `Cmd+Shift+M`) để giả lập nhanh nhiều kích thước màn hình trước khi test trên thiết bị thật.

## 4. Các lỗi thường gặp

| Loại lỗi | Ví dụ |
|----------|-------|
| **CSS render khác nhau** | Flexbox/Grid căn lệch trên Safari, box-shadow hiển thị khác trên Firefox |
| **JS API không được hỗ trợ** | Dùng một API JavaScript mới mà Safari cũ chưa hỗ trợ, gây lỗi console và tính năng không chạy |
| **Responsive breakpoint bị vỡ** | Menu điều hướng chồng lên nội dung ở độ rộng màn hình trung gian (ví dụ tablet 768px) |
| **Font/icon không hiển thị** | Icon bị vỡ (hiện ô vuông) trên trình duyệt không hỗ trợ đúng font icon |
| **Input date/file khác nhau giữa OS** | Giao diện chọn ngày/chọn file trên iOS Safari khác hẳn Windows Chrome, cần test riêng luồng thao tác |
| **Thao tác chuột không có trên mobile** | Tính năng chỉ dùng hover hoặc kéo-thả (drag-and-drop) sẽ không hoạt động trên màn hình cảm ứng nếu không có phương án thay thế |

## 5. Checklist Compatibility Testing

- [ ] Đã test trên Chrome (Desktop + Mobile)
- [ ] Đã test trên Safari (Desktop Mac + iOS nếu tính năng liên quan đến mobile)
- [ ] Đã test trên Firefox
- [ ] Đã test trên Edge (nếu người dùng doanh nghiệp dùng Windows)
- [ ] Đã kiểm tra responsive ở ít nhất 3 mốc: mobile (~375px), tablet (~768px), desktop (~1440px)
- [ ] Đã kiểm tra các thao tác chỉ có trên desktop (hover, kéo-thả) có phương án thay thế hợp lý trên mobile
- [ ] Đã ghi rõ version trình duyệt/OS trong mọi bug report liên quan đến compatibility

## 6. Bài tập thực hành

1. Mở trang Dashboard của HR Tool trên Staging bằng Chrome DevTools Device Toolbar, thử 3 kích thước: 375px, 768px, 1440px — ghi lại bất kỳ điểm bất thường nào về layout.
2. So sánh giao diện trang Login trên 2 trình duyệt khác nhau (ví dụ Chrome và Safari/Firefox) — có khác biệt nào về font, spacing, hay hành vi không?
3. Với tính năng kéo-thả Kanban trong ATS Pipeline, đề xuất phương án test thay thế phù hợp khi dùng trên thiết bị cảm ứng (không có chuột).
4. Viết một bug report mẫu cho lỗi compatibility giả định (ví dụ nút bị che khuất trên Safari) theo đúng template đã học.

## Bước tiếp theo

Tiếp tục với [Usability & Accessibility Testing](./09-usability-accessibility-testing/).

---

**Cần giúp đỡ?** Liên hệ QC Lead hoặc đăng trong #qc-team
