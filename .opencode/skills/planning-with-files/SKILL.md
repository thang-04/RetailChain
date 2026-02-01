---
name: planning-with-files
version: "2.1.2"
description: Triển khai lập kế hoạch dựa trên tệp tin theo phong cách Manus cho các tác vụ phức tạp. Tạo các tệp task_plan.md, findings.md và progress.md. Sử dụng khi bắt đầu các tác vụ phức tạp gồm nhiều bước, dự án nghiên cứu hoặc bất kỳ tác vụ nào yêu cầu >5 lần gọi công cụ.
user-invocable: true
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Glob
  - Grep
  - WebFetch
  - WebSearch
hooks:
  SessionStart:
    - hooks:
        - type: command
          command: "echo '[planning-with-files] Sẵn sàng. Tự động kích hoạt cho các tác vụ phức tạp, hoặc gọi thủ công bằng /planning-with-files'"
  PreToolUse:
    - matcher: "Write|Edit|Bash"
      hooks:
        - type: command
          command: "cat task_plan.md 2>/dev/null | head -30 || true"
  PostToolUse:
    - matcher: "Write|Edit"
      hooks:
        - type: command
          command: "echo '[planning-with-files] Tệp đã được cập nhật. Nếu hoàn thành một giai đoạn, hãy cập nhật trạng thái trong task_plan.md.'"
  Stop:
    - hooks:
        - type: command
          command: "${CLAUDE_PLUGIN_ROOT}/scripts/check-complete.sh"
---

# Lập Kế Hoạch Với Tệp Tin

Làm việc giống như Manus: Sử dụng các tệp markdown bền vững làm "bộ nhớ làm việc trên ổ đĩa" của bạn.

## Quan trọng: Nơi lưu trữ tệp tin

Khi sử dụng kỹ năng này:

- **Tệp mẫu (Templates)** được lưu trong thư mục kỹ năng tại `${CLAUDE_PLUGIN_ROOT}/templates/`
- **Các tệp kế hoạch của bạn** (`task_plan.md`, `findings.md`, `progress.md`) phải được tạo trong **thư mục dự án của bạn** — thư mục nơi bạn đang làm việc.

| Vị trí | Những gì được lưu ở đây |
|----------|-----------------|
| Thư mục kỹ năng (`${CLAUDE_PLUGIN_ROOT}/`) | Tệp mẫu, tập lệnh (scripts), tài liệu tham khảo |
| Thư mục dự án của bạn | `task_plan.md`, `findings.md`, `progress.md` |

Điều này đảm bảo các tệp kế hoạch của bạn nằm cùng với mã nguồn (code), chứ không bị chôn vùi trong thư mục cài đặt của kỹ năng.

## Bắt đầu nhanh (Quick Start)

Trước BẤT KỲ tác vụ phức tạp nào:

1. **Tạo `task_plan.md`** trong dự án của bạn — Sử dụng [templates/task_plan.md](templates/task_plan.md) làm tham khảo.
2. **Tạo `findings.md`** trong dự án của bạn — Sử dụng [templates/findings.md](templates/findings.md) làm tham khảo.
3. **Tạo `progress.md`** trong dự án của bạn — Sử dụng [templates/progress.md](templates/progress.md) làm tham khảo.
4. **Đọc lại kế hoạch trước khi quyết định** — Làm mới lại các mục tiêu trong cửa sổ chú ý (attention window) của bạn.
5. **Cập nhật sau mỗi giai đoạn** — Đánh dấu hoàn thành, ghi lại lỗi.

> **Lưu ý:** Cả ba tệp lập kế hoạch phải được tạo trong thư mục làm việc hiện tại (gốc dự án của bạn), không phải trong thư mục cài đặt của kỹ năng.

## Mô hình cốt lõi (The Core Pattern)

```
Context Window (Cửa sổ ngữ cảnh) = RAM (dễ bay hơi, giới hạn)
Filesystem (Hệ thống tệp)      = Disk (bền vững, không giới hạn)

→ Bất cứ điều gì quan trọng đều được ghi vào ổ đĩa.
```

## Mục đích của các tệp (File Purposes)

| Tệp | Mục đích | Khi nào cập nhật |
|------|---------|----------------|
| `task_plan.md` | Các giai đoạn, tiến độ, quyết định | Sau mỗi giai đoạn |
| `findings.md` | Nghiên cứu, khám phá mới | Sau BẤT KỲ khám phá nào |
| `progress.md` | Nhật ký phiên làm việc, kết quả kiểm thử | Trong suốt phiên làm việc |

## Các quy tắc quan trọng (Critical Rules)

### 1. Tạo kế hoạch trước tiên
Không bao giờ bắt đầu một tác vụ phức tạp mà không có `task_plan.md`. Đây là điều bắt buộc.

### 2. Quy tắc 2-Hành động
> "Sau mỗi 2 thao tác xem/duyệt web/tìm kiếm, NGAY LẬP TỨC lưu các phát hiện chính vào tệp văn bản."

Điều này ngăn thông tin hình ảnh/đa phương thức bị mất đi.

### 3. Đọc trước khi quyết định
Trước các quyết định lớn, hãy đọc tệp kế hoạch. Điều này giữ cho mục tiêu luôn hiện hữu trong sự chú ý của bạn.

### 4. Cập nhật sau khi hành động
Sau khi hoàn thành bất kỳ giai đoạn nào:
- Đánh dấu trạng thái giai đoạn: `in_progress` (đang thực hiện) → `complete` (hoàn thành).
- Ghi lại mọi lỗi gặp phải.
- Ghi chú các tệp đã tạo/sửa đổi.

