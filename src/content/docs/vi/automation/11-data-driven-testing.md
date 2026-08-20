---
title: Data-driven Testing
description: Cách viết một đoạn test chạy được với nhiều bộ dữ liệu khác nhau, tránh lặp code
---

# Automation Testing - Data-driven Testing

Tài liệu đào tạo QC - HR Tool

## Mục lục

1. [Vấn đề: copy-paste test chỉ vì đổi input](#1-vấn-đề-copy-paste-test-chỉ-vì-đổi-input)
2. [Data-driven testing là gì](#2-data-driven-testing-là-gì)
3. [Cách làm: loop qua mảng dữ liệu](#3-cách-làm-loop-qua-mảng-dữ-liệu)
4. [Ví dụ áp dụng: validate form Tạo Job](#4-ví-dụ-áp-dụng-validate-form-tạo-job)
5. [Ví dụ áp dụng: test theo nhiều role](#5-ví-dụ-áp-dụng-test-theo-nhiều-role)
6. [Đặt tên test rõ ràng khi data-driven](#6-đặt-tên-test-rõ-ràng-khi-data-driven)
7. [Khi nào KHÔNG nên data-driven](#7-khi-nào-không-nên-data-driven)
8. [Bài tập thực hành](#8-bài-tập-thực-hành)
9. [Bước tiếp theo](#9-bước-tiếp-theo)

---

## 1. Vấn đề: copy-paste test chỉ vì đổi input

Giả sử bạn cần test validate ô "Lương tối thiểu" trong form tạo Job với nhiều input khác nhau: số âm, chữ, để trống, số quá lớn... Nếu viết riêng từng test:

```typescript
test('Lương âm bị báo lỗi', async ({ page }) => { /* ... */ });
test('Lương là chữ bị báo lỗi', async ({ page }) => { /* ... */ });
test('Lương để trống bị báo lỗi', async ({ page }) => { /* ... */ });
test('Lương quá lớn bị báo lỗi', async ({ page }) => { /* ... */ });
```

4 test này giống nhau 95%, chỉ khác **giá trị input** và **thông báo lỗi mong đợi**. Đây chính là dấu hiệu cần **data-driven testing**.

## 2. Data-driven testing là gì

Data-driven testing (test theo dữ liệu) là kỹ thuật viết **một đoạn logic test duy nhất**, sau đó cho nó chạy lặp lại với **nhiều bộ dữ liệu khác nhau**. Mỗi bộ dữ liệu tạo ra một test case riêng biệt (có tên riêng, pass/fail độc lập), nhưng code chỉ viết một lần.

:::note[Không phải khái niệm riêng của Playwright]
Data-driven testing là một kỹ thuật thiết kế test case tổng quát (đã nhắc ở bài [Kỹ thuật thiết kế Test Case](../basics/05-test-design-techniques/) qua Equivalence Partitioning, Boundary Value Analysis). Ở bài này, ta học cách **triển khai kỹ thuật đó bằng code** trong Playwright.
:::

## 3. Cách làm: loop qua mảng dữ liệu

Ý tưởng cơ bản: định nghĩa một mảng các bộ dữ liệu, rồi dùng vòng `for` thông thường của JavaScript để tạo nhiều `test(...)`:

```typescript
import { test, expect } from '@playwright/test';

const invalidSalaries = [
  { input: '-1000', expectedError: /lương phải lớn hơn 0/i },
  { input: 'abc', expectedError: /lương phải là số/i },
  { input: '', expectedError: /vui lòng nhập lương/i },
];

for (const { input, expectedError } of invalidSalaries) {
  test(`Lương tối thiểu không hợp lệ: "${input}"`, async ({ page }) => {
    await page.goto('/jobs/new');
    await page.getByLabel(/lương tối thiểu/i).fill(input);
    await page.getByRole('button', { name: /lưu/i }).click();

    await expect(page.getByText(expectedError)).toBeVisible();
  });
}
```

Điều quan trọng: vòng `for` này chạy ở **thời điểm Playwright đang thu thập danh sách test** (trước khi bất kỳ test nào thực sự chạy), không phải chạy bên trong một `test()`. Kết quả là Playwright sẽ thấy **3 test case riêng biệt**, mỗi test có tên khác nhau, hiển thị pass/fail độc lập trong report — không phải 1 test chạy 3 vòng lặp bên trong.

## 4. Ví dụ áp dụng: validate form Tạo Job

Áp dụng đầy đủ cho ví dụ ở mục 1, kết hợp với Page Object (xem bài [Page Object Model](./08-page-object-model/)):

```typescript
import { test, expect } from '../../fixtures/test-fixtures';

const salaryTestCases = [
  { case: 'số âm', value: '-1000', error: /lương phải lớn hơn 0/i },
  { case: 'chữ', value: 'abc', error: /lương phải là số/i },
  { case: 'để trống', value: '', error: /vui lòng nhập lương/i },
  { case: 'quá lớn', value: '999999999999', error: /lương không hợp lệ/i },
];

test.describe('Validate lương tối thiểu khi tạo Job', () => {
  for (const { case: caseName, value, error } of salaryTestCases) {
    test(`Trường hợp: ${caseName}`, async ({ jobsPage }) => {
      await jobsPage.goto();
      await jobsPage.openCreateForm();
      await jobsPage.fillSalaryMin(value); // giả định method này tồn tại trên JobsPage
      await jobsPage.submitForm();

      await expect(jobsPage.page.getByText(error)).toBeVisible();
    });
  }
});
```

Report chạy test sẽ hiển thị:

```
Validate lương tối thiểu khi tạo Job
  ✓ Trường hợp: số âm
  ✓ Trường hợp: chữ
  ✓ Trường hợp: để trống
  ✗ Trường hợp: quá lớn   ← nếu fail, biết NGAY là trường hợp nào
```

## 5. Ví dụ áp dụng: test theo nhiều role

Data-driven cũng rất hữu ích khi test cùng một hành vi nhưng cho **nhiều role khác nhau** (liên hệ bài [Authentication & Storage State](./10-authentication-storage-state/)):

```typescript
const roleStorageStates = [
  { role: 'admin', storageState: 'apps/e2e/.auth/user.json', canDelete: true },
  { role: 'ctv', storageState: 'apps/e2e/.auth/ctv.json', canDelete: false },
];

for (const { role, storageState, canDelete } of roleStorageStates) {
  test.describe(`Quyền xoá Job - role ${role}`, () => {
    test.use({ storageState });

    test(`${role} ${canDelete ? 'CÓ' : 'KHÔNG'} thấy nút xoá Job`, async ({ jobsPage }) => {
      await jobsPage.goto();
      const deleteButtonVisible = await jobsPage.deleteButton.isVisible().catch(() => false);
      expect(deleteButtonVisible).toBe(canDelete);
    });
  });
}
```

Một đoạn code duy nhất, nhưng verify được đúng ma trận phân quyền cho cả 2 role.

## 6. Đặt tên test rõ ràng khi data-driven

:::caution[Lỗi thường gặp: tên test giống nhau]
Nếu bạn viết `test('Validate lương', ...)` giống nhau cho cả 4 bộ dữ liệu, report sẽ hiển thị 4 dòng **y hệt nhau** — không biết trường hợp nào fail. Luôn đưa **giá trị hoặc mô tả của bộ dữ liệu đó vào tên test**, như ví dụ ở mục 3-4 (`Lương tối thiểu không hợp lệ: "${input}"`).
:::

## 7. Khi nào KHÔNG nên data-driven

Data-driven testing không phải lúc nào cũng là lựa chọn tốt nhất:

| Nên dùng khi | Không nên dùng khi |
|---|---|
| Cùng 1 luồng hành động, chỉ khác input/kết quả mong đợi | Mỗi trường hợp có **luồng hành động khác nhau hẳn** (ví dụ 1 case cần thêm bước điều hướng riêng) |
| Số lượng bộ dữ liệu nhiều (5+), viết riêng sẽ rất dài dòng | Chỉ có 2-3 trường hợp, viết riêng vẫn rõ ràng và dễ đọc hơn |
| Muốn dễ dàng thêm bộ dữ liệu mới (chỉ cần thêm 1 dòng vào mảng) | Bộ dữ liệu cần setup phức tạp, khác nhau nhiều giữa các case |

## 8. Bài tập thực hành

1. Viết thêm 1 bộ dữ liệu vào `salaryTestCases` ở mục 4 cho trường hợp "lương tối thiểu lớn hơn lương tối đa" — input và error message do bạn tự đặt hợp lý.
2. Giải thích bằng lời: vì sao vòng `for` để tạo nhiều `test()` phải nằm **ngoài** hàm test, không được viết vòng `for` **bên trong** một `test()` duy nhất?
3. Áp dụng data-driven cho tình huống: test tìm kiếm Candidates với 3 từ khoá khác nhau (có kết quả, không có kết quả, có ký tự đặc biệt) — viết code mẫu.
4. Theo bảng ở mục 7, tình huống "test login với 3 role khác nhau, mỗi role redirect tới 1 trang dashboard khác nhau" có nên data-driven không? Giải thích.
5. Sửa lại đoạn code ở mục 5 để thêm role thứ 3 `hr-headhunt` với `canDelete: false`.

## 9. Bước tiếp theo

1. Nhóm bài về "core skills" của Automation testing đến đây tạm dừng — tiếp tục với các bài chuyên sâu hơn: Visual Regression, Cross-browser & Parallel Execution, Mobile Web Testing.
2. Ôn lại [Fixtures & Test Data](./09-fixtures-test-data/) và [Authentication & Storage State](./10-authentication-storage-state/) nếu các ví dụ ở mục 4-5 chưa rõ.

---

**Cần giúp đỡ?** Liên hệ QC Lead hoặc đăng trong #qc-team.
