package com.sba301.retailmanagement.repository;

import com.sba301.retailmanagement.entity.Shift;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ShiftRepository extends JpaRepository<Shift, Long> {
    List<Shift> findByStoreId(Long storeId);
    List<Shift> findByStoreIdIn(List<Long> storeIds);
}
