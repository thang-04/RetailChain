package com.sba301.retailmanagement.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DashboardStoreRankingDTO {
    private Long storeId;
    private String storeCode;
    private String storeName;

    /**
     * Tổng số lượng tồn kho (sum quantity) của cửa hàng (theo warehouse gắn với store).
     */
    private Long stockQuantity;

}

