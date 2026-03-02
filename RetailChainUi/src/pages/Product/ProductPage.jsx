import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, WifiOff } from "lucide-react";
import ProductHeader from "./components/ProductHeader/ProductHeader";
import ProductFilter from "./components/FilterBar/ProductFilter";
import ProductTable from "./components/ProductTable/ProductTable";
import productService from "../../services/product.service";

// Mock data dùng khi backend offline
const MOCK_CATEGORIES = [
  { id: 1, name: "Thời trang" },
  { id: 2, name: "Áo" },
  { id: 3, name: "Quần" },
  { id: 4, name: "Túi xách" },
];

const MOCK_PRODUCTS = [
  { id: 1, code: "FA001", name: "Áo Phông Basic", categoryId: 2, gender: "UNISEX", status: 1, description: "Áo phông cotton cao cấp", image: "", slug: "ao-phong-basic" },
  { id: 2, code: "FA002", name: "Quần Jeans Slim", categoryId: 3, gender: "MEN", status: 1, description: "Quần jeans co giãn tốt", image: "", slug: "quan-jeans-slim" },
  { id: 3, code: "FA003", name: "Áo Sơ Mi Nữ", categoryId: 2, gender: "WOMEN", status: 1, description: "Áo sơ mi lụa nhẹ", image: "", slug: "ao-so-mi-nu" },
  { id: 4, code: "FA004", name: "Túi Da Mini", categoryId: 4, gender: "WOMEN", status: 0, description: "Túi da PU thời trang", image: "", slug: "tui-da-mini" },
  { id: 5, code: "FA005", name: "Áo Khoác Denim", categoryId: 1, gender: "UNISEX", status: 1, description: "Áo khoác denim vintage", image: "", slug: "ao-khoac-denim" },
];

const ProductPage = () => {
  const navigate = useNavigate();
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [backendOffline, setBackendOffline] = useState(false);

  // Filters State
  const [filters, setFilters] = useState({
    search: "",
    category: "all",
    status: "all"
  });

  // Combined fetch for products and categories on mount
  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      setBackendOffline(false);
      try {
        const [prodRes, catRes] = await Promise.all([
          productService.getAllProducts(),
          productService.getCategories()
        ]);
        setAllProducts(prodRes.data || []);
        setFilteredProducts(prodRes.data || []);
        setCategories(catRes.data || []);
      } catch (error) {
        console.error("Failed to fetch products or categories:", error);
        // Backend offline → dùng mock data để FE vẫn hoạt động
        setBackendOffline(true);
        setAllProducts(MOCK_PRODUCTS);
        setFilteredProducts(MOCK_PRODUCTS);
        setCategories(MOCK_CATEGORIES);
      } finally {
        setLoading(false);
      }
    };
    initData();
  }, []); // Only run once on mount

  // Filter Logic
  useEffect(() => {
    let result = [...allProducts];

    if (filters.search) {
      const query = filters.search.toLowerCase();
      result = result.filter(
        (p) =>
          (p.name && p.name.toLowerCase().includes(query)) ||
          (p.code && p.code.toLowerCase().includes(query))
      );
    }

    if (filters.category && filters.category !== "all") {
      const catId = parseInt(filters.category);
      result = result.filter(p => p.categoryId === catId);
    }

    if (filters.status && filters.status !== "all") {
      const isActive = filters.status === "active";
      result = result.filter(p => (p.status === 1) === isActive);
    }

    setFilteredProducts(result);
  }, [allProducts, filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleCreate = () => {
    navigate("/products/create");
  };

  const handleEdit = (product) => {
    navigate(`/products/${product.slug}/edit`);
  };

  const handleView = (product) => {
    navigate(`/products/${product.slug}`);
  };

  return (
    <div className="flex flex-col gap-8 p-4 md:p-8 bg-[#f8fafc] dark:bg-[#0f171a] min-h-screen">
      {/* Banner cảnh báo backend offline */}
      {backendOffline && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300">
          <WifiOff className="w-5 h-5 shrink-0" />
          <div className="flex-1">
            <span className="font-bold">Backend không khả dụng</span>
            <span className="ml-2 text-sm">— Đang hiển thị dữ liệu mẫu. Hãy khởi động Spring Boot server để xem dữ liệu thực.</span>
          </div>
          <AlertTriangle className="w-4 h-4 shrink-0" />
        </div>
      )}

      <ProductHeader onAddClick={handleCreate} />

      <div className="flex flex-col gap-6">
        <ProductFilter
          filters={filters}
          onFilterChange={setFilters}
          categories={categories}
        />

        {loading ? (
          <div className="flex items-center justify-center h-64 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="flex flex-col items-center gap-4">
              <div className="size-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
              <p className="text-slate-500 font-medium">Syncing global catalog...</p>
            </div>
          </div>
        ) : (
          <ProductTable
            products={filteredProducts}
            categories={categories}
            onEditClick={handleEdit}
            onViewClick={handleView}
          />
        )}
      </div>
    </div>
  );
};


export default ProductPage;
