# Hướng dẫn sử dụng GSD (Get Shit Done) với dự án Brownfield

## Tổng quan

GSD (Get Shit Done) là một hệ thống meta-prompting và context engineering được thiết kế cho các AI coding tools như Claude Code, OpenCode, Gemini CLI và Codex. Tài liệu này hướng dẫn chi tiết cách tích hợp và sử dụng GSD với dự án đã có sẵn (brownfield project) như RetailChain.

---

## Cài đặt GSD với OpenCode

### Cài đặt lần đầu

```bash
npx get-shit-done-cc --opencode --global
```

Lệnh này cài đặt GSD vào `~/.config/opencode/` để dùng được trên mọi project.

### Các tùy chọn cài đặt khác

```bash
# Cài local (chỉ project hiện tại)
npx get-shit-done-cc --opencode --local

# Cài cho tất cả runtimes
npx get-shit-done-cc --all --global
```

### Xác minh cài đặt

Sau khi cài xong, trong OpenCode gõ:

```
/gsd-help
```

Nếu hiển thị help menu thì đã cài đặt thành công.

---

## Giới thiệu các Commands

| Command | Mục đích |
|---------|----------|
| `/gsd:map-codebase` | Phân tích codebase hiện tại |
| `/gsd:new-project` | Tạo project mới |
| `/gsd:new-milestone [name]` | Tạo milestone mới cho dự án đã có |
| `/gsd:discuss-phase [N]` | Thảo luận chi tiết về phase N |
| `/gsd:plan-phase [N]` | Research + Plan + Verify cho phase N |
| `/gsd:execute-phase [N]` | Thực thi tất cả plans của phase N |
| `/gsd:verify-work [N]` | Manual User Acceptance Testing |
| `/gsd:complete-milestone` | Hoàn thành milestone, tag release |

---

## Workflow chi tiết

### Bước 1: Phân tích codebase hiện tại

**Command:**

```
/gsd:map-codebase
```

**Điều sẽ xảy ra:**

1. GSD spawn **4 parallel agents** để phân tích đồng thời:
   - **Agent 1 - Stack:** Công nghệ đang dùng (React 19, Vite, Tailwind, shadcn/ui, Spring Boot, MySQL, JPA)
   - **Agent 2 - Architecture:** Cấu trúc folder, pattern (entity → repository → service → controller)
   - **Agent 3 - Conventions:** Coding style, naming conventions
   - **Agent 4 - Concerns:** Các vấn đề hiện tại của dự án

2. Sau khi chạy xong, GSD tạo các files trong `.planning/codebase/`:
   - `TECH_STACK.md` - Stack công nghệ
   - `ARCHITECTURE.md` - Cấu trúc architecture
   - `CONVENTIONS.md` - Quy ước code
   - `CONCERNS.md` - Các vấn đề cần lưu ý

3. **Bạn cần làm:** Đọc qua và xác nhận nếu cần điều chỉnh

**Tại sao bước này quan trọng:**
- GSD sẽ hiểu codebase của bạn
- Các commands sau sẽ tự động load context này
- Không cần giải thích lại stack mỗi lần thêm feature

---

### Bước 2: Tạo milestone mới

**Command:**

```
/gsd:new-milestone "Module Inventory v1"
```

**Điều sẽ xảy ra:**

GSD sẽ hỏi bạn các câu hỏi để hiểu features cần làm:

```
GSD: Bạn muốn xây dựng tính năng gì trong milestone này?
Bạn: Thêm module quản lý tồn kho với các chức năng: tạo phiếu nhập kho, tạo phiếu xuất kho, báo cáo tồn kho

GSD: Các yêu cầu cụ thể là gì?
Bạn: - Nhập kho: chọn sản phẩm, số lượng, giá, kho nguồn
     - Xuất kho: chọn sản phẩm, số lượng, kho đích
     - Báo cáo: xem tồn kho theo kho, lọc theo ngày

GSD: Có ràng buộc đặc biệt nào không?
Bạn: - Dùng shadcn/ui cho frontend
     - Backend theo pattern có sẵn: entity → repository → service → controller
     - Tuân thủ quy ước code trong CONVENTIONS.md
...
```

