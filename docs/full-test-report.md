# Báo Cáo Test Tổng Hợp (2026-03-22)

## 1) Phạm vi đã test
- API smoke + authz matrix theo role: `SUPER_ADMIN`, `STORE_MANAGER`, `STAFF`.
- UI smoke bằng `agent-browser` cho luồng login + menu phân quyền.
- Build-level:
  - Backend compile: `mvn -q -DskipTests compile`
  - Frontend build: `npm run build`
  - Frontend lint: `npm run lint`

## 2) Kết quả nhanh
- API matrix đã chạy: `28 endpoint x 3 role = 84 request`.
- Frontend build: PASS.
- Backend compile: PASS.
- Frontend lint: FAIL (`76 errors`, `15 warnings`).
- UI smoke:
  - Admin: login OK, vào dashboard OK, menu đầy đủ.
  - Store Manager: login OK, vào dashboard OK, menu rút gọn đúng hướng.
  - Staff: API role đã test đầy đủ; UI automation bị gián đoạn do lỗi daemon/heap của `agent-browser` nên chưa chụp được snapshot menu cuối.

## 2.1) Blocker khi tiếp tục rerun live test
- Trong lần rerun cuối, backend không khởi động được ở môi trường hiện tại do lỗi kết nối DB:
  - `Access denied for user 'root'@'localhost' (using password: YES)`
- Vì vậy vòng test live bổ sung (API + UI staff login end-to-end) không thể chạy thêm ở thời điểm này nếu không có đúng credential DB runtime.

## 3) Thống kê API matrix (HTTP/API code)
- `SUPER_ADMIN`: 28 case, `http200=26`, `http403=0`, `apiCode500=7`
- `STORE_MANAGER`: 28 case, `http200=20`, `http403=6`, `apiCode500=5`
- `STAFF`: 28 case, `http200=17`, `http403=9`, `apiCode500=3`

## 4) Dấu hiệu bất hợp lý quan trọng

### 4.1 Thiếu chặn quyền ở nhiều endpoint nhạy cảm
- `AttendanceController`: không có `@PreAuthorize` ở các endpoint.
- `ShiftController`: không có `@PreAuthorize` ở toàn bộ CRUD/assign.
- `StaffQuotaController`: không có `@PreAuthorize`.
- `StoreController#getStoreStaffList`: không có `@PreAuthorize`.
- `WarehouseController#getCentralWarehouse`: không có `@PreAuthorize`.
- `ProductController#createProductVariants`: không có `@PreAuthorize`.

Hệ quả quan sát được trong test:
- `STAFF` vẫn gọi được `POST /shifts`, `GET/PUT /staff-quotas`, `POST /product/{id}/variants`, `GET /stores/{id}/staff-list`, `GET /warehouse/central`.

### 4.2 Quy ước HTTP status chưa chuẩn
- Nhiều API trả `HTTP 200` nhưng body có `code=500` khi lỗi nghiệp vụ/DB.
- Việc này làm frontend khó xử lý lỗi và làm sai monitor theo chuẩn HTTP.

### 4.3 Lỗi runtime còn tồn tại
- `GET /attendance/store/{storeId}` trả `HTTP 500` cho cả 3 role trong matrix.
- Một số flow tạo mới đang fail với payload thiếu dữ liệu (kỳ vọng), nhưng hiện vẫn bị gói trong `HTTP 200` + `code=500`.

### 4.4 Drift giữa cấu hình quyền mong muốn và quyền thực tế
- Theo code seed, `STORE_MANAGER` có nhóm quyền rộng hơn.
- Theo token runtime test, manager đang thiếu một số quyền dự kiến (ví dụ supplier/user theo cách đặt tên).
- Nguyên nhân khả dĩ: seeder chỉ tạo khi chưa tồn tại, không đồng bộ role đã có.

### 4.5 Secret lộ trong cấu hình
- `RetailChainService/src/main/resources/application.properties` đang có `spring.sendgrid.api-key` hardcode.

## 5) Kết quả UI theo role (đã xác nhận)
- `SUPER_ADMIN` thấy menu: `Dashboard`, `Stores`, `Products`, `Inventory`, `Stock In`, `Stock Out`, `Staff Shifts`, `Chấm công`, `Dashboard Chấm công`, `Roles & Permissions`, `User Management`.
- `STORE_MANAGER` thấy menu: `Dashboard`, `My Store`, `Products`, `Inventory`, `Stock In`, `Stock Out`, `Staff Shifts`, `Chấm công`, `Dashboard Chấm công`, `User Management`.
- Điểm khác biệt đúng: manager không có `Roles & Permissions`.

## 6) Artifact test đã lưu
- `docs/full-test-matrix.csv`
- `docs/full-test-matrix.json`
- `docs/full-test-summary.json`

## 7) Đề xuất cập nhật ngay
1. Bổ sung `@PreAuthorize` cho các endpoint đang thiếu (mục 4.1), ưu tiên `Shift`, `Attendance`, `StaffQuota`.
2. Chuẩn hóa trả lỗi bằng `ResponseEntity` + HTTP status thật (`400/401/403/404/500`), không chỉ nhúng trong `code`.
3. Viết integration test authz theo role (ít nhất cho các endpoint write/sensitive).
4. Đồng bộ role-permission khi seed (upsert quyền cho role đã tồn tại).
5. Chuyển toàn bộ secret sang biến môi trường, rotate ngay SendGrid key đã lộ.
