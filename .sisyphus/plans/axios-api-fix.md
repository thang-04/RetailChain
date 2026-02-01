# Plan: Fix Axios Base URL for API Prefix

## TL;DR

> **Quick Summary**: Update `axiosClient.js` to ensure the `baseURL` includes the `/api` prefix, matching the backend's controller mapping.
> 
> **Deliverables**:
> - Updated `RetailChainUi/src/services/api/axiosClient.js`
> 
> **Estimated Effort**: Quick (< 10 mins)
> **Parallel Execution**: NO - sequential
> **Critical Path**: Update axiosClient -> Verify logic

---

## Context

### Original Request
User changed `VITE_API_URL` to `http://localhost:8080/retail-chain` but backend controllers are mapped to `/api/...`. Frontend calls are missing the `/api` prefix.

### Interview Summary
**Key Discussions**:
- Confirmed `baseURL` is derived from `VITE_API_URL` or fallback.
- Confirmed services (`supplier`, `store`, `inventory`) use relative paths like `/stores`.
- Confirmed fix: Append `/api` to the base URL centrally.

**Research Findings**:
- `supplier.service.js`: Uses `axiosPrivate` (real API).
- `inventory.service.js`: Uses axios (real API).
- `store.service.js`: Uses axios (real API).
- `product.service.js`: Uses mock data (out of scope).

### Metis Review
**Identified Gaps** (addressed):
- **Edge Case**: `VITE_API_URL` might already end with `/api` or `/`. Logic must handle this to avoid duplicates.
- **Scope**: Ensure we don't touch individual service files.

---

## Work Objectives

### Core Objective
Ensure all frontend API calls are correctly routed to `http://localhost:8080/retail-chain/api/...`.

### Concrete Deliverables
- `RetailChainUi/src/services/api/axiosClient.js` updated with smart suffix logic.

### Definition of Done
- [ ] `axiosClient.js` code inspects `VITE_API_URL` and appends `/api` if missing.
- [ ] Logic handles trailing slashes correctly.

### Must Have
- Robust string handling for URL construction.

### Must NOT Have (Guardrails)
- Hardcoded full URLs in service files.
- Modifications to backend code.

---

## Verification Strategy

### Automated Verification Only
> **CRITICAL**: No user intervention.

**For Library/Module changes** (using Bash node/bun):
- We will verify the logic by creating a temporary test script or using `node -e` to verify the URL construction logic behaves as expected for various inputs.

---

## Execution Strategy

### Parallel Execution Waves
Sequential.

### Agent Dispatch Summary
- **Wave 1**: Task 1 (Update axiosClient)

---

## TODOs

- [ ] 1. Update axiosClient.js with API Prefix Logic

  **What to do**:
  - Read `RetailChainUi/src/services/api/axiosClient.js`.
  - Modify the `baseURL` assignment logic.
  - Implement a helper or inline logic: `url.replace(/\/+$/, '') + '/api'`.
  - Ensure it applies to both `axiosPublic` and `axiosPrivate`.

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: [`javascript`]

  **References**:
  - `RetailChainUi/src/services/api/axiosClient.js` - Target file.

  **Acceptance Criteria**:
  - [ ] `baseURL` logic handles `http://localhost:8080/retail-chain` -> `.../api`
  - [ ] `baseURL` logic handles `http://localhost:8080/retail-chain/` -> `.../api`
  - [ ] `baseURL` logic handles `http://localhost:8080/retail-chain/api` -> `.../api` (no double /api)

  **Automated Verification**:
  ```bash
  # Verify the file content contains the new logic
  grep "import.meta.env.VITE_API_URL" RetailChainUi/src/services/api/axiosClient.js
  # Check for the specific logic (e.g., endsWith check or append)
  grep "/api" RetailChainUi/src/services/api/axiosClient.js
  ```

---

## Success Criteria

### Verification Commands
```bash
grep "/api" RetailChainUi/src/services/api/axiosClient.js
```

### Final Checklist
- [ ] `axiosClient.js` updated
- [ ] Logic covers edge cases (trailing slash)
