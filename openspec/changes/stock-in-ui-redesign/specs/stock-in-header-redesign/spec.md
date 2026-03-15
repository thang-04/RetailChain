## ADDED Requirements

### Requirement: Header với gradient background và icon mới
Header của trang stock-in PHẢI sử dụng gradient background với icon Download.

#### Scenario: Header hiển thị gradient emerald
- **WHEN** trang stock-in load
- **THEN** header có background gradient từ emerald (#10b981) đến emerald/80

#### Scenario: Icon Download hiển thị
- **WHEN** trang stock-in load
- **THEN** header hiển thị icon Download thay vì FileText

#### Scenario: Header text
- **WHEN** trang stock-in load
- **THEN** hiển thị "Nhập Kho" (thay vì "Quản Lý Nhập Kho")
- **AND** subtitle: "Quản lý và theo dõi các phiếu nhập hàng"

### Requirement: Không hỗ trợ dark mode
Trang stock-in KHÔNG hỗ trợ dark mode, chỉ light mode.

#### Scenario: Xóa dark mode classes
- **WHEN** refactor stock-in
- **THEN** loại bỏ tất cả các class `dark:` trong code
- **AND** sử dụng class giống stock-out (bg-background, text-foreground thay vì dark: variants)

### Requirement: Responsive header
Header PHẢI responsive trên các kích thước màn hình khác nhau.

#### Scenario: Desktop
- **WHEN** màn hình >= 1024px
- **THEN** header hiển thị full: icon to (64px), title lớn, subtitle

#### Scenario: Mobile
- **WHEN** màn hình < 1024px
- **THEN** header vẫn hiển thị đầy đủ nhưng có thể xuống dòng