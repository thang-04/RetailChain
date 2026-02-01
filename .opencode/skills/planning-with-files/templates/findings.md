# Phát hiện & Quyết định (Findings & Decisions)
<!--
  CÁI GÌ: Cơ sở kiến thức của bạn cho tác vụ. Lưu trữ mọi thứ bạn khám phá và quyết định.
  TẠI SAO: Cửa sổ ngữ cảnh bị giới hạn. Tệp này là "bộ nhớ ngoài" của bạn - bền vững và không giới hạn.
  KHI NÀO: Cập nhật sau BẤT KỲ khám phá nào, đặc biệt là sau 2 thao tác xem/duyệt web/tìm kiếm (Quy tắc 2-Hành động).
-->

## Yêu cầu (Requirements)
<!--
  CÁI GÌ: Những gì người dùng yêu cầu, được chia nhỏ thành các yêu cầu cụ thể.
  TẠI SAO: Giữ cho các yêu cầu luôn hiển thị để bạn không quên những gì bạn đang xây dựng.
  KHI NÀO: Điền vào phần này trong Giai đoạn 1 (Yêu cầu & Khám phá).
  VÍ DỤ:
    - Giao diện dòng lệnh (CLI)
    - Thêm tác vụ
    - Liệt kê tất cả các tác vụ
    - Xóa tác vụ
    - Triển khai bằng Python
-->
<!-- Được ghi lại từ yêu cầu người dùng -->
-

## Kết quả nghiên cứu (Research Findings)
<!--
  CÁI GÌ: Các khám phá chính từ tìm kiếm web, đọc tài liệu hoặc thăm dò.
  TẠI SAO: Nội dung đa phương thức (hình ảnh, kết quả trình duyệt) không tồn tại lâu. Viết nó xuống ngay lập tức.
  KHI NÀO: Sau MỖI 2 thao tác xem/duyệt web/tìm kiếm, cập nhật phần này (Quy tắc 2-Hành động).
  VÍ DỤ:
    - Mô đun argparse của Python hỗ trợ các lệnh con (subcommands) cho thiết kế CLI sạch sẽ
    - Mô đun JSON xử lý lưu trữ tệp dễ dàng
    - Mẫu tiêu chuẩn: python script.py <command> [args]
-->
<!-- Các khám phá chính trong quá trình thăm dò -->
-

## Quyết định kỹ thuật (Technical Decisions)
<!--
  CÁI GÌ: Các lựa chọn kiến trúc và triển khai bạn đã thực hiện, cùng với lý do.
  TẠI SAO: Bạn sẽ quên lý do tại sao bạn chọn một công nghệ hoặc cách tiếp cận. Bảng này bảo tồn kiến thức đó.
  KHI NÀO: Cập nhật bất cứ khi nào bạn đưa ra một lựa chọn kỹ thuật quan trọng.
  VÍ DỤ:
    | Sử dụng JSON để lưu trữ | Đơn giản, dễ đọc, hỗ trợ sẵn trong Python |
    | argparse với lệnh con | CLI sạch sẽ: python todo.py add "task" |
-->
<!-- Các quyết định được đưa ra cùng lý do -->
| Quyết định | Lý do |
|----------|-----------|
|          |           |

## Các vấn đề đã gặp (Issues Encountered)
<!--
  CÁI GÌ: Các vấn đề bạn gặp phải và cách bạn giải quyết chúng.
  TẠI SAO: Tương tự như lỗi trong task_plan.md, nhưng tập trung vào các vấn đề rộng hơn (không chỉ lỗi mã).
  KHI NÀO: Ghi lại khi bạn gặp trở ngại hoặc thách thức bất ngờ.
  VÍ DỤ:
    | Tệp trống gây ra JSONDecodeError | Đã thêm kiểm tra tệp trống rõ ràng trước khi json.load() |
-->
<!-- Lỗi và cách chúng được giải quyết -->
| Vấn đề | Cách giải quyết |
|-------|------------|
|       |            |

## Tài nguyên (Resources)
<!--
  CÁI GÌ: URL, đường dẫn tệp, tài liệu tham khảo API, liên kết tài liệu mà bạn thấy hữu ích.
  TẠI SAO: Tham chiếu dễ dàng cho sau này. Đừng để mất các liên kết quan trọng trong ngữ cảnh.
  KHI NÀO: Thêm khi bạn khám phá ra các tài nguyên hữu ích.
  VÍ DỤ:
    - Tài liệu Python argparse: https://docs.python.org/3/library/argparse.html
    - Cấu trúc dự án: src/main.py, src/utils.py
-->
<!-- URL, đường dẫn tệp, tài liệu tham khảo API -->
-

## Các phát hiện hình ảnh/trình duyệt (Visual/Browser Findings)
<!--
  CÁI GÌ: Thông tin bạn học được từ việc xem hình ảnh, PDF hoặc kết quả trình duyệt.
  TẠI SAO: RẤT QUAN TRỌNG - Nội dung hình ảnh/đa phương thức không tồn tại trong ngữ cảnh. Phải được ghi lại dưới dạng văn bản.
  KHI NÀO: NGAY LẬP TỨC sau khi xem hình ảnh hoặc kết quả trình duyệt. Đừng chờ đợi!
  VÍ DỤ:
    - Ảnh chụp màn hình cho thấy biểu mẫu đăng nhập có các trường email và mật khẩu
    - Trình duyệt hiển thị API trả về JSON với các khóa "status" và "data"
-->
<!-- QUAN TRỌNG: Cập nhật sau mỗi 2 thao tác xem/duyệt web -->
<!-- Nội dung đa phương thức phải được ghi lại dưới dạng văn bản ngay lập tức -->
-

---
<!--
  LỜI NHẮC: Quy tắc 2-Hành động
  Sau mỗi 2 thao tác xem/duyệt web/tìm kiếm, bạn PHẢI cập nhật tệp này.
  Điều này ngăn thông tin hình ảnh bị mất khi ngữ cảnh được thiết lập lại.
-->
*Cập nhật tệp này sau mỗi 2 thao tác xem/duyệt web/tìm kiếm*
*Điều này ngăn thông tin hình ảnh bị mất*