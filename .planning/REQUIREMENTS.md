# Requirements: RetailChain

**Defined:** 2026-02-26
**Core Value:** Hệ thống quản lý bán lẻ hoàn chỉnh cho phép quản lý kho hàng, cửa hàng và sản phẩm theo thời gian thực.

## v1 Requirements

### UI/UX Improvements

- [ ] **UI-01**: Replace browser alert() with Toast notifications in StockIn/CreateStockIn.jsx
- [ ] **UI-02**: Replace browser alert() with Toast notifications in Warehouse/CreateWarehouseModal.jsx
- [ ] **UI-03**: Create reusable Toast component using shadcn/ui

### Error Handling

- [ ] **ERR-01**: Add 401 redirect to /login in axiosClient.js
- [ ] **ERR-02**: Improve error messages in API responses
- [ ] **ERR-03**: Add loading states for async operations

### Testing

- [ ] **TEST-01**: Setup Vitest + React Testing Library for frontend
- [ ] **TEST-02**: Write unit tests for useAxios hook
- [ ] **TEST-03**: Write unit tests for auth service

### Code Quality

- [ ] **QUAL-01**: Remove unused imports in frontend files
- [ ] **QUAL-02**: Add PropTypes or TypeScript to components

## v2 Requirements

### Security Improvements

- **SEC-01**: Move token storage from LocalStorage to httpOnly cookies
- **SEC-02**: Add CSRF protection

### Additional Features

- **FEAT-01**: Implement complete Product service
- **FEAT-02**: Add form validation library (React Hook Form)

## Out of Scope

| Feature | Reason |
|---------|--------|
| Backend authentication | Requires backend work, defer to future milestone |
| Backend unit tests | Backend out of scope for this milestone |
| Real-time updates (WebSocket) | Not requested, defer to future |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| UI-01 | Phase 1 | Pending |
| UI-02 | Phase 1 | Pending |
| UI-03 | Phase 1 | Pending |
| ERR-01 | Phase 2 | Pending |
| ERR-02 | Phase 2 | Pending |
| ERR-03 | Phase 2 | Pending |
| TEST-01 | Phase 3 | Pending |
| TEST-02 | Phase 3 | Pending |
| TEST-03 | Phase 3 | Pending |
| QUAL-01 | Phase 4 | Pending |
| QUAL-02 | Phase 4 | Pending |

**Coverage:**
- v1 requirements: 11 total
- Mapped to phases: 11
- Unmapped: 0 ✓

---

*Requirements defined: 2026-02-26*
*Last updated: 2026-02-26 after milestone v1.0 started*
