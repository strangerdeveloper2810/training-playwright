---
title: CI/CD với GitHub Actions & Reporting
description: Chạy Playwright test tự động trên GitHub Actions, chạy song song với sharding, và xem báo cáo kết quả
---

# CI/CD với GitHub Actions & Reporting

Tài liệu đào tạo QC - HR Tool

Automation test chỉ thật sự phát huy giá trị khi nó **chạy tự động**, không cần ai nhớ để bấm nút. Bài này hướng dẫn cấu hình GitHub Actions để tự chạy test mỗi khi có Pull Request, chạy song song để nhanh hơn, và cách đọc báo cáo kết quả.

## Mục lục

1. [Vì sao cần CI/CD cho automation test](#1-vì-sao-cần-cicd-cho-automation-test)
2. [Cấu hình GitHub Actions cơ bản](#2-cấu-hình-github-actions-cơ-bản)
3. [Chạy nhanh hơn với Matrix & Sharding](#3-chạy-nhanh-hơn-với-matrix--sharding)
4. [Xem báo cáo (HTML Report)](#4-xem-báo-cáo-html-report)
5. [Thông báo khi test fail](#5-thông-báo-khi-test-fail)
6. [Bài tập thực hành](#6-bài-tập-thực-hành)

## 1. Vì sao cần CI/CD cho automation test

Nếu automation test chỉ chạy trên máy cá nhân, nó sẽ:

- Dễ bị quên chạy trước khi merge code.
- Chạy ra kết quả khác nhau giữa máy người này và người khác (khác version Node, khác OS).
- Không ai biết test có pass hay không khi review Pull Request.

Đưa test vào CI/CD (GitHub Actions) giải quyết cả 3 vấn đề: test chạy tự động, cùng môi trường, và kết quả hiển thị ngay trên Pull Request.

## 2. Cấu hình GitHub Actions cơ bản

```yaml
# .github/workflows/playwright.yml
name: Playwright Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright Browsers
        run: npx playwright install --with-deps

      - name: Run Playwright tests
        run: npx playwright test
        env:
          BASE_URL: ${{ secrets.STAGING_BASE_URL }}

      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

Lưu ý: `BASE_URL` (hay bất kỳ URL/credential nào) nên lấy từ **GitHub Secrets**, không hardcode trực tiếp trong file YAML.

## 3. Chạy nhanh hơn với Matrix & Sharding

Khi số lượng test tăng lên, chạy tuần tự sẽ rất chậm. Hai kỹ thuật giúp chạy song song:

**Matrix — chạy trên nhiều browser cùng lúc:**

```yaml
jobs:
  test:
    strategy:
      matrix:
        browser: [chromium, firefox, webkit]
    steps:
      # ...(các step cài đặt như trên)
      - name: Run tests on ${{ matrix.browser }}
        run: npx playwright test --project=${{ matrix.browser }}
```

**Sharding — chia bộ test thành nhiều phần chạy song song:**

```yaml
jobs:
  test:
    strategy:
      matrix:
        shard: [1, 2, 3]
    steps:
      # ...(các step cài đặt như trên)
      - name: Run tests (shard ${{ matrix.shard }}/3)
        run: npx playwright test --shard=${{ matrix.shard }}/3
```

Có thể kết hợp cả hai (matrix theo browser × shard) khi bộ test rất lớn, nhưng cần cân đối vì càng nhiều job song song càng tốn runner/phút CI.

## 4. Xem báo cáo (HTML Report)

Playwright tự sinh HTML report sau mỗi lần chạy:

```bash
npx playwright show-report
```

Report cho biết: test nào pass/fail, thời gian chạy mỗi test, và nếu fail thì có kèm screenshot/trace (nếu đã cấu hình ở [bài Debug & Trace Viewer](./18-debug-trace-viewer-codegen/)). Trên CI, report được lưu lại như artifact (`actions/upload-artifact`) để bạn tải về xem sau khi job chạy xong — vì CI không có UI để mở trực tiếp.

## 5. Thông báo khi test fail

Với team, chờ vào GitHub để biết test fail là chưa đủ nhanh. Có thể tích hợp thông báo tự động vào Slack khi job fail:

```yaml
      - name: Notify Slack on failure
        if: failure()
        uses: slackapi/slack-github-action@v1
        with:
          payload: |
            {"text": "❌ Playwright tests failed trên ${{ github.ref_name }}. Xem report: ${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}"}
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

:::note[Mức giới thiệu]
Việc setup Slack webhook thường do Tech Lead/DevOps cấu hình một lần cho cả team. QC/automation tester cần biết cơ chế này tồn tại và biết đọc thông báo, không nhất thiết phải tự setup từ đầu.
:::

## 6. Bài tập thực hành

1. Vẽ sơ đồ (bằng lời hoặc hình) luồng: code được push → GitHub Actions chạy gì → kết quả hiển thị ở đâu.
2. Giải thích sự khác biệt giữa "matrix theo browser" và "sharding" — khi nào dùng cái nào?
3. Thử tải 1 HTML report mẫu (hoặc report có sẵn trong repo hr-tool) và tìm ra: test nào fail, vì sao (dựa vào error message/trace nếu có).

## Bước tiếp theo

Tiếp theo: [Performance & Security Testing tự động](./20-performance-security-testing-tu-dong/) — giới thiệu các công cụ nâng cao hơn.

**Cần giúp đỡ?** Liên hệ QC Lead hoặc #qc-team
