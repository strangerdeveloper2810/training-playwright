---
title: API Testing với Playwright & tRPC
description: Test API trực tiếp bằng Playwright request, cách gọi tRPC endpoint của HR Tool, và network mocking với page.route
---

# API Testing với Playwright & tRPC

Tài liệu đào tạo QC - HR Tool

Playwright không chỉ để điều khiển browser. Nó còn có một fixture riêng gọi là `request` cho phép gọi trực tiếp API mà không cần mở browser — nhanh hơn rất nhiều so với test UI, và rất hữu ích để chuẩn bị dữ liệu (seed data) hoặc verify logic backend độc lập với giao diện.

## Mục lục

1. [`request` fixture là gì](#1-request-fixture-là-gì)
2. [Test REST endpoint thông thường](#2-test-rest-endpoint-thông-thường)
3. [Test tRPC endpoint của HR Tool](#3-test-trpc-endpoint-của-hr-tool)
4. [Network Mocking với `page.route`](#4-network-mocking-với-pageroute)
5. [Khi nào dùng API test, khi nào dùng UI test](#5-khi-nào-dùng-api-test-khi-nào-dùng-ui-test)
6. [Bài tập thực hành](#6-bài-tập-thực-hành)

## 1. `request` fixture là gì

Playwright cung cấp `APIRequestContext` thông qua fixture `request` — cho phép gửi `GET`/`POST`/`PUT`/`DELETE` trực tiếp tới API, giống Postman nhưng viết bằng code và chạy được trong CI cùng bộ test tự động.

```typescript
import { test, expect } from '@playwright/test';

test('gọi API trực tiếp, không cần mở browser', async ({ request }) => {
  const response = await request.get('/health');
  expect(response.ok()).toBeTruthy();
});
```

Ưu điểm so với test qua UI:

| Tiêu chí | Test qua UI | Test qua API (`request`) |
|---|---|---|
| Tốc độ | Chậm (phải render, chờ animation) | Nhanh (chỉ HTTP round-trip) |
| Độ ổn định | Dễ flaky (layout đổi, element di chuyển) | Ổn định hơn nhiều |
| Phạm vi kiểm tra | Toàn bộ luồng người dùng | Chỉ logic backend/API |
| Khi nào dùng | Xác nhận trải nghiệm thật của user | Verify business logic, seed data nhanh |

## 2. Test REST endpoint thông thường

Với API dạng REST thuần, cấu trúc test khá đơn giản: gọi request, kiểm tra status code, kiểm tra response body.

```typescript
// tests/api/auth.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Auth API', () => {
  test('login thành công trả về access token', async ({ request }) => {
    const response = await request.post('/api/auth/login', {
      data: { email: 'admin@test.com', password: 'password123' },
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body).toHaveProperty('accessToken');
    expect(body.user.email).toBe('admin@test.com');
  });

  test('login sai mật khẩu trả về 401', async ({ request }) => {
    const response = await request.post('/api/auth/login', {
      data: { email: 'admin@test.com', password: 'sai-password' },
    });

    expect(response.status()).toBe(401);
  });
});
```

:::note[Test data]
`admin@test.com` / `password123` ở đây chỉ là ví dụ minh hoạ. Khi viết test thật, luôn dùng account test được QC Lead cấp, không hardcode credential thật vào code (nhất là khi push lên git).
:::

## 3. Test tRPC endpoint của HR Tool

HR Tool dùng **tRPC**, không phải REST thuần, nên format request/response khác một chút. Vì backend cấu hình `httpBatchLink` **không kèm transformer**, mọi request đều đi qua dạng "batch" — input được bọc trong object với key là chỉ số `"0"`, và response cũng là một **array**, kết quả nằm ở `[0].result.data`.

```typescript
// utils/trpc.ts — helper gọi tRPC trong test
import type { APIRequestContext } from '@playwright/test';

const API = process.env.API_URL || 'http://localhost:3000';

export async function loginToken(
  request: APIRequestContext,
  email = '[TEST_EMAIL]',
  password = '[TEST_PASSWORD]'
): Promise<string> {
  const res = await request.post(`${API}/trpc/auth.login?batch=1`, {
    data: { '0': { email, password } },
  });
  const json = await res.json();
  const token = json?.[0]?.result?.data?.accessToken;
  if (!token) throw new Error(`login failed: ${JSON.stringify(json).slice(0, 200)}`);
  return token;
}

export async function trpcMutate<T = unknown>(
  request: APIRequestContext,
  token: string,
  path: string,
  input: unknown
): Promise<T> {
  const res = await request.post(`${API}/trpc/${path}?batch=1`, {
    headers: { Authorization: `Bearer ${token}` },
    data: { '0': input },
  });
  const json = await res.json();
  if (json?.[0]?.error) throw new Error(`${path}: ${json[0].error.message}`);
  return json[0].result.data as T;
}

export async function trpcQuery<T = unknown>(
  request: APIRequestContext,
  token: string,
  path: string,
  input: unknown = {}
): Promise<T> {
  const qs = encodeURIComponent(JSON.stringify({ '0': input }));
  const res = await request.get(`${API}/trpc/${path}?batch=1&input=${qs}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const json = await res.json();
  if (json?.[0]?.error) throw new Error(`${path}: ${json[0].error.message}`);
  return json[0].result.data as T;
}
```

Dùng trong test:

```typescript
import { test, expect } from '@playwright/test';
import { loginToken, trpcMutate, trpcQuery } from '../../utils/trpc';

test('tạo candidate mới qua tRPC rồi verify bằng query', async ({ request }) => {
  const token = await loginToken(request);

  const created = await trpcMutate(request, token, 'candidate.create', {
    name: '[TEST] Nguyen Van A',
    email: `candidate-${Date.now()}@example.com`,
  });
  expect(created).toHaveProperty('id');

  const list = await trpcQuery(request, token, 'candidate.list', { page: 1, limit: 10 });
  expect(Array.isArray(list.items)).toBeTruthy();
});
```

:::tip[Vì sao phải viết helper riêng?]
Format `?batch=1` + key `"0"` khá đặc thù của tRPC, không trực quan như REST. Viết sẵn 3 helper (`loginToken`, `trpcMutate`, `trpcQuery`) một lần, tái sử dụng ở mọi test — tránh việc mỗi test tự lặp lại logic parse response giống nhau.
:::

:::caution[Format có thể khác nhau giữa các dự án]
Cách bọc request/response của tRPC phụ thuộc vào cấu hình `httpBatchLink` và có dùng `transformer` (thường là `superjson`) hay không. Một số dự án tRPC khác có thể thấy format `{ json: { ... } }` / `result.data.json` thay vì `{ "0": ... }` / `result.data`. Luôn kiểm tra lại cấu hình router thật của dự án đang test trước khi copy nguyên helper này.
:::

## 4. Network Mocking với `page.route`

Đôi khi bạn cần test giao diện xử lý ra sao khi API **lỗi** hoặc **trả dữ liệu đặc biệt** — những case rất khó tạo ra bằng data thật (ví dụ: server lỗi 500, response chậm, danh sách rỗng). `page.route()` cho phép chặn request và trả về response giả, mà không cần chạm vào backend thật.

```typescript
import { test, expect } from '@playwright/test';

test('hiển thị đúng dữ liệu giả lập', async ({ page }) => {
  await page.route('**/trpc/candidate.list*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([{
        result: { data: { items: [{ id: '1', name: 'Mock Candidate' }], total: 1 } },
      }]),
    });
  });

  await page.goto('/candidates');
  await expect(page.getByText('Mock Candidate')).toBeVisible();
});

