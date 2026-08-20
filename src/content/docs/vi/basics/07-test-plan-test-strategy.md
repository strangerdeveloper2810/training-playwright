---
title: Test Plan & Test Strategy
description: Cách lập Test Plan, phân biệt với Test Strategy, và Risk-based Testing
---

# Test Plan & Test Strategy

Tài liệu đào tạo QC - HR Tool

**Phiên bản:** 1.0
**Cập nhật:** 20/08/2026
**Tác giả:** QC Team

---

## Mục lục

1. [Test Plan là gì](#1-test-plan-là-gì)
2. [Các thành phần của một Test Plan](#2-các-thành-phần-của-một-test-plan)
3. [Test Strategy khác Test Plan thế nào](#3-test-strategy-khác-test-plan-thế-nào)
4. [Risk-based Testing](#4-risk-based-testing)
5. [Ví dụ Test Plan rút gọn](#5-ví-dụ-test-plan-rút-gọn)
6. [Khi nào cần viết Test Plan đầy đủ, khi nào không cần](#6-khi-nào-cần-viết-test-plan-đầy-đủ-khi-nào-không-cần)

---

## 1. Test Plan là gì

**Test Plan** là tài liệu mô tả: **sẽ test cái gì, test như thế nào, ai làm, khi nào xong, và rủi ro nào cần lưu ý** — cho một phạm vi công việc cụ thể (một sprint, một feature, một release). Nó là bản kế hoạch, tương tự như bản thiết kế trước khi xây nhà, giúp cả team (QC, Dev, PM) đồng thuận về phạm vi và kỳ vọng testing trước khi bắt tay vào làm.

Không có Test Plan, QC dễ rơi vào tình trạng: không rõ nên test đến đâu là "đủ", không biết ai chịu trách nhiệm phần nào, và dễ bỏ sót rủi ro quan trọng.

---

## 2. Các thành phần của một Test Plan

| Thành phần | Trả lời câu hỏi | Ví dụ |
|------------|-------------------|-------|
| **Scope (Phạm vi)** | Test cái gì, KHÔNG test cái gì? | Test module CV Matching mới; KHÔNG test lại toàn bộ Authentication (đã stable, không thay đổi) |
| **Objectives (Mục tiêu)** | Vì sao cần test đợt này? | Đảm bảo tính năng AI matching mới không có lỗi chức năng nghiêm trọng trước khi ra mắt khách hàng |
| **Test Items (Đối tượng test)** | Những tính năng/module cụ thể nào sẽ được test? | CV-JD scoring, gợi ý câu hỏi phỏng vấn, 2-tier recommendation |
| **Approach (Phương pháp)** | Test bằng cách nào — manual, automation, hay cả hai? | Manual testing cho luồng chính + Exploratory Testing cho các trường hợp AI trả kết quả bất thường |
| **Entry Criteria (Điều kiện bắt đầu)** | Khi nào ĐƯỢC BẮT ĐẦU test? | Build đã deploy lên Staging thành công, Dev đã tự test qua (self-test) và xác nhận không có lỗi chặn (blocker) |
| **Exit Criteria (Điều kiện kết thúc)** | Khi nào được coi là ĐÃ TEST XONG, đủ điều kiện release? | 100% test case Priority High đã Pass, không còn bug mức High/Critical mở |
| **Resource & Schedule (Nhân lực & Thời gian)** | Ai làm, trong bao lâu? | 1 QC test trong 3 ngày làm việc |
| **Risk & Contingency (Rủi ro & Phương án dự phòng)** | Rủi ro nào có thể xảy ra, xử lý thế nào? | Nếu AI provider (Gemini) bị rate-limit trong lúc test, chuyển sang test với provider dự phòng (DeepSeek) |

---

## 3. Test Strategy khác Test Plan thế nào

Đây là điểm hay bị nhầm lẫn nhất:

| | Test Strategy | Test Plan |
|---|----------------|------------|
| **Phạm vi** | Toàn bộ dự án/công ty, dài hạn | Một sprint/feature/release cụ thể |
| **Tính chất** | Nguyên tắc chung, ít thay đổi | Kế hoạch chi tiết, thay đổi theo từng đợt |
| **Ví dụ nội dung** | "Mọi tính năng liên quan phân quyền multi-tenant phải có test case kiểm tra data isolation giữa các company" | "Sprint 24: test tính năng Client Requisition Portal, hoàn thành trước ngày 25/08" |
| **Ai lập** | QC Lead / Test Manager, thường lập 1 lần và áp dụng lâu dài | QC thực hiện test đó, lập lại cho mỗi đợt |

Nói đơn giản: **Test Strategy là "luật chơi chung"**, còn **Test Plan là "kế hoạch cho một trận đấu cụ thể"** tuân theo luật chơi đó.

---

## 4. Risk-based Testing

**Risk-based Testing** là cách ưu tiên test dựa trên **mức độ rủi ro** (khả năng xảy ra lỗi × mức độ ảnh hưởng nếu lỗi xảy ra), thay vì test đều tay cho mọi tính năng.

**Công thức đơn giản:**

```
Mức độ rủi ro = Khả năng xảy ra lỗi × Mức độ ảnh hưởng nếu lỗi xảy ra
```

**Ví dụ áp dụng cho các module của HR Tool:**

| Module/Tính năng | Khả năng lỗi | Ảnh hưởng nếu lỗi | Mức độ rủi ro | Ưu tiên test |
|--------------------|:---:|:---:|:---:|:---:|
| Multi-tenant data isolation (company A thấy dữ liệu company B) | Trung bình | Rất cao (lộ dữ liệu khách hàng, vi phạm bảo mật nghiêm trọng) | **Rất cao** | 1 |
| Đăng nhập/Đăng xuất | Thấp (ít thay đổi) | Cao (chặn toàn bộ user) | Cao | 2 |
| Xuất báo cáo Excel | Trung bình | Thấp (không chặn công việc chính) | Thấp | 4 |
| Đổi màu theme giao diện | Thấp | Rất thấp | Rất thấp | 5 |
| AI CV-JD Matching cho ra điểm sai | Trung bình-cao (logic AI phức tạp) | Cao (ảnh hưởng quyết định tuyển dụng) | Cao | 2 |

→ Với nguồn lực QC có hạn, Risk-based Testing giúp bạn trả lời được câu hỏi quan trọng nhất: **"Nếu chỉ có thời gian test một phần, nên test phần nào trước?"**

---

## 5. Ví dụ Test Plan rút gọn

**Test Plan: Sprint 24 - Tính năng CV Matching v2**

| Mục | Nội dung |
|-----|----------|
| **Scope** | Test module CV-JD Matching mới (đa AI provider), gồm: chấm điểm chi tiết, gợi ý câu hỏi phỏng vấn, cơ chế fallback giữa các AI provider |
| **Objectives** | Đảm bảo tính năng hoạt động đúng nghiệp vụ và không làm chậm luồng ATS hiện có |
| **Test Items** | CV-JD scoring engine, Interview question generator, Provider fallback (Gemini → Claude → DeepSeek → Minimax) |
| **Approach** | Functional testing (manual) cho luồng chính; Risk-based Testing ưu tiên test cơ chế fallback (rủi ro cao vì phụ thuộc AI); Exploratory Testing 2 giờ cho các CV/JD không chuẩn (ngôn ngữ khác, format lạ) |
| **Entry Criteria** | Build deploy lên Staging, có sẵn ít nhất 20 Candidate và 5 Job mẫu để test |
| **Exit Criteria** | 100% test case Priority High Pass, 0 bug Critical/High mở, đã test được cơ chế fallback ít nhất 1 lần thành công |
| **Resource & Schedule** | 1 QC, 3 ngày làm việc (20-22/08/2026) |
| **Risk & Contingency** | Nếu AI provider bị downtime trong lúc test → ghi nhận, báo cáo Tech Lead, không tính là bug của HR Tool, dời phần test đó sang thời điểm provider hoạt động lại |

---

## 6. Khi nào cần viết Test Plan đầy đủ, khi nào không cần

:::tip[Không phải lúc nào cũng cần Test Plan dài dòng]
Với các thay đổi nhỏ (sửa 1 bug UI đơn giản), viết đầy đủ 8 thành phần Test Plan là lãng phí thời gian — chỉ cần vài dòng Sanity Testing là đủ. Test Plan đầy đủ nên dành cho: tính năng mới quan trọng, thay đổi ảnh hưởng nhiều module, hoặc release lớn.
:::

| Tình huống | Có cần Test Plan đầy đủ? |
|------------|-----------------------------|
| Fix 1 bug nhỏ, không ảnh hưởng module khác | Không — chỉ cần ghi chú Retesting/Sanity ngắn |
| Thêm 1 field mới vào form có sẵn | Không cần đầy đủ, có thể chỉ cần Scope + Test Items ngắn |
| Ra mắt tính năng mới (module mới hoàn toàn) | **Có** — cần đầy đủ, đặc biệt Risk & Entry/Exit Criteria |
| Release lớn có nhiều thay đổi tích lũy (major release) | **Có** — kết hợp với Regression Testing đầy đủ |

---

## Bài tập thực hành

1. Viết Test Plan rút gọn (theo mẫu ở mục 5) cho việc ra mắt tính năng "Cổng thông tin CTV/Referral" mới của HR Tool.
2. Áp dụng Risk-based Testing: liệt kê 5 tính năng bất kỳ của một ứng dụng bạn quen thuộc (không nhất thiết HR Tool), xếp hạng mức độ rủi ro và đưa ra thứ tự ưu tiên test.
3. Giải thích bằng lời của bạn sự khác biệt giữa Test Strategy và Test Plan, dùng đúng ví dụ của công ty/dự án bạn đang làm (nếu có).
4. Với ví dụ Test Plan ở mục 5, đề xuất thêm 1 Exit Criteria khác mà bạn nghĩ nên có.

---

## Bước tiếp theo

Bạn đã hoàn thành nhóm **Căn bản** về tư duy testing. Tiếp theo, áp dụng vào thực tế với [Test Cases theo Module](../practice/04-test-cases-by-module/) hoặc học kỹ thuật test API thủ công tại [Manual API Testing](../practice/06-manual-api-testing/).

---

**Cần giúp đỡ?** Liên hệ QC Lead hoặc đăng trong #qc-team
