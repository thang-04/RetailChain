# Sequence Diagrams - Authentication, Role & Permission APIs

---

## 1. Authentication APIs

### 1.1 POST `/api/auth/register` - Đăng ký tài khoản

```
┌──────────┐      ┌────────────────┐      ┌───────────────────┐
│  Client  │      │ AuthController │      │ AuthServiceImpl   │
└────┬─────┘      └───────┬────────┘      └─────────┬─────────┘
     │                    │                         │
     │ POST /api/auth/register                       │
     │ {email, password, fullName, phoneNumber}     │
     │──────────────────>│                         │
     │                    │                         │
     │                    │ register(request)      │
     │                    │──────────────────────>│
     │                    │                         │
     │                    │   existsByEmail(email)  │
     │                    │──────────────────────>│
     │                    │                         │
     │                    │<───────────────────────│
     │                    │   (true/false)         │
     │                    │                         │
     │                    │   findByCode(STAFF)    │
     │                    │──────────────────────>│
     │                    │                         │
     │                    │<───────────────────────│
     │                    │   Role(STAFF)          │
     │                    │                         │
     │                    │   encode(password)     │
     │                    │──────────────────────>│
     │                    │                         │
     │                    │<───────────────────────│
     │                    │   encryptedPassword    │
     │                    │                         │
     │                    │   save(User)          │
     │                    │──────────────────────>│
     │                    │                         │
     │                    │<───────────────────────│
     │                    │   savedUser           │
     │                    │                         │
     │                    │   generateAccessToken │
     │                    │──────────────────────>│
     │                    │                         │
     │                    │<───────────────────────│
     │                    │   accessToken         │
     │                    │                         │
     │                    │   createRefreshToken  │
     │                    │──────────────────────>│
     │                    │                         │
     │                    │<───────────────────────│
     │                    │   refreshToken        │
     │                    │                         │
     │                    │<───────────────────────│
     │                    │   AuthResponse        │
     │                    │                         │
     │<───────────────────│   200 OK + AuthResponse
     │                         │
```

```
Flow: Client → Controller → Service → Repository → Database
```

---

### 1.2 POST `/api/auth/login` - Đăng nhập

```
┌──────────┐      ┌────────────────┐      ┌───────────────────┐
│  Client  │      │ AuthController │      │ AuthServiceImpl   │
└────┬─────┘      └───────┬────────┘      └─────────┬─────────┘
     │                    │                         │
     │ POST /api/auth/login                         │
     │ {email, password}  │                         │
     │──────────────────>│                         │
     │                    │                         │
     │                    │ login(request)        │
     │                    │──────────────────────>│
     │                    │                         │
     │                    │ authenticate(email, pwd)
     │                    │──────────────────────>│
     │                    │                         │
     │                    │<───────────────────────│
     │                    │ Authentication         │
     │                    │                         │
     │                    │ generateAccessToken   │
     │                    │──────────────────────>│
     │                    │                         │
     │                    │<───────────────────────│
     │                    │ accessToken            │
     │                    │                         │
     │                    │ findById(userId)      │
     │                    │──────────────────────>│
     │                    │                         │
     │                    │<───────────────────────│
     │                    │ User                   │
     │                    │                         │
     │                    │ createRefreshToken    │
     │                    │──────────────────────>│
     │                    │                         │
     │                    │<───────────────────────│
     │                    │ refreshToken           │
     │                    │                         │
     │                    │<───────────────────────│
     │                    │ AuthResponse          │
     │                    │                         │
     │<───────────────────│ 200 OK + AuthResponse  │
     │                         │
```

---

### 1.3 POST `/api/auth/refresh` - Refresh token

```
┌──────────┐      ┌────────────────┐      ┌───────────────────┐
│  Client  │      │ AuthController │      │ AuthServiceImpl   │
└────┬─────┘      └───────┬────────┘      └─────────┬─────────┘
     │                    │                         │
     │ POST /api/auth/refresh                       │
     │ {refreshToken}     │                         │
     │──────────────────>│                         │
     │                    │                         │
     │                    │ refreshToken(request)  │
     │                    │──────────────────────>│
     │                    │                         │
     │                    │ findByToken(token)    │
     │                    │──────────────────────>│
     │                    │                         │
     │                    │<───────────────────────│
     │                    │ RefreshToken          │
     │                    │                         │
     │                    │ verifyExpiration      │
     │                    │──────────────────────>│
     │                    │                         │
     │                    │<───────────────────────│
     │                    │ (valid/expired)        │
     │                    │                         │
     │                    │ deleteRefreshToken     │
     │                    │──────────────────────>│
     │                    │                         │
     │                    │ createRefreshToken    │
     │                    │──────────────────────>│
     │                    │                         │
     │                    │<───────────────────────│
     │                    │ newRefreshToken       │
     │                    │                         │
     │                    │ generateAccessToken   │
     │                    │──────────────────────>│
     │                    │                         │
     │                    │<───────────────────────│
     │                    │ newAccessToken        │
     │                    │                         │
     │                    │<───────────────────────│
     │                    │ AuthResponse          │
     │                    │                         │
     │<───────────────────│ 200 OK + AuthResponse  │
```

