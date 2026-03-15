## 1. Setup & Infrastructure

- [x] 1.1 Tạo folder structure `src/components/common/ExcelImportWizard/`
- [x] 1.2 Tạo folder `src/hooks/` nếu chưa có
- [x] 1.3 Tạo barrel file index.js cho ExcelImportWizard

## 2. Hooks - Business Logic

- [x] 2.1 Tạo hook `useExcelParser.js` - parse Excel, fuzzy matching
- [x] 2.2 Tạo hook `useValidation.js` - validate từng dòng
- [x] 2.3 Tạo hook `useUndoRedo.js` - undo/redo state management
- [x] 2.4 Tạo hook `useDraftManager.js` - localStorage draft (24h)

## 3. Components - Step 1: Upload

- [x] 3.1 Tạo component `Step1Upload.jsx`
- [x] 3.2 Thêm chức năng upload file Excel (.xlsx, .xls)
- [x] 3.3 Thêm chức năng download template
- [x] 3.4 Validate file format và hiển thị lỗi

## 4. Components - Step 2: Mapping

- [x] 4.1 Tạo component `Step2Mapping.jsx`
- [x] 4.2 Implement auto-detect column mapping
- [x] 4.3 Thêm manual mapping override
- [x] 4.4 Preview data sau mapping

## 5. Components - Step 3: Review

- [x] 5.1 Tạo component `Step3Review.jsx`
- [x] 5.2 Tạo component `DataTable.jsx` với pagination
- [x] 5.3 Tạo component `FilterTabs.jsx` (Tất cả/Hợp lệ/Lỗi/Mới)
- [x] 5.4 Tạo component `BulkActions.jsx` (Bulk NCC, Category)
- [x] 5.5 Tạo component `RowEditor.jsx` - expand row edit
- [x] 5.6 Tích hợp undo/redo vào table

## 6. Main Wizard Component

- [x] 6.1 Tạo `ExcelImportWizard.jsx` - wizard container
- [x] 6.2 Implement step navigation (Next/Back)
- [x] 6.2 Tích hợp draft auto-save
- [x] 6.3 Tích hợp import callback

## 7. Integration

- [x] 7.1 Update `StockInList.jsx` sử dụng `ExcelImportWizard` thay `ExcelPreviewModal`
- [x] 7.2 Test toàn bộ luồng import
- [ ] 7.3 Xóa file `ExcelPreviewModal.jsx` cũ

## 8. Polish & Error Handling

- [x] 8.1 Thêm toast notifications cho các actions
- [x] 8.2 Xử lý edge cases (file rỗng, mapping fail...)
- [x] 8.3 Kiểm tra responsive trên mobile
