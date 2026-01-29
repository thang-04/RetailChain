package com.sba301.retailmanagement.controller;

import com.sba301.retailmanagement.dto.response.SupplierResponse;
import com.sba301.retailmanagement.service.SupplierService;
import com.sba301.retailmanagement.utils.ApiCode;
import com.sba301.retailmanagement.utils.ResponseJson;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/supplier")
@RequiredArgsConstructor
public class SupplierController {

    private final SupplierService supplierService;

    @GetMapping
    public String getAllSuppliers() {
        String prefix = "[getAllSuppliers]";
        try {
            List<SupplierResponse> response = supplierService.getAllSuppliers();
            return ResponseJson.toJsonWithData(ApiCode.SUCCESSFUL, "Suppliers retrieved successfully", response);
        } catch (Exception e) {
            // log.error("{}|Exception={}", prefix, e.getMessage(), e);
            e.printStackTrace();
            return ResponseJson.toJsonString(ApiCode.ERROR_INTERNAL, "Error retrieving suppliers: " + e.getMessage());
        }
    }
}
