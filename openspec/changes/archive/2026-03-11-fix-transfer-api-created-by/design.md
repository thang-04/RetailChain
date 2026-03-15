## Context

API transfer stock (`POST /api/inventory/transfer`) đang bị lỗi foreign key constraint do `created_by` được hardcode là `1L`. Đã fix tương tự cho import API rồi, nhưng quên transfer API.

## Goals / Non-Goals

**Goals:**
- Sửa created_by trong transferStock method để lấy user hiện tại từ SecurityContext

**Non-Goals:**
- Không thay đổi logic nghiệp vụ khác
- Không thay đổi API contract

## Decisions

1. **Sử dụng getCurrentUser() method đã có**
   - Rationale: Đã có sẵn trong InventoryServiceImpl, chỉ cần gọi lại

## Risks / Trade-offs

- **Risk**: Không có - đã có pattern có sẵn từ import API
