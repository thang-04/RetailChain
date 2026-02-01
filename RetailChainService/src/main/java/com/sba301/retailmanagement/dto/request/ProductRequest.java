package com.sba301.retailmanagement.dto.request;

import lombok.Data;

@Data
public class ProductRequest {
    private Long categoryId;
    private String code;
    private String name;
    private String description;
    private String gender;
    private Integer status;
}
