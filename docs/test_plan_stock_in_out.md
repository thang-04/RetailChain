# Test Plan: Stock-In & Stock-Out Module

> **Ngày tạo:** 2026-02-24  
> **Module:** Inventory - Nhập Kho / Xuất Kho  
> **Người thực hiện:** QA Team  
> **Trạng thái:** Pending

---

## 📋 Mục lục

1. [Tổng quan](#1-tổng-quan)
2. [Normal Flow - Luồng chính](#2-normal-flow---luồng-chính)
3. [Acceptance Flow - Luồng chấp nhận](#3-acceptance-flow---luồng-chấp-nhận)
4. [Exception Flow - Luồng xử lý lỗi](#4-exception-flow---luồng-xử-lý-lỗi)
5. [Checklist](#5-checklist)

---

## 1. Tổng quan

### 1.1 Phạm vi kiểm thử

| Module | Routes | Mô tả |
|--------|--------|-------|
| **Stock-In** | `/stock-in`, `/stock-in/create` | Quản lý nhập kho từ nhà cung cấp |
| **Stock-Out** | `/stock-out`, `/stock-out/create` | Quản lý xuất kho đến cửa hàng |

### 1.2 Điều kiện tiên quyết

- [ ] Server Backend đang chạy (Spring Boot)
- [ ] Database MySQL đã có dữ liệu mẫu
- [ ] Frontend đang chạy (`npm run dev`)
- [ ] Đã đăng nhập với tài khoản hợp lệ
- [ ] Đã có dữ liệu: Warehouse, Product, Variant, Supplier

---

## 2. Normal Flow - Luồng chính

### 2.1 Stock-In List (`/stock-in`)

| ID | Mô tả | Dữ liệu test | Kết quả mong đợi |
|----|--------|--------------|------------------|
| **N01** | Hiển thị danh sách phiếu nhập kho | - | Table hiển thị đầy đủ các cột: STT, Mã phiếu, Ngập, Này nh cấp, Kho đích, Sản phhà cungẩm, Giá trị, Trạng thái, Thao tác |
| **N02** | Phân trang mặc định | - | Mặc định hiển thị 10 dòng/ trang |
| **N03** | Click nút "Tạo Phiếu Mới" | - | Chuyển hướng đến `/stock-in/create` |
| **N04** | Click nút "Nhập Excel" | - | Mở dialog/file picker (UI placeholder - không cần test backend) |

### 2.2 Stock-In Create (`/stock-in/create`)

| ID | Mô tả | Dữ liệu test | Kết quả mong đợi |
|----|--------|--------------|------------------|
| **N05** | Load trang tạo phiếu nhập | - | Tự động load: Danh sách kho, Danh sách sản phẩm (variants), Danh sách nhà cung cấp |
| **N06** | Tự động chọn Kho Tổng | - | Trường kho đích tự động chọn warehouse có `warehouseType = 1` (Kho Tổng) |
| **N07** | Thêm sản phẩm vào phiếu | Click "Thêm Sản Phẩm" | Thêm 1 dòng mới vào danh sách sản phẩm |
| **N08** | Chọn sản phẩm từ dropdown | Chọn 1 variant bất kỳ | Dropdown hiển thị format: `{productName} - {sku} ({color}/{size})` |
| **N09** | Nhập số lượng sản phẩm | Nhập số > 0 | Số lượng được hiển thị trong ô input |
| **N10** | Xóa sản phẩm khỏi phiếu | Click icon xóa (khi có ≥2 sản phẩm) | Dòng sản phẩm được xóa khỏi danh sách |
| **N11** | Submit tạo phiếu nhập thành công | Điền đầy đủ: Supplier + ≥1 sản phẩm + số lượng > 0 | API trả về 200, redirect về `/stock-in`, hiển thị phiếu mới trong list |
| **N12** | Click nút "Hủy Bỏ" | - | Quay về `/stock-in` không lưu dữ liệu |

### 2.3 Stock-Out List (`/stock-out`)

| ID | Mô tả | Dữ liệu test | Kết quả mong đợi |
|----|--------|--------------|------------------|
| **N13** | Hiển thị danh sách phiếu xuất kho | - | Table hiển thị đầy đủ: STT, Mã phiếu, Ngày xuất, Kho xuất, Lý do, Sản phẩm, Giá trị, Trạng thái, Thao tác |
| **N14** | Click nút "Tạo Phiếu Xuất" | - | Chuyển hướng đến `/stock-out/create` |
| **N15** | Click "Xem Chi tiết" trong dropdown | Click vào 1 phiếu | Mở modal hiển thị chi tiết phiếu xuất |

### 2.4 Stock-Out Create (`/stock-out/create`)

| ID | Mô tả | Dữ liệu test | Kết quả mong đợi |
|----|--------|--------------|------------------|
| **N16** | Load trang tạo phiếu xuất | - | Tự động load: Danh sách kho, Danh sách sản phẩm |
| **N17** | Hiển thị Kho Xuất (Read-only) | - | Trường "Kho Xuất (Kho Tổng)" hiển thị tên kho tổng, không cho chỉnh sửa |
| **N18** | Chọn Kho nhận (Cửa hàng) | Chọn warehouseType = 2 | Dropdown chỉ hiển thị các kho cửa hàng |
| **N19** | Submit tạo phiếu xuất thành công | Điền đầy đủ: Kho nhận + ≥1 sản phẩm | API trả về 200, redirect về `/stock-out`, hiển thị phiếu mới |

---

## 3. Acceptance Flow - Luồng chấp nhận

### 3.1 Chức năng tìm kiếm & lọc

| ID | Mô tả | Dữ liệu test | Kết quả mong đợi |
|----|--------|--------------|------------------|
| **A01** | Tìm kiếm theo mã phiếu | Nhập đúng mã phiếu tồn tại | Hiển thị các phiếu khớp với mã |
| **A02** | Tìm kiếm theo nhà cung cấp (Stock-In) | Nhập tên supplier | Hiển thị các phiếu có supplier khớp |
| **A03** | Tìm kiếm theo kho xuất/nhận | Nhập tên kho | Hiển thị các phiếu liên quan đến kho đó |
| **A04** | Lọc theo trạng thái - Pending | Chọn "Chờ duyệt" | Chỉ hiển thị các phiếu có status = "Pending" |
| **A05** | Lọc theo trạng thái - Completed | Chọn "Hoàn thành" | Chỉ hiển thị các phiếu có status = "Completed" |
| **A06** | Lọc theo trạng thái - Cancelled | Chọn "Đã hủy" | Chỉ hiển thị các phiếu có status = "Cancelled" |
| **A07** | Lọc theo ngày - Từ ngày | Chọn ngày bắt đầu | Hiển thị các phiếu từ ngày đó trở đi |
| **A08** | Lọc theo ngày - Đến ngày | Chọn ngày kết thúc | Hiển thị các phiếu đến ngày đó |
| **A09** | Lọc kết hợp (search + status + date) | Kết hợp nhiều bộ lọc | Kết quả khớp TẤT CẢ các điều kiện lọc |
| **A10** | Click nút "Làm mới" | Click reset | Xóa TẤT CẢ bộ lọc, hiển thị toàn bộ danh sách |

### 3.2 Chức năng phân trang

| ID | Mô tả | Dữ liệu test | Kết quả mong đợi |
|----|--------|--------------|------------------|
| **A11** | Chuyển trang | Click nút Next/Previous | Hiển thị đúng dữ liệu của trang tương ứng |
| **A12** | Thay đổi số dòng/ trang | Chọn 20 dòng | Table hiển thị 20 dòng, phân trang lại |
| **A13** | Đếm tổng số phiếu | - | Footer hiển thị đúng "Hiển thị X-Y trong Z phiếu" |

### 3.3 Chức năng xem chi tiết

| ID | Mô tả | Dữ liệu test | Kết quả mong đợi |
|----|--------|--------------|------------------|
| **A14** | Modal hiển thị đúng thông tin | Click "Xem Chi tiết" | Modal hiển thị: Mã phiếu, Ngày tạo, Nhà cung cấp/Kho, Trạng thái, Ghi chú |
| **A15** | Modal hiển thị danh sách sản phẩm | - | Table trong modal hiển thị: Tên sản phẩm, Số lượng, Đơn giá, Thành tiền |
| **A16** | Modal hiển thị tổng giá trị | - | Dòng Tổng cộng tính đúng tổng giá trị các sản phẩm |
| **A17** | Đóng modal | Click "Đóng" hoặc click outside | Modal đóng |
| **A18** | Nút In Phiếu trong modal | Click "In Phiếu" | UI placeholder - không cần test |

### 3.4 Chức năng xóa phiếu

| ID | Mô tả | Dữ liệu test | Kết quả mong đợi |
|----|--------|--------------|------------------|
| **A19** | Xác nhận xóa phiếu | Click "Xóa Phiếu" trong dropdown → Confirm | Hiển thị dialog xác nhận |
| **A20** | Xóa phiếu thành công | Confirm xóa | API xóa thành công, phiếu biến mất khỏi danh sách |
| **A21** | Hủy xóa phiếu | Cancel dialog xóa | Không xóa, danh sách giữ nguyên |

---

## 4. Exception Flow - Luồng xử lý lỗi

### 4.1 Validation phía Client

| ID | Mô tả | Dữ liệu test | Kết quả mong đợi |
|----|--------|--------------|------------------|
| **E01** | Submit khi chưa chọn sản phẩm | Để trống danh sách sản phẩm, click "Lưu Phiếu Nhập" | Hiển thị thông báo lỗi validation |
| **E02** | Submit khi số lượng = 0 | Nhập số lượng = 0 | Hiển thị thông báo lỗi validation |
| **E03** | Submit khi số lượng < 0 | Nhập số lượng âm | Input từ chối giá trị âm (min="1") |
| **E04** | Submit Stock-Out khi chưa chọn kho nhận | Để trống "Kho Đích", click "Lưu Phiếu Xuất" | Hiển thị thông báo lỗi validation |
| **E05** | Không thể xóa sản phẩm cuối cùng | Chỉ có 1 sản phẩm, click xóa | Nút xóa bị vô hiệu hóa hoặc không xóa được |

### 4.2 Xử lý lỗi API

| ID | Mô tả | Dữ liệu test | Kết quả mong đợi |
|----|--------|--------------|------------------|
| **E06** | API lỗi khi load danh sách | Tắt server backend | Hiển thị thông báo lỗi hoặc loading vô hạn |
| **E07** | API lỗi khi tạo phiếu nhập | Gửi request đến endpoint không tồn tại | Hiển thị alert lỗi: "Đã có lỗi xảy ra..." |
| **E08** | API lỗi khi xóa phiếu | Server trả về lỗi 500 | Hiển thị thông báo lỗi, danh sách không thay đổi |
| **E09** | Session timeout | Token hết hạn | Redirect về trang login hoặc hiển thị lỗi 401 |

### 4.3 Xử lý edge cases

| ID | Mô tả | Dữ liệu test | Kết quả mong đợi |
|----|--------|--------------|------------------|
| **E10** | Không có dữ liệu phiếu | Database trống | Hiển thị UI "Không tìm thấy dữ liệu" với hình ảnh placeholder |
| **E11** | Không có sản phẩm để chọn | Product table trống | Dropdown hiển thị "Đang tải..." hoặc trống |
| **E12** | Không có nhà cung cấp | Supplier table trống | Dropdown supplier trống hoặc hiển thị "Không có NCC" |
| **E13** | Danh sách tìm kiếm không có kết quả | Từ khóa không khớp | Hiển thị UI "Không tìm thấy dữ liệu" |
| **E14** | Load dữ liệu rất lâu | API chậm > 10s | Hiển thị trạng thái "Đang tải dữ liệu..." |

---

## 5. Checklist

### 5.1 Pre-test

- [ ] Backup database (nếu cần)
- [ ] Đảm bảo test data đầy đủ
- [ ] Ghi lại baseline performance

### 5.2 Execution

- [ ] Chạy tất cả test case Normal Flow
- [ ] Chạy tất cả test case Acceptance Flow
- [ ] Chạy tất cả test case Exception Flow

### 5.3 Post-test

- [ ] Verify dữ liệu trong database
- [ ] Kiểm tra logs nếu có lỗi
- [ ] Báo cáo bugs nếu có

---

## 📝 Ghi chú

- **UI Placeholder:** Các chức năng Import Excel, In Phiếu là UI placeholder - chỉ cần verify button tồn tại và click được, không cần test logic backend.
- **Test Data:** Cần chuẩn bị sẵn: ≥2 Warehouse (1 Kho Tổng, 1 Kho Cửa hàng), ≥3 Product có Variants, ≥2 Suppliers.
- **Browser:** Test trên Chrome, Firefox, Edge (latest versions).
- **Responsive:** Test trên mobile/tablet nếu có yêu cầu.

---

> **Kết thúc Test Plan**
