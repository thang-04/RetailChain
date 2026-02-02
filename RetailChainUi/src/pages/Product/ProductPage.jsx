import React, { useEffect, useState } from "react";
import ProductHeader from "./components/ProductHeader/ProductHeader";
import ProductFilter from "./components/FilterBar/ProductFilter";
import ProductTable from "./components/ProductTable/ProductTable";
import ProductForm from "./components/ProductForm/ProductForm";
import ProductDetailModal from "./components/ProductDetailModal/ProductDetailModal";
import productService from "../../services/product.service";


const ProductPage = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [filters, setFilters] = useState({
    search: "",
    category: "all",
    status: "all"
  });

  // Form & Detail State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Use toast if available, or just console.log/alert
  // const { toast } = useToast(); 

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await productService.getAllProducts();
      console.log("Fetch products response:", response);
      // Backend returns { code, message, data: [...] }
      if (response && response.data) {
        setAllProducts(response.data);
        setFilteredProducts(response.data); // Init filtered with all data
      } else {
        console.warn("Invalid fetching response format", response);
        setAllProducts([]);
        setFilteredProducts([]);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
      // toast({ title: "Error", description: "Failed to load products", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter Logic
  useEffect(() => {
    let result = [...allProducts];

    // 1. Filter by Search (Name or Code)
    if (filters.search) {
      const query = filters.search.toLowerCase();
      result = result.filter(
        (p) =>
          (p.name && p.name.toLowerCase().includes(query)) ||
          (p.code && p.code.toLowerCase().includes(query))
      );
    }

    // 2. Filter by Category
    if (filters.category && filters.category !== "all") {
      const catId = parseInt(filters.category);
      result = result.filter(p => p.categoryId === catId);
    }

    // 3. Filter by Status
    if (filters.status && filters.status !== "all") {
      const isActive = filters.status === "active"; // true if active
      // 1 = Active, 0 = Inactive
      result = result.filter(p => (p.status === 1) === isActive);
    }

    setFilteredProducts(result);
  }, [allProducts, filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleCreate = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleView = (product) => {
    setSelectedProduct(product);
    setIsDetailOpen(true);
  };

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      if (selectedProduct) {
        // Update
        if (selectedProduct.slug) {
          await productService.updateProduct(selectedProduct.slug, formData);
        } else {
          console.warn("Product has no slug, trying ID as fallback (might fail if backend implies strict slug)");
          await productService.updateProduct(selectedProduct.id, formData);
        }
        // toast({ title: "Success", description: "Product updated successfully" });
      } else {
        // Create
        await productService.createProduct(formData);
        // toast({ title: "Success", description: "Product created successfully" });
      }
      setIsModalOpen(false);
      fetchProducts(); // Reload list
    } catch (error) {
      console.error("Failed to save product:", error);
      // toast({ title: "Error", description: "Failed to save product", variant: "destructive" });
      alert("Failed to save product completely. Check console for details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto flex flex-col gap-6">
      <ProductHeader onAddClick={handleCreate} />
      <ProductFilter filters={filters} onFilterChange={handleFilterChange} />

      {loading ? (
        <div className="text-center py-20 text-slate-500">Loading products...</div>
      ) : (
        <ProductTable
          products={filteredProducts}
          onEditClick={handleEdit}
          onViewClick={handleView}
        />
      )}

      {/* Create/Edit Modal */}
      <ProductForm
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSubmit={handleSubmit}
        initialData={selectedProduct}
        loading={isSubmitting}
      />

      {/* View Detail Modal */}
      <ProductDetailModal
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        product={selectedProduct}
        onEdit={handleEdit}
      />
    </div>
  );
};

export default ProductPage;
