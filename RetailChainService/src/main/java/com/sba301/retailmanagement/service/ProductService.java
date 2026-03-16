package com.sba301.retailmanagement.service;

import com.sba301.retailmanagement.dto.request.CategoryRequest;
import com.sba301.retailmanagement.dto.request.ProductRequest;
import com.sba301.retailmanagement.dto.request.ProductVariantRequest;
import com.sba301.retailmanagement.dto.response.CategoryResponse;
import com.sba301.retailmanagement.dto.response.ProductResponse;
import com.sba301.retailmanagement.dto.response.ProductVariantResponse;
import com.sba301.retailmanagement.dto.response.ProductExistsResponse;
import com.sba301.retailmanagement.entity.ProductCategory;
import java.util.List;

public interface ProductService {
    List<ProductResponse> getAllProducts();

    ProductResponse createProduct(ProductRequest request);

    ProductResponse updateProduct(String slug, ProductRequest request);

    ProductResponse getProductBySlug(String slug);

    String getNextProductCode(Long categoryId);

    List<ProductCategory> getAllCategories();

    // --- Category CRUD ---
    List<CategoryResponse> getCategoriesWithCount();

    CategoryResponse getCategoryById(Long id);

    CategoryResponse createCategory(CategoryRequest request);

    CategoryResponse updateCategory(Long id, CategoryRequest request);

    void deleteCategory(Long id);

    ProductVariantResponse createProductVariant(Long productId, ProductVariantRequest request);

    List<ProductVariantResponse> createProductVariants(Long productId, ProductVariantRequest request);

    ProductExistsResponse checkSkuExists(String sku);
}
