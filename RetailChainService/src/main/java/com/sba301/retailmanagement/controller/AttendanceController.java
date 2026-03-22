package com.sba301.retailmanagement.controller;

import com.sba301.retailmanagement.dto.request.AttendanceCheckinRequest;
import com.sba301.retailmanagement.dto.request.AttendanceCheckoutRequest;
import com.sba301.retailmanagement.dto.request.AttendanceEditRequest;
import com.sba301.retailmanagement.dto.response.AttendanceCheckinResponse;
import com.sba301.retailmanagement.dto.response.AttendanceDashboardResponse;
import com.sba301.retailmanagement.dto.response.AttendanceHistoryResponse;
import com.sba301.retailmanagement.entity.User;
import com.sba301.retailmanagement.repository.UserRepository;
import com.sba301.retailmanagement.service.AttendanceService;
import com.sba301.retailmanagement.utils.ApiCode;
import com.sba301.retailmanagement.utils.ResponseJson;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
@Slf4j
public class AttendanceController {

    private final AttendanceService attendanceService;
    private final UserRepository userRepository;

    @PostMapping("/checkin")
    public String checkin(@RequestBody AttendanceCheckinRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        String prefix = "[checkin]";
        log.info("{}|START", prefix);
        try {
            User user = getCurrentUser(userDetails);
            AttendanceCheckinResponse response = attendanceService.checkin(request, user);
            log.info("{}|END|id={}", prefix, response.getId());
            return ResponseJson.toJsonWithData(ApiCode.SUCCESSFUL, "Checkin thành công", response);
        } catch (Exception e) {
            log.error("{}|Exception={}", prefix, e.getMessage(), e);
            return ResponseJson.toJsonString(ApiCode.UNSUCCESSFUL, e.getMessage());
        }
    }

    @PostMapping("/checkout")
    public String checkout(@RequestBody AttendanceCheckoutRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        String prefix = "[checkout]";
        log.info("{}|START", prefix);
        try {
            User user = getCurrentUser(userDetails);
            AttendanceCheckinResponse response = attendanceService.checkout(request, user);
            log.info("{}|END|id={}", prefix, response.getId());
            return ResponseJson.toJsonWithData(ApiCode.SUCCESSFUL, "Checkout thành công", response);
        } catch (Exception e) {
            log.error("{}|Exception={}", prefix, e.getMessage(), e);
            return ResponseJson.toJsonString(ApiCode.UNSUCCESSFUL, e.getMessage());
        }
    }

