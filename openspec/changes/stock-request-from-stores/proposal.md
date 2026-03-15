## Why

Hiện tại, hệ thống Xuất Kho (StockOut) chỉ cho phép Warehouse Manager tạo phiếu xuất/chuyển hàng từ kho tổng đến cửa hàng. Store Manager không thể chủ động gửi yêu cầu xuất hàng mà phải phụ thuộc hoàn toàn vào quy trình thủ công từ phía kho tổng. Điều này gây chậm trễ trong việc bổ sung hàng cho cửa hàng và thiếu tính liên kết giữa hai bộ phận.

## What Changes

- **Tạo mới chức năng Stock Request**: Cho phép Store Manager gửi yêu cầu xuất hàng từ cửa hàng lên kho tổng
- **Tạo mới bảng stock_request và stock_request_item**: Lưu trữ yêu cầu xuất hàng với đầy đủ thông tin sản phẩm, số lượng, trạng thái
- **Tạo mới API endpoints**: Các endpoint để tạo, xem, duyệt, từ chối, hủy request
- **Tạo mới UI tại Store Dashboard**: Form gửi yêu cầu và danh sách request của cửa hàng
- **Tạo mới UI tại Warehouse StockOut**: Tab danh sách request chờ duyệt và thông báo
- **Tích hợp với luồng xuất kho hiện tại**: Khi duyệt request, tự động tạo phiếu TRANSFER

## Capabilities

### New Capabilities
- `stock-request`: Chức năng gửi và quản lý yêu cầu xuất hàng từ cửa hàng
  - Store Manager gửi yêu cầu với sản phẩm, số lượng, ghi chú
  - SuperAdmin xem danh sách request chờ duyệt
  - SuperAdmin duyệt (tự tạo phiếu TRANSFER) hoặc từ chối
  - Store Manager có thể hủy request khi còn PENDING
  - Thông báo cho cả hai bên khi có cập nhật

### Modified Capabilities
- Không có thay đổi về yêu cầu spec hiện tại

## Impact

- **Backend**: Tạo mới entity, repository, service, controller cho stock_request
- **Frontend**: Thêm UI gửi request tại Store Dashboard, thêm tab quản lý request tại StockOut page
- **Database**: Tạo 2 bảng mới stock_request và stock_request_item
- **Notifications**: Tích hợp thông báo trong StockOut page
