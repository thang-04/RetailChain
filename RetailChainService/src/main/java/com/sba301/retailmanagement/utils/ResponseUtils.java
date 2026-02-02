package com.sba301.retailmanagement.utils;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.MediaType;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

public class ResponseUtils {
    private ResponseUtils() {
        // Private constructor to prevent instantiation
        // Only use static methods
    }

    public static void writeJson(HttpServletResponse response, int status, String message) throws IOException {
        response.setStatus(status);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);

        Map<String, Object> responseBody = new HashMap<>();
        responseBody.put("code", status);
        responseBody.put("desc", message);

        new ObjectMapper().writeValue(response.getOutputStream(), responseBody);
    }

    public static void writeJsonWithData(HttpServletResponse response, int status, String message, Object data)
            throws IOException {
        response.setStatus(status);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);

        Map<String, Object> responseBody = new HashMap<>();
        responseBody.put("code", status);
        responseBody.put("desc", message);
        if (data != null) {
            responseBody.put("data", data);
        }

        new ObjectMapper().writeValue(response.getOutputStream(), responseBody);
    }
}
