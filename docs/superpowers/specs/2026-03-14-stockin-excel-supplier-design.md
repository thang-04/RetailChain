# Design: Thêm trường Nhà cung cấp vào Excel Import StockIn

**Ngày:** 2026-03-14
**Module:** StockIn / Excel Import

---

## 1. Mục tiêu

Thêm cột "Nhà cung cấp" vào file Excel khi import, cho phép hệ thống tự động match NCC từ tên trong file thay vì chọn thủ công từ dropdown.

---

## 2. Thiết kế

### 2.1. Cập nhật Template Excel

Thêm cột mới vào danh sách cột hợp lệ:

| Tên cột Excel | Key | Bắt buộc |
|---------------|-----|----------|
| Nhà cung cấp | supplierName | Không |

**File:** `src/components/common/ExcelPreviewModal/ExcelPreviewModal.jsx`

```javascript
const EXCEL_COLUMNS = [
  { key: "sku", label: "SKU", required: true },
  { key: "productName", label: "Tên sản phẩm", required: true },
  { key: "quantity", label: "Số lượng", required: true },
  { key: "unitPrice", label: "Đơn giá", required: true },
  { key: "supplierName", label: "Nhà cung cấp", required: false },  // ← THÊM
  { key: "note", label: "Ghi chú", required: false },
];
```

### 2.2. Logic Parse Excel

Khi đọc file Excel, parse cột supplierName và fuzzy match với danh sách suppliers:

```javascript
// Map supplier từ Excel
const supplierNameFromExcel = row["Nhà cung cấp"] || row.Supplier || row.SupplierName || row.NCC || null;
let supplierId = null;

if (supplierNameFromExcel && suppliers.length > 0) {
  const foundSupplier = fuzzyMatch(supplierNameFromExcel, suppliers, 'supplierName' || 'name');
  supplierId = foundSupplier ? (foundSupplier.supplierId || foundSupplier.id) : null;
}

return {
  ...,
  supplierName: supplierNameFromExcel,
  supplierId: supplierId,
};
```

### 2.3. Validation Row

Cập nhật hàm validateRow để kiểm tra supplier:

```javascript
const validateRow = (row, _index) => {
  const errors = [];
  
  // ... validation khác ...

  // Validate supplier
  if (!row.supplierId && row.supplierName) {
    errors.push("Không tìm thấy NCC: " + row.supplierName);
  }

  return {
    isValid: errors.length === 0,
    errors: errors,
  };
};
```

### 2.4. UI Preview Table

Thêm cột "Nhà cung cấp" vào bảng preview:

```jsx
<TableHeader>
  <TableRow>
    <TableHead className="w-10"><input type="checkbox" /></TableHead>
    <TableHead>STT</TableHead>
    <TableHead>SKU</TableHead>
    <TableHead>Tên sản phẩm</TableHead>
    <TableHead>Nhà cung cấp</TableHead>  {/* ← THÊM */}
    <TableHead>Danh mục</TableHead>
    <TableHead>Size</TableHead>
    <TableHead>Màu</TableHead>
    <TableHead>Số lượng</TableHead>
    <TableHead>Đơn giá</TableHead>
    <TableHead>Trạng thái</TableHead>
  </TableRow>
</TableHeader>
```

### 2.5. Xử lý Import

Khi import, ưu tiên dùng supplierId từ cột Excel, nếu không có thì dùng dropdown:

```javascript
const handleImport = () => {
  // Nếu có dòng nào không match supplier thì vẫn cho import các dòng còn lại
  const selectedRows = parsedData
    .filter((_, index) => rowStates[index]?.selected)
    .map((row) => ({
      sku: row.sku,
      productName: row.productName,
      categoryId: row.categoryId,
      size: row.size,
      color: row.color,
      quantity: parseInt(row.quantity, 10),
      unitPrice: parseFloat(row.unitPrice),
      note: row.note,
      // Ưu tiên supplierId từ Excel, không có thì dùng dropdown
      supplierId: row.supplierId || (selectedSupplier ? Number(selectedSupplier) : null),
    }));

  onImport(selectedRows);
};
```

---

## 3. Fallback Behavior

- **Có cột NCC + match được:** Dùng supplierId từ Excel
- **Có cột NCC + không match:** Báo lỗi dòng đó (hiển thị trong cột Trạng thái)
- **Có cột NCC + trống:** Dùng dropdown
- **Không có cột NCC:** Dùng dropdown (hiện tại)

---

## 4. Files cần sửa

1. `src/components/common/ExcelPreviewModal/ExcelPreviewModal.jsx`
   - Cập nhật EXCEL_COLUMNS
   - Thêm logic parse supplierName
   - Thêm validation supplier
   - Thêm cột vào UI table

---

## 5. Testing

- Import file Excel có cột NCC hợp lệ → Tự động match
- Import file Excel có cột NCC không tồn tại → Hiển thị lỗi dòng đó
- Import file Excel không có cột NCC → Dùng dropdown (backward compatible)