---

### 1.4 POST `/api/auth/logout` - Đăng xuất

```
┌──────────┐      ┌────────────────┐      ┌───────────────────┐
│  Client  │      │ AuthController │      │ AuthServiceImpl   │
└────┬─────┘      └───────┬────────┘      └─────────┬─────────┘
     │                    │                         │
     │ POST /api/auth/logout                        │
     │ (Authorization: Bearer token)                │
     │──────────────────>│                         │
     │                    │                         │
     │                    │ logout(userId)        │
     │                    │──────────────────────>│
     │                    │                         │
     │                    │ findById(userId)      │
     │                    │──────────────────────>│
     │                    │                         │
     │                    │<───────────────────────│
     │                    │ User                   │
     │                    │                         │
     │                    │ deleteByUser(user)     │
     │                    │──────────────────────>│
     │                    │                         │
     │                    │<───────────────────────│
     │                    │                         │
     │                    │<───────────────────────│
     │                    │ void                   │
     │                    │                         │
     │<───────────────────│ 200 OK                 │
```

---

## 2. Role APIs

### 2.1 GET `/api/roles` - Lấy danh sách role

```
┌──────────┐      ┌────────────────┐      ┌───────────────────┐
│  Client  │      │ RoleController │      │ RoleServiceImpl  │
└────┬─────┘      └───────┬────────┘      └─────────┬─────────┘
     │                    │                         │
     │ GET /api/roles     │                         │
     │ (Authorization)    │                         │
     │──────────────────>│                         │
     │                    │                         │
     │                    │ @PreAuthorize(ROLE_VIEW)
     │                    │                         │
     │                    │ getAllRoles()          │
     │                    │──────────────────────>│
     │                    │                         │
     │                    │ findAll()             │
     │                    │──────────────────────>│
     │                    │                         │
     │                    │<───────────────────────│
     │                    │ List<Role>             │
     │                    │                         │
     │                    │<───────────────────────│
     │                    │ List<RoleDTO>          │
     │                    │                         │
     │<───────────────────│ 200 OK + List<RoleDTO> │
```

---

### 2.2 GET `/api/roles/{id}` - Lấy role theo ID

```
┌──────────┐      ┌────────────────┐      ┌───────────────────┐
│  Client  │      │ RoleController │      │ RoleServiceImpl  │
└────┬─────┘      └───────┬────────┘      └─────────┬─────────┘
     │                    │                         │
     │ GET /api/roles/{id}                         │
     │──────────────────>│                         │
     │                    │                         │
     │                    │ getRoleById(id)       │
     │                    │──────────────────────>│
     │                    │                         │
     │                    │ findById(id)          │
     │                    │──────────────────────>│
     │                    │                         │
     │                    │<───────────────────────│
     │                    │ Role / null           │
     │                    │                         │
     │                    │<───────────────────────│
     │                    │ RoleDTO               │
     │                    │                         │
     │<───────────────────│ 200 OK + RoleDTO      │
```

---

### 2.3 POST `/api/roles` - Tạo role mới

```
┌──────────┐      ┌────────────────┐      ┌───────────────────┐
│  Client  │      │ RoleController │      │ RoleServiceImpl  │
└────┬─────┘      └───────┬────────┘      └─────────┬─────────┘
     │                    │                         │
     │ POST /api/roles    │                         │
     │ {name, description, permissionIds}          │
     │──────────────────>│                         │
     │                    │                         │
     │                    │ @PreAuthorize(ROLE_CREATE)
     │                    │                         │
     │                    │ createRole(request)    │
     │                    │──────────────────────>│
     │                    │                         │
     │                    │ existsByName(name)     │
     │                    │──────────────────────>│
     │                    │                         │
     │                    │<───────────────────────│
     │                    │ true/false             │
     │                    │                         │
     │                    │ findAllById(permissionIds)
     │                    │──────────────────────>│
     │                    │                         │
     │                    │<───────────────────────│
     │                    │ List<Permission>       │
     │                    │                         │
     │                    │ save(Role)             │
     │                    │──────────────────────>│
     │                    │                         │
     │                    │<───────────────────────│
     │                    │ savedRole              │
     │                    │                         │
     │                    │<───────────────────────│
     │                    │ RoleDTO                │
     │                    │                         │
     │<───────────────────│ 200 OK + RoleDTO      │
```

---

### 2.4 PUT `/api/roles/{id}` - Cập nhật role

