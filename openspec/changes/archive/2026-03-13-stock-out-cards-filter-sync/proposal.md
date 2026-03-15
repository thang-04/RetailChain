## Why

Hiện tại, trang /stock-out có sự không nhất quán giữa stat cards và table: cards luôn hiển thị dữ liệu "tháng hiện tại" cố định, trong khi table cho phép người dùng lọc theo bất kỳ khoảng thời gian nào. Khi người dùng lọc Q1/2026 trong table, cards vẫn hiển thị tháng 3/2026 - gây confusion và không phản ánh đúng dữ liệu đang xem.

## What Changes

- Đồng bộ date filter giữa stat cards và table - cùng một bộ lọc ngày ảnh hưởng đến cả hai
- Cập nhật logic tính trend theo timeframe type:
  - Filter 1 tháng → trend so với tháng trước
  - Filter 1 quý → trend so với quý trước
  - Filter 1 năm → trend so với năm trước
  - Custom range → ẩn trend (không có baseline rõ ràng)
- Thêm logic xử lý edge case: khi filter quá rộng (cả năm) cards vẫn hiển thị đúng dữ liệu đã aggregate
- Khi records = 0, cards ẩn hoàn toàn (giữ nguyên như hiện tại)

## Capabilities

### New Capabilities
- `stat-cards-filter-sync`: Đồng bộ bộ lọc thời gian giữa stat cards và data table trong trang stock-out

### Modified Capabilities
- (none - không thay đổi requirement ở spec level)

## Impact

- **Frontend**: Cập nhật `StockOutList.jsx` - refactor stats calculation để nhận filter params
- **Business Logic**: Logic trend calculation mới theo timeframe detection
- **UX**: Nhất quán hơn - người dùng thấy đúng dữ liệu mình đang lọc