package com.sba301.retailmanagement.repository;

import com.sba301.retailmanagement.entity.StockRequestItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StockRequestItemRepository extends JpaRepository<StockRequestItem, Long> {

    List<StockRequestItem> findByStockRequestId(Long stockRequestId);

    void deleteByStockRequestId(Long stockRequestId);
}
