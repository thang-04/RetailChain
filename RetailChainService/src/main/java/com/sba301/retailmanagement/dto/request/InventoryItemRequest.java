package com.sba301.retailmanagement.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class InventoryItemRequest {
    private Long variantId;
    private Integer quantity;
    private BigDecimal unitPrice;
    private String note;
}
