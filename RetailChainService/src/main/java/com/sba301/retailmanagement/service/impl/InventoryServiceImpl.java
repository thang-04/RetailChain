package com.sba301.retailmanagement.service.impl;

import com.sba301.retailmanagement.dto.request.InventoryAdjustRequest;
import com.sba301.retailmanagement.dto.request.InventoryItemRequest;
import com.sba301.retailmanagement.dto.request.StockRequest;
import com.sba301.retailmanagement.dto.request.TransferRequest;
import com.sba301.retailmanagement.dto.request.WarehouseRequest;
import com.sba301.retailmanagement.dto.response.InventoryDocumentResponse;
import com.sba301.retailmanagement.dto.response.InventoryDocumentItemResponse;
import com.sba301.retailmanagement.dto.response.InventoryDetailResponse;
import com.sba301.retailmanagement.dto.response.InventoryOverviewResponse;
import com.sba301.retailmanagement.dto.response.InventoryStockResponse;
import com.sba301.retailmanagement.dto.response.WarehouseResponse;
import com.sba301.retailmanagement.entity.*;
import com.sba301.retailmanagement.enums.InventoryAction;
import com.sba301.retailmanagement.enums.InventoryDocumentType;
import com.sba301.retailmanagement.enums.RoleConstant;
import com.sba301.retailmanagement.repository.*;
import com.sba301.retailmanagement.service.InventoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class InventoryServiceImpl implements InventoryService {

    private final WarehouseRepository warehouseRepository;
    private final SupplierRepository supplierRepository;
    private final InventoryStockRepository inventoryStockRepository;
    private final InventoryDocumentRepository inventoryDocumentRepository;
    private final InventoryDocumentItemRepository inventoryDocumentItemRepository;
    private final InventoryHistoryRepository inventoryHistoryRepository;
    private final ProductVariantRepository productVariantRepository;
    private final ProductRepository productRepository;
    private final ProductCategoryRepository productCategoryRepository;
    private final UserRepository userRepository;
    private final StoreRepository storeRepository;

    @Override
    @Transactional
    public WarehouseResponse createWarehouse(WarehouseRequest request) {
        if (warehouseRepository.existsByCode(request.getCode())) {
            throw new RuntimeException("Warehouse code already exists");
        }

        Warehouse warehouse = new Warehouse();
        warehouse.setCode(request.getCode());
        warehouse.setName(request.getName());
        warehouse.setAddress(request.getAddress());
        warehouse.setProvince(request.getProvince());
        warehouse.setDistrict(request.getDistrict());
        warehouse.setWard(request.getWard());
        warehouse.setContactName(request.getContactName());
        warehouse.setContactPhone(request.getContactPhone());
        warehouse.setDescription(request.getDescription());
        warehouse.setIsCentral(request.getIsCentral() != null ? request.getIsCentral() : 1);
        warehouse.setStatus(request.getStatus() != null ? request.getStatus() : 1);
        warehouse.setCreatedAt(LocalDateTime.now());
        warehouse.setUpdatedAt(LocalDateTime.now());

        Warehouse savedWarehouse = warehouseRepository.save(warehouse);

        return mapToWarehouseResponse(savedWarehouse);
    }

    @Override
    public List<WarehouseResponse> getAllWarehouses() {
        return warehouseRepository.findAll().stream()
                .map(this::mapToWarehouseResponse)
                .collect(Collectors.toList());
    }

    @Override
    public WarehouseResponse getCentralWarehouse() {
        return warehouseRepository.findByIsCentralTrue()
                .map(this::mapToWarehouseResponse)
                .orElseThrow(() -> new RuntimeException("Central warehouse not found"));
    }

    @Override
    public List<InventoryStockResponse> getStockByWarehouse(Long warehouseId) {
        List<InventoryStock> stocks = inventoryStockRepository.findByWarehouseId(warehouseId);
        return stocks.stream().map(stock -> {
            String sku = "UNKNOWN";
            String productName = "UNKNOWN";
            String variantName = null;

            if (stock.getVariant() != null) {
                sku = stock.getVariant().getSku();
                if (stock.getVariant().getProduct() != null) {
                    productName = stock.getVariant().getProduct().getName();
                }
                String size = stock.getVariant().getSize();
                String color = stock.getVariant().getColor();
                variantName = buildVariantName(size, color);
            }

            return InventoryStockResponse.builder()
                    .inventoryId(buildInventoryId(
                            stock.getId().getWarehouseId(),
                            stock.getId().getVariantId()))
                    .warehouseId(stock.getId().getWarehouseId())
                    .warehouseName(stock.getWarehouse() != null ? stock.getWarehouse().getName() : "UNKNOWN")
                    .variantId(stock.getId().getVariantId())
                    .sku(sku)
                    .productName(productName)
                    .variantName(variantName)
                    .quantity(stock.getQuantity())
                    .lastUpdated(stock.getUpdatedAt())
                    .build();
        }).collect(Collectors.toList());
    }

    @Override
    public List<InventoryStockResponse> getStockByProduct(Long productId) {
        List<InventoryStock> stocks = inventoryStockRepository.findByVariant_ProductId(productId);
        return stocks.stream().map(stock -> {
            String sku = "UNKNOWN";
            String productName = "UNKNOWN";
            String variantName = null;

            if (stock.getVariant() != null) {
                sku = stock.getVariant().getSku();
                if (stock.getVariant().getProduct() != null) {
                    productName = stock.getVariant().getProduct().getName();
                }
                String size = stock.getVariant().getSize();
                String color = stock.getVariant().getColor();
                variantName = buildVariantName(size, color);
            }

            return InventoryStockResponse.builder()
                    .inventoryId(buildInventoryId(
                            stock.getId().getWarehouseId(),
                            stock.getId().getVariantId()))
                    .warehouseId(stock.getId().getWarehouseId())
                    .warehouseName(stock.getWarehouse() != null ? stock.getWarehouse().getName() : "UNKNOWN")
                    .variantId(stock.getId().getVariantId())
                    .sku(sku)
                    .productName(productName)
                    .variantName(variantName)
                    .quantity(stock.getQuantity())
                    .lastUpdated(stock.getUpdatedAt())
                    .build();
        }).collect(Collectors.toList());
    }

    @Override
    public List<InventoryStockResponse> getStockByStore(Long storeId) {
        User currentUser = getCurrentUser();
        validateStoreAccess(currentUser, storeId);

        Store store = storeRepository.findById(storeId)
                .orElseThrow(() -> new RuntimeException("Store not found: " + storeId));

        Long warehouseId = store.getWarehouseId();
        if (warehouseId == null) {
            throw new RuntimeException("Store is not linked to any warehouse: " + storeId);
        }

        return getStockByWarehouse(warehouseId).stream()
                .peek(resp -> {
                    resp.setInventoryId(buildInventoryId(resp.getWarehouseId(), resp.getVariantId()));
                    resp.setWarehouseName(store.getWarehouse() != null
                            ? store.getWarehouse().getName()
                            : resp.getWarehouseName());
                })
                .collect(Collectors.toList());
    }

    @Override
    public InventoryDetailResponse getInventoryDetail(String inventoryId) {
        ParsedInventoryId parsed = parseInventoryId(inventoryId);

        InventoryStockId stockId = new InventoryStockId(parsed.warehouseId(), parsed.variantId());
        InventoryStock stock = inventoryStockRepository.findById(stockId)
                .orElseThrow(() -> new RuntimeException("Inventory not found for id: " + inventoryId));

        Warehouse warehouse = stock.getWarehouse();
        if (warehouse == null) {
            warehouse = warehouseRepository.findById(parsed.warehouseId())
                    .orElseThrow(() -> new RuntimeException("Warehouse not found: " + parsed.warehouseId()));
        }

        Store store = storeRepository.findByWarehouseId(warehouse.getId())
                .orElse(null);

        User currentUser = getCurrentUser();
        if (store != null) {
            validateStoreAccess(currentUser, store.getId());
        }

        ProductVariant variant = stock.getVariant();
        String sku = variant != null ? variant.getSku() : "UNKNOWN";
        String productName = (variant != null && variant.getProduct() != null)
                ? variant.getProduct().getName()
                : "UNKNOWN";
        String variantName = variant != null
                ? buildVariantName(variant.getSize(), variant.getColor())
                : null;

        return InventoryDetailResponse.builder()
                .inventoryId(inventoryId)
                .storeId(store != null ? store.getId() : null)
                .storeName(store != null ? store.getName() : null)
                .warehouseId(warehouse.getId())
                .warehouseName(warehouse.getName())
                .variantId(parsed.variantId())
                .sku(sku)
                .productName(productName)
                .variantName(variantName)
                .quantity(stock.getQuantity())
                .lastUpdated(stock.getUpdatedAt())
                .build();
    }

    @Override
    @Transactional
    public void adjustInventory(String inventoryId, InventoryAdjustRequest request) {
        ParsedInventoryId parsed = parseInventoryId(inventoryId);

        InventoryStockId stockId = new InventoryStockId(parsed.warehouseId(), parsed.variantId());
        InventoryStock stock = inventoryStockRepository.findById(stockId)
                .orElseThrow(() -> new RuntimeException("Inventory not found for id: " + inventoryId));

        Warehouse warehouse = stock.getWarehouse();
        if (warehouse == null) {
            warehouse = warehouseRepository.findById(parsed.warehouseId())
                    .orElseThrow(() -> new RuntimeException("Warehouse not found: " + parsed.warehouseId()));
        }

        Store store = storeRepository.findByWarehouseId(warehouse.getId()).orElse(null);
        User currentUser = getCurrentUser();
        if (store != null) {
            validateStoreAccess(currentUser, store.getId());
        }

        Integer newQuantity = request.getQuantity();
        if (newQuantity == null || newQuantity < 0) {
            throw new RuntimeException("Quantity must be non-negative");
        }

        int oldQuantity = stock.getQuantity() != null ? stock.getQuantity() : 0;
        int delta = newQuantity - oldQuantity;

        // Nếu không thay đổi thì bỏ qua
        if (delta == 0) {
            return;
        }

        // Tạo document điều chỉnh
        InventoryDocument document = new InventoryDocument();
        document.setDocumentCode("ADJ-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        document.setDocumentType(InventoryDocumentType.ADJUST);
        document.setTargetWarehouseId(warehouse.getId());
        document.setTargetWarehouse(warehouse);
        document.setNote(request.getReason());
        Long actorUserId = currentUser != null ? currentUser.getId() : null;
        document.setCreatedBy(actorUserId != null ? actorUserId : 0L);
        document.setCreatedAt(LocalDateTime.now());
        document.setTotalAmount(BigDecimal.ZERO);

        InventoryDocument savedDoc = inventoryDocumentRepository.save(document);

        ProductVariant variant = stock.getVariant();
        if (variant == null) {
            variant = productVariantRepository.findById(parsed.variantId())
                    .orElseThrow(() -> new RuntimeException("Product Variant not found: " + parsed.variantId()));
        }

        InventoryDocumentItem docItem = new InventoryDocumentItem();
        docItem.setDocumentId(savedDoc.getId());
        docItem.setDocument(savedDoc);
        docItem.setVariantId(variant.getId());
        docItem.setVariant(variant);
        docItem.setQuantity(Math.abs(delta));
        docItem.setNote(request.getReason());
        InventoryDocumentItem savedItem = inventoryDocumentItemRepository.save(docItem);

        // Cập nhật tồn kho
        stock.setQuantity(newQuantity);
        stock.setUpdatedAt(LocalDateTime.now());
        inventoryStockRepository.save(stock);

        // Ghi lịch sử điều chỉnh
        createHistory(savedDoc, savedItem, warehouse, variant, InventoryAction.ADJUST, Math.abs(delta), newQuantity);

        // Cập nhật trạng thái sản phẩm
        if (variant.getProductId() != null) {
            updateProductStatus(variant.getProductId());
        }
    }

    @Override
    @Transactional
    public void importStock(StockRequest request) {
        Warehouse warehouse = warehouseRepository.findById(request.getWarehouseId())
                .orElseThrow(() -> new RuntimeException("Warehouse not found"));

        if (request.getSupplierId() != null && !supplierRepository.existsById(request.getSupplierId())) {
            throw new RuntimeException("Supplier not found: " + request.getSupplierId());
        }

        User currentUser = getCurrentUser();
        Long createdByUserId = currentUser != null ? currentUser.getId() : null;

        // Create Document
        InventoryDocument document = new InventoryDocument();
        document.setDocumentCode("IMP-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        document.setDocumentType(InventoryDocumentType.IMPORT);
        document.setTargetWarehouseId(warehouse.getId());
        document.setTargetWarehouse(warehouse);
        document.setSupplierId(request.getSupplierId());
        document.setNote(request.getNote());
        document.setCreatedBy(createdByUserId);
        document.setCreatedAt(LocalDateTime.now());
        document.setTotalAmount(java.math.BigDecimal.ZERO);

        InventoryDocument savedDoc = inventoryDocumentRepository.save(document);
        java.math.BigDecimal totalAmount = java.math.BigDecimal.ZERO;

        for (InventoryItemRequest itemReq : request.getItems()) {
            ProductVariant variant = productVariantRepository.findById(itemReq.getVariantId())
                    .orElseThrow(() -> new RuntimeException("Product Variant not found: " + itemReq.getVariantId()));

            // Calculate Value
            if (variant.getPrice() != null) {
                totalAmount = totalAmount
                        .add(variant.getPrice().multiply(java.math.BigDecimal.valueOf(itemReq.getQuantity())));
            }

            // Save Document Item
            InventoryDocumentItem docItem = new InventoryDocumentItem();
            docItem.setDocumentId(savedDoc.getId());
            docItem.setDocument(savedDoc);
            docItem.setVariantId(itemReq.getVariantId());
            docItem.setVariant(variant);
            docItem.setQuantity(itemReq.getQuantity());
            docItem.setNote(itemReq.getNote());
            InventoryDocumentItem savedItem = inventoryDocumentItemRepository.save(docItem);

            // Update Stock
            InventoryStockId stockId = new InventoryStockId(warehouse.getId(), variant.getId());
            InventoryStock stock = inventoryStockRepository.findById(stockId)
                    .orElse(new InventoryStock(stockId, warehouse, variant, 0, LocalDateTime.now()));

            int oldQuantity = stock.getQuantity();
            int newQuantity = oldQuantity + itemReq.getQuantity();
            stock.setQuantity(newQuantity);
            stock.setUpdatedAt(LocalDateTime.now());
            inventoryStockRepository.save(stock);

            // Log History
            createHistory(savedDoc, savedItem, warehouse, variant, InventoryAction.IN, itemReq.getQuantity(),
                    newQuantity);
        }

        // Update Total Amount
        savedDoc.setTotalAmount(totalAmount);
        inventoryDocumentRepository.save(savedDoc);

        // Sync Product Status
        request.getItems().stream()
                .map(item -> productVariantRepository.findById(item.getVariantId()).map(ProductVariant::getProductId)
                        .orElse(null))
                .filter(java.util.Objects::nonNull)
                .distinct()
                .forEach(this::updateProductStatus);
    }

    @Override
    @Transactional
    public void exportStock(StockRequest request) {
        Warehouse warehouse = warehouseRepository.findById(request.getWarehouseId())
                .orElseThrow(() -> new RuntimeException("Warehouse not found"));

        // Create Document
        InventoryDocument document = new InventoryDocument();
        document.setDocumentCode("EXP-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        document.setDocumentType(InventoryDocumentType.EXPORT);
        document.setSourceWarehouseId(warehouse.getId());
        document.setSourceWarehouse(warehouse);
        document.setNote(request.getNote());
        document.setCreatedBy(1L); // TODO: Get from SecurityContext
        document.setCreatedAt(LocalDateTime.now());

        InventoryDocument savedDoc = inventoryDocumentRepository.save(document);

        for (InventoryItemRequest itemReq : request.getItems()) {
            ProductVariant variant = productVariantRepository.findById(itemReq.getVariantId())
                    .orElseThrow(() -> new RuntimeException("Product Variant not found: " + itemReq.getVariantId()));

            // Check Stock first
            InventoryStockId stockId = new InventoryStockId(warehouse.getId(), variant.getId());
            InventoryStock stock = inventoryStockRepository.findById(stockId)
                    .orElseThrow(() -> new RuntimeException("Stock record not found for variant: " + variant.getId()));

            if (stock.getQuantity() < itemReq.getQuantity()) {
                throw new RuntimeException("Insufficient stock for variant: " + variant.getId());
            }

            // Save Document Item
            InventoryDocumentItem docItem = new InventoryDocumentItem();
            docItem.setDocumentId(savedDoc.getId());
            docItem.setDocument(savedDoc);
            docItem.setVariantId(itemReq.getVariantId());
            docItem.setVariant(variant);
            docItem.setQuantity(itemReq.getQuantity());
            docItem.setNote(itemReq.getNote());
            InventoryDocumentItem savedItem = inventoryDocumentItemRepository.save(docItem);

            // Update Stock
            int oldQuantity = stock.getQuantity();
            int newQuantity = oldQuantity - itemReq.getQuantity();
            stock.setQuantity(newQuantity);
            stock.setUpdatedAt(LocalDateTime.now());
            inventoryStockRepository.save(stock);

            // Log History
            createHistory(savedDoc, savedItem, warehouse, variant, InventoryAction.OUT, itemReq.getQuantity(),
                    newQuantity);
        }

        // Sync Product Status
        request.getItems().stream()
                .map(item -> productVariantRepository.findById(item.getVariantId()).map(ProductVariant::getProductId)
                        .orElse(null))
                .filter(java.util.Objects::nonNull)
                .distinct()
                .forEach(this::updateProductStatus);
    }

    @Override
    @Transactional
    public void transferStock(TransferRequest request) {
        Warehouse sourceWarehouse = warehouseRepository.findById(request.getSourceWarehouseId())
                .orElseThrow(() -> new RuntimeException("Source Warehouse not found"));
        Warehouse targetWarehouse = warehouseRepository.findById(request.getTargetWarehouseId())
                .orElseThrow(() -> new RuntimeException("Target Warehouse not found"));

        // Validate: Source must NOT be linked to any store (Central Warehouse)
        boolean sourceIsCentral = sourceWarehouse.getIsCentral() != null && sourceWarehouse.getIsCentral() == 1;
        if (!sourceIsCentral) {
            throw new RuntimeException("Transfer source must be a Central Warehouse (not linked to any store)");
        }

        // Validate: Target MUST be linked to a store (Store Warehouse)
        boolean targetIsCentral = targetWarehouse.getIsCentral() != null && targetWarehouse.getIsCentral() == 1;
        if (targetIsCentral) {
            throw new RuntimeException("Transfer destination must be a Store Warehouse (linked to a store)");
        }

        if (sourceWarehouse.getId().equals(targetWarehouse.getId())) {
            throw new RuntimeException("Source and Target warehouse cannot be the same");
        }

        User currentUser = getCurrentUser();
        Long createdByUserId = currentUser != null ? currentUser.getId() : null;
        
        // Create Document
        InventoryDocument document = new InventoryDocument();
        document.setDocumentCode("TRF-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        document.setDocumentType(InventoryDocumentType.TRANSFER);
        document.setSourceWarehouseId(sourceWarehouse.getId());
        document.setSourceWarehouse(sourceWarehouse);
        document.setTargetWarehouseId(targetWarehouse.getId());
        document.setTargetWarehouse(targetWarehouse);
        document.setNote(request.getNote());
        document.setCreatedBy(createdByUserId);
        document.setCreatedAt(LocalDateTime.now());
        document.setStatus("PENDING");

        // Fetch all variants and calculate totalAmount
        List<Long> variantIds = request.getItems().stream()
                .map(InventoryItemRequest::getVariantId)
                .collect(Collectors.toList());
        Map<Long, ProductVariant> variantMap = productVariantRepository.findAllById(variantIds).stream()
                .collect(Collectors.toMap(ProductVariant::getId, v -> v));

        BigDecimal totalAmount = BigDecimal.ZERO;
        for (InventoryItemRequest itemReq : request.getItems()) {
            ProductVariant variant = variantMap.get(itemReq.getVariantId());
            if (variant == null) {
                throw new RuntimeException("Product Variant not found: " + itemReq.getVariantId());
            }
            BigDecimal unitPrice = variant.getPrice() != null ? variant.getPrice() : BigDecimal.ZERO;
            totalAmount = totalAmount.add(unitPrice.multiply(BigDecimal.valueOf(itemReq.getQuantity())));
        }
        document.setTotalAmount(totalAmount);

        InventoryDocument savedDoc = inventoryDocumentRepository.save(document);

        // Process items
        for (InventoryItemRequest itemReq : request.getItems()) {
            ProductVariant variant = variantMap.get(itemReq.getVariantId());

            // 1. Process Source Warehouse (OUT)
            InventoryStockId sourceStockId = new InventoryStockId(sourceWarehouse.getId(), variant.getId());
            InventoryStock sourceStock = inventoryStockRepository.findById(sourceStockId)
                    .orElseThrow(() -> new RuntimeException(
                            "Stock record not found in Source Warehouse for variant: " + variant.getId()));

            if (sourceStock.getQuantity() < itemReq.getQuantity()) {
                throw new RuntimeException("Insufficient stock in Source Warehouse for variant: " + variant.getId());
            }

            // Save Document Item (linked to Doc)
            InventoryDocumentItem docItem = new InventoryDocumentItem();
            docItem.setDocumentId(savedDoc.getId());
            docItem.setDocument(savedDoc);
            docItem.setVariantId(itemReq.getVariantId());
            docItem.setVariant(variant);
            docItem.setQuantity(itemReq.getQuantity());
            docItem.setNote(itemReq.getNote());
            InventoryDocumentItem savedItem = inventoryDocumentItemRepository.save(docItem);

            // Update Source Stock
            int sourceOldQty = sourceStock.getQuantity();
            int sourceNewQty = sourceOldQty - itemReq.getQuantity();
            sourceStock.setQuantity(sourceNewQty);
            sourceStock.setUpdatedAt(LocalDateTime.now());
            inventoryStockRepository.save(sourceStock);

            // Log Source History (OUT)
            createHistory(savedDoc, savedItem, sourceWarehouse, variant, InventoryAction.OUT, itemReq.getQuantity(),
                    sourceNewQty);

            // 2. Process Target Warehouse (IN)
            InventoryStockId targetStockId = new InventoryStockId(targetWarehouse.getId(), variant.getId());
            InventoryStock targetStock = inventoryStockRepository.findById(targetStockId)
                    .orElse(new InventoryStock(targetStockId, targetWarehouse, variant, 0, LocalDateTime.now()));

            int targetOldQty = targetStock.getQuantity();
            int targetNewQty = targetOldQty + itemReq.getQuantity();
            targetStock.setQuantity(targetNewQty);
            targetStock.setUpdatedAt(LocalDateTime.now());
            inventoryStockRepository.save(targetStock);

            // Log Target History (IN)
            createHistory(savedDoc, savedItem, targetWarehouse, variant, InventoryAction.IN, itemReq.getQuantity(),
                    targetNewQty);
        }

        // Sync Product Status
        request.getItems().stream()
                .map(item -> productVariantRepository.findById(item.getVariantId()).map(ProductVariant::getProductId)
                        .orElse(null))
                .filter(java.util.Objects::nonNull)
                .distinct()
                .forEach(this::updateProductStatus);
    }

    private void createHistory(InventoryDocument doc, InventoryDocumentItem item, Warehouse warehouse,
            ProductVariant variant, InventoryAction action, int quantity, int balance) {
        User currentUser = getCurrentUser();
        Long actorUserId = currentUser != null ? currentUser.getId() : null;
        
        InventoryHistory history = new InventoryHistory();
        history.setDocumentId(doc.getId());
        history.setDocument(doc);
        history.setDocumentItemId(item.getId());
        history.setDocumentItem(item);
        history.setWarehouseId(warehouse.getId());
        history.setWarehouse(warehouse);
        history.setVariantId(variant.getId());
        history.setVariant(variant);
        history.setAction(action);
        history.setQuantity(quantity);
        history.setBalanceAfter(balance);
        history.setActorUserId(actorUserId);
        history.setOccurredAt(LocalDateTime.now());

        inventoryHistoryRepository.save(history);
    }

    private void updateProductStatus(Long productId) {
        Product product = productRepository.findById(productId).orElse(null);
        if (product == null)
            return;

        Integer totalQty = inventoryStockRepository.getTotalQuantityByProductId(productId);

        if (totalQty <= 0) {
            // Nếu hết hàng và đang ở trạng thái Hoạt động (1) -> Chuyển sang Hết hàng (2)
            if (product.getStatus() == 1) {
                product.setStatus(2);
                product.setUpdatedAt(LocalDateTime.now());
                productRepository.save(product);
            }
        } else {
            // Nếu có hàng và đang ở trạng thái Hết hàng (2) -> Quay lại Hoạt động (1)
            // Nếu trạng thái đang là 0 (Tắt thủ công), giữ nguyên không đổi.
            if (product.getStatus() == 2) {
                product.setStatus(1);
                product.setUpdatedAt(LocalDateTime.now());
                productRepository.save(product);
            }
        }
    }

    private WarehouseResponse mapToWarehouseResponse(Warehouse warehouse) {
        return WarehouseResponse.builder()
                .id(warehouse.getId())
                .code(warehouse.getCode())
                .name(warehouse.getName())
                .address(warehouse.getAddress())
                .province(warehouse.getProvince())
                .district(warehouse.getDistrict())
                .ward(warehouse.getWard())
                .contactName(warehouse.getContactName())
                .contactPhone(warehouse.getContactPhone())
                .description(warehouse.getDescription())
                .isCentral(warehouse.getIsCentral())
                .status(warehouse.getStatus())
                .createdAt(warehouse.getCreatedAt())
                .updatedAt(warehouse.getUpdatedAt())
                .build();
    }

    @Override
    @Transactional
    public WarehouseResponse updateWarehouse(Long id, WarehouseRequest request) {
        Warehouse warehouse = warehouseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Warehouse not found"));

        if (request.getCode() != null && !request.getCode().equals(warehouse.getCode())) {
            if (warehouseRepository.existsByCode(request.getCode())) {
                throw new RuntimeException("Warehouse code already exists");
            }
            warehouse.setCode(request.getCode());
        }

        if (request.getName() != null) {
            warehouse.setName(request.getName());
        }

        if (request.getAddress() != null) {
            warehouse.setAddress(request.getAddress());
        }

        if (request.getProvince() != null) {
            warehouse.setProvince(request.getProvince());
        }

        if (request.getDistrict() != null) {
            warehouse.setDistrict(request.getDistrict());
        }

        if (request.getWard() != null) {
            warehouse.setWard(request.getWard());
        }

        if (request.getContactName() != null) {
            warehouse.setContactName(request.getContactName());
        }

        if (request.getContactPhone() != null) {
            warehouse.setContactPhone(request.getContactPhone());
        }

        if (request.getDescription() != null) {
            warehouse.setDescription(request.getDescription());
        }

        if (request.getIsCentral() != null) {
            warehouse.setIsCentral(request.getIsCentral());
        }

        if (request.getStatus() != null) {
            warehouse.setStatus(request.getStatus());
        }

        warehouse.setUpdatedAt(LocalDateTime.now());
        Warehouse saved = warehouseRepository.save(warehouse);
        return mapToWarehouseResponse(saved);
    }

    @Override
    @Transactional
    public void deleteWarehouse(Long id) {
        Warehouse warehouse = warehouseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Warehouse not found"));

        inventoryStockRepository.deleteAll(inventoryStockRepository.findByWarehouseId(id));

        try {
            warehouseRepository.delete(warehouse);
        } catch (org.springframework.dao.DataIntegrityViolationException e) {
            throw new RuntimeException(
                    "Cannot delete warehouse because it has associated documents or history. Soft delete (Deactivate) recommended instead.");
        }
    }

    @Override
    public List<com.sba301.retailmanagement.dto.response.InventoryDocumentResponse> getDocumentsByType(String typeStr) {
        InventoryDocumentType type;
        try {
            type = InventoryDocumentType.valueOf(typeStr.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid document type: " + typeStr);
        }

        List<InventoryDocument> documents = inventoryDocumentRepository.findByDocumentTypeOrderByCreatedAtDesc(type);

        return documents.stream().map(doc -> {
            List<InventoryDocumentItem> items = inventoryDocumentItemRepository.findByDocumentId(doc.getId());
            int totalItems = items.stream().mapToInt(InventoryDocumentItem::getQuantity).sum();

            java.math.BigDecimal totalValue = doc.getTotalAmount() != null ? doc.getTotalAmount()
                    : java.math.BigDecimal.ZERO;

            String supplierName = doc.getSupplier() != null ? doc.getSupplier().getName() : null;

            // Map items
            List<com.sba301.retailmanagement.dto.response.InventoryDocumentItemResponse> itemResponses = items.stream()
                    .map(item -> {
                        String productName = "Unknown";
                        if (item.getVariant() != null && item.getVariant().getProduct() != null) {
                            productName = item.getVariant().getProduct().getName();
                        }
                        String sku = item.getVariant() != null ? item.getVariant().getSku() : "N/A";
                        String size = item.getVariant() != null ? item.getVariant().getSize() : "";
                        String color = item.getVariant() != null ? item.getVariant().getColor() : "";
                        java.math.BigDecimal unitPrice = item.getVariant() != null ? item.getVariant().getPrice() : java.math.BigDecimal.ZERO;
                        long unitPriceLong = unitPrice != null ? unitPrice.longValue() : 0L;
                        long totalPriceLong = unitPriceLong * item.getQuantity();

                        return com.sba301.retailmanagement.dto.response.InventoryDocumentItemResponse.builder()
                                .variantId(item.getVariantId())
                                .productName(productName)
                                .sku(sku)
                                .size(size)
                                .color(color)
                                .quantity(item.getQuantity())
                                .unitPrice(unitPriceLong)
                                .totalPrice(totalPriceLong)
                                .build();
                    })
                    .collect(Collectors.toList());

            return com.sba301.retailmanagement.dto.response.InventoryDocumentResponse.builder()
                    .id(doc.getId())
                    .documentCode(doc.getDocumentCode())
                    .documentType(doc.getDocumentType().name())
                    .sourceWarehouseId(doc.getSourceWarehouseId())
                    .sourceWarehouseName(doc.getSourceWarehouse() != null ? doc.getSourceWarehouse().getName() : null)
                    .targetWarehouseId(doc.getTargetWarehouseId())
                    .targetWarehouseName(doc.getTargetWarehouse() != null ? doc.getTargetWarehouse().getName() : null)
                    .note(doc.getNote())
                    .status(doc.getStatus() != null ? doc.getStatus() : (doc.getDocumentType() == InventoryDocumentType.IMPORT ? "COMPLETED" : "PENDING"))
                    .createdBy(String.valueOf(doc.getCreatedBy()))
                    .createdAt(doc.getCreatedAt())
                    .totalItems(totalItems)
                    .totalValue(totalValue.longValue()) // DTO expects Long, converting BigDecimal
                    .supplier(supplierName)
                    .items(itemResponses)
                    .build();
        }).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteDocument(Long id) {
        InventoryDocument document = inventoryDocumentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document not found: " + id));

        // 1. Delete associated history records first to avoid foreign key violations
        List<InventoryHistory> histories = inventoryHistoryRepository.findByDocumentId(id);
        inventoryHistoryRepository.deleteAllInBatch(histories);

        // 2. Delete associated document items
        List<InventoryDocumentItem> items = inventoryDocumentItemRepository.findByDocumentId(id);
        inventoryDocumentItemRepository.deleteAllInBatch(items);

        // 3. Finally, delete the main document
        inventoryDocumentRepository.delete(document);
    }

    @Override
    public InventoryOverviewResponse getInventoryOverview() {
        List<InventoryStock> stocks = inventoryStockRepository.findAll();

        long totalQuantity = 0L;
        java.math.BigDecimal totalValue = java.math.BigDecimal.ZERO;
        Set<Long> criticalWarehouses = new HashSet<>();

        for (InventoryStock stock : stocks) {
            int quantity = stock.getQuantity() != null ? stock.getQuantity() : 0;
            totalQuantity += quantity;

            if (stock.getVariant() != null && stock.getVariant().getPrice() != null) {
                totalValue = totalValue.add(
                        stock.getVariant().getPrice().multiply(java.math.BigDecimal.valueOf(quantity)));
            }

            // Đánh dấu kho "cần chú ý" nếu có bất kỳ mặt hàng nào tồn dưới 10
            if (quantity < 10 && stock.getId() != null) {
                criticalWarehouses.add(stock.getId().getWarehouseId());
            }
        }

        // Hiện tại chưa có dữ liệu so sánh kỳ trước, tạm thời mock cứng 2.4% như UI
        // demo
        double growthPercentage = 2.4d;

        return InventoryOverviewResponse.builder()
                .totalStockQuantity(totalQuantity)
                .totalChainValue(totalValue.longValue())
                .criticalStoreCount((long) criticalWarehouses.size())
                .growthPercentage(growthPercentage)
                .build();
    }

    private User getCurrentUser() {
        try {
            Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            if (principal instanceof UserDetails) {
                String email = ((UserDetails) principal).getUsername();
                return userRepository.findByEmail(email).orElse(null);
            }
        } catch (Exception e) {
            log.debug("No authenticated user found");
        }
        return null;
    }

    private String buildInventoryId(Long warehouseId, Long variantId) {
        if (warehouseId == null || variantId == null) {
            return null;
        }
        return warehouseId + "-" + variantId;
    }

    private String buildVariantName(String size, String color) {
        if ((size == null || size.isEmpty()) && (color == null || color.isEmpty())) {
            return null;
        }
        if (size != null && !size.isEmpty() && color != null && !color.isEmpty()) {
            return size + " / " + color;
        }
        return size != null && !size.isEmpty() ? size : color;
    }

    private ParsedInventoryId parseInventoryId(String inventoryId) {
        try {
            String[] parts = inventoryId.split("-");
            if (parts.length != 2) {
                throw new IllegalArgumentException("Invalid inventoryId format");
            }
            Long warehouseId = Long.parseLong(parts[0]);
            Long variantId = Long.parseLong(parts[1]);
            return new ParsedInventoryId(warehouseId, variantId);
        } catch (Exception e) {
            throw new RuntimeException("Invalid inventoryId: " + inventoryId);
        }
    }

    private void validateStoreAccess(User user, Long storeId) {
        if (storeId == null) {
            throw new RuntimeException("storeId is required");
        }
        if (user == null) {
            throw new RuntimeException("Unauthenticated user");
        }

        boolean isSuperAdmin = user.getRoles().stream()
                .anyMatch(role -> RoleConstant.SUPER_ADMIN.name().equalsIgnoreCase(role.getCode()));

        if (isSuperAdmin) {
            return;
        }

        Long userStoreId = user.getStoreId();
        if (userStoreId == null || !userStoreId.equals(storeId)) {
            throw new RuntimeException("User does not have access to store: " + storeId);
        }
    }

    private record ParsedInventoryId(Long warehouseId, Long variantId) {
    }

    @Override
    @Transactional
    public void importStockFromExcel(List<Map<String, Object>> items) {
        // Get default warehouse (central warehouse)
        List<Warehouse> warehouses = warehouseRepository.findAll();
        if (warehouses.isEmpty()) {
            throw new RuntimeException("No warehouse found");
        }
        Warehouse warehouse = warehouses.stream()
                .filter(w -> w.getIsCentral() != null && w.getIsCentral() == 1)
                .findFirst()
                .orElse(warehouses.get(0));

        // Get default category
        List<com.sba301.retailmanagement.entity.ProductCategory> categories = productCategoryRepository.findAll();
        Long defaultCategoryId = categories.isEmpty() ? null : categories.get(0).getId();

        // Get supplier from first item (common for entire import)
        Long supplierId = null;
        if (!items.isEmpty()) {
            Object supplierIdObj = items.get(0).get("supplierId");
            if (supplierIdObj != null) {
                if (supplierIdObj instanceof Number) {
                    supplierId = ((Number) supplierIdObj).longValue();
                } else if (supplierIdObj instanceof String) {
                    String supplierIdStr = (String) supplierIdObj;
                    if (!supplierIdStr.isEmpty()) {
                        supplierId = Long.parseLong(supplierIdStr);
                    }
                }
            }
        }

        // Validate and load supplier if provided
        Supplier supplier = null;
        if (supplierId != null) {
            supplier = supplierRepository.findById(supplierId).orElse(null);
            if (supplier == null) {
                log.warn("Supplier not found with id: {}, proceeding without supplier", supplierId);
            }
        }

        User currentUser = getCurrentUser();
        Long createdByUserId = currentUser != null ? currentUser.getId() : null;

        // Create Document
        InventoryDocument document = new InventoryDocument();
        document.setDocumentCode("IMP-EXCEL-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        document.setDocumentType(InventoryDocumentType.IMPORT);
        document.setTargetWarehouseId(warehouse.getId());
        document.setTargetWarehouse(warehouse);
        document.setNote("Nhập kho từ Excel");
        document.setCreatedBy(createdByUserId);
        document.setCreatedAt(LocalDateTime.now());
        document.setTotalAmount(BigDecimal.ZERO);
        document.setSupplierId(supplierId);
        document.setSupplier(supplier);

        InventoryDocument savedDoc = inventoryDocumentRepository.save(document);
        BigDecimal totalAmount = BigDecimal.ZERO;

        for (Map<String, Object> item : items) {
            String sku = (String) item.get("sku");
            String productName = (String) item.get("productName");
            Integer quantity = item.get("quantity") != null ? ((Number) item.get("quantity")).intValue() : 0;
            Double unitPrice = item.get("unitPrice") != null ? ((Number) item.get("unitPrice")).doubleValue() : 0.0;
            String note = (String) item.get("note");

            // Get categoryId from item (per row), fallback to default
            Long categoryId = defaultCategoryId;
            Object categoryIdObj = item.get("categoryId");
            if (categoryIdObj != null) {
                if (categoryIdObj instanceof Number) {
                    categoryId = ((Number) categoryIdObj).longValue();
                } else if (categoryIdObj instanceof String) {
                    String categoryIdStr = (String) categoryIdObj;
                    if (!categoryIdStr.isEmpty()) {
                        categoryId = Long.parseLong(categoryIdStr);
                    }
                }
            }

            // Get size and color from item (per row)
            String size = (String) item.get("size");
            String color = (String) item.get("color");

            if (sku == null || sku.trim().isEmpty()) {
                log.warn("SKU is empty, skipping row");
                continue;
            }

            // Find or create product
            Product product = productRepository.findByCode(sku).orElse(null);
            if (product == null) {
                // Create new product
                product = new Product();
                product.setCode(sku);
                product.setName(productName != null ? productName : sku);
                product.setCategoryId(categoryId);
                product.setStatus(1);
                product.setCreatedAt(LocalDateTime.now());
                product.setUpdatedAt(LocalDateTime.now());
                product = productRepository.save(product);
                log.info("Created new product: {} with categoryId: {}", sku, categoryId);
            }

            // Find or create variant
            ProductVariant variant = productVariantRepository.findBySku(sku).orElse(null);
            if (variant == null) {
                // Create new variant
                variant = new ProductVariant();
                variant.setProductId(product.getId());
                variant.setSku(sku);
                variant.setPrice(BigDecimal.valueOf(unitPrice));
                variant.setSize(size);
                variant.setColor(color);
                variant.setStatus(1);
                variant.setCreatedAt(LocalDateTime.now());
                variant.setUpdatedAt(LocalDateTime.now());
                variant = productVariantRepository.save(variant);
                log.info("Created new variant for product: {} with size: {}, color: {}", sku, size, color);
            }

            // Calculate amount
            totalAmount = totalAmount.add(BigDecimal.valueOf(unitPrice * quantity));

            // Save Document Item
            InventoryDocumentItem docItem = new InventoryDocumentItem();
            docItem.setDocumentId(savedDoc.getId());
            docItem.setDocument(savedDoc);
            docItem.setVariantId(variant.getId());
            docItem.setVariant(variant);
            docItem.setQuantity(quantity);
            docItem.setNote(note);
            InventoryDocumentItem savedItem = inventoryDocumentItemRepository.save(docItem);

            // Update Stock
            InventoryStockId stockId = new InventoryStockId(warehouse.getId(), variant.getId());
            InventoryStock stock = inventoryStockRepository.findById(stockId)
                    .orElse(new InventoryStock(stockId, warehouse, variant, 0, LocalDateTime.now()));

            int oldQuantity = stock.getQuantity();
            int newQuantity = oldQuantity + quantity;
            stock.setQuantity(newQuantity);
            stock.setUpdatedAt(LocalDateTime.now());
            inventoryStockRepository.save(stock);

            // Log History
            createHistory(savedDoc, savedItem, warehouse, variant, InventoryAction.IN, quantity, newQuantity);
        }

        // Update Total Amount
        savedDoc.setTotalAmount(totalAmount);
        inventoryDocumentRepository.save(savedDoc);

        log.info("Excel import completed: {} items, total amount: {}", items.size(), totalAmount);
    }

    @Override
    public void confirmReceipt(Long documentId) {
        InventoryDocument document = inventoryDocumentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found: " + documentId));

        if (!"PENDING".equals(document.getStatus())) {
            throw new RuntimeException("Document has already been confirmed or cannot be confirmed");
        }

        document.setStatus("COMPLETED");
        inventoryDocumentRepository.save(document);
        log.info("Document {} confirmed receipt", documentId);
    }

    @Override
    public List<InventoryDocumentResponse> getExportDocumentsByStore(Long storeId) {
        Store store = storeRepository.findById(storeId)
                .orElseThrow(() -> new RuntimeException("Store not found: " + storeId));

        Long warehouseId = store.getWarehouseId();
        if (warehouseId == null) {
            throw new RuntimeException("Store does not have a warehouse assigned");
        }

        List<InventoryDocument> documents = inventoryDocumentRepository
                .findByTargetWarehouseIdAndDocumentTypeOrderByCreatedAtDesc(warehouseId, InventoryDocumentType.TRANSFER);

        return documents.stream().map(doc -> {
            List<InventoryDocumentItem> items = inventoryDocumentItemRepository.findByDocumentId(doc.getId());
            int totalItems = items.stream().mapToInt(InventoryDocumentItem::getQuantity).sum();

            BigDecimal totalValue = items.stream()
                    .map(item -> {
                        ProductVariant variant = productVariantRepository.findById(item.getVariantId()).orElse(null);
                        if (variant != null && variant.getPrice() != null) {
                            return variant.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
                        }
                        return BigDecimal.ZERO;
                    })
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            String supplierName = doc.getSupplier() != null ? doc.getSupplier().getName() : null;

            List<InventoryDocumentItemResponse> itemResponses = items.stream()
                    .map(item -> {
                        ProductVariant variant = productVariantRepository.findById(item.getVariantId()).orElse(null);
                        return InventoryDocumentItemResponse.builder()
                                .variantId(item.getVariantId())
                                .productName(variant != null && variant.getProduct() != null ? variant.getProduct().getName() : null)
                                .sku(variant != null ? variant.getSku() : null)
                                .quantity(item.getQuantity())
                                .build();
                    })
                    .collect(Collectors.toList());

            return InventoryDocumentResponse.builder()
                    .id(doc.getId())
                    .documentCode(doc.getDocumentCode())
                    .documentType(doc.getDocumentType() != null ? doc.getDocumentType().name() : null)
                    .sourceWarehouseId(doc.getSourceWarehouseId())
                    .sourceWarehouseName(doc.getSourceWarehouse() != null ? doc.getSourceWarehouse().getName() : null)
                    .targetWarehouseId(doc.getTargetWarehouseId())
                    .targetWarehouseName(doc.getTargetWarehouse() != null ? doc.getTargetWarehouse().getName() : null)
                    .note(doc.getNote())
                    .status(doc.getStatus() != null ? doc.getStatus() : "PENDING")
                    .createdBy(String.valueOf(doc.getCreatedBy()))
                    .createdAt(doc.getCreatedAt())
                    .totalItems(totalItems)
                    .totalValue(totalValue.longValue())
                    .supplier(supplierName)
                    .items(itemResponses)
                    .build();
        }).collect(Collectors.toList());
    }
}
