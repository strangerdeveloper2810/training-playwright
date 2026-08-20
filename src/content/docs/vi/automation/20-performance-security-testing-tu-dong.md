---
title: Performance & Security Testing tự động
description: Giới thiệu công cụ tự động hoá kiểm thử hiệu năng (Lighthouse CI, k6) và bảo mật (dependency scan, OWASP ZAP) ở mức nhận biết cho QC/tester
---

# Performance & Security Testing tự động

Tài liệu đào tạo QC - HR Tool

Đây là bài ở mức **giới thiệu** — mục tiêu không phải để bạn trở thành chuyên gia performance/security, mà để bạn biết những công cụ này tồn tại, hiểu sơ lược cách chúng hoạt động, và biết khi nào nên escalate cho người chuyên trách.

## Mục lục

1. [Vì sao QC/tester cần biết những công cụ này](#1-vì-sao-qctester-cần-biết-những-công-cụ-này)
2. [Performance tự động: Lighthouse CI](#2-performance-tự-động-lighthouse-ci)
3. [Load Testing tự động: k6](#3-load-testing-tự-động-k6)
4. [Security tự động: dependency scan & OWASP ZAP](#4-security-tự-động-dependency-scan--owasp-zap)
5. [Khi nào escalate](#5-khi-nào-escalate)
6. [Bài tập thực hành](#6-bài-tập-thực-hành)

## 1. Vì sao QC/tester cần biết những công cụ này

Ở [bài Performance Testing - khái niệm](../practice/10-performance-testing-khai-niem/) và [bài Security Testing cơ bản](../practice/11-security-testing-co-ban/), bạn đã học cách nhận biết vấn đề performance/security bằng tay. Bài này cho biết các vấn đề đó có thể được **tự động hoá kiểm tra liên tục** (chạy mỗi lần deploy) thế nào, để không phải chờ đến lúc QC thủ công mới phát hiện.

## 2. Performance tự động: Lighthouse CI

**Lighthouse** là công cụ của Google đo các chỉ số Web Vitals (LCP - thời gian hiển thị nội dung chính, CLS - độ lệch layout, TBT - thời gian block tương tác...). **Lighthouse CI** cho phép chạy Lighthouse tự động trong pipeline và **fail build** nếu điểm số giảm dưới ngưỡng cho phép.

```yaml
# Ví dụ bước trong GitHub Actions
- name: Run Lighthouse CI
  run: |
    npm install -g @lhci/cli
    lhci autorun --collect.url=https://hr-tool-software.netlify.app
```

Cách đọc kết quả: Lighthouse CI cho điểm 0-100 theo 4 nhóm (Performance, Accessibility, Best Practices, SEO) kèm danh sách vấn đề cụ thể (ảnh chưa optimize, JS bundle quá lớn...). QC không cần tự sửa các vấn đề này, nhưng nên biết đọc report để báo lại đúng vấn đề cho dev/FE.

## 3. Load Testing tự động: k6

**k6** là công cụ mã nguồn mở để giả lập nhiều người dùng gọi API/truy cập web cùng lúc, đo xem hệ thống chịu tải đến đâu.

```javascript
// script.js - kịch bản k6 rất cơ bản
import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  vus: 20,        // 20 virtual users
  duration: '30s',
};

export default function () {
  http.get('https://hr-tool-software.netlify.app/api/jobs');
  sleep(1);
}
```

```bash
k6 run script.js
```

Kết quả trả về các chỉ số quan trọng: `http_req_duration` (p95 — 95% request có thời gian phản hồi dưới bao nhiêu ms), `http_req_failed` (tỷ lệ lỗi). Nếu p95 tăng vọt hoặc error rate cao khi tăng số virtual users, đó là dấu hiệu hệ thống không chịu tải tốt — cần báo cho backend team.

## 4. Security tự động: dependency scan & OWASP ZAP

**Dependency scanning** — kiểm tra các package/thư viện dự án đang dùng có lỗ hổng bảo mật đã biết (CVE) không:

```bash
npm audit
# hoặc dùng Snyk để có báo cáo chi tiết hơn + gợi ý fix
npx snyk test
```

**OWASP ZAP baseline scan** — quét tự động một website để tìm các lỗ hổng phổ biến (thiếu security header, XSS cơ bản, thông tin nhạy cảm bị lộ trong response...), thường chạy trong CI nhắm vào môi trường staging:

```yaml
- name: OWASP ZAP Baseline Scan
  uses: zaproxy/action-baseline@v0.10.0
  with:
    target: 'https://hr-tool-staging.example.com'
```

:::caution[Chỉ chạy trên staging, không chạy trên production]
Cả load testing (k6) và security scan (ZAP) đều tạo ra lượng traffic/request bất thường — tuyệt đối không chạy nhắm vào production nếu không có sự đồng ý và giám sát của team vận hành.
:::

## 5. Khi nào escalate

QC/automation tester nên **báo cáo và escalate** cho người chuyên trách (Performance Engineer, Security Engineer, Tech Lead) khi:

- Lighthouse CI/k6 báo điểm số hoặc response time giảm rõ rệt so với trước.
- `npm audit`/Snyk phát hiện lỗ hổng mức High/Critical.
- OWASP ZAP báo phát hiện lỗ hổng bảo mật (dù chỉ ở mức Medium) — không tự ý "thử khai thác thêm" mà chưa được cho phép.

Vai trò của QC ở đây là **người phát hiện và báo cáo sớm**, không phải người tự khắc phục các vấn đề chuyên sâu này.

## 6. Bài tập thực hành

1. Chạy `npm audit` trên một project Node.js bất kỳ bạn có (hoặc hr-tool nếu được cấp quyền) và đọc report — có bao nhiêu lỗ hổng, ở mức độ nào?
2. Giải thích bằng lời: `p95 response time` nghĩa là gì, khác gì với response time trung bình.
3. Nếu Lighthouse CI báo điểm Performance giảm từ 90 xuống 60 sau một lần deploy, bạn sẽ làm gì trước khi báo cho dev?

## Bước tiếp theo

Tiếp theo: [Best Practices & Cheatsheet](./21-best-practices-cheatsheet/) — tổng hợp lại toàn bộ kiến thức automation testing.

**Cần giúp đỡ?** Liên hệ QC Lead hoặc #qc-team
