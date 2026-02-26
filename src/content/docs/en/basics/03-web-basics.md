---
title: Web Basics for QC
description: Foundational web and programming knowledge that QC testers need to know
---

# Web Basics for QC

HR Tool QC Training Materials

**Document Version:** 1.0
**Last Updated:** 26/02/2026
**Author:** QC Team

---

:::tip[Learning Objectives]
After completing this document, you will:
- Understand how web applications work
- Read and understand basic HTML, CSS, JavaScript
- Master Browser DevTools for debugging
- Understand TypeScript to read/write automation tests
- Debug common web application issues
:::

---

## Part 1: How the Web Works

### 1.1 Client - Server Model

When you access a website, two parties are involved:

```
┌─────────────────┐                              ┌─────────────────┐
│                 │       1. Request             │                 │
│     CLIENT      │  ─────────────────────────▶  │     SERVER      │
│   (Browser)     │                              │   (Backend)     │
│                 │  ◀─────────────────────────  │                 │
│   Chrome        │       2. Response            │   HR Tool API   │
│   Firefox       │                              │   Database      │
│   Safari        │                              │                 │
└─────────────────┘                              └─────────────────┘
```

**Client (Browser):**
- Where users interact (Chrome, Firefox, Safari...)
- Sends requests to the Server
- Receives and displays data

**Server (Backend):**
- Where data is stored and processed
- Receives requests from Client
- Returns results

### 1.2 Website Access Process

**Example: Accessing HR Tool**

```
Step 1: User enters URL
┌────────────────────────────────────────────────────────┐
│  🔗 https://hr-tool-software.netlify.app/employees     │
└────────────────────────────────────────────────────────┘
                            │
                            ▼
Step 2: Browser sends request to Server
┌────────────────────────────────────────────────────────┐
│  GET /employees HTTP/1.1                               │
│  Host: hr-tool-software.netlify.app                    │
│  Authorization: Bearer eyJhbGciOiJIUzI1NiIs...         │
└────────────────────────────────────────────────────────┘
                            │
                            ▼
Step 3: Server processes and returns response
┌────────────────────────────────────────────────────────┐
│  HTTP/1.1 200 OK                                       │
│  Content-Type: text/html                               │
│  + HTML, CSS, JS, data                                 │
└────────────────────────────────────────────────────────┘
                            │
                            ▼
Step 4: Browser renders the page
┌────────────────────────────────────────────────────────┐
│  Employee List                                         │
│  ┌──────┬────────────┬────────────┬──────────┐        │
│  │ Code │ Name       │ Department │ Status   │        │
│  ├──────┼────────────┼────────────┼──────────┤        │
│  │ E001 │ John Smith │ IT         │ Active   │        │
└──────────────────────────────────────────────────────────┘
```

### 1.3 URL Structure

```
https://hr-tool-software.netlify.app/employees?page=1&search=john#table
└──┬──┘ └──────────────┬──────────────┘└───┬───┘└────────┬────────┘└──┬─┘
Protocol           Domain               Path      Query String      Hash
```

| Part | Example | Description |
|------|---------|-------------|
| **Protocol** | `https://` | HTTP or HTTPS (secure) |
| **Domain** | `hr-tool-software.netlify.app` | Server address |
| **Path** | `/employees` | Route to specific page |
| **Query String** | `?page=1&search=john` | Parameters sent to server |
| **Hash** | `#table` | Anchor position within page |

**Real examples in HR Tool:**

```
/login                              → Login page
/employees                          → Employee list (page 1)
/employees?page=2                   → Employee list (page 2)
/employees?search=john&status=active → Search + filter
/employees/123                      → Employee detail with ID 123
/jobs?status=open                   → Job list filtered by open status
```

---

## Part 2: HTML - Page Structure

### 2.1 What is HTML?

**HTML (HyperText Markup Language)** is the language that defines a web page's structure.

```html
<!DOCTYPE html>
<html>
<head>
    <title>HR Tool</title>
</head>
<body>
    <h1>Welcome</h1>
    <p>This is a paragraph.</p>
</body>
</html>
```

### 2.2 Tag Structure

```html
<tagname attribute="value">Content</tagname>
   │          │        │        │        │
   │          │        │        │        └── Closing tag
   │          │        │        └── Content between tags
   │          │        └── Attribute value
   │          └── Attribute (additional info)
   └── Opening tag

<!-- Examples: -->
<a href="https://example.com">Click here</a>
<img src="avatar.png" alt="User avatar">
<input type="email" placeholder="Enter email" required>
```

### 2.3 Important Tags for QC

#### Text Content Tags

```html
<!-- Headings - 6 levels (h1 largest, h6 smallest) -->
<h1>HR Tool</h1>           <!-- Main title -->
<h2>Employee List</h2>      <!-- Section title -->
<h3>Basic Information</h3>  <!-- Subsection -->

<!-- Paragraph -->
<p>This is descriptive text.</p>

<!-- Bold and Italic -->
<strong>Important</strong>   <!-- Bold (semantic) -->
<b>Bold</b>                  <!-- Bold (visual only) -->
<em>Emphasized</em>          <!-- Italic (semantic) -->
<i>Italic</i>                <!-- Italic (visual only) -->

<!-- Link -->
<a href="/employees">View employee list</a>
<a href="https://google.com" target="_blank">Open in new tab</a>

<!-- List -->
<ul>                        <!-- Unordered list (bullets) -->
    <li>Item 1</li>
    <li>Item 2</li>
</ul>

<ol>                        <!-- Ordered list (numbers) -->
    <li>First</li>
    <li>Second</li>
</ol>
```

#### Container Tags

