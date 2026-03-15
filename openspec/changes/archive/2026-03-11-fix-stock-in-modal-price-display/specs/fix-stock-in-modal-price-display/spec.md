## ADDED Requirements

### Requirement: Hiển thị đơn giá và thành tiền trong modal
Modal chi tiết phiếu nhập kho PHẢI hiển thị đơn giá và thành tiền từ dữ liệu API.

#### Scenario: Hiển thị đơn giá
- **WHEN** modal hiển thị danh sách sản phẩm
- **THEN** cột "Đơn giá" PHẢI hiển thị giá trị từ `item.unitPrice`
- **AND** format thành "199.000 đ"

#### Scenario: Hiển thị thành tiền
- **WHEN** modal hiển thị danh sách sản phẩm
- **THEN** cột "Thành tiền" PHẢI hiển thị giá trị từ `item.totalPrice`
- **AND** format thành "1.990.000 đ"
