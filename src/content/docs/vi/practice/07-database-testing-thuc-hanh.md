---
title: Database Testing thực hành
description: Hướng dẫn thực hành verify dữ liệu trong database sau khi thực hiện hành động trên UI/API của HR Tool
---

# Database Testing thực hành

Tài liệu đào tạo QC - HR Tool

Bài [Database cơ bản cho Tester](../foundations/03-database-co-ban-cho-tester/) đã giới thiệu SQL cơ bản. Bài này áp dụng nó vào quy trình test thật: **thực hiện hành động trên UI/API, rồi verify trực tiếp trong database** để chắc chắn hệ thống không chỉ "trông có vẻ đúng" mà dữ liệu thật sự đúng.

## Mục lục

1. [Vì sao chỉ tin giao diện là chưa đủ](#1-vì-sao-chỉ-tin-giao-diện-là-chưa-đủ)
2. [Quy trình verify DB sau hành động](#2-quy-trình-verify-db-sau-hành-động)
3. [Kiểm tra Data Integrity](#3-kiểm-tra-data-integrity)
4. [Kiểm tra hành vi khi xoá (Cascading & Soft-delete)](#4-kiểm-tra-hành-vi-khi-xoá-cascading--soft-delete)
5. [Kiểm tra Multi-tenant Isolation](#5-kiểm-tra-multi-tenant-isolation)
6. [Bài tập thực hành](#6-bài-tập-thực-hành)

---

## 1. Vì sao chỉ tin giao diện là chưa đủ

Giao diện có thể "nói dối" theo nhiều cách không cố ý:

- Hiển thị thông báo "Tạo thành công" dù bản ghi chưa thật sự được lưu (do cache tạm ở Frontend).
- Hiển thị đúng dữ liệu vừa nhập nhưng vì Frontend giữ nguyên state cũ, không phải vì Backend đã lưu đúng.
- Xoá một item khỏi danh sách hiển thị nhưng bản ghi trong DB vẫn còn (chỉ ẩn đi ở tầng UI).

Verify trực tiếp trong DB là cách duy nhất để chắc chắn 100% dữ liệu đã đúng.

:::caution[Quyền truy cập]
Chỉ verify DB trên môi trường **Staging**, bằng tài khoản chỉ có quyền **đọc (read-only)** được QC Lead cấp. Không bao giờ tự ý sửa/xoá dữ liệu trực tiếp trong DB.
:::

## 2. Quy trình verify DB sau hành động

1. Ghi lại chính xác hành động vừa thực hiện trên UI (ví dụ: tạo Candidate mới với email `nguyenvana@test.com`).
2. Kết nối vào DB Staging bằng công cụ được cấp (TablePlus/DBeaver/pgAdmin).
3. Query để tìm bản ghi vừa tạo:

```sql
SELECT id, full_name, email, status, created_at
FROM candidates
WHERE email = 'nguyenvana@test.com'
ORDER BY created_at DESC
LIMIT 1;
```

4. So sánh **từng field** trong kết quả query với dữ liệu bạn đã nhập trên UI — không chỉ nhìn "có bản ghi hay không", mà kiểm tra chi tiết: đúng `full_name`, đúng `email`, `status` khởi tạo đúng giá trị mặc định, `company_id` đúng công ty bạn đang đăng nhập.
5. Nếu hành động có liên quan tới bảng khác (ví dụ tạo Application thì cũng cần liên kết đúng `candidate_id` và `job_id`), query thêm để kiểm tra quan hệ đó.

## 3. Kiểm tra Data Integrity

Data Integrity nghĩa là dữ liệu luôn tuân thủ đúng ràng buộc đã thiết kế. Một số điều QC nên kiểm tra:

- **Không trùng lặp bất hợp lý**: ví dụ 2 candidate có cùng email trong cùng 1 company — có bị chặn không, hay hệ thống cho tạo trùng?
- **Ràng buộc bắt buộc (NOT NULL)**: các field quan trọng (email, company_id) không bao giờ được để trống trong DB, dù UI có lỡ cho submit form thiếu field.
- **Đúng kiểu dữ liệu**: field ngày tháng phải là định dạng ngày hợp lệ, field số (như `salary_min`) phải là số, không phải chuỗi text.
- **Đồng bộ giữa các bảng liên quan**: nếu Job có `applications_count`, con số này có khớp với `SELECT COUNT(*) FROM applications WHERE job_id = ...` không?

```sql
-- Kiểm tra có candidate trùng email trong cùng company không
SELECT company_id, email, COUNT(*) 
FROM candidates 
GROUP BY company_id, email 
HAVING COUNT(*) > 1;
```

## 4. Kiểm tra hành vi khi xoá (Cascading & Soft-delete)

Khi user xoá một bản ghi, có 2 khả năng:

- **Soft-delete**: bản ghi vẫn còn trong DB nhưng có field đánh dấu đã xoá (ví dụ `deleted_at IS NOT NULL`, hoặc `status = 'deleted'`). Đây là cách phổ biến để có thể khôi phục dữ liệu hoặc giữ lịch sử.
- **Hard-delete**: bản ghi bị xoá vật lý khỏi DB, không thể khôi phục.

Test case QC nên thực hiện:

1. Xoá một Job đang có Candidate ứng tuyển (Application liên kết tới nó) — hệ thống xử lý thế nào? Application có bị xoá theo (cascading delete) hay bị chặn xoá Job, hay Job chuyển sang trạng thái "archived" thay vì xoá thật?
2. Sau khi xoá trên UI, query DB để xác nhận đúng hành vi mong đợi (soft-delete hay hard-delete) — nếu là soft-delete, bản ghi phải còn nguyên nhưng đã được đánh dấu, không được hiện lại trong danh sách qua UI/API thông thường.
3. Kiểm tra các bảng liên quan (con) có bị "mồ côi" (orphan record — record con còn tồn tại nhưng record cha đã bị xoá) không.

:::tip[Mẹo]
Nếu phát hiện orphan record hoặc hành vi cascading không rõ ràng, đây thường là bug nghiêm trọng (Priority Medium-High) vì ảnh hưởng đến tính đúng đắn dữ liệu lâu dài — nên báo cáo kèm bằng chứng query cụ thể.
:::

## 5. Kiểm tra Multi-tenant Isolation

HR Tool là hệ thống **multi-tenant**: mọi bản ghi đều gắn với một `company_id`, và dữ liệu của công ty A tuyệt đối không được lẫn sang công ty B. Đây là nhóm test case **quan trọng nhất** khi test DB của HR Tool.

Cách kiểm tra:

1. Tạo dữ liệu test ở 2 company khác nhau (ví dụ theo hướng dẫn ở bài [QC Fundamentals](../basics/01-fundamentals/) — mỗi QC tạo Company test riêng).
2. Đăng nhập vào Company A, thử các cách sau để xem có "nhìn thấy" dữ liệu Company B không:
   - Đổi thẳng ID trên URL (ví dụ `/candidates/<id-của-company-B>`).
   - Gọi API/tRPC trực tiếp với ID thuộc company B (xem bài [Security Testing cơ bản](./11-security-testing-co-ban/) về kỹ thuật IDOR).
3. Verify bằng query: mọi câu SELECT phục vụ tính năng đều phải có điều kiện `WHERE company_id = ...` — nếu thiếu điều kiện này ở tầng code, dữ liệu sẽ bị lẫn.

```sql
-- Query kiểm tra nhanh: liệt kê company_id xuất hiện trong kết quả trả về của 1 tính năng
-- Nếu thấy nhiều hơn 1 company_id trong kết quả của 1 user chỉ thuộc 1 company -> có bug rò dữ liệu
SELECT DISTINCT company_id FROM candidates WHERE id IN (/* danh sách id trả về từ UI/API */);
```

## 6. Bài tập thực hành

1. Tạo một Candidate mới qua UI, sau đó viết query SQL để verify đầy đủ các field đã nhập đều được lưu đúng trong DB.
2. Thử xoá một Job đang có Application liên kết — quan sát UI báo gì, rồi query DB để xác nhận đây là soft-delete hay hard-delete, và Application liên quan xử lý ra sao.
3. Viết 1 query kiểm tra xem có candidate nào bị trùng email trong cùng company không.
4. Giải thích bằng lời của bạn: vì sao lỗi thiếu điều kiện `company_id` trong query là một lỗi bảo mật nghiêm trọng, không chỉ là lỗi hiển thị.

## Bước tiếp theo

Tiếp tục với [Cross-browser & Compatibility Testing](./08-cross-browser-compatibility/).

---

**Cần giúp đỡ?** Liên hệ QC Lead hoặc đăng trong #qc-team
