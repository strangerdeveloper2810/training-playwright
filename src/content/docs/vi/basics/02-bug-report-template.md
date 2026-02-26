---
title: Template Báo cáo lỗi
description: Hướng dẫn viết bug report chuẩn theo JIRA template
---

# Template Báo cáo lỗi - Hướng dẫn QC & BA

Tài liệu đào tạo QC - HR Tool

**Phiên bản:** 1.0
**Cập nhật:** 26/02/2026
**Tác giả:** QC Team

---

## Mục lục

1. [Bug Summary Format](#1-bug-summary-format)
2. [Bug Report Template](#2-bug-report-template)
3. [Priority Guidelines](#3-priority-guidelines)
4. [Bug Categories (Labels)](#4-bug-categories-labels)
5. [Module/Component List](#5-modulecomponent-list)
6. [Test Environment & Setup](#6-test-environment--setup)
7. [Role & Permission Matrix](#7-role--permission-matrix)
8. [Bug Report Checklist](#8-bug-report-checklist)
9. [Template cho Automation Test Bug](#9-template-cho-automation-test-bug)
10. [Ví dụ Bug Report Hoàn Chỉnh](#10-ví-dụ-bug-report-hoàn-chỉnh)
11. [Tips cho QC](#11-tips-cho-qc)

---

## 1. Bug Summary Format

**Format chuẩn:**

```
[Module] - [Tính năng] - [Mô tả ngắn gọn vấn đề]
```

**Ví dụ ĐÚNG:**
- `[Auth] - Login - Không thể đăng nhập với email có dấu cách ở cuối`
- `[Employee] - Create - Lỗi 500 khi tạo nhân viên trùng mã`
- `[CV-Matching] - Upload - File PDF > 5MB không upload được nhưng không có thông báo lỗi`

**Ví dụ SAI:**
- `Lỗi đăng nhập` (quá chung chung)
- `Bug` (không có thông tin)
- `Không hoạt động` (không rõ ràng)

---

## 2. Bug Report Template

### 2.1 Thông tin cơ bản

| Field | Mô tả | Bắt buộc |
|-------|-------|----------|
| **Summary** | Tiêu đề bug theo format trên | ✅ |
| **Issue Type** | Bug | ✅ |
| **Priority** | Highest/High/Medium/Low | ✅ |
| **Affects Version** | Version phát hiện bug | ✅ |
| **Environment** | Staging | ✅ |
| **Component** | Module bị ảnh hưởng | ✅ |
| **Assignee** | Dev được assign | ❌ |
| **Labels** | `manual-test`, `automation-test`, `regression` | ❌ |

### 2.2 Description Template

```markdown
## Mô tả Bug
[Mô tả ngắn gọn bug là gì, xảy ra ở đâu]

## Preconditions (Điều kiện tiên quyết)
- User đã đăng nhập với role: [super_admin/admin/hr/tech_lead]
- Đã có dữ liệu: [mô tả dữ liệu cần có trước]
- Browser: [Chrome/Firefox/Safari]
- Device: [Desktop/Mobile]

## Steps to Reproduce (Các bước tái hiện)
1. Truy cập trang [URL cụ thể]
2. Click vào [element cụ thể]
3. Nhập dữ liệu: [dữ liệu test cụ thể]
4. Click [button/action]
5. Quan sát kết quả

## Expected Result (Kết quả mong đợi)
[Mô tả chi tiết hệ thống PHẢI hoạt động như thế nào]

## Actual Result (Kết quả thực tế)
[Mô tả chi tiết hệ thống ĐANG hoạt động như thế nào - đây là bug]

## Test Data (Dữ liệu test)
- Email: [liên hệ QC Lead để nhận tài khoản test]
- Password: ********
- [Các dữ liệu khác sử dụng để test]

## Error Message / Console Log
```
[Paste error message hoặc console log ở đây]
```

## Attachments
- [ ] Screenshot bug
- [ ] Video recording (nếu cần)
- [ ] HAR file (nếu liên quan đến API)
- [ ] Console log

## API Information (nếu có)
- Endpoint: `POST /trpc/auth.login`
- Request Body: `{"email": "test@example.com", "password": "***"}`
- Response: `{"error": "...", "code": "..."}`
- Status Code: 500

## Additional Notes
[Ghi chú thêm, workaround nếu có]
```

---

## 3. Priority Guidelines

| Priority | Tiêu chí | Ví dụ |
|----------|----------|-------|
| **Highest** | Blocker - Không thể tiếp tục test/sử dụng | Login không hoạt động, App crash |
| **High** | Critical - Tính năng chính không hoạt động | Không tạo được nhân viên, CV matching lỗi |
| **Medium** | Major - Tính năng phụ lỗi, có workaround | Filter không hoạt động nhưng search được |
| **Low** | Minor - UI issues, typo, không ảnh hưởng chức năng | Text bị cắt, icon sai màu |

---

## 4. Bug Categories (Labels)

### Test Type Labels

- `manual-test` - Bug từ manual testing
- `automation-test` - Bug từ automation testing
- `regression` - Bug regression (đã fix nhưng xảy ra lại)
- `smoke-test` - Bug từ smoke testing

### Bug Type Labels

- `functional` - Lỗi chức năng
- `ui-ux` - Lỗi giao diện
- `performance` - Lỗi hiệu suất
- `security` - Lỗi bảo mật
- `api` - Lỗi API
- `data` - Lỗi dữ liệu
- `integration` - Lỗi tích hợp

---

## 5. Module/Component List

| Component | Mô tả |
|-----------|-------|
| `auth` | Đăng nhập, đăng xuất, token |
| `employee` | Quản lý nhân viên |
| `department` | Quản lý phòng ban |
| `position` | Quản lý vị trí |
| `job` | Quản lý tin tuyển dụng (JD) |
| `candidate` | Quản lý ứng viên (CV) |
| `application` | Quản lý hồ sơ ứng tuyển |
| `interview` | Quản lý phỏng vấn |
| `cv-matching` | Đánh giá CV-JD |
| `invitation` | Mời thành viên |
| `dashboard` | Trang tổng quan |
| `settings` | Cài đặt |
| `admin` | Quản trị hệ thống (Super Admin) |

---

## 6. Test Environment & Setup

### 6.1 Staging Environment

| Env | URL |
|-----|-----|
| **Staging** | https://hr-tool-software.netlify.app/ |

### 6.2 Cách Setup Test Environment

#### Bước 1: Đăng nhập Super Admin

1. Truy cập: https://hr-tool-software.netlify.app/login
2. Liên hệ QC Lead để nhận tài khoản **Super Admin**

#### Bước 2: Tạo Company mới để test

1. Sau khi đăng nhập Super Admin, vào menu **Admin > Companies**
2. Click **"Tạo Company"**
3. Điền thông tin:
   - Tên công ty: `QC Test Company [Tên QC]` (ví dụ: `QC Test Company Minh`)
   - Admin Email: `admin-test-[tên]@example.com`
   - Admin Password: (tự chọn, đảm bảo an toàn)
   - Admin Name: `Admin Test`
4. Click **Tạo**

#### Bước 3: Tạo thêm users với các role khác

1. Đăng nhập với account **Admin** vừa tạo
2. Vào **Settings > Invitations**
3. Mời thêm users với các roles:

| Role | Email gợi ý | Mục đích test |
|------|-------------|---------------|
| **Admin** | admin-test@example.com | Test full quyền công ty |
| **HR** | hr-test@example.com | Test quyền HR |
| **Tech Lead** | techlead-test@example.com | Test quyền Tech Lead |

#### Bước 4: Accept Invitation

1. Check email (hoặc lấy link từ Super Admin)
2. Truy cập link invitation
3. Set password cho account mới
4. Đăng nhập và bắt đầu test

### 6.3 Test Data Guidelines

:::caution[QUAN TRỌNG]
- Mỗi QC nên tạo Company riêng để tránh conflict dữ liệu
- Đặt tên Company theo format: `QC Test Company [Tên QC]`
- Không xóa dữ liệu của người khác
:::

### 6.4 Browser Versions

Ghi rõ version browser khi test:
- Chrome: `Chrome 121.0.6167.85`
- Firefox: `Firefox 122.0`
- Safari: `Safari 17.2`
- Edge: `Edge 121.0.2277.83`

---

## 7. Role & Permission Matrix

| Permission | Super Admin | Admin | HR | Tech Lead |
|------------|:-----------:|:-----:|:--:|:---------:|
| Quản lý Companies | ✅ | ❌ | ❌ | ❌ |
| System Logs | ✅ | ❌ | ❌ | ❌ |
| Employees - Xem | ✅ | ✅ | ✅ | ✅ |
| Employees - Sửa | ✅ | ✅ | ✅ | ❌ |
| Jobs - Xem | ✅ | ✅ | ✅ | ✅ |
| Jobs - Sửa | ✅ | ✅ | ✅ | ❌ |
| Candidates - Xem | ✅ | ✅ | ✅ | ✅ |
| Candidates - Sửa | ✅ | ✅ | ✅ | ❌ |
| Applications - Xem | ✅ | ✅ | ✅ | ✅ |
| Applications - Sửa | ✅ | ✅ | ✅ | ❌ |
| Interviews - Xem | ✅ | ✅ | ✅ | ✅ |
| Interviews - Sửa | ✅ | ✅ | ✅ | ✅ |
| Settings | ✅ | ✅ | ❌ | ❌ |

:::tip[Mẹo]
Test các tính năng với từng role để đảm bảo permission hoạt động đúng!
:::

---

## 8. Bug Report Checklist

Trước khi submit bug, QC cần đảm bảo:

- [ ] Summary theo đúng format `[Module] - [Feature] - [Issue]`
- [ ] Có đầy đủ Steps to Reproduce
- [ ] Có Expected Result và Actual Result rõ ràng
- [ ] Có screenshot hoặc video minh họa
- [ ] Đã thử reproduce bug ít nhất 2 lần
- [ ] Đã check Console log và attach nếu có error
- [ ] Đã set đúng Priority
- [ ] Đã chọn đúng Component/Module
- [ ] Đã add đúng Labels
- [ ] Test data đầy đủ (không chứa sensitive data thật)
- [ ] Ghi rõ role đang test (Super Admin/Admin/HR/Tech Lead)

---

## 9. Template cho Automation Test Bug

```markdown
## Automation Test Bug Report

### Test Case Information
- **Test Suite:** [Tên suite]
- **Test Case ID:** TC-XXX
- **Test Case Name:** [Tên test case]
- **Test Script Location:** `tests/e2e/auth/login.spec.ts`

### Failure Details
- **Run ID:** [CI/CD run ID nếu có]
- **Failure Rate:** X/Y runs failed
- **First Seen:** [Ngày phát hiện]

### Error Log
```
[Paste full error stack trace]
```

### Screenshots
[Attach screenshot from automation]

### Environment
- **Node Version:** v20.x
- **Playwright Version:** 1.40.x
- **Browser:** Chromium headless
- **Base URL:** https://hr-tool-software.netlify.app/

### Analysis
- [ ] Bug thật (cần fix code)
- [ ] Flaky test (cần fix test)
- [ ] Environment issue (cần check infra)
```

---

## 10. Ví dụ Bug Report Hoàn Chỉnh

### Summary

`[Auth] - Login - Lỗi 500 khi đăng nhập với email chứa ký tự đặc biệt`

### Description

**Mô tả Bug**

User không thể đăng nhập khi email chứa ký tự `+` (ví dụ: test+1@gmail.com), hệ thống trả về lỗi 500 thay vì validate email đúng cách.

**Preconditions**
- Truy cập trang login trên Staging
- Có account với email: test+1@gmail.com đã được invite
- Browser: Chrome 121.0.6167.85
- Role: Admin

**Steps to Reproduce**
1. Truy cập https://hr-tool-software.netlify.app/login
2. Nhập email: `test+1@gmail.com`
3. Nhập password: `[password test]`
4. Click button "Đăng nhập"
5. Quan sát kết quả

**Expected Result**
- User đăng nhập thành công và được redirect đến Dashboard
- HOẶC hiển thị message lỗi rõ ràng nếu email/password sai

**Actual Result**
- Hệ thống hiển thị "Internal Server Error"
- Console log hiện lỗi 500
- User không đăng nhập được

**Console Log**

```
POST /trpc/auth.login 500 (Internal Server Error)
{
  "error": {
    "message": "Invalid email format",
    "code": "INTERNAL_SERVER_ERROR"
  }
}
```

**Attachments**
- screenshot-login-error.png
- video-reproduce-bug.mp4

**Additional Notes**
- Bug chỉ xảy ra với email có ký tự `+`, email bình thường hoạt động OK
- Workaround: Sử dụng email không có ký tự đặc biệt

---

## 11. Tips cho QC

1. **Setup riêng Company** - Tạo Company riêng để test, tránh ảnh hưởng người khác
2. **Test với nhiều roles** - Mỗi bug nên verify với các role khác nhau
3. **Reproduce trước khi log** - Đảm bảo bug có thể reproduce ổn định
4. **1 bug = 1 ticket** - Không gộp nhiều bug vào 1 ticket
5. **Screenshot có đánh dấu** - Dùng công cụ đánh dấu vùng lỗi
6. **Video ngắn gọn** - Record đủ để reproduce, không quá dài
7. **Check trùng lặp** - Search trước khi log để tránh duplicate
8. **Update status** - Đóng bug đã verify hoặc reopen nếu chưa fix xong
9. **Comment khi cần thêm info** - Dev có thể hỏi thêm, trả lời nhanh
10. **Ghi rõ Environment** - Luôn ghi rõ đang test trên Staging

---

## Quick Links

- **Staging URL:** https://hr-tool-software.netlify.app/
- **Jira Project:** https://hr-tool.atlassian.net/browse/SCRUM

---

**Cần giúp đỡ?** Liên hệ QC Lead hoặc đăng trong #qc-team
