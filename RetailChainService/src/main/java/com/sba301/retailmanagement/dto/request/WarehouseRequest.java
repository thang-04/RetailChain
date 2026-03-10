package com.sba301.retailmanagement.dto.request;

import lombok.Data;

@Data
public class WarehouseRequest {
    private String code;
    private String name;
    private String address;
    private String province;
    private String district;
    private String ward;
    private String contactName;
    private String contactPhone;
    private String description;
    private Boolean isCentral;
    private Integer status;
}
