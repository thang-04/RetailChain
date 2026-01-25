import React, { useEffect, useState } from "react";
import ProductHeader from "./components/ProductHeader/ProductHeader";
import ProductFilter from "./components/FilterBar/ProductFilter";
import ProductTable from "./components/ProductTable/ProductTable";
import productService from "../../services/product.service";

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productService.getAllProducts();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="max-w-[1400px] mx-auto flex flex-col gap-6">
      <ProductHeader />
      <ProductFilter />
      {loading ? (
        <div className="text-center py-10">Loading products...</div>
      ) : (
        <ProductTable products={products} />
      )}
    </div>
  );
};

export default ProductPage;
