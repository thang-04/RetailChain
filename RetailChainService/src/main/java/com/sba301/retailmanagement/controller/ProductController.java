package com.sba301.retailmanagement.controller;

import com.sba301.retailmanagement.dto.response.ProductResponse;
import com.sba301.retailmanagement.service.ProductService;
import com.sba301.retailmanagement.utils.ApiCode;
import com.sba301.retailmanagement.utils.ResponseJson;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping("/{id}")
    public String getProductById(@PathVariable Long id) {
        String prefix = "[getProductById]|id=" + id;
        try {
            ProductResponse response = productService.getProductById(id);
            if (response == null) {
                return ResponseJson.toJsonString(ApiCode.UNSUCCESSFUL, "Product not found");
            }
            return ResponseJson.toJsonWithData(ApiCode.SUCCESSFUL, "Product detail retrieved successfully", response);
        } catch (Exception e) {
            System.err.println(prefix + "|Exception=" + e.getMessage());
            return ResponseJson.toJsonString(ApiCode.ERROR_INTERNAL, "Error retrieving product: " + e.getMessage());
        }
    }

    @PostMapping
    public String createProduct(@RequestBody com.sba301.retailmanagement.dto.request.ProductRequest request) {
        String prefix = "[createProduct]|code=" + request.getCode();
        try {
            ProductResponse response = productService.createProduct(request);
            return ResponseJson.toJsonWithData(ApiCode.SUCCESSFUL, "Create product success", response);
        } catch (Exception e) {
            System.err.println(prefix + "|Exception=" + e.getMessage());
            return ResponseJson.toJsonString(ApiCode.ERROR_INTERNAL, "Error creating product: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public String updateProduct(@PathVariable Long id, @RequestBody com.sba301.retailmanagement.dto.request.ProductRequest request) {
        String prefix = "[updateProduct]|id=" + id;
        try {
            ProductResponse response = productService.updateProduct(id, request);
            return ResponseJson.toJsonWithData(ApiCode.SUCCESSFUL, "Update product success", response);
        } catch (Exception e) {
            System.err.println(prefix + "|Exception=" + e.getMessage());
            return ResponseJson.toJsonString(ApiCode.ERROR_INTERNAL, "Error updating product: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public String deleteProduct(@PathVariable Long id) {
        String prefix = "[deleteProduct]|id=" + id;
        try {
            productService.deleteProduct(id);
            return ResponseJson.toJsonString(ApiCode.SUCCESSFUL, "Delete product success");
        } catch (Exception e) {
            System.err.println(prefix + "|Exception=" + e.getMessage());
            return ResponseJson.toJsonString(ApiCode.ERROR_INTERNAL, "Error deleting product: " + e.getMessage());
        }
    }
}
