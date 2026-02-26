# Roadmap: v1.0 Frontend Code Review & Bug Fixes

**Milestone:** v1.0
**Total Phases:** 4
**Total Requirements:** 11

## Phase Overview

| # | Phase | Goal | Requirements | Success Criteria |
|---|-------|------|--------------|------------------|
| 1 | Toast Notifications | Replace alert() với Toast | UI-01, UI-02, UI-03 | 3 |
| 2 | Error Handling | Improve API error handling | ERR-01, ERR-02, ERR-03 | 3 |
| 3 | Testing Setup | Setup và viết tests | TEST-01, TEST-02, TEST-03 | 3 |
| 4 | Code Quality | Cleanup và improve code | QUAL-01, QUAL-02 | 2 |

---

## Phase 1: Toast Notifications

**Goal:** Thay thế browser alert() bằng Toast notifications

### Requirements
- UI-01: Replace browser alert() with Toast in StockIn/CreateStockIn.jsx
- UI-02: Replace browser alert() with Toast in Warehouse/CreateWarehouseModal.jsx  
- UI-03: Create reusable Toast component using shadcn/ui

### Success Criteria
1. User thấy Toast notification thay vì alert() khi tạo StockIn thành công
2. User thấy Toast notification thay vì alert() khi tạo Warehouse thành công
3. Toast component có thể tái sử dụng ở các page khác

---

## Phase 2: Error Handling

**Goal:** Cải thiện xử lý lỗi API

### Requirements
- ERR-01: Add 401 redirect to /login in axiosClient.js
- ERR-02: Improve error messages in API responses
- ERR-03: Add loading states for async operations

### Success Criteria
1. User được redirect về /login khi token hết hạn (401)
2. User thấy thông báo lỗi rõ ràng khi API fail
3. User thấy loading indicator khi đang gọi API

---

## Phase 3: Testing Setup

**Goal:** Thiết lập test framework và viết unit tests

### Requirements
- TEST-01: Setup Vitest + React Testing Library for frontend
- TEST-02: Write unit tests for useAxios hook
- TEST-03: Write unit tests for auth service

### Success Criteria
1. Chạy `npm test` không có lỗi
2. useAxios hook có unit tests
3. auth service có unit tests

---

## Phase 4: Code Quality

**Goal:** Dọn dẹp và cải thiện code

### Requirements
- QUAL-01: Remove unused imports in frontend files
- QUAL-02: Add PropTypes or TypeScript to components

### Success Criteria
1. Không còn unused imports trong các file frontend
2. Các components chính có PropTypes defined

---

## Progress

| Phase | Status | Progress |
|-------|--------|----------|
| 1 | ✓ Complete (2026-02-26) | 100% |
| 2 | ○ Not started | 0% |
| 3 | ○ Not started | 0% |
| 4 | ○ Not started | 0% |

---

*Roadmap created: 2026-02-26*
*Milestone: v1.0 Frontend Code Review & Bug Fixes*
