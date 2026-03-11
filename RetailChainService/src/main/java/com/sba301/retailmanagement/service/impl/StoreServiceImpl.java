package com.sba301.retailmanagement.service.impl;

import com.sba301.retailmanagement.dto.request.CreateStoreRequest;
import com.sba301.retailmanagement.dto.request.UpdateStoreRequest;
import com.sba301.retailmanagement.dto.response.*;
import com.sba301.retailmanagement.entity.Store;
import com.sba301.retailmanagement.entity.Warehouse;
import com.sba301.retailmanagement.entity.InventoryStock;
import com.sba301.retailmanagement.entity.User;
import com.sba301.retailmanagement.entity.Product;
import com.sba301.retailmanagement.entity.ProductVariant;
import com.sba301.retailmanagement.enums.RoleConstant;
import com.sba301.retailmanagement.exception.ResourceNotFoundException;
import com.sba301.retailmanagement.mapper.StoreMapper;
import com.sba301.retailmanagement.repository.StoreRepository;
import com.sba301.retailmanagement.repository.WarehouseRepository;
import com.sba301.retailmanagement.repository.UserRepository;
import com.sba301.retailmanagement.repository.InventoryStockRepository;
import com.sba301.retailmanagement.service.StoreService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Collections;

@Service
@RequiredArgsConstructor
@Slf4j
public class StoreServiceImpl implements StoreService {

    private final StoreRepository storeRepository;
    private final UserRepository userRepository;
    private final StoreMapper storeMapper;
    private final WarehouseRepository warehouseRepository;
    private final InventoryStockRepository inventoryStockRepository;

