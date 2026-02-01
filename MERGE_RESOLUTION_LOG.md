# Nhật Ký Giải Quyết Xung Đột (Merge Conflict)
**Ngày:** 01/02/2026
**Nhánh:** Merge `origin/donglv` vào `HEAD`

## Tổng Quan
Đã giải quyết thành công xung đột trên 4 file. Chiến lược giải quyết ưu tiên giữ lại các logic quan trọng từ cả hai nhánh, đồng thời đảm bảo mã nguồn hỗ trợ cấu hình tham số hóa mới cho việc deploy.

## Chi Tiết Giải Quyết

### 1. `InventoryHistory.java` (Entity)
*   **Xung đột:** Thêm các trường và thay đổi cấu trúc từ cả hai nhánh.
*   **Giải quyết:**
    *   Giữ lại tất cả các trường (`documentId`, `documentItemId`, `warehouseId`, `variantId`, `action`, `quantity`, `balanceAfter`, `actorUserId`, `occurredAt`).
    *   Giữ lại các mapping quan hệ JPA chi tiết (`@ManyToOne` với `insertable=false, updatable=false`) từ nhánh HEAD để đảm bảo tính toàn vẹn khóa ngoại mà không gây lỗi trùng lặp cột.
    *   Đảm bảo `@Enumerated(EnumType.STRING)` được áp dụng chính xác cho trường `action`.

### 2. `InventoryAction.java` (Enum)
*   **Xung đột:** Khác biệt về định dạng trong định nghĩa Enum.
*   **Giải quyết:**
    *   Chuẩn hóa định dạng Enum để liệt kê `IN` và `OUT` một cách rõ ràng.

### 3. `InventoryHistoryRepository.java` (Repository)
*   **Xung đột:** Định nghĩa phương thức khác nhau.
*   **Giải quyết:**
    *   **Giữ lại (HEAD):** `findByWarehouseId(Long warehouseId)` và `findByDocumentId(Long documentId)` - Cần thiết cho logic hiện tại.
    *   **Giữ lại (donglv):** `findAllByOrderByOccurredAtDesc()` - Hữu ích cho tính năng liệt kê lịch sử được thêm vào từ nhánh mới.
    *   Kết quả: Kết hợp cả 3 phương thức vào interface.

### 4. `application.properties` (Cấu hình)
*   **Xung đột:** Thông tin kết nối cơ sở dữ liệu và cấu hình URL OpenAPI.
*   **Giải quyết:**
    *   **ƯU TIÊN:** Áp dụng **Cấu hình Tham số hóa** từ HEAD để hỗ trợ deploy Docker/Cloud.
    *   `spring.datasource.url`: Thiết lập thành `jdbc:mysql://${DB_HOST:localhost}:${DB_PORT:3306}/retail_chain` (thay vì fix cứng localhost).
    *   `openapi.service.url`: Thiết lập thành `${APP_BASE_URL:http://localhost:8080/retail-chain}`.
    *   Giữ lại các cấu hình JPA và Hibernate tiêu chuẩn.

## Trạng Thái
*   **Trạng thái Git:** Đã giải quyết xong xung đột. Các file đã được stage và commit.
*   **Thông điệp Commit:** "Merge branch 'origin/donglv' into HEAD - Resolved conflicts in InventoryHistory and application.properties"
