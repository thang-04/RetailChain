package com.sba301.retailmanagement.service.impl;

import com.sba301.retailmanagement.dto.request.AttendanceCheckinRequest;
import com.sba301.retailmanagement.dto.request.AttendanceCheckoutRequest;
import com.sba301.retailmanagement.dto.request.AttendanceEditRequest;
import com.sba301.retailmanagement.dto.response.AttendanceCheckinResponse;
import com.sba301.retailmanagement.dto.response.AttendanceDashboardResponse;
import com.sba301.retailmanagement.dto.response.AttendanceHistoryResponse;
import com.sba301.retailmanagement.entity.AttendanceLog;
import com.sba301.retailmanagement.entity.Shift;
import com.sba301.retailmanagement.entity.ShiftAssignment;
import com.sba301.retailmanagement.entity.Store;
import com.sba301.retailmanagement.entity.User;
import com.sba301.retailmanagement.enums.CheckMethod;
import com.sba301.retailmanagement.enums.CheckType;
import com.sba301.retailmanagement.enums.RoleConstant;
import com.sba301.retailmanagement.enums.ShiftStatus;
import com.sba301.retailmanagement.repository.AttendanceLogRepository;
import com.sba301.retailmanagement.repository.ShiftAssignmentRepository;
import com.sba301.retailmanagement.repository.ShiftRepository;
import com.sba301.retailmanagement.repository.StoreRepository;
import com.sba301.retailmanagement.repository.UserRepository;
import com.sba301.retailmanagement.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AttendanceServiceImpl implements AttendanceService {

    private final AttendanceLogRepository attendanceLogRepository;
    private final StoreRepository storeRepository;
    private final UserRepository userRepository;
    private final ShiftRepository shiftRepository;
    private final ShiftAssignmentRepository shiftAssignmentRepository;

    private static final double EARTH_RADIUS_METERS = 6371000;
    private static final int DEFAULT_RADIUS_METERS = 50;
    private static final int GRACE_PERIOD_MINUTES = 10;

    @Override
    @Transactional
    public AttendanceCheckinResponse checkin(AttendanceCheckinRequest request, User user) {
        String prefix = "[checkin]|userId=" + user.getId();
        log.info("{}|START", prefix);

        Long storeId = user.getStoreId();
        if (storeId == null) {
            throw new RuntimeException("Bạn không được phân công cửa hàng");
        }

        Store store = storeRepository.findById(storeId)
                .orElseThrow(() -> new RuntimeException("Cửa hàng không tồn tại"));

        if (store.getLatitude() == null || store.getLongitude() == null) {
            throw new RuntimeException("Cửa hàng chưa được cấu hình GPS");
        }

        if (store.getStatus() != 1) {
            throw new RuntimeException("Cửa hàng đang đóng cửa, không thể checkin");
        }

        if (request.getLatitude() == null || request.getLongitude() == null) {
            throw new RuntimeException("Không thể lấy vị trí GPS");
        }

        double distance = calculateDistance(
                request.getLatitude(), request.getLongitude(),
                store.getLatitude(), store.getLongitude()
        );

        int radius = store.getRadiusMeters() != null ? store.getRadiusMeters() : DEFAULT_RADIUS_METERS;
        if (distance > radius) {
            throw new RuntimeException("Bạn phải checkin trong phạm vi " + radius + "m từ cửa hàng");
        }

        LocalDate today = LocalDate.now();
        LocalDateTime now = LocalDateTime.now();
        LocalTime nowTime = now.toLocalTime();

        Optional<AttendanceLog> existingCheckin = attendanceLogRepository
                .findLatestCheckinByUserIdAndDate(user.getId(), today);

        if (existingCheckin.isPresent()) {
            AttendanceLog oldLog = existingCheckin.get();
            Duration workDuration = Duration.between(oldLog.getOccurredAt(), now);
            double workHours = workDuration.toMinutes() / 60.0;
            oldLog.setWorkHours(workHours);
            oldLog.setStatus("FORGOT");
            attendanceLogRepository.save(oldLog);
        }

        ShiftAssignment assignment = getTodayShiftAssignment(user.getId(), storeId, today);
        
        if (assignment == null) {
            throw new RuntimeException("Bạn chưa được phân ca hôm nay");
        }

        Shift shift = assignment.getShift();
        LocalTime shiftStartTime = shift.getStartTime();
        LocalTime shiftEndTime = shift.getEndTime();
        
        if (nowTime.isAfter(shiftEndTime)) {
            throw new RuntimeException("Ca làm việc đã kết thúc lúc " + shiftEndTime + ", không thể checkin");
        }

        String status = "ONTIME";
        String warning = null;
        String shiftName = shift.getName();

        if (nowTime.isAfter(shiftStartTime.plusMinutes(GRACE_PERIOD_MINUTES))) {
            status = "LATE";
            long lateMinutes = Duration.between(shiftStartTime, nowTime).toMinutes();
            warning = "Bạn đến muộn " + lateMinutes + " phút so với giờ bắt đầu ca";
        }

        AttendanceLog attendanceLog = new AttendanceLog();
        attendanceLog.setUserId(user.getId());
        attendanceLog.setStoreId(storeId);
        attendanceLog.setCheckType(CheckType.IN);
        attendanceLog.setMethod(CheckMethod.GPS);
        attendanceLog.setOccurredAt(now);
        attendanceLog.setLatitude(request.getLatitude());
        attendanceLog.setLongitude(request.getLongitude());
        attendanceLog.setDistanceMeters(distance);
        attendanceLog.setStatus(status);
        attendanceLog.setCreatedBy(user.getId());
        attendanceLog.setCreatedAt(now);
        attendanceLog.setNote(request.getNote());
        attendanceLog.setAssignmentId(assignment.getId());

        AttendanceLog savedLog = attendanceLogRepository.save(attendanceLog);

        log.info("{}|END|id={}|status={}", prefix, savedLog.getId(), status);

        return AttendanceCheckinResponse.builder()
                .id(savedLog.getId())
                .userId(user.getId())
                .userName(user.getFullName())
                .storeId(storeId)
                .storeName(store.getName())
                .checkType("IN")
                .status(status)
                .occurredAt(now)
                .distanceMeters(distance)
                .message("Checkin thành công")
                .warning(warning)
                .build();
    }

    @Override
    @Transactional
    public AttendanceCheckinResponse checkout(AttendanceCheckoutRequest request, User user) {
        String prefix = "[checkout]|userId=" + user.getId();
        log.info("{}|START", prefix);

        Long storeId = user.getStoreId();
        if (storeId == null) {
            throw new RuntimeException("Bạn không được phân công cửa hàng");
        }

        Store store = storeRepository.findById(storeId)
                .orElseThrow(() -> new RuntimeException("Cửa hàng không tồn tại"));

        if (store.getStatus() != 1) {
            throw new RuntimeException("Cửa hàng đang đóng cửa");
        }

        if (request.getLatitude() == null || request.getLongitude() == null) {
            throw new RuntimeException("Không thể lấy vị trí GPS");
        }

        double distance = calculateDistance(
                request.getLatitude(), request.getLongitude(),
                store.getLatitude(), store.getLongitude()
        );

        int radius = store.getRadiusMeters() != null ? store.getRadiusMeters() : DEFAULT_RADIUS_METERS;
        if (distance > radius) {
            throw new RuntimeException("Bạn phải checkout trong phạm vi " + radius + "m từ cửa hàng");
        }

        LocalDate today = LocalDate.now();
        LocalDateTime now = LocalDateTime.now();
        LocalTime nowTime = now.toLocalTime();

        AttendanceLog checkinLog = attendanceLogRepository
                .findLatestCheckinByUserIdAndDate(user.getId(), today)
                .orElseThrow(() -> new RuntimeException("Bạn chưa checkin hôm nay"));

        if (checkinLog.getOccurredAt().isAfter(now)) {
            throw new RuntimeException("Thời gian checkout phải sau thời gian checkin");
        }

        ShiftAssignment assignment = checkinLog.getAssignmentId() != null
                ? shiftAssignmentRepository.findById(checkinLog.getAssignmentId()).orElse(null)
                : null;

        if (assignment == null) {
            throw new RuntimeException("Không tìm thấy ca làm việc, liên hệ quản lý");
        }

        if (assignment.getShift() == null) {
            throw new RuntimeException("Ca làm việc không hợp lệ, liên hệ quản lý");
        }

        Shift shift = assignment.getShift();
        LocalTime shiftEndTime = shift.getEndTime();

        if (nowTime.isBefore(shiftEndTime)) {
            throw new RuntimeException("Chưa đến giờ checkout. Ca làm việc kết thúc lúc " + shiftEndTime);
        }

        Duration workDuration = Duration.between(checkinLog.getOccurredAt(), now);
        double workHours = workDuration.toMinutes() / 60.0;

        String status = checkinLog.getStatus();
        String warning = null;

        if (workHours > 12) {
            warning = "Cảnh báo: Thời gian làm việc > 12 giờ";
        }

        checkinLog.setWorkHours(workHours);
        attendanceLogRepository.save(checkinLog);

        AttendanceLog attendanceLogOut = new AttendanceLog();
        attendanceLogOut.setUserId(user.getId());
        attendanceLogOut.setStoreId(storeId);
        attendanceLogOut.setCheckType(CheckType.OUT);
        attendanceLogOut.setMethod(CheckMethod.GPS);
        attendanceLogOut.setOccurredAt(now);
        attendanceLogOut.setLatitude(request.getLatitude());
        attendanceLogOut.setLongitude(request.getLongitude());
        attendanceLogOut.setDistanceMeters(distance);
        attendanceLogOut.setStatus(status);
        attendanceLogOut.setWorkHours(workHours);
        attendanceLogOut.setCreatedBy(user.getId());
        attendanceLogOut.setCreatedAt(now);
        attendanceLogOut.setNote(request.getNote());

        if (assignment != null) {
            attendanceLogOut.setAssignmentId(assignment.getId());
        }

        AttendanceLog savedLogOut = attendanceLogRepository.save(attendanceLogOut);

        log.info("{}|END|id={}|workHours={}", prefix, savedLogOut.getId(), workHours);

        return AttendanceCheckinResponse.builder()
                .id(savedLogOut.getId())
                .userId(user.getId())
                .userName(user.getFullName())
                .storeId(storeId)
                .storeName(store.getName())
                .checkType("OUT")
                .status(status)
                .occurredAt(now)
                .distanceMeters(distance)
                .message("Checkout thành công")
                .warning(warning)
                .build();
    }

    @Override
    public Map<String, Object> getMyHistory(User user, LocalDate from, LocalDate to, int page, int limit) {
        if (from == null) from = LocalDate.now().minusDays(30);
        if (to == null) to = LocalDate.now();

        List<AttendanceLog> logs = attendanceLogRepository
                .findByUserIdAndStoreIdAndDateBetween(user.getId(), user.getStoreId(), from, to);

        Map<LocalDate, AttendanceHistoryResponse> historyMap = new LinkedHashMap<>();

        for (AttendanceLog log : logs) {
            LocalDate date = log.getOccurredAt().toLocalDate();
            AttendanceHistoryResponse existing = historyMap.get(date);

            if (log.getCheckType() == CheckType.IN) {
                if (existing == null) {
                    existing = AttendanceHistoryResponse.builder()
                            .date(date.toString())
                            .checkInTime(log.getOccurredAt().toLocalTime().format(DateTimeFormatter.ofPattern("HH:mm")))
                            .status(log.getStatus())
                            .build();
                    historyMap.put(date, existing);
                } else {
                    existing.setCheckInTime(log.getOccurredAt().toLocalTime().format(DateTimeFormatter.ofPattern("HH:mm")));
                    existing.setStatus(log.getStatus());
                }
            } else if (log.getCheckType() == CheckType.OUT) {
                if (existing == null) {
                    existing = AttendanceHistoryResponse.builder()
                            .date(date.toString())
                            .checkOutTime(log.getOccurredAt().toLocalTime().format(DateTimeFormatter.ofPattern("HH:mm")))
                            .workHours(log.getWorkHours())
                            .status(log.getStatus())
                            .build();
                    historyMap.put(date, existing);
                } else {
                    existing.setCheckOutTime(log.getOccurredAt().toLocalTime().format(DateTimeFormatter.ofPattern("HH:mm")));
                    existing.setWorkHours(log.getWorkHours());
                    existing.setStatus(log.getStatus());
                }
            }
        }

        List<AttendanceHistoryResponse> list = new ArrayList<>(historyMap.values());
        list.sort((a, b) -> b.getDate().compareTo(a.getDate()));

        int total = list.size();
        int start = page * limit;
        int end = Math.min(start + limit, total);
        List<AttendanceHistoryResponse> paged = start < total ? list.subList(start, end) : Collections.emptyList();

        Map<String, Object> result = new HashMap<>();
        result.put("data", paged);
        result.put("pagination", Map.of(
                "page", page,
                "limit", limit,
                "total", total,
                "totalPages", (int) Math.ceil((double) total / limit)
        ));

        return result;
    }

    @Override
    public List<AttendanceHistoryResponse> getHistoryByUser(User user, Long targetUserId, Long storeId, LocalDate from, LocalDate to) {
        if (from == null) from = LocalDate.now().minusDays(30);
        if (to == null) to = LocalDate.now();

        boolean isAdmin = user.getRoles().stream()
                .anyMatch(r -> r.getName().equals(RoleConstant.SUPER_ADMIN.name()));

        if (!isAdmin && !user.getId().equals(targetUserId)) {
            if (user.getStoreId() == null || !user.getStoreId().equals(storeId)) {
                throw new RuntimeException("Bạn không có quyền xem lịch sử của nhân viên này");
            }
        }

        List<AttendanceLog> logs = attendanceLogRepository
                .findByUserIdAndStoreIdAndDateBetween(targetUserId, storeId, from, to);

        return buildHistoryResponse(logs);
    }

    @Override
    public List<AttendanceHistoryResponse> getStoreAttendance(Long storeId, LocalDate date, String status) {
        if (date == null) date = LocalDate.now();

        List<AttendanceLog> logs = attendanceLogRepository.findByStoreIdAndDate(storeId, date);

        if (status != null && !status.isEmpty()) {
            String[] statuses = status.split(",");
            logs = logs.stream()
                    .filter(l -> Arrays.asList(statuses).contains(l.getStatus()))
                    .collect(Collectors.toList());
        }

        return buildHistoryResponse(logs);
    }

    @Override
    public AttendanceDashboardResponse getDashboard(Long storeId, LocalDate date) {
        if (date == null) date = LocalDate.now();

        List<AttendanceLog> logs = attendanceLogRepository.findByStoreIdAndDate(storeId, date);

        long totalStaff = userRepository.findAll().stream()
                .filter(u -> u.getStoreId() != null && u.getStoreId().equals(storeId))
                .count();

        long presentToday = logs.stream()
                .filter(l -> l.getCheckType() == CheckType.IN)
                .count();

        long completedToday = logs.stream()
                .filter(l -> l.getCheckType() == CheckType.OUT)
                .count();

        long lateArrivals = logs.stream()
                .filter(l -> l.getCheckType() == CheckType.IN && "LATE".equals(l.getStatus()))
                .count();

        long earlyLeaves = logs.stream()
                .filter(l -> l.getCheckType() == CheckType.OUT && "EARLY_LEAVE".equals(l.getStatus()))
                .count();

        long forgotCount = logs.stream()
                .filter(l -> "FORGOT".equals(l.getStatus()))
                .count();

        double avgWorkHours = logs.stream()
                .filter(l -> l.getWorkHours() != null)
                .mapToDouble(AttendanceLog::getWorkHours)
                .average()
                .orElse(0.0);

        return AttendanceDashboardResponse.builder()
                .presentToday(presentToday)
                .completedToday(completedToday)
                .totalStaff(totalStaff)
                .lateArrivals(lateArrivals)
                .earlyLeaves(earlyLeaves)
                .forgotCount(forgotCount)
                .avgWorkHours(Math.round(avgWorkHours * 100.0) / 100.0)
                .date(date.toString())
                .build();
    }

    @Override
    public AttendanceDashboardResponse getAllDashboard(String region) {
        List<Store> stores = storeRepository.findAll();
        
        long totalPresent = 0;
        long totalCompleted = 0;
        long totalStaff = 0;
        long totalLate = 0;
        long totalEarly = 0;
        double totalWorkHours = 0;
        int countWithHours = 0;

        for (Store store : stores) {
            if (store.getStatus() == 1) {
                AttendanceDashboardResponse dash = getDashboard(store.getId(), LocalDate.now());
                totalPresent += dash.getPresentToday();
                totalCompleted += dash.getCompletedToday();
                totalStaff += dash.getTotalStaff();
                totalLate += dash.getLateArrivals();
                totalEarly += dash.getEarlyLeaves();
                if (dash.getAvgWorkHours() > 0) {
                    totalWorkHours += dash.getAvgWorkHours();
                    countWithHours++;
                }
            }
        }

        return AttendanceDashboardResponse.builder()
                .presentToday(totalPresent)
                .completedToday(totalCompleted)
                .totalStaff(totalStaff)
                .lateArrivals(totalLate)
                .earlyLeaves(totalEarly)
                .avgWorkHours(countWithHours > 0 ? Math.round((totalWorkHours / countWithHours) * 100.0) / 100.0 : 0.0)
                .date(LocalDate.now().toString())
                .build();
    }

    @Override
    @Transactional
    public AttendanceHistoryResponse editAttendance(Long id, AttendanceEditRequest request, User manager) {
        AttendanceLog log = attendanceLogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bản ghi"));

        if (request.getNewCheckInTime() != null) {
            LocalTime newCheckIn = LocalTime.parse(request.getNewCheckInTime());
            LocalDate date = log.getOccurredAt().toLocalDate();
            log.setOccurredAt(LocalDateTime.of(date, newCheckIn));
        }

        if (request.getNewCheckOutTime() != null) {
            AttendanceLog checkinLog = attendanceLogRepository
                    .findLatestCheckinByUserIdAndDate(log.getUserId(), log.getOccurredAt().toLocalDate())
                    .orElse(null);
            if (checkinLog != null) {
                LocalTime newCheckOut = LocalTime.parse(request.getNewCheckOutTime());
                LocalDate date = log.getOccurredAt().toLocalDate();
                Duration workDuration = Duration.between(checkinLog.getOccurredAt(), LocalDateTime.of(date, newCheckOut));
                double workHours = workDuration.toMinutes() / 60.0;
                log.setWorkHours(workHours);
            }
        }

        String note = log.getNote();
        if (note == null) note = "";
        note += " | Sửa thủ công bởi " + manager.getFullName() + " - " + LocalDateTime.now();
        if (request.getReason() != null) {
            note += ". Lý do: " + request.getReason();
        }
        log.setNote(note);

        log = attendanceLogRepository.save(log);

        return AttendanceHistoryResponse.builder()
                .date(log.getOccurredAt().toLocalDate().toString())
                .checkInTime(log.getOccurredAt().toLocalTime().format(DateTimeFormatter.ofPattern("HH:mm")))
                .workHours(log.getWorkHours())
                .status(log.getStatus())
                .build();
    }

    @Override
    @Transactional
    public AttendanceCheckinResponse createManualAttendance(AttendanceCheckinRequest request, Long userId, User manager) {
        User targetUser = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhân viên"));

        AttendanceLog log = new AttendanceLog();
        log.setUserId(userId);
        log.setStoreId(targetUser.getStoreId());
        log.setCheckType(CheckType.IN);
        log.setMethod(com.sba301.retailmanagement.enums.CheckMethod.MANUAL);
        log.setOccurredAt(LocalDateTime.now());
        log.setLatitude(request.getLatitude());
        log.setLongitude(request.getLongitude());
        log.setCreatedBy(manager.getId());
        log.setCreatedAt(LocalDateTime.now());

        String note = "Sửa thủ công bởi " + manager.getFullName();
        if (request.getNote() != null) {
            note += ". " + request.getNote();
        }
        log.setNote(note);

        log = attendanceLogRepository.save(log);

        return AttendanceCheckinResponse.builder()
                .id(log.getId())
                .userId(userId)
                .userName(targetUser.getFullName())
                .storeId(targetUser.getStoreId())
                .checkType("IN")
                .message("Tạo thủ công thành công")
                .build();
    }

    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        double latRad1 = Math.toRadians(lat1);
        double latRad2 = Math.toRadians(lat2);
        double deltaLat = Math.toRadians(lat2 - lat1);
        double deltaLon = Math.toRadians(lon2 - lon1);

        double a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
                Math.cos(latRad1) * Math.cos(latRad2) *
                        Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return EARTH_RADIUS_METERS * c;
    }

    private ShiftAssignment getTodayShiftAssignment(Long userId, Long storeId, LocalDate date) {
        List<ShiftAssignment> assignments = shiftAssignmentRepository
                .findByUserIdAndWorkDate(userId, date);

        return assignments.stream()
                .filter(a -> a.getStatus() == ShiftStatus.ASSIGNED)
                .findFirst()
                .orElse(null);
    }

    private List<AttendanceHistoryResponse> buildHistoryResponse(List<AttendanceLog> logs) {
        Map<LocalDate, AttendanceHistoryResponse> historyMap = new LinkedHashMap<>();

        for (AttendanceLog log : logs) {
            LocalDate date = log.getOccurredAt().toLocalDate();
            AttendanceHistoryResponse existing = historyMap.get(date);

            if (log.getCheckType() == CheckType.IN) {
                if (existing == null) {
                    existing = AttendanceHistoryResponse.builder()
                            .date(date.toString())
                            .checkInTime(log.getOccurredAt().toLocalTime().format(DateTimeFormatter.ofPattern("HH:mm")))
                            .status(log.getStatus())
                            .build();
                    historyMap.put(date, existing);
                } else {
                    existing.setCheckInTime(log.getOccurredAt().toLocalTime().format(DateTimeFormatter.ofPattern("HH:mm")));
                }
            } else if (log.getCheckType() == CheckType.OUT) {
                if (existing == null) {
                    existing = AttendanceHistoryResponse.builder()
                            .date(date.toString())
                            .checkOutTime(log.getOccurredAt().toLocalTime().format(DateTimeFormatter.ofPattern("HH:mm")))
                            .workHours(log.getWorkHours())
                            .status(log.getStatus())
                            .build();
                    historyMap.put(date, existing);
                } else {
                    existing.setCheckOutTime(log.getOccurredAt().toLocalTime().format(DateTimeFormatter.ofPattern("HH:mm")));
                    existing.setWorkHours(log.getWorkHours());
                }
            }
        }

        List<AttendanceHistoryResponse> list = new ArrayList<>(historyMap.values());
        list.sort((a, b) -> b.getDate().compareTo(a.getDate()));
        return list;
    }
}
