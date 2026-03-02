package com.sba301.retailmanagement.repository;

import com.sba301.retailmanagement.entity.InventoryHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InventoryHistoryRepository extends JpaRepository<InventoryHistory, Long> {
    List<InventoryHistory> findByWarehouseId(Long warehouseId);
    List<InventoryHistory> findByDocumentId(Long documentId);
    List<InventoryHistory> findAllByOrderByOccurredAtDesc();
}
