package com.sba301.retailmanagement.controller;

import com.sba301.retailmanagement.dto.request.UpsertStaffQuotaRequest;
import com.sba301.retailmanagement.entity.StaffQuota;
import com.sba301.retailmanagement.repository.StaffQuotaRepository;
import com.sba301.retailmanagement.utils.ApiCode;
import com.sba301.retailmanagement.utils.ResponseJson;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api/staff-quotas")
public class StaffQuotaController {

    @Autowired
    private StaffQuotaRepository staffQuotaRepository;

    @GetMapping
    public String getByStore(@RequestParam Long storeId) {
        String prefix = "[getStaffQuotaByStore]|storeId=" + storeId;
        log.info("{}|START", prefix);
        try {
            List<StaffQuota> result = staffQuotaRepository.findByStoreId(storeId);
            log.info("{}|END|size={}", prefix, result.size());
            return ResponseJson.toJsonWithData(ApiCode.SUCCESSFUL, "Get staff quota success", result);
        } catch (Exception e) {
            log.error("{}|Exception={}", prefix, e.getMessage(), e);
            return ResponseJson.toJsonString(ApiCode.ERROR_INTERNAL, "Error retrieving staff quota: " + e.getMessage());
        }
    }

    @PutMapping
    public String upsert(@RequestBody List<UpsertStaffQuotaRequest> requests) {
        String prefix = "[upsertStaffQuota]|size=" + (requests == null ? 0 : requests.size());
        log.info("{}|START", prefix);
        try {
            if (requests == null || requests.isEmpty()) {
                return ResponseJson.toJsonString(ApiCode.UNSUCCESSFUL, "Danh sách quota trống");
            }

            List<StaffQuota> saved = requests.stream().map(r -> {
                if (r.getUserId() == null || r.getStoreId() == null) {
                    throw new IllegalArgumentException("userId/storeId không được null");
                }

                StaffQuota q = staffQuotaRepository.findByUserIdAndStoreId(r.getUserId(), r.getStoreId())
                        .orElseGet(StaffQuota::new);
                q.setUserId(r.getUserId());
                q.setStoreId(r.getStoreId());
                q.setMinShiftsPerWeek(r.getMinShiftsPerWeek() != null ? r.getMinShiftsPerWeek() : 5);
                q.setMaxShiftsPerWeek(r.getMaxShiftsPerWeek() != null ? r.getMaxShiftsPerWeek() : 6);
                return staffQuotaRepository.save(q);
            }).collect(Collectors.toList());

            log.info("{}|END|saved={}", prefix, saved.size());
            return ResponseJson.toJsonWithData(ApiCode.SUCCESSFUL, "Upsert staff quota success", saved);
        } catch (IllegalArgumentException e) {
            log.warn("{}|BAD_REQUEST|{}", prefix, e.getMessage());
            return ResponseJson.toJsonString(ApiCode.UNSUCCESSFUL, e.getMessage());
        } catch (Exception e) {
            log.error("{}|Exception={}", prefix, e.getMessage(), e);
            return ResponseJson.toJsonString(ApiCode.ERROR_INTERNAL, "Error upserting staff quota: " + e.getMessage());
        }
    }
}
