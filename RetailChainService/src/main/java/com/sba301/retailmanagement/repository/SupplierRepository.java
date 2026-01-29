package com.sba301.retailmanagement.repository;

import com.sba301.retailmanagement.entity.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SupplierRepository extends JpaRepository<Supplier, Long> {
    // Basic CRUD methods provided by JpaRepository
}
