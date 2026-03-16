## Context

Modal import Excel hiện tại (`ExcelPreviewModal`) nằm trong một file 782 dòng, kết hợp UI và business logic. Modal này được sử dụng trong trang StockInList để import sản phẩm từ file Excel.

**Hiện trạng:**
- File: `src/components/common/ExcelPreviewModal/ExcelPreviewModal.jsx` (782 dòng)
- Không có pagination - load tất cả dòng vào memory
- Inline select trong table rất khó thao tác
- Không có filter theo trạng thái
- Không có Undo/Redo
- Không có draft persistence

**Ràng buộc:**
- Framework: React 19 + Vite
- UI Library: shadcn/ui + Tailwind CSS
- Ngôn ngữ: Tiếng Việt

## Goals / Non-Goals

**Goals:**
- Tái thiết kế thành wizard 3 bước: Upload → Map Columns → Review
- Thêm pagination cho table (50 dòng/trang)
- Thêm filter tabs: Tất cả / Hợp lệ / Lỗi / Mới
- Thêm Undo/Redo với Ctrl+Z / Ctrl+Y
- Thêm Auto-save draft vào localStorage (24h)
- Tách business logic ra hooks riêng biệt
- Thay inline select bằng expand row editor

**Non-Goals:**
- Không thêm preview ảnh sản phẩm
- Không thay đổi API backend
- Không hỗ trợ import từ CSV (chỉ xlsx)

## Decisions

### 1. Wizard 3 bước thay vì Modal đơn lẻ
**Lựa chọn thay thế:** Giữ modal nhưng thêm tabs bên trong
**Quyết định:** Wizard 3 bước vì:
- Tách rõ ràng từng giai đoạn
- Người dùng tập trung vào từng bước
- Dễ mở rộng thêm bước (ví dụ: confirmation)

### 2. Pagination thay vì Virtualized List
**Lựa chọn thay thế:** Virtualized list (react-window)
**Quyết định:** Pagination vì:
- Dễ implement hơn với shadcn/table
- Filter tabs hoạt động tự nhiên hơn
- Người dùng không cần scroll quá nhiều

### 3. Expand Row Editor thay vì Inline Select
**Lựa chọn thay thế:** Giữ inline select
**Quyết định:** Expand row editor vì:
- Table không bị giãn khi có nhiều dropdown
- Trải nghiệm tốt hơn trên mobile
- Dễ thêm nhiều field edit hơn

### 4. localStorage cho Draft Persistence
**Lựa chọn thay thế:** IndexedDB, Redis session
**Quyết định:** localStorage vì:
- Đơn giản, không cần thêm dependency
- Đủ cho use case 24h
- Không cần backend thay đổi

### 5. Undo/Redo với History Stack
**Lựa chọn thay thế:** Library như react-undo-library
**Quyết định:** Custom hook vì:
- Logic đơn giản (chỉ cần undo row changes)
- Không cần thêm dependency
- Dễ customize

## Risks / Trade-offs

- **[Risk]** Tách file có thể làm tăng số lượng files
  - → **Mitigation:** Nhóm related files vào cùng folder, dùng index.js barrel file

- **[Risk]** Undo/Redo có thể không hoạt động đúng với async operations
  - → **Mitigation:** Chỉ undo/redo UI state, không undo API calls

- **[Risk]** localStorage có thể bị xóa bởi user hoặc browser
  - → **Mitigation:** Thêm toast notification khi draft được lưu

- **[Risk]** Mapping columns có thể phức tạp với nhiều Excel formats
  - → **Mitigation:** Ưu tiên auto-detect, cho phép manual override

## Migration Plan

1. Tạo folder mới `src/components/common/ExcelImportWizard/`
2. Tạo các hooks trong `src/hooks/`
3. Tạo Step1Upload, Step2Mapping, Step3Review
4. Tích hợp vào StockInList thay thế ExcelPreviewModal
5. Xóa file ExcelPreviewModal cũ sau khi test xong
