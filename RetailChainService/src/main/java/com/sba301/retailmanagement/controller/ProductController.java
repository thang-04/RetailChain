package com.sba301.retailmanagement.controller;

import com.sba301.retailmanagement.dto.request.ProductRequest;
import com.sba301.retailmanagement.dto.response.ProductResponse;
import com.sba301.retailmanagement.service.ProductService;
import com.sba301.retailmanagement.utils.ApiCode;
import com.sba301.retailmanagement.utils.ResponseJson;

import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/product")
public class ProductController {

    private final ProductService productService;
    private final Path fileStorageLocation;

    public ProductController(ProductService productService) {
        this.productService = productService;
        this.fileStorageLocation = Paths.get("uploads").toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }

    // --- File Upload Logic ---

    @PostMapping("/upload")
    public String uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            // Normalize file name
            String originalFileName = StringUtils.cleanPath(file.getOriginalFilename());
            String fileExtension = "";
            try {
                fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
            } catch (Exception e) {
                fileExtension = "";
            }

            // Generate unique UUID file name
            String fileName = UUID.randomUUID().toString() + fileExtension;

            // Copy file to the target location
            Path targetLocation = this.fileStorageLocation.resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            // Build file download URI
            // Note: pointing to THIS controller's download endpoint
            String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("/api/product/uploads/")
                    .path(fileName)
                    .toUriString();

            return ResponseJson.toJsonWithData(ApiCode.SUCCESSFUL, "File uploaded successfully", fileDownloadUri);
        } catch (IOException ex) {
            return ResponseJson.toJsonString(ApiCode.ERROR_INTERNAL, "Could not upload file: " + ex.getMessage());
        }
    }

    @GetMapping("/uploads/{fileName:.+}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String fileName) {
        try {
            Path filePath = this.fileStorageLocation.resolve(fileName).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists()) {
                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType("application/octet-stream"))
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (MalformedURLException ex) {
            return ResponseEntity.badRequest().build();
        }
    }

    // --- Product Endpoints ---

    @GetMapping
    public String getAllProducts() {
        try {
            List<ProductResponse> response = productService.getAllProducts();
            return ResponseJson.toJsonWithData(ApiCode.SUCCESSFUL, "Products retrieved successfully", response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseJson.toJsonString(ApiCode.ERROR_INTERNAL, "Error retrieving products: " + e.getMessage());
        }
    }

    @GetMapping("/{slug}")
    public String getProductBySlug(@PathVariable String slug) {
        try {
            ProductResponse response = productService.getProductBySlug(slug);
            return ResponseJson.toJsonWithData(ApiCode.SUCCESSFUL, "Product retrieved successfully", response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseJson.toJsonString(ApiCode.ERROR_INTERNAL, "Error retrieving product: " + e.getMessage());
        }
    }

    @PostMapping
    public String createProduct(@RequestBody ProductRequest request) {
        try {
            ProductResponse response = productService.createProduct(request);
            return ResponseJson.toJsonWithData(ApiCode.SUCCESSFUL, "Product created successfully", response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseJson.toJsonString(ApiCode.ERROR_INTERNAL, "Error creating product: " + e.getMessage());
        }
    }

    @PutMapping("/{slug}")
    public String updateProduct(@PathVariable String slug, @RequestBody ProductRequest request) {
        try {
            ProductResponse response = productService.updateProduct(slug, request);
            return ResponseJson.toJsonWithData(ApiCode.SUCCESSFUL, "Product updated successfully", response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseJson.toJsonString(ApiCode.ERROR_INTERNAL, "Error updating product: " + e.getMessage());
        }
    }

    @GetMapping("/next-code")
    public String getNextCode(@RequestParam Long categoryId) {
        try {
            String nextCode = productService.getNextProductCode(categoryId);
            return ResponseJson.toJsonWithData(ApiCode.SUCCESSFUL, "Next product code retrieved", nextCode);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseJson.toJsonString(ApiCode.ERROR_INTERNAL, "Error generating next code: " + e.getMessage());
        }
    }

    @GetMapping("/categories")
    public String getCategories() {
        try {
            return ResponseJson.toJsonWithData(ApiCode.SUCCESSFUL, "Categories fetched",
                    productService.getAllCategories());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseJson.toJsonString(ApiCode.ERROR_INTERNAL, "Error fetching categories: " + e.getMessage());
        }
    }
}
