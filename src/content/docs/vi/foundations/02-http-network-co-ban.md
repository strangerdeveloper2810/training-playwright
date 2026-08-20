---
title: HTTP & Network cơ bản cho Tester
description: Hiểu HTTP request/response, status code, header, cookie/token và cách đọc tab Network trong DevTools
---

# HTTP & Network cơ bản cho Tester

Tài liệu đào tạo QC - HR Tool

---

## Mục lục

1. [HTTP là gì](#1-http-là-gì)
2. [Cấu trúc Request và Response](#2-cấu-trúc-request-và-response)
3. [HTTP Method](#3-http-method)
4. [HTTP Status Code](#4-http-status-code)
5. [Header thường gặp](#5-header-thường-gặp)
6. [Cookie, Session và Token (JWT)](#6-cookie-session-và-token-jwt)
7. [CORS là gì](#7-cors-là-gì)
8. [Thực hành đọc tab Network trong DevTools](#8-thực-hành-đọc-tab-network-trong-devtools)
9. [Bài tập thực hành](#9-bài-tập-thực-hành)

---

## 1. HTTP là gì

**HTTP (HyperText Transfer Protocol)** là "ngôn ngữ" mà Client (trình duyệt) và Server dùng để giao tiếp với nhau qua Internet. Mỗi lần bạn mở một trang web, bấm một nút, hay submit một form, trình duyệt sẽ gửi đi một **HTTP Request**, và Server trả về một **HTTP Response**.

**HTTPS** là HTTP có thêm một lớp mã hoá (TLS/SSL) để dữ liệu không bị đọc trộm trên đường truyền. Mọi môi trường Staging/Production của HR Tool đều chạy trên HTTPS — nếu bạn thấy cảnh báo "Not Secure" hoặc chứng chỉ SSL lỗi, đó là một bug cần báo ngay vì ảnh hưởng đến bảo mật người dùng.

---

## 2. Cấu trúc Request và Response

Một HTTP Request gồm:

```
POST /trpc/auth.login HTTP/1.1        ← Method + Đường dẫn (path) + Version
Host: api.staging.ethansoftwaredeveloper.com ← Header
Content-Type: application/json        ← Header
Authorization: Bearer eyJhbGci...     ← Header (nếu có)

{"email": "hr@example.com", "password": "***"}   ← Body (dữ liệu gửi kèm)
```

Một HTTP Response gồm:

```
HTTP/1.1 200 OK                       ← Status line
Content-Type: application/json        ← Header
Set-Cookie: accessToken=eyJ...; HttpOnly   ← Header

{"result": {"data": {"user": {...}}}}     ← Body (dữ liệu trả về)
```

Ba phần quan trọng nhất mà tester cần quan tâm khi test API: **Method + URL**, **Status code**, và **Body** (cả request body lẫn response body).

---

## 3. HTTP Method

| Method | Ý nghĩa | Ví dụ trong HR Tool |
|--------|---------|----------------------|
| **GET** | Lấy dữ liệu, không thay đổi gì trên server | Lấy danh sách candidates, xem chi tiết 1 job |
| **POST** | Tạo mới dữ liệu, hoặc thực hiện hành động | Tạo candidate mới, đăng nhập, upload CV |
| **PUT** | Cập nhật toàn bộ một bản ghi | Cập nhật toàn bộ thông tin 1 employee |
| **PATCH** | Cập nhật một phần bản ghi | Đổi status của 1 application (không đổi field khác) |
| **DELETE** | Xoá dữ liệu | Xoá 1 job posting |

:::note[Về tRPC]
HR Tool dùng tRPC nên phần lớn request thực tế đều đi qua `POST`, ngay cả với hành động "lấy dữ liệu" (query). Ý nghĩa nghiệp vụ (đọc hay ghi) vẫn giữ nguyên như bảng trên — chỉ là ở tầng network, method HTTP không còn phản ánh trực tiếp loại hành động như REST truyền thống. Khi test, hãy nhìn vào **tên hàm gọi** (`candidate.getList` là query/đọc, `candidate.create` là mutation/ghi) hơn là chỉ nhìn method.
:::

---

## 4. HTTP Status Code

Status code là con số 3 chữ số Server trả về để báo kết quả xử lý request.

| Nhóm | Ý nghĩa | Mã thường gặp | Ví dụ |
|------|---------|----------------|-------|
| **2xx** | Thành công | `200 OK`, `201 Created` | Đăng nhập thành công, tạo candidate thành công |
| **3xx** | Chuyển hướng | `301`, `302`, `304` | Redirect sang trang login khi chưa đăng nhập |
| **4xx** | Lỗi do Client | `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `422 Unprocessable Entity` | Gửi thiếu field, chưa đăng nhập, không đủ quyền, không tìm thấy resource |
| **5xx** | Lỗi do Server | `500 Internal Server Error`, `503 Service Unavailable` | Server crash, lỗi code chưa được xử lý (bug!) |

**Phân biệt 401 và 403** — đây là lỗi rất hay bị nhầm khi viết bug report:
- **401 Unauthorized**: chưa xác thực được danh tính (chưa đăng nhập, hoặc token hết hạn/không hợp lệ).
- **403 Forbidden**: đã biết bạn là ai, nhưng bạn KHÔNG có quyền thực hiện hành động đó (ví dụ `tech_lead` cố xoá 1 employee).

:::caution[Lưu ý khi báo bug]
Nếu bạn thấy lỗi `500 Internal Server Error`, đây gần như chắc chắn là **bug thật của hệ thống** (server gặp lỗi không được xử lý đúng cách), không phải lỗi do bạn nhập sai dữ liệu. Hãy log lại ngay kèm response body và steps to reproduce.
:::

---

## 5. Header thường gặp

| Header | Ý nghĩa |
|--------|---------|
| `Content-Type` | Định dạng dữ liệu gửi/nhận, thường là `application/json` |
| `Authorization` | Chứa token xác thực, dạng `Bearer <token>` |
| `Cookie` | Dữ liệu nhỏ được trình duyệt tự động gửi kèm mỗi request (session, token...) |
| `Set-Cookie` | Server yêu cầu trình duyệt lưu lại một cookie mới |
| `Accept-Language` | Ngôn ngữ client mong muốn — quan trọng khi test đa ngôn ngữ (en/vi) của HR Tool |

---

## 6. Cookie, Session và Token (JWT)

HTTP về bản chất là **stateless** — server không tự nhớ bạn là ai giữa 2 request khác nhau. Vì vậy cần một cơ chế để "nhắc" server nhớ trạng thái đăng nhập của bạn. Có 2 mô hình phổ biến:

- **Session-based**: Server lưu trạng thái đăng nhập trong bộ nhớ/database, chỉ gửi cho Client một `sessionId` ngắn qua cookie.
- **Token-based (JWT - JSON Web Token)**: Server không lưu trạng thái, mà cấp cho Client một "chứng chỉ" (token) chứa thông tin đã được mã hoá/ký số. Mỗi request sau đó, Client gửi kèm token này để server xác minh.

**HR Tool dùng JWT**, với 2 loại token:

| Token | Thời hạn | Vai trò |
|-------|----------|---------|
| **Access Token** | 7 ngày | Dùng để xác thực mỗi request |
| **Refresh Token** | 30 ngày | Dùng để cấp lại access token mới khi access token hết hạn, không cần đăng nhập lại |

Cả 2 token được lưu trong cookie dạng **`httpOnly`** (JavaScript ở Frontend không đọc trực tiếp được, giúp chống đánh cắp token qua lỗi XSS), với `SameSite=None; Secure` trên Staging/Production và `SameSite=Lax` khi chạy local.

**Vì sao tester cần biết điều này?**
- Test case "Logout" nên verify: sau khi logout, token cũ có còn dùng được để gọi API không? (Nếu vẫn dùng được → bug bảo mật nghiêm trọng.)
- Test case "Session timeout": sau khi access token hết hạn, hệ thống có tự làm mới bằng refresh token không, hay bắt đăng nhập lại đột ngột giữa lúc đang làm việc?

---

## 7. CORS là gì

**CORS (Cross-Origin Resource Sharing)** là cơ chế bảo mật của trình duyệt, chặn một trang web ở domain A gọi API tới domain B, TRỪ KHI domain B chủ động "cho phép" bằng cách trả về đúng header (`Access-Control-Allow-Origin`).

Khi bạn thấy lỗi màu đỏ trong Console dạng:

```
Access to fetch at 'https://api.staging...' from origin 'https://hr-tool-software.netlify.app'
has been blocked by CORS policy
```

Đây là dấu hiệu Backend chưa cấu hình đúng để cho phép Frontend gọi tới — **đây là một bug cần báo cho team Backend**, không phải lỗi do bạn test sai.

---

## 8. Thực hành đọc tab Network trong DevTools

1. Mở HR Tool Staging, mở DevTools (`F12`), chọn tab **Network**.
2. Tick chọn **Preserve log** (để không mất log khi chuyển trang) và filter loại **Fetch/XHR** (chỉ xem request API, ẩn request tải ảnh/CSS).
3. Thực hiện một hành động (ví dụ đăng nhập).
4. Click vào request vừa xuất hiện (ví dụ `login`), xem các tab con:
   - **Headers**: xem Method, Status code, Request/Response headers.
   - **Payload/Request**: xem dữ liệu bạn đã gửi lên.
   - **Response**: xem dữ liệu server trả về — đây là nơi kiểm tra dữ liệu có đúng như mong đợi không.
   - **Timing**: xem request mất bao lâu — hữu ích khi nghi ngờ vấn đề hiệu năng.

:::tip[Mẹo]
Khi báo bug liên quan tới API, hãy right-click vào request trong tab Network → **Copy → Copy as cURL** hoặc **Save all as HAR**, rồi đính kèm vào bug report. Developer có thể tái hiện lại chính xác request đó mà không cần đoán.
:::

---

## 9. Bài tập thực hành

1. Phân biệt `401 Unauthorized` và `403 Forbidden` bằng ví dụ cụ thể trong HR Tool (mỗi role: super_admin, admin, hr, tech_lead).
2. Mở DevTools trên HR Tool Staging, thực hiện đăng nhập, tìm request tương ứng và ghi lại: Method, URL đầy đủ, Status code, 2 header bất kỳ trong Response.
3. Vì sao access token của HR Tool được lưu trong cookie `httpOnly` mà không lưu trong `localStorage`? Điều này giúp chống loại lỗi bảo mật nào?
4. Bạn thấy lỗi CORS trong Console khi test một tính năng mới deploy. Đây là lỗi do bạn hay do hệ thống? Bạn sẽ báo bug như thế nào?
5. Thử tìm 1 request bất kỳ trong tab Network, xuất nó ra file HAR và giải thích khi nào bạn nên đính kèm file này vào bug report.

---

## Bước tiếp theo

Tiếp tục với [Database cơ bản cho Tester](../foundations/03-database-co-ban-cho-tester/) để học cách tự kiểm tra dữ liệu thay vì chỉ tin vào giao diện.

---

**Cần giúp đỡ?** Liên hệ QC Lead hoặc đăng trong #qc-team
