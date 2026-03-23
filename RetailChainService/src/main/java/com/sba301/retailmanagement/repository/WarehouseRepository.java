package com.sba301.retailmanagement.repository;

import com.sba301.retailmanagement.entity.Warehouse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WarehouseRepository extends JpaRepository<Warehouse, Long> {
    Optional<Warehouse> findByCode(String code);
    boolean existsByCode(String code);
    @org.springframework.data.jpa.repository.Query("SELECT w FROM Warehouse w WHERE w.isCentral = 1")
    Optional<Warehouse> findByIsCentralTrue();
    @org.springframework.data.jpa.repository.Query("SELECT COUNT(w) FROM Warehouse w WHERE w.isCentral = 1")
    long countByIsCentralTrue();
}
