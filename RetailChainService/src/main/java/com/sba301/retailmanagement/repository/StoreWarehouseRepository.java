package com.sba301.retailmanagement.repository;

import com.sba301.retailmanagement.entity.StoreWarehouse;
import com.sba301.retailmanagement.entity.StoreWarehouseId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StoreWarehouseRepository extends JpaRepository<StoreWarehouse, StoreWarehouseId> {
    List<StoreWarehouse> findByStoreId(Long storeId);

    List<StoreWarehouse> findByWarehouseId(Long warehouseId);

    void deleteByWarehouseId(Long warehouseId);

    boolean existsByWarehouseId(Long warehouseId);
}
