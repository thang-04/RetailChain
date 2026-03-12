## Context

Hiện tại, trang Stock In (Danh sách phiếu nhập kho) có một số lỗi ảnh hưởng đến workflow quản lý kho:
- Chức năng xóa phiếu không hoạt động
- Chức năng nhập từ Excel không hoạt động
- Trạng thái mặc định khi tạo phiếu mới không đúng

Cần sửa các lỗi này để đảm bảo hệ thống hoạt động đúng.

## Goals / Non-Goals

**Goals:**
- Sửa lỗi xóa phiếu nhập: thêm dialog xác nhận, xử lý API DELETE
- Sửa lỗi nhập từ Excel: gắn file input, xử lý logic import
- Sửa trạng thái mặc định khi tạo phiếu mới thành "PENDING"
- Cải thiện UX lọc theo ngày và hiển thị tổng quan

**Non-Goals:**
- Không thay đổi kiến trúc hệ thống
- Không thêm tính năng mới ngoài các lỗi đã nêu

## Decisions

### 1. Xóa phiếu nhập

**Quyết định:** Sử dụng shadcn/ui Dialog component cho dialog xác nhận

**Lý do:** Dự án đã sử dụng shadcn/ui, đảm bảo consistency với UI hiện tại

**Alternatives considered:**
- Custom modal: Cần style lại từ đầu, không nhất quán
- Browser confirm(): Không tùy chỉnh được UI

### 2. Nhập từ Excel

**Quyết định:** Sử dụng thư viện xlsx (SheetJS) để parse Excel

**Lý do:** Thư viện phổ biến, hỗ trợ tốt file Excel (.xlsx, .xls)

**Alternatives considered:**
- papaparse: Chỉ hỗ trợ CSV
- exceljs: Nặng hơn, không cần thiết

### 3. Trạng thái mặc định

**Quyết định:** Sửa ở backend để luôn tạo với trạng thái PENDING

**Lý do:** Đảm bảo consistency cho tất cả các cách tạo phiếu (manual và import)

**Alternatives considered:**
- Sửa ở frontend: Chỉ sửa được khi tạo manual, import vẫn sai

## Risks / Trade-offs

- **[Risk]** Backend API DELETE có thể chưa được implement
  → **Mitigation:** Kiểm tra trước, nếu chưa có thì tạo mới

- **[Risk]** Import Excel có thể fail nếu template không đúng
  → **Mitigation:** Validate file trước khi parse, hiển thị lỗi rõ ràng

- **[Risk]** Dữ liệu cũ có thể bị ảnh hưởng khi đổi trạng thái mặc định
  → **Mitigation:** Chỉ áp dụng cho phiếu mới, không affect dữ liệu hiện tại
