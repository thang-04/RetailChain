package com.sba301.retailmanagement.repository;

import com.sba301.retailmanagement.entity.Warehouse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StoreWarehouseRepository extends JpaRepository<Warehouse, Long> {
    
    @Query("SELECT w FROM Warehouse w WHERE w.isCentral = 0")
    List<Warehouse> findAllStoreWarehouses();
}
