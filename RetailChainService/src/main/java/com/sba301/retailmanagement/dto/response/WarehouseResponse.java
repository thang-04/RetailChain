package com.sba301.retailmanagement.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class WarehouseResponse {
    private Long id;
    private String code;
    private String name;
    private Integer warehouseType;
    private Long storeId;
    private Integer status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
