package com.sba301.retailmanagement.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StoreInventoryDTO {
    private Long id;
    private String name;
    private String sku;
    private String category;
    private Integer stock;
    private String price;
    private String status;
}
