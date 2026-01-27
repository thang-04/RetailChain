# Quy Trình Phát Triển & Kiểm Thử Module Inventory

Tài liệu này mô tả chi tiết quy trình phát triển backend theo luồng tiêu chuẩn đã được thống nhất, đảm bảo tính tuần tự và chính xác từ Database đến API.

## 1. Kiểm Tra Môi Trường (Pre-check)

**Câu hỏi tiên quyết:** "Người dùng đã chạy server Spring Boot chưa?"

*   **Yêu cầu:** Server phải được khởi động trước khi test API.
*   **Ràng buộc Quan trọng:**
    *   Nếu gặp lỗi biên dịch liên quan đến **Lombok**: **BỎ QUA**, không được tự ý sửa file `pom.xml`.
    *   Chỉ tập trung sửa logic code Java, không can thiệp cấu hình build tool trừ khi được yêu cầu rõ ràng.

---

## 2. Quy Trình Phát Triển (Development Workflow)

### Bước 1: Kiểm tra & Đồng bộ Entity với Database
*   **Công cụ:** Sử dụng `mysql-tools` (scripts `mysql_tables.py`, `mysql_schema.py`) để lấy cấu trúc bảng thực tế.
*   **Hành động:**
    1.  Liệt kê toàn bộ bảng trong DB `retail_chain`.
    2.  So sánh với các class trong package `entity`.
    3.  **Kết quả thực hiện:**
        *   Phát hiện thiếu Entity: `Product`, `Role`, `InventoryDocument`, v.v.
        *   -> Đã tạo mới các Entity này khớp 100% với schema DB.
        *   -> Cập nhật quan hệ (Relationships) cho `User`, `Warehouse`, `StoreWarehouse`.

### Bước 2: Xây dựng Repository Layer
*   **Logic:** Kiểm tra xem Repository đã tồn tại chưa?
    *   Nếu chưa -> Tạo mới interface kế thừa `JpaRepository`.
    *   Nếu có -> Bổ sung các method query cần thiết.
*   **Kết quả thực hiện:**
    *   Tạo `WarehouseRepository`, `StoreWarehouseRepository`, `InventoryStockRepository`.

### Bước 3: Xây dựng Service Layer
*   **Logic:**
    1.  Tạo Interface Service (`InventoryService`).
    2.  Tạo Class Implementation (`InventoryServiceImpl`).
*   **Kết quả thực hiện:**
    *   Implement logic `createWarehouse`: Xử lý tạo kho tổng và kho cửa hàng (tự động link với Store).
    *   Implement logic `getStockByWarehouse`: Truy vấn tồn kho.

### Bước 4: Xây dựng DTO (Data Transfer Object)
*   **Logic:** Định nghĩa các object request/response để không lộ Entity trực tiếp ra ngoài.
*   **Kết quả thực hiện:**
    *   Tạo `WarehouseRequest` (Input tạo kho).
    *   Tạo `WarehouseResponse`, `InventoryStockResponse` (Output API).

### Bước 5: Xây dựng Controller & Config
*   **Logic:**
    1.  Tạo Controller (`InventoryController`) để expose API.
    2.  Kiểm tra Config (`CommonUtils`, `ResponseJson`) để đảm bảo format dữ liệu đúng.
*   **Kết quả thực hiện:**
    *   Expose các endpoint: `POST /warehouse`, `GET /warehouse`, `GET /stock/{id}`.
    *   **Fix Config:** Phát hiện lỗi Gson không serialize được `LocalDateTime` -> Đã cập nhật `CommonUtils.java` thêm Adapter.

---

## 3. Kiểm Thử & Vòng Lặp Sửa Lỗi (Testing Loop)

### Bước 6: Kiểm tra API (Verification)
*   **Công cụ:** Sử dụng `bash` (lệnh `curl`) để gọi vào API đang chạy.
*   **Quy trình lặp:**
    1.  Gọi API Test.
    2.  **Nếu Lỗi:** Phân tích nguyên nhân -> Quay lại sửa code (Config/Logic) -> Test lại.
    3.  **Nếu Đúng:** Xác nhận hoàn thành.

### Lịch sử Kiểm thử Thực tế:
1.  **Lần 1:** Gọi API tạo kho -> Trả về lỗi `500` (Lỗi Gson serialization).
    *   *Kiểm tra chéo:* Dùng `mysql-tools` check DB -> Dữ liệu **ĐÃ VÀO**.
    *   *Nguyên nhân:* Server chưa restart để nhận code fix Gson.
2.  **Lần 2 (Sau khi User restart server):** Gọi lại API.
    *   **Kết quả:** Trả về `200 OK`.
    *   JSON response hiển thị đúng ngày giờ.
    *   Dữ liệu khớp hoàn toàn với DB.

---

## 4. Trạng Thái Hiện Tại
Hệ thống đã hoàn tất toàn bộ quy trình trên. Các API hoạt động ổn định và đúng thiết kế.
