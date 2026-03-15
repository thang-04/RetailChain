package com.sba301.retailmanagement.service.impl;

import com.sba301.retailmanagement.dto.request.ShiftAssignmentRequest;
import com.sba301.retailmanagement.dto.request.ShiftRequest;
import com.sba301.retailmanagement.dto.response.ShiftAssignmentResponse;
import com.sba301.retailmanagement.dto.response.ShiftResponse;
import com.sba301.retailmanagement.entity.Shift;
import com.sba301.retailmanagement.entity.ShiftAssignment;
import com.sba301.retailmanagement.entity.Store;
import com.sba301.retailmanagement.entity.User;
import com.sba301.retailmanagement.enums.ShiftStatus;
import com.sba301.retailmanagement.exception.ResourceNotFoundException;
import com.sba301.retailmanagement.repository.ShiftAssignmentRepository;
import com.sba301.retailmanagement.repository.ShiftRepository;
import com.sba301.retailmanagement.repository.StoreRepository;
import com.sba301.retailmanagement.repository.UserRepository;
import com.sba301.retailmanagement.service.ShiftService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
public class ShiftServiceImpl implements ShiftService {

    @Autowired
    private ShiftRepository shiftRepository;

    @Autowired
    private ShiftAssignmentRepository shiftAssignmentRepository;

    @Autowired
    private StoreRepository storeRepository;

    @Autowired
    private UserRepository userRepository;

    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("HH:mm:ss");
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    private static final DateTimeFormatter DATETIME_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    // ==================== SHIFT CRUD ====================

    @Override
    public ShiftResponse createShift(ShiftRequest request) {
        Store store = storeRepository.findById(request.getStoreId())
                .orElseThrow(() -> new ResourceNotFoundException("Store not found with id: " + request.getStoreId()));

        Shift shift = new Shift();
        shift.setStoreId(request.getStoreId());
        shift.setName(request.getName());
        shift.setStartTime(LocalTime.parse(request.getStartTime(), TIME_FORMATTER));
        shift.setEndTime(LocalTime.parse(request.getEndTime(), TIME_FORMATTER));
        shift.setCreatedAt(LocalDateTime.now());
        shift.setUpdatedAt(LocalDateTime.now());

        Shift saved = shiftRepository.save(shift);
        return toShiftResponse(saved, store.getName());
    }

    @Override
    public ShiftResponse updateShift(Long shiftId, ShiftRequest request) {
        Shift shift = shiftRepository.findById(shiftId)
                .orElseThrow(() -> new ResourceNotFoundException("Shift not found with id: " + shiftId));

        if (request.getName() != null) shift.setName(request.getName());
        if (request.getStartTime() != null) shift.setStartTime(LocalTime.parse(request.getStartTime(), TIME_FORMATTER));
        if (request.getEndTime() != null) shift.setEndTime(LocalTime.parse(request.getEndTime(), TIME_FORMATTER));
        shift.setUpdatedAt(LocalDateTime.now());

        Shift saved = shiftRepository.save(shift);
        String storeName = storeRepository.findById(saved.getStoreId()).map(Store::getName).orElse("Unknown");
        return toShiftResponse(saved, storeName);
    }

