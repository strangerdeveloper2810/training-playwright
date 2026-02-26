---
title: Checklist Smoke Test
description: Checklist kiểm tra nhanh sau mỗi lần deploy
---

# Checklist Smoke Test

Tài liệu đào tạo QC - HR Tool

**Phiên bản:** 1.0
**Cập nhật:** 26/02/2026
**Tác giả:** QC Team

---

Smoke Test là bộ test cơ bản nhất để đảm bảo hệ thống hoạt động ổn định sau mỗi lần deploy. QC cần chạy Smoke Test **trước khi** bắt đầu test chi tiết.

---

## 1. Khi nào chạy Smoke Test?

| Tình huống | Bắt buộc |
|------------|----------|
| Sau mỗi lần deploy lên Staging | ✅ |
| Sau khi merge PR lớn | ✅ |
| Đầu ngày làm việc | ✅ |
| Sau khi fix bug critical | ✅ |
| Trước khi bắt đầu regression test | ✅ |

**Thời gian ước tính:** 15-20 phút (Full) | 5 phút (Quick)

---

## 2. Smoke Test Checklist

### 2.1 Authentication Module

| # | Test Case | Steps | Expected | Pass/Fail |
|---|-----------|-------|----------|-----------|
| SM-01 | Super Admin Login | 1. Vào /login<br>2. Nhập tài khoản Super Admin<br>3. Click Đăng nhập | Redirect đến Admin Dashboard | ☐ |
| SM-02 | Admin Login | 1. Vào /login<br>2. Nhập admin account<br>3. Click Đăng nhập | Redirect đến Company Dashboard | ☐ |
| SM-03 | Logout | 1. Click avatar<br>2. Click Đăng xuất | Redirect đến /login, session cleared | ☐ |
| SM-04 | Invalid Login | 1. Nhập sai password<br>2. Click Đăng nhập | Hiển thị error message | ☐ |
| SM-05 | Session Persistence | 1. Login thành công<br>2. Refresh page | Vẫn giữ session, không bị logout | ☐ |

### 2.2 Dashboard Module

| # | Test Case | Steps | Expected | Pass/Fail |
|---|-----------|-------|----------|-----------|
| SM-06 | Dashboard Load | 1. Login Admin<br>2. Vào Dashboard | Hiển thị stats, charts load thành công | ☐ |
| SM-07 | Stats Cards | Quan sát các cards | Hiển thị số liệu (không phải NaN/undefined) | ☐ |
| SM-08 | Quick Actions | Click các quick action buttons | Navigate đúng trang | ☐ |

### 2.3 Employee Module

| # | Test Case | Steps | Expected | Pass/Fail |
|---|-----------|-------|----------|-----------|
| SM-09 | List Employees | 1. Vào Employees<br>2. Quan sát danh sách | Hiển thị danh sách, pagination hoạt động | ☐ |
| SM-10 | Create Employee | 1. Click Tạo mới<br>2. Điền thông tin<br>3. Submit | Tạo thành công, hiện trong list | ☐ |
| SM-11 | View Employee | Click vào 1 employee | Hiển thị chi tiết đúng | ☐ |
| SM-12 | Search Employee | Nhập tên vào search box | Filter kết quả đúng | ☐ |

### 2.4 Department & Position Module

| # | Test Case | Steps | Expected | Pass/Fail |
|---|-----------|-------|----------|-----------|
| SM-13 | List Departments | Vào Departments | Hiển thị danh sách departments | ☐ |
| SM-14 | Create Department | Tạo department mới | Tạo thành công | ☐ |
| SM-15 | List Positions | Vào Positions | Hiển thị danh sách positions | ☐ |
| SM-16 | Create Position | Tạo position mới | Tạo thành công | ☐ |

### 2.5 Job (JD) Module

| # | Test Case | Steps | Expected | Pass/Fail |
|---|-----------|-------|----------|-----------|
| SM-17 | List Jobs | Vào Jobs | Hiển thị danh sách jobs | ☐ |
| SM-18 | Create Job from JD | 1. Click Tạo từ JD<br>2. Paste JD text<br>3. Submit | AI parse thành công, job được tạo | ☐ |
| SM-19 | View Job Detail | Click vào 1 job | Hiển thị parsed data đúng | ☐ |

### 2.6 Candidate (CV) Module

| # | Test Case | Steps | Expected | Pass/Fail |
|---|-----------|-------|----------|-----------|
| SM-20 | List Candidates | Vào Candidates | Hiển thị danh sách candidates | ☐ |
| SM-21 | Create Candidate from CV | 1. Click Tạo từ CV<br>2. Paste CV text<br>3. Submit | AI parse thành công, candidate được tạo | ☐ |
| SM-22 | View Candidate Detail | Click vào 1 candidate | Hiển thị parsed data đúng | ☐ |

### 2.7 Application (ATS) Module

| # | Test Case | Steps | Expected | Pass/Fail |
|---|-----------|-------|----------|-----------|
| SM-23 | List Applications | Vào Applications | Hiển thị danh sách applications | ☐ |
| SM-24 | Create Application | 1. Click Tạo mới<br>2. Chọn Candidate + Job | Application được tạo | ☐ |
| SM-25 | Update Stage | Đổi stage của 1 application | Stage update thành công | ☐ |

### 2.8 Interview Module

| # | Test Case | Steps | Expected | Pass/Fail |
|---|-----------|-------|----------|-----------|
| SM-26 | List Interviews | Vào Interviews | Hiển thị danh sách interviews | ☐ |
| SM-27 | Schedule Interview | 1. Từ Application detail<br>2. Click Schedule Interview<br>3. Điền thông tin | Interview được tạo | ☐ |
| SM-28 | Add Feedback | Thêm feedback cho interview | Feedback saved thành công | ☐ |

