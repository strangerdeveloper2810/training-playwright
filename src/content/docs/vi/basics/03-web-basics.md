---
title: Web Cơ bản cho QC
description: Kiến thức nền tảng về web và lập trình mà QC cần biết
---

# Web Cơ bản cho QC

Tài liệu đào tạo QC - HR Tool

**Phiên bản:** 1.0
**Cập nhật:** 26/02/2026
**Tác giả:** QC Team

---

:::tip[Mục tiêu]
Sau khi học xong tài liệu này, bạn sẽ:
- Hiểu cách web application hoạt động
- Đọc hiểu HTML, CSS, JavaScript cơ bản
- Sử dụng thành thạo Browser DevTools
- Hiểu TypeScript để đọc/viết automation tests
- Debug được các vấn đề thường gặp
:::

---

## Phần 1: Cách Web Hoạt Động

### 1.1 Client - Server Model

Khi bạn truy cập một website, có 2 bên tham gia:

```
┌─────────────────┐                              ┌─────────────────┐
│                 │      1. Request (Yêu cầu)    │                 │
│     CLIENT      │  ─────────────────────────▶  │     SERVER      │
│   (Browser)     │                              │   (Máy chủ)     │
│                 │  ◀─────────────────────────  │                 │
│   Chrome        │      2. Response (Phản hồi)  │   HR Tool API   │
│   Firefox       │                              │   Database      │
│   Safari        │                              │                 │
└─────────────────┘                              └─────────────────┘
```

**Client (Trình duyệt):**
- Nơi user tương tác (Chrome, Firefox, Safari...)
- Gửi yêu cầu đến Server
- Nhận và hiển thị dữ liệu

**Server (Máy chủ):**
- Nơi lưu trữ và xử lý dữ liệu
- Nhận yêu cầu từ Client
- Trả về kết quả

### 1.2 Quy Trình Khi Truy Cập Website

**Ví dụ: Truy cập HR Tool**

```
Bước 1: User gõ https://hr-tool-software.netlify.app vào browser

Bước 2: Browser hỏi DNS "IP của hr-tool-software.netlify.app là gì?"
        DNS trả về: 104.198.14.52

Bước 3: Browser gửi HTTP Request đến 104.198.14.52
        "GET / HTTP/1.1"
        "Host: hr-tool-software.netlify.app"

Bước 4: Server xử lý và trả về HTTP Response
        - HTML (cấu trúc trang)
        - CSS (giao diện)
        - JavaScript (tương tác)
        - Images, fonts...

Bước 5: Browser render (vẽ) giao diện từ HTML/CSS/JS
        → User thấy trang web hoàn chỉnh
```

### 1.3 URL - Địa Chỉ Web

**Cấu trúc URL đầy đủ:**

```
https://hr-tool-software.netlify.app/employees?page=1&search=nguyen#results
└──┬──┘ └──────────────┬──────────────┘└───┬───┘└────────┬────────┘└───┬───┘
   │                   │                   │             │             │
Protocol            Domain               Path      Query String      Hash
```

| Thành phần | Ví dụ | Giải thích |
|------------|-------|------------|
| **Protocol** | `https://` | Giao thức kết nối. HTTPS = bảo mật, HTTP = không bảo mật |
| **Domain** | `hr-tool-software.netlify.app` | Tên miền - địa chỉ của server |
| **Path** | `/employees` | Đường dẫn đến trang/resource cụ thể |
| **Query String** | `?page=1&search=nguyen` | Tham số truyền vào. Bắt đầu bằng `?`, các cặp key=value ngăn cách bằng `&` |
| **Hash** | `#results` | Vị trí trong trang (anchor). Không gửi lên server |

**Ví dụ thực tế trong HR Tool:**

```
/login                          → Trang đăng nhập
/employees                      → Danh sách nhân viên
/employees/123                  → Chi tiết nhân viên có ID = 123
/employees?department=engineering → Lọc nhân viên theo phòng ban
/employees?page=2&limit=20      → Trang 2, mỗi trang 20 items
```

---

## Phần 2: HTML - Cấu Trúc Trang Web

### 2.1 HTML Là Gì?

**HTML (HyperText Markup Language)** là ngôn ngữ đánh dấu để tạo cấu trúc trang web.

HTML sử dụng **tags** (thẻ) để đánh dấu nội dung:

```html
<tagname>Nội dung</tagname>
└──┬───┘           └───┬───┘
Opening tag      Closing tag
```

**Ví dụ:**
```html
<h1>Tiêu đề</h1>
<p>Đây là đoạn văn bản.</p>
<button>Click me</button>
```

### 2.2 Cấu Trúc HTML Cơ Bản

```html
<!DOCTYPE html>                    <!-- Khai báo đây là HTML5 -->
<html lang="vi">                   <!-- Thẻ gốc, lang = ngôn ngữ -->
<head>                             <!-- Phần header - metadata -->
  <meta charset="UTF-8">           <!-- Encoding ký tự (hỗ trợ tiếng Việt) -->
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>HR Tool</title>           <!-- Tiêu đề trên tab browser -->
  <link rel="stylesheet" href="styles.css">  <!-- Link đến file CSS -->
</head>
<body>                             <!-- Phần body - nội dung hiển thị -->

  <header>                         <!-- Header của trang -->
    <nav>...</nav>                 <!-- Navigation menu -->
  </header>

  <main>                           <!-- Nội dung chính -->
    <h1>Dashboard</h1>
    <p>Chào mừng!</p>
  </main>

  <footer>                         <!-- Footer của trang -->
    <p>© 2026 HR Tool</p>
  </footer>

  <script src="app.js"></script>   <!-- Link đến file JavaScript -->
</body>
</html>
```

### 2.3 Các Tags HTML Quan Trọng Cho QC

#### Text & Headings

```html
<!-- Headings - từ h1 (lớn nhất) đến h6 (nhỏ nhất) -->
<h1>Heading 1 - Tiêu đề chính</h1>
<h2>Heading 2 - Tiêu đề phụ</h2>
<h3>Heading 3</h3>

<!-- Paragraph - đoạn văn -->
<p>Đây là một đoạn văn bản.</p>

<!-- Span - inline text, thường dùng để style một phần -->
<p>Giá: <span class="price">100,000 VND</span></p>

<!-- Strong & Em - nhấn mạnh -->
<strong>Quan trọng</strong>  <!-- In đậm -->
<em>Nhấn mạnh</em>          <!-- In nghiêng -->
```

**Test point:** Kiểm tra text hiển thị đúng, không bị cắt, đúng font size.

#### Links & Buttons

