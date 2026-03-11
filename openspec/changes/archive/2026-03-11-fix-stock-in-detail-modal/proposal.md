## Why

Tại trang danh sách phiếu nhập kho (/stock-in), khi người dùng click "Xem Chi Tiết" để mở modal, các sản phẩm trong phiếu nhập không hiển thị. Nguyên nhân là API `/api/inventory/documents?type=IMPORT` trả về danh sách phiếu nhưng không bao gồm danh sách items (chi tiết sản phẩm). Backend đã fetch items nhưng không map vào response DTO.

## What Changes

- Thêm field `items` vào `InventoryDocumentResponse` DTO để chứa danh sách sản phẩm
- Tạo `InventoryDocumentItemResponse` DTO mới để map thông tin chi tiết từng sản phẩm
- Cập nhật `getDocumentsByType` trong InventoryServiceImpl để map items vào response
- Frontend StockInList.jsx đã có sẵn logic hiển thị `selectedRecord.items`, chỉ cần đợi API trả về đúng format

## Capabilities

### New Capabilities
- `fix-stock-in-detail-modal`: Hiển thị chi tiết sản phẩm trong modal xem phiếu nhập kho

### Modified Capabilities
- Không có

## Impact

- Backend:
  - File: `InventoryDocumentResponse.java` - Thêm field items
  - File: `InventoryDocumentItemResponse.java` - Tạo mới DTO cho item
  - File: `InventoryServiceImpl.java` - Cập nhật method getDocumentsByType để map items
- Frontend: Không cần thay đổi (đã có sẵn logic hiển thị)
