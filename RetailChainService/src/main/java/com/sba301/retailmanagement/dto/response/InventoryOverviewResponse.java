package com.sba301.retailmanagement.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class InventoryOverviewResponse {
    /**
     * Tổng số lượng tồn kho trên toàn hệ thống.
     */
    private Long totalStockQuantity;

    /**
     * Tổng giá trị hàng tồn kho (tính theo price * quantity).
     * Đơn vị: cùng đơn vị tiền tệ với trường price của ProductVariant (ví dụ: VND).
     */
    private Long totalChainValue;

    /**
     * Số lượng kho/cửa hàng đang ở trạng thái cảnh báo (ví dụ: có mặt hàng tồn dưới ngưỡng).
     */
    private Long criticalStoreCount;

    /**
     * Phần trăm tăng trưởng so với kỳ trước (demo, hiện tại tính toán đơn giản).
     */
    private Double growthPercentage;
}