```html
<!-- Link - liên kết -->
<a href="/employees">Xem nhân viên</a>
<a href="https://google.com" target="_blank">Mở tab mới</a>

<!-- Button -->
<button type="button">Click me</button>
<button type="submit">Gửi form</button>
<button disabled>Disabled button</button>
```

| Attribute | Ý nghĩa | Test point |
|-----------|---------|------------|
| `href` | URL đích của link | Click có navigate đúng không? |
| `target="_blank"` | Mở tab mới | Tab mới có mở không? |
| `disabled` | Vô hiệu hóa | Button có click được không? Style có thay đổi? |
| `type="submit"` | Submit form | Form có submit không? |

#### Forms & Inputs

```html
<form id="login-form" action="/api/login" method="POST">

  <!-- Text input -->
  <label for="email">Email:</label>
  <input
    type="email"
    id="email"
    name="email"
    placeholder="Nhập email..."
    required
    maxlength="100"
  >

  <!-- Password input -->
  <label for="password">Mật khẩu:</label>
  <input
    type="password"
    id="password"
    name="password"
    required
    minlength="6"
  >

  <!-- Select dropdown -->
  <label for="department">Phòng ban:</label>
  <select id="department" name="department">
    <option value="">-- Chọn phòng ban --</option>
    <option value="engineering">Engineering</option>
    <option value="hr">HR</option>
    <option value="marketing">Marketing</option>
  </select>

  <!-- Checkbox -->
  <label>
    <input type="checkbox" name="remember" value="1">
    Ghi nhớ đăng nhập
  </label>

  <!-- Radio buttons -->
  <label>
    <input type="radio" name="gender" value="male"> Nam
  </label>
  <label>
    <input type="radio" name="gender" value="female"> Nữ
  </label>

  <!-- Textarea -->
  <label for="notes">Ghi chú:</label>
  <textarea id="notes" name="notes" rows="4" cols="50"></textarea>

  <!-- File upload -->
  <label for="cv">Upload CV:</label>
  <input type="file" id="cv" name="cv" accept=".pdf,.doc,.docx">

  <!-- Submit button -->
  <button type="submit">Đăng nhập</button>

</form>
```

**Input Types quan trọng:**

| Type | Hiển thị | Validation mặc định |
|------|----------|---------------------|
| `text` | Text box thường | Không |
| `email` | Text box | Phải có @ và domain |
| `password` | Text ẩn bằng ●●● | Không |
| `number` | Chỉ nhập số | Chỉ cho phép số |
| `tel` | Số điện thoại | Không (chỉ gợi ý keyboard mobile) |
| `date` | Date picker | Định dạng date |
| `file` | File chooser | Không |
| `checkbox` | Ô tick | Không |
| `radio` | Nút chọn | Chỉ chọn 1 trong group |

**Input Attributes quan trọng:**

| Attribute | Ý nghĩa | Test point |
|-----------|---------|------------|
| `required` | Bắt buộc nhập | Validation có chạy không? |
| `disabled` | Không cho nhập | Input có disabled không? |
| `readonly` | Chỉ đọc, không sửa | Có sửa được không? |
| `placeholder` | Text gợi ý | Placeholder có hiển thị? |
| `maxlength="100"` | Tối đa 100 ký tự | Có nhập quá được không? |
| `minlength="6"` | Tối thiểu 6 ký tự | Validation có chạy? |
| `pattern="[0-9]+"` | Regex validation | Validation có đúng? |
| `value="default"` | Giá trị mặc định | Có hiển thị đúng? |

#### Tables

```html
<table>
  <thead>                          <!-- Header của table -->
    <tr>                           <!-- Table Row -->
      <th>ID</th>                  <!-- Table Header cell -->
      <th>Tên</th>
      <th>Email</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>                          <!-- Body của table -->
    <tr>
      <td>1</td>                   <!-- Table Data cell -->
      <td>Nguyễn Văn A</td>
      <td>a@example.com</td>
      <td>
        <button>Sửa</button>
        <button>Xóa</button>
      </td>
    </tr>
    <tr>
      <td>2</td>
      <td>Trần Thị B</td>
      <td>b@example.com</td>
      <td>
        <button>Sửa</button>
        <button>Xóa</button>
      </td>
    </tr>
  </tbody>
</table>
```

**Test points cho Table:**
- [ ] Dữ liệu hiển thị đúng cột
- [ ] Sorting hoạt động (nếu có)
- [ ] Pagination hoạt động
- [ ] Actions (Sửa/Xóa) hoạt động
- [ ] Empty state khi không có data

#### Lists

```html
<!-- Unordered list - danh sách không thứ tự (bullet points) -->
<ul>
  <li>Item 1</li>
  <li>Item 2</li>
  <li>Item 3</li>
</ul>

<!-- Ordered list - danh sách có thứ tự (1, 2, 3...) -->
<ol>
  <li>Bước 1</li>
  <li>Bước 2</li>
  <li>Bước 3</li>
</ol>
```

#### Divs & Semantic Tags

```html
<!-- Div - container chung, không có ý nghĩa ngữ nghĩa -->
<div class="card">
  <div class="card-header">...</div>
  <div class="card-body">...</div>
</div>

<!-- Semantic tags - có ý nghĩa rõ ràng -->
<header>Header của trang</header>
<nav>Navigation menu</nav>
<main>Nội dung chính</main>
<aside>Sidebar</aside>
<section>Một section</section>
<article>Một bài viết</article>
<footer>Footer của trang</footer>
```

### 2.4 Attributes (Thuộc Tính)

Attributes cung cấp thông tin thêm cho elements:

```html
<element attribute="value">Content</element>
```

**Common Attributes:**

| Attribute | Dùng cho | Ý nghĩa |
|-----------|----------|---------|
| `id` | Mọi element | Định danh duy nhất |
| `class` | Mọi element | Tên class CSS |
| `style` | Mọi element | Inline CSS |
| `title` | Mọi element | Tooltip khi hover |
| `data-*` | Mọi element | Custom data |
| `aria-*` | Mọi element | Accessibility |

**Ví dụ:**
```html
<button
  id="submit-btn"
  class="btn btn-primary"
  data-testid="login-button"
  aria-label="Đăng nhập vào hệ thống"
  disabled
>
  Đăng nhập
</button>
```

---

## Phần 3: CSS - Giao Diện

### 3.1 CSS Là Gì?

**CSS (Cascading Style Sheets)** dùng để tạo giao diện (màu sắc, layout, animation...) cho HTML.

**Cú pháp:**
```css
selector {
  property: value;
  property: value;
}
```

**Ví dụ:**
```css
.button {
  background-color: blue;
  color: white;
  padding: 10px 20px;
}
```

### 3.2 CSS Selectors

