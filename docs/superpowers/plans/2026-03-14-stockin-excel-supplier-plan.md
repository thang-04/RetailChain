# Excel Supplier Column Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Thêm cột "Nhà cung cấp" vào Excel import StockIn, tự động match NCC từ tên trong file.

**Architecture:** Cập nhật ExcelPreviewModal để parse cột supplierName từ Excel, fuzzy match với database, hiển thị lỗi nếu không match nhưng vẫn cho import các dòng hợp lệ.

**Tech Stack:** React, xlsx, shadcn/ui

---

## File Structure

Chỉ cần sửa 1 file:
- `src/components/common/ExcelPreviewModal/ExcelPreviewModal.jsx` - Thêm logic parse supplierName, validation, và cột UI

---

## Task 1: Cập nhật ExcelPreviewModal

**Files:**
- Modify: `src/components/common/ExcelPreviewModal/ExcelPreviewModal.jsx`

### Task 1.1: Thêm cột supplierName vào EXCEL_COLUMNS

- [ ] **Step 1: Tìm và cập nhật EXCEL_COLUMNS**

Tìm dòng 36-42 trong file `ExcelPreviewModal.jsx`:

```javascript
const EXCEL_COLUMNS = [
  { key: "sku", label: "SKU", required: true },
  { key: "productName", label: "Tên sản phẩm", required: true },
  { key: "quantity", label: "Số lượng", required: true },
  { key: "unitPrice", label: "Đơn giá", required: true },
  { key: "note", label: "Ghi chú", required: false },
];
```

Thêm cột supplierName:

```javascript
const EXCEL_COLUMNS = [
  { key: "sku", label: "SKU", required: true },
  { key: "productName", label: "Tên sản phẩm", required: true },
  { key: "quantity", label: "Số lượng", required: true },
  { key: "unitPrice", label: "Đơn giá", required: true },
  { key: "supplierName", label: "Nhà cung cấp", required: false },
  { key: "note", label: "Ghi chú", required: false },
];
```

- [ ] **Step 2: Commit**

```bash
git add src/components/common/ExcelPreviewModal/ExcelPreviewModal.jsx
git commit -m "feat: add supplierName column to EXCEL_COLUMNS"
```

### Task 1.2: Thêm logic parse supplierName trong handleFileSelect

- [ ] **Step 1: Tìm vị trí parse Excel (khoảng dòng 233-264)**

Trong hàm `handleFileSelect`, sau khi parse các trường khác, thêm parse supplierName:

```javascript
const normalizedData = jsonData.map((row, index) => {
  // ... existing code ...

  // Map supplier từ Excel (THÊM MỚI)
  const supplierNameFromExcel = row["Nhà cung cấp"] || row.Supplier || row.SupplierName || row.NCC || row.ncc || null;
  let supplierId = null;
  
  // Fuzzy match với suppliers (sẽ được thực hiện sau khi load suppliers)
  // Đánh dấu để xử lý sau
  const supplierNameRaw = supplierNameFromExcel;

  return {
    stt: index + 1,
    sku: row.SKU || row.sku || row.Mã || row.Mã_SP || "",
    productName: row["Tên sản phẩm"] || row.productName || row.Name || row.name || "",
    categoryId: categoryId,
    categoryName: categoryNameFromExcel,
    size: sizeFromExcel,
    color: colorFromExcel,
    sizeRaw: sizeFromExcelRaw,
    colorRaw: colorFromExcelRaw,
    quantity: row["Số lượng"] || row.quantity || row.Quantity || row.qty || 0,
    unitPrice: row["Đơn giá"] || row.unitPrice || row.Price || row.price || row["Giá"] || 0,
    supplierName: supplierNameRaw,       // THÊM
    supplierId: supplierId,              // THÊM (sẽ được fill sau)
    note: row["Ghi chú"] || row.note || row.Note || "",
  };
});
```

- [ ] **Step 2: Thêm useEffect để fuzzy match supplier sau khi load suppliers**

Thêm sau useEffect existing (khoảng dòng 108-134):

```javascript
// Fuzzy match supplier sau khi suppliers loaded
useEffect(() => {
  if (suppliers.length > 0 && parsedData.length > 0) {
    const needsRemap = parsedData.some(row => row.supplierName && !row.supplierId);
    if (needsRemap) {
      const remappedData = parsedData.map(row => {
        if (row.supplierName && !row.supplierId) {
          // Fuzzy match supplierName với suppliers
          const foundSupplier = fuzzyMatch(row.supplierName, suppliers, 'supplierName');
          if (!foundSupplier) {
            // Thử match với trường 'name'
            return { ...row, supplierId: null };
          }
          return { ...row, supplierId: foundSupplier.supplierId || foundSupplier.id };
        }
        return row;
      });
      setParsedData(remappedData);
      
      // Re-validate rows
      const newStates = {};
      remappedData.forEach((row, index) => {
        const validation = validateRow(row, index);
        newStates[index] = {
          ...rowStates[index],
          ...validation,
          selected: validation.isValid && (rowStates[index]?.selected || false),
        };
      });
      setRowStates(newStates);
    }
  }
}, [suppliers]);
```

