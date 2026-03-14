# Stock Out Total Value API

## Mô tả

Đảm bảo API xuất kho trả về trường `totalValue` để hiển thị tổng giá trị phiếu xuất.

## Yêu cầu

- API endpoint: `GET /api/inventory/documents?type=TRANSFER`
- Response phải chứa trường `totalValue` (Long)
- Nếu không có giá trị, trả về 0
