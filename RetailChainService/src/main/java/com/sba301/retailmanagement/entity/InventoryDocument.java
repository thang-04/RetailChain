package com.sba301.retailmanagement.entity;

import com.sba301.retailmanagement.enums.InventoryDocumentType;
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
@Table(name = "inventory_document")
public class InventoryDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "document_code", nullable = false, unique = true, length = 50)
    private String documentCode;

    @Enumerated(EnumType.STRING)
    @Column(name = "document_type", nullable = false)
    private InventoryDocumentType documentType;

    @Column(name = "source_warehouse_id")
    private Long sourceWarehouseId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "source_warehouse_id", insertable = false, updatable = false)
    private Warehouse sourceWarehouse;

    @Column(name = "target_warehouse_id")
    private Long targetWarehouseId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "target_warehouse_id", insertable = false, updatable = false)
    private Warehouse targetWarehouse;

    @Column(name = "reference_type", length = 30)
    private String referenceType;

    @Column(name = "reference_id")
    private Long referenceId;

    @Column(name = "note", length = 500)
    private String note;

    @Column(name = "created_by", nullable = false)
    private Long createdBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", insertable = false, updatable = false)
    private User createdByUser;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
}
