## ADDED Requirements

### Requirement: Stock-in chỉ nhập vào kho tổng
Tại trang tạo phiếu nhập kho (stock-in), hệ thống PHẢI chỉ cho phép nhập hàng vào kho tổng (central warehouse). Người dùng KHÔNG được phép chọn kho cửa hàng.

#### Scenario: Hiển thị thông tin kho tổng
- **WHEN** người dùng truy cập trang tạo phiếu nhập kho `/stock-in/create`
- **THEN** hệ thống hiển thị tên kho tổng dưới dạng text readonly
- **AND** người dùng KHÔNG thể thay đổi kho nhập hàng

#### Scenario: Xác nhận kho tổng được sử dụng
- **WHEN** người dùng tạo phiếu nhập kho thành công
- **THEN** phiếu nhập được tạo với warehouseId của kho tổng (isCentral=true)

#### Scenario: Không tìm thấy kho tổng
- **WHEN** hệ thống không tìm thấy kho tổng nào trong database
- **THEN** hiển thị thông báo lỗi "Không tìm thấy kho tổng"
- **AND** người dùng không thể tiếp tục tạo phiếu nhập
