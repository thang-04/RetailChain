package com.sba301.retailmanagement.mapper;

import com.sba301.retailmanagement.dto.request.CreateStoreRequest;
import com.sba301.retailmanagement.dto.request.UpdateStoreRequest;
import com.sba301.retailmanagement.dto.response.StoreDetailResponse;
import com.sba301.retailmanagement.dto.response.StoreResponse;
import com.sba301.retailmanagement.entity.Store;
import org.springframework.stereotype.Component;

@Component
public class StoreMapper {

    public StoreResponse toResponse(Store store) {
        if (store == null)
            return null;
        return StoreResponse.builder()
                .id(store.getId())
                .code(store.getCode())
                .name(store.getName())
                .address(store.getAddress())
                .status(store.getStatus())
                .warehouseId(store.getWarehouseId())
                .createdAt(store.getCreatedAt())
                .updatedAt(store.getUpdatedAt())
                .build();
    }

    public StoreDetailResponse toDetailResponse(Store store) {
        if (store == null)
            return null;
        return StoreDetailResponse.builder()
                .id(store.getId())
                .code(store.getCode())
                .name(store.getName())
                .address(store.getAddress())
                .status(store.getStatus() == 1 ? "Active" : "Inactive")
                .build();
    }

    public Store toEntity(CreateStoreRequest request) {
        if (request == null)
            return null;
        Store store = new Store();
        store.setCode(request.getCode());
        store.setName(request.getName());
        store.setAddress(request.getAddress());
        store.setStatus(1); // Default active
        return store;
    }

    public void updateEntity(Store store, UpdateStoreRequest request) {
        if (request == null || store == null)
            return;
        if (request.getName() != null)
            store.setName(request.getName());
        if (request.getAddress() != null)
            store.setAddress(request.getAddress());
        if (request.getStatus() != null)
            store.setStatus(request.getStatus());
    }
}
