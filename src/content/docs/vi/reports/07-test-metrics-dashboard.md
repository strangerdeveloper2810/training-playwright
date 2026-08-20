---
title: Test Metrics & Dashboard
description: Các chỉ số QC/QA thường theo dõi và cách trình bày báo cáo dashboard cho sprint/release
---

# Test Metrics & Dashboard

Tài liệu đào tạo QC - HR Tool

Báo cáo test không chỉ là "đã test bao nhiêu case" — stakeholder (PM, CTO, khách hàng) cần những con số phản ánh đúng chất lượng sản phẩm. Bài này giới thiệu các metrics quan trọng và cách trình bày chúng dễ hiểu.

## Mục lục

1. [Vì sao cần metrics, không chỉ báo cáo mô tả](#1-vì-sao-cần-metrics-không-chỉ-báo-cáo-mô-tả)
2. [Các metrics quan trọng](#2-các-metrics-quan-trọng)
3. [Cách trình bày Dashboard báo cáo](#3-cách-trình-bày-dashboard-báo-cáo)
4. [Ví dụ bảng số liệu mẫu](#4-ví-dụ-bảng-số-liệu-mẫu)
5. [Diễn giải số liệu cho stakeholder không rành kỹ thuật](#5-diễn-giải-số-liệu-cho-stakeholder-không-rành-kỹ-thuật)
6. [Bài tập thực hành](#6-bài-tập-thực-hành)

---

## 1. Vì sao cần metrics, không chỉ báo cáo mô tả

Một câu như "Sprint này test ổn, có vài bug nhỏ" không giúp ai ra quyết định. Metrics cụ thể (số liệu) giúp:

- So sánh chất lượng giữa các sprint/release theo thời gian (đang tốt hơn hay tệ hơn?).
- Phát hiện sớm khu vực có rủi ro cao (module nào phát sinh bug nhiều nhất?).
- Có cơ sở khách quan để quyết định release hay trì hoãn.

## 2. Các metrics quan trọng

| Metric | Công thức / Cách tính | Ý nghĩa |
|--------|------------------------|---------|
| **Defect Density** | Số bug tìm được ÷ Số lượng test case (hoặc ÷ kích thước tính năng) | Tính năng nào có tỷ lệ bug cao hơn cần review kỹ hơn trước release |
| **Defect Leakage** | Số bug phát hiện ở Production ÷ Tổng số bug (tìm ở QC + Production) | Đo lường hiệu quả của quy trình test — leakage cao nghĩa là QC đang bỏ lỡ nhiều bug |
| **Test Case Pass Rate** | Số test case Pass ÷ Tổng số test case đã thực thi | Tỷ lệ phần trăm test case đạt kết quả mong đợi |
| **Test Coverage** | Số tính năng/requirement có test case ÷ Tổng số tính năng/requirement | Đo mức độ tài liệu test đã "phủ" hết yêu cầu chưa (không phải coverage code) |
| **Mean Time To Detect (MTTD)** | Thời gian trung bình từ khi bug được đưa vào code đến khi bị phát hiện | MTTD cao nghĩa là bug tồn tại lâu trước khi bị bắt, có thể ảnh hưởng nhiều người dùng hơn |
| **Mean Time To Resolve (MTTR)** | Thời gian trung bình từ khi bug được báo cáo đến khi được fix & verify xong | Đo tốc độ phản hồi của team với lỗi phát hiện được |

## 3. Cách trình bày Dashboard báo cáo

Một dashboard báo cáo tuần/sprint/release nên có tối thiểu:

1. **Tổng quan nhanh** (3-5 số liệu chính, dễ nhìn nhất): tổng test case, pass rate, số bug mới, số bug còn mở theo priority.
2. **Biểu đồ xu hướng** (nếu có thể): pass rate hoặc số bug qua các sprint gần nhất, để thấy xu hướng tăng/giảm.
3. **Phân loại bug theo module**: giúp nhìn ra module nào đang "nóng" (nhiều bug).
4. **Danh sách rủi ro/blocker**: bug Critical/High còn mở, có thể ảnh hưởng đến quyết định release.

:::tip[Công cụ]
Nếu team dùng JIRA, phần lớn các số liệu này có thể lấy trực tiếp từ JIRA Dashboard/JQL filter, không cần tính tay. QC Lead có thể hướng dẫn cách thiết lập filter phù hợp.
:::

## 4. Ví dụ bảng số liệu mẫu

**Báo cáo Sprint 24 — Module CV Matching**

| Chỉ số | Giá trị |
|--------|---------|
| Tổng số test case thực thi | 85 |
| Test case Pass | 78 |
| Test case Fail | 7 |
| **Pass Rate** | 91.8% |
| Bug mới phát hiện | 9 |
| Bug Critical/High | 2 |
| Bug đã fix & verify | 6 |
| Bug còn mở | 3 |
| **Defect Density** | 9 ÷ 85 ≈ 0.11 bug/test case |

## 5. Diễn giải số liệu cho stakeholder không rành kỹ thuật

Khi trình bày cho PM/khách hàng, đừng chỉ đưa số liệu thô — hãy kèm 1 câu diễn giải ý nghĩa thực tế:

> "Pass rate 91.8% — cao hơn sprint trước (87%), nhưng còn 2 bug Critical liên quan tới việc tính điểm CV Matching bị sai ở một số trường hợp đặc biệt. Đề xuất **chưa release** module này cho đến khi 2 bug Critical được fix & verify."

Nguyên tắc: luôn gắn số liệu với **khuyến nghị hành động cụ thể** (release/không release, cần thêm thời gian test, cần dev ưu tiên fix module nào) — đây là giá trị thật của báo cáo, không phải chỉ là con số.

## 6. Bài tập thực hành

1. Từ một sprint testing gần nhất bạn tham gia (hoặc dữ liệu giả định), tính thử Pass Rate và Defect Density theo công thức đã học.
2. Giải thích sự khác biệt giữa Defect Density và Defect Leakage — vì sao 2 số liệu này đo 2 khía cạnh khác nhau của chất lượng.
3. Viết một đoạn diễn giải ngắn (3-4 câu) cho PM về kết quả test một module, kèm khuyến nghị release/không release.
4. Đề xuất 3 số liệu bạn nghĩ là quan trọng nhất để đưa vào "Tổng quan nhanh" của dashboard báo cáo hàng tuần cho HR Tool.

## Bước tiếp theo

Quay lại [Test Report Templates](./06-test-report-template/) để xem template báo cáo đầy đủ, hoặc tiếp tục sang lộ trình [Automation Testing](../automation/01-vi-sao-automation-test-pyramid/).

---

**Cần giúp đỡ?** Liên hệ QC Lead hoặc đăng trong #qc-team
