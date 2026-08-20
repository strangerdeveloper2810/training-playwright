---
title: "Actions, Interactions & Waiting Strategy"
description: Playwright's core actions (click, fill, upload, drag-drop) and the right way to wait for things
---

# Actions, Interactions & Waiting Strategy

QC Training Documentation - HR Tool

**Version:** 1.0
**Updated:** 2026-08-20
**Author:** QC Team

---

## Table of Contents

1. [Click actions](#1-click-actions)
2. [Text input actions](#2-text-input-actions)
3. [Dropdowns, checkboxes, radio buttons](#3-dropdowns-checkboxes-radio-buttons)
4. [File uploads](#4-file-uploads)
5. [Hover, focus, drag-and-drop](#5-hover-focus-drag-and-drop)
6. [Iframes and multiple tabs/windows](#6-iframes-and-multiple-tabswindows)
7. [Auto-waiting — Playwright's biggest strength](#7-auto-waiting--playwrights-biggest-strength)
8. [When you need to wait manually](#8-when-you-need-to-wait-manually)
9. [Practice Exercises](#9-practice-exercises)

---

## 1. Click actions

```typescript
await page.getByRole('button', { name: 'Log in' }).click();          // regular click
await page.locator('.item').dblclick();                               // double click
await page.locator('.item').click({ button: 'right' });               // right click
await page.locator('.item').click({ modifiers: ['Control'] });        // Ctrl+Click
await page.locator('.canvas').click({ position: { x: 100, y: 200 } }); // click at a specific position within the element
await page.locator('.hidden-button').click({ force: true });          // skip actionability checks (use with caution!)
```

:::caution[`force: true` is a double-edged sword]
`force: true` skips all the checks Playwright normally does (is the element visible, is it being covered, etc.). It makes a test pass quickly, but if the element genuinely can't be clicked by a real user, you're **hiding a real bug** instead of testing actual behavior.
:::

## 2. Text input actions

```typescript
await page.getByLabel('Name').fill('Jane Doe');    // clears the old value then sets a new one (fast)
await page.getByLabel('Email').pressSequentially('[TEST_EMAIL]', { delay: 50 }); // types character by character, firing keydown/keyup events

await page.getByLabel('Name').clear();               // clears the field
await page.getByLabel('Search').press('Enter');      // presses a single key

await page.keyboard.press('Control+a');              // key combination (select all)
await page.keyboard.press('Control+c');
```

`fill()` is enough for most cases (fast, sufficient). Only reach for `pressSequentially()` when you genuinely need to test character-by-character typing behavior (e.g. a search box with live auto-suggest per keystroke).

## 3. Dropdowns, checkboxes, radio buttons

```typescript
// Select dropdown
await page.getByLabel('Department').selectOption('engineering');            // by value
await page.getByLabel('Department').selectOption({ label: 'Engineering' }); // by visible label
await page.locator('select[multiple]').selectOption(['opt1', 'opt2']);      // multi-select

// Checkbox
await page.getByRole('checkbox', { name: 'Enable notifications' }).check();
await page.getByRole('checkbox', { name: 'Enable notifications' }).uncheck();
await page.getByRole('checkbox').setChecked(true); // checks if unchecked, no-op if already checked

// Radio
await page.getByRole('radio', { name: 'Male' }).check();
```

## 4. File uploads

```typescript
// single file
await page.getByLabel('Upload CV').setInputFiles('files/sample-cv.pdf');

// multiple files
await page.locator('input[type="file"]').setInputFiles(['files/doc1.pdf', 'files/doc2.pdf']);

// clear the selected files
await page.locator('input[type="file"]').setInputFiles([]);

// create an in-memory "fake" file, no real file on disk needed
await page.locator('input[type="file"]').setInputFiles({
  name: 'test-cv.txt',
  mimeType: 'text/plain',
  buffer: Buffer.from('Test CV content'),
});
```

This is very useful when testing HR Tool's CV/JD upload feature — you can test both valid files and "fake" files with the wrong format/size without preparing real files on disk.

## 5. Hover, focus, drag-and-drop

```typescript
// Hover — many UIs only reveal "Edit/Delete" buttons on hover
await page.getByRole('row').first().hover();
await expect(page.locator('.action-buttons')).toBeVisible();

// Focus/Blur
await page.getByLabel('Search').focus();
await page.getByLabel('Search').blur();

// Drag and drop — used on the Kanban board (HR Tool's ATS pipeline)
await page.locator('.candidate-card').dragTo(page.locator('.column-interview'));

// Manual drag (when dragTo() isn't enough, e.g. a multi-step drag)
await page.locator('.candidate-card').hover();
await page.mouse.down();
await page.locator('.column-interview').hover();
await page.mouse.up();
```

## 6. Iframes and multiple tabs/windows

```typescript
// Iframe: use frameLocator instead of a regular locator
const frame = page.frameLocator('iframe[title="payment-widget"]');
await frame.getByRole('button', { name: 'Confirm' }).click();

// Opening a new tab and waiting for it (e.g. a "Preview CV" button opening a new tab)
const [newTab] = await Promise.all([
  page.waitForEvent('popup'),
  page.getByRole('link', { name: 'Preview CV' }).click(),
]);
await newTab.waitForLoadState();
await expect(newTab).toHaveURL(/cv-preview/);
```

## 7. Auto-waiting — Playwright's biggest strength

Before performing an action, Playwright **automatically waits** for the element to become "actionable":

```typescript
// ❌ Older tools (Selenium) — you had to write manual waits yourself
await driver.sleep(2000);
await driver.findElement(By.id('button')).click();

// ✅ Playwright — waits automatically, no manual wait needed
await page.getByRole('button', { name: 'Log in' }).click();
```

Before `click()`, Playwright checks that the element: exists in the DOM, is visible, has "settled" (no more animation), isn't covered by another element, and is enabled — all within a timeout window (30 seconds by default).

| Action | Automatically waits for |
|--------|--------------------------|
| `click()` | Visible, stable, receives events, enabled |
| `fill()` | Visible, enabled, editable |
| `check()` | Visible, enabled, not yet checked |
| `expect().toBeVisible()` | Element is visible |

## 8. When you need to wait manually

Auto-waiting handles most cases, but a few situations need you to wait explicitly:

```typescript
// Wait for the URL to change after submitting a form
await page.getByRole('button', { name: 'Log in' }).click();
await page.waitForURL('**/dashboard');

// Wait for a specific network request/response to complete
const responsePromise = page.waitForResponse(
  (res) => res.url().includes('/trpc/candidate.list') && res.status() === 200
);
await page.getByRole('button', { name: 'Refresh' }).click();
await responsePromise;

// Wait for an arbitrary condition on the page
await page.waitForFunction(() => document.querySelectorAll('.candidate-card').length > 0);

// A custom timeout for one specific slow action
await page.getByRole('button', { name: 'Export report' }).click({ timeout: 60_000 });
```

:::caution[Don't use `page.waitForTimeout()` "just to be safe"]
`await page.waitForTimeout(3000)` (a hard 3-second wait) is the **worst** way to wait — it makes the test slower than necessary, while still not guaranteeing enough time when the system happens to be slower than usual. Always prefer waiting on a specific condition (`waitForURL`, `waitForResponse`), or let the action/assertion's own auto-wait handle it.
:::

## 9. Practice Exercises

1. Write a test that fills out the "Create New Job" form completely, clicks Submit, and correctly waits for a success message to appear (without using `waitForTimeout`).
2. Write a test that uploads a fake CV file (using a buffer, no real file needed) to an application form.
3. Explain why `page.click('#btn', { force: true })` might make a test pass while still hiding a real bug.
4. For dragging a candidate card between columns on the ATS pipeline, write a test using `dragTo()`.

## Next Step

Continue with [Assertions](../automation/07-assertions/) — how to confirm the test's outcome actually matches what you expect.

---

**Need help?** Contact your QC Lead or post in #qc-team