```css
/* Element selector - chọn tất cả elements cùng loại */
button { }
p { }
h1 { }

/* Class selector - chọn elements có class (dấu chấm .) */
.btn { }
.btn-primary { }
.error-message { }

/* ID selector - chọn element có id (dấu #) */
#login-form { }
#submit-button { }

/* Attribute selector - chọn theo attribute */
input[type="email"] { }
button[disabled] { }
a[href^="https"] { }        /* href bắt đầu bằng "https" */

/* Descendant selector - chọn con cháu */
.card .title { }            /* .title bên trong .card */
form input { }              /* input bên trong form */

/* Child selector - chỉ chọn con trực tiếp */
.card > .title { }

/* Pseudo-classes - trạng thái đặc biệt */
button:hover { }            /* Khi hover */
input:focus { }             /* Khi được focus */
button:disabled { }         /* Khi disabled */
li:first-child { }          /* Li đầu tiên */
li:last-child { }           /* Li cuối cùng */
tr:nth-child(2n) { }        /* Các row chẵn */

/* Pseudo-elements */
p::before { }               /* Thêm content trước */
p::after { }                /* Thêm content sau */
input::placeholder { }      /* Style placeholder */
```

### 3.3 CSS Properties Quan Trọng

#### Colors & Background

```css
.element {
  /* Text color */
  color: #333;                    /* Hex color */
  color: rgb(51, 51, 51);         /* RGB */
  color: rgba(51, 51, 51, 0.5);   /* RGB với opacity */

  /* Background */
  background-color: #f5f5f5;
  background-image: url('bg.png');
  background-size: cover;
}
```

#### Spacing (Margin & Padding)

```css
/*
  Margin: khoảng cách BÊN NGOÀI element
  Padding: khoảng cách BÊN TRONG element

  ┌─────────────────────────────────────┐
  │           MARGIN                    │
  │   ┌─────────────────────────────┐   │
  │   │       BORDER                │   │
  │   │   ┌─────────────────────┐   │   │
  │   │   │     PADDING         │   │   │
  │   │   │   ┌─────────────┐   │   │   │
  │   │   │   │  CONTENT    │   │   │   │
  │   │   │   └─────────────┘   │   │   │
  │   │   └─────────────────────┘   │   │
  │   └─────────────────────────────┘   │
  └─────────────────────────────────────┘
*/

.element {
  /* Margin */
  margin: 10px;                /* Tất cả 4 phía */
  margin: 10px 20px;           /* top/bottom: 10px, left/right: 20px */
  margin: 10px 20px 30px 40px; /* top, right, bottom, left */
  margin-top: 10px;
  margin-right: 20px;
  margin-bottom: 10px;
  margin-left: 20px;

  /* Padding - tương tự margin */
  padding: 10px;
  padding: 10px 20px;
}
```

#### Sizing

```css
.element {
  width: 100px;              /* Chiều rộng cố định */
  width: 50%;                /* 50% của parent */
  width: 100vw;              /* 100% viewport width */
  max-width: 500px;          /* Tối đa 500px */
  min-width: 200px;          /* Tối thiểu 200px */

  height: 100px;
  height: auto;              /* Tự động theo content */
  height: 100vh;             /* 100% viewport height */
}
```

#### Display & Visibility

```css
.element {
  /* Display */
  display: block;            /* Chiếm toàn bộ dòng */
  display: inline;           /* Cùng dòng với text */
  display: inline-block;     /* Inline nhưng có width/height */
  display: flex;             /* Flexbox layout */
  display: grid;             /* Grid layout */
  display: none;             /* ẨN HOÀN TOÀN - không chiếm chỗ */

  /* Visibility */
  visibility: visible;
  visibility: hidden;        /* Ẩn nhưng VẪN CHIẾM CHỖ */

  /* Opacity */
  opacity: 1;                /* Hiển thị hoàn toàn */
  opacity: 0.5;              /* 50% trong suốt */
  opacity: 0;                /* Hoàn toàn trong suốt nhưng vẫn chiếm chỗ */
}
```

**So sánh cách ẩn element:**

| Property | Ẩn? | Chiếm chỗ? | Tương tác được? |
|----------|-----|------------|-----------------|
| `display: none` | ✅ | ❌ | ❌ |
| `visibility: hidden` | ✅ | ✅ | ❌ |
| `opacity: 0` | ✅ | ✅ | ✅ |

#### Position

```css
.element {
  position: static;          /* Default - theo document flow */
  position: relative;        /* Relative to normal position */
  position: absolute;        /* Relative to nearest positioned parent */
  position: fixed;           /* Fixed to viewport */
  position: sticky;          /* Sticky when scrolling */

  /* Dùng với top, right, bottom, left */
  top: 10px;
  right: 20px;
  bottom: 10px;
  left: 20px;

  /* Z-index - thứ tự chồng lên */
  z-index: 1;
  z-index: 100;
  z-index: 9999;
}
```

#### Border

```css
.element {
  border: 1px solid #ccc;           /* width style color */
  border-radius: 8px;               /* Bo góc */
  border-radius: 50%;               /* Hình tròn */

  /* Riêng từng phía */
  border-top: 2px solid red;
  border-bottom: none;
}
```

#### Typography

```css
.element {
  font-family: Arial, sans-serif;
  font-size: 16px;
  font-size: 1rem;                  /* Relative to root */
  font-weight: normal;              /* 400 */
  font-weight: bold;                /* 700 */
  font-style: italic;

  text-align: left;
  text-align: center;
  text-align: right;

  text-decoration: none;            /* Bỏ underline */
  text-decoration: underline;

  line-height: 1.5;                 /* Khoảng cách dòng */
  letter-spacing: 1px;              /* Khoảng cách chữ */
}
```

### 3.4 CSS States Quan Trọng Cho Testing

```css
/* Normal state */
.button {
  background-color: blue;
  cursor: pointer;
}

/* Hover - khi mouse di chuyển lên */
.button:hover {
  background-color: darkblue;
}

/* Focus - khi element được focus (tab hoặc click) */
.input:focus {
  border-color: blue;
  outline: 2px solid lightblue;
}

/* Active - khi đang click */
.button:active {
  transform: scale(0.98);
}

/* Disabled - khi bị vô hiệu hóa */
.button:disabled {
  background-color: gray;
  cursor: not-allowed;
  opacity: 0.5;
}

/* Error state - thường dùng class */
.input.error {
  border-color: red;
}

/* Loading state */
.button.loading {
  pointer-events: none;
  opacity: 0.7;
}

/* Selected/Active state */
.tab.active {
  border-bottom: 2px solid blue;
}
```

**Test points cho CSS states:**

