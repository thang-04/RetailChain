package com.sba301.retailmanagement.repository;

import com.sba301.retailmanagement.entity.Shift;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ShiftRepository extends JpaRepository<Shift, Long> {
    List<Shift> findByStoreId(Long storeId);
    List<Shift> findByStoreIdIn(List<Long> storeIds);
    List<Shift> findByIsDefault(boolean isDefault);
    
    @Query("SELECT s FROM Shift s WHERE s.storeId = :storeId OR s.isDefault = :isDefault")
    List<Shift> findByStoreIdOrIsDefault(@Param("storeId") Long storeId, @Param("isDefault") boolean isDefault);
}
