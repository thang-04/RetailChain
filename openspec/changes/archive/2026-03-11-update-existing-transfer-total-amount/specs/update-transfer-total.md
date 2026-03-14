# Update Existing Transfer Total Amount

## Mô tả

Chạy câu lệnh SQL UPDATE để tính và lưu total_amount cho các phiếu TRANSFER đã tồn tại trong database.

## SQL

```sql
UPDATE inventory_document idoc
SET idoc.total_amount = (
    SELECT SUM(idi.quantity * pv.price)
    FROM inventory_document_item idi
    JOIN product_variants pv ON idi.variant_id = pv.id
    WHERE idi.document_id = idoc.id
)
WHERE idoc.document_type = 'TRANSFER';
```
