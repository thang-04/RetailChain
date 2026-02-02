package com.sba301.retailmanagement.service;

import com.sba301.retailmanagement.dto.request.ProductRequest;
import com.sba301.retailmanagement.dto.response.ProductResponse;
import java.util.List;

public interface ProductService {
    List<ProductResponse> getAllProducts();

    ProductResponse createProduct(ProductRequest request);

    ProductResponse updateProduct(String slug, ProductRequest request);

    ProductResponse getProductBySlug(String slug);
}
