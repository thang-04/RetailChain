## 1. Tạo StockOutWizard folder và files

- [x] 1.1 Tạo folder `src/components/StockOutWizard/`
- [x] 1.2 Copy ProgressStepper.jsx từ StockInWizard
- [x] 1.3 Tạo StockOutWizard.jsx (main wizard component)
- [x] 1.4 Tạo StepOneInfo.jsx (thông tin kho)
- [x] 1.5 Tạo StepTwoProducts.jsx (chọn sản phẩm)
- [x] 1.6 Tạo StepThreeConfirm.jsx (xác nhận)

## 2. Implement StockOutWizard.jsx

- [x] 2.1 Setup state: currentStep, loading, formData, items
- [x] 2.2 Fetch data: warehouses (tách central và store warehouses), products
- [x] 2.3 Auto select central warehouse làm source
- [x] 2.4 Setup navigation functions (next, back, submit)

## 3. Implement StepOneInfo.jsx

- [x] 3.1 Hiển thị kho nguồn (read-only, luôn là kho tổng)
- [x] 3.2 Dropdown chọn kho đích (danh sách kho cửa hàng)
- [x] 3.3 Validation: phải chọn kho đích

## 4. Implement StepTwoProducts.jsx

- [x] 4.1 Hiển thị danh sách sản phẩm có trong kho nguồn
- [x] 4.2 Filter theo category
- [x] 4.3 Search theo tên/sku
- [x] 4.4 Chọn sản phẩm và nhập số lượng
- [x] 4.5 Validation: ít nhất 1 sản phẩm

## 5. Implement StepThreeConfirm.jsx

- [x] 5.1 Hiển thị thông tin: kho nguồn, kho đích
- [x] 5.2 Hiển thị danh sách sản phẩm xuất
- [x] 5.3 Tính tổng số lượng
- [x] 5.4 Nút submit gọi API transferStock

## 6. Update CreateStockOut.jsx

- [x] 6.1 Import và render StockOutWizard thay vì form cũ
