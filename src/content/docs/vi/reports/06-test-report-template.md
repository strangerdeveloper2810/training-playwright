---
title: Template Báo cáo Test
description: Template báo cáo test theo chuẩn của team
---

# Template Báo cáo Test

Tài liệu đào tạo QC - HR Tool

**Phiên bản:** 1.0
**Cập nhật:** 26/02/2026
**Tác giả:** QC Team

---

## Báo cáo Test

### Thông tin dự án

| Trường | Giá trị |
|--------|---------|
| **Tên dự án** | HR Tool |
| **Loại báo cáo** | [ ] Smoke Test / [ ] Regression / [ ] UAT / [ ] Sprint |
| **Version/Build** | |
| **Môi trường** | [ ] Staging / [ ] Production |
| **Ngày báo cáo** | |
| **Người lập** | |
| **Người duyệt** | |

---

## 1. Tóm tắt tổng quan

### 1.1 Trạng thái tổng thể

| Chỉ số | Giá trị |
|--------|---------|
| **Tổng Test Cases** | |
| **Đã thực thi** | |
| **Pass** | |
| **Fail** | |
| **Blocked** | |
| **Chưa thực thi** | |
| **Tỷ lệ Pass** | % |

### 1.2 Tóm tắt trạng thái

```
[1-2 đoạn văn tóm tắt kết quả test tổng thể, phát hiện chính,
và khuyến nghị release]
```

### 1.3 Khuyến nghị Release

- [ ] **APPROVED** - Sẵn sàng deploy lên production
- [ ] **APPROVED CÓ ĐIỀU KIỆN** - Có thể deploy với known issues
- [ ] **KHÔNG APPROVED** - Có lỗi critical phải sửa trước

---

## 2. Phạm vi Test

### 2.1 Trong phạm vi

| Module/Tính năng | Loại Test | Ưu tiên |
|------------------|-----------|---------|
| Authentication | Regression | Cao |
| Dashboard | Regression | Cao |
| Nhân viên CRUD | Regression | Cao |
| Jobs AI Parsing | Regression | Cao |
| Ứng viên AI Parsing | Regression | Cao |
| Applications Pipeline | Regression | Cao |
| Phỏng vấn | Regression | TB |
| CV Matching | Regression | Cao |
| Partners (Headhunt) | Regression | TB |
| Settings | Regression | Thấp |

### 2.2 Ngoài phạm vi

| Mục | Lý do |
|-----|-------|
| Performance Testing | Lên lịch cho sprint sau |
| Security Testing | Có audit bảo mật riêng |
| Mobile App | Chưa phát triển |

### 2.3 Dữ liệu Test sử dụng

| Loại dữ liệu | Số lượng | Ghi chú |
|--------------|----------|---------|
| Nhân viên | | Seed + test data |
| Phòng ban | | Seed data |
| Jobs | | AI-parsed |
| Ứng viên | | AI-parsed |
| Applications | | Các stages khác nhau |
| Phỏng vấn | | Scheduled + completed |

---

## 3. Kết quả Test theo Module

### 3.1 Module Authentication

| Test Case | Trạng thái | Ghi chú |
|-----------|------------|---------|
| Đăng nhập đúng credentials | Pass/Fail | |
| Đăng nhập sai credentials | Pass/Fail | |
| Đăng xuất | Pass/Fail | |
| Flow lời mời | Pass/Fail | |
| Phân quyền theo role | Pass/Fail | |

**Tóm tắt Module:** ___ / ___ Pass (___%)

### 3.2 Module Dashboard

| Test Case | Trạng thái | Ghi chú |
|-----------|------------|---------|
| Stats cards hiển thị | Pass/Fail | |
| Biểu đồ render | Pass/Fail | |
| Quick actions | Pass/Fail | |
| Items gần đây | Pass/Fail | |

**Tóm tắt Module:** ___ / ___ Pass (___%)

### 3.3 Module Nhân viên

| Test Case | Trạng thái | Ghi chú |
|-----------|------------|---------|
| Danh sách & tìm kiếm | Pass/Fail | |
| Tạo nhân viên | Pass/Fail | |
| Sửa nhân viên | Pass/Fail | |
| Xóa nhân viên | Pass/Fail | |
| Filters | Pass/Fail | |

**Tóm tắt Module:** ___ / ___ Pass (___%)

### 3.4 Module Jobs

| Test Case | Trạng thái | Ghi chú |
|-----------|------------|---------|
| Tạo từ JD | Pass/Fail | |
| AI parsing chính xác | Pass/Fail | |
| Quản lý trạng thái | Pass/Fail | |
| CRUD operations | Pass/Fail | |

**Tóm tắt Module:** ___ / ___ Pass (___%)

### 3.5 Module Ứng viên

| Test Case | Trạng thái | Ghi chú |
|-----------|------------|---------|
| Tạo từ CV | Pass/Fail | |
| AI parsing chính xác | Pass/Fail | |
| Quản lý trạng thái | Pass/Fail | |
| CRUD operations | Pass/Fail | |

**Tóm tắt Module:** ___ / ___ Pass (___%)

### 3.6 Module Applications

| Test Case | Trạng thái | Ghi chú |
|-----------|------------|---------|
| Tạo application | Pass/Fail | |
| Chuyển stages | Pass/Fail | |
| Quản lý ghi chú | Pass/Fail | |
| Pipeline flow | Pass/Fail | |

**Tóm tắt Module:** ___ / ___ Pass (___%)

### 3.7 Module Phỏng vấn

