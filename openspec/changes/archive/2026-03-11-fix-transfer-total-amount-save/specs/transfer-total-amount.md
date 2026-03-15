# Transfer Total Amount Save

## Mô tả

Sửa method `transferStock()` trong `InventoryServiceImpl.java` để tính và lưu `totalAmount` khi tạo phiếu chuyển kho.

## Yêu cầu

- Tính tổng giá trị = sum(variant.getPrice() * item.quantity)
- Lưu vào field `totalAmount` của InventoryDocument
- Xử lý trường hợp variant.getPrice() null (mặc định = 0)
