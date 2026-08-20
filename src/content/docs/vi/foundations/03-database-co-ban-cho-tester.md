---
title: Database cơ bản cho Tester
description: Học cách đọc dữ liệu trong database để verify kết quả test thay vì chỉ tin vào giao diện
---

# Database cơ bản cho Tester

Tài liệu đào tạo QC - HR Tool

---

## Mục lục

1. [Vì sao Tester cần biết đọc Database](#1-vì-sao-tester-cần-biết-đọc-database)
2. [Khái niệm cơ bản: bảng, dòng, cột, khoá](#2-khái-niệm-cơ-bản-bảng-dòng-cột-khoá)
3. [Quan hệ giữa các bảng](#3-quan-hệ-giữa-các-bảng)
4. [Câu lệnh SQL cơ bản](#4-câu-lệnh-sql-cơ-bản)
5. [SQL vs NoSQL](#5-sql-vs-nosql)
6. [Công cụ xem Database](#6-công-cụ-xem-database)
7. [Bài tập thực hành](#7-bài-tập-thực-hành)

---

## 1. Vì sao Tester cần biết đọc Database

Giao diện (UI) chỉ hiển thị những gì Frontend **chọn** để hiển thị — và Frontend có thể hiển thị sai, hiển thị thiếu, hoặc cache dữ liệu cũ. Nếu bạn chỉ dựa vào UI để xác nhận một hành động đã "thành công", bạn có thể bỏ lỡ những bug nghiêm trọng như:

- UI báo "Tạo candidate thành công" nhưng do lỗi transaction, dữ liệu **không thực sự được lưu** vào database.
- UI hiển thị đúng nhưng dữ liệu bị lưu **trùng lặp** (tạo 2 bản ghi thay vì 1) do lỗi double-submit.
- Xoá một Job trên UI nhưng dữ liệu liên quan (Applications của job đó) **không được xử lý đúng cách** (bị xoá theo dù không nên, hoặc bị "mồ côi" - orphan data).
- Dữ liệu của công ty A vô tình bị lưu/lẫn sang công ty B (lỗi phân lập multi-tenant).

**Verify trực tiếp trong Database** là cách chắc chắn nhất để xác nhận hành động đã thực sự xảy ra đúng như mong đợi ở tầng lưu trữ, không chỉ ở tầng hiển thị.

:::note[Phạm vi truy cập]
Trong thực tế, QC thường chỉ được cấp quyền **đọc (read-only)** trên môi trường Staging, không có quyền sửa/xoá dữ liệu trực tiếp trong Database. Hãy luôn xin cấp quyền đúng cách qua QC Lead/Tech Lead trước khi truy cập.
:::

---

## 2. Khái niệm cơ bản: bảng, dòng, cột, khoá

Một **cơ sở dữ liệu quan hệ (relational database)** như PostgreSQL (HR Tool đang dùng PostgreSQL 16) lưu dữ liệu dưới dạng các **bảng (table)**, giống một file Excel có nhiều sheet:

| id | full_name | email | company_id |
|----|-----------|-------|------------|
| 1 | Nguyễn Văn A | a@example.com | 10 |
| 2 | Trần Thị B | b@example.com | 10 |

- **Bảng (table)**: một "sheet" chứa dữ liệu về một loại đối tượng, ví dụ bảng `candidates`, bảng `jobs`, bảng `users`.
- **Dòng (row/record)**: một bản ghi cụ thể, ví dụ 1 ứng viên cụ thể.
- **Cột (column/field)**: một thuộc tính, ví dụ `full_name`, `email`.
- **Khoá chính (Primary Key)**: cột (thường là `id`) đảm bảo mỗi dòng là duy nhất, không trùng.
- **Khoá ngoại (Foreign Key)**: cột tham chiếu tới khoá chính của bảng khác, dùng để thể hiện quan hệ — ví dụ `company_id` trong bảng trên tham chiếu tới bảng `companies`.

---

## 3. Quan hệ giữa các bảng

Hai loại quan hệ phổ biến nhất:

**Quan hệ 1-nhiều (one-to-many)**: một công ty có nhiều nhân viên, nhưng một nhân viên chỉ thuộc một công ty.

```
companies (1) ──────< employees (nhiều)
   id=10                company_id=10
```

**Quan hệ nhiều-nhiều (many-to-many)**: một ứng viên có thể ứng tuyển nhiều job, một job có thể nhận nhiều ứng viên — thường được biểu diễn qua một bảng trung gian, ví dụ bảng `applications` nối `candidates` và `jobs`:

```
candidates ──< applications >── jobs
```

Đây chính xác là mô hình mà **module ATS (Applicant Tracking System)** của HR Tool sử dụng: một `application` là một bản ghi trung gian, gắn với 1 `candidate` + 1 `job`, và có thêm các trường trạng thái riêng (ví dụ đang ở giai đoạn nào trong pipeline: Applied → Screening → Interview → Offer → Hired).

**Vì sao tester cần hiểu điều này?** Khi test xoá một `job`, bạn cần đặt câu hỏi: các `application` đang tham chiếu tới job đó sẽ ra sao — bị xoá theo (cascade delete), bị chặn xoá, hay bị "mồ côi" (còn tồn tại nhưng trỏ tới job không còn tồn tại)? Mỗi cách xử lý là một hành vi cần được xác nhận có đúng như thiết kế không.

---

## 4. Câu lệnh SQL cơ bản

**SQL (Structured Query Language)** là ngôn ngữ dùng để truy vấn database quan hệ. Tester không cần viết SQL phức tạp, nhưng nên đọc hiểu và tự viết được các câu SELECT cơ bản để verify dữ liệu.

> Các ví dụ dưới đây minh hoạ theo tên bảng/cột hợp lý dựa trên các module đã biết của HR Tool (candidates, jobs, applications, companies) — đây là ví dụ mang tính minh hoạ để luyện tư duy đọc SQL, tên cột/bảng thực tế có thể khác, hãy xác nhận với Tech Lead hoặc bằng ERD/migration thật khi làm việc trên môi trường thật.

**SELECT** — lấy dữ liệu:
```sql
SELECT id, full_name, email FROM candidates;
```
Lấy 3 cột `id`, `full_name`, `email` từ toàn bộ bảng `candidates`.

**WHERE** — lọc điều kiện:
```sql
SELECT * FROM candidates WHERE email = 'a@example.com';
```
Chỉ lấy dòng có `email` khớp chính xác.

**ORDER BY** — sắp xếp:
```sql
SELECT * FROM jobs ORDER BY created_at DESC;
```
Sắp xếp job mới tạo lên đầu.

**JOIN** — kết hợp dữ liệu từ nhiều bảng:
```sql
SELECT applications.id, candidates.full_name, jobs.title
FROM applications
JOIN candidates ON applications.candidate_id = candidates.id
JOIN jobs ON applications.job_id = jobs.id
WHERE jobs.company_id = 10;
```
Lấy danh sách ứng tuyển kèm tên ứng viên và tên job, chỉ trong công ty có `id = 10`.

**COUNT** — đếm số lượng:
```sql
SELECT COUNT(*) FROM candidates WHERE company_id = 10;
```
Đếm tổng số candidate thuộc công ty 10 — hữu ích để verify số liệu hiển thị trên Dashboard có khớp với dữ liệu thật không.

:::tip[Cách học nhanh]
Bạn không cần nhớ hết cú pháp. Hãy bắt đầu từ những câu SELECT + WHERE đơn giản để verify đúng 1 bản ghi cụ thể sau một hành động test, rồi mở rộng dần khi cần.
:::

---

## 5. SQL vs NoSQL

| | SQL (quan hệ) | NoSQL (phi quan hệ) |
|---|---|---|
| Cấu trúc dữ liệu | Bảng, có schema cố định | Document/JSON, schema linh hoạt |
| Ví dụ | PostgreSQL, MySQL | MongoDB, Redis |
| Quan hệ dữ liệu | Mạnh, dùng JOIN | Yếu hơn, thường lưu lồng nhau |
| Phù hợp khi | Dữ liệu có cấu trúc rõ, nhiều quan hệ (như HR/tuyển dụng) | Dữ liệu thay đổi cấu trúc thường xuyên, cần tốc độ cao |

HR Tool dùng PostgreSQL (SQL) làm nguồn lưu trữ chính, nhưng cũng dùng **Redis** (một dạng lưu trữ key-value tốc độ cao, thường xếp vào nhóm NoSQL) cho **cache và hàng đợi xử lý ngầm (BullMQ)** — ví dụ hàng đợi chấm điểm CV-JD bằng AI chạy nền. Tester không cần đọc trực tiếp Redis, nhưng nên biết rằng một số dữ liệu (như kết quả matching AI) có thể đến **sau một khoảng trễ** vì đang được xử lý qua hàng đợi, không phải lỗi hiển thị.

---

## 6. Công cụ xem Database

Một số công cụ GUI phổ biến giúp xem dữ liệu PostgreSQL mà không cần gõ lệnh SQL thủ công trong terminal:

| Công cụ | Nền tảng | Ghi chú |
|---------|----------|---------|
| **TablePlus** | Mac/Windows | Giao diện đẹp, dễ dùng, có bản miễn phí giới hạn |
| **DBeaver** | Mac/Windows/Linux | Miễn phí, hỗ trợ nhiều loại database |
| **pgAdmin** | Web-based | Công cụ chính thức của PostgreSQL |

Quy trình kết nối thường cần: host, port, username, password, tên database — những thông tin này QC Lead/Tech Lead sẽ cấp riêng cho môi trường Staging (không dùng thông tin Production).

:::caution[Nguyên tắc an toàn]
- Chỉ dùng tài khoản **read-only** trên Database Staging, tuyệt đối không chạy lệnh `UPDATE`/`DELETE` thủ công trừ khi được yêu cầu rõ ràng.
- Không bao giờ kết nối trực tiếp vào Database **Production**.
- Không public thông tin kết nối database (host, password) ra ngoài team.
:::

---

## 7. Bài tập thực hành

1. Giải thích sự khác nhau giữa khoá chính (Primary Key) và khoá ngoại (Foreign Key) bằng ví dụ bảng `applications` liên kết `candidates` và `jobs`.
2. Viết (trên giấy, không cần chạy) một câu SQL SELECT lấy toàn bộ `candidates` có `email` chứa từ "test" — gợi ý: tìm hiểu thêm về `LIKE '%test%'`.
3. Nếu Dashboard hiển thị "Tổng số ứng viên: 25" nhưng bạn đếm bằng SQL `COUNT(*)` ra 23, bạn sẽ nghi ngờ điều gì và report bug như thế nào?
4. Tại sao dữ liệu do hàng đợi AI (BullMQ + Redis) xử lý có thể chưa xuất hiện ngay trên UI dù bạn vừa thực hiện hành động? Điều này ảnh hưởng thế nào tới cách bạn viết test case cho tính năng CV Matching?
5. Vì sao QC chỉ nên được cấp quyền read-only trên Database Staging?

---

## Bước tiếp theo

Tiếp tục với [Git & Quy trình làm việc nhóm](../foundations/04-git-quy-trinh-nhom/) để hiểu cách team phối hợp code, đặc biệt quan trọng nếu bạn sẽ viết automation test.

---

**Cần giúp đỡ?** Liên hệ QC Lead hoặc đăng trong #qc-team