```html
<!-- div - Generic container -->
<div class="employee-card">
    <h3>John Smith</h3>
    <p>Software Engineer</p>
</div>

<!-- span - Inline container -->
<p>Status: <span class="status-active">Active</span></p>

<!-- section, header, footer, nav - Semantic tags -->
<header>Header area</header>
<nav>Navigation menu</nav>
<section>Content section</section>
<footer>Footer area</footer>
```

#### Form Tags (Very Important for QC!)

```html
<form id="login-form" action="/api/login" method="POST">
    <!-- Text input -->
    <label for="email">Email</label>
    <input
        type="email"
        id="email"
        name="email"
        placeholder="Enter email"
        required
    >

    <!-- Password input -->
    <label for="password">Password</label>
    <input
        type="password"
        id="password"
        name="password"
        minlength="6"
        required
    >

    <!-- Checkbox -->
    <input type="checkbox" id="remember" name="remember">
    <label for="remember">Remember me</label>

    <!-- Submit button -->
    <button type="submit">Login</button>
</form>
```

### 2.4 Input Types to Know

```html
<!-- Text input types -->
<input type="text">       <!-- Regular text -->
<input type="email">      <!-- Email (validates @ format) -->
<input type="password">   <!-- Hidden characters -->
<input type="tel">        <!-- Phone number -->
<input type="number">     <!-- Numbers only -->
<input type="url">        <!-- URL format -->

<!-- Date/time inputs -->
<input type="date">       <!-- Date picker -->
<input type="time">       <!-- Time picker -->
<input type="datetime-local">  <!-- Date + time -->

<!-- Selection inputs -->
<input type="checkbox">   <!-- Check multiple options -->
<input type="radio">      <!-- Select one option -->

<!-- Other inputs -->
<input type="file">       <!-- File upload -->
<input type="hidden">     <!-- Hidden value -->
<input type="search">     <!-- Search box -->

<!-- Large text area -->
<textarea rows="4" cols="50">Long text here...</textarea>

<!-- Dropdown select -->
<select name="department">
    <option value="">-- Select --</option>
    <option value="engineering">Engineering</option>
    <option value="hr">Human Resources</option>
    <option value="marketing">Marketing</option>
</select>
```

### 2.5 Important Attributes

| Attribute | Description | Example |
|-----------|-------------|---------|
| `id` | Unique identifier | `id="email-input"` |
| `class` | CSS class | `class="btn btn-primary"` |
| `name` | Form field name | `name="email"` |
| `type` | Input type | `type="email"` |
| `value` | Default value | `value="default"` |
| `placeholder` | Hint text | `placeholder="Enter email"` |
| `required` | Required field | `required` |
| `disabled` | Disabled state | `disabled` |
| `readonly` | Read-only | `readonly` |
| `maxlength` | Maximum characters | `maxlength="100"` |
| `minlength` | Minimum characters | `minlength="6"` |
| `min` / `max` | Number range | `min="0" max="100"` |
| `pattern` | Regex pattern | `pattern="[A-Z]{3}"` |

### 2.6 Table Structure

```html
<table>
    <thead>
        <tr>
            <th>Code</th>
            <th>Name</th>
            <th>Department</th>
            <th>Status</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>E001</td>
            <td>John Smith</td>
            <td>Engineering</td>
            <td>Active</td>
        </tr>
        <tr>
            <td>E002</td>
            <td>Jane Doe</td>
            <td>HR</td>
            <td>On Leave</td>
        </tr>
    </tbody>
</table>
```

**Table tags:**
- `<table>` - Table container
- `<thead>` - Header section
- `<tbody>` - Body section
- `<tr>` - Table row
- `<th>` - Header cell (bold)
- `<td>` - Data cell

---

## Part 3: CSS - Styling

### 3.1 What is CSS?

**CSS (Cascading Style Sheets)** defines visual appearance: colors, fonts, layout, spacing...

```css
/* Selector { property: value; } */
.employee-card {
    background-color: white;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 16px;
}
```

### 3.2 CSS Selectors

```css
/* Element selector - selects all elements of that type */
button { }
input { }
h1 { }

/* Class selector - starts with . */
.btn-primary { }
.employee-card { }
.status-active { }

/* ID selector - starts with # (should be unique) */
#login-form { }
#main-content { }

/* Attribute selector */
input[type="email"] { }
button[disabled] { }

/* Descendant selector */
.card .title { }         /* .title inside .card */
.sidebar a { }           /* all links in .sidebar */

/* Direct child selector */
.nav > li { }            /* direct <li> children of .nav */

/* Pseudo-classes */
button:hover { }         /* when mouse hovers */
input:focus { }          /* when input is focused */
input:disabled { }       /* when input is disabled */
tr:nth-child(odd) { }    /* odd rows */
li:first-child { }       /* first item in list */
li:last-child { }        /* last item in list */
```

### 3.3 Important CSS Properties

#### Colors and Background

```css
/* Text color */
color: #333333;          /* Hex code */
color: rgb(51, 51, 51);  /* RGB */
color: white;            /* Named color */

/* Background */
background-color: #f5f5f5;
background-image: url('bg.png');
background: linear-gradient(to right, #667eea, #764ba2);
```

#### Typography

```css
font-family: 'Inter', sans-serif;
font-size: 14px;         /* Absolute */
font-size: 1rem;         /* Relative to root (typically 16px) */
font-weight: 400;        /* Normal */
font-weight: 600;        /* Semi-bold */
font-weight: 700;        /* Bold */
text-align: left;        /* left, center, right, justify */
line-height: 1.5;        /* Line spacing */
```

#### Spacing

