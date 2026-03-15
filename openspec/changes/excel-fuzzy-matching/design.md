## Context

Tính năng Excel Import trong trang Nhập kho hiện tại sử dụng exact matching (so khớp chính xác) để map category từ Excel vào database. Điều này gây ra vấn đề khi tên category trong Excel không khớp chính xác với database.

## Goals / Non-Goals

**Goals:**
- Thêm fuzzy matching algorithm để map category/size/color từ Excel vào database
- Xử lý whitespace từ Excel (trim)
- Hiển thị giá trị gốc nếu không match được để user biết cần chọn thủ công

**Non-Goals:**
- Không thay đổi logic validation
- Không thay đổi API backend

## Decisions

### 1. Fuzzy Matching Algorithm
**Quyết định**: Sử dụng 3-tier matching strategy

```js
const fuzzyMatch = (excelValue, dbList, dbField = 'name') => {
  const trimmed = excelValue?.trim()?.toLowerCase();
  if (!trimmed) return null;

  // Tier 1: Exact match (case-insensitive)
  const exact = dbList.find(item => 
    item[dbField]?.toLowerCase() === trimmed
  );
  if (exact) return exact;

  // Tier 2: DB contains Excel (partial - DB contains Excel value)
  const dbContainsExcel = dbList.find(item => 
    item[dbField]?.toLowerCase().includes(trimmed)
  );
  if (dbContainsExcel) return dbContainsExcel;

  // Tier 3: Excel contains DB (partial - Excel value contains DB name)
  const excelContainsDb = dbList.find(item => 
    trimmed.includes(item[dbField]?.toLowerCase())
  );
  return excelContainsDb;
};
```

**Alternatives considered:**
- Chỉ exact matching: Không đủ linh hoạt
- Levenshtein distance: Quá phức tạp cho use case này

**Rationale**: 3-tier approach balance giữa simplicity và flexibility.

### 2. Xử lý Whitespace
**Quyết định**: Trim tất cả giá trị từ Excel trước khi so khớp

```js
const trimmed = excelValue?.trim();
```

### 3. Fallback UX
**Quyết định**: Nếu không match được, hiển thị giá trị gốc từ Excel

- Dropdown vẫn hiển thị các options từ database
- Giá trị không match sẽ hiển thị trong Select nhưng không được chọn
- User phải chọn thủ công từ dropdown

## Risks / Trade-offs

- **[Risk]**: Fuzzy matching có thể chọn sai category nếu có nhiều kết quả gần giống
  - **Mitigation**: Ưu tiên exact match trước, chỉ dùng partial khi không có exact match

- **[Risk]**: Performance khi danh sách category lớn
  - **Mitigation**: Danh sách category hiện tại chỉ ~10 items, không ảnh hưởng

- **[Risk]**: "Quần" có thể match với cả "Quần Jeans" và "Quần Tây"
  - **Mitigation**: Chọn kết quả đầu tiên, user có thể đổi thủ công
