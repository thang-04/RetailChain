package com.sba301.retailmanagement.controller;

import com.sba301.retailmanagement.service.DashboardService;
import com.sba301.retailmanagement.utils.ApiCode;
import com.sba301.retailmanagement.utils.ResponseJson;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import static com.sba301.retailmanagement.security.SecurityConstants.*;

@Slf4j
@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @PreAuthorize("hasAnyAuthority('" + REPORT_SYSTEM_VIEW + "','" + INVENTORY_VIEW + "','" + STORE_VIEW + "','" + PRODUCT_VIEW + "')")
    @GetMapping("/summary")
    public String getSummary(@RequestParam(required = false, defaultValue = "30days") String timeRange) {
        String prefix = "[getDashboardSummary]|timeRange=" + timeRange;
        log.info("{}|START", prefix);
        try {
            var response = dashboardService.getSummary(timeRange);
            log.info("{}|END", prefix);
            return ResponseJson.toJsonWithData(ApiCode.SUCCESSFUL, "Lấy dữ liệu dashboard thành công", response);
        } catch (Exception e) {
            log.error("{}|Exception={}", prefix, e.getMessage(), e);
            return ResponseJson.toJsonString(ApiCode.ERROR_INTERNAL, "Lỗi lấy dữ liệu dashboard: " + e.getMessage());
        }
    }
}

