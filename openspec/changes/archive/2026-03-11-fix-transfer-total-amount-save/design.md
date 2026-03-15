## Context

Method `transferStock()` trong `InventoryServiceImpl.java` hiện tại không tính và lưu trường `totalAmount` vào entity `InventoryDocument`. Database đã có cột `total_amount` nhưng giá trị luôn là NULL cho các phiếu TRANSFER.

## Goals / Non-Goals

**Goals:**
- Tính tổng giá trị từ các items trong request (quantity * unitPrice)
- Lưu vào field `totalAmount` của InventoryDocument trước khi persist

**Non-Goals:**
- Không thay đổi API contract
- Không thay đổi cấu trúc database

## Decisions

1. **Cách tính totalAmount**: Duyệt qua danh sách items, lấy variant.getPrice() * item.quantity, tính tổng
2. **Vị trí đặt code**: Trong method `transferStock()`, sau khi tạo document nhưng trước khi save

## Risks / Trade-offs

- [Rủi ro] variant.getPrice() có thể null → Sử dụng BigDecimal.ZERO làm mặc định
