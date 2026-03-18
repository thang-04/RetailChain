# Agent Browser - Attendance Feature Test Plan

> **For agentic workers:** Use agent-browser skill to execute this plan for automated UI testing.

**Goal:** Sử dụng agent-browser để tự động hóa việc test feature attendance (check-in/check-out & dashboard)

**Target URL:** http://localhost:5173

**Tech Stack:** agent-browser (Playwright-based automation)

---

## Pre-Test Setup

### 1. Kiểm tra agent-browser đã cài đặt

```bash
agent-browser --version
```

### 2. Mở browser và điều hướng đến app

```bash
agent-browser open http://localhost:5173
```

### 3. Chụp snapshot trang login

```bash
agent-browser snapshot -i
```

---

## PART 1: Test với STAFF Account

### Test 1.1: Staff Login

```bash
# Fill username
agent-browser fill @e1 "staff011"

# Fill password  
agent-browser fill @e2 "123456"

# Click login button
agent-browser click @e3

# Wait for navigation
agent-browser wait --load networkidle
```

### Test 1.2: Kiểm tra Sidebar cho Staff

```bash
# Snapshot để xem menu
agent-browser snapshot -i

# Verify: Không thấy "Dashboard Chấm công"
# Verify: Thấy "Chấm công"
```

### Test 1.3: Staff Check-in

```bash
# Click menu "Chấm công" (tìm bằng text hoặc ref)
agent-browser find text "Chấm công" click

# Wait for page load
agent-browser wait --load networkidle

# Snapshot để xem trang check-in
agent-browser snapshot -i

# Click Check-in button
agent-browser find text "Check-in" click

# Wait cho location
agent-browser wait --load networkidle

# Chụp kết quả
agent-browser screenshot staff-checkin-result.png

# Kiểm tra toast message
agent-browser snapshot -i
```

### Test 1.4: Staff Check-out

```bash
# Click Check-out button
agent-browser find text "Check-out" click

# Wait
agent-browser wait --load networkidle

# Chụp kết quả
agent-browser screenshot staff-checkout-result.png

# Snapshot để verify
agent-browser snapshot -i
```

---

## PART 2: Test với STORE MANAGER Account

### Test 2.1: Manager Login & Logout trước

```bash
# Mở trang mới hoặc clear session
agent-browser open http://localhost:5173

# Snapshot login page
agent-browser snapshot -i

# Fill login form
agent-browser fill @e1 "manager01"
agent-browser fill @e2 "123456"
agent-browser click @e3

# Wait
agent-browser wait --load networkidle
```

### Test 2.2: Kiểm tra Sidebar cho Manager

```bash
agent-browser snapshot -i

# Verify: Thấy "Chấm công"
# Verify: Thấy "Dashboard Chấm công"  
# Verify: Thấy "Staff Shifts"
```

### Test 2.3: Manager - Vào Dashboard

```bash
# Click "Dashboard Chấm công"
agent-browser find text "Dashboard Chấm công" click

# Wait
agent-browser wait --load networkidle

# Snapshot dashboard
agent-browser snapshot -i

# Verify: Hiển thị tên cửa hàng (không có dropdown)
# Verify: Có KPI cards
agent-browser screenshot manager-dashboard.png
```

### Test 2.4: Manager - Vào trang Chấm Công cá nhân

```bash
# Click "Chấm công"
agent-browser find text "Chấm công" click

# Wait
agent-browser wait --load networkidle

# Snapshot
agent-browser snapshot -i

# Verify: Có button Check-in/Check-out
agent-browser screenshot manager-attendance.png
```

---

## PART 3: Test với SUPER ADMIN Account

### Test 3.1: Super Admin Login

```bash
# Clear và mở lại
agent-browser open http://localhost:5173

# Snapshot login
agent-browser snapshot -i

# Fill login
agent-browser fill @e1 "admin"
agent-browser fill @e2 "admin123"
agent-browser click @e3

# Wait
agent-browser wait --load networkidle
```

### Test 3.2: Kiểm tra Sidebar cho Admin

```bash
agent-browser snapshot -i

# Verify: Thấy cả 2 menu
```

### Test 3.3: Admin - Dashboard với dropdown

```bash
# Click Dashboard Chấm công
agent-browser find text "Dashboard Chấm công" click

# Wait
agent-browser wait --load networkidle

# Snapshot để thấy dropdown
agent-browser snapshot -i

# Verify: Có dropdown chọn cửa hàng
agent-browser screenshot admin-dashboard.png
```

### Test 3.4: Admin - Chọn 1 cửa hàng

```bash
# Tìm và click dropdown
agent-browser snapshot -i

# Click dropdown để mở
agent-browser click @e<dropdown_ref>

# Wait
agent-browser wait --load networkidle

# Chọn 1 cửa hàng
agent-browser snapshot -i
agent-browser find text "Cửa Hàng 01 - Vincom" click

# Wait
agent-browser wait --load networkidle

# Snapshot kết quả
agent-browser snapshot -i
agent-browser screenshot admin-single-store.png
```

### Test 3.5: Admin - Quay lại xem tất cả

```bash
# Mở dropdown
agent-browser click @e<dropdown_ref>

# Chọn "Tất cả cửa hàng"
agent-browser find text "Tất cả cửa hàng" click

# Wait
agent-browser wait --load networkidle

# Snapshot
agent-browser snapshot -i
agent-browser screenshot admin-all-stores.png
```

---

## PART 4: Cleanup

### Đóng browser

```bash
agent-browser close
```

---

## Expected Results

### Staff Account
| Check | Expected |
|-------|----------|
| Sidebar Menu | Thấy "Chấm công", KHÔNG thấy "Dashboard Chấm công" |
| Check-in | Thành công, hiển thị time |
| Check-out | Thành công, hiển thị giờ làm |

### Store Manager Account
| Check | Expected |
|-------|----------|
| Sidebar Menu | Thấy cả "Chấm công" và "Dashboard Chấm công" |
| Dashboard | Hiển thị đúng cửa hàng (không dropdown) |
| KPI Cards | Có mặt/đã checkout/muộn/TB giờ |

### Super Admin Account
| Check | Expected |
|-------|----------|
| Sidebar Menu | Thấy cả 2 menu |
| Dashboard Default | "Tất cả cửa hàng" được chọn |
| Dropdown | Có thể chọn từng cửa hàng |
| Single Store View | Data thay đổi theo store |

---

## Troubleshooting

### Nếu element không tìm thấy
```bash
# Chụp screenshot để debug
agent-browser screenshot debug.png

# Thử find với text
agent-browser find text "Chấm công" click
```

### Nếu page không load
```bash
# Wait cho network idle
agent-browser wait --load networkidle

# Hoặc wait cố định
agent-browser wait 5000
```

### Nếu cần restart browser
```bash
agent-browser close
# Sau đó open lại
agent-browser open http://localhost:5173
```

---

## Commands Reference

```bash
# Navigation
agent-browser open <url>
agent-browser close

# Interaction
agent-browser snapshot -i
agent-browser fill @e1 "text"
agent-browser click @e1
agent-browser find text "text" click

# Wait
agent-browser wait --load networkidle
agent-browser wait 3000

# Screenshot
agent-browser screenshot <filename.png>

# Get info
agent-browser get url
agent-browser get title
```
