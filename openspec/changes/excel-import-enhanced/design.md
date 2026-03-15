## Context

Hiện tại, Excel Import trong StockIn đã có basic version với các trường: SKU, ProductName, Quantity, UnitPrice, Note. Tuy nhiên:

- Database yêu cầu category_id, size, color là NOT NULL
- Người dùng cần chọn Supplier cho phiếu nhập
- Cần validate dropdown cho các trường bắt buộc

**Database constraints đã xác nhịn:**
- products.category_id: NOT NULL
- product_variants.size: NOT NULL
- product_variants.color: NOT NULL
- inventory_document.supplier_id: NULL (optional)

## Goals / Non-Goals

**Goals:**
- Thêm Supplier dropdown cho toàn bộ phiếu nhập
- Thêm Category dropdown per-row (bắt buộc)
- Thêm Size dropdown per-row (bắt buộc)
- Thêm Color dropdown per-row (bắt buộc)
- Validate đầy đủ theo database schema
- Giữ nguyên luồng preview trước khi import

**Non-Goals:**
- Không thay đổi API backend hiện có (ngoài importStockFromExcel)
- Không hỗ trợ multi-supplier trong 1 phiếu (1 phiếu = 1 supplier)
- Không tạo mới category/size/color trong DB từ Excel

## Decisions

### 1. Dropdown Values từ đâu?

**Quyết định:**
- **Category**: Gọi API `/api/categories` (đã có)
- **Supplier**: Gọi API `/api/suppliers` (đã có)  
- **Size**: Hardcode từ DB data (S, M, L, XL, 26-43, UNI)
- **Color**: Hardcode từ DB data (Đen, Trắng, Xám, Xanh Navy, Xanh, Hoa, Nâu, Be, Vàng)

**Lý do:**
- API categories/suppliers có sẵn, chỉ cần gọi thêm
- Size/Color từ DB có thể hardcode vì số lượng giới hạn và ít thay đổi

### 2. Validation Strategy

**Quyết định:** Validate ở cả frontend và backend

| Trường | Frontend | Backend |
|--------|----------|---------|
| SKU | Required, không trống | Check tồn tại hoặc tạo mới |
| ProductName | Required | Sử dụng để tạo product mới |
| Category | **BẮT BUỘC** -Dropdown | Gán categoryId khi tạo product |
| Size | **BẮT BUỘC** -Dropdown | Gán size khi tạo variant |
| Color | **BẮT BUỘC** -Dropdown | Gán color khi tạo variant |
| Quantity | Required, > 0 | Sử dụng để tạo document item |
| UnitPrice | Optional | Sử dụng làm price của variant |
| Supplier | **BẮT BUỘC** -Dropdown | Gán supplierId cho document |
| Note | Optional | Lưu vào document item |

### 3. Data Flow

```
Excel File → Parse → Preview Modal
                       ├── Load Categories (API)
                       ├── Load Suppliers (API)
                       ├── Show dropdowns per row
                       └── Validate (Category/Size/Color required)
                           
                           ↓
                    User confirms
                           ↓
              Backend importStockFromExcel
                           ├── Find/Create Product (with categoryId)
                           ├── Find/Create Variant (with size, color)
                           ├── Create InventoryDocument (with supplierId)
                           └── Create InventoryDocumentItem
```

### 4. API Changes

**Backend cần cập nhật:**
- `importStockFromExcel(List<Map<String, Object>> items)` 
  - Thêm field: `categoryId`, `size`, `color`, `supplierId`
  - Thêm SupplierRepository để resolve supplier name → ID

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Category/Size/Color dropdown chưa load khi user mở modal | Load data trong useEffect khi modal mở, show loading state |
| User không chọn đủ dropdown | Validate frontend: disable Import button nếu chưa valid |
| SKU trùng với size/color khác | Check (sku, size, color) unique, update nếu đã tồn tại |
| Import thất bại giữa chừng | Transaction rollback toàn bộ |

## Migration Plan

1. **Frontend:**
   - Cập nhật ExcelPreviewModal.jsx
   - Thêm state cho categories, suppliers, sizes, colors
   - Load data khi modal opens
   - Thêm dropdown columns trong table
   - Thêm validation

2. **Backend:**
   - Cập nhật InventoryServiceImpl.importStockFromExcel
   - Thêm xử lý categoryId, size, color, supplierId

3. **Test:**
   - Test với file Excel có đầy đủ trường
   - Test validation (bắt buộc chọn dropdown)

## Open Questions

1. **Size/Color có thêm mới không?** → Hiện tại chỉ chọn từ dropdown, không tạo mới
2. **Category có thêm mới không?** → Hiện tại chỉ chọn từ API, không tạo mới
