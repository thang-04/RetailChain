## Why

Lỗi `Column 'warehouse_id' is duplicated in mapping for entity 'com.sba301.retailmanagement.entity.Store'` xảy ra khi khởi động Spring Boot do entity Store có hai thuộc tính cùng ánh xạ đến cột `warehouse_id`: một là trường `warehouseId` (Long) và một là relationship `warehouse` (Warehouse). Điều này khiến Hibernate không thể build SessionFactory.

## What Changes

- Sửa lỗi duplicate column mapping trong entity Store
- Sử dụng annotation `@Column(insertable=false, updatable=false)` cho trường `warehouseId` để tránh xung đột với relationship `warehouse`

## Capabilities

### New Capabilities
- `fix-store-entity`: Sửa lỗi duplicate warehouse_id column trong Store entity

### Modified Capabilities
- Không có thay đổi về requirements

## Impact

- File bị ảnh hưởng: `RetailChainService/src/main/java/com/sba301/retailmanagement/entity/Store.java`
- Không ảnh hưởng đến API hay cơ sở dữ liệu
