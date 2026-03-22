# Checklist Kịch Bản Regression Theo Role

## SUPER_ADMIN
1. Auth:
- Login với `admin@retailchain.com`.
- Gọi `/user/me`, `/auth/refresh`, `/auth/logout`.
2. Role & Permission:
- `GET /roles`, `GET /permissions` phải pass.
- `POST /roles` với payload hợp lệ phải pass.
3. Store/Warehouse:
- `GET/POST /stores`, `GET/POST /warehouse` phải pass theo payload hợp lệ.
4. Inventory/Product:
- `GET /inventory/overview`, `GET /inventory/documents`, `GET /product`, `GET /product/categories`.
5. Staff management:
- `GET /user`, `POST /user`, `PATCH /user/{id}/block`.

## STORE_MANAGER
1. Auth:
- Login manager, xử lý `first-change-password` nếu `isFirstLogin=true`.
2. Positive case:
- `GET /user`, `GET /stores`, `GET /inventory/overview`, `GET /stock-request/pending`.
- `POST /stock-request` với payload hợp lệ.
3. Negative case (phải bị chặn):
- `GET /roles`, `GET /permissions`, `POST /stores`, `POST /warehouse`.
4. Scope case:
- Chỉ xem/cập nhật user thuộc store của manager.

## STAFF
1. Auth:
- Login staff, xử lý `first-change-password` nếu cần.
2. Positive case:
- `GET /stores`, `GET /product`, `GET /inventory/overview`, `GET /attendance/my-history`.
3. Negative case (phải bị chặn):
- `GET /user`, `POST /user`, `POST /stock-request`, `POST /stores`, `POST /warehouse`, `GET /roles`.
4. Data boundary:
- Không đọc dữ liệu nhạy cảm ngoài store/scope cho phép.

## Cross-cutting
1. HTTP contract:
- Lỗi nghiệp vụ phải trả HTTP 4xx, lỗi hệ thống HTTP 5xx.
2. DB compatibility:
- Các endpoint attendance/shift/store phải chạy qua dữ liệu thật không lỗi schema.
3. UI role-based menu:
- Admin có `Roles & Permissions`.
- Manager không có `Roles & Permissions`.
- Staff chỉ thấy menu tối thiểu theo permission.
4. Security:
- Không có secret hardcode trong source/config.
