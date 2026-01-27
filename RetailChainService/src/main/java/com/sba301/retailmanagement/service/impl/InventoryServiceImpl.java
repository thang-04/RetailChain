package com.sba301.retailmanagement.service.impl;

import com.sba301.retailmanagement.dto.request.WarehouseRequest;
import com.sba301.retailmanagement.dto.response.InventoryStockResponse;
import com.sba301.retailmanagement.dto.response.WarehouseResponse;
import com.sba301.retailmanagement.entity.InventoryStock;
import com.sba301.retailmanagement.entity.Store;
import com.sba301.retailmanagement.entity.StoreWarehouse;
import com.sba301.retailmanagement.entity.StoreWarehouseId;
import com.sba301.retailmanagement.entity.Warehouse;
import com.sba301.retailmanagement.repository.InventoryStockRepository;
import com.sba301.retailmanagement.repository.StoreWarehouseRepository;
import com.sba301.retailmanagement.repository.WarehouseRepository;
import com.sba301.retailmanagement.service.InventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InventoryServiceImpl implements InventoryService {

    private final WarehouseRepository warehouseRepository;
    private final StoreWarehouseRepository storeWarehouseRepository;
    private final InventoryStockRepository inventoryStockRepository;

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

        // Nếu là kho cửa hàng (type = 2) thì gán storeId
        if (request.getWarehouseType() == 2 && request.getStoreId() != null) {
            warehouse.setStoreId(request.getStoreId());
        }

        Warehouse savedWarehouse = warehouseRepository.save(warehouse);

        // Nếu là kho cửa hàng, tạo liên kết StoreWarehouse
        if (request.getWarehouseType() == 2 && request.getStoreId() != null) {
            StoreWarehouse storeWarehouse = new StoreWarehouse();
            StoreWarehouseId id = new StoreWarehouseId(request.getStoreId(), savedWarehouse.getId());
            storeWarehouse.setId(id);
            
            // StoreWarehouse không có field created_at/updated_at
            // Set Store và Warehouse proxy
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