### 2.9 CV Matching Module

| # | Test Case | Steps | Expected | Pass/Fail |
|---|-----------|-------|----------|-----------|
| SM-29 | Create Session | 1. Vào CV Matching<br>2. Tạo session mới | Session được tạo | ☐ |
| SM-30 | Add Documents | Thêm CV và JD vào session | Documents được add | ☐ |
| SM-31 | Start Matching | Click Start Matching | AI matching hoạt động, có kết quả | ☐ |

### 2.10 Settings & Admin Module

| # | Test Case | Steps | Expected | Pass/Fail |
|---|-----------|-------|----------|-----------|
| SM-32 | Invitation (Admin) | 1. Vào Settings > Invitations<br>2. Mời user mới | Invitation được tạo | ☐ |
| SM-33 | Company List (Super Admin) | Vào Admin > Companies | Hiển thị danh sách companies | ☐ |
| SM-34 | System Logs (Super Admin) | Vào Admin > Logs | Hiển thị logs | ☐ |

---

## 3. Smoke Test Report Template

```markdown
# Smoke Test Report

**Date:** [YYYY-MM-DD]
**Tester:** [Tên QC]
**Environment:** Staging (https://hr-tool-software.netlify.app/)
**Build/Version:** [Version nếu có]
**Browser:** [Chrome/Firefox + version]

## Summary
- **Total Test Cases:** 34
- **Passed:** [X]
- **Failed:** [X]
- **Blocked:** [X]
- **Pass Rate:** [X%]

## Results

| Module | Total | Passed | Failed | Blocked |
|--------|-------|--------|--------|---------|
| Authentication | 5 | | | |
| Dashboard | 3 | | | |
| Employee | 4 | | | |
| Department & Position | 4 | | | |
| Job | 3 | | | |
| Candidate | 3 | | | |
| Application | 3 | | | |
| Interview | 3 | | | |
| CV Matching | 3 | | | |
| Settings & Admin | 3 | | | |

## Failed Test Cases

| TC ID | Summary | Actual Result | Jira Ticket |
|-------|---------|---------------|-------------|
| SM-XX | [Mô tả] | [Kết quả thực tế] | SCRUM-XXX |

## Blocked Test Cases

| TC ID | Summary | Blocked By |
|-------|---------|------------|
| SM-XX | [Mô tả] | [Lý do/Dependency] |

## Recommendation
- [ ] **GO** - Có thể tiếp tục test chi tiết
- [ ] **NO GO** - Cần fix critical issues trước

## Notes
[Ghi chú thêm nếu có]
```

---

## 4. Smoke Test Tips

1. **Thứ tự test:** Test Authentication trước, nếu fail thì dừng lại
2. **Thời gian:** Smoke test không nên quá 30 phút
3. **Ghi chép:** Note lại mọi anomaly dù nhỏ
4. **Screenshot:** Chụp màn hình các lỗi ngay lập tức
5. **Report ngay:** Nếu có blocker, báo Dev ngay không cần chờ hoàn thành

---

## 5. Quick Smoke Test (5 phút)

Khi cần kiểm tra nhanh sau hotfix:

| # | Check | Expected |
|---|-------|----------|
| 1 | Login Super Admin | ✅ Success |
| 2 | Login Admin | ✅ Success |
| 3 | Dashboard loads | ✅ No errors |
| 4 | Create 1 employee | ✅ Success |
| 5 | Create 1 job from JD | ✅ AI works |

:::tip[Mẹo]
Nếu cả 5 pass → System OK cho basic operations
:::

---

## 6. Cross-Cutting Concerns

| # | Test Case | Các bước | Mong đợi | Trạng thái |
|---|-----------|----------|----------|------------|
| CC-01 | Chuyển ngôn ngữ | Đổi EN/VI | Text UI thay đổi | ☐ |
| CC-02 | Chuyển theme | Đổi Light/Dark | Theme thay đổi | ☐ |
| CC-03 | Pagination | Chuyển trang trên danh sách | Pagination hoạt động | ☐ |
| CC-04 | Error boundary | Force error (nếu có thể) | Trang lỗi hiển thị, không blank | ☐ |
| CC-05 | Trang 404 | Truy cập /invalid-url | Trang 404 hiển thị | ☐ |

---

## 7. Tổng kết sau Test

### Kết quả Test

| Module | Pass | Fail | Blocked |
|--------|:----:|:----:|:-------:|
| Authentication | /5 | | |
| Dashboard | /3 | | |
| Employee | /4 | | |
| Department & Position | /4 | | |
| Job | /3 | | |
| Candidate | /3 | | |
| Application | /3 | | |
| Interview | /3 | | |
| CV Matching | /3 | | |
| Settings & Admin | /3 | | |
| Cross-Cutting | /5 | | |
| **TỔNG** | **/39** | | |

### Vấn đề phát hiện

| # | Module | Mô tả | Severity | JIRA Ticket |
|---|--------|-------|----------|-------------|
| 1 | | | | |
| 2 | | | | |
| 3 | | | | |

### Môi trường

- **URL đã test:**
- **Browser:**
- **Ngày/Giờ:**
- **Người test:**

### Quyết định Deploy

- [ ] **PASS** - An toàn để tiến hành
- [ ] **FAIL** - Có lỗi critical, khuyến nghị rollback
- [ ] **PASS CÓ VẤN ĐỀ** - Lỗi không critical, có thể tiến hành

---

**Lưu ý:**
- Dọn dẹp tất cả dữ liệu [TEST] đã tạo trong smoke test
- Báo cáo mọi vấn đề ngay trong kênh #bugs
- Lưu checklist này với ngày để lưu trữ
