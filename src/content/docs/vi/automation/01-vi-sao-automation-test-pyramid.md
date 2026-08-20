---
title: Vì sao cần Automation Testing?
description: Automation Testing là gì, Test Automation Pyramid, ROI và khi nào nên/không nên automate
---

# Vì sao cần Automation Testing?

Tài liệu đào tạo QC - HR Tool

**Phiên bản:** 1.0
**Cập nhật:** 20/08/2026
**Tác giả:** QC Team

---

## Mục lục

1. [Automation Testing là gì?](#1-automation-testing-là-gì)
2. [Vì sao cần Automation Testing?](#2-vì-sao-cần-automation-testing)
3. [Test Automation Pyramid](#3-test-automation-pyramid)
4. [Khi nào nên Automate, khi nào nên Manual?](#4-khi-nào-nên-automate-khi-nào-nên-manual)
5. [Automation Testing Workflow](#5-automation-testing-workflow)
6. [Lộ trình học Automation trong tài liệu này](#6-lộ-trình-học-automation-trong-tài-liệu-này)
7. [Bài tập thực hành](#7-bài-tập-thực-hành)

---

## 1. Automation Testing là gì?

Ở các bài trước, bạn đã quen với việc **test thủ công (manual testing)**: tự tay mở browser, click, nhập dữ liệu, quan sát kết quả, rồi so sánh với kỳ vọng. Cách làm này linh hoạt nhưng có một vấn đề: mỗi lần HR Tool release, bạn phải lặp lại đúng những bước đó, hàng chục lần, hàng tuần.

**Automation Testing** là việc viết code để máy tự thực hiện các bước test đó thay bạn: tự mở browser, tự click, tự nhập dữ liệu, tự so sánh kết quả — và tự báo cáo pass/fail.

```
┌─────────────────────────────────────────────────────────────────┐
│                    MANUAL vs AUTOMATION                          │
├─────────────────────────────────────────────────────────────────┤
│  Manual Testing              Automation Testing                  │
│  ┌─────────────┐            ┌─────────────────────┐             │
│  │   Tester    │            │    Test Script      │             │
│  │  (Con người)│            │    (Code)           │             │
│  └──────┬──────┘            └──────────┬──────────┘             │
│         ▼                              ▼                         │
│  Click, nhập liệu,          Tự động click, nhập liệu,           │
│  kiểm tra bằng mắt          kiểm tra bằng assertion              │
│         ▼                              ▼                         │
│  Báo cáo thủ công           Báo cáo tự động + screenshot         │
└─────────────────────────────────────────────────────────────────┘
```

Automation **không thay thế** manual testing — nó giải phóng bạn khỏi những việc lặp lại để có thời gian làm những việc máy không làm được: exploratory testing, đánh giá UX, suy nghĩ về các edge case mới.

## 2. Vì sao cần Automation Testing?

| Lợi ích | Giải thích |
|---------|------------|
| **Tốc độ** | Một bộ test automation chạy nhanh hơn manual 10-100 lần |
| **Độ tin cậy** | Máy không mệt, không bỏ sót bước, chạy giống nhau mọi lần |
| **Tái sử dụng** | Viết một lần, chạy lại mỗi ngày, mỗi lần deploy |
| **Tiết kiệm chi phí dài hạn** | Chi phí viết ban đầu cao, nhưng chạy lại gần như miễn phí |
| **Chạy song song** | Test nhiều trình duyệt/thiết bị cùng lúc |
| **Chạy 24/7** | Gắn vào CI/CD, tự chạy mỗi khi có code mới |

**Ví dụ tính toán thực tế với một bộ regression 50 test case của HR Tool:**

```
Manual Testing:
- 50 test case × 5 phút/case  = 250 phút (~4 giờ)/lần chạy
- Mỗi sprint 2 tuần chạy lại ~5 lần → 20 giờ/sprint

Automation Testing:
- Viết 50 test case × 30 phút/case = 25 giờ (chỉ 1 lần)
- Mỗi lần chạy lại: ~10 phút (tự động, không cần người ngồi canh)
- Từ sprint thứ 2 trở đi: gần như miễn phí thời gian con người
```

:::tip[Automation không "rẻ" ngay từ đầu]
Chi phí viết test automation ban đầu **cao hơn** test thủ công 1 lần. Automation chỉ thật sự có lợi khi test case đó được chạy lại **nhiều lần** (regression, smoke). Đừng automate một test case chỉ chạy một lần rồi bỏ.
:::

## 3. Test Automation Pyramid

Test Pyramid là mô hình kinh điển mô tả **nên có bao nhiêu test ở mỗi tầng**:

```
                    ▲
                   /│\
                  / │ \        UI / E2E Tests
                 /  │  \       - Ít nhất (~10%)
                /   │   \      - Chậm nhất, đắt nhất
               ───────────
              /      │      \
             /       │       \    Integration Tests
            /        │        \   - Vừa phải (~20%)
           /         │         \
          ─────────────────────
         /           │           \
        /            │            \   Unit Tests
       /             │             \  - Nhiều nhất (~70%)
      /              │              \ - Nhanh nhất, rẻ nhất
     ───────────────────────────────
```

| Tầng | Ai viết | Số lượng | Tốc độ | Phạm vi |
|------|---------|----------|--------|---------|
| **Unit Tests** | Developer | Nhiều nhất | Rất nhanh (ms) | Test 1 function/method riêng lẻ |
| **Integration Tests** | Dev + QC | Vừa phải | Trung bình (giây) | Test nhiều module phối hợp (ví dụ API + DB) |
| **UI/E2E Tests** | QC | Ít nhất | Chậm (giây-phút) | Test toàn bộ luồng người dùng qua UI |

**Áp dụng cho HR Tool:**
- **Unit Tests**: Developer viết cho các service/function ở `apps/api` (dùng Jest) và component ở `apps/web` (dùng Jest + React Testing Library).
- **Integration Tests**: Test các tRPC router gọi xuống database thật.
- **E2E Tests**: QC viết bằng Playwright — mô phỏng một người dùng thật mở browser, đăng nhập, thực hiện nghiệp vụ (tạo Job, duyệt CV, chuyển stage ứng viên...).

Lý do UI/E2E test nên là **tầng ít nhất**: chúng chậm (phải mở browser thật), dễ vỡ khi UI thay đổi (flaky), và chi phí bảo trì cao hơn unit test rất nhiều. QC nên tập trung automation UI vào các luồng **quan trọng nhất** (login, luồng tuyển dụng chính), không cố automate 100% test case.

## 4. Khi nào nên Automate, khi nào nên Manual?

```
✅ NÊN AUTOMATION                        ✅ NÊN MANUAL
- Test case chạy lặp lại (regression,    - Exploratory testing (khám phá tự do)
  smoke test mỗi lần deploy)             - Usability testing (đánh giá UX/UI)
- Test case đã ổn định, ít thay đổi UI   - Test case mới, tính năng chưa ổn định
- Test case có nhiều tổ hợp dữ liệu      - Test 1 lần duy nhất (hotfix verification)
- Cần chạy trên nhiều browser/device     - Cần đánh giá cảm quan visual/design
- API testing (phản hồi nhanh, dễ automate)- Test case quá phức tạp để automate hợp lý
```

:::caution[Sai lầm thường gặp]
Đừng cố automate **mọi** test case ngay từ đầu. Hãy chọn những luồng quan trọng, ổn định, chạy lặp lại nhiều nhất (ví dụ: login, tạo ứng viên, pipeline ATS) để automate trước. Automate một tính năng còn đang thay đổi UI liên tục sẽ khiến bạn tốn công sửa test nhiều hơn công viết test.
:::

## 5. Automation Testing Workflow

```
1. ANALYZE   → Review test case thủ công, chọn cái phù hợp để automate
2. DESIGN    → Thiết kế Page Object, xác định locator, test structure
3. DEVELOP   → Viết test script, chuẩn bị test data
4. EXECUTE   → Chạy test local, chạy trên CI/CD, xem báo cáo
5. MAINTAIN  → Cập nhật test khi UI đổi, sửa flaky test, thêm test mới
```

Automation không phải "viết xong là xong" — bước **MAINTAIN** thường tốn nhiều công hơn bạn nghĩ, vì UI của HR Tool sẽ tiếp tục thay đổi theo thời gian.

## 6. Lộ trình học Automation trong tài liệu này

Nhóm "Automation Testing" gồm 21 bài, đi từ nền tảng đến nâng cao. Gợi ý lộ trình học trong khoảng 6 tuần nếu bạn học song song với công việc test thủ công hàng ngày:

| Tuần | Chủ đề |
|------|--------|
| 1 | Vì sao automation (bài này), TypeScript/Node.js cơ bản, Unit testing cơ bản, Playwright 101 |
| 2 | Locators, Actions, Assertions |
| 3 | Page Object Model, Fixtures & Test Data, Authentication & Storage State |
| 4 | Data-driven testing, Visual regression, Cross-browser/parallel, Mobile web, Accessibility tự động |
| 5 | API/tRPC testing, Database verification, Debug (Trace Viewer, Codegen) |
| 6 | CI/CD, Performance/Security testing tự động, Best Practices & Cheatsheet |

Bạn không cần học tuyến tính 100% — nhưng nên học đúng thứ tự trong mỗi tuần, vì các bài sau dùng lại kiến thức của bài trước.

## 7. Bài tập thực hành

1. Liệt kê 5 test case bạn đang chạy thủ công mỗi sprint cho HR Tool. Với mỗi test case, xác định: nên automate hay nên giữ manual? Giải thích lý do dựa theo bảng ở mục 4.
2. Vẽ lại Test Pyramid cho riêng nhóm QC của bạn — ước lượng tỷ lệ % test hiện tại đang nằm ở tầng nào (rất có thể phần lớn đang là manual UI test — điều đó có vấn đề gì?).
3. Với luồng "Đăng nhập vào HR Tool", tính thử chi phí thời gian nếu test thủ công mỗi ngày trong 1 tháng, so với chi phí viết 1 lần bằng automation.

## Bước tiếp theo

Tiếp theo, hãy học [TypeScript & Node.js cơ bản cho Tester](../automation/02-typescript-nodejs-co-ban-cho-tester/) — nền tảng code cần có trước khi viết Playwright test.

---

**Cần giúp đỡ?** Liên hệ QC Lead hoặc đăng trong #qc-team
