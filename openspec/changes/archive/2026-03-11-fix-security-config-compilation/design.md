## Context

Spring Boot application không thể khởi động do lỗi compilation trong SecurityConfig. Root cause: Lombok annotation processor không hoạt động đúng trong IDE/build, khiến các annotation `@RequiredArgsConstructor`, `@Slf4j`, `@Getter`, `@Setter` không được xử lý. Điều này dẫn đến các trường final không được khởi tạo và log field không tồn tại.

**Các file bị ảnh hưởng:**
- SecurityConfig.java - 3 trường final chưa được khởi tạo
- JwtAuthenticationFilter.java - tokenProvider và log chưa được khởi tạo
- JwtAccessDeniedHandler.java - log chưa được khởi tạo
- JwtAuthenticationEntryPoint.java - có thể có vấn đề tương tự
- UserController.java - userService chưa được khởi tạo
- PermissionServiceImpl.java - permissionRepository chưa được khởi tạo
- CustomUserDetails.java - có thể có vấn đề với constructor

## Goals / Non-Goals

**Goals:**
- Sửa lỗi SecurityConfig để application khởi động được
- Thay thế tất cả `@RequiredArgsConstructor` bằng explicit constructors
- Thay thế `@Slf4j` bằng manual logger initialization
- Build thành công không có compilation errors

**Non-Goals:**
- Không thay đổi logic nghiệp vụ
- Không refactor toàn bộ codebase
- Không thay đổi cấu trúc database hay API

## Decisions

1. **Thay @RequiredArgsConstructor bằng explicit constructor**
   - Rationale: Tránh phụ thuộc vào Lombok annotation processor
   - Alternative: Cấu hình lại Lombok trong pom.xml/IDE (tốn thời gian hơn và có thể không khắc phục được vấn đề trên máy khác)

2. **Thay @Slf4j bằng LoggerFactory.getLogger()**
   - Rationale: Tương tự, tránh dependency vào Lombok
   - Alternative: Chỉ fix những file cần thiết thay vì toàn bộ

3. **Clean build sau khi sửa**
   - Rationale: Xóa stale compiled classes trong target folder
   - Chạy `mvn clean compile` để đảm bảo không còn lỗi

## Risks / Trade-offs

- **Risk**: Nhiều file cần sửa hơn dự kiến → Mitigation: Chỉ sửa những file gây ra lỗi khởi động
- **Risk**: Có thể có thêm các vấn đề Lombok khác sau khi sửa → Mitigation: Build và test sau mỗi lần sửa
- **Trade-off**: Code dài hơn nhưng không phụ thuộc vào annotation processor
