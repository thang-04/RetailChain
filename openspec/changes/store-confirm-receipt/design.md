## Context

**Hiện trạng:**
- Store Manager tạo yêu cầu xuất hàng từ kho tổng
- Admin duyệt yêu cầu → Tạo InventoryDocument (phiếu xuất kho)
- InventoryDocument hiện tại không có trạng thái riêng, chỉ dựa vào `documentType`

**Vấn đề:**
- Sau khi Admin duyệt, phiếu xuất ở trạng thái "Pending" mãi
- Không có cơ chế để cửa hàng xác nhận đã nhận hàng
- Admin không biết hàng đã thực sự đến cửa hàng hay chưa

**Stakeholders:**
- Store Manager: Cần xác nhận đã nhận hàng
- Admin: Cần biết trạng thái giao hàng

## Goals / Non-Goals

**Goals:**
- Thêm trạng thái cho InventoryDocument (PENDING, COMPLETED)
- Tạo API để cửa hàng xác nhận đã nhận hàng
- Tạo giao diện "Hàng đến" trong Store Dashboard để xem và xác nhận

**Non-Goals:**
- Thay đổi luồng tạo phiếu nhập kho (Stock In)
- Thêm trạng thái "Đang giao" hay "Hủy"
- Tích hợp với hệ thống shipping/billing

## Decisions

**1. Thêm status field vào InventoryDocument**
- Thay vì derive status từ documentType, thêm trường `status` riêng
- Lý do: Rõ ràng, dễ query, dễ mở rộng thêm status mới

**2. API endpoint structure**
- `PUT /api/inventory/{id}/confirm` - Xác nhận đã nhận
- `GET /api/inventory/store/{storeId}/export` - Lấy phiếu xuất đến cửa hàng
- Lý do: RESTful, tách biệt rõ giữa admin và store operations

**3. Frontend tab placement**
- Tab "Hàng đến" trong Store Dashboard (cùng cấp với Inventory, Staff)
- Lý do: Phân biệt rõ giữa "Yêu cầu của tôi" (request tôi tạo) và "Hàng đến" (gửi đến tôi)

## Risks / Trade-offs

- **[Risk]** Store có thể không xác nhận → Phiếu mãi ở PENDING
  - **[Mitigation]** Thêm thông báo nhắc nhở, hoặc auto-complete sau X ngày (để sau)
- **[Risk]** Double confirmation (cả admin và store đều confirm)
  - **[Mitigation]** Chỉ store mới có quyền confirm, admin chỉ xem
- **[Risk]** Cần migration cho existing data
  - **[Mitigation]** Set default status = PENDING cho existing records
