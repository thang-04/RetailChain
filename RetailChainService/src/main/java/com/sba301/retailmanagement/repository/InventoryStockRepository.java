package com.sba301.retailmanagement.repository;

import com.sba301.retailmanagement.entity.InventoryStock;
import com.sba301.retailmanagement.entity.InventoryStockId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Collection;

@Repository
public interface InventoryStockRepository extends JpaRepository<InventoryStock, InventoryStockId> {
    List<InventoryStock> findByWarehouseId(Long warehouseId);

    List<InventoryStock> findByVariantId(Long variantId);

    List<InventoryStock> findByVariant_ProductId(Long productId);

    Optional<InventoryStock> findByWarehouseIdAndVariantId(Long warehouseId, Long variantId);

    @Query("SELECT COALESCE(SUM(s.quantity), 0) FROM InventoryStock s WHERE s.variant.productId = :productId")
    Integer getTotalQuantityByProductId(@Param("productId") Long productId);

    @Query("SELECT COALESCE(SUM(s.quantity), 0) FROM InventoryStock s WHERE s.warehouse.id IN :warehouseIds")
    Long sumQuantityByWarehouseIds(@Param("warehouseIds") Collection<Long> warehouseIds);

    @Query("SELECT COALESCE(COUNT(s), 0) FROM InventoryStock s WHERE s.warehouse.id IN :warehouseIds AND COALESCE(s.quantity, 0) < :threshold")
    Long countLowStockByWarehouseIds(@Param("warehouseIds") Collection<Long> warehouseIds, @Param("threshold") Integer threshold);
}
