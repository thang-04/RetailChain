package com.sba301.retailmanagement.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DashboardKpiItemDTO {
    /**
     * key để FE map icon/format (vd: totalProducts, totalVariants, activeStores, inventoryValue)
     */
    private String key;

    private String title;

    /**
     * Giá trị dạng số thô. FE sẽ tự format theo ngữ cảnh (đếm / tiền / %).
     */
    private Long value;

    /**
     * Thay đổi so với kỳ trước (nếu có). Hiện tại có thể null.
     */
    private Double changePercent;
}

