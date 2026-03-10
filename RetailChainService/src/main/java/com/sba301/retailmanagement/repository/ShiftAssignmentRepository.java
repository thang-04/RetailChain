package com.sba301.retailmanagement.repository;

import com.sba301.retailmanagement.entity.ShiftAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ShiftAssignmentRepository extends JpaRepository<ShiftAssignment, Long> {
    List<ShiftAssignment> findByUserId(Long userId);
    
    List<ShiftAssignment> findByUserIdAndWorkDate(Long userId, LocalDate workDate);
    
    Optional<ShiftAssignment> findByUserIdAndShiftIdAndWorkDate(Long userId, Long shiftId, LocalDate workDate);
    
    List<ShiftAssignment> findByShiftId(Long shiftId);
    
    List<ShiftAssignment> findByShiftIdAndWorkDate(Long shiftId, LocalDate workDate);
}
