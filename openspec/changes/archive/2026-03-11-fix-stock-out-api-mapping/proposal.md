## Why

Frontend gọi API `/inventory/documents?type=EXPORT` cho trang stock-out (xuất kho), nhưng trong database các phiếu xuất kho được lưu với document_type là `TRANSFER`. Enum có cả EXPORT và TRANSFER, nhưng logic nghiệp vụ hiện tại dùng TRANSFER cho luồng xuất kho từ kho tổng sang kho cửa hàng.

## What Changes

- Sửa `getStockOutRecords` trong `inventory.service.js` gọi `type=TRANSFER` thay vì `type=EXPORT`

## Capabilities

### New Capabilities
- `fix-stock-out-api-mapping`: Fix mapping API cho stock-out

### Modified Capabilities
- Không có

## Impact

- File: `RetailChainUi/src/services/inventory.service.js` - Line 62
- Backend: Không cần thay đổi
