## Why

Tại trang /stock-out/create, khi người dùng ở giai đoạn 2 (chọn sản phẩm) và thêm 1 sản phẩm vào danh sách, phần tổng số lượng (total quantity) hiển thị sai: hiển thị 2 thay vì 1.

## What Changes

- Sửa logic tính tổng số lượng trong StockOutWizard
- Kiểm tra xem có phải đang cộng dồn số lượng sản phẩm không đúng cách

## Capabilities

### New Capabilities

- `stock-out-quantity-fix`: Sửa lỗi tính tổng số lượng sản phẩm

### Modified Capabilities

- (không có)

## Impact

- Frontend: Sửa logic trong StockOutWizard component
