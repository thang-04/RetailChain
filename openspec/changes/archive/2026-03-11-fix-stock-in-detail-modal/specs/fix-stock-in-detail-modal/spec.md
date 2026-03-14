## ADDED Requirements

### Requirement: API trả về danh sách sản phẩm trong phiếu nhập kho
API lấy danh sách phiếu nhập kho PHẢI bao gồm danh sách chi tiết sản phẩm (items) để hiển thị trên modal chi tiết.

#### Scenario: Lấy danh sách phiếu IMPORT
- **WHEN** gọi API GET `/api/inventory/documents?type=IMPORT`
- **THEN** response PHẢI chứa field `items` là mảng các object sản phẩm
- **AND** mỗi item PHẢI có: variantId, productName, sku, size, color, quantity, unitPrice, totalPrice

#### Scenario: Hiển thị chi tiết phiếu nhập
- **WHEN** người dùng click "Xem Chi Tiết" trên một phiếu nhập
- **THEN** modal PHẢI hiển thị danh sách sản phẩm với đầy đủ thông tin
- **AND** nếu không có sản phẩm nào, hiển thị thông báo "Không có dữ liệu mặt hàng"

#### Scenario: API trả items rỗng
- **WHEN** phiếu nhập không có sản phẩm nào
- **THEN** field `items` PHẢI là mảng rỗng `[]` hoặc null
- **AND** modal vẫn hiển thị đúng cấu trúc
