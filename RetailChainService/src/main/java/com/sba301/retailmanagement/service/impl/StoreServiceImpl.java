package com.sba301.retailmanagement.service.impl;

import com.sba301.retailmanagement.dto.request.CreateStoreRequest;
import com.sba301.retailmanagement.dto.request.UpdateStoreRequest;
import com.sba301.retailmanagement.dto.response.*;
import com.sba301.retailmanagement.entity.Store;
import com.sba301.retailmanagement.exception.ResourceNotFoundException;
import com.sba301.retailmanagement.mapper.StoreMapper;
import com.sba301.retailmanagement.repository.StoreRepository;
import com.sba301.retailmanagement.repository.UserRepository;
import com.sba301.retailmanagement.service.StoreService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class StoreServiceImpl implements StoreService {

    private final StoreRepository storeRepository;
    private final UserRepository userRepository;
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
            throw new RuntimeException("Error retrieving stores: " + e.getMessage());
        }
    }

    /**
     * Lấy danh sách stores có phân trang
     */
    public Page<StoreResponse> getAllStoresPaged(int page, int size) {
        String prefix = "[getAllStoresPaged]";
        log.info("{}|START|page={}, size={}", prefix, page, size);
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Store> storesPage = storeRepository.findAll(pageable);
            Page<StoreResponse> response = storesPage.map(storeMapper::toResponse);
            log.info("{}|END|totalElements={}, totalPages={}", 
                prefix, response.getTotalElements(), response.getTotalPages());
            return response;
        } catch (Exception e) {
            log.error("{}|Exception={}", prefix, e.getMessage(), e);
            throw new RuntimeException("Error retrieving stores: " + e.getMessage());
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
                throw new ResourceNotFoundException("Store not found with code: " + slug);
            }
            Store store = storeOptional.get();
            StoreDetailResponse response = storeMapper.toDetailResponse(store);

            // TODO: Lấy dữ liệu thực từ các service tương ứng
            // - Manager: từ User service
            // - Phone/Email: từ Store entity hoặc contact info
            // - KPI: từ báo cáo doanh thu
            // - Inventory: từ Inventory service
            // - Staff: từ User service

            log.info("{}|END", prefix);
            return response;
        } catch (ResourceNotFoundException e) {
            throw e;
        } catch (Exception e) {
            log.error("{}|Exception={}", prefix, e.getMessage(), e);
            throw new RuntimeException("Error retrieving store: " + e.getMessage());
        }
    }

    @Override
    public StoreResponse createStore(CreateStoreRequest request) {
        String prefix = "[createStore]|code=" + (request != null ? request.getCode() : "null");
        log.info("{}|START", prefix);
        try {
            if (request == null || request.getCode() == null) {
                log.error("{}|FAILED|Request or code is null", prefix);
                throw new IllegalArgumentException("Request or code cannot be null");
            }
            if (storeRepository.findByCode(request.getCode()).isPresent()) {
                log.error("{}|Store code already exists", prefix);
                throw new IllegalArgumentException("Store code already exists");
            }

            Store store = storeMapper.toEntity(request);
            store.setCreatedAt(LocalDateTime.now());
            store.setUpdatedAt(LocalDateTime.now());

            Store savedStore = storeRepository.save(store);
            StoreResponse response = storeMapper.toResponse(savedStore);

            log.info("{}|END|id={}", prefix, savedStore.getId());
            return response;
        } catch (IllegalArgumentException e) {
            throw e;
        } catch (Exception e) {
            log.error("{}|Exception={}", prefix, e.getMessage(), e);
            throw new RuntimeException("Error creating store: " + e.getMessage());
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
                throw new ResourceNotFoundException("Store not found with code: " + slug);
            }
            Store store = storeOptional.get();

            storeMapper.updateEntity(store, request);
            store.setUpdatedAt(LocalDateTime.now());

            Store updatedStore = storeRepository.save(store);
            StoreResponse response = storeMapper.toResponse(updatedStore);

            log.info("{}|END", prefix);
            return response;
        } catch (ResourceNotFoundException e) {
            throw e;
        } catch (Exception e) {
            log.error("{}|Exception={}", prefix, e.getMessage(), e);
            throw new RuntimeException("Error updating store: " + e.getMessage());
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
                throw new ResourceNotFoundException("Store not found with code: " + slug);
            }
            Store store = storeOptional.get();
            storeRepository.delete(store);

            log.info("{}|END", prefix);
            return true;
        } catch (ResourceNotFoundException e) {
            throw e;
        } catch (Exception e) {
            log.error("{}|Exception={}", prefix, e.getMessage(), e);
            throw new RuntimeException("Error deleting store: " + e.getMessage());
        }
    }

    @Override
    public List<StaffResponse> getStaffByStoreId(Long storeId) {
        String prefix = "[getStaffByStoreId]|storeId=" + storeId;
        log.info("{}|START", prefix);
        try {
            if (!storeRepository.existsById(storeId)) {
                log.error("{}|Store not found", prefix);
                throw new ResourceNotFoundException("Store not found with id: " + storeId);
            }

            var users = userRepository.findByStoreId(storeId);
            List<StaffResponse> staffList = users.stream()
                    .map(user -> StaffResponse.builder()
                            .id(user.getId())
                            .username(user.getUsername())
                            .fullName(user.getFullName())
                            .phone(user.getPhone())
                            .email(user.getEmail())
                            .status(user.getStatus())
                            .roleName(user.getRoles() != null && !user.getRoles().isEmpty() 
                                ? user.getRoles().iterator().next().getName() 
                                : "Staff")
                            .createdAt(user.getCreatedAt())
                            .build())
                    .toList();

            log.info("{}|END|size={}", prefix, staffList.size());
            return staffList;
        } catch (ResourceNotFoundException e) {
            throw e;
        } catch (Exception e) {
            log.error("{}|Exception={}", prefix, e.getMessage(), e);
            throw new RuntimeException("Error retrieving staff: " + e.getMessage());
        }
    }
}
