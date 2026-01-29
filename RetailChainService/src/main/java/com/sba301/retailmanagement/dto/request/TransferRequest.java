package com.sba301.retailmanagement.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TransferRequest {
    private Long sourceWarehouseId;
    private Long targetWarehouseId;
    private String note;
    private List<InventoryItemRequest> items;
}
