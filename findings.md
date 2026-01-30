# Findings & Analysis - Warehouse Refactoring

## Current State of `WarehouseListPage.jsx`
- Currently fetches `inventoryService.getAllWarehouses()`.
- Displays a basic HTML table (not Shadcn Table).
- Columns: Code, Name, Type, Status, Actions.
- Mixed types (Central & Store) are shown.
- Has `CreateWarehouseModal` and `StockViewModal`.

## Requirements Analysis
- **Target:** Manage "Child Warehouses" (Kho cửa hàng / Type 2).
- **Backend APIs Available (InventoryService):**
    - `getAllWarehouses()`: Returns all.
    - Need to check if there are specific endpoints for CRUD.
- **UI Components Needed:**
    - Shadcn `Table` for better look and pagination support.
    - Search Input.
    - Filter Select (Status).
    - Edit Modal.
- **Logic Changes:**
    - Filter list to show mainly Type 2 (or allow filtering). User asked for "các kho con", so default view should be Type 2.
    - Pagination is requested.

## Codebase Scan
- `InventoryServiceImpl.java` (Backend) likely has `createWarehouse`, `updateWarehouse` (need to verify).
- `inventory.service.js` (Frontend) needs to be checked for available methods.
