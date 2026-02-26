---
title: Checklist Regression Test
description: Checklist kiểm tra toàn diện trước mỗi đợt release
---

# Checklist Regression Test

Tài liệu đào tạo QC - HR Tool

**Phiên bản:** 1.0
**Cập nhật:** 26/02/2026
**Tác giả:** QC Team

---

## Tổng quan

Regression testing đảm bảo các tính năng hiện có vẫn hoạt động đúng sau khi có thay đổi code. Chạy checklist này trước mỗi đợt release lớn.

**Thời gian ước tính:** 2-3 giờ
**Khi nào chạy:** Trước release production, sau features lớn

---

## Chuẩn bị trước Test

| Mục | Trạng thái |
|-----|------------|
| Staging đã deploy release candidate | [ ] |
| Dữ liệu test đã chuẩn bị | [ ] |
| Tất cả tài khoản test hoạt động | [ ] |
| Đã xem qua danh sách known issues | [ ] |
| Đã xem qua kết quả regression trước | [ ] |

---

## Thực thi Test

### Module 1: Authentication & Authorization (30 phút)

| # | Test Case | Trạng thái | Ghi chú |
|---|-----------|------------|---------|
| 1.1 | Đăng nhập đúng (tất cả roles) | [ ] | |
| 1.2 | Đăng nhập sai credentials | [ ] | |
| 1.3 | Validation login (trống, format sai) | [ ] | |
| 1.4 | Chức năng đăng xuất | [ ] | |
| 1.5 | Token persistence (đóng/mở lại browser) | [ ] | |
| 1.6 | Protected route khi chưa login | [ ] | |
| 1.7 | Phân quyền theo role (HR vs Tech Lead) | [ ] | |
| 1.8 | Flow lời mời (tạo, chấp nhận, thu hồi) | [ ] | |
| 1.9 | Xử lý lời mời hết hạn | [ ] | |
| 1.10 | Super admin impersonation | [ ] | |

**Kết quả Module 1:** ___/10 Pass

---

### Module 2: Dashboard (15 phút)

| # | Test Case | Trạng thái | Ghi chú |
|---|-----------|------------|---------|
| 2.1 | Dashboard load cho tất cả roles | [ ] | |
| 2.2 | Stats cards hiển thị số đúng | [ ] | |
| 2.3 | Biểu đồ Nhân viên theo trạng thái render | [ ] | |
| 2.4 | Biểu đồ Hiring Pipeline render | [ ] | |
| 2.5 | Quick actions navigate đúng | [ ] | |
| 2.6 | Recent applications hiển thị | [ ] | |
| 2.7 | Dashboard không có dữ liệu (empty states) | [ ] | |
| 2.8 | Dashboard refresh/reload | [ ] | |

**Kết quả Module 2:** ___/8 Pass

---

### Module 3: Nhân viên (25 phút)

| # | Test Case | Trạng thái | Ghi chú |
|---|-----------|------------|---------|
| 3.1 | Danh sách nhân viên load | [ ] | |
| 3.2 | Tìm theo tên | [ ] | |
| 3.3 | Lọc theo phòng ban | [ ] | |
| 3.4 | Lọc theo trạng thái | [ ] | |
| 3.5 | Kết hợp nhiều filters | [ ] | |
| 3.6 | Pagination (trang 1, 2, cuối) | [ ] | |
| 3.7 | Tạo nhân viên (trường bắt buộc) | [ ] | |
| 3.8 | Tạo nhân viên (tất cả trường) | [ ] | |
| 3.9 | Tạo với email trùng | [ ] | |
| 3.10 | Xem chi tiết nhân viên | [ ] | |
| 3.11 | Sửa nhân viên | [ ] | |
| 3.12 | Xóa nhân viên | [ ] | |
| 3.13 | Độ chính xác thống kê nhân viên | [ ] | |

**Kết quả Module 3:** ___/13 Pass

---

### Module 4: Phòng ban & Vị trí (15 phút)

| # | Test Case | Trạng thái | Ghi chú |
|---|-----------|------------|---------|
| 4.1 | Danh sách phòng ban load | [ ] | |
| 4.2 | Tạo phòng ban | [ ] | |
| 4.3 | Sửa phòng ban | [ ] | |
| 4.4 | Xóa phòng ban (không có NV) | [ ] | |
| 4.5 | Xóa phòng ban (có NV) | [ ] | |
| 4.6 | Danh sách vị trí load | [ ] | |
| 4.7 | Lọc vị trí theo phòng ban | [ ] | |
| 4.8 | Tạo vị trí | [ ] | |
| 4.9 | Sửa vị trí | [ ] | |
| 4.10 | Xóa vị trí | [ ] | |

**Kết quả Module 4:** ___/10 Pass

---

### Module 5: Jobs (20 phút)

