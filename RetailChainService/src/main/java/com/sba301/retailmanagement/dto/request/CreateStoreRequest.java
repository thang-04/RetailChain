package com.sba301.retailmanagement.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CreateStoreRequest {
    private String code;
    private String name;
    private String address;
    private Long warehouseId;
}
