---
name: api-tester
description: Kiểm thử các API endpoint HTTP, xác thực phản hồi JSON và gỡ lỗi kết nối bằng curl hoặc script.
license: MIT
compatibility: opencode
metadata:
  category: testing
  tools: curl, jq, node
---

## Tôi làm những gì (What I do)
- Xây dựng và thực thi các yêu cầu HTTP (GET, POST, PUT, DELETE, v.v.) sử dụng `curl`.
- Kiểm tra mã trạng thái (status codes) để đảm bảo thành công (200 OK) hoặc gỡ lỗi (4xx/5xx).
- Phân tích và định dạng phản hồi JSON cho dễ đọc.
- Viết các script ngắn (Python/Node.js) cho các kịch bản API phức tạp (ví dụ: quy trình xác thực/login).

## Khi nào sử dụng tôi (When to use me)
- Sử dụng kỹ năng này khi người dùng yêu cầu "kiểm tra xem API có hoạt động không" hoặc "test API".
- Khi cần gỡ lỗi một endpoint cụ thể đang trả về lỗi.
- Khi cần xác minh cấu trúc dữ liệu trả về (payload structure) của phản hồi.

## Hướng dẫn thực hiện (Guidelines)
1. **An toàn là trên hết**: Không bao giờ in ra các API Key thật hoặc mật khẩu trong khung chat. Hãy dùng các ký tự thay thế như `Bearer <HIDDEN>` khi hiển thị lệnh, trừ khi người dùng yêu cầu rõ ràng.
2. **Công cụ**: Ưu tiên sử dụng `curl` với cờ `-v` (verbose) để gỡ lỗi các vấn đề về kết nối.
3. **Định dạng**: Luôn cố gắng chuyền (pipe) kết quả JSON qua `jq` hoặc định dạng lại cho đẹp mắt để người dùng dễ đọc.
4. **Xác minh lỗi**: Nếu một yêu cầu thất bại, hãy kiểm tra theo thứ tự:
   - Kết nối mạng.
   - Các Header (Content-Type, Authorization).
   - Định dạng dữ liệu gửi đi (JSON validity).

## Ví dụ lệnh
```bash
curl -v -X POST https://api.example.com/v1/test \
  -H "Content-Type: application/json" \
  -d '{"key": "giá_trị"}'
