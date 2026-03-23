package com.sba301.retailmanagement.repository;

import com.sba301.retailmanagement.entity.StaffQuota;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StaffQuotaRepository extends JpaRepository<StaffQuota, Long> {
    List<StaffQuota> findByStoreId(Long storeId);
    Optional<StaffQuota> findByUserIdAndStoreId(Long userId, Long storeId);
}

