## Why

Khi import Excel trong chức năng Nhập kho, hệ thống sử dụng exact matching (so khớp chính xác) để map category từ Excel vào database. Điều này gây ra vấn đề: nếu trong Excel ghi "Quần" nhưng database có "Quần Jeans", "Quần Tây" thì hệ thống không nhận diện được và yêu cầu user chọn thủ công.

## What Changes

- Thêm fuzzy matching algorithm để so khớp category từ Excel với database
- Xử lý whitespace từ Excel (trim)
- Hiển thị giá trị gốc từ Excel nếu không match được (để user biết cần chọn lại)

## Capabilities

### New Capabilities
- `excel-fuzzy-matching`: Thêm fuzzy matching cho category, size, color khi import Excel

### Modified Capabilities
- `excel-import`: Cập nhật logic mapping từ exact matching sang fuzzy matching

## Impact

- **Frontend**: 
  - `src/components/common/ExcelPreviewModal/ExcelPreviewModal.jsx` - thêm fuzzy matching logic
- **Backend**: Không thay đổi
