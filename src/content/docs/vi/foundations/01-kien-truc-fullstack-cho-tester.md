---
title: Kiến trúc Full-stack cho Tester
description: Hiểu kiến trúc Client - Server - Database và cách các thành phần của HR Tool kết nối với nhau
---

# Kiến trúc Full-stack cho Tester

Tài liệu đào tạo QC - HR Tool

---

## Mục lục

1. [Giới thiệu](#1-giới-thiệu)
2. [Kiến trúc Client - Server - Database](#2-kiến-trúc-client---server---database)
3. [Frontend, Backend, Database và API layer](#3-frontend-backend-database-và-api-layer)
4. [Monorepo là gì](#4-monorepo-là-gì)
5. [REST vs GraphQL vs tRPC](#5-rest-vs-graphql-vs-trpc)
6. [Request-Response Lifecycle](#6-request-response-lifecycle)
7. [Vì sao Tester cần hiểu kiến trúc này](#7-vì-sao-tester-cần-hiểu-kiến-trúc-này)
8. [Bài tập thực hành](#8-bài-tập-thực-hành)

---

## 1. Giới thiệu

Trước khi học cách viết test case hay test script, một fullstack tester cần trả lời được câu hỏi: **"Ứng dụng mà tôi đang test được ghép từ những phần nào?"**

Rất nhiều QC mới chỉ nhìn thấy cái giao diện (UI) hiển thị trên trình duyệt và nghĩ rằng đó là toàn bộ "ứng dụng". Thực tế, mọi ứng dụng web hiện đại — bao gồm HR Tool — đều gồm nhiều tầng (layer) khác nhau chạy trên nhiều máy/tiến trình khác nhau, giao tiếp với nhau qua mạng. Khi một tính năng bị lỗi, câu hỏi đầu tiên một tester giỏi luôn tự hỏi là: **"Lỗi này nằm ở tầng nào?"** — giao diện hiển thị sai, hay server trả dữ liệu sai, hay dữ liệu trong database bị sai từ đầu?

Bài học này xây dựng "bản đồ" tổng quan về kiến trúc ứng dụng web, sau đó áp dụng trực tiếp vào cấu trúc thật của HR Tool.

---

## 2. Kiến trúc Client - Server - Database

Hầu hết ứng dụng web được tổ chức theo mô hình 3 tầng kinh điển:

```
┌─────────────┐        HTTP Request         ┌─────────────┐        Query         ┌─────────────┐
│             │ ───────────────────────────► │             │ ───────────────────► │             │
│   CLIENT    │                              │   SERVER    │                      │  DATABASE   │
│  (Browser)  │ ◄─────────────────────────── │  (Backend)  │ ◄─────────────────── │ (PostgreSQL)│
│             │        HTTP Response         │             │        Result        │             │
└─────────────┘                              └─────────────┘                      └─────────────┘
```

- **Client**: là những gì người dùng nhìn thấy và tương tác trực tiếp — trình duyệt (Chrome, Safari...) hoặc app mobile. Client chạy trên máy của người dùng.
- **Server**: là "bộ não" xử lý logic nghiệp vụ — nhận yêu cầu từ Client, kiểm tra quyền, xử lý dữ liệu, rồi trả kết quả về. Server chạy trên máy chủ (VPS, cloud) mà người dùng không nhìn thấy trực tiếp.
- **Database**: là nơi lưu trữ dữ liệu lâu dài (danh sách nhân viên, ứng viên, tin tuyển dụng...). Server đọc/ghi dữ liệu vào Database theo yêu cầu.

Client **không bao giờ** truy cập trực tiếp vào Database — mọi thứ phải đi qua Server. Đây là lý do vì sao khi bạn mở DevTools trên trình duyệt, bạn sẽ không bao giờ thấy được nội dung database, mà chỉ thấy dữ liệu mà Server "cho phép" trả về qua API.

:::tip[Ghi nhớ]
Khi thấy dữ liệu hiển thị sai trên UI, đừng vội kết luận "web bị lỗi". Hãy hỏi: dữ liệu sai từ lúc nào? UI hiển thị sai dữ liệu đúng (lỗi Frontend), hay Server trả về dữ liệu sai (lỗi Backend), hay dữ liệu trong Database đã sai từ đầu (lỗi xử lý/nhập liệu)?
:::

---

## 3. Frontend, Backend, Database và API layer

| Thuật ngữ | Vai trò | Ví dụ công nghệ | Ví dụ trong HR Tool |
|-----------|---------|------------------|----------------------|
| **Frontend** | Hiển thị giao diện, nhận tương tác người dùng | React, Vue, Angular | React 19 + Vite (`apps/web`) |
| **Backend** | Xử lý logic nghiệp vụ, phân quyền, kết nối database | NestJS, Express, Django, Spring Boot | NestJS 11 (`apps/api`) |
| **Database** | Lưu trữ dữ liệu | PostgreSQL, MySQL, MongoDB | PostgreSQL 16 + TypeORM |
| **API layer** | "Cầu nối" quy định cách Frontend gọi Backend | REST, GraphQL, tRPC | tRPC 11 |

**API (Application Programming Interface)** là tập hợp các "cổng giao tiếp" mà Backend công khai để Frontend (hoặc bất kỳ client nào khác, ví dụ Postman, app mobile) có thể gọi tới. Ví dụ: Frontend muốn lấy danh sách ứng viên, nó sẽ gọi một API endpoint như `candidate.getList` — Backend nhận yêu cầu này, truy vấn Database, rồi trả kết quả về dưới dạng dữ liệu có cấu trúc (thường là JSON).

Một điểm quan trọng: **Frontend và Backend là hai chương trình độc lập, chạy trên hai tiến trình khác nhau** (có thể khác cả máy chủ). Chúng không "biết" chi tiết bên trong của nhau — chỉ giao tiếp qua API. Vì vậy khi test, bạn hoàn toàn có thể test riêng Backend (qua Postman, không cần mở giao diện) hoặc riêng Frontend (dùng dữ liệu giả - mock data).

---

## 4. Monorepo là gì

**Monorepo** (mono-repository) là cách tổ chức nhiều ứng dụng/thư viện khác nhau trong **cùng một repository Git**, thay vì mỗi ứng dụng có repository riêng (gọi là multi-repo).

HR Tool được tổ chức theo monorepo, dùng công cụ **Nx** để quản lý:

```
hr-tool/
├── apps/
│   ├── api/        NestJS Backend (Cổng 3000)
│   ├── web/        React 19 Web App (Cổng 4200)
│   ├── landing/    Astro 5 Landing Page (Cổng 4321)
│   ├── mobile/     React Native Mobile App
│   └── e2e/        Playwright end-to-end tests
├── packages/
│   ├── shared/       Hằng số, vai trò, phân quyền dùng chung
│   ├── api-client/   tRPC client & React Query hooks tự động sinh
│   ├── ui-web/       Thư viện UI dùng chung cho web
│   └── ui-mobile/    Thư viện UI dùng chung cho mobile
```

**Vì sao điều này quan trọng với tester?**

- Khi một bug được báo, bạn cần biết code liên quan nằm ở `apps/api` (lỗi backend) hay `apps/web` (lỗi giao diện) để mô tả đúng trong bug report.
- Một số thay đổi ở `packages/shared` (ví dụ đổi tên một quyền/role) có thể ảnh hưởng tới NHIỀU app cùng lúc (`api`, `web`, `mobile`) — đây là lý do cần regression test rộng hơn khi các package chung bị thay đổi.
- Backend của HR Tool còn được tổ chức theo **Bounded Context** — nghĩa là chia theo nghiệp vụ, không chia theo tầng kỹ thuật: `apps/api/src/contexts/recruitment` (tuyển dụng), `hr` (nhân sự), `platform` (nền tảng/đa tenant), `observability` (giám sát), `shared` (dùng chung). Khi test một tính năng, bạn có thể tìm code liên quan theo đúng context nghiệp vụ đó.

---

## 5. REST vs GraphQL vs tRPC

Đây là 3 "phong cách" phổ biến nhất để Frontend gọi Backend. Tester không cần thành thạo cách lập trình cả 3, nhưng cần nhận diện được đang làm việc với loại nào để test API đúng cách (bài `practice/06-manual-api-testing` sẽ thực hành chi tiết).

| Đặc điểm | REST | GraphQL | tRPC |
|----------|------|---------|------|
| Cách gọi | Nhiều URL khác nhau theo resource (`/users`, `/jobs/1`) | 1 URL duy nhất, client tự chọn field cần lấy | Gọi hàm trực tiếp như gọi function trong code |
| Kiểu dữ liệu | Không bắt buộc kiểm tra type giữa FE-BE | Có schema rõ ràng | Type-safe tuyệt đối giữa FE-BE (cùng TypeScript) |
| Độ phổ biến | Rất phổ biến, gần như chuẩn công nghiệp | Phổ biến ở hệ thống dữ liệu phức tạp | Phổ biến trong monorepo TypeScript full-stack |
| HR Tool dùng? | Không | Không | ✅ Có (tRPC 11) |

**tRPC** đặc biệt vì Frontend và Backend đều viết bằng TypeScript trong cùng monorepo, nên khi Backend đổi một API, TypeScript sẽ báo lỗi ngay ở Frontend nếu dùng sai — giảm hẳn một nhóm lỗi "API contract mismatch" mà REST hay gặp. Điều này không có nghĩa là không còn bug — logic nghiệp vụ vẫn có thể sai, dữ liệu trả về vẫn có thể không đúng kỳ vọng, và đó là phần việc của tester.

Về mặt network, request của tRPC vẫn là HTTP request thông thường (thường là `POST /trpc/<router>.<procedure>`), nên mọi kỹ thuật test API qua Postman/DevTools ở các bài sau vẫn áp dụng được.

---

## 6. Request-Response Lifecycle

Khi bạn bấm nút "Đăng nhập" trên HR Tool, chuyện gì thực sự xảy ra?

```
1. User nhập email/password, bấm "Đăng nhập"
        ↓
2. Frontend (React) gọi API: trpc.auth.login({ email, password })
        ↓
3. Request được gửi qua network: POST /trpc/auth.login
        ↓
4. Backend (NestJS) nhận request, kiểm tra dữ liệu đầu vào (validate)
        ↓
5. Backend truy vấn Database: tìm user theo email
        ↓
6. Backend so sánh password (đã hash), tạo JWT access token + refresh token
        ↓
7. Backend trả Response: 200 OK + set cookie chứa token
        ↓
8. Frontend nhận response, lưu trạng thái "đã đăng nhập", chuyển hướng sang Dashboard
        ↓
9. User nhìn thấy trang Dashboard
```

Toàn bộ 9 bước này thường diễn ra trong chưa đầy 1 giây, nhưng **mỗi bước đều là một điểm có thể xảy ra lỗi**:

- Bước 4: dữ liệu nhập sai định dạng nhưng Backend không validate → lỗi 500 thay vì thông báo rõ ràng.
- Bước 5: tìm sai user do lỗi truy vấn multi-tenant (lẫn dữ liệu công ty khác).
- Bước 7: token không được set đúng cách (thiếu `httpOnly`, sai `SameSite`) → lỗi bảo mật.
- Bước 8: Frontend nhận response thành công nhưng xử lý sai, không chuyển trang.

---

## 7. Vì sao Tester cần hiểu kiến trúc này

1. **Report bug chính xác hơn**: thay vì ghi "trang bị lỗi", bạn có thể ghi "API `POST /trpc/candidate.create` trả về lỗi 500" — giúp developer định vị lỗi nhanh hơn rất nhiều.
2. **Chọn đúng công cụ để test**: lỗi hiển thị dùng DevTools/Console; lỗi dữ liệu trả về dùng tab Network hoặc Postman; lỗi dữ liệu lưu trữ dùng truy vấn Database.
3. **Biết Automation nên viết ở tầng nào**: một số kịch bản nên test qua UI (Playwright), một số nên test trực tiếp qua API (nhanh hơn, ổn định hơn) — bài `automation/16-api-testing-playwright-trpc` sẽ nói rõ hơn.
4. **Hiểu đúng phạm vi ảnh hưởng khi có thay đổi**: một thay đổi ở `packages/shared` hay ở tầng Database có thể ảnh hưởng nhiều tính năng cùng lúc hơn một thay đổi chỉ ở UI.

:::note[Đừng lo nếu chưa hiểu hết]
Bạn không cần biết viết code Backend hay Frontend để làm tốt vai trò tester. Mục tiêu của bài này là có một **bản đồ tinh thần (mental model)** đủ để đọc hiểu lỗi và giao tiếp chính xác với team kỹ thuật.
:::

---

## 8. Bài tập thực hành

1. Vẽ lại sơ đồ Client - Server - Database bằng lời của riêng bạn, áp dụng cho HR Tool (Web App nào gọi API nào, API nói chuyện với Database nào).
2. Mở HR Tool Staging, mở DevTools → tab Network, thực hiện đăng nhập, tìm request có tên `auth.login` hoặc tương tự. Request đó gửi tới URL nào? Method gì?
3. Giả sử bạn nhận được report "Danh sách nhân viên hiển thị trống dù đã tạo nhân viên mới". Hãy liệt kê ít nhất 3 tầng (Frontend/Backend/Database) có thể là nguyên nhân, và cách bạn sẽ kiểm tra từng tầng.
4. tRPC khác REST ở điểm nào? Tại sao HR Tool chọn tRPC cho một monorepo TypeScript?
5. Trong cấu trúc Bounded Context của HR Tool, một tính năng "quản lý phỏng vấn" (interview) nhiều khả năng nằm trong context nào: `recruitment`, `hr`, `platform`, hay `observability`? Giải thích lý do.

---

## Bước tiếp theo

Tiếp tục với [HTTP & Network cơ bản](../foundations/02-http-network-co-ban/) để hiểu chi tiết cách Client và Server "nói chuyện" với nhau qua giao thức HTTP.

---

**Cần giúp đỡ?** Liên hệ QC Lead hoặc đăng trong #qc-team
