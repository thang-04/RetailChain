package com.sba301.retailmanagement.dto.response;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class ProductVariantResponse {
    private Long id;
    private Long productId;
    private String sku;
    private String barcode;
    private String size;
    private String color;
    private BigDecimal price;
    private Integer status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
