package com.sba301.retailmanagement.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AutoAssignShiftsResponse {
    private List<ShiftAssignmentResponse> assignments = new ArrayList<>();
    private AutoAssignShiftsSummary summary = new AutoAssignShiftsSummary();
}

