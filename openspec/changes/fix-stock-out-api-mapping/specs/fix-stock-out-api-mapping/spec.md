## ADDED Requirements

### Requirement: Stock-out hiển thị danh sách phiếu xuất kho
Trang stock-out phải hiển thị danh sách các phiếu xuất kho từ kho tổng sang kho cửa hàng.

#### Scenario: Lấy danh sách phiếu xuất
- **WHEN** truy cập trang /stock-out
- **THEN** gọi API `/inventory/documents?type=TRANSFER`
- **AND** hiển thị danh sách phiếu xuất kho