    @Override
    public List<StoreResponse> getAllStores() {
        String prefix = "[getAllStores]";
        log.info("{}|START", prefix);
        try {
            User currentUser = getCurrentUser();
            List<Store> stores;

            if (currentUser != null && !isSuperAdmin(currentUser) && currentUser.getStoreId() != null) {
                // If not Super Admin, return only their own store
                Optional<Store> myStore = storeRepository.findById(currentUser.getStoreId());
                stores = myStore.map(Collections::singletonList).orElse(Collections.emptyList());
            } else {
                stores = storeRepository.findAll();
            }

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
            User currentUser = getCurrentUser();
            Pageable pageable = PageRequest.of(page, size);
            Page<Store> storesPage;

            if (currentUser != null && !isSuperAdmin(currentUser) && currentUser.getStoreId() != null) {
                // Return only their own store
                Optional<Store> myStore = storeRepository.findById(currentUser.getStoreId());
                List<Store> storeList = myStore.map(Collections::singletonList).orElse(Collections.emptyList());
                storesPage = new org.springframework.data.domain.PageImpl<>(storeList, pageable, storeList.size());
            } else {
                storesPage = storeRepository.findAll(pageable);
            }

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

            if (store.getWarehouse() != null) {
                response.setWarehouseId(store.getWarehouse().getId());
            }

            List<User> users = userRepository.findByStoreId(store.getId());
            User manager = users.stream()
                    .filter(u -> u.getRoles().stream()
                            .anyMatch(r -> r.getName().equalsIgnoreCase("Manager")
                                    || r.getName().equalsIgnoreCase("Store Manager")))
                    .findFirst()
                    .orElse(users.isEmpty() ? null : users.get(0));

            if (manager != null) {
                response.setManager(manager.getFullName() != null ? manager.getFullName() : manager.getUsername());
                response.setPhone(manager.getPhone() != null ? manager.getPhone() : "N/A");
                response.setEmail(manager.getEmail() != null ? manager.getEmail() : "N/A");
            } else {
                response.setManager("N/A");
                response.setPhone("N/A");
                response.setEmail("N/A");
            }
            response.setType("Standard");

            int activeStaffCount = (int) users.stream().filter(u -> u.getStatus() == 1).count();

            List<StoreInventoryDTO> inventory = new ArrayList<>();
            long lowStockCount = 0;
            long totalStockQuantity = 0;
            int totalProductVariants = 0;

            if (response.getWarehouseId() != null) {
                List<InventoryStock> stocks = inventoryStockRepository.findByWarehouseId(response.getWarehouseId());
                totalProductVariants = stocks.size();
                for (InventoryStock stock : stocks) {
                    ProductVariant variant = stock.getVariant();
                    Product product = variant.getProduct();

                    totalStockQuantity += stock.getQuantity();
                    if (stock.getQuantity() <= 10)
                        lowStockCount++;

                    String status = stock.getQuantity() > 10 ? "In Stock"
                            : (stock.getQuantity() > 0 ? "Low Stock" : "Out of Stock");

                    inventory.add(StoreInventoryDTO.builder()
                            .id(stock.getVariant().getId())
                            .name(product != null ? product.getName() : "Unknown")
                            .sku(variant.getSku())
                            .category(product != null && product.getCategory() != null ? product.getCategory().getName()
                                    : "Unknown")
                            .stock(stock.getQuantity())
                            .price(variant.getPrice() != null ? variant.getPrice().toString() : "0")
                            .status(status)
                            .build());
                }
            }
            response.setInventory(inventory);

            response.setKpi(StoreKpiDTO.builder()
                    .totalProductVariants(totalProductVariants)
                    .totalStockQuantity(totalStockQuantity)
                    .lowStockCount((int) lowStockCount)
                    .activeStaff(activeStaffCount)
                    .build());

            List<StoreStaffDTO> staff = users.stream().map(user -> {
                String roleName = user.getRoles().isEmpty() ? "Staff" : user.getRoles().iterator().next().getName();
                String status = user.getStatus() == 1 ? "Active" : "Inactive";
                String statusColor = user.getStatus() == 1 ? "text-emerald-700 bg-emerald-50"
                        : "text-red-700 bg-red-50";
                String dotColor = user.getStatus() == 1 ? "bg-emerald-500" : "bg-red-500";

                String initials = "";
                if (user.getFullName() != null && !user.getFullName().isEmpty()) {
                    String[] parts = user.getFullName().split(" ");
                    initials = parts.length > 1
                            ? (parts[0].substring(0, 1) + parts[parts.length - 1].substring(0, 1)).toUpperCase()
                            : user.getFullName().substring(0, Math.min(2, user.getFullName().length())).toUpperCase();
                } else if (user.getUsername() != null && !user.getUsername().isEmpty()) {
                    initials = user.getUsername().substring(0, Math.min(2, user.getUsername().length())).toUpperCase();
                }

                return StoreStaffDTO.builder()
                        .id(user.getId())
                        .name(user.getFullName() != null ? user.getFullName() : user.getUsername())
                        .role(roleName)
                        .status(status)
                        .statusColor(statusColor)
                        .dotColor(dotColor)
                        .initials(initials)
                        .initialsColor("bg-blue-100 text-blue-700")
                        .build();
            }).toList();
            response.setStaff(staff);

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
        String prefix = "[createStore]|name=" + (request != null ? request.getName() : "null");
        log.info("{}|START", prefix);
        try {
            if (request == null) {
                log.error("{}|FAILED|Request is null", prefix);
                throw new IllegalArgumentException("Request cannot be null");
            }
            if (request.getCode() == null || request.getCode().trim().isEmpty()) {
                request.setCode("ST" + System.currentTimeMillis());
            }
            if (storeRepository.findByCode(request.getCode()).isPresent()) {
                log.error("{}|Store code already exists", prefix);
                throw new IllegalArgumentException("Store code already exists");
            }

            Warehouse warehouse = new Warehouse();
            warehouse.setCode("WH_" + request.getCode());
            warehouse.setName("Kho " + request.getName());
            warehouse.setAddress(request.getAddress());
            warehouse.setIsCentral(0);
            warehouse.setStatus(1);
            warehouse.setCreatedAt(LocalDateTime.now());
            warehouse.setUpdatedAt(LocalDateTime.now());
            Warehouse savedWarehouse = warehouseRepository.save(warehouse);

            Store store = storeMapper.toEntity(request);
            store.setWarehouseId(savedWarehouse.getId());
            store.setCreatedAt(LocalDateTime.now());
            store.setUpdatedAt(LocalDateTime.now());

            Store savedStore = storeRepository.save(store);
            StoreResponse response = storeMapper.toResponse(savedStore);
            response.setWarehouseId(savedWarehouse.getId());

            log.info("{}|END|id={}, warehouseId={}", prefix, savedStore.getId(), savedWarehouse.getId());
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
            if (updatedStore.getWarehouseId() != null) {
                response.setWarehouseId(updatedStore.getWarehouseId());
            }

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

    @Override
    public void assignStaffToStore(Long storeId, List<Long> staffIds) {
        String prefix = "[assignStaffToStore]|storeId=" + storeId;
        log.info("{}|START|staffIds={}", prefix, staffIds);
        try {
            if (!storeRepository.existsById(storeId)) {
                log.error("{}|Store not found", prefix);
                throw new ResourceNotFoundException("Store not found with id: " + storeId);
            }

            if (staffIds == null || staffIds.isEmpty()) {
                log.info("{}|END|No staff to assign", prefix);
                return;
            }

            List<User> staffList = userRepository.findAllById(staffIds);
            for (User staff : staffList) {
                // Ensure they are STAFF
                boolean isStaff = staff.getRoles() != null && staff.getRoles().stream()
                        .anyMatch(r -> r.getCode().equalsIgnoreCase(RoleConstant.STAFF.name()));
                if (isStaff) {
                    staff.setStoreId(storeId);
                } else {
                    log.warn("{}|User {} is not STAFF, skipping assignment", prefix, staff.getId());
                }
            }
            userRepository.saveAll(staffList);

            log.info("{}|END|Assigned {} staff members", prefix, staffList.size());
        } catch (ResourceNotFoundException e) {
            throw e;
        } catch (Exception e) {
            log.error("{}|Exception={}", prefix, e.getMessage(), e);
            throw new RuntimeException("Error assigning staff: " + e.getMessage());
        }
    }

    private User getCurrentUser() {
        try {
            Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            if (principal instanceof UserDetails) {
                String email = ((UserDetails) principal).getUsername();
                return userRepository.findByEmail(email).orElse(null);
            }
        } catch (Exception e) {
            log.debug("No authenticated user found");
        }
        return null;
    }

    private boolean isSuperAdmin(User user) {
        return user != null && user.getRoles() != null && user.getRoles().stream()
                .anyMatch(r -> r.getCode().equalsIgnoreCase(RoleConstant.SUPER_ADMIN.name()));
    }
}
