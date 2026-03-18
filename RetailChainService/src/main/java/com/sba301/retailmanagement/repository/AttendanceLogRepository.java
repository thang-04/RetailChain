package com.sba301.retailmanagement.repository;

import com.sba301.retailmanagement.entity.AttendanceLog;
import com.sba301.retailmanagement.enums.CheckType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceLogRepository extends JpaRepository<AttendanceLog, Long> {
    List<AttendanceLog> findByUserId(Long userId);
    
    List<AttendanceLog> findByStoreId(Long storeId);
    
    List<AttendanceLog> findByUserIdOrderByOccurredAtDesc(Long userId);
    
    List<AttendanceLog> findByStoreIdAndOccurredAtBetween(Long storeId, LocalDateTime start, LocalDateTime end);
    
    List<AttendanceLog> findByUserIdAndOccurredAtBetween(Long userId, LocalDateTime start, LocalDateTime end);

    @Query("SELECT al FROM AttendanceLog al WHERE al.userId = :userId AND al.checkType = :checkType AND DATE(al.occurredAt) = :date ORDER BY al.occurredAt DESC")
    List<AttendanceLog> findByUserIdAndCheckTypeAndDate(@Param("userId") Long userId, @Param("checkType") CheckType checkType, @Param("date") LocalDate date);

    @Query("SELECT al FROM AttendanceLog al WHERE al.userId = :userId AND al.checkType = 'IN' AND DATE(al.occurredAt) = :date AND al.status != 'FORGOT' ORDER BY al.occurredAt DESC")
    Optional<AttendanceLog> findLatestCheckinByUserIdAndDate(@Param("userId") Long userId, @Param("date") LocalDate date);

    @Query("SELECT al FROM AttendanceLog al WHERE al.userId = :userId AND al.checkType = 'IN' AND al.status IS NULL")
    List<AttendanceLog> findUnclosedAttendanceByUserId(@Param("userId") Long userId);

    @Query("SELECT al FROM AttendanceLog al WHERE al.userId = :userId AND al.storeId = :storeId AND DATE(al.occurredAt) BETWEEN :startDate AND :endDate ORDER BY al.occurredAt DESC")
    List<AttendanceLog> findByUserIdAndStoreIdAndDateBetween(@Param("userId") Long userId, @Param("storeId") Long storeId, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT al FROM AttendanceLog al WHERE al.storeId = :storeId AND DATE(al.occurredAt) = :date")
    List<AttendanceLog> findByStoreIdAndDate(@Param("storeId") Long storeId, @Param("date") LocalDate date);

    @Query("SELECT al FROM AttendanceLog al WHERE al.checkType = 'IN' AND al.status IS NULL AND DATE(al.occurredAt) < :date")
    List<AttendanceLog> findUnclosedAttendanceBeforeDate(@Param("date") LocalDate date);
}
