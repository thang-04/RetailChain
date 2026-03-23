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
public class InventoryHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "document_id", nullable = false)
    private Long documentId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "document_id", insertable = false, updatable = false)
    private InventoryDocument document;

    @Column(name = "document_item_id", nullable = false)
    private Long documentItemId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "document_item_id", insertable = false, updatable = false)
    private InventoryDocumentItem documentItem;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "warehouse_id", insertable = false, updatable = false)
    private Warehouse warehouse;

    @Column(name = "warehouse_id", insertable = false, updatable = false)
    private Long warehouseId;

    @Column(name = "variant_id", nullable = false)
    private Long variantId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "variant_id", insertable = false, updatable = false)
    private ProductVariant variant;

    @Enumerated(EnumType.STRING)
    @Column(name = "action", nullable = false)
    private InventoryAction action;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @Column(name = "balance_after", nullable = false)
    private Integer balanceAfter;

    @Column(name = "actor_user_id", nullable = false)
    private Long actorUserId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "actor_user_id", insertable = false, updatable = false)
    private User actorUser;

    @Column(name = "occurred_at", nullable = false)
    private LocalDateTime occurredAt;
}