| State | Test |
|-------|------|
| Hover | Di chuột lên, kiểm tra style thay đổi |
| Focus | Tab đến element, kiểm tra focus ring |
| Active | Click và giữ, kiểm tra feedback |
| Disabled | Kiểm tra không click được, style khác |
| Loading | Kiểm tra loading indicator hiển thị |
| Error | Kiểm tra error styling khi validation fail |

### 3.5 Responsive Design

```css
/* Mobile first approach */
.container {
  width: 100%;
  padding: 10px;
}

/* Tablet - 768px trở lên */
@media (min-width: 768px) {
  .container {
    width: 750px;
    padding: 20px;
  }
}

/* Desktop - 1024px trở lên */
@media (min-width: 1024px) {
  .container {
    width: 960px;
    padding: 30px;
  }
}

/* Large desktop - 1280px trở lên */
@media (min-width: 1280px) {
  .container {
    width: 1200px;
  }
}
```

**Breakpoints phổ biến:**

| Device | Width | Test |
|--------|-------|------|
| Mobile Portrait | 320px - 480px | iPhone SE |
| Mobile Landscape | 480px - 640px | iPhone landscape |
| Tablet Portrait | 640px - 768px | iPad portrait |
| Tablet Landscape | 768px - 1024px | iPad landscape |
| Desktop | 1024px - 1280px | Laptop |
| Large Desktop | > 1280px | Desktop monitor |

---

## Phần 4: JavaScript Cơ Bản

### 4.1 JavaScript Là Gì?

**JavaScript** là ngôn ngữ lập trình giúp website có thể tương tác, xử lý sự kiện, gọi API, cập nhật giao diện mà không cần refresh trang.

### 4.2 Biến (Variables)

```javascript
// var - cách cũ, KHÔNG nên dùng
var oldWay = "don't use this";

// let - biến có thể thay đổi giá trị
let count = 0;
count = 1;           // OK
count = 2;           // OK

// const - hằng số, KHÔNG thể thay đổi
const PI = 3.14159;
PI = 3.14;           // ERROR!

// Với object/array, const chỉ không cho reassign
// nhưng vẫn có thể modify nội dung
const user = { name: "John" };
user.name = "Jane";  // OK - chỉ modify property
user = {};           // ERROR - không thể reassign
```

**Quy tắc đặt tên:**
- Bắt đầu bằng chữ cái, `_`, hoặc `$`
- Không bắt đầu bằng số
- Case-sensitive: `name` và `Name` là khác nhau
- Dùng camelCase: `firstName`, `lastName`, `getUserById`

### 4.3 Kiểu Dữ Liệu (Data Types)

```javascript
// String - chuỗi ký tự
const name = "Nguyễn Văn A";
const greeting = 'Hello';
const template = `Xin chào ${name}`;  // Template literal

// Number - số
const age = 25;
const price = 99.99;
const negative = -10;

// Boolean - true/false
const isActive = true;
const isDeleted = false;

// Null - giá trị rỗng có chủ đích
const data = null;

// Undefined - chưa được gán giá trị
let something;
console.log(something);  // undefined

// Array - mảng
const numbers = [1, 2, 3, 4, 5];
const mixed = [1, "two", true, null];
const employees = [
  { name: "A", age: 25 },
  { name: "B", age: 30 }
];

// Object - đối tượng
const employee = {
  id: 1,
  name: "Nguyễn Văn A",
  email: "a@example.com",
  department: {
    id: 1,
    name: "Engineering"
  },
  skills: ["JavaScript", "React", "Node.js"]
};
```

### 4.4 Operators (Toán tử)

```javascript
// Arithmetic - Toán học
5 + 3    // 8   - Cộng
5 - 3    // 2   - Trừ
5 * 3    // 15  - Nhân
5 / 3    // 1.67 - Chia
5 % 3    // 2   - Chia lấy dư
5 ** 3   // 125 - Lũy thừa

// Assignment - Gán giá trị
let x = 10;
x += 5;   // x = x + 5 = 15
x -= 3;   // x = x - 3 = 12
x *= 2;   // x = x * 2 = 24
x /= 4;   // x = x / 4 = 6

// Comparison - So sánh
5 == "5"   // true  - So sánh giá trị (loose equality)
5 === "5"  // false - So sánh giá trị VÀ kiểu (strict equality)
5 != "5"   // false
5 !== "5"  // true
5 > 3      // true
5 >= 5     // true
5 < 3      // false
5 <= 5     // true

// Logical - Logic
true && true    // true   - AND
true && false   // false
true || false   // true   - OR
false || false  // false
!true           // false  - NOT
!false          // true

// Ternary - Điều kiện ngắn gọn
const status = age >= 18 ? "adult" : "minor";
// Tương đương:
// if (age >= 18) { status = "adult"; } else { status = "minor"; }
```

### 4.5 Điều Kiện (Conditionals)

```javascript
// if - else
const score = 85;

if (score >= 90) {
  console.log("Xuất sắc");
} else if (score >= 70) {
  console.log("Khá");
} else if (score >= 50) {
  console.log("Trung bình");
} else {
  console.log("Yếu");
}

// switch - case
const role = "admin";

switch (role) {
  case "super_admin":
    console.log("Full access");
    break;
  case "admin":
    console.log("Company access");
    break;
  case "hr":
    console.log("HR access");
    break;
  default:
    console.log("Limited access");
}

// Truthy & Falsy values
// Falsy: false, 0, "", null, undefined, NaN
// Truthy: mọi thứ khác

if (username) {
  // username có giá trị (không phải "", null, undefined)
}

// Short-circuit evaluation
const displayName = user.name || "Guest";  // Nếu name falsy, dùng "Guest"
const email = user?.email ?? "N/A";        // Nếu email null/undefined, dùng "N/A"
```

### 4.6 Vòng Lặp (Loops)

```javascript
// for - lặp với số lần biết trước
for (let i = 0; i < 5; i++) {
  console.log(i);  // 0, 1, 2, 3, 4
}

// for...of - lặp qua mảng (lấy VALUE)
const fruits = ["apple", "banana", "orange"];
for (const fruit of fruits) {
  console.log(fruit);  // "apple", "banana", "orange"
}

// for...in - lặp qua object (lấy KEY)
const user = { name: "A", age: 25 };
for (const key in user) {
  console.log(key, user[key]);  // "name" "A", "age" 25
}

// while - lặp khi điều kiện đúng
let count = 0;
while (count < 5) {
  console.log(count);
  count++;
}

// forEach - method của array
const numbers = [1, 2, 3, 4, 5];
numbers.forEach((num, index) => {
  console.log(`Index ${index}: ${num}`);
});
```

