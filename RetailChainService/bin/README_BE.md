# Retail Chain Management Service

# ARCHITECTURE & PROJECT STRUCTURE GUIDE
## 1
## 2. Tổng quan kiến trúc
Hệ thống tuân theo mô hình RESTful với phân tầng rõ ràng:
```
Client -> Controller -> Service -> Domain -> Repository -> Database
```

## 3. Cấu trúc thư mục tổng thể
Cấu trúc source code trong `src/main/java/com/sba301/retailmanagement/`:

```
.
|-- RetailChainServiceApplication.java  # Entry point
|
|-- config/              # Cau hinh he thong (Web, Security, JPA...)
|-- controller/          # API Layer: Nhan request, validate, tra response
|-- service/             # Business Logic Interface
|   `-- impl/            # Business Logic Implementation
|-- entity/              # Domain Entity: Mapping truc tiep voi Database
|-- repository/          # Data Access Layer: Giao tiep voi DB
|-- dto/                 # Data Transfer Objects
|   |-- request/         # Request Bodies (Input)
|   `-- response/        # Response Bodies (Output)
|-- mapper/              # Object Mapping (DTO <-> Entity)
|-- security/            # Security Config & Filter
|-- exception/           # Global Exception Handling
|-- utils/               # Utility classes (Date, String, Constants...)
`-- ...
```

---

## 4. Quy tắc & Hướng dẫn (Conventions)

### 4.1 Naming Convention
* **Method name**: Phải đọc lên là hiểu nghiệp vụ.
  * *Đúng*: `getProfile`, `createUser`, `approveOrder`
  * *Sai*: `doIt`, `process`, `getData`
* **Class**: PascalCase (e.g., `UserController`).
* **Variable**: camelCase.
* **Constants**: UPPER_SNAKE_CASE.

### 4.2 Layers (Phân tầng)

#### **domain/entity/** - Business Core
* Đối tượng nghiệp vụ, mapping DB table.
* **Tuyệt đối KHÔNG** dùng Entity làm API Response (phải map qua DTO Response).

#### **service/** - Business Logic
* Chứa toàn bộ logic nghiệp vụ.
* **Quy ước**: Không trả về Http Status hay Error Message string tại đây. Service chỉ xử lý data và throw Exception nếu lỗi.

#### **controller/** - API Endpoint
* Chỉ nhận request, gọi service và đóng gói `ResponseJson`.
* **Không xử lý nghiệp vụ** (cộng trừ nhân chia, logic phức tạp) tại đây.

#### **utils/** - Common Utilities
* Chứa `ApiCode`, `CommonUtils`...
* Các hàm dùng chung, stateless.

---

### 4.3 Định dạng Response API (Standard)
Mọi API **phải** trả về theo định dạng JSON thống nhất sử dụng class `ResponseJson`:

```json
{
  "code": "integer",    // Ma loi tu ApiCode (200, 400...)
  "desc": "string",     // Mo ta (Success/Error message)
  "data": "object"      // Du lieu tra ve
}
```

**Ví dụ:**
```java
// 1. Success only without desc
return ResponseJson.toJsonWithData(ApiCode.SUCCESSFUL);//desc default

// 2. Success with Data
return ResponseJson.toJsonWithData(ApiCode.SUCCESSFUL, "Get profile success", userResponse);

// 3. Success with No Data
return ResponseJson.toJson(ApiCode.SUCCESSFUL, "Update success");

// 4. Error Case (Return manually if needed, otherwise throw Exception)
return ResponseJson.toJson(ApiCode.UNSUCCESSFUL, "User not found");
```

### 4.4 Logging Protocol
Sử dụng `Slf4j` với format chuẩn để dễ dàng trace lỗi và filter log:
Format: `[MethodName]|param=value|...`

```java
// Vi du trong method getProfile
String prefix = "[getProfile]|id=" + id;
log.info("{}|START", prefix);
// ... logic
log.info("{}|END", prefix);
```

### 4.5 Exception Handling
* Không nuốt exception (empty catch block).
* Sử dụng `GlobalException` để bắn lỗi business.
* `GlobalException` Handler sẽ tự động bắt và trả về format `ResponseJson` chuẩn.

---

## 5. Template & Resources
`src/main/resources/`

* `application.properties`: Cấu hình chính của ứng dụng.
* **Lưu ý**: Các thông tin nhạy cảm (DB password) nên dùng biến môi trường khi deploy.
