package com.sba301.retailmanagement.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StoreKpiDTO {
    private Integer totalProductVariants;
    private Long totalStockQuantity;
    private Integer lowStockCount;
    private Integer activeStaff;
}
