---
title: Database Verification trong Automation
description: Khi nào automation test cần verify trực tiếp trong database, cách kết nối an toàn, và những rủi ro cần lưu ý
---

# Database Verification trong Automation

Tài liệu đào tạo QC - HR Tool

Phần lớn automation test chỉ cần verify qua UI hoặc API là đủ. Nhưng có những trường hợp cả UI và API đều "nói dối" — hiển thị đúng nhưng dữ liệu lưu sai, hoặc ẩn đi trên UI nhưng vẫn còn tồn tại trong database. Bài này nói về khi nào và làm sao để automation test verify trực tiếp trong DB.

## Mục lục

1. [Vì sao đôi khi phải verify trực tiếp DB](#1-vì-sao-đôi-khi-phải-verify-trực-tiếp-db)
2. [Kết nối database trong test Playwright](#2-kết-nối-database-trong-test-playwright)
3. [Ví dụ: tạo qua UI, verify qua DB, rồi dọn dẹp](#3-ví-dụ-tạo-qua-ui-verify-qua-db-rồi-dọn-dẹp)
4. [Rủi ro cần lưu ý](#4-rủi-ro-cần-lưu-ý)
5. [Best practice](#5-best-practice)
6. [Bài tập thực hành](#6-bài-tập-thực-hành)

## 1. Vì sao đôi khi phải verify trực tiếp DB

Một vài tình huống UI/API không đủ để kết luận:

- **Soft-delete**: UI ẩn candidate đã "xoá" khỏi danh sách, nhưng record thật vẫn còn trong DB với cờ `deletedAt`. Nếu chỉ nhìn UI, bạn không biết chắc dữ liệu có bị xoá vật lý hay không — điều này quan trọng với yêu cầu tuân thủ dữ liệu (data compliance).
- **Data integrity**: sau khi thao tác hàng loạt (bulk update), UI hiển thị đúng cho những record bạn nhìn thấy, nhưng có thể một số record khác bị cập nhật sai mà bạn không kiểm tra hết qua UI.
- **Multi-tenant isolation**: cần chắc chắn dữ liệu của company A không bị gán nhầm `companyId` của company B — việc này khó thấy trên UI vì UI luôn chỉ hiển thị dữ liệu của company đang đăng nhập.
- **Side-effect ngầm**: một action có thể tạo ra nhiều record liên quan (ví dụ tạo Application thì cũng phải tạo `ApplicationStageEvent` log) mà UI không hiển thị trực tiếp.

Nếu không rơi vào các trường hợp này, verify qua UI/API vẫn là lựa chọn ưu tiên — nhanh hơn và ít phải maintain hơn.

## 2. Kết nối database trong test Playwright

Playwright không có API riêng để query database — bạn dùng thư viện Node.js bình thường (ví dụ `pg` cho PostgreSQL) bên trong file test hoặc trong một helper riêng.

```typescript
// utils/db.ts
import { Pool } from 'pg';

// Chỉ nên trỏ vào DB test/staging riêng, KHÔNG BAO GIỜ trỏ vào production
const pool = new Pool({ connectionString: process.env.TEST_DATABASE_URL });

export async function queryDb<T = unknown>(sql: string, params: unknown[] = []): Promise<T[]> {
  const result = await pool.query(sql, params);
  return result.rows as T[];
}

export async function closeDbPool() {
  await pool.end();
}
```

:::caution[Không bao giờ trỏ vào production]
`TEST_DATABASE_URL` phải luôn là một connection string riêng cho môi trường test/staging. Không bao giờ để automation test (có quyền `DELETE`/`UPDATE`) chạy trực tiếp trên database production.
:::

## 3. Ví dụ: tạo qua UI, verify qua DB, rồi dọn dẹp

```typescript
import { test, expect } from '../../fixtures/test-fixtures';
import { queryDb } from '../../utils/db';

test.describe('Candidate creation - verify DB', () => {
  const testEmail = `candidate-${Date.now()}@example.com`;

  test('tạo candidate qua UI, verify đúng record trong DB', async ({ candidatesPage }) => {
    await candidatesPage.goto();
    await candidatesPage.createCandidate({ name: '[TEST] DB Check', email: testEmail });

    // Verify trực tiếp trong DB — bảng/cột dưới đây là ví dụ minh hoạ,
    // cần đối chiếu với schema thật trước khi dùng.
    const rows = await queryDb<{ id: string; email: string; company_id: string }>(
      'SELECT id, email, company_id FROM candidates WHERE email = $1',
      [testEmail]
    );

    expect(rows).toHaveLength(1);
    expect(rows[0].email).toBe(testEmail);
  });

  test.afterEach(async () => {
    // Dọn dẹp dữ liệu test để không rác lại DB sau khi test chạy xong
    await queryDb('DELETE FROM candidates WHERE email = $1', [testEmail]);
  });
});
```

## 4. Rủi ro cần lưu ý

| Rủi ro | Vì sao | Cách giảm thiểu |
|---|---|---|
| Test chạy chậm hơn | Mở connection DB tốn thời gian, đặc biệt khi query nhiều lần | Dùng connection pool, chỉ query khi thật cần |
| Cần cấp quyền truy cập DB test | Không phải QC nào cũng có credential DB | Xin quyền đọc (và ghi nếu cần cleanup) riêng cho DB **test/staging** từ Tech Lead |
| Rác dữ liệu nếu quên cleanup | Test tạo data nhưng không xoá, làm nhiễu môi trường test | Luôn cleanup trong `afterEach`/`afterAll`, đặt tiền tố `[TEST]` để dễ nhận diện và dọn dẹp theo lô nếu cần |
| Test gắn quá chặt với schema | Đổi tên cột/bảng là test automation gãy ngay | Chỉ verify DB cho case thật sự cần, còn lại ưu tiên verify qua API/UI |

## 5. Best practice

- Chỉ dùng DB verification cho case **quan trọng và không thể verify cách khác** (data integrity, soft-delete, multi-tenant isolation) — đừng lạm dụng cho mọi test.
- Ưu tiên verify qua tRPC query (xem [bài API/tRPC testing](./16-api-testing-playwright-trpc/)) nếu đủ để kết luận — ít phụ thuộc schema hơn truy vấn SQL trực tiếp.
- Luôn cleanup dữ liệu test đã tạo, dùng tiền tố `[TEST]` để dễ nhận diện nếu cleanup bị sót.
- Không bao giờ cho automation test quyền `DELETE`/`UPDATE` trên database production.

## 6. Bài tập thực hành

1. Giải thích bằng lời cho một trường hợp cụ thể của HR Tool mà theo bạn UI/API không đủ để kết luận test pass, cần verify DB.
2. Viết (trên giấy/pseudo-code) một test case verify rằng khi xoá 1 Job, các Application liên quan đến Job đó không bị xoá theo (hoặc bị xử lý ra sao theo đúng thiết kế).
3. Nêu 2 rủi ro nếu một automation test có quyền ghi trực tiếp vào database production.

## Bước tiếp theo

Tiếp theo: [Debug, Trace Viewer & Codegen](./18-debug-trace-viewer-codegen/) — công cụ debug khi test tự động thất bại.

**Cần giúp đỡ?** Liên hệ QC Lead hoặc #qc-team
