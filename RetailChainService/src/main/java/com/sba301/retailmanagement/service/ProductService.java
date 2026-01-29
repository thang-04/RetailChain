package com.sba301.retailmanagement.service;

import com.sba301.retailmanagement.dto.response.ProductResponse;
import java.util.List;

public interface ProductService {
    List<ProductResponse> getAllProducts();
}
