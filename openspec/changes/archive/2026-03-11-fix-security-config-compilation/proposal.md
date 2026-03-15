## Why

Spring Boot application khởi động thất bại với lỗi "Unresolved compilation problems" trong SecurityConfig. Các trường final (userDetailsService, authenticationEntryPoint, jwtAuthenticationFilter) không được khởi tạo do Lombok @RequiredArgsConstructor không tạo constructor đúng cách. Lỗi này xảy ra với compiled classes trong thư mục target bị stale. Cần sửa ngay để ứng dụng có thể khởi động.

## What Changes

- Thay thế `@RequiredArgsConstructor` bằng constructor explicit trong SecurityConfig.java
- Loại bỏ dependency vào Lombok annotation processor cho việc tạo constructor
- Đảm bảo SecurityConfig có constructor nhận 3 dependencies: CustomUserDetailsService, JwtAuthenticationEntryPoint, JwtAuthenticationFilter
- Clean và rebuild project để clear stale compiled classes

## Capabilities

### New Capabilities
- `fix-security-config-compilation`: Sửa lỗi compilation trong SecurityConfig để ứng dụng khởi động được

### Modified Capabilities
- Không có capability nào bị ảnh hưởng

## Impact

- File: `RetailChainService/src/main/java/com/sba301/retailmanagement/security/SecurityConfig.java`
- Chỉ ảnh hưởng đến quá trình khởi động application, không ảnh hưởng đến logic nghiệp vụ
- Không thay đổi API hay database
