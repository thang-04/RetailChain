package com.sba301.retailmanagement.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AutoAssignStaffShiftPreferenceRequest {
    private Long userId;
    private List<Long> allowedShiftIds;
}