### 4.7 Functions (Hàm)

```javascript
// Function declaration
function greet(name) {
  return `Hello, ${name}!`;
}
greet("Minh");  // "Hello, Minh!"

// Function với default parameter
function greet(name = "Guest") {
  return `Hello, ${name}!`;
}
greet();        // "Hello, Guest!"
greet("Minh");  // "Hello, Minh!"

// Arrow function (cách viết ngắn gọn)
const greet = (name) => {
  return `Hello, ${name}!`;
};

// Arrow function ngắn hơn (1 expression)
const greet = (name) => `Hello, ${name}!`;
const double = (x) => x * 2;
const sum = (a, b) => a + b;

// Function với nhiều parameters
const createEmployee = (name, email, department) => {
  return {
    name,
    email,
    department,
    createdAt: new Date()
  };
};

// Destructuring parameters
const printUser = ({ name, email }) => {
  console.log(`${name} - ${email}`);
};
printUser({ name: "A", email: "a@test.com", age: 25 });
```

### 4.8 Array Methods (Quan trọng!)

```javascript
const employees = [
  { id: 1, name: "A", department: "Engineering", salary: 1000 },
  { id: 2, name: "B", department: "HR", salary: 800 },
  { id: 3, name: "C", department: "Engineering", salary: 1200 },
  { id: 4, name: "D", department: "Marketing", salary: 900 }
];

// map - biến đổi từng phần tử, trả về array mới
const names = employees.map(emp => emp.name);
// ["A", "B", "C", "D"]

const summaries = employees.map(emp => ({
  name: emp.name,
  dept: emp.department
}));
// [{ name: "A", dept: "Engineering" }, ...]

// filter - lọc phần tử thỏa điều kiện
const engineers = employees.filter(emp => emp.department === "Engineering");
// [{ id: 1, ... }, { id: 3, ... }]

const highSalary = employees.filter(emp => emp.salary > 900);
// [{ id: 1, ... }, { id: 3, ... }]

// find - tìm phần tử ĐẦU TIÊN thỏa điều kiện
const emp = employees.find(emp => emp.id === 2);
// { id: 2, name: "B", ... }

const notFound = employees.find(emp => emp.id === 999);
// undefined

// findIndex - tìm INDEX của phần tử đầu tiên thỏa điều kiện
const index = employees.findIndex(emp => emp.name === "C");
// 2

// some - kiểm tra CÓ ÍT NHẤT 1 phần tử thỏa điều kiện
const hasEngineer = employees.some(emp => emp.department === "Engineering");
// true

// every - kiểm tra TẤT CẢ phần tử thỏa điều kiện
const allHighSalary = employees.every(emp => emp.salary > 500);
// true

// reduce - tính toán tích lũy
const totalSalary = employees.reduce((total, emp) => total + emp.salary, 0);
// 3900

// sort - sắp xếp (THAY ĐỔI array gốc!)
const sortedBySalary = [...employees].sort((a, b) => b.salary - a.salary);
// Sắp xếp giảm dần theo salary

// includes - kiểm tra có phần tử trong array
const ids = [1, 2, 3];
ids.includes(2);  // true
ids.includes(5);  // false

// Chaining methods
const result = employees
  .filter(emp => emp.department === "Engineering")
  .map(emp => emp.name)
  .sort();
// ["A", "C"]
```

### 4.9 Objects

```javascript
// Tạo object
const employee = {
  id: 1,
  name: "Nguyễn Văn A",
  email: "a@example.com",
  department: {
    id: 1,
    name: "Engineering"
  }
};

// Truy cập properties
employee.name;              // "Nguyễn Văn A"
employee["name"];           // "Nguyễn Văn A"
employee.department.name;   // "Engineering"

// Optional chaining (?.): tránh lỗi khi null/undefined
employee?.department?.name;  // "Engineering"
employee?.manager?.name;     // undefined (không lỗi)

// Destructuring - trích xuất properties
const { name, email } = employee;
console.log(name);   // "Nguyễn Văn A"
console.log(email);  // "a@example.com"

// Destructuring với rename
const { name: empName, email: empEmail } = employee;

// Destructuring với default value
const { name, phone = "N/A" } = employee;

// Nested destructuring
const { department: { name: deptName } } = employee;

// Spread operator - copy/merge objects
const updated = { ...employee, name: "New Name" };
const merged = { ...obj1, ...obj2 };

// Object.keys, Object.values, Object.entries
Object.keys(employee);    // ["id", "name", "email", "department"]
Object.values(employee);  // [1, "Nguyễn Văn A", "a@example.com", {...}]
Object.entries(employee); // [["id", 1], ["name", "Nguyễn Văn A"], ...]
```

### 4.10 Async/Await & Promises

```javascript
// Promise - đại diện cho một giá trị sẽ có trong tương lai
const promise = new Promise((resolve, reject) => {
  // Async operation
  setTimeout(() => {
    const success = true;
    if (success) {
      resolve("Data loaded");
    } else {
      reject("Error loading data");
    }
  }, 1000);
});

// Sử dụng Promise với .then/.catch
promise
  .then(result => console.log(result))
  .catch(error => console.error(error));

// Async/Await - cách viết gọn hơn (KHUYÊN DÙNG)
async function fetchData() {
  try {
    const response = await fetch('/api/employees');
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

// Arrow function async
const fetchEmployees = async () => {
  try {
    const response = await fetch('/api/employees');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch:', error);
    throw error;
  }
};

// Gọi nhiều async operations song song
const [employees, departments] = await Promise.all([
  fetch('/api/employees').then(r => r.json()),
  fetch('/api/departments').then(r => r.json())
]);
```

### 4.11 DOM Manipulation

```javascript
// Tìm elements
const button = document.getElementById('submit-btn');
const inputs = document.getElementsByClassName('form-input');
const form = document.querySelector('#login-form');
const allButtons = document.querySelectorAll('button');

// Đọc/sửa nội dung
element.textContent = 'New text';      // Chỉ text
element.innerHTML = '<b>Bold text</b>'; // HTML
element.value = 'input value';          // Cho input

// Đọc/sửa attributes
element.getAttribute('href');
element.setAttribute('href', '/new-url');
element.removeAttribute('disabled');

// Đọc/sửa class
element.classList.add('active');
element.classList.remove('active');
element.classList.toggle('active');
element.classList.contains('active');  // true/false

// Đọc/sửa style
element.style.color = 'red';
element.style.backgroundColor = 'blue';
element.style.display = 'none';

// Events
button.addEventListener('click', (event) => {
  console.log('Button clicked!');
  console.log(event.target);  // Element được click
});

form.addEventListener('submit', (event) => {
  event.preventDefault();  // Ngăn form submit mặc định
  console.log('Form submitted!');
});

input.addEventListener('change', (event) => {
  console.log('New value:', event.target.value);
});
```

