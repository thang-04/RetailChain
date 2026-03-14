## ADDED Requirements

### Requirement: Trạng thái mặc định khi tạo phiếu nhập
Hệ thống PHẢI tạo phiếu nhập kho với trạng thái "PENDING" (Chờ duyệt) thay vì "COMPLETED".

#### Scenario: Tạo phiếu thủ công
- **WHEN** người dùng tạo phiếu nhập mới qua form
- **THEN** phiếu được tạo với trạng thái PENDING
- **AND** hiển thị trạng thái "Chờ duyệt" trong danh sách

#### Scenario: Import từ Excel
- **WHEN** người dùng import phiếu từ file Excel
- **THEN** các phiếu được tạo với trạng thái PENDING

#### Scenario: Duyệt phiếu
- **WHEN** quản lý duyệt phiếu
- **THEN** cập nhật trạng thái thành COMPLETED
