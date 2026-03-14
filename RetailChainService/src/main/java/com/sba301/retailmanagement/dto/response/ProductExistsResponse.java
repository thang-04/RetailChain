package com.sba301.retailmanagement.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProductExistsResponse {
    private boolean exists;
    private Long productId;
    private String code;
}
