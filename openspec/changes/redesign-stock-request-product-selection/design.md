## Context

Modal "Yêu cầu xuất hàng" hiện tại sử dụng UX search-based đơn giản:
- Text input để tìm sản phẩm theo tên/mã
- Dropdown hiển thị kết quả search
- Không có hình ảnh, không có category filter
- Người dùng phải nhớ chính xác tên/mã sản phẩm

**Ràng buộc:**
- Sử dụng design system: shadcn/ui components
- Design tokens từ index.css
- Responsive trên desktop và tablet
- Modal size: max-w-4xl

## Goals / Non-Goals

**Goals:**
- Cải thiện UX chọn sản phẩm: nhanh hơn, trực quan hơn
- Hiển thị hình ảnh sản phẩm để dễ nhận diện
- Lọc theo danh mục để giảm thời gian tìm kiếm
- Xử lý variant (màu/size) khi sản phẩm có nhiều phiên bản

**Non-Goals:**
- Không thay đổi API backend
- Không thay đổi logic nghiệp vụ (tạo request, validation)
- Không tái sử dụng cho các modal khác (StockIn, StockOut) - mỗi modal có workflow khác nhau

## Decisions

### 1. Two-Panel Layout
**Quyết định:** Sử dụng layout hai cột: bên trái chọn sản phẩm, bên phải danh sách đã chọn

**Alternatives:**
- Single panel với tabs: Chuyển đổi giữa "Tìm kiếm" và "Đã chọn" - UX kém hơn
- Modal riêng cho mỗi section: Quá nhiều clicks

**Lý do:** Two-panel cho phép user vừa xem sản phẩm vừa quản lý danh sách cùng lúc, workflow mượt hơn

### 2. Category Tabs thay vì Dropdown Filter
**Quyết định:** Horizontal tabs cho category filter

**Alternatives:**
- Dropdown select: Cần thêm 1 click để mở
- Sidebar categories: Tốn diện tích, overkill cho modal

**Lý do:** Tabs visible ngay lập tức, không cần click, thumb reachability tốt

### 3. Grid View thay vì List View
**Quyết định:** Product grid 3 cột với hình ảnh

**Alternatives:**
- List view: Chiều dài quá lớn khi có nhiều sản phẩm
- Masonry layout: Phức tạp implement, không cần thiết

**Lý do:** Grid tối ưu không gian, hình ảnh giúp nhận diện nhanh

### 4. Variant Selection Dialog
**Quyết định:** Dialog riêng để chọn variant khi sản phẩm có variants

**Alternatives:**
- Expandable rows trong grid: Grid trở nên phức tạp
- Inline variant selection: Quá nhiều controls

**Lý do:** Tách biệt rõ ràng giữa "chọn sản phẩm" và "chọn phiên bản"

## Risks / Trade-offs

- **[Risk]** Danh sách sản phẩm lớn (1000+) có thể chậm
  → **Mitigation**: Đã có filter theo category và search, đủ cho use case hiện tại

- **[Risk]** Hình ảnh sản phẩm có thể không có
  → **Mitigation**: Hiển thị placeholder icon khi không có image

- **[Risk]** Variant dialog thêm 1 bước click
  → **Mitigation**: Quick add với default quantity=1 nếu không có variant, giảm friction
