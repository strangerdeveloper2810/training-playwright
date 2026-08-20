---
title: Page Object Model
description: Cách tổ chức code automation test theo Page Object Model để dễ đọc, dễ bảo trì và tái sử dụng
---

# Automation Testing - Page Object Model

Tài liệu đào tạo QC - HR Tool

## Mục lục

1. [Vấn đề: viết test không có cấu trúc](#1-vấn-đề-viết-test-không-có-cấu-trúc)
2. [Page Object Model là gì](#2-page-object-model-là-gì)
3. [Cấu trúc: Base Page và Page con](#3-cấu-trúc-base-page-và-page-con)
4. [Ví dụ thật từ HR Tool: BasePage](#4-ví-dụ-thật-từ-hr-tool-basepage)
5. [Ví dụ thật từ HR Tool: CandidatesPage](#5-ví-dụ-thật-từ-hr-tool-candidatespage)
6. [Nguyên tắc viết Page Object tốt](#6-nguyên-tắc-viết-page-object-tốt)
7. [Dùng template có sẵn để tạo Page Object mới](#7-dùng-template-có-sẵn-để-tạo-page-object-mới)
8. [Lỗi thường gặp](#8-lỗi-thường-gặp)
9. [Bài tập thực hành](#9-bài-tập-thực-hành)
10. [Bước tiếp theo](#10-bước-tiếp-theo)

---

## 1. Vấn đề: viết test không có cấu trúc

Hãy tưởng tượng bạn viết 20 test case cho trang **Candidates** (Ứng viên), và mỗi test đều có đoạn code kiểu:

```typescript
await page.locator('h1').filter({ hasText: /ứng viên/i });
await page.getByRole('button', { name: /tải cv/i }).click();
```

Nếu một ngày dev đổi text button từ "Tải CV" thành "Upload CV", bạn phải sửa lại **20 chỗ** trong 20 file test khác nhau. Đây chính là vấn đề mà **Page Object Model (POM)** giải quyết.

:::note[Ý tưởng cốt lõi]
Thay vì viết locator và hành động trực tiếp trong từng test, ta gom chúng vào một **class** đại diện cho một trang màn hình. Test chỉ gọi method của class đó — không cần biết chi tiết locator nằm ở đâu.
:::

## 2. Page Object Model là gì

Page Object Model là một **design pattern** (mẫu thiết kế code), trong đó mỗi trang (hoặc mỗi khu vực quan trọng của UI) được đại diện bởi một class riêng, gọi là **Page Object**. Class này chứa:

- **Locators**: nơi định nghĩa cách tìm các element trên trang (button, input, table...).
- **Actions**: các method thực hiện hành động trên trang (click, điền form, tìm kiếm...).

Lợi ích:

| Lợi ích | Giải thích |
|---|---|
| **Dễ bảo trì** | UI đổi (đổi text, đổi class CSS) → chỉ sửa 1 chỗ trong Page Object, không phải sửa từng test |
| **Tái sử dụng** | Nhiều test cùng dùng lại các method như `goto()`, `search()` |
| **Dễ đọc** | Test đọc như một câu chuyện: `candidatesPage.goto()` → `candidatesPage.search('Nguyễn')` — không lẫn locator kỹ thuật |
| **Tách biệt trách nhiệm** | Page Object lo "làm sao tương tác với UI", test lo "kiểm tra kết quả đúng hay sai" |

## 3. Cấu trúc: Base Page và Page con

HR Tool tổ chức Page Object theo mô hình **kế thừa (inheritance)**:

```
BasePage (abstract class)
   │  chứa locator & method DÙNG CHUNG cho mọi trang
   │  (sidebar, search, loading spinner, toast message...)
   │
   ├── LoginPage       extends BasePage
   ├── DashboardPage   extends BasePage
   ├── CandidatesPage  extends BasePage
   ├── JobsPage        extends BasePage
   ├── ApplicationsPage extends BasePage
   └── InterviewsPage  extends BasePage
```

`BasePage` không đại diện cho một trang cụ thể nào — nó là nơi gom những thứ **trang nào cũng có** (sidebar điều hướng, thanh tìm kiếm, spinner loading, toast thông báo). Mỗi page con kế thừa `BasePage` và chỉ cần định nghĩa thêm những gì **riêng của trang đó**.

## 4. Ví dụ thật từ HR Tool: BasePage

Đây là `BasePage` thật đang dùng trong bộ automation test của HR Tool (`apps/e2e/pages/base.page.ts`):

```typescript
import type { Page, Locator } from '@playwright/test';

export abstract class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Locator dùng chung
  get sidebar(): Locator {
    return this.page.locator('nav, aside').first();
  }

  get searchInput(): Locator {
    return this.page
      .locator('main input[type="text"], .content input[type="text"]')
      .first();
  }

  get loadingSpinner(): Locator {
    return this.page.locator('[data-testid="loading"], .loading, .spinner');
  }

  // Action dùng chung
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  async waitForLoading(): Promise<void> {
    const spinner = this.loadingSpinner;
    if (await spinner.isVisible()) {
      await spinner.waitFor({ state: 'hidden', timeout: 30000 });
    }
  }

  async navigateTo(path: string): Promise<void> {
    await this.page.goto(path);
    await this.waitForPageLoad();
  }

  async search(query: string): Promise<void> {
    await this.searchInput.fill(query);
    await this.page.keyboard.press('Enter');
    await this.waitForLoading();
  }

  async getToastMessage(): Promise<string | null> {
    const toast = this.page.locator('[role="alert"], .toast, .notification');
    if (await toast.isVisible()) {
      return toast.textContent();
    }
    return null;
  }
}
```

Vài điểm đáng chú ý:

- `abstract class` nghĩa là bạn **không thể** viết `new BasePage(page)` trực tiếp — nó chỉ tồn tại để các class khác kế thừa.
- Các locator được viết dưới dạng `get sidebar()` (getter) — nghĩa là mỗi lần gọi `this.sidebar`, Playwright tìm lại element mới nhất trên trang, tránh lỗi "locator đã cũ" (stale) khi trang thay đổi.
- `waitForLoading()` chờ **spinner biến mất** trước khi tiếp tục — rất quan trọng để tránh test chạy quá nhanh, click vào element khi trang chưa load xong.

## 5. Ví dụ thật từ HR Tool: CandidatesPage

Đây là `CandidatesPage`, kế thừa `BasePage` (`apps/e2e/pages/candidates.page.ts`):

```typescript
import type { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class CandidatesPage extends BasePage {
  readonly pageTitle: Locator;
  readonly uploadCVButton: Locator;
  readonly candidateTable: Locator;
  readonly statusFilter: Locator;
  readonly emptyState: Locator;

  constructor(page: Page) {
    super(page); // gọi constructor của BasePage
    this.pageTitle = page.locator('h1').filter({ hasText: /ứng viên/i });
    this.uploadCVButton = page.getByRole('button', { name: /tải cv/i });
    this.candidateTable = page.locator('table, [data-testid="candidate-table"]');
    this.statusFilter = page.locator('select, [data-testid="status-filter"]').first();
    this.emptyState = page
      .locator('[data-testid="empty-state"]')
      .or(page.getByText(/chưa có ứng viên/i));
  }

  async goto(): Promise<void> {
    await this.navigateTo('/candidates'); // navigateTo() kế thừa từ BasePage
  }

  async clickUploadCV(): Promise<void> {
    await this.uploadCVButton.click();
  }

  async filterByStatus(status: string): Promise<void> {
    await this.statusFilter.selectOption({ label: status });
    await this.waitForLoading();
  }

  async getCandidateCount(): Promise<number> {
    if (await this.emptyState.isVisible()) {
      return 0;
    }
    const rows = this.candidateTable.locator('tbody tr');
    return rows.count();
  }
}
```

Nhờ vậy, một test case sẽ trông rất gọn:

```typescript
test('Filter ứng viên theo trạng thái "Đã duyệt"', async ({ candidatesPage }) => {
  await candidatesPage.goto();
  await candidatesPage.filterByStatus('Đã duyệt');

  expect(await candidatesPage.getCandidateCount()).toBeGreaterThan(0);
});
```

Không có một dòng locator kỹ thuật nào lộ ra trong test — tất cả nằm trong `CandidatesPage`.

:::tip[Vì sao constructor gọi `super(page)`?]
`super(page)` gọi constructor của class cha (`BasePage`) để gán `this.page = page`. Nếu quên gọi `super(page)`, TypeScript sẽ báo lỗi ngay khi biên dịch — đây là một ràng buộc bắt buộc của kế thừa trong TypeScript/JavaScript.
:::

## 6. Nguyên tắc viết Page Object tốt

| Nên | Không nên |
|---|---|
| Đặt locator + action trong Page Object | Đặt `expect(...)` (assertion) trong Page Object |
| Method trả về dữ liệu (`getCandidateCount()`) để test tự assert | Page Object tự quyết định test pass/fail |
| Ưu tiên `getByRole`, `getByLabel`, `getByText` (xem bài [Locators & Selectors](./05-locators-selectors/)) | Lạm dụng CSS selector dài dòng, dễ vỡ khi đổi class CSS |
| Đặt tên method theo hành động nghiệp vụ (`filterByStatus`, `clickUploadCV`) | Đặt tên method mơ tả kỹ thuật (`clickButton2`, `fillInput1`) |
| Mỗi Page Object chỉ lo 1 trang/1 khu vực | Nhồi tất cả các trang vào 1 class khổng lồ |

:::caution[Vì sao không nên assertion trong Page Object?]
Nếu `CandidatesPage` tự viết `expect(count).toBeGreaterThan(0)` bên trong, Page Object đó chỉ dùng được cho đúng 1 tình huống. Nhưng nếu method chỉ **trả về dữ liệu** (`getCandidateCount()`), nó có thể dùng lại cho nhiều test khác nhau với nhiều assertion khác nhau (`toBe(0)`, `toBeGreaterThan(5)`, `toEqual(...)`).
:::

## 7. Dùng template có sẵn để tạo Page Object mới

HR Tool có sẵn file mẫu `apps/e2e/templates/page-object.template.ts` để bạn copy khi cần tạo Page Object cho một tính năng mới (ví dụ `employees.page.ts`). File mẫu đã có sẵn các nhóm locator phổ biến (page title, action buttons, table, search & filter, form modal, confirm dialog, toast) và các method dùng chung (`search`, `openCreateForm`, `getRowCount`, `openDeleteConfirm`...). Quy trình tạo Page Object mới:

1. Copy `page-object.template.ts` → đổi tên thành `[feature-name].page.ts`.
2. Thay `[FeatureName]` bằng tên tính năng (PascalCase, ví dụ `Employees`).
3. Thay `[feature-url]` bằng URL thật của trang (ví dụ `/employees`).
4. Xoá các locator/method không dùng tới, thêm locator/method riêng của tính năng đó.
5. Đăng ký Page Object mới vào `fixtures/test-fixtures.ts` (xem bài [Fixtures & Test Data](./09-fixtures-test-data/)) để test có thể dùng ngay qua fixture.

## 8. Lỗi thường gặp

- **Quên `extends BasePage`**: Page Object mới không có sẵn `navigateTo`, `waitForLoading`... phải viết lại từ đầu.
- **Định nghĩa locator bằng `readonly x = page.locator(...)` thay vì `get x()`**: locator bị "chụp" một lần tại thời điểm tạo object, có thể lỗi nếu DOM thay đổi sau đó (tuỳ trường hợp; với hầu hết Page Object trong HR Tool, cả hai cách đều dùng được vì `Locator` của Playwright vốn đã lazy — nhưng nên nhất quán theo convention của team).
- **Viết assertion (`expect`) ngay trong Page Object** — vi phạm nguyên tắc ở mục 6.
- **Một method làm quá nhiều việc** (vừa điền form, vừa submit, vừa verify luôn) khiến test khó tái sử dụng từng bước riêng lẻ.

## 9. Bài tập thực hành

1. Đọc lại `JobsPage` (tương tự `CandidatesPage` nhưng cho trang Jobs) và liệt kê: nó có bao nhiêu locator riêng, bao nhiêu method riêng, method nào được kế thừa từ `BasePage`.
2. Giả sử trang Candidates thêm nút "Xuất Excel" (`Export Excel`). Viết thêm 1 locator và 1 method `clickExportExcel()` vào `CandidatesPage` (chỉ cần viết code, không cần chạy thật).
3. Giải thích bằng lời của bạn: vì sao `filterByStatus()` gọi `waitForLoading()` ở cuối mà không gọi ở đầu?
4. Copy `page-object.template.ts`, thử điền thử cho một tính năng giả định "Departments" (`/departments`) — chỉ cần điền `[FeatureName]` và `[feature-url]`, không cần chạy test thật.
5. Theo bạn, nếu 2 trang khác nhau đều có chung một "bảng danh sách + filter + search", có nên tạo thêm 1 class trung gian (ví dụ `ListPage extends BasePage`) để cả `CandidatesPage` và `JobsPage` cùng kế thừa? Nêu 1 lý do ủng hộ và 1 lý do phản đối.

## 10. Bước tiếp theo

1. Tiếp tục với [Fixtures & Test Data](./09-fixtures-test-data/) — cách "tiêm" sẵn các Page Object vào test mà không cần tự `new` từng cái.
2. Xem lại [Locators & Selectors](./05-locators-selectors/) nếu chưa nắm chắc cách chọn locator tốt.

---

**Cần giúp đỡ?** Liên hệ QC Lead hoặc đăng trong #qc-team.
