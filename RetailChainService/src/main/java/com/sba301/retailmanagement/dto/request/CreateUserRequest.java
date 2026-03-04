package com.sba301.retailmanagement.dto.request;

import com.sba301.retailmanagement.enums.Region;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

/**
 * DTO cho việc tạo User mới
 * 
 * Quy tắc tạo theo tầng:
 * - Super Admin tạo Regional Admin: Phải có region + warehouseId
 * - Regional Admin tạo Store Manager: Phải có storeId (trong vùng của mình)
 * - Store Manager tạo Staff: storeId tự động kế thừa, không cần truyền
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateUserRequest {

    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 100, message = "Username must be between 3 and 100 characters")
    private String username;

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    @NotBlank(message = "Full name is required")
    private String fullName;

    private String phoneNumber;

    private String avatarUrl;

    /**
     * Role IDs để gán cho user
     * Validate: Người tạo chỉ có thể gán role cấp dưới của mình
     */
    private Set<Long> roleIds;

    // ==================== SCOPE FIELDS ====================

    /**
     * Region cho Regional Admin
     * Bắt buộc khi tạo Regional Admin
     */
    private Region region;

    /**
     * Warehouse ID - Kho tổng vùng
     * Bắt buộc khi tạo Regional Admin
     */
    private Long warehouseId;

    /**
     * Store ID - Cửa hàng cụ thể
     * Bắt buộc khi tạo Store Manager
     * Optional khi tạo Staff (tự động kế thừa từ người tạo)
     */
    private Long storeId;
}
