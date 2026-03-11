package com.sba301.retailmanagement.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DashboardStoreRowDTO {
    private Long storeId;
    private String storeCode;
    private String storeName;
    private String address;
    private Integer status;

    private Long stockQuantity;
    private Long lowStockCount;
}

