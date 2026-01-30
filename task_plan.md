# Task Plan: Refactor Warehouse Management (Child Warehouses)

## Goal
Refactor `/warehouse` to manage Child Warehouses with CRUD, Pagination, and Filters.

## Phases

### Phase 1: Backend Implementation ⚙️ [COMPLETED - RESTART REQUIRED]
- [x] Added `updateWarehouse` and `deleteWarehouse` to Service/Controller.
- [x] **NOTE:** User must restart the Spring Boot Server for these changes to take effect.

### Phase 2: Refactor Warehouse List Page 🛠️ [COMPLETED]
- [x] **UI Structure:** Implemented Shadcn `Table`, `Input` (Search), `Select` (Filter).
- [x] **Features:**
    -   [x] List filtered by Type 2 (Child) by default.
    -   [x] Client-side Pagination.
    -   [x] Search by Name/Code.
- [x] **CRUD Integration:**
    -   [x] Connected `CreateWarehouseModal` to `createWarehouse` and `updateWarehouse`.
    -   [x] Implemented `handleDelete` with `deleteWarehouse` API.

### Phase 3: Verification ✅ [PENDING SERVER RESTART]
- [ ] Verify CRUD operations after server restart.
