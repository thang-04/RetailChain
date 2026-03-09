package com.sba301.retailmanagement.dto.request;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class ProductVariantRequest {
    private String sku;
    private String barcode;
    private String size;
    private String color;
    private BigDecimal price;
    private Integer status;
    private Integer initialQuantity;
    private Long warehouseId;
}