    @Override
    public List<ShiftResponse> getAllShifts() {
        return shiftRepository.findAll().stream()
                .map(shift -> {
                    String storeName = "Hệ thống";
                    if (shift.getStoreId() != null) {
                        storeName = storeRepository.findById(shift.getStoreId())
                                .map(Store::getName).orElse("Unknown");
                    }
                    return toShiftResponse(shift, storeName);
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<ShiftResponse> getShiftsByStore(Long storeId) {
        if (storeId == null) {
            log.warn("[getShiftsByStore]|storeId is null, returning global templates only");
            return getGlobalTemplates();
        }
        
        // Fetch both store shifts and global defaults
        List<Shift> allRelevantShifts = shiftRepository.findByStoreIdOrIsDefault(storeId, true);
        
        // Use a Map to merge by name, prioritizing store shifts
        Map<String, Shift> combinedShifts = new HashMap<>();
        
        // 1. Put global defaults first
        allRelevantShifts.stream()
            .filter(Shift::isDefault)
            .filter(s -> s.getName() != null)
            .forEach(s -> combinedShifts.put(s.getName().toLowerCase(), s));
            
        // 2. Put/Override with store-specific shifts
        allRelevantShifts.stream()
            .filter(s -> !s.isDefault())
            .filter(s -> s.getName() != null)
            .forEach(s -> combinedShifts.put(s.getName().toLowerCase(), s));

        return combinedShifts.values().stream()
                .map(shift -> {
                    String storeName = "Hệ thống";
                    if (shift.getStoreId() != null) {
                        storeName = storeRepository.findById(shift.getStoreId())
                                .map(Store::getName).orElse("Unknown");
                    }
                    return toShiftResponse(shift, storeName);
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<ShiftResponse> getGlobalTemplates() {
        // Global templates are shifts with isDefault = true
        List<Shift> templates = shiftRepository.findByIsDefault(true);
        if (templates.isEmpty()) {
            log.info("[getGlobalTemplates]|No global templates found, seeding default global shifts");
            seedDefaultShifts(null);
            templates = shiftRepository.findByIsDefault(true);
        }
        return templates.stream()
                .map(shift -> toShiftResponse(shift, "Hệ thống"))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public List<ShiftResponse> importTemplates(Long storeId, List<Long> templateIds) {
        log.info("[importTemplates]|storeId={}|templateIds={}", storeId, templateIds);
        
        Store store = storeRepository.findById(storeId)
            .orElseThrow(() -> new ResourceNotFoundException("Store not found with id: " + storeId));

        List<Shift> templates = shiftRepository.findAllById(templateIds);
        List<Shift> clonedShifts = new ArrayList<>();

        for (Shift template : templates) {
            // Check if shift with same name already exists in this store to avoid duplicates
            boolean exists = shiftRepository.findByStoreId(storeId).stream()
                .anyMatch(s -> s.getName().equalsIgnoreCase(template.getName()));
            
            if (!exists) {
                Shift clone = new Shift();
                clone.setStoreId(storeId);
                clone.setName(template.getName());
                clone.setStartTime(template.getStartTime());
                clone.setEndTime(template.getEndTime());
                clone.setDefault(false); // Clones are not default
                clone.setCreatedAt(LocalDateTime.now());
                clone.setUpdatedAt(LocalDateTime.now());
                clonedShifts.add(clone);
            }
        }

        if (!clonedShifts.isEmpty()) {
            shiftRepository.saveAll(clonedShifts);
        }

        return getShiftsByStore(storeId);
    }

    private void seedDefaultShifts(Long storeId) {
        List<Shift> defaultShifts = new ArrayList<>();
        boolean isDefault = (storeId == null);
        
        // Morning Shift: 06:00 - 14:00
        Shift morning = new Shift();
        morning.setStoreId(storeId);
        morning.setName("Ca Sáng");
        morning.setStartTime(LocalTime.of(6, 0));
        morning.setEndTime(LocalTime.of(14, 0));
        morning.setDefault(isDefault);
        morning.setCreatedAt(LocalDateTime.now());
        morning.setUpdatedAt(LocalDateTime.now());
        defaultShifts.add(morning);

        // Afternoon Shift: 14:00 - 22:00
        Shift afternoon = new Shift();
        afternoon.setStoreId(storeId);
        afternoon.setName("Ca Chiều");
        afternoon.setStartTime(LocalTime.of(14, 0));
        afternoon.setEndTime(LocalTime.of(22, 0));
        afternoon.setDefault(isDefault);
        afternoon.setCreatedAt(LocalDateTime.now());
        afternoon.setUpdatedAt(LocalDateTime.now());
        defaultShifts.add(afternoon);

        // Night Shift: 22:00 - 06:00
        Shift night = new Shift();
        night.setStoreId(storeId);
        night.setName("Ca Đêm");
        night.setStartTime(LocalTime.of(22, 0));
        night.setEndTime(LocalTime.of(6, 0));
        night.setDefault(isDefault);
        night.setCreatedAt(LocalDateTime.now());
        night.setUpdatedAt(LocalDateTime.now());
        defaultShifts.add(night);

        shiftRepository.saveAll(defaultShifts);
    }

    // ==================== SHIFT ASSIGNMENT ====================

    @Override
    public List<ShiftAssignmentResponse> assignShifts(ShiftAssignmentRequest request) {
        log.info("[assignShifts]|userId={}|date={}|shiftIds={}", request.getUserId(), request.getWorkDate(), request.getShiftIds());

        // 1. Validate user exists
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getUserId()));

        LocalDate workDate = LocalDate.parse(request.getWorkDate(), DATE_FORMATTER);

        // 2. Check past date
        if (workDate.isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("Không thể gán ca làm cho ngày đã qua: " + request.getWorkDate());
        }

        // 3. Load all requested shifts
        List<Shift> requestedShifts = shiftRepository.findAllById(request.getShiftIds());
        if (requestedShifts.size() != request.getShiftIds().size()) {
            throw new ResourceNotFoundException("Một hoặc nhiều ca làm việc không tồn tại");
        }

        // 4. Check overlap within request
        for (int i = 0; i < requestedShifts.size(); i++) {
            for (int j = i + 1; j < requestedShifts.size(); j++) {
                if (isOverlapping(requestedShifts.get(i), requestedShifts.get(j))) {
                    throw new IllegalArgumentException("Các ca được chọn (" + requestedShifts.get(i).getName() 
                        + " và " + requestedShifts.get(j).getName() + ") bị trùng lặp thời gian.");
                }
            }
        }

        // 5. Check overlap with existing assignments
        List<ShiftAssignment> existingAssignments = shiftAssignmentRepository
                .findByUserIdAndWorkDateAndStatus(request.getUserId(), workDate, ShiftStatus.ASSIGNED);
        
        for (Shift s : requestedShifts) {
            for (ShiftAssignment sa : existingAssignments) {
                Shift existingShift = shiftRepository.findById(sa.getShiftId()).orElse(null);
                if (existingShift != null && isOverlapping(s, existingShift)) {
                    throw new IllegalArgumentException("Ca '" + s.getName() + "' bị trùng với ca '" 
                        + existingShift.getName() + "' đã được gán trước đó.");
                }
            }
        }

        // 6. Create assignments
        List<ShiftAssignmentResponse> responses = new ArrayList<>();
        String createdByName = userRepository.findById(request.getCreatedBy())
                .map(User::getFullName).orElse("Unknown");

        for (Shift s : requestedShifts) {
            ShiftAssignment assignment = new ShiftAssignment();
            assignment.setShiftId(s.getId());
            assignment.setUserId(request.getUserId());
            assignment.setWorkDate(workDate);
            assignment.setStatus(ShiftStatus.ASSIGNED);
            assignment.setCreatedBy(request.getCreatedBy());
            assignment.setCreatedAt(LocalDateTime.now());

            ShiftAssignment saved = shiftAssignmentRepository.save(assignment);
            responses.add(toAssignmentResponse(saved, s, user.getFullName(), createdByName));
        }

        return responses;
    }

    private boolean isOverlapping(Shift s1, Shift s2) {
        // Overlap: start1 < end2 AND start2 < end1
        // Lưu ý: Trường hợp ca đêm qua 12h cần xử lý phức tạp hơn nếu startTime > endTime
        // Ở đây giả định ca làm trong cùng 1 ngày (hoặc xử lý đơn giản)
        LocalTime start1 = s1.getStartTime();
        LocalTime end1 = s1.getEndTime();
        LocalTime start2 = s2.getStartTime();
        LocalTime end2 = s2.getEndTime();

        // Xử lý ca đêm (end < start)
        if (end1.isBefore(start1)) end1 = end1.plusHours(24); // Không hỗ trợ trực tiếp LocalTime.plus, dùng logic khác
        // Tuy nhiên LocalTime không save được > 24h. 
        // Đơn giản hơn: convert sang minutes from day start
        long mS1 = start1.getHour() * 60 + start1.getMinute();
        long mE1 = end1.getHour() * 60 + end1.getMinute();
        if (mE1 <= mS1) mE1 += 1440; // overnight

        long mS2 = start2.getHour() * 60 + start2.getMinute();
        long mE2 = end2.getHour() * 60 + end2.getMinute();
        if (mE2 <= mS2) mE2 += 1440; // overnight

        return mS1 < mE2 && mS2 < mE1;
    }

    @Override
    public ShiftAssignmentResponse cancelAssignment(Long assignmentId) {
        ShiftAssignment assignment = shiftAssignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found with id: " + assignmentId));

        assignment.setStatus(ShiftStatus.CANCELLED);
        ShiftAssignment saved = shiftAssignmentRepository.save(assignment);

        Shift shift = shiftRepository.findById(saved.getShiftId())
                .orElseThrow(() -> new ResourceNotFoundException("Shift not found"));
        String userName = userRepository.findById(saved.getUserId())
                .map(User::getFullName).orElse("Unknown");
        String createdByName = userRepository.findById(saved.getCreatedBy())
                .map(User::getFullName).orElse("Unknown");

        return toAssignmentResponse(saved, shift, userName, createdByName);
    }

    @Override
    public List<ShiftAssignmentResponse> getAssignmentsByStoreAndDateRange(Long storeId, LocalDate from, LocalDate to) {
        List<ShiftAssignment> assignments = shiftAssignmentRepository.findByUser_StoreIdAndWorkDateBetween(storeId, from, to);
        return assignments.stream()
                .map(this::enrichAssignmentResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ShiftAssignmentResponse> getAssignmentsByUser(Long userId) {
        return shiftAssignmentRepository.findByUserId(userId).stream()
                .map(this::enrichAssignmentResponse)
                .collect(Collectors.toList());
    }

    // ==================== MAPPING HELPERS ====================

    private ShiftResponse toShiftResponse(Shift shift, String storeName) {
        ShiftResponse response = new ShiftResponse();
        response.setId(shift.getId());
        response.setStoreId(shift.getStoreId());
        response.setStoreName(storeName);
        response.setName(shift.getName());
        response.setStartTime(shift.getStartTime().format(TIME_FORMATTER));
        response.setEndTime(shift.getEndTime().format(TIME_FORMATTER));
        response.setCreatedAt(shift.getCreatedAt().format(DATETIME_FORMATTER));
        response.setDefault(shift.isDefault());
        return response;
    }

    private ShiftAssignmentResponse toAssignmentResponse(ShiftAssignment sa, Shift shift, String userName, String createdByName) {
        ShiftAssignmentResponse response = new ShiftAssignmentResponse();
        response.setId(sa.getId());
        response.setShiftId(sa.getShiftId());
        response.setShiftName(shift.getName());
        response.setStartTime(shift.getStartTime().format(TIME_FORMATTER));
        response.setEndTime(shift.getEndTime().format(TIME_FORMATTER));
        response.setUserId(sa.getUserId());
        response.setUserName(userName);
        response.setWorkDate(sa.getWorkDate().format(DATE_FORMATTER));
        response.setStatus(sa.getStatus().name());
        response.setCreatedBy(sa.getCreatedBy());
        response.setCreatedByName(createdByName);
        response.setCreatedAt(sa.getCreatedAt().format(DATETIME_FORMATTER));
        return response;
    }

    private ShiftAssignmentResponse enrichAssignmentResponse(ShiftAssignment sa) {
        Shift shift = shiftRepository.findById(sa.getShiftId())
                .orElseThrow(() -> new ResourceNotFoundException("Shift not found"));
        String userName = userRepository.findById(sa.getUserId())
                .map(User::getFullName).orElse("Unknown");
        String createdByName = userRepository.findById(sa.getCreatedBy())
                .map(User::getFullName).orElse("Unknown");
        return toAssignmentResponse(sa, shift, userName, createdByName);
    }
}
