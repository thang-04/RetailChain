package com.sba301.retailmanagement.controller;

import com.sba301.retailmanagement.dto.request.CreateStoreRequest;
import com.sba301.retailmanagement.dto.request.UpdateStoreRequest;
import com.sba301.retailmanagement.dto.response.UserResponse;
import com.sba301.retailmanagement.entity.User;
import com.sba301.retailmanagement.repository.UserRepository;
import com.sba301.retailmanagement.service.StoreService;
import com.sba301.retailmanagement.utils.ApiCode;
import com.sba301.retailmanagement.utils.ResponseJson;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

import static com.sba301.retailmanagement.utils.CommonUtils.gson;

@Slf4j
@RestController
@RequestMapping("/api/stores")
@RequiredArgsConstructor
public class StoreController {

    private final StoreService storeService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public String getAllStores() {
        String prefix = "[getAllStores]";
        try {
            log.info("{}|START", prefix);
            var response = storeService.getAllStores();
            if (response == null) {
                log.error("{}|FAILED|Error occurred while retrieving stores", prefix);
                return ResponseJson.toJsonString(ApiCode.ERROR_INTERNAL, "Error retrieving stores");
            }
            log.info("{}|END|size={}", prefix, response.size());
            return ResponseJson.toJsonWithData(ApiCode.SUCCESSFUL, "Get all stores success", response);
        } catch (Exception e) {
            log.error("{}|Exception={}", prefix, e.getMessage(), e);
            return ResponseJson.toJsonString(ApiCode.ERROR_INTERNAL, "Error retrieving stores: " + e.getMessage());
        }
    }

    @GetMapping("/{slug}")
    public String getStoreBySlug(@PathVariable String slug) {
        String prefix = "[getStoreBySlug]|slug=" + slug;
        try {
            log.info("{}|START", prefix);
            var response = storeService.getStoreBySlug(slug);
            if (response == null) {
                log.error("{}|FAILED|No data found", prefix);
                return ResponseJson.toJsonString(ApiCode.UNSUCCESSFUL, "Store not found");
            }
            log.info("{}|END|data={}", prefix, gson.toJson(response));
            return ResponseJson.toJsonWithData(ApiCode.SUCCESSFUL, "Get store detail success", response);
        } catch (Exception e) {
            log.error("{}|Exception={}", prefix, e.getMessage(), e);
            return ResponseJson.toJsonString(ApiCode.ERROR_INTERNAL,
                    "Error retrieving store detail: " + e.getMessage());
        }
    }

    @PostMapping
    public String createStore(@RequestBody CreateStoreRequest request) {
        String prefix = "[createStore]|code=" + (request != null ? request.getCode() : "null");
        try {
            log.info("{}|START", prefix);
            var response = storeService.createStore(request);
            if (response == null) {
                log.error("{}|FAILED|Error occurred while creating store", prefix);
                return ResponseJson.toJsonString(ApiCode.ERROR_INTERNAL, "Error creating store");
            }
            log.info("{}|END|id={}", prefix, response.getId());
            return ResponseJson.toJsonWithData(ApiCode.SUCCESSFUL, "Create store success", response);
        } catch (Exception e) {
            log.error("{}|Exception={}", prefix, e.getMessage(), e);
            return ResponseJson.toJsonString(ApiCode.ERROR_INTERNAL, "Error creating store: " + e.getMessage());
        }
    }

    @PutMapping("/{slug}")
    public String updateStore(@PathVariable String slug,
            @RequestBody UpdateStoreRequest request) {
        String prefix = "[updateStore]|slug=" + slug;
        try {
            log.info("{}|START", prefix);
            var response = storeService.updateStore(slug, request);
            if (response == null) {
                log.error("{}|FAILED|Error occurred while updating store", prefix);
                return ResponseJson.toJsonString(ApiCode.ERROR_INTERNAL, "Error updating store");
            }
            log.info("{}|END|id={}", prefix, response.getId());
            return ResponseJson.toJsonWithData(ApiCode.SUCCESSFUL, "Update store success", response);
        } catch (Exception e) {
            log.error("{}|Exception={}", prefix, e.getMessage(), e);
            return ResponseJson.toJsonString(ApiCode.ERROR_INTERNAL, "Error updating store: " + e.getMessage());
        }
    }

    @GetMapping("/{id}/staff-list")
    public String getStoreStaffList(@PathVariable Long id) {
        String prefix = "[getStoreStaffList]|storeId=" + id;
        log.info("{}|START", prefix);
        try {
            List<User> users = userRepository.findByStoreId(id);
            List<UserResponse> result = users.stream()
                    .map(u -> new UserResponse(
                            u.getId(),
                            u.getStoreId(),
                            u.getUsername(),
                            u.getFullName(),
                            u.getPhone(),
                            u.getEmail(),
                            u.getStatus()))
                    .collect(Collectors.toList());
            log.info("{}|END|size={}", prefix, result.size());
            return ResponseJson.toJsonWithData(ApiCode.SUCCESSFUL, "Get store staff list success", result);
        } catch (Exception e) {
            log.error("{}|Exception={}", prefix, e.getMessage(), e);
            return ResponseJson.toJsonString(ApiCode.ERROR_INTERNAL, "Error retrieving staff list: " + e.getMessage());
        }
    }

    @GetMapping("/{id}/staff")
    public String getStoreStaff(@PathVariable Long id) {
        // Giữ lại endpoint cũ cho tương thích
        return getStoreStaffList(id);
    }
}
