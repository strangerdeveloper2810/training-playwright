---
title: Cross-browser & Parallel Execution
description: Chạy test trên nhiều trình duyệt và chạy song song để rút ngắn thời gian test
---

# Cross-browser & Parallel Execution

Tài liệu đào tạo QC - HR Tool

---

## Mục lục

1. [Vì sao cần chạy nhiều trình duyệt](#1-vì-sao-cần-chạy-nhiều-trình-duyệt)
2. [Khai báo `projects` trong playwright.config.ts](#2-khai-báo-projects-trong-playwrightconfigts)
3. [Chạy song song với `workers`](#3-chạy-song-song-với-workers)
4. [Sharding khi chạy trên CI](#4-sharding-khi-chạy-trên-ci)
5. [Cân bằng tốc độ CI và độ phủ (coverage)](#5-cân-bằng-tốc-độ-ci-và-độ-phủ-coverage)

---

## 1. Vì sao cần chạy nhiều trình duyệt

Ở bài [Web Basics](../basics/03-web-basics/), ta đã biết QC cần test trên nhiều trình duyệt vì mỗi browser engine (Chromium, Firefox/Gecko, Safari/WebKit) có thể render CSS hoặc hỗ trợ JavaScript API khác nhau. Automation test cũng cần làm điều tương tự — chạy CÙNG một bộ test trên nhiều engine để phát hiện sớm các lỗi tương thích, thay vì chỉ test bằng tay.

Playwright hỗ trợ cả 3 engine chính (Chromium, Firefox, WebKit) và có thể giả lập thiết bị di động (device emulation) chỉ bằng cấu hình, không cần viết lại test.

## 2. Khai báo `projects` trong playwright.config.ts

Một "project" trong Playwright là một cấu hình chạy — cùng bộ test nhưng với browser/thiết bị khác nhau:

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 13'] },
    },
  ],
});
```

Khi chạy `npx playwright test`, Playwright sẽ chạy **toàn bộ** test suite trên **cả 5 project** này — tổng số lần chạy = số test case × số project. Có thể chạy riêng 1 project:

```bash
npx playwright test --project=firefox
npx playwright test --project=mobile-safari
```

:::tip[Đặt tên project rõ nghĩa]
Tên project (`chromium`, `mobile-safari`...) sẽ xuất hiện trong report và log lỗi. Đặt tên rõ ràng giúp QC biết ngay lỗi xảy ra ở browser/thiết bị nào mà không cần mở chi tiết.
:::

## 3. Chạy song song với `workers`

Mặc định, Playwright chạy nhiều file test **song song** bằng nhiều worker (process con), giúp giảm đáng kể tổng thời gian:

```typescript
export default defineConfig({
  fullyParallel: true,       // các test trong CÙNG 1 file cũng chạy song song
  workers: process.env.CI ? 2 : undefined, // giới hạn worker trên CI, không giới hạn ở local
});
```

- **Local**: Playwright tự tính số worker dựa trên số CPU core của máy.
- **CI**: nên set số cụ thể (ví dụ 2-4) vì máy CI thường có ít CPU hơn máy dev, chạy quá nhiều worker cùng lúc có thể làm chậm hoặc gây timeout do tranh chấp tài nguyên.

:::caution[Test phải độc lập với nhau]
Chạy song song chỉ an toàn khi các test **không phụ thuộc thứ tự** và **không dùng chung dữ liệu có thể xung đột** (ví dụ 2 test cùng sửa 1 record). Nếu 2 test tạo Job cùng tên "Test Job" cùng lúc, có thể một trong hai fail do trùng dữ liệu — đây là nguyên nhân phổ biến gây flaky test khi bật parallel.
:::

## 4. Sharding khi chạy trên CI

Khi test suite lớn (hàng trăm test), chỉ tăng `workers` trên 1 máy sẽ tới giới hạn CPU/RAM. **Sharding** giải quyết vấn đề này bằng cách chia bộ test ra chạy trên **nhiều máy CI song song**, mỗi máy chạy một phần:

```bash
# Máy 1 trong tổng số 4 máy
npx playwright test --shard=1/4

# Máy 2 trong tổng số 4 máy
npx playwright test --shard=2/4
```

Ví dụ cấu hình GitHub Actions chạy 4 shard song song (chi tiết CI/CD sẽ học kỹ ở bài [CI/CD & Reporting](../automation/19-cicd-github-actions-reporting/)):

```yaml
strategy:
  matrix:
    shard: [1, 2, 3, 4]
steps:
  - run: npx playwright test --shard=${{ matrix.shard }}/4
```

Sharding và `workers` giải quyết 2 vấn đề khác nhau: `workers` chạy song song **trong 1 máy**, sharding chia việc ra **nhiều máy** — dùng kết hợp cả hai sẽ tối ưu nhất cho suite lớn.

## 5. Cân bằng tốc độ CI và độ phủ (coverage)

Chạy full cross-browser (5 project) cho MỌI test không phải lúc nào cũng hợp lý — thời gian CI sẽ tăng gấp 5 lần. Cách tiếp cận thực tế:

| Chiến lược | Khi nào dùng |
|---|---|
| Chạy full 5 project | Trước khi release, hoặc chạy định kỳ ban đêm (nightly build) |
| Chỉ chạy `chromium` | Mỗi lần push code / mở Pull Request — cần feedback nhanh |
| Chạy `chromium` + 1 mobile project | Balance hợp lý cho CI mỗi PR nếu team có ngân sách thời gian CI cho phép |

:::note
Không có công thức đúng tuyệt đối — quyết định này phụ thuộc vào ngân sách thời gian CI, số lượng test, và mức độ quan trọng của việc phát hiện sớm lỗi cross-browser. Thảo luận với Tech Lead để chọn chiến lược phù hợp với dự án.
:::

## Bài tập thực hành

1. Thêm project `mobile-chrome` (dùng `devices['Pixel 5']`) vào file `playwright.config.ts` của một project Playwright bạn đang thực hành, rồi chạy `--project=mobile-chrome` để xác nhận nó hoạt động.
2. Chạy `npx playwright test --project=chromium --project=webkit` (chạy đồng thời 2 project cụ thể) và so sánh thời gian với khi chạy cả 5 project.
3. Giải thích vì sao 2 test cùng tạo dữ liệu tên "Test Candidate" có thể gây flaky khi chạy song song, và đề xuất cách sửa (gợi ý: dùng dữ liệu unique, ví dụ gắn timestamp vào tên).
4. Nếu team bạn có 200 test case và ngân sách CI chỉ cho phép 10 phút mỗi lần chạy, bạn sẽ chọn chiến lược nào trong bảng ở mục 5? Giải thích lý do.

## Bước tiếp theo

Tiếp theo, tìm hiểu cách Playwright giả lập thiết bị di động để test responsive web: [Mobile Web Testing](../automation/14-mobile-web-testing/).

---

**Cần giúp đỡ?** Liên hệ QC Lead hoặc đăng trong #qc-team
