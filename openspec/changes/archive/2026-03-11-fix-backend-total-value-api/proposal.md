## Why

Trang danh sách xuất kho (Stock Out) hiện không hiển thị giá trị (totalValue) do backend API không trả về trường này hoặc server chưa được khởi động. Người dùng không thể xem tổng giá trị xuất kho.

## What Changes

- Kiểm tra và đảm bảo backend server đang chạy
- Sửa API `/api/inventory/documents?type=TRANSFER` trả về đúng trường `totalValue`
- Đảm bảo `InventoryDocument` có trường `totalAmount` được lưu khi tạo phiếu xuất kho

## Capabilities

### New Capabilities

- `stock-out-total-value-api`: Đảm bảo API xuất kho trả về totalValue

### Modified Capabilities

- (không có)

## Impact

- Backend: Kiểm tra và sửa InventoryServiceImpl để trả về totalValue
- Database: Kiểm tra bảng inventory_documents có trường total_amount
