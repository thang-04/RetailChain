## Why

Hiện tại, khi Admin duyệt yêu cầu xuất hàng từ cửa hàng, phiếu xuất kho được tạo nhưng không có cơ chế để cửa hàng xác nhận đã nhận hàng. Phiếu xuất luôn ở trạng thái "Chờ duyệt" và không theo dõi được liệu cửa hàng đã nhận được hàng hay chưa.

## What Changes

1. **Database**: Thêm cột `status` vào bảng `inventory_document` để theo dõi trạng thái phiếu xuất (PENDING, COMPLETED)

2. **Backend API**:
   - Thêm API `PUT /api/inventory/{id}/confirm` để cửa hàng xác nhận đã nhận hàng
   - Thêm API `GET /api/inventory/store/{storeId}/export` để lấy danh sách phiếu xuất đến cửa hàng

3. **Frontend - Store Dashboard**:
   - Thêm tab mới "Hàng đến" hiển thị danh sách phiếu xuất chờ xác nhận
   - Hiển thị chi tiết phiếu khi click vào
   - Nút "Xác nhận đã nhận" cho phiếu có trạng thái PENDING

4. **Frontend - Stock Out (Admin)**:
   - Cập nhật hiển thị status: PENDING → "Chờ xác nhận", COMPLETED → "Hoàn thành"

## Capabilities

### New Capabilities

- `store-receipt-confirmation`: Xác nhận đã nhận hàng từ cửa hàng
  - API xác nhận phiếu xuất
  - Danh sách phiếu xuất đến cửa hàng
  - Giao diện xác nhận trong Store Dashboard

### Modified Capabilities

- `inventory-management`: Cập nhật status field cho inventory_document
  - Thêm trạng thái PENDING/COMPLETED

## Impact

- **Database**: Thêm column `status` vào `inventory_document`
- **Backend**: Thêm 2 API mới trong InventoryController
- **Frontend**: Thêm page mới StoreIncomingShipments, cập nhật StockOutList
