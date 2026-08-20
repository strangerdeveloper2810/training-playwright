---
title: Viết Test Case & Test Suite chuẩn
description: Cấu trúc test case chuẩn, quy tắc đặt ID, Test Suite và Requirement Traceability Matrix
---

# Viết Test Case & Test Suite chuẩn

Tài liệu đào tạo QC - HR Tool

**Phiên bản:** 1.0
**Cập nhật:** 20/08/2026
**Tác giả:** QC Team

---

## Mục lục

1. [Test Case là gì](#1-test-case-là-gì)
2. [Cấu trúc một Test Case chuẩn](#2-cấu-trúc-một-test-case-chuẩn)
3. [Quy tắc đặt ID Test Case](#3-quy-tắc-đặt-id-test-case)
4. [Ví dụ Test Case hoàn chỉnh](#4-ví-dụ-test-case-hoàn-chỉnh)
5. [Test Suite là gì](#5-test-suite-là-gì)
6. [Requirement Traceability Matrix (RTM)](#6-requirement-traceability-matrix-rtm)
7. [Checklist trước khi hoàn thành Test Case](#7-checklist-trước-khi-hoàn-thành-test-case)

---

## 1. Test Case là gì

Test Case là một tài liệu mô tả **chính xác** cách kiểm tra một chức năng cụ thể: làm gì, với dữ liệu nào, kỳ vọng kết quả gì. Một test case tốt phải đủ rõ ràng để **người khác (không phải người viết) có thể thực hiện đúng y hệt** và ra cùng kết quả.

:::caution[Test case mơ hồ là test case vô dụng]
"Test chức năng đăng nhập" KHÔNG phải là một test case — đó chỉ là một mục tiêu chung. Một test case thật phải nói rõ: đăng nhập với dữ liệu nào, các bước cụ thể ra sao, kỳ vọng điều gì xảy ra.
:::

---

## 2. Cấu trúc một Test Case chuẩn

| Trường | Ý nghĩa | Ví dụ |
|--------|---------|-------|
| **Test Case ID** | Mã định danh duy nhất | `TC-JOB-001` |
| **Title/Objective** | Mục tiêu ngắn gọn của test case | Kiểm tra tạo Job mới với dữ liệu hợp lệ |
| **Module/Feature** | Chức năng thuộc module nào | Jobs |
| **Preconditions** | Điều kiện phải có TRƯỚC khi thực hiện test | Đã đăng nhập với role `hr`, đã có ít nhất 1 Department |
| **Test Steps** | Các bước thực hiện, theo thứ tự, đủ chi tiết để người khác làm theo được | 1. Vào menu Jobs 2. Click "Tạo Job mới" 3. Điền... |
| **Test Data** | Dữ liệu cụ thể dùng trong test | Title: "Senior Backend Engineer", Salary: 30-50 triệu |
| **Expected Result** | Kết quả PHẢI xảy ra nếu hệ thống đúng | Job được tạo thành công, hiển thị trong danh sách với trạng thái "Draft" |
| **Actual Result** | Kết quả THỰC TẾ quan sát được khi thực hiện (điền khi run test) | (điền sau khi test) |
| **Status** | Pass / Fail / Blocked / Not Run | Pass |
| **Priority** | Mức độ quan trọng: High/Medium/Low | High |
| **Type** | Positive (dữ liệu hợp lệ) hoặc Negative (dữ liệu không hợp lệ, test lỗi) | Positive |

---

## 3. Quy tắc đặt ID Test Case

Một quy ước phổ biến và dễ tra cứu:

```
TC-[MODULE]-[SỐ THỨ TỰ]
```

Ví dụ áp dụng cho HR Tool:

| Module | Prefix | Ví dụ ID |
|--------|--------|----------|
| Authentication | `AUTH` | `TC-AUTH-001` |
| Jobs | `JOB` | `TC-JOB-001` |
| Candidates | `CAND` | `TC-CAND-001` |
| Applications (ATS) | `APP` | `TC-APP-001` |
| Interviews | `INT` | `TC-INT-001` |
| CV Matching | `CVM` | `TC-CVM-001` |
| Referral/CTV | `REF` | `TC-REF-001` |

:::tip[Mẹo đặt số thứ tự]
Đánh số cách nhau (001, 010, 020...) hoặc theo nhóm chức năng con (ví dụ `TC-JOB-1xx` cho Create, `TC-JOB-2xx` cho Update, `TC-JOB-3xx` cho Delete) để dễ chèn thêm test case mới ở giữa mà không phải đánh số lại toàn bộ.
:::

---

## 4. Ví dụ Test Case hoàn chỉnh

**Test Case ID:** `TC-JOB-001`

**Title:** Kiểm tra tạo Job mới thành công với dữ liệu hợp lệ

**Module:** Jobs

**Priority:** High

**Type:** Positive

**Preconditions:**
- Đã đăng nhập vào Staging (`https://hr-tool-software.netlify.app`) với role `hr`
- Company đã có sẵn ít nhất 1 Department (ví dụ "Engineering")

**Test Steps:**

| # | Bước thực hiện | Kết quả kỳ vọng của bước |
|---|------------------|-----------------------------|
| 1 | Vào menu **Jobs** | Hiển thị danh sách Job hiện có |
| 2 | Click nút **"Tạo Job mới"** | Hiển thị form tạo Job |
| 3 | Điền Title: `Senior Backend Engineer` | Field nhận giá trị đúng |
| 4 | Chọn Department: `Engineering` | Dropdown hiển thị đúng danh sách department |
| 5 | Điền Salary Min: `30000000`, Salary Max: `50000000` | Field nhận giá trị đúng |
| 6 | Click **"Lưu"** | — |

**Test Data:**
```
Title: Senior Backend Engineer
Department: Engineering
Salary Min: 30,000,000 VNĐ
Salary Max: 50,000,000 VNĐ
Experience Required: 3 năm
```

**Expected Result:**
- Job được tạo thành công, hệ thống hiển thị thông báo "Tạo Job thành công"
- Job mới xuất hiện trong danh sách Jobs với trạng thái mặc định (ví dụ "Draft" hoặc "Open" theo quy tắc nghiệp vụ)
- Các thông tin hiển thị đúng khớp với dữ liệu đã nhập

**Actual Result:** _(điền khi thực hiện test)_

**Status:** _(Pass / Fail / Blocked)_

---

## 5. Test Suite là gì

**Test Suite** là một tập hợp các Test Case có liên quan, được nhóm lại để chạy/quản lý cùng nhau — thường theo module, theo loại testing, hoặc theo release.

| Loại nhóm | Ví dụ |
|-----------|-------|
| Theo module | "Test Suite - Jobs Module" gồm toàn bộ TC-JOB-* |
| Theo loại testing | "Smoke Test Suite" gồm các test case tối quan trọng của nhiều module |
| Theo release | "Regression Suite - Release v2.5" gồm các test case cần chạy lại trước khi release v2.5 |

**Test Set** là một khái niệm gần giống Test Suite nhưng thường dùng để chỉ **một lần thực thi cụ thể** của một Test Suite (ví dụ: "Test Set - Regression Run #14, ngày 20/08/2026").

---

## 6. Requirement Traceability Matrix (RTM)

**RTM** là bảng liên kết giữa **Yêu cầu nghiệp vụ (Requirement)** và **Test Case** kiểm tra yêu cầu đó — giúp trả lời 2 câu hỏi quan trọng:

1. "Yêu cầu này đã có test case chưa?" (tránh sót yêu cầu chưa được test)
2. "Nếu yêu cầu này thay đổi, những test case nào cần xem lại?" (tránh sót test case khi có thay đổi)

**Ví dụ RTM rút gọn cho tính năng CV Matching:**

| Requirement ID | Mô tả yêu cầu | Test Case liên quan | Trạng thái |
|-----------------|----------------|------------------------|-------------|
| REQ-CVM-01 | Hệ thống phải chấm điểm match CV-JD theo % dựa trên kỹ năng | TC-CVM-001, TC-CVM-002 | ✅ Đã test |
| REQ-CVM-02 | Hệ thống phải tự sinh gợi ý câu hỏi phỏng vấn theo từng Candidate | TC-CVM-010 | ✅ Đã test |
| REQ-CVM-03 | Nếu AI provider chính (Gemini) lỗi, hệ thống phải tự chuyển sang provider dự phòng (fallback) | _(chưa có test case)_ | ❌ Chưa test — cần bổ sung |

:::caution[RTM giúp phát hiện lỗ hổng test coverage]
Ở ví dụ trên, REQ-CVM-03 chưa có test case nào — đây chính là giá trị lớn nhất của RTM: phát hiện ra những yêu cầu quan trọng (ví dụ liên quan đến độ tin cậy hệ thống) đang bị bỏ sót hoàn toàn trong kế hoạch test.
:::

---

## 7. Checklist trước khi hoàn thành Test Case

- [ ] Title mô tả rõ MỤC TIÊU, không mơ hồ
- [ ] Preconditions đủ để người khác setup được môi trường giống bạn
- [ ] Test Steps đánh số thứ tự, mỗi bước là MỘT hành động cụ thể
- [ ] Test Data cụ thể (không viết "nhập dữ liệu hợp lệ" mà không nói rõ dữ liệu gì)
- [ ] Expected Result rõ ràng, có thể xác nhận Pass/Fail khách quan (không mơ hồ như "hoạt động tốt")
- [ ] Đã gán đúng Priority và Type (Positive/Negative)
- [ ] Test Case ID theo đúng quy ước của team

---

## Bài tập thực hành

1. Viết một Test Case hoàn chỉnh (đầy đủ các trường ở mục 2) cho tính năng "Đăng xuất" của HR Tool.
2. Viết thêm 2 Test Case Negative cho tính năng tạo Job: (a) để trống Title, (b) Salary Min lớn hơn Salary Max.
3. Thiết kế một RTM rút gọn (3-5 dòng) cho tính năng "Mời thành viên qua Invitation" — tự đặt ra 3 requirement hợp lý và gán test case tương ứng.
4. Nhóm 5 test case bạn vừa viết ở bài tập 1-2 (và ví dụ trong bài) thành một Test Suite, đặt tên phù hợp.

---

## Bước tiếp theo

Tiếp tục với [Test Plan & Test Strategy](./07-test-plan-test-strategy/) để học cách lập kế hoạch testing ở tầm rộng hơn (không chỉ 1 test case, mà cả một đợt release).

---

**Cần giúp đỡ?** Liên hệ QC Lead hoặc đăng trong #qc-team
