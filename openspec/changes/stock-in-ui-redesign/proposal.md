## Why

Trang /stock-in hiện tại sử dụng design cũ (có dark mode classes, header đơn giản, không có stat cards) trong khi /stock-out đã được redesign với giao diện mới hiện đại hơn. Cần đồng bộ hóa design giữa 2 trang để đảm bảo consistency và cải thiện UX với stat cards có filter sync.

## What Changes

- Thêm 5 stat cards vào trang stock-in với metrics: Tổng phiếu, Chờ duyệt, Hoàn thành, Đã hủy, Giá trị
- Thêm metrics bổ sung: Tổng sản phẩm nhập, Số nhà cung cấp unique
- Đổi header style: gradient background với Download icon, màu emerald accent
- Xóa bỏ dark mode classes (giữ light mode only như stock-out)
- Thêm filter pills để hiển thị active filters
- Đồng bộ date filter giữa stat cards và table (giống stock-out đã implement)
- Giữ nguyên Excel Import feature
- Sửa empty state sang tiếng Việt

## Capabilities

### New Capabilities
- `stock-in-stat-cards`: Thêm stat cards vào trang stock-in với metrics và filter sync
- `stock-in-header-redesign`: Redesign header với gradient emerald và Download icon
- `stock-in-filter-pills`: Thêm filter pills để display active filters
- `stock-in-empty-state-vi`: Sửa empty state sang tiếng Việt

### Modified Capabilities
- (none - không thay đổi requirement ở spec level)

## Impact

- **Frontend**: Cập nhật `StockInList.jsx` - thêm stat cards, refactor header, thêm filter pills
- **UI Consistency**: Stock-in và stock-out sẽ có design nhất quán
- **UX**: Người dùng thấy overview dữ liệu với stats và filter sync