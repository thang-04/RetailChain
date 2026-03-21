package com.sba301.retailmanagement.service.impl;

import com.sba301.retailmanagement.dto.request.ShiftAssignmentRequest;
import com.sba301.retailmanagement.dto.request.AutoAssignShiftsRequest;
import com.sba301.retailmanagement.dto.request.CancelDraftShiftsRequest;
import com.sba301.retailmanagement.dto.request.ConfirmDraftShiftsRequest;
import com.sba301.retailmanagement.dto.request.ShiftRequest;
import com.sba301.retailmanagement.dto.response.AutoAssignShiftsResponse;
import com.sba301.retailmanagement.dto.response.AutoAssignShiftsSummary;
import com.sba301.retailmanagement.dto.response.ShiftAssignmentResponse;
import com.sba301.retailmanagement.dto.response.ShiftResponse;
import com.sba301.retailmanagement.entity.Shift;
import com.sba301.retailmanagement.entity.ShiftAssignment;
import com.sba301.retailmanagement.entity.StaffQuota;
import com.sba301.retailmanagement.entity.Store;
import com.sba301.retailmanagement.entity.User;
import com.sba301.retailmanagement.enums.ShiftStatus;
import com.sba301.retailmanagement.exception.ResourceNotFoundException;
import com.sba301.retailmanagement.repository.StaffQuotaRepository;
import com.sba301.retailmanagement.repository.ShiftAssignmentRepository;
import com.sba301.retailmanagement.repository.ShiftRepository;
import com.sba301.retailmanagement.repository.StoreRepository;
import com.sba301.retailmanagement.repository.UserRepository;
import com.sba301.retailmanagement.service.ShiftService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.TemporalAdjusters;
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

    @Autowired
    private StaffQuotaRepository staffQuotaRepository;

    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("HH:mm:ss");
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    private static final DateTimeFormatter DATETIME_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    // ==================== SHIFT CRUD ====================

    @Override
    public ShiftResponse createShift(ShiftRequest request) {
        Store store = storeRepository.findById(request.getStoreId())
                .orElseThrow(() -> new ResourceNotFoundException("Store not found with id: " + request.getStoreId()));

        if (request.getMinStaff() != null && request.getMinStaff() <= 0) {
            throw new IllegalArgumentException("minStaff phải > 0");
        }
        if (request.getMaxStaff() != null && request.getMaxStaff() <= 0) {
            throw new IllegalArgumentException("maxStaff phải > 0");
        }
        if (request.getMinStaff() != null && request.getMaxStaff() != null && request.getMinStaff() > request.getMaxStaff()) {
            throw new IllegalArgumentException("minStaff không được lớn hơn maxStaff");
        }

        Shift shift = new Shift();
        shift.setStoreId(request.getStoreId());
        shift.setName(request.getName());
        shift.setStartTime(LocalTime.parse(request.getStartTime(), TIME_FORMATTER));
        shift.setEndTime(LocalTime.parse(request.getEndTime(), TIME_FORMATTER));
        if (request.getMinStaff() != null) shift.setMinStaff(request.getMinStaff());
        if (request.getMaxStaff() != null) shift.setMaxStaff(request.getMaxStaff());
        shift.setCreatedAt(LocalDateTime.now());
        shift.setUpdatedAt(LocalDateTime.now());

        Shift saved = shiftRepository.save(shift);
        return toShiftResponse(saved, store.getName());
    }

    @Override
    public ShiftResponse updateShift(Long shiftId, ShiftRequest request) {
        Shift shift = shiftRepository.findById(shiftId)
                .orElseThrow(() -> new ResourceNotFoundException("Shift not found with id: " + shiftId));

        if (request.getMinStaff() != null && request.getMinStaff() <= 0) {
            throw new IllegalArgumentException("minStaff phải > 0");
        }
        if (request.getMaxStaff() != null && request.getMaxStaff() <= 0) {
            throw new IllegalArgumentException("maxStaff phải > 0");
        }
        Integer nextMin = request.getMinStaff() != null ? request.getMinStaff() : shift.getMinStaff();
        Integer nextMax = request.getMaxStaff() != null ? request.getMaxStaff() : shift.getMaxStaff();
        if (nextMin != null && nextMax != null && nextMin > nextMax) {
            throw new IllegalArgumentException("minStaff không được lớn hơn maxStaff");
        }

        if (request.getName() != null) shift.setName(request.getName());
        if (request.getStartTime() != null) shift.setStartTime(LocalTime.parse(request.getStartTime(), TIME_FORMATTER));
        if (request.getEndTime() != null) shift.setEndTime(LocalTime.parse(request.getEndTime(), TIME_FORMATTER));
        if (request.getMinStaff() != null) shift.setMinStaff(request.getMinStaff());
        if (request.getMaxStaff() != null) shift.setMaxStaff(request.getMaxStaff());
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
        morning.setMinStaff(1);
        morning.setMaxStaff(1);
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
        afternoon.setMinStaff(1);
        afternoon.setMaxStaff(1);
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
        night.setMinStaff(1);
        night.setMaxStaff(1);
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
            Optional<ShiftAssignment> existingSameSlot = shiftAssignmentRepository
                    .findByUserIdAndShiftIdAndWorkDate(request.getUserId(), s.getId(), workDate);

            ShiftAssignment assignmentToSave;
            if (existingSameSlot.isPresent()) {
                ShiftAssignment existingSlot = existingSameSlot.get();
                if (existingSlot.getStatus() == ShiftStatus.ASSIGNED) {
                    throw new IllegalArgumentException("Nhan vien da duoc phan cong ca '" + s.getName()
                            + "' trong ngay " + request.getWorkDate());
                }
                // Reuse existing slot (e.g. CANCELLED/DRAFT) to avoid unique key conflicts.
                existingSlot.setStatus(ShiftStatus.ASSIGNED);
                existingSlot.setCreatedBy(request.getCreatedBy());
                existingSlot.setCreatedAt(LocalDateTime.now());
                assignmentToSave = existingSlot;
            } else {
                ShiftAssignment assignment = new ShiftAssignment();
                assignment.setShiftId(s.getId());
                assignment.setUserId(request.getUserId());
                assignment.setWorkDate(workDate);
                assignment.setStatus(ShiftStatus.ASSIGNED);
                assignment.setCreatedBy(request.getCreatedBy());
                assignment.setCreatedAt(LocalDateTime.now());
                assignmentToSave = assignment;
            }

            ShiftAssignment saved = shiftAssignmentRepository.save(assignmentToSave);
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

    // ==================== AUTO ASSIGN (DRAFT) ====================

    @Override
    @Transactional
    public AutoAssignShiftsResponse autoAssignDraftShifts(AutoAssignShiftsRequest request) {
        if (request == null) throw new IllegalArgumentException("Request không được null");
        if (request.getStoreId() == null) throw new IllegalArgumentException("storeId không được null");
        if (request.getFrom() == null || request.getTo() == null) throw new IllegalArgumentException("from/to không được null");
        if (request.getCreatedBy() == null) throw new IllegalArgumentException("createdBy không được null");

        boolean resetDraft = request.getResetDraft() == null || Boolean.TRUE.equals(request.getResetDraft());
        LocalDate from = LocalDate.parse(request.getFrom(), DATE_FORMATTER);
        LocalDate to = LocalDate.parse(request.getTo(), DATE_FORMATTER);
        if (to.isBefore(from)) throw new IllegalArgumentException("to phải >= from");

        Long storeId = request.getStoreId();

        // Validate store exists (avoid generating for invalid store)
        storeRepository.findById(storeId)
                .orElseThrow(() -> new ResourceNotFoundException("Store not found with id: " + storeId));

        String createdByName = userRepository.findById(request.getCreatedBy())
                .map(User::getFullName).orElse("Unknown");

        // Load staff list (active only)
        List<User> staffList = userRepository.findByStoreId(storeId).stream()
                .filter(u -> u.getStatus() != null && u.getStatus() == 1)
                .collect(Collectors.toList());
        if (staffList.isEmpty()) {
            throw new IllegalArgumentException("Khong co nhan vien active de auto-assign");
        }

        // Load quota map; fallback default if missing
        Map<Long, StaffQuota> quotaByUserId = staffQuotaRepository.findByStoreId(storeId).stream()
                .collect(Collectors.toMap(StaffQuota::getUserId, q -> q, (a, b) -> a));

        // Relevant shifts for store (merge global defaults + store shifts)
        List<Shift> shifts = getRelevantShifts(storeId);
        if (request.getShiftIds() != null && !request.getShiftIds().isEmpty()) {
            Set<Long> requestedShiftIds = request.getShiftIds().stream()
                    .filter(Objects::nonNull)
                    .collect(Collectors.toSet());
            shifts = shifts.stream()
                    .filter(s -> requestedShiftIds.contains(s.getId()))
                    .collect(Collectors.toList());
            if (shifts.isEmpty()) {
                throw new IllegalArgumentException("Khong co loai ca hop le de auto-assign");
            }
        }
        if (shifts.isEmpty()) throw new IllegalArgumentException("Cửa hàng chưa có ca làm để sắp xếp");

        // Reset existing drafts if requested
        if (resetDraft) {
            Set<ShiftStatus> draftOnly = new HashSet<>(Collections.singletonList(ShiftStatus.DRAFT));
            List<ShiftAssignment> drafts = shiftAssignmentRepository
                    .findByUser_StoreIdAndWorkDateBetweenAndStatusIn(storeId, from, to, draftOnly);
            drafts.forEach(d -> d.setStatus(ShiftStatus.CANCELLED));
            if (!drafts.isEmpty()) shiftAssignmentRepository.saveAll(drafts);
        }

        // Load all assignments in range (all statuses) to support upsert and avoid unique key conflicts.
        Map<String, ShiftAssignment> assignmentByUserShiftDate = shiftAssignmentRepository
                .findByUser_StoreIdAndWorkDateBetween(storeId, from, to).stream()
                .filter(sa -> sa.getUserId() != null && sa.getShiftId() != null && sa.getWorkDate() != null)
                .collect(Collectors.toMap(
                        sa -> buildUserShiftDateKey(sa.getUserId(), sa.getShiftId(), sa.getWorkDate()),
                        sa -> sa,
                        (a, b) -> a
                ));

        Set<ShiftStatus> activeStatuses = new HashSet<>(Arrays.asList(ShiftStatus.ASSIGNED, ShiftStatus.DRAFT));
        LocalDate quotaWindowFrom = getWeekStart(from);
        LocalDate quotaWindowTo = getWeekEnd(to);
        List<ShiftAssignment> existing = shiftAssignmentRepository
                .findByUser_StoreIdAndWorkDateBetweenAndStatusIn(storeId, quotaWindowFrom, quotaWindowTo, activeStatuses);

        Set<Long> activeStaffIds = staffList.stream().map(User::getId).collect(Collectors.toSet());
        Set<Long> relevantShiftIds = shifts.stream().map(Shift::getId).collect(Collectors.toSet());

        // Preload shift lookup for existing assignments (may include store-specific clones)
        Set<Long> shiftIds = new HashSet<>(relevantShiftIds);
        existing.stream()
                .map(ShiftAssignment::getShiftId)
                .filter(Objects::nonNull)
                .forEach(shiftIds::add);
        Map<Long, Shift> shiftById = shiftRepository.findAllById(shiftIds).stream()
                .collect(Collectors.toMap(Shift::getId, s -> s, (a, b) -> a));

        // Index existing for fast checks
        Map<String, Integer> headcountByShiftDate = new HashMap<>();
        Map<String, Integer> assignedCountByUserWeek = new HashMap<>();
        Map<String, List<Shift>> shiftsByUserDate = new HashMap<>(); // key: userId|yyyy-MM-dd

        for (ShiftAssignment sa : existing) {
            if (sa.getUserId() == null || !activeStaffIds.contains(sa.getUserId()) || sa.getWorkDate() == null) {
                continue;
            }

            String weekKey = buildUserWeekKey(sa.getUserId(), sa.getWorkDate());
            assignedCountByUserWeek.put(weekKey, assignedCountByUserWeek.getOrDefault(weekKey, 0) + 1);

            boolean inTargetRange = !sa.getWorkDate().isBefore(from) && !sa.getWorkDate().isAfter(to);
            if (!inTargetRange || sa.getShiftId() == null || !relevantShiftIds.contains(sa.getShiftId())) {
                continue;
            }

            String dateKey = sa.getWorkDate().format(DATE_FORMATTER);
            String key = sa.getShiftId() + "|" + dateKey;
            headcountByShiftDate.put(key, headcountByShiftDate.getOrDefault(key, 0) + 1);

            Shift s = shiftById.get(sa.getShiftId());
            if (s != null) {
                String udKey = sa.getUserId() + "|" + dateKey;
                shiftsByUserDate.computeIfAbsent(udKey, _k -> new ArrayList<>()).add(s);
            }
        }

        List<ShiftAssignment> createdDrafts = new ArrayList<>();
        AutoAssignShiftsSummary summary = new AutoAssignShiftsSummary();
        int totalRequiredSlots = 0;

        for (LocalDate d = from; !d.isAfter(to); d = d.plusDays(1)) {
            String dateKey = d.format(DATE_FORMATTER);

            for (Shift shift : shifts) {
                int minStaff = sanitizeMinStaff(shift.getMinStaff());
                int maxStaff = sanitizeMaxStaff(shift.getMaxStaff(), minStaff);
                int current = headcountByShiftDate.getOrDefault(shift.getId() + "|" + dateKey, 0);
                int needMin = Math.max(0, minStaff - current);
                int remainingCap = Math.max(0, maxStaff - current);
                int need = Math.min(needMin, remainingCap);
                totalRequiredSlots += need;
                if (need == 0) continue;

                for (int i = 0; i < need; i++) {
                    User chosen = chooseBestCandidate(staffList, quotaByUserId, assignedCountByUserWeek, shiftsByUserDate, d, shift);
                    if (chosen == null) {
                        int have = headcountByShiftDate.getOrDefault(shift.getId() + "|" + dateKey, 0);
                        summary.getUnderstaffedNotes().add(dateKey + " • " + shift.getName() + " thiếu người (" + have + "/" + minStaff + ")");
                        break;
                    }

                    String userShiftDateKey = buildUserShiftDateKey(chosen.getId(), shift.getId(), d);
                    ShiftAssignment draft = assignmentByUserShiftDate.get(userShiftDateKey);
                    if (draft == null) {
                        draft = new ShiftAssignment();
                        draft.setShiftId(shift.getId());
                        draft.setUserId(chosen.getId());
                        draft.setWorkDate(d);
                        assignmentByUserShiftDate.put(userShiftDateKey, draft);
                    }
                    draft.setStatus(ShiftStatus.DRAFT);
                    draft.setCreatedBy(request.getCreatedBy());
                    draft.setCreatedAt(LocalDateTime.now());
                    createdDrafts.add(draft);

                    // update indexes
                    String hcKey = shift.getId() + "|" + dateKey;
                    headcountByShiftDate.put(hcKey, headcountByShiftDate.getOrDefault(hcKey, 0) + 1);
                    String weekKey = buildUserWeekKey(chosen.getId(), d);
                    assignedCountByUserWeek.put(weekKey, assignedCountByUserWeek.getOrDefault(weekKey, 0) + 1);
                    String udKey = chosen.getId() + "|" + dateKey;
                    shiftsByUserDate.computeIfAbsent(udKey, _k -> new ArrayList<>()).add(shift);
                }
            }
        }

        if (!createdDrafts.isEmpty()) {
            shiftAssignmentRepository.saveAll(createdDrafts);
        }

        AutoAssignShiftsResponse result = new AutoAssignShiftsResponse();
        summary.setCreatedDraftCount(createdDrafts.size());
        if (createdDrafts.isEmpty() && (summary.getUnderstaffedNotes() == null || summary.getUnderstaffedNotes().isEmpty())) {
            if (totalRequiredSlots == 0) {
                summary.getUnderstaffedNotes().add("Khong tao them draft: tat ca ca trong khoang ngay da du min_staff");
            } else {
                summary.getUnderstaffedNotes().add("Khong tao them draft: khong tim duoc nhan vien phu hop de lap lich");
            }
        }
        result.setSummary(summary);

        // Return active assignments in range (ASSIGNED + DRAFT) so UI can preview immediately
        Set<ShiftStatus> activeInRange = new HashSet<>(Arrays.asList(ShiftStatus.ASSIGNED, ShiftStatus.DRAFT));
        List<ShiftAssignment> assignmentsInRange = shiftAssignmentRepository
                .findByUser_StoreIdAndWorkDateBetweenAndStatusIn(storeId, from, to, activeInRange);
        List<ShiftAssignmentResponse> responses = assignmentsInRange.stream()
                .map(sa -> {
                    Shift s = shiftById.get(sa.getShiftId());
                    if (s == null) {
                        s = shiftRepository.findById(sa.getShiftId()).orElse(null);
                    }
                    String userName = userRepository.findById(sa.getUserId()).map(User::getFullName).orElse("Unknown");
                    return (s != null) ? toAssignmentResponse(sa, s, userName, createdByName) : enrichAssignmentResponse(sa);
                })
                .collect(Collectors.toList());

        result.setAssignments(responses);
        return result;
    }

    @Override
    @Transactional
    public List<ShiftAssignmentResponse> confirmDraftShifts(ConfirmDraftShiftsRequest request) {
        if (request == null) throw new IllegalArgumentException("Request không được null");
        if (request.getStoreId() == null) throw new IllegalArgumentException("storeId không được null");
        if (request.getFrom() == null || request.getTo() == null) throw new IllegalArgumentException("from/to không được null");
        if (request.getConfirmedBy() == null) throw new IllegalArgumentException("confirmedBy không được null");

        Long storeId = request.getStoreId();
        LocalDate from = LocalDate.parse(request.getFrom(), DATE_FORMATTER);
        LocalDate to = LocalDate.parse(request.getTo(), DATE_FORMATTER);
        if (to.isBefore(from)) throw new IllegalArgumentException("to phải >= from");

        String confirmedByName = userRepository.findById(request.getConfirmedBy())
                .map(User::getFullName).orElse("Unknown");

        List<Shift> shifts = getRelevantShifts(storeId);
        Map<Long, Shift> shiftById = shifts.stream().collect(Collectors.toMap(Shift::getId, s -> s, (a, b) -> a));

        Set<ShiftStatus> active = new HashSet<>(Arrays.asList(ShiftStatus.ASSIGNED, ShiftStatus.DRAFT));
        List<ShiftAssignment> assignments = shiftAssignmentRepository
                .findByUser_StoreIdAndWorkDateBetweenAndStatusIn(storeId, from, to, active);

        // Group for checks
        Map<String, List<ShiftAssignment>> byDateShift = new HashMap<>();
        Map<String, List<ShiftAssignment>> byUserDate = new HashMap<>();

        for (ShiftAssignment sa : assignments) {
            String dateKey = sa.getWorkDate().format(DATE_FORMATTER);
            byDateShift.computeIfAbsent(sa.getShiftId() + "|" + dateKey, _k -> new ArrayList<>()).add(sa);
            byUserDate.computeIfAbsent(sa.getUserId() + "|" + dateKey, _k -> new ArrayList<>()).add(sa);
        }

        // Hard validate min_staff coverage
        for (LocalDate d = from; !d.isAfter(to); d = d.plusDays(1)) {
            String dateKey = d.format(DATE_FORMATTER);
            for (Shift shift : shifts) {
                int minStaff = sanitizeMinStaff(shift.getMinStaff());
                int count = byDateShift.getOrDefault(shift.getId() + "|" + dateKey, Collections.emptyList()).size();
                if (count < minStaff) {
                    throw new IllegalArgumentException("Không thể xác nhận: " + dateKey + " • " + shift.getName()
                            + " thiếu người (" + count + "/" + minStaff + ")");
                }
            }
        }

        // Hard validate overlap per user/day
        for (Map.Entry<String, List<ShiftAssignment>> entry : byUserDate.entrySet()) {
            List<ShiftAssignment> list = entry.getValue();
            if (list.size() <= 1) continue;
            List<Shift> userShifts = list.stream()
                    .map(sa -> shiftById.computeIfAbsent(sa.getShiftId(),
                            id -> shiftRepository.findById(id).orElse(null)))
                    .filter(Objects::nonNull)
                    .collect(Collectors.toList());
            for (int i = 0; i < userShifts.size(); i++) {
                for (int j = i + 1; j < userShifts.size(); j++) {
                    if (isOverlapping(userShifts.get(i), userShifts.get(j))) {
                        throw new IllegalArgumentException("Không thể xác nhận: nhân viên bị trùng ca trong ngày (" + entry.getKey() + ")");
                    }
                }
            }
        }

        // Confirm drafts
        Set<ShiftStatus> draftOnly = new HashSet<>(Collections.singletonList(ShiftStatus.DRAFT));
        List<ShiftAssignment> drafts = shiftAssignmentRepository
                .findByUser_StoreIdAndWorkDateBetweenAndStatusIn(storeId, from, to, draftOnly);
        drafts.forEach(d -> d.setStatus(ShiftStatus.ASSIGNED));
        if (!drafts.isEmpty()) shiftAssignmentRepository.saveAll(drafts);

        return drafts.stream()
                .map(sa -> {
                    Shift s = shiftById.computeIfAbsent(sa.getShiftId(), id -> shiftRepository.findById(id).orElse(null));
                    String userName = userRepository.findById(sa.getUserId()).map(User::getFullName).orElse("Unknown");
                    return (s != null) ? toAssignmentResponse(sa, s, userName, confirmedByName) : enrichAssignmentResponse(sa);
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public List<ShiftAssignmentResponse> cancelDraftShifts(CancelDraftShiftsRequest request) {
        if (request == null) throw new IllegalArgumentException("Request không được null");
        if (request.getStoreId() == null) throw new IllegalArgumentException("storeId không được null");
        if (request.getFrom() == null || request.getTo() == null) throw new IllegalArgumentException("from/to không được null");

        Long storeId = request.getStoreId();
        LocalDate from = LocalDate.parse(request.getFrom(), DATE_FORMATTER);
        LocalDate to = LocalDate.parse(request.getTo(), DATE_FORMATTER);
        if (to.isBefore(from)) throw new IllegalArgumentException("to phải >= from");

        Set<ShiftStatus> draftOnly = new HashSet<>(Collections.singletonList(ShiftStatus.DRAFT));
        List<ShiftAssignment> drafts = shiftAssignmentRepository
                .findByUser_StoreIdAndWorkDateBetweenAndStatusIn(storeId, from, to, draftOnly);
        if (drafts.isEmpty()) return Collections.emptyList();

        drafts.forEach(d -> d.setStatus(ShiftStatus.CANCELLED));
        shiftAssignmentRepository.saveAll(drafts);

        // response
        Map<Long, Shift> shiftById = shiftRepository.findAllById(
                drafts.stream().map(ShiftAssignment::getShiftId).collect(Collectors.toSet())
        ).stream().collect(Collectors.toMap(Shift::getId, s -> s, (a, b) -> a));

        return drafts.stream()
                .map(sa -> {
                    Shift s = shiftById.get(sa.getShiftId());
                    String userName = userRepository.findById(sa.getUserId()).map(User::getFullName).orElse("Unknown");
                    String createdByName = userRepository.findById(sa.getCreatedBy()).map(User::getFullName).orElse("Unknown");
                    return (s != null) ? toAssignmentResponse(sa, s, userName, createdByName) : enrichAssignmentResponse(sa);
                })
                .collect(Collectors.toList());
    }

    private int sanitizeMinStaff(Integer minStaff) {
        return (minStaff == null || minStaff <= 0) ? 1 : minStaff;
    }

    private int sanitizeMaxStaff(Integer maxStaff, int minStaff) {
        if (maxStaff == null || maxStaff <= 0) return minStaff;
        return Math.max(maxStaff, minStaff);
    }

    private LocalDate getWeekStart(LocalDate date) {
        return date.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
    }

    private LocalDate getWeekEnd(LocalDate date) {
        return date.with(TemporalAdjusters.nextOrSame(DayOfWeek.SUNDAY));
    }

    private String buildUserWeekKey(Long userId, LocalDate date) {
        return userId + "|" + getWeekStart(date).format(DATE_FORMATTER);
    }

    private String buildUserShiftDateKey(Long userId, Long shiftId, LocalDate date) {
        return userId + "|" + shiftId + "|" + date.format(DATE_FORMATTER);
    }

    private List<Shift> getRelevantShifts(Long storeId) {
        List<Shift> allRelevantShifts = shiftRepository.findByStoreIdOrIsDefault(storeId, true);
        Map<String, Shift> combined = new HashMap<>();

        allRelevantShifts.stream()
                .filter(Shift::isDefault)
                .filter(s -> s.getName() != null)
                .forEach(s -> combined.put(s.getName().toLowerCase(), s));

        allRelevantShifts.stream()
                .filter(s -> !s.isDefault())
                .filter(s -> s.getName() != null)
                .forEach(s -> combined.put(s.getName().toLowerCase(), s));

        return new ArrayList<>(combined.values());
    }

    private User chooseBestCandidate(
            List<User> staffList,
            Map<Long, StaffQuota> quotaByUserId,
            Map<String, Integer> assignedCountByUserWeek,
            Map<String, List<Shift>> shiftsByUserDate,
            LocalDate workDate,
            Shift targetShift
    ) {
        User best = null;
        int bestScore = Integer.MIN_VALUE;
        int bestLoad = Integer.MAX_VALUE;

        String dateKey = workDate.format(DATE_FORMATTER);

        for (User u : staffList) {
            StaffQuota q = quotaByUserId.get(u.getId());
            int min = q != null && q.getMinShiftsPerWeek() != null ? q.getMinShiftsPerWeek() : 5;
            int max = q != null && q.getMaxShiftsPerWeek() != null ? q.getMaxShiftsPerWeek() : 6;
            if (min < 0) min = 0;
            if (max <= 0) max = 6;
            if (max < min) max = min;

            String weekKey = buildUserWeekKey(u.getId(), workDate);
            int load = assignedCountByUserWeek.getOrDefault(weekKey, 0);
            if (load >= max) continue;

            // overlap check with shifts already assigned on that date
            List<Shift> dayShifts = shiftsByUserDate.getOrDefault(u.getId() + "|" + dateKey, Collections.emptyList());
            boolean overlap = false;
            for (Shift s : dayShifts) {
                if (isOverlapping(s, targetShift)) {
                    overlap = true;
                    break;
                }
            }
            if (overlap) continue;

            int need = Math.max(0, min - load);
            int score = need; // prioritize those under min quota

            if (score > bestScore || (score == bestScore && load < bestLoad)) {
                best = u;
                bestScore = score;
                bestLoad = load;
            }
        }

        return best;
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
        response.setMinStaff(shift.getMinStaff());
        response.setMaxStaff(shift.getMaxStaff());
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
