# Hướng dẫn Phát triển Dự án RetailChainUi

Tài liệu này cung cấp hướng dẫn chi tiết về cấu trúc dự án, quy tắc viết code (coding conventions) và quy trình làm việc (workflow) cho team phát triển Frontend.

## 🛠 Công nghệ Sử dụng

- **Core**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) (Headless UI), lucide-react (Icons)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Code Quality**: ESLint

## 📂 Cấu trúc Thư mục

Dự án tuân theo cấu trúc hướng module (feature-based) kết hợp với các component dùng chung.

```text
src/
├── assets/                  # Tài nguyên tĩnh (images, fonts)
├── components/              # UI Components dùng chung
│   ├── ui/                  # Các component cơ bản (Button, Input) - thường từ shadcn
│   └── layout/              # Layout chính (Header, Sidebar)
├── configs/                 # Cấu hình hằng số, routes
├── context/                 # Global Context (Auth, Theme)
├── hooks/                   # Custom Hooks (useAuth, useDebounce)
├── lib/                     # Utilities & Helper libraries (utils.js cho tailwind merge)
├── pages/                   # Các trang màn hình chính (Page Components)
│   ├── Auth/                # Module Authentication
│   └── Dashboard/           # Module Dashboard
├── services/                # API Layer (gọi Backend)
├── styles/                  # (Optional) CSS module nếu không dùng Tailwind
├── utils/                   # Các hàm tiện ích thuần logic (formatDate, storage)
├── App.jsx                  # Root Component
├── index.css                # Global Styles & Tailwind Config
└── main.jsx                 # Entry Point
```

## 📏 Quy tắc Code (Coding Conventions)

### 1. Đặt tên (Naming Convention)

- **Component & File Component**: Sử dụng `PascalCase`.
  - ✅ `ProductCard.jsx`, `UserProfile.jsx`
  - ❌ `productCard.jsx`, `user_profile.jsx`
- **Hàm & Biến (Functions & Variables)**: Sử dụng `camelCase`.
  - ✅ `const handleLogin = () => {}`
  - ✅ `const userData = {}`
- **Hằng số (Constants)**: Sử dụng `UPPER_SNAKE_CASE`.
  - ✅ `API_BASE_URL`, `MAX_RETRY_COUNT`
- **Custom Hooks**: Bắt đầu bằng `use` và `camelCase`.
  - ✅ `useFetchData.js`, `useAuth.js`

### 2. Styling (Tailwind CSS)

Dự án sử dụng **Tailwind CSS v4**.
- Hạn chế viết CSS thuần hoặc inline style.
- Sử dụng class tiện ích của Tailwind trực tiếp trong JSX.
- Với các class logic phức tạp, sử dụng thư viện `clsx` hoặc `tailwind-merge` (thông qua `lib/utils.js` `cn` helper).

```jsx
// ✅ Tốt
<button className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark">
  Click me
</button>

// ✅ Tốt (với logic điều kiện)
<div className={cn("p-4 border", isActive && "border-blue-500")}>...</div>
```

### 3. Import & Path Alias

Luôn sử dụng **Alias** `@` để import các file trong thư mục `src`. Tránh dùng đường dẫn tương đối dài (`../../../`).

- ✅ `import Button from "@/components/ui/Button"`
- ❌ `import Button from "../../../components/ui/Button"`

### 4. Component Structure

- **Functional Components**: Luôn sử dụng Arrow Function.
- **Exports**: Ưu tiên `export default` cho Page Components, và `Named Export` cho các component nhỏ dùng chung tiện ích.
- **Props**: Destructuring props ngay đầu hàm.

```jsx
const MyComponent = ({ title, isActive }) => {
  return <div className={isActive ? "active" : ""}>{title}</div>;
};
export default MyComponent;
```

## 🔄 Quy trình Code (Development Flow)

Để đảm bảo code sạch và dễ quản lý, mọi thành viên vui lòng tuân thủ quy trình sau:

## 📝 Ví dụ: Quy trình Tạo mới 1 Page (ProductPage)

Giả sử bạn cần làm trang **Quản lý Sản phẩm** (Product List). Quy trình chuẩn sẽ như sau:

### Bước 1: Định nghĩa API (Service Layer)
Tạo file `src/services/product.service.js` để quản lý các endpoint liên quan đến Product.

```javascript
// src/services/product.service.js
import axiosClient from "./api/axiosClient";

export const productService = {
  getAll: (params) => {
    return axiosClient.get("/products", { params });
  },
  create: (data) => {
    return axiosClient.post("/products", data);
  }
};
```

### Bước 2: Tạo Custom Hook (Logic Layer)
Tách biệt logic gọi API và xử lý state ra khỏi UI component. Tạo `src/pages/Product/hooks/useProductList.js`.

```javascript
// src/pages/Product/hooks/useProductList.js
import { useState, useEffect } from "react";
import { productService } from "@/services/product.service";

export const useProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await productService.getAll();
      setProducts(res.data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  return { products, loading, refresh: fetchProducts };
};
```

### Bước 3: Xây dựng UI (View Layer)
Sử dụng Hook đã tạo trong Component chính `src/pages/Product/ProductList.jsx`.

```jsx
// src/pages/Product/ProductList.jsx
import { useProductList } from "./hooks/useProductList";
import Button from "@/components/ui/Button";

const ProductList = () => {
  const { products, loading, refresh } = useProductList();

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Danh sách sản phẩm</h1>
        <Button onClick={refresh}>Làm mới</Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product.id} className="border p-4 rounded shadow-sm">
            <h3 className="font-semibold">{product.name}</h3>
            <p className="text-gray-600">${product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
```

### Tổng kết luồng dữ liệu:
1. **Component** (`ProductList.jsx`) gọi **Hook** (`useProductList`).
2. **Hook** gọi **Service** (`productService`).
3. **Service** dùng **Axios** gọi xuống Backend.

## ⚠️ Lưu ý Quan trọng
1. **API Calls**: Tất cả việc gọi API phải thông qua `services/`. Không gọi `axios` hoặc `fetch` trực tiếp trong Component.
2. **Quản lý State**:
   - Dùng `useState` cho state cục bộ UI.
   - Dùng `Context` hoặc Global Store cho dữ liệu dùng chung (User, Cart).
3. **Responsive**: Luôn kiểm tra giao diện trên Mobile và Tablet. Tailwind hỗ trợ rất tốt việc này (`md:`, `lg:`).

---

