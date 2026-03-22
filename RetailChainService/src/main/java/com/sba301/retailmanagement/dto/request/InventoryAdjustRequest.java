package com.sba301.retailmanagement.dto.request;

import lombok.Data;

@Data
public class InventoryAdjustRequest {
    private Integer quantity;
    private String reason;
}

