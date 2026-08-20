---
title: Test API thủ công với Postman
description: Hướng dẫn kiểm thử API thủ công bằng Postman/Thunder Client, bao gồm test REST và tRPC endpoint của HR Tool
---

# Test API thủ công với Postman

Tài liệu đào tạo QC - HR Tool

Bài này hướng dẫn bạn kiểm thử API mà không cần viết code — chỉ cần một công cụ gửi request như Postman hoặc Thunder Client. Đây là kỹ năng bắt buộc với một **fullstack tester**: rất nhiều lỗi (sai logic, validate thiếu, trả sai dữ liệu, lộ quyền) xuất hiện ở tầng API trước khi kịp lên đến giao diện.

## Mục lục

1. [Vì sao QC cần test API](#1-vì-sao-qc-cần-test-api)
2. [Cài đặt và làm quen với Postman](#2-cài-đặt-và-làm-quen-với-postman)
3. [Cấu trúc một request](#3-cấu-trúc-một-request)
4. [Test REST endpoint thông thường](#4-test-rest-endpoint-thông-thường)
5. [Test tRPC endpoint của HR Tool](#5-test-trpc-endpoint-của-hr-tool)
6. [Test Authentication](#6-test-authentication)
7. [Test CRUD Operations](#7-test-crud-operations)
8. [Test theo Role & Cross-Company](#8-test-theo-role--cross-company)
9. [Common Test Scenarios](#9-common-test-scenarios)
10. [Viết test case cho API](#10-viết-test-case-cho-api)
11. [Debug API Issues](#11-debug-api-issues)
12. [Ví dụ đầy đủ: bộ test case cho Login API](#12-ví-dụ-đầy-đủ-bộ-test-case-cho-login-api)
13. [API Test Checklist theo Router](#13-api-test-checklist-theo-router)
14. [Bài tập thực hành](#14-bài-tập-thực-hành)

---

## 1. Vì sao QC cần test API

Giao diện (UI) chỉ là "lớp vỏ" hiển thị dữ liệu. Dữ liệu thật và logic xử lý nằm ở **API** (tầng Backend). Nếu chỉ test qua UI, bạn có thể bỏ lỡ:

- Lỗi validate dữ liệu mà UI đã "che" bớt (ví dụ UI tự giới hạn số ký tự nhưng API không kiểm tra lại).
- Lỗi phân quyền — user A gọi thẳng API có thể lấy được dữ liệu của user B hoặc của company khác, dù UI không có nút nào dẫn tới đó.
- Lỗi hiệu năng, lỗi khi field bị thiếu/sai định dạng mà UI luôn gửi đúng nên không bao giờ kích hoạt được.

:::tip[Nguyên tắc]
Một tính năng chỉ được xem là test đầy đủ khi đã kiểm tra **cả UI và API** phía sau nó.
:::

## 2. Cài đặt và làm quen với Postman

1. Tải Postman: https://www.postman.com/downloads/ (hoặc dùng extension **Thunder Client** trong VS Code nếu muốn nhẹ hơn), hoặc dùng `curl`/DevTools nếu không muốn cài thêm gì.
2. Tạo một **Workspace** riêng, ví dụ `HR Tool QC`.
3. Tạo **Collection** (một nhóm request) theo module: `Auth`, `Candidates`, `Jobs`, `Applications`...
4. Tạo **Environment** chứa các biến dùng chung:

| Biến | Giá trị (Staging) |
|------|--------------------|
| `base_url` | `https://api.staging.ethansoftwaredeveloper.com` |
| `access_token` | (lấy sau khi login, dán vào đây) |
| `company_id` | (UUID của company đang test) |

Dùng biến bằng cú pháp `{{base_url}}` trong ô URL — khi đổi môi trường, bạn chỉ cần sửa 1 chỗ.

**Lấy access token nhanh nhất:** login vào web app → mở DevTools (F12) → tab **Application** → **Local Storage** → copy giá trị `accessToken`. Cách này nhanh hơn gọi lại API login trong Postman.

## 3. Cấu trúc một request

Một request HTTP gồm 4 phần chính (đã học ở bài [HTTP & Network cơ bản](../foundations/02-http-network-co-ban/)):

| Phần | Ví dụ |
|------|-------|
| **Method** | `POST` |
| **URL** | `{{base_url}}/trpc/auth.login` |
| **Headers** | `Content-Type: application/json`, `Authorization: Bearer {{access_token}}` |
| **Body** | `{"json": {"email": "admin-test@example.com", "password": "..."}}` |

Trong Postman, các phần này nằm ở: dòng URL + dropdown method, tab **Headers**, tab **Body** (chọn `raw` + `JSON`).

## 4. Test REST endpoint thông thường

Với API REST chuẩn, quy tắc chung:

- `GET` để lấy dữ liệu — thường không có Body, có thể có query param: `GET /api/candidates?page=1&limit=10`.
- `POST` để tạo mới — Body chứa dữ liệu cần tạo.
- `PUT`/`PATCH` để cập nhật — `PUT` thường thay toàn bộ resource, `PATCH` chỉ cập nhật một phần.
- `DELETE` để xoá — thường không cần Body.

Ví dụ test `GET /api/candidates/123`:

1. Set method `GET`, URL `{{base_url}}/api/candidates/123`.
2. Thêm header `Authorization: Bearer {{access_token}}`.
3. Gửi request, kiểm tra:
   - Status code = `200`.
   - Response body có đúng field mong đợi (`id`, `fullName`, `email`...).
   - Field `id` trong response = `123` (đúng resource được yêu cầu).

## 5. Test tRPC endpoint của HR Tool

HR Tool dùng **tRPC 11** cho toàn bộ API — đây là điểm khác biệt lớn nhất so với REST thông thường mà bạn cần nắm:

- Tất cả endpoint đều nằm dưới đường dẫn `/trpc/<router>.<procedure>`, ví dụ `/trpc/auth.login`, `/trpc/candidate.create`, `/trpc/job.list`.

| Loại procedure | HTTP Method | Khi nào dùng | Ví dụ |
|-----------------|-------------|--------------|-------|
| **query** | GET | Đọc dữ liệu | `employee.list`, `candidate.getById` |
| **mutation** | POST | Tạo/Sửa/Xoá | `employee.create`, `application.updateStage` |

- Với **query**, input được encode vào query string: `GET /trpc/employee.list?input={"json":{"page":1,"limit":10}}` — cách chắc chắn nhất để lấy đúng format là **mở tab Network trong DevTools khi dùng thử tính năng đó trên web app**, xem chính xác app đang gọi thế nào rồi copy lại trong Postman.
- Với **mutation**, luôn dùng method `POST`, body được bọc trong object `json`:

```json
{
  "json": {
    "email": "admin-test@example.com",
    "password": "MatKhauCuaBan"
  }
}
```

- Response cũng được bọc tương tự:

```json
{
  "result": {
    "data": {
      "json": { "user": { "id": "...", "role": "admin" } }
    }
  }
}
```

- Khi có lỗi, tRPC trả `error.json.message` và `error.json.code` (ví dụ `UNAUTHORIZED`, `BAD_REQUEST`, `INTERNAL_SERVER_ERROR`) thay vì chỉ có status code như REST — hãy đọc kỹ field này khi báo bug.

:::caution[Lưu ý]
Đừng đoán shape của request/response tRPC. Cách an toàn nhất luôn là mở DevTools → tab Network trên web app thật, thực hiện đúng hành động, rồi xem request/response thật để copy chính xác vào Postman.
:::

## 6. Test Authentication

### 6.1 Login Test Cases

| Test Case | Input | Expected |
|-----------|-------|----------|
| Đúng email/password | Credentials hợp lệ | `200` + trả về access/refresh token |
| Sai password | Đúng email, sai password | `401 UNAUTHORIZED` |
| Email không tồn tại | Email chưa từng đăng ký | `401 UNAUTHORIZED` (không được lộ "email không tồn tại") |
| Email trống | `""` | `400 BAD_REQUEST` |
| Sai định dạng email | `"notanemail"` | `400 BAD_REQUEST` |
| Password trống | `""` | `400 BAD_REQUEST` |

### 6.2 Refresh Token

```http
POST {{base_url}}/trpc/auth.refresh
Content-Type: application/json

{ "json": { "refreshToken": "{{refresh_token}}" } }
```

| Test Case | Expected |
|-----------|----------|
| Refresh token hợp lệ | Access token + refresh token mới |
| Refresh token đã hết hạn | `401 UNAUTHORIZED` |
| Refresh token không hợp lệ | `401 UNAUTHORIZED` |
| Refresh token trống | `400 BAD_REQUEST` |

### 6.3 Protected Routes

Tất cả route trừ `auth.login` cần header `Authorization`:

| Test Case | Expected |
|-----------|----------|
| Token hợp lệ | `200` + dữ liệu |
| Token đã hết hạn | `401 UNAUTHORIZED` |
| Không có token | `401 UNAUTHORIZED` |
| Token sai định dạng | `401 UNAUTHORIZED` |

## 7. Test CRUD Operations

Lấy ví dụ module `employee` để minh hoạ 4 nhóm test case CRUD — áp dụng tương tự cho `candidate`, `job`, `application`...

### 7.1 CREATE

| Scenario | Input | Expected |
|----------|-------|----------|
| Đủ field hợp lệ | Data hợp lệ | `200` + object vừa tạo |
| Thiếu field bắt buộc | Thiếu `name` | `400 BAD_REQUEST` |
| Field unique đã tồn tại | `email` đã có | `400`/`409` |
| Foreign key không tồn tại | `departmentId` không tồn tại | `400`/`404` |
| Enum không hợp lệ | `status: "invalid"` | `400 BAD_REQUEST` |
| Không có quyền | User không đủ quyền | `403 FORBIDDEN` |

### 7.2 READ

| Scenario | Expected |
|----------|----------|
| List với params hợp lệ | `200` + list có phân trang |
| Page vượt quá tổng số trang | List trống hoặc lỗi |
| Limit vượt giới hạn tối đa | Bị giới hạn lại (ví dụ tối đa 50) |
| Lấy theo ID tồn tại | `200` + object |
| Lấy theo ID không tồn tại | `404 NOT_FOUND` |
| Lấy dữ liệu của company khác | `403 FORBIDDEN` (xem thêm mục 8) |

### 7.3 UPDATE

| Scenario | Expected |
|----------|----------|
| Update hợp lệ | `200` + object đã cập nhật |
| ID không tồn tại | `404 NOT_FOUND` |
| Giá trị field không hợp lệ | `400 BAD_REQUEST` |
| Update thành giá trị unique đã tồn tại | `400`/`409` |
| Update một phần field (partial update) | Chỉ field được gửi thay đổi |
| Không có quyền | `403 FORBIDDEN` |

### 7.4 DELETE

| Scenario | Expected |
|----------|----------|
| Xoá hợp lệ | `200` + message thành công |
| ID không tồn tại | `404 NOT_FOUND` |
| Xoá khi còn dữ liệu phụ thuộc | `400` (nếu có ràng buộc khoá ngoại) |
| Không có quyền | `403 FORBIDDEN` |
| Xoá 2 lần liên tiếp | Lần 2 trả `404 NOT_FOUND` |

## 8. Test theo Role & Cross-Company

### 8.1 Role của HR Tool

| Role | Phạm vi truy cập |
|------|-------------------|
| `super_admin` | Toàn bộ company, toàn bộ tính năng |
| `admin` | Company của mình, toàn bộ tính năng trong company |
| `hr` | Company của mình, các tính năng nghiệp vụ HR |
| `tech_lead` | Company của mình, chỉ đọc + viết feedback phỏng vấn |

### 8.2 Permission Test Matrix

Với mỗi endpoint quan trọng, nên có 1 bảng test theo role như sau:

| Role | Endpoint: `employee.create` — Expected |
|------|------------------------------------------|
| `super_admin` | `200` |
| `admin` | `200` |
| `hr` | `200` |
| `tech_lead` | `403 FORBIDDEN` (không có quyền tạo) |
| Không đăng nhập | `401 UNAUTHORIZED` |

### 8.3 Cross-Company Access Test

Đây là nhóm test **quan trọng nhất** với hệ thống multi-tenant như HR Tool — kiểm tra company A có "nhìn thấy" hoặc sửa được dữ liệu của company B không:

```
1. Login bằng admin của Company A
2. Lấy ID của một employee thuộc Company B
3. Gọi GET /trpc/employee.getById với ID đó
4. Kết quả mong đợi: 403 FORBIDDEN hoặc 404 NOT_FOUND
   (KHÔNG được trả về 200 kèm dữ liệu — đây là lỗi bảo mật nghiêm trọng nếu xảy ra)
```

:::caution[Rủi ro bảo mật]
Nếu bước 3 ở trên trả về `200` và dữ liệu thật của Company B, đây là lỗi **IDOR** (Insecure Direct Object Reference) — cần báo priority cao nhất. Xem thêm bài [Security Testing cơ bản](./11-security-testing-co-ban/).
:::

## 9. Common Test Scenarios

### 9.1 Pagination

| Test | Input | Verify |
|------|-------|--------|
| Trang đầu | `page=1, limit=10` | `items.length <= 10`, `total > 0` |
| Trang cuối | `page=totalPages` | `items.length <= limit` |
| Vượt trang cuối | `page=999` | `items=[]`, `total` không đổi |
| Page = 0 | `page=0` | Lỗi hoặc tự hiểu là page 1 |
| Page âm | `page=-1` | Lỗi |
| Limit = 0 | `limit=0` | Lỗi hoặc dùng limit mặc định |
| Limit vượt max | `limit=1000` | Bị giới hạn lại (ví dụ max 50) |

### 9.2 Filter

| Test | Verify |
|------|--------|
| 1 filter | Toàn bộ kết quả khớp filter |
| Nhiều filter cùng lúc | Kết quả khớp TẤT CẢ filter |
| Giá trị filter không hợp lệ | Lỗi hoặc bị bỏ qua |
| Filter theo foreign key không tồn tại | Kết quả trống |

### 9.3 Search

| Test | Input | Verify |
|------|-------|--------|
| Khớp chính xác | `"Nguyễn Văn A"` | Tìm thấy |
| Khớp một phần | `"nguyen"` | Tìm thấy |
| Không phân biệt hoa/thường | `"NGUYEN"` | Tìm thấy |
| Không khớp | `"xyz123"` | Kết quả trống |
| Ký tự đặc biệt | `"O'Brien"` | Xử lý đúng, không lỗi |
| SQL injection | `"'; DROP TABLE--"` | Không lỗi, không có injection xảy ra |

### 9.4 Date/Time & Validation

| Test | Input | Expected |
|------|-------|----------|
| Ngày hợp lệ | `"2025-02-01"` | Được chấp nhận |
| Sai format | `"01-02-2025"` | Lỗi |
| Ngày không tồn tại | `"2025-02-30"` | Lỗi |
| Email sai định dạng | `"not-an-email"` | `400 BAD_REQUEST` |
| UUID sai định dạng | `"abc"` | Lỗi |
| Số âm cho field chỉ nhận số dương | `-5` | Lỗi |

## 10. Viết test case cho API

Một test case API cần verify đủ 3 nhóm:

1. **Status code** — đúng loại kết quả mong đợi (`200`/`201` khi thành công, `400` khi input sai, `401` khi chưa đăng nhập, `403` khi không đủ quyền, `404` khi không tồn tại resource, `500` khi lỗi server).
2. **Response body/schema** — đúng field, đúng kiểu dữ liệu, không thừa/thiếu field nhạy cảm (ví dụ response login không nên trả về `password` dù đã hash).
3. **Response time** — API có phản hồi trong thời gian hợp lý không (ví dụ dưới 1-2 giây với API thường), nếu chậm bất thường cần ghi nhận để escalate (xem bài [Performance Testing - Khái niệm](./10-performance-testing-khai-niem/)).

Luôn test cả **positive case** (input đúng) và **negative case** (thiếu field, sai kiểu dữ liệu, không có quyền, token hết hạn).

## 11. Debug API Issues

### 11.1 Đọc Error Response

```json
{
  "error": {
    "message": "Input validation failed",
    "code": -32600,
    "data": {
      "code": "BAD_REQUEST",
      "httpStatus": 400,
      "path": "employee.create",
      "zodError": {
        "issues": [
          { "code": "invalid_type", "expected": "string", "received": "undefined", "path": ["name"], "message": "Required" }
        ]
      }
    }
  }
}
```

Các field cần chú ý: `data.code` (loại lỗi), `data.path` (procedure nào lỗi), `data.zodError.issues` (chi tiết field nào sai, vì HR Tool dùng Zod để validate).

### 11.2 Common Error Codes

| Code | HTTP Status | Ý nghĩa |
|------|-------------|---------|
| `BAD_REQUEST` | 400 | Input không hợp lệ |
| `UNAUTHORIZED` | 401 | Không có/token không hợp lệ |
| `FORBIDDEN` | 403 | Không có quyền |
| `NOT_FOUND` | 404 | Không tìm thấy resource |
| `CONFLICT` | 409 | Trùng lặp/xung đột dữ liệu |
| `INTERNAL_SERVER_ERROR` | 500 | Lỗi phía server (bug thật) |

### 11.3 Debug Checklist

- [ ] Token còn hợp lệ không? (kiểm tra hạn)
- [ ] Đúng HTTP method chưa? (GET cho query, POST cho mutation)
- [ ] Header `Content-Type: application/json` đã có chưa?
- [ ] Body đúng format `{"json": {...}}` chưa?
- [ ] Đủ field bắt buộc chưa?
- [ ] Kiểu dữ liệu field đúng chưa? (string vs number vs uuid)
- [ ] Foreign key có tồn tại không?
- [ ] User có đủ quyền không?
- [ ] Dữ liệu có thuộc đúng company của user không?

### 11.4 Dùng Browser DevTools để đối chiếu

1. Mở tab Network (F12), filter theo `trpc`.
2. Click vào request để xem **Headers** (token, content-type), **Payload** (request body), **Response** (response thật), **Timing** (thời gian phản hồi).
3. So sánh với request bạn đang test trong Postman — nếu khác, request trong Postman đang thiếu/sai gì đó.

## 12. Ví dụ đầy đủ: bộ test case cho Login API

| ID | Mô tả | Input | Kết quả mong đợi |
|----|-------|-------|-------------------|
| API-LOGIN-01 | Login đúng email/password | Email + password hợp lệ | `200`, trả về `access_token`, không trả `password` |
| API-LOGIN-02 | Sai password | Email hợp lệ, password sai | `401`, message rõ ràng, không lộ thông tin email có tồn tại hay không |
| API-LOGIN-03 | Thiếu field email | Body không có `email` | `400`, message chỉ rõ field thiếu |
| API-LOGIN-04 | Email sai định dạng | `email: "not-an-email"` | `400` |
| API-LOGIN-05 | Email chứa ký tự đặc biệt hợp lệ | `email: "test+1@gmail.com"` | `200` nếu tài khoản tồn tại — **đây chính là bug thật đã từng xảy ra** (hệ thống trả lỗi `500` thay vì xử lý đúng) |
| API-LOGIN-06 | Tài khoản không tồn tại | Email chưa từng đăng ký | `401`, không được lộ "email không tồn tại" (tránh dò tài khoản) |

:::note[Case thật từ HR Tool]
API-LOGIN-05 dựa trên bug thật đã ghi trong [Template Báo cáo lỗi](../basics/02-bug-report-template/) — một ví dụ điển hình cho thấy giá trị của việc test API kỹ ở các input "lạ" (ký tự đặc biệt, biên dữ liệu).
:::

## 13. API Test Checklist theo Router

### 13.1 Checklist chung cho mỗi endpoint

- [ ] **Authentication**: hoạt động với token hợp lệ, từ chối token sai/hết hạn/không có token
- [ ] **Authorization**: đúng theo từng role (`super_admin`, `admin`, `hr`, `tech_lead`), chặn được cross-company
- [ ] **Input validation**: đủ field bắt buộc, đúng kiểu, đúng format (email/phone...), đúng enum, foreign key hợp lệ, unique constraint
- [ ] **Business logic**: happy path chạy đúng, các edge case được xử lý, message lỗi rõ ràng
- [ ] **Response**: đúng status code, đúng format, không lộ dữ liệu nhạy cảm

### 13.2 Danh sách router thật của HR Tool cần cover

Dùng danh sách này làm khung khi lập bộ test case API đầy đủ cho một sprint/release:

**Auth:** `auth.login`, `auth.refresh`, `auth.logout`
**User:** `user.me`, `user.updateProfile`
**Employee:** `employee.create`, `employee.list`, `employee.getById`, `employee.update`, `employee.delete`, `employee.stats`
**Department / Position:** `create`, `list`, `update`, `delete`
**Job:** `job.createFromJD`, `job.list`, `job.getById`, `job.updateStatus`, `job.delete`
**Candidate:** `candidate.createFromCV`, `candidate.list`, `candidate.getById`, `candidate.updateStatus`, `candidate.delete`
**Application:** `application.create`, `application.list`, `application.getById`, `application.updateStage`, `application.updateNotes`, `application.delete`, `application.stats`
**Interview:** `interview.create`, `interview.list`, `interview.getById`, `interview.updateStatus`, `interview.addFeedback`, `interview.delete`, `interview.stats`
**CV Matching:** `cvMatching.createSession`, `cvMatching.listSessions`, `cvMatching.getSession`, `cvMatching.addDocuments`, `cvMatching.startMatching`, `cvMatching.getResults`, `cvMatching.deleteSession`
**Company (Super Admin):** `company.create`, `company.list`, `company.getById`, `company.update`, `company.delete`, `company.createUser`, `company.updateUser`, `company.deleteUser`
**Invitation:** `invitation.create`, `invitation.list`, `invitation.validateToken`, `invitation.accept`, `invitation.revoke`

## 14. Bài tập thực hành

1. Cài Postman, tạo Collection `HR Tool QC` với Environment chứa `base_url`.
2. Mở DevTools trên web app Staging, thực hiện đăng nhập, quan sát request thật gửi tới `/trpc/auth.login` — ghi lại chính xác Method, Headers, Body.
3. Tái tạo lại request đó trong Postman và gửi thử — so sánh response với response thật bạn thấy trong DevTools.
4. Viết thêm 3 test case negative cho một API bất kỳ trong module Candidates hoặc Jobs (không có trong bảng trên).
5. Thử gọi một API mutation (ví dụ tạo Candidate) mà KHÔNG gửi `Authorization` header — kết quả có đúng là `401` không?
6. Thực hiện thử bài test Cross-Company ở mục 8.3 (nếu môi trường test cho phép tạo 2 company) — ghi lại kết quả thật.

## Bước tiếp theo

Tiếp tục với [Database Testing thực hành](./07-database-testing-thuc-hanh/) để học cách verify dữ liệu sau khi gọi API/thực hiện action.

---

**Cần giúp đỡ?** Liên hệ QC Lead hoặc đăng trong #qc-team
