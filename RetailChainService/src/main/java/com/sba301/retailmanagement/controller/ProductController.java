package com.sba301.retailmanagement.controller;

import com.sba301.retailmanagement.dto.response.ProductResponse;
import com.sba301.retailmanagement.service.ProductService;
import com.sba301.retailmanagement.utils.ApiCode;
import com.sba301.retailmanagement.utils.ResponseJson;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/product")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public String getAllProducts() {
        String prefix = "[getAllProducts]";
        try {
            List<ProductResponse> response = productService.getAllProducts();
            return ResponseJson.toJsonWithData(ApiCode.SUCCESSFUL, "Products retrieved successfully", response);
        } catch (Exception e) {
            // Use system out if log is not available due to Lombok issues in editor
            System.err.println(prefix + "|Exception=" + e.getMessage());
            e.printStackTrace();
            return ResponseJson.toJsonString(ApiCode.ERROR_INTERNAL, "Error retrieving products: " + e.getMessage());
        }
    }
}
