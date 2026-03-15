package com.sba301.retailmanagement.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StockRequestItemRequest {
    private Long variantId;
    private Integer quantity;
    private String note;
}