| Test Case | Trạng thái | Ghi chú |
|-----------|------------|---------|
| Lên lịch phỏng vấn | Pass/Fail | |
| Hoàn thành với feedback | Pass/Fail | |
| Hệ thống rating | Pass/Fail | |
| Câu hỏi AI | Pass/Fail | |

**Tóm tắt Module:** ___ / ___ Pass (___%)

### 3.8 Module CV Matching

| Test Case | Trạng thái | Ghi chú |
|-----------|------------|---------|
| Quản lý session | Pass/Fail | |
| Upload documents | Pass/Fail | |
| Matching process | Pass/Fail | |
| Kết quả & scoring | Pass/Fail | |

**Tóm tắt Module:** ___ / ___ Pass (___%)

---

## 4. Tóm tắt Lỗi

### 4.1 Lỗi theo Severity

| Severity | Mở | Đã sửa | Tổng |
|----------|:--:|:------:|:----:|
| Critical | | | |
| Major | | | |
| Minor | | | |
| Trivial | | | |
| **Tổng** | | | |

### 4.2 Lỗi theo Priority

| Priority | Mở | Đã sửa | Tổng |
|----------|:--:|:------:|:----:|
| Urgent | | | |
| High | | | |
| Medium | | | |
| Low | | | |
| **Tổng** | | | |

### 4.3 Danh sách Lỗi

| ID | Tiêu đề | Module | Severity | Priority | Trạng thái | JIRA |
|----|---------|--------|----------|----------|------------|------|
| 1 | | | | | | |
| 2 | | | | | | |
| 3 | | | | | | |

### 4.4 Lỗi Critical/Blocker (nếu có)

| ID | Mô tả | Ảnh hưởng | Workaround |
|----|-------|-----------|------------|
| | | | |

---

## 5. Môi trường Test

### 5.1 Chi tiết Môi trường

| Thành phần | Chi tiết |
|------------|----------|
| **URL** | https://hr-tool-software.netlify.app |
| **API URL** | https://hr-tool-staging.ddnsfree.com |
| **Database** | PostgreSQL (staging) |
| **Browser** | Chrome 120, Firefox 121 |
| **OS** | macOS Sonoma, Windows 11 |

### 5.2 Tài khoản Test

| Vai trò | Tài khoản | Trạng thái |
|---------|-----------|------------|
| Super Admin | [Liên hệ QC Lead] | Active |
| Admin | [Liên hệ QC Lead] | Active |
| HR | [Liên hệ QC Lead] | Active |
| Tech Lead | [Liên hệ QC Lead] | Active |

### 5.3 Vấn đề Môi trường

| Vấn đề | Ảnh hưởng | Giải pháp |
|--------|-----------|-----------|
| | | |

---

## 6. Metrics Test

### 6.1 Metrics Thực thi Test

```
Tổng Test Cases:      ___
Đã thực thi:          ___ (___%)
Chưa thực thi:        ___ (___%)

Pass:                 ___
Fail:                 ___
Blocked:              ___

Tỷ lệ Pass:           ___% (Pass / Đã thực thi)
Tỷ lệ thực thi:       ___% (Đã thực thi / Tổng)
```

### 6.2 Metrics Lỗi

```
Tổng lỗi phát hiện:   ___
Critical:             ___
Major:                ___
Minor:                ___
Trivial:              ___

Lỗi đang mở:          ___
Đã sửa & xác nhận:    ___
Won't Fix:            ___

Mật độ lỗi:           ___ lỗi/module
```

### 6.3 Biểu đồ Tiến độ Test

| Ngày | Kế hoạch | Đã thực thi | Pass | Fail |
|------|:--------:|:-----------:|:----:|:----:|
| Ngày 1 | | | | |
| Ngày 2 | | | | |
| Ngày 3 | | | | |
| **Tổng** | | | | |

---

## 7. Đánh giá Rủi ro

### 7.1 Rủi ro đã xác định

| Rủi ro | Khả năng | Ảnh hưởng | Biện pháp giảm thiểu |
|--------|----------|-----------|---------------------|
| | Cao/TB/Thấp | Cao/TB/Thấp | |
| | | | |

### 7.2 Các mục còn lại

| Mục | Người phụ trách | Deadline | Trạng thái |
|-----|-----------------|----------|------------|
| | | | |

---

## 8. Khuyến nghị

### 8.1 Cho Release này

```
[Khuyến nghị cụ thể cho release này - deploy/không deploy,
các fix cần thiết, known issues cần thông báo cho users]
```

### 8.2 Cho các Sprint tiếp theo

```
[Khuyến nghị cải tiến, testing bổ sung cần thiết,
technical debt cần giải quyết]
```

---

## 9. Phụ lục

### 9.1 Chi tiết Thực thi Test Case

Link đến chi tiết thực thi test case: [Link Confluence/JIRA]

### 9.2 Báo cáo Bug

Link đến danh sách bug: [Link JIRA filter]

### 9.3 Screenshots/Bằng chứng

Link đến thư mục bằng chứng: [Link Drive/Confluence]

### 9.4 Tài liệu liên quan

| Tài liệu | Link |
|----------|------|
| Test Plan | |
| Requirements | |
| Báo cáo Test trước | |

---

## Sign-off

### QC Team Sign-off

| Tên | Vai trò | Chữ ký | Ngày |
|-----|---------|--------|------|
| | QC Tester | | |
| | QC Lead | | |

### Stakeholder Sign-off

| Tên | Vai trò | Chữ ký | Ngày |
|-----|---------|--------|------|
| | Tech Lead | | |
| | PM | | |
| | Product Owner | | |

---

**Báo cáo tạo lúc:** [Ngày Giờ]
**QC Team - HR Tool**
