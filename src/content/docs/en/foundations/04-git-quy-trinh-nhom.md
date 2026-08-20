---
title: Git & Team Workflow for Testers
description: Get comfortable with core Git commands and the branch/PR/code review workflow used by the development team
---

# Git & Team Workflow for Testers

QC Training Documentation - HR Tool

---

## Table of Contents

1. [Why Testers Need to Know Git](#1-why-testers-need-to-know-git)
2. [Core Git Concepts](#2-core-git-concepts)
3. [Common Git Commands](#3-common-git-commands)
4. [Team Workflow (Git Flow)](#4-team-workflow-git-flow)
5. [Commit Message Convention](#5-commit-message-convention)
6. [Pull Requests and Code Review](#6-pull-requests-and-code-review)
7. [Practice Exercises](#7-practice-exercises)

---

## 1. Why Testers Need to Know Git

**Git** is a version control system — it lets many people edit code at the same time without overwriting each other's work, and lets anyone look back at the full history of changes at any point.

For a **manual tester**, basic Git literacy helps you:
- Read commit history to know exactly what just shipped to Staging (so you know what to smoke-test).
- Match a bug to the correct code version when filing a report (the "Affects Version" field).

For an **automation tester**, Git is **mandatory** — your test code is stored, reviewed, and merged the same way product code is. You'll create branches, commit changes, and open Pull Requests (PRs) every time you add or fix a test.

---

## 2. Core Git Concepts

| Concept | Meaning |
|---------|---------|
| **Repository (repo)** | The "warehouse" holding a project's code and its full change history |
| **Commit** | A saved snapshot of changes at a point in time, with a description (commit message) |
| **Branch** | An independent line of development, so work can happen in parallel without disturbing the main line |
| **Merge** | Combining changes from one branch into another |
| **Pull Request (PR)** | A request to merge your branch into the main branch, with a review step first |
| **Clone** | Downloading a full copy of a repo to your machine |
| **Pull** | Fetching the latest changes from the remote (GitHub) into your local copy |
| **Push** | Sending your local changes up to the remote |

Think of a branch as a "draft copy" of the same document, edited in parallel, then merged back once it's finished and approved.

```
main/develop  ──●──────●───────●──────●──►   (main branch, always stable)
                 \             ↗
                  ●────●────●             (your feature/bugfix branch)
```

---

## 3. Common Git Commands

```bash
# Download a repo (only needed once)
git clone <repo-url>

# See current state: which files changed, what's staged
git status

# See the details of what changed
git diff

# Create a new branch and switch to it
git checkout -b feature/add-login-test-cases

# Stage a file for commit
git add some-file.ts
git add .        # stage everything that changed

# Save the staged changes with a description
git commit -m "test: add negative test cases for login"

# Push a branch to the remote (GitHub) for the first time
git push -u origin feature/add-login-test-cases

# Fetch the latest changes from the remote
git pull

# View commit history
git log --oneline
```

A **merge conflict** happens when two people change the same line of the same file differently, and Git can't decide which version to keep automatically — you open the file, manually choose (or combine) the version you want, then `git add` and `git commit` to finish resolving it.

---

## 4. Team Workflow (Git Flow)

HR Tool follows this workflow (the standard for every contributor, including automation testers contributing test code):

```
1. Create a new branch from develop
        ↓
2. Write code/tests on that branch
        ↓
3. Commit following the convention
        ↓
4. Push to GitHub
        ↓
5. Open a Pull Request (PR) into develop
        ↓
6. Team reviews it, CI runs automated checks
        ↓
7. Address feedback (if any)
        ↓
8. Merge into develop
```

**Important note**: HR Tool merges directly into **`develop`** (not `main`) — `develop` is the continuously-integrated branch holding the full, up-to-date feature set, while `main` is typically reserved for stable releases. When you test on Staging, you're really testing code from `develop`.

Branch names should be descriptive, for example:
- `feature/candidate-bulk-import` — a new feature
- `fix/login-500-error` — a bug fix
- `test/add-regression-ats-pipeline` — new tests

---

## 5. Commit Message Convention

A widely used convention (Conventional Commits) applied by many TypeScript/Node projects:

```
<type>: <short description>

Examples:
feat: add CV template export button
fix: correct 500 error when email contains plus sign
test: add e2e test for interview scheduling
docs: update bug report template
chore: upgrade playwright to 1.48
```

| Type | When to use it |
|------|-----------------|
| `feat` | A new feature |
| `fix` | A bug fix |
| `test` | Adding or fixing tests |
| `docs` | Documentation changes |
| `chore` | Housekeeping (dependency bumps, config...) |
| `refactor` | Restructuring code without changing behavior |

Clear commit messages let the whole team (and you, three months from now) understand what a change does without re-reading the entire diff.

---

## 6. Pull Requests and Code Review

A **Pull Request (PR)** is where you present your changes for review before they get merged into the main line. A good PR has a clear title, a short description of the change, and — for a bug fix — a link to the relevant Jira ticket.

**Code review** is when a teammate reads your changes to catch issues before merging. For PRs containing **automated tests**, whether you're reviewing or being reviewed, pay attention to:

- Does the test have a **clear assertion**, or does it just run without actually checking anything?
- Does it depend on **execution order** or on data created by another test (a common source of flaky tests)?
- Does it **clean up its own data** afterward, avoiding leftover clutter on Staging?
- Does the test name clearly describe **what it's testing** (`should show error when email is invalid` is far better than `test1`)?

HR Tool also follows **TDD (Test-Driven Development)** — tests are written before the feature code — and every PR must pass `typecheck`, `lint` (Biome), and `test` before it can be merged (enforced automatically via GitHub Actions CI).

:::tip[For automation testers]
When you open a PR adding a new test, ask yourself: "If this feature actually broke, would my test FAIL?" If you're not sure, temporarily introduce a fake bug (comment out one line) to confirm the test really catches it — then remove the fake bug before opening the PR.
:::

---

## 7. Practice Exercises

1. Explain the difference between `git commit` and `git push` in your own words.
2. You're assigned to "add test cases for the invitation feature." Name a branch for this task following the convention above.
3. Write three example commit messages following Conventional Commits for: (a) adding a new test, (b) fixing a typo in the README, (c) fixing a display bug.
4. Why does HR Tool merge PRs into `develop` instead of `main`? What does that mean for what you're actually testing on Staging?
5. When reviewing a teammate's PR that adds automated tests, what would you check to make sure those tests are actually valuable?

---

## Next Steps

You've completed the **Foundations** group. Continue with [QC Fundamentals](../basics/01-fundamentals/) to start learning testing mindset and process.

---

**Need help?** Contact your QC Lead or post in #qc-team
