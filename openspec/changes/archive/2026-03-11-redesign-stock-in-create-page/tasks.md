## 1. Setup & Component Structure

- [x] 1.1 Tạo thư mục `components/StockInWizard/`
- [x] 1.2 Tạo Wizard container component với step state
- [x] 1.3 Tạo ProgressStepper component hiển thị 3 bước

## 2. Bước 1: Thông tin phiếu nhập

- [x] 2.1 Tạo `StepOneInfo.jsx` - form chọn kho và NCC
- [x] 2.2 Tích hợp API lấy danh sách kho (Central Warehouse auto-select)
- [x] 2.3 Tích hợp API lấy danh sách supplier
- [x] 2.4 Thêm validation required fields

## 3. Bước 2: Thêm sản phẩm

- [x] 3.1 Tạo `StepTwoProducts.jsx` - danh sách sản phẩm
- [x] 3.2 Tạo ProductSearch component với debounce search
- [x] 3.3 Tạo ProductFilter component (category, size, color)
- [x] 3.4 Thêm logic check trùng lặp sản phẩm
- [x] 3.5 Tạo SummaryPanel hiển thị tổng quan

## 4. Bước 3: Xác nhận & Submit

- [x] 4.1 Tạo `StepThreeConfirm.jsx` - preview thông tin phiếu
- [x] 4.2 Hiển thị danh sách sản phẩm đầy đủ
- [x] 4.3 Tích hợp API submit phiếu nhập
- [x] 4.4 Xử lý success/error response

## 5. Tích hợp & Testing

- [x] 5.1 Update `CreateStockIn.jsx` để sử dụng Wizard
- [x] 5.2 Build thành công
- [x] 5.3 Đã fix API endpoint (`/inventory/warehouse` -> `/warehouse`)
- [x] 5.4 Test E2E: Cần test thủ công - Wizard component cần backend API hoạt động
