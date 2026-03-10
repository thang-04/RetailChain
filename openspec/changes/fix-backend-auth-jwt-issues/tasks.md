## 1. Investigation

- [x] 1.1 Kiểm tra backend đang chạy trên port nào
- [x] 1.2 Test login API và lấy token
- [x] 1.3 Test /api/warehouse với token để xác nhận lỗi
- [x] 1.4 Kiểm tra logs của JwtAuthenticationFilter

## 2. Debug JWT Token

- [x] 2.1 Thêm debug logging vào JwtAuthenticationFilter
- [x] 2.2 Verify JWT secret key trong JwtTokenProvider
- [x] 2.3 Verify algorithm (HS512) được sử dụng đúng
- [x] 2.4 Test decode token thủ công để verify signature

## 3. Fix Issues

- [ ] 3.1 Fix JWT secret key nếu có mismatch
- [ ] 3.2 Fix JwtAuthenticationFilter nếu cần
- [ ] 3.3 Verify SecurityConfig đúng cho /api/warehouse

## 4. Verify

- [x] 4.1 Login và lấy token mới
- [x] 4.2 Test /api/warehouse với token mới (curl works)
- [ ] 4.3 Test các API protected khác (inventory, stock-in)
- [ ] 4.4 Test frontend wizard hoạt động

## Root Cause Found

**Issue**: Token từ browser có signature không hợp lệ khi validate với secret key.

**Evidence**:
- Token từ curl (fresh) → /api/warehouse: 200 OK
- Token từ browser → /api/warehouse: 401 Unauthorized

**Nguyên nhân tiềm năng**:
1. Token trong browser bị cũ/expiried
2. Có sự khác biệt giữa cách browser gửi request và curl
3. Interceptor của axiosPrivate có thể đang thêm token sai
