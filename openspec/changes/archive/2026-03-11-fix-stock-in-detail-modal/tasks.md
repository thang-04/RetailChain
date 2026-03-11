## 1. Tạo DTO mới

- [x] 1.1 Tạo file `InventoryDocumentItemResponse.java` trong package dto/response
- [x] 1.2 Thêm các fields: variantId, productName, sku, size, color, quantity, unitPrice, totalPrice
- [x] 1.3 Thêm field `items` (List<InventoryDocumentItemResponse>) vào `InventoryDocumentResponse.java`

## 2. Cập nhật Service

- [x] 2.1 Cập nhật method `getDocumentsByType` trong `InventoryServiceImpl.java`
- [x] 2.2 Map thông tin items từ InventoryDocumentItem vào InventoryDocumentItemResponse
- [x] 2.3 Bao gồm items trong InventoryDocumentResponse builder

## 3. Kiểm tra

- [x] 3.1 Build và khởi động server
- [x] 3.2 Test API bằng curl
- [x] 3.3 Verify modal hiển thị đúng thông tin sản phẩm
