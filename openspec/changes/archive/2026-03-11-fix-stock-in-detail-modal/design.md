## Context

Tại trang danh sách phiếu nhập kho (/stock-in), modal chi tiết hiện không hiển thị danh sách sản phẩm. Nguyên nhân:

1. Backend API `/api/inventory/documents?type=IMPORT` trả về danh sách phiếu nhưng không bao gồm field `items`
2. Trong `InventoryServiceImpl.getDocumentsByType()`, items được fetch (line 518) nhưng không được map vào response DTO
3. `InventoryDocumentResponse` DTO không có field để chứa danh sách items
4. Frontend StockInList.jsx đã có sẵn logic hiển thị `selectedRecord.items` nhưng API không trả về dữ liệu

## Goals / Non-Goals

**Goals:**
- Thêm danh sách sản phẩm (items) vào API response của phiếu nhập kho
- Hiển thị đúng thông tin: tên sản phẩm, SKU, size, màu, số lượng, đơn giá, thành tiền

**Non-Goals:**
- Thay đổi logic nghiệp vụ khác
- Thêm tính năng mới cho xuất kho hay chuyển kho

## Decisions

1. **Tạo DTO mới InventoryDocumentItemResponse**
   - Rationale: Tách biệt thông tin chi tiết từng sản phẩm, dễ maintain
   - Alternative: Map trực tiếp vào response không qua DTO → Chọn phương án này vì đơn giản và nhanh hơn

2. **Map items trong getDocumentsByType**
   - Rationale: Tận dụng code có sẵn, items đã được fetch sẵn
   - Alternative: Tạo API riêng cho chi tiết phiếu → Không cần thiết vì dữ liệu đã có

## Risks / Trade-offs

- **Risk**: NullPointerException nếu variant/product relations null → Mitigation: Check null trước khi map
- **Risk**: Performance nếu document list lớn → Mitigation: Items chỉ được fetch khi cần (đang fetch sẵn trong code hiện tại)
