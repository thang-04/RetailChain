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
    private String address;
    private String province;
    private String district;
    private String ward;
    private String contactName;
    private String contactPhone;
    private String description;
    private Integer isDefault;
    private Integer warehouseLevel;
    private Long parentId;
    private Integer status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