```css
/* Margin - space outside element */
margin: 16px;            /* All sides */
margin: 16px 24px;       /* Vertical, Horizontal */
margin: 8px 16px 8px 16px; /* Top, Right, Bottom, Left */
margin-top: 10px;
margin-bottom: 20px;

/* Padding - space inside element */
padding: 16px;           /* All sides */
padding: 8px 16px;       /* Vertical, Horizontal */
```

#### Box Model

```css
/* Border */
border: 1px solid #e5e7eb;
border-radius: 8px;      /* Rounded corners */
border-bottom: 2px solid #3b82f6;

/* Size */
width: 300px;
max-width: 100%;
height: 48px;
min-height: 200px;

/* Box sizing */
box-sizing: border-box;  /* Width includes padding + border */
```

### 3.4 CSS States (Important for QC!)

```css
/* Default state */
.btn {
    background: #3b82f6;
    color: white;
    cursor: pointer;
}

/* Hover - mouse over */
.btn:hover {
    background: #2563eb;
}

/* Focus - clicked or tabbed to */
.btn:focus {
    outline: 2px solid #93c5fd;
    outline-offset: 2px;
}

/* Active - being pressed */
.btn:active {
    background: #1d4ed8;
}

/* Disabled */
.btn:disabled {
    background: #9ca3af;
    cursor: not-allowed;
    opacity: 0.5;
}

/* Input states */
.input:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
}

.input.error {
    border-color: #ef4444;
}

.input.success {
    border-color: #22c55e;
}
```

### 3.5 Responsive Design

```css
/* Mobile first approach */
.container {
    padding: 16px;
}

/* Tablet (>= 768px) */
@media (min-width: 768px) {
    .container {
        padding: 24px;
    }
}

/* Desktop (>= 1024px) */
@media (min-width: 1024px) {
    .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 32px;
    }
}
```

**Common breakpoints:**

| Device | Width |
|--------|-------|
| Mobile | < 640px |
| Tablet | 640px - 1024px |
| Desktop | > 1024px |

### 3.6 Tailwind CSS (Used in HR Tool)

HR Tool uses **Tailwind CSS** - utility-first CSS framework.

```html
<!-- Traditional CSS -->
<button class="btn-primary">Submit</button>
<style>
.btn-primary {
    background-color: #3b82f6;
    color: white;
    padding: 8px 16px;
    border-radius: 6px;
}
</style>

<!-- Tailwind CSS -->
<button class="bg-blue-500 text-white px-4 py-2 rounded-md">
    Submit
</button>
```

**Common Tailwind classes:**

```html
<!-- Spacing -->
p-4      /* padding: 16px */
px-4     /* padding-left + padding-right: 16px */
py-2     /* padding-top + padding-bottom: 8px */
m-4      /* margin: 16px */
mt-4     /* margin-top: 16px */
gap-4    /* gap: 16px (in flex/grid) */

<!-- Colors -->
bg-blue-500    /* background: blue */
text-gray-600  /* color: gray */
border-red-500 /* border-color: red */

<!-- Size -->
w-full     /* width: 100% */
h-10       /* height: 40px */
max-w-md   /* max-width: 448px */

<!-- Flex/Grid -->
flex             /* display: flex */
flex-col         /* flex-direction: column */
items-center     /* align-items: center */
justify-between  /* justify-content: space-between */
grid             /* display: grid */
grid-cols-3      /* 3 columns */

<!-- Typography -->
text-lg     /* font-size: 18px */
font-bold   /* font-weight: 700 */
text-center /* text-align: center */

<!-- States -->
hover:bg-blue-600    /* background on hover */
focus:ring-2         /* ring on focus */
disabled:opacity-50  /* opacity when disabled */

<!-- Responsive -->
md:flex-row          /* flex-row from medium screens */
lg:grid-cols-4       /* 4 columns on large screens */
```

---

## Part 4: JavaScript - Interaction Logic

### 4.1 What is JavaScript?

**JavaScript** is the programming language that makes web pages interactive:
- Handle button clicks
- Validate forms
- Call APIs
- Update UI dynamically

### 4.2 Variables

```javascript
// const - value cannot be reassigned (preferred)
const API_URL = 'https://api.example.com';
const userEmail = 'john@example.com';

// let - value can be reassigned
let count = 0;
count = count + 1;  // OK
count++;            // OK (shorthand)

// var - old syntax, avoid using
var oldVariable = 'avoid this';
```

**Naming conventions:**
```javascript
// camelCase for variables and functions
const userName = 'John';
const employeeList = [];
function calculateTotal() {}

// UPPER_SNAKE_CASE for constants
const MAX_PAGE_SIZE = 100;
const API_BASE_URL = 'https://api.example.com';

// PascalCase for classes/components
class EmployeeService {}
function EmployeeCard() {}  // React component
```

### 4.3 Data Types

```javascript
// String - text
const name = 'John Smith';
const greeting = "Hello";
const template = `Welcome, ${name}!`;  // Template literal

// Number
const age = 25;
const salary = 5000000;
const rating = 4.5;

// Boolean
const isActive = true;
const isDeleted = false;

// null - intentionally empty
const manager = null;

// undefined - not assigned value
let department;  // undefined
const employee = { name: 'John' };
console.log(employee.email);  // undefined

// Array - list of values
const skills = ['JavaScript', 'TypeScript', 'React'];
const numbers = [1, 2, 3, 4, 5];

// Object - key-value pairs
const employee = {
    id: 1,
    name: 'John Smith',
    email: 'john@example.com',
    department: {
        id: 1,
        name: 'Engineering'
    },
    skills: ['JavaScript', 'TypeScript']
};
```

### 4.4 Operators

