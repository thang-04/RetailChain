## Why

Khi tạo phiếu chuyển kho (TRANSFER), backend không lưu trường `total_amount` vào database, dẫn đến frontend hiển thị giá trị = 0. Người dùng không thể xem tổng giá trị xuất kho.

## What Changes

- Sửa method `transferStock()` trong `InventoryServiceImpl.java` để tính và lưu `totalAmount` khi tạo phiếu chuyển kho
- Tính tổng giá trị = sum(quantity * unitPrice) từ các items trong request

## Capabilities

### New Capabilities

- `transfer-total-amount`: Lưu totalAmount khi tạo phiếu chuyển kho

### Modified Capabilities

- (không có)

## Impact

- Backend: Sửa InventoryServiceImpl.transferStock()
- Database: Không cần thay đổi (cột đã có)
