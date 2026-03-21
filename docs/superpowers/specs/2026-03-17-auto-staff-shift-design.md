# Design: Tự động gán ca làm cho nhân viên (Bản nháp → Xác nhận)

**Ngày:** 2026-03-17  
**Module:** Staff / Shift Scheduling  
**Phạm vi:** RetailChainService (Spring Boot) + RetailChainUi (React)

---

## 1. Mục tiêu

Xây dựng chức năng **Tự động sắp xếp ca làm (bản nháp)** theo cửa hàng và khoảng ngày (thường là 1 tuần), sau đó cho phép quản lý **chỉnh sửa** và **xác nhận tất cả** để lưu lịch chính thức.

Yêu cầu cốt lõi:

- Mỗi nhân viên có định mức số ca/tuần trong bảng `StaffQuota`.
- Mỗi loại ca (Shift) có nhu cầu nhân sự `min_staff/max_staff`.
- Hệ thống tạo các phân công ca ở trạng thái **DRAFT** (hiển thị màu nhạt).
- Người dùng có thể điều chỉnh (Phase 2: kéo thả / chỉnh).
- Nút **Xác nhận tất cả** chuyển DRAFT → ASSIGNED.

Ngoài phạm vi MVP:

- Availability/ngày nghỉ
- Ràng buộc theo role/kỹ năng
- Ràng buộc nâng cao (không 2 ca liên tiếp, giới hạn ca đêm, v.v.)

---

## 2. Hiện trạng (Context)

Hiện hệ thống đã có:

- API shift CRUD + assign + get assignments trong `ShiftController` (`/api/shifts/...`)
- UI trang lịch `StaffShiftsPage.jsx` tải assignments theo `storeId/from/to` và render week/month/year
- `ShiftAssignment` có `status` (UI đang đếm `ASSIGNED` và bỏ qua `CANCELLED`)

---

## 3. Thiết kế dữ liệu (Database)

### 3.1. Bảng mới: `staff_quota`

Lưu định mức cho từng nhân viên theo cửa hàng.

- `user_id` (FK → user)
- `store_id` (FK → store)
- `min_shifts_per_week` (INT, default 5)
- `max_shifts_per_week` (INT, default 6)

**Unique:** (`user_id`, `store_id`)

### 3.2. Bảng `shift` bổ sung nhu cầu nhân sự

Thêm 2 cột:

- `min_staff` (INT, default 1)
- `max_staff` (INT, default 1)

Ràng buộc:

- `0 < min_staff <= max_staff`

### 3.3. Bảng `shift_assignment` (dùng chung cho draft & official)

Chọn phương án **A**: lưu bản nháp trong cùng bảng bằng trạng thái.

- Bổ sung `status = DRAFT | ASSIGNED | CANCELLED`

**Nguyên tắc:**

- Auto-generate tạo bản ghi `DRAFT`
- “Xác nhận tất cả” cập nhật `DRAFT → ASSIGNED` theo store & date range
- “Tạo lại bản nháp” có thể **reset** các `DRAFT` trong range (cancel/delete) rồi generate lại

---

## 4. API/Backend

### 4.1. Auto-generate (Draft)

**Endpoint đề xuất:**

- `POST /api/shifts/auto-assign`

**Request:**

- `storeId: Long`
- `from: LocalDate`
- `to: LocalDate`
- `createdBy: Long` (lấy từ user đăng nhập)
- `resetDraft: boolean` (default true)

**Response:**

- `assignments`: danh sách `ShiftAssignmentResponse` (status = DRAFT)
- `summary`:
  - số draft tạo mới
  - danh sách ngày/ca bị thiếu người (không đạt `min_staff`)
  - danh sách nhân viên chưa đạt `min_shifts_per_week` (nếu không đủ nhân sự)

### 4.2. Confirm all (Draft → Assigned)

**Endpoint đề xuất:**

- `POST /api/shifts/confirm-drafts`

**Request:**

- `storeId`
- `from`
- `to`
- `confirmedBy`

**Behavior:**

