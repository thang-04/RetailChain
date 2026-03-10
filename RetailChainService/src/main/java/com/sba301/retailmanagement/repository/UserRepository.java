package com.sba301.retailmanagement.repository;

import com.sba301.retailmanagement.entity.User;
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

    /**
     * Tìm users trong một store cụ thể
     * Dùng cho Store Manager xem Staff trong store
     */
    List<User> findByStoreId(Long storeId);

    List<User> findByCreatedByUserId(Long createdByUserId);

    long countByStoreId(Long storeId);

    @Query("SELECT u FROM User u WHERE NOT EXISTS (SELECT r FROM u.roles r WHERE r.code = :roleCode)")
    List<User> findUsersNotHavingRole(@Param("roleCode") String roleCode);
}
