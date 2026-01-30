# Kế hoạch Kiểm thử End-to-End: Chức năng Xóa Phiếu Nhập Kho

**Mục tiêu:** Chứng minh chức năng xóa phiếu nhập kho hoạt động chính xác từ giao diện (UI) đến cơ sở dữ liệu (DB).

## Giai đoạn

| # | Giai đoạn | Trạng thái | Ghi chú |
|---|---|---|---|
| 1 | **Chuẩn bị & Lên kế hoạch** | `completed` | Đã tạo các tệp kế hoạch. |
| 2 | **Tạo Dữ liệu Test (Playwright)** | `pending` | Viết và chạy script để tạo phiếu nhập có ghi chú "PLAYWRIGHT-TEST". |
| 3 | **Thực thi Xóa (Playwright)** | `pending` | Viết và chạy script để tìm, xóa phiếu nhập test trên UI. |
| 4 | **Xác minh ở Database (MySQL)** | `pending` | Dùng `mysql-tools` để xác nhận bản ghi đã bị xóa khỏi DB. |
| 5 | **Dọn dẹp & Báo cáo** | `pending` | Hoàn tất và báo cáo kết quả. |

## Các lỗi đã gặp

| Lỗi | Lần thử | Cách giải quyết |
|---|---|---|
| (Chưa có) | | |