```javascript
// Arithmetic
5 + 3    // 8 (addition)
5 - 3    // 2 (subtraction)
5 * 3    // 15 (multiplication)
5 / 3    // 1.666... (division)
5 % 3    // 2 (modulo/remainder)
5 ** 3   // 125 (exponent)

// Comparison
5 === 3   // false (strict equality - recommended)
5 !== 3   // true (strict inequality)
5 == '5'  // true (loose - AVOID!)
5 > 3     // true
5 >= 3    // true
5 < 3     // false
5 <= 3    // false

// Logical
true && false  // false (AND)
true || false  // true (OR)
!true          // false (NOT)

// Combining conditions
const isValid = age >= 18 && age <= 65;
const canAccess = isAdmin || hasPermission;
```

### 4.5 Conditionals

```javascript
// if - else
const status = 'active';

if (status === 'active') {
    console.log('Employee is working');
} else if (status === 'on_leave') {
    console.log('Employee is on leave');
} else {
    console.log('Unknown status');
}

// Ternary operator (short form)
const message = status === 'active' ? 'Working' : 'Not working';

// Multiple conditions
const stage = 'interview';

switch (stage) {
    case 'applied':
        console.log('Application submitted');
        break;
    case 'screening':
        console.log('HR is reviewing');
        break;
    case 'interview':
        console.log('Interview scheduled');
        break;
    default:
        console.log('Unknown stage');
}
```

### 4.6 Loops

```javascript
// for loop - when you know the count
for (let i = 0; i < 5; i++) {
    console.log(`Iteration ${i}`);
}

// for...of - iterate array values
const skills = ['JavaScript', 'TypeScript', 'React'];
for (const skill of skills) {
    console.log(skill);
}

// for...in - iterate object keys
const employee = { name: 'John', age: 25 };
for (const key in employee) {
    console.log(`${key}: ${employee[key]}`);
}

// while - when condition-based
let count = 0;
while (count < 5) {
    console.log(count);
    count++;
}
```

### 4.7 Functions

```javascript
// Regular function declaration
function calculateTotal(price, quantity) {
    return price * quantity;
}

// Arrow function (preferred in modern JS)
const calculateTotal = (price, quantity) => {
    return price * quantity;
};

// Short form (single expression)
const calculateTotal = (price, quantity) => price * quantity;

// Default parameters
const greet = (name = 'Guest') => {
    return `Hello, ${name}!`;
};
greet();        // "Hello, Guest!"
greet('John');  // "Hello, John!"

// Rest parameters
const sum = (...numbers) => {
    return numbers.reduce((a, b) => a + b, 0);
};
sum(1, 2, 3, 4, 5);  // 15
```

### 4.8 Array Methods (Very Important!)

```javascript
const employees = [
    { id: 1, name: 'John', department: 'IT', salary: 5000 },
    { id: 2, name: 'Jane', department: 'HR', salary: 4500 },
    { id: 3, name: 'Bob', department: 'IT', salary: 5500 },
];

// map - transform each item
const names = employees.map(emp => emp.name);
// ['John', 'Jane', 'Bob']

// filter - filter items by condition
const itTeam = employees.filter(emp => emp.department === 'IT');
// [{ id: 1, ... }, { id: 3, ... }]

// find - find first matching item
const john = employees.find(emp => emp.name === 'John');
// { id: 1, name: 'John', ... }

// findIndex - find index of first match
const johnIndex = employees.findIndex(emp => emp.name === 'John');
// 0

// some - check if any item matches
const hasIT = employees.some(emp => emp.department === 'IT');
// true

// every - check if all items match
const allIT = employees.every(emp => emp.department === 'IT');
// false

// reduce - aggregate to single value
const totalSalary = employees.reduce((sum, emp) => sum + emp.salary, 0);
// 15000

// sort - sort array
const sorted = [...employees].sort((a, b) => a.salary - b.salary);
// Sorted by salary ascending

// Method chaining
const itSalaries = employees
    .filter(emp => emp.department === 'IT')
    .map(emp => emp.salary)
    .reduce((sum, sal) => sum + sal, 0);
// 10500
```

### 4.9 Object Destructuring

```javascript
// Object destructuring
const employee = {
    id: 1,
    name: 'John Smith',
    email: 'john@example.com',
    department: { name: 'Engineering' }
};

const { name, email } = employee;
console.log(name);   // 'John Smith'
console.log(email);  // 'john@example.com'

// Renaming variables
const { name: employeeName, email: contactEmail } = employee;

// Default values
const { phone = 'N/A' } = employee;

// Nested destructuring
const { department: { name: deptName } } = employee;

// Array destructuring
const colors = ['red', 'green', 'blue'];
const [first, second] = colors;
console.log(first);   // 'red'
console.log(second);  // 'green'

// Skip items
const [, , third] = colors;
console.log(third);  // 'blue'
```

### 4.10 Spread and Rest Operators

```javascript
// Spread in arrays
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const combined = [...arr1, ...arr2];  // [1, 2, 3, 4, 5, 6]

// Spread in objects
const original = { name: 'John', age: 25 };
const updated = { ...original, age: 26 };  // { name: 'John', age: 26 }

// Rest in function parameters
const sum = (...numbers) => numbers.reduce((a, b) => a + b, 0);

// Rest in destructuring
const [first, ...rest] = [1, 2, 3, 4, 5];
console.log(first);  // 1
console.log(rest);   // [2, 3, 4, 5]
```

### 4.11 Async/Await (API Calls)

