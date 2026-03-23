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
public class AutoAssignShiftsRequest {
    private Long storeId;
    private String from; // yyyy-MM-dd
    private String to;   // yyyy-MM-dd
    private Long createdBy;
    private Boolean resetDraft;
    private List<Long> shiftIds;
    private List<AutoAssignStaffShiftPreferenceRequest> staffShiftPreferences;
}

