package com.sba301.retailmanagement.repository;


import com.sba301.retailmanagement.dto.response.DashboardStoreRankingDTO;
import com.sba301.retailmanagement.dto.response.DashboardStoreRowDTO;
import com.sba301.retailmanagement.entity.Store;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;


import java.util.List;

/**
 * Repository chuyên cho các query tổng hợp phục vụ Dashboard (tối ưu performance).
 */
@Repository
public interface DashboardRepository extends JpaRepository<Store, Long> {

    @Query("""
        SELECT new com.sba301.retailmanagement.dto.response.DashboardStoreRowDTO(
            s.id,
            s.code,
            s.name,
            s.address,
            s.status,
            COALESCE(SUM(COALESCE(st.quantity, 0)), 0L),
            COALESCE(SUM(CASE WHEN COALESCE(st.quantity, 0) < 10 THEN 1L ELSE 0L END), 0L)
        )
        FROM Store s
        LEFT JOIN s.warehouse w
        LEFT JOIN InventoryStock st ON st.warehouse.id = w.id
        GROUP BY s.id, s.code, s.name, s.address, s.status
        ORDER BY COALESCE(SUM(COALESCE(st.quantity, 0)), 0L) DESC
        """)
    List<DashboardStoreRowDTO> getStoreTable();

    @Query("""
        SELECT new com.sba301.retailmanagement.dto.response.DashboardStoreRankingDTO(
            s.id,
            s.code,
            s.name,
            COALESCE(SUM(COALESCE(st.quantity, 0)), 0L)
        )
        FROM Store s
        LEFT JOIN s.warehouse w
        LEFT JOIN InventoryStock st ON st.warehouse.id = w.id
        GROUP BY s.id, s.code, s.name
        ORDER BY COALESCE(SUM(COALESCE(st.quantity, 0)), 0L) DESC
        """)
    List<DashboardStoreRankingDTO> getStoreRanking(Pageable pageable);
}