```javascript
// API call pattern
const fetchEmployees = async () => {
    try {
        const response = await fetch('/api/employees');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error('Failed to fetch:', error);
        throw error;
    }
};

// Using the function
const loadData = async () => {
    const employees = await fetchEmployees();
    console.log(`Loaded ${employees.length} employees`);
};

// Multiple parallel calls
const loadAllData = async () => {
    const [employees, departments, positions] = await Promise.all([
        fetch('/api/employees').then(r => r.json()),
        fetch('/api/departments').then(r => r.json()),
        fetch('/api/positions').then(r => r.json()),
    ]);

    console.log({ employees, departments, positions });
};
```

### 4.12 DOM Manipulation (How JS interacts with HTML)

```javascript
// Selecting elements
const button = document.querySelector('#submit-btn');
const inputs = document.querySelectorAll('input');
const form = document.getElementById('login-form');

// Getting/setting content
const title = document.querySelector('.title');
console.log(title.textContent);  // Get text
title.textContent = 'New Title'; // Set text
title.innerHTML = '<strong>Bold</strong>'; // Set HTML (careful!)

// Getting/setting attributes
const input = document.querySelector('input[type="email"]');
console.log(input.value);         // Get input value
input.value = 'test@example.com'; // Set input value
input.setAttribute('disabled', true);

// Event listeners
button.addEventListener('click', (event) => {
    event.preventDefault();
    console.log('Button clicked!');
});

form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    console.log(formData.get('email'));
});

// Adding/removing classes
button.classList.add('loading');
button.classList.remove('loading');
button.classList.toggle('active');
button.classList.contains('active'); // true/false
```

---

## Part 5: TypeScript for Automation Testing

### 5.1 What is TypeScript?

**TypeScript** is JavaScript with static type checking:

```typescript
// JavaScript - no error until runtime
function add(a, b) {
    return a + b;
}
add('hello', 5);  // "hello5" - might be a bug!

// TypeScript - catches error at compile time
function add(a: number, b: number): number {
    return a + b;
}
add('hello', 5);  // ❌ Error: Argument of type 'string' is not assignable
```

### 5.2 Basic Types

```typescript
// Primitive types
const name: string = 'John';
const age: number = 25;
const isActive: boolean = true;
const nothing: null = null;
const notDefined: undefined = undefined;

// Arrays
const skills: string[] = ['JavaScript', 'TypeScript'];
const numbers: number[] = [1, 2, 3, 4, 5];
const mixed: (string | number)[] = ['hello', 42];

// Alternative array syntax
const skills: Array<string> = ['JavaScript', 'TypeScript'];

// Objects
const employee: { name: string; age: number } = {
    name: 'John',
    age: 25
};

// any - avoid if possible
const data: any = 'anything goes';

// unknown - safer than any
const input: unknown = getUserInput();
if (typeof input === 'string') {
    console.log(input.toUpperCase()); // OK after type check
}
```

### 5.3 Type Inference

```typescript
// TypeScript can infer types
const name = 'John';         // inferred as string
const age = 25;              // inferred as number
const isActive = true;       // inferred as boolean

const skills = ['JS', 'TS']; // inferred as string[]

const employee = {           // inferred as { name: string; age: number }
    name: 'John',
    age: 25
};

// But explicit types are clearer for function parameters/returns
function greet(name: string): string {
    return `Hello, ${name}`;
}
```

### 5.4 Interfaces and Types

```typescript
// Interface - defines object shape
interface Employee {
    id: number;
    name: string;
    email: string;
    department?: string;  // optional (can be undefined)
    readonly createdAt: Date;  // cannot be changed after creation
}

const john: Employee = {
    id: 1,
    name: 'John Smith',
    email: 'john@example.com',
    createdAt: new Date()
};

// Type alias - can define any type
type Status = 'active' | 'inactive' | 'on_leave';  // Union type
type ID = string | number;

// Extending interfaces
interface Person {
    name: string;
    email: string;
}

interface Employee extends Person {
    employeeId: string;
    department: string;
}

// Combining types with intersection
type EmployeeWithRole = Employee & { role: string };
```

### 5.5 Function Types

```typescript
// Function with types
function add(a: number, b: number): number {
    return a + b;
}

// Arrow function with types
const multiply = (a: number, b: number): number => a * b;

// Optional parameters
function greet(name: string, greeting?: string): string {
    return `${greeting || 'Hello'}, ${name}`;
}

// Default parameters
function greet(name: string, greeting: string = 'Hello'): string {
    return `${greeting}, ${name}`;
}

// Function that returns nothing (void)
function logMessage(message: string): void {
    console.log(message);
}

// Function that never returns (never)
function throwError(message: string): never {
    throw new Error(message);
}

// Function type
type CalculatorFn = (a: number, b: number) => number;

const add: CalculatorFn = (a, b) => a + b;
const subtract: CalculatorFn = (a, b) => a - b;
```

### 5.6 Generics

```typescript
// Generic function - works with any type
function identity<T>(value: T): T {
    return value;
}

identity<string>('hello');  // returns string
identity<number>(42);       // returns number
identity(true);             // inferred as boolean

// Generic interface
interface ApiResponse<T> {
    data: T;
    status: number;
    message: string;
}

const employeeResponse: ApiResponse<Employee> = {
    data: { id: 1, name: 'John', email: 'john@example.com', createdAt: new Date() },
    status: 200,
    message: 'Success'
};

// Generic with constraints
interface HasId {
    id: number;
}

function findById<T extends HasId>(items: T[], id: number): T | undefined {
    return items.find(item => item.id === id);
}
```

### 5.7 Utility Types (Common in Testing)

