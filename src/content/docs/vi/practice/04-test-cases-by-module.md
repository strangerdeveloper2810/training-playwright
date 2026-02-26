---
title: Test Cases theo Module
description: Test cases chi tiết cho từng module của HR Tool
---

# Test Cases theo Module

Tài liệu đào tạo QC - HR Tool

**Phiên bản:** 1.0
**Cập nhật:** 26/02/2026
**Tác giả:** QC Team

---

Tài liệu này chứa test cases chi tiết cho từng module của HR Tool. QC sử dụng để thực hiện functional testing.

---

## Mục lục

1. [Authentication Module](#1-authentication-module)
2. [Employee Module](#2-employee-module)
3. [Department Module](#3-department-module)
4. [Position Module](#4-position-module)
5. [Job (JD) Module](#5-job-jd-module)
6. [Candidate (CV) Module](#6-candidate-cv-module)
7. [Application Module](#7-application-module)
8. [Interview Module](#8-interview-module)
9. [CV Matching Module](#9-cv-matching-module)
10. [Admin Module (Super Admin only)](#10-admin-module-super-admin-only)
11. [Permission Test Matrix](#11-permission-test-matrix)

---

## 1. Authentication Module

### 1.1 Login

| TC ID | Test Case | Precondition | Steps | Expected Result | Priority |
|-------|-----------|--------------|-------|-----------------|----------|
| AUTH-01 | Login với credentials hợp lệ | Account tồn tại | 1. Vào /login<br>2. Nhập email + password đúng<br>3. Click Đăng nhập | Redirect đến Dashboard tương ứng với role | High |
| AUTH-02 | Login với email sai | - | 1. Nhập email không tồn tại<br>2. Nhập password bất kỳ<br>3. Click Đăng nhập | Hiển thị lỗi "Email hoặc mật khẩu không đúng" | High |
| AUTH-03 | Login với password sai | Account tồn tại | 1. Nhập email đúng<br>2. Nhập password sai<br>3. Click Đăng nhập | Hiển thị lỗi, không cho biết email đúng hay sai | High |
| AUTH-04 | Login với email trống | - | 1. Để trống email<br>2. Nhập password<br>3. Click Đăng nhập | Validation error: Email bắt buộc | Medium |
| AUTH-05 | Login với password trống | - | 1. Nhập email<br>2. Để trống password<br>3. Click Đăng nhập | Validation error: Password bắt buộc | Medium |
| AUTH-06 | Login với email format sai | - | 1. Nhập "abc" hoặc "abc@"<br>2. Click Đăng nhập | Validation error: Email không hợp lệ | Medium |
| AUTH-07 | Login remember session | Đã login | 1. Close browser<br>2. Mở lại, vào app | Vẫn giữ session (trong 7 ngày) | Medium |
| AUTH-08 | Login redirect | Chưa login | 1. Truy cập /employees trực tiếp | Redirect về /login | High |

### 1.2 Logout

| TC ID | Test Case | Precondition | Steps | Expected Result | Priority |
|-------|-----------|--------------|-------|-----------------|----------|
| AUTH-09 | Logout thành công | Đã login | 1. Click avatar<br>2. Click Đăng xuất | Redirect về /login, clear session | High |
| AUTH-10 | Access sau logout | Vừa logout | 1. Bấm Back trên browser | Không access được, redirect về login | High |

### 1.3 Invitation Flow

| TC ID | Test Case | Precondition | Steps | Expected Result | Priority |
|-------|-----------|--------------|-------|-----------------|----------|
| AUTH-11 | Accept invitation hợp lệ | Có invitation pending | 1. Click link invitation<br>2. Set password<br>3. Submit | Account được tạo, có thể login | High |
| AUTH-12 | Invitation expired | Invitation > 7 ngày | 1. Click link invitation | Hiển thị lỗi "Invitation đã hết hạn" | Medium |
| AUTH-13 | Invitation đã sử dụng | Invitation accepted | 1. Click lại link invitation | Hiển thị lỗi "Invitation đã được sử dụng" | Medium |
| AUTH-14 | Password validation | Invitation valid | 1. Nhập password < 6 ký tự | Validation error về password | Medium |

---

## 2. Employee Module

### 2.1 List & Search

| TC ID | Test Case | Precondition | Steps | Expected Result | Priority |
|-------|-----------|--------------|-------|-----------------|----------|
| EMP-01 | View employee list | Có ít nhất 1 employee | Vào /employees | Hiển thị danh sách với pagination | High |
| EMP-02 | Search by name | Có employees | Nhập tên vào search box | Filter đúng theo tên | High |
| EMP-03 | Filter by department | Có employees + departments | Chọn department filter | Chỉ hiển thị employees của department đó | Medium |
| EMP-04 | Filter by status | Có employees các status | Chọn status filter | Filter đúng theo status | Medium |
| EMP-05 | Pagination | > 10 employees | Click page 2, 3... | Chuyển trang đúng | Medium |
| EMP-06 | Empty state | Không có employee | Vào /employees | Hiển thị "Chưa có nhân viên" | Low |

### 2.2 Create Employee

| TC ID | Test Case | Precondition | Steps | Expected Result | Priority |
|-------|-----------|--------------|-------|-----------------|----------|
| EMP-07 | Create với đầy đủ thông tin | Có department + position | 1. Click Tạo mới<br>2. Điền đầy đủ<br>3. Submit | Tạo thành công, hiện trong list | High |
| EMP-08 | Create với thông tin tối thiểu | - | Chỉ điền các field bắt buộc | Tạo thành công | High |
| EMP-09 | Duplicate employee code | Employee đã tồn tại | Nhập mã trùng với employee khác | Error: Mã nhân viên đã tồn tại | High |
| EMP-10 | Duplicate email | Employee đã tồn tại | Nhập email trùng | Error: Email đã được sử dụng | High |
| EMP-11 | Invalid email format | - | Nhập email sai format | Validation error | Medium |
| EMP-12 | Required fields empty | - | Để trống tên hoặc email | Validation error | Medium |
| EMP-13 | Cancel create | Đang ở form create | Click Cancel | Quay lại list, không tạo | Low |

### 2.3 View & Edit Employee

| TC ID | Test Case | Precondition | Steps | Expected Result | Priority |
|-------|-----------|--------------|-------|-----------------|----------|
| EMP-14 | View employee detail | Employee tồn tại | Click vào employee | Hiển thị đầy đủ thông tin | High |
| EMP-15 | Edit employee info | Employee tồn tại | 1. Click Edit<br>2. Sửa thông tin<br>3. Save | Cập nhật thành công | High |
| EMP-16 | Edit với data invalid | - | Xóa required field, save | Validation error | Medium |
| EMP-17 | Cancel edit | Đang edit | Click Cancel | Không lưu thay đổi | Low |

### 2.4 Delete Employee

| TC ID | Test Case | Precondition | Steps | Expected Result | Priority |
|-------|-----------|--------------|-------|-----------------|----------|
| EMP-18 | Delete employee | Employee tồn tại | 1. Click Delete<br>2. Confirm | Xóa thành công, biến mất khỏi list | High |
| EMP-19 | Cancel delete | - | 1. Click Delete<br>2. Cancel confirm | Không xóa | Low |

---

## 3. Department Module

| TC ID | Test Case | Precondition | Steps | Expected Result | Priority |
|-------|-----------|--------------|-------|-----------------|----------|
| DEPT-01 | View department list | - | Vào /departments | Hiển thị danh sách | High |
| DEPT-02 | Create department | - | 1. Click Tạo<br>2. Nhập tên + type<br>3. Submit | Tạo thành công | High |
| DEPT-03 | Duplicate name | Department đã tồn tại | Nhập tên trùng | Error: Tên đã tồn tại | High |
| DEPT-04 | Edit department | Department tồn tại | Sửa tên, save | Cập nhật thành công | Medium |
| DEPT-05 | Delete department (no employees) | Không có employee | Delete | Xóa thành công | Medium |
| DEPT-06 | Delete department (has employees) | Có employees | Delete | Warning hoặc error | High |
| DEPT-07 | Required fields | - | Để trống tên | Validation error | Medium |

---

## 4. Position Module

| TC ID | Test Case | Precondition | Steps | Expected Result | Priority |
|-------|-----------|--------------|-------|-----------------|----------|
| POS-01 | View position list | - | Vào /positions | Hiển thị danh sách | High |
| POS-02 | Filter by department | Có departments | Chọn department filter | Filter đúng | Medium |
| POS-03 | Create position | Có department | 1. Click Tạo<br>2. Chọn department<br>3. Nhập tên<br>4. Submit | Tạo thành công | High |
| POS-04 | Duplicate name in department | Position đã tồn tại | Nhập tên trùng trong cùng department | Error | High |
| POS-05 | Edit position | Position tồn tại | Sửa tên, save | Cập nhật thành công | Medium |
| POS-06 | Delete position (no employees) | Không có employee | Delete | Xóa thành công | Medium |
| POS-07 | Delete position (has employees) | Có employees | Delete | Warning hoặc error | High |

---

## 5. Job (JD) Module

| TC ID | Test Case | Precondition | Steps | Expected Result | Priority |
|-------|-----------|--------------|-------|-----------------|----------|
| JOB-01 | View job list | - | Vào /jobs | Hiển thị danh sách | High |
| JOB-02 | Create from JD text | - | 1. Click Tạo từ JD<br>2. Paste JD text<br>3. Submit | AI parse thành công | High |
| JOB-03 | Create with empty JD | - | Submit với JD trống | Validation error | Medium |
| JOB-04 | Create with very short JD | - | Paste JD < 50 ký tự | AI có thể fail hoặc warning | Medium |
| JOB-05 | View job detail | Job tồn tại | Click vào job | Hiển thị parsed data | High |
| JOB-06 | Change job status | Job tồn tại | Đổi status Open/Closed | Cập nhật thành công | Medium |
| JOB-07 | Delete job (no applications) | Không có application | Delete | Xóa thành công | Medium |
| JOB-08 | Delete job (has applications) | Có applications | Delete | Warning hoặc cascade delete | High |
| JOB-09 | Filter by status | Có jobs | Filter Open/Closed | Filter đúng | Medium |

---

## 6. Candidate (CV) Module

| TC ID | Test Case | Precondition | Steps | Expected Result | Priority |
|-------|-----------|--------------|-------|-----------------|----------|
| CAN-01 | View candidate list | - | Vào /candidates | Hiển thị danh sách | High |
| CAN-02 | Create from CV text | - | 1. Click Tạo từ CV<br>2. Paste CV text<br>3. Submit | AI parse thành công | High |
| CAN-03 | Duplicate email | Candidate tồn tại | Tạo CV với email trùng | Error: Email đã tồn tại | High |
| CAN-04 | View candidate detail | Candidate tồn tại | Click vào candidate | Hiển thị parsed data | High |
| CAN-05 | Update candidate status | Candidate tồn tại | Đổi status | Cập nhật thành công | Medium |
| CAN-06 | Filter by status | Có candidates | Chọn status filter | Filter đúng | Medium |
| CAN-07 | Filter by skills | Có candidates | Chọn skill filter | Filter đúng | Medium |
| CAN-08 | Search by name/email | Có candidates | Nhập tên hoặc email | Search đúng | Medium |
| CAN-09 | Delete candidate | Candidate tồn tại | Delete | Xóa thành công | Medium |

---

## 7. Application Module

| TC ID | Test Case | Precondition | Steps | Expected Result | Priority |
|-------|-----------|--------------|-------|-----------------|----------|
| APP-01 | View application list | - | Vào /applications | Hiển thị danh sách | High |
| APP-02 | Create application | Có candidate + job | 1. Click Tạo<br>2. Chọn Candidate<br>3. Chọn Job<br>4. Submit | Tạo thành công | High |
| APP-03 | Duplicate application | Application tồn tại | Tạo lại với cùng candidate + job | Error: Application đã tồn tại | High |
| APP-04 | Update stage | Application tồn tại | Đổi stage (applied → screening → interview...) | Cập nhật thành công | High |
| APP-05 | Add notes | Application tồn tại | Thêm/sửa notes | Lưu thành công | Medium |
| APP-06 | Filter by stage | Có applications | Chọn stage filter | Filter đúng | Medium |
| APP-07 | View application detail | Application tồn tại | Click vào application | Hiển thị đầy đủ thông tin | High |
| APP-08 | Schedule interview from detail | Application tồn tại | Click Schedule Interview | Mở form tạo interview | High |
| APP-09 | Delete application | Application tồn tại | Delete | Xóa thành công + cascade interviews | Medium |

---

## 8. Interview Module

| TC ID | Test Case | Precondition | Steps | Expected Result | Priority |
|-------|-----------|--------------|-------|-----------------|----------|
| INT-01 | View interview list | - | Vào /interviews | Hiển thị danh sách | High |
| INT-02 | Create interview | Có application | 1. Click Tạo<br>2. Chọn Application<br>3. Chọn type + date<br>4. Submit | Tạo thành công | High |
| INT-03 | Schedule in past | - | Chọn ngày trong quá khứ | Warning hoặc error | Medium |
| INT-04 | View interview detail | Interview tồn tại | Click vào interview | Hiển thị đầy đủ thông tin | High |
| INT-05 | Add feedback | Interview tồn tại | 1. Click Add Feedback<br>2. Nhập feedback + rating<br>3. Save | Lưu thành công | High |
| INT-06 | Update status | Interview tồn tại | Đổi status (scheduled → completed/cancelled) | Cập nhật thành công | High |
| INT-07 | Filter by type | Có interviews | Filter HR/Technical/Culture | Filter đúng | Medium |
| INT-08 | Filter by status | Có interviews | Filter status | Filter đúng | Medium |
| INT-09 | Delete interview | Interview tồn tại | Delete | Xóa thành công | Medium |

---

## 9. CV Matching Module

| TC ID | Test Case | Precondition | Steps | Expected Result | Priority |
|-------|-----------|--------------|-------|-----------------|----------|
| MAT-01 | View session list | - | Vào /cv-matching | Hiển thị danh sách sessions | High |
| MAT-02 | Create session | - | 1. Click Tạo session<br>2. Nhập tên<br>3. Submit | Session được tạo | High |
| MAT-03 | Add JD to session | Session tồn tại | 1. Vào session<br>2. Add JD (chọn existing hoặc paste mới) | JD được add | High |
| MAT-04 | Add CVs to session | Session có JD | Add multiple CVs | CVs được add | High |
| MAT-05 | Start matching | Session có JD + CVs | Click Start Matching | AI processing, có kết quả | High |
| MAT-06 | View matching results | Matching completed | Xem kết quả | Hiển thị scores + breakdown | High |
| MAT-07 | Sort results by score | Có kết quả | Sort theo score | Sắp xếp đúng | Medium |
| MAT-08 | View interview questions | Có kết quả | Xem suggested questions | Hiển thị câu hỏi HR + Tech | Medium |
| MAT-09 | Create application from result | Có kết quả | Click Tạo Application | Application được tạo với matching score | Medium |
| MAT-10 | Delete session | Session tồn tại | Delete | Xóa session + documents + results | Medium |

---

## 10. Admin Module (Super Admin only)

| TC ID | Test Case | Precondition | Steps | Expected Result | Priority |
|-------|-----------|--------------|-------|-----------------|----------|
| ADM-01 | View company list | Login Super Admin | Vào Admin > Companies | Hiển thị danh sách | High |
| ADM-02 | Create company | Login Super Admin | 1. Click Tạo<br>2. Nhập thông tin + admin account<br>3. Submit | Company + Admin được tạo | High |
| ADM-03 | View company detail | Company tồn tại | Click vào company | Hiển thị users + stats | High |
| ADM-04 | Create user for company | Company tồn tại | 1. Vào company detail<br>2. Add user<br>3. Submit | User được tạo | High |
| ADM-05 | View system logs | Login Super Admin | Vào Admin > Logs | Hiển thị logs | Medium |
| ADM-06 | Filter logs | Có logs | Filter by level/action/date | Filter đúng | Medium |
| ADM-07 | Export logs | Có logs | Click Export | Download file CSV/JSON | Low |
| ADM-08 | System monitor | Login Super Admin | Vào Admin > System | Hiển thị metrics | Medium |
| ADM-09 | Access denied (non-admin) | Login Admin/HR | Truy cập /admin/* | 403 Forbidden hoặc redirect | High |

---

## 11. Permission Test Matrix

Test các operation với từng role:

| Operation | Super Admin | Admin | HR | Tech Lead |
|-----------|:-----------:|:-----:|:--:|:---------:|
| **Employees** |||||
| View list | ✅ | ✅ | ✅ | ✅ |
| Create | ✅ | ✅ | ✅ | ❌ |
| Edit | ✅ | ✅ | ✅ | ❌ |
| Delete | ✅ | ✅ | ✅ | ❌ |
| **Jobs** |||||
| View list | ✅ | ✅ | ✅ | ✅ |
| Create | ✅ | ✅ | ✅ | ❌ |
| Edit | ✅ | ✅ | ✅ | ❌ |
| Delete | ✅ | ✅ | ✅ | ❌ |
| **Candidates** |||||
| View list | ✅ | ✅ | ✅ | ✅ |
| Create | ✅ | ✅ | ✅ | ❌ |
| Edit | ✅ | ✅ | ✅ | ❌ |
| Delete | ✅ | ✅ | ✅ | ❌ |
| **Applications** |||||
| View list | ✅ | ✅ | ✅ | ✅ |
| Create | ✅ | ✅ | ✅ | ❌ |
| Update stage | ✅ | ✅ | ✅ | ❌ |
| Delete | ✅ | ✅ | ✅ | ❌ |
| **Interviews** |||||
| View list | ✅ | ✅ | ✅ | ✅ |
| Create | ✅ | ✅ | ✅ | ✅ |
| Add feedback | ✅ | ✅ | ✅ | ✅ |
| Delete | ✅ | ✅ | ✅ | ✅ |
| **Settings** |||||
| View | ✅ | ✅ | ❌ | ❌ |
| Invitations | ✅ | ✅ | ❌ | ❌ |
| **Admin** |||||
| Companies | ✅ | ❌ | ❌ | ❌ |
| System logs | ✅ | ❌ | ❌ | ❌ |

:::note[Hướng dẫn test]
- ✅ = Verify user CÓ THỂ thực hiện
- ❌ = Verify user KHÔNG THỂ thực hiện (403 hoặc button ẩn)
:::

---

## Chú thích trạng thái

| Trạng thái | Ý nghĩa |
|------------|---------|
| Chưa test | Test chưa được thực thi |
| Pass | Test đã pass |
| Fail | Test thất bại, đã báo lỗi |
| Blocked | Không thể test do phụ thuộc |
| N/A | Không áp dụng |

---

## Chú thích độ ưu tiên

| Ưu tiên | Mô tả |
|---------|-------|
| High | Phải test mỗi release |
| Medium | Test khi có thời gian |
| Low | Có thì tốt |

---

**Ngày thực thi cuối:** ___________
**Người test:** ___________
**Môi trường:** ___________