```
┌──────────┐      ┌────────────────┐      ┌───────────────────┐
│  Client  │      │ RoleController │      │ RoleServiceImpl  │
└────┬─────┘      └───────┬────────┘      └─────────┬─────────┘
     │                    │                         │
     │ PUT /api/roles/{id}                         │
     │ {name, description, permissionIds}          │
     │──────────────────>│                         │
     │                    │                         │
     │                    │ @PreAuthorize(ROLE_UPDATE)
     │                    │                         │
     │                    │ updateRole(id, request)│
     │                    │──────────────────────>│
     │                    │                         │
     │                    │ findById(id)          │
     │                    │──────────────────────>│
     │                    │                         │
     │                    │<───────────────────────│
     │                    │ Role                   │
     │                    │                         │
     │                    │ existsByName(newName) │
     │                    │──────────────────────>│
     │                    │                         │
     │                    │<───────────────────────│
     │                    │ true/false             │
     │                    │                         │
     │                    │ findAllById(permissionIds)
     │                    │──────────────────────>│
     │                    │                         │
     │                    │<───────────────────────│
     │                    │ List<Permission>       │
     │                    │                         │
     │                    │ save(updatedRole)      │
     │                    │──────────────────────>│
     │                    │                         │
     │                    │<───────────────────────│
     │                    │ updatedRole            │
     │                    │                         │
     │                    │<───────────────────────│
     │                    │ RoleDTO                │
     │                    │                         │
     │<───────────────────│ 200 OK + RoleDTO      │
```

---

### 2.5 DELETE `/api/roles/{id}` - Xóa role

```
┌──────────┐      ┌────────────────┐      ┌───────────────────┐
│  Client  │      │ RoleController │      │ RoleServiceImpl  │
└────┬─────┘      └───────┬────────┘      └─────────┬─────────┘
     │                    │                         │
     │ DELETE /api/roles/{id}                       │
     │──────────────────>│                         │
     │                    │                         │
     │                    │ @PreAuthorize(ROLE_DELETE)
     │                    │                         │
     │                    │ deleteRole(id)        │
     │                    │──────────────────────>│
     │                    │                         │
     │                    │ findById(id)          │
     │                    │──────────────────────>│
     │                    │                         │
     │                    │<───────────────────────│
     │                    │ Role                   │
     │                    │                         │
     │                    │ (Check system role)   │
     │                    │                         │
     │                    │ delete(role)          │
     │                    │──────────────────────>│
     │                    │                         │
     │                    │<───────────────────────│
     │                    │                         │
     │                    │<───────────────────────│
     │                    │ void                   │
     │                    │                         │
     │<───────────────────│ 200 OK                 │
```

---

## 3. Permission APIs

### 3.1 GET `/api/permissions` - Lấy danh sách permission

```
┌──────────┐      ┌────────────────────┐    ┌─────────────────────┐
│  Client  │      │ PermissionController│    │ PermissionServiceImpl│
└────┬─────┘      └─────────┬──────────┘    └──────────┬──────────┘
     │                      │                          │
     │ GET /api/permissions │                          │
     │ (Authorization)       │                          │
     │────────────────────->│                          │
     │                      │                          │
     │                      │ @PreAuthorize(PERMISSION_VIEW)
     │                      │                          │
     │                      │ getAllPermissions()    │
     │                      │───────────────────────>│
     │                      │                          │
     │                      │ findAll()               │
     │                      │───────────────────────>│
     │                      │                          │
     │                      │<───────────────────────│
     │                      │ List<Permission>        │
     │                      │                          │
     │                      │<───────────────────────│
     │                      │ List<PermissionDTO>     │
     │                      │                          │
     │<─────────────────────│ 200 OK + List<PermissionDTO>
```

---

### 3.2 GET `/api/permissions/{id}` - Lấy permission theo ID

```
┌──────────┐      ┌────────────────────┐    ┌─────────────────────┐
│  Client  │      │ PermissionController│    │ PermissionServiceImpl│
└────┬─────┘      └─────────┬──────────┘    └──────────┬──────────┘
     │                      │                          │
     │ GET /api/permissions/{id}                       │
     │────────────────────->│                          │
     │                      │                          │
     │                      │ getPermissionById(id)  │
     │                      │───────────────────────>│
     │                      │                          │
     │                      │ findById(id)            │
     │                      │───────────────────────>│
     │                      │                          │
     │                      │<───────────────────────│
     │                      │ Permission / null       │
     │                      │                          │
     │                      │<───────────────────────│
     │                      │ PermissionDTO           │
     │                      │                          │
     │<─────────────────────│ 200 OK + PermissionDTO  │
```

---

## Tổng kết Flow xử lý

### Read Operations (GET)
```
Client → Controller → Security (PreAuthorize) → Service → Repository → Database
                                                                      ↓
Client ← Controller ← Service ← Repository ← List<Entity>/Entity ←───┘
```

### Write Operations (POST/PUT/DELETE)
```
Client → Controller → Security (PreAuthorize) → Service → Validation
                                                              ↓
Client ← Controller ← Service ← Repository ← Entity ← Database
```

### Authentication Flow
```
Client → Controller → Service → AuthenticationManager → SecurityContext
                                                      ↓
Client ← Controller ← Service ← TokenProvider ← JWT Token
```
