package com.sba301.retailmanagement.controller;

import com.sba301.retailmanagement.dto.request.CategoryRequest;
import com.sba301.retailmanagement.dto.request.ProductRequest;
import com.sba301.retailmanagement.dto.request.ProductVariantRequest;
import com.sba301.retailmanagement.dto.response.CategoryResponse;
import com.sba301.retailmanagement.dto.response.ProductResponse;
import com.sba301.retailmanagement.dto.response.ProductVariantResponse;
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
import jakarta.validation.Valid;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;
import org.springframework.security.access.prepost.PreAuthorize;
import static com.sba301.retailmanagement.security.SecurityConstants.*;

@Slf4j
@RestController
@RequestMapping(value = "/api/product", produces = "application/json")
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

    @PreAuthorize("hasAuthority('" + PRODUCT_VIEW + "')")
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

    @PreAuthorize("hasAuthority('" + PRODUCT_VIEW + "')")
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

    @PreAuthorize("hasAuthority('" + PRODUCT_VIEW + "')")
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

    @PreAuthorize("hasAuthority('" + PRODUCT_CREATE + "')")
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

    @PreAuthorize("hasAuthority('" + PRODUCT_UPDATE + "')")
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

    @PreAuthorize("hasAuthority('" + PRODUCT_DELETE + "')")
    @DeleteMapping("/{id}")
    public String deleteProduct(@PathVariable Long id) {
        try {
            productService.deleteProduct(id);
            return ResponseJson.toJsonString(ApiCode.SUCCESSFUL, "Product deleted successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseJson.toJsonString(ApiCode.ERROR_INTERNAL, "Error deleting product: " + e.getMessage());
        }
    }

    @PreAuthorize("hasAuthority('" + PRODUCT_VIEW + "')")
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

    @PreAuthorize("hasAuthority('" + PRODUCT_VIEW + "')")
    @GetMapping("/categories")
    public String getCategories() {
        try {
            return ResponseJson.toJsonWithData(ApiCode.SUCCESSFUL, "Categories fetched",
                    productService.getCategoriesWithCount());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseJson.toJsonString(ApiCode.ERROR_INTERNAL, "Error fetching categories: " + e.getMessage());
        }
    }

    @PreAuthorize("hasAuthority('" + PRODUCT_VIEW + "')")
    @GetMapping("/categories/{id}")
    public String getCategoryById(@PathVariable Long id) {
        try {
            CategoryResponse response = productService.getCategoryById(id);
            return ResponseJson.toJsonWithData(ApiCode.SUCCESSFUL, "Category fetched successfully", response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseJson.toJsonString(ApiCode.ERROR_INTERNAL, "Error fetching category: " + e.getMessage());
        }
    }

    @PreAuthorize("hasAuthority('" + PRODUCT_CREATE + "')")
    @PostMapping("/categories")
    public String createCategory(@Valid @RequestBody CategoryRequest request) {
        try {
            CategoryResponse response = productService.createCategory(request);
            return ResponseJson.toJsonWithData(ApiCode.SUCCESSFUL, "Category created successfully", response);
        } catch (IllegalArgumentException e) {
            return ResponseJson.toJsonString(ApiCode.UNSUCCESSFUL, e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseJson.toJsonString(ApiCode.ERROR_INTERNAL, "Error creating category: " + e.getMessage());
        }
    }

    @PreAuthorize("hasAuthority('" + PRODUCT_UPDATE + "')")
    @PutMapping("/categories/{id}")
    public String updateCategory(@PathVariable Long id, @Valid @RequestBody CategoryRequest request) {
        try {
            CategoryResponse response = productService.updateCategory(id, request);
            return ResponseJson.toJsonWithData(ApiCode.SUCCESSFUL, "Category updated successfully", response);
        } catch (IllegalArgumentException e) {
            return ResponseJson.toJsonString(ApiCode.UNSUCCESSFUL, e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseJson.toJsonString(ApiCode.ERROR_INTERNAL, "Error updating category: " + e.getMessage());
        }
    }

    @PreAuthorize("hasAuthority('" + PRODUCT_DELETE + "')")
    @DeleteMapping("/categories/{id}")
    public String deleteCategory(@PathVariable Long id) {
        try {
            productService.deleteCategory(id);
            return ResponseJson.toJsonString(ApiCode.SUCCESSFUL, "Category deleted successfully");
        } catch (IllegalStateException e) {
            return ResponseJson.toJsonString(ApiCode.UNSUCCESSFUL, e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseJson.toJsonString(ApiCode.ERROR_INTERNAL, "Error deleting category: " + e.getMessage());
        }
    }

    // --- Product Variant Endpoints ---

    @PostMapping("/{productId}/variants")
    public String createProductVariants(@PathVariable Long productId, @RequestBody ProductVariantRequest request) {
        try {
            List<ProductVariantResponse> response = productService.createProductVariants(productId, request);
            return ResponseJson.toJsonWithData(ApiCode.SUCCESSFUL, "Variants created successfully", response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseJson.toJsonString(ApiCode.ERROR_INTERNAL, "Error creating variants: " + e.getMessage());
        }
    }
}
