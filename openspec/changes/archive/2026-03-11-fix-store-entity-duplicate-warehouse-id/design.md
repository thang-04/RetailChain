## Context

Entity Store hiện tại có hai thuộc tính ánh xạ đến cùng một cột `warehouse_id`:
1. Trường `warehouseId` (Long) với annotation `@Column(name = "warehouse_id", nullable = false)`
2. Relationship `@OneToOne` tới Warehouse với `@JoinColumn(name = "warehouse_id")`

Điều này gây ra lỗi Hibernate: "Column 'warehouse_id' is duplicated in mapping for entity".

## Goals / Non-Goals

**Goals:**
- Sửa lỗi duplicate column để Spring Boot có thể khởi động
- Đảm bảo Store entity hoạt động đúng với cả warehouseId và warehouse relationship

**Non-Goals:**
- Thay đổi cấu trúc database
- Thay đổi API contract

## Decisions

**Quyết định:** Sử dụng `@Column(insertable=false, updatable=false)` cho trường `warehouseId`

**Lý do:**
- Giữ lại cả hai cách access: có thể dùng `store.getWarehouseId()` hoặc `store.getWarehouse()`
- Trường `warehouseId` sẽ chỉ đọc (read-only), chỉ relationship `warehouse` mới có quyền ghi
- Cách tiếp cận này an toàn và ít rủi ro nhất

**Alternatives considered:**
1. Xóa trường `warehouseId`, chỉ dùng relationship `warehouse` - Cần sửa nhiều code hiện tại đang dùng `warehouseId`
2. Xóa relationship `warehouse`, chỉ dùng `warehouseId` - Mất lazy loading benefit

## Risks / Trade-offs

**[Risk]** Code hiện tại sử dụng `warehouseId` có thể bị ảnh hưởng
→ **Mitigation:** Không, vì `warehouseId` vẫn accessible nhưng chỉ read-only. Code hiện tại không thay đổi behavior.

**[Risk]** Migration cần restart server
→ **Mitigation:** Không cần migration vì chỉ thay đổi Java annotation, không thay đổi database schema.
