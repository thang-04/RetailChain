# RetailChainManagement (RCM)

Chào mừng bạn đến với dự án **Retail Chain Management**. Đây là hệ thống quản lý chuỗi bán lẻ được tổ chức theo cấu trúc Monorepo.

## 📂 Cấu trúc Dự án

Dự án bao gồm 2 thành phần chính:

| Thư mục | Thành phần | Công nghệ chính | Mô tả |
| :--- | :--- | :--- | :--- |
| **[`RetailChainService`](./RetailChainService)** | Backend | Java Spring Boot, MySQL | Cung cấp RESTful API, xử lý nghiệp vụ, bảo mật và quản lý dữ liệu. |
| **[`RetailChainUi`](./RetailChainUi)** | Frontend | React (Vite), Tailwind CSS | Giao diện người dùng web, tương tác với API backend. |

## 🚀 Bắt đầu nhanh

Để chạy toàn bộ hệ thống, bạn cần cài đặt và chạy riêng biệt cả Backend và Frontend.

### 1. Backend Setup
**Yêu cầu:** JDK 17+, Maven.

1.  Di chuyển vào thư mục backend:
    ```bash
    cd RetailChainService
    ```
2.  Cấu hình Database trong `src/main/resources/application.properties`.
3.  Chạy ứng dụng:
    ```bash
    ./mvnw spring-boot:run
    ```
    *(Xem chi tiết hướng dẫn tại [RetailChainService/README.md](./RetailChainService/README_BE.md))*

### 2. Frontend Setup
**Yêu cầu:** Node.js 18+ (khuyên dùng LTS).

1.  Di chuyển vào thư mục frontend:
    ```bash
    cd RetailChainUi
    ```
2.  Cài đặt dependencies:
    ```bash
    npm install
    ```
3.  Chạy server development:
    ```bash
    npm run dev
    ```
    *(Xem chi tiết hướng dẫn tại [RetailChainUi/README.md](./RetailChainUi/README_FE.md))*

## 🤝 Quy trình làm việc (Workflow)

Khi đóng góp vào dự án, vui lòng tuân thủ các quy tắc sau:

1.  **Backend**: Xem [Coding Conventions](./RetailChainService/README_BE.md#4-quy-tắc--hướng-dẫn-conventions) để biết quy tắc đặt tên và cấu trúc code.
2.  **Frontend**: Xem [Coding Conventions](./RetailChainUi/README_FE.md#📏-quy-tắc-code-coding-conventions) để biết về React và Tailwind CSS standards.
3.  **Git Flow**:
    *   Không commit trực tiếp vào nhánh chính (`main`/`master`).
    *   Tạo nhánh feature từ nhánh phát triển (`develop`).
    *   Tạo Pull Request (PR) để review code trước khi merge.