---

## Phần 5: TypeScript Cơ Bản

### 5.1 TypeScript Là Gì?

**TypeScript** là JavaScript với **types** (kiểu dữ liệu). TypeScript giúp:
- Phát hiện lỗi sớm (trước khi chạy)
- Code dễ đọc, dễ hiểu hơn
- IDE hỗ trợ tốt hơn (autocomplete, navigation)

**Playwright sử dụng TypeScript**, nên QC cần hiểu cơ bản.

### 5.2 Basic Types

```typescript
// Khai báo kiểu dữ liệu với dấu :
let name: string = "Minh";
let age: number = 25;
let isActive: boolean = true;

// Array
let numbers: number[] = [1, 2, 3];
let names: string[] = ["A", "B", "C"];
let mixed: (string | number)[] = [1, "two", 3];  // Union type

// Object với interface
interface Employee {
  id: number;
  name: string;
  email: string;
  department?: string;  // Optional (có thể không có)
  salary: number;
}

const emp: Employee = {
  id: 1,
  name: "A",
  email: "a@test.com",
  salary: 1000
};

// Type alias
type Status = "active" | "inactive" | "pending";
type ID = string | number;

let status: Status = "active";
status = "deleted";  // ERROR! Không nằm trong danh sách cho phép
```

### 5.3 Function Types

```typescript
// Function với parameter types và return type
function greet(name: string): string {
  return `Hello, ${name}!`;
}

// Arrow function
const add = (a: number, b: number): number => {
  return a + b;
};

// Function với optional parameter
function greet(name: string, greeting?: string): string {
  return `${greeting || "Hello"}, ${name}!`;
}
greet("Minh");           // "Hello, Minh!"
greet("Minh", "Hi");     // "Hi, Minh!"

// Function với default parameter
function greet(name: string, greeting: string = "Hello"): string {
  return `${greeting}, ${name}!`;
}

// Async function
async function fetchEmployee(id: number): Promise<Employee> {
  const response = await fetch(`/api/employees/${id}`);
  const data = await response.json();
  return data;
}

// Function không return gì
function logMessage(message: string): void {
  console.log(message);
}
```

### 5.4 Interfaces & Types

```typescript
// Interface - định nghĩa cấu trúc object
interface User {
  id: number;
  email: string;
  name: string;
  role: "admin" | "hr" | "tech_lead";
  createdAt: Date;
}

interface Employee extends User {  // Kế thừa từ User
  employeeCode: string;
  departmentId: number;
  salary: number;
}

// Type - có thể dùng tương tự interface
type Status = "pending" | "approved" | "rejected";

type ApiResponse<T> = {
  data: T;
  message: string;
  success: boolean;
};

// Generic - kiểu dữ liệu động
interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

// Sử dụng
const employeeList: PaginatedResponse<Employee> = {
  items: [...],
  total: 100,
  page: 1,
  limit: 10
};
```

### 5.5 Type Assertions

```typescript
// Khi bạn biết rõ kiểu hơn TypeScript
const input = document.querySelector('#email') as HTMLInputElement;
input.value = "test@example.com";

// Hoặc dùng <>
const input = <HTMLInputElement>document.querySelector('#email');

// Non-null assertion (!)
const element = document.getElementById('app')!;  // Chắc chắn không null
```

### 5.6 Utility Types

```typescript
interface Employee {
  id: number;
  name: string;
  email: string;
  salary: number;
}

// Partial - tất cả properties thành optional
type PartialEmployee = Partial<Employee>;
// { id?: number; name?: string; email?: string; salary?: number; }

// Required - tất cả properties thành bắt buộc
type RequiredEmployee = Required<Employee>;

// Pick - chọn một số properties
type EmployeeName = Pick<Employee, "id" | "name">;
// { id: number; name: string; }

// Omit - loại bỏ một số properties
type EmployeeWithoutSalary = Omit<Employee, "salary">;
// { id: number; name: string; email: string; }

// Record - tạo object type
type EmployeeMap = Record<string, Employee>;
// { [key: string]: Employee }
```

### 5.7 TypeScript trong Playwright

```typescript
// tests/login.spec.ts
import { test, expect, Page } from '@playwright/test';

// Interface cho test data
interface LoginCredentials {
  email: string;
  password: string;
}

// Interface cho user
interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'hr' | 'tech_lead';
}

// Page Object với TypeScript
class LoginPage {
  // Khai báo type cho page
  constructor(private page: Page) {}

  // Methods với return types
  async goto(): Promise<void> {
    await this.page.goto('/login');
  }

  async login(credentials: LoginCredentials): Promise<void> {
    await this.page.getByLabel('Email').fill(credentials.email);
    await this.page.getByLabel('Password').fill(credentials.password);
    await this.page.getByRole('button', { name: /login/i }).click();
  }

  async getErrorMessage(): Promise<string | null> {
    const error = this.page.locator('.error-message');
    if (await error.isVisible()) {
      return await error.textContent();
    }
    return null;
  }
}

// Test với typed data
test('login with valid credentials', async ({ page }) => {
  const loginPage = new LoginPage(page);

  const credentials: LoginCredentials = {
    email: 'admin@test.com',
    password: 'password123'
  };

  await loginPage.goto();
  await loginPage.login(credentials);

  await expect(page).toHaveURL(/.*dashboard/);
});

// API response type
interface ApiResponse<T> {
  result: {
    data: {
      json: T;
    };
  };
}

interface EmployeeListResponse {
  items: User[];
  total: number;
  page: number;
  limit: number;
}

test('fetch employees API', async ({ request }) => {
  const response = await request.post('/trpc/employee.list', {
    data: { json: { page: 1, limit: 10 } }
  });

  const body: ApiResponse<EmployeeListResponse> = await response.json();

  expect(body.result.data.json.items).toBeDefined();
  expect(body.result.data.json.total).toBeGreaterThan(0);
});
```

---

## Phần 6: Browser DevTools

### 6.1 Mở DevTools

| OS | Phím tắt |
|----|----------|
| Windows/Linux | `F12` hoặc `Ctrl + Shift + I` |
| macOS | `Cmd + Option + I` |
| Chuột phải | Right-click → Inspect |

### 6.2 Elements Tab

**Dùng để:**
- Xem HTML structure
- Inspect element bất kỳ
- Edit HTML/CSS trực tiếp (temporary)
- Kiểm tra accessibility attributes