| # | Test Case | Trạng thái | Ghi chú |
|---|-----------|------------|---------|
| 5.1 | Danh sách jobs load | [ ] | |
| 5.2 | Tìm jobs | [ ] | |
| 5.3 | Lọc theo trạng thái | [ ] | |
| 5.4 | Tạo job từ JD text | [ ] | |
| 5.5 | AI parsing chính xác (skills) | [ ] | |
| 5.6 | AI parsing chính xác (requirements) | [ ] | |
| 5.7 | Xem chi tiết job | [ ] | |
| 5.8 | Sửa job | [ ] | |
| 5.9 | Đổi trạng thái job (Open/Closed) | [ ] | |
| 5.10 | Xóa job | [ ] | |
| 5.11 | Job với partner (Headhunt mode) | [ ] | |

**Kết quả Module 5:** ___/11 Pass

---

### Module 6: Ứng viên (20 phút)

| # | Test Case | Trạng thái | Ghi chú |
|---|-----------|------------|---------|
| 6.1 | Danh sách ứng viên load | [ ] | |
| 6.2 | Tìm ứng viên | [ ] | |
| 6.3 | Lọc theo trạng thái | [ ] | |
| 6.4 | Tạo ứng viên từ CV text | [ ] | |
| 6.5 | AI parsing chính xác (thông tin cá nhân) | [ ] | |
| 6.6 | AI parsing chính xác (skills, kinh nghiệm) | [ ] | |
| 6.7 | Xem chi tiết ứng viên | [ ] | |
| 6.8 | Sửa ứng viên | [ ] | |
| 6.9 | Đổi trạng thái ứng viên | [ ] | |
| 6.10 | Xóa ứng viên | [ ] | |
| 6.11 | Ứng viên sourcedBy (Headhunt mode) | [ ] | |

**Kết quả Module 6:** ___/11 Pass

---

### Module 7: Applications (ATS) (25 phút)

| # | Test Case | Trạng thái | Ghi chú |
|---|-----------|------------|---------|
| 7.1 | Danh sách applications load | [ ] | |
| 7.2 | Lọc theo stage | [ ] | |
| 7.3 | Lọc theo job | [ ] | |
| 7.4 | Lọc theo ứng viên | [ ] | |
| 7.5 | Tạo application | [ ] | |
| 7.6 | Ngăn trùng application | [ ] | |
| 7.7 | Xem chi tiết application | [ ] | |
| 7.8 | Stage: Ứng tuyển -> Sàng lọc | [ ] | |
| 7.9 | Stage: Sàng lọc -> Phỏng vấn | [ ] | |
| 7.10 | Stage: Phỏng vấn -> Offer | [ ] | |
| 7.11 | Stage: Offer -> Hired | [ ] | |
| 7.12 | Stage: Bất kỳ -> Rejected | [ ] | |
| 7.13 | Thêm/sửa ghi chú | [ ] | |
| 7.14 | Xóa application | [ ] | |
| 7.15 | Độ chính xác thống kê applications | [ ] | |

**Kết quả Module 7:** ___/15 Pass

---

### Module 8: Phỏng vấn (20 phút)

| # | Test Case | Trạng thái | Ghi chú |
|---|-----------|------------|---------|
| 8.1 | Danh sách phỏng vấn load | [ ] | |
| 8.2 | Lọc theo trạng thái | [ ] | |
| 8.3 | Lọc theo loại | [ ] | |
| 8.4 | Lên lịch phỏng vấn (HR Screening) | [ ] | |
| 8.5 | Lên lịch phỏng vấn (Technical) | [ ] | |
| 8.6 | Lên lịch phỏng vấn (Culture Fit) | [ ] | |
| 8.7 | Xem chi tiết phỏng vấn | [ ] | |
| 8.8 | Gán interviewer | [ ] | |
| 8.9 | Hoàn thành PV với feedback | [ ] | |
| 8.10 | Thêm rating (1-5) | [ ] | |
| 8.11 | Hủy phỏng vấn | [ ] | |
| 8.12 | Phỏng vấn no-show | [ ] | |
| 8.13 | Xóa phỏng vấn | [ ] | |
| 8.14 | Câu hỏi PV từ AI | [ ] | |

**Kết quả Module 8:** ___/14 Pass

---

### Module 9: CV Matching (25 phút)

| # | Test Case | Trạng thái | Ghi chú |
|---|-----------|------------|---------|
| 9.1 | Danh sách sessions load | [ ] | |
| 9.2 | Tạo session | [ ] | |
| 9.3 | Thêm JD từ job có sẵn | [ ] | |
| 9.4 | Thêm JD từ text mới | [ ] | |
| 9.5 | Thêm CVs từ ứng viên có sẵn | [ ] | |
| 9.6 | Thêm CVs từ text mới | [ ] | |
| 9.7 | Bắt đầu matching | [ ] | |
| 9.8 | Tiến độ cập nhật | [ ] | |
| 9.9 | Kết quả hiển thị (xếp hạng) | [ ] | |
| 9.10 | Điểm chi tiết chính xác | [ ] | |
| 9.11 | Câu hỏi PV được tạo | [ ] | |
| 9.12 | Tạo application từ kết quả | [ ] | |
| 9.13 | Xóa session | [ ] | |

