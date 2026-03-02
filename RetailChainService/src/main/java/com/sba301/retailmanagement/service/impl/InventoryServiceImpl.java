package com.sba301.retailmanagement.service.impl;

import com.sba301.retailmanagement.dto.request.InventoryItemRequest;
import com.sba301.retailmanagement.dto.request.StockRequest;
import com.sba301.retailmanagement.dto.request.TransferRequest;
import com.sba301.retailmanagement.dto.request.WarehouseRequest;
import com.sba301.retailmanagement.dto.response.InventoryOverviewResponse;
import com.sba301.retailmanagement.dto.response.InventoryStockResponse;
import com.sba301.retailmanagement.dto.response.WarehouseResponse;
import com.sba301.retailmanagement.entity.*;
import com.sba301.retailmanagement.enums.InventoryAction;
import com.sba301.retailmanagement.enums.InventoryDocumentType;
import com.sba301.retailmanagement.repository.*;
import com.sba301.retailmanagement.service.InventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InventoryServiceImpl implements InventoryService {

    private final WarehouseRepository warehouseRepository;
    private final StoreWarehouseRepository storeWarehouseRepository;
    private final SupplierRepository supplierRepository;
    private final InventoryStockRepository inventoryStockRepository;
    private final InventoryDocumentRepository inventoryDocumentRepository;
    private final InventoryDocumentItemRepository inventoryDocumentItemRepository;
    private final InventoryHistoryRepository inventoryHistoryRepository;
    private final ProductVariantRepository productVariantRepository;
    private final ProductRepository productRepository;

    @Override
    @Transactional
    public WarehouseResponse createWarehouse(WarehouseRequest request) {
        if (warehouseRepository.existsByCode(request.getCode())) {
            throw new RuntimeException("Warehouse code already exists");
        }

        Warehouse warehouse = new Warehouse();
        warehouse.setCode(request.getCode());
        warehouse.setName(request.getName());
        warehouse.setWarehouseType(request.getWarehouseType());
        warehouse.setStatus(1);
        warehouse.setCreatedAt(LocalDateTime.now());
        warehouse.setUpdatedAt(LocalDateTime.now());

        if (request.getWarehouseType() == 2 && request.getStoreId() != null) {
            warehouse.setStoreId(request.getStoreId());
        }

        Warehouse savedWarehouse = warehouseRepository.save(warehouse);

        if (request.getWarehouseType() == 2 && request.getStoreId() != null) {
            StoreWarehouse storeWarehouse = new StoreWarehouse();
            StoreWarehouseId id = new StoreWarehouseId(request.getStoreId(), savedWarehouse.getId());
            storeWarehouse.setId(id);

            Store storeProxy = new Store();
            storeProxy.setId(request.getStoreId());
            storeWarehouse.setStore(storeProxy);
            storeWarehouse.setWarehouse(savedWarehouse);

            storeWarehouseRepository.save(storeWarehouse);
        }

        return mapToWarehouseResponse(savedWarehouse);
    }

    @Override
    public List<WarehouseResponse> getAllWarehouses() {
        return warehouseRepository.findAll().stream()
                .map(this::mapToWarehouseResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<InventoryStockResponse> getStockByWarehouse(Long warehouseId) {
        List<InventoryStock> stocks = inventoryStockRepository.findByWarehouseId(warehouseId);
        return stocks.stream().map(stock -> {
            String sku = "UNKNOWN";
            String productName = "UNKNOWN";

            if (stock.getVariant() != null) {
                sku = stock.getVariant().getSku();
                if (stock.getVariant().getProduct() != null) {
                    productName = stock.getVariant().getProduct().getName();
                }
            }

            return InventoryStockResponse.builder()
                    .warehouseId(stock.getId().getWarehouseId())
                    .warehouseName(stock.getWarehouse() != null ? stock.getWarehouse().getName() : "UNKNOWN")
                    .variantId(stock.getId().getVariantId())
                    .sku(sku)
                    .productName(productName)
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

            if (stock.getVariant() != null) {
                sku = stock.getVariant().getSku();
                if (stock.getVariant().getProduct() != null) {
                    productName = stock.getVariant().getProduct().getName();
                }
            }

            return InventoryStockResponse.builder()
                    .warehouseId(stock.getId().getWarehouseId())
                    .warehouseName(stock.getWarehouse() != null ? stock.getWarehouse().getName() : "UNKNOWN")
                    .variantId(stock.getId().getVariantId())
                    .sku(sku)
                    .productName(productName)
                    .quantity(stock.getQuantity())
                    .lastUpdated(stock.getUpdatedAt())
                    .build();
        }).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void importStock(StockRequest request) {
        Warehouse warehouse = warehouseRepository.findById(request.getWarehouseId())
                .orElseThrow(() -> new RuntimeException("Warehouse not found"));

        // Validate: Only Main Warehouse (Type 1) can import stock
        if (warehouse.getWarehouseType() != 1) {
            throw new RuntimeException("Import is only allowed for Central Warehouse (Main Warehouse)");
        }

        if (request.getSupplierId() != null && !supplierRepository.existsById(request.getSupplierId())) {
            throw new RuntimeException("Supplier not found: " + request.getSupplierId());
        }

        // Create Document
        InventoryDocument document = new InventoryDocument();
        document.setDocumentCode("IMP-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        document.setDocumentType(InventoryDocumentType.IMPORT);
        document.setTargetWarehouseId(warehouse.getId());
        document.setTargetWarehouse(warehouse);
        document.setSupplierId(request.getSupplierId());
        document.setNote(request.getNote());
        document.setCreatedBy(1L); // TODO: Get from SecurityContext
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

        // Validate: Source must be Central Warehouse (Type 1)
        if (sourceWarehouse.getWarehouseType() != 1) {
            throw new RuntimeException("Transfer source must be Central Warehouse");
        }

        // Validate: Target must be Store Warehouse (Type 2)
        if (targetWarehouse.getWarehouseType() != 2) {
            throw new RuntimeException("Transfer destination must be a Store Warehouse");
        }

        if (sourceWarehouse.getId().equals(targetWarehouse.getId())) {
            throw new RuntimeException("Source and Target warehouse cannot be the same");
        }

        // Create Document
        InventoryDocument document = new InventoryDocument();
        document.setDocumentCode("TRF-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        document.setDocumentType(InventoryDocumentType.TRANSFER);
        document.setSourceWarehouseId(sourceWarehouse.getId());
        document.setSourceWarehouse(sourceWarehouse);
        document.setTargetWarehouseId(targetWarehouse.getId());
        document.setTargetWarehouse(targetWarehouse);
        document.setNote(request.getNote());
        document.setCreatedBy(1L); // TODO: Get from SecurityContext
        document.setCreatedAt(LocalDateTime.now());

        InventoryDocument savedDoc = inventoryDocumentRepository.save(document);

        for (InventoryItemRequest itemReq : request.getItems()) {
            ProductVariant variant = productVariantRepository.findById(itemReq.getVariantId())
                    .orElseThrow(() -> new RuntimeException("Product Variant not found: " + itemReq.getVariantId()));

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
        history.setActorUserId(1L); // TODO: Get from SecurityContext
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
                .warehouseType(warehouse.getWarehouseType())
                .storeId(warehouse.getStoreId())
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
            storeWarehouseRepository.deleteByWarehouseId(id);
        } catch (Exception e) {
            // Ignore if method missing, assume handled or empty
        }

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

            return com.sba301.retailmanagement.dto.response.InventoryDocumentResponse.builder()
                    .id(doc.getId())
                    .documentCode(doc.getDocumentCode())
                    .documentType(doc.getDocumentType().name())
                    .sourceWarehouseId(doc.getSourceWarehouseId())
                    .sourceWarehouseName(doc.getSourceWarehouse() != null ? doc.getSourceWarehouse().getName() : null)
                    .targetWarehouseId(doc.getTargetWarehouseId())
                    .targetWarehouseName(doc.getTargetWarehouse() != null ? doc.getTargetWarehouse().getName() : null)
                    .note(doc.getNote())
                    .status("Completed") // Inventory transaction is immediate in this system logic
                    .createdBy(String.valueOf(doc.getCreatedBy()))
                    .createdAt(doc.getCreatedAt())
                    .totalItems(totalItems)
                    .totalValue(totalValue.longValue()) // DTO expects Long, converting BigDecimal
                    .supplier(supplierName)
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
}
