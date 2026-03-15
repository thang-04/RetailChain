## Why

Modal import Excel hiện tại (ExcelPreviewModal) có 782 dòng code trong một file, kết hợp cả UI và business logic. Các vấn đề bao gồm: không có pagination (chậm với 500+ dòng), không thể filter theo trạng thái, inline select trong table khó thao tác, không có undo/redo hay draft persistence. Cần tái thiết kế thành wizard 3 bước với UX tốt hơn và code dễ maintain.

## What Changes

- Thay thế ExcelPreviewModal (1 file 782 dòng) bằng ExcelImportWizard (3 bước wizard)
- Bước 1: Upload file + download template
- Bước 2: Map columns (auto-detect + manual)
- Bước 3: Review với pagination, filter tabs, bulk actions
- Thêm Undo/Redo (Ctrl+Z / Ctrl+Y)
- Thêm Auto-save draft vào localStorage (24h)
- Tách business logic ra hooks riêng biệt
- Thêm expand row editor thay vì inline select

## Capabilities

### New Capabilities
- `excel-import-wizard`: Wizard 3 bước cho phép upload, map columns, và review dữ liệu trước khi import
- `excel-pagination`: Phân trang và filter tabs cho table preview (Tất cả / Hợp lệ / Lỗi / Mới)
- `excel-undo-redo`: Undo/Redo cho các thay đổi trong session
- `excel-draft-persistence`: Auto-save draft vào localStorage, restore khi mở lại (24h)
- `excel-bulk-actions`: Bulk edit cho NCC và Danh mục

### Modified Capabilities
- (không có - đây là tính năng mới hoàn toàn)

## Impact

- **Code**: Thay thế hoàn toàn `src/components/common/ExcelPreviewModal/`
- **Components mới**: ExcelImportWizard, Step1Upload, Step2Mapping, Step3Review, DataTable, BulkActions, FilterTabs
- **Hooks mới**: useExcelParser, useValidation, useUndoRedo, useDraftManager
- **Pages**: StockInList sử dụng ExcelImportWizard thay cho ExcelPreviewModal
