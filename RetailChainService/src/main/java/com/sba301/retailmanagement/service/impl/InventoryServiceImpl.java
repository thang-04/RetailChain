package com.sba301.retailmanagement.service.impl;

import com.sba301.retailmanagement.dto.request.InventoryItemRequest;
import com.sba301.retailmanagement.dto.request.StockRequest;
import com.sba301.retailmanagement.dto.request.TransferRequest;
import com.sba301.retailmanagement.dto.request.WarehouseRequest;
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
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InventoryServiceImpl implements InventoryService {

    private final WarehouseRepository warehouseRepository;
    private final StoreWarehouseRepository storeWarehouseRepository;
    private final InventoryStockRepository inventoryStockRepository;
    private final InventoryDocumentRepository inventoryDocumentRepository;
    private final InventoryDocumentItemRepository inventoryDocumentItemRepository;
    private final InventoryHistoryRepository inventoryHistoryRepository;
    private final ProductVariantRepository productVariantRepository;

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
    @Transactional
    public void importStock(StockRequest request) {
        Warehouse warehouse = warehouseRepository.findById(request.getWarehouseId())
                .orElseThrow(() -> new RuntimeException("Warehouse not found"));

        // Create Document
        InventoryDocument document = new InventoryDocument();
        document.setDocumentCode("IMP-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        document.setDocumentType(InventoryDocumentType.IMPORT);
        document.setTargetWarehouseId(warehouse.getId());
        document.setTargetWarehouse(warehouse);
        document.setNote(request.getNote());
        document.setCreatedBy(1L); // TODO: Get from SecurityContext
        document.setCreatedAt(LocalDateTime.now());
        
        InventoryDocument savedDoc = inventoryDocumentRepository.save(document);

        for (InventoryItemRequest itemReq : request.getItems()) {
            ProductVariant variant = productVariantRepository.findById(itemReq.getVariantId())
                    .orElseThrow(() -> new RuntimeException("Product Variant not found: " + itemReq.getVariantId()));

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
            createHistory(savedDoc, savedItem, warehouse, variant, InventoryAction.IN, itemReq.getQuantity(), newQuantity);
        }
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
            createHistory(savedDoc, savedItem, warehouse, variant, InventoryAction.OUT, itemReq.getQuantity(), newQuantity);
        }
    }

    @Override
    @Transactional
    public void transferStock(TransferRequest request) {
        Warehouse sourceWarehouse = warehouseRepository.findById(request.getSourceWarehouseId())
                .orElseThrow(() -> new RuntimeException("Source Warehouse not found"));
        Warehouse targetWarehouse = warehouseRepository.findById(request.getTargetWarehouseId())
                .orElseThrow(() -> new RuntimeException("Target Warehouse not found"));

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
                    .orElseThrow(() -> new RuntimeException("Stock record not found in Source Warehouse for variant: " + variant.getId()));

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
            createHistory(savedDoc, savedItem, sourceWarehouse, variant, InventoryAction.OUT, itemReq.getQuantity(), sourceNewQty);

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
            createHistory(savedDoc, savedItem, targetWarehouse, variant, InventoryAction.IN, itemReq.getQuantity(), targetNewQty);
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
}