**Cách inspect element:**
1. Click vào icon góc trên trái (hoặc `Ctrl + Shift + C`)
2. Hover lên element cần inspect
3. Click để chọn

**Styles panel (bên phải):**
- Xem tất cả CSS rules áp dụng
- Computed tab: style cuối cùng được apply
- Edit trực tiếp để test

### 6.3 Console Tab

**Dùng để:**
- Xem JavaScript errors
- Xem console.log output
- Chạy JavaScript commands

**Các loại messages:**

| Icon | Loại | Ý nghĩa |
|------|------|---------|
| 🔴 | Error | Lỗi JavaScript, cần fix |
| 🟡 | Warning | Cảnh báo, nên xem xét |
| 🔵 | Info | Thông tin |
| ⚪ | Log | console.log output |

**Filter messages:**
```
// Trong Console
error           → Chỉ hiện errors
warning         → Chỉ hiện warnings
-error          → Ẩn errors
url:employee    → Messages liên quan đến "employee"
```

**Useful console commands:**

```javascript
// Clear console
clear()
// hoặc Ctrl + L

// Xem localStorage
localStorage

// Xem cookies
document.cookie

// Lấy element
document.querySelector('.button')
$('.button')  // Shortcut trong DevTools

// Lấy nhiều elements
document.querySelectorAll('button')
$$('button')  // Shortcut

// Copy text to clipboard
copy(document.querySelector('.data').innerText)

// Monitor events
monitorEvents(document.querySelector('button'), 'click')

// Đo thời gian
console.time('fetch');
// ... code ...
console.timeEnd('fetch');  // fetch: 123ms
```

### 6.4 Network Tab

**Dùng để:**
- Xem tất cả HTTP requests
- Debug API calls
- Kiểm tra response data
- Phân tích performance

**Columns quan trọng:**

| Column | Ý nghĩa |
|--------|---------|
| Name | URL của request |
| Status | HTTP status code (200, 404, 500...) |
| Type | Loại request (xhr, fetch, document, stylesheet, script, img) |
| Initiator | Code nào trigger request này |
| Size | Kích thước response |
| Time | Thời gian hoàn thành |
| Waterfall | Timeline visual |

**Filters:**

| Filter | Hiển thị |
|--------|----------|
| `XHR` | AJAX/Fetch requests |
| `Fetch` | Fetch API requests |
| `Doc` | HTML documents |
| `JS` | JavaScript files |
| `CSS` | CSS files |
| `Img` | Images |
| `WS` | WebSocket |
| `status-code:404` | Chỉ requests có status 404 |
| `method:POST` | Chỉ POST requests |
| `larger-than:1M` | Files > 1MB |
| `domain:api.example.com` | Chỉ requests đến domain này |

**Xem chi tiết request:**

1. Click vào request trong list
2. **Headers tab:**
   - General: URL, Method, Status
   - Request Headers: Headers gửi đi
   - Response Headers: Headers nhận về
3. **Payload tab:**
   - Request body (cho POST/PUT)
   - Query string parameters
4. **Response tab:**
   - Response body (JSON, HTML...)
5. **Preview tab:**
   - Formatted preview (JSON đẹp hơn)
6. **Timing tab:**
   - Chi tiết timing từng phase

**Preserve log:**
- Check "Preserve log" để giữ requests khi navigate
- Hữu ích khi debug redirect flows

**Throttling:**
- Click dropdown "No throttling"
- Chọn "Slow 3G" hoặc "Offline"
- Test loading states, error handling

### 6.5 Application Tab

**Local Storage:**
- Key-value storage
- Persist mãi mãi
- Chỉ truy cập từ same domain
- HR Tool lưu: accessToken, refreshToken, user, theme, language

**Session Storage:**
- Giống localStorage nhưng chỉ tồn tại trong session
- Đóng tab = mất data

**Cookies:**
- Gửi kèm mọi HTTP request đến domain
- Có expiration date
- Có thể HttpOnly (JS không đọc được)

**Test scenarios:**

| Action | Expected |
|--------|----------|
| Xóa accessToken từ localStorage | Redirect về login |
| Xóa tất cả cookies | Có thể logout |
| Edit accessToken thành invalid | 401 error khi gọi API |
| Clear All | Reset về trạng thái ban đầu |

### 6.6 Performance Tab

**Dùng để:**
- Record và analyze page performance
- Tìm bottlenecks
- Xem FPS, CPU usage

**Cách dùng:**
1. Click Record button
2. Thực hiện action cần test
3. Click Stop
4. Analyze timeline

### 6.7 Lighthouse Tab

**Dùng để:**
- Audit tự động
- Performance score
- Accessibility score
- SEO score
- Best practices

**Cách dùng:**
1. Click "Analyze page load"
2. Đợi audit chạy
3. Xem report và recommendations

---

## Phần 7: HTTP & API

### 7.1 HTTP Methods

| Method | Mục đích | Body? | Idempotent? |
|--------|----------|-------|-------------|
| **GET** | Đọc dữ liệu | Không | Có |
| **POST** | Tạo mới | Có | Không |
| **PUT** | Cập nhật toàn bộ | Có | Có |
| **PATCH** | Cập nhật một phần | Có | Có |
| **DELETE** | Xóa | Không/Có | Có |

**Idempotent:** Gọi nhiều lần cho cùng kết quả (GET cùng ID luôn trả về cùng data)

### 7.2 HTTP Status Codes

**2xx - Success:**

| Code | Tên | Ý nghĩa |
|------|-----|---------|
| 200 | OK | Request thành công |
| 201 | Created | Tạo mới thành công |
| 204 | No Content | Thành công, không có body (delete) |

**3xx - Redirection:**

| Code | Tên | Ý nghĩa |
|------|-----|---------|
| 301 | Moved Permanently | URL đã đổi vĩnh viễn |
| 302 | Found | Redirect tạm thời |
| 304 | Not Modified | Dùng cache |

**4xx - Client Error:**

| Code | Tên | Ý nghĩa | Nguyên nhân thường gặp |
|------|-----|---------|------------------------|
| 400 | Bad Request | Request không hợp lệ | JSON format sai, thiếu field |
| 401 | Unauthorized | Chưa xác thực | Token missing/expired |
| 403 | Forbidden | Không có quyền | Role không đủ permission |
| 404 | Not Found | Không tìm thấy | URL sai, resource đã xóa |
| 422 | Unprocessable Entity | Validation error | Data không pass validation |
| 429 | Too Many Requests | Rate limited | Gọi API quá nhiều |

**5xx - Server Error:**

