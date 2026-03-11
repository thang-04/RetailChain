# Stock Out Quantity Calculation Fix

## Mô tả

Sửa logic tính tổng số lượng trong StepTwoProducts.jsx để chỉ tính các items có variantId.

## Fix

Thay đổi:
```javascript
// Trước
const totalQuantity = items.reduce((sum, item) => sum + (parseInt(item.quantity) || 0), 0);

// Sau  
const totalQuantity = items.filter(i => i.variantId).reduce((sum, item) => sum + (parseInt(item.quantity) || 0), 0);
```
