package com.sba301.retailmanagement.enums;

/**
 * Enum định nghĩa các vùng miền trong hệ thống chuỗi bán lẻ
 */
public enum Region {
    NORTH("Miền Bắc"),
    CENTRAL("Miền Trung"),
    SOUTH("Miền Nam");

    private final String displayName;

    Region(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
