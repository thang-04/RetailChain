package com.sba301.retailmanagement.service.impl;

import com.sba301.retailmanagement.dto.request.CategoryRequest;
import com.sba301.retailmanagement.dto.request.ProductRequest;
import com.sba301.retailmanagement.dto.request.ProductVariantRequest;
import com.sba301.retailmanagement.dto.response.CategoryResponse;
import com.sba301.retailmanagement.dto.response.ProductExistsResponse;
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

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
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
        ProductVariant savedVariant = createSingleVariant(productId, request, request.getSize(), request.getColor(),
                request.getSku(), request.getBarcode());

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
    @Transactional
    public List<ProductVariantResponse> createProductVariants(Long productId, ProductVariantRequest request) {
        List<String> sizes = request.getSizes() != null ? request.getSizes() : Collections.emptyList();
        List<String> colors = request.getColors() != null ? request.getColors() : Collections.emptyList();

        // Fallback to single values if arrays are not provided
        if (sizes.isEmpty() && request.getSize() != null && !request.getSize().trim().isEmpty()) {
            sizes = List.of(request.getSize());
        }
        if (colors.isEmpty() && request.getColor() != null && !request.getColor().trim().isEmpty()) {
            colors = List.of(request.getColor());
        }

        if (sizes.isEmpty() && colors.isEmpty()) {
            throw new IllegalArgumentException("Phải truyền size/color hoặc danh sách sizes/colors để tạo variant");
        }

        List<ProductVariant> existingVariants = productVariantRepository.findByProductId(productId);
        Set<String> existingKeys = existingVariants.stream()
                .map(v -> normalizeKey(v.getSize()) + "|" + normalizeKey(v.getColor()))
                .collect(Collectors.toCollection(HashSet::new));

        List<ProductVariantResponse> result = new ArrayList<>();

        if (sizes.isEmpty()) {
            // Only colors
            for (String color : colors) {
                String key = normalizeKey(null) + "|" + normalizeKey(color);
                if (existingKeys.contains(key)) {
                    continue;
                }
                ProductVariant saved = createSingleVariant(productId, request, null, color, null, request.getBarcode());
                existingKeys.add(key);
                result.add(mapVariantToResponse(saved));
            }
            return result;
        }

        if (colors.isEmpty()) {
            // Only sizes
            for (String size : sizes) {
                String key = normalizeKey(size) + "|" + normalizeKey(null);
                if (existingKeys.contains(key)) {
                    continue;
                }
                ProductVariant saved = createSingleVariant(productId, request, size, null, null, request.getBarcode());
                existingKeys.add(key);
                result.add(mapVariantToResponse(saved));
            }
            return result;
        }

        // Cartesian product sizes x colors
        for (String size : sizes) {
            for (String color : colors) {
                String key = normalizeKey(size) + "|" + normalizeKey(color);
                if (existingKeys.contains(key)) {
                    continue;
                }
                ProductVariant saved = createSingleVariant(productId, request, size, color, null, request.getBarcode());
                existingKeys.add(key);
                result.add(mapVariantToResponse(saved));
            }
        }

        return result;
    }

    @Override
    public List<ProductCategory> getAllCategories() {
        return productCategoryRepository.findAll();
    }

    // =============================================
    // --- Category CRUD Methods ---
    // =============================================

    @Override
    public List<CategoryResponse> getCategoriesWithCount() {
        List<ProductCategory> categories = productCategoryRepository.findAll();
        return categories.stream().map(cat -> {
            long count = productRepository.countByCategoryId(cat.getId());
            return new CategoryResponse(cat.getId(), cat.getName(), count);
        }).collect(Collectors.toList());
    }

    @Override
    public CategoryResponse getCategoryById(Long id) {
        ProductCategory category = productCategoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Danh mục không tìm thấy với id: " + id));
        long count = productRepository.countByCategoryId(category.getId());
        return new CategoryResponse(category.getId(), category.getName(), count);
    }

    @Override
    @Transactional
    public CategoryResponse createCategory(CategoryRequest request) {
        if (productCategoryRepository.existsByName(request.getName())) {
            throw new IllegalArgumentException("Tên danh mục '" + request.getName() + "' đã tồn tại");
        }
        ProductCategory category = new ProductCategory();
        category.setName(request.getName());
        ProductCategory saved = productCategoryRepository.save(category);
        return new CategoryResponse(saved.getId(), saved.getName(), 0L);
    }

    @Override
    @Transactional
    public CategoryResponse updateCategory(Long id, CategoryRequest request) {
        ProductCategory category = productCategoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Danh mục không tìm thấy với id: " + id));

        // Kiểm tra tên trùng (ngoại trừ chính nó)
        productCategoryRepository.findByName(request.getName()).ifPresent(existing -> {
            if (!existing.getId().equals(id)) {
                throw new IllegalArgumentException("Tên danh mục '" + request.getName() + "' đã tồn tại");
            }
        });

        category.setName(request.getName());
        ProductCategory saved = productCategoryRepository.save(category);
        long count = productRepository.countByCategoryId(saved.getId());
        return new CategoryResponse(saved.getId(), saved.getName(), count);
    }

    @Override
    public ProductExistsResponse checkSkuExists(String sku) {
        return productVariantRepository.findBySku(sku)
                .map(variant -> {
                    Product product = productRepository.findById(variant.getProductId()).orElse(null);
                    return ProductExistsResponse.builder()
                            .exists(true)
                            .productId(variant.getProductId())
                            .code(product != null ? product.getCode() : null)
                            .build();
                })
                .orElse(ProductExistsResponse.builder()
                        .exists(false)
                        .build());
    }

    @Override
    @Transactional
    public void deleteCategory(Long id) {
        ProductCategory category = productCategoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Danh mục không tìm thấy với id: " + id));

        long productCount = productRepository.countByCategoryId(id);
        if (productCount > 0) {
            throw new IllegalStateException(
                    "Không thể xóa danh mục '" + category.getName() + "' vì còn " + productCount + " sản phẩm đang thuộc danh mục này");
        }
        productCategoryRepository.deleteById(id);
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

    private String normalizeKey(String value) {
        if (value == null) {
            return "";
        }
        return value.trim().toUpperCase().replaceAll("\\s+", "");
    }

    private ProductVariantResponse mapVariantToResponse(ProductVariant variant) {
        ProductVariantResponse vDto = new ProductVariantResponse();
        vDto.setId(variant.getId());
        vDto.setProductId(variant.getProductId());
        vDto.setSku(variant.getSku());
        vDto.setBarcode(variant.getBarcode());
        vDto.setSize(variant.getSize());
        vDto.setColor(variant.getColor());
        vDto.setPrice(variant.getPrice());
        vDto.setStatus(variant.getStatus());
        vDto.setCreatedAt(variant.getCreatedAt());
        vDto.setUpdatedAt(variant.getUpdatedAt());
        return vDto;
    }

    private ProductVariant createSingleVariant(Long productId, ProductVariantRequest request, String size, String color,
            String sku, String barcode) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));

        ProductVariant variant = new ProductVariant();
        variant.setProductId(productId);

        // Use provided SKU or generate one: PRODCODE-COLOR-SIZE
        if (sku != null && !sku.trim().isEmpty()) {
            variant.setSku(sku);
        } else {
            String colorStr = color != null ? color.toUpperCase().replaceAll("\\s+", "") : "NOCLR";
            String sizeStr = size != null ? size.toUpperCase().replaceAll("\\s+", "") : "NOSIZE";
            variant.setSku(product.getCode() + "-" + colorStr + "-" + sizeStr);
        }

        variant.setBarcode(barcode);
        variant.setSize(size);
        variant.setColor(color);
        variant.setPrice(request.getPrice());
        variant.setStatus(request.getStatus() != null ? request.getStatus() : 1);
        variant.setCreatedAt(LocalDateTime.now());
        variant.setUpdatedAt(LocalDateTime.now());

        ProductVariant savedVariant = productVariantRepository.save(variant);

        if (request.getInitialQuantity() != null && request.getInitialQuantity() > 0) {
            Warehouse warehouse = resolveWarehouseForInitialStock(request.getWarehouseId());
            InventoryStock stock = new InventoryStock();
            stock.setId(new InventoryStockId(warehouse.getId(), savedVariant.getId()));
            stock.setWarehouse(warehouse);
            stock.setVariant(savedVariant);
            stock.setQuantity(request.getInitialQuantity());
            stock.setUpdatedAt(LocalDateTime.now());
            inventoryStockRepository.save(stock);
        }

        return savedVariant;
    }

    private Warehouse resolveWarehouseForInitialStock(Long warehouseId) {
        if (warehouseId == null) {
            List<Warehouse> warehouses = warehouseRepository.findAll();
            if (warehouses.isEmpty()) {
                throw new ResourceNotFoundException("No warehouses exist to store initial stock");
            }
            return warehouses.get(0);
        }
        return warehouseRepository.findById(warehouseId)
                .orElseThrow(() -> new ResourceNotFoundException("Warehouse not found with id: " + warehouseId));
    }
}