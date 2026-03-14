package com.sba301.retailmanagement.repository;

import com.sba301.retailmanagement.entity.InventoryDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.List;

@Repository
public interface InventoryDocumentRepository extends JpaRepository<InventoryDocument, Long> {
    Optional<InventoryDocument> findByDocumentCode(String documentCode);

    boolean existsByDocumentCode(String documentCode);

    List<InventoryDocument> findByDocumentTypeOrderByCreatedAtDesc(
            com.sba301.retailmanagement.enums.InventoryDocumentType documentType);

    long countByCreatedAtBetween(LocalDateTime from, LocalDateTime to);

    @Query("SELECT COALESCE(SUM(d.totalAmount), 0) FROM InventoryDocument d WHERE d.createdAt >= :from AND d.createdAt < :to")
    BigDecimal sumTotalAmountBetween(@Param("from") LocalDateTime from, @Param("to") LocalDateTime to);

    /**
     * Gom nhóm tổng tiền theo ngày dựa trên created_at của inventory_document.
     * Trả về: [ngày (yyyy-MM-dd), tổng tiền].
     *
     * Lưu ý: dùng nativeQuery để tận dụng DATE() của MySQL.
     */
    @Query(value = """
            SELECT DATE(created_at) AS d, COALESCE(SUM(total_amount), 0) AS amt
            FROM inventory_document
            WHERE created_at >= :from AND created_at < :to
            GROUP BY DATE(created_at)
            ORDER BY d
            """, nativeQuery = true)
    List<Object[]> sumTotalAmountGroupByDate(@Param("from") LocalDateTime from, @Param("to") LocalDateTime to);
}
