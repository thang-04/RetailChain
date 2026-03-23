package com.sba301.retailmanagement.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class InventoryStockResponse {

    /**
     * ID logic cho bản ghi tồn kho, encode từ warehouseId-variantId
     * (dùng cho API /api/inventory/{inventoryId} phía frontend).
     */
    private String inventoryId;

    private Long warehouseId;
    private String warehouseName;
    private Long variantId;
    private String sku;
    private String productName;
    private String variantName;
    private Integer quantity;
    private LocalDateTime lastUpdated;
}
