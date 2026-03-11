## ADDED Requirements

### Requirement: Modal hiển thị giá tiền
Modal chi tiết phiếu xuất kho phải hiển thị đơn giá và thành tiền từ API.

#### Scenario: Hiển thị đơn giá và thành tiền
- **WHEN** mở modal chi tiết phiếu xuất kho
- **THEN** cột đơn giá hiển thị giá trị từ item.unitPrice
- **AND** cột thành tiền hiển thị giá trị từ item.totalPrice
- **AND** tổng cộng được tính đúng
