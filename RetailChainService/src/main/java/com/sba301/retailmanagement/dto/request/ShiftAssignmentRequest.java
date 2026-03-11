package com.sba301.retailmanagement.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ShiftAssignmentRequest {
    private Long shiftId;
    private Long userId;
    private String workDate; // Format: "yyyy-MM-dd"
    private Long createdBy;
}