### 5. Ghi lại TẤT CẢ lỗi
Mọi lỗi đều phải đi vào tệp kế hoạch. Điều này xây dựng kiến thức và ngăn ngừa sự lặp lại.

```markdown
## Các lỗi đã gặp (Errors Encountered)
| Lỗi | Lần thử | Cách giải quyết |
|-------|---------|------------|
| FileNotFoundError | 1 | Đã tạo cấu hình mặc định |
| API timeout | 2 | Đã thêm logic thử lại (retry logic) |
```

### 6. Không bao giờ lặp lại thất bại
```
nếu action_failed (hành động thất bại):
    next_action (hành động tiếp theo) != same_action (hành động cũ)
```
Theo dõi những gì bạn đã thử. Thay đổi cách tiếp cận.

## Giao thức xử lý lỗi 3 lần (The 3-Strike Error Protocol)

```
LẦN THỬ 1: Chẩn đoán & Sửa chữa
  → Đọc lỗi cẩn thận
  → Xác định nguyên nhân gốc rễ
  → Áp dụng bản sửa lỗi có mục tiêu

LẦN THỬ 2: Cách tiếp cận thay thế
  → Vẫn lỗi cũ? Thử phương pháp khác
  → Công cụ khác? Thư viện khác?
  → KHÔNG BAO GIỜ lặp lại chính xác hành động thất bại cũ

LẦN THỬ 3: Suy nghĩ lại rộng hơn
  → Đặt câu hỏi về các giả định
  → Tìm kiếm giải pháp
  → Cân nhắc cập nhật kế hoạch

SAU 3 LẦN THẤT BẠI: Leo thang lên Người dùng
  → Giải thích những gì bạn đã thử
  → Chia sẻ lỗi cụ thể
  → Hỏi xin hướng dẫn
```

## Ma trận quyết định Đọc vs Ghi (Read vs Write Decision Matrix)

| Tình huống | Hành động | Lý do |
|-----------|--------|--------|
| Vừa mới viết tệp xong | KHÔNG đọc | Nội dung vẫn còn trong ngữ cảnh |
| Đã xem ảnh/PDF | Viết vào `findings` NGAY | Đa phương thức → văn bản trước khi bị mất |
| Trình duyệt trả về dữ liệu | Viết vào tệp | Ảnh chụp màn hình không tồn tại lâu |
| Bắt đầu giai đoạn mới | Đọc kế hoạch/phát hiện | Định hướng lại nếu ngữ cảnh đã cũ |
| Lỗi xảy ra | Đọc tệp liên quan | Cần trạng thái hiện tại để sửa |
| Tiếp tục sau một khoảng nghỉ | Đọc tất cả tệp kế hoạch | Khôi phục trạng thái |

## Bài kiểm tra khởi động lại với 5 câu hỏi (The 5-Question Reboot Test)

Nếu bạn có thể trả lời những câu hỏi này, việc quản lý ngữ cảnh của bạn rất vững chắc:

| Câu hỏi | Nguồn câu trả lời |
|----------|---------------|
| Tôi đang ở đâu? | Giai đoạn hiện tại trong `task_plan.md` |
| Tôi đang đi đâu? | Các giai đoạn còn lại |
| Mục tiêu là gì? | Tuyên bố mục tiêu trong kế hoạch |
| Tôi đã học được gì? | `findings.md` |
| Tôi đã làm gì? | `progress.md` |

## Khi nào sử dụng mô hình này

**Sử dụng cho:**
- Các tác vụ nhiều bước (3 bước trở lên)
- Các tác vụ nghiên cứu
- Xây dựng/tạo dự án mới
- Các tác vụ kéo dài qua nhiều lần gọi công cụ
- Bất cứ thứ gì cần sự tổ chức

**Bỏ qua cho:**
- Các câu hỏi đơn giản
- Chỉnh sửa tệp đơn lẻ
- Tra cứu nhanh

## Các mẫu (Templates)

Sao chép các mẫu này để bắt đầu:

- [templates/task_plan.md](templates/task_plan.md) — Theo dõi giai đoạn
- [templates/findings.md](templates/findings.md) — Lưu trữ nghiên cứu
- [templates/progress.md](templates/progress.md) — Nhật ký phiên làm việc

## Scripts

Các tập lệnh hỗ trợ tự động hóa:

- `scripts/init-session.sh` — Khởi tạo tất cả các tệp lập kế hoạch
- `scripts/check-complete.sh` — Xác minh tất cả các giai đoạn đã hoàn thành

## Chủ đề nâng cao

- **Nguyên tắc Manus:** Xem [reference.md](reference.md)
- **Ví dụ thực tế:** Xem [examples.md](examples.md)

## Các mẫu chống chỉ định (Anti-Patterns)

| Đừng | Hãy làm thay thế |
|-------|------------|
| Sử dụng công cụ Todo để lưu trữ | Tạo tệp `task_plan.md` |
| Nêu mục tiêu một lần rồi quên | Đọc lại kế hoạch trước các quyết định |
| Giấu lỗi và thử lại trong im lặng | Ghi lỗi vào tệp kế hoạch |
| Nhồi nhét mọi thứ vào ngữ cảnh | Lưu trữ nội dung lớn trong tệp tin |
| Bắt đầu thực thi ngay lập tức | Tạo tệp kế hoạch TRƯỚC TIÊN |
| Lặp lại các hành động thất bại | Theo dõi các lần thử, thay đổi cách tiếp cận |
| Tạo tệp trong thư mục kỹ năng | Tạo tệp trong dự án của bạn |