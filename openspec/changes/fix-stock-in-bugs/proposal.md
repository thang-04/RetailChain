## Why

Sau khi kiểm thử (pentest) trang Stock In (Danh sách phiếu nhập kho), phát hiện 2 lỗi CRITICAL khiến chức năng xóa phiếu và nhập từ Excel không hoạt động. Điều này ảnh hưởng đến workflow quản lý kho hàng ngày của nhân viên.

## What Changes

1. **Sửa lỗi xóa phiếu nhập (CRITICAL)**
   - Khi click "Xóa Phiếu" trong menu thao tác, không có phản hồi gì (không dialog xác nhận, không toast thông báo)
   - Cần kiểm tra và fix backend API DELETE `/api/stock-in/{id}`
   - Thêm dialog xác nhận trước khi xóa
   - Thêm toast thông báo kết quả (thành công/lỗi)

2. **Sửa lỗi nhập từ Excel (CRITICAL)**
   - Button "Nhập Excel" click không có tác dụng
   - Cần gắn file input vào button để mở dialog chọn file
   - Xử lý logic import Excel (parse file, tạo phiếu)

3. **Sửa trạng thái mặc định khi tạo phiếu mới (MEDIUM)**
   - Phiếu mới tạo có trạng thái "Completed" thay vì "Chờ duyệt"
   - Sửa logic để mặc định là "PENDING" (Chờ duyệt)

4. **Cải thiện UX lọc theo ngày (LOW)**
   - Date picker không tương tác được rõ ràng
   - Cải thiện UI để dễ sử dụng hơn

5. **Sửa bug hiển thị Tổng quan đơn nhập (LOW)**
   - "Tổng số lượng" hiển thị sai khi chưa chọn sản phẩm

## Capabilities

### New Capabilities
- `stock-in-delete`: Chức năng xóa phiếu nhập với xác nhận và thông báo
- `stock-in-excel-import`: Chức năng nhập phiếu từ file Excel
- `stock-in-default-status`: Sửa trạng thái mặc định khi tạo phiếu mới

### Modified Capabilities
- `stock-in-list`: Cập nhật UX lọc theo ngày và hiển thị tổng quan

## Impact

- **Frontend**:
  - `src/pages/StockIn/StockInList.jsx` - Thêm dialog xóa, gắn file input
  - `src/pages/StockIn/CreateStockIn.jsx` - Sửa trạng thái mặc định
  - `src/services/stock-in.service.js` - Thêm API xóa, import Excel
- **Backend**:
  - Kiểm tra API DELETE `/api/stock-in/{id}`
  - Thêm API import Excel nếu chưa có
