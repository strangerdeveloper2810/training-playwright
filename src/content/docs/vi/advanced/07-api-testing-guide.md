---
title: Hướng dẫn Test API
description: Hướng dẫn test API với tRPC và Thunder Client
---

# Hướng dẫn Test API với tRPC

Tài liệu đào tạo QC - HR Tool

**Phiên bản:** 2.0
**Cập nhật:** 26/02/2026
**Tác giả:** QC Team

---

## Mục lục

1. [Giới thiệu tRPC](#1-giới-thiệu-trpc)
2. [Thiết lập môi trường test](#2-thiết-lập-môi-trường-test)
3. [Cách gọi tRPC endpoints](#3-cách-gọi-trpc-endpoints)
4. [Test Authentication](#4-test-authentication)
5. [Test CRUD Operations](#5-test-crud-operations)
6. [Test với các Roles khác nhau](#6-test-với-các-roles-khác-nhau)
7. [Common Test Scenarios](#7-common-test-scenarios)
8. [Debug API Issues](#8-debug-api-issues)
9. [API Test Checklist](#9-api-test-checklist)

---

## 1. Giới thiệu tRPC

### 1.1 tRPC là gì?

**tRPC** (TypeScript Remote Procedure Call) là framework để build type-safe APIs.

**So sánh với REST:**

| REST | tRPC |
|------|------|
| `POST /api/users` | `trpc.user.create()` |
| `GET /api/users/123` | `trpc.user.getById({ id: 123 })` |
| JSON request/response | Type-safe request/response |
| Cần viết types thủ công | Types tự động từ backend |

### 1.2 Cấu trúc tRPC trong HR Tool

```
HTTP Request
     ↓
/trpc/{router}.{procedure}
     ↓
┌──────────────────────────┐
│  Routers (apps/api/src/trpc/routers/)
├──────────────────────────┤
│  • auth.router.ts        │
│  • user.router.ts        │
│  • employee.router.ts    │
│  • department.router.ts  │
│  • position.router.ts    │
│  • job.router.ts         │
│  • candidate.router.ts   │
│  • application.router.ts │
│  • interview.router.ts   │
│  • cv-matching.router.ts │
│  • company.router.ts     │
│  • invitation.router.ts  │
│  • system-log.router.ts  │
└──────────────────────────┘
```

### 1.3 Procedure Types

| Type | HTTP Method | Khi nào dùng | Ví dụ |
|------|-------------|--------------|-------|
| **query** | GET | Read data | `employee.list` |
| **mutation** | POST | Create/Update/Delete | `employee.create` |

---

## 2. Thiết lập môi trường test

### 2.1 Tools cần có

| Tool | Mục đích | Download |
|------|----------|----------|
| **Postman** | Test API với GUI | [postman.com](https://www.postman.com/) |
| **Insomnia** | Alternative cho Postman | [insomnia.rest](https://insomnia.rest/) |
| **curl** | Test từ terminal | Built-in |
| **Browser DevTools** | Xem network requests | F12 |

### 2.2 Environment Variables

Tạo collection với các environment variables:

```
BASE_URL: https://hr-tool-staging.ddnsfree.com
ACCESS_TOKEN: [lấy sau khi login]
COMPANY_ID: [UUID của company đang test]
```

### 2.3 Lấy Access Token

**Cách 1: Từ Browser (đơn giản nhất)**

1. Login vào app: https://hr-tool-software.netlify.app/
2. Mở DevTools (F12)
3. Vào tab **Application** → **Local Storage**
4. Copy giá trị của `accessToken`

**Cách 2: Qua API**

```http
POST {{BASE_URL}}/trpc/auth.login
Content-Type: application/json

{
  "json": {
    "email": "{{TEST_EMAIL}}",
    "password": "{{TEST_PASSWORD}}"
  }
}
```

Response:

```json
{
  "result": {
    "data": {
      "json": {
        "accessToken": "eyJhbGciOiJIUzI1NiIs...",
        "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
        "user": {
          "id": "uuid",
          "email": "user@example.com",
          "name": "User Name",
          "role": "admin"
        }
      }
    }
  }
}
```

---

## 3. Cách gọi tRPC endpoints

### 3.1 URL Format

```
{{BASE_URL}}/trpc/{router}.{procedure}
```

**Ví dụ:**
- `GET /trpc/employee.list` - Lấy danh sách employees
- `POST /trpc/employee.create` - Tạo employee mới
- `GET /trpc/employee.getById?input=...` - Lấy employee theo ID

### 3.2 Query (GET request)

Để gọi query với parameters, encode JSON vào query string:

```http
GET {{BASE_URL}}/trpc/employee.list?input={"json":{"page":1,"limit":10}}
Authorization: Bearer {{ACCESS_TOKEN}}
```

**Hoặc dùng URL encoding:**

```
GET /trpc/employee.list?input=%7B%22json%22%3A%7B%22page%22%3A1%2C%22limit%22%3A10%7D%7D
```

### 3.3 Mutation (POST request)

```http
POST {{BASE_URL}}/trpc/employee.create
Content-Type: application/json
Authorization: Bearer {{ACCESS_TOKEN}}

{
  "json": {
    "name": "Test Employee",
    "email": "test@example.com",
    "employeeCode": "EMP001",
    "departmentId": "department-uuid",
    "positionId": "position-uuid",
    "joinDate": "2025-01-15",
    "contractType": "full_time",
    "status": "active"
  }
}
```

### 3.4 Response Format

**Success Response:**

```json
{
  "result": {
    "data": {
      "json": {
        // actual data here
      }
    }
  }
}
```

**Error Response:**

```json
{
  "error": {
    "message": "Error message",
    "code": -32600,
    "data": {
      "code": "UNAUTHORIZED",
      "httpStatus": 401,
      "path": "employee.create"
    }
  }
}
```

---

## 4. Test Authentication

### 4.1 Login Test Cases

| Test Case | Input | Expected |
|-----------|-------|----------|
| Valid credentials | Đúng email/password | 200 + tokens |
| Wrong password | Đúng email, sai password | 401 UNAUTHORIZED |
| Non-existent email | Email không tồn tại | 401 UNAUTHORIZED |
| Empty email | `""` | 400 BAD_REQUEST |
| Invalid email format | `"notanemail"` | 400 BAD_REQUEST |
| Empty password | `""` | 400 BAD_REQUEST |

### 4.2 Token Refresh

```http
POST {{BASE_URL}}/trpc/auth.refresh
Content-Type: application/json

{
  "json": {
    "refreshToken": "{{REFRESH_TOKEN}}"
  }
}
```

| Test Case | Expected |
|-----------|----------|
| Valid refresh token | New access token + refresh token |
| Expired refresh token | 401 UNAUTHORIZED |
| Invalid refresh token | 401 UNAUTHORIZED |
| Empty refresh token | 400 BAD_REQUEST |

### 4.3 Protected Routes

Tất cả routes trừ `auth.login` cần Authorization header:

```http
GET {{BASE_URL}}/trpc/user.me
Authorization: Bearer {{ACCESS_TOKEN}}
```

| Test Case | Expected |
|-----------|----------|
| Valid token | 200 + user data |
| Expired token | 401 UNAUTHORIZED |
| No token | 401 UNAUTHORIZED |
| Malformed token | 401 UNAUTHORIZED |

---

## 5. Test CRUD Operations

### 5.1 CREATE - Tạo mới

**Example: Create Employee**

```http
POST {{BASE_URL}}/trpc/employee.create
Content-Type: application/json
Authorization: Bearer {{ACCESS_TOKEN}}

{
  "json": {
    "name": "Nguyễn Văn Test",
    "email": "test.employee@example.com",
    "employeeCode": "EMP999",
    "departmentId": "{{DEPARTMENT_ID}}",
    "positionId": "{{POSITION_ID}}",
    "joinDate": "2025-02-01",
    "contractType": "full_time",
    "status": "active"
  }
}
```

**Test Cases:**

| Scenario | Input | Expected |
|----------|-------|----------|
| All required fields | Valid data | 200 + created object |
| Missing required field | Thiếu `name` | 400 BAD_REQUEST |
| Duplicate unique field | `email` đã tồn tại | 400/409 |
| Invalid foreign key | `departmentId` không tồn tại | 400/404 |
| Invalid enum value | `status: "invalid"` | 400 BAD_REQUEST |
| No permission | User không có quyền | 403 FORBIDDEN |

### 5.2 READ - Đọc dữ liệu

**List with pagination:**

```http
GET {{BASE_URL}}/trpc/employee.list?input={"json":{"page":1,"limit":10}}
Authorization: Bearer {{ACCESS_TOKEN}}
```

**Get by ID:**

```http
GET {{BASE_URL}}/trpc/employee.getById?input={"json":{"id":"{{EMPLOYEE_ID}}"}}
Authorization: Bearer {{ACCESS_TOKEN}}
```

**Test Cases:**

| Scenario | Expected |
|----------|----------|
| List with valid params | 200 + paginated list |
| Page > total pages | Empty list or error |
| Limit > max allowed | Capped at max (50) |
| Get existing ID | 200 + object |
| Get non-existent ID | 404 NOT_FOUND |
| Get other company's data | 403 FORBIDDEN |

### 5.3 UPDATE - Cập nhật

```http
POST {{BASE_URL}}/trpc/employee.update
Content-Type: application/json
Authorization: Bearer {{ACCESS_TOKEN}}

{
  "json": {
    "id": "{{EMPLOYEE_ID}}",
    "name": "Updated Name"
  }
}
```

**Test Cases:**

| Scenario | Expected |
|----------|----------|
| Valid update | 200 + updated object |
| Non-existent ID | 404 NOT_FOUND |
| Invalid field value | 400 BAD_REQUEST |
| Update to duplicate unique | 400/409 |
| Partial update | Only specified fields change |
| No permission | 403 FORBIDDEN |

### 5.4 DELETE - Xóa

```http
POST {{BASE_URL}}/trpc/employee.delete
Content-Type: application/json
Authorization: Bearer {{ACCESS_TOKEN}}

{
  "json": {
    "id": "{{EMPLOYEE_ID}}"
  }
}
```

**Test Cases:**

| Scenario | Expected |
|----------|----------|
| Valid delete | 200 + success message |
| Non-existent ID | 404 NOT_FOUND |
| Delete with dependencies | 400 (if FK constraint) |
| No permission | 403 FORBIDDEN |
| Double delete | 404 NOT_FOUND |

---

## 6. Test với các Roles khác nhau

### 6.1 HR Tool Roles

| Role | Access Level |
|------|--------------|
| **super_admin** | All companies, all features |
| **admin** | Own company, all features |
| **hr** | Own company, HR features |
| **tech_lead** | Own company, read + interviews |

### 6.2 Test Matrix Template

```
┌─────────────────────────────────────────────────────────────────────┐
│                    PERMISSION TEST MATRIX                           │
├─────────────────────────────────────────────────────────────────────┤
│ Endpoint: employee.create                                           │
├─────────────┬───────────┬───────────┬───────────┬──────────────────┤
│ Role        │ Expected  │ Actual    │ Status    │ Notes            │
├─────────────┼───────────┼───────────┼───────────┼──────────────────┤
│ super_admin │ 200       │           │           │                  │
│ admin       │ 200       │           │           │                  │
│ hr          │ 200       │           │           │                  │
│ tech_lead   │ 403       │           │           │ No write access  │
│ No auth     │ 401       │           │           │                  │
└─────────────┴───────────┴───────────┴───────────┴──────────────────┘
```

### 6.3 Cross-Company Access Test

Test xem user có thể access data của company khác không:

```
Scenario: Admin of Company A tries to access Company B's employee

1. Login as admin of Company A
2. Get employee ID from Company B
3. Call GET /trpc/employee.getById with Company B's employee ID
4. Expected: 403 FORBIDDEN or 404 NOT_FOUND
```

---

## 7. Common Test Scenarios

### 7.1 Pagination Tests

| Test | Input | Verify |
|------|-------|--------|
| First page | page=1, limit=10 | items.length <= 10, total > 0 |
| Last page | page=totalPages | items.length <= limit |
| Beyond last | page=999 | items=[], total unchanged |
| Zero page | page=0 | Error or treated as page 1 |
| Negative page | page=-1 | Error |
| Zero limit | limit=0 | Error or default limit |
| Limit > max | limit=1000 | Capped at max (50) |

### 7.2 Filter Tests

| Test | Verify |
|------|--------|
| Single filter | All results match filter |
| Multiple filters | Results match ALL filters |
| Invalid filter value | Error or ignored |
| Non-existent FK filter | Empty results |

### 7.3 Search Tests

| Test | Input | Verify |
|------|-------|--------|
| Exact match | "Nguyễn Văn A" | Found |
| Partial match | "nguyen" | Found |
| Case insensitive | "NGUYEN" | Found |
| No match | "xyz123" | Empty |
| Special characters | "O'Brien" | Handle correctly |
| SQL injection | "'; DROP TABLE--" | No error, no injection |

### 7.4 Date/Time Tests

| Test | Input | Expected |
|------|-------|----------|
| Valid date | "2025-02-01" | Accepted |
| Invalid format | "01-02-2025" | Error |
| Invalid date | "2025-02-30" | Error |
| Future date | "2099-01-01" | Depends on rule |
| Past date | "2020-01-01" | Accepted |

### 7.5 Validation Tests

| Field Type | Test Cases |
|------------|------------|
| **Email** | valid, invalid format, empty, too long |
| **Phone** | valid, invalid format, special chars |
| **Required string** | empty, whitespace only, valid |
| **Enum** | valid value, invalid value, case sensitivity |
| **UUID** | valid, invalid format, non-existent |
| **Number** | positive, negative, zero, decimal, string |

---

## 8. Debug API Issues

### 8.1 Đọc Error Response

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
          {
            "code": "invalid_type",
            "expected": "string",
            "received": "undefined",
            "path": ["name"],
            "message": "Required"
          }
        ]
      }
    }
  }
}
```

**Key fields to check:**
- `data.code`: Error code (BAD_REQUEST, UNAUTHORIZED, etc.)
- `data.path`: Which procedure failed
- `data.zodError.issues`: Validation errors chi tiết

### 8.2 Common Error Codes

| Code | HTTP Status | Meaning |
|------|-------------|---------|
| BAD_REQUEST | 400 | Invalid input |
| UNAUTHORIZED | 401 | No/invalid token |
| FORBIDDEN | 403 | No permission |
| NOT_FOUND | 404 | Resource not found |
| CONFLICT | 409 | Duplicate/conflict |
| INTERNAL_SERVER_ERROR | 500 | Server bug |

### 8.3 Debug Checklist

```
☐ Token valid? (check expiry)
☐ Correct HTTP method? (GET for query, POST for mutation)
☐ Content-Type: application/json?
☐ Request body format correct? ({"json": {...}})
☐ All required fields present?
☐ Field types correct? (string vs number vs uuid)
☐ Foreign keys exist?
☐ User has permission?
☐ Data belongs to user's company?
```

### 8.4 Sử dụng Browser DevTools

1. Open Network tab (F12)
2. Filter by "trpc"
3. Click vào request để xem:
   - **Headers**: Auth token, content-type
   - **Payload**: Request body
   - **Response**: Actual response
   - **Timing**: Response time

---

## 9. API Test Checklist

### 9.1 Per-Endpoint Checklist

```
☐ AUTHENTICATION
  ☐ Works with valid token
  ☐ Rejects invalid token
  ☐ Rejects expired token
  ☐ Rejects no token

☐ AUTHORIZATION
  ☐ super_admin access
  ☐ admin access
  ☐ hr access
  ☐ tech_lead access
  ☐ Cross-company blocked

☐ INPUT VALIDATION
  ☐ All required fields validated
  ☐ Field types validated
  ☐ Field formats validated (email, phone, etc.)
  ☐ Enum values validated
  ☐ Foreign keys validated
  ☐ Unique constraints validated

☐ BUSINESS LOGIC
  ☐ Happy path works
  ☐ Edge cases handled
  ☐ Error messages clear

☐ RESPONSE
  ☐ Correct status code
  ☐ Correct response format
  ☐ Sensitive data not exposed
```

### 9.2 Full API Test Suite

**Auth Router:**
- [ ] auth.login
- [ ] auth.refresh
- [ ] auth.logout

**User Router:**
- [ ] user.me
- [ ] user.updateProfile

**Employee Router:**
- [ ] employee.create
- [ ] employee.list
- [ ] employee.getById
- [ ] employee.update
- [ ] employee.delete
- [ ] employee.stats

**Department Router:**
- [ ] department.create
- [ ] department.list
- [ ] department.update
- [ ] department.delete

**Position Router:**
- [ ] position.create
- [ ] position.list
- [ ] position.update
- [ ] position.delete

**Job Router:**
- [ ] job.createFromJD
- [ ] job.list
- [ ] job.getById
- [ ] job.updateStatus
- [ ] job.delete

**Candidate Router:**
- [ ] candidate.createFromCV
- [ ] candidate.list
- [ ] candidate.getById
- [ ] candidate.updateStatus
- [ ] candidate.delete

**Application Router:**
- [ ] application.create
- [ ] application.list
- [ ] application.getById
- [ ] application.updateStage
- [ ] application.updateNotes
- [ ] application.delete
- [ ] application.stats

**Interview Router:**
- [ ] interview.create
- [ ] interview.list
- [ ] interview.getById
- [ ] interview.updateStatus
- [ ] interview.addFeedback
- [ ] interview.delete
- [ ] interview.stats

**CV Matching Router:**
- [ ] cvMatching.createSession
- [ ] cvMatching.listSessions
- [ ] cvMatching.getSession
- [ ] cvMatching.addDocuments
- [ ] cvMatching.startMatching
- [ ] cvMatching.getResults
- [ ] cvMatching.deleteSession

**Company Router (Super Admin):**
- [ ] company.create
- [ ] company.list
- [ ] company.getById
- [ ] company.update
- [ ] company.delete
- [ ] company.createUser
- [ ] company.updateUser
- [ ] company.deleteUser

**Invitation Router:**
- [ ] invitation.create
- [ ] invitation.list
- [ ] invitation.validateToken
- [ ] invitation.accept
- [ ] invitation.revoke

---

## Tài khoản Test

| Vai trò | Email |
|---------|-------|
| Super Admin | Liên hệ QC Lead |
| Admin | Liên hệ QC Lead |
| HR | Liên hệ QC Lead |
| Tech Lead | Liên hệ QC Lead |

> Liên hệ QC Lead để nhận thông tin tài khoản test.

---

**Cần giúp đỡ?** Liên hệ QC Lead hoặc đăng trong #qc-team
