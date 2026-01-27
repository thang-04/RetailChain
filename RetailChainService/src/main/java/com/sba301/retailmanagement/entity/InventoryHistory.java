package com.sba301.retailmanagement.entity;

import com.sba301.retailmanagement.enums.InventoryAction;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "inventory_history")
//v1
public class InventoryHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "document_id", nullable = false)
    private Long documentId;

    @Column(name="document_item_id" ,nullable = false)
    private Long documentItemId;

    @Column(name="warehouse_id" ,nullable = false)
    private Long warehouseId;

    @Column(name = "variant_id", nullable = false)
    private Long variantId;

    @Enumerated(EnumType.STRING)
    @Column(name="action" ,nullable = false)
    private InventoryAction action;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @Column(name = "balance_after", nullable = false)
    private Integer balanceAfter;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "actor_user_id", nullable = false)
    private User actorUser;

    @Column(name="occurred_at",nullable = false)
    private LocalDateTime occurredAt;

}
