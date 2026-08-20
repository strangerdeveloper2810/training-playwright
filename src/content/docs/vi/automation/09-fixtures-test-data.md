---
title: Fixtures & Test Data
description: Cách dùng custom fixtures của Playwright để tiêm sẵn Page Object vào test, và cách tổ chức test data
---

# Automation Testing - Fixtures & Test Data

Tài liệu đào tạo QC - HR Tool

## Mục lục

1. [Vấn đề: mỗi test đều phải tự `new` Page Object](#1-vấn-đề-mỗi-test-đều-phải-tự-new-page-object)
2. [Fixture là gì trong Playwright](#2-fixture-là-gì-trong-playwright)
3. [Ví dụ thật từ HR Tool: test-fixtures.ts](#3-ví-dụ-thật-từ-hr-tool-test-fixturests)
4. [Dùng fixture trong test](#4-dùng-fixture-trong-test)
5. [Test Data: hardcode vs data factory](#5-test-data-hardcode-vs-data-factory)
6. [Ví dụ thật: test-data.ts của HR Tool](#6-ví-dụ-thật-test-datats-của-hr-tool)
7. [Faker.js: khi cần dữ liệu ngẫu nhiên](#7-fakerjs-khi-cần-dữ-liệu-ngẫu-nhiên)
8. [Bài tập thực hành](#8-bài-tập-thực-hành)
9. [Bước tiếp theo](#9-bước-tiếp-theo)

---

## 1. Vấn đề: mỗi test đều phải tự `new` Page Object

Ở bài trước, ta đã có `CandidatesPage`. Nhưng nếu không có gì đặc biệt, mỗi test phải tự tạo instance:

```typescript
import { test } from '@playwright/test';
import { CandidatesPage } from '../pages/candidates.page';
import { JobsPage } from '../pages/jobs.page';

test('...', async ({ page }) => {
  const candidatesPage = new CandidatesPage(page);
  const jobsPage = new JobsPage(page);
  // lặp lại 2 dòng này ở MỌI test cần dùng candidatesPage/jobsPage
});
```

Việc này lặp đi lặp lại ở hàng trăm test. **Fixture** của Playwright giải quyết việc này: định nghĩa một lần, dùng ở mọi nơi.

## 2. Fixture là gì trong Playwright

Fixture là một "nguyên liệu" được Playwright **tự động chuẩn bị sẵn** trước khi test chạy, và **tự động dọn dẹp** sau khi test xong. Playwright có sẵn một số fixture cơ bản như `page`, `browser`, `context` — bạn đã dùng chúng dù không nhận ra:

```typescript
test('...', async ({ page }) => {
  // "page" chính là một fixture có sẵn của Playwright
});
```

**Custom fixture** là fixture do chính team tự định nghĩa thêm, dùng `test.extend()`. HR Tool dùng custom fixture để tự động tạo sẵn 6 Page Object, test chỉ cần "xin" đúng cái mình cần.

## 3. Ví dụ thật từ HR Tool: test-fixtures.ts

Đây là file `apps/e2e/fixtures/test-fixtures.ts` thật đang dùng:

```typescript
import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { DashboardPage } from '../pages/dashboard.page';
import { CandidatesPage } from '../pages/candidates.page';
import { JobsPage } from '../pages/jobs.page';
import { ApplicationsPage } from '../pages/applications.page';
import { InterviewsPage } from '../pages/interviews.page';

type HRToolFixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  candidatesPage: CandidatesPage;
  jobsPage: JobsPage;
  applicationsPage: ApplicationsPage;
  interviewsPage: InterviewsPage;
};

export const test = base.extend<HRToolFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },
  candidatesPage: async ({ page }, use) => {
    await use(new CandidatesPage(page));
  },
  jobsPage: async ({ page }, use) => {
    await use(new JobsPage(page));
  },
  applicationsPage: async ({ page }, use) => {
    await use(new ApplicationsPage(page));
  },
  interviewsPage: async ({ page }, use) => {
    await use(new InterviewsPage(page));
  },
});

export { expect };
```

Giải thích từng phần:

- `base.extend<HRToolFixtures>({...})`: "mở rộng" đối tượng `test` gốc của Playwright, thêm 6 fixture mới.
- `type HRToolFixtures`: khai báo kiểu dữ liệu cho từng fixture — nhờ vậy TypeScript sẽ gợi ý (autocomplete) và báo lỗi nếu bạn gõ sai tên.
- Mỗi fixture là một hàm `async ({ page }, use) => { await use(new XxxPage(page)); }`: Playwright gọi `page` fixture có sẵn trước, tạo `new XxxPage(page)`, rồi đưa cho test qua `use(...)`.
- File **export lại `test` và `expect`** — nghĩa là trong test file, bạn import từ file này thay vì từ `@playwright/test` trực tiếp.

## 4. Dùng fixture trong test

```typescript
import { test, expect } from '../../fixtures/test-fixtures';

test('Xem chi tiết ứng viên', async ({ candidatesPage }) => {
  await candidatesPage.goto();
  await candidatesPage.searchCandidate('Nguyễn Văn A');
  await candidatesPage.clickCandidate('Nguyễn Văn A');

  expect(await candidatesPage.getToastMessage()).toBeNull();
});

test('Tạo Job mới và kiểm tra danh sách', async ({ jobsPage, dashboardPage }) => {
  // Cần bao nhiêu Page Object, "xin" bấy nhiêu trong destructuring
  await jobsPage.goto();
  // ...
});
```

So sánh với cách viết thủ công ở mục 1: bạn không còn thấy `new CandidatesPage(page)` ở đâu nữa — Playwright tự tạo và đưa vào đúng lúc test cần, dựa theo tên bạn khai báo trong `{ candidatesPage }`.

:::tip[Playwright chỉ tạo fixture khi test thật sự dùng đến]
Nếu một test chỉ khai báo `{ page }` mà không khai báo `{ candidatesPage }`, Playwright **không** tốn công tạo `CandidatesPage` cho test đó. Fixture chỉ được khởi tạo "lazy" (khi cần), giúp test chạy nhanh hơn.
:::

## 5. Test Data: hardcode vs data factory

Bên cạnh Page Object, mỗi test cần **dữ liệu** để điền vào form, tìm kiếm, so sánh kết quả... Có 2 cách phổ biến để tổ chức test data:

| Cách | Mô tả | Ưu điểm | Nhược điểm |
|---|---|---|---|
| **Hardcode** | Định nghĩa sẵn các object/constant cố định (như HR Tool đang dùng) | Đơn giản, dễ đọc, dữ liệu ổn định giữa các lần chạy | Nếu 2 test chạy song song cùng tạo data trùng tên/email → có thể xung đột |
| **Data factory** | Viết hàm sinh dữ liệu mới mỗi lần gọi (thường kết hợp thư viện như `faker.js`) | Mỗi lần chạy dữ liệu khác nhau, tránh trùng lặp, test độc lập hơn | Kết quả không cố định, khó debug lại đúng dữ liệu đã dùng nếu không log lại |

## 6. Ví dụ thật: test-data.ts của HR Tool

HR Tool đang dùng cách **hardcode**. Cấu trúc thật của `apps/e2e/utils/test-data.ts` (đã thay giá trị thật bằng placeholder để không lộ thông tin đăng nhập thật):

```typescript
export const TEST_USERS = {
  hr: {
    email: process.env.TEST_USER_EMAIL || '[TEST_HR_EMAIL]',
    password: process.env.TEST_USER_PASSWORD || '[TEST_HR_PASSWORD]',
    role: 'hr',
  },
  admin: {
    email: process.env.TEST_USER_EMAIL || '[TEST_ADMIN_EMAIL]',
    password: process.env.TEST_USER_PASSWORD || '[TEST_ADMIN_PASSWORD]',
    role: 'admin',
  },
  techLead: {
    email: '[TEST_TECHLEAD_EMAIL]',
    password: '[TEST_TECHLEAD_PASSWORD]',
    role: 'tech_lead',
  },
};

export const SAMPLE_CV = {
  fullName: 'Nguyễn Văn Test',
  email: 'test.candidate@example.com',
  phone: '0901234567',
  skills: ['JavaScript', 'TypeScript', 'React', 'Node.js'],
  experience: '3 năm kinh nghiệm làm Frontend Developer',
};

export const APPLICATION_STAGES = {
  APPLIED: 'applied',
  SCREENING: 'screening',
  INTERVIEW: 'interview',
  OFFER: 'offer',
  HIRED: 'hired',
  REJECTED: 'rejected',
} as const;
```

:::caution[Vì sao credential lấy từ `process.env` trước, hardcode chỉ là fallback?]
`process.env.TEST_USER_EMAIL || '[TEST_HR_EMAIL]'` nghĩa là: **ưu tiên** lấy giá trị từ biến môi trường (được set riêng ở máy CI hoặc máy local qua file `.env`), chỉ dùng giá trị hardcode nếu biến môi trường không tồn tại. Đây là cách tránh commit credential thật lên git — nhưng team vẫn cần cẩn thận không để giá trị hardcode "phòng hờ" là một credential thật đang hoạt động.
:::

`APPLICATION_STAGES` dùng `as const` — một cú pháp TypeScript giúp các giá trị trong object trở thành "literal type" cố định (`'applied' | 'screening' | ...`) thay vì kiểu `string` chung, nhờ vậy nếu bạn gõ sai `'aplied'`, TypeScript báo lỗi ngay khi biên dịch.

## 7. Faker.js: khi cần dữ liệu ngẫu nhiên

Nếu một ngày team cần tạo hàng loạt Candidate/Job với dữ liệu khác nhau (ví dụ test performance, hoặc tránh trùng email khi test chạy song song), có thể dùng thư viện [`@faker-js/faker`](https://fakerjs.dev/):

```typescript
import { faker } from '@faker-js/faker';

function createRandomCandidate() {
  return {
    fullName: faker.person.fullName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
  };
}
```

Đây gọi là **data factory** — một hàm "sản xuất" dữ liệu test mới mỗi lần gọi, thay vì dùng lại đúng 1 bộ dữ liệu cố định.

## 8. Bài tập thực hành

1. Viết thêm 1 fixture `employeesPage` vào `HRToolFixtures` (giả sử đã có class `EmployeesPage`) — chỉ cần viết đúng cú pháp, không cần chạy thật.
2. Giải thích: nếu 2 file test cùng chạy song song và cùng dùng `TEST_USERS.admin` để login, điều gì có thể xảy ra? Đề xuất 1 cách để tránh vấn đề đó (gợi ý: liên hệ tới bài [Authentication & Storage State](./10-authentication-storage-state/)).
3. Viết 1 hàm `createRandomJob()` dùng `faker.js` (giả định) trả về object `{ title, skills, experience }` với dữ liệu ngẫu nhiên.
4. Theo bạn, `SAMPLE_CV` và `SAMPLE_JD` trong `test-data.ts` nên tiếp tục hardcode, hay chuyển sang data factory? Giải thích lý do dựa trên bảng so sánh ở mục 5.
5. Tìm trong đoạn code `test-fixtures.ts` ở mục 3: nếu bạn thêm 1 fixture mới nhưng quên thêm vào `type HRToolFixtures`, điều gì sẽ xảy ra khi biên dịch TypeScript?

## 9. Bước tiếp theo

1. Tiếp tục với [Authentication & Storage State](./10-authentication-storage-state/) — cách tránh phải login lại ở mỗi test.
2. Xem lại [Page Object Model](./08-page-object-model/) nếu chưa rõ vì sao cần Page Object trước khi có fixture.

---

**Cần giúp đỡ?** Liên hệ QC Lead hoặc đăng trong #qc-team.