```typescript
interface Employee {
    id: number;
    name: string;
    email: string;
    department: string;
    salary: number;
}

// Partial<T> - all properties optional
type EmployeeUpdate = Partial<Employee>;
const update: EmployeeUpdate = { name: 'John' };  // OK

// Pick<T, K> - select specific properties
type EmployeePreview = Pick<Employee, 'id' | 'name'>;
const preview: EmployeePreview = { id: 1, name: 'John' };

// Omit<T, K> - exclude specific properties
type EmployeeWithoutSalary = Omit<Employee, 'salary'>;

// Required<T> - all properties required
type RequiredEmployee = Required<Employee>;

// Record<K, T> - object with specific key/value types
type EmployeeMap = Record<string, Employee>;
const employees: EmployeeMap = {
    'emp-1': { id: 1, name: 'John', /* ... */ }
};

// ReturnType<T> - get function return type
function getEmployee() {
    return { id: 1, name: 'John' };
}
type EmployeeReturn = ReturnType<typeof getEmployee>;
// { id: number; name: string }
```

### 5.8 TypeScript in Playwright Tests

```typescript
import { test, expect, Page, Locator } from '@playwright/test';

// Types for test data
interface LoginCredentials {
    email: string;
    password: string;
}

interface Employee {
    name: string;
    email: string;
    department: string;
}

// Page Object with types
class LoginPage {
    private page: Page;
    private emailInput: Locator;
    private passwordInput: Locator;
    private loginButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.emailInput = page.getByLabel('Email');
        this.passwordInput = page.getByLabel('Password');
        this.loginButton = page.getByRole('button', { name: /login/i });
    }

    async login(credentials: LoginCredentials): Promise<void> {
        await this.emailInput.fill(credentials.email);
        await this.passwordInput.fill(credentials.password);
        await this.loginButton.click();
    }
}

// Test with types
test('login with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const credentials: LoginCredentials = {
        email: 'admin@test.com',
        password: 'password123'
    };

    await page.goto('/login');
    await loginPage.login(credentials);
    await expect(page).toHaveURL(/dashboard/);
});

// API test with types
interface ApiEmployee {
    id: number;
    name: string;
    email: string;
    department: {
        id: number;
        name: string;
    };
}

interface ApiResponse<T> {
    result: {
        data: {
            json: T;
        };
    };
}

test('fetch employees API', async ({ request }) => {
    const response = await request.get('/trpc/employee.list');
    expect(response.ok()).toBeTruthy();

    const body: ApiResponse<{ items: ApiEmployee[]; total: number }> =
        await response.json();

    expect(body.result.data.json.items).toBeInstanceOf(Array);
    expect(body.result.data.json.total).toBeGreaterThan(0);
});
```

---

## Part 6: Browser DevTools

### 6.1 Opening DevTools

| OS | Shortcut |
|----|----------|
| Windows/Linux | `F12` or `Ctrl + Shift + I` |
| macOS | `Cmd + Option + I` |

Or right-click → **Inspect**

### 6.2 Elements Tab

**Purpose:** View and edit HTML/CSS structure

**Common operations:**

```
1. Inspect element:
   - Right-click on element → Inspect
   - Or click 🔍 icon → hover over page

2. View HTML:
   - Expand/collapse tags with ▶
   - Double-click to edit text
   - Right-click → Edit as HTML for full editing

3. View CSS:
   - See styles in Styles panel on right
   - Check/uncheck to toggle styles
   - Click to edit values
   - See computed final values in Computed tab

4. Find elements:
   - Ctrl+F (Cmd+F) to search in HTML
   - Search by text, tag, class, attribute
```

**QC Use Cases:**

| Task | How to do it |
|------|--------------|
| Check if element exists | Search in Elements tab |
| Check element text | View innerHTML |
| Check if button disabled | Look for `disabled` attribute |
| Check input validation | Look for `required`, `pattern`, `minlength` |
| Check CSS classes | View class attribute |
| Check responsive | Toggle device toolbar (Ctrl+Shift+M) |

### 6.3 Console Tab

**Purpose:** View JavaScript logs and errors, run commands

**Message types:**

| Icon | Type | Meaning |
|------|------|---------|
| 🔴 | Error | JavaScript error (needs fixing) |
| 🟡 | Warning | Potential issue |
| 🔵 | Info | Information message |
| ⚪ | Log | `console.log()` output |

**Common commands:**

```javascript
// View localStorage (auth tokens)
localStorage.getItem('accessToken')
localStorage.getItem('user')

// Clear storage (logout)
localStorage.clear()

// Reload page
location.reload()

// View current URL
window.location.href

// Find element
document.querySelector('.employee-card')
document.querySelectorAll('tr')

// Trigger click
document.querySelector('#submit-btn').click()

// View errors
// Red messages with stack trace show where error occurred
```

**QC Use Cases:**

| Task | How to do it |
|------|--------------|
| Check for JS errors | Look for red messages |
| Check auth token | `localStorage.getItem('accessToken')` |
| Check user info | `JSON.parse(localStorage.getItem('user'))` |
| Simulate logout | `localStorage.clear(); location.reload()` |
| Debug API response | Check `console.log` outputs |

### 6.4 Network Tab

**Purpose:** View all HTTP requests and responses

**Interface overview:**

```
┌─────────────────────────────────────────────────────────────────┐
│ 🔴 ○ ◯ | Filter: [All ▼] [Fetch/XHR] [JS] [CSS] ...            │
├─────────────────────────────────────────────────────────────────┤
│ Name            | Status | Type | Size   | Time   | Waterfall  │
├─────────────────────────────────────────────────────────────────┤
│ employee.list   | 200    | fetch| 4.5 KB | 234ms  | ▓▓▓        │
│ auth.login      | 200    | fetch| 1.2 KB | 156ms  | ▓▓         │
│ employee.create | 400    | fetch| 0.5 KB | 89ms   | ▓          │
│ avatar.png      | 200    | png  | 45 KB  | 312ms  | ▓▓▓▓       │
└─────────────────────────────────────────────────────────────────┘
```

