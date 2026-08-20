---
title: Git & Quy trình làm việc nhóm cho Tester
description: Nắm vững Git cơ bản và quy trình branch/PR/code review để làm việc hiệu quả với team phát triển
---

# Git & Quy trình làm việc nhóm cho Tester

Tài liệu đào tạo QC - HR Tool

---

## Mục lục

1. [Vì sao Tester cần biết Git](#1-vì-sao-tester-cần-biết-git)
2. [Các khái niệm Git cơ bản](#2-các-khái-niệm-git-cơ-bản)
3. [Các lệnh Git thường dùng](#3-các-lệnh-git-thường-dùng)
4. [Quy trình làm việc nhóm (Git Workflow)](#4-quy-trình-làm-việc-nhóm-git-workflow)
5. [Commit message convention](#5-commit-message-convention)
6. [Pull Request và Code Review](#6-pull-request-và-code-review)
7. [Bài tập thực hành](#7-bài-tập-thực-hành)

---

## 1. Vì sao Tester cần biết Git

**Git** là hệ thống quản lý phiên bản mã nguồn (version control) — cho phép nhiều người cùng chỉnh sửa code mà không đè lên nhau, và có thể xem lại lịch sử thay đổi bất kỳ lúc nào.

Với **manual tester**, biết Git ở mức cơ bản giúp bạn:
- Đọc hiểu commit history để biết chính xác thay đổi nào vừa được deploy lên Staging (từ đó biết nên smoke test tính năng gì).
- Đối chiếu bug với đúng version code khi report (field "Affects Version" trong bug report).

Với **automation tester**, biết Git là **bắt buộc**, vì code test của bạn cũng được lưu trữ, review và merge giống code sản phẩm — bạn sẽ tự tạo branch, commit, và tạo Pull Request (PR) mỗi khi thêm/sửa test.

---

## 2. Các khái niệm Git cơ bản

| Khái niệm | Giải thích |
|-----------|------------|
| **Repository (repo)** | "Kho" chứa toàn bộ code và lịch sử thay đổi của một dự án |
| **Commit** | Một "điểm lưu" ghi lại các thay đổi tại một thời điểm, kèm mô tả (commit message) |
| **Branch** | Một "nhánh" phát triển độc lập, cho phép làm việc song song không ảnh hưởng nhánh chính |
| **Merge** | Gộp thay đổi từ một branch vào branch khác |
| **Pull Request (PR)** | Yêu cầu xin gộp branch của bạn vào branch chính, kèm cơ chế review trước khi merge |
| **Clone** | Tải toàn bộ repo về máy local |
| **Pull** | Lấy các thay đổi mới nhất từ remote (GitHub) về máy local |
| **Push** | Đẩy thay đổi từ máy local lên remote |

Hình dung branch giống như nhiều "bản sao nháp" của cùng một tài liệu, được chỉnh sửa song song, rồi hợp nhất lại sau khi đã hoàn thiện và được duyệt.

```
main/develop  ──●──────●───────●──────●──►   (nhánh chính, luôn ổn định)
                 \             ↗
                  ●────●────●             (nhánh feature/bugfix của bạn)
```

---

## 3. Các lệnh Git thường dùng

```bash
# Tải repo về máy (chỉ làm 1 lần đầu)
git clone <repo-url>

# Xem trạng thái hiện tại: file nào đã đổi, đã staged chưa
git status

# Xem chi tiết các thay đổi
git diff

# Tạo branch mới và chuyển sang branch đó
git checkout -b feature/them-test-case-login

# Đưa file thay đổi vào "hàng chờ" commit
git add ten-file.ts
git add .        # thêm toàn bộ file đã thay đổi

# Lưu lại thay đổi kèm mô tả
git commit -m "test: add negative test cases for login"

# Đẩy branch lên remote (GitHub) lần đầu
git push -u origin feature/them-test-case-login

# Lấy thay đổi mới nhất từ remote
git pull

# Xem lịch sử commit
git log --oneline
```

**Merge conflict** xảy ra khi 2 người cùng sửa một dòng code khác nhau trên cùng file, và Git không thể tự quyết định giữ bản nào — bạn cần mở file, chọn/gộp thủ công phần muốn giữ, rồi `git add` + `git commit` lại để hoàn tất.

---

## 4. Quy trình làm việc nhóm (Git Workflow)

HR Tool áp dụng quy trình sau (đây là quy trình chuẩn cho mọi thành viên team, bao gồm cả automation tester khi đóng góp test code):

```
1. Tạo branch mới từ develop
        ↓
2. Code/viết test trên branch đó
        ↓
3. Commit theo convention
        ↓
4. Push lên GitHub
        ↓
5. Tạo Pull Request (PR) vào develop
        ↓
6. Team review, CI chạy test tự động
        ↓
7. Sửa theo feedback (nếu có)
        ↓
8. Merge vào develop
```

**Lưu ý quan trọng**: HR Tool merge trực tiếp vào nhánh **`develop`** (không phải `main`) — `develop` là nhánh chứa đầy đủ tính năng đang được tích hợp liên tục, còn `main` thường dùng cho bản release ổn định. Khi test trên Staging, bạn thực chất đang test code từ nhánh `develop`.

Quy tắc đặt tên branch nên rõ nghĩa, ví dụ:
- `feature/candidate-bulk-import` — thêm tính năng mới
- `fix/login-500-error` — sửa bug
- `test/add-regression-ats-pipeline` — thêm test

---

## 5. Commit message convention

Một convention phổ biến (Conventional Commits) mà nhiều dự án TypeScript/Node áp dụng:

```
<type>: <mô tả ngắn>

Ví dụ:
feat: add CV template export button
fix: correct 500 error when email contains plus sign
test: add e2e test for interview scheduling
docs: update bug report template
chore: upgrade playwright to 1.48
```

| Type | Khi dùng |
|------|----------|
| `feat` | Thêm tính năng mới |
| `fix` | Sửa lỗi |
| `test` | Thêm/sửa test |
| `docs` | Thay đổi tài liệu |
| `chore` | Việc lặt vặt (cập nhật dependency, cấu hình...) |
| `refactor` | Tái cấu trúc code, không đổi hành vi |

Commit message rõ ràng giúp cả team (và cả bạn 3 tháng sau) hiểu ngay một thay đổi làm gì mà không cần đọc lại toàn bộ code diff.

---

## 6. Pull Request và Code Review

**Pull Request (PR)** là nơi bạn trình bày các thay đổi của mình để người khác xem xét trước khi merge vào nhánh chính. Một PR tốt thường có: tiêu đề rõ ràng, mô tả ngắn về thay đổi, và (nếu là PR sửa bug) link tới ticket JIRA liên quan.

**Code Review** là bước đồng nghiệp đọc lại thay đổi của bạn để tìm vấn đề trước khi merge. Với PR chứa **test tự động**, khi review (hoặc khi được yêu cầu review test code của người khác), tester nên chú ý:

- Test có **assertion rõ ràng** không, hay chỉ chạy qua mà không thực sự kiểm tra kết quả?
- Test có phụ thuộc vào **thứ tự chạy** hay dữ liệu do test khác tạo ra không (dễ gây flaky test)?
- Test có **dọn dẹp dữ liệu** sau khi chạy không (tránh rác tồn lại trên Staging)?
- Tên test case có mô tả rõ **đang test cái gì** không (ví dụ `should show error when email is invalid` tốt hơn `test1`)?

HR Tool còn yêu cầu tuân thủ **TDD (Test-Driven Development)** — viết test trước khi viết code tính năng — và tất cả PR phải pass đủ: `typecheck`, `lint` (Biome), và `test` trước khi được merge (được kiểm tra tự động qua GitHub Actions CI).

:::tip[Với automation tester]
Khi bạn tạo PR thêm test mới, hãy tự hỏi: "Nếu tính năng này bị lỗi thật, test của tôi có FAIL không?" — nếu chưa chắc, hãy tự tạo một lỗi giả (comment tạm 1 dòng code) để xác nhận test thật sự bắt được lỗi, rồi bỏ lỗi giả đó đi trước khi tạo PR.
:::

---

## 7. Bài tập thực hành

1. Giải thích sự khác biệt giữa `git commit` và `git push` bằng lời của riêng bạn.
2. Bạn được giao task "thêm test case cho tính năng mời thành viên (invitation)". Hãy đặt tên branch phù hợp theo convention đã học.
3. Viết 3 ví dụ commit message theo Conventional Commits cho các thay đổi: (a) thêm test mới, (b) sửa tài liệu README, (c) sửa một lỗi hiển thị.
4. Vì sao HR Tool merge PR vào `develop` thay vì `main`? Điều này có ý nghĩa gì với việc bạn test trên Staging?
5. Khi review một PR chứa test tự động của đồng nghiệp, bạn sẽ kiểm tra những điểm nào để đảm bảo test đó thực sự có giá trị?

---

## Bước tiếp theo

Bạn đã hoàn thành nhóm **Nền tảng kỹ thuật**. Tiếp tục với [QC Fundamentals](../basics/01-fundamentals/) để bắt đầu học tư duy và quy trình kiểm thử.

---

**Cần giúp đỡ?** Liên hệ QC Lead hoặc đăng trong #qc-team
