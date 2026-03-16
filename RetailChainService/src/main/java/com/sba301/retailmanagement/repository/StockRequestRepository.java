package com.sba301.retailmanagement.repository;

import com.sba301.retailmanagement.entity.StockRequest;
import com.sba301.retailmanagement.enums.StockRequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StockRequestRepository extends JpaRepository<StockRequest, Long> {

    Optional<StockRequest> findByRequestCode(String requestCode);

    List<StockRequest> findByStoreIdOrderByCreatedAtDesc(Long storeId);

    List<StockRequest> findByStatusOrderByCreatedAtDesc(StockRequestStatus status);

    List<StockRequest> findByStoreIdAndStatusOrderByCreatedAtDesc(Long storeId, StockRequestStatus status);

    long countByStatus(StockRequestStatus status);

    boolean existsByRequestCode(String requestCode);
}
