package com.sba301.retailmanagement.dto.request;

import lombok.Data;

@Data
public class ProductRequest {
    private Long categoryId;
    private String code;
    private String name;
    private String description;
    private String image;
    private String gender; // MEN, WOMEN, UNISEX, KIDS
    private Integer status; // 1 = Active, 0 = Inactive
}
