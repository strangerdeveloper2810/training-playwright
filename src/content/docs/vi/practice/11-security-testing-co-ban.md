---
title: Security Testing cơ bản
description: Kiến thức OWASP Top 10 và test case bảo mật cơ bản mà QC thủ công có thể tự thực hiện
---

# Security Testing cơ bản

Tài liệu đào tạo QC - HR Tool

Bạn không cần là hacker để phát hiện những lỗ hổng bảo mật cơ bản. Bài này giới thiệu OWASP Top 10 ở mức dễ hiểu và các test case bảo mật QC thủ công có thể tự làm mà không cần công cụ chuyên dụng.

## Mục lục

1. [OWASP Top 10 là gì](#1-owasp-top-10-là-gì)
2. [OWASP Top 10 giải thích ngắn gọn](#2-owasp-top-10-giải-thích-ngắn-gọn)
3. [Test case: IDOR (truy cập dữ liệu công ty/user khác)](#3-test-case-idor-truy-cập-dữ-liệu-công-tyuser-khác)
4. [Test case: Input Validation cơ bản](#4-test-case-input-validation-cơ-bản)
5. [Test case: Session & Token](#5-test-case-session--token)
6. [Nguyên tắc báo cáo lỗi bảo mật](#6-nguyên-tắc-báo-cáo-lỗi-bảo-mật)
7. [Bài tập thực hành](#7-bài-tập-thực-hành)

---

## 1. OWASP Top 10 là gì

**OWASP** (Open Worldwide Application Security Project) là tổ chức phi lợi nhuận chuyên nghiên cứu bảo mật ứng dụng web. **OWASP Top 10** là danh sách 10 loại lỗ hổng bảo mật phổ biến và nguy hiểm nhất, được cập nhật định kỳ — coi đây là "danh sách phải biết" của bất kỳ ai làm web, kể cả QC.

:::caution[Giới hạn của bài này]
Bài này chỉ giúp bạn **nhận biết và báo cáo** các vấn đề bảo mật cơ bản. Không hướng dẫn kỹ thuật khai thác (exploit) sâu — nếu nghi ngờ lỗ hổng nghiêm trọng, luôn báo ngay cho Tech Lead/Security team, không tự ý thử nghiệm sâu hơn trên môi trường Staging hoặc Production.
:::

## 2. OWASP Top 10 giải thích ngắn gọn

| # | Loại lỗ hổng | Giải thích dễ hiểu |
|---|--------------|---------------------|
| 1 | **Broken Access Control** | User làm được việc họ không có quyền làm (xem/sửa dữ liệu người khác, truy cập trang admin dù không phải admin) |
| 2 | **Cryptographic Failures** | Dữ liệu nhạy cảm (password, token) không được mã hoá/hash đúng cách |
| 3 | **Injection** | Kẻ tấn công chèn mã độc (SQL, script...) qua input để thao túng hệ thống |
| 4 | **Insecure Design** | Lỗi từ chính thiết kế hệ thống, không phải lỗi code (ví dụ không giới hạn số lần thử đăng nhập) |
| 5 | **Security Misconfiguration** | Cấu hình sai (bật debug mode ở production, để lộ thông tin lỗi chi tiết cho người dùng) |
| 6 | **Vulnerable Components** | Dùng thư viện/dependency có lỗ hổng đã biết, chưa được cập nhật |
| 7 | **Authentication Failures** | Lỗi trong xác thực: mật khẩu yếu vẫn được chấp nhận, không giới hạn brute-force |
| 8 | **Data Integrity Failures** | Dữ liệu bị thay đổi trái phép trong quá trình truyền/xử lý |
| 9 | **Logging & Monitoring Failures** | Hệ thống không ghi log đủ để phát hiện/điều tra khi có sự cố bảo mật |
| 10 | **Server-Side Request Forgery** | Hệ thống bị lợi dụng để gửi request tới nơi không mong muốn (thường liên quan tính năng tải file/link từ URL) |

QC thủ công thường phát hiện được các vấn đề thuộc nhóm 1 (Broken Access Control), 3 (Injection cơ bản), và 7 (Authentication) dễ nhất — 3 mục dưới đây sẽ đi sâu vào cách test.

## 3. Test case: IDOR (truy cập dữ liệu công ty/user khác)

**IDOR** (Insecure Direct Object Reference) là lỗi thuộc nhóm Broken Access Control — xảy ra khi hệ thống chỉ dựa vào ID trong request mà không kiểm tra người gọi có quyền với ID đó hay không.

Vì HR Tool là hệ thống **multi-tenant** (mỗi bản ghi gắn với `company_id`), đây là nhóm test case QUAN TRỌNG NHẤT cần thực hiện với mọi tính năng mới:

1. Đăng nhập vào Company A, thực hiện một hành động để lấy ID của một bản ghi (ví dụ ID của một Candidate) — ID này thường hiện trên URL, ví dụ `/candidates/abc-123`.
2. Đăng nhập vào Company B (tài khoản khác), thử truy cập trực tiếp URL `/candidates/abc-123` (thuộc Company A).
3. **Kết quả mong đợi**: hệ thống phải trả về lỗi (403 Forbidden hoặc 404 Not Found), KHÔNG được hiển thị dữ liệu của Company A.
4. Lặp lại tương tự bằng cách gọi trực tiếp API/tRPC với ID đó (dùng Postman, xem bài [Test API thủ công](./06-manual-api-testing/)) — vì đôi khi UI có thể chặn nhưng API phía sau lại không chặn.

:::tip[Test cả giữa các role trong cùng công ty]
Ngoài test giữa 2 company, cũng cần test IDOR giữa các **role** trong cùng company — ví dụ `tech_lead` (chỉ có quyền đọc + viết phỏng vấn theo README) có bấm/gọi API để sửa thông tin Employee được không?
:::

## 4. Test case: Input Validation cơ bản

Mục tiêu là kiểm tra xem hệ thống có validate input đúng cách không, để phát hiện sớm các điểm có thể dẫn tới injection — không cần khai thác sâu.

Cách test cơ bản, an toàn:

1. Nhập vào các ô input (đặc biệt các ô tìm kiếm, tên, mô tả) các ký tự đặc biệt như: `' OR '1'='1`, `<script>alert(1)</script>`, `"; DROP TABLE users; --`.
2. Quan sát:
   - Hệ thống có báo lỗi 500 (Internal Server Error) không? → dấu hiệu input chưa được xử lý an toàn, cần báo ngay.
   - Chuỗi `<script>` có bị hiển thị lại nguyên văn trên trang (không được escape) không? → dấu hiệu rủi ro XSS (Cross-Site Scripting), cần báo ngay dù chưa chắc khai thác được.
   - Hệ thống có từ chối hợp lý (validate lỗi rõ ràng) hoặc lưu chuỗi đó như text bình thường (không thực thi) không? → đây là hành vi AN TOÀN, đạt yêu cầu.
3. **Không** thử các kỹ thuật injection phức tạp hơn hoặc cố gắng khai thác thật — chỉ cần phát hiện dấu hiệu bất thường và báo cáo.

## 5. Test case: Session & Token

| Test case | Cách test | Kết quả mong đợi |
|-----------|-----------|-------------------|
| Logout có vô hiệu hoá token không | Đăng nhập, lưu lại `access_token`, bấm Logout, dùng token cũ gọi lại API | API phải trả về `401 Unauthorized` — token cũ không còn dùng được |
| Token có giới hạn thời gian sống | Kiểm tra thời gian hết hạn của access token (HR Tool: 7 ngày) và refresh token (30 ngày) qua tài liệu/Dev | Token phải hết hạn đúng như thiết kế, không tồn tại vô thời hạn |
| Không thể đăng nhập với session đã hết hạn | Chờ token hết hạn (hoặc test với token giả mạo/đã sửa) | Hệ thống từ chối truy cập, yêu cầu đăng nhập lại |

## 6. Nguyên tắc báo cáo lỗi bảo mật

- Báo cáo **ngay lập tức** cho Tech Lead/QC Lead qua kênh riêng tư (không post công khai lên Slack channel chung), vì lỗ hổng bảo mật có thể bị lợi dụng nếu công khai sớm.
- Mô tả rõ: bước tái hiện, dữ liệu/tài khoản dùng để test, mức độ ảnh hưởng dự đoán (có thể xem/sửa/xoá dữ liệu của ai).
- Gắn label `security` khi tạo ticket (xem [Template Báo cáo lỗi](../basics/02-bug-report-template/), mục Bug Categories).
- Không tự ý thử nghiệm sâu hơn hoặc chia sẻ thông tin lỗ hổng cho người không liên quan.

## 7. Bài tập thực hành

1. Thực hiện test case IDOR mô tả ở mục 3 với 2 tài khoản Company khác nhau trên Staging — ghi lại kết quả (đạt/không đạt).
2. Thử nhập `<script>alert(1)</script>` vào ô tên khi tạo một Candidate mới — quan sát và ghi lại hành vi hệ thống.
3. Kiểm tra: sau khi Logout, dùng lại token cũ (nếu có công cụ/kiến thức để thử) gọi một API bất kỳ — kết quả có đúng `401` không?
4. Liệt kê 3 mục trong OWASP Top 10 mà bạn nghĩ QC thủ công (không cần công cụ chuyên dụng) có thể tự phát hiện được, giải thích vì sao.

## Bước tiếp theo

Tiếp tục với [Test Metrics & Dashboard](../reports/07-test-metrics-dashboard/) để học cách báo cáo kết quả testing tổng thể.

---

**Cần giúp đỡ?** Liên hệ QC Lead hoặc đăng trong #qc-team
