package com.sba301.retailmanagement.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class InventoryDetailResponse {

    private String inventoryId;

    private Long storeId;
    private String storeName;

    private Long warehouseId;
    private String warehouseName;

    private Long variantId;
    private String sku;
    private String productName;
    private String variantName;

    private Integer quantity;
    private LocalDateTime lastUpdated;
}