    @GetMapping("/my-history")
    public String getMyHistory(@AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "30") int limit) {
        String prefix = "[getMyHistory]";
        log.info("{}|START", prefix);
        try {
            User user = getCurrentUser(userDetails);
            Map<String, Object> response = attendanceService.getMyHistory(user, from, to, page, limit);
            log.info("{}|END", prefix);
            return ResponseJson.toJsonWithData(ApiCode.SUCCESSFUL, "Lấy lịch sử thành công", response);
        } catch (Exception e) {
            log.error("{}|Exception={}", prefix, e.getMessage(), e);
            return ResponseJson.toJsonString(ApiCode.UNSUCCESSFUL, e.getMessage());
        }
    }

    @GetMapping("/user/{userId}")
    public String getUserHistory(@PathVariable Long userId,
            @RequestParam Long storeId,
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        String prefix = "[getUserHistory]|userId=" + userId;
        log.info("{}|START", prefix);
        try {
            User user = getCurrentUser(userDetails);
            List<AttendanceHistoryResponse> response = attendanceService.getHistoryByUser(user, userId, storeId, from,
                    to);
            log.info("{}|END|size={}", prefix, response.size());
            return ResponseJson.toJsonWithData(ApiCode.SUCCESSFUL, "Lấy lịch sử thành công", response);
        } catch (Exception e) {
            log.error("{}|Exception={}", prefix, e.getMessage(), e);
            return ResponseJson.toJsonString(ApiCode.UNSUCCESSFUL, e.getMessage());
        }
    }

    @GetMapping("/store/{storeId}")
    public String getStoreAttendance(@PathVariable Long storeId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) String status) {
        String prefix = "[getStoreAttendance]|storeId=" + storeId;
        log.info("{}|START", prefix);
        try {
            List<AttendanceHistoryResponse> response = attendanceService.getStoreAttendance(storeId, date, status);
            log.info("{}|END|size={}", prefix, response.size());
            return ResponseJson.toJsonWithData(ApiCode.SUCCESSFUL, "Lấy attendance thành công", response);
        } catch (Exception e) {
            log.error("{}|Exception={}", prefix, e.getMessage(), e);
            return ResponseJson.toJsonString(ApiCode.UNSUCCESSFUL, e.getMessage());
        }
    }

    @GetMapping("/dashboard/{storeId}")
    public String getDashboard(@PathVariable Long storeId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        String prefix = "[getDashboard]|storeId=" + storeId;
        log.info("{}|START", prefix);
        try {
            AttendanceDashboardResponse response = attendanceService.getDashboard(storeId, date);
            log.info("{}|END", prefix);
            return ResponseJson.toJsonWithData(ApiCode.SUCCESSFUL, "Lấy dashboard thành công", response);
        } catch (Exception e) {
            log.error("{}|Exception={}", prefix, e.getMessage(), e);
            return ResponseJson.toJsonString(ApiCode.UNSUCCESSFUL, e.getMessage());
        }
    }

    @GetMapping("/dashboard/all")
    public String getAllDashboard(@RequestParam(required = false) String region) {
        String prefix = "[getAllDashboard]";
        log.info("{}|START", prefix);
        try {
            AttendanceDashboardResponse response = attendanceService.getAllDashboard(region);
            log.info("{}|END", prefix);
            return ResponseJson.toJsonWithData(ApiCode.SUCCESSFUL, "Lấy dashboard thành công", response);
        } catch (Exception e) {
            log.error("{}|Exception={}", prefix, e.getMessage(), e);
            return ResponseJson.toJsonString(ApiCode.UNSUCCESSFUL, e.getMessage());
        }
    }

    @PutMapping("/{id}/edit")
    public String editAttendance(@PathVariable Long id,
            @RequestBody AttendanceEditRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        String prefix = "[editAttendance]|id=" + id;
        log.info("{}|START", prefix);
        try {
            User manager = getCurrentUser(userDetails);
            AttendanceHistoryResponse response = attendanceService.editAttendance(id, request, manager);
            log.info("{}|END", prefix);
            return ResponseJson.toJsonWithData(ApiCode.SUCCESSFUL, "Cập nhật thành công", response);
        } catch (Exception e) {
            log.error("{}|Exception={}", prefix, e.getMessage(), e);
            return ResponseJson.toJsonString(ApiCode.UNSUCCESSFUL, e.getMessage());
        }
    }

    @PostMapping("/manual")
    public String createManualAttendance(@RequestBody AttendanceCheckinRequest request,
            @RequestParam Long userId,
            @AuthenticationPrincipal UserDetails userDetails) {
        String prefix = "[createManualAttendance]|userId=" + userId;
        log.info("{}|START", prefix);
        try {
            User manager = getCurrentUser(userDetails);
            AttendanceCheckinResponse response = attendanceService.createManualAttendance(request, userId, manager);
            log.info("{}|END|id={}", prefix, response.getId());
            return ResponseJson.toJsonWithData(ApiCode.SUCCESSFUL, "Tạo thủ công thành công", response);
        } catch (Exception e) {
            log.error("{}|Exception={}", prefix, e.getMessage(), e);
            return ResponseJson.toJsonString(ApiCode.UNSUCCESSFUL, e.getMessage());
        }
    }

    private User getCurrentUser(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
