## Context

Hiện tại, Sidebar của ứng dụng React có một mục menu "Central Warehouse" với đường dẫn `/warehouse` yêu cầu quyền `WAREHOUSE_VIEW`. Theo yêu cầu, cần xóa toàn bộ giao diện này khỏi hệ thống.

## Goals / Non-Goals

**Goals:**
- Xóa menu Central Warehouse khỏi Sidebar
- Loại bỏ quyền truy cập UI vào chức năng kho từ sidebar

**Non-Goals:**
- Không xóa API backend liên quan đến warehouse
- Không xóa dữ liệu trong database
- Không xóa các trang warehouse nếu có người dùng bookmark trực tiếp

## Decisions

1. **Chỉ xóa menu Sidebar**: Quyết định chỉ xóa mục menu trong Sidebar, không can thiệp vào backend hay database.
   - Lý do: Đây là yêu cầu về UI, không phải xóa toàn bộ chức năng warehouse.

2. **Giữ nguyên quyền WAREHOUSE_VIEW**: Không xóa quyền này trong hệ thống permissions vì có thể được sử dụng ở nơi khác.
   - Lý do: Tránh ảnh hưởng đến các phần khác của hệ thống.

## Risks / Trade-offs

- [Risk] Người dùng bookmark trực tiếp `/warehouse` sẽ thấy trang trắng → Mitigation: Cần tạo redirect hoặc 404 handler
- [Risk] API warehouse vẫn tồn tại nhưng không có UI → Mitigation: Có thể bảo mật tốt hơn nếu cần