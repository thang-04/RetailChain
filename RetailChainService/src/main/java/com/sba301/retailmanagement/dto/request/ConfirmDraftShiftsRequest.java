package com.sba301.retailmanagement.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ConfirmDraftShiftsRequest {
    private Long storeId;
    private String from; // yyyy-MM-dd
    private String to;   // yyyy-MM-dd
    private Long confirmedBy;
}