**Sau khi hoàn thành:**
- GSD tạo roadmap với các phases
- Ví dụ:
  - Phase 1: API nhập kho (Stock In)
  - Phase 2: API xuất kho (Stock Out)
  - Phase 3: Báo cáo tồn kho
  - Phase 4: Frontend quản lý kho

**Bạn cần làm:** Review và approve roadmap

---

### Bước 3: Thảo luận chi tiết từng phase

**Command cho Phase 1:**

```
/gsd:discuss-phase 1
```

**Điều sẽ xảy ra:**

GSD hỏi chi tiết về implementation của phase đó:

```
GSD: Với API nhập kho, bạn muốn:
- Input gồm những gì? (sản phẩm, số lượng, giá, kho, ngày...)
- Validation nào cần thiết?
- Response trả về format gì?
- Có cần transaction không?
- Exception handling như thế nào?
- Có cần audit log không?
...
```

**Bạn cần làm:** Trả lời các câu hỏi một cách chi tiết

**Output:** Tạo file `1-CONTEXT.md` chứa context chi tiết về phase

---

### Bước 4: Lập kế hoạch thực hiện

**Command:**

```
/gsd:plan-phase 1
```

**Điều sẽ xảy ra:**

1. **Research:** Agent nghiên cứu cách implement phase này
2. **Plan:** Tạo atomic task plans, ví dụ:
   - Task 1: Tạo Entity InventoryTransaction + Repository
   - Task 2: Tạo DTOs (StockInRequest, StockInResponse)
   - Task 3: Tạo Service với business logic
   - Task 4: Tạo Controller endpoint
   - Task 5: Viết unit tests
3. **Verify:** Checker verify plans vs requirements

**Output:** Tạo các files:
- `1-RESEARCH.md` - Kết quả research
- `1-1-PLAN.md`, `1-2-PLAN.md`, ... - Các atomic task plans

**Bạn cần làm:** Review và approve plans

---

### Bước 5: Thực thi (Execute)

**Command:**

```
/gsd:execute-phase 1
```

**Điều sẽ xảy ra:**

1. **Wave-based execution:**
   - Wave 1: Các tasks không phụ thuộc nhau (chạy song song)
   - Wave 2: Các tasks phụ thuộc (chạy tuần tự)

2. **Fresh context:** Mỗi task được thực thi trong fresh 200k tokens context

3. **Atomic commits:** Sau mỗi task, tự động commit với message mô tả

4. **Auto verify:** Tự động verify khi complete

**Bạn cần làm:** Đi uống coffee, quay lại xem kết quả 😄

**Output:** Tạo file `1-SUMMARY.md` tổng kết những gì đã xảy ra

---

### Bước 6: Verify (Test thủ công)

**Command:**

```
/gsd:verify-work 1
```

**Điều sẽ xảy ra:**

GSD hướng dẫn bạn test từng phần:

```
GSD: Test 1: Tạo phiếu nhập kho
- Vào Postman/curl, gọi API POST /inventory/stock-in
- Với payload: { "productId": 1, "quantity": 10, "warehouseId": 1, "unitPrice": 50000 }
- Kết quả mong đợi: 200 OK, trả về phiếu nhập với đầy đủ thông tin
- Bạn có thể test được không? Yes/No?

GSD: Test 2: Validation
- Gọi API với quantity = 0
- Kết quả mong đợi: 400 Bad Request với message lỗi
...
```

**Nếu có lỗi:**
- GSD spawn **debugger agents** tự động
- Chẩn đoán nguyên nhân gốc
- Tạo fix plans sẵn sàng để execute ngay

**Output:** Tạo file `1-UAT.md` chứa kết quả test

---

### Bước 7: Hoàn thành milestone

**Command:**

```
/gsd:complete-milestone
```

**Điều sẽ xảy ra:**

- Archive milestone hiện tại
- Tag release (ví dụ: v1.0.0)
- Sẵn sàng cho milestone tiếp theo với `/gsd:new-milestone`

