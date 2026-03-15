## Why

Stat cards trong trang stock-in hiện tại hiển thị "Chờ duyệt" và "Đã hủy" - các metrics này không có ý nghĩa trong nghiệp vụ nhập kho vì nhập kho mặc định là hoàn thành ngay (không cần duyệt). Cần thay thế bằng metrics phù hợp với business logic: Tổng sản phẩm và Số nhà cung cấp.

## What Changes

- Thay thế stat card "Chờ duyệt" → "Tổng sản phẩm" (tổng số sản phẩm đã nhập)
- Thay thế stat card "Đã hủy" → "Nhà cung cấp" (số lượng NCC unique)
- Giữ nguyên: Tổng phiếu, Hoàn thành, Giá trị

## Capabilities

### New Capabilities
- `stock-in-custom-metrics`: Định nghĩa bộ metrics tùy chỉnh cho stock-in phù hợp với business logic

### Modified Capabilities
- (none - không thay đổi requirement ở spec level)

## Impact

- **Frontend**: Cập nhật `StockInList.jsx` - thay đổi stats useMemo và StatCards
- **UX**: Stat cards phản ánh đúng nghiệp vụ nhập kho