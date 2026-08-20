---
title: Kỹ thuật thiết kế Test Case
description: Equivalence Partitioning, Boundary Value Analysis, Decision Table, State Transition và các kỹ thuật thiết kế test case chuẩn
---

# Kỹ thuật thiết kế Test Case

Tài liệu đào tạo QC - HR Tool

**Phiên bản:** 1.0
**Cập nhật:** 20/08/2026
**Tác giả:** QC Team

---

## Mục lục

1. [Vì sao cần kỹ thuật thiết kế test case](#1-vì-sao-cần-kỹ-thuật-thiết-kế-test-case)
2. [Equivalence Partitioning (Phân vùng tương đương)](#2-equivalence-partitioning-phân-vùng-tương-đương)
3. [Boundary Value Analysis (Phân tích giá trị biên)](#3-boundary-value-analysis-phân-tích-giá-trị-biên)
4. [Decision Table Testing (Bảng quyết định)](#4-decision-table-testing-bảng-quyết-định)
5. [State Transition Testing (Kiểm thử chuyển trạng thái)](#5-state-transition-testing-kiểm-thử-chuyển-trạng-thái)
6. [Use Case Testing](#6-use-case-testing)
7. [Error Guessing & Exploratory Testing](#7-error-guessing--exploratory-testing)
8. [Chọn kỹ thuật nào cho tình huống nào](#8-chọn-kỹ-thuật-nào-cho-tình-huống-nào)

---

## 1. Vì sao cần kỹ thuật thiết kế test case

Với một form có 5 field, số lượng tổ hợp giá trị có thể nhập vào là gần như vô hạn. QC không có thời gian (và không cần) test mọi tổ hợp. Test Design Techniques là các phương pháp có hệ thống giúp bạn chọn ra **một tập nhỏ test case nhưng vẫn phát hiện được phần lớn lỗi** — thay vì đoán ngẫu nhiên.

:::tip[Lợi ích]
Dùng đúng kỹ thuật giúp bạn: (1) không bỏ sót các trường hợp biên dễ gây lỗi, (2) tránh viết những test case trùng lặp không cần thiết, (3) giải thích được LÝ DO bạn chọn test case đó khi bị hỏi trong review.
:::

---

## 2. Equivalence Partitioning (Phân vùng tương đương)

**Định nghĩa:** Chia tập giá trị đầu vào thành các "vùng" mà trong đó, mọi giá trị được kỳ vọng xử lý giống nhau. Chỉ cần test 1 giá trị đại diện cho mỗi vùng, không cần test tất cả.

**Khi nào dùng:** Khi input có phạm vi giá trị rộng (số, chuỗi ký tự, danh sách lựa chọn).

**Ví dụ áp dụng — Field "Số năm kinh nghiệm yêu cầu" khi tạo Job tại HR Tool** (nhận số nguyên từ 0 đến 50):

| Vùng (Partition) | Giá trị đại diện | Kỳ vọng |
|-------------------|-------------------|---------|
| Hợp lệ: 0 đến 50 | 25 | Lưu thành công |
| Không hợp lệ: nhỏ hơn 0 | -5 | Hiển thị lỗi validate |
| Không hợp lệ: lớn hơn 50 | 100 | Hiển thị lỗi validate |
| Không hợp lệ: không phải số | "abc" | Hiển thị lỗi validate |
| Không hợp lệ: để trống (nếu field bắt buộc) | "" | Hiển thị lỗi "Trường bắt buộc" |

→ Từ vô số giá trị có thể nhập, ta chỉ cần **5 test case** để cover đầy đủ các vùng tương đương.

---

## 3. Boundary Value Analysis (Phân tích giá trị biên)

**Định nghĩa:** Phần lớn lỗi xảy ra ngay tại **đường biên** giữa các vùng hợp lệ/không hợp lệ (lỗi off-by-one khi dev dùng `<` thay vì `<=`). BVA tập trung test chính xác tại các giá trị biên và ngay sát biên.

**Khi nào dùng:** Bổ sung cho Equivalence Partitioning, đặc biệt hiệu quả với các field có giới hạn số (min/max, độ dài chuỗi).

**Ví dụ áp dụng — Field "Salary Min" và "Salary Max" khi tạo Job** (giả sử quy định salary từ 1,000,000 đến 500,000,000 VNĐ, và Salary Min phải nhỏ hơn Salary Max):

| Test case | Giá trị | Kỳ vọng |
|-----------|---------|---------|
| Biên dưới - 1 | Salary Min = 999,999 | Lỗi validate (dưới mức cho phép) |
| Đúng biên dưới | Salary Min = 1,000,000 | Hợp lệ |
| Biên dưới + 1 | Salary Min = 1,000,001 | Hợp lệ |
| Biên trên - 1 | Salary Max = 499,999,999 | Hợp lệ |
| Đúng biên trên | Salary Max = 500,000,000 | Hợp lệ |
| Biên trên + 1 | Salary Max = 500,000,001 | Lỗi validate (vượt mức cho phép) |
| Min bằng Max | Salary Min = Salary Max = 20,000,000 | Cần xác nhận với BA: hợp lệ hay lỗi? |
| Min lớn hơn Max | Salary Min = 30,000,000, Salary Max = 20,000,000 | Lỗi validate "Salary Min phải nhỏ hơn Salary Max" |

:::caution[Lưu ý]
Trường hợp "Min bằng Max" là một ranh giới hay bị bỏ sót và cũng hay bị hiểu sai giữa dev/QC/BA. Khi gặp trường hợp mập mờ như vậy, luôn hỏi lại BA/PO để xác nhận rule trước khi kết luận là bug.
:::

---

## 4. Decision Table Testing (Bảng quyết định)

**Định nghĩa:** Dùng khi kết quả đầu ra phụ thuộc vào **tổ hợp của nhiều điều kiện** cùng lúc (không chỉ 1 input đơn lẻ). Bảng quyết định liệt kê tất cả tổ hợp điều kiện có thể và kết quả tương ứng.

**Khi nào dùng:** Logic có nhiều điều kiện AND/OR kết hợp — ví dụ chức năng filter, phân quyền.

**Ví dụ áp dụng — Filter Candidates theo "Trạng thái" và "Có CV đã parse AI"** tại HR Tool:

| # | Trạng thái = Active | Có CV đã parse AI | Kết quả mong đợi |
|---|:---:|:---:|-------------------|
| 1 | ✅ | ✅ | Hiển thị trong danh sách filter |
| 2 | ✅ | ❌ | Hiển thị, kèm badge "Chưa parse CV" |
| 3 | ❌ | ✅ | Không hiển thị (đã inactive) |
| 4 | ❌ | ❌ | Không hiển thị (đã inactive) |

**Ví dụ áp dụng thứ 2 — Quyền xoá Job theo Role và Trạng thái Job** (kết hợp 2 điều kiện: role và trạng thái):

| # | Role | Job đã có Application? | Kết quả mong đợi |
|---|------|:---:|-------------------|
| 1 | admin | Không | Xoá được |
| 2 | admin | Có | Hiển thị cảnh báo xác nhận trước khi xoá |
| 3 | hr | Không | Xoá được |
| 4 | hr | Có | Hiển thị cảnh báo xác nhận trước khi xoá |
| 5 | tech_lead | Không | Không có quyền, nút Xoá bị ẩn/disable |
| 6 | tech_lead | Có | Không có quyền, nút Xoá bị ẩn/disable |

→ Với 2 điều kiện có 2 giá trị (Active/Inactive × Parsed/Not-parsed) ta có 4 tổ hợp; với 3 role × 2 trạng thái ta có 6 tổ hợp — decision table giúp không bỏ sót tổ hợp nào.

---

## 5. State Transition Testing (Kiểm thử chuyển trạng thái)

**Định nghĩa:** Dùng khi một đối tượng có nhiều **trạng thái (state)** và quy tắc rõ ràng về việc trạng thái nào được phép chuyển sang trạng thái nào. Test tập trung vào: chuyển trạng thái hợp lệ, chuyển trạng thái KHÔNG hợp lệ (phải bị chặn), và trạng thái sau khi chuyển có đúng không.

**Khi nào dùng:** Workflow, pipeline, vòng đời của một đối tượng (đơn hàng, đơn ứng tuyển, ticket...).

**Ví dụ áp dụng — Application Pipeline (ATS) của HR Tool**, với các trạng thái: `Applied → Screening → Interview → Offer → Hired`, và `Rejected` có thể xảy ra ở bất kỳ bước nào trước `Hired`.

```
Applied ──▶ Screening ──▶ Interview ──▶ Offer ──▶ Hired
   │            │              │           │
   └────────────┴──────────────┴───────────┴──▶ Rejected
```

| # | Trạng thái hiện tại | Hành động | Trạng thái mới | Hợp lệ? |
|---|----------------------|-----------|------------------|---------|
| 1 | Applied | Chuyển sang Screening | Screening | ✅ Hợp lệ |
| 2 | Applied | Chuyển sang Rejected | Rejected | ✅ Hợp lệ |
| 3 | Applied | Chuyển thẳng sang Interview (bỏ qua Screening) | — | ❌ Phải bị chặn (nếu quy trình yêu cầu tuần tự) |
| 4 | Hired | Chuyển sang Rejected | — | ❌ Phải bị chặn (Hired là trạng thái kết thúc) |
| 5 | Rejected | Chuyển sang bất kỳ trạng thái khác | — | ❌ Phải bị chặn (Rejected là trạng thái kết thúc) |
| 6 | Offer | Chuyển sang Hired | Hired | ✅ Hợp lệ |

:::tip[Vì sao test case #3 và #4 quan trọng]
Đây chính là những test case dễ bị quên nhất khi test thủ công theo cảm tính (vì "đường happy path" ai cũng nghĩ tới), nhưng lại là nơi hay phát sinh bug nghiêm trọng nhất trong thực tế — ví dụ một Candidate bị chuyển nhầm trạng thái do lỗi UI cho phép click vào nút chuyển bước không hợp lệ.
:::

---

## 6. Use Case Testing

**Định nghĩa:** Test dựa trên **luồng sử dụng thực tế** của một actor (loại người dùng) cụ thể, bao gồm cả "happy path" (luồng chính) và các "alternative flow"/"exception flow" (luồng phụ, luồng lỗi).

**Khi nào dùng:** Tính năng liên quan đến phân quyền (nhiều role khác nhau) hoặc quy trình nghiệp vụ nhiều bước.

**Ví dụ áp dụng — Use case "Tech Lead viết Feedback phỏng vấn"** tại HR Tool:

- **Actor:** `tech_lead`
- **Happy path:** Tech Lead đăng nhập → vào Interview đã được assign → điền form feedback + rating → Submit → feedback lưu thành công, hiển thị cho HR xem.
- **Alternative flow 1:** Tech Lead cố mở Interview KHÔNG được assign cho mình → hệ thống chặn, hiển thị "Không có quyền truy cập" (vì theo ma trận quyền, `tech_lead` chỉ đọc + viết phỏng vấn của chính mình).
- **Alternative flow 2:** Tech Lead submit feedback nhưng thiếu rating (bắt buộc) → hệ thống chặn submit, hiển thị lỗi validate.
- **Exception flow:** Tech Lead đang điền feedback thì mất kết nối mạng giữa lúc Submit → hệ thống cần thông báo lỗi rõ ràng, không làm mất toàn bộ nội dung đã nhập (không bắt viết lại từ đầu).

---

## 7. Error Guessing & Exploratory Testing

**Error Guessing:** Dựa vào kinh nghiệm và trực giác để "đoán" những nơi dễ có lỗi — dữ liệu rỗng, ký tự đặc biệt, số âm, file quá lớn, double-click liên tục, mở nhiều tab cùng lúc...

**Exploratory Testing:** Không viết test case trước, mà vừa test vừa học hệ thống, dựa trên kết quả quan sát được để quyết định bước test tiếp theo. Thường làm theo "session" có giới hạn thời gian (ví dụ 30-60 phút), có ghi chú lại (charter) mục tiêu khám phá.

| Kỹ thuật | Khi nào dùng | Ví dụ với HR Tool |
|----------|--------------|---------------------|
| Error Guessing | Bổ sung cho các kỹ thuật có hệ thống ở trên, để bắt các lỗi "không ai nghĩ tới" | Thử nhập tên Candidate toàn bộ là emoji, thử upload file CV đặt tên có ký tự `../../etc/passwd` |
| Exploratory Testing | Tính năng mới, phức tạp, ít tài liệu, hoặc muốn tìm lỗi ngoài phạm vi test case đã viết | Dành 45 phút tự do khám phá tính năng Workflow Automation (kiểu n8n) mới ra mắt, không theo test case nào cả, chỉ ghi chú lại điều bất thường |

:::note[Exploratory Testing không phải "test bừa"]
Nhiều người hiểu nhầm Exploratory Testing là test không có kế hoạch. Thực chất nó vẫn có mục tiêu rõ ràng (charter) — ví dụ "khám phá xem luồng CV Matching xử lý thế nào với CV không phải tiếng Anh/Việt" — chỉ khác là không viết step-by-step trước, mà điều chỉnh linh hoạt theo những gì quan sát được.
:::

---

## 8. Chọn kỹ thuật nào cho tình huống nào

| Tình huống | Kỹ thuật phù hợp nhất |
|------------|-------------------------|
| Field nhận input dạng số/chuỗi có phạm vi | Equivalence Partitioning + Boundary Value Analysis |
| Logic phụ thuộc nhiều điều kiện kết hợp (filter, phân quyền) | Decision Table Testing |
| Đối tượng có vòng đời/workflow nhiều bước | State Transition Testing |
| Tính năng liên quan nhiều role, nhiều luồng nghiệp vụ | Use Case Testing |
| Tính năng mới, ít tài liệu, muốn tìm lỗi "lạ" | Exploratory Testing + Error Guessing |

---

## Bài tập thực hành

1. Áp dụng Equivalence Partitioning + Boundary Value Analysis cho field "Số điện thoại" (giả sử yêu cầu: đúng 10 số, bắt đầu bằng số 0). Viết ra ít nhất 6 test case.
2. Vẽ Decision Table cho logic: "Candidate chỉ được mời phỏng vấn nếu điểm CV Matching >= 70% VÀ Job đang ở trạng thái Active". Liệt kê đủ 4 tổ hợp.
3. Vẽ sơ đồ State Transition cho vòng đời của một Bug ticket trên Jira mà team bạn đang dùng (ví dụ: Open → In Progress → In Review → Done, có thể Reopen). Chỉ ra 2 transition KHÔNG hợp lệ cần test.
4. Dành 20 phút thực hiện Exploratory Testing trên môi trường Staging HR Tool với charter tự chọn (ví dụ "khám phá luồng tạo Company mới"), ghi chú lại ít nhất 2 điều bất thường (dù có phải bug hay không).

---

## Bước tiếp theo

Tiếp tục với [Viết Test Case & Test Suite chuẩn](./06-viet-test-case-chuan/) để học cách trình bày các test case bạn vừa thiết kế theo đúng chuẩn.

---

**Cần giúp đỡ?** Liên hệ QC Lead hoặc đăng trong #qc-team
