# Sửa Trạng Thái Mặc Định Khi Nhập Kho Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Sửa logic trạng thái mặc định khi nhập kho - IMPORT tự động là "Completed", các loại khác giữ "Pending"

**Architecture:** Sửa trực tiếp trong InventoryServiceImpl.java - thay hardcode "Pending" bằng logic theo documentType

**Tech Stack:** Java (Spring Boot), Backend only

---

## Task 1: Sửa Logic Status Trong InventoryServiceImpl

**Files:**
- Modify: `RetailChainService/src/main/java/com/sba301/retailmanagement/service/impl/InventoryServiceImpl.java:587`

**Context:**
- Hiện tại dòng 587 hardcode `.status("Pending")`
- Cần thay đổi logic:
  - IMPORT → "Completed" (nhập kho từ kho từ, thành công ngay)
  - EXPORT/TRANSFER/ADJUST → "Pending" (cần duyệt)

### Task 1.1: Tìm và xem đoạn code cần sửa

- [ ] **Step 1: Tìm vị trí code cần sửa**

Tìm dòng chứa `.status("Pending")` trong file InventoryServiceImpl.java

Run: `grep -n "status(\"Pending\")" RetailChainService/src/main/java/com/sba301/retailmanagement/service/impl/InventoryServiceImpl.java`
Expected: Tìm thấy dòng 587

### Task 1.2: Sửa logic status theo documentType

- [ ] **Step 2: Đọc code xung quanh dòng 587**

Đọc các dòng 570-600 để hiểu context

- [ ] **Step 3: Thay đổi logic status**

Sửa từ:
```java
.status("Pending") // Default status should be Pending for approval workflow
```

Thành:
```java
.status(doc.getDocumentType() == InventoryDocumentType.IMPORT ? "Completed" : "Pending")
```

Run: `edit` trong file InventoryServiceImpl.java

- [ ] **Step 4: Verify thay đổi**

Kiểm tra code đã được sửa đúng

- [ ] **Step 5: Commit**

```bash
git add RetailChainService/src/main/java/com/sba301/retailmanagement/service/impl/InventoryServiceImpl.java
git commit -m "fix: set IMPORT status to Completed by default"
```

---

## Task 2: Test API Để Xác Nhận

**Files:**
- Test: Sử dụng curl hoặc Postman gọi API

- [ ] **Step 1: Test API nhập kho (IMPORT)**

Run: 
```bash
# Tạo phiếu nhập kho mới
curl -X POST http://localhost:8080/api/inventory/import \
  -H "Content-Type: application/json" \
  -d '{
    "warehouseId": 1,
    "items": [{"variantId": 1, "quantity": 10}]
  }'
```

Expected: Response chứa `"status":"Completed"`

- [ ] **Step 2: Test API lấy danh sách phiếu nhập kho**

Run:
```bash
curl http://localhost:8080/api/inventory/documents/IMPORT
```

Expected: Danh sách các phiếu IMPORT có `"status":"Completed"`

- [ ] **Step 3: Test API xuất kho (EXPORT) - để xác nhận vẫn giữ Pending**

Run:
```bash
curl http://localhost:8080/api/inventory/documents/EXPORT
```

Expected: Các phiếu EXPORT có `"status":"Pending"`

- [ ] **Step 4: Commit test results**

```bash
git commit --allow-empty -m "test: verify IMPORT status is Completed"
```

---

## Task 3: Cập Nhật Frontend Nếu Cần

**Files (nếu cần):**
- Modify: `RetailChainUi/src/pages/StockIn/StockInList.jsx`

- [ ] **Step 1: Kiểm tra frontend hiển thị đúng**

Frontend hiện tại đã xử lý đúng status:
- `record.status === 'Completed'` → 'default' (success)
- `record.status === 'Pending'` → 'secondary' (warning)

Không cần sửa frontend vì nó chỉ hiển thị theo status từ API trả về

---

## Summary

| Task | Status | Notes |
|------|--------|-------|
| 1. Sửa logic status trong InventoryServiceImpl | Pending | IMPORT → Completed, others → Pending |
| 2. Test API | Pending | Xác nhận hoạt động đúng |
| 3. Frontend | N/A | Không cần sửa |

**Kết quả mong đợi:**
- Khi tạo phiếu nhập kho (IMPORT) → Status = "Completed" 
- Khi tạo phiếu xuất kho (EXPORT) → Status = "Pending"
- Khi tạo phiếu điều chuyển (TRANSFER) → Status = "Pending"
