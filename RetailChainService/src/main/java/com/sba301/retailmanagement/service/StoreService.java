package com.sba301.retailmanagement.service;

import com.sba301.retailmanagement.dto.request.CreateStoreRequest;
import com.sba301.retailmanagement.dto.request.UpdateStoreRequest;
import com.sba301.retailmanagement.dto.response.StaffResponse;
import com.sba301.retailmanagement.dto.response.StoreDetailResponse;
import com.sba301.retailmanagement.dto.response.StoreResponse;

import java.util.List;

public interface StoreService {
    List<StoreResponse> getAllStores();

    StoreDetailResponse getStoreBySlug(String slug);

    StoreResponse createStore(CreateStoreRequest request);

    StoreResponse updateStore(String slug, UpdateStoreRequest request);

    Boolean deleteStore(String slug);
    
    List<StaffResponse> getStaffByStoreId(Long storeId);
}
