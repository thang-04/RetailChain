package com.sba301.retailmanagement.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UpdateStoreRequest {
    private String name;
    private String address;
    private Double latitude;
    private Double longitude;
    private Integer radiusMeters;
    private Integer status;
    private Long warehouseId;
}
