package com.sba301.retailmanagement.service.impl;

import com.sba301.retailmanagement.dto.request.CreateStoreRequest;
import com.sba301.retailmanagement.dto.request.UpdateStoreRequest;
import com.sba301.retailmanagement.dto.response.*;
import com.sba301.retailmanagement.entity.Store;
import com.sba301.retailmanagement.mapper.StoreMapper;
import com.sba301.retailmanagement.repository.StoreRepository;
import com.sba301.retailmanagement.service.StoreService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class StoreServiceImpl implements StoreService {

    private final StoreRepository storeRepository;
    private final StoreMapper storeMapper;

    @Override
    public List<StoreResponse> getAllStores() {
        String prefix = "[getAllStores]";
        log.info("{}|START", prefix);
        try {
            List<Store> stores = storeRepository.findAll();
            List<StoreResponse> response = stores.stream().map(storeMapper::toResponse).toList();
            log.info("{}|END|size={}", prefix, response.size());
            return response;
        } catch (Exception e) {
            log.error("{}|Exception={}", prefix, e.getMessage(), e);
            return null;
        }
    }

    @Override
    public StoreDetailResponse getStoreBySlug(String slug) {
        String prefix = "[getStoreBySlug]|slug=" + slug;
        log.info("{}|START", prefix);
        try {
            Optional<Store> storeOptional = storeRepository.findByCode(slug);
            if (storeOptional.isEmpty()) {
                log.error("{}|Store not found", prefix);
                return null;
            }
            Store store = storeOptional.get();
            StoreDetailResponse response = storeMapper.toDetailResponse(store);

            // Mock Data
            response.setManager("Manager " + store.getName());
            response.setPhone("090123456" + store.getId());
            response.setEmail("store" + store.getCode() + "@retailchain.com");
            response.setType("Standard");

            response.setKpi(StoreKpiDTO.builder()
                    .dailyRevenue("15,000,000 VND")
                    .orders("120")
                    .lowStockCount(5)
                    .activeStaff(3)
                    .build());

            List<StoreInventoryDTO> inventory = new ArrayList<>();
            inventory.add(StoreInventoryDTO.builder().id(1L).name("Iphone 15").sku("IP15-128").category("Electronics")
                    .stock(50).price("20,000,000").status("In Stock").build());
            inventory.add(StoreInventoryDTO.builder().id(2L).name("Samsung S24").sku("SS-S24").category("Electronics")
                    .stock(5).price("18,000,000").status("Low Stock").build());
            response.setInventory(inventory);

            List<StoreStaffDTO> staff = new ArrayList<>();
            staff.add(StoreStaffDTO.builder().id(1L).name("Nguyen Van A").role("Store Manager").status("Active")
                    .statusColor("text-emerald-700 bg-emerald-50").dotColor("bg-emerald-500").initials("NA")
                    .initialsColor("bg-blue-100 text-blue-700").build());
            response.setStaff(staff);

            log.info("{}|END", prefix);
            return response;
        } catch (Exception e) {
            log.error("{}|Exception={}", prefix, e.getMessage(), e);
            return null;
        }
    }

    @Override
    public StoreResponse createStore(CreateStoreRequest request) {
        String prefix = "[createStore]|code=" + (request != null ? request.getCode() : "null");
        log.info("{}|START", prefix);
        try {
            if (request == null || request.getCode() == null) {
                log.error("{}|FAILED|Request or code is null", prefix);
                return null;
            }
            if (storeRepository.findByCode(request.getCode()).isPresent()) {
                log.error("{}|Store code already exists", prefix);
                return null;
            }

            Store store = storeMapper.toEntity(request);
            store.setCreatedAt(LocalDateTime.now());
            store.setUpdatedAt(LocalDateTime.now());

            Store savedStore = storeRepository.save(store);
            StoreResponse response = storeMapper.toResponse(savedStore);

            log.info("{}|END|id={}", prefix, savedStore.getId());
            return response;
        } catch (Exception e) {
            log.error("{}|Exception={}", prefix, e.getMessage(), e);
            return null;
        }
    }

    @Override
    public StoreResponse updateStore(String slug, UpdateStoreRequest request) {
        String prefix = "[updateStore]|slug=" + slug;
        log.info("{}|START", prefix);
        try {
            Optional<Store> storeOptional = storeRepository.findByCode(slug);
            if (storeOptional.isEmpty()) {
                log.error("{}|Store not found", prefix);
                return null;
            }
            Store store = storeOptional.get();

            storeMapper.updateEntity(store, request);
            store.setUpdatedAt(LocalDateTime.now());

            Store updatedStore = storeRepository.save(store);
            StoreResponse response = storeMapper.toResponse(updatedStore);

            log.info("{}|END", prefix);
            return response;
        } catch (Exception e) {
            log.error("{}|Exception={}", prefix, e.getMessage(), e);
            return null;
        }
    }

    @Override
    public Boolean deleteStore(String slug) {
        String prefix = "[deleteStore]|slug=" + slug;
        log.info("{}|START", prefix);
        try {
            Optional<Store> storeOptional = storeRepository.findByCode(slug);
            if (storeOptional.isEmpty()) {
                log.error("{}|Store not found", prefix);
                return null;
            }
            Store store = storeOptional.get();
            storeRepository.delete(store);

            log.info("{}|END", prefix);
            return true;
        } catch (Exception e) {
            log.error("{}|Exception={}", prefix, e.getMessage(), e);
            return null;
        }
    }
}
