---
title: Performance Testing - Khái niệm
description: Khái niệm cơ bản về kiểm thử hiệu năng dành cho QC chưa chuyên sâu về performance
---

# Performance Testing - Khái niệm

Tài liệu đào tạo QC - HR Tool

Bạn không cần trở thành chuyên gia performance để nhận ra khi nào một tính năng "chậm bất thường" và cần escalate. Bài này trang bị các khái niệm nền tảng để bạn tự tin thảo luận về hiệu năng với Dev/Tech Lead.

## Mục lục

1. [Các loại Performance Testing](#1-các-loại-performance-testing)
2. [Chỉ số quan trọng cần biết](#2-chỉ-số-quan-trọng-cần-biết)
3. [Khi nào QC cần quan tâm đến performance](#3-khi-nào-qc-cần-quan-tâm-đến-performance)
4. [Công cụ phổ biến (mức nhận biết)](#4-công-cụ-phổ-biến-mức-nhận-biết)
5. [Bài tập thực hành](#5-bài-tập-thực-hành)

---

## 1. Các loại Performance Testing

| Loại | Mục đích | Ví dụ |
|------|----------|-------|
| **Load Testing** | Xem hệ thống hoạt động thế nào ở mức tải **bình thường/kỳ vọng** | 100 HR cùng lúc filter danh sách Candidates trong giờ làm việc |
| **Stress Testing** | Đẩy hệ thống vượt quá mức tải bình thường để tìm điểm "gãy" | Tăng dần số user đồng thời cho đến khi API bắt đầu lỗi/chậm |
| **Spike Testing** | Kiểm tra khi tải tăng **đột ngột** trong thời gian ngắn | Một công ty lớn import 5.000 candidate cùng lúc |
| **Soak Testing** | Kiểm tra hệ thống chạy liên tục trong thời gian dài | Chạy hệ thống 24-48 giờ liên tục xem có bị memory leak, chậm dần không |

## 2. Chỉ số quan trọng cần biết

| Chỉ số | Ý nghĩa |
|--------|---------|
| **Response Time / Latency** | Thời gian từ khi gửi request đến khi nhận được response đầy đủ |
| **Throughput** | Số request hệ thống xử lý được trong một đơn vị thời gian (request/giây) |
| **Error Rate** | Tỷ lệ phần trăm request bị lỗi (timeout, 500...) trong tổng số request |
| **Concurrent Users** | Số người dùng thao tác đồng thời tại một thời điểm |

Khi nghe Dev/Tech Lead nói "API này có P95 latency là 800ms", nghĩa là 95% số request có thời gian phản hồi ≤ 800ms — chỉ số P95/P99 thường quan trọng hơn thời gian trung bình vì nó phản ánh trải nghiệm của nhóm người dùng "kém may mắn nhất".

## 3. Khi nào QC cần quan tâm đến performance

QC (chưa chuyên performance) nên chú ý và **escalate** khi:

- Một action đơn giản (search, filter, submit form) mất hơn 2-3 giây một cách rõ rệt so với các action tương tự khác.
- Một tính năng chạy nhanh với dữ liệu ít nhưng bắt đầu chậm hẳn khi dữ liệu tăng lên (ví dụ danh sách 1.000 Candidates load chậm hơn nhiều so với 10 Candidates — có thể do thiếu pagination hoặc query không tối ưu).
- Tính năng liên quan xử lý nặng (AI CV-JD Matching, import file lớn, xuất báo cáo) không có trạng thái loading/progress, khiến người dùng không biết hệ thống có đang chạy hay bị treo.
- Sau khi deploy, thời gian phản hồi của cả hệ thống chậm hơn hẳn so với trước (regression về performance).

:::tip[Cách ghi nhận khi phát hiện]
Ghi lại: hành động cụ thể, thời gian phản hồi đo được (có thể lấy từ tab Network của DevTools), số lượng dữ liệu liên quan, và tần suất xảy ra (luôn chậm hay chỉ đôi lúc). Đây là thông tin Dev cần để điều tra.
:::

## 4. Công cụ phổ biến (mức nhận biết)

QC không cần tự vận hành các công cụ này, nhưng nên biết chúng dùng để làm gì để hiểu khi Dev/Automation Tester đề cập tới:

- **k6**: công cụ viết script (JavaScript) để giả lập nhiều user gọi API đồng thời, đo response time/error rate — thường dùng cho Load/Stress Testing tầng API.
- **JMeter**: công cụ tương tự k6 nhưng cấu hình qua giao diện (GUI), phổ biến lâu năm trong ngành.
- **Lighthouse (Performance tab)**: đo hiệu năng tải trang ở phía Frontend (thời gian tải, thời gian tương tác được...) — QC có thể tự chạy công cụ này (xem bài [Usability & Accessibility Testing](./09-usability-accessibility-testing/) để biết cách mở Lighthouse).

Phần thực hành sâu hơn về tự động hoá performance testing sẽ có ở bài [Performance & Security Testing tự động](../automation/20-performance-security-testing-tu-dong/) trong lộ trình Automation.

## 5. Bài tập thực hành

1. Mở tab Network trong DevTools, thực hiện search Candidates trên Staging, ghi lại thời gian phản hồi (`Time`) của request API tương ứng.
2. Chạy Lighthouse Performance trên trang Dashboard, ghi lại điểm số và chỉ số "Time to Interactive".
3. Giải thích bằng lời của bạn sự khác biệt giữa Load Testing và Stress Testing, kèm một ví dụ tình huống cụ thể của HR Tool cho mỗi loại.
4. Nếu bạn phát hiện tính năng "Xuất báo cáo CSV" mất hơn 30 giây với 5.000 dòng dữ liệu, hãy viết một đoạn escalation ngắn gửi Tech Lead theo đúng những thông tin cần ghi nhận đã học ở mục 3.

## Bước tiếp theo

Tiếp tục với [Security Testing cơ bản](./11-security-testing-co-ban/).

---

**Cần giúp đỡ?** Liên hệ QC Lead hoặc đăng trong #qc-team
