package com.sba301.retailmanagement.enums;

public enum UserStatus {
    ACTIVE(1),
    INACTIVE(0),
    BLOCKED(-1);

    private final int value;

    UserStatus(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }

    public static UserStatus fromValue(int value) {
        for (UserStatus status : UserStatus.values()) {
            if (status.value == value) {
                return status;
            }
        }
        return INACTIVE;
    }
}
