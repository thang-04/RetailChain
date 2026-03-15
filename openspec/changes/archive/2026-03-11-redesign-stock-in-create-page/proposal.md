## Why

Trang tạo phiếu nhập kho `/stock-in/create` hiện tại có giao diện đơn giản, thiếu trải nghiệm người dùng chuyên nghiệp cho nghiệp vụ kho. Cần redesign để:

- Cải thiện UX với step-by-step wizard
- Thêm validation rõ ràng và real-time feedback
- Tích hợp search nhanh sản phẩm
- Hiển thị tổng quan đơn hàng trước khi submit

## What Changes

1. **Thêm Step Wizard**: Tách form thành 3 bước (Chọn kho/NCC → Thêm sản phẩm → Xác nhận)
2. **Search Component**: Thêm combobox search sản phẩm có filter theo category, size, color
3. **Summary Panel**: Hiển thị tổng số lượng, tổng giá trị (nếu có price)
4. **Validation nâng cao**: Check trùng lặp sản phẩm, số lượng hợp lệ
5. **Preview Mode**: Cho phép xem lại trước khi submit

## Capabilities

### New Capabilities
- `stock-in-wizard`: Tính năng tạo phiếu nhập kho với wizard 3 bước

### Modified Capabilities
- (Không có - là tính năng mới)

## Impact

- **Frontend**: Cập nhật `RetailChainUi/src/pages/StockIn/CreateStockIn.jsx`
- **Component mới**: Tạo wizard components, search combobox
- **Không ảnh hưởng API**: Giữ nguyên contract với backend
