## 1. Database

- [x] 1.1 Thêm cột `status` vào bảng `inventory_document` (VARCHAR(20), default 'PENDING')
- [x] 1.2 Cập nhật existing records set status = 'COMPLETED' cho IMPORT (vì đã hoàn thành)

## 2. Backend - Entity & Repository

- [x] 2.1 Thêm field `status` vào `InventoryDocument` entity
- [x] 2.2 Thêm getter/setter hoặc sử dụng Lombok @Getter @Setter

## 3. Backend - Service

- [x] 3.1 Cập nhật `InventoryServiceImpl.createTransferDocument()` để set status = PENDING khi tạo mới
- [x] 3.2 Thêm method `confirmReceipt(Long documentId)` trong InventoryService
- [x] 3.3 Thêm method `getExportDocumentsByStore(Long storeId)` trong InventoryService

## 4. Backend - Controller

- [x] 4.1 Thêm API `PUT /api/inventory/{id}/confirm` - xác nhận đã nhận
- [x] 4.2 Thêm API `GET /api/inventory/store/{storeId}/export` - lấy phiếu xuất theo cửa hàng

## 5. Backend - DTO Response

- [x] 5.1 Cập nhật `InventoryDocumentResponse` để include `status` field

## 6. Frontend - Service Layer

- [x] 6.1 Thêm method `confirmReceipt(documentId)` trong `inventory.service.js`
- [x] 6.2 Thêm method `getExportDocumentsByStore(storeId)` trong `inventory.service.js`

## 7. Frontend - Store Dashboard Page

- [x] 7.1 Tạo component `StoreIncomingShipments.jsx` - hiển thị danh sách phiếu nhận
- [x] 7.2 Thêm tab "Hàng đến" vào StoreDashboardPage
- [x] 7.3 Tạo component `IncomingShipmentDetailDialog.jsx` - chi tiết phiếu + nút xác nhận

## 8. Frontend - Stock Out Page

- [x] 8.1 Cập nhật status mapping trong StockOutList: PENDING → "Chờ xác nhận", COMPLETED → "Hoàn thành"

## 9. Testing & Verification

- [ ] 9.1 Test tạo request từ Store → Admin duyệt → Store xác nhận
- [ ] 9.2 Verify dữ liệu trong database
- [ ] 9.3 Test filter status trong cả Admin và Store views
