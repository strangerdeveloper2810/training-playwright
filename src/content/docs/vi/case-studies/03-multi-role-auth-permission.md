---
title: "Case Study: Test Multi-role Auth & Permission"
description: Phân tích cơ chế storageState theo role của hr-tool và cách thiết kế test cho hệ thống multi-tenant RBAC
---

# Case Study: Test Multi-role Auth & Permission

Tài liệu đào tạo QC - HR Tool

---

## Mục lục

1. [Bài toán: 1 hệ thống, nhiều vai trò, nhiều công ty](#1-bài-toán-1-hệ-thống-nhiều-vai-trò-nhiều-công-ty)
2. [3 file setup theo role của HR Tool](#2-3-file-setup-theo-role-của-hr-tool)
3. [Test permission thật: SCRUM-93](#3-test-permission-thật-scrum-93)
4. [Thiết kế permission matrix trước khi viết test](#4-thiết-kế-permission-matrix-trước-khi-viết-test)
5. [Đừng quên multi-tenant: phân quyền khác isolation dữ liệu](#5-đừng-quên-multi-tenant-phân-quyền-khác-isolation-dữ-liệu)

---

## 1. Bài toán: 1 hệ thống, nhiều vai trò, nhiều công ty

HR Tool có 2 lớp phân quyền chồng lên nhau, và automation test phải xử lý cả 2:

- **RBAC (Role-Based Access Control):** `super_admin`, `admin`, `hr`, `tech_lead` — mỗi role thấy/làm được những chức năng khác nhau.
- **Multi-tenant:** mỗi công ty (`companyId`) có dữ liệu tách biệt hoàn toàn — user của công ty A không được thấy dữ liệu công ty B, kể cả khi 2 user đó có cùng role.

Nếu test chỉ đăng nhập lại từ đầu cho mỗi test (điền form login, submit, chờ redirect...), một bộ test đầy đủ cho nhiều role sẽ rất chậm và lặp code. HR Tool giải quyết bằng cơ chế **`storageState` theo role**: đăng nhập 1 lần cho mỗi role, lưu lại session, các test sau chỉ "nạp lại" session đó.

## 2. 3 file setup theo role của HR Tool

**`tests/auth/auth.setup.ts`** — role mặc định (đọc credentials từ biến môi trường qua `loginWithEnv()`, không hardcode):

```ts
const authFile = 'apps/e2e/.auth/user.json';

setup('authenticate', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.loginWithEnv();
  await page.waitForTimeout(2000);
  await expect(page.locator('text=/xin chào/i').first()).toBeVisible({ timeout: 15000 });
  await page.context().storageState({ path: authFile });
});
```

**`tests/auth/ctv.setup.ts`** — role cộng tác viên (CTV):

```ts
const authFile = 'apps/e2e/.auth/ctv.json';

setup('authenticate ctv', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('[TEST_CTV_EMAIL]', '[TEST_CTV_PASSWORD]');
  await page.waitForURL(/\/ctv/, { timeout: 15000 });
  await page.context().storageState({ path: authFile });
});
```

**`tests/auth/hr-headhunt.setup.ts`** — role HR của công ty headhunt:

```ts
const authFile = 'apps/e2e/.auth/hr-headhunt.json';

setup('authenticate hr-headhunt', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('[TEST_HR_EMAIL]', '[TEST_HR_PASSWORD]');
  await page.waitForURL((url) => !url.pathname.startsWith('/login'), { timeout: 15000 });
  await page.context().storageState({ path: authFile });
});
```

:::caution[Không copy nguyên credential thật]
Code thật trong hr-tool có credential cụ thể thay cho `[TEST_CTV_EMAIL]`/`[TEST_HR_EMAIL]` ở trên. Đây là dữ liệu tài khoản test nội bộ — khi viết tài liệu, báo cáo, hay chia sẻ code mẫu, LUÔN thay bằng placeholder như trên, không copy-paste nguyên văn dù chỉ là tài khoản test.
:::

**3 điểm chung đáng học** giữa 3 file này:
1. Mỗi role có **1 file setup riêng, 1 file storageState riêng** (`user.json`, `ctv.json`, `hr-headhunt.json`) — không dùng chung 1 session cho nhiều role.
2. Mỗi file dùng **tín hiệu xác nhận đăng nhập khác nhau** phù hợp với nơi role đó "đáp xuống" sau khi login: role mặc định chờ chữ "xin chào", CTV chờ URL chứa `/ctv`, HR headhunt chờ URL **không còn** ở `/login`. Điều này cho thấy: phải hiểu đúng hành vi UI thật của từng role, không thể dùng 1 điều kiện chờ chung cho tất cả.
3. `playwright.config.ts` khai báo các setup này là **dependency project** — các test khác chỉ cần `test.use({ storageState: 'apps/e2e/.auth/ctv.json' })` để "vào vai" role đó, không cần biết chi tiết cách login.

## 3. Test permission thật: SCRUM-93

```ts
test('TC-SCRUM93-001: Admin can see add button on Departments', async ({ page }) => {
  await page.goto('/departments');
  await page.waitForLoadState('networkidle');
  const addButton = page.getByRole('button', { name: /thêm|add|tạo/i });
  await expect(addButton).toBeVisible();
});
```

Test này chạy dưới session mặc định (role Admin, qua `auth.setup.ts`), assert rằng Admin **thấy được** nút "Thêm" trên 3 trang Departments/Positions/Employees. Đây là **case tích cực (positive case)** của permission testing: role được phép → phải thấy/làm được.

## 4. Thiết kế permission matrix trước khi viết test

Bộ test SCRUM-93 mới chỉ cover 1/2 bức tranh. Một permission test đầy đủ cần **ma trận role × chức năng × hành động**, ví dụ:

| Chức năng | super_admin | admin | hr | tech_lead |
|---|:---:|:---:|:---:|:---:|
| Xem Departments | ✅ | ✅ | ✅ | ✅ |
| Thêm/Sửa Departments | ✅ | ✅ | ❌ | ❌ |
| Xem Employees | ✅ | ✅ | ✅ | ✅ |
| Sửa Employees | ✅ | ✅ | ✅ | ❌ |
| Quản lý Companies (Super Admin only) | ✅ | ❌ | ❌ | ❌ |

Với mỗi ô trong ma trận, cần **2 hướng test**:
- **Positive:** role được phép → hành động thành công / phần tử UI hiển thị.
- **Negative:** role không được phép → hành động bị chặn (403, hoặc UI không hiển thị nút đó) — **đây là phần SCRUM-93 hiện tại chưa có**, và là cơ hội tốt để bạn tự viết thêm (xem Bài tập thực hành).

:::tip[Vì sao negative case quan trọng không kém positive case]
Một lỗ hổng phân quyền nguy hiểm thường không phải "role được phép mà không làm được việc" (gây khó chịu nhưng không mất an toàn) — mà là **"role không được phép nhưng vẫn làm được"** (lộ dữ liệu, sửa được thứ không nên sửa). Negative case chính là test bắt được đúng loại lỗi nguy hiểm này.
:::

## 5. Đừng quên multi-tenant: phân quyền khác isolation dữ liệu

Ma trận ở mục 4 chỉ trả lời "role X có quyền làm Y không" — nhưng multi-tenant còn thêm 1 câu hỏi khác: **"user của công ty A có thấy được dữ liệu công ty B không, dù cùng role?"**. Đây là loại test khác — không phải RBAC mà là **data isolation** (cũng chính là nội dung IDOR đã nhắc ở bài `basics/11-security-testing-co-ban`). Một bộ test multi-tenant đầy đủ cần cả 2 lớp:

1. Role X trong công ty của mình có/không làm được việc Y (RBAC — nội dung bài này).
2. Role X không thể truy cập dữ liệu của công ty khác dù đổi ID trên URL/request (data isolation — bài `basics/11`).

## Bài tập thực hành

1. Vẽ đầy đủ permission matrix (như bảng ở mục 4) cho ít nhất 5 chức năng của HR Tool, dùng thông tin từ `basics/02-bug-report-template` (mục Role & Permission Matrix) làm tham khảo.
2. Viết pseudo-code cho 1 negative test case: role `tech_lead` **không** thấy nút "Thêm" trên trang Departments.
3. Giải thích vì sao 3 file setup dùng 3 tín hiệu chờ khác nhau (welcome text / URL `/ctv` / URL không phải `/login`) thay vì dùng chung 1 điều kiện.
4. Thiết kế (bằng lời) 1 test case data-isolation: user công ty A thử truy cập chi tiết 1 Candidate thuộc công ty B bằng cách đổi ID trên URL — kỳ vọng kết quả là gì?

## Bước tiếp theo

Bạn đã hoàn thành toàn bộ nhóm Case Studies. Quay lại [Automation Testing](../automation/01-vi-sao-automation-test-pyramid/) để ôn lại, hoặc xem [Best Practices & Cheatsheet](../automation/21-best-practices-cheatsheet/) để tổng hợp lại toàn bộ kiến thức automation.

---

**Cần giúp đỡ?** Liên hệ QC Lead hoặc đăng trong #qc-team
