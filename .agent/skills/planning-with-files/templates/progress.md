# Nhật ký tiến độ (Progress Log)
<!--
  CÁI GÌ: Nhật ký phiên làm việc của bạn - bản ghi theo trình tự thời gian về những gì bạn đã làm, khi nào và chuyện gì đã xảy ra.
  TẠI SAO: Trả lời câu hỏi "Tôi đã làm gì?" trong Bài kiểm tra khởi động lại 5 câu hỏi. Giúp bạn tiếp tục sau khi nghỉ ngơi.
  KHI NÀO: Cập nhật sau khi hoàn thành mỗi giai đoạn hoặc gặp lỗi. Chi tiết hơn task_plan.md.
-->

## Phiên làm việc: [NGÀY]
<!--
  CÁI GÌ: Ngày của phiên làm việc này.
  TẠI SAO: Giúp theo dõi khi nào công việc diễn ra, hữu ích để tiếp tục sau khoảng thời gian gián đoạn.
  VÍ DỤ: 2026-01-15
-->

### Giai đoạn 1: [Tiêu đề]
<!--
  CÁI GÌ: Nhật ký chi tiết về các hành động đã thực hiện trong giai đoạn này.
  TẠI SAO: Cung cấp ngữ cảnh cho những gì đã được thực hiện, giúp dễ dàng tiếp tục hoặc gỡ lỗi hơn.
  KHI NÀO: Cập nhật khi bạn làm việc qua giai đoạn, hoặc ít nhất là khi bạn hoàn thành nó.
-->
- **Trạng thái:** in_progress
- **Đã bắt đầu:** [dấu thời gian]
<!--
  TRẠNG THÁI: Giống như task_plan.md (pending, in_progress, complete)
  DẤU THỜI GIAN: Khi bạn bắt đầu giai đoạn này (ví dụ: "2026-01-15 10:00")
-->
- Các hành động đã thực hiện (Actions taken):
  <!--
    CÁI GÌ: Danh sách các hành động cụ thể bạn đã thực hiện.
    VÍ DỤ:
      - Đã tạo todo.py với cấu trúc cơ bản
      - Đã triển khai chức năng thêm
      - Đã sửa lỗi FileNotFoundError
  -->
  -
- Các tệp đã tạo/sửa đổi (Files created/modified):
  <!--
    CÁI GÌ: Những tệp nào bạn đã tạo hoặc thay đổi.
    TẠI SAO: Tham chiếu nhanh cho những gì đã được chạm vào. Giúp gỡ lỗi và xem xét.
    VÍ DỤ:
      - todo.py (đã tạo)
      - todos.json (được tạo bởi ứng dụng)
      - task_plan.md (đã cập nhật)
  -->
  -

### Giai đoạn 2: [Tiêu đề]
<!--
  CÁI GÌ: Cấu trúc tương tự như Giai đoạn 1, cho giai đoạn tiếp theo.
  TẠI SAO: Giữ một mục nhật ký riêng cho mỗi giai đoạn để theo dõi tiến độ rõ ràng.
-->
- **Trạng thái:** pending
- Các hành động đã thực hiện:
  -
- Các tệp đã tạo/sửa đổi:
  -

## Kết quả kiểm thử (Test Results)
<!--
  CÁI GÌ: Bảng các kiểm thử bạn đã chạy, những gì bạn mong đợi, những gì thực sự đã xảy ra.
  TẠI SAO: Ghi lại việc xác minh chức năng. Giúp bắt lỗi hồi quy (regressions).
  KHI NÀO: Cập nhật khi bạn kiểm thử các tính năng, đặc biệt là trong Giai đoạn 4 (Kiểm thử & Xác minh).
  VÍ DỤ:
    | Thêm tác vụ | python todo.py add "Mua sữa" | Tác vụ đã thêm | Tác vụ đã thêm thành công | V |
-->
| Kiểm thử | Đầu vào | Mong đợi | Thực tế | Trạng thái |
|------|-------|----------|--------|--------|
|      |       |          |        |        |

## Nhật ký lỗi (Error Log)
<!--
  CÁI GÌ: Nhật ký chi tiết về mọi lỗi gặp phải, với dấu thời gian và nỗ lực giải quyết.
  TẠI SAO: Chi tiết hơn bảng lỗi của task_plan.md. Giúp bạn học hỏi từ những sai lầm.
  KHI NÀO: Thêm ngay khi xảy ra lỗi, ngay cả khi bạn sửa nó nhanh chóng.
  VÍ DỤ:
    | 2026-01-15 10:35 | FileNotFoundError | 1 | Đã thêm kiểm tra sự tồn tại của tệp |
-->
<!-- Giữ lại TẤT CẢ lỗi - chúng giúp tránh lặp lại -->
| Dấu thời gian | Lỗi | Lần thử | Cách giải quyết |
|-----------|-------|---------|------------|
|           |       | 1       |            |

## Kiểm tra khởi động lại 5 câu hỏi (5-Question Reboot Check)
<!--
  CÁI GÌ: Năm câu hỏi xác minh ngữ cảnh của bạn là vững chắc. Nếu bạn có thể trả lời những câu hỏi này, bạn đang đi đúng hướng.
  TẠI SAO: Đây là "bài kiểm tra khởi động lại" - nếu bạn có thể trả lời tất cả 5, bạn có thể tiếp tục công việc hiệu quả.
  KHI NÀO: Cập nhật định kỳ, đặc biệt là khi tiếp tục sau một khoảng nghỉ hoặc thiết lập lại ngữ cảnh.

  5 CÂU HỎI:
  1. Tôi đang ở đâu? -> Giai đoạn hiện tại trong task_plan.md
  2. Tôi đang đi đâu? -> Các giai đoạn còn lại
  3. Mục tiêu là gì? -> Tuyên bố mục tiêu trong task_plan.md
  4. Tôi đã học được gì? -> Xem findings.md
  5. Tôi đã làm gì? -> Xem progress.md (tệp này)
-->
<!-- Nếu bạn có thể trả lời những câu hỏi này, ngữ cảnh là vững chắc -->
| Câu hỏi | Câu trả lời |
|----------|--------|
| Tôi đang ở đâu? | Giai đoạn X |
| Tôi đang đi đâu? | Các giai đoạn còn lại |
| Mục tiêu là gì? | [tuyên bố mục tiêu] |
| Tôi đã học được gì? | Xem findings.md |
| Tôi đã làm gì? | Xem ở trên |

---
<!--
  LỜI NHẮC:
  - Cập nhật sau khi hoàn thành mỗi giai đoạn hoặc gặp lỗi
  - Hãy chi tiết - đây là nhật ký "chuyện gì đã xảy ra" của bạn
  - Bao gồm dấu thời gian cho lỗi để theo dõi khi nào vấn đề xảy ra
-->
*Cập nhật sau khi hoàn thành mỗi giai đoạn hoặc gặp lỗi*