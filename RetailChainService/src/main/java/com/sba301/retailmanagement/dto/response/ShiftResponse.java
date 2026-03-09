package com.sba301.retailmanagement.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ShiftResponse {
    private Long id;
    private Long storeId;
    private String storeName;
    private String name;
    private String startTime;
    private String endTime;
    private String createdAt;
}
