## Context

Hiện tại, chức năng nhập Excel trong trang Phiếu nhập kho hoạt động theo luồng:
1. Người dùng click nút "Nhập Excel"
2. Chọn file Excel
3. Gửi trực tiếp lên server qua API `POST /api/inventory/import/excel`
4. Server parse và import, trả về kết quả

Vấn đề: Không có bước preview, không validate trước, không biết sản phẩm mới hay đã tồn tại.

**Ràng buộc:**
- Sử dụng thư viện `xlsx` đã có sẵn trong project
- Backend Spring Boot với JPA
- Frontend React với shadcn/ui components

## Goals / Non-Goals

**Goals:**
- Cho phép xem trước dữ liệu Excel trong modal trước khi import
- Validate client-side: giá > 0, số lượng hợp lệ, các trường bắt buộc không để trống
- Kiểm tra SKU tồn tại qua API backend - hiển thị nhãn "🆕 Sẽ tạo mới" nếu SKU chưa có
- Hiển thị lỗi chi tiết từng dòng và cho phép bỏ qua dòng lỗi
- Giữ nguyên API endpoint import hiện tại

**Non-Goals:**
- Không tạo field mới trong database để đánh dấu sản phẩm mới
- Không thay đổi logic import phía backend (vẫn dùng API existing)
- Không hỗ trợ file CSV (chỉ Excel .xlsx, .xls)
- Không tự động import - luôn cần user xác nhận

## Decisions

### 1. Parse Excel Client-side vs Server-side

**Quyết định:** Client-side (parse trong browser trước khi gửi)

**Lý do:**
- Trải nghiệm người dùng tốt hơn - thấy lỗi ngay lập tức
- Giảm tải cho server - không cần parse file lỗi
- Xử lý nhanh với file nhỏ (< 1000 dòng)

**Alternatives considered:**
- Server-side: Tăng tải server, user phải chờ parse xong mới biết lỗi

### 2. Validation Strategy

**Quyết định:** Validate 2 bước:
1. **Client-side**: Định dạng cơ bản (giá > 0, số lượng là số, không trống)
2. **API check**: Kiểm tra SKU tồn tại

**Lý do:**
- Validate cơ bản nhanh, không cần gọi API
- API check SKU cần gọi server nhưng cần thiết cho business logic

**Alternatives considered:**
- Tất cả validate phía server: User phải chờ response mới biết lỗi, trải nghiệm kém

### 3. Preview Modal Design

**Quyết định:** Modal với:
- Table hiển thị tất cả dòng dữ liệu
- Cột trạng thái: ✓ Hợp lệ | ✗ Lỗi | 🆕 Sẽ tạo mới
- Checkbox để bỏ qua dòng lỗi
- Tổng số: bao nhiêu dòng hợp lệ, bao nhiêu lỗi

**Lý do:**
- Table quen thuộc với người dùng Excel
- Trạng thái rõ ràng, dễ nhận biết
- Checkbox cho phép linh hoạt bỏ qua dòng lỗi

### 4. API Endpoint cho SKU Check

**Quyết định:** Tạo API mới `GET /api/products/exists?sku=SKU_CODE`

**Response:**
```json
{
  "exists": true,
  "productId": 123
}
```

**Lý do:**
- API đơn giản, trả về boolean
- Có thể batch query nhiều SKU nếu cần (tối ưu performance)

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| **File Excel lớn (> 1000 dòng)** | Giới hạn hiển thị preview 500 dòng đầu, warning nếu vượt quá |
| **API check SKU chậm** | Gọi API batch (nhiều SKU cùng lúc) thay vì từng dòng |
| **User upload sai định dạng** | Validate file type trước khi parse (.xlsx, .xls) |
| **Modal quá lớn** | Fixed height với scroll, phân trang nếu > 100 dòng |

## Migration Plan

1. **Phase 1 - Backend**: Tạo API `GET /api/products/exists`
2. **Phase 2 - Frontend Service**: Thêm method `checkSkuExists` trong `inventory.service.js`
3. **Phase 3 - Frontend Component**: Tạo `ExcelPreviewModal.jsx`
4. **Phase 4 - Integration**: Cập nhật `StockInList.jsx` - thay thế luồng cũ

**Rollback:**
- Nếu lỗi, revert về code cũ - chức năng import Excel cũ vẫn hoạt động (API endpoint không đổi)

## Open Questions

1. **Batch API**: Cần batch check SKU không? (VD: 50 SKU一次 gọi) → Để implement đơn giản, check từng SKU trước, tối ưu sau nếu cần
2. **Excel template**: Có cần tạo template file mẫu để user download không? → Để optional, có thể thêm sau
