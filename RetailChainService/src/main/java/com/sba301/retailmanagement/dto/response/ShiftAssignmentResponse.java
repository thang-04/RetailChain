package com.sba301.retailmanagement.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ShiftAssignmentResponse {
    private Long id;
    private Long shiftId;
    private String shiftName;
    private String startTime;
    private String endTime;
    private Long userId;
    private String userName;
    private String workDate;
    private String status;
    private Long createdBy;
    private String createdByName;
    private String createdAt;
}
