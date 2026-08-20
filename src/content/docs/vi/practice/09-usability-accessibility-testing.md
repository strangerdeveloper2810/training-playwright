---
title: Usability & Accessibility Testing
description: Hướng dẫn kiểm thử tính dễ dùng và khả năng truy cập (accessibility) cho HR Tool
---

# Usability & Accessibility Testing

Tài liệu đào tạo QC - HR Tool

Một tính năng "chạy đúng" chưa chắc là một tính năng "dùng tốt". Bài này giới thiệu hai khía cạnh non-functional quan trọng: **Usability** (trải nghiệm dễ dùng) và **Accessibility** (khả năng sử dụng được cho người khuyết tật/hạn chế).

## Mục lục

1. [Usability Testing](#1-usability-testing)
2. [10 nguyên tắc Usability của Nielsen (rút gọn)](#2-10-nguyên-tắc-usability-của-nielsen-rút-gọn)
3. [Accessibility Testing là gì](#3-accessibility-testing-là-gì)
4. [Các tiêu chí WCAG cơ bản cần kiểm tra](#4-các-tiêu-chí-wcag-cơ-bản-cần-kiểm-tra)
5. [Cách tự kiểm tra nhanh bằng công cụ](#5-cách-tự-kiểm-tra-nhanh-bằng-công-cụ)
6. [Bài tập thực hành](#6-bài-tập-thực-hành)

---

## 1. Usability Testing

Usability Testing kiểm tra xem người dùng có thể hoàn thành mục tiêu của họ **một cách dễ dàng, hiệu quả và không gây khó chịu** hay không. QC không cần là chuyên gia UX, nhưng nên có phản xạ nhận ra các vấn đề usability rõ ràng khi test functional.

Câu hỏi QC nên tự hỏi khi test bất kỳ tính năng nào:

- Người dùng lần đầu có hiểu ngay phải làm gì không, hay cần đọc hướng dẫn?
- Có bao nhiêu bước/click để hoàn thành một tác vụ? Có thể giảm bớt không?
- Thông báo lỗi có rõ ràng, hướng dẫn được người dùng sửa lỗi không, hay chỉ nói "Có lỗi xảy ra"?
- Các hành động quan trọng (xoá, submit) có yêu cầu xác nhận để tránh bấm nhầm không?

## 2. 10 nguyên tắc Usability của Nielsen (rút gọn)

| # | Nguyên tắc | Áp dụng khi test |
|---|-----------|-------------------|
| 1 | Hiển thị trạng thái hệ thống | Sau khi bấm "Lưu", có loading spinner/thông báo rõ ràng không? |
| 2 | Khớp với thực tế người dùng | Thuật ngữ dùng trong app có dễ hiểu với HR, không quá kỹ thuật? |
| 3 | Người dùng kiểm soát được | Có nút Hủy/Quay lại khi đang thực hiện thao tác dài không? |
| 4 | Nhất quán & theo chuẩn | Nút "Lưu" có luôn ở cùng vị trí, cùng màu xuyên suốt app không? |
| 5 | Ngăn ngừa lỗi | Form có validate trước khi submit, tránh để user submit sai rồi mới báo lỗi? |
| 6 | Ghi nhớ hơn phải nhớ | Danh sách filter đã chọn có được giữ lại khi quay lại trang không? |
| 7 | Linh hoạt & hiệu quả | Có phím tắt/thao tác hàng loạt (bulk action) cho user quen dùng không? |
| 8 | Thiết kế tối giản | Trang có bị quá tải thông tin không cần thiết không? |
| 9 | Giúp nhận diện & khắc phục lỗi | Message lỗi có nói rõ "tại sao" và "cách sửa" không? |
| 10 | Trợ giúp & tài liệu | Có tooltip/hướng dẫn cho các tính năng phức tạp (như CV Matching) không? |

## 3. Accessibility Testing là gì

Accessibility (thường viết tắt **a11y**) đảm bảo phần mềm có thể dùng được bởi người khuyết tật: khiếm thị (dùng screen reader), khó khăn vận động (chỉ dùng bàn phím, không dùng chuột), khiếm thị màu (color blindness), v.v. Tiêu chuẩn phổ biến nhất là **WCAG** (Web Content Accessibility Guidelines).

Đây không chỉ là vấn đề đạo đức — nhiều tổ chức khách hàng của HR Tool (đặc biệt là doanh nghiệp lớn, cơ quan nhà nước) yêu cầu tuân thủ accessibility như một điều kiện hợp đồng.

## 4. Các tiêu chí WCAG cơ bản cần kiểm tra

| Tiêu chí | Ý nghĩa | Cách test nhanh |
|----------|---------|------------------|
| **Contrast ratio** | Độ tương phản chữ/nền đủ để đọc rõ (tối thiểu 4.5:1 với chữ thường) | Dùng Lighthouse hoặc extension kiểm tra contrast |
| **Keyboard navigation** | Mọi chức năng dùng được chỉ bằng bàn phím (Tab, Enter, Space, Esc) | Bỏ chuột, dùng `Tab` để di chuyển qua toàn bộ form/nút |
| **Tab order hợp lý** | Thứ tự `Tab` đi theo đúng logic hiển thị trên màn hình | Quan sát khi nhấn `Tab` liên tục, có "nhảy lộn xộn" không |
| **Alt text cho ảnh** | Ảnh có mô tả để screen reader đọc được | Inspect element, kiểm tra thuộc tính `alt` |
| **ARIA label** | Các phần tử tương tác (icon button không có chữ) có label để screen reader hiểu chức năng | Inspect, tìm `aria-label` |
| **Focus indicator** | Khi `Tab` tới một phần tử, có viền/highlight rõ ràng cho biết đang ở đâu không | Quan sát bằng mắt khi `Tab` |

## 5. Cách tự kiểm tra nhanh bằng công cụ

**Google Lighthouse** (có sẵn trong Chrome DevTools):

1. Mở DevTools (`F12`) → tab **Lighthouse**.
2. Chọn category **Accessibility** (có thể bỏ chọn các category khác để chạy nhanh hơn).
3. Click **Analyze page load**.
4. Đọc điểm số và danh sách vấn đề được liệt kê kèm mức độ ảnh hưởng.

**axe DevTools** (extension trình duyệt, chi tiết hơn Lighthouse):

1. Cài extension "axe DevTools" cho Chrome/Firefox.
2. Mở DevTools → tab **axe DevTools**.
3. Click **Scan ALL of my page**.
4. Xem danh sách lỗi, mỗi lỗi có giải thích rõ vi phạm tiêu chí WCAG nào và gợi ý cách sửa.

:::tip[Mẹo]
Không cần chạy 2 công cụ trên mọi trang. Ưu tiên chạy trên các trang có nhiều tương tác (form tạo Job, Dashboard, ATS Pipeline) — đây là nơi thường phát sinh lỗi accessibility nhất.
:::

## 6. Bài tập thực hành

1. Mở trang Login của HR Tool, thử đăng nhập **chỉ dùng bàn phím** (không chạm chuột) — bạn có hoàn thành được không? Ghi lại nếu có phần tử nào không thể focus tới bằng `Tab`.
2. Chạy Lighthouse Accessibility trên trang Dashboard, ghi lại điểm số và ít nhất 2 vấn đề được liệt kê.
3. Chạy axe DevTools trên trang tạo Job mới, liệt kê các lỗi tìm được (nếu có) và mức độ nghiêm trọng.
4. Áp dụng 3 nguyên tắc Nielsen bất kỳ để đánh giá usability của luồng "Mời thành viên mới" (Invitation) — bạn thấy điểm nào có thể cải thiện?

## Bước tiếp theo

Tiếp tục với [Performance Testing - Khái niệm](./10-performance-testing-khai-niem/).

---

**Cần giúp đỡ?** Liên hệ QC Lead hoặc đăng trong #qc-team
