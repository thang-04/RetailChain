## Why

API transfer stock (`POST /api/inventory/transfer`) đang bị lỗi foreign key constraint do `created_by` được hardcode là `1L`. Cần sửa để lấy user hiện tại từ SecurityContext (giống như đã sửa cho import API).

## What Changes

- Sửa method `transferStock` trong `InventoryServiceImpl.java` để lấy user hiện tại từ SecurityContext
- Sử dụng method `getCurrentUser()` đã có sẵn để lấy user.id gán cho `createdBy`

## Capabilities

### New Capabilities
- `fix-transfer-api-created-by`: Fix lỗi created_by trong transfer API

### Modified Capabilities
- Không có

## Impact

- File: `RetailChainService/src/main/java/com/sba301/retailmanagement/service/impl/InventoryServiceImpl.java`
- Method cần sửa: `transferStock`
- Backend: Không ảnh hưởng đến API contracts
