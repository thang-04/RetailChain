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
public class StoreWarehouseId implements Serializable {

    @Column(name = "store_id")
    private Long storeId;

    @Column(name = "warehouse_id")
    private Long warehouseId;
}
