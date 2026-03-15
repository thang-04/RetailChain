package com.sba301.retailmanagement.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class StockRequestItemResponse {
    private Long id;
    private Long variantId;
    private String variantName;
    private String sku;
    private Integer quantity;
    private String note;
    private Integer availableStock;
}
