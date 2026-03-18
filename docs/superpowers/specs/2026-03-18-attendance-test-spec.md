# Test Specification: Attendance Check-in/Check-out & Dashboard

**Created:** 2026-03-18  
**Status:** Ready for Testing  
**Environment:** Local (http://localhost:5173)

---

## Test Accounts

### Super Admin
| Username | Password | URL Login |
|----------|----------|----------|
| admin | admin123 | http://localhost:5173/login |

### Store Managers
| Username | Password | Store |
|----------|----------|-------|
| manager01 | 123456 | Cửa Hàng 01 - Vincom (155) |
| manager02 | 123456 | Cửa Hàng 02 - District 7 (156) |
| manager03 | 123456 | Cửa Hàng 03 - Phú Nhuận (157) |

### Staff
| Username | Password | Store |
|----------|----------|-------|
| staff011 | 123456 | Cửa Hàng 01 - Vincom (155) |
| staff021 | 123456 | Cửa Hàng 02 - District 7 (156) |
| staff031 | 123456 | Cửa Hàng 03 - Phú Nhuận (157) |

---

## PART 1: STAFF - Check-in/Check-out Cá Nhân

### Test 1.1: Staff Login & Menu Visibility

**Pre-condition:** Staff account đã login lần đầu

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | Mở trình duyệt, vào http://localhost:5173 | Redirect to login page | ☐ |
| 2 | Nhập username: `staff011` | Username field filled | ☐ |
| 3 | Nhập password: `123456` | Password field filled (hidden) | ☐ |
| 4 | Click button **Đăng nhập** | Login successful, redirect to dashboard | ☐ |
| 5 | Quan sát **Sidebar trái** | Thấy menu: **"Chấm công"** (icon access_time) | ☐ |
| 6 | Quan sát Sidebar | **KHÔNG** thấy menu: **"Dashboard Chấm công"** | ☐ |

### Test 1.2: Check-in Thành Công

**Pre-condition:** Đã login với Staff account, GPS đã bật

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | Click menu **"Chấm công"** | URL chuyển sang `/attendance` | ☐ |
| 2 | Quan sát trang | Header: "Chấm công" + "Check-in và Check-out hàng ngày" | ☐ |
| 3 | Quan sát Today's Status Card | Grid 3 ô: Check-in, Check-out, Giờ làm (default '--:--') | ☐ |
| 4 | Quan sát Action Card | Button **📍 Check-in** (màu xanh) | ☐ |
| 5 | Click **📍 Check-in** | Button chuyển sang loading (hiển thị "Đang lấy vị trí...") | ☐ |
| 6 | Đợi response (2-5s) | Toast success: "Check-in thành công" | ☐ |
| 7 | Quan sát Today's Status | Check-in time hiển thị giờ hiện tại (VD: "14:30") | ☐ |
| 8 | Quan sát Status Badge | Badge: **"Đúng giờ"** (màu xanh) | ☐ |
| 9 | Quan sát Action Card | Button đã chuyển thành **🏁 Check-out** | ☐ |

### Test 1.3: Check-out Thành Công

**Pre-condition:** Đã check-in thành công trước đó (Test 1.2)

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | Quan sát Action Card | Button hiển thị **🏁 Check-out** | ☐ |
| 2 | Click **🏁 Check-out** | Button chuyển loading | ☐ |
| 3 | Đợi response | Toast success: "Check-out thành công" | ☐ |
| 4 | Quan sát Today's Status | Check-out time hiển thị giờ hiện tại | ☐ |
| 5 | Quan sát Giờ làm | Hiển thị số giờ đã làm (VD: "2h30p" hoặc "2.5h") | ☐ |
| 6 | Quan sát Status Badge | Badge cập nhật theo status (Đúng giờ/Muộn/Về sớm) | ☐ |
| 7 | Quan sát Action Card | **Biến mất**, thay bằng card "Hoàn thành công việc hôm nay" | ☐ |

### Test 1.4: Double Check-in Prevention

**Pre-condition:** Đã check-in hôm nay (Test 1.2)

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | F5 hoặc refresh trang | Trang reload, giữ nguyên trạng thái đã check-in | ☐ |
| 2 | Quan sát Action Card | Hiển thị **🏁 Check-out**, **KHÔNG** có button Check-in | ☐ |
| 3 | Thử gọi API check-in trực tiếp (Postman) | Response: "Bạn đã checkin hôm nay rồi" | ☐ |

### Test 1.5: Xem Lịch Sử Chấm Công

**Pre-condition:** Đã check-in/check-out thành công

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | Trên trang `/attendance` | Click button **"Xem lịch sử"** | ☐ |
| 2 | URL chuyển sang | `/attendance/history` | ☐ |
| 3 | Quan sát trang | Header: "Lịch sử chấm công" | ☐ |
| 4 | Quan sát danh sách | Thấy record check-in/check-out hôm nay | ☐ |
| 5 | Kiểm tra thông tin | Ngày, giờ check-in, giờ check-out, giờ làm, status | ☐ |

### Test 1.6: Staff KHÔNG Truy Cập Dashboard

**Pre-condition:** Staff đã login

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | Quan sát Sidebar | **KHÔNG** có menu "Dashboard Chấm công" | ☐ |
| 2 | Thử truy cập trực tiếp | Vào URL `/staff/attendance` | ☐ |
| 3 | Quan sát kết quả | Bị redirect về trang chính (/) hoặc trang forbidden | ☐ |

---

## PART 2: STORE MANAGER - Dashboard & Attendance

### Test 2.1: Store Manager Login & Menu Visibility

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | Logout (nếu đã login) | Clear session | ☐ |
| 2 | Login với: `manager01` / `123456` | Login successful | ☐ |
| 3 | Quan sát Sidebar | Thấy **"Chấm công"** | ☐ |
| 4 | Quan sát Sidebar | Thấy **"Dashboard Chấm công"** (icon fact_check) | ☐ |
| 5 | Quan sát Sidebar | Thấy **"Staff Shifts"** | ☐ |

### Test 2.2: Store Manager - Trang Chấm Công Cá Nhân

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | Click **"Chấm công"** | Vào `/attendance` | ☐ |
| 2 | Thực hiện check-in | Hoạt động bình thường như Staff | ☐ |
| 3 | Thực hiện check-out | Hoạt động bình thường như Staff | ☐ |

### Test 2.3: Dashboard - Scope Kiểm Tra

**Pre-condition:** Đã login với Store Manager

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | Click **"Dashboard Chấm công"** | Vào `/staff/attendance` | ☐ |
| 2 | Quan sát Header | Text: "Chấm công & Hiệu suất" | ☐ |
| 3 | Quan sát Header phải | Hiển thị: **"Cửa hàng: [Tên cửa hàng]"** (không có dropdown) | ☐ |
| 4 | Ví dụ: manager01 | Hiển thị: "Cửa hàng: Cửa Hàng 01 - Vincom" | ☐ |
| 5 | Quan sát KPI Cards | "Có mặt hôm nay": X/Y nhân viên | ☐ |
| 6 | Quan sát KPI Cards | "TB Giờ làm": số giờ trung bình | ☐ |
| 7 | Quan sát KPI Cards | "Đã checkout": số người đã checkout | ☐ |
| 8 | Quan sát KPI Cards | "Đến muộn": số người đến muộn | ☐ |

### Test 2.4: Dashboard - Filter Theo Ngày

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | Quan sát Date picker | Input type="date" | ☐ |
| 2 | Click date picker | Chọn ngày hôm qua | ☐ |
| 3 | Quan sát | Data thay đổi theo ngày đã chọn | ☐ |
| 4 | Chọn ngày tuần trước | Data cập nhật tương ứng | ☐ |

### Test 2.5: Dashboard - Filter Theo Status

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | Quan sát Status dropdown | Select: "Tất cả" | ☐ |
| 2 | Click dropdown | Hiển thị options: Tất cả, Đúng giờ, Muộn, Về sớm, Quên checkout | ☐ |
| 3 | Chọn **"Muộn"** | Table chỉ hiển thị record có status "Muộn" | ☐ |
| 4 | Chọn **"Tất cả"** | Table hiển thị tất cả records | ☐ |

### Test 2.6: Store Manager KHÔNG Thấy Dashboard Cửa Hàng Khác

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | Login với `manager01` (STORE-001) | - | ☐ |
| 2 | Vào Dashboard | Chỉ thấy data của STORE-001 | ☐ |
| 3 | Login với `manager02` (STORE-002) | - | ☐ |
| 4 | Vào Dashboard | Chỉ thấy data của STORE-002 | ☐ |
| 5 | So sánh | Data KHÁC nhau (đúng store của mỗi manager) | ☐ |

---

## PART 3: SUPER ADMIN - Dashboard Tất Cả Cửa Hàng

### Test 3.1: Super Admin Login & Menu Visibility

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | Logout | Clear session | ☐ |
| 2 | Login với: `admin` / `admin123` | Login successful | ☐ |
| 3 | Quan sát Sidebar | Thấy **"Chấm công"** | ☐ |
| 4 | Quan sát Sidebar | Thấy **"Dashboard Chấm công"** | ☐ |

### Test 3.2: Dashboard - Default View (Tất Cả Cửa Hàng)

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | Click **"Dashboard Chấm công"** | Vào `/staff/attendance` | ☐ |
| 2 | Quan sát Header phải | Có **dropdown chọn cửa hàng** | ☐ |
| 3 | Kiểm tra dropdown | Mặc định: **"Tất cả cửa hàng"** được chọn | ☐ |
| 4 | Quan sát KPI | Tổng hợp data của **TẤT CẢ** cửa hàng | ☐ |
| 5 | KPI "Có mặt hôm nay" | Sum của tất cả store | ☐ |
| 6 | KPI "TB Giờ làm" | Average của tất cả store | ☐ |

### Test 3.3: Dashboard - Chọn 1 Cửa Hàng Cụ Thể

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | Click dropdown | Hiển thị danh sách cửa hàng | ☐ |
| 2 | Danh sách options | "Tất cả cửa hàng", STORE-001, STORE-002, STORE-003... | ☐ |
| 3 | Chọn **"Cửa Hàng 01 - Vincom"** | KPI thay đổi theo store đó | ☐ |
| 4 | Kiểm tra KPI | Data chỉ của STORE-001 | ☐ |
| 5 | Quan sát Attendance Table | Chỉ hiển thị staff thuộc STORE-001 | ☐ |

### Test 3.4: Dashboard - Quay Lại View Tất Cả

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | Đã chọn 1 cửa hàng cụ thể | KPI hiển thị data store đó | ☐ |
| 2 | Click dropdown | Mở danh sách | ☐ |
| 3 | Chọn **"Tất cả cửa hàng"** | KPI reset về tổng hợp tất cả | ☐ |
| 4 | Quan sát Attendance Table | Hiển thị tất cả staff | ☐ |

### Test 3.5: Super Admin Có Thể Check-in/checkout

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | Click **"Chấm công"** | Vào `/attendance` | ☐ |
| 2 | Thực hiện check-in | Hoạt động bình thường | ☐ |
| 3 | Thực hiện check-out | Hoạt động bình thường | ☐ |

---

## PART 4: Edge Cases & Error Handling

### Test 4.1: GPS Không Available

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | Tắt GPS/location permission trên trình duyệt | - | ☐ |
| 2 | Vào trang Chấm công | Click **Check-in** | ☐ |
| 3 | Quan sát | Toast error: "Không lấy được vị trí" | ☐ |
| 4 | Quan sát | Button quay lại trạng thái bình thường | ☐ |

### Test 4.2: Staff Không Được Assign Cửa Hàng

**Pre-condition:** Tạo hoặc sửa staff không có store_id

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | Login với tài khoản không có cửa hàng | - | ☐ |
| 2 | Vào Dashboard Chấm công | Thấy text: "Bạn không được phân công cửa hàng" | ☐ |

### Test 4.3: Check-out Trước Check-in

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | Tài khoản chưa check-in hôm nay | Quan sát button Check-in | ☐ |
| 2 | Thử gọi API checkout trực tiếp | POST `/attendance/checkout` khi chưa check-in | ☐ |
| 3 | Response từ backend | Error: "Bạn chưa checkin hôm nay" | ☐ |

### Test 4.4: Check-in Outside Store Radius

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | Đến location cách cửa hàng > 500m | - | ☐ |
| 2 | Thử check-in | Toast error: "Bạn phải checkin trong phạm vi Xm từ cửa hàng" | ☐ |

---

## PART 5: Attendance Logs Trong Database

### Test 5.1: Verify Data Inserted Correctly

**Pre-condition:** Đã check-in/check-out thành công

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | Mở MySQL tools | Kết nối database retail_chain | ☐ |
| 2 | Chạy query | `SELECT * FROM attendance_logs ORDER BY occurred_at DESC LIMIT 10` | ☐ |
| 3 | Kiểm tra record mới nhất | Có record check-in mới với user_id đúng | ☐ |
| 4 | Kiểm tra check_type | IN = check-in, OUT = check-out | ☐ |
| 5 | Kiểm tra occurred_at | Thời gian khớp với lúc check-in | ☐ |
| 6 | Kiểm tra status | ONTIME/LATE/EARLY_LEAVE/FORGOT | ☐ |
| 7 | Kiểm tra work_hours | NULL cho check-in, có giá trị cho check-out record | ☐ |

---

## Test Summary Checklist

```
PRE-TEST SETUP:
☐ Login page accessible at http://localhost:5173/login
☐ Database accessible via MySQL tools
☐ Browser GPS/Location enabled

STAFF TESTS:
☐ Test 1.1: Staff login & menu visibility
☐ Test 1.2: Check-in thành công
☐ Test 1.3: Check-out thành công
☐ Test 1.4: Double check-in prevention
☐ Test 1.5: Xem lịch sử
☐ Test 1.6: Staff không truy cập Dashboard

STORE MANAGER TESTS:
☐ Test 2.1: Manager login & menu visibility
☐ Test 2.2: Manager check-in/check-out
☐ Test 2.3: Dashboard scope kiểm tra
☐ Test 2.4: Dashboard filter theo ngày
☐ Test 2.5: Dashboard filter theo status
☐ Test 2.6: Manager không thấy store khác

SUPER ADMIN TESTS:
☐ Test 3.1: Admin login & menu visibility
☐ Test 3.2: Dashboard default (tất cả cửa hàng)
☐ Test 3.3: Dashboard chọn 1 cửa hàng
☐ Test 3.4: Dashboard quay lại view tất cả
☐ Test 3.5: Admin check-in/check-out

EDGE CASES:
☐ Test 4.1: GPS not available
☐ Test 4.2: Staff không có cửa hàng
☐ Test 4.3: Checkout trước checkin
☐ Test 4.4: Check-in outside radius

DATABASE VERIFICATION:
☐ Test 5.1: Attendance logs inserted correctly

TOTAL: 24 test cases
```

---

## Bug Report Template

Nếu phát hiện bug, fill in:

```
BUG ID: [Auto-generated or sequential]
Test Case: [Test 1.1 - Test 5.1]
Summary: [Brief description]
Severity: [Critical / High / Medium / Low]
Steps to Reproduce:
1. 
2. 
3. 
Expected Result: 
Actual Result: 
Screenshots: [Attach if available]
Environment: [Browser, OS, Device]
```