---
title: Unit Testing cơ bản
description: Unit testing là gì, khác gì E2E testing, và cách đọc hiểu unit test do developer viết bằng Jest
---

# Unit Testing cơ bản

Tài liệu đào tạo QC - HR Tool

**Phiên bản:** 1.0
**Cập nhật:** 20/08/2026
**Tác giả:** QC Team

---

## Mục lục

1. [Unit Testing là gì?](#1-unit-testing-là-gì)
2. [Unit Test khác E2E Test thế nào?](#2-unit-test-khác-e2e-test-thế-nào)
3. [Vì sao QC cần đọc hiểu Unit Test dù không viết](#3-vì-sao-qc-cần-đọc-hiểu-unit-test-dù-không-viết)
4. [Cấu trúc một Unit Test với Jest](#4-cấu-trúc-một-unit-test-với-jest)
5. [Mock là gì?](#5-mock-là-gì)
6. [Unit Test ở HR Tool](#6-unit-test-ở-hr-tool)
7. [Đọc Coverage Report](#7-đọc-coverage-report)
8. [Bài tập thực hành](#8-bài-tập-thực-hành)

---

## 1. Unit Testing là gì?

**Unit Test** kiểm tra một đơn vị code nhỏ nhất — thường là 1 function hoặc 1 method — một cách **độc lập**, không cần mở browser, không cần gọi API thật, không cần database thật.

Ví dụ: HR Tool có một function tính điểm match giữa CV và JD. Một unit test cho function này chỉ cần gọi function với input giả định và kiểm tra output, không cần chạy toàn bộ ứng dụng:

```typescript
function calculateMatchScore(candidateSkills: string[], jobSkills: string[]): number {
  const matched = candidateSkills.filter(skill => jobSkills.includes(skill));
  return Math.round((matched.length / jobSkills.length) * 100);
}

test('tính đúng điểm match khi có 2/4 kỹ năng trùng', () => {
  const score = calculateMatchScore(['React', 'Node.js'], ['React', 'Node.js', 'AWS', 'Docker']);
  expect(score).toBe(50);
});
```

## 2. Unit Test khác E2E Test thế nào?

| | Unit Test | E2E Test (Playwright) |
|---|---|---|
| **Kiểm tra** | 1 function/method riêng lẻ | Toàn bộ luồng người dùng qua UI thật |
| **Tốc độ** | Cực nhanh (milliseconds) | Chậm hơn (giây, vì phải mở browser thật) |
| **Cần browser?** | Không | Có |
| **Cần database/API thật?** | Không (thường dùng mock) | Có (hoặc môi trường staging) |
| **Ai viết ở HR Tool** | Developer | QC |
| **Phát hiện lỗi gì** | Lỗi logic trong 1 hàm | Lỗi tích hợp giữa các phần, lỗi UI thực tế |

Cả hai đều cần thiết và **bổ sung cho nhau** — một function có thể pass unit test (logic đúng) nhưng UI vẫn lỗi vì gọi sai API, và ngược lại.

## 3. Vì sao QC cần đọc hiểu Unit Test dù không viết

Ở HR Tool, developer là người viết unit test (cho `apps/api`) và test component (cho `apps/web`, dùng Jest + React Testing Library). QC thường không viết loại test này, nhưng nên đọc hiểu được vì:

- Khi review Pull Request có kèm test, bạn cần đánh giá được test đó có **thật sự kiểm tra đúng logic** hay chỉ viết cho có.
- Khi một bug xảy ra, biết được "bug này lẽ ra unit test đã bắt được chưa" giúp bạn viết bug report chính xác hơn (đây là lỗi logic hay lỗi tích hợp?).
- HR Tool yêu cầu quy trình TDD (viết test trước code) — hiểu được cấu trúc test giúp bạn giao tiếp tốt hơn với dev khi bàn về test coverage.

## 4. Cấu trúc một Unit Test với Jest

HR Tool dùng **Jest 30** cho unit/integration test. Cấu trúc cơ bản:

```typescript
import { describe, it, expect } from '@jest/globals';

describe('calculateMatchScore', () => {
  it('trả về 100 khi tất cả kỹ năng đều trùng', () => {
    const score = calculateMatchScore(['React'], ['React']);
    expect(score).toBe(100);
  });

  it('trả về 0 khi không có kỹ năng nào trùng', () => {
    const score = calculateMatchScore(['Java'], ['React']);
    expect(score).toBe(0);
  });

  it('throw error khi danh sách job skills trống', () => {
    expect(() => calculateMatchScore(['React'], [])).toThrow();
  });
});
```

| Từ khoá | Ý nghĩa |
|---------|---------|
| `describe('...', () => {...})` | Nhóm nhiều test case liên quan (giống `test.describe` trong Playwright) |
| `it('...', () => {...})` hoặc `test('...', ...)` | 1 test case cụ thể |
| `expect(value).toBe(x)` | Assertion — so sánh kết quả thực tế với kỳ vọng |
| `beforeEach()` / `afterEach()` | Chạy trước/sau mỗi test trong `describe` |

## 5. Mock là gì?

**Mock** là việc "giả lập" một phần hệ thống (API call, database, service bên thứ 3) để unit test không phụ thuộc vào phần đó — giúp test chạy nhanh và ổn định:

```typescript
// Giả lập AI service để không gọi API Gemini/Claude thật khi test
jest.mock('../services/ai-provider.service', () => ({
  matchCvToJd: jest.fn().mockResolvedValue({ score: 85, reasons: ['Kỹ năng phù hợp'] }),
}));

test('gọi AI provider và trả về điểm match', async () => {
  const result = await cvMatchingService.evaluate(candidateId, jobId);
  expect(result.score).toBe(85);
});
```

Nếu không mock, test sẽ gọi API AI thật mỗi lần chạy — chậm, tốn tiền, và kết quả có thể thay đổi giữa các lần chạy (không ổn định).

## 6. Unit Test ở HR Tool

Theo cấu trúc dự án, mỗi feature backend có file test đi kèm ngay cạnh:

```
apps/api/src/contexts/recruitment/cv-matching/
├── cv-matching.service.ts
├── cv-matching.service.spec.ts   ← unit test cho service
├── cv-matching.router.ts
├── cv-matching.router.spec.ts    ← test cho tRPC router
```

Quy ước: file test luôn có đuôi `.spec.ts` và nằm cùng cấp với file được test — bạn có thể tìm test của một feature bất kỳ bằng cách tìm file `.spec.ts` cùng tên.

## 7. Đọc Coverage Report

**Test Coverage** là % code đã được unit test "chạy qua" khi test thực thi. HR Tool có mục tiêu coverage khá cao (Backend ~99% lines, Frontend ~97% lines). Khi chạy `yarn test --coverage`, kết quả hiện ra dạng:

```
File                        | % Stmts | % Branch | % Funcs | % Lines
-----------------------------|---------|----------|---------|--------
cv-matching.service.ts       |   95.2  |   88.0   |  100.0  |  95.2
```

Coverage cao **không đồng nghĩa** với "không có bug" — nó chỉ cho biết code đã được *chạy qua*, không đảm bảo test đã kiểm tra đúng logic. Đây là lý do E2E test (do QC viết) vẫn cần thiết dù coverage unit test đã rất cao.

:::tip[Mẹo đọc coverage khi review PR]
Nếu một PR thêm logic mới nhưng % Branch coverage của file đó thấp hơn hẳn % Lines, rất có thể có nhánh `if/else` hoặc `try/catch` chưa được test — đáng để hỏi lại developer.
:::

## 8. Bài tập thực hành

1. Với function `calculateMatchScore` ở mục 1, viết thêm 1 test case cho trường hợp `candidateSkills` là mảng rỗng.
2. Giải thích bằng lời tại sao developer nên **mock** việc gọi AI provider (Gemini/Claude) trong unit test thay vì gọi thật.
3. Tìm (hoặc tưởng tượng) một PR thêm tính năng "xoá ứng viên" — bạn sẽ hỏi developer những câu gì về unit test coverage trước khi approve PR đó?

## Bước tiếp theo

Tiếp theo: [Playwright 101](../automation/04-playwright-101/) — bắt đầu học automation ở tầng E2E, nơi QC sẽ trực tiếp viết test.

---

**Cần giúp đỡ?** Liên hệ QC Lead hoặc đăng trong #qc-team