**Reading request details:**

Click on a request to see:

```
Headers tab:
├── General
│   ├── Request URL: https://api.example.com/trpc/employee.list
│   ├── Request Method: POST
│   └── Status Code: 200 OK
├── Response Headers
│   ├── content-type: application/json
│   └── ...
└── Request Headers
    ├── Authorization: Bearer eyJhbG...
    └── Content-Type: application/json

Payload tab (for POST/PUT):
{
  "json": {
    "page": 1,
    "limit": 10
  }
}

Response tab:
{
  "result": {
    "data": {
      "json": {
        "items": [...],
        "total": 50
      }
    }
  }
}
```

**Important status codes:**

| Code | Meaning | When |
|------|---------|------|
| 200 | OK | Success |
| 201 | Created | Resource created |
| 400 | Bad Request | Invalid input |
| 401 | Unauthorized | Not logged in / token expired |
| 403 | Forbidden | No permission |
| 404 | Not Found | Resource doesn't exist |
| 422 | Unprocessable | Validation error |
| 500 | Server Error | Backend error |

**QC Use Cases:**

| Task | How to do it |
|------|--------------|
| Check API called | Filter by Fetch/XHR, look for request |
| Check request payload | Click request → Payload tab |
| Check response data | Click request → Response tab |
| Check status code | Status column |
| Check auth header | Headers tab → Authorization |
| Check slow API | Time column, > 1s is slow |
| Check 500 errors | Filter by status, look for red |

### 6.5 Application Tab

**Purpose:** View and manage browser storage

**LocalStorage:**
```
┌─────────────────────────────────────────────────────────────────┐
│ Storage                                                          │
├─────────────────────────────────────────────────────────────────┤
│ ▼ Local Storage                                                  │
│   └── https://hr-tool-software.netlify.app                       │
│       ├── accessToken: eyJhbGciOiJIUzI1NiIs...                  │
│       ├── user: {"id":"1","name":"Admin"...                      │
│       └── theme: dark                                            │
│                                                                  │
│ ▼ Session Storage                                                │
│ ▼ Cookies                                                        │
└─────────────────────────────────────────────────────────────────┘
```

**Operations:**
- Double-click to edit value
- Right-click to delete
- Click Clear All to remove everything

**QC Use Cases:**

| Task | How to do it |
|------|--------------|
| Check login token | LocalStorage → accessToken |
| Check user role | LocalStorage → user → parse JSON → role |
| Test token expiry | Edit accessToken to invalid value |
| Test fresh user | Clear all storage, reload |
| Check theme saved | LocalStorage → theme |

### 6.6 Device Mode (Responsive Testing)

**Opening:** `Ctrl + Shift + M` (Windows/Linux) or `Cmd + Shift + M` (macOS)

```
┌─────────────────────────────────────────────────────────────────┐
│ [Responsive ▼] [375 × 667] [100%] [  ] [🔄] [📷]               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│    ┌───────────────────────────────┐                            │
│    │        Mobile View            │                            │
│    │                               │                            │
│    │   HR Tool                     │                            │
│    │   ≡                           │                            │
│    │                               │                            │
│    │   Welcome, Admin              │                            │
│    │                               │                            │
│    └───────────────────────────────┘                            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Common devices:**
- iPhone SE: 375 × 667
- iPhone 14 Pro: 393 × 852
- iPad: 768 × 1024
- iPad Pro: 1024 × 1366

**Testing checklist:**
- [ ] Navigation works on mobile (hamburger menu)
- [ ] Forms are usable
- [ ] Tables scroll horizontally
- [ ] Buttons are tappable (min 44×44px)
- [ ] Text is readable
- [ ] No horizontal overflow

---

## Part 7: HTTP & API

### 7.1 HTTP Methods

| Method | Purpose | Example |
|--------|---------|---------|
| **GET** | Read data | Get employee list |
| **POST** | Create new | Create new employee |
| **PUT** | Full update | Update all fields |
| **PATCH** | Partial update | Update status only |
| **DELETE** | Delete | Remove employee |

### 7.2 Request Structure

```
POST /trpc/employee.create HTTP/1.1
Host: api.hr-tool.com
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json

{
  "json": {
    "name": "John Smith",
    "email": "john@example.com",
    "departmentId": "uuid-123"
  }
}
```

**Parts:**
- **Method + Path**: `POST /trpc/employee.create`
- **Headers**: Metadata (auth, content type)
- **Body**: Data being sent (for POST/PUT/PATCH)

### 7.3 Response Structure

```
HTTP/1.1 200 OK
Content-Type: application/json
Date: Wed, 26 Feb 2026 10:30:00 GMT

{
  "result": {
    "data": {
      "json": {
        "id": "uuid-456",
        "name": "John Smith",
        "email": "john@example.com"
      }
    }
  }
}
```

### 7.4 tRPC (HR Tool Uses)

HR Tool uses **tRPC** for API calls instead of REST.

**Request format:**
```json
{
  "json": {
    "page": 1,
    "limit": 10,
    "search": "john"
  }
}
```

**Response format:**
```json
{
  "result": {
    "data": {
      "json": {
        "items": [
          { "id": 1, "name": "John Smith" }
        ],
        "total": 1,
        "page": 1,
        "limit": 10,
        "totalPages": 1
      }
    }
  }
}
```

**Common tRPC endpoints:**

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/trpc/auth.login` | POST | Login |
| `/trpc/auth.logout` | POST | Logout |
| `/trpc/employee.list` | POST | Get employee list |
| `/trpc/employee.create` | POST | Create employee |
| `/trpc/employee.update` | POST | Update employee |
| `/trpc/employee.delete` | POST | Delete employee |
| `/trpc/job.list` | POST | Get job list |
| `/trpc/candidate.list` | POST | Get candidate list |

