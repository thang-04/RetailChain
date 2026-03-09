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

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
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
    public List<ShiftResponse> getAllShifts() {
        return shiftRepository.findAll().stream()
                .map(shift -> {
                    String storeName = storeRepository.findById(shift.getStoreId())
                            .map(Store::getName).orElse("Unknown");
                    return toShiftResponse(shift, storeName);
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<ShiftResponse> getShiftsByStore(Long storeId) {
        return shiftRepository.findByStoreId(storeId).stream()
                .map(shift -> {
                    String storeName = storeRepository.findById(shift.getStoreId())
                            .map(Store::getName).orElse("Unknown");
                    return toShiftResponse(shift, storeName);
                })
                .collect(Collectors.toList());
    }

    // ==================== SHIFT ASSIGNMENT ====================

    @Override
    public ShiftAssignmentResponse assignShift(ShiftAssignmentRequest request) {
        // Validate shift exists
        Shift shift = shiftRepository.findById(request.getShiftId())
                .orElseThrow(() -> new ResourceNotFoundException("Shift not found with id: " + request.getShiftId()));

        // Validate user exists
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getUserId()));

        LocalDate workDate = LocalDate.parse(request.getWorkDate(), DATE_FORMATTER);

        // Check duplicate: same user, same date, same shift, status = ASSIGNED
        List<ShiftAssignment> existing = shiftAssignmentRepository
                .findByUserIdAndWorkDateAndStatus(request.getUserId(), workDate, ShiftStatus.ASSIGNED);

        for (ShiftAssignment sa : existing) {
            if (sa.getShiftId().equals(request.getShiftId())) {
                throw new IllegalArgumentException(
                        "User '" + user.getFullName() + "' is already assigned to this shift on "
                                + request.getWorkDate());
            }
        }

        // Create assignment
        ShiftAssignment assignment = new ShiftAssignment();
        assignment.setShiftId(request.getShiftId());
        assignment.setUserId(request.getUserId());
        assignment.setWorkDate(workDate);
        assignment.setStatus(ShiftStatus.ASSIGNED);
        assignment.setCreatedBy(request.getCreatedBy());
        assignment.setCreatedAt(LocalDateTime.now());

        ShiftAssignment saved = shiftAssignmentRepository.save(assignment);

        // Build response
        String createdByName = userRepository.findById(request.getCreatedBy())
                .map(User::getFullName).orElse("Unknown");

        return toAssignmentResponse(saved, shift, user.getFullName(), createdByName);
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
        List<ShiftAssignment> assignments = shiftAssignmentRepository
                .findByShift_StoreIdAndWorkDateBetween(storeId, from, to);

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
        return response;
    }

    private ShiftAssignmentResponse toAssignmentResponse(ShiftAssignment sa, Shift shift, String userName,
            String createdByName) {
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
