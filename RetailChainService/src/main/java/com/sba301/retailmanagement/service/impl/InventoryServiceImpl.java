package com.sba301.retailmanagement.service.impl;

import com.sba301.retailmanagement.dto.request.InventoryItemRequest;
import com.sba301.retailmanagement.dto.request.StockRequest;
import com.sba301.retailmanagement.dto.request.TransferRequest;
import com.sba301.retailmanagement.dto.response.InventoryOverviewResponse;
import com.sba301.retailmanagement.dto.response.InventoryStockResponse;
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
    @Transactional
    public void importStock(StockRequest request) {
        Warehouse warehouse = warehouseRepository.findById(request.getWarehouseId())
                .orElseThrow(() -> new RuntimeException("Warehouse not found"));

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

            // Calculate Value - use item unitPrice if provided, otherwise fallback to variant price
            java.math.BigDecimal unitPrice = itemReq.getUnitPrice();
            if (unitPrice == null && variant.getPrice() != null) {
                unitPrice = variant.getPrice();
            }
            if (unitPrice != null) {
                totalAmount = totalAmount.add(unitPrice.multiply(java.math.BigDecimal.valueOf(itemReq.getQuantity())));
            }

            // Save Document Item
            InventoryDocumentItem docItem = new InventoryDocumentItem();
            docItem.setDocumentId(savedDoc.getId());
            docItem.setDocument(savedDoc);
            docItem.setVariantId(itemReq.getVariantId());
            docItem.setVariant(variant);
            docItem.setQuantity(itemReq.getQuantity());
            docItem.setUnitPrice(unitPrice);
            docItem.setNote(itemReq.getNote());
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
    }

    @Override
    @Transactional
    public void transferStock(TransferRequest request) {
        Warehouse sourceWarehouse = warehouseRepository.findById(request.getSourceWarehouseId())
                .orElseThrow(() -> new RuntimeException("Source Warehouse not found"));
        Warehouse targetWarehouse = warehouseRepository.findById(request.getTargetWarehouseId())
                .orElseThrow(() -> new RuntimeException("Target Warehouse not found"));

        // Validate: Source must NOT be linked to any store (Central Warehouse)
        boolean sourceHasStore = storeWarehouseRepository.existsByWarehouseId(sourceWarehouse.getId());
        if (sourceHasStore) {
            throw new RuntimeException("Transfer source must be a Central Warehouse (not linked to any store)");
        }

        // Validate: Target MUST be linked to a store (Store Warehouse)
        boolean targetHasStore = storeWarehouseRepository.existsByWarehouseId(targetWarehouse.getId());
        if (!targetHasStore) {
            throw new RuntimeException("Transfer destination must be a Store Warehouse (linked to a store)");
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
                    .status("Completed")
                    .createdBy(String.valueOf(doc.getCreatedBy()))
                    .createdAt(doc.getCreatedAt())
                    .totalItems(totalItems)
                    .totalValue(totalValue.longValue())
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
                        stock.getVariant().getPrice().multiply(java.math.BigDecimal.valueOf(quantity))
                );
            }

            // Đánh dấu kho "cần chú ý" nếu có bất kỳ mặt hàng nào tồn dưới 10
            if (quantity < 10 && stock.getId() != null) {
                criticalWarehouses.add(stock.getId().getWarehouseId());
            }
        }

        // Hiện tại chưa có dữ liệu so sánh kỳ trước, tạm thời mock cứng 2.4% như UI demo
        double growthPercentage = 2.4d;

        return InventoryOverviewResponse.builder()
                .totalStockQuantity(totalQuantity)
                .totalChainValue(totalValue.longValue())
                .criticalStoreCount((long) criticalWarehouses.size())
                .growthPercentage(growthPercentage)
                .build();
    }
}
