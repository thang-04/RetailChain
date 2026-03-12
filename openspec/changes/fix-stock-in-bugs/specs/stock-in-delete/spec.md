## ADDED Requirements

### Requirement: Xóa phiếu nhập kho
Hệ thống PHẢI cho phép người dùng xóa phiếu nhập kho sau khi xác nhận.

#### Scenario: Xóa phiếu thành công
- **WHEN** người dùng click "Xóa Phiếu" trong menu thao tác
- **THEN** hiển thị dialog xác nhận với nút "Xóa" và "Hủy"

#### Scenario: Xác nhận xóa
- **WHEN** người dùng click "Xóa" trong dialog xác nhận
- **THEN** gọi API DELETE /api/stock-in/{id}
- **AND** hiển thị toast thông báo "Xóa phiếu thành công"
- **AND** cập nhật danh sách phiếu nhập (loại bỏ phiếu đã xóa)

#### Scenario: Hủy xóa
- **WHEN** người dùng click "Hủy" trong dialog xác nhận
- **THEN** đóng dialog
- **AND** không thay đổi dữ liệu

#### Scenario: Xóa thất bại
- **WHEN** API DELETE trả về lỗi
- **THEN** hiển thị toast thông báo lỗi với nội dung từ server
