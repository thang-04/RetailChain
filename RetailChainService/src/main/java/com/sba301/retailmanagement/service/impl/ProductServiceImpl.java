package com.sba301.retailmanagement.service.impl;

import com.sba301.retailmanagement.dto.request.ProductRequest;
import com.sba301.retailmanagement.dto.response.ProductResponse;
import com.sba301.retailmanagement.dto.response.ProductVariantResponse;
import com.sba301.retailmanagement.entity.Product;
import com.sba301.retailmanagement.entity.ProductVariant;
import com.sba301.retailmanagement.exception.ResourceNotFoundException;
import com.sba301.retailmanagement.repository.ProductRepository;
import com.sba301.retailmanagement.repository.ProductVariantRepository;
import com.sba301.retailmanagement.service.ProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
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
        return products.stream()
                .map(this::mapToProductResponseWithVariants)
                .collect(Collectors.toList());
    }

    /**
     * Lấy danh sách sản phẩm có phân trang
     */
    public Page<ProductResponse> getAllProductsPaged(int page, int size) {
        String prefix = "[getAllProductsPaged]";
        log.info("{}|START|page={}, size={}", prefix, page, size);
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Product> productsPage = productRepository.findAll(pageable);
            Page<ProductResponse> response = productsPage.map(this::mapToProductResponseWithVariants);
            log.info("{}|END|totalElements={}", prefix, response.getTotalElements());
            return response;
        } catch (Exception e) {
            log.error("{}|Exception={}", prefix, e.getMessage(), e);
            throw new RuntimeException("Error retrieving products: " + e.getMessage());
        }
    }

    @Override
    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        return mapToProductResponseWithVariants(product);
    }

    @Override
    @Transactional
    public ProductResponse createProduct(ProductRequest request) {
        if (productRepository.existsByCode(request.getCode())) {
            throw new IllegalArgumentException("Product code already exists");
        }
        Product product = new Product();
        mapRequestToProduct(request, product);
        product.setCreatedAt(LocalDateTime.now());
        product.setUpdatedAt(LocalDateTime.now());
        Product saved = productRepository.save(product);
        return mapToProductResponseWithVariants(saved);
    }

    @Override
    @Transactional
    public ProductResponse updateProduct(Long id, ProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        
        if (request.getCode() != null && !request.getCode().equals(product.getCode())) {
             if (productRepository.existsByCode(request.getCode())) {
                throw new IllegalArgumentException("Product code already exists");
            }
        }

        mapRequestToProduct(request, product);
        product.setUpdatedAt(LocalDateTime.now());
        Product saved = productRepository.save(product);
        return mapToProductResponseWithVariants(saved);
    }

    @Override
    @Transactional
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Product not found with id: " + id);
        }
        // JPA cascade delete sẽ tự xóa các variants liên quan
        // nếu đã cấu hình đúng trong Entity
        productRepository.deleteById(id);
    }

    private void mapRequestToProduct(ProductRequest request, Product product) {
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

    /**
     * Map Product entity sang ProductResponse - đã bao gồm variants
     * Sử dụng query có điều kiện để tránh N+1 query
     */
    private ProductResponse mapToProductResponseWithVariants(Product product) {
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

        // Fix N+1 query: Sử dụng query có điều kiện WHERE product_id = ?
        // thay vì findAll() rồi filter trong memory
        List<ProductVariant> variants = productVariantRepository.findByProductId(product.getId());

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
