## Context

Backend API `/api/inventory/documents?type=TRANSFER` cần trả về trường `totalValue` cho mỗi document. Hiện tại code đã có logic tính totalValue nhưng cần xác nhận:
1. Server đang chạy
2. Database có dữ liệu total_amount
3. API endpoint đúng

## Goals / Non-Goals

**Goals:**
- Xác nhận backend server đang chạy
- Kiểm tra API trả về đúng totalValue
- Đảm bảo InventoryDocument entity có trường totalAmount

**Non-Goals:**
- Không thay đổi cấu trúc database
- Không thay đổi API contract

## Decisions

1. **Kiểm tra server**: Dùng curl để test API endpoint
2. **Kiểm tra response**: Xem JSON trả về có totalValue không
3. **Kiểm tra database**: Xem bảng inventory_documents có cột total_amount không

## Risks / Trade-offs

- [Rủi ro] Server chưa chạy → Cần khởi động Spring Boot
- [Rủi ro] API path sai → Cần kiểm tra lại endpoint trong InventoryController
