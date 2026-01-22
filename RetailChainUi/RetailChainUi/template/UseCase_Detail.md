# RETAIL CHAIN MANAGEMENT - DETAILED USE CASE SPECIFICATION

## 1. ACTORS & ROLES

### 1.1. Administrator (Admin)
- **Mô tả**: Quản trị viên cấp cao nhất của hệ thống chuỗi bán lẻ.
- **Phạm vi**: Toàn bộ hệ thống, tất cả cửa hàng, kho tổng và nhân sự.
- **Quyền hạn**: Truy cập tất cả các module, cấu hình hệ thống, xem báo cáo toàn chuỗi.

### 1.2. Store Manager (Quản lý cửa hàng)
- **Mô tả**: Người chịu trách nhiệm vận hành một (hoặc vài) cửa hàng cụ thể.
- **Phạm vi**: Chỉ dữ liệu thuộc cửa hàng được phân công.
- **Quyền hạn**: Quản lý nhân viên cửa hàng, duyệt đơn nhập/xuất kho, xem báo cáo doanh thu/tồn kho của cửa hàng mình.

### 1.3. Staff (Nhân viên bán hàng/kho)
- **Mô tả**: Nhân viên làm việc tại cửa hàng.
- **Phạm vi**: Các tác vụ vận hành hàng ngày tại cửa hàng.
- **Quyền hạn**: Bán hàng (POS), kiểm kho, yêu cầu nhập hàng, chấm công.

---

## 2. DETAILED USE CASES

### MODULE 1: AUTHENTICATION & AUTHORIZATION (AUTH)

#### AUTH-01: Đăng nhập hệ thống (Login)
- **Actor**: All Actors
- **Mô tả**: Người dùng đăng nhập vào hệ thống để lấy Access Token.
- **Pre-condition**: Tài khoản đã được tạo và kích hoạt.
- **Main Flow**:
  1. Người dùng nhập Username và Password.
  2. Hệ thống mã hóa Password và đối chiếu với cơ sở dữ liệu.
  3. Nếu đúng, hệ thống trả về JWT (Access Token & Refresh Token) kèm thông tin User Profile và Role.
  4. Hệ thống chuyển hướng người dùng đến trang Dashboard tương ứng với Role.
- **Post-condition**: Người dùng có phiên làm việc hợp lệ.

#### AUTH-02: Đăng xuất (Logout)
- **Actor**: All Actors
- **Mô tả**: Kết thúc phiên làm việc an toàn.
- **Main Flow**:
  1. Người dùng chọn chức năng Đăng xuất.
  2. Client xóa Access Token/Refresh Token khỏi Storage.
  3. (Optional) Client gửi request lên Server để blacklist token hiện tại.
  4. Hệ thống chuyển hướng về trang Login.

#### AUTH-03: Quản lý Profile cá nhân
- **Actor**: All Actors
- **Mô tả**: Cập nhật thông tin cá nhân hoặc đổi mật khẩu.
- **Main Flow**:
  1. Người dùng vào trang Profile.
  2. Thay đổi thông tin (SĐT, Avatar) hoặc đổi mật khẩu cũ sang mới.
  3. Hệ thống validate và cập nhật DB.

---

### MODULE 2: STORE MANAGEMENT (STR)

#### STR-01: Quản lý danh sách Cửa hàng (CRUD Store)
- **Actor**: Administrator
- **Mô tả**: Thêm mới, cập nhật thông tin, hoặc vô hiệu hóa một cửa hàng trong chuỗi.
- **Main Flow (Tạo mới)**:
  1. Admin chọn "Thêm cửa hàng".
  2. Nhập: Tên cửa hàng, Địa chỉ, SĐT, Loại cửa hàng (Flagship/Standard), Trạng thái (Active/Coming Soon).
  3. Hệ thống tạo Store ID và lưu vào DB.
- **Constraint**: Mã cửa hàng không được trùng.

#### STR-02: Gán Quản lý cho Cửa hàng
- **Actor**: Administrator
- **Mô tả**: Chỉ định một Account (Role: Store Manager) chịu trách nhiệm cho Store.
- **Main Flow**:
  1. Admin chọn Cửa hàng cần gán.
  2. Tìm kiếm User (Role = Store Manager) chưa được gán hoặc muốn thay thế.
  3. Hệ thống cập nhật mối liên kết Store-Manager.

#### STR-03: Cấu hình Kho cho Cửa hàng
- **Actor**: Administrator
- **Mô tả**: Mỗi cửa hàng cần một kho vật lý (hoặc ảo) đi kèm để quản lý tồn kho.
- **Main Flow**:
  1. Khi tạo Store, hệ thống tự động tạo một Inventory Location mặc định gắn với Store đó.
  2. Admin có thể cấu hình thêm các khu vực lưu trữ (Shelf/Bin) cho kho cửa hàng.

---

### MODULE 3: PRODUCT MANAGEMENT (PRD)

#### PRD-01: Quản lý Master Data Sản phẩm
- **Actor**: Administrator
- **Mô tả**: Định nghĩa danh mục sản phẩm toàn chuỗi (Global Catalog).
- **Attributes**: SKU, Barcode, Tên, Danh mục (Category), Giá niêm yết (Base Price), Đơn vị tính, Hình ảnh.
- **Main Flow**:
  1. Admin nhập thông tin sản phẩm.
  2. Hệ thống kiểm tra trùng lặp SKU/Barcode.
  3. Lưu sản phẩm với trạng thái mặc định là DRAFT hoặc ACTIVE.

