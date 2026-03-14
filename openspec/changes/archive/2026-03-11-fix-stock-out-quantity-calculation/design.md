## Context

Trong `StockOutWizard.jsx`, state `items` được khởi tạo với 1 item rỗng:
```javascript
const [items, setItems] = useState([
    { id: Date.now(), variantId: '', quantity: 1 }
]);
```

Trong `StepTwoProducts.jsx`, hàm tính `totalQuantity` tính tổng tất cả items mà không lọc:
```javascript
const totalQuantity = items.reduce((sum, item) => sum + (parseInt(item.quantity) || 0), 0);
```

Khi người dùng thêm 1 sản phẩm:
- Item rỗng: quantity = 1
- Item mới thêm: quantity = 1
- **Tổng = 2** (sai!)

## Goals / Non-Goals

**Goals:**
- Lọc bỏ items không có variantId khi tính tổng

**Non-Goals:**
- Không thay đổi logic khác

## Decisions

1. **Cách sửa**: Thêm `.filter(i => i.variantId)` trước khi reduce

## Risks / Trade-offs

- [Rủi ro] Không có - fix đơn giản
