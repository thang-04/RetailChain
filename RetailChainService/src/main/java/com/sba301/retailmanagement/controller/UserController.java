package com.sba301.retailmanagement.controller;

import com.sba301.retailmanagement.dto.response.UserResponse;
import com.sba301.retailmanagement.service.UserService;
import com.sba301.retailmanagement.utils.ApiCode;
import com.sba301.retailmanagement.utils.ResponseJson;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static com.sba301.retailmanagement.utils.CommonUtils.gson;

@Slf4j
@RestController
@RequestMapping(value = "/api/user", produces = "application/json")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/profile/{id}")
    public String getProfile(@PathVariable Long id) {
        String prefix = "[getProfile]|user_id=" + id;
        log.info("{}|START", prefix);
        try {
            UserResponse userResponse = userService.getProfile(id);
            if (userResponse == null) {
                log.error("{}|FAILED|No data found", prefix);
                return ResponseJson.toJsonString(ApiCode.UNSUCCESSFUL, "User not found");
            }
            log.info("{}|END|user={}", prefix, gson.toJson(userResponse));
            return ResponseJson.toJsonWithData(ApiCode.SUCCESSFUL, "User profile retrieved successfully", userResponse);
        } catch (Exception e) {
            log.error("{}|Exception={}", prefix, e.getMessage(), e);
            return ResponseJson.toJsonString(ApiCode.ERROR_INTERNAL,
                    "Error retrieving user profile: " + e.getMessage());
        }
    }
}
