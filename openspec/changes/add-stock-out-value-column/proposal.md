## Why

Trang danh sách xuất kho (http://localhost:5173/stock-out) hiện không hiển thị cột giá trị (Giá trị/tổng tiền) trong bảng danh sách. Người dùng không thể nhanh chóng nhìn thấy tổng giá trị của từng lần xuất kho mà phải mở chi tiết từng phiếu.

## What Changes

- Thêm cột "Giá trị" vào bảng danh sách xuất kho trong StockOutList.jsx
- Hiển thị tổng giá trị (totalValue) của mỗi phiếu xuất kho
- Định dạng số tiền theo định dạng Việt Nam (VND)

## Capabilities

### New Capabilities

- `stock-out-value-column`: Hiển thị cột giá trị trong danh sách xuất kho

### Modified Capabilities

- (không có)

## Impact

- Frontend: Cập nhật StockOutList.jsx để thêm cột mới
- Backend: Không cần thay đổi (API đã trả về totalValue)
