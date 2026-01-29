package com.sba301.retailmanagement.service;

import com.sba301.retailmanagement.dto.response.SupplierResponse;
import java.util.List;

public interface SupplierService {
    List<SupplierResponse> getAllSuppliers();
}
