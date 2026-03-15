package com.sba301.retailmanagement.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class InventoryDocumentItemResponse {
    private Long variantId;
    private String productName;
    private String sku;
    private String size;
    private String color;
    private Integer quantity;
    private Long unitPrice;
    private Long totalPrice;
}
