package com.sba301.retailmanagement.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ShiftRequest {
    private Long storeId;
    private String name;
    private String startTime; // Format: "HH:mm:ss"
    private String endTime; // Format: "HH:mm:ss"
    private boolean isDefault;
}
