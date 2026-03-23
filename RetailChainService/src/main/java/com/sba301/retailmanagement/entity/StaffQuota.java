package com.sba301.retailmanagement.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(
        name = "staff_quota",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_staff_quota_user_store", columnNames = {"user_id", "store_id"})
        }
)
public class StaffQuota {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "store_id", nullable = false)
    private Long storeId;

    @Column(name = "min_shifts_per_week", nullable = false)
    private Integer minShiftsPerWeek = 5;

    @Column(name = "max_shifts_per_week", nullable = false)
    private Integer maxShiftsPerWeek = 6;
}

