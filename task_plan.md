# Task Plan: End-to-End Testing of Stock In Deletion

## Goal
Verify that the "Delete Stock In Receipt" functionality works correctly from the UI down to the Database.

## Phases

### Phase 1: Preparation & Validation 
- [ ] Verify Backend API for deletion exists (`DELETE /api/inventory/documents/{id}`)
- [ ] Verify Frontend Service exists (`inventoryService.deleteDocument`)
- [ ] Verify Frontend UI has the Delete button wired up (already saw USER edit, but will double check)

### Phase 2: Automated Testing (Playwright)
- [ ] Create a Playwright script to:
    1. Login (if needed) or bypass auth.
    2. Navigate to `/stock-in/create`.
    3. Create a new Stock In receipt with a unique note (e.g., "AUTO-TEST-DELETE").
    4. Save the receipt.
    5. Go back to `/stock-in`.
    6. Find the receipt by the unique note.
    7. Click "Delete" and confirm.
    8. Verify it disappears from the UI.

### Phase 3: Database Verification
- [ ] Use `mysql-tools` to query the database and ensure the record is physically deleted (or soft deleted if that's the logic, but session implied physical delete).

### Phase 4: Reporting
- [ ] Summarize findings in `findings.md` and `progress.md`.