test('hiển thị thông báo lỗi khi API trả 500', async ({ page }) => {
  await page.route('**/trpc/candidate.list*', async (route) => {
    await route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({ error: { message: 'Internal Server Error' } }),
    });
  });

  await page.goto('/candidates');
  await expect(page.getByText(/lỗi/i)).toBeVisible();
});

test('chỉnh sửa response gốc trước khi trả về', async ({ page }) => {
  await page.route('**/trpc/candidate.list*', async (route) => {
    const response = await route.fetch();
    const json = await response.json();
    // giả sử json[0].result.data.items tồn tại, gắn thêm tiền tố để kiểm tra UI có nhận đúng data đã sửa
    await route.fulfill({ response, json });
  });

  await page.goto('/candidates');
});
```

Ba tình huống hay dùng network mocking: giả lập lỗi server, giả lập danh sách rỗng, và chỉnh sửa response gốc để kiểm tra một field cụ thể mà không cần tạo data thật.

## 5. Khi nào dùng API test, khi nào dùng UI test

- **Dùng API test khi:** muốn verify logic nghiệp vụ (validate, phân quyền, tính toán) nhanh; cần seed nhiều dữ liệu trước khi test UI; muốn test edge case (lỗi, timeout) khó tái tạo qua UI.
- **Dùng UI test khi:** muốn xác nhận người dùng thật sự thao tác được (click đúng chỗ, thấy đúng thông báo); test những gì chỉ xảy ra ở tầng giao diện (validate form, animation, responsive).
- Trong thực tế, một bộ automation test tốt thường **kết hợp cả hai**: dùng API để seed data setup nhanh, rồi dùng UI test để verify trải nghiệm thật.

## 6. Bài tập thực hành

1. Viết 1 test dùng `request` để login vào HR Tool qua tRPC và lấy `accessToken`.
2. Dùng token đó gọi thử 1 endpoint `list` (ví dụ `job.list` hoặc `candidate.list`) và assert response có field `items`.
3. Viết 1 test dùng `page.route` giả lập API trả lỗi 500 cho trang Candidates, kiểm tra UI có hiển thị thông báo lỗi phù hợp không.
4. Thử nghĩ ra 1 tình huống mà bạn sẽ ưu tiên viết API test thay vì UI test cho HR Tool, giải thích vì sao.

## Bước tiếp theo

Tiếp theo: [Database Verification trong Automation](./17-database-verification-automation/) — khi nào automation test cần verify trực tiếp trong database.

**Cần giúp đỡ?** Liên hệ QC Lead hoặc #qc-team
