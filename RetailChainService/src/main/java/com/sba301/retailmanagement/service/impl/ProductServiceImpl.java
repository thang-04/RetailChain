package com.sba301.retailmanagement.service.impl;

import com.sba301.retailmanagement.dto.response.ProductResponse;
import com.sba301.retailmanagement.dto.response.ProductVariantResponse;
import com.sba301.retailmanagement.entity.Product;
import com.sba301.retailmanagement.entity.ProductVariant;
import com.sba301.retailmanagement.repository.ProductRepository;
import com.sba301.retailmanagement.repository.ProductVariantRepository;
import com.sba301.retailmanagement.service.ProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final ProductVariantRepository productVariantRepository;

    @Override
    public List<ProductResponse> getAllProducts() {
        List<Product> products = productRepository.findAll();
        return products.stream().map(this::mapToProductResponse).collect(Collectors.toList());
    }

    @Override
    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        return mapToProductResponse(product);
    }

    @Override
    @org.springframework.transaction.annotation.Transactional
    public ProductResponse createProduct(com.sba301.retailmanagement.dto.request.ProductRequest request) {
        if (productRepository.existsByCode(request.getCode())) {
            throw new RuntimeException("Product code already exists");
        }
        Product product = new Product();
        mapRequestToProduct(request, product);
        product.setCreatedAt(java.time.LocalDateTime.now());
        product.setUpdatedAt(java.time.LocalDateTime.now());
        Product saved = productRepository.save(product);
        return mapToProductResponse(saved);
    }

    @Override
    @org.springframework.transaction.annotation.Transactional
    public ProductResponse updateProduct(Long id, com.sba301.retailmanagement.dto.request.ProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        
        if (request.getCode() != null && !request.getCode().equals(product.getCode())) {
             if (productRepository.existsByCode(request.getCode())) {
                throw new RuntimeException("Product code already exists");
            }
        }

        mapRequestToProduct(request, product);
        product.setUpdatedAt(java.time.LocalDateTime.now());
        Product saved = productRepository.save(product);
        return mapToProductResponse(saved);
    }

    @Override
    @org.springframework.transaction.annotation.Transactional
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new RuntimeException("Product not found");
        }
        // Should verify constraints (inventory, history) before delete
        // For now, simple delete
        productVariantRepository.deleteAll(productVariantRepository.findAll().stream()
                .filter(v -> v.getProductId().equals(id)).collect(Collectors.toList()));
        productRepository.deleteById(id);
    }

    private void mapRequestToProduct(com.sba301.retailmanagement.dto.request.ProductRequest request, Product product) {
        if (request.getCode() != null) product.setCode(request.getCode());
        if (request.getName() != null) product.setName(request.getName());
        if (request.getDescription() != null) product.setDescription(request.getDescription());
        if (request.getCategoryId() != null) product.setCategoryId(request.getCategoryId());
        if (request.getStatus() != null) product.setStatus(request.getStatus());
        if (request.getGender() != null) {
            try {
                product.setGender(com.sba301.retailmanagement.enums.Gender.valueOf(request.getGender()));
            } catch (Exception e) {
                // Ignore invalid enum
            }
        }
    }

    private ProductResponse mapToProductResponse(Product product) {
        ProductResponse dto = new ProductResponse();
        dto.setId(product.getId());
        dto.setCategoryId(product.getCategoryId());
        dto.setCode(product.getCode());
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setGender(product.getGender() != null ? product.getGender().name() : null);
        dto.setStatus(product.getStatus());
        dto.setCreatedAt(product.getCreatedAt());
        dto.setUpdatedAt(product.getUpdatedAt());

        // Fetch variants
        // Optimized: In real app, fetch all variants in batch or use @OneToMany
        // Here we fetch simply for correctness
        List<ProductVariant> variants = productVariantRepository.findAll().stream()
                .filter(v -> v.getProductId().equals(product.getId()))
                .collect(Collectors.toList());

        List<ProductVariantResponse> variantDtos = variants.stream().map(v -> {
            ProductVariantResponse vDto = new ProductVariantResponse();
            vDto.setId(v.getId());
            vDto.setProductId(v.getProductId());
            vDto.setSku(v.getSku());
            vDto.setBarcode(v.getBarcode());
            vDto.setSize(v.getSize());
            vDto.setColor(v.getColor());
            vDto.setPrice(v.getPrice());
            vDto.setStatus(v.getStatus());
            vDto.setCreatedAt(v.getCreatedAt());
            vDto.setUpdatedAt(v.getUpdatedAt());
            return vDto;
        }).collect(Collectors.toList());

        dto.setVariants(variantDtos);
        return dto;
    }
}
