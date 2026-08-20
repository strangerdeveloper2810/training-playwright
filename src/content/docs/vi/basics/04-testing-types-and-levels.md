---
title: Các loại và Cấp độ Testing
description: Phân loại testing theo chức năng, cấp độ và kỹ thuật kiểm thử - kiến thức nền tảng cho QC
---

# Các loại và Cấp độ Testing

Tài liệu đào tạo QC - HR Tool

**Phiên bản:** 1.0
**Cập nhật:** 20/08/2026
**Tác giả:** QC Team

---

## Mục lục

1. [Vì sao cần phân loại Testing](#1-vì-sao-cần-phân-loại-testing)
2. [Cấp độ Testing (Test Level)](#2-cấp-độ-testing-test-level)
3. [Functional Testing chi tiết](#3-functional-testing-chi-tiết)
4. [Non-Functional Testing chi tiết](#4-non-functional-testing-chi-tiết)
5. [Testing theo kỹ thuật: Black-box, White-box, Grey-box](#5-testing-theo-kỹ-thuật-black-box-white-box-grey-box)
6. [Smoke vs Sanity vs Regression vs Retesting](#6-smoke-vs-sanity-vs-regression-vs-retesting)
7. [Bảng tổng hợp](#7-bảng-tổng-hợp)

---

## 1. Vì sao cần phân loại Testing

Ở bài [QC Fundamentals](./01-fundamentals/), bạn đã biết testing gồm nhiều loại: functional, non-functional, smoke, regression... Nhưng nếu chỉ nhớ tên mà không hiểu bản chất, bạn sẽ dễ nhầm lẫn khi lập kế hoạch test hoặc khi bị hỏi "test này thuộc loại gì?" trong buổi review.

Bài này hệ thống hoá lại toàn bộ cách phân loại testing theo 3 góc nhìn khác nhau, để bạn có một bản đồ tư duy đầy đủ:

- **Theo cấp độ** (Test Level) — testing xảy ra ở giai đoạn nào của vòng đời phát hiện triển phần mềm.
- **Theo mục tiêu** (Functional vs Non-functional) — testing kiểm tra "làm đúng chức năng" hay "làm tốt về mặt kỹ thuật/trải nghiệm".
- **Theo kỹ thuật tiếp cận** (Black-box/White-box/Grey-box) — người test có nhìn thấy code bên trong hay không.

:::note[Mẹo]
Ba góc nhìn này không loại trừ nhau. Một test case cụ thể có thể vừa là System Testing (cấp độ), vừa là Functional Testing (mục tiêu), vừa là Black-box Testing (kỹ thuật) — cùng lúc.
:::

---

## 2. Cấp độ Testing (Test Level)

Test Level mô tả testing diễn ra ở "lớp" nào của hệ thống, theo thứ tự từ nhỏ đến lớn:

```
Unit Testing
    ↓ (từng hàm/module riêng lẻ)
Integration Testing
    ↓ (nhiều module ghép lại)
System Testing
    ↓ (toàn bộ hệ thống, end-to-end)
Acceptance Testing (UAT)
    ↓ (khách hàng/stakeholder xác nhận)
```

| Cấp độ | Kiểm tra gì | Ai thực hiện | Ví dụ với HR Tool |
|--------|-------------|---------------|--------------------|
| **Unit Testing** | Một hàm/method riêng lẻ có hoạt động đúng logic không, tách biệt hoàn toàn khỏi phần còn lại của hệ thống | Developer | Hàm tính điểm match CV-JD trả về đúng % khi truyền vào 2 bộ kỹ năng cụ thể |
| **Integration Testing** | Nhiều module/service khi ghép lại có hoạt động đúng không (API gọi Database, Backend gọi AI provider...) | Developer, đôi khi có QC | Router `candidate.create` có lưu đúng dữ liệu vào PostgreSQL và trigger đúng job matching trong BullMQ không |
| **System Testing** | Toàn bộ hệ thống từ giao diện đến backend, theo đúng luồng người dùng thật | QC | Đăng nhập → Tạo Job → Tạo Candidate → Xem điểm CV Matching → Chuyển Candidate qua các bước ATS |
| **Acceptance Testing (UAT)** | Hệ thống có đáp ứng đúng nhu cầu nghiệp vụ của khách hàng/stakeholder không | BA, Product Owner, khách hàng, có QC hỗ trợ | Khách hàng (agency tuyển dụng) thử nghiệm quy trình Client Requisition Portal trước khi go-live |

:::tip[Vì sao QC cần biết cả Unit/Integration Testing]
Dù QC thường tập trung ở System Testing và UAT, hiểu được Unit/Integration Testing giúp bạn: (1) biết developer đã test đến đâu để không lãng phí thời gian test lại logic đơn giản, (2) viết bug report chính xác hơn khi biết lỗi có thể nằm ở tầng nào, (3) dễ tiếp cận automation testing sau này (unit test là nền tảng để hiểu Playwright test).
:::

---

## 3. Functional Testing chi tiết

Functional Testing trả lời câu hỏi: **"Chức năng có hoạt động đúng theo yêu cầu không?"** Đây là loại testing QC làm nhiều nhất hàng ngày.

| Loại | Mô tả | Ví dụ HR Tool |
|------|-------|---------------|
| **Unit Function Testing** | Test một chức năng đơn lẻ, độc lập | Form đăng nhập chỉ test riêng việc nhập email/password |
| **Integration Function Testing** | Test sự tương tác giữa các chức năng | Tạo Job xong → Job có xuất hiện đúng trong danh sách để Candidate apply không |
| **Regression Testing** | Test lại các chức năng cũ sau khi có thay đổi, đảm bảo không bị lỗi phát sinh (xem chi tiết ở [Regression Checklist](../practice/05-regression-test-checklist/)) | Sau khi sửa lỗi CV Matching, test lại toàn bộ luồng ATS xem có bị ảnh hưởng không |
| **Smoke Testing** | Test nhanh các luồng quan trọng nhất sau deploy, để quyết định có nên test sâu hơn không (xem [Smoke Checklist](../practice/03-smoke-test-checklist/)) | Sau khi deploy Staging, kiểm tra login + dashboard + tạo Job có chạy được không trong 10 phút |
| **Sanity Testing** | Test tập trung, hẹp, vào đúng phần vừa được sửa | Dev báo đã fix lỗi "không upload được CV quá 5MB" → chỉ test lại đúng luồng upload CV |

---

## 4. Non-Functional Testing chi tiết

Non-Functional Testing trả lời câu hỏi: **"Hệ thống hoạt động TỐT NHƯ THẾ NÀO?"** — không phải đúng/sai chức năng, mà là chất lượng tổng thể.

| Loại | Câu hỏi trọng tâm | Ví dụ HR Tool | Bài học chi tiết |
|------|--------------------|----------------|-------------------|
| **Performance Testing** | Hệ thống phản hồi nhanh không, chịu tải được bao nhiêu người dùng? | Trang Dashboard load bao lâu khi công ty có 10,000 Candidate? | [Performance Testing - Khái niệm](../practice/10-performance-testing-khai-niem/) |
| **Security Testing** | Dữ liệu có được bảo vệ đúng cách không, có lỗ hổng bị khai thác không? | Company A có thể xem được dữ liệu Candidate của Company B không (vi phạm multi-tenant)? | [Security Testing Cơ bản](../practice/11-security-testing-co-ban/) |
| **Usability Testing** | Người dùng có dễ dùng, dễ hiểu giao diện không? | HR mới vào công ty có tự tìm được nút "Tạo Job" mà không cần hướng dẫn không? | [Usability & Accessibility](../practice/09-usability-accessibility-testing/) |
| **Compatibility Testing** | Có hoạt động đúng trên nhiều browser/device/OS khác nhau không? | Kanban board ATS có kéo-thả được trên Safari lẫn Chrome không? | [Cross-browser Compatibility](../practice/08-cross-browser-compatibility/) |
| **Accessibility Testing** | Người khuyết tật (khiếm thị, khó khăn vận động...) có sử dụng được không? | Điều hướng toàn bộ form tạo Job chỉ bằng bàn phím (Tab, Enter) có được không? | [Usability & Accessibility](../practice/09-usability-accessibility-testing/) |
| **Localization/i18n Testing** | Nội dung hiển thị đúng theo từng ngôn ngữ/vùng miền không? | HR Tool có bản dịch Anh (`en/`) và Việt (`vi/`) — chuyển ngôn ngữ có bị thiếu chữ, vỡ layout, hay còn sót tiếng Anh trong bản Việt không? | (thuộc phạm vi Compatibility/Usability) |

:::caution[Ví dụ thật về Localization tại HR Tool]
HR Tool là dự án song ngữ (locales `en/` và `vi/` cho từng domain trong `apps/web/src/locales/`). Đây là một dạng lỗi rất thường gặp trong thực tế: một tính năng mới ra mắt có bản dịch tiếng Anh đầy đủ nhưng bản tiếng Việt bị thiếu, hoặc ngược lại — nếu không kiểm tra kỹ, bug này rất dễ lọt qua smoke test thông thường vì giao diện "vẫn chạy", chỉ là hiển thị sai ngôn ngữ.
:::

---

## 5. Testing theo kỹ thuật: Black-box, White-box, Grey-box

Đây là góc nhìn phân loại theo **mức độ bạn nhìn thấy code bên trong** khi test:

| Kỹ thuật | Có nhìn thấy code không? | Đặc điểm | Ai thường làm |
|----------|---------------------------|----------|----------------|
| **Black-box Testing** | Không | Chỉ test qua giao diện/API như một người dùng thật, không quan tâm code viết thế nào bên trong | QC (phần lớn công việc hàng ngày) |
| **White-box Testing** | Có | Biết rõ code, test dựa trên logic nội bộ, luồng điều kiện (if/else), coverage của từng dòng code | Developer (unit test) |
| **Grey-box Testing** | Một phần | Biết sơ bộ kiến trúc/luồng dữ liệu (vd biết API endpoint, biết schema DB) nhưng không đọc từng dòng code, dùng hiểu biết đó để test hiệu quả hơn | QC có kinh nghiệm, automation tester |

:::tip[Vì sao Grey-box quan trọng với Fullstack Tester]
Khi bạn học thêm về kiến trúc hệ thống ([Nền tảng full-stack](../foundations/01-kien-truc-fullstack-cho-tester/)), biết cách đọc dữ liệu trong Database ([Database cơ bản](../foundations/03-database-co-ban-cho-tester/)), bạn dần chuyển từ Black-box sang Grey-box Testing — test hiệu quả hơn nhiều vì biết chính xác nên kiểm tra ở đâu khi nghi ngờ có lỗi.
:::

---

## 6. Smoke vs Sanity vs Regression vs Retesting

Bốn thuật ngữ này hay bị nhầm lẫn nhất. Bảng dưới đây phân biệt rõ:

| Thuật ngữ | Phạm vi | Khi nào làm | Mục tiêu |
|-----------|---------|--------------|----------|
| **Smoke Testing** | Rộng nhưng hời hợt — chỉ test các luồng quan trọng nhất | Ngay sau khi deploy | Quyết định "bản build này có đáng để test sâu hơn không" |
| **Sanity Testing** | Hẹp, tập trung vào 1 khu vực cụ thể vừa thay đổi | Sau khi nhận thông báo đã fix 1 bug/feature cụ thể | Xác nhận nhanh thay đổi đó hoạt động đúng, không cần test toàn diện |
| **Regression Testing** | Rộng và sâu — test lại các chức năng liên quan (cũ + mới) | Trước khi release, hoặc sau một thay đổi lớn ảnh hưởng nhiều module | Đảm bảo thay đổi mới không làm hỏng chức năng cũ đã hoạt động tốt trước đó |
| **Retesting** | Chỉ đúng 1 bug cụ thể đã báo trước đó | Sau khi dev confirm đã fix 1 bug ticket | Xác nhận CHÍNH bug đó đã được fix (không quan tâm phần khác) |

**Ví dụ minh hoạ bằng một tình huống HR Tool:**

1. Dev fix xong bug "Không thể xoá Job đã có Candidate ứng tuyển" (ticket SCRUM-120).
2. QC làm **Retesting**: chỉ thử lại đúng bug đó — xoá 1 Job có Candidate ứng tuyển, xem còn lỗi không.
3. Vì thay đổi này động vào logic xoá dữ liệu, QC làm thêm **Sanity Testing**: thử xoá Job không có Candidate, thử xoá Candidate, xem các luồng liên quan gần đó có ổn không.
4. Trước khi release lên Production, QC làm **Regression Testing** đầy đủ theo [Regression Checklist](../practice/05-regression-test-checklist/): test lại toàn bộ module Jobs, Candidates, Applications để chắc chắn không có gì bị ảnh hưởng ngoài dự kiến.
5. Sau khi deploy Production, QC làm **Smoke Testing**: kiểm tra nhanh login, dashboard, các luồng chính còn sống không.

---

## 7. Bảng tổng hợp

| Góc nhìn | Các loại |
|----------|----------|
| Theo cấp độ | Unit → Integration → System → Acceptance |
| Theo mục tiêu (Functional) | Smoke, Sanity, Regression, Retesting, Integration Function Testing |
| Theo mục tiêu (Non-functional) | Performance, Security, Usability, Compatibility, Accessibility, Localization |
| Theo kỹ thuật | Black-box, White-box, Grey-box |

:::note[Ghi nhớ]
Một test case thật, ví dụ "Kiểm tra tạo Job mới với salary min > salary max phải hiển thị lỗi validate", có thể được gọi là: **System-level, Functional, Black-box test case, thuộc nhóm Regression suite**. Bốn nhãn này mô tả 4 khía cạnh khác nhau của CÙNG một test case — không mâu thuẫn nhau.
:::

---

## Bài tập thực hành

1. Liệt kê 3 test case bạn đã từng viết hoặc thực hiện (hoặc tự nghĩ ra cho HR Tool). Với mỗi test case, xác định: cấp độ (Unit/Integration/System/UAT), có phải Functional hay Non-functional, và là Black-box/White-box/Grey-box.
2. Một tính năng "Xuất báo cáo Excel danh sách Candidate" được release. Bạn sẽ áp dụng loại testing nào TRƯỚC (smoke/sanity/regression) và loại nào SAU khi release lên production? Giải thích thứ tự bạn chọn.
3. Tìm một ví dụ lỗi Localization thực tế (có thể là trên bất kỳ website nào bạn từng dùng, không nhất thiết là HR Tool) — mô tả lỗi đó và giải thích vì sao nó dễ bị bỏ sót nếu chỉ test bằng tiếng Anh hoặc chỉ bằng tiếng Việt.
4. Giải thích bằng lời của bạn: vì sao Grey-box Testing giúp QC làm việc hiệu quả hơn so với chỉ làm Black-box Testing?

---

## Bước tiếp theo

Tiếp tục với [Kỹ thuật thiết kế Test Case](./05-test-design-techniques/) để học cách THIẾT KẾ test case một cách có hệ thống, thay vì chỉ nghĩ ngẫu nhiên.

---

**Cần giúp đỡ?** Liên hệ QC Lead hoặc đăng trong #qc-team
