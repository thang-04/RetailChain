package com.sba301.retailmanagement.service;

import com.sba301.retailmanagement.dto.request.AttendanceCheckinRequest;
import com.sba301.retailmanagement.dto.request.AttendanceCheckoutRequest;
import com.sba301.retailmanagement.dto.request.AttendanceEditRequest;
import com.sba301.retailmanagement.dto.response.AttendanceCheckinResponse;
import com.sba301.retailmanagement.dto.response.AttendanceDashboardResponse;
import com.sba301.retailmanagement.dto.response.AttendanceHistoryResponse;
import com.sba301.retailmanagement.entity.User;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public interface AttendanceService {

    AttendanceCheckinResponse checkin(AttendanceCheckinRequest request, User user);

    AttendanceCheckinResponse checkout(AttendanceCheckoutRequest request, User user);

    Map<String, Object> getMyHistory(User user, LocalDate from, LocalDate to, int page, int limit);

    List<AttendanceHistoryResponse> getHistoryByUser(User user, Long targetUserId, Long storeId, LocalDate from, LocalDate to);

    List<AttendanceHistoryResponse> getStoreAttendance(Long storeId, LocalDate date, String status);

    AttendanceDashboardResponse getDashboard(Long storeId, LocalDate date);

    AttendanceDashboardResponse getAllDashboard(String region);

    AttendanceHistoryResponse editAttendance(Long id, AttendanceEditRequest request, User manager);

    AttendanceCheckinResponse createManualAttendance(AttendanceCheckinRequest request, Long userId, User manager);
}
