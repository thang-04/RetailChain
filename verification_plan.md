# Verification Plan: Inventory Flow Refactoring

## Objectives
Verify that the new inventory flow constraints are correctly enforced both at the Database level (data integrity) and UI level (user guidance).

## Phase 1: Database Inspection (Pre-check)
- [ ] List all `warehouses` to identify:
    - Central Warehouse (Type 1) ID.
    - Store Warehouses (Type 2) IDs.
- [ ] Check initial stock levels in `inventory_stock` for a specific product variant.

## Phase 2: Playwright Automation Test
- [ ] **Test Case 1: Import Stock**
    - Login to the system.
    - Navigate to `/stock-in/create`.
    - **Verify:** Dropdown "Kho Nhập" ONLY shows Type 1 warehouses.
    - Action: Create an import ticket for Central Warehouse.
- [ ] **Test Case 2: Transfer Stock**
    - Navigate to `/transfers/create`.
    - **Verify:** Dropdown "Kho Nguồn" ONLY shows Type 1.
    - **Verify:** Dropdown "Kho Đích" ONLY shows Type 2.
    - Action: Create a transfer ticket from Central -> Store.

## Phase 3: Final Data Verification
- [ ] Check `inventory_stock`:
    - Central Warehouse quantity should increase (after Import) then decrease (after Transfer).
    - Store Warehouse quantity should increase (after Transfer).
