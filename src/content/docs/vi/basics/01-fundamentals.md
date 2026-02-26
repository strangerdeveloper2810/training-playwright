---
title: Kiến thức QC cơ bản
description: Hướng dẫn căn bản về Quality Control và cách làm việc tại HR Tool
---

# Tài liệu đào tạo QC - Kiến thức cơ bản

Tài liệu đào tạo QC - HR Tool

**Phiên bản:** 1.0
**Cập nhật:** 26/02/2026
**Tác giả:** QC Team

---

## Mục lục

1. [Giới thiệu](#1-giới-thiệu)
2. [Vai trò & Trách nhiệm của QC](#2-vai-trò--trách-nhiệm-của-qc)
3. [Các loại Testing](#3-các-loại-testing)
4. [Công cụ Testing](#4-công-cụ-testing)
5. [Tổng quan HR Tool](#5-tổng-quan-hr-tool)
6. [Thiết lập môi trường](#6-thiết-lập-môi-trường)
7. [Thông tin tài khoản test](#7-thông-tin-tài-khoản-test)
8. [Quy trình làm việc hàng ngày](#8-quy-trình-làm-việc-hàng-ngày)
9. [Hướng dẫn giao tiếp](#9-hướng-dẫn-giao-tiếp)

---

## 1. Giới thiệu

Chào mừng bạn đến với đội QC! Tài liệu này cung cấp kiến thức nền tảng cần thiết để bắt đầu kiểm thử nền tảng HR Tool.

### QC là gì?

Quality Control (QC) đảm bảo phần mềm đạt tiêu chuẩn chất lượng trước khi phát hành. QC tập trung vào:

- Tìm lỗi và khiếm khuyết
- Xác nhận tính năng hoạt động đúng
- Đảm bảo trải nghiệm người dùng tốt
- Ngăn chặn lỗi lên môi trường production

---

## 2. Vai trò & Trách nhiệm của QC

### Trách nhiệm chính

| Nhiệm vụ | Tần suất | Độ ưu tiên |
|----------|----------|------------|
| Thực thi test cases | Hàng ngày | Cao |
| Báo cáo lỗi | Khi phát hiện | Cao |
| Smoke testing sau deploy | Sau mỗi lần deploy | Cao |
| Regression testing | Trước release | Trung bình |
| Viết/cập nhật test cases | Hàng tuần | Trung bình |
| Tài liệu test | Liên tục | Thấp |

### Kỹ năng cần thiết

- Chú ý đến chi tiết
- Tư duy logic
- Giao tiếp rõ ràng (báo cáo lỗi)
- Hiểu biết cơ bản về ứng dụng web
- Quen thuộc với browser developer tools

---

## 3. Các loại Testing

### 3.1 Functional Testing

Xác minh tính năng hoạt động theo đặc tả.

| Loại | Mô tả | Khi nào dùng |
|------|-------|--------------|
| **Smoke Testing** | Kiểm tra nhanh các chức năng quan trọng | Sau deploy |
| **Sanity Testing** | Test tập trung vào thay đổi cụ thể | Sau sửa lỗi |
| **Regression Testing** | Test toàn bộ tính năng hiện có | Trước release |
| **Integration Testing** | Test tương tác giữa các tính năng | Tính năng mới |

### 3.2 Non-Functional Testing

| Loại | Mô tả |
|------|-------|
| **Usability Testing** | Trải nghiệm người dùng, dễ sử dụng |
| **Performance Testing** | Tốc độ, khả năng phản hồi |
| **Security Testing** | Xác thực, phân quyền |
| **Compatibility Testing** | Tương thích trình duyệt, thiết bị |

### 3.3 Các cấp độ Testing

```
Unit Testing (Developers)
    ↓
Integration Testing (Developers + QC)
    ↓
System Testing (QC)
    ↓
User Acceptance Testing (BA + QC + Stakeholders)
```

---

## 4. Công cụ Testing

### Công cụ bắt buộc

| Công cụ | Mục đích | Cài đặt |
|---------|----------|---------|
| **Chrome DevTools** | Inspect elements, console, network | Có sẵn trong Chrome |
| **Postman** | Test API | [Tải về](https://www.postman.com/downloads/) |
| **JIRA** | Quản lý lỗi, test management | Web-based |
| **Confluence** | Tài liệu | Web-based |

### Yêu cầu trình duyệt

Test trên các trình duyệt sau (theo thứ tự ưu tiên):

1. **Chrome** (mới nhất) - Chính
2. **Firefox** (mới nhất) - Phụ
3. **Safari** (mới nhất) - Chỉ Mac
4. **Edge** (mới nhất) - Chỉ Windows

### Phím tắt DevTools

| Hành động | Windows/Linux | Mac |
|-----------|---------------|-----|
| Mở DevTools | `F12` hoặc `Ctrl+Shift+I` | `Cmd+Option+I` |
| Console | `Ctrl+Shift+J` | `Cmd+Option+J` |
| Elements | `Ctrl+Shift+C` | `Cmd+Shift+C` |
| Network | `Ctrl+Shift+E` | `Cmd+Option+E` |

---

## 5. Tổng quan HR Tool

### Mô tả dự án

HR Tool là nền tảng SaaS multi-tenant cho quản lý nhân sự, hỗ trợ:

- **Enterprise Mode**: Phòng nhân sự nội bộ
- **Headhunt Mode**: Công ty tuyển dụng

### Các module chính

| Module | Mô tả | Tính năng chính |
|--------|-------|-----------------|
| **Authentication** | Đăng nhập/đăng xuất | JWT tokens, chỉ mời mới đăng ký được |
| **Dashboard** | Thống kê tổng quan | Biểu đồ, hành động nhanh |
| **Employees** | Quản lý nhân viên | CRUD, lọc, thống kê |
| **Departments** | Cơ cấu phòng ban | CRUD, phân loại |
| **Positions** | Vị trí công việc | CRUD, liên kết phòng ban |
| **Jobs** | Tin tuyển dụng | AI parse JD, quản lý trạng thái |
| **Candidates** | Hồ sơ ứng viên | AI parse CV, theo dõi trạng thái |
| **Applications** | Pipeline ATS | Quản lý giai đoạn, ghi chú |
| **Interviews** | Lịch phỏng vấn | Feedback, đánh giá |
| **CV Matching** | AI matching | Điểm chi tiết, câu hỏi phỏng vấn |
| **Partners** | Khách hàng Headhunt | (Chỉ Headhunt mode) |

### Vai trò người dùng

| Vai trò | Mô tả | Quyền truy cập |
|---------|-------|----------------|
| `super_admin` | Chủ nền tảng | Tất cả công ty, cài đặt hệ thống |
| `admin` | Quản trị công ty | Toàn quyền trong công ty |
| `hr` | Nhân viên HR | Hầu hết tính năng trừ cài đặt |
| `tech_lead` | Lead kỹ thuật | Chỉ đọc + viết phỏng vấn |

---

## 6. Thiết lập môi trường

### Các môi trường

| Môi trường | URL | Mục đích |
|------------|-----|----------|
| **Staging** | https://hr-tool-software.netlify.app | Testing, QC |
| **Staging API** | https://hr-tool-staging.ddnsfree.com | Test API |
| **Production** | https://hr-tool-api.vercel.app | Người dùng thật |

> **Cảnh báo:** Không bao giờ test trên Production với các hành động phá hoại (xóa, sửa dữ liệu quan trọng)

### Phát triển local (Tùy chọn)

```bash
# Clone repository
git clone https://github.com/your-org/hr-tool.git
cd hr-tool

# Cài đặt dependencies
yarn install

# Khởi động infrastructure
yarn infra:up

# Chạy development
yarn dev
```

---

## 7. Thông tin tài khoản test

### Tài khoản Staging

| Vai trò | Email | Mật khẩu |
|---------|-------|----------|
| Super Admin | Liên hệ QC Lead | Liên hệ QC Lead |
| Admin | Liên hệ QC Lead | Liên hệ QC Lead |
| HR | Liên hệ QC Lead | Liên hệ QC Lead |
| Tech Lead | Liên hệ QC Lead | Liên hệ QC Lead |

> **Lưu ý:** Liên hệ QC Lead hoặc Tech Lead để nhận thông tin tài khoản test.

### Hướng dẫn dữ liệu test

- Đặt tiền tố `[TEST]` cho dữ liệu test để dễ nhận biết
- Dọn dẹp dữ liệu test sau khi testing
- Không sửa đổi seed data (đặc biệt super admin)

---

## 8. Quy trình làm việc hàng ngày

### Routine buổi sáng

1. Kiểm tra Slack cho cập nhật/thông báo
2. Xem JIRA cho các task được giao
3. Kiểm tra trạng thái deployment
4. Chạy smoke tests nếu có deployment mới

### Quy trình Testing

```
1. Đọc yêu cầu/ticket
    ↓
2. Xác định test scenarios
    ↓
3. Thực thi test cases
    ↓
4. Ghi nhận kết quả
    ↓
5. Báo cáo lỗi (nếu có)
    ↓
6. Xác nhận bug fixes
    ↓
7. Cập nhật trạng thái test
```

### Cuối ngày

1. Cập nhật JIRA tickets
2. Ghi nhận các blockers
3. Chuẩn bị báo cáo trạng thái

---

## 9. Hướng dẫn giao tiếp

### Kênh Slack

| Kênh | Mục đích |
|------|----------|
| `#general` | Thông báo team |
| `#qc-team` | Thảo luận QC |
| `#bugs` | Thảo luận lỗi |
| `#deployments` | Thông báo deployment |

### Giao tiếp khi báo cáo lỗi

Khi báo cáo lỗi:

1. **Tạo JIRA ticket trước**
2. **Sau đó thông báo trên Slack** kèm link ticket
3. **Tag người liên quan** (developer, PM nếu critical)

### Quy trình Escalation

```
QC → Tech Lead → PM → CTO
```

Escalate khi:
- Lỗi critical chặn testing
- Yêu cầu không rõ ràng
- Vấn đề môi trường
- Không có phản hồi sau 24 giờ

---

## Bước tiếp theo

Sau khi hoàn thành hướng dẫn này:

1. Đọc [Template báo cáo lỗi](./02-bug-report-template/)
2. Thực hành với [Smoke Test Checklist](../practice/03-smoke-test-checklist/)
3. Nghiên cứu [Test Cases theo Module](../practice/04-test-cases-by-module/)

---

**Có thắc mắc?** Liên hệ:
- **Mentor:** Hai Trinh Nguyen (Tech Lead)
- **Slack:** #qc-team