- [ ] **Step 3: Cập nhật validateRow để kiểm tra supplier**

Tìm hàm validateRow (khoảng dòng 161-198) và thêm validation:

```javascript
const validateRow = useCallback((row, _index) => {
  const errors = [];

  if (!row.sku || row.sku.toString().trim() === "") {
    errors.push("SKU không được để trống");
  }

  if (!row.productName || row.productName.toString().trim() === "") {
    errors.push("Tên sản phẩm không được để trống");
  }

  if (!row.categoryId) {
    errors.push("Chưa chọn danh mục");
  }

  if (!row.size) {
    errors.push("Chưa chọn size");
  }

  if (!row.color) {
    errors.push("Chưa chọn màu");
  }

  const quantity = parseInt(row.quantity, 10);
  if (isNaN(quantity) || quantity <= 0) {
    errors.push("Số lượng phải là số nguyên dương");
  }

  const unitPrice = parseFloat(row.unitPrice);
  if (isNaN(unitPrice) || unitPrice <= 0) {
    errors.push("Đơn giá phải lớn hơn 0");
  }

  // THÊM: Validate supplier
  if (row.supplierName && !row.supplierId) {
    errors.push("Không tìm thấy NCC: " + row.supplierName);
  }

  return {
    isValid: errors.length === 0,
    errors: errors,
  };
}, []);
```

- [ ] **Step 4: Thêm cột NCC vào UI table**

Tìm TableHeader (khoảng dòng 546-568) và thêm cột:

```jsx
<TableHeader>
  <TableRow>
    <TableHead className="w-10">
      <input
        type="checkbox"
        checked={stats.selected === stats.valid && stats.valid > 0}
        onChange={(e) => handleSelectAll(e.target.checked)}
        className="w-4 h-4"
      />
    </TableHead>
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

- [ ] **Step 5: Thêm cell hiển thị NCC trong TableBody**

Tìm TableBody (khoảng dòng 569-677) và thêm cell sau productName:

```jsx
<TableCell>{row.productName}</TableCell>
<TableCell>  {/* ← THÊM */}
  {row.supplierName ? (
    row.supplierId ? (
      <span className="text-green-600">{row.supplierName}</span>
    ) : (
      <span className="text-red-500">{row.supplierName} (không tìm thấy)</span>
    )
  ) : (
    <span className="text-muted-foreground">-</span>
  )}
</TableCell>
<TableCell>
```

- [ ] **Step 6: Cập nhật handleImport để ưu tiên supplierId từ Excel**

Tìm hàm handleImport (khoảng dòng 394-420) và cập nhật:

```javascript
const handleImport = () => {
  // Kiểm tra có dòng nào lỗi supplier không
  const invalidSupplierRows = parsedData.filter(
    (_, index) => rowStates[index]?.selected && rowStates[index]?.errors?.some(e => e.includes("Không tìm thấy NCC"))
  );

  if (invalidSupplierRows.length > 0) {
    // Vẫn cho phép import, nhưng filter bỏ các dòng lỗi
    toast.warning(`${invalidSupplierRows.length} dòng có NCC không hợp lệ và sẽ bị bỏ qua`);
  }

  const selectedRows = parsedData
    .filter((_, index) => {
      const isSelected = rowStates[index]?.selected;
      const hasSupplierError = rowStates[index]?.errors?.some(e => e.includes("Không tìm thấy NCC"));
      return isSelected && !hasSupplierError;
    })
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

  if (selectedRows.length === 0) {
    setError("Không có dòng nào hợp lệ để import");
    return;
  }

  onImport(selectedRows);
  handleClose();
};
```

- [ ] **Step 7: Commit**

```bash
git add src/components/common/ExcelPreviewModal/ExcelPreviewModal.jsx
git commit -m "feat: add supplier column to Excel import with fuzzy matching"
```

---

## Task 2: Testing

- [ ] **Step 1: Test import Excel có cột NCC hợp lệ**

Tạo file Excel test với cột "Nhà cung cấp" có tên đúng trong database.

Expected: Supplier được match tự động, cột hiển thị tên supplier màu xanh.

- [ ] **Step 2: Test import Excel có cột NCC không tồn tại**

Tạo file Excel test với cột "Nhà cung cấp" có tên không có trong database.

Expected: Hiển thị lỗi "Không tìm thấy NCC: [tên]", dòng bị đỏ, nhưng vẫn import được các dòng còn lại.

- [ ] **Step 3: Test import Excel không có cột NCC**

Import file Excel cũ không có cột NCC.

Expected: Hoạt động bình thường, dùng dropdown chọn NCC (backward compatible).

- [ ] **Step 4: Commit**

```bash
git add .
git commit -m "test: verify Excel supplier import scenarios"
```

---

## Summary

Các thay đổi chính:
1. Thêm cột `supplierName` vào EXCEL_COLUMNS
2. Parse supplierName từ Excel với nhiều tên cột: "Nhà cung cấp", "Supplier", "SupplierName", "NCC"
3. Fuzzy match với suppliers từ database
4. Validate và hiển thị lỗi nếu không match
5. Ưu tiên supplierId từ Excel, fallback sang dropdown
6. Thêm cột hiển thị trong UI table
