package com.sba301.retailmanagement.service;

import com.sba301.retailmanagement.dto.response.ProductResponse;
import java.util.List;

public interface ProductService {
    List<ProductResponse> getAllProducts();
    ProductResponse getProductById(Long id);
    ProductResponse createProduct(com.sba301.retailmanagement.dto.request.ProductRequest request);
    ProductResponse updateProduct(Long id, com.sba301.retailmanagement.dto.request.ProductRequest request);
    void deleteProduct(Long id);
}