---

## Sơ đồ workflow hoàn chỉnh

```
┌────────────────────────────────────────────────────────────┐
│  BẮT ĐẦU                                                 │
│  /gsd:map-codebase                                        │
│       ↓                                                   │
│  GSD phân tích: Stack, Architecture, Conventions          │
│  Output: .planning/codebase/                              │
└────────────────────────────────────────────────────────────┘
                          ↓
┌────────────────────────────────────────────────────────────┐
│  MILESTONE 1                                              │
│  /gsd:new-milestone "Tên milestone"                       │
│       ↓                                                   │
│  GSD hỏi → Requirements → Roadmap (approve)              │
└────────────────────────────────────────────────────────────┘
                          ↓
┌────────────────────────────────────────────────────────────┐
│  PHASE 1: [Tên phase]                                      │
│  /gsd:discuss-phase 1      → Chi tiết implementation     │
│       ↓                                                   │
│  /gsd:plan-phase 1         → Research + Plans (approve)  │
│       ↓                                                   │
│  /gsd:execute-phase 1     → Thực thi + Auto commit      │
│       ↓                                                   │
│  /gsd:verify-work 1        → Test thủ công               │
└────────────────────────────────────────────────────────────┘
                          ↓
┌────────────────────────────────────────────────────────────┐
│  PHASE 2: [Tên phase] (nếu có)                           │
│  /gsd:discuss-phase 2                                     │
│  ...                                                      │
└────────────────────────────────────────────────────────────┘
                          ↓
┌────────────────────────────────────────────────────────────┐
│  HOÀN THÀNH                                               │
│  /gsd:complete-milestone                                  │
│       ↓                                                   │
│  Tag release → Milestone tiếp theo                        │
└────────────────────────────────────────────────────────────┘
```

---

## Giới thiệu hệ thống Multi-Agent

GSD sử dụng mô hình **"thin orchestrator"** - orchestrator chính spawn các agents chuyên biệt để xử lý từng giai đoạn.

### Các Agents và vai trò

| Giai đoạn | Agents làm gì |
|-----------|---------------|
| **Research** | 4 researchers chạy song song: stack, features, architecture, pitfalls |
| **Planning** | Planner tạo plans, Checker verify, lặp đến khi pass |
| **Execution** | Executors implement song song, mỗi cái có fresh 200k context |
| **Verification** | Verifier check code vs goals, debuggers chẩn đoán lỗi |

### Các files được tạo ra

| File | Giai đoạn | Nội dung |
|------|-----------|----------|
| `research/` | Research | Ecosystem knowledge từ 4 researcher agents |
| `{phase_num}-{N}-PLAN.md` | Planning | Atomic task plans |
| `{phase_num}-SUMMARY.md` | Execution | Tổng kết những gì đã xảy ra |
| `{phase_num}-UAT.md` | Verification | Kết quả user acceptance testing |

---

## Quick Reference

```bash
# Bắt đầu với dự án có sẵn
/gsd:map-codebase

# Tạo milestone mới
/gsd:new-milestone "Tên milestone"

/# Thảo luận phase
/gsd:discuss-phase 1

# Lập kế hoạch
/gsd:plan-phase 1

# Thực thi
/gsd:execute-phase 1

# Test
/gsd:verify-work 1

# Hoàn thành
/gsd:complete-milestone
```

---

## Lưu ý quan trọng

1. **Fresh context:** Mỗi executor chạy trong fresh 200k token context → tránh "context rot"
2. **Parallelism:** Các tasks không phụ thuộc chạy song song
3. **Atomic commits:** Mỗi task được commit riêng → dễ revert khi cần
4. **Main context 30-40%:** Orchestrator chính giữ context thấp, heavy work xảy ra trong subagents

---

## Bắt đầu ngay

Vào thư mục dự án:

```bash
cd RetailChain
opencode .
```

Gõ command đầu tiên:

```
/gsd:map-codebase
```

GSD sẽ phân tích codebase và sẵn sàng cho các bước tiếp theo.
