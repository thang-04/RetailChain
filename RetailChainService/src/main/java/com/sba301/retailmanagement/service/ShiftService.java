package com.sba301.retailmanagement.service;

import com.sba301.retailmanagement.dto.request.ShiftAssignmentRequest;
import com.sba301.retailmanagement.dto.request.ShiftRequest;
import com.sba301.retailmanagement.dto.response.ShiftAssignmentResponse;
import com.sba301.retailmanagement.dto.response.ShiftResponse;

import java.time.LocalDate;
import java.util.List;

public interface ShiftService {

    ShiftResponse createShift(ShiftRequest request);

    List<ShiftResponse> getAllShifts();

    List<ShiftResponse> getShiftsByStore(Long storeId);

    ShiftAssignmentResponse assignShift(ShiftAssignmentRequest request);

    ShiftAssignmentResponse cancelAssignment(Long assignmentId);

    List<ShiftAssignmentResponse> getAssignmentsByStoreAndDateRange(Long storeId, LocalDate from, LocalDate to);

    List<ShiftAssignmentResponse> getAssignmentsByUser(Long userId);
}
