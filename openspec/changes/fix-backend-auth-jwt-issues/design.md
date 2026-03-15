## Context

Hệ thống JWT authentication đang gặp vấn đề:
- Backend đang chạy trên port 8080
- Login API hoạt động bình thường
- Nhưng các API protected (warehouse, inventory) trả về 401

## Goals / Non-Goals

**Goals:**
- Fix JWT authentication để các API protected hoạt động
- Đảm bảo token được validate đúng
- Token từ login có thể được sử dụng để gọi các API protected

**Non-Goals:**
- Thay đổi cấu trúc JWT
- Thêm tính năng mới (refresh token, v.v.)

## Decisions

### 1. Debug JwtTokenProvider

Kiểm tra flow:
```
Login → generateAccessToken() → JWT Token
         ↓
Request → JwtAuthenticationFilter → validateToken()
         ↓
SecurityContext.setAuthentication()
```

**Cần kiểm tra:**
- Secret key có khớp không (generate vs validate)
- Algorithm có đúng không (HS512)

### 2. JWT Secret Key

Từ application.properties:
```
spring.security.jwt.secret=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970337336763979244226452948404D6351
```

**Kiểm tra:**
- JwtTokenProvider sử dụng đúng secret
- JwtAuthenticationFilter gọi validateToken đúng cách

### 3. Fix Strategy

1. **Thêm logging** vào JwtAuthenticationFilter để trace
2. **Verify token** được generate đúng format
3. **Check authorities** - permissions có đúng format không

## Risks / Trade-offs

- [Risk] Token cũ sẽ bị invalidate → Mitigation: User cần login lại
- [Risk] Có thể ảnh hưởng đến production → Mitigation: Chỉ fix dev environment

## Migration Plan

1. Restart backend với config đúng
2. Login và lấy token mới
3. Test các API protected (/warehouse, /inventory)
