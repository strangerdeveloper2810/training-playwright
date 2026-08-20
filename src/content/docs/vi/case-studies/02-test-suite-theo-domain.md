---
title: "Case Study: Tổ chức Test Suite theo Domain nghiệp vụ"
description: Phân tích cách hr-tool tổ chức test cho ATS Pipeline và CTV Portal để rút ra nguyên tắc áp dụng cho domain khác
---

# Case Study: Tổ chức Test Suite theo Domain nghiệp vụ

Tài liệu đào tạo QC - HR Tool

---

## Mục lục

1. [Vì sao tổ chức theo domain, không theo trang/URL](#1-vì-sao-tổ-chức-theo-domain-không-theo-trangurl)
2. [Case 1: ATS Pipeline — viết khung test trước, skip khi thiếu data](#2-case-1-ats-pipeline--viết-khung-test-trước-skip-khi-thiếu-data)
3. [Case 2: CTV Portal — storageState theo suite và dữ liệu unique](#3-case-2-ctv-portal--storagestate-theo-suite-và-dữ-liệu-unique)
4. [Nguyên tắc chung áp dụng cho domain khác](#4-nguyên-tắc-chung-áp-dụng-cho-domain-khác)

---

## 1. Vì sao tổ chức theo domain, không theo trang/URL

Có 2 cách phổ biến để tổ chức một bộ automation test lớn:

- **Theo trang/URL** (`tests/pages/departments.spec.ts`, `tests/pages/positions.spec.ts`...) — dễ làm lúc đầu nhưng khi hệ thống lớn, một nghiệp vụ (ví dụ "tuyển dụng") trải qua nhiều trang (Jobs → Candidates → Applications → Interviews), test bị rải rác khó nhìn thấy bức tranh tổng.
- **Theo domain nghiệp vụ** (`tests/ats/`, `tests/referral/`, `tests/recruitment/`...) — nhóm test theo luồng nghiệp vụ thật, dù luồng đó đi qua nhiều trang/API khác nhau.

HR Tool chọn cách thứ hai. Phần dưới đây phân tích 2 domain thật: **ATS Pipeline** (`tests/ats/application-pipeline.spec.ts`) và **CTV Portal** (`tests/referral/ctv-portal.spec.ts`) để thấy rõ lợi ích của cách tổ chức này.

## 2. Case 1: ATS Pipeline — viết khung test trước, skip khi thiếu data

```ts
import { test, expect } from '../../fixtures/test-fixtures';
import { APPLICATION_STAGES } from '../../utils/test-data';

test.describe('SCRUM-118: Application Pipeline (ATS)', () => {
  test.describe('Application List Page', () => {
    test('TC-ATS-001: Hiển thị trang đơn ứng tuyển', async ({ applicationsPage }) => {
      await applicationsPage.goto();
      await expect(applicationsPage.pageTitle).toBeVisible();
      await expect(applicationsPage.createButton).toBeVisible();
    });
    // ...
  });

  test.describe('Stage Transitions', () => {
    // TODO: Implement when there's test data
    test.skip('TC-ATS-009: Chuyển từ Applied → Screening', async ({ page }) => {
      // Navigate to application detail
      // Change stage to screening
      // Verify stage changed
    });
    test.skip('TC-ATS-010: Chuyển từ Screening → Interview', async ({ page }) => { /* ... */ });
    test.skip('TC-ATS-011: Chuyển từ Interview → Offer', async ({ page }) => { /* ... */ });
    test.skip('TC-ATS-012: Chuyển từ Offer → Hired', async ({ page }) => { /* ... */ });
    test.skip('TC-ATS-013: Reject ứng viên từ bất kỳ giai đoạn', async ({ page }) => { /* ... */ });
  });
});
```

**Điều đáng học ở đây không phải là code chạy được, mà là code CHƯA chạy được:**

- Toàn bộ `test.describe` được tổ chức theo **luồng nghiệp vụ ATS thật**: List Page → Creation → Stage Transitions → Pipeline Stats — đúng thứ tự một application đi qua trong đời thực, không theo thứ tự trang trên menu.
- Các test dùng **custom fixture** (`applicationsPage`, `dashboardPage`) được inject sẵn thay vì tự tạo `new ApplicationsPage(page)` trong mỗi test — nhờ vậy test ngắn, tập trung vào logic nghiệp vụ, không lặp code khởi tạo.
- 5 test case về chuyển giai đoạn (Applied → Screening → Interview → Offer → Hired) được viết **có chủ đích với `test.skip()`** kèm comment `// TODO: Implement when there's test data` — đây KHÔNG phải bỏ quên, mà là kỹ thuật **"viết khung trước, skip khi thiếu điều kiện"**.

:::tip[Vì sao skip tốt hơn là không viết gì cả]
Nếu không viết test case này, không ai biết luồng "chuyển giai đoạn" chưa được tự động hoá test — nó biến mất khỏi tầm nhìn. Nhưng khi viết ra và `test.skip()`, mỗi lần chạy CI, báo cáo test sẽ hiện rõ **"5 skipped"** — đây là một tín hiệu nhìn thấy được, nhắc nhở team rằng còn nợ kỹ thuật ở đây, thay vì một dòng TODO ẩn trong code mà không ai đọc lại.
:::

## 3. Case 2: CTV Portal — storageState theo suite và dữ liệu unique

```ts
import { test, expect } from '../../fixtures/test-fixtures';

test.use({ storageState: 'apps/e2e/.auth/ctv.json' });

test.describe('CTV portal', () => {
  test('should submit a candidate via the job picker', async ({ page }) => {
    await page.goto('/ctv/submit');
    // ... chọn job trong dropdown

    // Unique candidate so the attribution engine doesn't reject as duplicate.
    const email = `ctv.e2e.${Date.now()}@seed.test`;
    await page.locator('input[name="fullName"]').fill('E2E CTV Candidate');
    await page.locator('input[name="email"]').fill(email);

    await page.getByRole('button', { name: 'Nộp', exact: true }).click();
    await expect(page.getByText('Đã nộp ứng viên').first()).toBeVisible({ timeout: 15000 });
  });

  test('should list my submissions', async ({ page }) => { /* ... */ });
  test('should list my commissions', async ({ page }) => { /* ... */ });
});
```

Hai điểm đáng chú ý:

**1. `test.use({ storageState: ... })` đặt ở đầu file, áp dụng cho CẢ SUITE** (khác với ví dụ ở bài trước, nơi 1 test riêng lẻ override storageState). Vì toàn bộ 3 test trong file này đều cần đăng nhập với vai trò CTV (cộng tác viên), khai báo 1 lần ở đầu `describe` tránh phải lặp lại ở từng test, và làm rõ ngay từ đầu file "toàn bộ suite này chạy dưới vai trò nào".

**2. Sinh email unique bằng `Date.now()`** — comment trong code giải thích rất rõ lý do: HR Tool có "attribution engine" (cơ chế phân định bản quyền hồ sơ theo nguyên tắc nộp trước — sở hữu trước), nếu 2 lần chạy test dùng cùng 1 email, lần chạy thứ 2 sẽ bị hệ thống từ chối vì coi là ứng viên trùng lặp — không phải vì test sai, mà vì đúng logic nghiệp vụ. Đây là ví dụ điển hình của nguyên tắc: **khi nghiệp vụ có cơ chế chống trùng lặp, test data cũng phải là dữ liệu duy nhất cho mỗi lần chạy**, nếu không test sẽ pass lần đầu rồi fail (hoặc pass sai lý do) ở các lần chạy sau.

:::caution[Rủi ro nếu không làm vậy]
Nếu hardcode email cố định trong test, lần chạy CI đầu tiên pass, nhưng lần chạy thứ 2 sẽ fail vì bị hệ thống chặn trùng — QC dễ nhầm tưởng đây là bug mới, mất thời gian điều tra một vấn đề thực chất là do thiết kế test data sai.
:::

## 4. Nguyên tắc chung áp dụng cho domain khác

Từ 2 case trên, rút ra các nguyên tắc tổ chức test suite theo domain, áp dụng được cho bất kỳ nghiệp vụ nào (CV Matching, Payroll, Onboarding...):

1. **Nhóm `test.describe` theo luồng nghiệp vụ thật**, không theo thứ tự trang trên UI — người đọc report phải hiểu ngay đây đang test cái gì trong đời thực.
2. **Dùng fixture chung** cho các page object/dữ liệu lặp lại nhiều lần trong domain đó, tránh lặp code khởi tạo.
3. **`test.skip()` có chủ đích + comment lý do**, khi biết rõ một nhánh nghiệp vụ chưa đủ điều kiện test (thiếu data, thiếu môi trường) — đừng để nó biến mất khỏi bộ test.
4. **`test.use({ storageState })` ở cấp file** khi cả suite chạy dưới 1 vai trò cố định, chỉ override ở cấp test khi cần vai trò khác cho riêng 1 test đó.
5. **Sinh dữ liệu test duy nhất (unique)** mỗi lần chạy, đặc biệt khi nghiệp vụ có ràng buộc unique/chống trùng lặp (email, mã số, slug...).

## Bài tập thực hành

1. Chọn 1 domain nghiệp vụ khác của HR Tool (ví dụ CV Matching hoặc Interview scheduling). Vẽ nhanh sơ đồ các `test.describe` con mà bạn sẽ tổ chức, theo đúng luồng nghiệp vụ thật.
2. Với 5 test case `test.skip()` ở ATS Pipeline, viết thử pseudo-code đầy đủ cho 1 trong số đó (ví dụ TC-ATS-009), giả sử bạn đã có test data cần thiết.
3. Giải thích bằng lời của bạn: vì sao dùng `Date.now()` để tạo email test tốt hơn dùng email cố định, trong bối cảnh HR Tool có "attribution engine".

## Bước tiếp theo

Tiếp theo: [Multi-role Auth & Permission Testing](../case-studies/03-multi-role-auth-permission/)

---

**Cần giúp đỡ?** Liên hệ QC Lead hoặc đăng trong #qc-team
