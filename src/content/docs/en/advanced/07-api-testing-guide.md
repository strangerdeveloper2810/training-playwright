---
title: API Testing Guide
description: Guide for API testing with tRPC and Thunder Client
---

# API Testing Guide with tRPC

HR Tool QC Training Materials

**Document Version:** 1.0
**Last Updated:** 26/02/2026
**Author:** QC Team

---

## 1. Introduction to tRPC

### What is tRPC?

tRPC (TypeScript Remote Procedure Call) is the API framework used in HR Tool.

| Feature | REST | tRPC |
|---------|------|------|
| Endpoint format | `/api/users/123` | `trpc/user.getById` |
| HTTP Methods | GET, POST, PUT, DELETE | POST (mostly) |
| Request body | JSON | JSON with procedure name |
| Type safety | Manual | Automatic |

---

## 2. Setup & Tools

### Thunder Client (VS Code)

1. Install Thunder Client extension
2. Create new request
3. Set method to POST
4. Set URL to tRPC endpoint

### Base URL

```
Staging: https://hr-tool-staging.ddnsfree.com/trpc
```

---

## 3. Authentication

### Login Request

**Endpoint:** `POST /trpc/auth.login`

**Body:**
```json
{
  "json": {
    "email": "your-email@example.com",
    "password": "your-password"
  }
}
```

**Response:**
```json
{
  "result": {
    "data": {
      "json": {
        "accessToken": "eyJhbG...",
        "refreshToken": "eyJhbG...",
        "user": {
          "id": "uuid",
          "email": "your-email@example.com",
          "role": "admin"
        }
      }
    }
  }
}
```

### Using Access Token

Add header for authenticated requests:
```
Authorization: Bearer <accessToken>
```

---

## 4. Common Endpoints

### User

| Procedure | Description |
|-----------|-------------|
| `auth.login` | Login |
| `auth.logout` | Logout |
| `auth.refresh` | Refresh token |
| `user.me` | Get current user |

### Employees

| Procedure | Description |
|-----------|-------------|
| `employee.list` | List employees |
| `employee.getById` | Get employee by ID |
| `employee.create` | Create employee |
| `employee.update` | Update employee |
| `employee.delete` | Delete employee |

### Jobs

| Procedure | Description |
|-----------|-------------|
| `job.list` | List jobs |
| `job.createFromJD` | Create from JD text |
| `job.updateStatus` | Update job status |

### Candidates

| Procedure | Description |
|-----------|-------------|
| `candidate.list` | List candidates |
| `candidate.createFromCV` | Create from CV text |
| `candidate.updateStatus` | Update status |

---

## 5. Test Cases Examples

### Test: List Employees

**Request:**
```
POST /trpc/employee.list
Authorization: Bearer <token>

{
  "json": {
    "page": 1,
    "limit": 10
  }
}
```

**Expected:**
- Status 200
- Response contains `items` array
- Response contains `total` count

### Test: Create Employee (Missing Required Field)

**Request:**
```
POST /trpc/employee.create
Authorization: Bearer <token>

{
  "json": {
    "name": "John Doe"
    // missing email
  }
}
```

**Expected:**
- Error response
- Validation error message

---

## 6. Error Handling

### Common Error Codes

| Code | Meaning |
|------|---------|
| UNAUTHORIZED | Missing/invalid token |
| FORBIDDEN | No permission |
| NOT_FOUND | Resource not found |
| BAD_REQUEST | Invalid input |
| INTERNAL_SERVER_ERROR | Server error |

---

## 7. Best Practices

1. **Always test with fresh token** - Tokens expire
2. **Test both happy and error paths**
3. **Check response structure** - Not just status code
4. **Use realistic test data**
5. **Document your test collections**
