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
public class AutoAssignShiftsSummary {
    private int createdDraftCount = 0;
    private List<String> understaffedNotes = new ArrayList<>();
}

