package com.sba301.retailmanagement.repository;

import com.sba301.retailmanagement.entity.ShiftAssignment;
import com.sba301.retailmanagement.enums.ShiftStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ShiftAssignmentRepository extends JpaRepository<ShiftAssignment, Long> {

    List<ShiftAssignment> findByShiftId(Long shiftId);

    List<ShiftAssignment> findByUserId(Long userId);

    List<ShiftAssignment> findByWorkDateBetween(LocalDate from, LocalDate to);

    List<ShiftAssignment> findByShift_StoreIdAndWorkDateBetween(Long storeId, LocalDate from, LocalDate to);

    List<ShiftAssignment> findByUserIdAndWorkDateAndStatus(Long userId, LocalDate workDate, ShiftStatus status);
}
