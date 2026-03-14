## Context

Frontend StockInWizard kiểm tra `isCentral` của warehouse bằng so sánh `wh.isCentral === true`. Tuy nhiên, sau khi merge code từ nhánh thangnd, backend trả về `isCentral` là Integer (0 hoặc 1) thay vì Boolean. Điều này khiến điều kiện `=== true` không bao giờ đúng, dẫn đến không tìm thấy kho tổng.

## Goals / Non-Goals

**Goals:**
- Sửa lỗi không tìm thấy kho tổng trong StockInWizard
- Đảm bảo chọn đúng warehouse có isCentral = 1

**Non-Goals:**
- Không thay đổi backend API
- Không thay đổi cấu trúc database

## Decisions

**Quyết định:** Sửa điều kiện so sánh từ `wh.isCentral === true` sang `wh.isCentral === 1`

**Lý do:**
- Backend trả về Integer nên cần so sánh với số
- Cách tiếp cận này đơn giản và an toàn nhất

## Risks / Trade-offs

**[Risk]** Có thể có các vị trí khác cũng sử dụng so sánh Boolean
→ **Mitigation:** Kiểm tra các file khác trong codebase có sử dụng tương tự

**[Risk]** Frontend build có thể cache
→ **Mitigation:** Rebuild frontend sau khi sửa
