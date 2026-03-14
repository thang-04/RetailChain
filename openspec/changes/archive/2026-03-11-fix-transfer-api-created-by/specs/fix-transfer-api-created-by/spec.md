## ADDED Requirements

### Requirement: Transfer API sử dụng user hiện tại
API transfer phải sử dụng user đang đăng nhập cho createdBy.

#### Scenario: Submit transfer với user đăng nhập
- **WHEN** gọi API POST /api/inventory/transfer
- **THEN** createdBy được set bằng user.id của user đang đăng nhập
- **AND** không có lỗi foreign key constraint