**Kết quả Module 9:** ___/13 Pass

---

### Module 10: Settings & Admin (15 phút)

| # | Test Case | Trạng thái | Ghi chú |
|---|-----------|------------|---------|
| 10.1 | Trang Settings load | [ ] | |
| 10.2 | Cập nhật tên profile | [ ] | |
| 10.3 | Activity logs (admin view) | [ ] | |
| 10.4 | Lọc activity logs | [ ] | |
| 10.5 | Super admin dashboard | [ ] | |
| 10.6 | Danh sách companies (super admin) | [ ] | |
| 10.7 | Chi tiết company với users | [ ] | |
| 10.8 | System logs (super admin) | [ ] | |
| 10.9 | System monitor | [ ] | |

**Kết quả Module 10:** ___/9 Pass

---

### Module 11: Partners - Headhunt Mode (15 phút)

> Bỏ qua nếu chỉ test Enterprise mode

| # | Test Case | Trạng thái | Ghi chú |
|---|-----------|------------|---------|
| 11.1 | Danh sách partners load | [ ] | |
| 11.2 | Tạo partner | [ ] | |
| 11.3 | Xem chi tiết partner | [ ] | |
| 11.4 | Sửa partner | [ ] | |
| 11.5 | Đổi trạng thái partner | [ ] | |
| 11.6 | Xóa partner | [ ] | |
| 11.7 | Liên kết job với partner | [ ] | |
| 11.8 | Partner trong dashboard stats | [ ] | |

**Kết quả Module 11:** ___/8 Pass

---

### Module 12: Cross-Cutting Concerns (15 phút)

| # | Test Case | Trạng thái | Ghi chú |
|---|-----------|------------|---------|
| 12.1 | Chuyển ngôn ngữ (EN/VI) | [ ] | |
| 12.2 | Chuyển theme (Light/Dark) | [ ] | |
| 12.3 | Responsive design (mobile) | [ ] | |
| 12.4 | Sidebar thu gọn/mở rộng | [ ] | |
| 12.5 | Breadcrumb navigation | [ ] | |
| 12.6 | Pagination trên các modules | [ ] | |
| 12.7 | Error boundary (force error) | [ ] | |
| 12.8 | Trang 404 | [ ] | |
| 12.9 | Xử lý lỗi mạng | [ ] | |
| 12.10 | Validation messages | [ ] | |

**Kết quả Module 12:** ___/10 Pass

---

## Tổng kết

### Kết quả Test

| Module | Tổng | Pass | Fail | Blocked | Tỷ lệ |
|--------|:----:|:----:|:----:|:-------:|:-----:|
| 1. Authentication | 10 | | | | % |
| 2. Dashboard | 8 | | | | % |
| 3. Nhân viên | 13 | | | | % |
| 4. Phòng ban & Vị trí | 10 | | | | % |
| 5. Jobs | 11 | | | | % |
| 6. Ứng viên | 11 | | | | % |
| 7. Applications | 15 | | | | % |
| 8. Phỏng vấn | 14 | | | | % |
| 9. CV Matching | 13 | | | | % |
| 10. Settings & Admin | 9 | | | | % |
| 11. Partners (Headhunt) | 8 | | | | % |
| 12. Cross-Cutting | 10 | | | | % |
| **TỔNG** | **122** | | | | **%** |

### Bug phát hiện

| # | Module | Mô tả | Severity | Priority | JIRA |
|---|--------|-------|----------|----------|------|
| 1 | | | | | |
| 2 | | | | | |
| 3 | | | | | |

---

## Môi trường Test

| Mục | Giá trị |
|-----|---------|
| **URL** | |
| **Browser** | |
| **OS** | |
| **Ngày test** | |
| **Người test** | |
| **Build/Version** | |

---

## Sign-off

### QC Sign-off

| Vai trò | Tên | Trạng thái | Ngày |
|---------|-----|------------|------|
| QC Tester | | [ ] Approved / [ ] Rejected | |
| QC Lead | | [ ] Approved / [ ] Rejected | |

### Đề xuất Release

- [ ] **GO** - Tất cả tests critical pass, sẵn sàng production
- [ ] **GO với Issues** - Có issues nhỏ, có thể release với known bugs
- [ ] **NO GO** - Có issues critical, không thể release

---

**Hoàn thành bởi:** ___________
**Ngày:** ___________
