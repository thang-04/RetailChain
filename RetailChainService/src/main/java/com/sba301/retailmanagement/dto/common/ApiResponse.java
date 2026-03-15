package com.sba301.retailmanagement.dto.common;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * Wrapper response chuẩn cho tất cả API
 * Đảm bảo format nhất quán: { code, message, data, pagination }
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> implements Serializable {

    private int code;
    private String message;
    private T data;
    private PageInfo pagination;

    /**
     * Tạo response thành công với data
     */
    public static <T> ApiResponse<T> success(T data) {
        return ApiResponse.<T>builder()
                .code(200)
                .message("Thành công")
                .data(data)
                .build();
    }

    /**
     * Tạo response thành công với message và data
     */
    public static <T> ApiResponse<T> success(String message, T data) {
        return ApiResponse.<T>builder()
                .code(200)
                .message(message)
                .data(data)
                .build();
    }

    /**
     * Tạo response thành công với data và phân trang
     */
    public static <T> ApiResponse<T> success(T data, PageInfo pagination) {
        return ApiResponse.<T>builder()
                .code(200)
                .message("Thành công")
                .data(data)
                .pagination(pagination)
                .build();
    }

    /**
     * Tạo response lỗi
     */
    public static <T> ApiResponse<T> error(int code, String message) {
        return ApiResponse.<T>builder()
                .code(code)
                .message(message)
                .build();
    }

    /**
     * Tạo response lỗi 400
     */
    public static <T> ApiResponse<T> badRequest(String message) {
        return error(400, message);
    }

    /**
     * Tạo response lỗi 404
     */
    public static <T> ApiResponse<T> notFound(String message) {
        return error(404, message);
    }

    /**
     * Tạo response lỗi 500
     */
    public static <T> ApiResponse<T> internalError(String message) {
        return error(500, message);
    }

    /**
     * Thông tin phân trang
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class PageInfo implements Serializable {
        private int page;
        private int size;
        private long totalElements;
        private int totalPages;
        private boolean hasNext;
        private boolean hasPrevious;
    }
}
