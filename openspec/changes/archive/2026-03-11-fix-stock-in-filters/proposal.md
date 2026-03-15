## Why

Trang danh sách phiếu nhập kho (/stock-in) có bộ lọc "Thông minh" bao gồm:
1. Tìm kiếm theo mã phiếu, nhà cung cấp, kho
2. Lọc theo trạng thái (Chờ duyệt, Hoàn thành, Đã hủy)
3. Lọc theo ngày (từ ngày - đến ngày)
4. Nút làm mới để reset bộ lọc

Cần kiểm tra và đảm bảo tất cả các bộ lọc hoạt động đúng.

## What Changes

- Kiểm tra và đảm bảo search filter hoạt động (documentCode, supplier, targetWarehouseName)
- Kiểm tra và đảm bảo status filter hoạt động
- Kiểm tra và đảm bảo date filter hoạt động
- Kiểm tra và đảm bảo reset button hoạt động

## Capabilities

### New Capabilities
- `fix-stock-in-filters`: Đảm bảo bộ lọc trang stock-in hoạt động đúng

### Modified Capabilities
- Không có

## Impact

- File: `RetailChainUi/src/pages/StockIn/StockInList.jsx` - Logic lọc
- Backend: Không cần thay đổi