- Validate hard:
  - Không có ca nào dưới `min_staff` trong range (tính theo `ASSIGNED + DRAFT`)
  - Không có assignment trùng giờ cho cùng user trong 1 ngày (ở MVP chỉ cần check overlap theo shift start/end)
- Nếu pass: update tất cả bản ghi `DRAFT` trong range → `ASSIGNED`

---

## 5. Thuật toán gán ca (MVP)

MVP chỉ xét:

- Không trùng giờ trong cùng ngày cho cùng nhân viên
- Không vượt `max_shifts_per_week`
- Cố gắng đạt đủ `min_staff` cho từng ca/ngày
- Ưu tiên phân cho nhân viên đang thiếu `min_shifts_per_week`

### 5.1. Input cần lấy

- Danh sách `Shift` của `storeId` (kèm min/max staff)
- Danh sách nhân viên của store (`/stores/{storeId}/staff-list` hoặc repo/service nội bộ)
- `StaffQuota` theo store
- Assignments `ASSIGNED` trong khoảng tuần (để đếm quota và tránh overlap)
- Assignments `DRAFT` hiện có (nếu `resetDraft=false` thì giữ)

### 5.2. Pha A: phủ đủ `min_staff`

Với mỗi ngày trong range:

- Với mỗi `Shift`:
  - `current = count(ASSIGNED + DRAFT) của shift/day`
  - `need = min_staff - current`
  - Nếu `need > 0`: chọn `need` nhân viên phù hợp:
    - `assignedCountThisWeek < max_shifts_per_week`
    - Không overlap với assignment khác của user trong ngày
    - Score ưu tiên: người đang thiếu min quota (`min_shifts_per_week - assignedCountThisWeek` giảm dần)

Nếu không đủ người: đánh dấu `UNDERSTAFFED` trong `summary`.

### 5.3. Pha B (optional trong MVP): fill tới `max_staff`

Chỉ fill thêm nếu còn nhân viên chưa đạt `min_shifts_per_week` và ca chưa tới `max_staff`.

---

## 6. UI/UX (RetailChainUi)

### 6.1. Nút mới trên `StaffShiftsPage`

Thêm 2 action:

- **Tự động sắp xếp (Bản nháp)**:
  - gọi `POST /api/shifts/auto-assign`
  - reload assignments
  - hiển thị banner kết quả (tạo bao nhiêu, thiếu ca nào)
- **Xác nhận tất cả**:
  - gọi `POST /api/shifts/confirm-drafts`
  - reload assignments

### 6.2. Hiển thị Draft

Assignment `status=DRAFT`:

- style nhạt hơn (opacity) + viền dashed + badge “Draft”

Assignment `status=ASSIGNED`:

- như hiện tại

### 6.3. Chỉnh sửa (Phase 2)

- Kéo thả để đổi nhân viên/ca/ngày (cần API update assignment)
- MVP có thể cho phép chỉnh bằng “hủy + phân công thủ công” thông qua modal hiện có

---

## 7. Files dự kiến thay đổi

### Backend (RetailChainService)

- `.../controller/ShiftController.java` (thêm endpoints)
- `.../service/ShiftService.java`, `.../service/impl/ShiftServiceImpl.java` (logic auto-assign/confirm)
- Thêm DTO request/response cho auto-assign & confirm
- Entity/migration cho `staff_quota` và cập nhật `shift`, `shift_assignment`

### Frontend (RetailChainUi)

- `src/services/shift.service.js` (thêm hàm gọi API mới)
- `src/pages/Staff/StaffShifts/StaffShiftsPage.jsx` (thêm nút, hiển thị draft, banner)

---

## 8. Testing

- Auto-generate khi đủ nhân viên: mỗi ca đạt `min_staff`, không ai vượt `max_shifts_per_week`
- Auto-generate khi thiếu nhân viên: trả `UNDERSTAFFED` trong summary, draft tạo được phần nào
- Confirm all:
  - fail nếu còn ca dưới `min_staff`
  - pass thì toàn bộ DRAFT → ASSIGNED và UI hiển thị như lịch chính thức

