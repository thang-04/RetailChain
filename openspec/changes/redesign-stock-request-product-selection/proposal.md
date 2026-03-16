## Why

UX hiện tại của modal "Yêu cầu xuất hàng" có vấn đề nghiêm trọng về khả năng sử dụng: người dùng chỉ có thể tìm sản phẩm bằng text search, không có hình ảnh, không thể lọc theo danh mục, và phải nhập liệu nhiều. Điều này gây khó khăn cho nhân viên kho khi cần nhanh chóng tìm và chọn sản phẩm để bổ sung tồn kho cho cửa hàng.

## What Changes

Thiết kế lại hoàn toàn luồng chọn sản phẩm trong modal Yêu cầu xuất hàng:

- **Two-Panel Layout**: Bên trái hiển thị lưới sản phẩm với hình ảnh, bên phải hiển thị danh sách đã chọn
- **Category Tabs**: Thêm tab lọc theo danh mục sản phẩm (Áo, Quần, Túi xách,...)
- **Product Grid**: Hiển thị sản phẩm dạng lưới với hình ảnh, tên, mã - dễ nhận diện
- **Visual Selection**: Click để thêm sản phẩm, hiển thị checkmark khi đã chọn
- **Variant Dialog**: Popup chọn phiên bản (màu/size) khi sản phẩm có nhiều variant
- **Quick Quantity**: Điều chỉnh số lượng trực tiếp trong danh sách đã chọn
- **Design System**: Chuẩn hóa theo design tokens của hệ thống (shadcn/ui)

## Capabilities

### New Capabilities

- **product-selection-ux**: Cải thiện UX chọn sản phẩm với grid view, category filtering, và visual feedback

### Modified Capabilities

- Không có thay đổi yêu cầu spec hiện tại

## Impact

- **Code**: `CreateStockRequestModal.jsx` - component modal yêu cầu xuất hàng
- **UI**: Thay đổi layout từ single-panel search thành two-panel grid
- **Dependencies**: Sử dụng lại `inventoryService.getAllCategories()` đã có
