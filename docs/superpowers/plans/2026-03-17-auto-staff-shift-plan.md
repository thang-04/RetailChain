# Auto Staff Shift (Draft → Confirm) Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Thêm chức năng tự động tạo phân công ca ở trạng thái DRAFT theo định mức nhân viên và nhu cầu nhân sự của ca, hiển thị trên lịch và cho phép “Xác nhận tất cả” để chuyển DRAFT → ASSIGNED.

**Architecture:** Backend tạo draft bằng heuristic đảm bảo `min_staff` theo từng shift/ngày, ưu tiên nhân viên đang thiếu quota, không vượt `max_shifts_per_week` và không overlap trong ngày. Frontend thêm 2 nút gọi API và hiển thị draft bằng style nhạt.

**Tech Stack:** Spring Boot (RetailChainService), React + axios (RetailChainUi)

---

## Chunk 1: Backend schema + API contracts

### Task 1: Add DB schema for StaffQuota + Shift min/max staff + Draft status

**Files:**
- Modify: `RetailChainService/src/main/java/...` (entities/enums - exact paths TBD by repo structure)
- Create: `RetailChainService/src/main/java/com/sba301/retailmanagement/domain/.../StaffQuota.java` (or match current package)
- Create/Modify migration (Flyway/Liquibase) depending on existing setup

- [ ] **Step 1: Inspect current persistence/migration approach**
  - Check for Flyway (`db/migration`) or Liquibase config
  - Identify existing `Shift` entity/table and `ShiftAssignment` status type

- [ ] **Step 2: Add `staff_quota` table**
  - Columns: `user_id`, `store_id`, `min_shifts_per_week default 5`, `max_shifts_per_week default 6`
  - Unique index: (`user_id`, `store_id`)

- [ ] **Step 3: Add `min_staff/max_staff` columns to `shift`**
  - default 1
  - constraint: `min_staff <= max_staff`

- [ ] **Step 4: Add `DRAFT` to shift assignment status**
  - Ensure API responses preserve status string

- [ ] **Step 5: Smoke test app startup**
  - Run backend and confirm migrations apply

### Task 2: Add DTOs for auto-assign & confirm

**Files:**
- Create: `RetailChainService/src/main/java/com/sba301/retailmanagement/dto/request/AutoAssignShiftRequest.java`
- Create: `RetailChainService/src/main/java/com/sba301/retailmanagement/dto/request/ConfirmDraftShiftsRequest.java`
- Create: `RetailChainService/src/main/java/com/sba301/retailmanagement/dto/response/AutoAssignShiftSummary.java`
- Modify: existing response wrapper usage (ResponseJson)

- [ ] **Step 1: Define request/response shapes exactly as spec**
- [ ] **Step 2: Add validation (storeId, from<=to)**

---

## Chunk 2: Backend implementation (ShiftService)

### Task 3: Implement `autoAssignDraftShifts`

**Files:**
- Modify: `RetailChainService/src/main/java/com/sba301/retailmanagement/service/ShiftService.java`
- Modify: `RetailChainService/src/main/java/com/sba301/retailmanagement/service/impl/ShiftServiceImpl.java`
- Modify/Create repos for StaffQuota and assignment queries

- [ ] **Step 1: Add ShiftController endpoint**
  - `POST /api/shifts/auto-assign`

- [ ] **Step 2: Load inputs**
  - shifts by store (include min/max staff)
  - staff list by store (reuse existing store staff-list logic if exists)
  - quotas by store (default to 5/6 if missing row)
  - assignments ASSIGNED in range (and possibly week) for counting & overlap
  - if `resetDraft=true` cancel existing DRAFT in range

- [ ] **Step 3: Generate DRAFT**
  - For each date in [from..to] and each shift:
    - compute current headcount (ASSIGNED + existing DRAFT)
    - select candidates not overlapping and not exceeding max weekly
    - scoring: prioritize staff currently under `min_shifts_per_week`
    - insert DRAFT assignments until `min_staff` reached or candidates exhausted

- [ ] **Step 4: Return summary**
  - list understaffed shifts/day
  - counts per staff (optional) to help UI

### Task 4: Implement confirm drafts

**Files:**
- Modify: `ShiftController.java`
- Modify: `ShiftService` / `ShiftServiceImpl`

- [ ] **Step 1: Add endpoint**
  - `POST /api/shifts/confirm-drafts`

- [ ] **Step 2: Validate hard rules**
  - For each date+shift in range, ensure headcount (ASSIGNED + DRAFT) >= min_staff
  - Ensure no overlap for each user in the same date

- [ ] **Step 3: Update**
  - update all DRAFT rows in range to ASSIGNED in a transaction

---

## Chunk 3: Frontend UI wiring

### Task 5: Extend `shift.service.js` with new APIs

**Files:**
- Modify: `RetailChainUi/src/services/shift.service.js`

- [ ] **Step 1: Add `autoAssignDrafts(storeId, from, to, resetDraft)`**
- [ ] **Step 2: Add `confirmDrafts(storeId, from, to)`**

### Task 6: Update `StaffShiftsPage.jsx` to support draft + actions

**Files:**
- Modify: `RetailChainUi/src/pages/Staff/StaffShifts/StaffShiftsPage.jsx`

- [ ] **Step 1: Add buttons “Tự động sắp xếp (Bản nháp)” & “Xác nhận tất cả”**
  - Determine `from/to` based on current view (week/month/year)
  - Call APIs and reload assignments

- [ ] **Step 2: Render draft style**
  - if `assignment.status === "DRAFT"` apply opacity/dashed/badge

- [ ] **Step 3: Show summary banner/toast**
  - when understaffed exists, show warning with count

---

## Chunk 4: Verification

- [ ] **Step 1: Manual test**
  - Create shifts with `min_staff/max_staff`
  - Set StaffQuota for staff
  - Auto-assign for a week
  - Verify draft shows light style
  - Confirm all and verify status becomes ASSIGNED

- [ ] **Step 2: Regression test existing assign/cancel flow**
  - Ensure existing modal assign still works and creates ASSIGNED as before

---

**Spec reference:** `docs/superpowers/specs/2026-03-17-auto-staff-shift-design.md`

