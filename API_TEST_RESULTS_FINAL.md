# API & End-to-End Test Results

**Date**: 2026-01-28
**Executor**: Playwright Automation + MySQL Validation

## 1. Objective
Verify the functionality of the RetailChain application by mimicking a real user flow through the UI and validating the resulting data in the MySQL database.
This test covers the API-integrated modules: **Warehouse**, **Stock In**, **Stock Out**, and **Transfer**.

## 2. Test Environment
- **Frontend**: Vite + React (Port 5173)
- **Backend**: Spring Boot (Port 8080)
- **Database**: MySQL (Port 3306, DB `retail_chain`)
- **Automation Tool**: Playwright (Headless/Visible)

## 3. Test Scenario
The following sequence was automated:
1.  **Create Warehouse**: Created a new warehouse named `PW_WH_{timestamp}`.
2.  **Stock In (Import)**: Imported **100** items of *Produce Edge* (ID 1) into the new warehouse.
3.  **Stock Out (Export)**: Exported **20** items of *Produce Edge* from the new warehouse.
4.  **Transfer**: Transferred **10** items of *Produce Edge* from the new warehouse to another warehouse.

**Expected Final Stock**: `100 (In) - 20 (Out) - 10 (Transfer) = 70`.

## 4. Automation Results
✅ **Playwright Execution**: **SUCCESS**
- All UI actions (navigation, clicking, typing, submission) completed without errors.
- Success notifications were observed.
- Timestamps and dynamic names ensured a clean test run.

**Screenshots**:
- `C:\tmp\playwright-flow-v2.js` (Test Script)
- Success logs available in session history.

## 5. Database Verification
After the test complete, the database was queried to verify data integrity.

### 5.1. Warehouse Check
**Query**: `SELECT * FROM warehouses WHERE name = 'PW_WH_1769590014697'`
**Result**: 
- **ID**: `78`
- **Name**: `PW_WH_1769590014697`
- **Status**: Exists

### 5.2. Transaction History
**Query**: `SELECT * FROM inventory_history WHERE warehouse_id = 78`
**Result**: 3 Transactions found.

| ID | Action | Quantity | Balance After | Note |
|---|---|---|---|---|
| 10 | IN | 100 | 100 | Stock In |
| 11 | OUT | 20 | 80 | Stock Out |
| 12 | OUT | 10 | 70 | Transfer (Source) |

### 5.3. Final Stock Balance
**Query**: `SELECT quantity FROM inventory_stock WHERE warehouse_id = 78 AND variant_id = 1`
**Result**:
- **Quantity**: `70`

## 6. Conclusion
The application logic is working correctly end-to-end.
- **Frontend Forms** correctly send data to APIs.
- **Backend APIs** correctly process transactions.
- **Database** correctly maintains stock ledger and calculates balances.

The system is verified to be **Operational** for these features.
