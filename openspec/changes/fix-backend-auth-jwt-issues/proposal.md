## Why

Hệ thống backend đang gặp vấn đề xác thực JWT:
- API `/api/warehouse` và các API protected khác trả về 401 Unauthorized dù token hợp lệ
- Token từ login không được validate đúng bởi JwtAuthenticationFilter
- Cần fix để các API protected hoạt động (warehouse, inventory, stock-in, v.v.)

## What Changes

1. **Debug JwtTokenProvider**: Kiểm tra logic validate token
2. **Kiểm tra JWT secret key**: Đảm bảo secret key的一致性 (consistency) giữa generate và validate
3. **Fix JwtAuthenticationFilter**: Đảm bảo filter xử lý đúng token
4. **Verify lại SecurityConfig**: Kiểm tra các endpoint được bảo vệ đúng cách

## Capabilities

### New Capabilities
- `jwt-auth-fix`: Fix vấn đề JWT authentication

### Modified Capabilities
- (Không có - là bug fix)

## Impact

- **Backend**: JwtTokenProvider.java, JwtAuthenticationFilter.java, SecurityConfig.java
- **Frontend**: Tất cả các page gọi API protected (warehouse, inventory, stock-in, stock-out)
