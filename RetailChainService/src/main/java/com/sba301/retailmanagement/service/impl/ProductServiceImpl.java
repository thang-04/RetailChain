package com.sba301.retailmanagement.service.impl;

import com.sba301.retailmanagement.dto.request.ProductRequest;
import com.sba301.retailmanagement.dto.response.ProductResponse;
import com.sba301.retailmanagement.dto.response.ProductVariantResponse;
import com.sba301.retailmanagement.entity.Product;
import com.sba301.retailmanagement.entity.ProductCategory;
import com.sba301.retailmanagement.entity.ProductVariant;
import com.sba301.retailmanagement.enums.Gender;
import com.sba301.retailmanagement.exception.ResourceNotFoundException;
import com.sba301.retailmanagement.repository.ProductCategoryRepository;
import com.sba301.retailmanagement.repository.ProductRepository;
import com.sba301.retailmanagement.repository.ProductVariantRepository;
import com.sba301.retailmanagement.service.ProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final ProductVariantRepository productVariantRepository;
    private final ProductCategoryRepository productCategoryRepository;

    @Override
    public List<ProductResponse> getAllProducts() {
        List<Product> products = productRepository.findAll();

        List<ProductVariant> allVariants = productVariantRepository.findAll();
        Map<Long, List<ProductVariant>> variantsByProduct = allVariants.stream()
                .collect(Collectors.groupingBy(ProductVariant::getProductId));

        return products.stream()
                .map(product -> mapToResponse(product,
                        variantsByProduct.getOrDefault(product.getId(), Collections.emptyList())))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ProductResponse createProduct(ProductRequest request) {
        Product product = new Product();
        mapRequestToEntity(request, product);

        if (request.getCategoryId() != null) {
            String newCode = generateProductCode(request.getCategoryId());
            product.setCode(newCode);
        } else {
            throw new IllegalArgumentException("Category ID is required to generate product code");
        }

        product.setStatus(1);
        product.setCreatedAt(LocalDateTime.now());
        product.setUpdatedAt(LocalDateTime.now());

        Product savedProduct = productRepository.save(product);
        return mapToResponse(savedProduct, Collections.emptyList());
    }

    @Override
    @Transactional
    public ProductResponse updateProduct(String slug, ProductRequest request) {
        Product product = productRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with slug: " + slug));

        mapRequestToEntity(request, product);
        product.setUpdatedAt(LocalDateTime.now());

        Product savedProduct = productRepository.save(product);

        List<ProductVariant> variants = productVariantRepository.findByProductId(savedProduct.getId());
        return mapToResponse(savedProduct, variants);
    }

    @Override
    public ProductResponse getProductBySlug(String slug) {
        Product product = productRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with slug: " + slug));

        List<ProductVariant> variants = productVariantRepository.findByProductId(product.getId());
        return mapToResponse(product, variants);
    }

    @Override
    public String getNextProductCode(Long categoryId) {
        return generateProductCode(categoryId);
    }

    @Override
    public List<ProductCategory> getAllCategories() {
        return productCategoryRepository.findAll();
    }

    private String generateProductCode(Long categoryId) {
        ProductCategory category = productCategoryRepository
                .findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        String prefix = category.getName().toUpperCase().replaceAll("[^A-Z0-9]", "");
        if (prefix.isEmpty()) {
            prefix = "PROD";
        }

        String searchPrefix = prefix + "-";
        java.util.Optional<Product> lastProduct = productRepository
                .findTopByCodeStartingWithOrderByCodeDesc(searchPrefix);

        int nextId = 1;
        if (lastProduct.isPresent()) {
            String lastCode = lastProduct.get().getCode();
            if (lastCode.length() > searchPrefix.length()) {
                String numberPart = lastCode.substring(searchPrefix.length());
                try {
                    nextId = Integer.parseInt(numberPart) + 1;
                } catch (NumberFormatException e) {
                    nextId = 1;
                }
            }
        }

        return String.format("%s-%03d", prefix, nextId);
    }

    private void mapRequestToEntity(ProductRequest request, Product product) {
        product.setCategoryId(request.getCategoryId());
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setImage(request.getImage());

        if (request.getGender() != null) {
            try {
                product.setGender(Gender.valueOf(request.getGender().toUpperCase()));
            } catch (IllegalArgumentException e) {
                log.warn("Invalid gender value: {}", request.getGender());
            }
        }

        if (request.getStatus() != null) {
            product.setStatus(request.getStatus());
        }
    }

    private ProductResponse mapToResponse(Product product, List<ProductVariant> variants) {
        ProductResponse dto = new ProductResponse();
        dto.setId(product.getId());
        dto.setCategoryId(product.getCategoryId());
        dto.setCode(product.getCode());
        dto.setSlug(product.getSlug());
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setImage(product.getImage());
        dto.setGender(product.getGender() != null ? product.getGender().name() : null);
        dto.setStatus(product.getStatus());
        dto.setCreatedAt(product.getCreatedAt());
        dto.setUpdatedAt(product.getUpdatedAt());

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
