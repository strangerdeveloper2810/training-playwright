---
title: "Case Study: Viết Regression Test từ Bug đã fix"
description: Phân tích 4 bug thật của HR Tool và cách viết automation test để khoá bug lại, không cho tái diễn
---

# Case Study: Viết Regression Test từ Bug đã fix

Tài liệu đào tạo QC - HR Tool

---

## Mục lục

1. [Vì sao bug đã fix vẫn cần một test riêng](#1-vì-sao-bug-đã-fix-vẫn-cần-một-test-riêng)
2. [SCRUM-72: Double password hashing](#2-scrum-72-double-password-hashing)
3. [SCRUM-93: Permission check không nhất quán](#3-scrum-93-permission-check-không-nhất-quán)
4. [SCRUM-94: Filter không reset pagination](#4-scrum-94-filter-không-reset-pagination)
5. [SCRUM-102: Stale closure khi upload nhiều file](#5-scrum-102-stale-closure-khi-upload-nhiều-file)
6. [Quy trình chung: từ bug fix đến regression test](#6-quy-trình-chung-từ-bug-fix-đến-regression-test)

---

## 1. Vì sao bug đã fix vẫn cần một test riêng

Một bug được dev fix xong, QC verify lại thấy đúng, ticket được đóng — nhưng nếu không có test tự động nào "khoá" lại hành vi đúng đó, thì 3 tháng sau, một thay đổi code hoàn toàn không liên quan có thể vô tình làm bug đó **sống lại** (gọi là *regression*). Đây là lý do vì sao một quy trình automation testing trưởng thành luôn có bước: **mỗi bug quan trọng được fix → viết ít nhất 1 test case tái hiện đúng điều kiện gây bug đó**.

HR Tool áp dụng đúng nguyên tắc này: các test regression được đặt trong `tests/bugfixes/`, đặt tên theo mã ticket JIRA (`scrum-72-*.spec.ts`) để bất kỳ ai đọc report test fail cũng biết ngay đây là bug nào, đọc lại ticket nào. Phần dưới đây phân tích 4 bug thật, so sánh bug gốc với cách test được viết, và chỉ ra cả những chỗ test **chưa hoàn hảo** — vì đọc hiểu giới hạn của một test cũng quan trọng như đọc hiểu điểm mạnh của nó.

:::tip[Đọc trước khi tiếp tục]
Đây là bài phân tích thực tế (case study), không phải hướng dẫn từng bước. Mục tiêu là giúp bạn **đọc hiểu tư duy** đằng sau một regression test, để khi gặp bug mới trong công việc thật, bạn biết nên viết test như thế nào.
:::

## 2. SCRUM-72: Double password hashing

**Bug gốc:** Password của user bị hash **2 lần** — một lần hash thủ công trong code, một lần nữa tự động qua hook `@BeforeInsert` của TypeORM. Hậu quả: user mới tạo không đăng nhập được, vì password lưu trong DB không khớp với password gốc user đã nhập (đã bị hash chồng lên).

**Test được viết** (`tests/bugfixes/scrum-72-password-hashing.spec.ts`):

```ts
test.describe('SCRUM-72: Password Hashing Fix', () => {
  test.use({ storageState: { cookies: [], origins: [] } }); // Clear auth

  test('TC-SCRUM72-001: User can login with correct credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(TEST_USERS.admin.email, TEST_USERS.admin.password);
    await expect(page).not.toHaveURL(/login/, { timeout: 10000 });
  });

  test('TC-SCRUM72-002: Login fails with wrong password', async ({ page }) => {
    // ...login với password sai, kỳ vọng vẫn ở lại trang login
  });

  test('TC-SCRUM72-003: Login form validates password length', async ({ page }) => {
    // ...password 7 ký tự, kỳ vọng bị chặn validate
  });
});
```

**Vì sao viết đúng 3 test này:** bug gốc chỉ ảnh hưởng đến **luồng login đúng** (case 001), nhưng nếu chỉ test case đó thì chưa chắc chắn — test có thể "pass giả" nếu hệ thống chấp nhận mọi password. Vì vậy 2 test còn lại đóng vai trò **đối chứng**: case 002 đảm bảo hệ thống vẫn từ chối password sai (không bị fix quá tay thành "chấp nhận mọi password"), case 003 đảm bảo validate độ dài password không bị ảnh hưởng bởi thay đổi logic hash. Ba test tạo thành một **tam giác kiểm chứng**: đúng thì qua, sai thì chặn, và các luật liên quan khác không bị vỡ theo.

Lưu ý dòng `test.use({ storageState: { cookies: [], origins: [] } })` — vì đây là test luồng *login*, phải xoá session đã lưu sẵn (từ `auth.setup.ts`) để test thực sự đi qua form login, không bị mất tác dụng vì đã đăng nhập từ trước.

## 3. SCRUM-93: Permission check không nhất quán

**Bug gốc:** Một số trang kiểm tra quyền bằng cách hardcode `if (role === 'admin')`, trong khi phần còn lại của hệ thống dùng hàm chung `hasPermission()`. Hai cách kiểm tra không đồng bộ khiến hành vi phân quyền không nhất quán giữa các trang.

**Test được viết:** kiểm tra rằng Admin **thấy được** nút "Thêm" trên 3 trang Departments, Positions, Employees, và các trang này load không lỗi.

```ts
test('TC-SCRUM93-001: Admin can see add button on Departments', async ({ page }) => {
  await page.goto('/departments');
  await page.waitForLoadState('networkidle');
  const addButton = page.getByRole('button', { name: /thêm|add|tạo/i });
  await expect(addButton).toBeVisible();
});
```

**Điểm đáng học:** bug gốc là vấn đề **implementation** (2 cách check quyền khác nhau), nhưng test không hề assert vào implementation — nó assert vào **hành vi người dùng quan sát được** (nút Thêm có hiển thị hay không). Đây là nguyên tắc quan trọng: dù sau này dev đổi cách implement permission check (thay `hasPermission()` bằng cơ chế khác), test này vẫn còn đúng, vẫn còn giá trị bảo vệ — vì nó không phụ thuộc vào "cách làm", chỉ phụ thuộc vào "kết quả cuối cùng".

:::caution[Giới hạn của bộ test này]
Test chỉ verify **Admin thấy được** nút — chưa có test verify role **không có quyền** (ví dụ Tech Lead) thì **không thấy** nút đó. Một bộ regression đầy đủ cho bug về phân quyền nên test cả 2 chiều: role được phép (positive) và role không được phép (negative). Đây là một bài tập tốt để tự mở rộng — xem phần Bài tập thực hành.
:::

## 4. SCRUM-94: Filter không reset pagination

**Bug gốc:** Khi user đang xem trang 5 của danh sách, rồi đổi filter (ví dụ đổi stage trong ATS pipeline), số trang hiện tại **không được reset về trang 1**. Nếu kết quả sau khi filter chỉ có 2 trang, user sẽ thấy màn hình trống (đang đứng ở trang 5 nhưng dữ liệu chỉ có 2 trang) và tưởng là hệ thống lỗi/hết dữ liệu.

**Test được viết:** kiểm tra các trang (Applications, Interviews, Positions, Employees) có filter dropdown, và việc đổi filter có kích hoạt load lại dữ liệu (`waitForLoadState('networkidle')` sau khi click chọn option).

```ts
test('TC-SCRUM94-005: Filter change triggers data refresh', async ({ page }) => {
  await page.goto('/applications');
  await page.waitForLoadState('networkidle');
  const stageFilter = page.locator('[role="combobox"]').first();
  if (await stageFilter.isVisible()) {
    await stageFilter.click();
    const option = page.locator('[role="option"]').first();
    if (await option.isVisible()) {
      await option.click();
      await page.waitForLoadState('networkidle');
    }
  }
});
```

:::caution[Đây là một ví dụ về regression test chưa hoàn chỉnh]
Đọc kỹ sẽ thấy: test này chỉ xác nhận filter **có tồn tại** và đổi filter **có gây load lại**, chứ **không hề assert cụ thể rằng số trang đã reset về 1**. Đây không phải test bug SCRUM-94 một cách chặt chẽ — nó gần với *smoke test* hơn là *regression test* thật sự cho đúng bug đó. Một test chặt chẽ hơn nên: điều hướng đến trang 3-4 trước, đổi filter, rồi assert rõ ràng "đang ở trang 1" hoặc "URL/state param page=1". Việc nhận ra một test "trông có vẻ đúng chủ đề" nhưng chưa thực sự khoá được bug gốc là một kỹ năng review quan trọng của QC.
:::

## 5. SCRUM-102: Stale closure khi upload nhiều file

**Bug gốc:** Component `FileUploadZone` dùng closure (hàm đóng) trong callback `processFiles`, khiến khi user chọn nhiều file cùng lúc để upload, chỉ file **cuối cùng** được thêm vào danh sách — các file trước bị mất do closure giữ giá trị cũ (stale).

**Test được viết:** kiểm tra trang CV Matching load được, dialog tạo session mở được, và khu vực upload file (hoặc nút thêm file) hiển thị.

**Điểm đáng học — khoảng trống coverage:** bug gốc là về **upload nhiều file cùng lúc**, nhưng bộ test hiện tại chưa có test nào thực sự chọn nhiều file và assert cả 3 (hay N) file đều xuất hiện trong danh sách sau khi upload. Các test hiện tại dừng ở mức "trang/dialog/khu vực upload có hiển thị" — đây là bước đệm hợp lý (đảm bảo UI dựng đúng trước), nhưng **chưa phải regression test khoá được đúng bug SCRUM-102**. Khi gặp tình huống này trong công việc thật, QC nên chủ động đề xuất bổ sung: 1 test chọn 2-3 file, assert đủ số file xuất hiện trong preview list.

## 6. Quy trình chung: từ bug fix đến regression test

Từ 4 case trên, rút ra quy trình áp dụng được cho mọi bug:

1. **Đọc kỹ mô tả bug gốc** — xác định chính xác điều kiện/hành động gây ra bug (không phải mô tả chung, mà là bước cụ thể).
2. **Viết test tái hiện đúng điều kiện đó**, không phải test "chung chung liên quan đến khu vực có bug".
3. **Assert vào hành vi quan sát được** (kết quả cuối), không assert vào cách implementation — để test còn giá trị dù code refactor.
4. **Thêm test đối chứng** cho các trường hợp liên quan (đúng/sai/biên) để chắc chắn fix không "quá tay" làm hỏng case khác.
5. **Đặt tên file/test theo mã ticket** để dễ truy vết khi test fail sau này — người đọc report biết ngay "bug nào đang sống lại".
6. **Tự hỏi lại: test này có thực sự khoá được đúng bug, hay chỉ đang test một thứ gần giống?** — như đã thấy ở SCRUM-94 và SCRUM-102, đây là lỗi rất dễ mắc phải.

## Bài tập thực hành

1. Với SCRUM-93 (permission check), viết thêm (trên giấy hoặc pseudo-code) 1 test case cho role **Tech Lead** — kỳ vọng **không** thấy nút "Thêm" trên trang Departments.
2. Với SCRUM-94, viết lại `TC-SCRUM94-005` sao cho assert được rõ ràng "đã ở trang 1" sau khi đổi filter (gợi ý: kiểm tra state của pagination component hoặc query param trên URL).
3. Với SCRUM-102, đề xuất 1 test case mới: chọn 3 file cùng lúc, assert cả 3 đều xuất hiện trong danh sách preview.
4. Chọn 1 bug bạn từng report (hoặc từng đọc trong Jira của team), viết thử 1 test case theo đúng 6 bước ở mục 6.

## Bước tiếp theo

Tiếp theo: [Test Suite theo Domain nghiệp vụ](../case-studies/02-test-suite-theo-domain/)

---

**Cần giúp đỡ?** Liên hệ QC Lead hoặc đăng trong #qc-team
