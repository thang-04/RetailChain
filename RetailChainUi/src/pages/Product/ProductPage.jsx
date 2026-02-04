import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductHeader from "./components/ProductHeader/ProductHeader";
import ProductFilter from "./components/FilterBar/ProductFilter";
import ProductTable from "./components/ProductTable/ProductTable";
import productService from "../../services/product.service";

const ProductPage = () => {
  const navigate = useNavigate();
  const [allProducts, setAllProducts] = useState([]); // This will hold all fetched products
  const [filteredProducts, setFilteredProducts] = useState([]); // This will hold products after filtering
  const [categories, setCategories] = useState([]); // New state for categories
  const [loading, setLoading] = useState(true);

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
