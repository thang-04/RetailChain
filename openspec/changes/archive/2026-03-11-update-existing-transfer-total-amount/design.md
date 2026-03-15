## Context

Các phiếu TRANSFER cũ trong database có total_amount = NULL. Cần chạy SQL UPDATE để tính và cập nhật giá trị này từ bảng inventory_document_item và product_variants.

## Goals / Non-Goals

**Goals:**
- Update total_amount cho các phiếu TRANSFER từ dữ liệu items

**Non-Goals:**
- Không sửa code backend
- Chỉ update dữ liệu đã có

## Decisions

1. **Cách tính**: Dùng JOIN giữa inventory_document_item và product_variants để lấy price
2. **Công thức**: total_amount = sum(idi.quantity * pv.price)

## Risks / Trade-offs

- [Rủi ro] Dữ liệu sai → Backup trước khi update
