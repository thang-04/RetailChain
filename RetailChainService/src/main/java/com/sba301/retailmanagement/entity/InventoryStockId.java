package com.sba301.retailmanagement.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Embeddable
public class InventoryStockId implements Serializable {

    @Column(name = "warehouse_id")
    private Long warehouseId;

    @Column(name = "variant_id")
    private Long variantId;
}