| Code | Tên | Ý nghĩa | Nguyên nhân thường gặp |
|------|-----|---------|------------------------|
| 500 | Internal Server Error | Lỗi server | Bug trong code, exception |
| 502 | Bad Gateway | Gateway lỗi | Server downstream không response |
| 503 | Service Unavailable | Server không khả dụng | Server đang restart/maintain |
| 504 | Gateway Timeout | Timeout | Server xử lý quá lâu |

### 7.3 tRPC trong HR Tool

HR Tool sử dụng **tRPC** thay vì REST API truyền thống.

**Điểm khác biệt:**

| REST | tRPC |
|------|------|
| `GET /api/employees` | `POST /trpc/employee.list` |
| `GET /api/employees/123` | `POST /trpc/employee.getById` |
| `POST /api/employees` | `POST /trpc/employee.create` |
| `PUT /api/employees/123` | `POST /trpc/employee.update` |
| `DELETE /api/employees/123` | `POST /trpc/employee.delete` |

**tRPC Request Format:**

```json
// Request body
{
  "json": {
    "page": 1,
    "limit": 10,
    "search": "nguyen"
  }
}
```

**tRPC Response Format:**

```json
// Success response
{
  "result": {
    "data": {
      "json": {
        "items": [
          { "id": 1, "name": "Nguyễn Văn A", "email": "a@test.com" }
        ],
        "total": 100,
        "page": 1,
        "limit": 10,
        "totalPages": 10
      }
    }
  }
}

// Error response
{
  "error": {
    "message": "Invalid email or password",
    "code": "UNAUTHORIZED",
    "data": {
      "code": "UNAUTHORIZED",
      "httpStatus": 401
    }
  }
}
```

### 7.4 Authentication trong HR Tool

**Login flow:**

```
1. POST /trpc/auth.login
   Body: { "json": { "email": "...", "password": "..." } }

   Response: {
     "result": {
       "data": {
         "json": {
           "accessToken": "eyJhbG...",
           "refreshToken": "eyJhbG...",
           "user": { "id": "...", "email": "...", "role": "admin" }
         }
       }
     }
   }

2. Lưu tokens vào localStorage
   localStorage.setItem('accessToken', accessToken)
   localStorage.setItem('refreshToken', refreshToken)

3. Các request sau gửi kèm header:
   Authorization: Bearer eyJhbG...

4. Khi accessToken hết hạn:
   POST /trpc/auth.refresh
   Body: { "json": { "refreshToken": "..." } }
   → Nhận accessToken mới

5. Logout:
   POST /trpc/auth.logout
   + localStorage.removeItem('accessToken')
   + localStorage.removeItem('refreshToken')
```

**JWT Structure:**

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
└──────────────┬──────────────┘.└───────────────────────┬───────────────────────┘.└──────────────────────┬──────────────────────┘
           Header                                   Payload                                        Signature
           (Algorithm, Type)                        (Data: user id, expiry...)                     (Verify integrity)
```

**Decode JWT:** https://jwt.io

---

## Phần 8: Common Issues & Debugging

### 8.1 CORS Error

```
Access to fetch at 'https://api.example.com' from origin 'https://app.example.com'
has been blocked by CORS policy
```

**Nguyên nhân:** Browser chặn request từ domain khác vì lý do bảo mật.

**Giải pháp:** Backend cần configure CORS headers. **QC report cho Dev.**

### 8.2 401 Unauthorized

**Checklist:**
- [ ] Đã login chưa?
- [ ] Token có trong localStorage không?
- [ ] Token đã hết hạn chưa? (decode JWT xem `exp`)
- [ ] Header `Authorization: Bearer ...` có được gửi không?
- [ ] Token có đúng format không?

### 8.3 403 Forbidden

**Checklist:**
- [ ] User đã login (401 khác 403)
- [ ] User có quyền access resource này không?
- [ ] Role của user là gì? (admin, hr, tech_lead)
- [ ] Resource có thuộc company của user không?

### 8.4 404 Not Found

**Checklist:**
- [ ] URL có đúng không?
- [ ] Resource (employee, job...) có tồn tại không?
- [ ] ID có đúng không?
- [ ] Server có đang chạy không?

### 8.5 500 Internal Server Error

**Checklist:**
- [ ] Request body có đúng format?
- [ ] Có field nào required bị thiếu?
- [ ] Data types có đúng không? (string vs number)
- [ ] Kiểm tra server logs (hỏi Dev)

### 8.6 UI Issues

**Element không hiển thị:**
- [ ] Kiểm tra `display: none` trong CSS
- [ ] Kiểm tra `visibility: hidden`
- [ ] Kiểm tra `opacity: 0`
- [ ] Element có trong DOM không? (Elements tab)
- [ ] Conditional render (if) có đúng không?

**Click không hoạt động:**
- [ ] Element có `disabled` attribute không?
- [ ] Có element khác đè lên không? (z-index)
- [ ] Event handler có được attach không? (Console errors)
- [ ] `pointer-events: none` trong CSS?

**Data không load:**
- [ ] Network tab có request không?
- [ ] Request có trả về 200 không?
- [ ] Response data có đúng format không?
- [ ] Console có error không?

---

## Quick Reference

### Phím tắt DevTools

| Action | Windows/Linux | macOS |
|--------|---------------|-------|
| Open DevTools | F12 | Cmd+Opt+I |
| Open Console | Ctrl+Shift+J | Cmd+Opt+J |
| Inspect element | Ctrl+Shift+C | Cmd+Shift+C |
| Toggle device mode | Ctrl+Shift+M | Cmd+Shift+M |
| Search in Elements | Ctrl+F | Cmd+F |
| Clear console | Ctrl+L | Cmd+K |
| Next panel | Ctrl+] | Cmd+] |
| Previous panel | Ctrl+[ | Cmd+[ |

### Console Commands

```javascript
// Storage
localStorage.clear();
sessionStorage.clear();

// Navigation
location.href;
location.reload();
history.back();

// DOM
document.querySelector('selector');
document.querySelectorAll('selector');

// Copy to clipboard
copy(someValue);

// Table format
console.table(arrayOfObjects);

// Group logs
console.group('Group name');
console.log('item 1');
console.log('item 2');
console.groupEnd();

// Timing
console.time('label');
// ...code...
console.timeEnd('label');
```

### HTTP Status Quick Check

| Code | Ý nghĩa | Action |
|------|---------|--------|
| 200 | OK | ✅ |
| 201 | Created | ✅ |
| 400 | Bad Request | Check request body |
| 401 | Unauthorized | Check token |
| 403 | Forbidden | Check permission |
| 404 | Not Found | Check URL/ID |
| 422 | Validation Error | Check input data |
| 500 | Server Error | Report to Dev |

---

**Cần giúp đỡ?** Liên hệ QC Lead hoặc đăng trong #qc-team