### 7.5 Authentication (JWT)

**JWT (JSON Web Token)** structure:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjM0In0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
└──────────────┬──────────────┘.└────────────┬───────────┘.└──────────────────┬──────────────────┘
            Header                        Payload                          Signature
```

**Decode at:** [jwt.io](https://jwt.io)

**Auth flow in HR Tool:**

```
1. Login Request
   POST /trpc/auth.login
   { "json": { "email": "admin@test.com", "password": "xxx" } }

2. Login Response
   {
     "result": {
       "data": {
         "json": {
           "accessToken": "eyJhbG...",
           "refreshToken": "eyJhbG...",
           "user": { "id": "1", "name": "Admin", "role": "admin" }
         }
       }
     }
   }

3. Store in localStorage
   localStorage.setItem('accessToken', accessToken)
   localStorage.setItem('user', JSON.stringify(user))

4. Subsequent requests include token
   Authorization: Bearer eyJhbG...

5. Token expired → Refresh
   POST /trpc/auth.refresh
   { "json": { "refreshToken": "eyJhbG..." } }

6. Logout
   POST /trpc/auth.logout
   localStorage.removeItem('accessToken')
   localStorage.removeItem('user')
```

### 7.6 Common API Errors

| Error | Status | Meaning | How to fix |
|-------|--------|---------|------------|
| CORS | - | Cross-origin blocked | Check API URL, ask dev |
| 400 | Bad Request | Invalid input | Check request body |
| 401 | Unauthorized | Not logged in | Login again |
| 403 | Forbidden | No permission | Check user role |
| 404 | Not Found | Wrong URL or ID | Check endpoint |
| 422 | Validation Error | Data invalid | Check field values |
| 500 | Server Error | Backend bug | Report to dev |

---

## Part 8: Common Issues & Debugging

### 8.1 Page Not Loading

**Checklist:**
1. Check internet connection
2. Check browser console for errors
3. Check Network tab for failed requests
4. Clear cache and reload (`Ctrl + Shift + R`)

### 8.2 Login Issues

```
Problem: Can't login
Checklist:
□ Correct email format?
□ Correct password?
□ Account exists?
□ Network error? (Check Network tab)
□ Server error? (Check response)

Problem: Logged out unexpectedly
Checklist:
□ Token expired? (Check Application → localStorage)
□ Server restarted?
□ Multiple tabs issue?
```

### 8.3 Data Not Displaying

```
Problem: List is empty but should have data
Checklist:
□ API called? (Network tab)
□ Response has data? (Response tab)
□ Filter applied? (Check query params)
□ Correct page? (Check pagination)
□ Permission issue? (Check 403 error)
```

### 8.4 Form Submission Fails

```
Problem: Form doesn't submit
Checklist:
□ All required fields filled?
□ Validation errors shown? (Check form)
□ API error? (Network tab → check status)
□ Button disabled? (Elements tab)
□ Console errors? (Console tab)
```

### 8.5 Debugging Steps

```
1. Reproduce the issue
   - Note exact steps to reproduce
   - Check if consistent or intermittent

2. Check Console
   - Red errors? → Note the error message
   - Warnings? → May be related

3. Check Network
   - Failed requests? (Red status)
   - Check request payload
   - Check response body

4. Check Application
   - Auth token present?
   - User data correct?

5. Check Elements
   - Element visible?
   - Correct attributes?
   - CSS hiding it?

6. Try in Incognito
   - Rules out cache/cookie issues
   - Rules out extension conflicts

7. Try different browser
   - Rules out browser-specific bugs
```

### 8.6 Quick Reference Commands

```javascript
// Console commands for debugging

// Auth
localStorage.getItem('accessToken')      // Check token
JSON.parse(localStorage.getItem('user')) // Check user info
localStorage.clear()                      // Logout

// Page state
window.location.href    // Current URL
location.reload()       // Reload page
history.back()          // Go back

// Find elements
document.querySelector('.class-name')    // Single element
document.querySelectorAll('tag-name')    // All elements
document.getElementById('id')            // By ID

// Copy from console
copy(localStorage.getItem('accessToken')) // Copy to clipboard
```

---

## Summary

| Topic | Key Points |
|-------|------------|
| **Web Basics** | Client-Server model, URL structure |
| **HTML** | Tags, forms, inputs, tables, attributes |
| **CSS** | Selectors, properties, states, Tailwind |
| **JavaScript** | Variables, arrays, functions, async/await |
| **TypeScript** | Types, interfaces, generics |
| **DevTools** | Elements, Console, Network, Application |
| **HTTP** | Methods, status codes, headers |
| **tRPC** | Request/response format, endpoints |
| **Auth** | JWT tokens, localStorage |
| **Debugging** | Console errors, Network requests |

---

## Additional Resources

| Resource | Link |
|----------|------|
| MDN Web Docs | [developer.mozilla.org](https://developer.mozilla.org) |
| TypeScript Handbook | [typescriptlang.org/docs](https://www.typescriptlang.org/docs/) |
| Playwright Docs | [playwright.dev](https://playwright.dev) |
| Chrome DevTools | [developer.chrome.com/docs/devtools](https://developer.chrome.com/docs/devtools/) |
| JWT Decoder | [jwt.io](https://jwt.io) |

---

**Need help?** Contact QC Lead or post in #qc-team
