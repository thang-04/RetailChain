# Báo Cáo Phân Tích & Kiểm Tra API Hệ Thống RetailChain
**Ngày:** 01/02/2026
**Trạng thái:** Đã kiểm tra & Đã khắc phục (Backend Fixes Applied)

## 1. Tổng Quan Hệ Thống API
Hệ thống bao gồm 4 nhóm API chính phục vụ Frontend React.

### A. Inventory API (Kho hàng)
*Trạng thái: ✅ Hoạt động tốt, Đã đồng bộ Backend-Frontend*
*Base URL:* `/api/inventory`

| Method | Endpoint | Chức năng | Ghi chú |
| :--- | :--- | :--- | :--- |
| `POST` | `/warehouse` | Tạo kho mới | |
| `GET` | `/warehouse` | Lấy danh sách kho | |
| `PUT` | `/warehouse/{id}` | Cập nhật kho | |
| `DELETE` | `/warehouse/{id}` | Xóa kho | |
| `GET` | `/stock/{warehouseId}` | Xem tồn kho | |
| `POST` | `/import` | Nhập kho | Tự động ghi `InventoryHistory` (IN) |
| `POST` | `/export` | Xuất kho | Tự động ghi `InventoryHistory` (OUT) |
| `POST` | `/transfer` | Chuyển kho | Tự động ghi `InventoryHistory` (OUT source -> IN target) |
| `GET` | `/documents` | Lấy chứng từ | Hỗ trợ filter `?type=IMPORT/EXPORT/TRANSFER` |

### B. Inventory History API (Lịch sử)
*Trạng thái: ✅ Hoạt động, Cần lưu ý về Actor*
*Base URL:* `/api/inventory-history`

| Method | Endpoint | Chức năng | Kết quả Test (Curl) |
| :--- | :--- | :--- | :--- |
| `GET` | `/record` | Xem toàn bộ lịch sử | ✅ **Pass** (Trả về danh sách JSON) |
| `GET` | `/record/{id}` | Xem chi tiết bản ghi | ✅ **Pass** (Trả về đúng ID) |
| `POST` | `/record/add` | Ghi thủ công | ✅ **Pass** (Ghi thành công khi truyền đủ params) |

**Vấn đề Actor (Người thực hiện):**
- **Giao dịch tự động (Import/Export):** Hệ thống đang **Hardcode User ID = 1**.
  - *Code:* `InventoryServiceImpl.java` (Line 129, 190, 262) -> `// TODO: Get from SecurityContext`.
- **Giao dịch thủ công:** User ID được truyền từ Client qua tham số `actorUserId`.

### C. Product API (Sản phẩm)
*Trạng thái: ✅ Đã bổ sung đầy đủ (Trước đó thiếu Write APIs)*
*Base URL:* `/api/product`

| Method | Endpoint | Chức năng | Trạng thái Code |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Lấy tất cả SP | Đã có |
| `GET` | `/{id}` | Lấy chi tiết SP | **Đã Implement Mới** |
| `POST` | `/` | Tạo SP mới | **Đã Implement Mới** |
| `PUT` | `/{id}` | Cập nhật SP | **Đã Implement Mới** |
| `DELETE` | `/{id}` | Xóa SP | **Đã Implement Mới** |

**Lưu ý:** Đã thêm `ProductRequest` DTO và cập nhật `ProductService` để hỗ trợ các nghiệp vụ này.

### D. Store API (Cửa hàng)
*Trạng thái: ✅ Đã bổ sung endpoint thiếu*
*Base URL:* `/api/stores`

| Method | Endpoint | Chức năng | Trạng thái Code |
| :--- | :--- | :--- | :--- |
| `GET` | `/{id}/staff` | Lấy nhân viên cửa hàng | **Đã Mock** (Trả về list rỗng để khớp Frontend) |
| `CRUD` | `/` | Các API cơ bản | Đã có đầy đủ |

---

## 2. Kết Quả Kiểm Tra Chi Tiết (Bash Tools)

### Test 1: Lấy danh sách lịch sử (`GET /record`)
**Lệnh:** `curl http://localhost:8080/retail-chain/api/inventory-history/record`
**Kết quả:** `200 OK`
**Dữ liệu:** Trả về mảng JSON chứa các bản ghi lịch sử.
```json
[
  {"id":60, "action":"IN", "quantity":1324242, "actorUserId":1, ...},
  {"id":59, "action":"IN", "quantity":122, "actorUserId":1, ...}
]
```

### Test 2: Xem chi tiết (`GET /record/60`)
**Lệnh:** `curl http://localhost:8080/retail-chain/api/inventory-history/record/60`
**Kết quả:** `200 OK`
**Dữ liệu:**
```json
{"id":60, "action":"IN", "quantity":1324242, ...}
```

### Test 3: Ghi thủ công (`POST /record/add`)
**Lệnh:** `curl -X POST ...`
**Kết quả:** `200 OK`
**Lưu ý:** Cần truyền đúng JSON Body và `actorUserId`. Nếu thiếu `actorUserId` sẽ báo lỗi SQL `Column 'actor_user_id' cannot be null`.

---

## 3. Khuyến Nghị & Hành Động Tiếp Theo
1.  **Security Integration:** Cần thay thế các giá trị hardcode `1L` trong `InventoryServiceImpl` bằng việc lấy User ID thực tế từ `SecurityContextHolder` (Spring Security) khi hệ thống có Authentication.
2.  **Frontend Update:** Đảm bảo Frontend truyền đúng `slug` hoặc `id` khi gọi API Store (Backend hỗ trợ cả hai nhưng cần nhất quán).
3.  **Refactor:** Tiếp tục chuyển đổi các mock service còn lại (nếu có) sang gọi API thật.
