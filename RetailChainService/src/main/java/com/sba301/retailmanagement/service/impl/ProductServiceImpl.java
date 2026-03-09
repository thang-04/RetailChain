package com.sba301.retailmanagement.service.impl;

import com.sba301.retailmanagement.dto.request.ProductRequest;
import com.sba301.retailmanagement.dto.request.ProductVariantRequest;
import com.sba301.retailmanagement.dto.response.ProductResponse;
import com.sba301.retailmanagement.dto.response.ProductVariantResponse;
import com.sba301.retailmanagement.entity.Product;
import com.sba301.retailmanagement.entity.ProductCategory;
import com.sba301.retailmanagement.entity.ProductVariant;
import com.sba301.retailmanagement.entity.InventoryStock;
import com.sba301.retailmanagement.entity.InventoryStockId;
import com.sba301.retailmanagement.entity.Warehouse;
import com.sba301.retailmanagement.enums.Gender;
import com.sba301.retailmanagement.exception.ResourceNotFoundException;
import com.sba301.retailmanagement.repository.ProductCategoryRepository;
import com.sba301.retailmanagement.repository.ProductRepository;
import com.sba301.retailmanagement.repository.ProductVariantRepository;
import com.sba301.retailmanagement.repository.InventoryStockRepository;
import com.sba301.retailmanagement.repository.WarehouseRepository;
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
    private final InventoryStockRepository inventoryStockRepository;
    private final WarehouseRepository warehouseRepository;

    @Override
    public List<ProductResponse> getAllProducts() {
        // Fetch all products
        List<Product> products = productRepository.findAll();

        // Fetch all variants and group by product ID (Optimization: avoids N+1 query
        // issue)
        List<ProductVariant> allVariants = productVariantRepository.findAll();
        Map<Long, List<ProductVariant>> variantsByProduct = allVariants.stream()
                .collect(Collectors.groupingBy(ProductVariant::getProductId));

        return products.stream()
                .map(product -> mapToResponse(product,
                        variantsByProduct.getOrDefault(product.getId(), Collections.emptyList())))
                .collect(Collectors.toList());
    }

    @Override
    public ProductResponse createProduct(ProductRequest request) {
        Product product = new Product();
        mapRequestToEntity(request, product);

        // Auto-generate code if category is present and code is not manually set (or
        // just always for consistency enforcement)
        if (request.getCategoryId() != null) {
            String newCode = generateProductCode(request.getCategoryId());
            product.setCode(newCode);
        } else {
            throw new IllegalArgumentException("Category ID is required to generate product code");
        }

        // Default values for new product
        product.setStatus(1); // Active
        product.setCreatedAt(LocalDateTime.now());
        product.setUpdatedAt(LocalDateTime.now());

        Product savedProduct = productRepository.save(product);
        return mapToResponse(savedProduct, Collections.emptyList());
    }

    @Override
    public ProductResponse updateProduct(String slug, ProductRequest request) {
        Product product = productRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with slug: " + slug));

        mapRequestToEntity(request, product);
        product.setUpdatedAt(LocalDateTime.now());

        Product savedProduct = productRepository.save(product);

        // Fetch existing variants to include in the response
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

    // --- Helper Methods ---

    private String generateProductCode(Long categoryId) {
        com.sba301.retailmanagement.entity.ProductCategory category = productCategoryRepository
                .findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        // Generate Prefix: T-Shirt -> TSHIRT
        String prefix = category.getName().toUpperCase().replaceAll("[^A-Z0-9]", "");
        if (prefix.isEmpty()) {
            prefix = "PROD"; // Fallback
        }

        // Find last code
        String searchPrefix = prefix + "-";
        java.util.Optional<Product> lastProduct = productRepository
                .findTopByCodeStartingWithOrderByCodeDesc(searchPrefix);

        int nextId = 1;
        if (lastProduct.isPresent()) {
            String lastCode = lastProduct.get().getCode();
            // Extract number part: TSHIRT-001 -> 001
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

    @Override
    @Transactional
    public ProductVariantResponse createProductVariant(Long productId, ProductVariantRequest request) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));

        ProductVariant variant = new ProductVariant();
        variant.setProductId(productId);

        // Use provided SKU or generate one: PRODCODE-COLOR-SIZE
        if (request.getSku() != null && !request.getSku().trim().isEmpty()) {
            variant.setSku(request.getSku());
        } else {
            String colorStr = request.getColor() != null ? request.getColor().toUpperCase().replaceAll("\\s+", "")
                    : "NOCLR";
            String sizeStr = request.getSize() != null ? request.getSize().toUpperCase().replaceAll("\\s+", "")
                    : "NOSIZE";
            variant.setSku(product.getCode() + "-" + colorStr + "-" + sizeStr);
        }

        variant.setBarcode(request.getBarcode());
        variant.setSize(request.getSize());
        variant.setColor(request.getColor());
        variant.setPrice(request.getPrice());
        variant.setStatus(request.getStatus() != null ? request.getStatus() : 1);
        variant.setCreatedAt(LocalDateTime.now());
        variant.setUpdatedAt(LocalDateTime.now());

        ProductVariant savedVariant = productVariantRepository.save(variant);

        if (request.getInitialQuantity() != null && request.getInitialQuantity() > 0) {
            Long warehouseId = request.getWarehouseId();
            Warehouse warehouse;
            if (warehouseId == null) {
                // If not provided, try to find the very first warehouse
                List<Warehouse> warehouses = warehouseRepository.findAll();
                if (warehouses.isEmpty()) {
                    throw new ResourceNotFoundException("No warehouses exist to store initial stock");
                }
                warehouse = warehouses.get(0);
            } else {
                warehouse = warehouseRepository.findById(warehouseId)
                        .orElseThrow(
                                () -> new ResourceNotFoundException("Warehouse not found with id: " + warehouseId));
            }

            InventoryStock stock = new InventoryStock();
            stock.setId(new InventoryStockId(warehouse.getId(), savedVariant.getId()));
            stock.setWarehouse(warehouse);
            stock.setVariant(savedVariant);
            stock.setQuantity(request.getInitialQuantity());
            stock.setUpdatedAt(LocalDateTime.now());
            inventoryStockRepository.save(stock);
        }

        ProductVariantResponse vDto = new ProductVariantResponse();
        vDto.setId(savedVariant.getId());
        vDto.setProductId(savedVariant.getProductId());
        vDto.setSku(savedVariant.getSku());
        vDto.setBarcode(savedVariant.getBarcode());
        vDto.setSize(savedVariant.getSize());
        vDto.setColor(savedVariant.getColor());
        vDto.setPrice(savedVariant.getPrice());
        vDto.setStatus(savedVariant.getStatus());
        vDto.setCreatedAt(savedVariant.getCreatedAt());
        vDto.setUpdatedAt(savedVariant.getUpdatedAt());

        return vDto;
    }

    @Override
    public List<ProductCategory> getAllCategories() {
        return productCategoryRepository.findAll();
    }

    private void mapRequestToEntity(ProductRequest request, Product product) {
        product.setCategoryId(request.getCategoryId());
        // Code is auto-generated on create and immutable on update
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setImage(request.getImage());

        if (request.getGender() != null) {
            try {
                product.setGender(Gender.valueOf(request.getGender().toUpperCase()));
            } catch (IllegalArgumentException e) {
                // Handle invalid gender string gracefully, or let it throw if strict validation
                // is needed
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
