package com.sba301.retailmanagement.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class InventoryStockResponse {
    private Long warehouseId;
    private String warehouseName;
    private Long variantId;
    private String sku;
    private String productName;
    private Integer quantity;
    private LocalDateTime lastUpdated;
}
