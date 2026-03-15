---
name: screen-crawler
description: Phân tích và document cấu trúc màn hình của ứng dụng web. SỬ DỤNG NGAY khi user muốn: (1) liệt kê tất cả các route/page trong project, (2) biết một màn hình có những chức năng gì, (3) xem nội dung hiển thị của mỗi trang, (4) tạo tài liệu về cấu trúc ứng dụng, (5) crawl routes và phân tích chi tiết từng screen. Skill này tự động detect framework (React/Vue/Svelte), tìm route definitions, trích xuất chức năng và nội dung UI, xuất ra file screens.yaml. Đặc biệt hữu ích khi user nói: "phân tích cấu trúc app", "liệt kê routes", "tạo tài liệu màn hình", "crawl screen", "routes có chức năng gì", "page này hiển thị gì".
---

# Screen Crawler - Phân tích cấu trúc ứng dụng

Skill này giúp bạn crawl và phân tích cấu trúc màn hình của một web application, sau đó tạo tài liệu chi tiết về từng page/route.

## Khi nào sử dụng

- User yêu cầu liệt kê tất cả các route trong project
- User muốn biết một màn hình cụ thể có những chức năng gì
- User cần tạo tài liệu về cấu trúc ứng dụng
- User muốn phân tích chi tiết nội dung hiển thị của từng page
- Bất kỳ yêu cầu nào liên quan đến "routes", "pages", "screens", "navigation" kèm theo việc trích xuất thông tin

## Quy trình thực hiện

**THỨ TỰ QUAN TRỌNG**: Luôn thực hiện theo đúng thứ tự dưới đây:

### Bước 1: Auto-detect Framework

Đầu tiên, xác định framework đang sử dụng:

1. Tìm package.json để xem dependencies
2. Check cho các indicators:
   - **React**: react-router, react-router-dom, @remix-run/react
   - **Vue**: vue-router, @nuxtjs/router
   - **Svelte**: @sveltejs/kit, svelte-routing
   - **Angular**: @angular/router
   - **Next.js**: next, next/router, next/navigation
   - **Nuxt**: @nuxtjs/router, nuxt

### Bước 2: Tìm TẤT CẢ Route Definitions (Lấy danh sách tất cả màn hình)

Tìm tất cả các nơi định nghĩa routes:

1. **Router config files**:
   - `src/router/index.ts/js`
   - `src/routes.ts/js`
   - `src/App.tsx` (router definitions)
   - `router.ts`, `routes.ts`, `routes.js`

2. **Inline trong code**:
   - `<Route path="..." component={...} />` (React)
   - `{ path: '...', component: ... }` (Vue Router)
   - `+page.svelte`, `+page.ts` (SvelteKit)
   - `app.get('/...')` (Express-like)

3. **File-based routing**:
   - `src/pages/**/*.tsx` (React)
   - `src/views/**/*.vue` (Vue)
   - `src/routes/**/*` (SvelteKit, Next.js app dir)

Sử dụng grep để tìm:
```bash
grep -r "path=" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" src/
grep -r "Route" --include="*.tsx" --include="*.jsx" src/
```

**OUTPUT BƯỚC 2**: Danh sách tất cả các route với:
- path
- component name
- file path

### Bước 3: Phân tích CHI TIẾT từng Screen (Theo thứ tự từng route)

Với **TỪNG ROUTE** trong danh sách đã tìm được ở Bước 2, phân tích:

#### 3a. Đọc file component
- Đọc nội dung file của component đó

#### 3b. Trích xuất CHỨC NĂNG (Functionalities)
Phân tích code để tìm các chức năng chính:
- Tìm **event handlers**: `onClick=`, `onSubmit=`, `onChange=`
- Tìm **functions được định nghĩa**: `const handleX = ...`, `const fetchX = ...`
- Tìm **state changes**: `setX(...)` → xác định chức năng thay đổi state
- Tìm **API calls**: `fetch()`, `axios.` → xác định chức năng gọi API

**Functionalities bao gồm**:
- Thao tác người dùng có thể làm (search, create, edit, delete)
- Các tính năng tự động (auto-fetch, auto-redirect)
- Các hành động với dữ liệu

#### 3c. Trích xuất NỘI DUNG HIỂN THỊ (UI Elements/Content)
Phân tích phần return/render của component:
- Tìm **JSX/HTML elements**: `<div>`, `<table>`, `<form>`, `<input>`, `<button>`, etc.
- Tìm **conditional rendering**: `{condition ? A : B}` → xác định nội dung có thể hiển thị
- Tìm **lists/map**: `{items.map(...)}` → xác định danh sách nội dung
- Tìm **text content**: Các text, labels, headings hiển thị

**UI Elements/Nội dung bao gồm**:
- Tiêu đề trang, headings
- Form elements (input, button, select, checkbox)
- Tables, lists
- Cards, modals
- Navigation links
- Loading/error/empty states
- Nội dung động từ API

#### 3d. Trích xuất Parameters
- Route parameters (`:id`, `:slug`, etc.)
- Query parameters (`?page=`, `?q=`)

#### 3e. Trích xuất API Calls
- Tất cả API endpoints được gọi trong component

### Bước 4: Tạo Output YAML

Tạo file `screens.yaml` trong thư mục gốc của project.

**Optional**: Có thể sử dụng helper scripts trong thư mục `scripts/`:
- `extract_routes.py` - Tự động extract routes từ codebase
- `analyze_component.py` - Tự động analyze component và trích xuất thông tin

## Xử lý edge cases

1. **Dynamic routes**: `/users/:id` → extract parameter name là `id`
2. **Nested routes**: Phân tích cả parent và child routes
3. **Route guards**: Ghi nhận auth guards nếu có
4. **Lazy loading**: Ghi nhận lazy components nếu có
5. **Redirects**: Note các redirects nếu có

## Output

Tạo file `screens.yaml` trong thư mục gốc của project.

## Cấu trúc YAML Schema

```yaml
app:
  name: string          # Tên project
  framework: string     # Framework sử dụng
  router: string        # Router library
  total_routes: number  # Tổng số routes
  generated: string     # Ngày tạo

routes:
  - path: string        # Route path
    name: string        # Tên hiển thị
    component: string   # Tên component
    file: string        # Đường dẫn file
    params:             # Parameters
      - name: string
        type: string    # path | query
        description: string
    description: string     # Mô tả ngắn
    functionalities:         # Chức năng của màn hình (WHAT it does)
      - string
    api_calls:               # API calls
      - string
    ui_elements:             # Nội dung hiển thị (WHAT is displayed)
      - string

summary:
  total_routes: number
  api_endpoints: [...]

**Lưu ý quan trọng**:
- `functionalities`: Liệt kê các CHỨC NĂNG chính - những gì người dùng có thể LÀM trên màn hình đó
- `ui_elements`: Liệt kê các NỘI DUNG hiển thị - những gì người dùng có thể NHÌN THẤY trên màn hình đó
- Sử dụng tiếng Việt cho description và functionalities
