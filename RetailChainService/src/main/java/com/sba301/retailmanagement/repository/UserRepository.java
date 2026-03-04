package com.sba301.retailmanagement.repository;

import com.sba301.retailmanagement.entity.User;
import com.sba301.retailmanagement.enums.Region;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    @Query("SELECT u FROM User u " +
                    "LEFT JOIN FETCH u.roles r " +
                    "LEFT JOIN FETCH r.permissions " +
                    "WHERE u.email = :email")
    Optional<User> findByEmailWithAuthorities(@Param("email") String email);

    @Query("SELECT u FROM User u " +
                    "LEFT JOIN FETCH u.roles r " +
                    "LEFT JOIN FETCH r.permissions " +
                    "WHERE u.username = :username")
    Optional<User> findByUsernameWithAuthorities(@Param("username") String username);

    // ==================== SCOPE-BASED QUERIES ====================

    /**
     * Tìm users trong một store cụ thể
     * Dùng cho Store Manager xem Staff trong store
     */
    List<User> findByStoreId(Long storeId);

    /**
     * Tìm users trong một region hoặc warehouse
     * Dùng cho Regional Admin xem Store Managers và Staff trong vùng
     */
    @Query("SELECT u FROM User u WHERE u.region = :region OR u.warehouseId = :warehouseId")
    List<User> findByRegionOrWarehouseId(@Param("region") Region region, @Param("warehouseId") Long warehouseId);

    /**
     * Tìm users theo region
     */
    List<User> findByRegion(Region region);

    /**
     * Tìm users theo warehouseId
     */
    List<User> findByWarehouseId(Long warehouseId);

    /**
     * Tìm users được tạo bởi một user cụ thể
     * Dùng để tracking hierarchy
     */
    List<User> findByCreatedByUserId(Long createdByUserId);

    /**
     * Đếm số users trong một store
     */
    long countByStoreId(Long storeId);

    /**
     * Đếm số users trong một region
     */
    long countByRegion(Region region);
}
