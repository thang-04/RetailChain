# RetailChain

## What This Is

Hệ thống quản lý bán lẻ (Retail Management System) với backend Spring Boot và frontend React. Bao gồm quản lý kho, cửa hàng, sản phẩm và tồn kho.

## Core Value

Hệ thống quản lý bán lẻ hoàn chỉnh cho phép quản lý kho hàng, cửa hàng và sản phẩm theo thời gian thực.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Frontend code review and bug fixes

### Out of Scope

- Backend authentication system — defer to future milestone
- Backend unit tests — defer to future milestone

## Context

Dự án đã có codebase map với các vấn đề được ghi nhận. Milestone này tập trung vào frontend:

**Frontend Issues từ CONCERNS.md:**
- Alert thay bằng Toast notifications
- No 401 redirect to login
- Token storage security (LocalStorage → httpOnly cookies)
- No frontend unit tests
- Product service incomplete

## Constraints

- **Tech Stack**: React 19 + Vite, shadcn/ui, Tailwind CSS
- **UI Library**: shadcn/ui bắt buộc cho components mới

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Frontend-first trong milestone này | User yêu cầu kiểm tra và sửa lỗi frontend | — Pending |

---

## Current Milestone: v1.0 Frontend Code Review & Bug Fixes

**Goal:** Kiểm tra và sửa các lỗi frontend đang tồn tại

**Target features:**
- Replace alert() với Toast notifications
- Fix 401 redirect to login
- Improve error handling
- Add frontend unit tests

---

*Last updated: 2026-02-26 after milestone v1.0 started*
