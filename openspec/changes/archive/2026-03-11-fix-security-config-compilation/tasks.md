## 1. Sửa SecurityConfig.java

- [x] 1.1 Loại bỏ annotation `@RequiredArgsConstructor` khỏi SecurityConfig
- [x] 1.2 Thêm explicit constructor nhận 3 parameters: CustomUserDetailsService, JwtAuthenticationEntryPoint, JwtAuthenticationFilter
- [x] 1.3 Gán các trường trong constructor

## 2. Sửa JwtAuthenticationFilter.java

- [x] 2.1 Loại bỏ annotation `@RequiredArgsConstructor` và `@Slf4j`
- [x] 2.2 Thêm Logger field sử dụng `LoggerFactory.getLogger(JwtAuthenticationFilter.class)`
- [x] 2.3 Thêm explicit constructor nhận JwtTokenProvider

## 3. Sửa JwtAccessDeniedHandler.java

- [x] 3.1 Loại bỏ annotation `@Slf4j`
- [x] 3.2 Thêm Logger field sử dụng `LoggerFactory.getLogger(JwtAccessDeniedHandler.class)`

## 4. Clean và Build

- [x] 4.1 Chạy `mvn clean compile` để clear stale classes
- [x] 4.2 Kiểm tra không còn compilation errors
- [x] 4.3 Chạy application để xác nhận khởi động thành công
