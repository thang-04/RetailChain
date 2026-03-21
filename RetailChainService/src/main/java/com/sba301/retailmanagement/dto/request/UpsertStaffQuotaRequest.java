package com.sba301.retailmanagement.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UpsertStaffQuotaRequest {
    private Long userId;
    private Long storeId;
    private Integer minShiftsPerWeek;
    private Integer maxShiftsPerWeek;
}