#### PRD-02: Quản lý Giá bán (Price Book)
- **Actor**: Administrator
- **Mô tả**: Thiết lập giá bán cho từng khu vực hoặc từng cửa hàng (nếu áp dụng giá khác nhau).
- **Main Flow**:
  1. Admin chọn Sản phẩm.
  2. Cập nhật Giá bán lẻ.
  3. Hệ thống đồng bộ giá mới xuống tất cả POS của cửa hàng.

---

### MODULE 4: INVENTORY MANAGEMENT (INV)

#### INV-01: Xem Tồn kho (View Inventory)
- **Actor**: Admin (Toàn chuỗi), Store Manager (Cửa hàng mình), Staff (Cửa hàng mình)
- **Mô tả**: Xem số lượng tồn kho hiện tại của sản phẩm.
- **Main Flow**:
  1. User chọn màn hình Inventory.
  2. Hệ thống hiển thị danh sách: Tên SP, SKU, Số lượng tồn (On-hand), Số lượng có thể bán (Available).
  3. User có thể filter theo Danh mục hoặc tìm theo tên.

#### INV-02: Nhập kho (Inbound/Receipt)
- **Actor**: Store Manager, Staff (nếu được quyền)
- **Mô tả**: Nhập hàng vào kho cửa hàng (từ NCC hoặc từ Kho tổng).
- **Main Flow**:
  1. Tạo phiếu Nhập kho (Receipt Note).
  2. Scan Barcode hoặc chọn sản phẩm từ danh sách.
  3. Nhập số lượng thực tế nhận.
  4. Xác nhận ("Complete").
  5. Hệ thống tăng số lượng tồn kho (Stock Level Increase).

#### INV-03: Xuất kho Bán hàng (Outbound/Sale)
- **Actor**: Staff (qua POS), Store Manager
- **Mô tả**: Trừ kho tự động khi bán hàng.
- **Main Flow**:
  1. Đơn hàng hoàn tất thanh toán.
  2. Hệ thống tự động tạo giao dịch Xuất kho (Issue Note).
  3. Giảm số lượng tồn kho (Stock Level Decrease).

#### INV-04: Điều chuyển Kho (Transfer)
- **Actor**: Store Manager (Yêu cầu), Admin (Duyệt/Thực hiện)
- **Mô tả**: Chuyển hàng từ Cửa hàng A sang Cửa hàng B hoặc từ Kho tổng về Cửa hàng.
- **Main Flow**:
  1. Sender tạo phiếu Chuyển kho (Transfer Order) -> Trạng thái: "In Transit".
  2. Kho gửi bị trừ tồn kho tạm thời.
  3. Receiver nhận hàng và xác nhận "Receive".
  4. Kho nhận được cộng tồn kho. Trạng thái: "Completed".

#### INV-05: Kiểm kê Kho (Stock Take/Audit)
- **Actor**: Store Manager
- **Mô tả**: Đối chiếu số lượng tồn kho trên hệ thống (System Qty) và thực tế (Physical Qty).
- **Main Flow**:
  1. Tạo phiên kiểm kê (Audit Session).
  2. Nhân viên đi đếm và nhập số lượng thực tế vào App/Web.
  3. Hệ thống tính độ lệch (Variance).
  4. Manager duyệt điều chỉnh kho (Adjustment) để cân bằng kho.

---

### MODULE 5: WORKFORCE MANAGEMENT (STF)

#### STF-01: Quản lý Nhân viên (Staff Profile)
- **Actor**: Administrator, Store Manager
- **Mô tả**: CRUD hồ sơ nhân viên.
- **Data**: Họ tên, Mã NV, SĐT, Email, Chức vụ, Cửa hàng trực thuộc.

#### STF-02: Phân ca làm việc (Shift Scheduling)
- **Actor**: Store Manager
- **Mô tả**: Lên lịch làm việc hàng tuần cho nhân viên.
- **Main Flow**:
  1. Manager chọn ngày và Ca (Sáng/Chiều/Tối).
  2. Add nhân viên vào ca.
  3. Publish lịch làm việc.

#### STF-03: Chấm công (Timekeeping)
- **Actor**: Staff
- **Mô tả**: Check-in/Check-out khi đến/về.
- **Main Flow**:
  1. Staff đến cửa hàng.
  2. Mở App, chọn "Check-in".
  3. Hệ thống ghi nhận thời gian và toạ độ (GPS) hoặc quét QR tại quầy.

---

### MODULE 6: REPORTING & ANALYTICS (REP)

#### REP-01: Dashboard Tổng quan
- **Actor**: Admin, Store Manager
- **Content**:
  - Doanh thu hôm nay (nếu có module Sales).
  - Tổng giá trị tồn kho.
  - Top sản phẩm bán chạy.
  - Các cảnh báo (Sắp hết hàng).

#### REP-02: Báo cáo Xuất Nhập Tồn
- **Actor**: Store Manager, Accountant
- **Mô tả**: Báo cáo chi tiết biến động kho trong kỳ.
- **Columns**: Tồn đầu kỳ, Nhập trong kỳ, Xuất trong kỳ, Tồn cuối kỳ.

#### REP-03: Cảnh báo Tồn kho thấp (Low Stock Alert)
- **Logic**: Khi Quantity <= Min_Threshold.
- **Action**: Hiển thị thông báo trên Dashboard hoặc gửi Email cho Manager nhắc nhập hàng.
