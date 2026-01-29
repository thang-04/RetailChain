package com.sba301.retailmanagement.dto.request;

import lombok.Data;

@Data
public class WarehouseRequest {
    private String code;
    private String name;
    private Integer warehouseType; // 1: Main, 2: Store
    private Long storeId; // Nullable if type is Main
}
