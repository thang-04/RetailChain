package com.sba301.retailmanagement.service;

import com.sba301.retailmanagement.dto.request.WarehouseRequest;
import com.sba301.retailmanagement.dto.response.WarehouseResponse;

import java.util.List;

public interface WarehouseService {
    WarehouseResponse createWarehouse(WarehouseRequest request);
    
    List<WarehouseResponse> getAllWarehouses();
    
    WarehouseResponse updateWarehouse(Long id, WarehouseRequest request);
    
    void deleteWarehouse(Long id);
}
