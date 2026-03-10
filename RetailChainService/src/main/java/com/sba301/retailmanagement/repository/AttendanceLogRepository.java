package com.sba301.retailmanagement.repository;

import com.sba301.retailmanagement.entity.AttendanceLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AttendanceLogRepository extends JpaRepository<AttendanceLog, Long> {
    List<AttendanceLog> findByUserId(Long userId);
    
    List<AttendanceLog> findByStoreId(Long storeId);
    
    List<AttendanceLog> findByUserIdOrderByOccurredAtDesc(Long userId);
    
    List<AttendanceLog> findByStoreIdAndOccurredAtBetween(Long storeId, LocalDateTime start, LocalDateTime end);
    
    List<AttendanceLog> findByUserIdAndOccurredAtBetween(Long userId, LocalDateTime start, LocalDateTime end);
}
