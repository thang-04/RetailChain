package com.sba301.retailmanagement.repository;

import com.sba301.retailmanagement.entity.InventoryDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface InventoryDocumentRepository extends JpaRepository<InventoryDocument, Long> {
    Optional<InventoryDocument> findByDocumentCode(String documentCode);
    boolean existsByDocumentCode(String documentCode);
}
