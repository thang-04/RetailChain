package com.sba301.retailmanagement.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StockRequest {
    private Long warehouseId;
    private Long supplierId; // Added for Import
    private String note;
    private List<InventoryItemRequest> items;
}
